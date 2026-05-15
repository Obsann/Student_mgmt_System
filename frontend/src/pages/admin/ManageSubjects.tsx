import { useState } from "react";
import { BookOpen, Plus, Pencil, Trash2, Search, X } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import EmptyState from "../../components/EmptyState";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import Breadcrumb from "../../components/Breadcrumb";
import FormField from "../../components/FormField";
import Modal from "../../components/Modal";
import SearchInput from "../../components/SearchInput";
import type { Subject } from "../../types";

export default function ManageSubjects() {
  const { state, addSubject, updateSubject, deleteSubject } = useApp();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; subject: Subject | null }>({ open: false, subject: null });
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", code: "", grade: "9", teacher_id: "" });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const filtered = state.subjects.filter((s) =>
    `${s.name} ${s.code}`.toLowerCase().includes(search.toLowerCase())
  );

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = "Subject name is required";
    if (!form.code.trim()) errors.code = "Subject code is required";
    else if (!/^[A-Z]{2,6}$/.test(form.code)) errors.code = "Code should be 2-6 uppercase letters";
    if (!form.teacher_id) errors.teacher_id = "Teacher assignment is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const openAdd = () => {
    setEditId(null);
    setForm({ name: "", code: "", grade: "9", teacher_id: "" });
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (s: Subject) => {
    setEditId(s.id);
    setForm({ name: s.name, code: s.code, grade: s.grade, teacher_id: s.teacher_id });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      if (editId) await updateSubject(editId, form);
      else await addSubject(form);
      setModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (subject: Subject) => {
    setConfirmDelete({ open: true, subject });
  };

  const confirmDeleteSubject = () => {
    if (confirmDelete.subject) {
      deleteSubject(confirmDelete.subject.id);
      setConfirmDelete({ open: false, subject: null });
    }
  };

  const breadcrumbs = [
    { label: "Dashboard", href: "#dashboard" },
    { label: "Subjects", current: true },
  ];

  if (state.subjects.length === 0) {
    return (
      <div className="space-y-6">
        <Breadcrumb items={breadcrumbs} />
        <EmptyState
          icon={<BookOpen size={48} />}
          title="No Subjects Yet"
          description="Create subjects and assign them to teachers and grades."
          action={
            <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30">
              <Plus size={16} /> Add First Subject
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbs} />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1"><SearchInput value={search} onChange={setSearch} placeholder="Search subjects..." /></div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30">
          <Plus size={16} /> Add Subject
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Search size={48} />}
          title="No Subjects Found"
          description="Try adjusting your search criteria."
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all animate-fade-up">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="text-left py-3 px-4">Code</th>
                  <th className="text-left py-3 px-4">Subject Name</th>
                  <th className="text-left py-3 px-4">Grade</th>
                  <th className="text-left py-3 px-4">Teacher</th>
                  <th className="text-left py-3 px-4">Students</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => {
                  const teacher = state.teachers.find((t) => t.id === s.teacher_id);
                  const enrolled = state.enrollments.filter((e) => e.subject_id === s.id).length;
                  return (
                    <tr key={s.id} className="border-t border-slate-50 hover:bg-slate-50 transition-colors group">
                      <td className="py-3 px-4"><span className="font-mono text-xs text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg font-bold">{s.code}</span></td>
                      <td className="py-3 px-4 font-bold text-slate-900">{s.name}</td>
                      <td className="py-3 px-4 text-slate-600 font-medium">{s.grade}</td>
                      <td className="py-3 px-4 text-slate-500 text-xs font-semibold">{teacher?.name || "Unassigned"}</td>
                      <td className="py-3 px-4 text-slate-400 text-xs font-bold">{enrolled}</td>
                      <td className="py-3 px-4 text-right">
                        <button onClick={() => openEdit(s)} className="p-2 rounded-xl hover:bg-blue-50 text-blue-500 transition-colors"><Pencil size={14} /></button>
                        <button onClick={() => handleDelete(s)} className="p-2 rounded-xl hover:bg-red-50 text-red-500 ml-1 transition-colors"><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? "Edit Subject" : "Add New Subject"}>
        <div className="space-y-4">
          <FormField
            label="Subject Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={formErrors.name}
            helperText="e.g., Mathematics, English Language"
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="Code"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              error={formErrors.code}
              helperText="e.g., MATH, ENG"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Grade</label>
              <select
                value={form.grade}
                onChange={(e) => setForm({ ...form, grade: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
              >
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Assigned Teacher</label>
            <select
              value={form.teacher_id}
              onChange={(e) => setForm({ ...form, teacher_id: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-xl border bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 ${
                formErrors.teacher_id ? "border-red-300" : "border-gray-300"
              }`}
            >
              <option value="">-- Select Teacher --</option>
              {state.teachers.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            {formErrors.teacher_id && (
              <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                <X size={14} />
                {formErrors.teacher_id}
              </p>
            )}
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={() => setModalOpen(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50" disabled={loading}>
              Cancel
            </button>
            <button onClick={handleSave} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {editId ? "Update" : "Add Subject"}
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmationDialog
        open={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, subject: null })}
        onConfirm={confirmDeleteSubject}
        title="Delete Subject"
        description={`Are you sure you want to delete "${confirmDelete.subject?.name}"? This will remove all related marks and attendance records.`}
        confirmText="Delete Subject"
        type="danger"
      />
    </div>
  );
}
