import React, { useState } from 'react';
import type { CopilotMessage } from '../types/forensic';

interface CopilotViewProps {
  onNavigateTab?: (tab: string) => void;
}

export const CopilotView: React.FC<CopilotViewProps> = () => {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'MSG-1',
      sender: 'assistant',
      text: 'Police Nexus Copilot initialized. I have analyzed 6 ingested evidence files for Operation Shadow (PN-2026-001). How can I assist your investigation?',
      timestamp: 'Today, 10:45 AM',
      suggestedPrompts: [
        'Find tower co-location pings near Sector 43 ISBT',
        'Detect round-trip wire transfers over Rs 1,00,000',
        'List all burner SIMs associated with Vikram Sharma',
        'Summarize night call frequency between Target A and B'
      ]
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSendQuery = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: CopilotMessage = {
      id: 'MSG-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsProcessing(true);

    setTimeout(() => {
      let botResponseText = '';
      let queryResults: CopilotMessage['queryResults'];

      if (query.includes('co-location') || query.includes('Sector 43')) {
        botResponseText = 'Co-location analysis completed. Matched 2 suspects on Cell Tower #4301 (Sector 43 ISBT Main & South sectors):';
        queryResults = {
          type: 'table',
          headers: ['Suspect', 'Phone', 'Cell Tower', 'Timestamp', 'Duration'],
          rows: [
            ['Vikram "Shadow" Sharma', '+91 98765 43210', 'CHD-4301-A (Sector 43 ISBT)', '2026-08-17 02:14:05', '180 sec'],
            ['Rajesh Verma', '+91 91234 56789', 'CHD-4301-B (Sector 43 ISBT)', '2026-08-17 02:16:22', '420 sec']
          ]
        };
      } else if (query.includes('wire') || query.includes('round-trip') || query.includes('1,00,000')) {
        botResponseText = 'Financial flow analysis detected 3 high-risk transfers linking victim deposits to offshore entity Apex Trading UAE:';
        queryResults = {
          type: 'table',
          headers: ['Txn Ref', 'Sender', 'Receiver', 'Channel', 'Amount'],
          rows: [
            ['RTGS/HDFCR520260817001', 'Apex Trading Ltd (...8921)', 'Apex Trading UAE FZE', 'RTGS', 'Rs. 25,00,000'],
            ['IMPS/6239104421/MOB', 'Apex Trading Ltd (...8921)', 'Vikram Sharma VPA', 'IMPS', 'Rs. 8,50,000'],
            ['ATM/CHD-SEC17/CASH', 'Rajesh Verma SBI Card', 'ATM Sector 17 Chd', 'ATM Cash', 'Rs. 2,00,000']
          ]
        };
      } else if (query.includes('burner') || query.includes('SIM')) {
        botResponseText = 'Cross-referencing IMEI and activation records. Vikram Sharma is connected to 3 active mobile numbers across Airtel and Jio:';
        queryResults = {
          type: 'table',
          headers: ['Number', 'Carrier', 'SIM Type', 'Total Calls', 'Risk Status'],
          rows: [
            ['+91 98765 43210', 'Airtel', 'Primary SIM', '452 calls', 'Target A (High Risk)'],
            ['+91 98111 22233', 'Jio', 'Burner SIM', '124 calls', 'Forged Aadhaar'],
            ['+91 99000 88776', 'Airtel', 'Secondary SIM', '86 calls', 'Active']
          ]
        };
      } else {
        botResponseText = `I have parsed the evidence database for "${query}". Found 5 relevant timeline matches and 2 entity link connections in Operation Shadow.`;
        queryResults = {
          type: 'stat',
          stats: [
            { label: 'Evidence Matches', value: '5 events' },
            { label: 'Entity Confidence', value: '98%' },
            { label: 'Linked File', value: 'airtel_suspect_1_cdr.csv' }
          ]
        };
      }

      const botMsg: CopilotMessage = {
        id: 'MSG-' + (Date.now() + 1),
        sender: 'assistant',
        text: botResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        queryResults,
        suggestedPrompts: [
          'Generate Section 65B certificate for these findings',
          'Export evidence graph as PDF report'
        ]
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#1b1f2c] border border-[#3c494b]/20 rounded-lg">
      {/* Copilot Header */}
      <div className="px-6 py-4 border-b border-[#3c494b]/30 bg-[#172034] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[#6dedff]/20 text-[#6dedff] border border-[#6dedff]/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">smart_toy</span>
          </div>
          <div>
            <h3 className="font-headline-sm text-[16px] text-[#dfe2f4] font-bold">Forensic AI Copilot</h3>
            <p className="font-code-sm text-[11px] text-[#859396]">Natural Language Query Engine for Ingested Evidence</p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded bg-[#0f52ba]/20 text-[#6dedff] font-label-caps text-[10px] border border-[#0f52ba]/40">
          MODEL: FORENSIC-NEXUS-V3
        </span>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col max-w-3xl ${
              msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="font-label-caps text-[10px] text-[#859396]">
                {msg.sender === 'user' ? 'ANALYST (YOU)' : 'COPILOT AI'}
              </span>
              <span className="font-code-sm text-[10px] text-[#859396]">{msg.timestamp}</span>
            </div>

            <div
              className={`p-4 rounded-lg font-body-sm text-body-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#28d2e6] text-[#00363d] font-medium rounded-tr-none'
                  : 'bg-[#171b28] border border-[#3c494b]/30 text-[#dfe2f4] rounded-tl-none'
              }`}
            >
              <p>{msg.text}</p>

              {/* Render Query Table Results */}
              {msg.queryResults?.type === 'table' && msg.queryResults.headers && (
                <div className="mt-3 overflow-x-auto rounded border border-[#3c494b]/30 bg-[#0f131f] p-2">
                  <table className="w-full text-left font-code-sm text-[11px]">
                    <thead className="bg-[#172034] text-[#859396] border-b border-[#3c494b]/30">
                      <tr>
                        {msg.queryResults.headers.map((h, i) => (
                          <th key={i} className="px-3 py-1.5">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#3c494b]/20">
                      {msg.queryResults.rows?.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-[#1b1f2c]">
                          {row.map((cell: any, cIdx: number) => (
                            <td key={cIdx} className="px-3 py-1.5 text-[#dfe2f4] whitespace-nowrap">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Render Query Stat Results */}
              {msg.queryResults?.type === 'stat' && msg.queryResults.stats && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {msg.queryResults.stats.map((st, sIdx) => (
                    <div key={sIdx} className="p-2 rounded bg-[#0f131f] border border-[#3c494b]/20">
                      <span className="font-label-caps text-[9px] text-[#859396]">{st.label}</span>
                      <div className="font-code-sm text-[13px] text-[#6dedff] font-bold mt-0.5">{st.value}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Suggested Prompt Chips */}
            {msg.suggestedPrompts && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {msg.suggestedPrompts.map((p, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => handleSendQuery(p)}
                    className="px-2.5 py-1 rounded bg-[#303442] hover:bg-[#353946] text-[#6dedff] font-code-sm text-[11px] border border-[#3c494b]/40 transition-colors cursor-pointer"
                  >
                    💡 {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isProcessing && (
          <div className="flex items-center gap-2 text-[#6dedff] font-code-sm text-[12px]">
            <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
            Querying forensic database...
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-[#3c494b]/30 bg-[#172034]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuery();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask Copilot (e.g., 'Find all transfers from Apex Trading', 'Show co-location pings')..."
            className="flex-1 bg-[#1b1f2c] border border-[#3c494b]/40 text-[#dfe2f4] rounded px-4 py-2 font-body-sm text-body-sm focus:outline-none focus:border-[#6dedff]"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isProcessing}
            className="px-5 py-2 rounded bg-[#6dedff] text-[#00363d] font-label-caps text-label-caps font-bold hover:bg-[#95f1ff] transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
            QUERY
          </button>
        </form>
      </div>
    </div>
  );
};
