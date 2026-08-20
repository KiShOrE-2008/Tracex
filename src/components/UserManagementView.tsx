import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types/forensic';

export interface OfficerUser {
  id: string;
  username: string;
  displayName: string;
  badgeNumber: string;
  role: UserRole;
  rank: string;
  department: string;
  email: string;
  phone: string;
  lastLogin: string;
  ip: string;
  status: 'active' | 'suspended' | 'on_leave';
  mfaEnabled: boolean;
  assignedCases: string[];
  initials: string;
  color: string;
}

const INITIAL_OFFICERS: OfficerUser[] = [
  {
    id: 'off-001',
    username: 'admin',
    displayName: 'Supt. A. Kumar',
    badgeNumber: 'CH-IPS-4402',
    role: 'admin',
    rank: 'Superintendent of Police',
    department: 'Cyber Crime HQ',
    email: 'a.kumar@police.chd.gov.in',
    phone: '+91 98140-92811',
    lastLogin: '2026-08-19 22:01:14',
    ip: '10.240.10.01',
    status: 'active',
    mfaEnabled: true,
    assignedCases: ['PN-2026-001', 'PN-2026-002', 'PN-2026-003'],
    initials: 'AK',
    color: 'bg-red-500/20 text-red-300 border-red-500/30',
  },
  {
    id: 'off-002',
    username: 'investigator',
    displayName: 'Insp. R. S. Gill',
    badgeNumber: 'CH-INSP-8190',
    role: 'investigator',
    rank: 'Inspector / Lead IO',
    department: 'Cyber Crime Cell',
    email: 'rs.gill@police.chd.gov.in',
    phone: '+91 98722-10492',
    lastLogin: '2026-08-19 09:42:15',
    ip: '10.240.12.45',
    status: 'active',
    mfaEnabled: true,
    assignedCases: ['PN-2026-001', 'PN-2026-003'],
    initials: 'RG',
    color: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
  {
    id: 'off-003',
    username: 'analyst',
    displayName: 'K. Mehta',
    badgeNumber: 'CH-FSL-1104',
    role: 'analyst',
    rank: 'Senior Digital Forensic Examiner',
    department: 'Digital Forensics Lab',
    email: 'k.mehta@fsl.chd.gov.in',
    phone: '+91 94170-88320',
    lastLogin: '2026-08-19 10:02:44',
    ip: '10.240.12.88',
    status: 'active',
    mfaEnabled: false,
    assignedCases: ['PN-2026-001'],
    initials: 'KM',
    color: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  },
  {
    id: 'off-004',
    username: 'pverma',
    displayName: 'Sub-Insp. P. Verma',
    badgeNumber: 'CH-SI-6672',
    role: 'investigator',
    rank: 'Sub-Inspector',
    department: 'Special Operations Unit',
    email: 'p.verma@police.chd.gov.in',
    phone: '+91 98881-44501',
    lastLogin: '2026-08-18 17:15:30',
    ip: '10.240.55.19',
    status: 'on_leave',
    mfaEnabled: true,
    assignedCases: ['PN-2026-002'],
    initials: 'PV',
    color: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
  {
    id: 'off-005',
    username: 'mrao',
    displayName: 'Adv. M. Rao',
    badgeNumber: 'CH-LEG-0914',
    role: 'analyst',
    rank: 'Chief Legal Prosecutor / Section 65B Officer',
    department: 'Legal Compliance Cell',
    email: 'm.rao@legal.chd.gov.in',
    phone: '+91 97800-22319',
    lastLogin: '2026-08-17 14:20:02',
    ip: '10.240.10.99',
    status: 'active',
    mfaEnabled: true,
    assignedCases: ['PN-2026-001', 'PN-2026-002'],
    initials: 'MR',
    color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  },
];

const ROLE_LABELS: Record<UserRole, { label: string; color: string }> = {
  admin:        { label: 'SUPER ADMIN', color: 'text-red-400 bg-red-500/15 border-red-500/30' },
  investigator: { label: 'INVESTIGATOR', color: 'text-amber-400 bg-amber-500/15 border-amber-500/30' },
  analyst:      { label: 'ANALYST', color: 'text-sky-400 bg-sky-500/15 border-sky-500/30' },
};

interface UserManagementViewProps {
  onAddAuditLog?: (partial: { analyst: string; role: string; action: string; resource: string }) => void;
  showToast?: (msg: string) => void;
}

export function UserManagementView({ onAddAuditLog, showToast }: UserManagementViewProps) {
  const { session } = useAuth();
  const [officers, setOfficers] = useState<OfficerUser[]>(INITIAL_OFFICERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('all');
  const [selectedOfficerId, setSelectedOfficerId] = useState<string | null>('off-001');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State for Adding Officer
  const [newOfficer, setNewOfficer] = useState({
    displayName: '',
    rank: '',
    badgeNumber: '',
    department: 'Cyber Crime Cell',
    role: 'investigator' as UserRole,
    email: '',
    phone: '',
    username: '',
  });

  const filteredOfficers = useMemo(() => {
    return officers.filter(off => {
      const matchesSearch =
        off.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        off.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        off.badgeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        off.department.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = selectedRoleFilter === 'all' || off.role === selectedRoleFilter;
      const matchesDept = selectedDeptFilter === 'all' || off.department === selectedDeptFilter;

      return matchesSearch && matchesRole && matchesDept;
    });
  }, [officers, searchQuery, selectedRoleFilter, selectedDeptFilter]);

  const selectedOfficer = officers.find(o => o.id === selectedOfficerId);

  const toggleStatus = (officerId: string) => {
    const target = officers.find(o => o.id === officerId);
    if (!target) return;
    if (target.username === session?.user.username) {
      if (showToast) showToast('Cannot suspend your own active administrator account');
      return;
    }

    const nextStatus = target.status === 'active' ? 'suspended' : 'active';
    setOfficers(prev => prev.map(o => o.id === officerId ? { ...o, status: nextStatus } : o));

    if (showToast) {
      showToast(`${target.displayName} account status changed to ${nextStatus.toUpperCase()}`);
    }
    if (onAddAuditLog && session) {
      onAddAuditLog({
        analyst: session.user.displayName,
        role: session.user.role,
        action: 'OFFICER_STATUS_TOGGLED',
        resource: `${target.displayName} (${target.username}) → ${nextStatus}`,
      });
    }
  };

  const handleResetPassword = (officer: OfficerUser) => {
    const tempKey = `NX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    if (showToast) {
      showToast(`One-time security credential reset link generated for ${officer.displayName} [Token: ${tempKey}]`);
    }
    if (onAddAuditLog && session) {
      onAddAuditLog({
        analyst: session.user.displayName,
        role: session.user.role,
        action: 'PASSWORD_RESET_ISSUED',
        resource: `Token issued for ${officer.username} (${officer.badgeNumber})`,
      });
    }
  };

  const handleAddOfficerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOfficer.displayName || !newOfficer.username || !newOfficer.badgeNumber) return;

    const initials = newOfficer.displayName
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const created: OfficerUser = {
      id: `off-${Date.now()}`,
      username: newOfficer.username.toLowerCase().trim(),
      displayName: newOfficer.displayName.trim(),
      badgeNumber: newOfficer.badgeNumber.trim(),
      role: newOfficer.role,
      rank: newOfficer.rank || 'Officer',
      department: newOfficer.department,
      email: newOfficer.email || `${newOfficer.username}@police.chd.gov.in`,
      phone: newOfficer.phone || '+91 98000-00000',
      lastLogin: 'Never (New Account)',
      ip: '10.240.10.00',
      status: 'active',
      mfaEnabled: true,
      assignedCases: ['PN-2026-001'],
      initials: initials || 'OF',
      color: newOfficer.role === 'admin' ? 'bg-red-500/20 text-red-300 border-red-500/30' : newOfficer.role === 'investigator' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    };

    setOfficers(prev => [created, ...prev]);
    setSelectedOfficerId(created.id);
    setIsAddModalOpen(false);
    setNewOfficer({
      displayName: '',
      rank: '',
      badgeNumber: '',
      department: 'Cyber Crime Cell',
      role: 'investigator',
      email: '',
      phone: '',
      username: '',
    });

    if (showToast) {
      showToast(`Officer ${created.displayName} (${created.badgeNumber}) successfully registered.`);
    }
    if (onAddAuditLog && session) {
      onAddAuditLog({
        analyst: session.user.displayName,
        role: session.user.role,
        action: 'OFFICER_PROVISIONED',
        resource: `${created.displayName} [Role: ${created.role}]`,
      });
    }
  };

  const departments = Array.from(new Set(officers.map(o => o.department)));

  return (
    <div className="flex-1 flex flex-col gap-5 h-full overflow-y-auto pr-1">
      {/* Header Banner */}
      <div className="glass-panel p-5 rounded-xl flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 via-[#6620bd]/30 to-[#28d2e6]/20 border border-red-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.25)]">
            <span className="material-symbols-outlined text-red-400 text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              manage_accounts
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-title-lg text-title-lg text-[#dfe2f4]">Officer Directory & Identity Provisioning</h2>
              <span className="font-label-caps text-[9px] px-2 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/30 font-bold">
                COMMAND CLEARANCE
              </span>
            </div>
            <p className="font-code-sm text-[11px] text-[#859396]">
              Manage sworn officer accounts, security badges, contact records, and active investigation assignments
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-[#e11d48] text-white font-label-caps text-[11px] font-bold shadow-[0_0_15px_rgba(239,68,68,0.35)] hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all cursor-pointer flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px]">person_add</span>
            <span>REGISTER NEW OFFICER</span>
          </button>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 shrink-0">
        <div className="glass-panel p-4 rounded-xl border border-[#3c494b]/20">
          <div className="flex items-center justify-between text-[#859396] mb-1">
            <span className="font-label-caps text-[10px] tracking-wider font-bold">TOTAL OFFICERS</span>
            <span className="material-symbols-outlined text-[18px] text-[#6dedff]">badge</span>
          </div>
          <div className="font-headline-md text-[22px] font-bold text-[#dfe2f4]">{officers.length}</div>
          <span className="font-code-sm text-[10px] text-[#859396]">Across 4 Specialized Units</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-emerald-500/20">
          <div className="flex items-center justify-between text-[#859396] mb-1">
            <span className="font-label-caps text-[10px] tracking-wider font-bold">ACTIVE ON-DUTY</span>
            <span className="material-symbols-outlined text-[18px] text-emerald-400">how_to_reg</span>
          </div>
          <div className="font-headline-md text-[22px] font-bold text-emerald-400">
            {officers.filter(o => o.status === 'active').length}
          </div>
          <span className="font-code-sm text-[10px] text-emerald-400/80">Authorized for Evidence Vault</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-amber-500/20">
          <div className="flex items-center justify-between text-[#859396] mb-1">
            <span className="font-label-caps text-[10px] tracking-wider font-bold">MFA PROTECTED</span>
            <span className="material-symbols-outlined text-[18px] text-amber-400">verified_user</span>
          </div>
          <div className="font-headline-md text-[22px] font-bold text-amber-400">
            {officers.filter(o => o.mfaEnabled).length}
          </div>
          <span className="font-code-sm text-[10px] text-amber-400/80">Hardware Token / 2FA Active</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-red-500/20">
          <div className="flex items-center justify-between text-[#859396] mb-1">
            <span className="font-label-caps text-[10px] tracking-wider font-bold">SUSPENDED / LEAVE</span>
            <span className="material-symbols-outlined text-[18px] text-red-400">block</span>
          </div>
          <div className="font-headline-md text-[22px] font-bold text-red-400">
            {officers.filter(o => o.status !== 'active').length}
          </div>
          <span className="font-code-sm text-[10px] text-red-400/80">Vault Access Revoked</span>
        </div>
      </div>

      {/* Main Content Layout: Table + Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-0">
        {/* Left Side: Directory Table & Filters (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          {/* Filter Bar */}
          <div className="glass-panel p-3.5 rounded-xl flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#859396] text-[16px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by officer name, badge ID, username..."
                className="w-full bg-[#131726] border border-[#3c494b]/40 rounded-lg pl-9 pr-3 py-1.5 text-[#dfe2f4] font-body-sm text-[12px] focus:outline-none focus:border-[#6dedff]"
              />
            </div>

            <select
              value={selectedRoleFilter}
              onChange={e => setSelectedRoleFilter(e.target.value)}
              className="bg-[#131726] border border-[#3c494b]/40 rounded-lg px-2.5 py-1.5 text-[#6dedff] font-label-caps text-[10px] font-bold focus:outline-none cursor-pointer"
            >
              <option value="all">ALL ROLES</option>
              <option value="admin">SUPER ADMIN</option>
              <option value="investigator">INVESTIGATOR</option>
              <option value="analyst">ANALYST</option>
            </select>

            <select
              value={selectedDeptFilter}
              onChange={e => setSelectedDeptFilter(e.target.value)}
              className="bg-[#131726] border border-[#3c494b]/40 rounded-lg px-2.5 py-1.5 text-[#dfe2f4] font-label-caps text-[10px] font-bold focus:outline-none cursor-pointer"
            >
              <option value="all">ALL DEPARTMENTS</option>
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Officers Roster List */}
          <div className="glass-panel rounded-xl overflow-hidden flex-1 divide-y divide-[#3c494b]/15 overflow-y-auto">
            {filteredOfficers.map(officer => {
              const isSelected = selectedOfficerId === officer.id;
              const isSelf = officer.username === session?.user.username;
              const isSuspended = officer.status === 'suspended';

              return (
                <div
                  key={officer.id}
                  onClick={() => setSelectedOfficerId(officer.id)}
                  className={`p-4 hover:bg-[#1f263c]/50 transition-all cursor-pointer flex items-center gap-4 ${
                    isSelected ? 'bg-[#1f263c]/70 border-l-4 border-[#6dedff]' : ''
                  } ${isSuspended ? 'opacity-60 bg-red-950/10' : ''}`}
                >
                  {/* Initials Avatar */}
                  <div className={`w-11 h-11 rounded-xl border ${officer.color} flex items-center justify-center font-bold text-[14px] shrink-0 shadow-[0_0_10px_rgba(0,0,0,0.3)]`}>
                    {officer.initials}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-body-sm text-[13px] font-semibold text-[#dfe2f4] truncate">
                        {officer.displayName}
                      </span>
                      {isSelf && (
                        <span className="font-label-caps text-[8px] px-1.5 py-0.2 rounded-full bg-[#6dedff]/15 text-[#6dedff] border border-[#6dedff]/30 font-bold">
                          YOU
                        </span>
                      )}
                      <span className={`font-label-caps text-[8px] px-1.5 py-0.2 rounded-full border font-bold ${ROLE_LABELS[officer.role].color}`}>
                        {ROLE_LABELS[officer.role].label}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 font-code-sm text-[10px] text-[#859396]">
                      <span>{officer.badgeNumber}</span>
                      <span>•</span>
                      <span className="truncate">{officer.rank}</span>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="text-right shrink-0">
                    <div className="flex items-center justify-end gap-1.5 mb-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        officer.status === 'active' ? 'bg-emerald-400 animate-pulse' : officer.status === 'suspended' ? 'bg-red-400' : 'bg-amber-400'
                      }`} />
                      <span className={`font-label-caps text-[9px] font-bold ${
                        officer.status === 'active' ? 'text-emerald-400' : officer.status === 'suspended' ? 'text-red-400' : 'text-amber-400'
                      }`}>
                        {officer.status.toUpperCase()}
                      </span>
                    </div>
                    <span className="font-code-sm text-[9px] text-[#859396] block">
                      {officer.assignedCases.length} Cases Assigned
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredOfficers.length === 0 && (
              <div className="p-8 text-center text-[#859396]">
                <span className="material-symbols-outlined text-[36px] mb-2 text-[#3c494b]">person_search</span>
                <p className="font-body-sm text-[13px]">No officers matched your search criteria.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Detailed Officer Dossier (5 cols) */}
        <div className="lg:col-span-5">
          {selectedOfficer ? (
            <div className="glass-panel p-5 rounded-xl space-y-4">
              {/* Officer Header Card */}
              <div className="flex items-start justify-between pb-4 border-b border-[#3c494b]/20">
                <div className="flex items-center gap-3">
                  <div className={`w-14 h-14 rounded-2xl border ${selectedOfficer.color} flex items-center justify-center font-bold text-[18px] shadow-[0_0_15px_rgba(40,210,230,0.15)]`}>
                    {selectedOfficer.initials}
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-[16px] text-[#dfe2f4] font-bold leading-tight">
                      {selectedOfficer.displayName}
                    </h3>
                    <p className="font-code-sm text-[11px] text-[#6dedff] mt-0.5">{selectedOfficer.badgeNumber}</p>
                    <span className={`inline-block font-label-caps text-[8px] px-2 py-0.5 rounded-full border font-bold mt-1 ${ROLE_LABELS[selectedOfficer.role].color}`}>
                      {ROLE_LABELS[selectedOfficer.role].label}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleStatus(selectedOfficer.id)}
                  className={`px-3 py-1.5 rounded-lg font-label-caps text-[10px] font-bold border transition-all cursor-pointer ${
                    selectedOfficer.status === 'suspended'
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                      : 'bg-red-500/10 text-red-400 border-red-500/25 hover:bg-red-500/20'
                  }`}
                >
                  {selectedOfficer.status === 'suspended' ? 'REINSTATE' : 'SUSPEND'}
                </button>
              </div>

              {/* Identity Details */}
              <div className="space-y-2.5 font-body-sm text-[12px]">
                <div className="flex items-center justify-between py-1 border-b border-[#3c494b]/15">
                  <span className="font-label-caps text-[10px] text-[#859396]">DESIGNATION / RANK</span>
                  <span className="text-[#dfe2f4] font-medium">{selectedOfficer.rank}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[#3c494b]/15">
                  <span className="font-label-caps text-[10px] text-[#859396]">DEPARTMENT</span>
                  <span className="text-[#dfe2f4] font-medium">{selectedOfficer.department}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[#3c494b]/15">
                  <span className="font-label-caps text-[10px] text-[#859396]">OFFICIAL EMAIL</span>
                  <span className="font-code-sm text-[11px] text-[#6dedff]">{selectedOfficer.email}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[#3c494b]/15">
                  <span className="font-label-caps text-[10px] text-[#859396]">PHONE RECORD</span>
                  <span className="font-code-sm text-[11px] text-[#dfe2f4]">{selectedOfficer.phone}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[#3c494b]/15">
                  <span className="font-label-caps text-[10px] text-[#859396]">MFA 2-FACTOR AUTH</span>
                  <span className={`font-code-sm text-[11px] font-bold ${selectedOfficer.mfaEnabled ? 'text-emerald-400' : 'text-red-400'}`}>
                    {selectedOfficer.mfaEnabled ? '✓ Hardware Token' : '✗ Not Enforced'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[#3c494b]/15">
                  <span className="font-label-caps text-[10px] text-[#859396]">LAST TERMINAL LOGIN</span>
                  <span className="font-code-sm text-[11px] text-[#dfe2f4]">{selectedOfficer.lastLogin}</span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="font-label-caps text-[10px] text-[#859396]">REGISTERED IP</span>
                  <span className="font-code-sm text-[11px] text-[#859396]">{selectedOfficer.ip}</span>
                </div>
              </div>

              {/* Assigned Cases */}
              <div className="pt-2">
                <span className="font-label-caps text-[10px] text-[#859396] tracking-widest font-bold block mb-2">
                  ACTIVE CASE JURISDICTION
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedOfficer.assignedCases.map(caseId => (
                    <span key={caseId} className="font-code-sm text-[10px] px-2.5 py-1 rounded-md bg-[#131726] text-[#6dedff] border border-[#3c494b]/30">
                      {caseId}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#3c494b]/20 flex flex-col gap-2">
                <button
                  onClick={() => handleResetPassword(selectedOfficer)}
                  className="w-full py-2 px-3 rounded-lg bg-[#181d2f] hover:bg-[#21273d] text-[#6dedff] border border-[#6dedff]/30 font-label-caps text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]">key</span>
                  <span>GENERATE ONE-TIME CREDENTIAL RESET TOKEN</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-xl text-center text-[#859396] flex flex-col items-center justify-center h-full">
              <span className="material-symbols-outlined text-[40px] text-[#3c494b] mb-2">account_circle</span>
              <p className="font-body-sm text-[13px]">Select an officer from the directory to view detailed security records.</p>
            </div>
          )}
        </div>
      </div>

      {/* Register New Officer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleAddOfficerSubmit} className="glass-panel rounded-2xl max-w-lg w-full p-6 space-y-4 border border-[#6dedff]/30 shadow-[0_0_35px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between border-b border-[#3c494b]/30 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-red-400 text-[22px]">person_add</span>
                <h3 className="font-headline-sm text-[16px] text-[#dfe2f4] font-bold">Register Sworn Officer</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#859396] hover:text-[#dfe2f4] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-body-sm text-[12px]">
              <div>
                <label className="font-label-caps text-[9px] text-[#859396] block mb-1">OFFICER FULL NAME *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Insp. Vikram Singh"
                  value={newOfficer.displayName}
                  onChange={e => setNewOfficer(p => ({ ...p, displayName: e.target.value }))}
                  className="w-full bg-[#131726] border border-[#3c494b]/50 rounded-lg px-3 py-2 text-[#dfe2f4] text-[13px] focus:outline-none focus:border-[#6dedff]"
                />
              </div>

              <div>
                <label className="font-label-caps text-[9px] text-[#859396] block mb-1">SYSTEM USERNAME *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. vsingh"
                  value={newOfficer.username}
                  onChange={e => setNewOfficer(p => ({ ...p, username: e.target.value }))}
                  className="w-full bg-[#131726] border border-[#3c494b]/50 rounded-lg px-3 py-2 text-[#dfe2f4] text-[13px] focus:outline-none focus:border-[#6dedff]"
                />
              </div>

              <div>
                <label className="font-label-caps text-[9px] text-[#859396] block mb-1">POLICE BADGE ID *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CH-INSP-5521"
                  value={newOfficer.badgeNumber}
                  onChange={e => setNewOfficer(p => ({ ...p, badgeNumber: e.target.value }))}
                  className="w-full bg-[#131726] border border-[#3c494b]/50 rounded-lg px-3 py-2 text-[#dfe2f4] text-[13px] focus:outline-none focus:border-[#6dedff]"
                />
              </div>

              <div>
                <label className="font-label-caps text-[9px] text-[#859396] block mb-1">SECURITY ROLE *</label>
                <select
                  value={newOfficer.role}
                  onChange={e => setNewOfficer(p => ({ ...p, role: e.target.value as UserRole }))}
                  className="w-full bg-[#131726] border border-[#3c494b]/50 rounded-lg px-3 py-2 text-[#6dedff] text-[13px] focus:outline-none focus:border-[#6dedff]"
                >
                  <option value="investigator">Lead Investigator (IO)</option>
                  <option value="analyst">Forensic Analyst</option>
                  <option value="admin">Super Admin (SP)</option>
                </select>
              </div>

              <div>
                <label className="font-label-caps text-[9px] text-[#859396] block mb-1">RANK / DESIGNATION</label>
                <input
                  type="text"
                  placeholder="e.g. Inspector"
                  value={newOfficer.rank}
                  onChange={e => setNewOfficer(p => ({ ...p, rank: e.target.value }))}
                  className="w-full bg-[#131726] border border-[#3c494b]/50 rounded-lg px-3 py-2 text-[#dfe2f4] text-[13px] focus:outline-none focus:border-[#6dedff]"
                />
              </div>

              <div>
                <label className="font-label-caps text-[9px] text-[#859396] block mb-1">DEPARTMENT / UNIT</label>
                <select
                  value={newOfficer.department}
                  onChange={e => setNewOfficer(p => ({ ...p, department: e.target.value }))}
                  className="w-full bg-[#131726] border border-[#3c494b]/50 rounded-lg px-3 py-2 text-[#dfe2f4] text-[13px] focus:outline-none focus:border-[#6dedff]"
                >
                  <option value="Cyber Crime HQ">Cyber Crime HQ</option>
                  <option value="Cyber Crime Cell">Cyber Crime Cell</option>
                  <option value="Digital Forensics Lab">Digital Forensics Lab</option>
                  <option value="Special Operations Unit">Special Operations Unit</option>
                  <option value="Legal Compliance Cell">Legal Compliance Cell</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#3c494b]/30">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-[#181d2f] text-[#859396] hover:text-[#dfe2f4] font-label-caps text-[10px] font-bold cursor-pointer"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-red-500 to-[#e11d48] text-white font-label-caps text-[11px] font-bold shadow-[0_0_15px_rgba(239,68,68,0.4)] cursor-pointer"
              >
                PROVISION ACCOUNT
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
