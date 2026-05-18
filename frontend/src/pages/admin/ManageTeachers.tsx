import { useState } from "react";
import { UserCheck, Plus, Pencil, Trash2, Search, Save } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import EmptyState from "../../components/EmptyState";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import FormField from "../../components/FormField";
import type { Teacher } from "../../types";

export default function ManageTeachers() {
  const { state, addTeacher, updateTeacher, deleteTeacher } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; teacher: Teacher | null }>({ open: false, teacher: null });
  const [loading, setLoading] = useState(false);
  const [viewTeacher, setViewTeacher] = useState<Teacher | null>(null);

  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    phone: "", 
    qualification: "", 
    assigned_grade: "9", 
    assigned_section: "A",
    department: "Natural Science",
    experience: 0,
    status: "Active" as "Active" | "On Leave" | "Inactive"
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const departments = Array.from(new Set(state.teachers.map(t => t.department || "General")));

  // Filtering
  const filtered = state.teachers.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === "All" || (t.department || "General") === selectedDept;
    const matchesStatus = selectedStatus === "All" || (t.status || "Active") === selectedStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

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
    setForm({ 
      name: "", 
      email: "", 
      phone: "", 
      qualification: "", 
      assigned_grade: "9", 
      assigned_section: "A",
      department: "Natural Science",
      experience: 0,
      status: "Active"
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (t: Teacher) => {
    setEditId(t.id);
    setForm({ 
      name: t.name, 
      email: t.email, 
      phone: t.phone, 
      qualification: t.qualification, 
      assigned_grade: t.assigned_grade || "9", 
      assigned_section: t.assigned_section || "A",
      department: t.department || "Natural Science",
      experience: t.experience || 0,
      status: (t.status || "Active") as any
    });
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 group hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">👩‍🏫</div>
          <p className="text-3xl font-black text-slate-900">{state.teachers.length}</p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Total Teachers</p>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 group hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">✅</div>
          <p className="text-3xl font-black text-slate-900">{state.teachers.filter(t => (t.status || 'Active') === 'Active').length}</p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Active</p>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 group hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">🏖️</div>
          <p className="text-3xl font-black text-slate-900">{state.teachers.filter(t => t.status === 'On Leave').length}</p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">On Leave</p>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 group hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">🏢</div>
          <p className="text-3xl font-black text-slate-900">{departments.length || 1}</p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Departments</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[240px]">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Search</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search by name or email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all outline-none" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Department</label>
            <select value={selectedDept} onChange={e => setSelectedDept(e.target.value)}
              className="block w-48 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all outline-none">
              <option value="All">All Departments</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Status</label>
            <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}
              className="block w-36 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all outline-none">
              <option value="All">All</option><option value="Active">Active</option><option value="On Leave">On Leave</option><option value="Inactive">Inactive</option>
            </select>
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-amber-500/20 hover:-translate-y-0.5 h-[46px]">
            <Plus size={16} /> Add Teacher
          </button>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState icon={<UserCheck size={48} />} title="No Teachers Found" description="Try adjusting your filter settings." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          {filtered.map(teacher => {
            const subjects = state.subjects.filter((s) => s.teacher_id === teacher.id);
            const initialLetter = teacher.name ? teacher.name.charAt(0).toUpperCase() : '?';
            return (
              <div key={teacher.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:shadow-md hover:border-amber-200 transition-all cursor-pointer group flex flex-col justify-between" onClick={() => setViewTeacher(teacher)}>
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100/50 flex items-center justify-center text-emerald-600 text-lg font-black shrink-0">
                        {initialLetter}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 group-hover:text-amber-600 transition-colors">{teacher.name}</h4>
                        <p className="text-[10px] font-mono text-slate-400 mt-0.5">{teacher.id}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      (teacher.status || 'Active') === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/50' :
                      teacher.status === 'On Leave' ? 'bg-amber-50 text-amber-600 border border-amber-100/50' :
                      'bg-red-50 text-red-600 border border-red-100/50'
                    }`}>{teacher.status || 'Active'}</span>
                  </div>
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                      <span className="w-5 text-center text-slate-400">🏢</span>
                      <span>{teacher.department || 'Natural Science'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                      <span className="w-5 text-center text-slate-400">🎓</span>
                      <span className="truncate">{teacher.qualification}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                      <span className="w-5 text-center text-slate-400">⏱️</span>
                      <span>{teacher.experience || 0} years experience</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1 max-w-[70%]">
                    {subjects.map(s => (
                      <span key={s.id} className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded text-[9px] font-bold uppercase tracking-wider">{s.code}</span>
                    ))}
                    {subjects.length === 0 && <span className="text-[10px] text-slate-400 font-medium">No subjects assigned</span>}
                  </div>
                  <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                    <button onClick={() => openEdit(teacher)} className="p-1.5 rounded-xl hover:bg-blue-50 text-blue-500 transition-colors"><Pencil size={14} /></button>
                    <button onClick={() => handleDelete(teacher)} className="p-1.5 rounded-xl hover:bg-red-50 text-red-500 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl animate-fade-scale flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-amber-50 to-orange-50/50">
              <h3 className="text-xl font-black text-slate-900">{editId ? "Edit Teacher Record" : "Add New Teacher"}</h3>
              <p className="text-sm font-medium text-slate-500 mt-1">Fill in the teacher details below</p>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4">
              <FormField label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={formErrors.name} required />
              <FormField label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={formErrors.email} helperText="e.g., teacher@kera.edu.et" required />
              <FormField label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} error={formErrors.phone} helperText="e.g., +251..." required />
              <FormField label="Qualification" value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} error={formErrors.qualification} helperText="e.g., B.Ed., M.Sc." required />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Department</label>
                  <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none transition-all">
                    <option>Natural Science</option><option>Social Science</option><option>Language</option><option>IT</option><option>Arts</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Experience (years)</label>
                  <input type="number" value={form.experience} onChange={(e) => setForm({ ...form, experience: Number(e.target.value) })} className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Assigned Grade</label>
                  <select value={form.assigned_grade} onChange={(e) => setForm({ ...form, assigned_grade: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none transition-all">
                    <option value="9">9</option><option value="10">10</option><option value="11">11</option><option value="12">12</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Assigned Section</label>
                  <select value={form.assigned_section} onChange={(e) => setForm({ ...form, assigned_section: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none transition-all">
                    <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })} className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none transition-all">
                    <option value="Active">Active</option><option value="On Leave">On Leave</option><option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
              <button onClick={() => setModalOpen(false)} className="flex-1 py-3 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all">
                Cancel
              </button>
              <button onClick={handleSave} disabled={loading} className="flex-1 py-3 rounded-2xl bg-amber-500 text-white font-bold hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                {editId ? "Update Record" : "Save Teacher"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Teacher Detail Modal */}
      {viewTeacher && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setViewTeacher(null)}>
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-scale" onClick={e => e.stopPropagation()}>
            <div className="h-24 bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-3xl relative">
              <button onClick={() => setViewTeacher(null)} className="absolute top-4 right-4 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white transition-colors">✕</button>
            </div>
            <div className="px-8 pb-8 -mt-10">
              <div className={`w-20 h-20 rounded-3xl border-4 border-white shadow-lg flex items-center justify-center text-3xl font-black bg-emerald-50 text-emerald-700`}>
                {viewTeacher.name ? viewTeacher.name.charAt(0).toUpperCase() : '?'}
              </div>
              <div className="mt-4 flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">{viewTeacher.name}</h3>
                  <p className="text-sm font-bold text-slate-500">{viewTeacher.department || 'Natural Science'} Department • ID: {viewTeacher.id}</p>
                </div>
                <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider border ${
                  (viewTeacher.status || 'Active') === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' : 
                  viewTeacher.status === 'On Leave' ? 'bg-amber-50 text-amber-600 border-amber-100/50' : 
                  'bg-red-50 text-red-600 border-red-100/50'
                }`}>
                  {viewTeacher.status || 'Active'}
                </span>
              </div>
              
              <div className="mt-6 space-y-2">
                {[
                  ['Email', viewTeacher.email], 
                  ['Phone', viewTeacher.phone], 
                  ['Qualification', viewTeacher.qualification], 
                  ['Experience', `${viewTeacher.experience || 0} years`], 
                  ['Assigned Class', `Grade ${viewTeacher.assigned_grade || '9'}-${viewTeacher.assigned_section || 'A'}`]
                ].map(([l, v]) => (
                  <div key={l} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100/50 hover:bg-slate-100/50 transition-colors">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{l}</span>
                    <span className="text-sm font-bold text-slate-900 text-right">{v}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Assigned Subjects</p>
                <div className="flex flex-wrap gap-2">
                  {state.subjects.filter(s => s.teacher_id === viewTeacher.id).map(s => (
                    <span key={s.id} className="px-3.5 py-2 bg-amber-50 text-amber-700 rounded-2xl text-xs font-bold border border-amber-100/50">{s.name} ({s.code})</span>
                  ))}
                  {state.subjects.filter(s => s.teacher_id === viewTeacher.id).length === 0 && (
                    <span className="text-sm font-bold text-slate-400 italic">No subjects assigned.</span>
                  )}
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button onClick={() => { setViewTeacher(null); openEdit(viewTeacher); }} className="flex-1 px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-2xl font-bold text-sm transition-colors flex items-center justify-center gap-2">
                  <Pencil size={16} /> Edit Teacher
                </button>
                <button onClick={() => { setViewTeacher(null); handleDelete(viewTeacher); }} className="flex-1 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-2xl font-bold text-sm transition-colors flex items-center justify-center gap-2">
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
