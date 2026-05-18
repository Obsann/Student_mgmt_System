import { useState } from 'react';
import { subjects } from '../../data/adminMockData';

export default function AdminSubjects() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = subjects.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'All' || s.department === selectedDept;
    const matchesStatus = selectedStatus === 'All' || s.status === selectedStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const selected = subjects.find(s => s.id === selectedSubject);
  const departments = Array.from(new Set(subjects.map(s => s.department)));

  const totalPeriods = subjects.filter(s => s.status === 'Active').reduce((sum, s) => sum + s.periodsPerWeek, 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-xl mb-3">📚</div>
          <p className="text-2xl font-bold text-gray-800">{subjects.length}</p>
          <p className="text-sm text-gray-500">Total Subjects</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-xl mb-3">✅</div>
          <p className="text-2xl font-bold text-gray-800">{subjects.filter(s => s.status === 'Active').length}</p>
          <p className="text-sm text-gray-500">Active</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-xl mb-3">🏢</div>
          <p className="text-2xl font-bold text-gray-800">{departments.length}</p>
          <p className="text-sm text-gray-500">Departments</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-xl mb-3">⏱️</div>
          <p className="text-2xl font-bold text-gray-800">{totalPeriods}</p>
          <p className="text-sm text-gray-500">Weekly Periods</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Search</label>
            <div className="mt-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="text" placeholder="Search subjects..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Department</label>
            <select value={selectedDept} onChange={e => setSelectedDept(e.target.value)}
              className="mt-1 block w-40 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none">
              <option value="All">All</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</label>
            <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}
              className="mt-1 block w-32 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none">
              <option value="All">All</option><option value="Active">Active</option><option value="Inactive">Inactive</option>
            </select>
          </div>
          <button onClick={() => setShowAddModal(true)} className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium text-sm transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add Subject
          </button>
        </div>
      </div>

      {/* Subjects Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Grade</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Teacher(s)</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Periods/Week</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(subject => (
                <tr key={subject.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-sm font-mono text-gray-600">{subject.code}</td>
                  <td className="px-5 py-3">
                    <p className="text-sm font-medium text-gray-800">{subject.name}</p>
                    <p className="text-xs text-gray-400 line-clamp-1">{subject.description}</p>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      subject.department === 'Natural Science' ? 'bg-emerald-50 text-emerald-700' :
                      subject.department === 'Social Science' ? 'bg-blue-50 text-blue-700' :
                      subject.department === 'Language' ? 'bg-purple-50 text-purple-700' :
                      subject.department === 'IT' ? 'bg-amber-50 text-amber-700' :
                      'bg-pink-50 text-pink-700'
                    }`}>{subject.department}</span>
                  </td>
                  <td className="px-5 py-3 text-center text-sm text-gray-600">{subject.grade}</td>
                  <td className="px-5 py-3 text-sm text-gray-600 max-w-[200px] truncate">{subject.teacher}</td>
                  <td className="px-5 py-3 text-center">
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold">{subject.periodsPerWeek}</span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${subject.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {subject.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => setSelectedSubject(subject.id)} className="px-2.5 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-medium hover:bg-amber-100 transition-colors">View</button>
                      <button className="px-2.5 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors">Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedSubject(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-purple-100 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{selected.name}</h3>
                  <p className="text-sm text-gray-500">{selected.code} • {selected.department}</p>
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${selected.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{selected.status}</span>
              </div>
            </div>
            <div className="p-6 space-y-3">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Description</p>
                <p className="text-sm text-gray-700">{selected.description}</p>
              </div>
              {[['Grade Level', selected.grade], ['Assigned Teacher(s)', selected.teacher], ['Periods Per Week', `${selected.periodsPerWeek} periods`]].map(([l, v]) => (
                <div key={l} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-500">{l}</span>
                  <span className="text-sm font-medium text-gray-800">{v}</span>
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-colors">Edit Subject</button>
                <button onClick={() => setSelectedSubject(null)} className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Subject Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-amber-100 rounded-t-2xl">
              <h3 className="text-lg font-bold text-gray-800">Add New Subject</h3>
              <p className="text-sm text-gray-500">Fill in the subject details</p>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="text-xs text-gray-500 font-medium">Subject Name</label><input className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500" placeholder="Subject name" /></div>
              <div><label className="text-xs text-gray-500 font-medium">Code</label><input className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500" placeholder="e.g., MATH-102" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-gray-500 font-medium">Department</label><select className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500"><option>Natural Science</option><option>Social Science</option><option>Language</option><option>IT</option><option>Arts</option></select></div>
                <div><label className="text-xs text-gray-500 font-medium">Periods/Week</label><input type="number" className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500" placeholder="0" /></div>
              </div>
              <div><label className="text-xs text-gray-500 font-medium">Description</label><textarea className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500" rows={3} placeholder="Subject description..." /></div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium text-sm transition-colors">Save Subject</button>
                <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
