import { useState } from 'react';
import { students, attendanceRecords } from '../data/mockData';

export default function Attendance() {
  const [selectedDate, setSelectedDate] = useState('2025-01-17');
  const [selectedGrade, setSelectedGrade] = useState('9');
  const [selectedSection, setSelectedSection] = useState('A');
  const [attendanceState, setAttendanceState] = useState<Record<string, 'Present' | 'Absent' | 'Late' | 'Excused'>>(() => {
    const state: Record<string, 'Present' | 'Absent' | 'Late' | 'Excused'> = {};
    const filteredStudents = getFilteredStudents('9', 'A');
    filteredStudents.forEach(s => {
      const record = attendanceRecords.find(a => a.studentId === s.id && a.date === selectedDate);
      state[s.id] = record?.status || 'Present';
    });
    return state;
  });

  function getFilteredStudents(grade: string, section: string) {
    return students.filter(s => s.grade === grade && s.section === section);
  }

  const filteredStudents = getFilteredStudents(selectedGrade, selectedSection);

  const handleStatusChange = (studentId: string, status: 'Present' | 'Absent' | 'Late' | 'Excused') => {
    setAttendanceState(prev => ({ ...prev, [studentId]: status }));
  };

  const markAllPresent = () => {
    const newState = { ...attendanceState };
    filteredStudents.forEach(s => {
      newState[s.id] = 'Present';
    });
    setAttendanceState(newState);
  };

  const presentCount = filteredStudents.filter(s => attendanceState[s.id] === 'Present').length;
  const absentCount = filteredStudents.filter(s => attendanceState[s.id] === 'Absent').length;
  const lateCount = filteredStudents.filter(s => attendanceState[s.id] === 'Late').length;
  const excusedCount = filteredStudents.filter(s => attendanceState[s.id] === 'Excused').length;

  // Historical attendance data
  const dates = ['2025-01-06', '2025-01-07', '2025-01-08', '2025-01-09', '2025-01-10', '2025-01-13', '2025-01-14', '2025-01-15', '2025-01-16', '2025-01-17'];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard label="Present" count={presentCount} total={filteredStudents.length} color="emerald" icon="✅" />
        <SummaryCard label="Absent" count={absentCount} total={filteredStudents.length} color="red" icon="❌" />
        <SummaryCard label="Late" count={lateCount} total={filteredStudents.length} color="amber" icon="⏰" />
        <SummaryCard label="Excused" count={excusedCount} total={filteredStudents.length} color="blue" icon="📋" />
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-1 block w-48 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</label>
            <select
              value={selectedGrade}
              onChange={(e) => {
                setSelectedGrade(e.target.value);
                const newStudents = getFilteredStudents(e.target.value, selectedSection);
                const newState: Record<string, 'Present' | 'Absent' | 'Late' | 'Excused'> = {};
                newStudents.forEach(s => {
                  const record = attendanceRecords.find(a => a.studentId === s.id && a.date === selectedDate);
                  newState[s.id] = record?.status || 'Present';
                });
                setAttendanceState(newState);
              }}
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
              onChange={(e) => {
                setSelectedSection(e.target.value);
                const newStudents = getFilteredStudents(selectedGrade, e.target.value);
                const newState: Record<string, 'Present' | 'Absent' | 'Late' | 'Excused'> = {};
                newStudents.forEach(s => {
                  const record = attendanceRecords.find(a => a.studentId === s.id && a.date === selectedDate);
                  newState[s.id] = record?.status || 'Present';
                });
                setAttendanceState(newState);
              }}
              className="mt-1 block w-32 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
            </select>
          </div>
          <div className="flex-1"></div>
          <button
            onClick={markAllPresent}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-sm transition-colors"
          >
            Mark All Present
          </button>
          <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-colors">
            Save Attendance
          </button>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Student Attendance</h3>
            <p className="text-sm text-gray-500">Grade {selectedGrade} Section {selectedSection} • {selectedDate}</p>
          </div>
          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold">
            {filteredStudents.length} Students
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student ID</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Gender</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredStudents.map((student, index) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-sm text-gray-500">{index + 1}</td>
                  <td className="px-5 py-3 text-sm font-mono text-gray-600">{student.id}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 text-xs font-bold">
                        {student.firstName[0]}{student.lastName[0]}
                      </div>
                      <span className="text-sm font-medium text-gray-800">{student.firstName} {student.lastName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-600">{student.gender}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-center gap-1">
                      {(['Present', 'Absent', 'Late', 'Excused'] as const).map(status => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(student.id, status)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            attendanceState[student.id] === status
                              ? status === 'Present' ? 'bg-emerald-500 text-white shadow-sm' :
                                status === 'Absent' ? 'bg-red-500 text-white shadow-sm' :
                                status === 'Late' ? 'bg-amber-500 text-white shadow-sm' :
                                'bg-blue-500 text-white shadow-sm'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          {status === 'Present' ? '✓' : status === 'Absent' ? '✗' : status === 'Late' ? '⏰' : '📝'}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance History */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 text-lg">Attendance History (Last 10 Days)</h3>
          <p className="text-sm text-gray-500">Daily attendance rate for Grade {selectedGrade} Section {selectedSection}</p>
        </div>
        <div className="p-6">
          <div className="flex items-end gap-2 h-48">
            {dates.map(date => {
              const dayRecords = attendanceRecords.filter(a => a.date === date);
              const presentCount = dayRecords.filter(a => a.status === 'Present').length;
              const rate = dayRecords.length > 0 ? Math.round((presentCount / dayRecords.length) * 100) : 0;
              return (
                <div key={date} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-medium text-gray-600">{rate}%</span>
                  <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '120px' }}>
                    <div
                      className={`absolute bottom-0 w-full rounded-t-lg transition-all ${
                        rate >= 80 ? 'bg-emerald-500' : rate >= 60 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ height: `${rate}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-gray-400">{date.slice(5)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, count, total, color, icon }: { label: string; count: number; total: number; color: string; icon: string }) {
  const colorClasses: Record<string, { bg: string; text: string; bar: string }> = {
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', bar: 'bg-emerald-500' },
    red: { bg: 'bg-red-50', text: 'text-red-700', bar: 'bg-red-500' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700', bar: 'bg-amber-500' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', bar: 'bg-blue-500' },
  };
  const c = colorClasses[color] || colorClasses.emerald;
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className={`px-2.5 py-1 ${c.bg} ${c.text} rounded-lg text-xs font-semibold`}>{percentage}%</span>
      </div>
      <p className="text-2xl font-bold text-gray-800">{count}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
      <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3">
        <div className={`${c.bar} h-1.5 rounded-full transition-all`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}
