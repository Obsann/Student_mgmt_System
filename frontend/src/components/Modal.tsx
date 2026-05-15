import React from "react";
import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
      <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-white/50" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 py-5 border-b border-slate-100 rounded-t-3xl z-10">
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"><X size={20} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
