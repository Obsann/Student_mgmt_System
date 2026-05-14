import { AlertTriangle } from "lucide-react";

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
  loading?: boolean;
}

export default function ConfirmationDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
  loading = false,
}: ConfirmationDialogProps) {
  if (!open) return null;

  const colors = {
    danger: {
      icon: "text-red-600",
      button: "bg-red-600 hover:bg-red-700 shadow-red-600/20 hover:shadow-red-600/30",
      border: "border-red-200",
      bg: "bg-red-50",
    },
    warning: {
      icon: "text-yellow-600",
      button: "bg-yellow-600 hover:bg-yellow-700 shadow-yellow-600/20 hover:shadow-yellow-600/30",
      border: "border-yellow-200",
      bg: "bg-yellow-50",
    },
    info: {
      icon: "text-blue-600",
      button: "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20 hover:shadow-blue-600/30",
      border: "border-blue-200",
      bg: "bg-blue-50",
    },
  };

  const color = colors[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
      <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md border border-white/50 animate-fade-scale" onClick={(e) => e.stopPropagation()}>
        <div className="p-8">
          <div className="flex items-center gap-4 mb-5">
            <div className={`p-3 rounded-2xl ${color.bg} ${color.border} border`}>
              <AlertTriangle size={24} className={color.icon} />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{title}</h3>
          </div>

          {description && (
            <p className="text-slate-600 mb-8 font-medium leading-relaxed">{description}</p>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-5 py-3 rounded-2xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`flex-1 px-5 py-3 rounded-2xl text-white font-bold transition-all shadow-lg disabled:opacity-50 ${color.button}`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}