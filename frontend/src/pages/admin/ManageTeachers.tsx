import { useState } from "react";
import { UserCheck, Plus, Pencil, Trash2, Search } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import EmptyState from "../../components/EmptyState";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import Breadcrumb from "../../components/Breadcrumb";
import FormField from "../../components/FormField";
import Modal from "../../components/Modal";
import SearchInput from "../../components/SearchInput";
import type { Teacher } from "../../types";

export default function ManageTeachers() {
  const { state, addTeacher, updateTeacher, deleteTeacher } = useApp();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; teacher: Teacher | null }>({ open: false, teacher: null });
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", qualification: "", assigned_grade: "9", assigned_section: "A" });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const filtered = state.teachers.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = "Full name is required";
    if (!form.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = "Invalid email format";
    if (!form.phone.trim()) errors.phone = "Phone number is required";
    if (!form.qualification.trim()) errors.qualification = "Qualification is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const openAdd = () => {
    setEditId(null);
    setForm({ name: "", email: "", phone: "", qualification: "", assigned_grade: "9", assigned_section: "A" });
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (t: Teacher) => {
    setEditId(t.id);
    setForm({ name: t.name, email: t.email, phone: t.phone, qualification: t.qualification, assigned_grade: t.assigned_grade || "9", assigned_section: t.assigned_section || "A" });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      if (editId) await updateTeacher(editId, form);
      else await addTeacher({ ...form, subjects: [] });
      setModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (teacher: Teacher) => {
    setConfirmDelete({ open: true, teacher });
  };

  const confirmDeleteTeacher = () => {
    if (confirmDelete.teacher) {
      deleteTeacher(confirmDelete.teacher.id);
      setConfirmDelete({ open: false, teacher: null });
    }
  };

  const breadcrumbs = [
    { label: "Dashboard", href: "#dashboard" },
    { label: "Teachers", current: true },
  ];

  if (state.teachers.length === 0) {
    return (
      <div className="space-y-6">
        <Breadcrumb items={breadcrumbs} />
        <EmptyState
          icon={<UserCheck size={48} />}
          title="No Teachers Yet"
          description="Add teachers to assign them subjects and manage academic activities."
          action={
            <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30">
              <Plus size={16} /> Add First Teacher
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
        <div className="flex-1"><SearchInput value={search} onChange={setSearch} placeholder="Search teachers..." /></div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700">
          <Plus size={16} /> Add Teacher
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Search size={48} />}
          title="No Teachers Found"
          description="Try adjusting your search criteria."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((t) => {
            const subjects = state.subjects.filter((s) => s.teacher_id === t.id);
            return (
              <div key={t.id} className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                      <div className="text-xs text-gray-400">{t.qualification}</div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500"><Pencil size={14} /></button>
                    <button onClick={() => handleDelete(t)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={14} /></button>
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-500 space-y-1">
                  <div className="flex items-center gap-1.5">{t.email}</div>
                  <div className="flex items-center gap-1.5">{t.phone}</div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {subjects.map((s) => (
                    <span key={s.id} className="px-2 py-0.5 rounded bg-purple-50 text-purple-600 text-[10px] font-medium">
                      {s.code} ({s.grade})
                    </span>
                  ))}
                  {subjects.length === 0 && <span className="text-xs text-gray-400">No subjects assigned</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? "Edit Teacher" : "Add New Teacher"}>
        <div className="space-y-4">
          <FormField
            label="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={formErrors.name}
            required
          />
          <FormField
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={formErrors.email}
            helperText="e.g., teacher@kera.edu.et"
            required
          />
          <FormField
            label="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            error={formErrors.phone}
            helperText="e.g., +251..."
            required
          />
          <FormField
            label="Qualification"
            value={form.qualification}
            onChange={(e) => setForm({ ...form, qualification: e.target.value })}
            error={formErrors.qualification}
            helperText="e.g., B.Ed., M.Sc."
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Assigned Grade</label>
              <select
                value={form.assigned_grade}
                onChange={(e) => setForm({ ...form, assigned_grade: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
              >
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Assigned Section</label>
              <select
                value={form.assigned_section}
                onChange={(e) => setForm({ ...form, assigned_section: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={() => setModalOpen(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50" disabled={loading}>
              Cancel
            </button>
            <button onClick={handleSave} disabled={loading} className="flex-1 py-3 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {editId ? "Update" : "Add Teacher"}
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmationDialog
        open={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, teacher: null })}
        onConfirm={confirmDeleteTeacher}
        title="Delete Teacher"
        description={`Are you sure you want to delete ${confirmDelete.teacher?.name}? This will also remove their subject assignments.`}
        confirmText="Delete Teacher"
        type="danger"
      />
    </div>
  );
}
