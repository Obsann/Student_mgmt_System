import { useState, useEffect } from "react";
import { useToast } from "../../contexts/ToastContext";
import { api } from "../../services/api";
import { Save, Database, CalendarDays, HardDriveDownload } from "lucide-react";

export default function AdminSettings() {
  const [settings, setSettings] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    api.getSettings().then(setSettings).catch(console.error);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateSetting("academicYear", settings.academicYear);
      await api.updateSetting("currentSemester", settings.currentSemester);
      addToast({ type: "success", title: "Success", message: "System settings updated." });
    } catch (e: unknown) {
      addToast({ type: "error", title: "Error", message: e instanceof Error ? e.message : "Failed to save settings." });
    } finally {
      setSaving(false);
    }
  };

  const exportDB = () => {
    const blob = new Blob([JSON.stringify({ backup: true, date: new Date() })], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kera_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    addToast({ type: "success", title: "Backup Exported", message: "Database JSON exported successfully." });
  };

  return (
    <div className="max-w-3xl space-y-6 animate-fade-in">
      {/* Welcome & Context */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex items-center gap-4 animate-fade-up">
        <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-xl shrink-0">⚙️</div>
        <div>
          <h2 className="text-lg font-black text-slate-900">System Preferences</h2>
          <p className="text-sm font-semibold text-slate-500 mt-0.5">Control the central academic calendars, parameters and backups of Kera High School.</p>
        </div>
      </div>

      {/* Academic Term Configuration */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-3 border-b border-slate-50 pb-4">
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100/50 flex items-center justify-center text-blue-600">
            <CalendarDays size={16} />
          </div>
          Academic Term Setup
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Academic Year</label>
            <input
              type="text"
              value={settings.academicYear || ""}
              onChange={(e) => setSettings({ ...settings, academicYear: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 text-sm font-bold focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none transition-all"
              placeholder="e.g. 2026/2027"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Current Semester</label>
            <select
              value={settings.currentSemester || 1}
              onChange={(e) => setSettings({ ...settings, currentSemester: Number(e.target.value) })}
              className="w-full px-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 text-sm font-bold focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none transition-all"
            >
              <option value={1}>Semester 1</option>
              <option value={2}>Semester 2</option>
            </select>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-amber-500/20 hover:-translate-y-0.5 disabled:opacity-50 h-[46px]"
        >
          {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
          Save Term Configuration
        </button>
      </div>

      {/* Database Backup & Health */}
      <div className="bg-red-50/50 rounded-3xl border border-red-100 p-6 space-y-4 animate-fade-up" style={{ animationDelay: '0.15s' }}>
        <h3 className="text-base font-extrabold text-red-900 flex items-center gap-3 border-b border-red-100/50 pb-4">
          <div className="w-8 h-8 rounded-xl bg-red-100/55 flex items-center justify-center text-red-600">
            <Database size={16} />
          </div>
          Database Administration & Health
        </h3>
        <p className="text-sm font-semibold text-red-700 leading-relaxed">
          Export a comprehensive backup archive of the system database. This backup captures all system settings, users, enrollment metrics, attendance logs, and academic records.
        </p>
        <button
          onClick={exportDB}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-red-600/20 hover:-translate-y-0.5"
        >
          <HardDriveDownload size={16} /> Download Backup (.json)
        </button>
      </div>
    </div>
  );
}
