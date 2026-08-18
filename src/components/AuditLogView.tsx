import React, { useState } from 'react';
import type { AuditLogItem } from '../types/forensic';

interface AuditLogViewProps {
  logs: AuditLogItem[];
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ logs }) => {
  const [filterQuery, setFilterQuery] = useState('');

  const filteredLogs = logs.filter(l => 
    !filterQuery || 
    l.action.toLowerCase().includes(filterQuery.toLowerCase()) || 
    l.analyst.toLowerCase().includes(filterQuery.toLowerCase()) ||
    l.resource.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden space-y-4">
      {/* Header Bar */}
      <div className="glass-panel p-4 rounded-lg flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-emerald-500/20 text-emerald-400">
            <span className="material-symbols-outlined text-[22px]">history_edu</span>
          </div>
          <div>
            <h3 className="font-title-lg text-title-lg text-[#dfe2f4]">Immutable Audit Log & Hash Chain</h3>
            <p className="font-code-sm text-[11px] text-[#859396]">Tamper-evident activity record with SHA-256 proof signatures</p>
          </div>
        </div>

        <input 
          type="text"
          placeholder="Filter audit entries..."
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          className="bg-[#1b1f2c] border border-[#3c494b]/40 text-[#dfe2f4] text-[12px] px-3 py-1.5 rounded w-56 focus:outline-none focus:border-[#6dedff]"
        />
      </div>

      {/* Audit Log Table */}
      <div className="flex-1 bg-[#1b1f2c] border border-[#3c494b]/20 rounded-lg overflow-hidden flex flex-col">
        <div className="overflow-y-auto flex-1">
          <table className="w-full text-left font-body-sm text-body-sm">
            <thead className="bg-[#172034] text-[#859396] font-label-caps text-[10px] border-b border-[#3c494b]/30">
              <tr>
                <th className="px-4 py-3">ENTRY ID & TIMESTAMP</th>
                <th className="px-4 py-3">ANALYST & ROLE</th>
                <th className="px-4 py-3">ACTION EVENT</th>
                <th className="px-4 py-3">RESOURCE TARGET</th>
                <th className="px-4 py-3">SHA-256 PROOF SIGNATURE</th>
                <th className="px-4 py-3">IP ADDRESS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3c494b]/10">
              {filteredLogs.map((item) => (
                <tr key={item.id} className="hover:bg-[#303442]/30 transition-colors font-code-sm text-[11px]">
                  <td className="px-4 py-3">
                    <span className="text-[#6dedff] font-bold">{item.id}</span>
                    <div className="text-[#859396] text-[10px]">{item.timestamp}</div>
                  </td>
                  <td className="px-4 py-3 text-[#dfe2f4]">
                    {item.analyst}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded bg-[#0f131f] border border-[#3c494b]/30 text-[#36d9ed]">
                      {item.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#dfe2f4]">
                    {item.resource}
                  </td>
                  <td className="px-4 py-3 text-[#859396] break-all max-w-[200px]">
                    {item.hash}
                  </td>
                  <td className="px-4 py-3 text-[#859396]">
                    {item.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
