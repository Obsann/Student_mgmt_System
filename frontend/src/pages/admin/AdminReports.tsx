import { BarChart3, Award } from "lucide-react";
import { useApp } from "../../contexts/AppContext";

export default function AdminReports() {
  const { state } = useApp();

  // Average score by subject
  const subjectStats = state.subjects.map((sub) => {
    const subMarks = state.marks.filter((m) => m.subject_id === sub.id);
    const avg = subMarks.length > 0 ? Math.round(subMarks.reduce((sum, m) => sum + m.score, 0) / subMarks.length) : 0;
    return { ...sub, avg, count: subMarks.length };
  }).filter((s) => s.count > 0).sort((a, b) => b.avg - a.avg);

  // Top students
  const studentAvgs = state.students.slice(0, 16).map((s) => {
    const marks = state.marks.filter((m) => m.student_id === s.id);
    const avg = marks.length > 0 ? Math.round(marks.reduce((sum, m) => sum + m.score, 0) / marks.length) : 0;
    return { ...s, avg, markCount: marks.length };
  }).filter((s) => s.markCount > 0).sort((a, b) => b.avg - a.avg);

  return (
    <div className="space-y-6">
      {/* Subject Performance */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all animate-fade-up">
        <h3 className="text-base font-extrabold text-slate-900 mb-5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-500">
            <BarChart3 size={16} />
          </div>
          Average Score by Subject
        </h3>
        <div className="space-y-4">
          {subjectStats.map((s) => (
            <div key={s.id} className="flex items-center gap-4 group">
              <span className="text-sm text-slate-700 w-36 truncate font-bold">{s.name}</span>
              <div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden shadow-inner">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${s.avg >= 75 ? "bg-gradient-to-r from-green-400 to-green-500" : s.avg >= 60 ? "bg-gradient-to-r from-yellow-400 to-yellow-500" : "bg-gradient-to-r from-red-400 to-red-500"}`}
                  style={{ width: `${s.avg}%` }}
                />
              </div>
              <span className="text-sm font-black text-slate-700 w-12 text-right">{s.avg}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Students */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <h3 className="text-base font-extrabold text-slate-900 mb-5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
            <Award size={16} />
          </div>
          Top Performing Students
        </h3>
        <div className="space-y-2">
          {studentAvgs.slice(0, 10).map((s, i) => (
            <div key={s.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors group">
              <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${i < 3 ? "bg-gradient-to-br from-yellow-400 to-orange-400 text-white shadow-sm" : "bg-slate-100 text-slate-500"}`}>
                {i + 1}
              </span>
              <span className="text-sm text-slate-900 flex-1 font-bold">{s.first_name} {s.last_name}</span>
              <span className="text-xs text-slate-400 font-bold bg-slate-50 px-2 py-1 rounded-lg">Grade {s.grade}{s.section}</span>
              <span className="text-sm font-black text-slate-700">{s.avg}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
