import React, { useState } from 'react';
import type { EvidenceFile } from '../types/forensic';

interface ReportsViewProps {
  files: EvidenceFile[];
  caseId: string;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ files, caseId }) => {
  const [showCertificate, setShowCertificate] = useState(true);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden space-y-4">
      {/* Action Header */}
      <div className="glass-panel p-4 rounded-lg flex items-center justify-between gap-3 shrink-0">
        <div>
          <h3 className="font-title-lg text-title-lg text-[#dfe2f4]">Court-Ready Forensic Evidence Report</h3>
          <p className="font-code-sm text-[11px] text-[#859396]">
            Section 65B Information Technology Act compliance & SHA-256 chain-of-custody verification.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowCertificate(!showCertificate)}
            className="px-3 py-1.5 rounded bg-[#303442] text-[#dfe2f4] font-label-caps text-[11px] hover:bg-[#353946] transition-colors cursor-pointer"
          >
            {showCertificate ? 'Hide Sec 65B Draft' : 'Show Sec 65B Draft'}
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded bg-[#6dedff] text-[#00363d] font-label-caps text-label-caps font-bold hover:bg-[#95f1ff] transition-colors shadow-[0_0_12px_rgba(40,210,230,0.25)] flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            PRINT / EXPORT REPORT
          </button>
        </div>
      </div>

      {/* Printable Report Canvas */}
      <div className="flex-1 bg-[#1b1f2c] border border-[#3c494b]/20 rounded-lg overflow-y-auto p-8 space-y-6 text-[#dfe2f4] print:bg-white print:text-black">
        {/* Document Banner */}
        <div className="border-b-2 border-[#6dedff] pb-4 flex justify-between items-end">
          <div>
            <span className="font-label-caps text-[11px] text-[#6dedff] tracking-widest">
              CHANDIGARH POLICE • CYBER CRIME CELL
            </span>
            <h1 className="font-display-lg text-display-lg text-[#dfe2f4] mt-1">
              FORENSIC EXAMINATION REPORT
            </h1>
            <p className="font-code-sm text-[12px] text-[#859396]">CASE REFERENCE: {caseId} (Operation Shadow)</p>
          </div>
          <div className="text-right">
            <span className="px-3 py-1 rounded bg-[#0f52ba]/20 text-[#6dedff] font-code-sm text-[11px] font-bold border border-[#0f52ba]/40">
              CONFIDENTIAL / LAW ENFORCEMENT ONLY
            </span>
            <div className="font-code-sm text-[11px] text-[#859396] mt-2">Date: 18th August 2026</div>
          </div>
        </div>

        {/* Section 65B Certificate */}
        {showCertificate && (
          <div className="p-6 rounded bg-[#0f131f] border border-[#3c494b]/30 space-y-3">
            <h3 className="font-headline-sm text-[16px] text-[#6dedff] font-bold border-b border-[#3c494b]/20 pb-2">
              CERTIFICATE UNDER SECTION 65B OF THE INDIAN EVIDENCE ACT, 1872
            </h3>
            <p className="font-body-sm text-[13px] text-[#bbc9cc] leading-relaxed">
              I, <strong className="text-[#dfe2f4]">Inspector R. S. Gill</strong>, Cyber Crime Cell, Chandigarh Police, do hereby certify that:
            </p>
            <ol className="list-decimal list-inside font-body-sm text-[12px] text-[#bbc9cc] space-y-1.5 pl-2">
              <li>
                The electronic records detailed below were produced by Police Nexus Forensic Platform operating continuously and under strict security protocols.
              </li>
              <li>
                During the period over which the electronic records were created, the computer system was operating properly with integrity protection.
              </li>
              <li>
                Cryptographic SHA-256 hashes were calculated immediately upon ingestion and match the original physical storage media UFED image.
              </li>
            </ol>
          </div>
        )}

        {/* Ingested Evidence Hash Table */}
        <div className="space-y-3">
          <h3 className="font-headline-sm text-[16px] text-[#dfe2f4] font-bold border-b border-[#3c494b]/30 pb-1">
            1. Ingested Evidence Files & Cryptographic Proofs ({files.length})
          </h3>
          <div className="overflow-x-auto rounded border border-[#3c494b]/30 bg-[#0f131f]">
            <table className="w-full text-left font-code-sm text-[11px]">
              <thead className="bg-[#172034] text-[#859396] border-b border-[#3c494b]/30">
                <tr>
                  <th className="px-3 py-2">EVIDENCE ID</th>
                  <th className="px-3 py-2">FILE NAME</th>
                  <th className="px-3 py-2">SCHEMA</th>
                  <th className="px-3 py-2">SHA-256 HASH</th>
                  <th className="px-3 py-2">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3c494b]/20">
                {files.map((f) => (
                  <tr key={f.id} className="hover:bg-[#1b1f2c]">
                    <td className="px-3 py-2 text-[#6dedff] font-bold">{f.id}</td>
                    <td className="px-3 py-2 text-[#dfe2f4]">{f.name}</td>
                    <td className="px-3 py-2 text-[#36d9ed]">{f.schema}</td>
                    <td className="px-3 py-2 text-[#859396] break-all max-w-[240px]">{f.sha256}</td>
                    <td className="px-3 py-2 text-emerald-400 font-bold">VERIFIED</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Executive Findings */}
        <div className="space-y-3">
          <h3 className="font-headline-sm text-[16px] text-[#dfe2f4] font-bold border-b border-[#3c494b]/30 pb-1">
            2. Core Investigative Findings Summary
          </h3>
          <ul className="list-disc list-inside font-body-sm text-[13px] text-[#bbc9cc] space-y-2">
            <li>
              <strong className="text-[#dfe2f4]">Cell Tower Co-Location:</strong> Target Vikram Sharma (+91 98765 43210) and Target Rajesh Verma (+91 91234 56789) hit adjacent sectors of Cell Site #4301 (Sector 43 ISBT) simultaneously at 02:14 AM on 17-Aug-2026.
            </li>
            <li>
              <strong className="text-[#dfe2f4]">Financial Layering:</strong> 42 micro-deposits totaling Rs. 4,11,600 into VPA <code className="text-[#6dedff]">apex.trading@icici</code> consolidated into HDFC Account ...8921 and wired overseas to Apex Trading UAE FZE (Rs. 25,00,000 RTGS).
            </li>
            <li>
              <strong className="text-[#dfe2f4]">UFED WhatsApp Extraction:</strong> Decrypted directive instructs cash-box clearance before 4 PM to Mohali drop point.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
