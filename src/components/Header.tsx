import type { FC } from 'react';
import { useAuth } from '../context/AuthContext';
import type { NavTab } from './Sidebar';

interface HeaderProps {
  currentCaseId: string;
  onSelectCase: (caseId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTabLabel: string;
  activeTab?: NavTab;
  onNavigateTab?: (tab: NavTab) => void;
}

export const Header: FC<HeaderProps> = ({
  currentCaseId,
  onSelectCase,
  searchQuery,
  setSearchQuery,
  activeTabLabel,
  activeTab,
  onNavigateTab
}) => {
  const { session, logout } = useAuth();

  const handleNav = (tab: NavTab) => {
    if (onNavigateTab) {
      onNavigateTab(tab);
    }
  };

  const quickButtons: { id: NavTab; title: string; icon: string }[] = [
    { id: 'evidence',    title: 'Evidence Vault', icon: 'folder' },
    { id: 'timeline',    title: 'Timeline Events', icon: 'event' },
    { id: 'entity_dna',  title: 'Suspect DNA Profiles', icon: 'group' },
    { id: 'graph',       title: 'Link Graph Topology', icon: 'hub' },
    { id: 'correlation', title: 'Cross-Domain Correlation Insights', icon: 'search_insights' },
  ];

  return (
    <header className="flex justify-between items-center w-full px-6 h-16 bg-[#0f1322]/85 backdrop-blur-xl border-b border-[#6dedff]/15 relative z-10 shrink-0 select-none shadow-[0_4px_20px_rgba(0,0,0,0.4)] print:hidden">
      {/* Bottom glowing line accent */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#6dedff]/30 to-transparent"></div>

      {/* Left: Case Selector & Breadcrumb */}
      <div className="flex items-center gap-4">
        <div className="relative flex items-center">
          <select
            value={currentCaseId}
            onChange={(e) => onSelectCase(e.target.value)}
            className="bg-[#181d2f] border border-[#6dedff]/30 text-[#6dedff] font-headline-sm text-[14px] font-bold rounded-lg px-3 py-1.5 pr-8 focus:outline-none focus:border-[#6dedff] focus:ring-1 focus:ring-[#6dedff]/50 cursor-pointer shadow-[0_0_12px_rgba(40,210,230,0.15)] transition-all hover:bg-[#21273d]"
          >
            <option value="PN-2026-001">PN-2026-001 (Op Shadow)</option>
            <option value="PN-2026-002">PN-2026-002 (Cyber Syndicate)</option>
            <option value="PN-2026-003">PN-2026-003 (Hawala Network)</option>
          </select>
        </div>

        <div className="h-4 w-[1px] bg-[#6dedff]/20"></div>

        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6dedff]"></span>
          <span className="font-label-caps text-[12px] text-[#dfe2f4] tracking-wider font-semibold">
            {activeTabLabel}
          </span>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="flex-1 max-w-md mx-6">
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#859396] group-focus-within:text-[#6dedff] transition-colors text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search CDR, VPAs, IMEI, Suspect names..."
            className="w-full bg-[#131726]/90 border border-[#3c494b]/40 text-[#dfe2f4] rounded-lg pl-9 pr-14 py-1.5 font-body-sm text-[13px] focus:outline-none focus:border-[#6dedff] focus:ring-1 focus:ring-[#6dedff]/40 transition-all placeholder:text-[#859396]/70 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#859396] hover:text-[#dfe2f4] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          ) : (
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-[#21273d] text-[#859396] font-code-sm text-[10px] border border-[#3c494b]/40">
              ⌘K
            </kbd>
          )}
        </div>
      </div>

      {/* Right: Tools & Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Access Badges */}
        <div className="flex items-center gap-1 bg-[#131726]/60 p-1 rounded-lg border border-[#3c494b]/20">
          {quickButtons.map((btn) => {
            const isActive = activeTab === btn.id;
            return (
              <button
                key={btn.id}
                onClick={() => handleNav(btn.id)}
                className={`w-8 h-8 flex items-center justify-center rounded-md transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#6dedff]/20 text-[#6dedff] border border-[#6dedff]/40 shadow-[0_0_8px_rgba(109,237,255,0.3)]'
                    : 'text-[#859396] hover:text-[#6dedff] hover:bg-[#21273d]'
                }`}
                title={btn.title}
              >
                <span className="material-symbols-outlined text-[18px]">{btn.icon}</span>
              </button>
            );
          })}
        </div>

        <div className="w-px h-6 bg-[#3c494b]/40 mx-0.5"></div>

        {/* Analyst Info */}
        <div
          onClick={logout}
          title="Click to logout"
          className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-[#181d2f]/80 hover:bg-red-500/10 border border-[#3c494b]/40 hover:border-red-500/40 transition-all cursor-pointer group shrink-0 shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
        >
          <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-[#6dedff]/40 group-hover:border-red-400/50 transition-colors shrink-0 shadow-[0_0_10px_rgba(40,210,230,0.2)] bg-gradient-to-br from-[#28d2e6]/20 to-[#6620bd]/25 flex items-center justify-center">
            <span className="material-symbols-outlined text-[#6dedff] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
          </div>
          <div className="flex flex-col text-left justify-center whitespace-nowrap min-w-0">
            <span className="font-body-sm text-[12px] font-semibold text-[#dfe2f4] group-hover:text-red-300 transition-colors leading-tight whitespace-nowrap">
              {session?.user.displayName ?? 'Unknown'}
            </span>
            <span className="font-label-caps text-[9px] text-[#28d2e6] tracking-wider font-semibold whitespace-nowrap mt-0.5">
              {session?.user.department ?? ''}
            </span>
          </div>
          <span className="material-symbols-outlined text-[16px] text-[#859396] group-hover:text-red-400 transition-colors ml-1 shrink-0">logout</span>
        </div>
      </div>
    </header>
  );
};
