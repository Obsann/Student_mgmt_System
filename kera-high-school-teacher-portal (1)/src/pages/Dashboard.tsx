import { students, notifications, timetable, attendanceRecords, markRecords } from '../data/mockData';

export default function Dashboard() {
  const totalStudents = students.length;
  const grade9Students = students.filter(s => s.grade === '9').length;
  const grade10Students = students.filter(s => s.grade === '10').length;
  const todayPresent = attendanceRecords.filter(a => a.date === '2025-01-17' && a.status === 'Present').length;
  const todayAttendanceRate = Math.round((todayPresent / 10) * 100);

  // Find top performers
  const avgMarks: Record<string, number[]> = {};
  markRecords.forEach(m => {
    if (!avgMarks[m.studentId]) avgMarks[m.studentId] = [];
    avgMarks[m.studentId].push((m.mark / m.totalMark) * 100);
  });
  const topPerformers = Object.entries(avgMarks)
    .map(([id, marks]) => ({
      student: students.find(s => s.id === id),
      avg: Math.round(marks.reduce((a, b) => a + b, 0) / marks.length),
    }))
    .filter(p => p.student)
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 5);

  // Today's day
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = dayNames[new Date().getDay()] || 'Monday';
  const todaySchedule = timetable.find(t => t.day === today) || timetable[0];

  const stats = [
    { label: 'Total Students', value: totalStudents, icon: '👨‍🎓', color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50', textColor: 'text-blue-700' },
    { label: 'Grade 9', value: grade9Students, icon: '📚', color: 'from-emerald-500 to-emerald-600', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700' },
    { label: 'Grade 10', value: grade10Students, icon: '🎓', color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50', textColor: 'text-purple-700' },
    { label: 'Attendance Rate', value: `${todayAttendanceRate}%`, icon: '✅', color: 'from-amber-500 to-amber-600', bgColor: 'bg-amber-50', textColor: 'text-amber-700' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 opacity-10">
          <svg viewBox="0 0 200 200" fill="currentColor">
            <circle cx="100" cy="100" r="100" />
          </svg>
        </div>
        <div className="absolute right-10 bottom-0 w-40 h-40 opacity-5">
          <svg viewBox="0 0 200 200" fill="currentColor">
            <circle cx="100" cy="100" r="100" />
          </svg>
        </div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold">Welcome back, Dereje! 👋</h2>
          <p className="text-emerald-100 mt-2 text-sm max-w-xl">
            Here's what's happening at Kera Highschool today. You have classes scheduled and 
            {notifications.filter(n => n.type === 'deadline').length} upcoming deadlines.
          </p>
          <div className="flex items-center gap-4 mt-4">
            <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl text-sm font-medium">
              📅 {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl text-sm font-medium">
              🏫 Semester 1, 2024/2025
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
              <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-800 text-lg">Today's Schedule</h3>
              <p className="text-sm text-gray-500">{todaySchedule.day}</p>
            </div>
            <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold">
              {todaySchedule.periods.filter(p => p.subject !== 'Free Period').length} Classes
            </span>
          </div>
          <div className="p-5 space-y-3">
            {todaySchedule.periods.map((period, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${
                  period.subject === 'Free Period'
                    ? 'bg-gray-50 border border-dashed border-gray-200'
                    : 'bg-gray-50 hover:bg-emerald-50 border border-gray-100 hover:border-emerald-200'
                }`}
              >
                <div className="text-sm font-mono text-gray-500 w-28 flex-shrink-0">{period.time}</div>
                <div className={`w-1 h-10 rounded-full flex-shrink-0 ${period.subject === 'Free Period' ? 'bg-gray-300' : 'bg-emerald-500'}`} />
                <div className="flex-1">
                  <p className={`font-medium text-sm ${period.subject === 'Free Period' ? 'text-gray-400' : 'text-gray-800'}`}>
                    {period.subject}
                  </p>
                  <p className="text-xs text-gray-500">
                    {period.grade !== '-' ? `Grade ${period.grade}` : 'No class'} {period.room !== '-' ? `• ${period.room}` : ''}
                  </p>
                </div>
                {period.subject !== 'Free Period' && (
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium">
                    Active
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 text-lg">Notifications</h3>
            <p className="text-sm text-gray-500">{notifications.length} recent updates</p>
          </div>
          <div className="p-4 space-y-3 max-h-[450px] overflow-y-auto">
            {notifications.map((n) => (
              <div key={n.id} className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${
                    n.type === 'meeting' ? 'bg-blue-100 text-blue-600' :
                    n.type === 'exam' ? 'bg-purple-100 text-purple-600' :
                    n.type === 'deadline' ? 'bg-red-100 text-red-600' :
                    'bg-emerald-100 text-emerald-600'
                  }`}>
                    {n.type === 'meeting' ? '📅' : n.type === 'exam' ? '📝' : n.type === 'deadline' ? '⏰' : '🎉'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-800">{n.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{n.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 text-lg">🏆 Top Performers</h3>
            <p className="text-sm text-gray-500">Based on average marks across all assessments</p>
          </div>
          <div className="p-5">
            <div className="space-y-3">
              {topPerformers.map((p, i) => (
                <div key={p.student!.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    i === 0 ? 'bg-yellow-100 text-yellow-700' :
                    i === 1 ? 'bg-gray-200 text-gray-600' :
                    i === 2 ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-800">{p.student!.firstName} {p.student!.lastName}</p>
                    <p className="text-xs text-gray-500">Grade {p.student!.grade}{p.student!.section}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-sm ${p.avg >= 80 ? 'text-emerald-600' : p.avg >= 60 ? 'text-blue-600' : 'text-amber-600'}`}>
                      {p.avg}%
                    </p>
                    <p className="text-xs text-gray-400">Average</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 text-lg">📊 Subject Overview</h3>
            <p className="text-sm text-gray-500">Performance summary by subject</p>
          </div>
          <div className="p-5 space-y-5">
            {['Mathematics', 'Physics'].map(subject => {
              const subjectMarks = markRecords.filter(m => m.subject === subject);
              const avgMark = subjectMarks.length > 0
                ? Math.round(subjectMarks.reduce((sum, m) => sum + (m.mark / m.totalMark) * 100, 0) / subjectMarks.length)
                : 0;
              const highestMark = subjectMarks.length > 0
                ? Math.round(Math.max(...subjectMarks.map(m => (m.mark / m.totalMark) * 100)))
                : 0;
              const lowestMark = subjectMarks.length > 0
                ? Math.round(Math.min(...subjectMarks.map(m => (m.mark / m.totalMark) * 100)))
                : 0;

              return (
                <div key={subject} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-800">{subject}</h4>
                    <span className="text-sm text-gray-500">{subjectMarks.length} records</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-emerald-50 rounded-xl p-3 text-center">
                      <p className="text-lg font-bold text-emerald-700">{avgMark}%</p>
                      <p className="text-xs text-emerald-600">Average</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-3 text-center">
                      <p className="text-lg font-bold text-blue-700">{highestMark}%</p>
                      <p className="text-xs text-blue-600">Highest</p>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-3 text-center">
                      <p className="text-lg font-bold text-amber-700">{lowestMark}%</p>
                      <p className="text-xs text-amber-600">Lowest</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${avgMark >= 80 ? 'bg-emerald-500' : avgMark >= 60 ? 'bg-blue-500' : 'bg-amber-500'}`}
                      style={{ width: `${avgMark}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
