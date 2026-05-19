import { useApp } from "../contexts/AppContext";
import { BookOpen, CheckCircle, Shield, User, GraduationCap } from "lucide-react";

export default function GuidePage() {
  const { currentUser } = useApp();

  if (!currentUser) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm p-8">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <BookOpen size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">User Guide</h1>
            <p className="text-slate-500 font-medium">Learn how to navigate and use your portal</p>
          </div>
        </div>

        <div className="space-y-8">
          {currentUser.role === "admin" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Shield className="text-indigo-600" size={20} /> Admin Portal Guide
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GuideCard 
                  title="Dashboard" 
                  description="View high-level statistics, system health, and recent activities. Monitor overall school performance." 
                />
                <GuideCard 
                  title="Manage Users" 
                  description="Navigate to 'Students' or 'Teachers' to view, add, or edit accounts. Ensure data accuracy." 
                />
                <GuideCard 
                  title="Subjects & Classes" 
                  description="Configure the subjects offered and assign them to the correct grades in the 'Subjects' section." 
                />
                <GuideCard 
                  title="System Settings" 
                  description="Adjust global configurations, manage registration windows, and review audit logs for security." 
                />
              </div>
            </div>
          )}

          {currentUser.role === "teacher" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <User className="text-emerald-600" size={20} /> Teacher Portal Guide
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GuideCard 
                  title="My Classes" 
                  description="View your assigned home room students. Monitor their overall progress and contact information." 
                />
                <GuideCard 
                  title="Record Attendance" 
                  description="Daily attendance tracking. Select a date and mark students as present, absent, or late." 
                />
                <GuideCard 
                  title="Manage Marks" 
                  description="Input grades for mid-terms, final exams, and assignments. Double check scores before saving." 
                />
                <GuideCard 
                  title="Student Registration" 
                  description="When the window is open, you can register new students directly to your home room." 
                />
              </div>
            </div>
          )}

          {currentUser.role === "student" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <GraduationCap className="text-amber-600" size={20} /> Student Portal Guide
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GuideCard 
                  title="Your Dashboard" 
                  description="A summary of your academic life. Check your average mark, attendance rate, and current term progress." 
                />
                <GuideCard 
                  title="My Marks" 
                  description="Detailed breakdown of your grades by subject. Filter by class and see your performance over time." 
                />
                <GuideCard 
                  title="My Attendance" 
                  description="Review your attendance history. Ensure there are no unexcused absences on your record." 
                />
                <GuideCard 
                  title="Profile Settings" 
                  description="Update your contact information, security questions, or cover photo via the 'My Profile' dropdown." 
                />
              </div>
            </div>
          )}

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-2">Need more help?</h3>
            <p className="text-sm text-slate-600 mb-4">
              If you encounter technical issues or need assistance beyond this guide, please contact the school administration or your IT support desk.
            </p>
            <div className="flex items-center gap-2 text-sm font-bold text-indigo-600">
              <CheckCircle size={16} /> Support is available during school hours.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GuideCard({ title, description }: { title: string, description: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-200 transition-colors shadow-sm">
      <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}
