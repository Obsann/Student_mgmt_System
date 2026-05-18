import { adminTeachers, enrollmentRequests, subjects, auditLogs } from '../../data/adminMockData';
import { students } from '../../data/mockData';

export default function AdminDashboard() {
  const totalStudents = students.length;
  const totalTeachers = adminTeachers.length;
  const activeTeachers = adminTeachers.filter(t => t.status === 'Active').length;
  const pendingEnrollments = enrollmentRequests.filter(e => e.status === 'Pending').length;
  const totalSubjects = subjects.filter(s => s.status === 'Active').length;
  const todayLogs = auditLogs.filter(l => l.timestamp.startsWith('2025-01-17')).length;
  const totalMale = students.filter(s => s.gender === 'Male').length;
  const totalFemale = students.filter(s => s.gender === 'Female').length;

  const grade9 = students.filter(s => s.grade === '9').length;
  const grade10 = students.filter(s => s.grade === '10').length;
  const sections = Array.from(new Set(students.map(s => `${s.grade}${s.section}`)));

  const deptCount: Record<string, number> = {};
  adminTeachers.forEach(t => { deptCount[t.department] = (deptCount[t.department] || 0) + 1; });

  const recentLogs = auditLogs.slice(0, 5);
  const recentEnrollments = enrollmentRequests.filter(e => e.status === 'Pending').slice(0, 4);

  const stats = [
    { label: 'Total Students', value: totalStudents, icon: '👨‍🎓', color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Teachers', value: totalTeachers, icon: '👩‍🏫', color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Active Subjects', value: totalSubjects, icon: '📚', color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50' },
    { label: 'Pending Enrollments', value: pendingEnrollments, icon: '📋', color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50' },
    { label: 'Active Teachers', value: activeTeachers, icon: '✅', color: 'from-teal-500 to-teal-600', bg: 'bg-teal-50' },
    { label: 'Sections', value: sections.length, icon: '🏫', color: 'from-pink-500 to-pink-600', bg: 'bg-pink-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 opacity-5">
          <svg viewBox="0 0 200 200" fill="currentColor"><circle cx="100" cy="100" r="100" /></svg>
        </div>
        <div className="absolute right-32 bottom-0 w-40 h-40 opacity-5">
          <svg viewBox="0 0 200 200" fill="currentColor"><circle cx="100" cy="100" r="100" /></svg>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-lg text-xs font-bold uppercase tracking-wider">Admin Panel</span>
          </div>
          <h2 className="text-2xl font-bold">Welcome, System Administrator! 🔐</h2>
          <p className="text-slate-300 mt-2 text-sm max-w-xl">
            Kera Highschool management dashboard. Today you have {pendingEnrollments} pending enrollment requests and {todayLogs} system activities.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center text-xl mb-3`}>{stat.icon}</div>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Demographics */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">Student Demographics</h3>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Male Students</span>
                <span className="text-sm font-bold text-blue-600">{totalMale} ({Math.round((totalMale/totalStudents)*100)}%)</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div className="bg-blue-500 h-3 rounded-full transition-all" style={{ width: `${(totalMale/totalStudents)*100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Female Students</span>
                <span className="text-sm font-bold text-pink-600">{totalFemale} ({Math.round((totalFemale/totalStudents)*100)}%)</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div className="bg-pink-500 h-3 rounded-full transition-all" style={{ width: `${(totalFemale/totalStudents)*100}%` }}></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-emerald-50 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-emerald-700">{grade9}</p>
                <p className="text-xs text-emerald-600">Grade 9</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-purple-700">{grade10}</p>
                <p className="text-xs text-purple-600">Grade 10</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2 mt-3 font-semibold uppercase tracking-wider">Sections</p>
              <div className="flex flex-wrap gap-2">
                {sections.map(s => (
                  <span key={s} className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">Grade {s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Department Distribution */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">Departments & Teachers</h3>
          </div>
          <div className="p-5 space-y-3">
            {Object.entries(deptCount).map(([dept, count]) => {
              const colors: Record<string, string> = {
                'Natural Science': 'bg-emerald-500',
                'Social Science': 'bg-blue-500',
                'Language': 'bg-purple-500',
                'IT': 'bg-amber-500',
                'Arts': 'bg-pink-500',
              };
              return (
                <div key={dept} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className={`w-10 h-10 ${colors[dept] || 'bg-gray-500'} rounded-lg flex items-center justify-center text-white text-sm font-bold`}>
                    {count}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-800">{dept}</p>
                    <p className="text-xs text-gray-500">{count} teacher{count > 1 ? 's' : ''}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="px-5 pb-5">
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <div className="flex items-center justify-between">
                <span className="text-sm text-amber-700 font-medium">Total Salary/Month</span>
                <span className="text-lg font-bold text-amber-700">
                  {adminTeachers.reduce((sum, t) => sum + parseInt(t.salary.replace(/[^0-9]/g, '')), 0).toLocaleString()} ETB
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">Recent Activity</h3>
          </div>
          <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
            {recentLogs.map(log => (
              <div key={log.id} className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${
                    log.category === 'Student' ? 'bg-blue-100 text-blue-600' :
                    log.category === 'Teacher' ? 'bg-emerald-100 text-emerald-600' :
                    log.category === 'Marks' ? 'bg-purple-100 text-purple-600' :
                    log.category === 'System' ? 'bg-amber-100 text-amber-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {log.category === 'System' ? '⚙️' : log.category === 'Marks' ? '📝' : log.category === 'Teacher' ? '👩‍🏫' : '👨‍🎓'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">{log.user}</p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{log.details}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{log.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Enrollments */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-800">Pending Enrollments</h3>
            <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold">{pendingEnrollments} Pending</span>
          </div>
          <div className="p-5 space-y-3">
            {recentEnrollments.map(req => (
              <div key={req.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  req.gender === 'Male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                }`}>
                  {req.studentName.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-800">{req.studentName}</p>
                  <p className="text-xs text-gray-500">Grade {req.grade}{req.section} • {req.submittedDate}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  req.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Teacher Status */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">Teacher Status Overview</h3>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-emerald-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-emerald-700">{activeTeachers}</p>
                <p className="text-xs text-emerald-600 font-medium">Active</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-amber-700">{adminTeachers.filter(t => t.status === 'On Leave').length}</p>
                <p className="text-xs text-amber-600 font-medium">On Leave</p>
              </div>
              <div className="bg-red-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-red-700">{adminTeachers.filter(t => t.status === 'Inactive').length}</p>
                <p className="text-xs text-red-600 font-medium">Inactive</p>
              </div>
            </div>
            <div className="space-y-2">
              {adminTeachers.filter(t => t.status !== 'Active').map(t => (
                <div key={t.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                    {t.firstName[0]}{t.lastName[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{t.firstName} {t.lastName}</p>
                    <p className="text-xs text-gray-500">{t.department}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    t.status === 'On Leave' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
