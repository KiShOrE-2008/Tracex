import { useState } from 'react';
import { useAuth, ROLE_PERMISSIONS } from '../context/AuthContext';

const DEMO_USERS = [
  {
    username: 'admin',
    displayName: 'Supt. A. Kumar',
    role: 'admin' as const,
    department: 'Cyber Crime HQ',
    lastLogin: '2026-08-19 22:01:14',
    ip: '10.240.10.01',
    status: 'active' as const,
    initials: 'AK',
    color: 'bg-red-500/20 text-red-300 border-red-500/30',
  },
  {
    username: 'investigator',
    displayName: 'Insp. R. S. Gill',
    role: 'investigator' as const,
    department: 'Cyber Crime Cell',
    lastLogin: '2026-08-19 09:42:15',
    ip: '10.240.12.45',
    status: 'active' as const,
    initials: 'RG',
    color: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
  {
    username: 'analyst',
    displayName: 'K. Mehta',
    role: 'analyst' as const,
    department: 'Digital Forensics',
    lastLogin: '2026-08-19 10:02:44',
    ip: '10.240.12.88',
    status: 'inactive' as const,
    initials: 'KM',
    color: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  },
];

const ROLE_LABELS = {
  admin:        { label: 'ADMIN',        color: 'text-red-400 bg-red-500/15 border-red-500/30' },
  investigator: { label: 'INVESTIGATOR', color: 'text-amber-400 bg-amber-500/15 border-amber-500/30' },
  analyst:      { label: 'ANALYST',      color: 'text-sky-400 bg-sky-500/15 border-sky-500/30' },
};

export function UserManagementView() {
  const { session } = useAuth();
  const [suspended, setSuspended] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const toggleSuspend = (username: string) => {
    if (username === session?.user.username) return; // can't suspend yourself
    setSuspended(prev =>
      prev.includes(username) ? prev.filter(u => u !== username) : [...prev, username]
    );
  };

  const selectedUserData = DEMO_USERS.find(u => u.username === selectedUser);

  return (
    <div className="flex-1 flex flex-col gap-5 h-full overflow-y-auto">
      {/* Header */}
      <div className="glass-panel p-5 rounded-xl flex items-center gap-4 shrink-0">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-[#6620bd]/30 border border-red-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.2)]">
          <span className="material-symbols-outlined text-red-400 text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>manage_accounts</span>
        </div>
        <div>
          <h2 className="font-title-lg text-title-lg text-[#dfe2f4]">User Management</h2>
          <p className="font-code-sm text-[11px] text-[#859396]">Manage officer accounts and role assignments — Admin only</p>
        </div>
        <div className="ml-auto">
          <span className="font-label-caps text-[10px] px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 border border-red-500/30 font-bold tracking-wider">
            🔒 ADMIN ONLY
          </span>
        </div>
      </div>

      {/* User table */}
      <div className="glass-panel rounded-xl overflow-hidden shrink-0">
        <div className="bg-[#172034] px-5 py-3 border-b border-[#3c494b]/30">
          <span className="font-label-caps text-[10px] text-[#859396] tracking-widest">REGISTERED OFFICERS — {DEMO_USERS.length} TOTAL</span>
        </div>
        <div className="divide-y divide-[#3c494b]/10">
          {DEMO_USERS.map(user => {
            const isSelf = user.username === session?.user.username;
            const isSuspended = suspended.includes(user.username);
            return (
              <div
                key={user.username}
                className={`flex items-center gap-4 px-5 py-4 hover:bg-[#1f263c]/30 transition-colors cursor-pointer ${
                  selectedUser === user.username ? 'bg-[#1f263c]/50 border-l-2 border-[#6dedff]' : ''
                } ${isSuspended ? 'opacity-50' : ''}`}
                onClick={() => setSelectedUser(selectedUser === user.username ? null : user.username)}
              >
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-xl border ${user.color} flex items-center justify-center font-bold text-[13px] shrink-0`}>
                  {user.initials}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-body-sm text-[13px] font-semibold text-[#dfe2f4]">{user.displayName}</span>
                    {isSelf && (
                      <span className="font-label-caps text-[8px] px-1.5 py-0.5 rounded-full bg-[#6dedff]/15 text-[#6dedff] border border-[#6dedff]/30">YOU</span>
                    )}
                    {isSuspended && (
                      <span className="font-label-caps text-[8px] px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">SUSPENDED</span>
                    )}
                  </div>
                  <p className="font-code-sm text-[11px] text-[#859396]">{user.username} · {user.department}</p>
                </div>

                {/* Role badge */}
                <span className={`font-label-caps text-[9px] px-2 py-1 rounded-full border font-bold tracking-wider ${ROLE_LABELS[user.role].color}`}>
                  {ROLE_LABELS[user.role].label}
                </span>

                {/* Status */}
                <div className={`flex items-center gap-1.5 ${user.status === 'active' && !isSuspended ? 'text-emerald-400' : 'text-[#859396]'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' && !isSuspended ? 'bg-emerald-400 animate-pulse' : 'bg-[#859396]'}`} />
                  <span className="font-label-caps text-[10px]">{isSuspended ? 'SUSPENDED' : user.status.toUpperCase()}</span>
                </div>

                {/* Last login */}
                <div className="text-right hidden xl:block">
                  <div className="font-code-sm text-[10px] text-[#859396]">Last login</div>
                  <div className="font-code-sm text-[11px] text-[#dfe2f4]">{user.lastLogin.split(' ')[1]}</div>
                </div>

                {/* Action */}
                {!isSelf && (
                  <button
                    id={`suspend-${user.username}`}
                    onClick={e => { e.stopPropagation(); toggleSuspend(user.username); }}
                    className={`px-3 py-1.5 rounded-lg font-label-caps text-[10px] font-bold border transition-all cursor-pointer shrink-0 ${
                      isSuspended
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                        : 'bg-red-500/10 text-red-400 border-red-500/25 hover:bg-red-500/20'
                    }`}
                  >
                    {isSuspended ? 'REINSTATE' : 'SUSPEND'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Permission Matrix for selected user */}
      {selectedUserData && (
        <div className="glass-panel rounded-xl overflow-hidden">
          <div className="bg-[#172034] px-5 py-3 border-b border-[#3c494b]/30 flex items-center gap-2">
            <span className="font-label-caps text-[10px] text-[#859396] tracking-widest">PERMISSION MATRIX —</span>
            <span className="font-label-caps text-[10px] font-bold text-[#dfe2f4]">{selectedUserData.displayName}</span>
          </div>
          <div className="p-5 grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              'view_all_cases', 'upload_evidence', 'delete_evidence', 'manage_users',
              'view_audit_log', 'generate_reports', 'access_copilot', 'view_security_center',
              'access_settings', 'view_graph', 'view_timeline', 'view_finance',
            ].map(perm => {
              const allowed = ROLE_PERMISSIONS[selectedUserData.role]?.includes(perm);
              return (
                <div key={perm} className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                  allowed ? 'bg-emerald-500/8 border-emerald-500/20' : 'bg-red-500/5 border-red-500/15 opacity-50'
                }`}>
                  <span className={`material-symbols-outlined text-[14px] ${allowed ? 'text-emerald-400' : 'text-red-500'}`}>
                    {allowed ? 'check_circle' : 'cancel'}
                  </span>
                  <span className="font-code-sm text-[10px] text-[#dfe2f4]">{perm.replace(/_/g, ' ')}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
