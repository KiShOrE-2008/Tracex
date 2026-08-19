import { useState } from 'react';
import type { TimelineEvent, EventCategory } from '../types/forensic';

interface TimelineViewProps {
  events: TimelineEvent[];
}

export const TimelineView = ({ events }: TimelineViewProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>('TL-101');

  const filteredEvents = events.filter((e) => {
    if (selectedCategory !== 'ALL' && e.category !== selectedCategory) return false;
    if (riskFilter !== 'ALL' && e.riskLevel !== riskFilter) return false;
    if (
      searchQuery &&
      !e.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !e.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !e.sourceEntity.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const categoryIcons: Record<EventCategory, string> = {
    call: 'call',
    sms: 'chat_bubble',
    upi: 'qr_code',
    bank: 'account_balance',
    location: 'location_on',
    chat: 'forum'
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden space-y-3">
      {/* Top Filter Bar */}
      <div className="glass-panel p-3 rounded-lg flex flex-wrap items-center justify-between gap-3 shrink-0">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="font-label-caps text-label-caps text-[#859396] mr-1">Category:</span>
          {[
            { id: 'ALL', label: 'All Events' },
            { id: 'call', label: 'CDR Calls' },
            { id: 'upi', label: 'UPI Logs' },
            { id: 'bank', label: 'Bank Wires' },
            { id: 'location', label: 'Cell Locations' },
            { id: 'chat', label: 'Decrypted Chats' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded font-label-caps text-[10px] transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-[#6dedff] text-[#00363d] font-bold'
                  : 'bg-[#303442] text-[#859396] hover:text-[#dfe2f4]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Risk & Search */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="font-label-caps text-[10px] text-[#859396]">Risk:</span>
            {['ALL', 'high', 'medium', 'low'].map((r) => (
              <button
                key={r}
                onClick={() => setRiskFilter(r)}
                className={`px-2 py-0.5 rounded font-code-sm text-[10px] uppercase transition-colors cursor-pointer ${
                  riskFilter === r ? 'bg-[#ffb4ab] text-[#690005] font-bold' : 'bg-[#1b1f2c] text-[#859396]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Filter timeline..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#1b1f2c] border border-[#3c494b]/40 text-[#dfe2f4] text-[12px] px-2.5 py-1 rounded w-36 focus:outline-none focus:border-[#6dedff]"
          />
        </div>
      </div>

      {/* Events List */}
      <div className="flex-1 bg-[#1b1f2c] border border-[#3c494b]/20 rounded-lg overflow-y-auto p-4 space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="text-center text-[#859396] font-body-sm py-12">
            No timeline events match the selected criteria.
          </div>
        ) : (
          filteredEvents.map((evt) => {
            const isExpanded = expandedId === evt.id;
            const isHighRisk = evt.riskLevel === 'high';

            return (
              <div
                key={evt.id}
                onClick={() => setExpandedId(isExpanded ? null : evt.id)}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  isHighRisk
                    ? 'bg-[#171b28] border-[#93000a]/40 hover:border-[#ffb4ab]/60'
                    : 'bg-[#171b28] border-[#3c494b]/30 hover:border-[#6dedff]/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded flex items-center justify-center shrink-0 ${
                        isHighRisk ? 'bg-[#93000a]/20 text-[#ffb4ab]' : 'bg-[#28d2e6]/20 text-[#6dedff]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {categoryIcons[evt.category] || 'event'}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-headline-sm text-[15px] font-semibold text-[#dfe2f4] truncate">
                          {evt.title}
                        </h4>
                        <span
                          className={`px-2 py-0.5 rounded font-label-caps text-[9px] ${
                            isHighRisk ? 'bg-[#93000a]/30 text-[#ffb4ab]' : 'bg-[#303442] text-[#859396]'
                          }`}
                        >
                          {evt.riskLevel.toUpperCase()} RISK
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-[#bbc9cc] mt-1">{evt.description}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-code-sm text-[12px] text-[#6dedff] font-semibold">
                      {evt.timestamp}
                    </span>
                    {evt.amount && (
                      <div className="font-headline-sm text-[15px] text-[#e7d3ff] mt-0.5">
                        Rs. {evt.amount.toLocaleString('en-IN')}
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-[#3c494b]/30 grid grid-cols-1 md:grid-cols-3 gap-3 font-body-sm text-[12px]">
                    <div className="p-2 rounded bg-[#0f131f] border border-[#3c494b]/20">
                      <span className="font-label-caps text-[9px] text-[#859396]">SOURCE ENTITY</span>
                      <div className="text-[#dfe2f4] font-medium mt-0.5">{evt.sourceEntity}</div>
                    </div>
                    <div className="p-2 rounded bg-[#0f131f] border border-[#3c494b]/20">
                      <span className="font-label-caps text-[9px] text-[#859396]">TARGET ENTITY</span>
                      <div className="text-[#dfe2f4] font-medium mt-0.5">{evt.targetEntity}</div>
                    </div>
                    <div className="p-2 rounded bg-[#0f131f] border border-[#3c494b]/20">
                      <span className="font-label-caps text-[9px] text-[#859396]">SOURCE EVIDENCE FILE</span>
                      <div className="text-[#6dedff] font-code-sm mt-0.5">{evt.evidenceFileId}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
