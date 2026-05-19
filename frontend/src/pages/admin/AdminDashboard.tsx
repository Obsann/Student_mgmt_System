import { useState, useEffect } from "react";
import { useApp } from "../../contexts/AppContext";
import { Users, UserCheck, BookOpen, ClipboardList, ShieldCheck, Layers, Activity } from "lucide-react";
import { api } from "../../services/api";

export default function AdminDashboard() {
  const { state } = useApp();
  
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [todayLogs, setTodayLogs] = useState(0);

  useEffect(() => {
    api.getAuditLogs(1, 10).then((res) => {
      setRecentLogs(
        res.logs.slice(0, 5).map((log: any) => ({
          id: log._id,
          user: log.userName || 'System',
          details: log.details || log.action,
          timestamp: new Date(log.createdAt).toLocaleString(),
          category: log.entity || 'System',
        }))
      );
      setTodayLogs(res.total || 0); // approx
    }).catch(console.error);
  }, []);

  const totalStudents = state.students.length;
  const totalTeachers = state.teachers.length;
  const activeTeachers = state.teachers.filter(t => t.status === 'Active').length;
  const pendingEnrollments = state.students.filter(s => s.status === 'pending').length || 0;
  const totalSubjects = state.subjects.length;

  const totalMale = state.students.filter(s => s.gender === 'Male').length;
  const totalFemale = state.students.filter(s => s.gender === 'Female').length;

  const grade9 = state.students.filter(s => s.grade === '9').length;
  const grade10 = state.students.filter(s => s.grade === '10').length;
  const sections = Array.from(new Set(state.students.map(s => `${s.grade}${s.section}`)));

  const deptCount: Record<string, number> = {};
  state.teachers.forEach(t => { deptCount[t.department || 'General'] = (deptCount[t.department || 'General'] || 0) + 1; });

  const stats = [
    { label: 'Total Students', value: totalStudents, icon: <Users size={20} className="text-blue-600" />, bg: 'bg-slate-100' },
    { label: 'Total Teachers', value: totalTeachers, icon: <UserCheck size={20} className="text-emerald-600" />, bg: 'bg-slate-100' },
    { label: 'Active Subjects', value: totalSubjects, icon: <BookOpen size={20} className="text-purple-600" />, bg: 'bg-slate-100' },
    { label: 'Pending Enrollments', value: pendingEnrollments, icon: <ClipboardList size={20} className="text-amber-600" />, bg: 'bg-slate-100' },
    { label: 'Active Teachers', value: activeTeachers, icon: <ShieldCheck size={20} className="text-teal-600" />, bg: 'bg-slate-100' },
    { label: 'Sections', value: sections.length, icon: <Layers size={20} className="text-pink-600" />, bg: 'bg-slate-100' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-sm group">
        <div className="absolute right-0 top-0 w-64 h-64 opacity-5 group-hover:rotate-45 transition-transform duration-1000">
          <svg viewBox="0 0 200 200" fill="currentColor"><circle cx="100" cy="100" r="100" /></svg>
        </div>
        <div className="absolute right-32 bottom-0 w-40 h-40 opacity-5 group-hover:-translate-y-4 transition-transform duration-700">
          <svg viewBox="0 0 200 200" fill="currentColor"><circle cx="100" cy="100" r="100" /></svg>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold uppercase tracking-wider border border-slate-700">Admin Panel</span>
            <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold uppercase tracking-wider border border-slate-700">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-2">Welcome, System Administrator <ShieldCheck size={28} className="text-slate-400" /></h2>
          <p className="text-slate-400 mt-2 text-sm font-medium max-w-xl leading-relaxed">
            Kera High School management dashboard. Today you have <span className="text-slate-200 font-bold">{pendingEnrollments} pending enrollment</span> requests and <span className="text-slate-200 font-bold">{todayLogs} system activities</span>.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
            <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>{stat.icon}</div>
            <p className="text-3xl font-black text-slate-900">{stat.value}</p>
            <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Demographics */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="p-6 border-b border-slate-50 bg-slate-50/50">
            <h3 className="font-extrabold text-slate-900">Student Demographics</h3>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Male Students</span>
                <span className="text-sm font-black text-blue-600">{totalMale} ({totalStudents > 0 ? Math.round((totalMale/totalStudents)*100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full transition-all duration-1000" style={{ width: `${totalStudents > 0 ? (totalMale/totalStudents)*100 : 0}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Female Students</span>
                <span className="text-sm font-black text-pink-600">{totalFemale} ({totalStudents > 0 ? Math.round((totalFemale/totalStudents)*100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div className="bg-pink-500 h-full rounded-full transition-all duration-1000" style={{ width: `${totalStudents > 0 ? (totalFemale/totalStudents)*100 : 0}%` }}></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100">
                <p className="text-3xl font-black text-slate-700">{grade9}</p>
                <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">Grade 9</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100">
                <p className="text-3xl font-black text-slate-700">{grade10}</p>
                <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">Grade 10</p>
              </div>
            </div>
          </div>
        </div>

        {/* Department Distribution */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <div className="p-6 border-b border-slate-50 bg-slate-50/50">
            <h3 className="font-extrabold text-slate-900">Departments & Teachers</h3>
          </div>
          <div className="p-6 space-y-3">
            {Object.entries(deptCount).map(([dept, count]) => {
              const colors: Record<string, string> = {
                'Natural Science': 'bg-emerald-500',
                'Social Science': 'bg-blue-500',
                'Language': 'bg-purple-500',
                'Mathematics': 'bg-amber-500',
                'General': 'bg-slate-500'
              };
              return (
                <div key={dept} className="flex items-center gap-4 p-3 bg-slate-50 hover:bg-slate-100 transition-colors rounded-2xl border border-slate-100/50">
                  <div className={`w-12 h-12 ${colors[dept] || 'bg-slate-500'} rounded-xl flex items-center justify-center text-white text-lg font-black shadow-sm`}>
                    {count}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-slate-900">{dept}</p>
                    <p className="text-xs font-medium text-slate-500">{count} teacher{count > 1 ? 's' : ''}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <div className="p-6 border-b border-slate-50 bg-slate-50/50">
            <h3 className="font-extrabold text-slate-900">Recent System Activity</h3>
          </div>
          <div className="p-6 space-y-4">
            {recentLogs.map(log => (
              <div key={log.id} className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors border border-slate-100/50">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-slate-200 text-slate-600 rounded-lg">
                    <Activity size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900">{log.user}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{log.details}</p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
