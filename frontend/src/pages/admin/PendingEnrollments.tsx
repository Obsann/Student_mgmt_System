import { useState } from "react";
import { Users, Award } from "lucide-react";
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
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-6 text-white">
        <h2 className="text-xl font-bold flex items-center gap-3">
          <Users size={24} />
          Pending Enrollment Requests
          {pendingStudents.length > 0 && (
            <span className="ml-2 px-3 py-1 bg-white/20 rounded-full text-sm font-bold">{pendingStudents.length}</span>
          )}
        </h2>
        <p className="text-amber-100 text-sm mt-1">
          Teachers have enrolled these students. Review and issue login credentials to their personal email.
        </p>
      </div>

      {pendingStudents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award size={28} className="text-green-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">All caught up!</h3>
          <p className="text-sm text-gray-500">No pending enrollment requests at this time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingStudents.map((s) => (
            <div key={s.id} className="bg-white rounded-2xl border border-amber-200 p-5 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Student info */}
                <div className="flex-1">
                  <h3 className="text-base font-bold text-gray-900 notranslate">
                    {s.first_name} {s.last_name}
                  </h3>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded-lg font-semibold">Grade <span className="notranslate">{s.grade}{s.section}</span></span>
                    <span className="bg-gray-100 px-2 py-1 rounded-lg font-semibold">Roll <span className="notranslate">{s.roll_number}</span></span>
                    <span className="bg-gray-100 px-2 py-1 rounded-lg font-semibold">{s.gender} ┬╖ Age <span className="notranslate">{s.age}</span></span>
                    <span className="bg-gray-100 px-2 py-1 rounded-lg font-semibold">Phone: <span className="notranslate">{s.parent_phone}</span></span>
                  </div>
                </div>

                {/* Email + Approve */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:w-auto">
                  <div className="relative flex-1 min-w-[240px]">
                    <input
                      type="email"
                      value={emailOverrides[s.id] ?? s.personal_email ?? ""}
                      onChange={(e) => setEmailOverrides((prev) => ({ ...prev, [s.id]: e.target.value }))}
                      placeholder="student@gmail.com"
                      className="w-full pl-4 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none notranslate"
                    />
                  </div>
                  <button
                    onClick={() => handleIssue(s)}
                    disabled={loading[s.id]}
                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-sm whitespace-nowrap transition-all shadow-sm disabled:opacity-60 flex items-center gap-2 justify-center"
                  >
                    {loading[s.id] ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Γ£ë∩╕Å Approve & Send Credentials</>
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
