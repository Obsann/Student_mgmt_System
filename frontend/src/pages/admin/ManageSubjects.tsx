import { useState } from "react";
import { BookOpen, Plus, Pencil, Search, X, Save, CheckCircle2, Building2, Clock } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import EmptyState from "../../components/EmptyState";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import FormField from "../../components/FormField";
import type { Subject } from "../../types";

export default function ManageSubjects() {
  const { state, addSubject, updateSubject, deleteSubject } = useApp();
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedGrade, setSelectedGrade] = useState("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; subject: Subject | null }>({ open: false, subject: null });
  const [loading, setLoading] = useState(false);
  const [viewSubject, setViewSubject] = useState<Subject | null>(null);

  const [form, setForm] = useState({ 
    name: "", 
    code: "", 
    grade: "9", 
    teacher_id: "",
    department: "Natural Science",
    periodsPerWeek: 4,
    description: "",
    sections: [] as string[]
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Filtering
  const filtered = state.subjects.filter((s) => {
    const matchesSearch = `${s.name} ${s.code}`.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === "All" || (s.department || "Natural Science") === selectedDept;
    const matchesGrade = selectedGrade === "All" || s.grade === selectedGrade;
    return matchesSearch && matchesDept && matchesGrade;
  });

  const departments = Array.from(new Set(state.subjects.map(s => s.department || "Natural Science")));

  const totalPeriods = state.subjects.reduce((sum, s) => sum + (s.periodsPerWeek || 4), 0);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = "Subject name is required";
    if (!form.code.trim()) errors.code = "Subject code is required";
    else if (!/^[A-Z0-9-]{2,10}$/.test(form.code)) errors.code = "Code should be uppercase letters/numbers";
    if (!form.teacher_id) errors.teacher_id = "Teacher assignment is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const openAdd = () => {
    setEditId(null);
    setForm({ 
      name: "", 
      code: "", 
      grade: "9", 
      teacher_id: "",
      department: "Natural Science",
      periodsPerWeek: 4,
      description: "",
      sections: []
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (s: Subject) => {
    setEditId(s.id);
    setForm({ 
      name: s.name, 
      code: s.code, 
      grade: s.grade, 
      teacher_id: s.teacher_id,
      department: s.department || "Natural Science",
      periodsPerWeek: s.periodsPerWeek || 4,
      description: s.description || "",
      sections: s.sections || []
    });
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 group hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform"><BookOpen className="w-6 h-6 text-purple-500" /></div>
          <p className="text-3xl font-black text-slate-900">{state.subjects.length}</p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Total Subjects</p>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 group hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform"><CheckCircle2 className="w-6 h-6 text-emerald-500" /></div>
          <p className="text-3xl font-black text-slate-900">{state.subjects.length}</p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Active</p>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 group hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform"><Building2 className="w-6 h-6 text-blue-500" /></div>
          <p className="text-3xl font-black text-slate-900">{departments.length || 1}</p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Departments</p>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 group hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform"><Clock className="w-6 h-6 text-amber-500" /></div>
          <p className="text-3xl font-black text-slate-900">{totalPeriods}</p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Weekly Periods</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[240px]">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Search</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search by name or code..." value={search} onChange={e => setSearch(e.target.value)}
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
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Grade</label>
            <select value={selectedGrade} onChange={e => setSelectedGrade(e.target.value)}
              className="block w-36 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all outline-none">
              <option value="All">All</option><option value="9">Grade 9</option><option value="10">Grade 10</option><option value="11">Grade 11</option><option value="12">Grade 12</option>
            </select>
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-amber-500/20 hover:-translate-y-0.5 h-[46px]">
            <Plus size={16} /> Add Subject
          </button>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState icon={<BookOpen size={48} />} title="No Subjects Found" description="Try adjusting your filter settings." />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Code</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</th>
                  <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Grade</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Teacher</th>
                  <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Weekly Periods</th>
                  <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(subject => {
                  const teacher = state.teachers.find((t) => t.id === subject.teacher_id);
                  return (
                    <tr key={subject.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4 font-mono text-sm font-bold text-indigo-600">{subject.code}</td>
                      <td className="px-6 py-4 font-extrabold text-slate-900">{subject.name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          (subject.department || 'Natural Science') === 'Natural Science' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                        }`}>{subject.department || 'Natural Science'}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600">Grade {subject.grade}</span>
                        {subject.sections && subject.sections.length > 0 && (
                          <div className="text-[10px] font-bold text-slate-400 mt-1 tracking-widest">{subject.sections.join(", ")}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-600">{teacher?.name || 'Unassigned'}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-2.5 py-1 bg-slate-50 rounded-lg text-xs font-bold text-slate-500">{subject.periodsPerWeek || 4} periods</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => setViewSubject(subject)} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors">View</button>
                          <button onClick={() => openEdit(subject)} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors">Edit</button>
                          <button onClick={() => handleDelete(subject)} className="px-3 py-1.5 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors">Del</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl animate-fade-scale flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-amber-50 to-orange-50/50">
              <h3 className="text-xl font-black text-slate-900">{editId ? "Edit Subject Record" : "Add New Subject"}</h3>
              <p className="text-sm font-medium text-slate-500 mt-1">Fill in the subject details below</p>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4">
              <FormField label="Subject Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={formErrors.name} required />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} error={formErrors.code} helperText="e.g., MATH, ENG" required />
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Grade</label>
                  <select value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none transition-all">
                    <option value="9">9</option><option value="10">10</option><option value="11">11</option><option value="12">12</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Assigned Teacher</label>
                <select value={form.teacher_id} onChange={(e) => setForm({ ...form, teacher_id: e.target.value })} className={`w-full px-4 py-2.5 rounded-xl border bg-slate-50 text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none transition-all ${formErrors.teacher_id ? "border-red-300" : "border-slate-100"}`}>
                  <option value="">-- Select Teacher --</option>
                  {state.teachers.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                {formErrors.teacher_id && (
                  <p className="text-sm text-red-600 flex items-center gap-1 mt-1"><X size={14} />{formErrors.teacher_id}</p>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Assigned Sections (Optional)</label>
                <div className="flex flex-wrap gap-2">
                  {["A", "B", "C", "D"].map(sec => (
                    <label key={sec} className={`cursor-pointer px-4 py-2 rounded-xl border text-sm font-bold transition-all ${form.sections.includes(sec) ? "bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"}`}>
                      <input 
                        type="checkbox" 
                        className="hidden"
                        checked={form.sections.includes(sec)}
                        onChange={(e) => {
                          const newSections = e.target.checked 
                            ? [...form.sections, sec] 
                            : form.sections.filter(s => s !== sec);
                          setForm({...form, sections: newSections});
                        }} 
                      />
                      Section {sec}
                    </label>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5">If no sections are selected, the teacher will be assigned to all sections in the grade by default.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Department</label>
                  <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none transition-all">
                    <option>Natural Science</option><option>Social Science</option><option>Language</option><option>IT</option><option>Arts</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Periods Per Week</label>
                  <input type="number" value={form.periodsPerWeek} onChange={(e) => setForm({ ...form, periodsPerWeek: Number(e.target.value) })} className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none transition-all" rows={3} placeholder="Subject description..." />
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
              <button onClick={() => setModalOpen(false)} className="flex-1 py-3 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all">
                Cancel
              </button>
              <button onClick={handleSave} disabled={loading} className="flex-1 py-3 rounded-2xl bg-amber-500 text-white font-bold hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                {editId ? "Update Record" : "Save Subject"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subject Detail Modal */}
      {viewSubject && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setViewSubject(null)}>
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl animate-fade-scale" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-900">{viewSubject.name}</h3>
                  <p className="text-sm font-bold text-slate-500">{viewSubject.code} • {viewSubject.department || 'Natural Science'}</p>
                </div>
                <button onClick={() => setViewSubject(null)} className="w-8 h-8 bg-slate-200/50 hover:bg-slate-200 rounded-xl flex items-center justify-center text-slate-600 transition-colors">✕</button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Description</p>
                <p className="text-sm font-medium text-slate-700 leading-relaxed">{viewSubject.description || 'No description available for this subject.'}</p>
              </div>
              
              <div className="space-y-2">
                {[
                  ['Grade Level', `Grade ${viewSubject.grade}`], 
                  ['Assigned Sections', viewSubject.sections && viewSubject.sections.length > 0 ? viewSubject.sections.join(', ') : 'All Sections'],
                  ['Assigned Teacher', state.teachers.find(t => t.id === viewSubject.teacher_id)?.name || 'Unassigned'], 
                  ['Periods Per Week', `${viewSubject.periodsPerWeek || 4} periods`]
                ].map(([l, v]) => (
                  <div key={l} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100/50">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{l}</span>
                    <span className="text-sm font-bold text-slate-900">{v}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => { setViewSubject(null); openEdit(viewSubject); }} className="flex-1 px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-2xl font-bold text-sm transition-colors flex items-center justify-center gap-2">
                  <Pencil size={16} /> Edit Subject
                </button>
                <button onClick={() => setViewSubject(null)} className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-colors">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

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
