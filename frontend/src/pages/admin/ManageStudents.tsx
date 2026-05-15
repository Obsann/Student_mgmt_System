import { useState } from "react";
import { Users, BookOpen, Plus, Pencil, Trash2, Search } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import { useToast } from "../../contexts/ToastContext";
import { api } from "../../services/api";
import EmptyState from "../../components/EmptyState";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import Breadcrumb from "../../components/Breadcrumb";
import Pagination from "../../components/Pagination";
import FormField from "../../components/FormField";
import Modal from "../../components/Modal";
import SearchInput from "../../components/SearchInput";
import type { Student } from "../../types";

export default function ManageStudents() {
  const { state, addStudent, updateStudent, deleteStudent, loadAllData } = useApp();
  const { addToast } = useToast();
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; student: Student | null }>({ open: false, student: null });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [form, setForm] = useState({
    first_name: "", last_name: "", age: 15, gender: "Male" as "Male" | "Female",
    grade: "9", section: "A", roll_number: "", parent_phone: "", address: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [selectedClass, setSelectedClass] = useState<{ grade: string, section: string } | null>(null);

  const itemsPerPage = 10;
  
  // Get unique classes
  const classes = Array.from(new Set(state.students.map(s => `${s.grade}-${s.section}`)))
    .map(c => {
      const [grade, section] = c.split("-");
      return { grade, section };
    })
    .sort((a, b) => parseInt(a.grade) - parseInt(b.grade) || a.section.localeCompare(b.section));

  const filtered = selectedClass 
    ? state.students.filter((s) => s.grade === selectedClass.grade && s.section === selectedClass.section && `${s.first_name} ${s.last_name} ${s.roll_number}`.toLowerCase().includes(search.toLowerCase()))
    : [];

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedStudents = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!form.first_name.trim()) errors.first_name = "First name is required";
    if (!form.last_name.trim()) errors.last_name = "Last name is required";
    if (form.age < 10 || form.age > 25) errors.age = "Age must be between 10 and 25";
    if (!form.roll_number.trim()) errors.roll_number = "Roll number is required";
    if (!form.parent_phone.trim()) errors.parent_phone = "Parent phone is required";
    if (!form.address.trim()) errors.address = "Address is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const openAdd = () => {
    setEditId(null);
    setForm({ first_name: "", last_name: "", age: 15, gender: "Male", grade: "9", section: "A", roll_number: "", parent_phone: "", address: "" });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleBulkImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const text = evt.target?.result as string;
        const lines = text.split('\n').filter(l => l.trim().length > 0);
        // Assuming CSV: firstName,lastName,age,gender,grade,section,rollNumber,parentPhone,address
        const students = lines.slice(1).map(line => {
          const [first_name, last_name, age, gender, grade, section, roll_number, parent_phone, address] = line.split(',');
          return { first_name, last_name, age: Number(age), gender: gender.trim() as any, grade: grade.trim(), section: section.trim(), roll_number, parent_phone, address, enrolled_date: new Date().toISOString(), status: 'active' as const };
        });
        await api.bulkImportStudents(students);
        await loadAllData();
        addToast({ type: "success", title: "Success", message: "Bulk import completed." });
      } catch (err: unknown) {
        console.error(err);
        addToast({ type: "error", title: "Import Failed", message: err instanceof Error ? err.message : "Bulk import failed. Check CSV format." });
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // reset
  };

  const openEdit = (s: Student) => {
    setEditId(s.id);
    setForm({ first_name: s.first_name, last_name: s.last_name, age: s.age, gender: s.gender, grade: s.grade, section: s.section, roll_number: s.roll_number, parent_phone: s.parent_phone, address: s.address });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      if (editId) {
        await updateStudent(editId, form);
      } else {
        await addStudent({ ...form, enrolled_date: new Date().toISOString().split("T")[0] });
      }
      setModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (student: Student) => {
    setConfirmDelete({ open: true, student });
  };

  const confirmDeleteStudent = () => {
    if (confirmDelete.student) {
      deleteStudent(confirmDelete.student.id);
      setConfirmDelete({ open: false, student: null });
    }
  };

  const breadcrumbs = [
    { label: "Dashboard", href: "#dashboard" },
    { label: "Students", current: true },
  ];

  if (state.students.length === 0) {
    return (
      <div className="space-y-6">
        <Breadcrumb items={breadcrumbs} />
        <EmptyState
          icon={<Users size={48} />}
          title="No Students Yet"
          description="Get started by adding your first student to the system."
          action={
            <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30">
              <Plus size={16} /> Add First Student
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
        {selectedClass && (
          <button 
            onClick={() => { setSelectedClass(null); setSearch(""); }} 
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            &larr; Back to Classes
          </button>
        )}
        <div className="flex-1">
          {selectedClass && (
            <SearchInput value={search} onChange={setSearch} placeholder={`Search in Grade ${selectedClass.grade}${selectedClass.section}...`} />
          )}
        </div>
        <div className="flex gap-2">
          <label className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 font-bold rounded-xl cursor-pointer hover:bg-indigo-100 transition-colors">
            <BookOpen size={16} /> Bulk Import CSV
            <input type="file" accept=".csv" className="hidden" onChange={handleBulkImport} />
          </label>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors">
            <Plus size={16} /> Add Student
          </button>
        </div>
      </div>

      {!selectedClass ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {classes.map((c) => {
            const count = state.students.filter(s => s.grade === c.grade && s.section === c.section).length;
            return (
              <div 
                key={`${c.grade}-${c.section}`} 
                onClick={() => setSelectedClass(c)}
                className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:-translate-y-1 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users size={24} />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-gray-50 text-gray-500 text-xs font-bold border border-gray-100">
                    {count} Students
                  </span>
                </div>
                <h3 className="text-xl font-black text-gray-900">Grade {c.grade}</h3>
                <p className="text-sm font-medium text-gray-500 mt-1">Section {c.section}</p>
              </div>
            );
          })}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Search size={48} />}
          title="No Students Found"
          description="Try adjusting your search or filter criteria."
        />
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs">
                    <th className="text-left py-3 px-4">Roll #</th>
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4 hidden sm:table-cell">Gender</th>
                    <th className="text-left py-3 px-4">Grade</th>
                    <th className="text-left py-3 px-4 hidden md:table-cell">Age</th>
                    <th className="text-left py-3 px-4 hidden lg:table-cell">Parent Phone</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStudents.map((s) => (
                    <tr key={s.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-2.5 px-4 font-mono text-xs text-gray-500">{s.roll_number}</td>
                      <td className="py-2.5 px-4 font-medium text-gray-900">{s.first_name} {s.last_name}</td>
                      <td className="py-2.5 px-4 hidden sm:table-cell">
                        <span className={`px-2 py-0.5 rounded text-xs ${s.gender === "Male" ? "bg-blue-50 text-blue-600" : "bg-pink-50 text-pink-600"}`}>{s.gender}</span>
                      </td>
                      <td className="py-2.5 px-4 text-gray-600">{s.grade}{s.section}</td>
                      <td className="py-2.5 px-4 text-gray-600 hidden md:table-cell">{s.age}</td>
                      <td className="py-2.5 px-4 text-gray-500 font-mono text-xs hidden lg:table-cell">{s.parent_phone}</td>
                      <td className="py-2.5 px-4 text-right">
                        <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500"><Pencil size={14} /></button>
                        <button onClick={() => handleDelete(s)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 ml-1"><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                showInfo={true}
                totalItems={filtered.length}
                itemsPerPage={itemsPerPage}
              />
            </div>
          </div>
        </>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? "Edit Student" : "Add New Student"}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="First Name"
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              error={formErrors.first_name}
              required
            />
            <FormField
              label="Last Name"
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              error={formErrors.last_name}
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <FormField
              label="Age"
              type="number"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
              error={formErrors.age}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value as "Male" | "Female" })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
              >
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Section</label>
              <select
                value={form.section}
                onChange={(e) => setForm({ ...form, section: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
              >
                <option>A</option>
                <option>B</option>
                <option>C</option>
              </select>
            </div>
            <FormField
              label="Roll Number"
              value={form.roll_number}
              onChange={(e) => setForm({ ...form, roll_number: e.target.value })}
              error={formErrors.roll_number}
              helperText="e.g., KR/9/A/001"
              required
            />
          </div>
          <FormField
            label="Parent Phone"
            value={form.parent_phone}
            onChange={(e) => setForm({ ...form, parent_phone: e.target.value })}
            error={formErrors.parent_phone}
            helperText="e.g., +251..."
            required
          />
          <FormField
            label="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            error={formErrors.address}
            required
          />
          <div className="flex gap-2 pt-2">
            <button onClick={() => setModalOpen(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50" disabled={loading}>
              Cancel
            </button>
            <button onClick={handleSave} disabled={loading} className="flex-1 py-3 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {editId ? "Update" : "Add Student"}
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmationDialog
        open={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, student: null })}
        onConfirm={confirmDeleteStudent}
        title="Delete Student"
        description={`Are you sure you want to delete ${confirmDelete.student?.first_name} ${confirmDelete.student?.last_name}? This action cannot be undone.`}
        confirmText="Delete Student"
        type="danger"
      />
    </div>
  );
}
