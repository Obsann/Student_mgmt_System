import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { LoadingSkeleton } from "../../components/LoadingSkeleton";

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAuditLogs().then((res) => {
      setLogs(res.logs || []);
      setLoading(false);
    }).catch(console.error);
  }, []);

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-slate-50">
        <h2 className="text-lg font-bold text-gray-900">System Audit Logs</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider text-[10px] font-bold">
              <th className="p-4">Timestamp</th>
              <th className="p-4">User</th>
              <th className="p-4">Action</th>
              <th className="p-4">Entity</th>
              <th className="p-4">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.map((log) => (
              <tr key={log._id} className="hover:bg-gray-50/50">
                <td className="p-4 text-gray-500">{new Date(log.createdAt).toLocaleString()}</td>
                <td className="p-4 font-bold text-gray-900">{log.userName}</td>
                <td className="p-4">
                  <span className="px-2 py-1 rounded bg-indigo-50 text-indigo-700 text-xs font-bold">{log.action}</span>
                </td>
                <td className="p-4 text-gray-500">{log.entity}</td>
                <td className="p-4 text-gray-600 truncate max-w-xs">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
