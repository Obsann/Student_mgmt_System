import { Search } from "lucide-react";

export default function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative group">
      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 border-slate-100 bg-slate-50 text-sm font-medium focus:border-indigo-500 focus:bg-white outline-none text-slate-900 placeholder-slate-400 transition-all"
      />
    </div>
  );
}
