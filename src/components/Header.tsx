import React from 'react';

interface HeaderProps {
  currentCaseId: string;
  onSelectCase: (caseId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTabLabel: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentCaseId,
  onSelectCase,
  searchQuery,
  setSearchQuery,
  activeTabLabel
}) => {
  return (
    <header className="flex justify-between items-center w-full px-6 h-16 bg-[#171b28] border-b border-[#3c494b]/20 backdrop-blur-md top-0 z-10 shrink-0">
      {/* Left: Case Selector & Breadcrumb */}
      <div className="flex items-center gap-4">
        <select
          value={currentCaseId}
          onChange={(e) => onSelectCase(e.target.value)}
          className="bg-[#1b1f2c] border border-[#3c494b]/40 text-[#6dedff] font-headline-sm text-headline-sm font-bold rounded px-3 py-1 focus:outline-none focus:border-[#6dedff] cursor-pointer"
        >
          <option value="PN-2026-001">PN-2026-001 (Op Shadow)</option>
          <option value="PN-2026-002">PN-2026-002 (Cyber Syndicate)</option>
          <option value="PN-2026-003">PN-2026-003 (Hawala Network)</option>
        </select>

        <div className="h-4 w-[1px] bg-[#3c494b]/40"></div>

        <span className="font-label-caps text-label-caps text-[#bbc9cc]">
          {activeTabLabel}
        </span>
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
            placeholder="Global search across CDR, VPAs, IMEI, Suspects..."
            className="w-full bg-[#1b1f2c] border border-[#3c494b]/30 text-[#dfe2f4] rounded pl-9 pr-4 py-1.5 font-body-sm text-body-sm focus:outline-none focus:border-[#6dedff] focus:ring-1 focus:ring-[#6dedff]/40 transition-all placeholder:text-[#859396]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#859396] hover:text-[#dfe2f4]"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Right: Tools & Profile */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 flex items-center justify-center rounded text-[#859396] hover:text-[#6dedff] hover:bg-[#303442]/50 transition-all cursor-pointer" title="Evidence Vault">
            <span className="material-symbols-outlined text-[20px]">folder</span>
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded text-[#859396] hover:text-[#6dedff] hover:bg-[#303442]/50 transition-all cursor-pointer" title="Timeline Events">
            <span className="material-symbols-outlined text-[20px]">event</span>
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded text-[#859396] hover:text-[#6dedff] hover:bg-[#303442]/50 transition-all cursor-pointer" title="Suspect Network">
            <span className="material-symbols-outlined text-[20px]">group</span>
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded text-[#859396] hover:text-[#6dedff] hover:bg-[#303442]/50 transition-all cursor-pointer" title="Entity Topology">
            <span className="material-symbols-outlined text-[20px]">hub</span>
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded text-[#859396] hover:text-[#6dedff] hover:bg-[#303442]/50 transition-all cursor-pointer" title="Forensic Insights">
            <span className="material-symbols-outlined text-[20px]">search_insights</span>
          </button>
        </div>

        <div className="w-px h-6 bg-[#3c494b]/40 mx-1"></div>

        {/* Analyst Info */}
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="w-8 h-8 rounded overflow-hidden border border-[#3c494b]/40 group-hover:border-[#6dedff] transition-colors shrink-0">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Analyst Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="font-body-sm text-[12px] font-semibold text-[#dfe2f4] group-hover:text-[#6dedff] transition-colors leading-tight">Insp. R. S. Gill</span>
            <span className="font-label-caps text-[9px] text-[#859396]">Cyber Crime Cell</span>
          </div>
        </div>
      </div>
    </header>
  );
};
