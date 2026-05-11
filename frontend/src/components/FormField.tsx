import { ReactNode, InputHTMLAttributes } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface FormFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  label?: string;
  error?: string;
  success?: string;
  required?: boolean;
  helperText?: string;
  className?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export default function FormField({
  label,
  error,
  success,
  required,
  helperText,
  className = "",
  leftIcon,
  rightIcon,
  id,
  ...props
}: FormFieldProps) {
  const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = !!error;
  const hasSuccess = !!success && !hasError;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}

        <input
          {...props}
          id={fieldId}
          className={`
            w-full px-4 py-2.5 rounded-xl border bg-white transition-all outline-none
            ${leftIcon ? "pl-10" : ""}
            ${rightIcon ? "pr-10" : ""}
            ${hasError
              ? "border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              : hasSuccess
              ? "border-green-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            }
            text-gray-900 placeholder-gray-400
          `}
        />

        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}

        {hasError && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <AlertCircle size={18} className="text-red-500" />
          </div>
        )}

        {hasSuccess && !rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <CheckCircle2 size={18} className="text-green-500" />
          </div>
        )}
      </div>

      {hasError && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle size={14} />
          {error}
        </p>
      )}

      {hasSuccess && (
        <p className="text-sm text-green-600 flex items-center gap-1">
          <CheckCircle2 size={14} />
          {success}
        </p>
      )}

      {helperText && !hasError && !hasSuccess && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}