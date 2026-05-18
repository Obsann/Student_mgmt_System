import { useState } from "react";
import { Users, CheckCircle } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import { useToast } from "../../contexts/ToastContext";
import { api } from "../../services/api";

export default function PendingEnrollments() {
  const { state, loadAllData } = useApp();
  const { addToast } = useToast();
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [emailOverrides, setEmailOverrides] = useState<Record<string, string>>({});

  const pendingStudents = state.students.filter((s) => s.status === "pending");

  const handleIssue = async (student: typeof pendingStudents[number]) => {
    const email = emailOverrides[student.id] || student.personal_email;
    if (!email) {
      addToast({ type: "error", title: "Email Required", message: `Please enter a delivery email for ${student.first_name} ${student.last_name}` });
      return;
    }
    setLoading((prev) => ({ ...prev, [student.id]: true }));
    try {
      const result = await api.issueCredentials(student.id, email);
      addToast({ type: "success", title: "Credentials Issued!", message: result.message });
      await loadAllData();
    } catch (err: unknown) {
      addToast({ type: "error", title: "Failed", message: err instanceof Error ? err.message : "Could not issue credentials" });
    } finally {
      setLoading((prev) => ({ ...prev, [student.id]: false }));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-8 text-white shadow-lg shadow-amber-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 animate-fade-up">
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-md">
              <Users size={24} />
            </div>
            <h2 className="text-2xl font-black tracking-tight">
              Pending Enrollments
              {pendingStudents.length > 0 && (
                <span className="ml-3 px-3 py-1 bg-white text-amber-600 rounded-full text-xs font-black">{pendingStudents.length}</span>
              )}
            </h2>
          </div>
          <p className="text-amber-50/80 text-sm font-semibold mt-2 max-w-xl leading-relaxed">
            Teachers have submitted these student registrations. Please review their credentials email delivery address and approve their entry.
          </p>
        </div>
      </div>

      {pendingStudents.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-16 text-center animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="w-20 h-20 bg-emerald-50 border border-emerald-100/50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={36} className="text-emerald-500" />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">All Caught Up!</h3>
          <p className="text-sm font-semibold text-slate-500 max-w-md mx-auto leading-relaxed">No pending student enrollment requests require credential issuance at this moment.</p>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          {pendingStudents.map((s) => (
            <div key={s.id} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md hover:border-amber-200 transition-all">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Student Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black shrink-0 ${s.gender === 'Male' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'}`}>
                      {s.first_name[0]}{s.last_name[0]}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900">
                        {s.first_name} {s.last_name}
                      </h3>
                      <div className="flex flex-wrap gap-2.5 mt-1.5">
                        <span className="bg-slate-50 text-slate-600 px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider">Grade {s.grade}-{s.section}</span>
                        <span className="bg-slate-50 text-slate-600 px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider">Roll {s.roll_number}</span>
                        <span className="bg-slate-50 text-slate-600 px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider">{s.gender} • {s.age} yrs</span>
                        <span className="bg-slate-50 text-slate-600 px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider">📞 {s.parent_phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email Delivery & Action */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:w-auto shrink-0">
                  <div className="relative flex-1 min-w-[280px]">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 uppercase tracking-widest">Email:</span>
                    <input
                      type="email"
                      value={emailOverrides[s.id] ?? s.personal_email ?? ""}
                      onChange={(e) => setEmailOverrides((prev) => ({ ...prev, [s.id]: e.target.value }))}
                      placeholder="student@gmail.com"
                      className="w-full pl-20 pr-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 text-sm font-bold focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all outline-none"
                    />
                  </div>
                  <button
                    onClick={() => handleIssue(s)}
                    disabled={loading[s.id]}
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-amber-500/20 disabled:shadow-none hover:-translate-y-0.5 disabled:translate-y-0 whitespace-nowrap flex items-center gap-2 justify-center"
                  >
                    {loading[s.id] ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <> Approve & Send Credentials </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
