import { useState } from 'react';
import type { EntityDNA } from '../types/forensic';

interface EntityDnaViewProps {
  entities: EntityDNA[];
  initialSelectedName?: string;
  onOpenGraphForEntity?: (name: string) => void;
}

export const EntityDnaView = ({
  entities,
  initialSelectedName,
  onOpenGraphForEntity
}: EntityDnaViewProps) => {
  const [selectedId, setSelectedId] = useState<string>(() => {
    if (initialSelectedName) {
      const match = entities.find(e => e.name.toLowerCase().includes(initialSelectedName.toLowerCase()));
      if (match) return match.id;
    }
    return entities[0]?.id || 'DNA-01';
  });

  const activeEntity = entities.find(e => e.id === selectedId) || entities[0];

  return (
    <div className="flex-1 flex gap-4 h-full overflow-hidden">
      {/* Left List of Suspect Profiles */}
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

      {/* Right Detailed 360 Dossier */}
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

          {/* Identifiers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Phone Numbers */}
            <div className="p-4 rounded bg-[#171b28] border border-[#3c494b]/30 space-y-2">
              <h5 className="font-label-caps text-[10px] text-[#6dedff] flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">call</span>
                LINKED PHONE NUMBERS ({activeEntity.phoneNumbers.length})
              </h5>
              <div className="space-y-1">
                {activeEntity.phoneNumbers.map((ph) => (
                  <div key={ph} className="p-2 rounded bg-[#1b1f2c] border border-[#3c494b]/20 font-code-sm text-[12px] text-[#dfe2f4]">
                    {ph}
                  </div>
                ))}
              </div>
            </div>

            {/* Bank Accounts */}
            <div className="p-4 rounded bg-[#171b28] border border-[#3c494b]/30 space-y-2">
              <h5 className="font-label-caps text-[10px] text-[#e7d3ff] flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">account_balance</span>
                BANK ACCOUNTS ({activeEntity.bankAccounts.length})
              </h5>
              <div className="space-y-1">
                {activeEntity.bankAccounts.map((acc) => (
                  <div key={acc} className="p-2 rounded bg-[#1b1f2c] border border-[#3c494b]/20 font-code-sm text-[12px] text-[#dfe2f4]">
                    {acc}
                  </div>
                ))}
              </div>
            </div>

            {/* Locations */}
            <div className="p-4 rounded bg-[#171b28] border border-[#3c494b]/30 space-y-2">
              <h5 className="font-label-caps text-[10px] text-[#36d9ed] flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">location_on</span>
                GEO FOOTPRINT ({activeEntity.knownLocations.length})
              </h5>
              <div className="space-y-1">
                {activeEntity.knownLocations.map((loc) => (
                  <div key={loc} className="p-2 rounded bg-[#1b1f2c] border border-[#3c494b]/20 font-body-sm text-[12px] text-[#dfe2f4]">
                    {loc}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
