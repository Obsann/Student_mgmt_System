import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { LoadingSkeleton } from "../../components/LoadingSkeleton";
import { ScrollText, Search, Eye } from "lucide-react";

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAction, setSelectedAction] = useState("All");
  const [selectedEntity, setSelectedEntity] = useState("All");
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  useEffect(() => {
    api.getAuditLogs().then((res) => {
      setLogs(res.logs || []);
      setLoading(false);
    }).catch(console.error);
  }, []);

  if (loading) return <div className="p-8"><LoadingSkeleton /></div>;

  // Gather stats & filters
  const uniqueUsers = new Set(logs.map(l => l.userName)).size;
  const uniqueEntities = Array.from(new Set(logs.map(l => l.entity || "System")));
  const actions = Array.from(new Set(logs.map(l => l.action)));

  const filtered = logs.filter(l => {
    const matchesSearch = (l.userName || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (l.details || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = selectedAction === "All" || l.action === selectedAction;
    const matchesEntity = selectedEntity === "All" || (l.entity || "System") === selectedEntity;
    return matchesSearch && matchesAction && matchesEntity;
  });

  const getActionColor = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes("create") || act.includes("add") || act.includes("issue")) return "bg-emerald-50 text-emerald-600 border border-emerald-100/50";
    if (act.includes("update") || act.includes("edit")) return "bg-blue-50 text-blue-600 border border-blue-100/50";
    if (act.includes("delete") || act.includes("remove") || act.includes("withdraw")) return "bg-red-50 text-red-600 border border-red-100/50";
    return "bg-slate-50 text-slate-600 border border-slate-100/50";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-up">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 group hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">📜</div>
          <p className="text-3xl font-black text-slate-900">{logs.length}</p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Total Logs</p>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 group hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">👥</div>
          <p className="text-3xl font-black text-slate-900">{uniqueUsers}</p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Active Users</p>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 group hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">🏢</div>
          <p className="text-3xl font-black text-slate-900">{uniqueEntities.length}</p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Monitored Modules</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[240px]">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Search Details</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search by user or log details..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all outline-none" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Action Type</label>
            <select value={selectedAction} onChange={e => setSelectedAction(e.target.value)}
              className="block w-48 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all outline-none">
              <option value="All">All Actions</option>
              {actions.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Module</label>
            <select value={selectedEntity} onChange={e => setSelectedEntity(e.target.value)}
              className="block w-48 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all outline-none">
              <option value="All">All Modules</option>
              {uniqueEntities.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState icon={<ScrollText size={48} />} title="No Logs Found" description="Try adjusting your filter settings." />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">User</th>
                  <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                  <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Module</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Details</th>
                  <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((log) => {
                  const initialLetter = log.userName ? log.userName.charAt(0).toUpperCase() : '?';
                  return (
                    <tr key={log._id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4 text-xs font-semibold text-slate-400">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200/50 flex items-center justify-center text-slate-600 text-xs font-black">
                            {initialLetter}
                          </div>
                          <span className="text-sm font-bold text-slate-900">{log.userName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-500">{log.entity || 'System'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-600 truncate max-w-xs">{log.details}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => setSelectedLog(log)} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors">
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedLog(null)}>
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl animate-fade-scale" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-100 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900">Audit Log Details</h3>
                <button onClick={() => setSelectedLog(null)} className="w-8 h-8 bg-slate-200/50 hover:bg-slate-200 rounded-xl flex items-center justify-center text-slate-600 transition-colors">✕</button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                {[
                  ['Timestamp', new Date(selectedLog.createdAt).toLocaleString()], 
                  ['Authorized User', selectedLog.userName], 
                  ['Action Triggered', selectedLog.action], 
                  ['Module Entity', selectedLog.entity || 'System']
                ].map(([l, v]) => (
                  <div key={l} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100/50">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{l}</span>
                    <span className="text-sm font-bold text-slate-900">{v}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Full Description</p>
                <p className="text-sm font-bold text-slate-700 leading-relaxed">{selectedLog.details}</p>
              </div>

              <button onClick={() => setSelectedLog(null)} className="w-full py-3 bg-slate-100 text-slate-700 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-colors">
                Close Log Detail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState({ icon, title, description }: any) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-16 text-center animate-fade-up">
      <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-400">
        {icon}
      </div>
      <h3 className="text-xl font-black text-slate-900 mb-2">{title}</h3>
      <p className="text-sm font-semibold text-slate-500 max-w-md mx-auto leading-relaxed">{description}</p>
    </div>
  );
}
