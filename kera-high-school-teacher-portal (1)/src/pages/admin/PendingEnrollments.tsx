import { useState } from 'react';
import { enrollmentRequests } from '../../data/adminMockData';

export default function PendingEnrollments() {
  const [enrollments, setEnrollments] = useState(enrollmentRequests);
  const [filter, setFilter] = useState<string>('All');
  const [selectedEnrollment, setSelectedEnrollment] = useState<string | null>(null);

  const filtered = enrollments.filter(e => filter === 'All' || e.status === filter);
  const pendingCount = enrollments.filter(e => e.status === 'Pending').length;
  const underReviewCount = enrollments.filter(e => e.status === 'Under Review').length;
  const approvedCount = enrollments.filter(e => e.status === 'Approved').length;
  const rejectedCount = enrollments.filter(e => e.status === 'Rejected').length;

  const selected = enrollments.find(e => e.id === selectedEnrollment);

  const updateStatus = (id: string, status: 'Approved' | 'Rejected' | 'Under Review') => {
    setEnrollments(prev => prev.map(e => e.id === id ? { ...e, status } : e));
    setSelectedEnrollment(null);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Pending" count={pendingCount} icon="⏳" bg="bg-amber-50" text="text-amber-700" />
        <StatCard label="Under Review" count={underReviewCount} icon="🔍" bg="bg-blue-50" text="text-blue-700" />
        <StatCard label="Approved" count={approvedCount} icon="✅" bg="bg-emerald-50" text="text-emerald-700" />
        <StatCard label="Rejected" count={rejectedCount} icon="❌" bg="bg-red-50" text="text-red-700" />
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Filter by Status</label>
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="mt-1 block w-40 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            >
              <option value="All">All Requests</option>
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold">
            {filtered.length} Results
          </span>
        </div>
      </div>

      {/* Enrollments Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student Name</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Parent</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Grade</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Gender</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Submitted</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Docs</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(enrollment => (
                <tr key={enrollment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-sm font-mono text-gray-600">{enrollment.id}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        enrollment.gender === 'Male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                      }`}>
                        {enrollment.studentName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{enrollment.studentName}</p>
                        <p className="text-xs text-gray-400">{enrollment.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-sm text-gray-700">{enrollment.parentName}</p>
                    <p className="text-xs text-gray-400">{enrollment.phone}</p>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-semibold">
                      {enrollment.grade}{enrollment.section}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center text-sm text-gray-600">{enrollment.gender}</td>
                  <td className="px-5 py-3 text-sm text-gray-600">{enrollment.submittedDate}</td>
                  <td className="px-5 py-3 text-center">
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
                      {enrollment.documents.length} files
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      enrollment.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                      enrollment.status === 'Under Review' ? 'bg-blue-100 text-blue-700' :
                      enrollment.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {enrollment.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setSelectedEnrollment(enrollment.id)}
                        className="px-2.5 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
                      >
                        View
                      </button>
                      {enrollment.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => updateStatus(enrollment.id, 'Under Review')}
                            className="px-2.5 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200 transition-colors"
                          >
                            Review
                          </button>
                        </>
                      )}
                      {(enrollment.status === 'Pending' || enrollment.status === 'Under Review') && (
                        <>
                          <button
                            onClick={() => updateStatus(enrollment.id, 'Approved')}
                            className="px-2.5 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-200 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateStatus(enrollment.id, 'Rejected')}
                            className="px-2.5 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200 transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-gray-500 font-medium">No enrollment requests found</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedEnrollment(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="h-20 bg-gradient-to-r from-amber-500 to-amber-600 rounded-t-2xl relative">
              <button onClick={() => setSelectedEnrollment(null)} className="absolute top-3 right-3 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center text-white">✕</button>
            </div>
            <div className="px-6 pb-6 pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">{selected.studentName}</h3>
                <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  selected.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                  selected.status === 'Under Review' ? 'bg-blue-100 text-blue-700' :
                  selected.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                  'bg-red-100 text-red-700'
                }`}>{selected.status}</span>
              </div>
              <div className="space-y-2">
                <DetailRow label="Application ID" value={selected.id} />
                <DetailRow label="Email" value={selected.email} />
                <DetailRow label="Phone" value={selected.phone} />
                <DetailRow label="Grade/Section" value={`${selected.grade} - Section ${selected.section}`} />
                <DetailRow label="Age" value={`${selected.age} years`} />
                <DetailRow label="Gender" value={selected.gender} />
                <DetailRow label="Address" value={selected.address} />
                <DetailRow label="Previous School" value={selected.previousSchool} />
                <DetailRow label="Parent/Guardian" value={selected.parentName} />
                <DetailRow label="Submitted" value={selected.submittedDate} />
              </div>
              <div className="mt-4">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Documents</p>
                <div className="flex flex-wrap gap-2">
                  {selected.documents.map(doc => (
                    <span key={doc} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">📄 {doc}</span>
                  ))}
                </div>
              </div>
              {selected.status !== 'Approved' && selected.status !== 'Rejected' && (
                <div className="mt-6 flex gap-3">
                  <button onClick={() => updateStatus(selected.id, 'Approved')} className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-sm transition-colors">
                    ✅ Approve
                  </button>
                  <button onClick={() => updateStatus(selected.id, 'Rejected')} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium text-sm transition-colors">
                    ❌ Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, count, icon, bg }: { label: string; count: number; icon: string; bg: string; text: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center text-xl mb-3`}>{icon}</div>
      <p className="text-2xl font-bold text-gray-800">{count}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-800">{value}</span>
    </div>
  );
}
