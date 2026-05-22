import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { ScrollText, Search, Eye, Users, Building2, Calendar as CalendarIcon, Download, Trash2, LayoutDashboard } from "lucide-react";
import Pagination from "../../components/Pagination";

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAction, setSelectedAction] = useState("All");
  const [selectedEntity, setSelectedEntity] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedLog, setSelectedLog] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    api.getAuditLogs().then((res) => {
      setLogs(res.logs || []);
      setLoading(false);
    }).catch(console.error);
  }, []);

  if (loading) return <div className="p-8 flex justify-center"><div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" /></div>;

  // Gather stats & filters
  const uniqueUsers = new Set(logs.map(l => l.userName)).size;
  const uniqueEntities = Array.from(new Set(logs.map(l => l.entity || "System")));
  const actions = Array.from(new Set(logs.map(l => l.action)));

  const filtered = logs.filter(l => {
    const matchesSearch = (l.userName || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (l.details || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = selectedAction === "All" || l.action === selectedAction;
    const matchesEntity = selectedEntity === "All" || (l.entity || "System") === selectedEntity;
    
    let matchesDate = true;
    if (startDate) {
      matchesDate = matchesDate && new Date(l.createdAt) >= new Date(startDate);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      matchesDate = matchesDate && new Date(l.createdAt) <= end;
    }

    return matchesSearch && matchesAction && matchesEntity && matchesDate;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentLogs = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const getActionColor = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes("create") || act.includes("add") || act.includes("issue")) return "bg-emerald-50 text-emerald-600 border border-emerald-100/50";
    if (act.includes("update") || act.includes("edit")) return "bg-blue-50 text-blue-600 border border-blue-100/50";
    if (act.includes("delete") || act.includes("remove") || act.includes("withdraw")) return "bg-red-50 text-red-600 border border-red-100/50";
    return "bg-slate-50 text-slate-600 border border-slate-100/50";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 transition-transform duration-700 group-hover:scale-110"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                <ScrollText size={28} />
              </div>
              <h2 className="text-2xl font-black">System Audit Logs</h2>
            </div>
            <p className="text-slate-300 text-sm font-medium leading-relaxed max-w-xl">
              Monitor user activities and system events. Logs are retained for 365 days before automatic archival.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-sm transition-all flex items-center gap-2 backdrop-blur-sm">
              <Download size={16} /> Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-up">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 group hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform"><ScrollText className="w-6 h-6 text-amber-500" /></div>
          <p className="text-3xl font-black text-slate-900">{logs.length}</p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Total Logs</p>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 group hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform"><Users className="w-6 h-6 text-blue-500" /></div>
          <p className="text-3xl font-black text-slate-900">{uniqueUsers}</p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Active Users</p>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 group hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform"><Building2 className="w-6 h-6 text-purple-500" /></div>
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
              <input type="text" placeholder="Search by user or log details..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all outline-none" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Action Type</label>
            <select value={selectedAction} onChange={e => { setSelectedAction(e.target.value); setCurrentPage(1); }}
              className="block w-40 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all outline-none">
              <option value="All">All Actions</option>
              {actions.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Module</label>
            <select value={selectedEntity} onChange={e => { setSelectedEntity(e.target.value); setCurrentPage(1); }}
              className="block w-40 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all outline-none">
              <option value="All">All Modules</option>
              {uniqueEntities.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">From Date</label>
            <input type="date" value={startDate} onChange={e => { setStartDate(e.target.value); setCurrentPage(1); }}
              className="block w-40 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">To Date</label>
            <input type="date" value={endDate} onChange={e => { setEndDate(e.target.value); setCurrentPage(1); }}
              className="block w-40 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all outline-none" />
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
                {currentLogs.map((log) => {
                  const initialLetter = log.userName ? log.userName.charAt(0).toUpperCase() : '?';
                  return (
                    <tr key={log._id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-700">{formatRelativeTime(log.createdAt)}</span>
                          <span className="text-[10px] text-slate-400">{new Date(log.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200/50 flex items-center justify-center text-slate-600 text-xs font-black shrink-0">
                            {initialLetter}
                          </div>
                          <span className="text-sm font-bold text-slate-900 truncate max-w-[120px]">{log.userName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-[10px] font-black uppercase tracking-wider text-slate-500">{log.entity || 'System'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-600 truncate max-w-[200px] lg:max-w-xs">{log.details}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => setSelectedLog(log)} className="p-1.5 rounded-xl hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-colors">
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 flex justify-center bg-slate-50/50">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          )}
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
                  ['Module Entity', selectedLog.entity || 'System'],
                  ['IP Address', selectedLog.ipAddress || 'Unknown']
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
