import React from 'react';

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
  | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenNewCaseModal: () => void;
  evidenceCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewCaseModal,
  evidenceCount
}) => {
  const navItems: { id: NavTab; label: string; icon: string; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'evidence', label: 'Evidence', icon: 'inventory_2', badge: evidenceCount },
    { id: 'processing', label: 'Processing', icon: 'settings_suggest' },
    { id: 'graph', label: 'Graph', icon: 'account_tree' },
    { id: 'map', label: 'Map', icon: 'map' },
    { id: 'timeline', label: 'Timeline', icon: 'schedule' },
    { id: 'finance', label: 'Finance', icon: 'payments' },
    { id: 'entity_dna', label: 'Entity DNA', icon: 'fingerprint' },
    { id: 'copilot', label: 'Copilot', icon: 'smart_toy' },
    { id: 'reports', label: 'Reports', icon: 'description' },
    { id: 'audit_log', label: 'Audit Log', icon: 'history_edu' },
    { id: 'settings', label: 'Settings', icon: 'settings' }
  ];

  return (
    <aside className="docked left-0 h-full w-64 border-r border-[#3c494b]/20 bg-[#1b1f2c] flex flex-col py-3 z-20 shrink-0">
      {/* Header */}
      <div className="px-6 mb-6 mt-2">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded bg-[#28d2e6]/20 flex items-center justify-center border border-[#28d2e6]/30 shrink-0">
            <span className="material-symbols-outlined text-[#6dedff]" style={{ fontVariationSettings: "'FILL' 1" }}>
              shield
            </span>
          </div>
          <div>
            <h1 className="font-headline-sm text-headline-sm font-bold text-[#6dedff] tracking-tight">POLICE NEXUS</h1>
            <p className="font-label-caps text-label-caps text-[#859396]">Forensic Intelligence</p>
          </div>
        </div>
      </div>

      {/* New Investigation CTA */}
      <div className="px-4 mb-5">
        <button 
          onClick={onOpenNewCaseModal}
          className="w-full bg-[#28d2e6] text-[#005660] hover:brightness-110 transition-all duration-200 py-2.5 px-4 rounded font-label-caps text-label-caps flex items-center justify-center gap-2 font-bold shadow-[0_0_12px_rgba(40,210,230,0.25)] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Investigation
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded transition-all duration-150 cursor-pointer text-left ${
                isActive
                  ? 'text-[#6dedff] bg-[#6dedff]/10 border-r-2 border-[#6dedff] shadow-[0_0_15px_rgba(40,210,230,0.15)] font-semibold'
                  : 'text-[#859396] hover:text-[#dfe2f4] hover:bg-[#303442]/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span 
                  className="material-symbols-outlined text-[20px]" 
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <span className="font-label-caps text-label-caps tracking-wider">{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-[#303442] text-[#6dedff] font-code-sm text-[10px] font-bold border border-[#3c494b]/40">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Analyst Footer */}
      <div className="px-4 pt-3 mt-auto border-t border-[#3c494b]/20 flex items-center gap-3 text-[#859396]">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
        <span className="font-code-sm text-[11px] truncate">System: Operational • v2.4.0</span>
      </div>
    </aside>
  );
};
