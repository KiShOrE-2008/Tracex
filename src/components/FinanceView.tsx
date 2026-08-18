import React from 'react';
import type { FinancialTxn } from '../types/forensic';

interface FinanceViewProps {
  txns: FinancialTxn[];
}

export const FinanceView: React.FC<FinanceViewProps> = ({ txns }) => {
  const totalVolume = txns.reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden space-y-4">
      {/* Top Financial Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 shrink-0">
        <div className="glass-panel p-4 rounded-lg">
          <span className="font-label-caps text-label-caps text-[#859396]">Total Analyzed Flow</span>
          <div className="font-headline-md text-headline-md text-[#6dedff] mt-1">
            Rs. {totalVolume.toLocaleString('en-IN')}
          </div>
          <span className="font-code-sm text-[11px] text-[#859396]">Across 5 financial channels</span>
        </div>

        <div className="glass-panel p-4 rounded-lg">
          <span className="font-label-caps text-label-caps text-[#ffb4ab]">Offshore Outflows</span>
          <div className="font-headline-md text-headline-md text-[#ffb4ab] mt-1">
            Rs. 25,00,000
          </div>
          <span className="font-code-sm text-[11px] text-[#ffb4ab]">Apex Trading UAE FZE (RTGS)</span>
        </div>

        <div className="glass-panel p-4 rounded-lg">
          <span className="font-label-caps text-label-caps text-[#e7d3ff]">Structured Inflows</span>
          <div className="font-headline-md text-headline-md text-[#e7d3ff] mt-1">
            42 Micro-VPAs
          </div>
          <span className="font-code-sm text-[11px] text-[#859396]">Under Rs. 1,00,000 threshold</span>
        </div>

        <div className="glass-panel p-4 rounded-lg">
          <span className="font-label-caps text-label-caps text-[#f59e0b]">Cash Withdrawals</span>
          <div className="font-headline-md text-headline-md text-[#f59e0b] mt-1">
            Rs. 2,00,000
          </div>
          <span className="font-code-sm text-[11px] text-[#859396]">ATM Sector 17, Chandigarh</span>
        </div>
      </div>

      {/* Visual Money Trail Layering Chart */}
      <div className="glass-panel p-5 rounded-lg shrink-0">
        <h3 className="font-title-lg text-title-lg text-[#dfe2f4] mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#6dedff] text-[20px]">account_tree</span>
          Money Layering & Fund Flow Visualizer
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#0f131f] p-4 rounded border border-[#3c494b]/30 items-center">
          {/* Step 1: Victims */}
          <div className="p-3 rounded bg-[#171b28] border border-[#3c494b]/30 space-y-2">
            <span className="font-label-caps text-[10px] text-[#859396]">1. INGESTION (VICTIM DEPOSITS)</span>
            <div className="p-2 rounded bg-[#1b1f2c] border border-[#3c494b]/20 text-[#dfe2f4] font-code-sm text-[11px]">
              Multiple Victim VPAs (42 micro-deposits)
              <div className="text-[#6dedff] font-bold mt-0.5">Rs. 4,11,600</div>
            </div>
          </div>

          {/* Step 2: Layering Hub */}
          <div className="p-3 rounded bg-[#28d2e6]/10 border border-[#28d2e6]/40 space-y-2 text-center">
            <span className="font-label-caps text-[10px] text-[#6dedff]">2. LAYERING HUB (SHELL ENTITY)</span>
            <div className="p-2 rounded bg-[#1b1f2c] border border-[#28d2e6]/50 text-[#dfe2f4] font-headline-sm text-[15px]">
              Apex Trading Ltd (HDFC ...8921)
              <div className="text-[#e7d3ff] font-bold text-[13px] mt-0.5">Consolidated Account</div>
            </div>
          </div>

          {/* Step 3: Outflows */}
          <div className="p-3 rounded bg-[#171b28] border border-[#3c494b]/30 space-y-2">
            <span className="font-label-caps text-[10px] text-[#ffb4ab]">3. INTEGRATION / DISPERSAL</span>
            <div className="p-2 rounded bg-[#1b1f2c] border border-[#93000a]/40 text-[#ffb4ab] font-code-sm text-[11px]">
              Apex Trading UAE (Offshore RTGS)
              <div className="font-bold">Rs. 25,00,000</div>
            </div>
            <div className="p-2 rounded bg-[#1b1f2c] border border-[#3c494b]/20 text-[#dfe2f4] font-code-sm text-[11px]">
              Vikram Sharma VPA (Promoter Siphoning)
              <div className="text-[#6dedff] font-bold">Rs. 8,50,000</div>
            </div>
          </div>
        </div>
      </div>

      {/* Flagged Transactions Table */}
      <div className="flex-1 bg-[#1b1f2c] border border-[#3c494b]/20 rounded-lg overflow-hidden flex flex-col min-h-[250px]">
        <div className="px-4 py-3 border-b border-[#3c494b]/30 bg-[#172034] font-title-lg text-[15px] text-[#dfe2f4] flex justify-between items-center">
          <span>High-Risk Flagged Financial Transactions</span>
          <span className="font-code-sm text-[11px] text-[#859396]">{txns.length} records</span>
        </div>

        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left font-body-sm text-body-sm">
            <thead className="bg-[#0f131f] text-[#859396] font-label-caps text-[10px] border-b border-[#3c494b]/20">
              <tr>
                <th className="px-4 py-2">REF ID & TIMESTAMP</th>
                <th className="px-4 py-2">SENDER & ACCOUNT</th>
                <th className="px-4 py-2">RECEIVER & ACCOUNT</th>
                <th className="px-4 py-2">CHANNEL</th>
                <th className="px-4 py-2">AMOUNT</th>
                <th className="px-4 py-2">RISK FLAG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3c494b]/10">
              {txns.map((t) => (
                <tr key={t.id} className="hover:bg-[#303442]/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-code-sm text-[12px] text-[#6dedff]">{t.txnRef}</div>
                    <div className="font-code-sm text-[10px] text-[#859396]">{t.timestamp}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-[#dfe2f4] font-medium">{t.sender}</div>
                    <div className="font-code-sm text-[10px] text-[#859396]">{t.senderAccount}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-[#dfe2f4] font-medium">{t.receiver}</div>
                    <div className="font-code-sm text-[10px] text-[#859396]">{t.receiverAccount}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded bg-[#0f131f] border border-[#3c494b]/30 font-code-sm text-[11px] text-[#36d9ed]">
                      {t.channel}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-[#e7d3ff]">
                    Rs. {t.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded bg-[#93000a]/20 text-[#ffb4ab] border border-[#93000a]/40 font-label-caps text-[9px]">
                      {t.riskFlag || 'FLAGGED'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
