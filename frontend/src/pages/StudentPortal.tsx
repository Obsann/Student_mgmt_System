import { useState } from "react";
import {
  User, BookOpen, TrendingUp, Calendar, Award,
} from "lucide-react";
import { useApp } from "../contexts/AppContext";
import ProfilePage from "./ProfilePage";
import { getEthiopianGrade } from "../utils/gradeCalculator";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

// ============================================================
// STUDENT DASHBOARD
// ============================================================
function StudentDashboard() {
  const { currentUser, state, getMarksForStudent, getAttendanceForStudent } = useApp();
  const studentId = currentUser?.ref_id || "";
  const student = state.students.find((s) => s.id === studentId);
  const myMarks = getMarksForStudent(studentId);
  const myAttendance = getAttendanceForStudent(studentId);

  const avgScore = myMarks.length > 0
    ? Math.round(myMarks.reduce((sum, m) => sum + m.score, 0) / myMarks.length)
    : 0;

  const presentCount = myAttendance.filter((a) => a.status === "present").length;
  const attendanceRate = myAttendance.length > 0
    ? Math.round((presentCount / myAttendance.length) * 100)
    : 0;

  const grade = getEthiopianGrade(avgScore);

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-black">
            {student?.first_name?.[0] || "S"}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{student?.first_name} {student?.last_name}</h2>
            <p className="text-green-200 text-sm">Grade {student?.grade}{student?.section} • Roll: {student?.roll_number}</p>
          </div>
          <div className="hidden sm:block text-right">
            <div className="text-3xl font-black">{avgScore}%</div>
            <div className="text-green-200 text-xs">Overall Average</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600"><BookOpen size={18} /></div>
            <div>
              <div className="text-lg font-bold text-gray-900">{myMarks.length}</div>
              <div className="text-[10px] text-gray-400">Total Marks</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-green-50 text-green-600"><TrendingUp size={18} /></div>
            <div>
              <div className="text-lg font-bold text-gray-900">{attendanceRate}%</div>
              <div className="text-[10px] text-gray-400">Attendance Rate</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${grade.color.split(" ")[1]} ${grade.color.split(" ")[0]}`}><Award size={18} /></div>
            <div>
              <div className={`text-lg font-bold ${grade.color.split(" ")[0]}`}>{grade.grade}</div>
              <div className="text-[10px] text-gray-400">Letter Grade</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-50 text-orange-600"><Calendar size={18} /></div>
            <div>
              <div className="text-lg font-bold text-gray-900">{myAttendance.length}</div>
              <div className="text-[10px] text-gray-400">Attendance Records</div>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Marks Overview */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Subject Performance Overview</h3>
        <div className="space-y-3">
          {(() => {
            const subjects = [...new Set(myMarks.map((m) => m.subject_id))];
            return subjects.map((subId) => {
              const sub = state.subjects.find((s) => s.id === subId);
              const subMarks = myMarks.filter((m) => m.subject_id === subId);
              const avg = Math.round(subMarks.reduce((s, m) => s + m.score, 0) / subMarks.length);
              return (
                <div key={subId} className="flex items-center gap-3">
                  <span className="text-xs text-gray-600 w-32 truncate font-medium">{sub?.name || "Unknown"}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${avg >= 70 ? "bg-green-500" : avg >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
                      style={{ width: `${avg}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold w-10 text-right text-gray-700">{avg}%</span>
                </div>
              );
            });
          })()}
          {myMarks.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">No marks recorded yet</p>
          )}
        </div>

        {myMarks.length > 0 && (
          <div className="mt-8">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Performance Trend</h4>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={(() => {
                  const subjects = [...new Set(myMarks.map((m) => m.subject_id))];
                  return subjects.map((subId) => {
                    const sub = state.subjects.find((s) => s.id === subId);
                    const subMarks = myMarks.filter((m) => m.subject_id === subId);
                    const avg = Math.round(subMarks.reduce((s, m) => s + m.score, 0) / subMarks.length);
                    return { name: sub?.name?.substring(0, 3) || "Unk", score: avg };
                  });
                })()}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} domain={[0, 100]} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="score" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Profile Details */}
      {student && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <User size={16} className="text-green-500" /> Personal Information
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div><span className="text-gray-400 text-xs">Full Name</span><div className="font-medium text-gray-900">{student.first_name} {student.last_name}</div></div>
            <div><span className="text-gray-400 text-xs">Age</span><div className="font-medium text-gray-900">{student.age}</div></div>
            <div><span className="text-gray-400 text-xs">Gender</span><div className="font-medium text-gray-900">{student.gender}</div></div>
            <div><span className="text-gray-400 text-xs">Grade & Section</span><div className="font-medium text-gray-900">{student.grade}{student.section}</div></div>
            <div><span className="text-gray-400 text-xs">Roll Number</span><div className="font-medium text-gray-900 font-mono">{student.roll_number}</div></div>
            <div><span className="text-gray-400 text-xs">Parent Phone</span><div className="font-medium text-gray-900 font-mono">{student.parent_phone}</div></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// MY MARKS
// ============================================================
function MyMarks() {
  const { currentUser, state, getMarksForStudent } = useApp();
  const studentId = currentUser?.ref_id || "";
  const myMarks = getMarksForStudent(studentId);
  const [subjectFilter, setSubjectFilter] = useState("");

  const subjects = [...new Set(myMarks.map((m) => m.subject_id))];
  const filteredMarks = subjectFilter
    ? myMarks.filter((m) => m.subject_id === subjectFilter)
    : myMarks;

  // Group by subject
  const grouped = subjects
    .filter((sId) => !subjectFilter || sId === subjectFilter)
    .map((subId) => {
      const sub = state.subjects.find((s) => s.id === subId);
      const marks = myMarks.filter((m) => m.subject_id === subId);
      const avg = marks.length > 0 ? Math.round(marks.reduce((s, m) => s + m.score, 0) / marks.length) : 0;
      return { subId, subject: sub, marks, avg };
    });

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <select
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900"
        >
          <option value="">All Subjects</option>
          {subjects.map((subId) => {
            const sub = state.subjects.find((s) => s.id === subId);
            return <option key={subId} value={subId}>{sub?.name || "Unknown"}</option>;
          })}
        </select>
        
        <button 
          onClick={() => {
            // Simulated PDF download
            const blob = new Blob(["Transcript for " + (currentUser?.name || "Student")], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Transcript_${currentUser?.name?.replace(/\s+/g, '_')}.txt`;
            a.click();
          }}
          className="w-full sm:w-auto px-4 py-2 bg-indigo-50 text-indigo-700 font-bold text-sm rounded-xl hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
        >
          <Award size={16} /> Download Transcript
        </button>
      </div>

      {grouped.map(({ subId, subject, marks, avg }) => (
        <div key={subId} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-4 flex items-center justify-between bg-gray-50 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">{subject?.name || "Unknown"}</h3>
              <span className="text-[10px] text-gray-400">Grade {subject?.grade} • {marks.length} assessments</span>
            </div>
            <div className={`text-lg font-black ${avg >= 70 ? "text-green-600" : avg >= 50 ? "text-yellow-600" : "text-red-600"}`}>
              {avg}%
            </div>
          </div>
          <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {marks.map((m) => (
              <div
                key={m.id}
                className={`p-3 rounded-xl text-center ${
                  m.score >= 70 ? "bg-green-50 border border-green-100" :
                  m.score >= 50 ? "bg-yellow-50 border border-yellow-100" :
                  "bg-red-50 border border-red-100"
                }`}
              >
                <div className="text-[10px] text-gray-500 capitalize mb-1">{m.assessment_type}</div>
                <div className="flex items-baseline justify-center gap-1">
                  <span className={`text-xl font-black ${getEthiopianGrade(m.score).color.split(" ")[0]}`}>
                    {m.score}
                  </span>
                  <span className={`text-xs font-bold ${getEthiopianGrade(m.score).color.split(" ")[0]}`}>
                    ({getEthiopianGrade(m.score).grade})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {myMarks.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400">
          No marks have been recorded yet.
        </div>
      )}
    </div>
  );
}

// ============================================================
// MY ATTENDANCE
// ============================================================
function MyAttendance() {
  const { currentUser, state, getAttendanceForStudent } = useApp();
  const studentId = currentUser?.ref_id || "";
  const myAttendance = getAttendanceForStudent(studentId);

  const total = myAttendance.length;
  const present = myAttendance.filter((a) => a.status === "present").length;
  const absent = myAttendance.filter((a) => a.status === "absent").length;
  const late = myAttendance.filter((a) => a.status === "late").length;
  const rate = total > 0 ? Math.round((present / total) * 100) : 0;

  // Group by date
  const byDate = myAttendance.reduce<Record<string, typeof myAttendance>>((acc, a) => {
    if (!acc[a.date]) acc[a.date] = [];
    acc[a.date].push(a);
    return acc;
  }, {});

  const sortedDates = Object.keys(byDate).sort().reverse();

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
          <div className="text-2xl font-black text-green-600">{rate}%</div>
          <div className="text-[10px] text-green-500">Attendance Rate</div>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
          <div className="text-2xl font-black text-blue-600">{present}</div>
          <div className="text-[10px] text-blue-500">Present</div>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
          <div className="text-2xl font-black text-red-600">{absent}</div>
          <div className="text-[10px] text-red-500">Absent</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 text-center">
          <div className="text-2xl font-black text-yellow-600">{late}</div>
          <div className="text-[10px] text-yellow-500">Late</div>
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar size={16} className="text-blue-500" /> Attendance Calendar
        </h3>
        <div className="flex flex-wrap gap-1">
          {sortedDates.map((date) => {
            const records = byDate[date];
            // If any record is absent, mark day as absent, else if late, late, else present
            const isAbsent = records.some(r => r.status === 'absent');
            const isLate = records.some(r => r.status === 'late');
            const color = isAbsent ? 'bg-red-500' : isLate ? 'bg-yellow-500' : 'bg-green-500';
            return (
              <div 
                key={date} 
                title={`${date}: ${isAbsent ? 'Absent' : isLate ? 'Late' : 'Present'}`}
                className={`w-6 h-6 rounded-sm ${color} opacity-80 hover:opacity-100 transition-opacity cursor-help`}
              />
            );
          })}
        </div>
      </div>

      {/* Attendance by Date */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900">Attendance History</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {sortedDates.map((date) => {
            const records = byDate[date];
            return (
              <div key={date} className="px-4 py-3">
                <div className="text-xs font-medium text-gray-500 mb-2">
                  📅 {new Date(date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </div>
                <div className="flex flex-wrap gap-2">
                  {records.map((r) => {
                    const sub = state.subjects.find((s) => s.id === r.subject_id);
                    return (
                      <span
                        key={r.id}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${
                          r.status === "present" ? "bg-green-50 text-green-700" :
                          r.status === "absent" ? "bg-red-50 text-red-700" :
                          r.status === "late" ? "bg-yellow-50 text-yellow-700" :
                          "bg-gray-50 text-gray-700"
                        }`}
                      >
                        {r.status === "present" ? "✅" : r.status === "absent" ? "❌" : r.status === "late" ? "⏰" : "📝"}
                        {sub?.name || "Unknown"}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        {sortedDates.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">No attendance records yet.</div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// MAIN STUDENT PORTAL
// ============================================================
export default function StudentPortal({ activePage }: { activePage: string }) {
  switch (activePage) {
    case "dashboard": return <StudentDashboard />;
    case "marks": return <MyMarks />;
    case "attendance": return <MyAttendance />;
    case "profile": return <ProfilePage />;
    default: return <StudentDashboard />;
  }
}
