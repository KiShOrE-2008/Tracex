import React from 'react';

interface OverviewViewProps {
  onNavigateTab: (tab: any) => void;
  fileCount: number;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigateTab, fileCount }) => {
  return (
    <div className="space-y-6">
      {/* Case Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 glass-panel p-6 rounded-lg">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="font-code-sm text-code-sm text-[#859396] tracking-widest">PN-2026-001</span>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#6dedff]/10 text-[#6dedff] border border-[#6dedff]/20 font-label-caps text-label-caps">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6dedff] animate-pulse shadow-[0_0_8px_rgba(109,237,255,0.8)]"></span>
              ANALYSIS READY
            </div>
            <span className="text-[#859396] font-code-sm text-[12px]">Last updated: 10 mins ago</span>
          </div>
          <h2 className="font-display-lg text-display-lg text-[#dfe2f4]">Operation Shadow</h2>
          <p className="font-body-sm text-body-sm text-[#bbc9cc] mt-1 max-w-2xl">
            Multi-jurisdictional investigation targeting illicit financial flows, cyber extortion, and coordinated logistics networks across Chandigarh, Mohali, and Panchkula. Data ingestion & link resolution complete.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button 
            onClick={() => onNavigateTab('reports')}
            className="px-4 py-2 rounded border border-[#3c494b]/40 text-[#859396] hover:text-[#dfe2f4] hover:bg-[#303442]/50 transition-all font-label-caps text-label-caps flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">share</span>
            Share Access
          </button>
          <button 
            onClick={() => onNavigateTab('reports')}
            className="px-4 py-2 rounded bg-[#6dedff] text-[#00363d] hover:brightness-110 transition-all font-label-caps text-label-caps flex items-center gap-2 font-bold shadow-[0_0_15px_rgba(109,237,255,0.25)] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">analytics</span>
            Generate Report
          </button>
        </div>
      </div>

      {/* Bento Grid: 5 Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {/* Card 1 */}
        <div 
          onClick={() => onNavigateTab('evidence')}
          className="glass-panel p-4 rounded flex flex-col gap-2 hover:border-[#6dedff]/50 transition-colors group cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <span className="material-symbols-outlined text-[#859396] group-hover:text-[#6dedff] transition-colors">folder_open</span>
            <span className="font-label-caps text-label-caps text-[#859396]">Ingested</span>
          </div>
          <div>
            <div className="font-headline-md text-headline-md text-[#dfe2f4]">{fileCount}</div>
            <div className="font-label-caps text-label-caps text-[#bbc9cc] mt-1">Source Files</div>
          </div>
        </div>

        {/* Card 2 */}
        <div 
          onClick={() => onNavigateTab('timeline')}
          className="glass-panel p-4 rounded flex flex-col gap-2 hover:border-[#6dedff]/50 transition-colors group cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <span className="material-symbols-outlined text-[#859396] group-hover:text-[#6dedff] transition-colors">event_note</span>
            <span className="font-label-caps text-label-caps text-[#6dedff]">+12% new</span>
          </div>
          <div>
            <div className="font-headline-md text-headline-md text-[#dfe2f4]">8,294</div>
            <div className="font-label-caps text-label-caps text-[#bbc9cc] mt-1">Timeline Events</div>
          </div>
        </div>

        {/* Card 3 */}
        <div 
          onClick={() => onNavigateTab('entity_dna')}
          className="glass-panel p-4 rounded flex flex-col gap-2 hover:border-[#6dedff]/50 transition-colors group cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <span className="material-symbols-outlined text-[#859396] group-hover:text-[#6dedff] transition-colors">person_search</span>
            <span className="font-label-caps text-label-caps text-[#859396]">Resolved</span>
          </div>
          <div>
            <div className="font-headline-md text-headline-md text-[#dfe2f4]">147</div>
            <div className="font-label-caps text-label-caps text-[#bbc9cc] mt-1">Unique Entities</div>
          </div>
        </div>

        {/* Card 4 */}
        <div 
          onClick={() => onNavigateTab('graph')}
          className="glass-panel p-4 rounded flex flex-col gap-2 hover:border-[#6dedff]/50 transition-colors group cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <span className="material-symbols-outlined text-[#859396] group-hover:text-[#6dedff] transition-colors">hub</span>
            <span className="font-label-caps text-label-caps text-[#859396]">Connected</span>
          </div>
          <div>
            <div className="font-headline-md text-headline-md text-[#dfe2f4]">426</div>
            <div className="font-label-caps text-label-caps text-[#bbc9cc] mt-1">Relationships</div>
          </div>
        </div>

        {/* Card 5 (Priority Findings) */}
        <div 
          onClick={() => onNavigateTab('copilot')}
          className="gradient-border-card p-4 flex flex-col gap-2 group cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <span className="material-symbols-outlined text-[#6dedff] group-hover:text-[#e7d3ff] transition-colors" style={{ fontVariationSettings: "'FILL' 1" }}>
              warning
            </span>
            <div className="w-2.5 h-2.5 rounded-full bg-[#6dedff] animate-ping"></div>
          </div>
          <div>
            <div className="font-headline-md text-headline-md text-[#6dedff]">12</div>
            <div className="font-label-caps text-label-caps text-[#6dedff] mt-1">Priority Findings</div>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Pipeline Stepper & Findings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Processing Pipeline */}
        <div className="glass-panel rounded-lg p-6 flex flex-col">
          <h3 className="font-title-lg text-title-lg text-[#dfe2f4] mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#859396] text-[20px]">memory</span>
            Processing Pipeline
          </h3>

          <div className="relative flex-1 pl-4 border-l border-[#3c494b]/40 ml-2 space-y-6">
            {/* Step 1 */}
            <div className="relative">
              <div className="absolute -left-[21px] top-1 w-6 h-6 rounded-full bg-[#1b1f2c] border border-[#6dedff] text-[#6dedff] flex items-center justify-center">
                <span className="material-symbols-outlined text-[14px]">check</span>
              </div>
              <h4 className="font-label-caps text-label-caps text-[#dfe2f4]">Data Extraction</h4>
              <p className="font-code-sm text-code-sm text-[#859396] mt-1">100% Complete • 60.6 MB</p>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="absolute -left-[21px] top-1 w-6 h-6 rounded-full bg-[#1b1f2c] border border-[#6dedff] text-[#6dedff] flex items-center justify-center">
                <span className="material-symbols-outlined text-[14px]">check</span>
              </div>
              <h4 className="font-label-caps text-label-caps text-[#dfe2f4]">OCR & Transcription</h4>
              <p className="font-code-sm text-code-sm text-[#859396] mt-1">100% Complete • 1,280 OCR pages</p>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="absolute -left-[21px] top-1 w-6 h-6 rounded-full bg-[#1b1f2c] border border-[#6dedff] text-[#6dedff] flex items-center justify-center">
                <span className="material-symbols-outlined text-[14px]">check</span>
              </div>
              <h4 className="font-label-caps text-label-caps text-[#dfe2f4]">Entity Extraction</h4>
              <p className="font-code-sm text-code-sm text-[#859396] mt-1">147 Entities mapped across 6 files</p>
            </div>

            {/* Step 4 */}
            <div className="relative">
              <div className="absolute -left-[21px] top-1 w-6 h-6 rounded-full bg-[#1b1f2c] border border-[#6dedff] text-[#6dedff] flex items-center justify-center">
                <span className="material-symbols-outlined text-[14px]">check</span>
              </div>
              <h4 className="font-label-caps text-label-caps text-[#dfe2f4]">Graph Topology Indexing</h4>
              <p className="font-code-sm text-code-sm text-[#859396] mt-1">426 Edges indexed with weight metrics</p>
            </div>

            {/* Step 5 */}
            <div className="relative">
              <div className="absolute -left-[21px] top-1 w-6 h-6 rounded-full bg-[#1b1f2c] border border-[#36d9ed] text-[#36d9ed] flex items-center justify-center animate-pulse">
                <span className="material-symbols-outlined text-[14px]">sync</span>
              </div>
              <h4 className="font-label-caps text-label-caps text-[#36d9ed]">Geo-Resolution & Tower Match</h4>
              <p className="font-code-sm text-code-sm text-[#859396] mt-1">Refining sector azimuth pings...</p>
            </div>
          </div>
        </div>

        {/* Right Column: Key Priority Findings */}
        <div className="glass-panel rounded-lg p-6 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-title-lg text-title-lg text-[#dfe2f4] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ffb4ab] text-[20px]">radar</span>
                Priority Findings & Anomalies
              </h3>
              <span className="px-2 py-0.5 rounded bg-[#93000a]/20 text-[#ffb4ab] border border-[#93000a]/40 font-label-caps text-[10px]">
                HIGH RISK DETECTED
              </span>
            </div>

            <div className="space-y-3">
              {/* Finding 1 */}
              <div className="p-3.5 rounded bg-[#171b28] border border-[#3c494b]/30 hover:border-[#6dedff]/40 transition-colors flex items-start gap-3">
                <div className="p-2 rounded bg-amber-500/10 text-amber-400 shrink-0">
                  <span className="material-symbols-outlined text-[20px]">cell_tower</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-body-md text-body-md font-semibold text-[#dfe2f4]">
                      Co-Location Match: Cell Site #4301 (Sector 43 ISBT)
                    </h4>
                    <span className="font-code-sm text-[11px] text-[#859396]">02:14 AM</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-[#bbc9cc] mt-0.5">
                    Target A (<span className="text-[#6dedff]">+91 98765 43210</span>) and Target B (<span className="text-[#6dedff]">+91 91234 56789</span>) locked onto Sector 43 ISBT tower within 120m radius for 15 mins. Direct call followed immediately.
                  </p>
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => onNavigateTab('map')} className="text-[#6dedff] hover:underline font-label-caps text-[10px] flex items-center gap-1">
                      View on Map <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Finding 2 */}
              <div className="p-3.5 rounded bg-[#171b28] border border-[#3c494b]/30 hover:border-[#6dedff]/40 transition-colors flex items-start gap-3">
                <div className="p-2 rounded bg-purple-500/10 text-purple-400 shrink-0">
                  <span className="material-symbols-outlined text-[20px]">currency_exchange</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-body-md text-body-md font-semibold text-[#dfe2f4]">
                      Round-Trip Shell Account Wiring (Apex Trading)
                    </h4>
                    <span className="font-code-sm text-[11px] text-[#859396]">Rs. 25,00,000</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-[#bbc9cc] mt-0.5">
                    42 victim UPI micro-deposits totaling Rs. 4,11,600 consolidated into HDFC ...8921 and immediately wired to offshore entity Apex Trading UAE via RTGS.
                  </p>
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => onNavigateTab('finance')} className="text-[#6dedff] hover:underline font-label-caps text-[10px] flex items-center gap-1">
                      Trace Money Flow <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Finding 3 */}
              <div className="p-3.5 rounded bg-[#171b28] border border-[#3c494b]/30 hover:border-[#6dedff]/40 transition-colors flex items-start gap-3">
                <div className="p-2 rounded bg-cyan-500/10 text-cyan-400 shrink-0">
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-body-md text-body-md font-semibold text-[#dfe2f4]">
                      UFED Decrypted WhatsApp Directive
                    </h4>
                    <span className="font-code-sm text-[11px] text-[#859396]">10:30 AM</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-[#bbc9cc] mt-0.5">
                    Decrypted chat from Master V: <span className="italic text-[#dfe2f4]">"Clear the cash box before 4 PM. Transfer 10L to Mohali drop point."</span>
                  </p>
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => onNavigateTab('copilot')} className="text-[#6dedff] hover:underline font-label-caps text-[10px] flex items-center gap-1">
                      Query AI Copilot <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Navigation Bar */}
          <div className="mt-6 pt-4 border-t border-[#3c494b]/20 flex flex-wrap items-center justify-between gap-3">
            <span className="font-label-caps text-label-caps text-[#859396]">Quick Actions:</span>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => onNavigateTab('evidence')} 
                className="px-3 py-1.5 rounded bg-[#303442] hover:bg-[#353946] text-[#dfe2f4] font-label-caps text-[11px] flex items-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[15px]">upload_file</span> Ingest Files
              </button>
              <button 
                onClick={() => onNavigateTab('graph')} 
                className="px-3 py-1.5 rounded bg-[#303442] hover:bg-[#353946] text-[#dfe2f4] font-label-caps text-[11px] flex items-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[15px]">account_tree</span> Open Link Graph
              </button>
              <button 
                onClick={() => onNavigateTab('map')} 
                className="px-3 py-1.5 rounded bg-[#303442] hover:bg-[#353946] text-[#dfe2f4] font-label-caps text-[11px] flex items-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[15px]">map</span> Cell Tower Map
              </button>
              <button 
                onClick={() => onNavigateTab('copilot')} 
                className="px-3 py-1.5 rounded bg-[#28d2e6]/20 border border-[#28d2e6]/40 text-[#6dedff] font-label-caps text-[11px] flex items-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[15px]">smart_toy</span> Ask Copilot AI
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
