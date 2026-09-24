import React, { useState, useEffect } from 'react';
import { History, Search, Filter, ShieldCheck, Clock } from 'lucide-react';
import { auditRepository } from '../../services/auditRepository';
import { AuditLogEntry } from '../../types/audit';
import { PageHeader } from '../../components/common/PageHeader';
import { formatDateTime } from '../../utils/formatters';

export const AuditLogPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [moduleFilter, setModuleFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const list = await auditRepository.getAll();
    setLogs(list);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const modules = Array.from(new Set(logs.map((l) => l.module))).sort();

  const filteredLogs = logs.filter((log) => {
    const q = searchQuery.toLowerCase().trim();
    const descMatch = log.description.toLowerCase().includes(q);
    const userMatch = log.userName.toLowerCase().includes(q);
    const recordMatch = log.recordId.toLowerCase().includes(q);

    const matchesQuery = !q || descMatch || userMatch || recordMatch;
    const matchesModule = moduleFilter === 'All' || log.module === moduleFilter;

    return matchesQuery && matchesModule;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit & Operations Log"
        subtitle="Immutable chronological ledger of all workshop actions, status transitions, and data alterations"
        badge={
          <span className="text-xs font-mono font-medium px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded">
            {logs.length} Logged Events
          </span>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by description, record ID, or staff name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-lg text-neutral-900 placeholder-neutral-400 focus:ring-2 focus:ring-neutral-900 focus:outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-neutral-400" />
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-700 focus:outline-none"
          >
            <option value="All">All Modules</option>
            {modules.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-neutral-400 font-mono animate-pulse">
            Loading audit records...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-xs text-neutral-400">
            No audit log entries match your filter.
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-neutral-200">
                <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-5 py-3.5">Timestamp</th>
                    <th className="px-5 py-3.5">Staff Actor</th>
                    <th className="px-5 py-3.5">Action</th>
                    <th className="px-5 py-3.5">Module</th>
                    <th className="px-5 py-3.5 font-mono">Record ID</th>
                    <th className="px-5 py-3.5">Event Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="px-5 py-3.5 whitespace-nowrap text-neutral-500 font-mono">
                        {formatDateTime(log.timestamp)}
                      </td>

                      <td className="px-5 py-3.5 font-semibold text-neutral-900 whitespace-nowrap">
                        {log.userName}
                      </td>

                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-100 text-neutral-800 border border-neutral-200">
                          {log.action}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 font-medium text-neutral-700 whitespace-nowrap">
                        {log.module}
                      </td>

                      <td className="px-5 py-3.5 font-mono font-bold text-neutral-900 whitespace-nowrap">
                        {log.recordId}
                      </td>

                      <td className="px-5 py-3.5 text-neutral-700 max-w-md">
                        {log.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View (Uncongested & Easy to Read) */}
            <div className="md:hidden divide-y divide-neutral-100">
              {filteredLogs.map((log) => (
                <div key={log.id} className="p-4 space-y-2 hover:bg-neutral-50/70 transition-colors text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-neutral-900">{log.userName}</span>
                    <span className="font-mono text-[11px] text-neutral-400">
                      {formatDateTime(log.timestamp)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-100 text-neutral-800 border border-neutral-200">
                      {log.action}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-neutral-50 text-neutral-600 border border-neutral-200">
                      {log.module}
                    </span>
                    <span className="font-mono font-bold text-[11px] text-neutral-800 ml-auto">
                      {log.recordId}
                    </span>
                  </div>

                  <p className="text-neutral-600 leading-relaxed text-xs pt-0.5">
                    {log.description}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
