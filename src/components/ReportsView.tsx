import { useState } from 'react';
import type { EvidenceFile } from '../types/forensic';
import {
  MOCK_TOWER_PINGS,
  MOCK_FINANCIAL_TXNS,
  MOCK_ENTITY_DNA,
  MOCK_TIMELINE_EVENTS,
  MOCK_ALERTS,
  MOCK_CORRELATIONS,
  MOCK_SOCIAL_POSTS
} from '../data/mockForensicData';

interface ReportsViewProps {
  files: EvidenceFile[];
  caseId: string;
}

export const ReportsView = ({ files, caseId }: ReportsViewProps) => {
  const [showCertificate, setShowCertificate] = useState(true);
  const [includeFileDetails, setIncludeFileDetails] = useState(true);
  const [includeTowerLogs, setIncludeTowerLogs] = useState(true);
  const [includeFinanceLogs, setIncludeFinanceLogs] = useState(true);
  const [includeAlerts, setIncludeAlerts] = useState(true);
  const [includeCorrelations, setIncludeCorrelations] = useState(true);
  const [includeSocialMedia, setIncludeSocialMedia] = useState(true);
  const [includeSuspectDossier, setIncludeSuspectDossier] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | '65b' | 'files' | 'alerts' | 'correlation' | 'geo' | 'finance' | 'social'>('all');
  const [expandedFileId, setExpandedFileId] = useState<string | null>('EV-1001');

  const handlePrint = () => {
    window.print();
  };

  // Download legal Sec 65B Certificate text file
  const handleDownloadTxt = () => {
    const activeAlertsCount = MOCK_ALERTS.filter(a => !a.isDismissed).length;
    const certText = `
CHANDIGARH POLICE • CYBER CRIME CELL
FORENSIC EXAMINATION REPORT & SECTION 65B CERTIFICATE
CASE REFERENCE: ${caseId} (Operation Shadow)
DATE OF ISSUANCE: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}

================================================================================
CERTIFICATE UNDER SECTION 65B OF THE INDIAN EVIDENCE ACT, 1872
(Corresponding to Section 63 of Bharatiya Sakshya Adhiniyam, 2023)
================================================================================

I, Inspector R. S. Gill, Cyber Crime Cell, Chandigarh Police, do hereby certify that:

1. The electronic records detailed in Schedule 'A' below were ingested and analyzed by the Police Nexus Forensic Platform (v3.0.0) operating continuously under strict chain-of-custody protocols.
2. During the period over which the electronic records were created and ingested, the forensic computer system was operating properly without unauthorized alteration or tampering.
3. Cryptographic SHA-256 hashes were calculated immediately upon physical extraction and match the master UFED bit-stream disk images.

SCHEDULE 'A': INGESTED FORENSIC EVIDENCE FILES (${files.length} ITEMS)
--------------------------------------------------------------------------------
${files.map((f, i) => `${i + 1}. [${f.id}] ${f.name}
   - Type / Schema : ${f.type} / ${f.schema}
   - Size & Rows   : ${f.sizeMb} MB | ${f.rowCount} rows
   - SHA-256 Hash  : ${f.sha256}
   - Confidence    : ${f.confidence}% | Status: VERIFIED
`).join('\n')}

================================================================================
CORE INVESTIGATIVE & CROSS-DOMAIN CORRELATION FINDINGS SUMMARY
================================================================================
- Auto-Detected Anomaly Alerts: ${activeAlertsCount} Active Critical & High severity alerts logged across CDR, Banking, Social Media, IP, and Geospatial channels.
- Primary Suspect Correlation (Vikram Sharma ↔ Rajesh Verma): 91/100 Connection Strength supported by 142 CDR calls, 3 tower co-locations (Sector 43 ISBT @ 02:14 AM), ₹85,000 UPI transfer, shared ProtonVPN IP session, and Instagram DM directive (@shadow01).
- Offshore Financial Layering: 42 micro-deposits (₹4,11,600) into apex.trading@icici debited via HDFC Account ...8921 to Apex Trading UAE FZE (₹25,00,000 RTGS).
- Social Media OSINT: 15 scraped posts / decrypted messages across Instagram, Twitter, and WhatsApp exports linking suspects to common IP 103.24.88.12.

CERTIFIED BY:
Inspector R. S. Gill (ID: PN-789)
Lead Forensic Examiner, Cyber Crime Cell, Chandigarh
Cryptographic Integrity Verification Hash: 9b8a7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b
`.trim();

    const blob = new Blob([certText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Sec65B_Certificate_${caseId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Download complete JSON evidence dossier
  const handleDownloadJson = () => {
    const dataObj = {
      caseId,
      title: 'Operation Shadow - Cyber & Financial Forensics Examination',
      generatedAt: new Date().toISOString(),
      authority: 'Chandigarh Police Cyber Crime Cell',
      evidenceFiles: files,
      anomalyAlerts: MOCK_ALERTS,
      correlationMatrix: MOCK_CORRELATIONS,
      socialMediaPosts: MOCK_SOCIAL_POSTS,
      coLocationTowerLogs: MOCK_TOWER_PINGS,
      financialFlowLogs: MOCK_FINANCIAL_TXNS,
      suspectDossiers: MOCK_ENTITY_DNA,
      timelineEvents: MOCK_TIMELINE_EVENTS
    };

    const blob = new Blob([JSON.stringify(dataObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Forensic_Evidence_Report_${caseId}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden space-y-4 select-none print:h-auto print:overflow-visible print:block print:w-full">
      {/* Top Action Header & Controls */}
      <div className="glass-panel p-4 rounded-xl flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="material-symbols-outlined text-[#6dedff] text-[20px]">description</span>
            <h3 className="font-title-lg text-title-lg text-[#dfe2f4] font-bold">Court-Ready Forensic Evidence Report</h3>
          </div>
          <p className="font-code-sm text-[11px] text-[#859396]">
            Section 65B IT Act Compliance • Cryptographic SHA-256 Chain of Custody Audit
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadTxt}
            className="px-3 py-1.5 rounded-lg bg-[#181d2f] hover:bg-[#21273d] text-[#6dedff] border border-[#6dedff]/30 font-label-caps text-[10.5px] font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Download Legal Text Certificate"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            Sec 65B (.TXT)
          </button>

          <button
            onClick={handleDownloadJson}
            className="px-3 py-1.5 rounded-lg bg-[#181d2f] hover:bg-[#21273d] text-[#e7d3ff] border border-[#e7d3ff]/30 font-label-caps text-[10.5px] font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Download Complete Forensic JSON Dossier"
          >
            <span className="material-symbols-outlined text-[16px]">data_object</span>
            Export JSON
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#6dedff] to-[#28d2e6] text-[#00363d] font-label-caps text-[11px] font-extrabold hover:from-[#95f1ff] hover:to-[#6dedff] transition-all shadow-[0_0_20px_rgba(40,210,230,0.35)] hover:shadow-[0_0_25px_rgba(40,210,230,0.6)] flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            PRINT / EXPORT PDF
          </button>
        </div>
      </div>

      {/* Section Filter Toggles & View Selector */}
      <div className="glass-panel p-3 rounded-xl flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden">
        {/* Section View Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto">
          <span className="font-label-caps text-[10px] text-[#859396] mr-1">VIEW:</span>
          {[
            { id: 'all', label: 'Full Dossier (Complete)' },
            { id: '65b', label: 'Sec 65B Certificate' },
            { id: 'files', label: 'Evidence Audit' },
            { id: 'alerts', label: 'Anomalies & Alerts' },
            { id: 'correlation', label: 'Cross-Correlation' },
            { id: 'geo', label: 'Tower Co-Location' },
            { id: 'finance', label: 'Financial Trail' },
            { id: 'social', label: 'Social Media OSINT' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-1 rounded-md font-label-caps text-[10px] transition-all cursor-pointer whitespace-nowrap ${
                activeTab === t.id
                  ? 'bg-gradient-to-r from-[#6dedff] to-[#28d2e6] text-[#00363d] font-extrabold shadow-[0_0_10px_rgba(40,210,230,0.3)]'
                  : 'bg-[#181d2f] text-[#859396] hover:text-[#dfe2f4] hover:bg-[#21273d]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Checkbox Section Filters */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-body-sm text-[#bbc9cc]">
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#dfe2f4]">
            <input
              type="checkbox"
              checked={showCertificate}
              onChange={(e) => setShowCertificate(e.target.checked)}
              className="accent-[#6dedff]"
            />
            Sec 65B Draft
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#dfe2f4]">
            <input
              type="checkbox"
              checked={includeFileDetails}
              onChange={(e) => setIncludeFileDetails(e.target.checked)}
              className="accent-[#6dedff]"
            />
            File Extractions
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#dfe2f4]">
            <input
              type="checkbox"
              checked={includeAlerts}
              onChange={(e) => setIncludeAlerts(e.target.checked)}
              className="accent-[#6dedff]"
            />
            Anomalies
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#dfe2f4]">
            <input
              type="checkbox"
              checked={includeCorrelations}
              onChange={(e) => setIncludeCorrelations(e.target.checked)}
              className="accent-[#6dedff]"
            />
            Correlations
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#dfe2f4]">
            <input
              type="checkbox"
              checked={includeTowerLogs}
              onChange={(e) => setIncludeTowerLogs(e.target.checked)}
              className="accent-[#6dedff]"
            />
            Tower Pings
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#dfe2f4]">
            <input
              type="checkbox"
              checked={includeFinanceLogs}
              onChange={(e) => setIncludeFinanceLogs(e.target.checked)}
              className="accent-[#6dedff]"
            />
            Money Flow
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#dfe2f4]">
            <input
              type="checkbox"
              checked={includeSocialMedia}
              onChange={(e) => setIncludeSocialMedia(e.target.checked)}
              className="accent-[#6dedff]"
            />
            Social OSINT
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#dfe2f4]">
            <input
              type="checkbox"
              checked={includeSuspectDossier}
              onChange={(e) => setIncludeSuspectDossier(e.target.checked)}
              className="accent-[#6dedff]"
            />
            Suspect Profiles
          </label>
        </div>
      </div>

      {/* Printable Court-Ready Report Canvas */}
      <div className="flex-1 bg-[#1b1f2c] border border-[#3c494b]/20 rounded-xl overflow-y-auto p-8 space-y-8 text-[#dfe2f4] print:p-0 print:overflow-visible print:bg-white print:text-black print:border-none print:shadow-none print:w-full print:max-w-full print:block shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        
        {/* Official Header Banner */}
        <div className="border-b-2 border-[#6dedff] pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4 print:border-black">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-[#6dedff] text-[24px] print:text-black">shield</span>
              <span className="font-label-caps text-[11px] text-[#6dedff] tracking-widest font-extrabold print:text-black">
                CHANDIGARH POLICE • CYBER CRIME CELL
              </span>
            </div>
            <h1 className="font-display-lg text-[26px] font-extrabold text-[#dfe2f4] tracking-tight print:text-black">
              FORENSIC EXAMINATION & EVIDENCE REPORT
            </h1>
            <p className="font-code-sm text-[12px] text-[#859396] mt-0.5 print:text-gray-700">
              CASE REFERENCE: <span className="text-[#6dedff] font-bold print:text-black">{caseId}</span> (Operation Shadow)
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0">
            <span className="px-3 py-1 rounded bg-[#0f52ba]/20 text-[#6dedff] font-code-sm text-[11px] font-bold border border-[#0f52ba]/40 print:border-black print:text-black print:bg-gray-100">
              CONFIDENTIAL / LAW ENFORCEMENT ONLY
            </span>
            <div className="font-code-sm text-[11px] text-[#859396] print:text-gray-700">
              Generated: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} • {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* SECTION 1: Legal Section 65B Certificate */}
        {(activeTab === 'all' || activeTab === '65b') && showCertificate && (
          <div className="p-6 rounded-xl bg-[#0f131f] border border-[#6dedff]/30 space-y-4 print:bg-white print:border-black print:p-4">
            <div className="flex items-center justify-between border-b border-[#3c494b]/30 pb-3 print:border-black">
              <h3 className="font-headline-sm text-[16px] text-[#6dedff] font-bold flex items-center gap-2 print:text-black">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                CERTIFICATE UNDER SECTION 65B OF THE INDIAN EVIDENCE ACT, 1872
              </h3>
              <span className="font-code-sm text-[10px] text-[#859396] print:text-black">
                (Corresponding to Sec 63, BSA 2023)
              </span>
            </div>

            <p className="font-body-sm text-[13px] text-[#bbc9cc] leading-relaxed print:text-black">
              I, <strong className="text-[#dfe2f4] print:text-black">Inspector R. S. Gill</strong>, Cyber Crime Cell, Chandigarh Police, hereby certify that:
            </p>

            <ol className="list-decimal list-inside font-body-sm text-[12.5px] text-[#bbc9cc] space-y-2 pl-2 print:text-black">
              <li>
                The electronic records detailed in this report were generated and processed by the <strong>Police Nexus Forensic Platform (v3.0.0)</strong> operating continuously under strict chain-of-custody protocols.
              </li>
              <li>
                During the entire period of ingestion and analysis, the computer systems and cryptographic hashing modules operated properly with integrity protection.
              </li>
              <li>
                Cryptographic <strong>SHA-256 hashes</strong> were calculated immediately upon physical image extraction and strictly match the master UFED bit-stream storage media.
              </li>
            </ol>

            <div className="pt-2 flex justify-between items-center text-[11px] font-code-sm text-[#859396] border-t border-[#3c494b]/20 print:border-black print:text-black">
              <span>Certifying Officer: Insp. R. S. Gill (ID: PN-789)</span>
              <span>Integrity Hash: 9b8a7c6d5e4f3a2b1c0d9e8f7a6b5c4d</span>
            </div>
          </div>
        )}

        {/* SECTION 2: Ingested Evidence Cryptographic Hash Audit Table */}
        {(activeTab === 'all' || activeTab === 'files') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#3c494b]/30 pb-2 print:border-black">
              <h3 className="font-headline-sm text-[16px] text-[#dfe2f4] font-bold flex items-center gap-2 print:text-black">
                <span className="material-symbols-outlined text-[#6dedff] text-[18px] print:text-black">inventory_2</span>
                1. Ingested Evidence Files & SHA-256 Cryptographic Audit ({files.length} Files)
              </h3>
              <span className="px-2.5 py-0.5 rounded bg-[#181d2f] text-[#6dedff] font-code-sm text-[10px] font-bold border border-[#6dedff]/30 print:text-black print:border-black">
                100% SHA-256 VERIFIED
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#3c494b]/30 bg-[#0f131f] print:bg-white print:border-black">
              <table className="w-full text-left font-code-sm text-[11px]">
                <thead className="bg-[#172034] text-[#859396] border-b border-[#3c494b]/30 print:bg-gray-100 print:text-black print:border-black">
                  <tr>
                    <th className="px-4 py-2.5">EVIDENCE ID</th>
                    <th className="px-4 py-2.5">FILE NAME</th>
                    <th className="px-4 py-2.5">TYPE / SCHEMA</th>
                    <th className="px-4 py-2.5">SIZE / ROWS</th>
                    <th className="px-4 py-2.5">SHA-256 HASH PROOF</th>
                    <th className="px-4 py-2.5 text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3c494b]/20 print:divide-gray-300">
                  {files.map((f) => (
                    <tr key={f.id} className="hover:bg-[#1b1f2c] print:hover:bg-transparent">
                      <td className="px-4 py-2.5 text-[#6dedff] font-bold print:text-black">{f.id}</td>
                      <td className="px-4 py-2.5 text-[#dfe2f4] font-medium print:text-black">{f.name}</td>
                      <td className="px-4 py-2.5 text-[#36d9ed] print:text-black">{f.type} ({f.schema})</td>
                      <td className="px-4 py-2.5 text-[#bbc9cc] print:text-black">{f.sizeMb} MB | {f.rowCount} rows</td>
                      <td className="px-4 py-2.5 text-[#859396] font-mono break-all max-w-[200px] print:text-black">{f.sha256}</td>
                      <td className="px-4 py-2.5 text-right text-emerald-400 font-bold print:text-black">
                        ✓ VERIFIED ({f.confidence}%)
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 3: Itemized Evidence File Breakdown & Extractions */}
        {(activeTab === 'all' || activeTab === 'files') && includeFileDetails && (
          <div className="space-y-4">
            <h3 className="font-headline-sm text-[16px] text-[#dfe2f4] font-bold border-b border-[#3c494b]/30 pb-2 print:border-black print:text-black">
              2. Detailed Evidence File Extractions & Schema Analysis
            </h3>

            <div className="space-y-3">
              {files.map((f) => {
                const isExpanded = expandedFileId === f.id;
                return (
                  <div
                    key={f.id}
                    className="p-4 rounded-xl bg-[#0f131f] border border-[#3c494b]/30 space-y-3 print:bg-white print:border-black"
                  >
                    <div
                      onClick={() => setExpandedFileId(isExpanded ? null : f.id)}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#6dedff] text-[20px] print:text-black">folder_open</span>
                        <div>
                          <h4 className="font-body-md text-[14px] font-bold text-[#dfe2f4] print:text-black">
                            {f.name} <span className="font-code-sm text-[11px] text-[#6dedff] font-normal print:text-black">({f.id})</span>
                          </h4>
                          <p className="font-code-sm text-[11px] text-[#859396] print:text-black">
                            Type: {f.type} • Uploaded: {f.uploadedAt} • Confidence: {f.confidence}%
                          </p>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-[#859396] text-[18px] print:hidden">
                        {isExpanded ? 'expand_less' : 'expand_more'}
                      </span>
                    </div>

                    {isExpanded && (
                      <div className="pt-3 border-t border-[#3c494b]/20 space-y-3 print:border-black">
                        {/* Analyst Notes */}
                        <div className="p-3 rounded-lg bg-[#171b28] border border-[#3c494b]/30 print:bg-gray-50 print:border-black">
                          <span className="font-label-caps text-[10px] text-[#6dedff] block mb-1 print:text-black">ANALYST FORENSIC NOTES</span>
                          <p className="font-body-sm text-[12.5px] text-[#bbc9cc] leading-relaxed print:text-black">
                            {f.notes || 'Ingested binary/document file. Cryptographic SHA-256 verification complete.'}
                          </p>
                        </div>

                        {/* Parsed Columns */}
                        {f.parsedColumns && f.parsedColumns.length > 0 && (
                          <div>
                            <span className="font-label-caps text-[10px] text-[#859396] block mb-1.5 print:text-black">DETECTED COLUMN SCHEMA ({f.parsedColumns.length} COLUMNS)</span>
                            <div className="flex flex-wrap gap-1.5">
                              {f.parsedColumns.map((col) => (
                                <span key={col} className="px-2 py-0.5 rounded bg-[#181d2f] border border-[#3c494b]/40 font-code-sm text-[10.5px] text-[#36d9ed] print:bg-gray-100 print:text-black print:border-black">
                                  {col}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Sample Rows Preview */}
                        {f.sampleRows && f.sampleRows.length > 0 && (
                          <div>
                            <span className="font-label-caps text-[10px] text-[#859396] block mb-1.5 print:text-black">PARSED RECORD SAMPLE PREVIEW</span>
                            <div className="overflow-x-auto rounded-lg border border-[#3c494b]/30 bg-[#131726] print:bg-white print:border-black">
                              <table className="w-full text-left font-code-sm text-[10.5px]">
                                <thead className="bg-[#172034] text-[#859396] border-b border-[#3c494b]/30 print:bg-gray-100 print:text-black">
                                  <tr>
                                    {Object.keys(f.sampleRows[0]).map((key) => (
                                      <th key={key} className="px-3 py-1.5 whitespace-nowrap">{key}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-[#3c494b]/20 print:divide-gray-300">
                                  {f.sampleRows.map((row, rIdx) => (
                                    <tr key={rIdx}>
                                      {Object.values(row).map((val: any, cIdx) => (
                                        <td key={cIdx} className="px-3 py-1.5 whitespace-nowrap text-[#dfe2f4] print:text-black">
                                          {String(val)}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* NEW SECTION 4: Anomaly Detection & Auto-Detected Alerts */}
        {(activeTab === 'all' || activeTab === 'alerts') && includeAlerts && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#3c494b]/30 pb-2 print:border-black">
              <h3 className="font-headline-sm text-[16px] text-red-300 font-bold flex items-center gap-2 print:text-black">
                <span className="material-symbols-outlined text-red-400 text-[18px] print:text-black">crisis_alert</span>
                3. Automated Anomaly Detections & Alert Audit Log ({MOCK_ALERTS.length} Alerts)
              </h3>
              <span className="px-2.5 py-0.5 rounded bg-red-500/15 text-red-300 border border-red-500/30 font-label-caps text-[10px] font-bold print:text-black print:border-black">
                ANOMALY AUDIT
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#3c494b]/30 bg-[#0f131f] print:bg-white print:border-black">
              <table className="w-full text-left font-code-sm text-[11px]">
                <thead className="bg-[#172034] text-[#859396] border-b border-[#3c494b]/30 print:bg-gray-100 print:text-black">
                  <tr>
                    <th className="px-3 py-2">ALERT ID</th>
                    <th className="px-3 py-2">SEVERITY / DOMAIN</th>
                    <th className="px-3 py-2">TITLE & DESCRIPTION</th>
                    <th className="px-3 py-2">TIMESTAMP</th>
                    <th className="px-3 py-2">TARGET ENTITIES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3c494b]/20 print:divide-gray-300">
                  {MOCK_ALERTS.map((alert) => (
                    <tr key={alert.id} className={alert.severity === 'CRITICAL' ? 'bg-red-500/10 print:bg-gray-50' : ''}>
                      <td className="px-3 py-2 text-red-400 font-bold print:text-black">{alert.id}</td>
                      <td className="px-3 py-2">
                        <span className="font-bold print:text-black">{alert.severity}</span>
                        <span className="text-[#859396] block text-[10px] print:text-black">[{alert.category}]</span>
                      </td>
                      <td className="px-3 py-2">
                        <div className="text-[#dfe2f4] font-semibold print:text-black">{alert.title}</div>
                        <div className="text-[#bbc9cc] text-[10.5px] print:text-black">{alert.body}</div>
                      </td>
                      <td className="px-3 py-2 text-[#859396] whitespace-nowrap print:text-black">{alert.timestamp}</td>
                      <td className="px-3 py-2 text-[#6dedff] print:text-black">{alert.relatedEntities.join(', ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* NEW SECTION 5: Cross-Domain Correlation Analysis ("WHY ARE THESE CONNECTED?") */}
        {(activeTab === 'all' || activeTab === 'correlation') && includeCorrelations && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#3c494b]/30 pb-2 print:border-black">
              <h3 className="font-headline-sm text-[16px] text-[#6dedff] font-bold flex items-center gap-2 print:text-black">
                <span className="material-symbols-outlined text-[#6dedff] text-[18px] print:text-black">link</span>
                4. Cross-Domain Correlation Matrix — Why Entities Are Connected
              </h3>
              <span className="px-2.5 py-0.5 rounded bg-[#6dedff]/15 text-[#6dedff] border border-[#6dedff]/30 font-label-caps text-[10px] font-bold print:text-black print:border-black">
                CORRELATION AUDIT
              </span>
            </div>

            <div className="space-y-3">
              {MOCK_CORRELATIONS.map((c) => (
                <div key={c.id} className="p-4 rounded-xl bg-[#0f131f] border border-[#3c494b]/30 space-y-3 print:bg-white print:border-black">
                  <div className="flex items-center justify-between border-b border-[#3c494b]/20 pb-2 print:border-black">
                    <div className="flex items-center gap-2">
                      <span className="font-body-md text-[14px] font-bold text-[#dfe2f4] print:text-black">{c.entityA}</span>
                      <span className="text-[#6dedff] font-bold print:text-black">←────────→</span>
                      <span className="font-body-md text-[14px] font-bold text-[#dfe2f4] print:text-black">{c.entityB}</span>
                    </div>
                    <span className="px-3 py-1 rounded bg-[#6dedff]/20 text-[#6dedff] font-code-sm text-[12px] font-bold border border-[#6dedff]/40 print:text-black print:border-black">
                      SCORE: {c.score} / 100 ({c.verdict})
                    </span>
                  </div>

                  <div>
                    <span className="font-label-caps text-[10px] text-[#859396] block mb-2 print:text-black">SUPPORTED BY {c.evidenceSources.length} INDEPENDENT EVIDENCE SOURCES</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {c.evidenceSources.map((src, idx) => (
                        <div key={idx} className="p-2.5 rounded bg-[#171b28] border border-[#3c494b]/30 flex items-center gap-2 text-[11.5px] print:bg-gray-50 print:border-black">
                          <span className="text-emerald-400 font-bold print:text-black">✓</span>
                          <span className="font-label-caps text-[9px] px-1.5 py-0.5 rounded bg-[#1f273d] text-[#36d9ed] print:text-black">{src.channel}</span>
                          <span className="text-[#dfe2f4] print:text-black">{src.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 6: Geospatial & Cell Tower Co-Location Audit */}
        {(activeTab === 'all' || activeTab === 'geo') && includeTowerLogs && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#3c494b]/30 pb-2 print:border-black">
              <h3 className="font-headline-sm text-[16px] text-[#dfe2f4] font-bold flex items-center gap-2 print:text-black">
                <span className="material-symbols-outlined text-amber-400 text-[18px] print:text-black">cell_tower</span>
                5. Geospatial Cell Site Co-Location Log ({MOCK_TOWER_PINGS.length} Pings)
              </h3>
              <span className="px-2.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-label-caps text-[10px] font-bold print:text-black print:border-black">
                CO-LOCATION DETECTED
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#3c494b]/30 bg-[#0f131f] print:bg-white print:border-black">
              <table className="w-full text-left font-code-sm text-[11px]">
                <thead className="bg-[#172034] text-[#859396] border-b border-[#3c494b]/30 print:bg-gray-100 print:text-black">
                  <tr>
                    <th className="px-3 py-2">PING ID</th>
                    <th className="px-3 py-2">TARGET SUSPECT</th>
                    <th className="px-3 py-2">CELL SITE & TOWER</th>
                    <th className="px-3 py-2">TIMESTAMP</th>
                    <th className="px-3 py-2">COORDINATES</th>
                    <th className="px-3 py-2">AZIMUTH & DURATION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3c494b]/20 print:divide-gray-300">
                  {MOCK_TOWER_PINGS.map((ping) => {
                    const isCoLocation = ping.cellId.includes('4301');
                    return (
                      <tr key={ping.id} className={isCoLocation ? 'bg-amber-500/10 print:bg-gray-50' : ''}>
                        <td className="px-3 py-2 text-[#6dedff] font-bold print:text-black">{ping.id}</td>
                        <td className="px-3 py-2 text-[#dfe2f4] font-medium print:text-black">{ping.suspectName}</td>
                        <td className="px-3 py-2 text-[#36d9ed] print:text-black">{ping.towerName} ({ping.cellId})</td>
                        <td className="px-3 py-2 text-[#dfe2f4] print:text-black">{ping.timestamp}</td>
                        <td className="px-3 py-2 text-[#859396] print:text-black">{ping.lat.toFixed(4)}, {ping.lng.toFixed(4)}</td>
                        <td className="px-3 py-2 text-[#bbc9cc] print:text-black">{ping.azimuth}° | {ping.durationSec}s</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 7: Financial Flow & Hawala Layering Audit */}
        {(activeTab === 'all' || activeTab === 'finance') && includeFinanceLogs && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#3c494b]/30 pb-2 print:border-black">
              <h3 className="font-headline-sm text-[16px] text-[#dfe2f4] font-bold flex items-center gap-2 print:text-black">
                <span className="material-symbols-outlined text-purple-400 text-[18px] print:text-black">currency_exchange</span>
                6. Financial Flow & Money Layering Audit ({MOCK_FINANCIAL_TXNS.length} Flagged Transactions)
              </h3>
              <span className="px-2.5 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30 font-label-caps text-[10px] font-bold print:text-black print:border-black">
                HIGH RISK HAWALA TRAIL
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#3c494b]/30 bg-[#0f131f] print:bg-white print:border-black">
              <table className="w-full text-left font-code-sm text-[11px]">
                <thead className="bg-[#172034] text-[#859396] border-b border-[#3c494b]/30 print:bg-gray-100 print:text-black">
                  <tr>
                    <th className="px-3 py-2">REF ID & TIME</th>
                    <th className="px-3 py-2">SENDER ENTITY</th>
                    <th className="px-3 py-2">RECEIVER ENTITY</th>
                    <th className="px-3 py-2">CHANNEL</th>
                    <th className="px-3 py-2">AMOUNT (INR)</th>
                    <th className="px-3 py-2">RISK FLAG</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3c494b]/20 print:divide-gray-300">
                  {MOCK_FINANCIAL_TXNS.map((t) => (
                    <tr key={t.id}>
                      <td className="px-3 py-2">
                        <div className="text-[#6dedff] font-bold print:text-black">{t.txnRef}</div>
                        <div className="text-[#859396] text-[10px] print:text-black">{t.timestamp}</div>
                      </td>
                      <td className="px-3 py-2 text-[#dfe2f4] print:text-black">{t.sender} ({t.senderAccount})</td>
                      <td className="px-3 py-2 text-[#dfe2f4] print:text-black">{t.receiver} ({t.receiverAccount})</td>
                      <td className="px-3 py-2 text-[#36d9ed] print:text-black">{t.channel}</td>
                      <td className="px-3 py-2 text-[#e7d3ff] font-bold print:text-black">Rs. {t.amount.toLocaleString('en-IN')}</td>
                      <td className="px-3 py-2 text-rose-300 font-bold print:text-black">{t.riskFlag}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* NEW SECTION 8: Social Media Intelligence OSINT Extractions */}
        {(activeTab === 'all' || activeTab === 'social') && includeSocialMedia && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#3c494b]/30 pb-2 print:border-black">
              <h3 className="font-headline-sm text-[16px] text-purple-300 font-bold flex items-center gap-2 print:text-black">
                <span className="material-symbols-outlined text-purple-400 text-[18px] print:text-black">public</span>
                7. Social Media Intelligence OSINT Log ({MOCK_SOCIAL_POSTS.length} Scraped Posts / Messages)
              </h3>
              <span className="px-2.5 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30 font-label-caps text-[10px] font-bold print:text-black print:border-black">
                SOCIAL OSINT LOG
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#3c494b]/30 bg-[#0f131f] print:bg-white print:border-black">
              <table className="w-full text-left font-code-sm text-[11px]">
                <thead className="bg-[#172034] text-[#859396] border-b border-[#3c494b]/30 print:bg-gray-100 print:text-black">
                  <tr>
                    <th className="px-3 py-2">PLATFORM & ID</th>
                    <th className="px-3 py-2">AUTHOR / HANDLE</th>
                    <th className="px-3 py-2">EXTRACTED CONTENT / DIRECTIVE</th>
                    <th className="px-3 py-2">TIMESTAMP</th>
                    <th className="px-3 py-2">LINKED IP / METADATA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3c494b]/20 print:divide-gray-300">
                  {MOCK_SOCIAL_POSTS.map((sp) => (
                    <tr key={sp.id} className={sp.sentiment === 'SUSPICIOUS' ? 'bg-purple-500/10 print:bg-gray-50' : ''}>
                      <td className="px-3 py-2">
                        <span className="text-[#36d9ed] font-bold print:text-black">{sp.platform}</span>
                        <span className="text-[#859396] block text-[10px] print:text-black">{sp.evidenceId}</span>
                      </td>
                      <td className="px-3 py-2">
                        <div className="text-[#dfe2f4] font-semibold print:text-black">{sp.author}</div>
                        <div className="text-[#6dedff] text-[10px] print:text-black">{sp.handle}</div>
                      </td>
                      <td className="px-3 py-2 text-[#dfe2f4] italic print:text-black">
                        "{sp.text}"
                        {sp.mentionedEntities.length > 0 && (
                          <div className="text-purple-300 text-[10px] not-italic mt-0.5 print:text-black">
                            Mentions: {sp.mentionedEntities.join(', ')}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2 text-[#859396] whitespace-nowrap print:text-black">{sp.timestamp}</td>
                      <td className="px-3 py-2 text-[#rose-300] print:text-black">{sp.linkedIp || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 9: Suspect Entity DNA Dossier */}
        {(activeTab === 'all') && includeSuspectDossier && (
          <div className="space-y-4">
            <h3 className="font-headline-sm text-[16px] text-[#dfe2f4] font-bold border-b border-[#3c494b]/30 pb-2 print:border-black print:text-black">
              8. Core Suspect DNA & Threat Intelligence Dossiers ({MOCK_ENTITY_DNA.length} Profiles)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {MOCK_ENTITY_DNA.map((ent) => (
                <div key={ent.id} className="p-4 rounded-xl bg-[#0f131f] border border-[#3c494b]/30 space-y-2 print:bg-white print:border-black">
                  <div className="flex items-center justify-between">
                    <h4 className="font-body-md text-[14px] font-bold text-[#dfe2f4] print:text-black">{ent.name}</h4>
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-code-sm text-[10px] font-bold print:text-black print:border-black">
                      RISK: {ent.riskScore}/100
                    </span>
                  </div>
                  <p className="font-code-sm text-[11px] text-[#6dedff] print:text-black">Alias: "{ent.alias}" • {ent.role}</p>
                  <p className="font-body-sm text-[12px] text-[#bbc9cc] leading-relaxed print:text-black">{ent.summary}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 10: Official Signatures & Digital Certification Seal */}
        <div className="pt-6 border-t-2 border-[#3c494b]/30 grid grid-cols-2 gap-8 print:border-black">
          <div className="space-y-8">
            <div>
              <span className="font-label-caps text-[10px] text-[#859396] block mb-1 print:text-black">INVESTIGATING OFFICER SIGNATURE</span>
              <div className="h-12 border-b border-dashed border-[#6dedff]/40 flex items-end pb-1 text-[#6dedff] font-mono text-[13px] italic print:border-black print:text-black">
                Insp. R. S. Gill (Cyber Crime Cell)
              </div>
              <span className="font-code-sm text-[10px] text-[#859396] block mt-1 print:text-black">Inspector of Police • Id: PN-789</span>
            </div>
          </div>

          <div className="space-y-8 text-right">
            <div>
              <span className="font-label-caps text-[10px] text-[#859396] block mb-1 print:text-black">FORENSIC AUTHORITY SEAL & APPROVAL</span>
              <div className="h-12 border-b border-dashed border-[#6dedff]/40 flex items-end justify-end pb-1 text-emerald-400 font-mono text-[12px] font-bold print:border-black print:text-black">
                SSP CYBER CRIME CELL, CHANDIGARH HQ
              </div>
              <span className="font-code-sm text-[10px] text-[#859396] block mt-1 print:text-black">Cryptographic Chain: VERIFIED & SEALED</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
