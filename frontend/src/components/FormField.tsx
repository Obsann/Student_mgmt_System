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
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={fieldId} className="block text-sm font-bold text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative group">
        {leftIcon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
            {leftIcon}
          </div>
        )}

        <input
          {...props}
          id={fieldId}
          className={`
            w-full px-4 py-3 rounded-2xl border-2 bg-slate-50 transition-all outline-none font-medium
            ${leftIcon ? "pl-11" : ""}
            ${rightIcon ? "pr-11" : ""}
            ${hasError
              ? "border-red-300 focus:border-red-500 focus:bg-white bg-red-50/50"
              : hasSuccess
              ? "border-green-300 focus:border-green-500 focus:bg-white bg-green-50/50"
              : "border-slate-100 focus:border-indigo-500 focus:bg-white"
            }
            text-slate-900 placeholder-slate-400
          `}
        />

        {rightIcon && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            {rightIcon}
          </div>
        )}

        {hasError && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            <AlertCircle size={18} className="text-red-500" />
          </div>
        )}

        {hasSuccess && !rightIcon && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            <CheckCircle2 size={18} className="text-green-500" />
          </div>
        )}
      </div>

      {hasError && (
        <p className="text-sm text-red-600 font-semibold flex items-center gap-1.5">
          <AlertCircle size={14} />
          {error}
        </p>
      )}

      {hasSuccess && (
        <p className="text-sm text-green-600 font-semibold flex items-center gap-1.5">
          <CheckCircle2 size={14} />
          {success}
        </p>
      )}

      {helperText && !hasError && !hasSuccess && (
        <p className="text-xs text-slate-400 font-medium">{helperText}</p>
      )}
    </div>
  );
}