import { useState } from 'react';
import { adminTeachers } from '../../data/adminMockData';

export default function AdminTeachers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = adminTeachers.filter(t => {
    const matchesSearch = `${t.firstName} ${t.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) || t.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'All' || t.department === selectedDept;
    const matchesStatus = selectedStatus === 'All' || t.status === selectedStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const selected = adminTeachers.find(t => t.id === selectedTeacher);
  const departments = Array.from(new Set(adminTeachers.map(t => t.department)));

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-xl mb-3">👩‍🏫</div>
          <p className="text-2xl font-bold text-gray-800">{adminTeachers.length}</p>
          <p className="text-sm text-gray-500">Total Teachers</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-xl mb-3">✅</div>
          <p className="text-2xl font-bold text-gray-800">{adminTeachers.filter(t => t.status === 'Active').length}</p>
          <p className="text-sm text-gray-500">Active</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-xl mb-3">🏖️</div>
          <p className="text-2xl font-bold text-gray-800">{adminTeachers.filter(t => t.status === 'On Leave').length}</p>
          <p className="text-sm text-gray-500">On Leave</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-xl mb-3">🏢</div>
          <p className="text-2xl font-bold text-gray-800">{departments.length}</p>
          <p className="text-sm text-gray-500">Departments</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Search</label>
            <div className="mt-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="text" placeholder="Search teachers..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Department</label>
            <select value={selectedDept} onChange={e => setSelectedDept(e.target.value)}
              className="mt-1 block w-40 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none">
              <option value="All">All Departments</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</label>
            <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}
              className="mt-1 block w-32 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none">
              <option value="All">All</option><option value="Active">Active</option><option value="On Leave">On Leave</option><option value="Inactive">Inactive</option>
            </select>
          </div>
          <button onClick={() => setShowAddModal(true)} className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium text-sm transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add Teacher
          </button>
        </div>
      </div>

      {/* Teacher Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(teacher => (
          <div key={teacher.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-amber-200 transition-all cursor-pointer group" onClick={() => setSelectedTeacher(teacher.id)}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${teacher.gender === 'Male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                  {teacher.firstName[0]}{teacher.lastName[0]}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 group-hover:text-amber-700 transition-colors">{teacher.firstName} {teacher.lastName}</h4>
                  <p className="text-xs text-gray-500">{teacher.id}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold ${
                teacher.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                teacher.status === 'On Leave' ? 'bg-amber-100 text-amber-700' :
                'bg-red-100 text-red-700'
              }`}>{teacher.status}</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-xs">🏢</span>
                <span>{teacher.department}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-xs">🎓</span>
                <span className="truncate">{teacher.qualification}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-xs">⏱️</span>
                <span>{teacher.experience} years experience</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {teacher.subjects.map(s => (
                  <span key={s} className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-[10px] font-medium">{s}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedTeacher(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="h-24 bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-2xl relative">
              <button onClick={() => setSelectedTeacher(null)} className="absolute top-3 right-3 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center text-white">✕</button>
            </div>
            <div className="px-6 pb-6 -mt-8">
              <div className={`w-16 h-16 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-xl font-bold ${selected.gender === 'Male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                {selected.firstName[0]}{selected.lastName[0]}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <h3 className="text-xl font-bold text-gray-800">{selected.firstName} {selected.lastName}</h3>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  selected.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                  selected.status === 'On Leave' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>{selected.status}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{selected.department} Department • {selected.qualification}</p>
              <div className="mt-4 space-y-2">
                {[['Teacher ID', selected.id], ['Email', selected.email], ['Phone', selected.phone], ['Gender', selected.gender], ['Experience', `${selected.experience} years`], ['Joined', selected.joinDate], ['Salary', selected.salary]].map(([l, v]) => (
                  <div key={l} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm text-gray-500">{l}</span>
                    <span className="text-sm font-medium text-gray-800">{v}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Subjects</p>
                <div className="flex flex-wrap gap-2">
                  {selected.subjects.map(s => <span key={s} className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-medium">{s}</span>)}
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <button className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-colors">Edit</button>
                <button className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium text-sm transition-colors">Deactivate</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Teacher Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-amber-100">
              <h3 className="text-lg font-bold text-gray-800">Add New Teacher</h3>
              <p className="text-sm text-gray-500">Fill in the teacher details below</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-gray-500 font-medium">First Name</label><input className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500" placeholder="First name" /></div>
                <div><label className="text-xs text-gray-500 font-medium">Last Name</label><input className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500" placeholder="Last name" /></div>
              </div>
              <div><label className="text-xs text-gray-500 font-medium">Email</label><input className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500" placeholder="email@example.com" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-gray-500 font-medium">Department</label><select className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500"><option>Natural Science</option><option>Social Science</option><option>Language</option><option>IT</option><option>Arts</option></select></div>
                <div><label className="text-xs text-gray-500 font-medium">Experience (years)</label><input type="number" className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500" placeholder="0" /></div>
              </div>
              <div><label className="text-xs text-gray-500 font-medium">Qualification</label><input className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500" placeholder="e.g., MSc Mathematics" /></div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium text-sm transition-colors">Save Teacher</button>
                <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
