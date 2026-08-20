import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export interface PermissionItem {
  id: string;
  name: string;
  description: string;
  category: 'evidence' | 'intelligence' | 'legal' | 'system';
}

const ALL_PERMISSIONS: PermissionItem[] = [
  // Evidence Category
  { id: 'upload_evidence', name: 'Ingest Digital Evidence', description: 'Upload raw CDR, IPDR, bank statements and tower pings', category: 'evidence' },
  { id: 'recalculate_hash', name: 'Recalculate SHA-256 Hashes', description: 'Run real-time cryptographic checksum verification', category: 'evidence' },
  { id: 'delete_evidence', name: 'Delete / Purge Evidence', description: 'Requires Dual-Officer Authorization signature', category: 'evidence' },
  { id: 'export_raw_hex', name: 'Raw Forensics Hex Export', description: 'Export raw binary dumps and unparsed packet logs', category: 'evidence' },

  // Intelligence Category
  { id: 'view_graph', name: 'Entity Link Graph Canvas', description: 'Generate multi-tier suspect and mule account network graphs', category: 'intelligence' },
  { id: 'view_entity_dna', name: 'Suspect DNA 360° Profiler', description: 'Access aggregated risk scores, aliases, and known locations', category: 'intelligence' },
  { id: 'view_map', name: 'Geospatial Tower Triangulation', description: 'Map CDR azimuths, cell pings, and movement trajectories', category: 'intelligence' },
  { id: 'view_finance', name: 'Financial Money Trail Tracing', description: 'Inspect UPI transfers, mule bank accounts, and transaction flows', category: 'intelligence' },
  { id: 'access_copilot', name: 'AI Forensic Copilot Queries', description: 'Submit natural language intelligence queries and case searches', category: 'intelligence' },
  { id: 'view_social', name: 'Social Media OSINT Scrapes', description: 'Inspect social handles, mentions, and dark web correlations', category: 'intelligence' },

  // Legal Category
  { id: 'generate_reports', name: 'Export Section 65B Certificates', description: 'Generate court-admissible electronic evidence certificates', category: 'legal' },
  { id: 'view_audit_log', name: 'Inspect Hash-Chained Audit Trail', description: 'View sequential cryptographic ledger of all user actions', category: 'legal' },
  { id: 'sign_custody_chain', name: 'Digitally Sign Chain of Custody', description: 'Append cryptographic Officer Signature to custody handoffs', category: 'legal' },

  // System Category
  { id: 'manage_users', name: 'Officer Account Provisioning', description: 'Create, suspend, or modify officer directory accounts', category: 'system' },
  { id: 'modify_policies', name: 'Access Control & RBAC Policy Admin', description: 'Configure role permissions, subnet rules, and clearance levels', category: 'system' },
  { id: 'view_security_center', name: 'Security Center & Tamper Alarms', description: 'Monitor system telemetry, active sessions, and intrusion logs', category: 'system' },
  { id: 'access_settings', name: 'Cryptographic Workspace Settings', description: 'Configure schema thresholds and cryptographic hash algorithms', category: 'system' },
];

interface RoleDefinition {
  id: string;
  name: string;
  badge: string;
  clearanceLevel: 'LEVEL-4 (TOP SECRET)' | 'LEVEL-3 (SECRET)' | 'LEVEL-2 (CONFIDENTIAL)' | 'LEVEL-1 (RESTRICTED)';
  color: string;
  borderColor: string;
  bgLight: string;
  description: string;
  defaultPermissions: string[];
}

const ROLES: RoleDefinition[] = [
  {
    id: 'admin',
    name: 'Super Admin / Superintendent of Police',
    badge: 'SUPER ADMIN',
    clearanceLevel: 'LEVEL-4 (TOP SECRET)',
    color: 'text-red-400',
    borderColor: 'border-red-500/40',
    bgLight: 'bg-red-500/10',
    description: 'Unrestricted forensic command clearance across all case vaults, audit records, and officer policy management.',
    defaultPermissions: ALL_PERMISSIONS.map(p => p.id),
  },
  {
    id: 'investigator',
    name: 'Lead Investigating Officer (IO / Inspector)',
    badge: 'INVESTIGATOR',
    clearanceLevel: 'LEVEL-3 (SECRET)',
    color: 'text-amber-400',
    borderColor: 'border-amber-500/40',
    bgLight: 'bg-amber-500/10',
    description: 'Authorized to ingest evidence, execute graph correlations, query AI copilot, and generate Section 65B court reports.',
    defaultPermissions: [
      'upload_evidence', 'recalculate_hash', 'view_graph', 'view_entity_dna',
      'view_map', 'view_finance', 'access_copilot', 'view_social',
      'generate_reports', 'view_audit_log', 'sign_custody_chain'
    ],
  },
  {
    id: 'analyst',
    name: 'Digital Forensic Specialist / Cyber Analyst',
    badge: 'ANALYST',
    clearanceLevel: 'LEVEL-2 (CONFIDENTIAL)',
    color: 'text-sky-400',
    borderColor: 'border-sky-500/40',
    bgLight: 'bg-sky-500/10',
    description: 'Technical analysis clearance for link analysis, timeline mapping, CDR parsing, and data visualization.',
    defaultPermissions: [
      'upload_evidence', 'recalculate_hash', 'view_graph', 'view_entity_dna',
      'view_map', 'view_finance', 'access_copilot', 'view_social'
    ],
  },
  {
    id: 'auditor',
    name: 'Legal Officer & Compliance Auditor',
    badge: 'AUDITOR',
    clearanceLevel: 'LEVEL-3 (SECRET)',
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/40',
    bgLight: 'bg-emerald-500/10',
    description: 'Independent oversight role with read-only access to immutable audit hash chains and court report verification.',
    defaultPermissions: [
      'view_audit_log', 'generate_reports', 'sign_custody_chain', 'view_security_center'
    ],
  },
  {
    id: 'custodian',
    name: 'Evidence Vault Custodian',
    badge: 'CUSTODIAN',
    clearanceLevel: 'LEVEL-2 (CONFIDENTIAL)',
    color: 'text-purple-400',
    borderColor: 'border-purple-500/40',
    bgLight: 'bg-purple-500/10',
    description: 'Responsible for physical and digital intake, SHA-256 seal generation, and custody logging.',
    defaultPermissions: [
      'upload_evidence', 'recalculate_hash', 'sign_custody_chain', 'view_audit_log'
    ],
  },
];

interface SubnetRule {
  id: string;
  name: string;
  cidr: string;
  location: string;
  trustLevel: 'HIGH TRUST' | 'RESTRICTED' | 'MONITORED';
  status: 'ACTIVE' | 'DISABLED';
  mfaRequired: boolean;
}

const INITIAL_SUBNETS: SubnetRule[] = [
  { id: 'sub-1', name: 'HQ Cyber Command LAN', cidr: '10.240.10.0/24', location: 'Chandigarh Police HQ (Sector 9)', trustLevel: 'HIGH TRUST', status: 'ACTIVE', mfaRequired: false },
  { id: 'sub-2', name: 'Digital Forensics Lab VLAN', cidr: '10.240.12.0/24', location: 'Forensic Science Laboratory (FSL)', trustLevel: 'HIGH TRUST', status: 'ACTIVE', mfaRequired: false },
  { id: 'sub-3', name: 'District Police Station Wi-Fi', cidr: '10.240.55.0/24', location: 'Zonal Police Stations', trustLevel: 'RESTRICTED', status: 'ACTIVE', mfaRequired: true },
  { id: 'sub-4', name: 'Secure Investigation VPN Tunnel', cidr: '10.241.0.0/16', location: 'Encrypted Field WireGuard VPN', trustLevel: 'MONITORED', status: 'ACTIVE', mfaRequired: true },
];

interface AccessControlViewProps {
  onAddAuditLog?: (partial: { analyst: string; role: string; action: string; resource: string }) => void;
  showToast?: (msg: string) => void;
}

export function AccessControlView({ onAddAuditLog, showToast }: AccessControlViewProps) {
  const { session } = useAuth();
  const [selectedRoleId, setSelectedRoleId] = useState<string>('admin');
  const [activeTab, setActiveTab] = useState<'rbac' | 'subnets' | 'policies' | 'clearance'>('rbac');

  // Role permissions state
  const [rolePermissions, setRolePermissions] = useState<Record<string, string[]>>(() => {
    const map: Record<string, string[]> = {};
    ROLES.forEach(r => {
      map[r.id] = [...r.defaultPermissions];
    });
    return map;
  });

  // Subnet rules state
  const [subnets, setSubnets] = useState<SubnetRule[]>(INITIAL_SUBNETS);
  const [newSubnetName, setNewSubnetName] = useState('');
  const [newSubnetCidr, setNewSubnetCidr] = useState('');
  const [newSubnetLoc, setNewSubnetLoc] = useState('');
  const [isAddingSubnet, setIsAddingSubnet] = useState(false);

  // Security Policies State
  const [policies, setPolicies] = useState({
    dualOfficerDeletion: true,
    strictShaVerification: true,
    sessionTimeoutMinutes: '30',
    sec65bAutoSign: true,
    blockUnknownIps: true,
    enforceMfaForAdmin: true,
  });

  const selectedRole = ROLES.find(r => r.id === selectedRoleId) || ROLES[0];
  const currentPermissions = rolePermissions[selectedRoleId] || [];

  const togglePermission = (permId: string) => {
    setRolePermissions(prev => {
      const current = prev[selectedRoleId] || [];
      const updated = current.includes(permId)
        ? current.filter(id => id !== permId)
        : [...current, permId];
      return { ...prev, [selectedRoleId]: updated };
    });
  };

  const handleSaveRolePolicy = () => {
    if (showToast) {
      showToast(`Updated RBAC policy for role: ${selectedRole.badge}`);
    }
    if (onAddAuditLog && session) {
      onAddAuditLog({
        analyst: session.user.displayName,
        role: session.user.role,
        action: 'ACCESS_POLICY_UPDATED',
        resource: `Role: ${selectedRole.name} (${currentPermissions.length} permissions)`,
      });
    }
  };

  const toggleSubnetStatus = (id: string) => {
    setSubnets(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE' } : s));
    if (showToast) {
      showToast('Network subnet policy updated');
    }
  };

  const handleAddSubnet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubnetName.trim() || !newSubnetCidr.trim()) return;

    const newRule: SubnetRule = {
      id: `sub-${Date.now()}`,
      name: newSubnetName.trim(),
      cidr: newSubnetCidr.trim(),
      location: newSubnetLoc.trim() || 'Internal Subnet',
      trustLevel: 'MONITORED',
      status: 'ACTIVE',
      mfaRequired: true,
    };

    setSubnets(prev => [...prev, newRule]);
    setNewSubnetName('');
    setNewSubnetCidr('');
    setNewSubnetLoc('');
    setIsAddingSubnet(false);

    if (showToast) {
      showToast(`Added Subnet Rule: ${newRule.cidr}`);
    }
    if (onAddAuditLog && session) {
      onAddAuditLog({
        analyst: session.user.displayName,
        role: session.user.role,
        action: 'SUBNET_RULE_ADDED',
        resource: `${newRule.name} (${newRule.cidr})`,
      });
    }
  };

  const categories = [
    { key: 'evidence', label: 'EVIDENCE & VAULT OPERATIONS', icon: 'inventory_2', color: 'text-[#6dedff]' },
    { key: 'intelligence', label: 'ANALYTICS & FORENSIC COPILOT', icon: 'psychology', color: 'text-purple-400' },
    { key: 'legal', label: 'SECTION-65B & LEGAL COMPLIANCE', icon: 'gavel', color: 'text-emerald-400' },
    { key: 'system', label: 'SECURITY & SYSTEM GOVERNANCE', icon: 'admin_panel_settings', color: 'text-red-400' },
  ] as const;

  return (
    <div className="flex-1 flex flex-col gap-5 h-full overflow-y-auto pr-1">
      {/* Top Banner */}
      <div className="glass-panel p-5 rounded-xl flex flex-wrap items-center justify-between gap-4 shrink-0 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#28d2e6]/20 via-[#0053da]/30 to-[#6620bd]/30 border border-[#6dedff]/40 flex items-center justify-center shadow-[0_0_20px_rgba(40,210,230,0.3)]">
            <span className="material-symbols-outlined text-[#6dedff] text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              lock_person
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-title-lg text-title-lg text-[#dfe2f4]">Access Control & Policy Engine</h2>
              <span className="font-label-caps text-[9px] px-2 py-0.5 rounded bg-[#6dedff]/15 text-[#6dedff] border border-[#6dedff]/30 font-bold">
                RBAC v3.2
              </span>
            </div>
            <p className="font-code-sm text-[11px] text-[#859396]">
              Granular role permissions, security clearance classification, and zero-trust network policies
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-[#131726]/80 p-1 rounded-lg border border-[#3c494b]/30">
          <button
            onClick={() => setActiveTab('rbac')}
            className={`px-3.5 py-1.5 rounded-md font-label-caps text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'rbac'
                ? 'bg-[#28d2e6]/20 text-[#6dedff] border border-[#28d2e6]/40 shadow-[0_0_10px_rgba(40,210,230,0.2)]'
                : 'text-[#859396] hover:text-[#dfe2f4] hover:bg-[#181d2f]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">badge</span>
            <span>ROLE MATRIX (RBAC)</span>
          </button>

          <button
            onClick={() => setActiveTab('clearance')}
            className={`px-3.5 py-1.5 rounded-md font-label-caps text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'clearance'
                ? 'bg-[#28d2e6]/20 text-[#6dedff] border border-[#28d2e6]/40 shadow-[0_0_10px_rgba(40,210,230,0.2)]'
                : 'text-[#859396] hover:text-[#dfe2f4] hover:bg-[#181d2f]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">shield</span>
            <span>CLEARANCE TIERS</span>
          </button>

          <button
            onClick={() => setActiveTab('subnets')}
            className={`px-3.5 py-1.5 rounded-md font-label-caps text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'subnets'
                ? 'bg-[#28d2e6]/20 text-[#6dedff] border border-[#28d2e6]/40 shadow-[0_0_10px_rgba(40,210,230,0.2)]'
                : 'text-[#859396] hover:text-[#dfe2f4] hover:bg-[#181d2f]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">lan</span>
            <span>NETWORK / IP RULES</span>
          </button>

          <button
            onClick={() => setActiveTab('policies')}
            className={`px-3.5 py-1.5 rounded-md font-label-caps text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'policies'
                ? 'bg-[#28d2e6]/20 text-[#6dedff] border border-[#28d2e6]/40 shadow-[0_0_10px_rgba(40,210,230,0.2)]'
                : 'text-[#859396] hover:text-[#dfe2f4] hover:bg-[#181d2f]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">tune</span>
            <span>ENFORCEMENT RULES</span>
          </button>
        </div>
      </div>

      {/* TAB 1: RBAC ROLE MATRIX */}
      {activeTab === 'rbac' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Role Selector (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <div className="glass-panel p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-caps text-[11px] text-[#859396] tracking-widest font-bold">SYSTEM ROLES</span>
                <span className="font-code-sm text-[10px] text-[#6dedff]">{ROLES.length} Defined</span>
              </div>

              <div className="space-y-2">
                {ROLES.map(role => {
                  const isSelected = selectedRoleId === role.id;
                  const permsCount = (rolePermissions[role.id] || []).length;
                  return (
                    <div
                      key={role.id}
                      onClick={() => setSelectedRoleId(role.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? `bg-[#181d2f] ${role.borderColor} shadow-[0_0_16px_rgba(40,210,230,0.15)] border-l-4`
                          : 'bg-[#131726]/70 border-[#3c494b]/20 hover:bg-[#181d2f]/80 hover:border-[#6dedff]/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-label-caps text-[10px] px-2 py-0.5 rounded-full border font-bold ${role.color} ${role.borderColor} ${role.bgLight}`}>
                          {role.badge}
                        </span>
                        <span className="font-code-sm text-[10px] text-[#859396]">
                          {permsCount} / {ALL_PERMISSIONS.length} Perms
                        </span>
                      </div>
                      <h4 className="font-body-sm text-[13px] font-semibold text-[#dfe2f4] mt-1">{role.name}</h4>
                      <p className="font-code-sm text-[10px] text-[#859396] mt-1 line-clamp-2">{role.description}</p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#3c494b]/20">
                        <span className="font-code-sm text-[9px] text-[#859396]">{role.clearanceLevel}</span>
                        {isSelected && (
                          <span className="material-symbols-outlined text-[#6dedff] text-[16px]">check_circle</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Summary Card */}
            <div className="glass-panel p-4 rounded-xl border border-[#6dedff]/20 bg-gradient-to-br from-[#181d2f] to-[#0f1322]">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-[18px] text-[#6dedff]">security</span>
                <span className="font-label-caps text-[10px] text-[#dfe2f4] font-bold">ZERO-TRUST ENFORCEMENT</span>
              </div>
              <p className="font-body-sm text-[12px] text-[#859396] leading-relaxed">
                Permissions are dynamically evaluated on every API request and route change. Revoking access takes effect immediately across all active officer sessions.
              </p>
            </div>
          </div>

          {/* Right Column: Permission Matrix for Selected Role (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="glass-panel p-5 rounded-xl">
              {/* Role Header Info */}
              <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#3c494b]/25 gap-3">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-headline-sm text-[16px] text-[#dfe2f4] font-bold">{selectedRole.name}</h3>
                    <span className={`font-label-caps text-[9px] px-2 py-0.5 rounded-full border font-bold ${selectedRole.color} ${selectedRole.borderColor} ${selectedRole.bgLight}`}>
                      {selectedRole.badge}
                    </span>
                  </div>
                  <p className="font-code-sm text-[11px] text-[#859396] mt-0.5">
                    Clearance: <span className="text-[#6dedff] font-semibold">{selectedRole.clearanceLevel}</span> · Active Permissions: <span className="text-[#6dedff] font-bold">{currentPermissions.length} of {ALL_PERMISSIONS.length}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setRolePermissions(prev => ({
                        ...prev,
                        [selectedRoleId]: ALL_PERMISSIONS.map(p => p.id)
                      }));
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-[#181d2f] hover:bg-[#21273d] text-[#859396] hover:text-[#dfe2f4] border border-[#3c494b]/30 font-label-caps text-[10px] font-bold transition-all cursor-pointer"
                  >
                    GRANT ALL
                  </button>
                  <button
                    onClick={() => {
                      setRolePermissions(prev => ({
                        ...prev,
                        [selectedRoleId]: []
                      }));
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-[#181d2f] hover:bg-[#21273d] text-[#859396] hover:text-red-400 border border-[#3c494b]/30 font-label-caps text-[10px] font-bold transition-all cursor-pointer"
                  >
                    REVOKE ALL
                  </button>
                  <button
                    onClick={handleSaveRolePolicy}
                    className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#28d2e6] to-[#00a8bd] text-[#00363d] font-label-caps text-[11px] font-bold shadow-[0_0_15px_rgba(40,210,230,0.3)] hover:shadow-[0_0_20px_rgba(40,210,230,0.5)] transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">save</span>
                    <span>SAVE POLICY</span>
                  </button>
                </div>
              </div>

              {/* Categorized Permissions Grid */}
              <div className="mt-4 space-y-5">
                {categories.map(cat => {
                  const catPerms = ALL_PERMISSIONS.filter(p => p.category === cat.key);
                  return (
                    <div key={cat.key} className="space-y-2">
                      <div className="flex items-center gap-2 px-1">
                        <span className={`material-symbols-outlined text-[16px] ${cat.color}`}>{cat.icon}</span>
                        <span className="font-label-caps text-[10px] tracking-widest text-[#dfe2f4] font-bold">{cat.label}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {catPerms.map(perm => {
                          const isChecked = currentPermissions.includes(perm.id);
                          return (
                            <div
                              key={perm.id}
                              onClick={() => togglePermission(perm.id)}
                              className={`p-3 rounded-lg border transition-all cursor-pointer flex items-start gap-3 ${
                                isChecked
                                  ? 'bg-[#181d2f]/90 border-[#28d2e6]/30 shadow-[inset_0_0_12px_rgba(40,210,230,0.06)]'
                                  : 'bg-[#131726]/50 border-[#3c494b]/20 opacity-60 hover:opacity-100 hover:bg-[#181d2f]/60'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {}} // handled by parent div
                                className="mt-0.5 w-4 h-4 rounded text-[#28d2e6] bg-[#0e1220] border-[#3c494b] focus:ring-[#28d2e6] cursor-pointer"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className={`font-body-sm text-[13px] font-semibold ${isChecked ? 'text-[#dfe2f4]' : 'text-[#859396]'}`}>
                                    {perm.name}
                                  </span>
                                  <span className="font-code-sm text-[9px] text-[#859396] bg-[#0f1322] px-1.5 py-0.5 rounded border border-[#3c494b]/30">
                                    {perm.id}
                                  </span>
                                </div>
                                <p className="font-code-sm text-[11px] text-[#859396] mt-0.5 leading-snug">
                                  {perm.description}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CLEARANCE TIERS */}
      {activeTab === 'clearance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              level: 'LEVEL 4',
              title: 'TOP SECRET / SP COMMAND',
              badgeColor: 'bg-red-500/20 text-red-400 border-red-500/40',
              description: 'Full unredacted access across all evidence vaults, raw telecom pings, wiretap logs, cryptographic chain reset, and officer account management.',
              allowedOfficers: 'Supt. A. Kumar, Joint Director (Cyber)',
              features: ['Unredacted Intercept Vault', 'Cryptographic Seal Authority', 'Audit Tamper Override', 'All Department Access'],
            },
            {
              level: 'LEVEL 3',
              title: 'SECRET / INVESTIGATOR',
              badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
              description: 'Active case file jurisdiction, Section 65B legal certificate issuance, suspect link graphs, and forensic AI Copilot synthesis.',
              allowedOfficers: 'Insp. R. S. Gill, DSP S. Sharma',
              features: ['Section 65B Export', 'Suspect DNA Profiler', 'Geospatial Tower Plotting', 'Bank Mule Tracing'],
            },
            {
              level: 'LEVEL 2',
              title: 'CONFIDENTIAL / ANALYST',
              badgeColor: 'bg-sky-500/20 text-sky-400 border-sky-500/40',
              description: 'Forensic parsing, link clustering, and data normalization. Sensitive victim PII and unassigned case files are automatically redacted.',
              allowedOfficers: 'K. Mehta, Sub-Insp. P. Verma',
              features: ['CDR & IPDR Normalization', 'Link Graph Canvas', 'Timeline Sequencing', 'Hash Checksum Verify'],
            },
            {
              level: 'LEVEL 1',
              title: 'RESTRICTED / AUDITOR',
              badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
              description: 'Read-only compliance verification of sequential SHA-256 hash chains, legal custody audit logs, and evidence intake manifests.',
              allowedOfficers: 'Adv. M. Rao (Legal Advisor), FSL Auditor',
              features: ['Read-Only Audit Trail', 'Hash Continuity Verification', 'Compliance Inspection', 'No Evidence Editing'],
            },
          ].map(tier => (
            <div key={tier.level} className="glass-panel p-5 rounded-xl border flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`font-label-caps text-[10px] px-2.5 py-1 rounded-full border font-bold tracking-wider ${tier.badgeColor}`}>
                    {tier.level}
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-[#859396]">shield</span>
                </div>
                <h3 className="font-headline-sm text-[15px] font-bold text-[#dfe2f4]">{tier.title}</h3>
                <p className="font-body-sm text-[12px] text-[#859396] mt-2 leading-relaxed">{tier.description}</p>

                <div className="mt-4 pt-3 border-t border-[#3c494b]/20 space-y-2">
                  <span className="font-label-caps text-[9px] text-[#6dedff] tracking-widest font-bold block">AUTHORIZED MODULES</span>
                  {tier.features.map(f => (
                    <div key={f} className="flex items-center gap-2 font-code-sm text-[11px] text-[#dfe2f4]">
                      <span className="material-symbols-outlined text-[14px] text-emerald-400">check_circle</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#3c494b]/20 bg-[#0f1322]/50 p-2.5 rounded-lg">
                <span className="font-label-caps text-[9px] text-[#859396] block">ASSIGNED PERSONNEL</span>
                <span className="font-code-sm text-[11px] text-[#dfe2f4] font-medium mt-0.5 block">{tier.allowedOfficers}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: NETWORK & IP RULES */}
      {activeTab === 'subnets' && (
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-xl flex items-center justify-between">
            <div>
              <h3 className="font-headline-sm text-[16px] text-[#dfe2f4] font-bold">Zero-Trust Subnet & CIDR Whitelist</h3>
              <p className="font-code-sm text-[11px] text-[#859396] mt-0.5">
                Restricts workspace authentication and API ingestion to verified police networks and VPN IP pools
              </p>
            </div>
            <button
              onClick={() => setIsAddingSubnet(true)}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#28d2e6] to-[#00a8bd] text-[#00363d] font-label-caps text-[11px] font-bold shadow-[0_0_15px_rgba(40,210,230,0.3)] transition-all cursor-pointer flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>ADD SUBNET RULE</span>
            </button>
          </div>

          {/* Add Subnet Modal / Panel */}
          {isAddingSubnet && (
            <form onSubmit={handleAddSubnet} className="glass-panel p-5 rounded-xl border border-[#6dedff]/30 bg-[#181d2f]/90 space-y-4">
              <div className="flex items-center justify-between border-b border-[#3c494b]/30 pb-2">
                <span className="font-label-caps text-[11px] text-[#6dedff] font-bold">CONFIGURE NEW IP / SUBNET RULE</span>
                <button
                  type="button"
                  onClick={() => setIsAddingSubnet(false)}
                  className="text-[#859396] hover:text-[#dfe2f4] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="font-label-caps text-[10px] text-[#859396] block mb-1">RULE NAME</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Special Cell Subnet"
                    value={newSubnetName}
                    onChange={e => setNewSubnetName(e.target.value)}
                    className="w-full bg-[#131726] border border-[#3c494b]/50 rounded-lg px-3 py-2 text-[#dfe2f4] font-body-sm text-[13px] focus:outline-none focus:border-[#6dedff]"
                  />
                </div>
                <div>
                  <label className="font-label-caps text-[10px] text-[#859396] block mb-1">CIDR / IP RANGE</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10.240.20.0/24"
                    value={newSubnetCidr}
                    onChange={e => setNewSubnetCidr(e.target.value)}
                    className="w-full bg-[#131726] border border-[#3c494b]/50 rounded-lg px-3 py-2 text-[#dfe2f4] font-body-sm text-[13px] focus:outline-none focus:border-[#6dedff]"
                  />
                </div>
                <div>
                  <label className="font-label-caps text-[10px] text-[#859396] block mb-1">FACILITY / LOCATION</label>
                  <input
                    type="text"
                    placeholder="e.g. Special Operations Unit"
                    value={newSubnetLoc}
                    onChange={e => setNewSubnetLoc(e.target.value)}
                    className="w-full bg-[#131726] border border-[#3c494b]/50 rounded-lg px-3 py-2 text-[#dfe2f4] font-body-sm text-[13px] focus:outline-none focus:border-[#6dedff]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingSubnet(false)}
                  className="px-4 py-1.5 rounded-lg bg-[#1b2032] text-[#859396] hover:text-[#dfe2f4] font-label-caps text-[10px] font-bold cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#28d2e6] text-[#00363d] font-label-caps text-[10px] font-bold cursor-pointer"
                >
                  SAVE RULE
                </button>
              </div>
            </form>
          )}

          {/* Subnets List */}
          <div className="glass-panel rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#172034] border-b border-[#3c494b]/30">
                  <th className="px-5 py-3 font-label-caps text-[10px] text-[#859396] tracking-widest">NETWORK IDENTITY</th>
                  <th className="px-5 py-3 font-label-caps text-[10px] text-[#859396] tracking-widest">CIDR PREFIX</th>
                  <th className="px-5 py-3 font-label-caps text-[10px] text-[#859396] tracking-widest">LOCATION</th>
                  <th className="px-5 py-3 font-label-caps text-[10px] text-[#859396] tracking-widest">TRUST LEVEL</th>
                  <th className="px-5 py-3 font-label-caps text-[10px] text-[#859396] tracking-widest">MFA ENFORCED</th>
                  <th className="px-5 py-3 font-label-caps text-[10px] text-[#859396] tracking-widest text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3c494b]/15">
                {subnets.map(s => (
                  <tr key={s.id} className="hover:bg-[#1f263c]/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-[18px] text-[#6dedff]">router</span>
                        <span className="font-body-sm text-[13px] font-semibold text-[#dfe2f4]">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-code-sm text-[12px] text-[#6dedff]">{s.cidr}</td>
                    <td className="px-5 py-3.5 font-body-sm text-[12px] text-[#859396]">{s.location}</td>
                    <td className="px-5 py-3.5">
                      <span className={`font-label-caps text-[9px] px-2 py-0.5 rounded-full border font-bold ${
                        s.trustLevel === 'HIGH TRUST'
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : s.trustLevel === 'RESTRICTED'
                            ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                            : 'bg-sky-500/15 text-sky-400 border-sky-500/30'
                      }`}>
                        {s.trustLevel}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`font-code-sm text-[11px] flex items-center gap-1 ${s.mfaRequired ? 'text-emerald-400' : 'text-[#859396]'}`}>
                        <span className="material-symbols-outlined text-[14px]">{s.mfaRequired ? 'verified_user' : 'remove'}</span>
                        {s.mfaRequired ? 'Required' : 'Optional'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => toggleSubnetStatus(s.id)}
                        className={`px-3 py-1 rounded-lg font-label-caps text-[10px] font-bold border transition-all cursor-pointer ${
                          s.status === 'ACTIVE'
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                            : 'bg-red-500/15 text-red-400 border-red-500/30 hover:bg-red-500/25'
                        }`}
                      >
                        {s.status}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ENFORCEMENT RULES */}
      {activeTab === 'policies' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="glass-panel p-5 rounded-xl space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#3c494b]/20">
              <span className="material-symbols-outlined text-[20px] text-red-400">gavel</span>
              <h3 className="font-headline-sm text-[15px] text-[#dfe2f4] font-bold">Dual-Officer & Integrity Rules</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#131726]/60 border border-[#3c494b]/20">
                <div>
                  <h4 className="font-body-sm text-[13px] font-semibold text-[#dfe2f4]">Two-Officer Rule for Evidence Deletion</h4>
                  <p className="font-code-sm text-[11px] text-[#859396] mt-0.5">Requires both Superintendent and Case IO cryptographic approval to purge evidence files</p>
                </div>
                <input
                  type="checkbox"
                  checked={policies.dualOfficerDeletion}
                  onChange={e => setPolicies(p => ({ ...p, dualOfficerDeletion: e.target.checked }))}
                  className="w-4 h-4 rounded text-[#28d2e6] bg-[#0e1220] border-[#3c494b] focus:ring-[#28d2e6] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-[#131726]/60 border border-[#3c494b]/20">
                <div>
                  <h4 className="font-body-sm text-[13px] font-semibold text-[#dfe2f4]">Strict SHA-256 Checksum Verification</h4>
                  <p className="font-code-sm text-[11px] text-[#859396] mt-0.5">Automatically reject corrupted or non-matching file uploads at ingestion time</p>
                </div>
                <input
                  type="checkbox"
                  checked={policies.strictShaVerification}
                  onChange={e => setPolicies(p => ({ ...p, strictShaVerification: e.target.checked }))}
                  className="w-4 h-4 rounded text-[#28d2e6] bg-[#0e1220] border-[#3c494b] focus:ring-[#28d2e6] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-[#131726]/60 border border-[#3c494b]/20">
                <div>
                  <h4 className="font-body-sm text-[13px] font-semibold text-[#dfe2f4]">Auto-Sign Section 65B Certificates</h4>
                  <p className="font-code-sm text-[11px] text-[#859396] mt-0.5">Embed cryptographic hash timestamp on generated court PDF exhibits</p>
                </div>
                <input
                  type="checkbox"
                  checked={policies.sec65bAutoSign}
                  onChange={e => setPolicies(p => ({ ...p, sec65bAutoSign: e.target.checked }))}
                  className="w-4 h-4 rounded text-[#28d2e6] bg-[#0e1220] border-[#3c494b] focus:ring-[#28d2e6] cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-xl space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#3c494b]/20">
              <span className="material-symbols-outlined text-[20px] text-[#6dedff]">timer</span>
              <h3 className="font-headline-sm text-[15px] text-[#dfe2f4] font-bold">Session & Auth Security</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-label-caps text-[10px] text-[#859396] block mb-1">INACTIVE SESSION AUTO-LOCK TIMEOUT</label>
                <select
                  value={policies.sessionTimeoutMinutes}
                  onChange={e => setPolicies(p => ({ ...p, sessionTimeoutMinutes: e.target.value }))}
                  className="w-full bg-[#131726] border border-[#3c494b]/40 rounded-lg p-2 text-[#6dedff] font-body-sm text-[13px]"
                >
                  <option value="15">15 Minutes (Strict Security)</option>
                  <option value="30">30 Minutes (Recommended)</option>
                  <option value="60">60 Minutes (Extended Investigation)</option>
                  <option value="120">2 Hours</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-[#131726]/60 border border-[#3c494b]/20">
                <div>
                  <h4 className="font-body-sm text-[13px] font-semibold text-[#dfe2f4]">Block Non-Whitelisted IP Access</h4>
                  <p className="font-code-sm text-[11px] text-[#859396] mt-0.5">Strictly terminate login attempts from IP addresses outside authorized CIDRs</p>
                </div>
                <input
                  type="checkbox"
                  checked={policies.blockUnknownIps}
                  onChange={e => setPolicies(p => ({ ...p, blockUnknownIps: e.target.checked }))}
                  className="w-4 h-4 rounded text-[#28d2e6] bg-[#0e1220] border-[#3c494b] focus:ring-[#28d2e6] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-[#131726]/60 border border-[#3c494b]/20">
                <div>
                  <h4 className="font-body-sm text-[13px] font-semibold text-[#dfe2f4]">Mandatory MFA for Admin Roles</h4>
                  <p className="font-code-sm text-[11px] text-[#859396] mt-0.5">Require TOTP hardware token for Super Admin and Superintendent accounts</p>
                </div>
                <input
                  type="checkbox"
                  checked={policies.enforceMfaForAdmin}
                  onChange={e => setPolicies(p => ({ ...p, enforceMfaForAdmin: e.target.checked }))}
                  className="w-4 h-4 rounded text-[#28d2e6] bg-[#0e1220] border-[#3c494b] focus:ring-[#28d2e6] cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
