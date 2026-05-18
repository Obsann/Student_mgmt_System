import { useState } from 'react';
import { students } from '../../data/mockData';

export default function AdminStudents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');
  const [selectedGender, setSelectedGender] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredStudents = students.filter(s => {
    const matchesSearch = `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === 'All' || s.grade === selectedGrade;
    const matchesSection = selectedSection === 'All' || s.section === selectedSection;
    const matchesGender = selectedGender === 'All' || s.gender === selectedGender;
    return matchesSearch && matchesGrade && matchesSection && matchesGender;
  });

  const selected = students.find(s => s.id === selectedStudent);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-xl mb-3">👨‍🎓</div>
          <p className="text-2xl font-bold text-gray-800">{students.length}</p>
          <p className="text-sm text-gray-500">Total Students</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-xl mb-3">👦</div>
          <p className="text-2xl font-bold text-gray-800">{students.filter(s => s.gender === 'Male').length}</p>
          <p className="text-sm text-gray-500">Male</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-xl mb-3">👧</div>
          <p className="text-2xl font-bold text-gray-800">{students.filter(s => s.gender === 'Female').length}</p>
          <p className="text-sm text-gray-500">Female</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-xl mb-3">📚</div>
          <p className="text-2xl font-bold text-gray-800">{new Set(students.map(s => `${s.grade}${s.section}`)).size}</p>
          <p className="text-sm text-gray-500">Sections</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Search</label>
            <div className="mt-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="text" placeholder="Search by name or ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</label>
            <select value={selectedGrade} onChange={e => setSelectedGrade(e.target.value)}
              className="mt-1 block w-28 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none">
              <option value="All">All</option><option value="9">Grade 9</option><option value="10">Grade 10</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Section</label>
            <select value={selectedSection} onChange={e => setSelectedSection(e.target.value)}
              className="mt-1 block w-28 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none">
              <option value="All">All</option><option value="A">A</option><option value="B">B</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</label>
            <select value={selectedGender} onChange={e => setSelectedGender(e.target.value)}
              className="mt-1 block w-28 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none">
              <option value="All">All</option><option value="Male">Male</option><option value="Female">Female</option>
            </select>
          </div>
          <button onClick={() => setShowAddModal(true)} className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium text-sm transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add Student
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Grade</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Gender</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Parent</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredStudents.map((student, index) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-sm text-gray-500">{index + 1}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${student.gender === 'Male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                        {student.firstName[0]}{student.lastName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{student.firstName} {student.lastName}</p>
                        <p className="text-xs text-gray-400">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm font-mono text-gray-600">{student.id}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${student.grade === '9' ? 'bg-emerald-50 text-emerald-700' : 'bg-purple-50 text-purple-700'}`}>
                      {student.grade}{student.section}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center text-sm text-gray-600">{student.gender}</td>
                  <td className="px-5 py-3 text-sm text-gray-600">{student.parentName}</td>
                  <td className="px-5 py-3 text-sm text-gray-600">{student.phone}</td>
                  <td className="px-5 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => setSelectedStudent(student.id)} className="px-2.5 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-medium hover:bg-amber-100 transition-colors">View</button>
                      <button className="px-2.5 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors">Edit</button>
                      <button className="px-2.5 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-amber-100">
              <h3 className="text-lg font-bold text-gray-800">Add New Student</h3>
              <p className="text-sm text-gray-500">Fill in the student details below</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 font-medium">First Name</label>
                  <input className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500" placeholder="First name" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium">Last Name</label>
                  <input className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500" placeholder="Last name" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 font-medium">Grade</label>
                  <select className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500">
                    <option>Grade 9</option><option>Grade 10</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium">Section</label>
                  <select className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500">
                    <option>A</option><option>B</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 font-medium">Gender</label>
                  <select className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500">
                    <option>Male</option><option>Female</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium">Age</label>
                  <input type="number" className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500" placeholder="Age" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium">Parent/Guardian Name</label>
                <input className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500" placeholder="Parent name" />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium">Phone</label>
                <input className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500" placeholder="+251 9XX XXX XXX" />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium">Address</label>
                <input className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500" placeholder="Address" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium text-sm transition-colors">Save Student</button>
                <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedStudent(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="h-20 bg-gradient-to-r from-amber-500 to-amber-600 rounded-t-2xl relative">
              <button onClick={() => setSelectedStudent(null)} className="absolute top-3 right-3 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center text-white">✕</button>
            </div>
            <div className="px-6 pb-6 -mt-8">
              <div className={`w-16 h-16 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-xl font-bold ${selected.gender === 'Male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                {selected.firstName[0]}{selected.lastName[0]}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mt-3">{selected.firstName} {selected.lastName}</h3>
              <p className="text-sm text-gray-500">Grade {selected.grade} Section {selected.section} • {selected.id}</p>
              <div className="mt-4 space-y-2">
                {[['Email', selected.email], ['Phone', selected.phone], ['Age', `${selected.age} years`], ['Gender', selected.gender], ['Parent', selected.parentName], ['Address', selected.address], ['Enrolled', selected.enrollmentDate]].map(([l, v]) => (
                  <div key={l} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm text-gray-500">{l}</span>
                    <span className="text-sm font-medium text-gray-800">{v}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-3">
                <button className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-colors">Edit Student</button>
                <button className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium text-sm transition-colors">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
