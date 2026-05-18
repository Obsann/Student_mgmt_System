import { useState } from "react";
import {
  User, BookOpen, TrendingUp, Calendar, Award,
} from "lucide-react";
import { useApp } from "../contexts/AppContext";
import ProfilePage from "./ProfilePage";
import { getEthiopianGrade } from "../utils/gradeCalculator";
import { CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";

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
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden animate-fade-scale group">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform duration-700 group-hover:scale-125"></div>
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-3xl font-black shadow-inner group-hover:rotate-6 transition-transform overflow-hidden">
            {currentUser?.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
            ) : (
              student?.first_name?.[0] || "S"
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-black">{student?.first_name} {student?.last_name}</h2>
            <p className="text-emerald-100 text-sm mt-1 font-medium bg-black/10 inline-block px-3 py-1 rounded-xl">Grade {student?.grade}{student?.section} • Roll: {student?.roll_number}</p>
          </div>
          <div className="hidden sm:block text-right pr-4">
            <div className="text-4xl font-black">{avgScore}%</div>
            <div className="text-emerald-100 text-xs mt-1 font-bold uppercase tracking-widest">Overall Avg</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up">
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600"><BookOpen size={20} /></div>
            <div>
              <div className="text-2xl font-black text-slate-900 leading-none">{myMarks.length}</div>
              <div className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Total Marks</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600"><TrendingUp size={20} /></div>
            <div>
              <div className="text-2xl font-black text-slate-900 leading-none">{attendanceRate}%</div>
              <div className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Attendance</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${grade.color.split(" ")[1]} ${grade.color.split(" ")[0]}`}><Award size={20} /></div>
            <div>
              <div className={`text-2xl font-black leading-none ${grade.color.split(" ")[0]}`}>{grade.grade}</div>
              <div className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Letter Grade</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-orange-50 text-orange-600"><Calendar size={20} /></div>
            <div>
              <div className="text-2xl font-black text-slate-900 leading-none">{myAttendance.length}</div>
              <div className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Records</div>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Term Progress (Adapted for High School) */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-3xl border border-indigo-100 p-6 shadow-sm animate-fade-up">
        <h3 className="text-sm font-extrabold text-indigo-900 mb-4 flex items-center gap-2">
          <Award size={18} className="text-indigo-600" />
          Current Term Progress
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white">
            <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">Academic Term</div>
            <div className="font-black text-slate-800 text-lg">Fall Semester</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white">
            <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">Unweighted GPA</div>
            <div className="font-black text-slate-800 text-lg">
              {avgScore > 0 ? ((avgScore / 100) * 4.0).toFixed(2) : "N/A"}
            </div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white">
            <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">Credits Earned</div>
            <div className="font-black text-slate-800 text-lg">
              {myMarks.length > 0 ? myMarks.length * 3 : 0}
            </div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white">
            <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">Academic Status</div>
            <div className="font-black text-slate-800 text-lg">
              {avgScore >= 90 ? "Honor Roll 🌟" : avgScore >= 70 ? "Good Standing" : "At Risk"}
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

      {/* Profile & Account Details */}
      {student && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-up">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all">
            <h3 className="text-base font-extrabold text-slate-900 mb-5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500">
                <User size={16} />
              </div>
              Personal Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100"><span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Full Name</span><div className="font-black text-slate-900 mt-1">{student.first_name} {student.last_name}</div></div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100"><span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Age</span><div className="font-black text-slate-900 mt-1">{student.age}</div></div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100"><span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Grade & Section</span><div className="font-black text-slate-900 mt-1">{student.grade}{student.section}</div></div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100"><span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Roll Number</span><div className="font-black text-slate-900 mt-1 font-mono">{student.roll_number}</div></div>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all">
            <h3 className="text-base font-extrabold text-slate-900 mb-5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                <BookOpen size={16} />
              </div>
              School Account
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-slate-500 text-xs font-bold uppercase">Student Email</span>
                <span className="font-black text-slate-900 text-sm">{currentUser?.email || "student@school.edu"}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-slate-500 text-xs font-bold uppercase">Parent Contact</span>
                <span className="font-black text-slate-900 text-sm">{student.parent_phone}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-slate-500 text-xs font-bold uppercase">Password</span>
                <span className="font-bold text-emerald-600 text-xs bg-emerald-100 px-2 py-1 rounded-lg">Hidden for Security</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-4 text-center">Contact your homeroom teacher or the admin if you need to update your password.</p>
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
        <div key={subId} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all animate-fade-up">
          <div className="p-5 flex items-center justify-between bg-slate-50 border-b border-slate-100">
            <div>
              <h3 className="font-black text-slate-900 text-base">{subject?.name || "Unknown"}</h3>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1 inline-block">Grade {subject?.grade} • {marks.length} assessments</span>
            </div>
            <div className={`text-2xl font-black px-3 py-1.5 rounded-xl border ${avg >= 70 ? "text-green-600 bg-green-50 border-green-100" : avg >= 50 ? "text-yellow-600 bg-yellow-50 border-yellow-100" : "text-red-600 bg-red-50 border-red-100"}`}>
              {avg}%
            </div>
          </div>
          <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {marks.map((m) => (
              <div
                key={m.id}
                className={`p-4 rounded-2xl text-center group hover:-translate-y-1 transition-all ${
                  m.score >= 70 ? "bg-green-50 border border-green-100 hover:shadow-md hover:shadow-green-100" :
                  m.score >= 50 ? "bg-yellow-50 border border-yellow-100 hover:shadow-md hover:shadow-yellow-100" :
                  "bg-red-50 border border-red-100 hover:shadow-md hover:shadow-red-100"
                }`}
              >
                <div className="text-[11px] font-bold text-slate-500 capitalize mb-2 uppercase tracking-wider">{m.assessment_type}</div>
                <div className="flex items-baseline justify-center gap-1.5">
                  <span className={`text-3xl font-black ${getEthiopianGrade(m.score).color.split(" ")[0]} group-hover:scale-110 transition-transform`}>
                    {m.score}
                  </span>
                  <span className={`text-sm font-bold ${getEthiopianGrade(m.score).color.split(" ")[0]}`}>
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
