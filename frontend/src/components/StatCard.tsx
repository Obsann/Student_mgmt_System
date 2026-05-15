import React from "react";

export default function StatCard({ icon, label, value, color, sub }: { icon: React.ReactNode; label: string; value: string | number; color: string; sub?: string }) {
  const colors: Record<string, string> = {
    blue: "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-500/30",
    green: "bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-emerald-500/30",
    purple: "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-indigo-500/30",
    orange: "bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-orange-500/30",
    red: "bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-rose-500/30",
    cyan: "bg-gradient-to-br from-cyan-400 to-cyan-500 text-white shadow-cyan-500/30",
  };
  return (
    <div className={`p-6 rounded-3xl shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ${colors[color] || colors.blue} animate-fade-scale relative overflow-hidden group`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold opacity-90">{label}</p>
          <p className="text-3xl font-black mt-1">{value}</p>
          {sub && <p className="text-[11px] font-medium opacity-80 mt-2 bg-black/10 inline-block px-2 py-1 rounded-lg">{sub}</p>}
        </div>
        <div className="opacity-80 p-3 bg-white/20 rounded-2xl backdrop-blur-sm group-hover:rotate-12 transition-transform duration-300">{icon}</div>
      </div>
    </div>
  );
}
