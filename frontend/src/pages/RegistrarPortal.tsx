import { UserPlus, Users, ClipboardList } from "lucide-react";
import StudentRegistrationForm from "../components/StudentRegistrationForm";
import ProfilePage from "./ProfilePage";
import { useApp } from "../contexts/AppContext";
import type { Student } from "../types";

export default function RegistrarPortal({ activePage }: { activePage: string }) {
  const renderContent = () => {
    switch (activePage) {
      case "register":
        return <StudentRegistrationForm />;
      case "students":
        return <RegisteredStudentsList />;
      case "profile":
        return <ProfilePage />;
      default:
        return <RegistrarStats />;
    }
  };

  return (
    <div className="space-y-6">
      {renderContent()}
    </div>
  );
}

function RegistrarStats() {
  const { state } = useApp();
  const totalRegisteredToday = state.students.filter((s: Student) => {
    const d = new Date(s.enrolled_date);
    const today = new Date();
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  }).length;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden animate-fade-scale group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 transition-transform duration-700 group-hover:scale-110"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black">Registrar Dashboard</h2>
          <p className="text-indigo-100 text-sm mt-2 font-medium italic opacity-80">"Precision in records, excellence in education."</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <StatItem icon={<UserPlus size={24} />} label="Registered Today" value={totalRegisteredToday} />
            <StatItem icon={<Users size={24} />} label="Total Students" value={state.students.length} />
            <StatItem icon={<ClipboardList size={24} />} label="Active Status" value={state.students.filter((s: Student) => s.status === 'active').length} />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm hover:shadow-md transition-all">
          <h3 className="text-lg font-black text-slate-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <QuickAction icon={<UserPlus />} label="New Registration" color="bg-indigo-50 text-indigo-600" />
            <QuickAction icon={<Users />} label="View Records" color="bg-emerald-50 text-emerald-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm hover:shadow-md transition-all">
          <h3 className="text-lg font-black text-slate-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {state.students.slice(-4).reverse().map((s: Student) => (
              <div key={s.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 font-black text-xs uppercase">
                    {s.first_name[0]}{s.last_name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{s.first_name} {s.last_name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enrolled: {new Date(s.enrolled_date).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className="text-xs font-black text-indigo-600 bg-white px-2 py-1 rounded-lg border border-slate-100">Grade {s.grade}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RegisteredStudentsList() {
  const { state } = useApp();
  return (
    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-50 flex justify-between items-center">
        <h3 className="text-lg font-black text-slate-900">Student Records</h3>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{state.students.length} Total Records</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
              <th className="px-6 py-4">Fayda ID</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Grade</th>
              <th className="px-6 py-4">Section</th>
              <th className="px-6 py-4">National Exam #</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {state.students.map((s: Student) => (
              <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 text-xs font-mono font-bold text-slate-600">{s.fayda_id}</td>
                <td className="px-6 py-4 text-sm font-bold text-slate-900">{s.first_name} {s.middle_name} {s.last_name}</td>
                <td className="px-6 py-4 text-sm font-bold text-slate-600">{s.grade}</td>
                <td className="px-6 py-4 text-sm font-bold text-slate-600">{s.section}</td>
                <td className="px-6 py-4 text-xs font-mono text-slate-400">{s.national_exam_number}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                    s.status === 'active' ? "bg-green-50 text-green-600 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"
                  }`}>
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatItem({ icon, label, value }: any) {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-4 group hover:bg-white/20 transition-all cursor-default">
      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform">{icon}</div>
      <div>
        <p className="text-2xl font-black leading-none">{value}</p>
        <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-100 mt-1">{label}</p>
      </div>
    </div>
  );
}

function QuickAction({ icon, label, color }: any) {
  return (
    <button className={`flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border border-transparent transition-all hover:scale-[1.02] hover:shadow-lg ${color} border-current border-opacity-5`}>
      <div className="scale-125">{icon}</div>
      <span className="text-xs font-black uppercase tracking-wider">{label}</span>
    </button>
  );
}
