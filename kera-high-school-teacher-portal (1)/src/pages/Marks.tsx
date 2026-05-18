import { useState } from 'react';
import { students, markRecords } from '../data/mockData';

export default function Marks() {
  const [selectedGrade, setSelectedGrade] = useState('9');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [selectedExamType, setSelectedExamType] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMarks, setNewMarks] = useState<Record<string, string>>({});

  const filteredStudents = students.filter(s => s.grade === selectedGrade && s.section === selectedSection);
  
  const filteredMarks = markRecords.filter(m => {
    const student = students.find(s => s.id === m.studentId);
    if (!student) return false;
    const matchesGrade = student.grade === selectedGrade;
    const matchesSection = student.section === selectedSection;
    const matchesSubject = m.subject === selectedSubject;
    const matchesExam = selectedExamType === 'All' || m.examType === selectedExamType;
    return matchesGrade && matchesSection && matchesSubject && matchesExam;
  });

  // Calculate statistics
  const markPercentages = filteredMarks.map(m => (m.mark / m.totalMark) * 100);
  const avgMark = markPercentages.length > 0 ? Math.round(markPercentages.reduce((a, b) => a + b, 0) / markPercentages.length) : 0;
  const highestMark = markPercentages.length > 0 ? Math.round(Math.max(...markPercentages)) : 0;
  const lowestMark = markPercentages.length > 0 ? Math.round(Math.min(...markPercentages)) : 0;
  const passRate = markPercentages.length > 0 ? Math.round(markPercentages.filter(m => m >= 50).length / markPercentages.length * 100) : 0;

  const getGrade = (percentage: number): { grade: string; color: string } => {
    if (percentage >= 90) return { grade: 'A+', color: 'bg-emerald-100 text-emerald-700' };
    if (percentage >= 80) return { grade: 'A', color: 'bg-emerald-100 text-emerald-700' };
    if (percentage >= 75) return { grade: 'B+', color: 'bg-blue-100 text-blue-700' };
    if (percentage >= 70) return { grade: 'B', color: 'bg-blue-100 text-blue-700' };
    if (percentage >= 60) return { grade: 'C+', color: 'bg-amber-100 text-amber-700' };
    if (percentage >= 50) return { grade: 'C', color: 'bg-amber-100 text-amber-700' };
    if (percentage >= 40) return { grade: 'D', color: 'bg-orange-100 text-orange-700' };
    return { grade: 'F', color: 'bg-red-100 text-red-700' };
  };

  const handleAddMark = (studentId: string, value: string) => {
    setNewMarks(prev => ({ ...prev, [studentId]: value }));
  };

  const saveNewMarks = () => {
    setShowAddModal(false);
    setNewMarks({});
  };

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Class Average" value={`${avgMark}%`} icon="📊" color="emerald" />
        <StatCard label="Highest Mark" value={`${highestMark}%`} icon="🏆" color="blue" />
        <StatCard label="Lowest Mark" value={`${lowestMark}%`} icon="📉" color="amber" />
        <StatCard label="Pass Rate" value={`${passRate}%`} icon="✅" color="purple" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</label>
            <select
              value={selectedGrade}
              onChange={e => setSelectedGrade(e.target.value)}
              className="mt-1 block w-32 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            >
              <option value="9">Grade 9</option>
              <option value="10">Grade 10</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Section</label>
            <select
              value={selectedSection}
              onChange={e => setSelectedSection(e.target.value)}
              className="mt-1 block w-32 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</label>
            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className="mt-1 block w-40 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            >
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Exam Type</label>
            <select
              value={selectedExamType}
              onChange={e => setSelectedExamType(e.target.value)}
              className="mt-1 block w-36 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            >
              <option value="All">All Exams</option>
              <option value="Quiz">Quiz</option>
              <option value="Midterm">Midterm</option>
              <option value="Final">Final</option>
              <option value="Assignment">Assignment</option>
            </select>
          </div>
          <div className="flex-1"></div>
          <button
            onClick={() => setShowAddModal(!showAddModal)}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-sm transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Marks
          </button>
        </div>
      </div>

      {/* Add Marks Panel */}
      {showAddModal && (
        <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-emerald-800 text-lg">Add New Marks - {selectedSubject}</h3>
            <div className="flex gap-2">
              <button onClick={saveNewMarks} className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors">
                Save All Marks
              </button>
              <button onClick={() => setShowAddModal(false)} className="px-5 py-2 bg-white text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors border border-gray-200">
                Cancel
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredStudents.map(student => (
              <div key={student.id} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-emerald-100">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 text-xs font-bold flex-shrink-0">
                  {student.firstName[0]}{student.lastName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{student.firstName} {student.lastName}</p>
                </div>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0"
                  value={newMarks[student.id] || ''}
                  onChange={(e) => handleAddMark(student.id, e.target.value)}
                  className="w-16 px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-center outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-xs text-gray-400">/100</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Marks Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Student Marks</h3>
            <p className="text-sm text-gray-500">{selectedSubject} • Grade {selectedGrade}{selectedSection}</p>
          </div>
          <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold">
            {filteredMarks.length} Records
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Exam Type</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Mark</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Percentage</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Grade</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredMarks.map((mark, index) => {
                const student = students.find(s => s.id === mark.studentId);
                if (!student) return null;
                const percentage = Math.round((mark.mark / mark.totalMark) * 100);
                const { grade, color } = getGrade(percentage);
                return (
                  <tr key={`${mark.studentId}-${mark.examType}`} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-sm text-gray-500">{index + 1}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 text-xs font-bold">
                          {student.firstName[0]}{student.lastName[0]}
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-800">{student.firstName} {student.lastName}</span>
                          <p className="text-xs text-gray-400">{student.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                        mark.examType === 'Quiz' ? 'bg-blue-50 text-blue-700' :
                        mark.examType === 'Midterm' ? 'bg-purple-50 text-purple-700' :
                        mark.examType === 'Final' ? 'bg-red-50 text-red-700' :
                        'bg-amber-50 text-amber-700'
                      }`}>
                        {mark.examType}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center text-sm font-medium text-gray-800">
                      {mark.mark} / {mark.totalMark}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 rounded-full h-2 max-w-[80px]">
                          <div
                            className={`h-2 rounded-full ${percentage >= 50 ? 'bg-emerald-500' : 'bg-red-500'}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700 w-10 text-right">{percentage}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${color}`}>{grade}</span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                        percentage >= 50 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {percentage >= 50 ? 'Pass' : 'Fail'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredMarks.length === 0 && (
          <div className="p-12 text-center">
            <div className="text-4xl mb-3">📝</div>
            <p className="text-gray-500 font-medium">No marks found for the selected filters</p>
            <p className="text-gray-400 text-sm mt-1">Try changing the grade, section, subject, or exam type</p>
          </div>
        )}
      </div>

      {/* Grade Distribution */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-gray-800 text-lg mb-4">Grade Distribution</h3>
        <div className="flex items-end gap-2 h-40">
          {['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'].map(g => {
            const count = filteredMarks.filter(m => {
              const p = (m.mark / m.totalMark) * 100;
              const { grade } = getGrade(p);
              return grade === g;
            }).length;
            const maxCount = Math.max(...['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'].map(g =>
              filteredMarks.filter(m => {
                const p = (m.mark / m.totalMark) * 100;
                const { grade } = getGrade(p);
                return grade === g;
              }).length
            ), 1);
            const height = (count / maxCount) * 100;
            return (
              <div key={g} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-medium text-gray-600">{count}</span>
                <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '100px' }}>
                  <div
                    className={`absolute bottom-0 w-full rounded-t-lg transition-all ${
                      g.startsWith('A') ? 'bg-emerald-500' :
                      g.startsWith('B') ? 'bg-blue-500' :
                      g.startsWith('C') ? 'bg-amber-500' :
                      g === 'D' ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ height: `${height}%` }}
                  ></div>
                </div>
                <span className="text-xs font-semibold text-gray-600">{g}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
  const colorClasses: Record<string, string> = {
    emerald: 'bg-emerald-50',
    blue: 'bg-blue-50',
    amber: 'bg-amber-50',
    purple: 'bg-purple-50',
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 ${colorClasses[color] || 'bg-gray-50'} rounded-xl flex items-center justify-center text-xl`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
}
