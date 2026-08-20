import { useState } from 'react';
import type { FC } from 'react';
import { useAuth } from '../context/AuthContext';

export type NavTab = 
  | 'overview'
  | 'evidence'
  | 'processing'
  | 'graph'
  | 'map'
  | 'timeline'
  | 'finance'
  | 'entity_dna'
  | 'copilot'
  | 'reports'
  | 'audit_log'
  | 'settings'
  | 'alerts'
  | 'correlation'
  | 'social_media'
  | 'user_management'
  | 'security_center'
  | 'access_control';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenNewCaseModal: () => void;
  evidenceCount: number;
  alertCount: number;
}

interface NavItem {
  id: NavTab;
  label: string;
  icon: string;
  badge?: number;
  badgeColor?: 'cyan' | 'red';
  requiredPermission?: string;
}

interface NavGroup {
  label: string;
  icon: string;
  items: NavItem[];
  requiredRole?: 'admin' | 'investigator' | 'analyst';
}

const ROLE_COLORS = {
  admin: 'text-red-400 bg-red-500/15 border-red-500/30',
  investigator: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
  analyst: 'text-sky-400 bg-sky-500/15 border-sky-500/30',
};

export const Sidebar: FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewCaseModal,
  evidenceCount,
  alertCount
}) => {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const { session, logout, hasPermission } = useAuth();
  const role = session?.user?.role ?? 'analyst';

  const toggleGroup = (label: string) => {
    setCollapsed(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const allNavGroups: NavGroup[] = [
    {
      label: 'INTELLIGENCE',
      icon: 'psychology',
      items: [
        { id: 'overview',      label: 'Overview',    icon: 'dashboard'   },
        { id: 'alerts',        label: 'Alert Center',icon: 'crisis_alert', badge: alertCount, badgeColor: 'red' },
        { id: 'copilot',       label: 'AI Copilot',  icon: 'smart_toy',   requiredPermission: 'access_copilot' },
      ]
    },
    {
      label: 'EVIDENCE',
      icon: 'inventory_2',
      items: [
        { id: 'evidence',      label: 'Vault',        icon: 'inventory_2', badge: evidenceCount, badgeColor: 'cyan' },
        { id: 'processing',    label: 'Processing',   icon: 'settings_suggest' },
        { id: 'social_media',  label: 'Social Media', icon: 'public',      requiredPermission: 'view_social' },
      ]
    },
    {
      label: 'ANALYSIS',
      icon: 'analytics',
      items: [
        { id: 'graph',         label: 'Link Graph',    icon: 'account_tree', requiredPermission: 'view_graph' },
        { id: 'correlation',   label: 'Correlation',   icon: 'link',         requiredPermission: 'view_correlation' },
        { id: 'map',           label: 'Cell Tower Map',icon: 'map',          requiredPermission: 'view_map' },
        { id: 'timeline',      label: 'Timeline',      icon: 'schedule',     requiredPermission: 'view_timeline' },
        { id: 'finance',       label: 'Finance Flow',  icon: 'payments',     requiredPermission: 'view_finance' },
        { id: 'entity_dna',    label: 'Entity DNA',    icon: 'fingerprint',  requiredPermission: 'view_entity_dna' },
      ]
    },
    {
      label: 'REPORTING',
      icon: 'description',
      items: [
        { id: 'reports',       label: 'Reports',       icon: 'description' },
        { id: 'audit_log',     label: 'Audit Log',     icon: 'history_edu', requiredPermission: 'view_audit_log' },
        { id: 'settings',      label: 'Settings',      icon: 'settings',    requiredPermission: 'access_settings' },
      ]
    },
    {
      label: 'ADMINISTRATION',
      icon: 'admin_panel_settings',
      requiredRole: 'admin',
      items: [
        { id: 'user_management',  label: 'User Management', icon: 'manage_accounts' },
        { id: 'security_center',  label: 'Security Center', icon: 'verified_user' },
        { id: 'access_control',   label: 'Access Control',  icon: 'lock_person' },
      ]
    },
  ];

  // Security Center always visible for admin, also let investigator see it
  // For analysts — security center is locked
  const navGroups = allNavGroups.filter(g => {
    if (g.requiredRole && g.requiredRole !== role) return false;
    return true;
  });

  return (
    <aside className="docked left-0 h-full w-64 border-r border-[#6dedff]/15 bg-[#0e1220]/90 backdrop-blur-xl flex flex-col py-3 z-20 shrink-0 select-none shadow-[4px_0_24px_rgba(0,0,0,0.5)] relative print:hidden">
      {/* Top glow */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#6dedff]/60 to-transparent" />

      {/* Logo */}
      <div className="px-5 mb-5 mt-2">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-[#6dedff]/50 shadow-[0_0_18px_rgba(40,210,230,0.45)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(40,210,230,0.7)] bg-[#070b14] flex items-center justify-center p-0.5 shrink-0">
            <img src="/logo.png" alt="NEXUS Evidence Logo" className="w-full h-full object-contain rounded-lg" />
            <div className="absolute -inset-0.5 rounded-xl bg-[#6dedff]/25 blur-sm -z-10 group-hover:opacity-100 opacity-70 transition-opacity" />
          </div>
          <div>
            <h1 className="font-headline-sm text-[16px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ffffff] via-[#6dedff] to-[#95f1ff] tracking-wider leading-none mb-1">
              NEXUS Evidence
            </h1>
            <p className="font-label-caps text-[10px] text-[#859396] tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#28d2e6] inline-block animate-pulse" />
              FORENSIC INTEL
            </p>
          </div>
        </div>
      </div>

      {/* New Investigation CTA */}
      <div className="px-4 mb-4">
        <button
          onClick={onOpenNewCaseModal}
          className="w-full relative overflow-hidden bg-gradient-to-r from-[#28d2e6] to-[#00a8bd] hover:from-[#36d9ed] hover:to-[#28d2e6] text-[#00363d] py-2.5 px-4 rounded-lg font-label-caps text-[11px] flex items-center justify-center gap-2 font-bold shadow-[0_0_20px_rgba(40,210,230,0.35)] hover:shadow-[0_0_25px_rgba(54,217,237,0.55)] transition-all duration-200 cursor-pointer active:scale-[0.98] group"
        >
          <span className="material-symbols-outlined text-[18px] transition-transform duration-200 group-hover:rotate-90">add</span>
          <span>NEW INVESTIGATION</span>
        </button>
      </div>

      {/* Grouped Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-1">
        {navGroups.map(group => {
          const isOpen = collapsed[group.label] !== true;
          const hasActive = group.items.some(i => i.id === activeTab);
          return (
            <div key={group.label}>
              {/* Group header */}
              <button
                onClick={() => toggleGroup(group.label)}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded transition-colors cursor-pointer group mb-0.5 ${hasActive ? 'text-[#dfe2f4]' : 'text-[#3c494b] hover:text-[#859396]'}`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[14px]">{group.icon}</span>
                  <span className="font-label-caps text-[9px] tracking-widest font-bold">{group.label}</span>
                  {group.requiredRole === 'admin' && (
                    <span className="font-label-caps text-[8px] px-1 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 tracking-wider">ADMIN</span>
                  )}
                </div>
                <span className="material-symbols-outlined text-[14px] transition-transform duration-200" style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
                  expand_more
                </span>
              </button>

              {/* Group items */}
              {isOpen && (
                <div className="space-y-0.5 mb-2">
                  {group.items.map(item => {
                    const isActive = activeTab === item.id;
                    const isLocked = item.requiredPermission ? !hasPermission(item.requiredPermission) : false;
                    const isAlertItem = item.id === 'alerts' && (item.badge ?? 0) > 0;
                    return (
                      <button
                        key={item.id}
                        onClick={() => !isLocked && setActiveTab(item.id)}
                        disabled={isLocked}
                        title={isLocked ? `Requires higher clearance` : undefined}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg transition-all duration-200 text-left group relative ${
                          isLocked
                            ? 'opacity-40 cursor-not-allowed text-[#859396]'
                            : isActive
                              ? 'text-[#6dedff] bg-gradient-to-r from-[#6dedff]/15 to-transparent font-semibold border-l-2 border-[#6dedff] shadow-[inset_0_0_15px_rgba(40,210,230,0.1)] cursor-pointer'
                              : 'text-[#859396] hover:text-[#dfe2f4] hover:bg-[#1f263c]/60 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`material-symbols-outlined text-[19px] transition-transform duration-200 ${!isLocked && 'group-hover:scale-110'} ${
                              isAlertItem ? 'text-red-400 animate-pulse' :
                              isActive ? 'text-[#6dedff]' : 'text-[#859396] group-hover:text-[#6dedff]'
                            }`}
                            style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                          >
                            {item.icon}
                          </span>
                          <span className="font-label-caps text-[11px] tracking-wider font-medium">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {isLocked && (
                            <span className="material-symbols-outlined text-[13px] text-[#859396]">lock</span>
                          )}
                          {!isLocked && item.badge !== undefined && item.badge > 0 && (
                            <span className={`px-2 py-0.5 rounded-full font-code-sm text-[10px] font-bold border transition-colors ${
                              item.badgeColor === 'red'
                                ? isActive
                                  ? 'bg-red-500/25 text-red-300 border-red-500/50 shadow-[0_0_8px_rgba(239,68,68,0.4)]'
                                  : 'bg-red-500/15 text-red-400 border-red-500/30 group-hover:text-red-300'
                                : isActive
                                  ? 'bg-[#28d2e6]/20 text-[#6dedff] border-[#28d2e6]/50 shadow-[0_0_8px_rgba(40,210,230,0.3)]'
                                  : 'bg-[#1b2032] text-[#859396] border-[#3c494b]/30 group-hover:text-[#dfe2f4]'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User Footer */}
      {session && (
        <div className="px-4 pt-3 mt-2 border-t border-[#3c494b]/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="relative flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-code-sm text-[11px] text-[#dfe2f4] font-medium truncate">{session.user.displayName}</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`font-label-caps text-[8px] px-1.5 py-0.5 rounded-full border ${ROLE_COLORS[role]} tracking-wider font-bold`}>
                  {role.toUpperCase()}
                </span>
              </div>
            </div>
            <button
              id="logout-btn"
              onClick={logout}
              title="Logout"
              className="w-7 h-7 flex items-center justify-center rounded-lg text-[#859396] hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
            </button>
          </div>
          <span className="font-code-sm text-[10px] text-[#859396]">Sec-65B Enforced • v3.0.0</span>
        </div>
      )}
    </aside>
  );
};
