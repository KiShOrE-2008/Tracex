import { useState } from 'react';
import type { EntityDNA, AuditLogItem } from '../types/forensic';
import { useAuth } from '../context/AuthContext';

interface EntityDnaViewProps {
  entities: EntityDNA[];
  initialSelectedName?: string;
  onOpenGraphForEntity?: (name: string) => void;
  onAddAuditLog?: (log: Omit<AuditLogItem, 'id' | 'timestamp' | 'ipAddress'>) => void;
}

// ─── Masking Helpers ─────────────────────────────────────────────────────────
function maskPhone(ph: string): string {
  // "+91 98765 43210" → "+91 98765•••10"
  const clean = ph.replace(/\s/g, '');
  if (clean.length < 6) return ph;
  return ph.slice(0, -5) + '•••' + ph.slice(-2);
}

function maskBank(acc: string): string {
  // "HDFC 50200049188921" → "HDFC ••••8921"
  const parts = acc.split(' ');
  if (parts.length >= 2) {
    const num = parts[parts.length - 1];
    const masked = '••••' + num.slice(-4);
    return parts.slice(0, -1).join(' ') + ' ' + masked;
  }
  return '••••' + acc.slice(-4);
}

function maskUpi(upi: string): string {
  // "vikram.sharma@okicici" → "vi***@okicici"
  const at = upi.indexOf('@');
  if (at > 2) {
    return upi.slice(0, 2) + '***' + upi.slice(at);
  }
  return upi.slice(0, 2) + '***';
}

// ─── Reveal Modal ─────────────────────────────────────────────────────────────
interface RevealModalProps {
  label: string;
  maskedValue: string;
  realValue: string;
  onConfirm: (reason: string) => void;
  onClose: () => void;
}

const REVEAL_REASONS = [
  'Investigation Reference',
  'Evidence Verification',
  'Court Order — Section 65B',
  'Supervisor Directive',
];

function RevealModal({ label, maskedValue, realValue: _realValue, onConfirm, onClose }: RevealModalProps) {
  const [reason, setReason] = useState(REVEAL_REASONS[0]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#111827] border border-amber-500/40 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-[0_0_40px_rgba(245,158,11,0.25)]" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <span className="material-symbols-outlined text-amber-400 text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
          </div>
          <div>
            <h3 className="font-title-lg text-[15px] text-[#dfe2f4] font-bold">Sensitive Data Access</h3>
            <p className="font-code-sm text-[11px] text-[#859396]">This action will be recorded in the audit log</p>
          </div>
        </div>

        <div className="mb-4 p-3 rounded-lg bg-[#1b1f2c] border border-[#3c494b]/30">
          <div className="font-label-caps text-[9px] text-[#859396] tracking-widest mb-1">{label}</div>
          <div className="font-code-sm text-[13px] text-amber-400 font-bold">{maskedValue}</div>
        </div>

        <label className="font-label-caps text-[10px] text-[#859396] tracking-widest block mb-2">REASON FOR ACCESS</label>
        <select
          value={reason}
          onChange={e => setReason(e.target.value)}
          className="w-full bg-[#1b1f2c] border border-[#3c494b]/40 text-[#dfe2f4] rounded-lg px-3 py-2 font-body-sm text-[13px] focus:outline-none focus:border-amber-400 mb-5"
        >
          {REVEAL_REASONS.map(r => <option key={r}>{r}</option>)}
        </select>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-[#3c494b]/40 text-[#859396] font-label-caps text-[11px] hover:bg-[#1f263c] transition-colors cursor-pointer"
          >
            CANCEL
          </button>
          <button
            id="reveal-confirm-btn"
            onClick={() => { onConfirm(reason); onClose(); }}
            className="flex-1 py-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 font-label-caps text-[11px] font-bold hover:bg-amber-500/30 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">visibility</span>
            REVEAL
          </button>
        </div>
      </div>
    </div>
  );
}

// MaskedField is implemented inline in the main component for per-key reveal state.

// ─── Main Component ────────────────────────────────────────────────────────────
export const EntityDnaView = ({
  entities,
  initialSelectedName,
  onOpenGraphForEntity,
  onAddAuditLog,
}: EntityDnaViewProps) => {
  const { session } = useAuth();
  const [selectedId, setSelectedId] = useState<string>(() => {
    if (initialSelectedName) {
      const match = entities.find(e => e.name.toLowerCase().includes(initialSelectedName.toLowerCase()));
      if (match) return match.id;
    }
    return entities[0]?.id || 'DNA-01';
  });

  // Reveal modal state
  const [revealModal, setRevealModal] = useState<{
    label: string; real: string; masked: string;
  } | null>(null);
  // Track which fields are revealed per item key
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());

  const activeEntity = entities.find(e => e.id === selectedId) || entities[0];

  const pendingRevealKey = { current: '' };

  const confirmReveal = (reason: string) => {
    const key = pendingRevealKey.current;
    setRevealedKeys(prev => new Set([...prev, key]));

    // Auto-hide after 15s
    setTimeout(() => {
      setRevealedKeys(prev => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }, 15000);

    // Append to audit log
    if (onAddAuditLog && session) {
      onAddAuditLog({
        analyst: session.user.displayName,
        role: session.user.role,
        action: 'SENSITIVE_DATA_ACCESS',
        resource: `${activeEntity?.name} (${revealModal?.label}) — Reason: ${reason}`,
        hash: '',
        prevHash: '',
      });
    }
  };

  const mkKey = (entity: EntityDNA, type: string, val: string) => `${entity.id}:${type}:${val}`;

  return (
    <div className="flex-1 flex gap-4 h-full overflow-hidden">
      {/* Left List */}
      <div className="w-80 bg-[#1b1f2c] border border-[#3c494b]/20 rounded-lg flex flex-col overflow-hidden shrink-0">
        <div className="p-4 border-b border-[#3c494b]/30 bg-[#172034] font-title-lg text-[15px] text-[#dfe2f4] flex justify-between items-center">
          <span>Entity DNA Profiles</span>
          <span className="px-2 py-0.5 rounded bg-[#303442] font-code-sm text-[10px] text-[#6dedff]">
            {entities.length} TARGETS
          </span>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {entities.map((ent) => {
            const isSelected = ent.id === selectedId;
            return (
              <div
                key={ent.id}
                onClick={() => setSelectedId(ent.id)}
                className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center gap-3 ${
                  isSelected
                    ? 'bg-[#6dedff]/10 border-[#6dedff] shadow-[0_0_12px_rgba(40,210,230,0.15)]'
                    : 'bg-[#171b28] border-[#3c494b]/20 hover:border-[#3c494b]/50'
                }`}
              >
                {ent.photoUrl ? (
                  <img src={ent.photoUrl} alt={ent.name} className="w-11 h-11 rounded object-cover border border-[#3c494b]/40 shrink-0" />
                ) : (
                  <div className="w-11 h-11 rounded bg-[#303442] flex items-center justify-center text-[#6dedff] font-headline-sm shrink-0">
                    {ent.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-body-md text-body-md font-semibold text-[#dfe2f4] truncate">{ent.name}</h4>
                    <span className="font-code-sm text-[10px] text-[#ffb4ab] font-bold">{ent.riskScore}</span>
                  </div>
                  <p className="font-code-sm text-[11px] text-[#859396] truncate">{ent.alias}</p>
                  <span className="font-label-caps text-[9px] text-[#36d9ed]">{ent.role}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Dossier */}
      {activeEntity && (
        <div className="flex-1 bg-[#1b1f2c] border border-[#3c494b]/20 rounded-lg overflow-y-auto p-6 space-y-6">
          {/* Dossier Header */}
          <div className="glass-panel p-6 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {activeEntity.photoUrl ? (
                <img src={activeEntity.photoUrl} alt={activeEntity.name} className="w-20 h-20 rounded-lg object-cover border-2 border-[#6dedff] shadow-[0_0_15px_rgba(109,237,255,0.2)] shrink-0" />
              ) : (
                <div className="w-20 h-20 rounded-lg bg-[#28d2e6]/20 border-2 border-[#6dedff] flex items-center justify-center text-[#6dedff] text-2xl font-bold shrink-0">
                  {activeEntity.name.charAt(0)}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded bg-[#93000a]/20 text-[#ffb4ab] border border-[#93000a]/50 font-label-caps text-[10px] font-bold">
                    THREAT SCORE: {activeEntity.riskScore}/100
                  </span>
                  <span className="font-code-sm text-[11px] text-[#859396]">ID: {activeEntity.id}</span>
                </div>
                <h2 className="font-display-lg text-display-lg text-[#dfe2f4]">{activeEntity.name}</h2>
                <p className="font-body-sm text-body-sm text-[#6dedff] font-medium">
                  Known Alias: "{activeEntity.alias}" • {activeEntity.role}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {onOpenGraphForEntity && (
                <button
                  onClick={() => onOpenGraphForEntity(activeEntity.name)}
                  className="px-4 py-2 rounded bg-[#6dedff] text-[#00363d] font-label-caps text-label-caps font-bold hover:bg-[#95f1ff] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">account_tree</span>
                  Map Connections
                </button>
              )}
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded bg-[#171b28] border border-[#3c494b]/30">
              <span className="font-label-caps text-[10px] text-[#859396]">Total Calls Logged</span>
              <div className="font-headline-md text-[20px] text-[#dfe2f4] mt-0.5">{activeEntity.totalCallCount}</div>
            </div>
            <div className="p-3.5 rounded bg-[#171b28] border border-[#3c494b]/30">
              <span className="font-label-caps text-[10px] text-[#859396]">Financial Volume</span>
              <div className="font-headline-md text-[20px] text-[#6dedff] mt-0.5">Rs. {activeEntity.totalTxnVolume.toLocaleString('en-IN')}</div>
            </div>
            <div className="p-3.5 rounded bg-[#171b28] border border-[#3c494b]/30">
              <span className="font-label-caps text-[10px] text-[#859396]">Flagged Anomalies</span>
              <div className="font-headline-md text-[20px] text-[#ffb4ab] mt-0.5">{activeEntity.flaggedCount} Events</div>
            </div>
            <div className="p-3.5 rounded bg-[#171b28] border border-[#3c494b]/30">
              <span className="font-label-caps text-[10px] text-[#859396]">Last Geo Ping</span>
              <div className="font-code-sm text-[12px] text-[#dfe2f4] mt-0.5">{activeEntity.lastSeen}</div>
            </div>
          </div>

          {/* Executive Summary */}
          <div>
            <h4 className="font-label-caps text-label-caps text-[#859396] mb-2">Forensic Intelligence Summary</h4>
            <div className="p-4 rounded bg-[#0f131f] border border-[#3c494b]/30 font-body-sm text-body-sm text-[#bbc9cc] leading-relaxed">
              {activeEntity.summary}
            </div>
          </div>

          {/* Sensitive Identifiers with masking */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-[16px] text-amber-400">shield_lock</span>
              <h4 className="font-label-caps text-[10px] text-amber-400 tracking-widest font-bold">PROTECTED IDENTIFIERS</h4>
              <span className="font-code-sm text-[10px] text-[#859396]">— masked by default. Click 👁 to reveal.</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Phone Numbers */}
              <div className="p-4 rounded bg-[#171b28] border border-[#3c494b]/30 space-y-2">
                <h5 className="font-label-caps text-[10px] text-[#6dedff] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">call</span>
                  LINKED PHONES ({activeEntity.phoneNumbers.length})
                </h5>
                <div className="space-y-1.5">
                  {activeEntity.phoneNumbers.map((ph) => {
                    const key = mkKey(activeEntity, 'phone', ph);
                    const isRevealed = revealedKeys.has(key);
                    return (
                      <div key={ph} className="p-2 rounded bg-[#1b1f2c] border border-[#3c494b]/20 flex items-center justify-between gap-2">
                        {isRevealed ? (
                          <span className="font-code-sm text-[12px] text-emerald-400">{ph}</span>
                        ) : (
                          <span className="font-code-sm text-[12px] text-amber-300/80">{maskPhone(ph)}</span>
                        )}
                        {!isRevealed && (
                          <button
                            onClick={() => {
                              pendingRevealKey.current = key;
                              setRevealModal({ label: 'Phone Number', real: ph, masked: maskPhone(ph) });
                            }}
                            className="shrink-0 text-[#859396] hover:text-amber-400 transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">visibility</span>
                          </button>
                        )}
                        {isRevealed && <span className="material-symbols-outlined text-[14px] text-emerald-400 shrink-0">check_circle</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bank Accounts */}
              <div className="p-4 rounded bg-[#171b28] border border-[#3c494b]/30 space-y-2">
                <h5 className="font-label-caps text-[10px] text-[#e7d3ff] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">account_balance</span>
                  BANK ACCOUNTS ({activeEntity.bankAccounts.length})
                </h5>
                <div className="space-y-1.5">
                  {activeEntity.bankAccounts.map((acc) => {
                    const key = mkKey(activeEntity, 'bank', acc);
                    const isRevealed = revealedKeys.has(key);
                    return (
                      <div key={acc} className="p-2 rounded bg-[#1b1f2c] border border-[#3c494b]/20 flex items-center justify-between gap-2">
                        {isRevealed ? (
                          <span className="font-code-sm text-[12px] text-emerald-400">{acc}</span>
                        ) : (
                          <span className="font-code-sm text-[12px] text-amber-300/80">{maskBank(acc)}</span>
                        )}
                        {!isRevealed && (
                          <button
                            onClick={() => {
                              pendingRevealKey.current = key;
                              setRevealModal({ label: 'Bank Account', real: acc, masked: maskBank(acc) });
                            }}
                            className="shrink-0 text-[#859396] hover:text-amber-400 transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">visibility</span>
                          </button>
                        )}
                        {isRevealed && <span className="material-symbols-outlined text-[14px] text-emerald-400 shrink-0">check_circle</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* UPI IDs */}
              <div className="p-4 rounded bg-[#171b28] border border-[#3c494b]/30 space-y-2">
                <h5 className="font-label-caps text-[10px] text-[#36d9ed] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">payments</span>
                  UPI IDs ({activeEntity.upiIds.length})
                </h5>
                <div className="space-y-1.5">
                  {activeEntity.upiIds.map((upi) => {
                    const key = mkKey(activeEntity, 'upi', upi);
                    const isRevealed = revealedKeys.has(key);
                    return (
                      <div key={upi} className="p-2 rounded bg-[#1b1f2c] border border-[#3c494b]/20 flex items-center justify-between gap-2">
                        {isRevealed ? (
                          <span className="font-code-sm text-[12px] text-emerald-400">{upi}</span>
                        ) : (
                          <span className="font-code-sm text-[12px] text-amber-300/80">{maskUpi(upi)}</span>
                        )}
                        {!isRevealed && (
                          <button
                            onClick={() => {
                              pendingRevealKey.current = key;
                              setRevealModal({ label: 'UPI ID', real: upi, masked: maskUpi(upi) });
                            }}
                            className="shrink-0 text-[#859396] hover:text-amber-400 transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">visibility</span>
                          </button>
                        )}
                        {isRevealed && <span className="material-symbols-outlined text-[14px] text-emerald-400 shrink-0">check_circle</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Geo Footprint */}
          <div className="p-4 rounded bg-[#171b28] border border-[#3c494b]/30 space-y-2">
            <h5 className="font-label-caps text-[10px] text-[#36d9ed] flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">location_on</span>
              GEO FOOTPRINT ({activeEntity.knownLocations.length} locations)
            </h5>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
              {activeEntity.knownLocations.map((loc) => (
                <div key={loc} className="p-2 rounded bg-[#1b1f2c] border border-[#3c494b]/20 font-body-sm text-[12px] text-[#dfe2f4]">
                  {loc}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reveal Modal */}
      {revealModal && (
        <RevealModal
          label={revealModal.label}
          maskedValue={revealModal.masked}
          realValue={revealModal.real}
          onConfirm={confirmReveal}
          onClose={() => setRevealModal(null)}
        />
      )}
    </div>
  );
};
