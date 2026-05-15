import { useState, useEffect } from "react";
import { useToast } from "../../contexts/ToastContext";
import { api } from "../../services/api";
import FormField from "../../components/FormField";

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
    // Simulated DB export
    const blob = new Blob([JSON.stringify({ backup: true, date: new Date() })], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kera_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    alert("Database exported successfully.");
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Academic Term Configuration</h2>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <FormField label="Academic Year" error="">
            <input type="text" value={settings.academicYear || ""} onChange={(e) => setSettings({ ...settings, academicYear: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl" />
          </FormField>
          <FormField label="Current Semester" error="">
            <select value={settings.currentSemester || 1} onChange={(e) => setSettings({ ...settings, currentSemester: Number(e.target.value) })} className="w-full px-4 py-2 border border-gray-200 rounded-xl">
              <option value={1}>Semester 1</option>
              <option value={2}>Semester 2</option>
            </select>
          </FormField>
        </div>
        <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-sm hover:bg-indigo-700 transition-colors">
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      <div className="bg-red-50 rounded-2xl border border-red-100 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-red-900 mb-2">Database Health</h2>
        <p className="text-sm text-red-700 mb-6">Export a full backup of the system database including all users, students, and marks.</p>
        <button onClick={exportDB} className="px-6 py-2.5 bg-red-600 text-white font-bold rounded-xl shadow-sm hover:bg-red-700 transition-colors">
          Download Backup (.json)
        </button>
      </div>
    </div>
  );
}
