import { useState } from 'react';
import type { FC } from 'react';

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
  | 'social_media';

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
}

interface NavGroup {
  label: string;
  icon: string;
  items: NavItem[];
}

export const Sidebar: FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewCaseModal,
  evidenceCount,
  alertCount
}) => {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleGroup = (label: string) => {
    setCollapsed(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const navGroups: NavGroup[] = [
    {
      label: 'INTELLIGENCE',
      icon: 'psychology',
      items: [
        { id: 'overview',      label: 'Overview',    icon: 'dashboard'   },
        { id: 'alerts',        label: 'Alert Center',icon: 'crisis_alert',badge: alertCount, badgeColor: 'red' },
        { id: 'copilot',       label: 'AI Copilot',  icon: 'smart_toy'   },
      ]
    },
    {
      label: 'EVIDENCE',
      icon: 'inventory_2',
      items: [
        { id: 'evidence',      label: 'Vault',        icon: 'inventory_2', badge: evidenceCount, badgeColor: 'cyan' },
        { id: 'processing',    label: 'Processing',   icon: 'settings_suggest' },
        { id: 'social_media',  label: 'Social Media', icon: 'public'      },
      ]
    },
    {
      label: 'ANALYSIS',
      icon: 'analytics',
      items: [
        { id: 'graph',         label: 'Link Graph',   icon: 'account_tree' },
        { id: 'correlation',   label: 'Correlation',  icon: 'link'         },
        { id: 'map',           label: 'Cell Tower Map',icon: 'map'         },
        { id: 'timeline',      label: 'Timeline',     icon: 'schedule'    },
        { id: 'finance',       label: 'Finance Flow', icon: 'payments'    },
        { id: 'entity_dna',    label: 'Entity DNA',   icon: 'fingerprint' },
      ]
    },
    {
      label: 'REPORTING',
      icon: 'description',
      items: [
        { id: 'reports',       label: 'Reports',      icon: 'description' },
        { id: 'audit_log',     label: 'Audit Log',    icon: 'history_edu' },
        { id: 'settings',      label: 'Settings',     icon: 'settings'    },
      ]
    },
  ];

  return (
    <aside className="docked left-0 h-full w-64 border-r border-[#6dedff]/15 bg-[#0e1220]/90 backdrop-blur-xl flex flex-col py-3 z-20 shrink-0 select-none shadow-[4px_0_24px_rgba(0,0,0,0.5)] relative print:hidden">
      {/* Top glow */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#6dedff]/60 to-transparent" />

      {/* Logo */}
      <div className="px-5 mb-5 mt-2">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-[#28d2e6]/25 to-[#6620bd]/30 flex items-center justify-center border border-[#6dedff]/40 shadow-[0_0_15px_rgba(40,210,230,0.25)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_22px_rgba(40,210,230,0.45)]">
            <span className="material-symbols-outlined text-[#6dedff] text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
            <div className="absolute -inset-0.5 rounded-lg bg-[#6dedff]/20 blur-sm -z-10 group-hover:opacity-100 opacity-60 transition-opacity" />
          </div>
          <div>
            <h1 className="font-headline-sm text-[17px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ffffff] via-[#6dedff] to-[#95f1ff] tracking-wider leading-none mb-1">
              POLICE NEXUS
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
                    const isAlertItem = item.id === 'alerts' && (item.badge ?? 0) > 0;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg transition-all duration-200 cursor-pointer text-left group relative ${
                          isActive
                            ? 'text-[#6dedff] bg-gradient-to-r from-[#6dedff]/15 to-transparent font-semibold border-l-2 border-[#6dedff] shadow-[inset_0_0_15px_rgba(40,210,230,0.1)]'
                            : 'text-[#859396] hover:text-[#dfe2f4] hover:bg-[#1f263c]/60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`material-symbols-outlined text-[19px] transition-transform duration-200 group-hover:scale-110 ${
                              isAlertItem ? 'text-red-400 animate-pulse' :
                              isActive ? 'text-[#6dedff]' : 'text-[#859396] group-hover:text-[#6dedff]'
                            }`}
                            style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                          >
                            {item.icon}
                          </span>
                          <span className="font-label-caps text-[11px] tracking-wider font-medium">{item.label}</span>
                        </div>
                        {item.badge !== undefined && item.badge > 0 && (
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
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Analyst Footer */}
      <div className="px-4 pt-3 mt-auto border-t border-[#3c494b]/20 flex items-center gap-3 text-[#859396]">
        <div className="relative flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-code-sm text-[11px] text-[#dfe2f4] font-medium truncate">Node: CHANDIGARH-HQ</span>
          <span className="font-code-sm text-[10px] text-[#859396] truncate">Sec-65B Enforced • v3.0.0</span>
        </div>
      </div>
    </aside>
  );
};
