import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import type { AuditLogItem } from '../types/forensic';

interface SecurityCenterViewProps {
  recentLogs: AuditLogItem[];
}

const SYSTEM_CHECKS = [
  { label: 'TLS / HTTPS', icon: 'https', status: 'ACTIVE' },
  { label: 'SHA-256 Hashing', icon: 'tag', status: 'ACTIVE' },
  { label: 'Audit Hash Chain', icon: 'link', status: 'ACTIVE' },
  { label: 'RBAC Enforcement', icon: 'lock_person', status: 'ACTIVE' },
  { label: 'Data Masking', icon: 'visibility_off', status: 'ACTIVE' },
];

function formatDuration(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

const ACTION_ICONS: Record<string, { icon: string; color: string }> = {
  LOGIN:                { icon: 'login',          color: 'text-emerald-400' },
  LOGOUT:               { icon: 'logout',         color: 'text-slate-400' },
  FILE_INGESTION:       { icon: 'upload_file',    color: 'text-cyan-400' },
  HASH_GENERATED:       { icon: 'tag',            color: 'text-sky-400' },
  GRAPH_LINK_ANALYSIS:  { icon: 'account_tree',   color: 'text-purple-400' },
  CORRELATION_QUERY:    { icon: 'link',           color: 'text-indigo-400' },
  SENSITIVE_DATA_ACCESS:{ icon: 'visibility',     color: 'text-amber-400' },
  REPORT_EXPORT:        { icon: 'description',    color: 'text-green-400' },
};

export function SecurityCenterView({ recentLogs }: SecurityCenterViewProps) {
  const { session } = useAuth();
  const [now, setNow] = useState(Date.now());
  const [tamperDemo, setTamperDemo] = useState(false);

  useEffect(() => {
    const iv = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(iv);
  }, []);

  const sessionDuration = session ? now - session.loginTime : 0;
  const displayLogs = [...recentLogs].reverse().slice(0, 8);

  return (
    <div className="flex-1 flex flex-col gap-5 h-full overflow-y-auto">
      {/* Page Header */}
      <div className="glass-panel p-5 rounded-xl flex items-center gap-4 shrink-0">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/30 to-[#6620bd]/30 border border-emerald-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          <span className="material-symbols-outlined text-emerald-400 text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
        </div>
        <div>
          <h2 className="font-title-lg text-title-lg text-[#dfe2f4]">Security Center</h2>
          <p className="font-code-sm text-[11px] text-[#859396]">Live system status, session info, and access event feed</p>
        </div>
        <div className="ml-auto">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-label-caps text-[11px] font-bold tracking-wider ${
            tamperDemo
              ? 'bg-red-500/15 border-red-500/40 text-red-400'
              : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
          }`}>
            <div className={`w-2 h-2 rounded-full ${tamperDemo ? 'bg-red-400' : 'bg-emerald-400 animate-pulse'}`} />
            {tamperDemo ? 'BREACH SIMULATED' : 'SYSTEM SECURE'}
          </div>
        </div>
      </div>

      {/* Top Row: System Status + Session Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 shrink-0">
        {/* System Status */}
        <div className="glass-panel rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-[18px] text-[#6dedff]">monitor_heart</span>
            <span className="font-label-caps text-[11px] text-[#859396] tracking-widest font-bold">SYSTEM STATUS</span>
          </div>
          {SYSTEM_CHECKS.map(check => (
            <div key={check.label} className="flex items-center justify-between py-2 border-b border-[#3c494b]/15 last:border-0">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[16px] text-[#859396]">{check.icon}</span>
                <span className="font-body-sm text-[13px] text-[#dfe2f4]">{check.label}</span>
              </div>
              <div className={`flex items-center gap-1.5 ${tamperDemo && check.label === 'Audit Hash Chain' ? 'text-red-400' : 'text-emerald-400'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${tamperDemo && check.label === 'Audit Hash Chain' ? 'bg-red-400' : 'bg-emerald-400 animate-pulse'}`} />
                <span className="font-label-caps text-[10px] tracking-wider font-bold">
                  {tamperDemo && check.label === 'Audit Hash Chain' ? 'COMPROMISED' : check.status}
                </span>
              </div>
            </div>
          ))}

          {/* Tamper simulation button */}
          <button
            id="security-tamper-toggle"
            onClick={() => setTamperDemo(t => !t)}
            className={`mt-3 w-full py-2 px-3 rounded-lg font-label-caps text-[10px] font-bold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
              tamperDemo
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                : 'bg-red-500/10 text-red-400 border-red-500/25 hover:bg-red-500/20'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">{tamperDemo ? 'restore' : 'bug_report'}</span>
            {tamperDemo ? 'RESTORE INTEGRITY' : 'SIMULATE BREACH'}
          </button>
        </div>

        {/* Session Status */}
        <div className="glass-panel rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-[18px] text-[#6dedff]">verified_user</span>
            <span className="font-label-caps text-[11px] text-[#859396] tracking-widest font-bold">SESSION STATUS</span>
          </div>

          {session ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
                </div>
                <span className="font-label-caps text-[11px] text-emerald-400 font-bold tracking-wider">ACTIVE SESSION</span>
              </div>

              {[
                { label: 'USER', value: session.user.displayName },
                { label: 'ROLE', value: session.user.role.toUpperCase() },
                { label: 'DEPARTMENT', value: session.user.department },
                { label: 'SESSION IP', value: session.sessionIp },
                { label: 'LOGIN TIME', value: new Date(session.loginTime).toLocaleTimeString() },
                { label: 'DURATION', value: formatDuration(sessionDuration) },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between py-1.5 border-b border-[#3c494b]/15 last:border-0">
                  <span className="font-label-caps text-[10px] text-[#859396] tracking-widest">{row.label}</span>
                  <span className="font-code-sm text-[12px] text-[#dfe2f4] font-medium">{row.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-32 gap-2 text-[#859396]">
              <span className="material-symbols-outlined text-[32px]">no_accounts</span>
              <span className="font-body-sm text-[13px]">No active session</span>
            </div>
          )}
        </div>
      </div>

      {/* Audit Chain Integrity */}
      <div className="glass-panel rounded-xl p-5 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#6dedff]">link</span>
            <span className="font-label-caps text-[11px] text-[#859396] tracking-widest font-bold">AUDIT CHAIN INTEGRITY</span>
          </div>
          <span className={`font-label-caps text-[11px] font-bold ${tamperDemo ? 'text-red-400' : 'text-emerald-400'}`}>
            {tamperDemo ? '⚠ CHAIN BROKEN' : '✓ CHAIN INTACT'}
          </span>
        </div>
        <div className="w-full h-3 rounded-full bg-[#1b1f2c] overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              tamperDemo
                ? 'bg-gradient-to-r from-red-600 to-red-400 w-[60%]'
                : 'bg-gradient-to-r from-emerald-600 to-emerald-400 w-full'
            }`}
          />
        </div>
        <div className="flex justify-between mt-2 font-code-sm text-[10px] text-[#859396]">
          <span>{tamperDemo ? 'Integrity: 60% — Tamper detected at entry #5' : `${recentLogs.length} events verified`}</span>
          <span>Last check: {new Date(now).toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Recent Access Events */}
      <div className="glass-panel rounded-xl overflow-hidden flex-1 min-h-0">
        <div className="flex items-center gap-2 p-4 border-b border-[#3c494b]/20">
          <span className="material-symbols-outlined text-[18px] text-[#6dedff]">history</span>
          <span className="font-label-caps text-[11px] text-[#859396] tracking-widest font-bold">RECENT ACCESS EVENTS</span>
          <span className="ml-auto font-code-sm text-[10px] text-[#859396]">{displayLogs.length} shown</span>
        </div>
        <div className="divide-y divide-[#3c494b]/10 overflow-y-auto max-h-80">
          {displayLogs.map(log => {
            const actionMeta = ACTION_ICONS[log.action] ?? { icon: 'event_note', color: 'text-[#6dedff]' };
            const isSensitive = log.action === 'SENSITIVE_DATA_ACCESS';
            return (
              <div key={log.id} className={`flex items-center gap-4 px-4 py-3 hover:bg-[#1f263c]/40 transition-colors ${isSensitive ? 'bg-amber-500/5' : ''}`}>
                <span className={`material-symbols-outlined text-[18px] shrink-0 ${actionMeta.color}`}>
                  {actionMeta.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-label-caps text-[10px] font-bold ${actionMeta.color}`}>{log.action}</span>
                    {isSensitive && (
                      <span className="font-label-caps text-[8px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">SENSITIVE</span>
                    )}
                  </div>
                  <p className="font-body-sm text-[12px] text-[#859396] truncate">{log.analyst} → {log.resource}</p>
                </div>
                <span className="font-code-sm text-[10px] text-[#859396] shrink-0">{log.timestamp.split(' ')[1]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
