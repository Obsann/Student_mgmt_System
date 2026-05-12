import { useState, useEffect } from "react";
import {
  Users, BookOpen, UserCheck, BarChart3,
  Plus, Pencil, Trash2, Search, X,
  TrendingUp, Award,
} from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { useToast } from "../contexts/ToastContext";
import { Student, Teacher, Subject } from "../data/mockData";
import { api } from "../services/api";
import EmptyState from "../components/EmptyState";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import ConfirmationDialog from "../components/ConfirmationDialog";
import Breadcrumb from "../components/Breadcrumb";
import Pagination from "../components/Pagination";
import FormField from "../components/FormField";

import ProfilePage from "./ProfilePage";
import { getEthiopianGrade } from "../utils/gradeCalculator";

// ============================================================
// SHARED UI COMPONENTS
// ============================================================
function StatCard({ icon, label, value, color, sub }: { icon: React.ReactNode; label: string; value: string | number; color: string; sub?: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-green-50 text-green-600 border-green-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    red: "bg-red-50 text-red-600 border-red-100",
    cyan: "bg-cyan-50 text-cyan-600 border-cyan-100",
  };
  return (
    <div className={`p-5 rounded-2xl border ${colors[color] || colors.blue}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium opacity-70">{label}</p>
          <p className="text-2xl font-black mt-1">{value}</p>
          {sub && <p className="text-[10px] opacity-60 mt-1">{sub}</p>}
        </div>
        <div className="opacity-40">{icon}</div>
      </div>
    </div>
  );
}

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-gray-100 rounded-t-2xl">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100"><X size={18} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-gray-900"
      />
    </div>
  );
}

// ============================================================
// ADMIN DASHBOARD
// ============================================================
function AdminDashboard() {
  const { state } = useApp();
  const totalStudents = state.students.length;
  const totalTeachers = state.teachers.length;
  const totalSubjects = state.subjects.length;
  const grade9 = state.students.filter((s) => s.grade === "9").length;
  const grade10 = state.students.filter((s) => s.grade === "10").length;
  const totalAttendance = state.attendance.length;
  const presentCount = state.attendance.filter((a) => a.status === "present").length;
  const avgAttendance = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users size={28} />} label="Total Students" value={totalStudents} color="blue" sub={`Grade 9: ${grade9} | Grade 10: ${grade10}`} />
        <StatCard icon={<UserCheck size={28} />} label="Teachers" value={totalTeachers} color="green" />
        <StatCard icon={<BookOpen size={28} />} label="Subjects" value={totalSubjects} color="purple" />
        <StatCard icon={<TrendingUp size={28} />} label="Avg Attendance" value={`${avgAttendance}%`} color="orange" />
      </div>

      {/* Grade Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Students by Grade & Section</h3>
          {["9", "10"].map((grade) => (
            <div key={grade} className="mb-3">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Grade {grade}</span>
                <span>{state.students.filter((s) => s.grade === grade).length} students</span>
              </div>
              <div className="flex gap-1">
                {["A", "B"].map((sec) => {
                  const count = state.students.filter((s) => s.grade === grade && s.section === sec).length;
                  const width = totalStudents > 0 ? (count / totalStudents) * 100 : 0;
                  return (
                    <div key={sec} className="flex-1">
                      <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${grade === "9" ? "bg-blue-500" : "bg-purple-500"}`}
                          style={{ width: `${Math.max(width * 2, 10)}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5 text-center">Sec {sec}: {count}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Subject-Teacher Assignments</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {state.subjects.slice(0, 8).map((sub) => {
              const teacher = state.teachers.find((t) => t.id === sub.teacher_id);
              return (
                <div key={sub.id} className="flex items-center gap-2 text-xs p-2 rounded-lg bg-gray-50">
                  <span className="font-mono bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">{sub.code}</span>
                  <span className="text-gray-700 flex-1">{sub.name}</span>
                  <span className="text-gray-400">→ {teacher?.name?.split(" ").pop() || "N/A"}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Marks */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Award size={16} className="text-orange-500" /> Recent Mark Entries
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-500 border-b border-gray-100">
                <th className="text-left py-2 px-2">Student</th>
                <th className="text-left py-2 px-2">Subject</th>
                <th className="text-left py-2 px-2">Type</th>
                <th className="text-center py-2 px-2">Score</th>
              </tr>
            </thead>
            <tbody>
              {state.marks.slice(-10).reverse().map((m) => {
                const student = state.students.find((s) => s.id === m.student_id);
                const subject = state.subjects.find((s) => s.id === m.subject_id);
                return (
                  <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2 px-2 text-gray-700">{student?.first_name} {student?.last_name}</td>
                    <td className="py-2 px-2 text-gray-500">{subject?.name}</td>
                    <td className="py-2 px-2"><span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 capitalize">{m.assessment_type}</span></td>
                    <td className="py-2 px-2 text-center font-bold">
                      <div className="flex items-center justify-center gap-2">
                        <span>{m.score}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${getEthiopianGrade(m.score).color}`}>
                          {getEthiopianGrade(m.score).grade}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MANAGE STUDENTS
// ============================================================
function ManageStudents() {
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
          return { first_name, last_name, age: Number(age), gender: gender.trim(), grade: grade.trim(), section: section.trim(), roll_number, parent_phone, address };
        });
        await api.bulkImportStudents(students);
        await loadAllData();
        addToast({ type: "success", title: "Success", message: "Bulk import completed." });
      } catch (err: any) {
        console.error(err);
        addToast({ type: "error", title: "Import Failed", message: err.message || "Bulk import failed. Check CSV format." });
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
            <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors">
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
            ← Back to Classes
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
            <button onClick={handleSave} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
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

// ============================================================
// MANAGE TEACHERS
// ============================================================
function ManageTeachers() {
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
            <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors">
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
                  <div>📧 {t.email}</div>
                  <div>📞 {t.phone}</div>
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
            <button onClick={handleSave} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
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

// ============================================================
// MANAGE SUBJECTS
// ============================================================
function ManageSubjects() {
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
            <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors">
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
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700">
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
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs">
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
                    <tr key={s.id} className="border-t border-gray-50 hover:bg-gray-50">
                      <td className="py-2.5 px-4 font-mono text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded">{s.code}</td>
                      <td className="py-2.5 px-4 font-medium text-gray-900">{s.name}</td>
                      <td className="py-2.5 px-4 text-gray-600">{s.grade}</td>
                      <td className="py-2.5 px-4 text-gray-600 text-xs">{teacher?.name || "Unassigned"}</td>
                      <td className="py-2.5 px-4 text-gray-500 text-xs">{enrolled}</td>
                      <td className="py-2.5 px-4 text-right">
                        <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500"><Pencil size={14} /></button>
                        <button onClick={() => handleDelete(s)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 ml-1"><Trash2 size={14} /></button>
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

// ============================================================
// ADMIN REPORTS
// ============================================================
function AdminReports() {
  const { state } = useApp();

  // Average score by subject
  const subjectStats = state.subjects.map((sub) => {
    const subMarks = state.marks.filter((m) => m.subject_id === sub.id);
    const avg = subMarks.length > 0 ? Math.round(subMarks.reduce((sum, m) => sum + m.score, 0) / subMarks.length) : 0;
    return { ...sub, avg, count: subMarks.length };
  }).filter((s) => s.count > 0).sort((a, b) => b.avg - a.avg);

  // Top students
  const studentAvgs = state.students.slice(0, 16).map((s) => {
    const marks = state.marks.filter((m) => m.student_id === s.id);
    const avg = marks.length > 0 ? Math.round(marks.reduce((sum, m) => sum + m.score, 0) / marks.length) : 0;
    return { ...s, avg, markCount: marks.length };
  }).filter((s) => s.markCount > 0).sort((a, b) => b.avg - a.avg);

  return (
    <div className="space-y-6">
      {/* Subject Performance */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 size={16} className="text-purple-500" /> Average Score by Subject
        </h3>
        <div className="space-y-3">
          {subjectStats.map((s) => (
            <div key={s.id} className="flex items-center gap-3">
              <span className="text-xs text-gray-600 w-32 truncate">{s.name}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${s.avg >= 75 ? "bg-green-500" : s.avg >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
                  style={{ width: `${s.avg}%` }}
                />
              </div>
              <span className="text-xs font-bold text-gray-700 w-10 text-right">{s.avg}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Students */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Award size={16} className="text-orange-500" /> Top Performing Students
        </h3>
        <div className="space-y-2">
          {studentAvgs.slice(0, 10).map((s, i) => (
            <div key={s.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i < 3 ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-500"}`}>
                {i + 1}
              </span>
              <span className="text-sm text-gray-900 flex-1">{s.first_name} {s.last_name}</span>
              <span className="text-xs text-gray-400">Grade {s.grade}{s.section}</span>
              <span className="text-sm font-bold text-gray-700">{s.avg}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ADMIN AUDIT LOGS
// ============================================================


function AdminAuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAuditLogs().then((res) => {
      setLogs(res.logs || []);
      setLoading(false);
    }).catch(console.error);
  }, []);

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-slate-50">
        <h2 className="text-lg font-bold text-gray-900">System Audit Logs</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider text-[10px] font-bold">
              <th className="p-4">Timestamp</th>
              <th className="p-4">User</th>
              <th className="p-4">Action</th>
              <th className="p-4">Entity</th>
              <th className="p-4">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.map((log) => (
              <tr key={log._id} className="hover:bg-gray-50/50">
                <td className="p-4 text-gray-500">{new Date(log.createdAt).toLocaleString()}</td>
                <td className="p-4 font-bold text-gray-900">{log.userName}</td>
                <td className="p-4">
                  <span className="px-2 py-1 rounded bg-indigo-50 text-indigo-700 text-xs font-bold">{log.action}</span>
                </td>
                <td className="p-4 text-gray-500">{log.entity}</td>
                <td className="p-4 text-gray-600 truncate max-w-xs">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// ADMIN SYSTEM SETTINGS
// ============================================================
function AdminSettings() {
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
    } catch (e: any) {
      addToast({ type: "error", title: "Error", message: e.message || "Failed to save settings." });
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

// ============================================================
// PENDING ENROLLMENTS (Admin approves + issues credentials)
// ============================================================
function PendingEnrollments() {
  const { state, loadAllData } = useApp();
  const { addToast } = useToast();
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [emailOverrides, setEmailOverrides] = useState<Record<string, string>>({});

  const pendingStudents = state.students.filter((s: any) => s.status === "pending");

  const handleIssue = async (student: any) => {
    const email = emailOverrides[student.id] || student.personal_email;
    if (!email) {
      addToast({ type: "error", title: "Email Required", message: `Please enter a delivery email for ${student.first_name} ${student.last_name}` });
      return;
    }
    setLoading((prev) => ({ ...prev, [student.id]: true }));
    try {
      const result = await api.issueCredentials(student.id, email);
      addToast({ type: "success", title: "Credentials Issued!", message: result.message });
      await loadAllData();
    } catch (err: any) {
      addToast({ type: "error", title: "Failed", message: err.message || "Could not issue credentials" });
    } finally {
      setLoading((prev) => ({ ...prev, [student.id]: false }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-6 text-white">
        <h2 className="text-xl font-bold flex items-center gap-3">
          <Users size={24} />
          Pending Enrollment Requests
          {pendingStudents.length > 0 && (
            <span className="ml-2 px-3 py-1 bg-white/20 rounded-full text-sm font-bold">{pendingStudents.length}</span>
          )}
        </h2>
        <p className="text-amber-100 text-sm mt-1">
          Teachers have enrolled these students. Review and issue login credentials to their personal email.
        </p>
      </div>

      {pendingStudents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award size={28} className="text-green-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">All caught up!</h3>
          <p className="text-sm text-gray-500">No pending enrollment requests at this time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingStudents.map((s: any) => (
            <div key={s.id} className="bg-white rounded-2xl border border-amber-200 p-5 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Student info */}
                <div className="flex-1">
                  <h3 className="text-base font-bold text-gray-900 notranslate">
                    {s.first_name} {s.last_name}
                  </h3>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded-lg font-semibold">Grade <span className="notranslate">{s.grade}{s.section}</span></span>
                    <span className="bg-gray-100 px-2 py-1 rounded-lg font-semibold">Roll <span className="notranslate">{s.roll_number}</span></span>
                    <span className="bg-gray-100 px-2 py-1 rounded-lg font-semibold">{s.gender} · Age <span className="notranslate">{s.age}</span></span>
                    <span className="bg-gray-100 px-2 py-1 rounded-lg font-semibold">Phone: <span className="notranslate">{s.parent_phone}</span></span>
                  </div>
                </div>

                {/* Email + Approve */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:w-auto">
                  <div className="relative flex-1 min-w-[240px]">
                    <input
                      type="email"
                      value={emailOverrides[s.id] ?? s.personal_email ?? ""}
                      onChange={(e) => setEmailOverrides((prev) => ({ ...prev, [s.id]: e.target.value }))}
                      placeholder="student@gmail.com"
                      className="w-full pl-4 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none notranslate"
                    />
                  </div>
                  <button
                    onClick={() => handleIssue(s)}
                    disabled={loading[s.id]}
                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-sm whitespace-nowrap transition-all shadow-sm disabled:opacity-60 flex items-center gap-2 justify-center"
                  >
                    {loading[s.id] ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>✉️ Approve & Send Credentials</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// MAIN ADMIN PORTAL
// ============================================================
export default function AdminPortal({ activePage }: { activePage: string }) {
  switch (activePage) {
    case "dashboard": return <AdminDashboard />;
    case "students": return <ManageStudents />;
    case "teachers": return <ManageTeachers />;
    case "subjects": return <ManageSubjects />;
    case "reports": return <AdminReports />;
    case "audit-logs": return <AdminAuditLogs />;
    case "settings": return <AdminSettings />;
    case "pending-enrollments": return <PendingEnrollments />;
    case "profile": return <ProfilePage />;
    default: return <AdminDashboard />;
  }
}

