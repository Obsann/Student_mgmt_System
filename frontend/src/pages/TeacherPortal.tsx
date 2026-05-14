import { useState, useRef, useEffect } from "react";
import {
  CheckCircle2, Save, UserPlus, Send, Mail,
} from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { useToast } from "../contexts/ToastContext";
import { api } from "../services/api";
import ProfilePage from "./ProfilePage";
import { getEthiopianGrade } from "../utils/gradeCalculator";

// ============================================================
// TEACHER DASHBOARD
// ============================================================
function TeacherDashboard() {
  const { currentUser, state, getSubjectsByTeacher } = useApp();
  const teacherId = currentUser?.ref_id || "";
  const mySubjects = getSubjectsByTeacher(teacherId);
  const teacher = state.teachers.find((t) => t.id === teacherId);

  const totalStudents = state.students.filter((s) => s.grade === teacher?.assigned_grade && s.section === teacher?.assigned_section).length;

  const myMarks = state.marks.filter((m) => m.entered_by === teacherId);


  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden animate-fade-scale group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 transition-transform duration-700 group-hover:scale-110"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black">Welcome, {teacher?.name || currentUser?.name}!</h2>
          <p className="text-blue-100 text-sm mt-2 font-medium">Here's your teaching overview for today.</p>
          <div className="grid grid-cols-3 gap-6 mt-6">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 hover:bg-white/20 transition-colors cursor-default">
              <div className="text-3xl font-black">{mySubjects.length}</div>
              <div className="text-xs text-blue-100 font-bold uppercase tracking-wider mt-1">My Subjects</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 hover:bg-white/20 transition-colors cursor-default">
              <div className="text-3xl font-black">{totalStudents}</div>
              <div className="text-xs text-blue-100 font-bold uppercase tracking-wider mt-1">My Students</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 hover:bg-white/20 transition-colors cursor-default">
              <div className="text-3xl font-black">{myMarks.length}</div>
              <div className="text-xs text-blue-100 font-bold uppercase tracking-wider mt-1">Marks Entered</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-up">
        {mySubjects.map((sub) => {
          const enrolled = state.enrollments.filter((e) => e.subject_id === sub.id).length;
          const marksCount = state.marks.filter((m) => m.subject_id === sub.id && m.entered_by === teacherId).length;
          const attCount = state.attendance.filter((a) => a.subject_id === sub.id).length;
          return (
            <div key={sub.id} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-[11px] font-black uppercase tracking-widest">{sub.code}</span>
                  <h3 className="font-black text-slate-900 mt-2 text-lg">{sub.name}</h3>
                </div>
                <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-lg">Grade {sub.grade}</span>
              </div>
              <div className="flex gap-4 text-xs font-semibold text-slate-500 bg-slate-50 p-3 rounded-2xl group-hover:bg-indigo-50/50 transition-colors">
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-400"></div>{enrolled} students</span>
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-orange-400"></div>{marksCount} marks</span>
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-400"></div>{attCount} attendance</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// TAKE ATTENDANCE (Keyboard-Driven, Low-Click Design)
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

  // Load existing attendance for this date/subject
  useEffect(() => {
    if (selectedSubject && selectedDate) {
      const existing = getAttendanceForDate(selectedSubject, selectedDate);
      if (existing.length > 0) {
        const loaded: Record<string, "present" | "absent" | "late" | "excused"> = {};
        existing.forEach((a) => { loaded[a.student_id] = a.status; });
        setRecords(loaded);
        setSubmitted(true);
      } else {
        // Default all to present (low-click design!)
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
      case "p":
        e.preventDefault();
        setStatus(student.id, "present");
        if (index < students.length - 1) { setFocusedIndex(index + 1); rowRefs.current[index + 1]?.focus(); }
        break;
      case "a":
        e.preventDefault();
        setStatus(student.id, "absent");
        if (index < students.length - 1) { setFocusedIndex(index + 1); rowRefs.current[index + 1]?.focus(); }
        break;
      case "l":
        e.preventDefault();
        setStatus(student.id, "late");
        if (index < students.length - 1) { setFocusedIndex(index + 1); rowRefs.current[index + 1]?.focus(); }
        break;
      case "arrowdown":
        e.preventDefault();
        if (index < students.length - 1) { setFocusedIndex(index + 1); rowRefs.current[index + 1]?.focus(); }
        break;
      case "arrowup":
        e.preventDefault();
        if (index > 0) { setFocusedIndex(index - 1); rowRefs.current[index - 1]?.focus(); }
        break;
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
  };

  const markAllPresent = () => {
    const all: Record<string, "present" | "absent" | "late" | "excused"> = {};
    students.forEach((s) => { all[s.id] = "present"; });
    setRecords(all);
    setSubmitted(false);
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all animate-fade-in">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => { setSelectedSubject(e.target.value); setSubmitted(false); }}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900"
            >
              {mySubjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name} (Grade {s.grade})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => { setSelectedDate(e.target.value); setSubmitted(false); }}
              className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900"
            />
          </div>
          <div className="flex items-end">
            <button onClick={markAllPresent} className="px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 whitespace-nowrap">
              Mark All Present
            </button>
          </div>
        </div>

        {/* Summary & Keyboard Hints */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 gap-2">
          <div className="flex gap-4 text-sm">
            <span className="text-green-600 font-medium">✅ {counts.present} Present</span>
            <span className="text-red-600 font-medium">❌ {counts.absent} Absent</span>
            <span className="text-yellow-600 font-medium">⏰ {counts.late} Late</span>
          </div>
          <div className="text-[10px] text-blue-600 bg-blue-50 px-3 py-1 rounded-lg font-medium">
            ⌨️ Keys: <b>P</b> Present, <b>A</b> Absent, <b>L</b> Late, <b>↑↓</b> Navigate
          </div>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all animate-fade-up">
        <div className="divide-y divide-slate-50 max-h-[500px] overflow-y-auto custom-scrollbar">
          {students.map((student, index) => {
            const status = records[student.id] || "present";
            const isFocused = focusedIndex === index;
            return (
              <div
                key={student.id}
                ref={(el) => { rowRefs.current[index] = el; }}
                tabIndex={0}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onClick={() => cycleStatus(student.id)}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all outline-none ${
                  isFocused ? "ring-2 ring-blue-400 ring-inset bg-blue-50/50" : "hover:bg-gray-50"
                }`}
              >
                <span className="w-6 text-center text-xs text-gray-400 font-mono">{index + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {student.first_name} {student.last_name}
                  </div>
                  <div className="text-[10px] text-gray-400">{student.roll_number}</div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all select-none ${
                    status === "present" ? "bg-green-100 text-green-700" :
                    status === "absent" ? "bg-red-100 text-red-700" :
                    status === "late" ? "bg-yellow-100 text-yellow-700" :
                    "bg-gray-100 text-gray-700"
                  }`}
                >
                  {status === "present" ? "✅ Present" : status === "absent" ? "❌ Absent" : status === "late" ? "⏰ Late" : "📝 Excused"}
                </span>
              </div>
            );
          })}
          {students.length === 0 && (
            <div className="py-12 text-center text-gray-400 text-sm">Select a subject to see students</div>
          )}
        </div>
      </div>

      {/* Submit */}
      {students.length > 0 && (
        <button
          onClick={handleSubmit}
          disabled={submitted}
          className={`w-full py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${
            submitted
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {submitted ? (
            <><CheckCircle2 size={18} /> Attendance Submitted Successfully</>
          ) : (
            <><Save size={18} /> Submit Attendance ({students.length} students)</>
          )}
        </button>
      )}
    </div>
  );
}

// ============================================================
// ENTER MARKS (Spreadsheet Grid)
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

  // Load existing marks
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

  const enteredCount = Object.values(scores).filter((s) => s !== "").length;
  const avgScore = enteredCount > 0
    ? Math.round(
        Object.values(scores)
          .filter((s) => s !== "")
          .reduce((sum, s) => sum + Number(s), 0) / enteredCount
      )
    : 0;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all animate-fade-in">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">Subject</label>
            <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900">
              {mySubjects.map((s) => <option key={s.id} value={s.id}>{s.name} (Grade {s.grade})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Assessment</label>
            <select value={assessmentType} onChange={(e) => setAssessmentType(e.target.value as typeof assessmentType)} className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900">
              <option value="quiz">Quiz</option>
              <option value="assignment">Assignment</option>
              <option value="midterm">Midterm</option>
              <option value="final">Final Exam</option>
            </select>
          </div>
          <div className="w-24">
            <label className="block text-xs font-medium text-gray-600 mb-1">Max Score</label>
            <input type="number" min={1} value={maxScore} onChange={(e) => setMaxScore(Number(e.target.value) || 100)} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900" />
          </div>
          <div className="flex items-end gap-2">
            <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-xl text-xs font-bold">
              {enteredCount}/{students.length} entered • Avg: {avgScore}%
            </div>
          </div>
        </div>
      </div>

      {/* Mark Entry Grid */}
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all animate-fade-up">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs">
                <th className="text-left py-3 px-4 w-10">#</th>
                <th className="text-left py-3 px-4">Student Name</th>
                <th className="text-left py-3 px-4 w-20 hidden sm:table-cell">Roll #</th>
                <th className="text-center py-3 px-4 w-32">
                  Score <span className="text-gray-400">(0-{maxScore})</span>
                </th>
                <th className="text-left py-3 px-4 w-48 hidden md:table-cell">Remarks</th>
                <th className="text-center py-3 px-4 w-20">Grade</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, i) => {
                const val = scores[student.id] ?? "";
                const isSaved = saved[student.id];
                const score = Number(val);

                return (
                  <tr key={student.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-2 px-4 text-xs text-gray-400">{i + 1}</td>
                    <td className="py-2 px-4 font-medium text-gray-900 text-sm">{student.first_name} {student.last_name}</td>
                    <td className="py-2 px-4 text-xs text-gray-400 font-mono hidden sm:table-cell">{student.roll_number.split("/").pop()}</td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={val}
                        onChange={(e) => handleScoreChange(student.id, e.target.value)}
                        className={`w-full text-center py-1.5 px-2 rounded-lg border text-sm outline-none transition-all ${
                          isSaved
                            ? "border-green-300 bg-green-50 text-green-700"
                            : val !== ""
                            ? "border-yellow-300 bg-yellow-50 text-gray-900"
                            : "border-gray-200 text-gray-900"
                        } focus:border-blue-400 focus:ring-1 focus:ring-blue-400`}
                      />
                    </td>
                    <td className="py-2 px-3 hidden md:table-cell">
                      <input
                        type="text"
                        placeholder="Optional note..."
                        value={remarks[student.id] || ""}
                        onChange={(e) => handleRemarkChange(student.id, e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-xs outline-none focus:border-blue-400"
                      />
                    </td>
                    <td className={`py-2 px-4 text-center font-bold text-sm ${val !== "" ? getEthiopianGrade((score / maxScore) * 100).color : ""}`}>
                      {val !== "" ? getEthiopianGrade((score / maxScore) * 100).grade : ""}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submit */}
      {students.length > 0 && (
        <button
          onClick={handleSubmit}
          disabled={submitted || enteredCount === 0}
          className={`w-full py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${
            submitted
              ? "bg-green-100 text-green-700 border border-green-200"
              : enteredCount === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {submitted ? (
            <><CheckCircle2 size={18} /> Marks Saved Successfully</>
          ) : (
            <><Save size={18} /> Save {enteredCount} Marks</>
          )}
        </button>
      )}
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

  const teacher = state.teachers.find((t) => t.id === teacherId);
  const students = teacher
    ? state.students.filter((s) => s.grade === teacher.assigned_grade && s.section === teacher.assigned_section).sort((a, b) => a.last_name.localeCompare(b.last_name))
    : [];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="w-full sm:w-auto px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900">
          {mySubjects.map((s) => <option key={s.id} value={s.id}>{s.name} (Grade {s.grade})</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs">
                <th className="text-left py-3 px-4">#</th>
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Roll #</th>
                <th className="text-left py-3 px-4 hidden sm:table-cell">Gender</th>
                <th className="text-left py-3 px-4 hidden md:table-cell">Parent Phone</th>
                <th className="text-center py-3 px-4">Avg Score</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, i) => {
                const marks = state.marks.filter((m) => m.student_id === student.id && m.subject_id === selectedSubject);
                const avg = marks.length > 0 ? Math.round(marks.reduce((sum, m) => sum + m.score, 0) / marks.length) : 0;
                return (
                  <tr key={student.id} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5 px-4 text-gray-400">{i + 1}</td>
                    <td className="py-2.5 px-4 font-medium text-gray-900">{student.first_name} {student.last_name}</td>
                    <td className="py-2.5 px-4 text-gray-500 font-mono text-xs">{student.roll_number}</td>
                    <td className="py-2.5 px-4 hidden sm:table-cell">
                      <span className={`px-2 py-0.5 rounded text-xs ${student.gender === "Male" ? "bg-blue-50 text-blue-600" : "bg-pink-50 text-pink-600"}`}>{student.gender}</span>
                    </td>
                    <td className="py-2.5 px-4 text-gray-500 text-xs hidden md:table-cell">{student.parent_phone}</td>
                    <td className="py-2.5 px-4 text-center">
                      <span className={`font-bold text-sm ${avg >= 70 ? "text-green-600" : avg >= 50 ? "text-yellow-600" : "text-red-600"}`}>
                        {marks.length > 0 ? `${avg}%` : "—"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 bg-gray-50 text-xs text-gray-500 border-t border-gray-100">
          {students.length} students enrolled
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ENROLL STUDENT (Teacher submits enrollment request)
// ============================================================
function EnrollStudent() {
  const { currentUser, state } = useApp();
  const { addToast } = useToast();
  const teacher = state.teachers.find((t) => t.id === currentUser?.ref_id);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    age: 15,
    gender: "Male" as "Male" | "Female",
    grade: teacher?.assigned_grade || "9",
    section: teacher?.assigned_section || "A",
    roll_number: "",
    parent_phone: "",
    address: "",
    personal_email: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createStudent({ ...form, enrolled_date: new Date().toISOString().split("T")[0] });
      setSubmitted(`${form.first_name} ${form.last_name}`);
      setForm({ first_name: "", last_name: "", age: 15, gender: "Male", grade: teacher?.assigned_grade || "9", section: teacher?.assigned_section || "A", roll_number: "", parent_phone: "", address: "", personal_email: "" });
      addToast({ type: "success", title: "Enrollment Submitted", message: "The admin will review and issue credentials." });
    } catch (err: any) {
      addToast({ type: "error", title: "Error", message: err.message || "Enrollment failed" });
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      {children}
    </div>
  );

  const inputCls = "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm text-gray-900 transition-all";

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden animate-fade-scale group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 transition-transform duration-700 group-hover:scale-110"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm group-hover:rotate-12 transition-transform">
              <UserPlus size={28} />
            </div>
            <h2 className="text-2xl font-black">Enroll New Student</h2>
          </div>
          <p className="text-blue-100 text-sm font-medium leading-relaxed max-w-xl">
            Fill in the student's details collected during registration. The enrollment will be sent to the admin for approval. Credentials will be emailed to the student's Gmail.
          </p>
        </div>
      </div>

      {submitted && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl animate-fade-in">
          <CheckCircle2 className="text-green-500" size={20} />
          <p className="text-green-800 font-semibold text-sm">
            <span className="notranslate">{submitted}</span> has been submitted for admin approval!
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-100 p-8 space-y-6 shadow-sm hover:shadow-md transition-all animate-fade-up">
        <div className="grid grid-cols-2 gap-4">
          <Field label="First Name">
            <input required value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} className={inputCls} placeholder="e.g. Mekdes" />
          </Field>
          <Field label="Last Name">
            <input required value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} className={inputCls} placeholder="e.g. Tsegaye" />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Age">
            <input required type="number" min={10} max={25} value={form.age} onChange={e => setForm({...form, age: Number(e.target.value)})} className={inputCls} />
          </Field>
          <Field label="Gender">
            <select value={form.gender} onChange={e => setForm({...form, gender: e.target.value as "Male"|"Female"})} className={inputCls}>
              <option>Male</option>
              <option>Female</option>
            </select>
          </Field>
          <Field label="Roll No.">
            <input required value={form.roll_number} onChange={e => setForm({...form, roll_number: e.target.value})} className={inputCls} placeholder="e.g. 001" />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Grade">
            <select value={form.grade} onChange={e => setForm({...form, grade: e.target.value})} className={inputCls}>
              {["9","10","11","12"].map(g => <option key={g}>{g}</option>)}
            </select>
          </Field>
          <Field label="Section">
            <select value={form.section} onChange={e => setForm({...form, section: e.target.value})} className={inputCls}>
              {["A","B","C","D"].map(s => <option key={s}>{s}</option>)}
            </select>
          </Field>
        </div>

        <Field label="Parent / Guardian Phone">
          <input required value={form.parent_phone} onChange={e => setForm({...form, parent_phone: e.target.value})} className={inputCls} placeholder="+251 91 000 0000" />
        </Field>

        <Field label="Home Address">
          <input value={form.address} onChange={e => setForm({...form, address: e.target.value})} className={inputCls} placeholder="Kebele, Woreda, City" />
        </Field>

        <div className="relative">
          <Field label="Student's Personal Email (Gmail) — for credential delivery">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail size={16} />
              </div>
              <input
                required
                type="email"
                value={form.personal_email}
                onChange={e => setForm({...form, personal_email: e.target.value})}
                className={`${inputCls} pl-10`}
                placeholder="student@gmail.com"
              />
            </div>
          </Field>
          <p className="mt-1.5 text-xs text-amber-600 font-medium">⚠️ The admin will send login credentials to this exact email address. Verify it carefully.</p>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-60"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><Send size={16} /> Submit Enrollment Request</>
            )}
          </button>
        </div>
      </form>
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
    case "enroll": return <EnrollStudent />;
    case "profile": return <ProfilePage />;
    default: return <TeacherDashboard />;
  }
}
