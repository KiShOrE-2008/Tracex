import { useState } from 'react';
import type { FC } from 'react';
import type { AlertItem, AlertSeverity, AlertCategory } from '../types/forensic';

interface AlertsViewProps {
  alerts: AlertItem[];
  onNavigateTab: (tab: string) => void;
}

const SEVERITY_CONFIG: Record<AlertSeverity, { color: string; bg: string; border: string; icon: string; label: string }> = {
  CRITICAL: { color: 'text-red-300',    bg: 'bg-red-500/15',    border: 'border-red-500/50',    icon: 'crisis_alert',     label: 'CRITICAL' },
  HIGH:     { color: 'text-orange-300', bg: 'bg-orange-500/15', border: 'border-orange-500/50', icon: 'warning',          label: 'HIGH'     },
  MEDIUM:   { color: 'text-amber-300',  bg: 'bg-amber-500/15',  border: 'border-amber-500/40',  icon: 'error_outline',    label: 'MEDIUM'   },
  LOW:      { color: 'text-sky-300',    bg: 'bg-sky-500/15',    border: 'border-sky-500/40',    icon: 'info',             label: 'LOW'      },
};

const CATEGORY_CONFIG: Record<AlertCategory, { color: string; bg: string; label: string }> = {
  CDR:    { color: 'text-[#6dedff]',  bg: 'bg-[#6dedff]/10',   label: 'CDR'    },
  BANK:   { color: 'text-emerald-400',bg: 'bg-emerald-500/10', label: 'BANK'   },
  SOCIAL: { color: 'text-purple-300', bg: 'bg-purple-500/10',  label: 'SOCIAL' },
  GEO:    { color: 'text-amber-300',  bg: 'bg-amber-500/10',   label: 'GEO'    },
  IP:     { color: 'text-rose-300',   bg: 'bg-rose-500/10',    label: 'IP'     },
  UPI:    { color: 'text-teal-300',   bg: 'bg-teal-500/10',    label: 'UPI'    },
};

export const AlertsView: FC<AlertsViewProps> = ({ alerts, onNavigateTab }) => {
  const [localAlerts, setLocalAlerts] = useState<AlertItem[]>(alerts);
  const [filter, setFilter] = useState<AlertSeverity | 'ALL'>('ALL');

  const counts = {
    CRITICAL: localAlerts.filter(a => a.severity === 'CRITICAL' && !a.isDismissed).length,
    HIGH:     localAlerts.filter(a => a.severity === 'HIGH'     && !a.isDismissed).length,
    MEDIUM:   localAlerts.filter(a => a.severity === 'MEDIUM'   && !a.isDismissed).length,
    LOW:      localAlerts.filter(a => a.severity === 'LOW'      && !a.isDismissed).length,
  };

  const visible = localAlerts.filter(a =>
    !a.isDismissed && (filter === 'ALL' || a.severity === filter)
  );
  const dismissed = localAlerts.filter(a => a.isDismissed);

  const dismiss = (id: string) => {
    setLocalAlerts(prev => prev.map(a => a.id === id ? { ...a, isDismissed: true } : a));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden glass-panel p-5 rounded-xl border border-rose-500/30">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-rose-500 to-transparent" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-rose-400 text-[22px] animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>crisis_alert</span>
              <h2 className="font-headline-md text-[22px] font-bold text-[#dfe2f4]">Anomaly Detection — Alert Center</h2>
            </div>
            <p className="font-body-sm text-[13px] text-[#859396]">
              Auto-detected cross-domain anomalies across CDR, Banking, Social Media, Geospatial, and IP intelligence.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-label-caps text-[11px] font-bold">
              {visible.length} ACTIVE
            </span>
            {dismissed.length > 0 && (
              <span className="px-3 py-1 rounded-full bg-[#1b1f2c] text-[#859396] border border-[#3c494b]/30 font-label-caps text-[11px]">
                {dismissed.length} DISMISSED
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Severity Summary Ribbon */}
      <div className="grid grid-cols-4 gap-3">
        {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as AlertSeverity[]).map(sev => {
          const cfg = SEVERITY_CONFIG[sev];
          const isActive = filter === sev;
          return (
            <button
              key={sev}
              onClick={() => setFilter(isActive ? 'ALL' : sev)}
              className={`glass-panel p-4 rounded-xl border transition-all cursor-pointer text-left ${isActive ? `${cfg.border} shadow-lg` : 'border-[#3c494b]/30 hover:border-[#3c494b]/60'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`material-symbols-outlined text-[20px] ${cfg.color}`}>{cfg.icon}</span>
                <span className={`font-headline-sm text-[24px] font-bold ${cfg.color}`}>{counts[sev]}</span>
              </div>
              <span className={`font-label-caps text-[10px] font-bold ${cfg.color}`}>{cfg.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-label-caps text-[10px] text-[#859396]">FILTER:</span>
        {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full font-label-caps text-[10px] border transition-all cursor-pointer ${
              filter === f
                ? 'bg-[#6dedff]/20 text-[#6dedff] border-[#6dedff]/50'
                : 'bg-[#181d2f] text-[#859396] border-[#3c494b]/30 hover:text-[#dfe2f4]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {visible.length === 0 && (
          <div className="glass-panel p-12 rounded-xl border border-[#3c494b]/20 text-center">
            <span className="material-symbols-outlined text-[48px] text-emerald-400 block mb-3">check_circle</span>
            <p className="font-body-md text-[#bbc9cc]">No active alerts for this filter.</p>
          </div>
        )}
        {visible.map(alert => {
          const sev = SEVERITY_CONFIG[alert.severity];
          const cat = CATEGORY_CONFIG[alert.category];
          return (
            <div
              key={alert.id}
              className={`glass-panel p-5 rounded-xl border ${sev.border} transition-all hover:shadow-lg relative overflow-hidden`}
            >
              {/* Left accent bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${sev.bg} border-r ${sev.border}`} />

              <div className="pl-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Severity icon */}
                    <div className={`p-2 rounded-lg ${sev.bg} border ${sev.border} shrink-0 mt-0.5`}>
                      <span className={`material-symbols-outlined text-[18px] ${sev.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{sev.icon}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Chips row */}
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`font-label-caps text-[10px] font-bold px-2 py-0.5 rounded border ${sev.bg} ${sev.color} ${sev.border}`}>
                          {sev.label}
                        </span>
                        <span className={`font-label-caps text-[10px] px-2 py-0.5 rounded ${cat.bg} ${cat.color}`}>
                          {cat.label}
                        </span>
                        <span className="font-code-sm text-[10px] text-[#859396]">{alert.id}</span>
                        <span className="font-code-sm text-[10px] text-[#859396]">{alert.timestamp}</span>
                      </div>

                      {/* Title */}
                      <h4 className="font-body-md text-[14px] font-semibold text-[#dfe2f4] mb-1.5">{alert.title}</h4>

                      {/* Body */}
                      <p className="font-body-sm text-[12.5px] text-[#bbc9cc] leading-relaxed mb-3">{alert.body}</p>

                      {/* Related entities */}
                      {alert.relatedEntities.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 mb-3">
                          <span className="font-label-caps text-[10px] text-[#859396]">ENTITIES:</span>
                          {alert.relatedEntities.map(e => (
                            <span key={e} className="px-2 py-0.5 rounded bg-[#1b1f2c] text-[#6dedff] border border-[#6dedff]/20 font-code-sm text-[10px]">{e}</span>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-3">
                        {alert.navigateTo && (
                          <button
                            onClick={() => onNavigateTab(alert.navigateTo!)}
                            className="font-label-caps text-[10px] text-[#6dedff] hover:text-[#95f1ff] flex items-center gap-1 cursor-pointer group/btn"
                          >
                            Investigate <span className="material-symbols-outlined text-[13px] transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
                          </button>
                        )}
                        <button
                          onClick={() => dismiss(alert.id)}
                          className="font-label-caps text-[10px] text-[#859396] hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[13px]">close</span>Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dismissed section */}
      {dismissed.length > 0 && (
        <div className="glass-panel p-4 rounded-xl border border-[#3c494b]/20">
          <p className="font-label-caps text-[10px] text-[#859396] mb-3">{dismissed.length} DISMISSED ALERTS</p>
          <div className="space-y-2">
            {dismissed.map(a => (
              <div key={a.id} className="flex items-center gap-3 opacity-40 text-[#859396]">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span className="font-code-sm text-[11px]">{a.id} — {a.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
