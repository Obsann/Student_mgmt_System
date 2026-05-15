import { Users, BookOpen, UserCheck, TrendingUp, Award } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import StatCard from "../../components/StatCard";
import { getEthiopianGrade } from "../../utils/gradeCalculator";

export default function AdminDashboard() {
  const { state } = useApp();
  const totalStudents = state.students.length;
  const totalTeachers = state.teachers.length;
  const totalSubjects = state.subjects.length;
  const grade9 = state.students.filter((s) => s.grade === "9").length;
  const grade10 = state.students.filter((s) => s.grade === "10").length;
  const totalAttendance = state.attendance.length;
  const presentCount = state.attendance.filter((a) => a.status === "present").length;
  const avgAttendance = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users size={28} />} label="Total Students" value={totalStudents} color="blue" sub={`Grade 9: ${grade9} | Grade 10: ${grade10}`} />
        <StatCard icon={<UserCheck size={28} />} label="Teachers" value={totalTeachers} color="green" />
        <StatCard icon={<BookOpen size={28} />} label="Subjects" value={totalSubjects} color="purple" />
        <StatCard icon={<TrendingUp size={28} />} label="Avg Attendance" value={`${avgAttendance}%`} color="orange" />
      </div>

      {/* Grade Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-up">
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all">
          <h3 className="text-base font-extrabold text-slate-900 mb-5">Students by Grade & Section</h3>
          {["9", "10"].map((grade) => (
            <div key={grade} className="mb-4">
              <div className="flex items-center justify-between text-sm font-bold text-slate-600 mb-2">
                <span>Grade {grade}</span>
                <span className="text-slate-400">{state.students.filter((s) => s.grade === grade).length} students</span>
              </div>
              <div className="flex gap-2">
                {["A", "B"].map((sec) => {
                  const count = state.students.filter((s) => s.grade === grade && s.section === sec).length;
                  const width = totalStudents > 0 ? (count / totalStudents) * 100 : 0;
                  return (
                    <div key={sec} className="flex-1 group">
                      <div className="bg-slate-100 rounded-full h-4 overflow-hidden shadow-inner">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${grade === "9" ? "bg-gradient-to-r from-blue-400 to-blue-500" : "bg-gradient-to-r from-purple-400 to-purple-500"}`}
                          style={{ width: `${Math.max(width * 2, 10)}%` }}
                        />
                      </div>
                      <div className="text-xs font-bold text-slate-400 mt-1 text-center group-hover:text-slate-600 transition-colors">Sec {sec}: {count}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all">
          <h3 className="text-base font-extrabold text-slate-900 mb-5">Subject-Teacher Assignments</h3>
          <div className="space-y-3 max-h-[220px] overflow-y-auto custom-scrollbar pr-2">
            {state.subjects.slice(0, 8).map((sub) => {
              const teacher = state.teachers.find((t) => t.id === sub.teacher_id);
              return (
                <div key={sub.id} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors">
                  <span className="font-mono bg-indigo-100 text-indigo-700 px-2 py-1 rounded-lg text-xs font-bold">{sub.code}</span>
                  <span className="text-slate-700 font-bold text-sm flex-1">{sub.name}</span>
                  <span className="text-slate-400 text-xs font-semibold bg-white px-2 py-1 rounded-lg border border-slate-200">
                    {teacher?.name?.split(" ").pop() || "N/A"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Marks */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <h3 className="text-base font-extrabold text-slate-900 mb-5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
            <Award size={16} />
          </div>
          Recent Mark Entries
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-100 font-bold text-xs uppercase tracking-wider">
                <th className="text-left py-3 px-4">Student</th>
                <th className="text-left py-3 px-4">Subject</th>
                <th className="text-left py-3 px-4">Type</th>
                <th className="text-center py-3 px-4">Score</th>
              </tr>
            </thead>
            <tbody>
              {state.marks.slice(-10).reverse().map((m) => {
                const student = state.students.find((s) => s.id === m.student_id);
                const subject = state.subjects.find((s) => s.id === m.subject_id);
                return (
                  <tr key={m.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors group">
                    <td className="py-3 px-4 text-slate-700 font-bold">{student?.first_name} {student?.last_name}</td>
                    <td className="py-3 px-4 text-slate-500 font-medium">{subject?.name}</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold capitalize border border-blue-100 group-hover:bg-blue-100 transition-colors">
                        {m.assessment_type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-black">
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-slate-700">{m.score}</span>
                        <span className={`px-2 py-1 rounded-lg text-xs border ${getEthiopianGrade(m.score).color} bg-opacity-10 group-hover:scale-110 transition-transform`}>
                          {getEthiopianGrade(m.score).grade}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
