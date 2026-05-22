import { useState } from "react";
import {
  User, BookOpen, TrendingUp, Calendar, Award, ChevronLeft, ChevronRight, LayoutGrid, List, FileText, X
} from "lucide-react";
import { useApp } from "../contexts/AppContext";
import ProfilePage from "./ProfilePage";
import Pagination from "../components/Pagination";
import { CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";

// ============================================================
// STUDENT DASHBOARD
// ============================================================
function StudentDashboard() {
  const { currentUser, state, getMarksForStudent, getAttendanceForStudent } = useApp();
  const studentId = currentUser?.ref_id || "";
  const student = state.students.find((s) => s.id === studentId);
  const myMarks = getMarksForStudent(studentId);
  
  // Filter attendance to weekdays only
  const rawAttendance = getAttendanceForStudent(studentId);
  const myAttendance = rawAttendance.filter((a) => {
    const d = new Date(a.date);
    const day = d.getDay();
    return day !== 0 && day !== 6; // 0 Sunday, 6 Saturday
  });

  // Get all subjects matching student's grade & section
  const studentSubjects = state.subjects.filter(
    (sub) => sub.grade === student?.grade && sub.sections?.includes(student?.section)
  );

  // Group marks by subject and calculate percentage for each subject
  const subjectPercentages = studentSubjects.map((sub) => {
    const subMarks = myMarks.filter((m) => m.subject_id === sub.id);
    if (subMarks.length === 0) return 0;
    const totalScore = subMarks.reduce((sum, m) => sum + m.score, 0);
    const totalMax = subMarks.reduce((sum, m) => sum + (m.max_score || 100), 0);
    return totalMax > 0 ? (totalScore / totalMax) * 100 : 0;
  });

  // Calculate overall average percent across all subjects the student takes
  const avgScore = studentSubjects.length > 0
    ? Math.round(subjectPercentages.reduce((sum, pct) => sum + pct, 0) / studentSubjects.length)
    : 0;

  // Academic status is visible only after all marks are entered (i.e. every subject has at least one mark)
  const gradedSubjectIds = new Set(myMarks.map((m) => m.subject_id));
  const allMarksEntered = studentSubjects.length > 0 && studentSubjects.every((sub) => gradedSubjectIds.has(sub.id));

  const presentCount = myAttendance.filter((a) => a.status === "present").length;
  const attendanceRate = myAttendance.length > 0
    ? Math.round((presentCount / myAttendance.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-sm relative overflow-hidden animate-fade-scale group">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 transition-transform duration-700 group-hover:scale-125"></div>
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
            <div className="text-4xl font-black text-white">{avgScore}%</div>
            <div className="text-slate-400 text-xs mt-1 font-bold uppercase tracking-widest">Overall Avg</div>
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
            <div className={`p-3 rounded-2xl bg-indigo-50 text-indigo-600`}><Award size={20} /></div>
            <div>
              <div className={`text-2xl font-black leading-none text-indigo-600`}>{avgScore}%</div>
              <div className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Overall Percent</div>
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

      {/* Academic Term Progress */}
      <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 shadow-sm animate-fade-up">
        <h3 className="text-sm font-extrabold text-slate-900 mb-4 flex items-center gap-2">
          <Award size={18} className="text-slate-500" />
          Current Term Progress
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white">
            <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">Academic Term</div>
            <div className="font-black text-slate-800 text-lg">Semester 1</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white">
            <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">Average Mark</div>
            <div className="font-black text-slate-800 text-lg">
              {myMarks.length > 0 ? `${avgScore}%` : "N/A"}
            </div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white">
            <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">Total Assessments</div>
            <div className="font-black text-slate-800 text-lg">
              {myMarks.length}
            </div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Academic Status</div>
            <div className="font-black text-slate-800 text-lg">
              {allMarksEntered ? (avgScore >= 50 ? "Pass" : "Fail") : "Pending"}
            </div>
          </div>
        </div>
      </div>

      {/* Subject Marks Overview */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Subject Performance Overview</h3>
        <div className="space-y-3">
          {studentSubjects.map((sub) => {
            const subMarks = myMarks.filter((m) => m.subject_id === sub.id);
            const totalScore = subMarks.reduce((sum, m) => sum + m.score, 0);
            const totalMax = subMarks.reduce((sum, m) => sum + (m.max_score || 100), 0);
            const avg = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;
            return (
              <div key={sub.id} className="flex items-center gap-3">
                <span className="text-xs text-gray-600 w-32 truncate font-medium">{sub.name}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${subMarks.length === 0 ? "bg-slate-300" : avg >= 70 ? "bg-green-500" : avg >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
                    style={{ width: `${subMarks.length === 0 ? 0 : avg}%` }}
                  />
                </div>
                <span className="text-xs font-bold w-10 text-right text-gray-700">{subMarks.length === 0 ? "N/A" : `${avg}%`}</span>
              </div>
            );
          })}
          {studentSubjects.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">No subjects assigned for your grade & section</p>
          )}
        </div>
      </div>

      {/* Performance Trend chart */}
      {myMarks.length > 0 && (
        <div className="mt-8">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Performance Trend</h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentSubjects.map((sub) => {
                const subMarks = myMarks.filter((m) => m.subject_id === sub.id);
                if (subMarks.length === 0) return { name: sub.name.substring(0, 3), score: 0 };
                const totalScore = subMarks.reduce((sum, m) => sum + m.score, 0);
                const totalMax = subMarks.reduce((sum, m) => sum + (m.max_score || 100), 0);
                const avg = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;
                return { name: sub.name.substring(0, 3), score: avg };
              })}>
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
  const student = state.students.find((s) => s.id === studentId);
  const myMarks = getMarksForStudent(studentId);

  // Get all subjects matching student's grade & section
  const studentSubjects = state.subjects.filter(
    (sub) => sub.grade === student?.grade && sub.sections?.includes(student?.section)
  );

  // Group marks by subject and calculate percentage for each subject
  const subjectPercentages = studentSubjects.map((sub) => {
    const subMarks = myMarks.filter((m) => m.subject_id === sub.id);
    if (subMarks.length === 0) return 0;
    const totalScore = subMarks.reduce((sum, m) => sum + m.score, 0);
    const totalMax = subMarks.reduce((sum, m) => sum + (m.max_score || 100), 0);
    return totalMax > 0 ? (totalScore / totalMax) * 100 : 0;
  });

  // Calculate overall average percent across all subjects the student takes
  const avgScore = studentSubjects.length > 0
    ? Math.round(subjectPercentages.reduce((sum, pct) => sum + pct, 0) / studentSubjects.length)
    : 0;

  const gradedSubjectIds = new Set(myMarks.map((m) => m.subject_id));
  const allMarksEntered = studentSubjects.length > 0 && studentSubjects.every((sub) => gradedSubjectIds.has(sub.id));

  const [showTranscript, setShowTranscript] = useState(false);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm animate-fade-in">
        <div>
          <h2 className="text-xl font-black text-slate-900">My Assessment Grades</h2>
          <p className="text-xs text-slate-400 mt-1 font-medium">View detailed breakdown of your academic performances across all subjects.</p>
        </div>
        <button 
          onClick={() => setShowTranscript(true)}
          className="w-full sm:w-auto px-5 py-3 bg-indigo-600 text-white font-bold text-sm rounded-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20"
        >
          <FileText size={18} /> View Transcript
        </button>
      </div>

      {showTranscript && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowTranscript(false)}>
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-fade-scale overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Official Transcript</h3>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-0.5">Kera High School</p>
                </div>
              </div>
              <button onClick={() => setShowTranscript(false)} className="w-8 h-8 bg-slate-200/50 hover:bg-slate-200 rounded-xl flex items-center justify-center text-slate-600 transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-white">
              <div className="max-w-3xl mx-auto border border-slate-200 p-8 rounded-none shadow-sm">
                <div className="text-center mb-8 border-b-2 border-slate-800 pb-4">
                  <h1 className="text-2xl font-serif font-bold text-slate-900">KERA HIGH SCHOOL</h1>
                  <p className="text-sm font-serif text-slate-600 mt-1">Official Academic Transcript • Addis Ababa, Ethiopia</p>
                </div>

                <div className="mb-8 grid grid-cols-2 gap-4 text-sm font-serif">
                  <div>
                    <p className="mb-1"><span className="font-bold">Student Name:</span> {student?.first_name} {student?.last_name}</p>
                    <p className="mb-1"><span className="font-bold">Roll Number:</span> {student?.roll_number}</p>
                    <p><span className="font-bold">Grade & Section:</span> Grade {student?.grade}{student?.section}</p>
                  </div>
                  <div className="text-right">
                    <p className="mb-1"><span className="font-bold">Academic Year:</span> 2026/2027</p>
                    <p className="mb-1"><span className="font-bold">Semester:</span> Semester 1</p>
                    <p><span className="font-bold">Issue Date:</span> {new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                <table className="w-full text-sm border-collapse mb-8 font-serif">
                  <thead>
                    <tr className="bg-slate-800 text-white">
                      <th className="border border-slate-800 py-2 px-3 text-left">Subject/Course</th>
                      <th className="border border-slate-800 py-2 px-2 text-center">Att (10)</th>
                      <th className="border border-slate-800 py-2 px-2 text-center">Ass (10)</th>
                      <th className="border border-slate-800 py-2 px-2 text-center">Quiz (10)</th>
                      <th className="border border-slate-800 py-2 px-2 text-center">Mid (20)</th>
                      <th className="border border-slate-800 py-2 px-2 text-center">Final (50)</th>
                      <th className="border border-slate-800 py-2 px-3 text-center">Total (100)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentSubjects.map((sub, index) => {
                      const marks = myMarks.filter(m => m.subject_id === sub.id);
                      const att = marks.find(m => m.assessment_type === "attendance")?.score ?? "-";
                      const ass = marks.find(m => m.assessment_type === "assignment")?.score ?? "-";
                      const quiz = marks.find(m => m.assessment_type === "quiz")?.score ?? "-";
                      const mid = marks.find(m => m.assessment_type === "midterm")?.score ?? "-";
                      const fnl = marks.find(m => m.assessment_type === "final")?.score ?? "-";

                      const hasMarks = marks.length > 0;
                      const totalScore = hasMarks ? (Number(att) || 0) + (Number(ass) || 0) + (Number(quiz) || 0) + (Number(mid) || 0) + (Number(fnl) || 0) : "-";

                      return (
                        <tr key={sub.id} className={index % 2 === 1 ? 'bg-slate-50' : 'bg-white'}>
                          <td className="border border-slate-300 py-2 px-3 font-medium">{sub.name}</td>
                          <td className="border border-slate-300 py-2 px-2 text-center">{att}</td>
                          <td className="border border-slate-300 py-2 px-2 text-center">{ass}</td>
                          <td className="border border-slate-300 py-2 px-2 text-center">{quiz}</td>
                          <td className="border border-slate-300 py-2 px-2 text-center">{mid}</td>
                          <td className="border border-slate-300 py-2 px-2 text-center">{fnl}</td>
                          <td className="border border-slate-300 py-2 px-3 text-center font-bold">{totalScore}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div className="bg-slate-50 p-6 border border-slate-300 mb-16 font-serif">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-bold text-lg">Overall Average Percent: {avgScore}%</p>
                    <p className="text-sm"><span className="font-bold">Grading Scale:</span> Pass: &gt;= 50% | Fail: &lt; 50%</p>
                  </div>
                  <p className="font-bold text-lg">Academic Status: {allMarksEntered ? (avgScore >= 50 ? "PASS" : "FAIL") : "PENDING"}</p>
                </div>

                <div className="flex justify-between items-end font-serif mt-12 pt-8">
                  <div className="text-center">
                    <div className="w-48 border-b border-slate-800 mb-2 mx-auto"></div>
                    <p className="text-sm">Homeroom Teacher Signature</p>
                  </div>
                  <div className="text-center">
                    <div className="w-48 border-b border-slate-800 mb-2 mx-auto"></div>
                    <p className="text-sm">School Principal Stamp</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
              <p className="text-xs text-slate-500 font-medium">This is a view-only digital copy. For official printed transcripts, please contact the administration office.</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all animate-fade-up">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-black uppercase tracking-wider">
                <th className="py-4 px-6 text-left">Subject/Course</th>
                <th className="py-4 px-4 text-center">Attendance (10)</th>
                <th className="py-4 px-4 text-center">Assignment (10)</th>
                <th className="py-4 px-4 text-center">Quiz (10)</th>
                <th className="py-4 px-4 text-center">Mid Exam (20)</th>
                <th className="py-4 px-4 text-center">Final Exam (50)</th>
                <th className="py-4 px-4 text-center">Total (100)</th>
                <th className="py-4 px-4 text-center">Percent</th>
                <th className="py-4 px-6 text-left">Remark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {studentSubjects.map((sub) => {
                const marks = myMarks.filter((m) => m.subject_id === sub.id);
                const attMark = marks.find(m => m.assessment_type === "attendance")?.score;
                const assMark = marks.find(m => m.assessment_type === "assignment")?.score;
                const quizMark = marks.find(m => m.assessment_type === "quiz")?.score;
                const midtermMark = marks.find(m => m.assessment_type === "midterm")?.score;
                const finalMark = marks.find(m => m.assessment_type === "final")?.score;

                const hasMarks = marks.length > 0;
                const total = hasMarks ? (Number(attMark) || 0) + (Number(assMark) || 0) + (Number(quizMark) || 0) + (Number(midtermMark) || 0) + (Number(finalMark) || 0) : 0;
                
                const maxTotal = (attMark !== undefined ? 10 : 0) + 
                                 (assMark !== undefined ? 10 : 0) + 
                                 (quizMark !== undefined ? 10 : 0) + 
                                 (midtermMark !== undefined ? 20 : 0) + 
                                 (finalMark !== undefined ? 50 : 0);

                const percent = maxTotal > 0 ? Math.round((total / maxTotal) * 100) : 0;
                const remark = marks.find(m => m.remarks)?.remarks || "No comments";

                return (
                  <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 font-black text-slate-900">{sub.name}</td>
                    <td className="py-4 px-4 text-center font-bold text-slate-600">{attMark !== undefined ? `${attMark}/10` : "-"}</td>
                    <td className="py-4 px-4 text-center font-bold text-slate-600">{assMark !== undefined ? `${assMark}/10` : "-"}</td>
                    <td className="py-4 px-4 text-center font-bold text-slate-600">{quizMark !== undefined ? `${quizMark}/10` : "-"}</td>
                    <td className="py-4 px-4 text-center font-bold text-slate-600">{midtermMark !== undefined ? `${midtermMark}/20` : "-"}</td>
                    <td className="py-4 px-4 text-center font-bold text-slate-600">{finalMark !== undefined ? `${finalMark}/50` : "-"}</td>
                    <td className="py-4 px-4 text-center font-black text-slate-955">{hasMarks ? `${total}/${maxTotal}` : "-"}</td>
                    <td className="py-4 px-4 text-center">
                      {hasMarks ? (
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${
                          percent >= 75 ? "bg-green-100 text-green-700" :
                          percent >= 50 ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {percent}%
                        </span>
                      ) : "-"}
                    </td>
                    <td className="py-4 px-6 text-slate-400 text-xs font-medium italic">{remark}</td>
                  </tr>
                );
              })}
              {studentSubjects.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 font-medium">
                    No subjects assigned for your grade & section.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MY ATTENDANCE
// ============================================================
function MyAttendance() {
  const { currentUser, state, getAttendanceForStudent } = useApp();
  const studentId = currentUser?.ref_id || "";
  const student = state.students.find((s) => s.id === studentId);
  
  // Get all subjects matching student's grade & section
  const studentSubjects = state.subjects.filter(
    (sub) => sub.grade === student?.grade && sub.sections?.includes(student?.section)
  );

  const rawAttendance = getAttendanceForStudent(studentId);
  
  // Only track weekdays (Monday to Friday)
  const myAttendance = rawAttendance.filter((a) => {
    const d = new Date(a.date);
    const day = d.getDay();
    return day !== 0 && day !== 6; // 0 Sunday, 6 Saturday
  });

  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [weekOffset, setWeekOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 7;

  const total = myAttendance.length;
  const present = myAttendance.filter((a) => a.status === "present").length;
  const absent = myAttendance.filter((a) => a.status === "absent").length;
  const late = myAttendance.filter((a) => a.status === "late").length;
  const rate = total > 0 ? Math.round((present / total) * 100) : 0;

  // Group by date
  const byDate = myAttendance.reduce<Record<string, typeof myAttendance>>((acc, a) => {
    const dStr = new Date(a.date).toISOString().split("T")[0];
    if (!acc[dStr]) acc[dStr] = [];
    acc[dStr].push(a);
    return acc;
  }, {});

  const sortedDates = Object.keys(byDate).sort().reverse();
  const paginatedDates = sortedDates.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Generate weekday dates for selected week offset
  const getWeekDays = (offset: number) => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 Sunday, 1 Monday, etc.
    const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + distanceToMonday + offset * 7);
    
    return Array.from({ length: 5 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  };

  const weekDays = getWeekDays(weekOffset);
  const weekStartStr = weekDays[0].toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const weekEndStr = weekDays[4].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const statusColors = {
    present: { bg: "bg-green-500", text: "text-white", label: "P" },
    absent: { bg: "bg-red-500", text: "text-white", label: "A" },
    late: { bg: "bg-yellow-500", text: "text-white", label: "L" },
    excused: { bg: "bg-slate-400", text: "text-white", label: "E" },
  };

  return (
    <div className="space-y-6">
      {/* Header with Switcher */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm animate-fade-in">
        <div>
          <h2 className="text-xl font-black text-slate-900">My Attendance Portal</h2>
          <p className="text-xs text-slate-400 mt-1 font-medium">Track your daily class presence during learning days (Monday to Friday).</p>
        </div>
        <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1 w-full sm:w-auto">
          <button
            onClick={() => setViewMode("list")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === "list"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <List size={14} /> List View
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === "calendar"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <LayoutGrid size={14} /> Calendar View
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up">
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Attendance Rate</div>
          <div className="text-3xl font-black text-indigo-600">{rate}%</div>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Present Days</div>
          <div className="text-3xl font-black text-green-600">{present}</div>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Absent Days</div>
          <div className="text-3xl font-black text-red-600">{absent}</div>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Late Days</div>
          <div className="text-3xl font-black text-yellow-600">{late}</div>
        </div>
      </div>

      {viewMode === "calendar" ? (
        /* Weekly Calendar View */
        <div className="space-y-4 animate-fade-up">
          <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setWeekOffset(w => w - 1)} 
                className="p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 text-slate-600 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="font-extrabold text-slate-900 text-sm min-w-[200px] text-center">
                {weekStartStr} - {weekEndStr}
              </span>
              <button 
                onClick={() => setWeekOffset(w => w + 1)} 
                className="p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 text-slate-600 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
              {weekOffset !== 0 && (
                <button 
                  onClick={() => setWeekOffset(0)} 
                  className="px-3.5 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
                >
                  Current Week
                </button>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-green-500"></div> Present</div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-red-500"></div> Absent</div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-yellow-500"></div> Late</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-black uppercase tracking-wider">
                    <th className="py-4 px-6 text-left">Subject/Course</th>
                    {weekDays.map((day) => {
                      const isToday = day.toDateString() === new Date().toDateString();
                      return (
                        <th 
                          key={day.toISOString()} 
                          className={`py-4 px-4 text-center w-28 ${isToday ? "bg-indigo-50/50 text-indigo-600" : ""}`}
                        >
                          <div>{day.toLocaleDateString("en-US", { weekday: "short" })}</div>
                          <div className="text-sm mt-0.5">{day.getDate()}</div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentSubjects.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 font-black text-slate-900">{sub.name}</td>
                      {weekDays.map((day) => {
                        const dateStr = day.toISOString().split("T")[0];
                        const dayRecords = byDate[dateStr] || [];
                        const record = dayRecords.find((r) => r.subject_id === sub.id);
                        
                        return (
                          <td key={day.toISOString()} className="py-3 px-4 text-center">
                            {record ? (
                              <div className="flex justify-center">
                                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shadow-sm ${
                                  statusColors[record.status as keyof typeof statusColors]?.bg || "bg-slate-100"
                                } ${
                                  statusColors[record.status as keyof typeof statusColors]?.text || "text-slate-700"
                                }`}>
                                  {statusColors[record.status as keyof typeof statusColors]?.label || "?"}
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-300">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  {studentSubjects.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                        No subjects assigned for your grade & section.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* List History View */
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm animate-fade-up">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
            <h3 className="font-black text-slate-900 text-sm">Attendance History Log</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {paginatedDates.map((date) => {
              const records = byDate[date] || [];
              return (
                <div key={date} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors">
                  <div className="text-xs font-bold text-slate-600">
                    {new Date(date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {records.map((r) => {
                      const sub = state.subjects.find((s) => s.id === r.subject_id);
                      return (
                        <span
                          key={r.id}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                            r.status === "present" ? "bg-green-50 text-green-700 border-green-100" :
                            r.status === "absent" ? "bg-red-50 text-red-700 border-red-100" :
                            r.status === "late" ? "bg-yellow-50 text-yellow-700 border-yellow-100" :
                            "bg-slate-50 text-slate-700 border-slate-200"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            r.status === "present" ? "bg-green-500" :
                            r.status === "absent" ? "bg-red-500" :
                            r.status === "late" ? "bg-yellow-500" :
                            "bg-slate-400"
                          }`}></span>
                          {sub?.name || "Unknown"}: <span className="uppercase font-black">{r.status}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {sortedDates.length === 0 && (
              <div className="py-16 text-center text-slate-400 text-sm font-medium">No weekday attendance records logged yet.</div>
            )}
          </div>
          {sortedDates.length > ITEMS_PER_PAGE && (
            <div className="bg-slate-50 border-t border-slate-100 p-4">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(sortedDates.length / ITEMS_PER_PAGE)}
                onPageChange={setCurrentPage}
                showInfo={true}
                totalItems={sortedDates.length}
                itemsPerPage={ITEMS_PER_PAGE}
              />
            </div>
          )}
        </div>
      )}
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
