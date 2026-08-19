import type { FC } from 'react';
import { MOCK_ALERTS } from '../data/mockForensicData';

interface OverviewViewProps {
  onNavigateTab: (tab: any) => void;
  fileCount: number;
  alertCount?: number;
}

export const OverviewView: FC<OverviewViewProps> = ({ onNavigateTab, fileCount, alertCount = 0 }) => {
  const recentAlerts = MOCK_ALERTS.filter(a => !a.isDismissed).slice(0, 3);
  const SEVERITY_COLORS: Record<string, string> = {
    CRITICAL: 'text-red-300 bg-red-500/15 border-red-500/40',
    HIGH:     'text-orange-300 bg-orange-500/15 border-orange-500/40',
    MEDIUM:   'text-amber-300 bg-amber-500/15 border-amber-500/30',
    LOW:      'text-sky-300 bg-sky-500/15 border-sky-500/30',
  };
  return (
    <div className="space-y-6">
      {/* Case Header Banner */}
      <div className="relative overflow-hidden glass-panel p-6 rounded-xl border border-[#6dedff]/25 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#6dedff] to-transparent"></div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="font-code-sm text-[12px] text-[#6dedff] tracking-widest px-2 py-0.5 rounded bg-[#6dedff]/10 border border-[#6dedff]/30 font-semibold">
                PN-2026-001
              </span>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-label-caps text-[10px] font-bold shadow-[0_0_10px_rgba(52,211,153,0.2)]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                CHAIN OF CUSTODY VERIFIED
              </div>
              <span className="text-[#859396] font-code-sm text-[11px] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">schedule</span> 10 mins ago
              </span>
            </div>
            <h2 className="font-display-lg text-[28px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#ffffff] via-[#dfe2f4] to-[#6dedff] tracking-tight">
              Operation Shadow
            </h2>
            <p className="font-body-sm text-[13px] text-[#bbc9cc] mt-1 max-w-3xl leading-relaxed">
              Multi-jurisdictional investigation targeting illicit financial flows, cyber extortion, and coordinated logistics networks across Chandigarh, Mohali, and Panchkula. Data ingestion & link resolution complete.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button 
              onClick={() => onNavigateTab('reports')}
              className="px-4 py-2 rounded-lg border border-[#3c494b]/50 text-[#dfe2f4] hover:text-[#6dedff] hover:bg-[#21273d] hover:border-[#6dedff]/40 transition-all font-label-caps text-[11px] flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
              Share Case
            </button>
            <button 
              onClick={() => onNavigateTab('reports')}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#6dedff] to-[#28d2e6] text-[#00363d] hover:from-[#95f1ff] hover:to-[#6dedff] transition-all font-label-caps text-[11px] flex items-center gap-2 font-bold shadow-[0_0_20px_rgba(109,237,255,0.4)] hover:shadow-[0_0_25px_rgba(109,237,255,0.6)] cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">analytics</span>
              Generate Sec 65B Report
            </button>
          </div>
        </div>
      </div>

      {/* Bento Grid: 6 Interactive Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {/* Card 1 */}
        <div 
          onClick={() => onNavigateTab('evidence')}
          className="glass-panel-interactive p-4 rounded-xl flex flex-col justify-between group cursor-pointer relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <div className="w-8 h-8 rounded-lg bg-[#28d2e6]/10 border border-[#28d2e6]/30 flex items-center justify-center text-[#6dedff] group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[18px]">folder_open</span>
            </div>
            <span className="font-label-caps text-[9px] text-[#859396] font-bold">INGESTED</span>
          </div>
          <div className="mt-3">
            <div className="font-headline-md text-[26px] font-bold text-[#dfe2f4] group-hover:text-[#6dedff] transition-colors">{fileCount}</div>
            <div className="font-label-caps text-[10px] text-[#bbc9cc] mt-0.5">Source Files</div>
          </div>
        </div>

        {/* Card 2 */}
        <div 
          onClick={() => onNavigateTab('timeline')}
          className="glass-panel-interactive p-4 rounded-xl flex flex-col justify-between group cursor-pointer relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[18px]">event_note</span>
            </div>
            <span className="font-label-caps text-[9px] text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">+12% new</span>
          </div>
          <div className="mt-3">
            <div className="font-headline-md text-[26px] font-bold text-[#dfe2f4] group-hover:text-emerald-400 transition-colors">8,294</div>
            <div className="font-label-caps text-[10px] text-[#bbc9cc] mt-0.5">Timeline Events</div>
          </div>
        </div>

        {/* Card 3 */}
        <div 
          onClick={() => onNavigateTab('entity_dna')}
          className="glass-panel-interactive p-4 rounded-xl flex flex-col justify-between group cursor-pointer relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[18px]">person_search</span>
            </div>
            <span className="font-label-caps text-[9px] text-[#859396] font-bold">RESOLVED</span>
          </div>
          <div className="mt-3">
            <div className="font-headline-md text-[26px] font-bold text-[#dfe2f4] group-hover:text-purple-400 transition-colors">147</div>
            <div className="font-label-caps text-[10px] text-[#bbc9cc] mt-0.5">Unique Entities</div>
          </div>
        </div>

        {/* Card 4 */}
        <div 
          onClick={() => onNavigateTab('graph')}
          className="glass-panel-interactive p-4 rounded-xl flex flex-col justify-between group cursor-pointer relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <div className="w-8 h-8 rounded-lg bg-[#6620bd]/20 border border-[#6620bd]/40 flex items-center justify-center text-[#d0b1ff] group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[18px]">hub</span>
            </div>
            <span className="font-label-caps text-[9px] text-[#859396] font-bold">GRAPH</span>
          </div>
          <div className="mt-3">
            <div className="font-headline-md text-[26px] font-bold text-[#dfe2f4] group-hover:text-[#d0b1ff] transition-colors">426</div>
            <div className="font-label-caps text-[10px] text-[#bbc9cc] mt-0.5 font-medium">Relationships</div>
          </div>
        </div>

        {/* Card 5 (Priority Findings) */}
        <div 
          onClick={() => onNavigateTab('copilot')}
          className="gradient-border-card p-4 rounded-xl flex flex-col justify-between group cursor-pointer shadow-[0_0_20px_rgba(109,237,255,0.15)] hover:shadow-[0_0_25px_rgba(109,237,255,0.3)] transition-all"
        >
          <div className="flex justify-between items-start">
            <div className="w-8 h-8 rounded-lg bg-[#6dedff]/20 border border-[#6dedff]/50 flex items-center justify-center text-[#6dedff] group-hover:rotate-12 transition-transform">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#6dedff] animate-ping" />
          </div>
          <div className="mt-3">
            <div className="font-headline-md text-[26px] font-bold text-[#6dedff]">12</div>
            <div className="font-label-caps text-[10px] text-[#6dedff] mt-0.5 font-bold tracking-wider">Priority Findings</div>
          </div>
        </div>

        {/* Card 6 — Active Alerts */}
        <div 
          onClick={() => onNavigateTab('alerts')}
          className="glass-panel-interactive p-4 rounded-xl flex flex-col justify-between group cursor-pointer relative overflow-hidden border border-red-500/30 hover:border-red-400/50"
        >
          <div className="flex justify-between items-start">
            <div className="w-8 h-8 rounded-lg bg-red-500/15 border border-red-500/40 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>crisis_alert</span>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping" />
          </div>
          <div className="mt-3">
            <div className="font-headline-md text-[26px] font-bold text-red-300 group-hover:text-red-200 transition-colors">{alertCount}</div>
            <div className="font-label-caps text-[10px] text-red-400 mt-0.5 font-bold tracking-wider">Active Alerts</div>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Pipeline Stepper, Findings & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Processing Pipeline */}
        <div className="glass-panel rounded-xl p-6 flex flex-col border border-[#6dedff]/15">
          <h3 className="font-title-lg text-[16px] text-[#dfe2f4] mb-6 flex items-center gap-2 font-bold tracking-wide">
            <span className="material-symbols-outlined text-[#6dedff] text-[20px]">memory</span>
            Processing Pipeline
          </h3>

          <div className="relative flex-1 pl-5 border-l-2 border-[#3c494b]/40 ml-2 space-y-6">
            {/* Step 1 */}
            <div className="relative group">
              <div className="absolute -left-[27px] top-0.5 w-6 h-6 rounded-full bg-[#0f1322] border-2 border-[#6dedff] text-[#6dedff] flex items-center justify-center shadow-[0_0_10px_rgba(40,210,230,0.3)]">
                <span className="material-symbols-outlined text-[13px]">check</span>
              </div>
              <h4 className="font-label-caps text-[11px] text-[#dfe2f4] font-semibold">Data Extraction</h4>
              <p className="font-code-sm text-[11px] text-[#859396] mt-0.5">100% Complete • 60.6 MB</p>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="absolute -left-[27px] top-0.5 w-6 h-6 rounded-full bg-[#0f1322] border-2 border-[#6dedff] text-[#6dedff] flex items-center justify-center shadow-[0_0_10px_rgba(40,210,230,0.3)]">
                <span className="material-symbols-outlined text-[13px]">check</span>
              </div>
              <h4 className="font-label-caps text-[11px] text-[#dfe2f4] font-semibold">OCR & Transcription</h4>
              <p className="font-code-sm text-[11px] text-[#859396] mt-0.5">100% Complete • 1,280 OCR pages</p>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="absolute -left-[27px] top-0.5 w-6 h-6 rounded-full bg-[#0f1322] border-2 border-[#6dedff] text-[#6dedff] flex items-center justify-center shadow-[0_0_10px_rgba(40,210,230,0.3)]">
                <span className="material-symbols-outlined text-[13px]">check</span>
              </div>
              <h4 className="font-label-caps text-[11px] text-[#dfe2f4] font-semibold">Entity Extraction</h4>
              <p className="font-code-sm text-[11px] text-[#859396] mt-0.5">147 Entities mapped across 6 files</p>
            </div>

            {/* Step 4 */}
            <div className="relative group">
              <div className="absolute -left-[27px] top-0.5 w-6 h-6 rounded-full bg-[#0f1322] border-2 border-[#6dedff] text-[#6dedff] flex items-center justify-center shadow-[0_0_10px_rgba(40,210,230,0.3)]">
                <span className="material-symbols-outlined text-[13px]">check</span>
              </div>
              <h4 className="font-label-caps text-[11px] text-[#dfe2f4] font-semibold">Graph Topology Indexing</h4>
              <p className="font-code-sm text-[11px] text-[#859396] mt-0.5">426 Edges indexed with weight metrics</p>
            </div>

            {/* Step 5 */}
            <div className="relative group">
              <div className="absolute -left-[27px] top-0.5 w-6 h-6 rounded-full bg-[#0f1322] border-2 border-[#36d9ed] text-[#36d9ed] flex items-center justify-center animate-pulse shadow-[0_0_12px_rgba(54,217,237,0.5)]">
                <span className="material-symbols-outlined text-[13px]">sync</span>
              </div>
              <h4 className="font-label-caps text-[11px] text-[#36d9ed] font-bold">Geo-Resolution & Tower Match</h4>
              <p className="font-code-sm text-[11px] text-[#859396] mt-0.5">Refining sector azimuth pings...</p>
            </div>
          </div>
        </div>

        {/* Right Column: Key Priority Findings */}
        <div className="glass-panel rounded-xl p-6 lg:col-span-2 flex flex-col justify-between border border-[#6dedff]/15">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#3c494b]/20">
              <h3 className="font-title-lg text-[16px] text-[#dfe2f4] flex items-center gap-2 font-bold">
                <span className="material-symbols-outlined text-rose-400 text-[20px] animate-pulse">radar</span>
                Priority Findings & Anomalies
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 font-label-caps text-[10px] font-bold shadow-[0_0_8px_rgba(244,63,94,0.3)]">
                HIGH RISK DETECTED
              </span>
            </div>

            <div className="space-y-3">
              {/* Finding 1 */}
              <div className="p-4 rounded-xl bg-[#131726]/80 border border-[#3c494b]/30 hover:border-[#6dedff]/40 transition-all flex items-start gap-3.5 group shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                <div className="p-2.5 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30 shrink-0 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">cell_tower</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-body-md text-[14px] font-semibold text-[#dfe2f4] group-hover:text-[#6dedff] transition-colors">
                      Co-Location Match: Cell Site #4301 (Sector 43 ISBT)
                    </h4>
                    <span className="font-code-sm text-[11px] text-[#859396] bg-[#1d2338] px-2 py-0.5 rounded">02:14 AM</span>
                  </div>
                  <p className="font-body-sm text-[12.5px] text-[#bbc9cc] mt-1 leading-relaxed">
                    Target A (<span className="text-[#6dedff] font-semibold">+91 98765 43210</span>) and Target B (<span className="text-[#6dedff] font-semibold">+91 91234 56789</span>) locked onto Sector 43 ISBT tower within 120m radius for 15 mins. Direct call followed immediately.
                  </p>
                  <div className="mt-2.5 flex gap-2">
                    <button onClick={() => onNavigateTab('map')} className="text-[#6dedff] hover:text-[#95f1ff] font-label-caps text-[10px] flex items-center gap-1 font-semibold group/btn cursor-pointer">
                      View on Map <span className="material-symbols-outlined text-[14px] transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Finding 2 */}
              <div className="p-4 rounded-xl bg-[#131726]/80 border border-[#3c494b]/30 hover:border-[#6dedff]/40 transition-all flex items-start gap-3.5 group shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                <div className="p-2.5 rounded-lg bg-purple-500/15 text-purple-300 border border-purple-500/30 shrink-0 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">currency_exchange</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-body-md text-[14px] font-semibold text-[#dfe2f4] group-hover:text-purple-300 transition-colors">
                      Round-Trip Shell Account Wiring (Apex Trading)
                    </h4>
                    <span className="font-code-sm text-[11px] text-emerald-400 font-bold bg-[#1d2338] px-2 py-0.5 rounded">Rs. 25,00,000</span>
                  </div>
                  <p className="font-body-sm text-[12.5px] text-[#bbc9cc] mt-1 leading-relaxed">
                    42 victim UPI micro-deposits totaling Rs. 4,11,600 consolidated into HDFC ...8921 and immediately wired to offshore entity Apex Trading UAE via RTGS.
                  </p>
                  <div className="mt-2.5 flex gap-2">
                    <button onClick={() => onNavigateTab('finance')} className="text-[#6dedff] hover:text-[#95f1ff] font-label-caps text-[10px] flex items-center gap-1 font-semibold group/btn cursor-pointer">
                      Trace Money Flow <span className="material-symbols-outlined text-[14px] transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Finding 3 */}
              <div className="p-4 rounded-xl bg-[#131726]/80 border border-[#3c494b]/30 hover:border-[#6dedff]/40 transition-all flex items-start gap-3.5 group shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                <div className="p-2.5 rounded-lg bg-[#28d2e6]/15 text-[#6dedff] border border-[#28d2e6]/30 shrink-0 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-body-md text-[14px] font-semibold text-[#dfe2f4] group-hover:text-[#6dedff] transition-colors">
                      UFED Decrypted WhatsApp Directive
                    </h4>
                    <span className="font-code-sm text-[11px] text-[#859396] bg-[#1d2338] px-2 py-0.5 rounded">10:30 AM</span>
                  </div>
                  <p className="font-body-sm text-[12.5px] text-[#bbc9cc] mt-1 leading-relaxed">
                    Decrypted chat from Master V: <span className="italic text-[#dfe2f4] font-medium">"Clear the cash box before 4 PM. Transfer 10L to Mohali drop point."</span>
                  </p>
                  <div className="mt-2.5 flex gap-2">
                    <button onClick={() => onNavigateTab('copilot')} className="text-[#6dedff] hover:text-[#95f1ff] font-label-caps text-[10px] flex items-center gap-1 font-semibold group/btn cursor-pointer">
                      Query AI Copilot <span className="material-symbols-outlined text-[14px] transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Navigation Bar */}
          <div className="mt-6 pt-4 border-t border-[#3c494b]/20">
            <span className="font-label-caps text-[10px] text-[#859396] font-bold tracking-wider block mb-3">QUICK ACTIONS:</span>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => onNavigateTab('evidence')} className="px-3 py-1.5 rounded-lg bg-[#181d2f] hover:bg-[#21273d] text-[#dfe2f4] hover:text-[#6dedff] border border-[#3c494b]/30 hover:border-[#6dedff]/40 font-label-caps text-[10.5px] flex items-center gap-1.5 transition-all cursor-pointer shadow-sm">
                <span className="material-symbols-outlined text-[15px]">upload_file</span> Ingest Files
              </button>
              <button onClick={() => onNavigateTab('alerts')} className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 hover:text-red-200 border border-red-500/30 hover:border-red-400/50 font-label-caps text-[10.5px] flex items-center gap-1.5 transition-all cursor-pointer">
                <span className="material-symbols-outlined text-[15px]">crisis_alert</span> View Alerts
              </button>
              <button onClick={() => onNavigateTab('correlation')} className="px-3 py-1.5 rounded-lg bg-[#181d2f] hover:bg-[#21273d] text-[#dfe2f4] hover:text-[#6dedff] border border-[#3c494b]/30 hover:border-[#6dedff]/40 font-label-caps text-[10.5px] flex items-center gap-1.5 transition-all cursor-pointer shadow-sm">
                <span className="material-symbols-outlined text-[15px]">link</span> Correlations
              </button>
              <button onClick={() => onNavigateTab('social_media')} className="px-3 py-1.5 rounded-lg bg-[#181d2f] hover:bg-[#21273d] text-[#dfe2f4] hover:text-purple-300 border border-[#3c494b]/30 hover:border-purple-500/40 font-label-caps text-[10.5px] flex items-center gap-1.5 transition-all cursor-pointer shadow-sm">
                <span className="material-symbols-outlined text-[15px]">public</span> Social Intel
              </button>
              <button onClick={() => onNavigateTab('graph')} className="px-3 py-1.5 rounded-lg bg-[#181d2f] hover:bg-[#21273d] text-[#dfe2f4] hover:text-[#6dedff] border border-[#3c494b]/30 hover:border-[#6dedff]/40 font-label-caps text-[10.5px] flex items-center gap-1.5 transition-all cursor-pointer shadow-sm">
                <span className="material-symbols-outlined text-[15px]">account_tree</span> Link Graph
              </button>
              <button onClick={() => onNavigateTab('copilot')} className="px-3 py-1.5 rounded-lg bg-[#28d2e6]/20 hover:bg-[#28d2e6]/30 border border-[#28d2e6]/50 text-[#6dedff] font-label-caps text-[10.5px] flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_12px_rgba(40,210,230,0.2)]">
                <span className="material-symbols-outlined text-[15px]">smart_toy</span> Ask Copilot AI
              </button>
            </div>
          </div>

          {/* Recent Alerts Mini-Feed */}
          <div className="mt-5 pt-4 border-t border-[#3c494b]/20">
            <div className="flex items-center justify-between mb-3">
              <span className="font-label-caps text-[10px] text-[#859396] font-bold tracking-wider">RECENT ALERTS:</span>
              <button onClick={() => onNavigateTab('alerts')} className="font-label-caps text-[10px] text-[#6dedff] hover:text-[#95f1ff] flex items-center gap-1 cursor-pointer">
                View All <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
              </button>
            </div>
            <div className="space-y-2">
              {recentAlerts.map(alert => {
                const colorClass = SEVERITY_COLORS[alert.severity] ?? 'text-[#859396]';
                return (
                  <button
                    key={alert.id}
                    onClick={() => onNavigateTab('alerts')}
                    className={`w-full flex items-start gap-2.5 p-2.5 rounded-lg border text-left cursor-pointer transition-all hover:opacity-80 ${colorClass}`}
                  >
                    <span className="material-symbols-outlined text-[14px] shrink-0 mt-0.5">crisis_alert</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-body-sm text-[11.5px] text-[#dfe2f4] font-medium truncate">{alert.title}</p>
                      <p className="font-code-sm text-[10px] opacity-70 mt-0.5">{alert.timestamp} • {alert.severity}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

