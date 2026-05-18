import { useState } from 'react';
import { students } from '../data/mockData';

export default function MyStudents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [selectedGender, setSelectedGender] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredStudents = students.filter(s => {
    const matchesSearch = `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === 'All' || s.grade === selectedGrade;
    const matchesGender = selectedGender === 'All' || s.gender === selectedGender;
    return matchesSearch && matchesGrade && matchesGender;
  });

  const selected = students.find(s => s.id === selectedStudent);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-xl mb-3">👨‍🎓</div>
          <p className="text-2xl font-bold text-gray-800">{students.length}</p>
          <p className="text-sm text-gray-500 mt-1">Total Students</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-xl mb-3">👦</div>
          <p className="text-2xl font-bold text-gray-800">{students.filter(s => s.gender === 'Male').length}</p>
          <p className="text-sm text-gray-500 mt-1">Male Students</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-xl mb-3">👧</div>
          <p className="text-2xl font-bold text-gray-800">{students.filter(s => s.gender === 'Female').length}</p>
          <p className="text-sm text-gray-500 mt-1">Female Students</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-xl mb-3">📚</div>
          <p className="text-2xl font-bold text-gray-800">{new Set(students.map(s => `${s.grade}${s.section}`)).size}</p>
          <p className="text-sm text-gray-500 mt-1">Sections</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Search Students</label>
            <div className="mt-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</label>
            <select
              value={selectedGrade}
              onChange={e => setSelectedGrade(e.target.value)}
              className="mt-1 block w-32 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            >
              <option value="All">All Grades</option>
              <option value="9">Grade 9</option>
              <option value="10">Grade 10</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</label>
            <select
              value={selectedGender}
              onChange={e => setSelectedGender(e.target.value)}
              className="mt-1 block w-32 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            >
              <option value="All">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500'}`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500'}`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Students Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredStudents.map(student => (
            <div
              key={student.id}
              onClick={() => setSelectedStudent(student.id)}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold ${
                  student.gender === 'Male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                }`}>
                  {student.firstName[0]}{student.lastName[0]}
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  student.grade === '9' ? 'bg-emerald-50 text-emerald-700' : 'bg-purple-50 text-purple-700'
                }`}>
                  Grade {student.grade}{student.section}
                </span>
              </div>
              <h4 className="font-bold text-gray-800 group-hover:text-emerald-700 transition-colors">
                {student.firstName} {student.lastName}
              </h4>
              <p className="text-sm text-gray-500 mt-1">{student.id}</p>
              <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-400">Age</p>
                  <p className="text-sm font-medium text-gray-700">{student.age}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Gender</p>
                  <p className="text-sm font-medium text-gray-700">{student.gender}</p>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xs text-gray-400">Parent</p>
                <p className="text-sm font-medium text-gray-700">{student.parentName}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
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
                  <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Age</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Parent</th>
                  <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredStudents.map((student, index) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-sm text-gray-500">{index + 1}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          student.gender === 'Male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                        }`}>
                          {student.firstName[0]}{student.lastName[0]}
                        </div>
                        <span className="text-sm font-medium text-gray-800">{student.firstName} {student.lastName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm font-mono text-gray-600">{student.id}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        student.grade === '9' ? 'bg-emerald-50 text-emerald-700' : 'bg-purple-50 text-purple-700'
                      }`}>
                        {student.grade}{student.section}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center text-sm text-gray-600">{student.gender}</td>
                    <td className="px-5 py-3 text-center text-sm text-gray-600">{student.age}</td>
                    <td className="px-5 py-3 text-sm text-gray-600">{student.parentName}</td>
                    <td className="px-5 py-3 text-center">
                      <button
                        onClick={() => setSelectedStudent(student.id)}
                        className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-100 transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredStudents.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-gray-500 font-medium">No students found</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Student Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedStudent(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="h-24 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-t-2xl relative">
              <button
                onClick={() => setSelectedStudent(null)}
                className="absolute top-3 right-3 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="px-6 pb-6 -mt-10">
              <div className={`w-20 h-20 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-2xl font-bold ${
                selected.gender === 'Male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
              }`}>
                {selected.firstName[0]}{selected.lastName[0]}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mt-3">{selected.firstName} {selected.lastName}</h3>
              <p className="text-sm text-gray-500">Grade {selected.grade} Section {selected.section}</p>

              <div className="mt-6 space-y-3">
                <DetailRow label="Student ID" value={selected.id} />
                <DetailRow label="Email" value={selected.email} />
                <DetailRow label="Age" value={`${selected.age} years`} />
                <DetailRow label="Gender" value={selected.gender} />
                <DetailRow label="Parent/Guardian" value={selected.parentName} />
                <DetailRow label="Phone" value={selected.phone} />
                <DetailRow label="Address" value={selected.address} />
                <DetailRow label="Enrollment Date" value={selected.enrollmentDate} />
              </div>

              <div className="mt-6 flex gap-3">
                <button className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-sm transition-colors">
                  View Attendance
                </button>
                <button className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-colors">
                  View Marks
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-800">{value}</span>
    </div>
  );
}
