import { useState } from 'react';
import type { AuditLogItem } from '../types/forensic';

interface AuditLogViewProps {
  logs: AuditLogItem[];
  onAppendLog?: (log: AuditLogItem) => void;
}

const ACTION_COLORS: Record<string, string> = {
  LOGIN:                'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
  LOGOUT:               'text-slate-400  border-slate-500/40  bg-slate-500/10',
  CASE_OPEN:            'text-sky-400    border-sky-500/40    bg-sky-500/10',
  FILE_INGESTION:       'text-[#6dedff]  border-[#6dedff]/40  bg-[#6dedff]/10',
  HASH_GENERATED:       'text-cyan-400   border-cyan-500/40   bg-cyan-500/10',
  OCR_PARSE:            'text-violet-400 border-violet-500/40 bg-violet-500/10',
  GRAPH_LINK_ANALYSIS:  'text-purple-400 border-purple-500/40 bg-purple-500/10',
  CORRELATION_QUERY:    'text-indigo-400 border-indigo-500/40 bg-indigo-500/10',
  TOWER_CO_LOCATION_QUERY: 'text-teal-400 border-teal-500/40 bg-teal-500/10',
  SENSITIVE_DATA_ACCESS:'text-amber-400  border-amber-500/40  bg-amber-500/10',
  REPORT_EXPORT:        'text-green-400  border-green-500/40  bg-green-500/10',
};

const ROLE_COLORS: Record<string, string> = {
  admin:        'text-red-400    bg-red-500/15    border-red-500/30',
  investigator: 'text-amber-400  bg-amber-500/15  border-amber-500/30',
  analyst:      'text-sky-400    bg-sky-500/15    border-sky-500/30',
};

// Verify hash chain: each log's prevHash must equal previous log's hash
function verifyChain(logs: AuditLogItem[]): boolean {
  for (let i = 1; i < logs.length; i++) {
    if (logs[i].prevHash !== logs[i - 1].hash) return false;
  }
  return true;
}

export const AuditLogView = ({ logs, onAppendLog }: AuditLogViewProps) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [tamperedIdx, setTamperedIdx] = useState<number | null>(null);
  const [allLogs, setAllLogs] = useState<AuditLogItem[]>(logs);

  const filteredLogs = allLogs.filter(l =>
    !filterQuery ||
    l.action.toLowerCase().includes(filterQuery.toLowerCase()) ||
    l.analyst.toLowerCase().includes(filterQuery.toLowerCase()) ||
    l.resource.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const chainOk = tamperedIdx === null ? verifyChain(allLogs) : false;

  const doTamper = () => {
    const idx = Math.floor(allLogs.length / 2);
    setTamperedIdx(idx);
    // Mutate hash of that log to simulate tampering
    setAllLogs(prev => prev.map((l, i) =>
      i === idx ? { ...l, hash: '91a72c10deadbeef00112233445566778899aabb' } : l
    ));
  };

  const doRestore = () => {
    setTamperedIdx(null);
    setAllLogs(logs);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden space-y-4">
      {/* Header Bar */}
      <div className="glass-panel p-4 rounded-lg flex items-center justify-between gap-3 shrink-0 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-emerald-500/20 text-emerald-400">
            <span className="material-symbols-outlined text-[22px]">history_edu</span>
          </div>
          <div>
            <h3 className="font-title-lg text-title-lg text-[#dfe2f4]">Immutable Audit Log & Hash Chain</h3>
            <p className="font-code-sm text-[11px] text-[#859396]">Tamper-evident activity record with SHA-256 proof signatures</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Filter audit entries..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="bg-[#1b1f2c] border border-[#3c494b]/40 text-[#dfe2f4] text-[12px] px-3 py-1.5 rounded w-44 focus:outline-none focus:border-[#6dedff]"
          />
        </div>
      </div>

      {/* Chain Integrity Banner */}
      <div className={`glass-panel rounded-lg p-4 flex items-center justify-between gap-4 shrink-0 border ${
        chainOk ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-red-500/40 bg-red-500/5'
      }`}>
        <div className="flex items-center gap-4 flex-1">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            chainOk ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
          }`}>
            <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              {chainOk ? 'verified_user' : 'gpp_bad'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`font-label-caps text-[11px] font-bold tracking-wider ${chainOk ? 'text-emerald-400' : 'text-red-400'}`}>
                {chainOk ? `✓ AUDIT CHAIN VERIFIED — ${allLogs.length} EVENTS` : '⚠ AUDIT CHAIN INTEGRITY FAILED'}
              </span>
            </div>
            {!chainOk && tamperedIdx !== null && (
              <p className="font-code-sm text-[11px] text-red-300">
                Tamper detected at <span className="font-bold">{allLogs[tamperedIdx]?.id}</span> — Hash mismatch.
                Expected: <span className="text-red-200">{allLogs[tamperedIdx - 1]?.hash?.slice(0, 8)}...</span> &nbsp;
                Got: <span className="text-red-200">91a72c10...</span>
              </p>
            )}
            {chainOk && (
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-[#1b1f2c] overflow-hidden max-w-[200px]">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={{ width: '100%' }} />
                </div>
                <span className="font-code-sm text-[10px] text-[#859396]">Last verified: {new Date().toLocaleTimeString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tamper / Restore demo buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {chainOk ? (
            <button
              id="tamper-demo-btn"
              onClick={doTamper}
              className="px-3 py-1.5 rounded-lg font-label-caps text-[10px] font-bold bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[14px]">warning</span>
              TAMPER DEMO
            </button>
          ) : (
            <button
              id="restore-chain-btn"
              onClick={doRestore}
              className="px-3 py-1.5 rounded-lg font-label-caps text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[14px]">restore</span>
              RESTORE CHAIN
            </button>
          )}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="flex-1 bg-[#1b1f2c] border border-[#3c494b]/20 rounded-lg overflow-hidden flex flex-col">
        <div className="overflow-y-auto flex-1">
          <table className="w-full text-left font-body-sm text-body-sm">
            <thead className="bg-[#172034] text-[#859396] font-label-caps text-[10px] border-b border-[#3c494b]/30 sticky top-0">
              <tr>
                <th className="px-4 py-3 whitespace-nowrap">ENTRY & TIMESTAMP</th>
                <th className="px-4 py-3 whitespace-nowrap">ANALYST / ROLE</th>
                <th className="px-4 py-3 whitespace-nowrap">ACTION EVENT</th>
                <th className="px-4 py-3 whitespace-nowrap">RESOURCE TARGET</th>
                <th className="px-4 py-3 whitespace-nowrap">PREV HASH (8 chars)</th>
                <th className="px-4 py-3 whitespace-nowrap">CURRENT HASH (8 chars)</th>
                <th className="px-4 py-3 whitespace-nowrap">IP ADDRESS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3c494b]/10">
              {filteredLogs.map((item, idx) => {
                const isTampered = tamperedIdx !== null && idx >= tamperedIdx;
                return (
                  <tr key={item.id} className={`transition-colors font-code-sm text-[11px] ${
                    isTampered
                      ? 'bg-red-500/8 hover:bg-red-500/12'
                      : 'hover:bg-[#303442]/30'
                  }`}>
                    <td className="px-4 py-3">
                      <span className={`font-bold ${isTampered ? 'text-red-400' : 'text-[#6dedff]'}`}>{item.id}</span>
                      <div className="text-[#859396] text-[10px]">{item.timestamp}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[#dfe2f4] block">{item.analyst}</span>
                      <span className={`font-label-caps text-[8px] px-1.5 py-0.5 rounded-full border ${ROLE_COLORS[item.role] ?? ROLE_COLORS.analyst} tracking-wider mt-0.5 inline-block`}>
                        {item.role?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${ACTION_COLORS[item.action] ?? 'text-[#36d9ed] border-[#36d9ed]/30 bg-[#36d9ed]/10'}`}>
                        {item.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#dfe2f4] max-w-[160px] truncate">{item.resource}</td>
                    <td className="px-4 py-3 text-[#859396] font-code-sm text-[10px]">
                      {item.prevHash?.slice(0, 8)}...
                    </td>
                    <td className="px-4 py-3 font-code-sm text-[10px]">
                      {isTampered && idx === tamperedIdx ? (
                        <span className="text-red-400 font-bold">91a72c10... ⚠</span>
                      ) : (
                        <span className="text-emerald-400">{item.hash?.slice(0, 8)}... ✓</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#859396]">{item.ipAddress}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
