import { useState } from 'react';
import type { FC } from 'react';
import type { CorrelationLink, AlertCategory } from '../types/forensic';

interface CorrelationViewProps {
  correlations: CorrelationLink[];
  onNavigateTab: (tab: string) => void;
}

const CHANNEL_CONFIG: Record<AlertCategory, { color: string; bg: string; border: string; icon: string }> = {
  CDR:    { color: 'text-[#6dedff]',   bg: 'bg-[#6dedff]/10',   border: 'border-[#6dedff]/40',   icon: 'call'           },
  BANK:   { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/40', icon: 'account_balance' },
  UPI:    { color: 'text-teal-300',    bg: 'bg-teal-500/10',    border: 'border-teal-500/40',    icon: 'payments'       },
  SOCIAL: { color: 'text-purple-300',  bg: 'bg-purple-500/10',  border: 'border-purple-500/40',  icon: 'group'          },
  GEO:    { color: 'text-amber-300',   bg: 'bg-amber-500/10',   border: 'border-amber-500/40',   icon: 'cell_tower'     },
  IP:     { color: 'text-rose-300',    bg: 'bg-rose-500/10',    border: 'border-rose-500/40',    icon: 'dns'            },
};

const VERDICT_CONFIG: Record<string, { color: string; glow: string }> = {
  'VERY HIGH': { color: 'text-red-300',    glow: 'shadow-[0_0_20px_rgba(239,68,68,0.4)]'    },
  'HIGH':      { color: 'text-orange-300', glow: 'shadow-[0_0_20px_rgba(249,115,22,0.4)]'   },
  'MODERATE':  { color: 'text-amber-300',  glow: 'shadow-[0_0_20px_rgba(245,158,11,0.4)]'   },
  'LOW':       { color: 'text-sky-300',    glow: 'shadow-[0_0_20px_rgba(14,165,233,0.4)]'   },
};

const ScoreRing: FC<{ score: number; verdict: string }> = ({ score, verdict }) => {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const progress = (score / 100) * circ;
  const vcfg = VERDICT_CONFIG[verdict] ?? VERDICT_CONFIG['LOW'];

  return (
    <div className="relative flex items-center justify-center" style={{ width: 110, height: 110 }}>
      <svg width="110" height="110" viewBox="0 0 110 110" className="absolute">
        {/* Track */}
        <circle cx="55" cy="55" r={r} fill="none" stroke="#1b1f2c" strokeWidth="8" />
        {/* Progress */}
        <circle
          cx="55" cy="55" r={r}
          fill="none"
          stroke={verdict === 'VERY HIGH' ? '#ef4444' : verdict === 'HIGH' ? '#f97316' : verdict === 'MODERATE' ? '#f59e0b' : '#0ea5e9'}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circ}`}
          strokeDashoffset={circ * 0.25}
          style={{ transition: 'stroke-dasharray 0.8s ease' }}
        />
      </svg>
      <div className="text-center z-10">
        <div className={`font-headline-md text-[24px] font-extrabold ${vcfg.color}`}>{score}</div>
        <div className="font-label-caps text-[9px] text-[#859396]">/ 100</div>
      </div>
    </div>
  );
};

export const CorrelationView: FC<CorrelationViewProps> = ({ correlations, onNavigateTab }) => {
  const [selected, setSelected] = useState<CorrelationLink>(correlations[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden glass-panel p-5 rounded-xl border border-[#6dedff]/25">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#6dedff] to-transparent" />
        <div className="flex items-center gap-3 relative z-10">
          <span className="material-symbols-outlined text-[#6dedff] text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>link</span>
          <div>
            <h2 className="font-headline-md text-[22px] font-bold text-[#dfe2f4]">Cross-Domain Correlation Engine</h2>
            <p className="font-body-sm text-[13px] text-[#859396] mt-0.5">
              Why are these entities connected? Scored across CDR, Banking, Social, Geospatial & IP data sources.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Entity Pair List */}
        <div className="glass-panel rounded-xl border border-[#3c494b]/30 overflow-hidden">
          <div className="px-4 py-3 border-b border-[#3c494b]/30">
            <h3 className="font-label-caps text-[11px] text-[#859396] font-bold tracking-wider">ENTITY PAIR RANKING</h3>
          </div>
          <div className="divide-y divide-[#3c494b]/20">
            {correlations.map(link => {
              const isActive = selected.id === link.id;
              const vcfg = VERDICT_CONFIG[link.verdict] ?? VERDICT_CONFIG['LOW'];
              return (
                <button
                  key={link.id}
                  onClick={() => setSelected(link)}
                  className={`w-full px-4 py-3.5 text-left transition-all cursor-pointer ${
                    isActive ? 'bg-[#6dedff]/10 border-l-2 border-[#6dedff]' : 'hover:bg-[#1b1f2c]/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-code-sm text-[11px] text-[#dfe2f4] font-medium truncate">{link.entityA}</p>
                      <div className="flex items-center gap-1 my-0.5">
                        <div className="h-px flex-1 bg-[#3c494b]/40" />
                        <span className="material-symbols-outlined text-[12px] text-[#6dedff]">swap_horiz</span>
                        <div className="h-px flex-1 bg-[#3c494b]/40" />
                      </div>
                      <p className="font-code-sm text-[11px] text-[#dfe2f4] font-medium truncate">{link.entityB}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className={`font-headline-sm text-[20px] font-extrabold ${vcfg.color}`}>{link.score}</div>
                      <div className="font-label-caps text-[9px] text-[#859396]">{link.evidenceSources.length} sources</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right — "Why Are These Connected?" Detail Card */}
        <div className="lg:col-span-2 space-y-4">
          {/* Question header */}
          <div className="glass-panel p-6 rounded-xl border border-[#6dedff]/20">
            <p className="font-label-caps text-[10px] text-[#859396] mb-4 tracking-widest">WHY ARE THESE ENTITIES CONNECTED?</p>

            {/* Entity pair banner */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-[#6dedff] text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                  <span className="font-body-md text-[15px] font-bold text-[#dfe2f4]">{selected.entityA}</span>
                </div>
                <div className="flex items-center gap-2 my-2 px-4">
                  <div className="h-[2px] flex-1 bg-gradient-to-r from-[#6dedff]/60 to-[#6dedff]/20 rounded" />
                  <span className="font-label-caps text-[9px] text-[#6dedff] px-2 py-0.5 rounded border border-[#6dedff]/30 bg-[#6dedff]/10">
                    {selected.score} / 100
                  </span>
                  <div className="h-[2px] flex-1 bg-gradient-to-l from-[#6dedff]/60 to-[#6dedff]/20 rounded" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#6dedff] text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                  <span className="font-body-md text-[15px] font-bold text-[#dfe2f4]">{selected.entityB}</span>
                </div>
              </div>
              <ScoreRing score={selected.score} verdict={selected.verdict} />
            </div>

            {/* Verdict badge */}
            <div className="flex items-center gap-3 mb-6 p-3 rounded-lg bg-[#0f131f] border border-[#3c494b]/30">
              <span className="material-symbols-outlined text-rose-400 text-[18px]">analytics</span>
              <div>
                <span className="font-label-caps text-[10px] text-[#859396]">CONNECTION STRENGTH</span>
                <p className={`font-label-caps text-[13px] font-extrabold ${VERDICT_CONFIG[selected.verdict]?.color ?? 'text-[#dfe2f4]'}`}>{selected.verdict}</p>
              </div>
            </div>

            {/* SUPPORTED BY section */}
            <div>
              <p className="font-label-caps text-[10px] text-[#859396] mb-3 tracking-widest">SUPPORTED BY</p>

              <div className="space-y-2.5">
                {selected.evidenceSources.map((src, i) => {
                  const ch = CHANNEL_CONFIG[src.channel] ?? CHANNEL_CONFIG['CDR'];
                  return (
                    <div
                      key={i}
                      className={`flex items-center justify-between gap-3 p-3 rounded-lg border ${ch.border} ${ch.bg} group`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* Check icon */}
                        <span className="material-symbols-outlined text-[16px] text-emerald-400 shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        {/* Channel chip */}
                        <span className={`font-label-caps text-[9px] px-2 py-0.5 rounded border ${ch.color} ${ch.border} ${ch.bg} shrink-0`}>
                          {src.channel}
                        </span>
                        {/* Label */}
                        <span className="font-body-sm text-[12.5px] text-[#bbc9cc] truncate">{src.label}</span>
                        {src.amount && (
                          <span className="font-code-sm text-[11px] text-emerald-400 shrink-0 font-bold">
                            ₹{src.amount.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      {src.navigateTo && (
                        <button
                          onClick={() => onNavigateTab(src.navigateTo!)}
                          className="font-label-caps text-[10px] text-[#6dedff] hover:text-[#95f1ff] flex items-center gap-1 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          View <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Summary footer */}
              <div className="mt-5 pt-4 border-t border-[#3c494b]/30 flex items-center justify-between">
                <div>
                  <span className="font-headline-sm text-[20px] font-bold text-[#6dedff]">{selected.evidenceSources.length}</span>
                  <span className="font-body-sm text-[13px] text-[#bbc9cc] ml-2">independent evidence sources</span>
                </div>
                <button
                  onClick={() => onNavigateTab('reports')}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#6dedff] to-[#28d2e6] text-[#00363d] font-label-caps text-[11px] font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(109,237,255,0.4)] hover:shadow-[0_0_20px_rgba(109,237,255,0.6)] transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">description</span>
                  Generate Correlation Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
