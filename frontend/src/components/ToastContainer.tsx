import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { useToast } from "../contexts/ToastContext";

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  const icons = {
    success: <CheckCircle size={20} />,
    error: <XCircle size={20} />,
    warning: <AlertTriangle size={20} />,
    info: <Info size={20} />,
  };

  const colors = {
    success: "bg-emerald-50 border-emerald-200 text-emerald-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  const iconBg = {
    success: "bg-emerald-100",
    error: "bg-red-100",
    warning: "bg-amber-100",
    info: "bg-blue-100",
  };

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`max-w-sm w-full p-4 rounded-2xl border shadow-xl backdrop-blur-md animate-slide-in ${colors[toast.type]}`}
        >
          <div className="flex items-start gap-3">
            <div className={`flex-shrink-0 mt-0.5 p-1.5 rounded-xl ${iconBg[toast.type]}`}>
              {icons[toast.type]}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-extrabold">{toast.title}</h4>
              {toast.message && (
                <p className="text-sm opacity-80 mt-0.5 font-medium">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 p-1.5 rounded-xl hover:bg-black/10 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}