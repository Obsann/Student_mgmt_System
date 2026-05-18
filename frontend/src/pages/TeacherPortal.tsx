import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2, Save, UserPlus, Search, Award, TrendingUp, CalendarDays,
  LayoutGrid, List as ListIcon, X, User, Phone, MapPin, Edit3, ClipboardList, Check
} from "lucide-react";
import { useApp } from "../contexts/AppContext";
import ProfilePage from "./ProfilePage";
import StudentRegistrationForm from "../components/StudentRegistrationForm";
import { getEthiopianGrade } from "../utils/gradeCalculator";

// ============================================================
// TEACHER DASHBOARD
// ============================================================
function TeacherDashboard() {
  const navigate = useNavigate();
  const { currentUser, state, getSubjectsByTeacher } = useApp();
  const teacherId = currentUser?.ref_id || "";
  const mySubjects = getSubjectsByTeacher(teacherId);
  const teacher = state.teachers.find((t) => t.id === teacherId);

  const myMarks = state.marks.filter((m) => m.entered_by === teacherId);

  // Top performers logic
  const myStudents = state.students.filter((s) => s.grade === teacher?.assigned_grade && s.section === teacher?.assigned_section);
  
  const studentAverages = myStudents.map(student => {
    const studentMarks = myMarks.filter(m => m.student_id === student.id);
    const avg = studentMarks.length > 0 
      ? Math.round(studentMarks.reduce((sum, m) => sum + (m.score / (m.max_score || 100)) * 100, 0) / studentMarks.length)
      : 0;
    return { ...student, avg };
  }).filter(s => s.avg > 0).sort((a, b) => b.avg - a.avg).slice(0, 3);

  const upcomingEvents = [
    { title: "Mid-Term Examinations", date: "Oct 15, 2025", type: "Exam" },
    { title: "Parent-Teacher Meeting", date: "Oct 22, 2025", type: "Meeting" },
    { title: "Staff Development Day", date: "Nov 05, 2025", type: "Holiday" }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden animate-fade-scale group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 transition-transform duration-700 group-hover:scale-110"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold tracking-wider mb-4 border border-white/20 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              SEMESTER 1 ONGOING
            </div>
            <h2 className="text-3xl font-black">Welcome back, {teacher?.name || currentUser?.name}!</h2>
            <p className="text-blue-100 text-sm mt-2 font-medium max-w-lg">
              You have {mySubjects.length} subjects to manage today. Your class overall performance is looking solid this week. Keep up the great work!
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-blue-100 uppercase tracking-widest mb-1">Current Date</div>
            <div className="text-2xl font-bold">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <button onClick={() => navigate("/attendance")} className="bg-white border border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center gap-3 hover:shadow-md hover:border-blue-200 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform"><CheckCircle2 /></div>
              <span className="text-xs font-bold text-slate-600">Attendance</span>
            </button>
            <button onClick={() => navigate("/marks")} className="bg-white border border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center gap-3 hover:shadow-md hover:indigo-200 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform"><Edit3 /></div>
              <span className="text-xs font-bold text-slate-600">Enter Marks</span>
            </button>
            <button onClick={() => navigate("/students")} className="bg-white border border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center gap-3 hover:shadow-md hover:purple-200 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform"><User /></div>
              <span className="text-xs font-bold text-slate-600">My Students</span>
            </button>
            <button onClick={() => navigate("/register")} className="bg-white border border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center gap-3 hover:shadow-md hover:emerald-200 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform"><UserPlus /></div>
              <span className="text-xs font-bold text-slate-600">Register</span>
            </button>
          </div>

          {/* Subjects Overview */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-extrabold text-slate-900 flex items-center gap-2"><TrendingUp className="text-blue-500 w-5 h-5"/> Subject Overview</h3>
            </div>
            <div className="space-y-4">
              {mySubjects.map(sub => {
                const subMarks = myMarks.filter(m => m.subject_id === sub.id);
                const avg = subMarks.length > 0 ? Math.round(subMarks.reduce((sum, m) => sum + (m.score / (m.max_score||100))*100, 0) / subMarks.length) : 0;
                
                return (
                  <div key={sub.id} className="p-4 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <div className="font-bold text-sm text-slate-900">{sub.name} <span className="text-xs text-slate-400 font-normal ml-2">Grade {sub.grade}</span></div>
                      </div>
                      <div className="font-mono font-bold text-sm">{avg > 0 ? `${avg}%` : 'N/A'}</div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className={`h-2 rounded-full transition-all duration-1000 ${avg >= 80 ? 'bg-green-500' : avg >= 60 ? 'bg-blue-500' : 'bg-yellow-500'}`} style={{ width: `${avg}%` }}></div>
                    </div>
                  </div>
                )
              })}
              {mySubjects.length === 0 && <div className="text-sm text-slate-500 text-center py-4">No subjects assigned yet.</div>}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Top Performers */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-2 mb-6">
              <Award className="text-orange-500 w-5 h-5" />
              <h3 className="font-extrabold text-slate-900">Top Performers</h3>
            </div>
            <div className="space-y-4">
              {studentAverages.length > 0 ? studentAverages.map((student, idx) => (
                <div key={student.id} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${idx === 0 ? 'bg-orange-100 text-orange-600' : idx === 1 ? 'bg-slate-100 text-slate-600' : 'bg-orange-50 text-orange-800'}`}>
                    #{idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-slate-900 truncate">{student.first_name} {student.last_name}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest">{student.roll_number}</div>
                  </div>
                  <div className="font-mono font-bold text-sm text-green-600">{student.avg}%</div>
                </div>
              )) : (
                <div className="text-xs text-slate-500 text-center py-4">Enter marks to see top performers.</div>
              )}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-2 mb-6">
              <CalendarDays className="text-indigo-500 w-5 h-5" />
              <h3 className="font-extrabold text-slate-900">Upcoming Events</h3>
            </div>
            <div className="space-y-4">
              {upcomingEvents.map((evt, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{evt.title}</div>
                    <div className="text-xs text-slate-500 mt-1">{evt.date} • {evt.type}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// TAKE ATTENDANCE
// ============================================================
function TakeAttendance() {
  const { currentUser, state, recordAttendance, getSubjectsByTeacher, getAttendanceForDate } = useApp();
  const teacherId = currentUser?.ref_id || "";
  const mySubjects = getSubjectsByTeacher(teacherId);

  const [selectedSubject, setSelectedSubject] = useState(mySubjects[0]?.id || "");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [records, setRecords] = useState<Record<string, "present" | "absent" | "late" | "excused">>({});
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  const teacher = state.teachers.find((t) => t.id === teacherId);
  const students = teacher
    ? state.students
        .filter((s) => s.grade === teacher.assigned_grade && s.section === teacher.assigned_section)
        .sort((a, b) => a.last_name.localeCompare(b.last_name))
    : [];

  useEffect(() => {
    if (selectedSubject && selectedDate) {
      const existing = getAttendanceForDate(selectedSubject, selectedDate);
      if (existing.length > 0) {
        const loaded: Record<string, "present" | "absent" | "late" | "excused"> = {};
        existing.forEach((a) => { loaded[a.student_id] = a.status; });
        setRecords(loaded);
        setSubmitted(true);
      } else {
        const defaults: Record<string, "present" | "absent" | "late" | "excused"> = {};
        students.forEach((s) => { defaults[s.id] = "present"; });
        setRecords(defaults);
        setSubmitted(false);
      }
    }
  }, [selectedSubject, selectedDate, students.length]);

  const cycleStatus = (studentId: string) => {
    setRecords((prev) => {
      const cycle: Record<string, "present" | "absent" | "late"> = { present: "absent", absent: "late", late: "present" };
      return { ...prev, [studentId]: cycle[prev[studentId]] || "absent" };
    });
    setSubmitted(false);
  };

  const setStatus = (studentId: string, status: "present" | "absent" | "late" | "excused") => {
    setRecords((prev) => ({ ...prev, [studentId]: status }));
    setSubmitted(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const student = students[index];
    if (!student) return;
    switch (e.key.toLowerCase()) {
      case "p": e.preventDefault(); setStatus(student.id, "present"); if (index < students.length - 1) { setFocusedIndex(index + 1); rowRefs.current[index + 1]?.focus(); } break;
      case "a": e.preventDefault(); setStatus(student.id, "absent"); if (index < students.length - 1) { setFocusedIndex(index + 1); rowRefs.current[index + 1]?.focus(); } break;
      case "l": e.preventDefault(); setStatus(student.id, "late"); if (index < students.length - 1) { setFocusedIndex(index + 1); rowRefs.current[index + 1]?.focus(); } break;
      case "arrowdown": e.preventDefault(); if (index < students.length - 1) { setFocusedIndex(index + 1); rowRefs.current[index + 1]?.focus(); } break;
      case "arrowup": e.preventDefault(); if (index > 0) { setFocusedIndex(index - 1); rowRefs.current[index - 1]?.focus(); } break;
    }
  };

  const handleSubmit = () => {
    const attendanceRecords = Object.entries(records).map(([studentId, status]) => ({
      student_id: studentId,
      subject_id: selectedSubject,
      date: selectedDate,
      status,
      recorded_by: teacherId,
    }));
    recordAttendance(attendanceRecords);
    setSubmitted(true);
  };

  const counts = {
    present: students.filter((s) => records[s.id] === "present").length,
    absent: students.filter((s) => records[s.id] === "absent").length,
    late: students.filter((s) => records[s.id] === "late").length,
    excused: students.filter((s) => records[s.id] === "excused").length,
  };

  const markAllPresent = () => {
    const all: Record<string, "present" | "absent" | "late" | "excused"> = {};
    students.forEach((s) => { all[s.id] = "present"; });
    setRecords(all);
    setSubmitted(false);
  };

  // Generate mock history chart data based on overall records
  const chartDays = Array.from({length: 7}).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const ds = d.toISOString().split("T")[0];
    const recs = state.attendance.filter(a => a.date === ds && a.subject_id === selectedSubject);
    const p = recs.filter(r => r.status === 'present').length;
    const a = recs.filter(r => r.status === 'absent').length;
    const l = recs.filter(r => r.status === 'late').length;
    const total = p + a + l || 1;
    return { date: d.toLocaleDateString('en-US', {weekday: 'short'}), p: Math.round(p/total*100), a: Math.round(a/total*100) };
  });

  return (
    <div className="space-y-6">
      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
        <div className="bg-white border border-slate-100 p-4 rounded-3xl shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Present</div>
          <div className="text-2xl font-black text-green-600">{counts.present}</div>
        </div>
        <div className="bg-white border border-slate-100 p-4 rounded-3xl shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Absent</div>
          <div className="text-2xl font-black text-red-600">{counts.absent}</div>
        </div>
        <div className="bg-white border border-slate-100 p-4 rounded-3xl shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Late</div>
          <div className="text-2xl font-black text-yellow-600">{counts.late}</div>
        </div>
        <div className="bg-white border border-slate-100 p-4 rounded-3xl shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Excused</div>
          <div className="text-2xl font-black text-slate-600">{counts.excused}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all animate-fade-in">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-medium text-slate-600 mb-1">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => { setSelectedSubject(e.target.value); setSubmitted(false); }}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            >
              {mySubjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name} (Grade {s.grade})</option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-auto">
            <label className="block text-xs font-medium text-slate-600 mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => { setSelectedDate(e.target.value); setSubmitted(false); }}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <div className="w-full md:w-auto flex justify-between md:block">
            <button onClick={markAllPresent} className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors whitespace-nowrap flex items-center gap-2">
              <Check className="w-4 h-4"/> Mark All Present
            </button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-[10px] text-blue-600 bg-blue-50 px-3 py-1 rounded-lg font-bold uppercase tracking-widest">
            ⌨️ Shortcuts: P (Present), A (Absent), L (Late), ↑↓ (Navigate)
          </div>
          {submitted && <div className="text-xs font-bold text-green-600 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Saved</div>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Student List */}
          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all animate-fade-up">
            <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto custom-scrollbar">
              {students.map((student, index) => {
                const status = records[student.id] || "present";
                const isFocused = focusedIndex === index;
                const initials = student.first_name[0] + student.last_name[0];
                return (
                  <div
                    key={student.id}
                    ref={(el) => { rowRefs.current[index] = el; }}
                    tabIndex={0}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onClick={() => cycleStatus(student.id)}
                    className={`flex items-center gap-4 px-6 py-4 cursor-pointer transition-all outline-none ${
                      isFocused ? "ring-2 ring-blue-400 ring-inset bg-blue-50/50" : "hover:bg-slate-50"
                    }`}
                  >
                    <span className="w-6 text-center text-xs font-bold text-slate-400">{index + 1}</span>
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600 shrink-0">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-slate-900 truncate">
                        {student.first_name} {student.last_name}
                      </div>
                      <div className="text-xs text-slate-500 font-mono">{student.roll_number}</div>
                    </div>
                    <div className="shrink-0 flex gap-1">
                       <button onClick={(e) => { e.stopPropagation(); setStatus(student.id, "present"); }} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${status === 'present' ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}>P</button>
                       <button onClick={(e) => { e.stopPropagation(); setStatus(student.id, "absent"); }} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${status === 'absent' ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}>A</button>
                       <button onClick={(e) => { e.stopPropagation(); setStatus(student.id, "late"); }} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${status === 'late' ? 'bg-yellow-500 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}>L</button>
                    </div>
                  </div>
                );
              })}
              {students.length === 0 && (
                <div className="py-16 flex flex-col items-center justify-center text-slate-400">
                  <ClipboardList className="w-12 h-12 mb-3 text-slate-200" />
                  <p className="text-sm font-medium">Select a subject to see students</p>
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          {students.length > 0 && (
            <button
              onClick={handleSubmit}
              disabled={submitted}
              className={`w-full py-4 mt-6 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                submitted
                  ? "bg-green-100 text-green-700 border border-green-200 shadow-inner"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40"
              }`}
            >
              {submitted ? (
                <><CheckCircle2 size={18} /> Attendance Submitted Successfully</>
              ) : (
                <><Save size={18} /> Save Attendance for {selectedDate}</>
              )}
            </button>
          )}
        </div>

        <div className="hidden lg:block">
           <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm sticky top-24">
              <h3 className="font-extrabold text-slate-900 mb-6">Attendance Trend (7 Days)</h3>
              <div className="h-48 flex items-end justify-between gap-2">
                 {chartDays.map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="w-full flex-1 bg-slate-50 rounded-t-md relative overflow-hidden flex flex-col justify-end">
                         {/* Absent red bar */}
                         <div className="w-full bg-red-400 transition-all duration-500" style={{ height: `${d.a}%` }}></div>
                         {/* Present green bar */}
                         <div className="w-full bg-green-400 transition-all duration-500" style={{ height: `${d.p}%` }}></div>
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">{d.date}</div>
                    </div>
                 ))}
              </div>
              <div className="flex items-center justify-center gap-4 mt-6 text-xs font-bold text-slate-500">
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-green-400"></div> Present</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-red-400"></div> Absent</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ENTER MARKS
// ============================================================
function EnterMarks() {
  const { currentUser, state, enterMarks, getSubjectsByTeacher } = useApp();
  const teacherId = currentUser?.ref_id || "";
  const mySubjects = getSubjectsByTeacher(teacherId);

  const [selectedSubject, setSelectedSubject] = useState(mySubjects[0]?.id || "");
  const [assessmentType, setAssessmentType] = useState<"quiz" | "midterm" | "final" | "assignment">("quiz");
  const [scores, setScores] = useState<Record<string, string>>({});
  const [remarks, setRemarks] = useState<Record<string, string>>({});
  const [maxScore, setMaxScore] = useState(100);
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const teacher = state.teachers.find((t) => t.id === teacherId);
  const students = teacher
    ? state.students.filter((s) => s.grade === teacher.assigned_grade && s.section === teacher.assigned_section).sort((a, b) => a.last_name.localeCompare(b.last_name))
    : [];

  useEffect(() => {
    const loaded: Record<string, string> = {};
    const savedState: Record<string, boolean> = {};
    const remarksLoaded: Record<string, string> = {};
    students.forEach((student) => {
      const existing = state.marks.find(
        (m) =>
          m.student_id === student.id &&
          m.subject_id === selectedSubject &&
          m.assessment_type === assessmentType &&
          m.semester === 1
      );
      if (existing) {
        loaded[student.id] = String(existing.score);
        savedState[student.id] = true;
      } else {
        loaded[student.id] = "";
        savedState[student.id] = false;
      }
      remarksLoaded[student.id] = existing?.remarks || "";
    });
    setScores(loaded);
    setRemarks(remarksLoaded);
    setSaved(savedState);
    setSubmitted(false);
  }, [selectedSubject, assessmentType, students.length]);

  const handleScoreChange = (studentId: string, value: string) => {
    if (value !== "" && (isNaN(Number(value)) || Number(value) < 0 || Number(value) > maxScore)) return;
    setScores((prev) => ({ ...prev, [studentId]: value }));
    setSaved((prev) => ({ ...prev, [studentId]: false }));
    setSubmitted(false);
  };

  const handleRemarkChange = (studentId: string, value: string) => {
    setRemarks((prev) => ({ ...prev, [studentId]: value }));
    setSaved((prev) => ({ ...prev, [studentId]: false }));
    setSubmitted(false);
  };

  const handleSubmit = async () => {
    const marks = Object.entries(scores)
      .filter(([, score]) => score !== "")
      .map(([studentId, score]) => ({
        student_id: studentId,
        subject_id: selectedSubject,
        academic_year: "2025/2026",
        semester: 1,
        assessment_type: assessmentType,
        score: Number(score),
        max_score: maxScore,
        remarks: remarks[studentId] || "",
        entered_by: teacherId,
      }));
    if (marks.length === 0) return;
    await enterMarks(marks);
    setSubmitted(true);
    const allSaved: Record<string, boolean> = {};
    Object.keys(scores).forEach((id) => { if (scores[id] !== "") allSaved[id] = true; });
    setSaved(allSaved);
  };

  const enteredScores = Object.values(scores).filter(s => s !== "").map(Number);
  const enteredCount = enteredScores.length;
  const avgScore = enteredCount > 0 ? Math.round(enteredScores.reduce((a,b)=>a+b,0)/enteredCount) : 0;
  const highest = enteredCount > 0 ? Math.max(...enteredScores) : 0;
  const lowest = enteredCount > 0 ? Math.min(...enteredScores) : 0;

  // Grade Distribution
  const dist = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  enteredScores.forEach(s => {
    const p = (s / maxScore) * 100;
    if (p >= 90) dist.A++;
    else if (p >= 80) dist.B++;
    else if (p >= 60) dist.C++;
    else if (p >= 50) dist.D++;
    else dist.F++;
  });
  const maxDist = Math.max(dist.A, dist.B, dist.C, dist.D, dist.F, 1);

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
        <div className="bg-white border border-slate-100 p-4 rounded-3xl shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Class Average</div>
          <div className="text-2xl font-black text-slate-900">{avgScore}<span className="text-base text-slate-400">/{maxScore}</span></div>
        </div>
        <div className="bg-white border border-slate-100 p-4 rounded-3xl shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Highest</div>
          <div className="text-2xl font-black text-green-600">{highest}</div>
        </div>
        <div className="bg-white border border-slate-100 p-4 rounded-3xl shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Lowest</div>
          <div className="text-2xl font-black text-red-600">{lowest}</div>
        </div>
        <div className="bg-white border border-slate-100 p-4 rounded-3xl shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Entered</div>
          <div className="text-2xl font-black text-blue-600">{enteredCount}<span className="text-base text-slate-400">/{students.length}</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          {/* Controls */}
          <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Subject</label>
                <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
                  {mySubjects.map((s) => <option key={s.id} value={s.id}>{s.name} (Grade {s.grade})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Assessment</label>
                <select value={assessmentType} onChange={(e) => setAssessmentType(e.target.value as typeof assessmentType)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
                  <option value="quiz">Quiz</option>
                  <option value="assignment">Assignment</option>
                  <option value="midterm">Midterm</option>
                  <option value="final">Final Exam</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Max Score</label>
                <input type="number" min={1} value={maxScore} onChange={(e) => setMaxScore(Number(e.target.value) || 100)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm animate-fade-up">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="text-left py-4 px-6 w-10">#</th>
                    <th className="text-left py-4 px-6">Student</th>
                    <th className="text-left py-4 px-6 w-32">Score</th>
                    <th className="text-left py-4 px-6">Status</th>
                    <th className="text-left py-4 px-6 hidden sm:table-cell">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {students.map((student, i) => {
                    const val = scores[student.id] ?? "";
                    const isSaved = saved[student.id];
                    const score = Number(val);
                    const percent = val !== "" ? (score / maxScore) * 100 : null;
                    const gradeInfo = percent !== null ? getEthiopianGrade(percent) : null;

                    let statusBadge = null;
                    if (percent !== null) {
                      if (percent >= 80) statusBadge = <span className="px-2.5 py-1 rounded-lg text-[10px] font-black tracking-widest bg-emerald-100 text-emerald-700">EXCELLENT</span>;
                      else if (percent >= 60) statusBadge = <span className="px-2.5 py-1 rounded-lg text-[10px] font-black tracking-widest bg-blue-100 text-blue-700">SATISFACTORY</span>;
                      else statusBadge = <span className="px-2.5 py-1 rounded-lg text-[10px] font-black tracking-widest bg-red-100 text-red-700">NEEDS WORK</span>;
                    }

                    return (
                      <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="py-3 px-6 text-xs font-bold text-slate-400">{i + 1}</td>
                        <td className="py-3 px-6">
                          <div className="font-bold text-slate-900">{student.first_name} {student.last_name}</div>
                          <div className="text-xs font-mono text-slate-400">{student.roll_number}</div>
                        </td>
                        <td className="py-3 px-6">
                          <div className="relative">
                            <input
                              type="number" min={0} max={maxScore} value={val}
                              onChange={(e) => handleScoreChange(student.id, e.target.value)}
                              className={`w-full font-bold text-lg py-2 px-3 rounded-xl border-2 outline-none transition-all ${
                                isSaved ? "border-green-200 bg-green-50 text-green-700" :
                                val !== "" ? "border-yellow-300 bg-yellow-50 text-slate-900 shadow-[0_0_15px_rgba(253,224,71,0.3)]" :
                                "border-slate-100 text-slate-900 bg-slate-50 group-hover:border-slate-300"
                              } focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10`}
                            />
                            {gradeInfo && <div className={`absolute -right-2 -top-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow-sm ${gradeInfo.color}`}>{gradeInfo.grade}</div>}
                          </div>
                        </td>
                        <td className="py-3 px-6">{statusBadge}</td>
                        <td className="py-3 px-6 hidden sm:table-cell">
                          <input
                            type="text" placeholder="Add note..." value={remarks[student.id] || ""}
                            onChange={(e) => handleRemarkChange(student.id, e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-transparent text-xs font-medium outline-none focus:border-blue-400 focus:bg-white"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {students.length === 0 && (
                <div className="py-16 text-center text-slate-400">
                  <ClipboardList className="w-12 h-12 mx-auto mb-3 text-slate-200" />
                  <p className="text-sm font-medium">Select a subject to see students</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Submit Button */}
          {students.length > 0 && (
            <button
              onClick={handleSubmit}
              disabled={submitted || enteredCount === 0}
              className={`w-full py-4 rounded-3xl font-black tracking-wide text-sm transition-all flex items-center justify-center gap-2 ${
                submitted ? "bg-green-100 text-green-700 border border-green-200" :
                enteredCount === 0 ? "bg-slate-100 text-slate-400 cursor-not-allowed" :
                "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-1"
              }`}
            >
              {submitted ? <><CheckCircle2 size={18} /> SAVED</> : <><Save size={18} /> SAVE MARKS</>}
            </button>
          )}

          {/* Grade Distribution */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm sticky top-24">
            <h3 className="font-extrabold text-slate-900 mb-6 flex items-center gap-2"><LayoutGrid className="w-5 h-5 text-purple-500"/> Distribution</h3>
            <div className="space-y-4">
              {[
                { g: 'A', c: dist.A, col: 'bg-green-500' },
                { g: 'B', c: dist.B, col: 'bg-blue-500' },
                { g: 'C', c: dist.C, col: 'bg-yellow-500' },
                { g: 'D', c: dist.D, col: 'bg-orange-500' },
                { g: 'F', c: dist.F, col: 'bg-red-500' }
              ].map(item => (
                <div key={item.g} className="flex items-center gap-3">
                  <div className="w-6 font-black text-slate-600">{item.g}</div>
                  <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${item.col} transition-all duration-1000`} style={{ width: `${(item.c/maxDist)*100}%` }}></div>
                  </div>
                  <div className="w-6 text-right font-bold text-slate-400 text-sm">{item.c}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// VIEW MY STUDENTS
// ============================================================
function ViewStudents() {
  const { currentUser, state, getSubjectsByTeacher } = useApp();
  const teacherId = currentUser?.ref_id || "";
  const mySubjects = getSubjectsByTeacher(teacherId);
  const [selectedSubject, setSelectedSubject] = useState(mySubjects[0]?.id || "");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid"|"list">("list");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const teacher = state.teachers.find((t) => t.id === teacherId);
  const students = teacher
    ? state.students.filter((s) => s.grade === teacher.assigned_grade && s.section === teacher.assigned_section).sort((a, b) => a.last_name.localeCompare(b.last_name))
    : [];

  const filteredStudents = students.filter(s => 
    s.first_name.toLowerCase().includes(search.toLowerCase()) || 
    s.last_name.toLowerCase().includes(search.toLowerCase()) ||
    s.roll_number.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
        <div className="bg-white border border-slate-100 p-4 rounded-3xl shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Students</div>
          <div className="text-2xl font-black text-slate-900">{students.length}</div>
        </div>
        <div className="bg-white border border-slate-100 p-4 rounded-3xl shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Male</div>
          <div className="text-2xl font-black text-blue-600">{students.filter(s=>s.gender==='Male').length}</div>
        </div>
        <div className="bg-white border border-slate-100 p-4 rounded-3xl shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Female</div>
          <div className="text-2xl font-black text-pink-600">{students.filter(s=>s.gender==='Female').length}</div>
        </div>
        <div className="bg-white border border-slate-100 p-4 rounded-3xl shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Grade/Section</div>
          <div className="text-2xl font-black text-indigo-600">{teacher?.assigned_grade}{teacher?.assigned_section}</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
        <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="w-full sm:w-64 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
          {mySubjects.map((s) => <option key={s.id} value={s.id}>{s.name} (Grade {s.grade})</option>)}
        </select>
        
        <div className="flex w-full sm:w-auto items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" placeholder="Search students..." 
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
            />
          </div>
          <div className="flex items-center bg-slate-100 rounded-xl p-1 shrink-0">
            <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
              <ListIcon className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
                  <th className="text-left py-4 px-6">Name</th>
                  <th className="text-left py-4 px-6">Roll #</th>
                  <th className="text-left py-4 px-6 hidden sm:table-cell">Gender</th>
                  <th className="text-center py-4 px-6">Avg Score</th>
                  <th className="text-right py-4 px-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredStudents.map((student) => {
                  const marks = state.marks.filter((m) => m.student_id === student.id && m.subject_id === selectedSubject);
                  const avg = marks.length > 0 ? Math.round(marks.reduce((sum, m) => sum + (m.score/(m.max_score||100))*100, 0) / marks.length) : 0;
                  const grade = getEthiopianGrade(avg);
                  return (
                    <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-600">
                             {student.first_name[0]}{student.last_name[0]}
                           </div>
                           <span className="font-bold text-slate-900">{student.first_name} {student.last_name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-mono text-slate-500 text-xs">{student.roll_number}</td>
                      <td className="py-4 px-6 hidden sm:table-cell">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${student.gender === "Male" ? "bg-blue-50 text-blue-600" : "bg-pink-50 text-pink-600"}`}>{student.gender}</span>
                      </td>
                      <td className="py-4 px-6 text-center">
                         {marks.length > 0 ? (
                           <div className="inline-flex items-center gap-2">
                             <span className="font-bold text-slate-900">{avg}%</span>
                             <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-black ${grade.color}`}>{grade.grade}</span>
                           </div>
                         ) : <span className="text-slate-300 font-bold">—</span>}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button onClick={() => setSelectedStudent(student)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors">
                          View Profile
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredStudents.map((student) => {
             const marks = state.marks.filter((m) => m.student_id === student.id && m.subject_id === selectedSubject);
             const avg = marks.length > 0 ? Math.round(marks.reduce((sum, m) => sum + (m.score/(m.max_score||100))*100, 0) / marks.length) : 0;
             const grade = getEthiopianGrade(avg);
             return (
              <div key={student.id} onClick={() => setSelectedStudent(student)} className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group">
                 <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-black text-slate-500 text-lg shadow-inner">
                      {student.first_name[0]}{student.last_name[0]}
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${student.gender === "Male" ? "bg-blue-50 text-blue-600" : "bg-pink-50 text-pink-600"}`}>{student.gender}</span>
                 </div>
                 <h4 className="font-extrabold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{student.first_name}</h4>
                 <div className="font-bold text-slate-500 text-sm mb-4">{student.last_name}</div>
                 <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="text-xs font-mono text-slate-400">{student.roll_number}</div>
                    {marks.length > 0 ? (
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-slate-900">{avg}%</span>
                        <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-black ${grade.color}`}>{grade.grade}</span>
                      </div>
                    ) : <span className="text-xs font-bold text-slate-300">No marks</span>}
                 </div>
              </div>
             )
          })}
        </div>
      )}

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setSelectedStudent(null)}>
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-fade-scale" onClick={e => e.stopPropagation()}>
            <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
               <button onClick={() => setSelectedStudent(null)} className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white backdrop-blur-md transition-colors"><X className="w-5 h-5"/></button>
            </div>
            <div className="px-8 pb-8">
               <div className="-mt-12 flex justify-between items-end mb-6">
                 <div className="w-24 h-24 rounded-3xl bg-white p-1.5 shadow-lg">
                    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-3xl font-black text-slate-400">
                      {selectedStudent.first_name[0]}{selectedStudent.last_name[0]}
                    </div>
                 </div>
                 <div className="flex gap-2">
                   <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-colors flex items-center gap-2"><MapPin className="w-4 h-4"/> View Address</button>
                   <button className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl text-sm font-bold transition-colors flex items-center gap-2"><Phone className="w-4 h-4"/> Contact Parent</button>
                 </div>
               </div>
               
               <h2 className="text-3xl font-black text-slate-900 mb-1">{selectedStudent.first_name} {selectedStudent.middle_name} {selectedStudent.last_name}</h2>
               <div className="flex items-center gap-3 text-sm font-bold text-slate-500 mb-8">
                 <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">Grade {selectedStudent.grade}{selectedStudent.section}</span>
                 <span>•</span>
                 <span className="font-mono">{selectedStudent.roll_number}</span>
                 <span>•</span>
                 <span>{selectedStudent.gender}</span>
               </div>

               <div className="grid grid-cols-2 gap-4 mb-8">
                 <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Parent/Guardian</div>
                    <div className="font-bold text-slate-900">{selectedStudent.guardian_name} <span className="text-slate-400 font-medium">({selectedStudent.guardian_relation})</span></div>
                    <div className="text-sm text-slate-500 mt-1">{selectedStudent.parent_phone}</div>
                 </div>
                 <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Previous School</div>
                    <div className="font-bold text-slate-900">{selectedStudent.previous_school || 'N/A'}</div>
                    <div className="text-sm text-slate-500 mt-1">Grade 8 GPA: {selectedStudent.grade_8_gpa}</div>
                 </div>
               </div>

               <div className="flex gap-3">
                 <button className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-colors">Full Academic Record</button>
                 <button className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors">Attendance History</button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// ENROLL STUDENT
// ============================================================
function EnrollStudent() {
  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden animate-fade-scale group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 transition-transform duration-700 group-hover:scale-110"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm group-hover:rotate-12 transition-transform">
              <UserPlus size={28} />
            </div>
            <h2 className="text-2xl font-black">Student Registration</h2>
          </div>
          <p className="text-blue-100 text-sm font-medium leading-relaxed max-w-xl">
            Register new students for the academic year. As a Home Room teacher, you have full authority to activate students and issue their credentials immediately.
          </p>
        </div>
      </div>
      <StudentRegistrationForm />
    </div>
  );
}

// ============================================================
// MAIN TEACHER PORTAL
// ============================================================
export default function TeacherPortal({ activePage }: { activePage: string }) {
  switch (activePage) {
    case "dashboard": return <TeacherDashboard />;
    case "attendance": return <TakeAttendance />;
    case "marks": return <EnterMarks />;
    case "students": return <ViewStudents />;
    case "register": return <EnrollStudent />;
    case "profile": return <ProfilePage />;
    default: return <TeacherDashboard />;
  }
}
