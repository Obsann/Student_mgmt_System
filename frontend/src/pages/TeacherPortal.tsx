import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2, Save, UserPlus, Search, Award, TrendingUp, CalendarDays, BookOpen,
  LayoutGrid, List as ListIcon, X, User, Phone, MapPin, Edit3, ClipboardList, Check, AlertTriangle, Home, MessageSquare, Eye
} from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { api } from "../services/api";
import ProfilePage from "./ProfilePage";
import StudentRegistrationForm from "../components/StudentRegistrationForm";
import Pagination from "../components/Pagination";

// ============================================================
// TEACHER DASHBOARD
// ============================================================
function TeacherDashboard() {
  const navigate = useNavigate();
  const { currentUser, state, getSubjectsByTeacher } = useApp();
  const teacherId = currentUser?.ref_id || "";
  const mySubjects = getSubjectsByTeacher(teacherId);
  const teacher = state.teachers.find((t) => t.id === teacherId);

  const userId = currentUser?.id || "";
  const myMarks = state.marks.filter((m) => m.entered_by === userId);

  // Top performers logic
  const myStudents = state.students.filter((s) => s.grade === teacher?.assigned_grade && s.section === teacher?.assigned_section);
  
  const studentAverages = myStudents.map(student => {
    const studentMarks = myMarks.filter(m => m.student_id === student.id);
    const avg = studentMarks.length > 0 
      ? Math.round(studentMarks.reduce((sum, m) => sum + (m.score / (m.max_score || 100)) * 100, 0) / studentMarks.length)
      : 0;
    return { ...student, avg };
  }).filter(s => s.avg > 0).sort((a, b) => b.avg - a.avg).slice(0, 3);

  const recentMarks = [...myMarks].reverse().slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-sm relative overflow-hidden animate-fade-scale group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 transition-transform duration-700 group-hover:scale-110"></div>
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
            <button onClick={() => navigate("/homeroom")} className="bg-white border border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center gap-3 hover:shadow-md hover:border-blue-200 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform"><Home /></div>
              <span className="text-xs font-bold text-slate-600">My Homeroom</span>
            </button>
            <button onClick={() => navigate("/marks")} className="bg-white border border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center gap-3 hover:shadow-md hover:border-indigo-200 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform"><Edit3 /></div>
              <span className="text-xs font-bold text-slate-600">Enter Marks</span>
            </button>
            <button onClick={() => navigate("/students")} className="bg-white border border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center gap-3 hover:shadow-md hover:border-purple-200 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform"><User /></div>
              <span className="text-xs font-bold text-slate-600">My Students</span>
            </button>
            <button onClick={() => navigate("/guide")} className="bg-white border border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center gap-3 hover:shadow-md hover:border-emerald-200 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform"><BookOpen /></div>
              <span className="text-xs font-bold text-slate-600">Help Guide</span>
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

          {/* Recent Mark Entries */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-2 mb-6">
              <ClipboardList className="text-indigo-500 w-5 h-5" />
              <h3 className="font-extrabold text-slate-900">Recent Marks Entered</h3>
            </div>
            <div className="space-y-4">
              {recentMarks.map((mark, idx) => {
                const student = state.students.find(s => s.id === mark.student_id);
                const subject = state.subjects.find(s => s.id === mark.subject_id);
                return (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{student?.first_name} {student?.last_name}</div>
                      <div className="text-xs text-slate-500 mt-1">{subject?.name} • {mark.assessment_type} • Score: {mark.score}/{mark.max_score}</div>
                    </div>
                  </div>
                )
              })}
              {recentMarks.length === 0 && <div className="text-xs text-slate-500 text-center py-4">No marks entered yet.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MY HOMEROOM (LEGIT ATTENDANCE & ROSTER)
// ============================================================
function MyHomeroom() {
  const { currentUser, state, recordAttendance, getSubjectsByTeacher } = useApp();
  const navigate = useNavigate();
  const teacherId = currentUser?.ref_id || "";
  const teacher = state.teachers.find((t) => t.id === teacherId);
  const mySubjects = getSubjectsByTeacher(teacherId);

  const [activeTab, setActiveTab] = useState<"register" | "roster" | "history">("register");
  const [selectedSubject, setSelectedSubject] = useState(mySubjects[0]?.id || "");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  
  // Attendance register state
  const [records, setRecords] = useState<Record<string, { status: "present" | "absent" | "late" | "excused"; remarks: string }>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Student roster state
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [modalTab, setModalTab] = useState<"info" | "address" | "parent" | "academic" | "attendance">("info");

  const targetGrade = teacher?.assigned_grade || "";
  const targetSection = teacher?.assigned_section || "";
  const hasHomeroom = targetGrade && targetSection;

  const homeroomStudents = hasHomeroom
    ? state.students
        .filter((s) => s.grade === targetGrade && s.section === targetSection)
        .sort((a, b) => a.last_name.localeCompare(b.last_name))
    : [];

  const filteredStudents = homeroomStudents.filter(s => 
    `${s.first_name} ${s.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
    s.roll_number.toLowerCase().includes(search.toLowerCase())
  );

  // Load attendance data when subject or date changes
  useEffect(() => {
    if (selectedSubject && selectedDate && homeroomStudents.length > 0) {
      const targetDateStr = selectedDate;
      const existing = state.attendance.filter(
        (a) => a.subject_id === selectedSubject && a.date.startsWith(targetDateStr)
      );
      
      const newRecords: Record<string, { status: "present" | "absent" | "late" | "excused"; remarks: string }> = {};
      
      homeroomStudents.forEach((student) => {
        const record = existing.find((a) => a.student_id === student.id);
        if (record) {
          newRecords[student.id] = {
            status: record.status,
            remarks: record.remarks || "",
          };
        } else {
          newRecords[student.id] = {
            status: "present",
            remarks: "",
          };
        }
      });
      
      setRecords(newRecords);
      setSubmitted(existing.length > 0);
    }
  }, [selectedSubject, selectedDate, homeroomStudents.length, state.attendance]);

  if (!hasHomeroom) {
    return (
      <div className="flex flex-col items-center justify-center p-16 bg-white rounded-3xl border border-slate-100 shadow-sm text-center animate-fade-in min-h-[400px]">
        <div className="w-20 h-20 rounded-3xl bg-amber-50 text-amber-500 flex items-center justify-center mb-6">
          <AlertTriangle size={40} className="stroke-[1.5]" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-3">No Homeroom Assigned Classroom</h3>
        <p className="text-slate-500 text-sm max-w-sm leading-relaxed mb-6">
          You have no homeroom assigned classroom. Please contact the school administrator to assign you a grade and section.
        </p>
        <button 
          onClick={() => navigate("/dashboard")}
          className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-slate-900/10"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Calculate counts
  const totalStudents = homeroomStudents.length;
  const counts = {
    present: Object.values(records).filter((r) => r.status === "present").length,
    absent: Object.values(records).filter((r) => r.status === "absent").length,
    late: Object.values(records).filter((r) => r.status === "late").length,
    excused: Object.values(records).filter((r) => r.status === "excused").length,
  };

  const markAllStatus = (status: "present" | "absent" | "late" | "excused") => {
    const all: Record<string, { status: "present" | "absent" | "late" | "excused"; remarks: string }> = {};
    homeroomStudents.forEach((s) => {
      all[s.id] = { status, remarks: records[s.id]?.remarks || "" };
    });
    setRecords(all);
    setSubmitted(false);
  };

  const setStatus = (studentId: string, status: "present" | "absent" | "late" | "excused") => {
    setRecords((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], status },
    }));
    setSubmitted(false);
  };

  const setRemark = (studentId: string, remarks: string) => {
    setRecords((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], remarks },
    }));
    setSubmitted(false);
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const attendanceRecords = Object.entries(records).map(([studentId, data]) => ({
        student_id: studentId,
        subject_id: selectedSubject,
        date: selectedDate,
        status: data.status,
        remarks: data.remarks,
        recorded_by: teacherId,
      }));
      await recordAttendance(attendanceRecords);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // 14 Days History Grid Data
  const getPastDates = () => {
    const dates = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      // Skip weekends to make it a legit school register
      const day = d.getDay();
      if (day !== 0 && day !== 6) {
        dates.push(d.toISOString().split("T")[0]);
      }
    }
    return dates;
  };
  const historyDates = getPastDates();

  return (
    <div className="space-y-6">
      {/* Upper info card */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-sm relative overflow-hidden animate-fade-scale group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
              Homeroom Class
            </span>
            <h2 className="text-2xl font-black mt-2">Grade {targetGrade} - Section {targetSection}</h2>
            <p className="text-slate-300 text-sm mt-1">
              Roster: {totalStudents} Students | Male: {homeroomStudents.filter(s=>s.gender==='Male').length} | Female: {homeroomStudents.filter(s=>s.gender==='Female').length}
            </p>
          </div>
          <div className="flex bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700 backdrop-blur-md">
            <button 
              onClick={() => setActiveTab("register")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'register' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:text-white'}`}
            >
              Take Attendance
            </button>
            <button 
              onClick={() => setActiveTab("roster")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'roster' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:text-white'}`}
            >
              Students List
            </button>
            <button 
              onClick={() => setActiveTab("history")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'history' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:text-white'}`}
            >
              Visual Register
            </button>
          </div>
        </div>
      </div>

      {activeTab === "register" && (
        <div className="space-y-6">
          {/* Summary stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Present</div>
              <div className="text-2xl font-black text-green-600 flex items-center justify-between">
                <span>{counts.present}</span>
                <span className="text-xs font-bold bg-green-50 text-green-700 px-2 py-0.5 rounded">
                  {totalStudents ? Math.round((counts.present / totalStudents) * 100) : 0}%
                </span>
              </div>
            </div>
            <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Absent</div>
              <div className="text-2xl font-black text-red-600 flex items-center justify-between">
                <span>{counts.absent}</span>
                <span className="text-xs font-bold bg-red-50 text-red-700 px-2 py-0.5 rounded">
                  {totalStudents ? Math.round((counts.absent / totalStudents) * 100) : 0}%
                </span>
              </div>
            </div>
            <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Late</div>
              <div className="text-2xl font-black text-yellow-600 flex items-center justify-between">
                <span>{counts.late}</span>
                <span className="text-xs font-bold bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded">
                  {totalStudents ? Math.round((counts.late / totalStudents) * 100) : 0}%
                </span>
              </div>
            </div>
            <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Excused</div>
              <div className="text-2xl font-black text-purple-600 flex items-center justify-between">
                <span>{counts.excused}</span>
                <span className="text-xs font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded">
                  {totalStudents ? Math.round((counts.excused / totalStudents) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              
              <div className="flex-1 w-full">
                <label className="block text-xs font-medium text-slate-600 mb-1">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => { setSelectedDate(e.target.value); setSubmitted(false); }}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 bg-slate-50 focus:bg-white outline-none transition-all"
                />
              </div>
              <div className="w-full md:w-auto flex gap-2">
                <button 
                  onClick={() => markAllStatus("present")} 
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors whitespace-nowrap"
                >
                  Mark All Present
                </button>
                <button 
                  onClick={() => markAllStatus("excused")} 
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors whitespace-nowrap"
                >
                  Mark All Excused
                </button>
              </div>
            </div>
          </div>

          {/* Roster sheet */}
          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm animate-fade-up">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="py-4 px-6 text-center w-16">No</th>
                    <th className="py-4 px-6 text-left w-64">Student Details</th>
                    <th className="py-4 px-6 text-center w-64">Status Selection</th>
                    <th className="py-4 px-6 text-left">Absence / Lateness Remark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {homeroomStudents.map((student, idx) => {
                    const record = records[student.id] || { status: "present", remarks: "" };
                    const initials = student.first_name[0] + student.last_name[0];
                    return (
                      <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6 text-center text-xs font-bold text-slate-400">
                          {idx + 1}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600 shrink-0 overflow-hidden">
                              {student.avatar ? (
                                <img src={student.avatar} alt="avatar" className="w-full h-full object-cover" />
                              ) : initials}
                            </div>
                            <div className="min-w-0">
                              <div className="font-extrabold text-slate-900 truncate">
                                {student.first_name} {student.last_name}
                              </div>
                              <div className="text-[10px] font-mono text-slate-400">
                                {student.roll_number}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-1.5">
                            {(["present", "absent", "late", "excused"] as const).map((statusVal) => {
                              const labelMap = { present: "P", absent: "A", late: "L", excused: "E" };
                              const colorMap = {
                                present: "peer-checked:bg-green-500 peer-checked:text-white hover:bg-green-50 text-green-600 border-green-200",
                                absent: "peer-checked:bg-red-500 peer-checked:text-white hover:bg-red-50 text-red-600 border-red-200",
                                late: "peer-checked:bg-yellow-500 peer-checked:text-white hover:bg-yellow-50 text-yellow-600 border-yellow-200",
                                excused: "peer-checked:bg-purple-500 peer-checked:text-white hover:bg-purple-50 text-purple-600 border-purple-200",
                              };
                              return (
                                <label key={statusVal} className="relative cursor-pointer">
                                  <input 
                                    type="radio" 
                                    name={`status-${student.id}`}
                                    checked={record.status === statusVal}
                                    onChange={() => setStatus(student.id, statusVal)}
                                    className="sr-only peer"
                                  />
                                  <span className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-black transition-all ${colorMap[statusVal]}`}>
                                    {labelMap[statusVal]}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <input
                            type="text"
                            placeholder="Add reason/remark (optional)..."
                            value={record.remarks}
                            onChange={(e) => setRemark(student.id, e.target.value)}
                            disabled={record.status === "present"}
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold focus:border-blue-400 bg-transparent disabled:opacity-50 disabled:bg-slate-50 outline-none transition-all"
                          />
                        </td>
                      </tr>
                    );
                  })}
                  {homeroomStudents.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-16 text-center text-slate-400">
                        No students found in your Homeroom class.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Submit */}
          {homeroomStudents.length > 0 && (
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className={`w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 ${
                submitted
                  ? "bg-green-100 text-green-700 border border-green-200 shadow-inner"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20"
              }`}
            >
              {isSaving ? "Saving..." : submitted ? <><CheckCircle2 size={18} /> Attendance Saved Successfully</> : <><Save size={18} /> Save Attendance Sheet</>}
            </button>
          )}
        </div>
      )}

      {activeTab === "roster" && (
        <div className="space-y-6">
          <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search students in homeroom..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-slate-50 focus:bg-white outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.map((student) => {
              const initials = student.first_name[0] + student.last_name[0];
              return (
                <div 
                  key={student.id} 
                  onClick={() => { setSelectedStudent(student); setModalTab("info"); }}
                  className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-4 group hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-500 text-sm overflow-hidden shrink-0">
                    {student.avatar ? (
                      <img src={student.avatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-extrabold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                      {student.first_name} {student.last_name}
                    </h4>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">{student.roll_number}</div>
                  </div>
                  <button className="p-1.5 bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors shrink-0">
                    <Eye size={16} />
                  </button>
                </div>
              );
            })}
            {filteredStudents.length === 0 && (
              <div className="col-span-full py-16 text-center text-slate-400 bg-white border border-slate-100 rounded-3xl">
                No matching students found in homeroom roster.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm overflow-hidden animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-extrabold text-slate-900">Attendance visual grid register</h3>
              <p className="text-xs text-slate-400 mt-1">Showing grid history for active school days</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
              <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-green-500"></span> Present</div>
              <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-red-500"></span> Absent</div>
              <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-yellow-500"></span> Late</div>
              <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-purple-500"></span> Excused</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[700px] border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="py-2.5 px-4 text-left font-bold text-slate-500">Student Name</th>
                  {historyDates.map((dateStr) => {
                    const parts = dateStr.split("-");
                    return (
                      <th key={dateStr} className="py-2.5 px-2 text-center font-bold text-slate-500 w-12">
                        {parts[1]}/{parts[2]}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {homeroomStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-800 text-sm truncate max-w-[180px]">
                      {student.first_name} {student.last_name}
                    </td>
                    {historyDates.map((dateStr) => {
                      const match = state.attendance.find(
                        (a) => a.student_id === student.id && a.date.startsWith(dateStr)
                      );
                      const status = match?.status;
                      
                      let dotColor = "bg-slate-100 border-slate-200 text-transparent";
                      let tooltip = "No Record";
                      if (status === "present") {
                        dotColor = "bg-green-500 border-green-600";
                        tooltip = "Present";
                      } else if (status === "absent") {
                        dotColor = "bg-red-500 border-red-600";
                        tooltip = `Absent${match.remarks ? ': ' + match.remarks : ''}`;
                      } else if (status === "late") {
                        dotColor = "bg-yellow-500 border-yellow-600";
                        tooltip = `Late${match.remarks ? ': ' + match.remarks : ''}`;
                      } else if (status === "excused") {
                        dotColor = "bg-purple-500 border-purple-600";
                        tooltip = `Excused${match.remarks ? ': ' + match.remarks : ''}`;
                      }

                      return (
                        <td key={dateStr} className="py-3 px-2 text-center">
                          <div 
                            title={`${student.first_name}: ${tooltip}`}
                            className={`w-4 h-4 rounded mx-auto border transition-transform hover:scale-125 cursor-help ${dotColor}`}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Render student modal copied from ViewStudents */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setSelectedStudent(null)}>
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-fade-scale max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="h-32 bg-gradient-to-r from-teal-500 to-emerald-600 relative">
               <button onClick={() => setSelectedStudent(null)} className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white backdrop-blur-md transition-colors"><X className="w-5 h-5"/></button>
            </div>
            
            <div className="px-8 pb-8">
               <div className="-mt-12 flex justify-between items-end mb-6">
                 <div className="w-24 h-24 rounded-3xl bg-white p-1.5 shadow-lg shrink-0 overflow-hidden relative z-10">
                   {selectedStudent.avatar ? (
                     <img src={selectedStudent.avatar} alt={`${selectedStudent.first_name} ${selectedStudent.last_name}`} className="w-full h-full object-cover rounded-2xl" />
                   ) : (
                     <div className="w-full h-full rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-3xl font-black text-slate-400">
                        {selectedStudent.first_name[0]}{selectedStudent.last_name[0]}
                     </div>
                   )}
                 </div>
                 <div className="flex gap-2">
                   <button 
                     onClick={() => setModalTab(modalTab === "address" ? "info" : "address")}
                     className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                       modalTab === "address" 
                         ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25" 
                         : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                     }`}
                   >
                     <MapPin className="w-4 h-4"/> View Address
                   </button>
                   <button 
                     onClick={() => setModalTab(modalTab === "parent" ? "info" : "parent")}
                     className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                       modalTab === "parent" 
                         ? "bg-teal-600 text-white shadow-md shadow-teal-600/25" 
                         : "bg-teal-50 hover:bg-teal-100 text-teal-600"
                     }`}
                   >
                     <Phone className="w-4 h-4"/> Contact Parent
                   </button>
                 </div>
               </div>
               
               <h2 className="text-3xl font-black text-slate-900 mb-1 break-words leading-tight">
                 {selectedStudent.first_name} {selectedStudent.middle_name} {selectedStudent.last_name}
               </h2>
               <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-slate-500 mb-6">
                 <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Grade {selectedStudent.grade}{selectedStudent.section}</span>
                 <span>•</span>
                 <span className="font-mono">{selectedStudent.roll_number}</span>
                 <span>•</span>
                 <span>{selectedStudent.gender}</span>
               </div>

               {modalTab === "info" && (
                 <>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
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

                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                      <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50">
                         <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Date of Birth</div>
                         <div className="font-bold text-slate-900 text-xs sm:text-sm">
                           {selectedStudent.date_of_birth ? new Date(selectedStudent.date_of_birth).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                         </div>
                      </div>
                      <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50">
                         <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Fayda ID</div>
                         <div className="font-mono font-bold text-slate-900 text-xs sm:text-sm truncate" title={selectedStudent.fayda_id || 'N/A'}>
                           {selectedStudent.fayda_id || 'N/A'}
                         </div>
                      </div>
                      <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50">
                         <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Nat. Exam #</div>
                         <div className="font-mono font-bold text-slate-900 text-xs sm:text-sm truncate" title={selectedStudent.national_exam_number || 'N/A'}>
                           {selectedStudent.national_exam_number || 'N/A'}
                         </div>
                      </div>
                      <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50">
                         <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Enrolled Date</div>
                         <div className="font-bold text-slate-900 text-xs sm:text-sm">
                           {selectedStudent.enrolled_date ? new Date(selectedStudent.enrolled_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                         </div>
                      </div>
                    </div>

                   <div className="flex gap-3">
                     <button onClick={() => setModalTab("academic")} className="flex-1 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-md">Full Academic Record</button>
                     <button onClick={() => setModalTab("attendance")} className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all">Attendance History</button>
                   </div>
                 </>
               )}

               {modalTab === "address" && (
                 <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-4 animate-fade-in">
                   <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2"><MapPin className="text-emerald-600"/> Home Address</h3>
                   <div className="grid grid-cols-2 gap-4 text-sm font-semibold">
                     <div>
                       <span className="block text-xs text-slate-400">Region</span>
                       <span className="text-slate-900">{selectedStudent.address?.region || "Oromia"}</span>
                     </div>
                     <div>
                       <span className="block text-xs text-slate-400">Zone</span>
                       <span className="text-slate-900">{selectedStudent.address?.zone || "Jimma"}</span>
                     </div>
                     <div>
                       <span className="block text-xs text-slate-400">Woreda / City</span>
                       <span className="text-slate-900">{selectedStudent.address?.kebele || "Jimma City"}</span>
                     </div>
                     <div>
                       <span className="block text-xs text-slate-400">House No</span>
                       <span className="text-slate-900 font-mono">{selectedStudent.address?.house_no || "House #384"}</span>
                     </div>
                   </div>
                   <button onClick={() => setModalTab("info")} className="w-full mt-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition-colors">Back to Profile</button>
                 </div>
               )}

               {modalTab === "parent" && (
                 <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-4 animate-fade-in">
                   <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2"><Phone className="text-teal-600"/> Parent & Guardian Information</h3>
                   <div className="space-y-3 text-sm">
                     <div className="flex justify-between border-b border-slate-200/50 pb-2">
                       <span className="text-slate-400 font-medium">Guardian Name:</span>
                       <span className="font-extrabold text-slate-900">{selectedStudent.guardian_name}</span>
                     </div>
                     <div className="flex justify-between border-b border-slate-200/50 pb-2">
                       <span className="text-slate-400 font-medium">Relation:</span>
                       <span className="font-bold text-slate-900">{selectedStudent.guardian_relation}</span>
                     </div>
                     <div className="flex justify-between border-b border-slate-200/50 pb-2">
                       <span className="text-slate-400 font-medium">Phone Number:</span>
                       <span className="font-mono font-bold text-teal-600">{selectedStudent.parent_phone}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-slate-400 font-medium">Personal Email:</span>
                       <span className="font-mono text-slate-700">{selectedStudent.personal_email || "N/A"}</span>
                     </div>
                   </div>
                   <button onClick={() => setModalTab("info")} className="w-full mt-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition-colors">Back to Profile</button>
                 </div>
               )}

               {modalTab === "academic" && (
                 <div className="space-y-4 animate-fade-in">
                   <div className="flex justify-between items-center">
                     <h3 className="font-extrabold text-slate-900 text-lg">Academic Record (Semester 1)</h3>
                     <button onClick={() => setModalTab("info")} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-colors">Close</button>
                   </div>
                   <div className="overflow-x-auto border border-slate-100 rounded-2xl max-h-[300px] overflow-y-auto">
                     <table className="w-full text-sm">
                       <thead>
                         <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase">
                           <th className="py-2.5 px-4 text-left">Subject</th>
                           <th className="py-2.5 px-4 text-center">Total Score</th>
                           <th className="py-2.5 px-4 text-center">Percent</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50 text-slate-700 font-medium">
                         {state.subjects.filter(sub => sub.grade === selectedStudent.grade).map((subject) => {
                           const sMarks = state.marks.filter(
                             (m) => m.student_id === selectedStudent.id && m.subject_id === subject.id && m.semester === 1
                           );
                           const total = sMarks.reduce((sum, m) => sum + m.score, 0);
                           const percent = sMarks.length > 0 ? (total / sMarks.reduce((sum, m) => sum + (m.max_score || 100), 0)) * 100 : 0;
                           return (
                             <tr key={subject.id} className="hover:bg-slate-50">
                               <td className="py-3 px-4 text-slate-900 font-bold">{subject.name}</td>
                               <td className="py-3 px-4 text-center font-mono font-bold">{sMarks.length > 0 ? `${total}` : "—"}</td>
                               <td className="py-3 px-4 text-center">
                                 {sMarks.length > 0 ? (
                                   <span className={`px-2 py-0.5 rounded text-[10px] font-black inline-block ${percent >= 70 ? 'bg-green-100 text-green-700' : percent >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{Math.round(percent)}%</span>
                                 ) : <span className="text-slate-300 font-bold">—</span>}
                               </td>
                             </tr>
                           );
                         })}
                       </tbody>
                     </table>
                   </div>
                 </div>
               )}

               {modalTab === "attendance" && (
                 <div className="space-y-4 animate-fade-in">
                   <div className="flex justify-between items-center">
                     <h3 className="font-extrabold text-slate-900 text-lg">Attendance History</h3>
                     <button onClick={() => setModalTab("info")} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-colors">Close</button>
                   </div>
                   
                   <div className="overflow-x-auto border border-slate-100 rounded-2xl max-h-[300px] overflow-y-auto">
                     <table className="w-full text-sm">
                       <thead>
                         <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase">
                           <th className="py-2.5 px-4 text-left">Date</th>
                           <th className="py-2.5 px-4 text-left">Subject</th>
                           <th className="py-2.5 px-4 text-center">Status</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50 text-slate-700 font-semibold">
                         {state.attendance.filter(a => a.student_id === selectedStudent.id).slice(0, 10).map((record) => {
                           const sub = state.subjects.find(s => s.id === record.subject_id);
                           return (
                             <tr key={record.id} className="hover:bg-slate-50">
                               <td className="py-3 px-4 font-mono text-slate-500 text-xs">{record.date}</td>
                               <td className="py-3 px-4 text-slate-900 font-bold">{sub?.name || 'Unknown'}</td>
                               <td className="py-3 px-4 text-center">
                                 <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                   record.status === 'present' ? 'bg-green-50 text-green-600' :
                                   record.status === 'absent' ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-600'
                                 }`}>{record.status}</span>
                               </td>
                             </tr>
                           );
                         })}
                         {state.attendance.filter(a => a.student_id === selectedStudent.id).length === 0 && (
                           <tr>
                             <td colSpan={3} className="py-8 text-center text-slate-400 font-medium">No attendance records found for this student.</td>
                           </tr>
                         )}
                       </tbody>
                     </table>
                   </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}
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
  const teacher = state.teachers.find((t) => t.id === teacherId);
  const [selectedSection, setSelectedSection] = useState<string>("All");

  const [academicYear, setAcademicYear] = useState("2026/2027");
  const [semester, setSemester] = useState(1);

  // Load system settings on mount
  useEffect(() => {
    api.getSettings()
      .then((settings: any) => {
        if (settings.academicYear) {
          setAcademicYear(settings.academicYear);
        }
        if (settings.currentSemester) {
          setSemester(Number(settings.currentSemester) || 1);
        }
      })
      .catch((err) => {
        console.error("Failed to load settings in EnterMarks:", err);
      });
  }, []);

  const currentSubjectObj = state.subjects.find(s => s.id === selectedSubject);
  const targetGrade = currentSubjectObj ? currentSubjectObj.grade : teacher?.assigned_grade;
  const availableSections = currentSubjectObj?.sections?.length 
    ? currentSubjectObj.sections.sort() 
    : Array.from(new Set(state.students.filter(s => s.grade === targetGrade).map(s => s.section))).sort();

  const students = targetGrade
    ? state.students
        .filter((s) => s.grade === targetGrade && (selectedSection === "All" ? availableSections.includes(s.section) : s.section === selectedSection))
        .sort((a, b) => a.last_name.localeCompare(b.last_name))
    : [];

  // Continuous assessment max scores state
  const [maxScores, setMaxScores] = useState({
    attendance: 10,
    assignment: 10,
    quiz: 10,
    midterm: 20,
    final: 50
  });

  // scores[studentId][assessmentType] = scoreValue
  const [scores, setScores] = useState<Record<string, Record<string, string>>>({});
  const [remarks, setRemarks] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Load existing marks on mount or selected subject/section change
  useEffect(() => {
    const loadedScores: Record<string, Record<string, string>> = {};
    const loadedRemarks: Record<string, string> = {};
    const loadedSaved: Record<string, boolean> = {};

    const assessmentTypes = ["attendance", "assignment", "quiz", "midterm", "final"] as const;

    students.forEach((student) => {
      loadedScores[student.id] = {
        attendance: "",
        assignment: "",
        quiz: "",
        midterm: "",
        final: ""
      };
      loadedRemarks[student.id] = "";
      loadedSaved[student.id] = false;

      // Find marks for this student and subject
      const studentMarks = state.marks.filter(
        (m) => m.student_id === student.id && m.subject_id === selectedSubject && m.semester === semester && m.academic_year === academicYear
      );

      let studentHasAnyMark = false;
      studentMarks.forEach((m) => {
        if (assessmentTypes.includes(m.assessment_type as any)) {
          loadedScores[student.id][m.assessment_type as typeof assessmentTypes[number]] = String(m.score);
          studentHasAnyMark = true;
          // Set dynamic max score from DB if found (keep default if not found)
          if (m.max_score) {
            setMaxScores(prev => ({
              ...prev,
              [m.assessment_type]: m.max_score
            }));
          }
        }
        if (m.remarks) {
          loadedRemarks[student.id] = m.remarks;
        }
      });

      if (studentHasAnyMark) {
        loadedSaved[student.id] = true;
      }
    });

    setScores(loadedScores);
    setRemarks(loadedRemarks);
    setSaved(loadedSaved);
    setSubmitted(false);
  }, [selectedSubject, selectedSection, students.length, academicYear, semester, state.marks]);

  const handleScoreChange = (studentId: string, type: string, value: string) => {
    const maxVal = maxScores[type as keyof typeof maxScores] || 100;
    if (value !== "" && (isNaN(Number(value)) || Number(value) < 0 || Number(value) > maxVal)) return;

    setScores((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [type]: value
      }
    }));
    setSaved((prev) => ({ ...prev, [studentId]: false }));
    setSubmitted(false);
  };

  const handleRemarkChange = (studentId: string, value: string) => {
    setRemarks((prev) => ({ ...prev, [studentId]: value }));
    setSaved((prev) => ({ ...prev, [studentId]: false }));
    setSubmitted(false);
  };

  const getStudentTotal = (studentId: string) => {
    const s = scores[studentId] || {};
    const attendance = Number(s.attendance) || 0;
    const assignment = Number(s.assignment) || 0;
    const quiz = Number(s.quiz) || 0;
    const midterm = Number(s.midterm) || 0;
    const final = Number(s.final) || 0;
    return attendance + assignment + quiz + midterm + final;
  };

  const getStudentPercentage = (studentId: string) => {
    const total = getStudentTotal(studentId);
    const maxTotal = maxScores.attendance + maxScores.assignment + maxScores.quiz + maxScores.midterm + maxScores.final;
    return maxTotal > 0 ? (total / maxTotal) * 100 : 0;
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const marksToSave: any[] = [];
      const assessmentTypes = ["attendance", "assignment", "quiz", "midterm", "final"] as const;

      students.forEach((student) => {
        const studentScores = scores[student.id] || {};
        assessmentTypes.forEach((type) => {
          const val = studentScores[type];
          if (val !== undefined && val !== "") {
            marksToSave.push({
              student_id: student.id,
              subject_id: selectedSubject,
              academic_year: academicYear,
              semester: semester,
              assessment_type: type,
              score: Number(val),
              max_score: maxScores[type],
              remarks: remarks[student.id] || "",
              entered_by: currentUser?.id || "",
            });
          }
        });
      });

      if (marksToSave.length === 0) {
        setIsSaving(false);
        return;
      }

      await enterMarks(marksToSave);
      setSubmitted(true);
      
      const allSaved: Record<string, boolean> = {};
      students.forEach((student) => {
        const studentScores = scores[student.id] || {};
        const hasAnyScore = assessmentTypes.some(type => studentScores[type] !== "");
        if (hasAnyScore) {
          allSaved[student.id] = true;
        }
      });
      setSaved(allSaved);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Stats Calculations
  const maxTotalScore = maxScores.attendance + maxScores.assignment + maxScores.quiz + maxScores.midterm + maxScores.final;
  const enteredStudents = students.filter(s => {
    const studentScores = scores[s.id] || {};
    return Object.values(studentScores).some(val => val !== "");
  });
  const enteredCount = enteredStudents.length;

  const enteredTotals = enteredStudents.map(s => getStudentTotal(s.id));
  const avgScore = enteredCount > 0 ? Math.round(enteredTotals.reduce((a, b) => a + b, 0) / enteredCount) : 0;
  const highest = enteredCount > 0 ? Math.max(...enteredTotals) : 0;
  const lowest = enteredCount > 0 ? Math.min(...enteredTotals) : 0;

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
        <div className="bg-white border border-slate-100 p-4 rounded-3xl shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Class Average</div>
          <div className="text-2xl font-black text-slate-900">{avgScore}<span className="text-base text-slate-400">/{maxTotalScore}</span></div>
        </div>
        <div className="bg-white border border-slate-100 p-4 rounded-3xl shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Highest Total</div>
          <div className="text-2xl font-black text-green-600">{highest}</div>
        </div>
        <div className="bg-white border border-slate-100 p-4 rounded-3xl shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Lowest Total</div>
          <div className="text-2xl font-black text-red-600">{lowest}</div>
        </div>
        <div className="bg-white border border-slate-100 p-4 rounded-3xl shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Entered Students</div>
          <div className="text-2xl font-black text-blue-600">{enteredCount}<span className="text-base text-slate-400">/{students.length}</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          {/* Controls */}
          <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Subject</label>
                <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
                  {mySubjects.map((s) => <option key={s.id} value={s.id}>{s.name} (Grade {s.grade})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Section</label>
                <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
                  <option value="All">All Sections</option>
                  {availableSections.map((sec) => <option key={sec} value={sec}>Section {sec}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm animate-fade-up">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[1200px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="py-4 px-4 text-center w-12">No</th>
                    <th className="py-4 px-4 text-left w-32">Student ID</th>
                    <th className="py-4 px-4 text-left w-52">Student Full Name</th>
                    <th className="py-4 px-4 text-center w-20">Gender</th>
                    <th className="py-4 px-4 text-center w-28">
                      <div className="flex flex-col items-center gap-1">
                        <span>Attendance</span>
                        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md px-1.5 py-0.5">
                          <span className="text-[10px] text-slate-400">Max:</span>
                          <input 
                            type="number" 
                            value={maxScores.attendance} 
                            onChange={(e) => setMaxScores(prev => ({...prev, attendance: Number(e.target.value) || 0}))} 
                            className="w-8 text-center text-xs font-extrabold text-slate-700 bg-transparent outline-none border-none p-0"
                          />
                        </div>
                      </div>
                    </th>
                    <th className="py-4 px-4 text-center w-28">
                      <div className="flex flex-col items-center gap-1">
                        <span>Assignment</span>
                        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md px-1.5 py-0.5">
                          <span className="text-[10px] text-slate-400">Max:</span>
                          <input 
                            type="number" 
                            value={maxScores.assignment} 
                            onChange={(e) => setMaxScores(prev => ({...prev, assignment: Number(e.target.value) || 0}))} 
                            className="w-8 text-center text-xs font-extrabold text-slate-700 bg-transparent outline-none border-none p-0"
                          />
                        </div>
                      </div>
                    </th>
                    <th className="py-4 px-4 text-center w-28">
                      <div className="flex flex-col items-center gap-1">
                        <span>Quiz</span>
                        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md px-1.5 py-0.5">
                          <span className="text-[10px] text-slate-400">Max:</span>
                          <input 
                            type="number" 
                            value={maxScores.quiz} 
                            onChange={(e) => setMaxScores(prev => ({...prev, quiz: Number(e.target.value) || 0}))} 
                            className="w-8 text-center text-xs font-extrabold text-slate-700 bg-transparent outline-none border-none p-0"
                          />
                        </div>
                      </div>
                    </th>
                    <th className="py-4 px-4 text-center w-28">
                      <div className="flex flex-col items-center gap-1">
                        <span>Mid Exam</span>
                        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md px-1.5 py-0.5">
                          <span className="text-[10px] text-slate-400">Max:</span>
                          <input 
                            type="number" 
                            value={maxScores.midterm} 
                            onChange={(e) => setMaxScores(prev => ({...prev, midterm: Number(e.target.value) || 0}))} 
                            className="w-8 text-center text-xs font-extrabold text-slate-700 bg-transparent outline-none border-none p-0"
                          />
                        </div>
                      </div>
                    </th>
                    <th className="py-4 px-4 text-center w-28">
                      <div className="flex flex-col items-center gap-1">
                        <span>Final Exam</span>
                        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md px-1.5 py-0.5">
                          <span className="text-[10px] text-slate-400">Max:</span>
                          <input 
                            type="number" 
                            value={maxScores.final} 
                            onChange={(e) => setMaxScores(prev => ({...prev, final: Number(e.target.value) || 0}))} 
                            className="w-8 text-center text-xs font-extrabold text-slate-700 bg-transparent outline-none border-none p-0"
                          />
                        </div>
                      </div>
                    </th>
                    <th className="py-4 px-4 text-center w-20">Total ({maxTotalScore})</th>
                    <th className="py-4 px-4 text-center w-24">Percent</th>
                    <th className="py-4 px-4 text-left">Remark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {students.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((student, index) => {
                    const sScores = scores[student.id] || {};
                    const total = getStudentTotal(student.id);
                    const percent = getStudentPercentage(student.id);
                    const isRowSaved = saved[student.id];
                    const absoluteIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;

                    return (
                      <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="py-3 px-4 text-center text-xs font-bold text-slate-400">{absoluteIndex + 1}</td>
                        <td className="py-3 px-4 font-mono text-xs text-slate-600">{student.roll_number}</td>
                        <td className="py-3 px-4">
                          <div className="font-extrabold text-slate-900 leading-tight">{student.first_name} {student.last_name}</div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black ${student.gender === 'Male' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>{student.gender}</span>
                        </td>
                        
                        {/* Attendance */}
                        <td className="py-3 px-4 text-center">
                          <input 
                            type="number" 
                            min={0} 
                            max={maxScores.attendance} 
                            value={sScores.attendance || ""} 
                            onChange={(e) => handleScoreChange(student.id, "attendance", e.target.value)}
                            className={`w-16 font-extrabold text-center py-1.5 px-2 rounded-xl border text-sm outline-none transition-all ${
                              isRowSaved ? "border-green-200 bg-green-50 text-green-700" :
                              sScores.attendance ? "border-yellow-200 bg-yellow-50 text-slate-900" : "border-slate-200 text-slate-900 bg-slate-50"
                            } focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10`}
                          />
                        </td>

                        {/* Assignment */}
                        <td className="py-3 px-4 text-center">
                          <input 
                            type="number" 
                            min={0} 
                            max={maxScores.assignment} 
                            value={sScores.assignment || ""} 
                            onChange={(e) => handleScoreChange(student.id, "assignment", e.target.value)}
                            className={`w-16 font-extrabold text-center py-1.5 px-2 rounded-xl border text-sm outline-none transition-all ${
                              isRowSaved ? "border-green-200 bg-green-50 text-green-700" :
                              sScores.assignment ? "border-yellow-200 bg-yellow-50 text-slate-900" : "border-slate-200 text-slate-900 bg-slate-50"
                            } focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10`}
                          />
                        </td>

                        {/* Quiz */}
                        <td className="py-3 px-4 text-center">
                          <input 
                            type="number" 
                            min={0} 
                            max={maxScores.quiz} 
                            value={sScores.quiz || ""} 
                            onChange={(e) => handleScoreChange(student.id, "quiz", e.target.value)}
                            className={`w-16 font-extrabold text-center py-1.5 px-2 rounded-xl border text-sm outline-none transition-all ${
                              isRowSaved ? "border-green-200 bg-green-50 text-green-700" :
                              sScores.quiz ? "border-yellow-200 bg-yellow-50 text-slate-900" : "border-slate-200 text-slate-900 bg-slate-50"
                            } focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10`}
                          />
                        </td>

                        {/* Mid Exam */}
                        <td className="py-3 px-4 text-center">
                          <input 
                            type="number" 
                            min={0} 
                            max={maxScores.midterm} 
                            value={sScores.midterm || ""} 
                            onChange={(e) => handleScoreChange(student.id, "midterm", e.target.value)}
                            className={`w-16 font-extrabold text-center py-1.5 px-2 rounded-xl border text-sm outline-none transition-all ${
                              isRowSaved ? "border-green-200 bg-green-50 text-green-700" :
                              sScores.midterm ? "border-yellow-200 bg-yellow-50 text-slate-900" : "border-slate-200 text-slate-900 bg-slate-50"
                            } focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10`}
                          />
                        </td>

                        {/* Final Exam */}
                        <td className="py-3 px-4 text-center">
                          <input 
                            type="number" 
                            min={0} 
                            max={maxScores.final} 
                            value={sScores.final || ""} 
                            onChange={(e) => handleScoreChange(student.id, "final", e.target.value)}
                            className={`w-16 font-extrabold text-center py-1.5 px-2 rounded-xl border text-sm outline-none transition-all ${
                              isRowSaved ? "border-green-200 bg-green-50 text-green-700" :
                              sScores.final ? "border-yellow-200 bg-yellow-50 text-slate-900" : "border-slate-200 text-slate-900 bg-slate-50"
                            } focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10`}
                          />
                        </td>

                        {/* Total */}
                        <td className="py-3 px-4 text-center font-mono font-black text-slate-900 text-base">
                          {total}
                        </td>

                        {/* Percent */}
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2.5 py-1 rounded-xl text-xs font-black mx-auto shadow-sm ${percent >= 70 ? 'bg-green-100 text-green-700' : percent >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                            {Math.round(percent)}%
                          </span>
                        </td>

                        {/* Remarks */}
                        <td className="py-3 px-4">
                          <input 
                            type="text" 
                            placeholder="Add remark..." 
                            value={remarks[student.id] || ""} 
                            onChange={(e) => handleRemarkChange(student.id, e.target.value)}
                            className="w-full min-w-[120px] px-3 py-1.5 rounded-xl border border-slate-200 bg-transparent text-xs font-medium outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
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
            {/* Pagination Controls */}
            {students.length > ITEMS_PER_PAGE && (
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(students.length / ITEMS_PER_PAGE)}
                  onPageChange={setCurrentPage}
                  showInfo={true}
                  totalItems={students.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Submit Button */}
          {students.length > 0 && (
            <button
              onClick={handleSubmit}
              disabled={isSaving || enteredCount === 0}
              className={`w-full py-4 rounded-3xl font-black tracking-wide text-sm transition-all flex items-center justify-center gap-2 ${
                submitted ? "bg-green-100 text-green-700 border border-green-200 shadow-inner" :
                enteredCount === 0 ? "bg-slate-100 text-slate-400 cursor-not-allowed" :
                "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-1"
              }`}
            >
              {isSaving ? "SAVING..." : submitted ? <><CheckCircle2 size={18} /> MARKS SAVED SUCCESSFULLY</> : <><Save size={18} /> SAVE ALL SHEET MARKS</>}
            </button>
          )}


        </div>
      </div>
    </div>
  );
}
// ============================================================
// COMBINED STUDENT RATION & ROSTER MANAGEMENT
// ========================================================================
function ViewMyStudents() {

  const { currentUser, state, getSubjectsByTeacher } = useApp();
  const teacherId = currentUser?.ref_id || "";
  const mySubjects = getSubjectsByTeacher(teacherId);
  const [selectedSubject, setSelectedSubject] = useState(mySubjects[0]?.id || "");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid"|"list">("list");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [modalTab, setModalTab] = useState<"info" | "academic" | "attendance" | "address" | "parent">("info");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  const teacher = state.teachers.find((t) => t.id === teacherId);
  const [selectedSection, setSelectedSection] = useState<string>("All");

  const currentSubjectObj = state.subjects.find(s => s.id === selectedSubject);
  const targetGrade = currentSubjectObj ? currentSubjectObj.grade : teacher?.assigned_grade;
  const availableSections = Array.from(new Set(state.students.filter(s => s.grade === targetGrade).map(s => s.section))).sort();

  const students = targetGrade
    ? state.students
        .filter((s) => s.grade === targetGrade && (selectedSection === "All" ? true : s.section === selectedSection))
        .sort((a, b) => a.last_name.localeCompare(b.last_name))
    : [];

  const filteredStudents = students.filter(s => 
    s.first_name.toLowerCase().includes(search.toLowerCase()) || 
    s.last_name.toLowerCase().includes(search.toLowerCase()) ||
    s.roll_number.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedStudents = filteredStudents.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedSubject, selectedSection]);

  useEffect(() => {
    if (selectedStudent) {
      setModalTab("info");
    }
  }, [selectedStudent]);

  return (
    <div className="space-y-6">
      <>
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
            <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="w-full sm:w-64 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 bg-slate-50 focus:bg-white outline-none">
              {mySubjects.map((s) => <option key={s.id} value={s.id}>{s.name} (Grade {s.grade})</option>)}
            </select>
            <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} className="w-full sm:w-48 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 bg-slate-50 focus:bg-white outline-none">
              <option value="All">All Sections</option>
              {availableSections.map((sec) => <option key={sec} value={sec}>Section {sec}</option>)}
            </select>
            
            <div className="flex w-full sm:w-auto items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" placeholder="Search students..." 
                  value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-slate-50 focus:bg-white outline-none"
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
                    {paginatedStudents.map((student) => {
                      const marks = state.marks.filter((m) => m.student_id === student.id && m.subject_id === selectedSubject);
                      const avg = marks.length > 0 ? Math.round(marks.reduce((sum, m) => sum + (m.score/(m.max_score||100))*100, 0) / marks.length) : 0;
                      return (
                        <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-600 overflow-hidden shrink-0">
                                 {student.avatar ? (
                                   <img src={student.avatar} alt={`${student.first_name} ${student.last_name}`} className="w-full h-full object-cover" />
                                 ) : (
                                   `${student.first_name[0]}${student.last_name[0]}`
                                 )}
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
                               <div className="inline-flex items-center justify-center">
                                 <span className={`px-3 py-1 rounded-xl text-xs font-black ${avg >= 70 ? 'bg-green-100 text-green-700' : avg >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{avg}%</span>
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
              {paginatedStudents.map((student) => {
                 const marks = state.marks.filter((m) => m.student_id === student.id && m.subject_id === selectedSubject);
                 const avg = marks.length > 0 ? Math.round(marks.reduce((sum, m) => sum + (m.score/(m.max_score||100))*100, 0) / marks.length) : 0;
                 return (
                  <div key={student.id} onClick={() => setSelectedStudent(student)} className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group">
                     <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-black text-slate-500 text-lg shadow-inner overflow-hidden shrink-0">
                          {student.avatar ? (
                            <img src={student.avatar} alt={`${student.first_name} ${student.last_name}`} className="w-full h-full object-cover" />
                          ) : (
                            `${student.first_name[0]}${student.last_name[0]}`
                          )}
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${student.gender === "Male" ? "bg-blue-50 text-blue-600" : "bg-pink-50 text-pink-600"}`}>{student.gender}</span>
                     </div>
                     <h4 className="font-extrabold text-slate-900 text-lg group-hover:text-blue-600 transition-colors break-words">{student.first_name}</h4>
                     <div className="font-bold text-slate-500 text-sm mb-4 break-words">{student.last_name}</div>
                     <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                        <div className="text-xs font-mono text-slate-400">{student.roll_number}</div>
                        {marks.length > 0 ? (
                          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${avg >= 70 ? 'bg-green-100 text-green-700' : avg >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                            {avg}%
                          </span>
                        ) : <span className="text-xs font-bold text-slate-300">No marks</span>}
                     </div>
                  </div>
                 )
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {filteredStudents.length > ITEMS_PER_PAGE && (
            <div className="px-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredStudents.length / ITEMS_PER_PAGE)}
                onPageChange={setCurrentPage}
                showInfo={true}
                totalItems={filteredStudents.length}
                itemsPerPage={ITEMS_PER_PAGE}
              />
            </div>
          )}
        </>


      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setSelectedStudent(null)}>
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-fade-scale max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="h-32 bg-gradient-to-r from-teal-500 to-emerald-600 relative">
               <button onClick={() => setSelectedStudent(null)} className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white backdrop-blur-md transition-colors"><X className="w-5 h-5"/></button>
            </div>
            
            <div className="px-8 pb-8">
               <div className="-mt-12 flex justify-between items-end mb-6">
                 <div className="w-24 h-24 rounded-3xl bg-white p-1.5 shadow-lg shrink-0 overflow-hidden relative z-10">
                   {selectedStudent.avatar ? (
                     <img src={selectedStudent.avatar} alt={`${selectedStudent.first_name} ${selectedStudent.last_name}`} className="w-full h-full object-cover rounded-2xl" />
                   ) : (
                     <div className="w-full h-full rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-3xl font-black text-slate-400">
                        {selectedStudent.first_name[0]}{selectedStudent.last_name[0]}
                     </div>
                   )}
                 </div>
                 <div className="flex gap-2">
                   <button 
                     onClick={() => setModalTab(modalTab === "address" ? "info" : "address")}
                     className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                       modalTab === "address" 
                         ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25" 
                         : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                     }`}
                   >
                     <MapPin className="w-4 h-4"/> View Address
                   </button>
                   <button 
                     onClick={() => setModalTab(modalTab === "parent" ? "info" : "parent")}
                     className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                       modalTab === "parent" 
                         ? "bg-teal-600 text-white shadow-md shadow-teal-600/25" 
                         : "bg-teal-50 hover:bg-teal-100 text-teal-600"
                     }`}
                   >
                     <Phone className="w-4 h-4"/> Contact Parent
                   </button>
                 </div>
               </div>
               
               <h2 className="text-3xl font-black text-slate-900 mb-1 break-words leading-tight">
                 {selectedStudent.first_name} {selectedStudent.middle_name} {selectedStudent.last_name}
               </h2>
               <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-slate-500 mb-6">
                 <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Grade {selectedStudent.grade}{selectedStudent.section}</span>
                 <span>•</span>
                 <span className="font-mono">{selectedStudent.roll_number}</span>
                 <span>•</span>
                 <span>{selectedStudent.gender}</span>
               </div>

               {/* TAB RENDERING */}
               {modalTab === "info" && (
                 <>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
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

                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                      <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50">
                         <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Date of Birth</div>
                         <div className="font-bold text-slate-900 text-xs sm:text-sm">
                           {selectedStudent.date_of_birth ? new Date(selectedStudent.date_of_birth).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                         </div>
                      </div>
                      <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50">
                         <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Fayda ID</div>
                         <div className="font-mono font-bold text-slate-900 text-xs sm:text-sm truncate" title={selectedStudent.fayda_id || 'N/A'}>
                           {selectedStudent.fayda_id || 'N/A'}
                         </div>
                      </div>
                      <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50">
                         <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Nat. Exam #</div>
                         <div className="font-mono font-bold text-slate-900 text-xs sm:text-sm truncate" title={selectedStudent.national_exam_number || 'N/A'}>
                           {selectedStudent.national_exam_number || 'N/A'}
                         </div>
                      </div>
                      <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50">
                         <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Enrolled Date</div>
                         <div className="font-bold text-slate-900 text-xs sm:text-sm">
                           {selectedStudent.enrolled_date ? new Date(selectedStudent.enrolled_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                         </div>
                      </div>
                    </div>

                   <div className="flex gap-3">
                     <button onClick={() => setModalTab("academic")} className="flex-1 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-md">Full Academic Record</button>
                     <button onClick={() => setModalTab("attendance")} className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all">Attendance History</button>
                   </div>
                 </>
               )}

               {modalTab === "address" && (
                 <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-4 animate-fade-in">
                   <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2"><MapPin className="text-emerald-600"/> Home Address</h3>
                   <div className="grid grid-cols-2 gap-4 text-sm font-semibold">
                     <div>
                       <span className="block text-xs text-slate-400">Region</span>
                       <span className="text-slate-900">{selectedStudent.address?.region || "Oromia"}</span>
                     </div>
                     <div>
                       <span className="block text-xs text-slate-400">Zone</span>
                       <span className="text-slate-900">{selectedStudent.address?.zone || "Jimma"}</span>
                     </div>
                     <div>
                       <span className="block text-xs text-slate-400">Woreda / City</span>
                       <span className="text-slate-900">{selectedStudent.address?.kebele || "Jimma City"}</span>
                     </div>
                     <div>
                       <span className="block text-xs text-slate-400">House No</span>
                       <span className="text-slate-900 font-mono">{selectedStudent.address?.house_no || "House #384"}</span>
                     </div>
                   </div>
                   <button onClick={() => setModalTab("info")} className="w-full mt-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition-colors">Back to Profile</button>
                 </div>
               )}

               {modalTab === "parent" && (
                 <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-4 animate-fade-in">
                   <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2"><Phone className="text-teal-600"/> Parent & Guardian Information</h3>
                   <div className="space-y-3 text-sm">
                     <div className="flex justify-between border-b border-slate-200/50 pb-2">
                       <span className="text-slate-400 font-medium">Guardian Name:</span>
                       <span className="font-extrabold text-slate-900">{selectedStudent.guardian_name}</span>
                     </div>
                     <div className="flex justify-between border-b border-slate-200/50 pb-2">
                       <span className="text-slate-400 font-medium">Relation:</span>
                       <span className="font-bold text-slate-900">{selectedStudent.guardian_relation}</span>
                     </div>
                     <div className="flex justify-between border-b border-slate-200/50 pb-2">
                       <span className="text-slate-400 font-medium">Phone Number:</span>
                       <span className="font-mono font-bold text-teal-600">{selectedStudent.parent_phone}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-slate-400 font-medium">Personal Email:</span>
                       <span className="font-mono text-slate-700">{selectedStudent.personal_email || "N/A"}</span>
                     </div>
                   </div>
                   <button onClick={() => setModalTab("info")} className="w-full mt-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition-colors">Back to Profile</button>
                 </div>
               )}

               {modalTab === "academic" && (
                 <div className="space-y-4 animate-fade-in">
                   <div className="flex justify-between items-center">
                     <h3 className="font-extrabold text-slate-900 text-lg">Academic Record (Semester 1)</h3>
                     <button onClick={() => setModalTab("info")} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-colors">Close</button>
                   </div>
                   <div className="overflow-x-auto border border-slate-100 rounded-2xl max-h-[300px] overflow-y-auto">
                     <table className="w-full text-sm">
                       <thead>
                         <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase">
                           <th className="py-2.5 px-4 text-left">Subject</th>
                           <th className="py-2.5 px-4 text-center">Total Score</th>
                           <th className="py-2.5 px-4 text-center">Percent</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50 text-slate-700 font-medium">
                         {state.subjects.filter(sub => sub.grade === selectedStudent.grade).map((subject) => {
                           const sMarks = state.marks.filter(
                             (m) => m.student_id === selectedStudent.id && m.subject_id === subject.id && m.semester === 1
                           );
                           const total = sMarks.reduce((sum, m) => sum + m.score, 0);
                           const percent = sMarks.length > 0 ? (total / sMarks.reduce((sum, m) => sum + (m.max_score || 100), 0)) * 100 : 0;
                           return (
                             <tr key={subject.id} className="hover:bg-slate-50">
                               <td className="py-3 px-4 text-slate-900 font-bold">{subject.name}</td>
                               <td className="py-3 px-4 text-center font-mono font-bold">{sMarks.length > 0 ? `${total}` : "—"}</td>
                               <td className="py-3 px-4 text-center">
                                 {sMarks.length > 0 ? (
                                   <span className={`px-2 py-0.5 rounded text-[10px] font-black inline-block ${percent >= 70 ? 'bg-green-100 text-green-700' : percent >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{Math.round(percent)}%</span>
                                 ) : <span className="text-slate-300 font-bold">—</span>}
                               </td>
                             </tr>
                           );
                         })}
                       </tbody>
                     </table>
                   </div>
                 </div>
               )}

               {modalTab === "attendance" && (
                 <div className="space-y-4 animate-fade-in">
                   <div className="flex justify-between items-center">
                     <h3 className="font-extrabold text-slate-900 text-lg">Attendance History</h3>
                     <button onClick={() => setModalTab("info")} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-colors">Close</button>
                   </div>
                   
                   <div className="overflow-x-auto border border-slate-100 rounded-2xl max-h-[300px] overflow-y-auto">
                     <table className="w-full text-sm">
                       <thead>
                         <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase">
                           <th className="py-2.5 px-4 text-left">Date</th>
                           <th className="py-2.5 px-4 text-left">Subject</th>
                           <th className="py-2.5 px-4 text-center">Status</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50 text-slate-700 font-semibold">
                         {state.attendance.filter(a => a.student_id === selectedStudent.id).slice(0, 10).map((record) => {
                           const sub = state.subjects.find(s => s.id === record.subject_id);
                           return (
                             <tr key={record.id} className="hover:bg-slate-50">
                               <td className="py-3 px-4 font-mono text-slate-500 text-xs">{record.date}</td>
                               <td className="py-3 px-4 text-slate-900 font-bold">{sub?.name || 'Unknown'}</td>
                               <td className="py-3 px-4 text-center">
                                 <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                   record.status === 'present' ? 'bg-green-50 text-green-600' :
                                   record.status === 'absent' ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-600'
                                 }`}>{record.status}</span>
                               </td>
                             </tr>
                           );
                         })}
                         {state.attendance.filter(a => a.student_id === selectedStudent.id).length === 0 && (
                           <tr>
                             <td colSpan={3} className="py-8 text-center text-slate-400 font-medium">No attendance records found for this student.</td>
                           </tr>
                         )}
                       </tbody>
                     </table>
                   </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// TEACHER RESOURCES & HELP GUIDE
// ============================================================
function HelpGuide() {
  return (
    <div className="max-w-4xl space-y-6 animate-fade-in">
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black mb-3">Teacher Resource & Help Guide</h2>
          <p className="text-indigo-100 text-sm max-w-2xl leading-relaxed">
            Welcome to your digital portal guide. Below are instructions and references on how to manage your homeroom, attendance logs, student grades, and new registrations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">1</span>
            My Homeroom Attendance
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            As a homeroom teacher, you are responsible for daily morning registrations. Select your subject or class period, check/uncheck the students, and click <strong>Save Attendance Sheet</strong>. If a student is absent, late, or excused, click their respective badge (A, L, E) and optionally insert a remark describing the reason.
          </p>
        </div>

        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">2</span>
            Entering Subject Marks
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Access the <strong>Marks</strong> entry page to update grades for your taught courses. The system utilizes continuous assessment grading including quizzes, midterm exams, class participation, and final exams. Always save individual row assessments or click <strong>Save All Sheet Marks</strong> to finalize.
          </p>
        </div>

        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">3</span>
            Student Roster & Profiles
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Homeroom teachers have read-only access to detailed student profile cards. Click <strong>View Profile</strong> on any student card/row to view contact details, home addresses, parents' telephone numbers, and complete historical report cards without risk of unintended modifications.
          </p>
        </div>

        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">4</span>
            New Student Registrations
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            To register a new student, select the <strong>My Students</strong> navigation panel and select the <strong>New Registration</strong> tab. Submit the completed application form. The school registrar will verify and approve the student enrollment details.
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN TEACHER PORTAL
// ============================================================
export default function TeacherPortal({ activePage }: { activePage: string }) {
  switch (activePage) {
    case "dashboard": return <TeacherDashboard />;
    case "homeroom": return <MyHomeroom />;
    case "marks": return <EnterMarks />;
    case "students": return <ViewMyStudents />;
    case "register": return <EnrollStudent />;
    case "guide": return <HelpGuide />;
    case "profile": return <ProfilePage />;
    default: return <TeacherDashboard />;
  }
}

// ============================================================
// ENROLL NEW STUDENT
// ============================================================
export function EnrollStudent() {
  return (
    <div className="max-w-3xl space-y-6 animate-fade-in">
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <UserPlus size={28} />
            </div>
            <h2 className="text-3xl font-black">Student Registration</h2>
          </div>
          <p className="text-blue-100 text-sm font-medium leading-relaxed max-w-xl">
            Register new students for the academic year. As a Homeroom teacher, you can submit registrations for administrator approval.
          </p>
        </div>
      </div>
      <StudentRegistrationForm />
    </div>
  );
}
