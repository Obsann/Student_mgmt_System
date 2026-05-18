import { useState } from 'react';
import { auditLogs } from '../../data/adminMockData';

export default function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterAction, setFilterAction] = useState('All');
  const [selectedLog, setSelectedLog] = useState<string | null>(null);

  const categories = Array.from(new Set(auditLogs.map(l => l.category)));
  const actions = Array.from(new Set(auditLogs.map(l => l.action)));

  const filtered = auditLogs.filter(l => {
    const matchesSearch = l.user.toLowerCase().includes(searchTerm.toLowerCase()) || l.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || l.category === filterCategory;
    const matchesAction = filterAction === 'All' || l.action === filterAction;
    return matchesSearch && matchesCategory && matchesAction;
  });

  const selected = auditLogs.find(l => l.id === selectedLog);

  const categoryColors: Record<string, string> = {
    Student: 'bg-blue-100 text-blue-700',
    Teacher: 'bg-emerald-100 text-emerald-700',
    Attendance: 'bg-purple-100 text-purple-700',
    Marks: 'bg-amber-100 text-amber-700',
    System: 'bg-slate-100 text-slate-700',
    Enrollment: 'bg-pink-100 text-pink-700',
  };

  const actionColors: Record<string, string> = {
    Created: 'bg-emerald-500',
    Updated: 'bg-blue-500',
    Deleted: 'bg-red-500',
    Approved: 'bg-emerald-500',
    Rejected: 'bg-red-500',
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-xl mb-3">📜</div>
          <p className="text-2xl font-bold text-gray-800">{auditLogs.length}</p>
          <p className="text-sm text-gray-500">Total Logs</p>
        </div>
        {categories.map(cat => {
          const icons: Record<string, string> = { Student: '👨‍🎓', Teacher: '👩‍🏫', Attendance: '📋', Marks: '📝', System: '⚙️', Enrollment: '📨' };
          return (
            <div key={cat} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-xl mb-3">{icons[cat]}</div>
              <p className="text-2xl font-bold text-gray-800">{auditLogs.filter(l => l.category === cat).length}</p>
              <p className="text-sm text-gray-500">{cat}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Search</label>
            <div className="mt-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="text" placeholder="Search by user or details..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Category</label>
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
              className="mt-1 block w-36 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none">
              <option value="All">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Action</label>
            <select value={filterAction} onChange={e => setFilterAction(e.target.value)}
              className="mt-1 block w-32 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none">
              <option value="All">All Actions</option>
              {actions.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold">{filtered.length} Results</span>
          <button className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Export
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Details</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">IP Address</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(log => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{log.timestamp.split(' ')[0]}</p>
                      <p className="text-xs text-gray-400">{log.timestamp.split(' ')[1]}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                        {log.user.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{log.user}</p>
                        <p className="text-xs text-gray-400">{log.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold">
                      <span className={`w-1.5 h-1.5 rounded-full ${actionColors[log.action] || 'bg-gray-400'}`}></span>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${categoryColors[log.category] || 'bg-gray-100 text-gray-700'}`}>
                      {log.category}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-sm text-gray-700 max-w-xs truncate">{log.details}</p>
                  </td>
                  <td className="px-5 py-3 text-sm font-mono text-gray-500">{log.ip}</td>
                  <td className="px-5 py-3 text-center">
                    <button onClick={() => setSelectedLog(log.id)} className="px-2.5 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-medium hover:bg-amber-100 transition-colors">
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-gray-500 font-medium">No audit logs found</p>
          </div>
        )}
      </div>

      {/* Log Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedLog(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-slate-50 to-slate-100 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800">Log Detail</h3>
                <span className="font-mono text-xs text-gray-500">{selected.id}</span>
              </div>
            </div>
            <div className="p-6 space-y-3">
              {[['Timestamp', selected.timestamp], ['User', selected.user], ['Role', selected.role], ['Action', selected.action], ['Category', selected.category], ['IP Address', selected.ip]].map(([l, v]) => (
                <div key={l} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-500">{l}</span>
                  <span className="text-sm font-medium text-gray-800">{v}</span>
                </div>
              ))}
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Details</p>
                <p className="text-sm text-gray-700">{selected.details}</p>
              </div>
              <button onClick={() => setSelectedLog(null)} className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors mt-2">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
