import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className = ""
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-up ${className}`}>
      {icon && (
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mb-6 shadow-sm">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-extrabold text-slate-900 mb-2 tracking-tight">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 max-w-sm mb-8 font-medium leading-relaxed">{description}</p>
      )}
      {action}
    </div>
  );
}