import { useState } from "react";
import { BarChart3, Award, FileSpreadsheet, Download, RefreshCw } from "lucide-react";
import { useApp } from "../../contexts/AppContext";

export default function AdminReports() {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState<"analytics" | "exports">("analytics");
  const [generating, setGenerating] = useState<string | null>(null);

  // Dynamic Subject Stats
  const subjectStats = state.subjects.map((sub) => {
    const subMarks = state.marks.filter((m) => m.subject_id === sub.id);
    const avg = subMarks.length > 0 ? Math.round(subMarks.reduce((sum, m) => sum + m.score, 0) / subMarks.length) : 0;
    return { ...sub, avg, count: subMarks.length };
  }).filter((s) => s.count > 0).sort((a, b) => b.avg - a.avg);

  // Dynamic Student Stats
  const studentAvgs = state.students.map((s) => {
    const marks = state.marks.filter((m) => m.student_id === s.id);
    const avg = marks.length > 0 ? Math.round(marks.reduce((sum, m) => sum + m.score, 0) / marks.length) : 0;
    return { ...s, avg, markCount: marks.length };
  }).filter((s) => s.markCount > 0).sort((a, b) => b.avg - a.avg);

  // Overall calculations
  const totalMarks = state.marks.length;
  const averageSystemScore = state.marks.length > 0 ? Math.round(state.marks.reduce((sum, m) => sum + m.score, 0) / state.marks.length) : 0;
  const passingStudents = studentAvgs.filter(s => s.avg >= 50).length;
  const passRate = studentAvgs.length > 0 ? Math.round((passingStudents / studentAvgs.length) * 100) : 0;

  // Mock static reports to generate
  const [reports, setReports] = useState([
    { id: "REP-001", title: "Q1 Academic Performance Summary", type: "Academic", generatedDate: "2026-05-10", size: "2.4 MB", format: "PDF", status: "Ready" },
    { id: "REP-002", title: "Student Attendance Muster Roll", type: "Attendance", generatedDate: "2026-05-15", size: "1.1 MB", format: "Excel", status: "Ready" },
    { id: "REP-003", title: "Teacher Workload & Assignments", type: "Teacher", generatedDate: "2026-05-12", size: "950 KB", format: "PDF", status: "Ready" }
  ]);

  const handleGenerateReport = (title: string, type: string, format: string) => {
    const id = `REP-00${reports.length + 1}`;
    setGenerating(id);
    setTimeout(() => {
      setReports(prev => [
        {
          id,
          title,
          type,
          generatedDate: new Date().toISOString().split('T')[0],
          size: `${(Math.random() * 3 + 0.5).toFixed(1)} MB`,
          format,
          status: "Ready"
        },
        ...prev
      ]);
      setGenerating(null);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-up">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 group hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">📈</div>
          <p className="text-3xl font-black text-slate-900">{averageSystemScore}%</p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Average School Score</p>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 group hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">✅</div>
          <p className="text-3xl font-black text-slate-900">{passRate}%</p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Overall Pass Rate</p>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 group hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">📝</div>
          <p className="text-3xl font-black text-slate-900">{totalMarks}</p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Grades Recorded</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl max-w-sm animate-fade-up" style={{ animationDelay: '0.05s' }}>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'analytics' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
        >
          Performance Analytics
        </button>
        <button
          onClick={() => setActiveTab("exports")}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'exports' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
        >
          Document Center
        </button>
      </div>

      {activeTab === "analytics" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Subject Performance */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-base font-extrabold text-slate-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100/50 flex items-center justify-center text-purple-600">
                <BarChart3 size={18} />
              </div>
              Subject Performance
            </h3>
            <div className="space-y-4">
              {subjectStats.map((s) => (
                <div key={s.id} className="flex items-center gap-4 group">
                  <span className="text-sm text-slate-700 w-36 truncate font-bold">{s.name}</span>
                  <div className="flex-1 bg-slate-50 border border-slate-100 rounded-full h-4 overflow-hidden relative">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${s.avg >= 75 ? "bg-gradient-to-r from-emerald-400 to-emerald-500" : s.avg >= 60 ? "bg-gradient-to-r from-amber-400 to-amber-500" : "bg-gradient-to-r from-rose-400 to-rose-500"}`}
                      style={{ width: `${s.avg}%` }}
                    />
                  </div>
                  <span className="text-sm font-black text-slate-700 w-12 text-right">{s.avg}%</span>
                </div>
              ))}
              {subjectStats.length === 0 && (
                <div className="text-center py-8 text-slate-400 font-bold">No academic performance records recorded.</div>
              )}
            </div>
          </div>

          {/* Top Students */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all animate-fade-up" style={{ animationDelay: '0.15s' }}>
            <h3 className="text-base font-extrabold text-slate-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100/50 flex items-center justify-center text-amber-600">
                <Award size={18} />
              </div>
              Honor Roll Rank
            </h3>
            <div className="space-y-2.5">
              {studentAvgs.slice(0, 8).map((s, i) => (
                <div key={s.id} className="flex items-center gap-4 p-3.5 rounded-2xl hover:bg-slate-50 transition-colors group">
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ${i < 3 ? "bg-gradient-to-br from-amber-400 to-orange-400 text-white shadow-sm" : "bg-slate-100 text-slate-500"}`}>
                    {i + 1}
                  </span>
                  <span className="text-sm text-slate-900 flex-1 font-bold">{s.first_name} {s.last_name}</span>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider bg-slate-50 px-2.5 py-1 rounded-xl">Grade {s.grade}{s.section}</span>
                  <span className="text-sm font-black text-slate-700">{s.avg}%</span>
                </div>
              ))}
              {studentAvgs.length === 0 && (
                <div className="text-center py-8 text-slate-400 font-bold">No registered student scores to generate Honor Roll.</div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Quick Generate Panel */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-3">
              <FileSpreadsheet className="text-amber-500" size={18} />
              Quick Report Generator
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                disabled={generating !== null}
                onClick={() => handleGenerateReport("Overall Performance Summary", "Academic", "PDF")}
                className="p-5 border border-slate-100 hover:border-amber-500/50 rounded-2xl hover:bg-amber-50/10 transition-all text-left flex items-start justify-between group disabled:opacity-50"
              >
                <div>
                  <h4 className="font-extrabold text-slate-900 group-hover:text-amber-600 transition-colors">Academic Summary</h4>
                  <p className="text-xs text-slate-400 mt-1 font-medium">Generate system wide GPA & subject performance</p>
                </div>
                {generating === "overall" ? <RefreshCw className="animate-spin text-amber-500" size={16} /> : <Download className="text-slate-400 group-hover:text-amber-500 transition-colors" size={16} />}
              </button>

              <button
                disabled={generating !== null}
                onClick={() => handleGenerateReport("System Student Muster Roll", "Academic", "Excel")}
                className="p-5 border border-slate-100 hover:border-blue-500/50 rounded-2xl hover:bg-blue-50/10 transition-all text-left flex items-start justify-between group disabled:opacity-50"
              >
                <div>
                  <h4 className="font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">Student Roster Excel</h4>
                  <p className="text-xs text-slate-400 mt-1 font-medium">Generate excel export of all active students</p>
                </div>
                <Download className="text-slate-400 group-hover:text-blue-500 transition-colors" size={16} />
              </button>

              <button
                disabled={generating !== null}
                onClick={() => handleGenerateReport("Weekly Attendance Roster", "Attendance", "PDF")}
                className="p-5 border border-slate-100 hover:border-emerald-500/50 rounded-2xl hover:bg-emerald-50/10 transition-all text-left flex items-start justify-between group disabled:opacity-50"
              >
                <div>
                  <h4 className="font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">Attendance Audit</h4>
                  <p className="text-xs text-slate-400 mt-1 font-medium">Export comprehensive compliance & stats</p>
                </div>
                <Download className="text-slate-400 group-hover:text-emerald-500 transition-colors" size={16} />
              </button>
            </div>
          </div>

          {/* List of Exports */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-fade-up" style={{ animationDelay: '0.15s' }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Report Title</th>
                    <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                    <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Size</th>
                    <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {reports.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{r.format === 'PDF' ? '📕' : '📊'}</span>
                          <div>
                            <p className="text-sm font-extrabold text-slate-900">{r.title}</p>
                            <span className="text-[10px] font-mono text-slate-400 mt-0.5">{r.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          r.type === 'Academic' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                        }`}>{r.type}</span>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-400">{r.generatedDate}</td>
                      <td className="px-6 py-4 text-center text-xs font-semibold text-slate-500">{r.size}</td>
                      <td className="px-6 py-4 text-center">
                        <button className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 justify-center mx-auto">
                          <Download size={12} /> Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
