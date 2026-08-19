import { useState } from 'react';
import type { EvidenceFile } from '../types/forensic';

interface FileMetadataModalProps {
  file: EvidenceFile | null;
  onClose: () => void;
}

export const FileMetadataModal = ({ file, onClose }: FileMetadataModalProps) => {
  const [copied, setCopied] = useState(false);

  if (!file) return null;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(file.sha256);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#1b1f2c] border border-[#3c494b]/40 rounded-lg max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#3c494b]/30 bg-[#172034]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-[#28d2e6]/20 text-[#6dedff]">
              <span className="material-symbols-outlined text-[24px]">policy</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-[#dfe2f4]">{file.name}</h3>
              <p className="font-code-sm text-[12px] text-[#859396]">ID: {file.id} • {file.type} • {file.schema}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded text-[#859396] hover:text-[#dfe2f4] hover:bg-[#303442] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Chain of Custody & Hash */}
          <div className="p-4 rounded bg-[#0f131f] border border-[#3c494b]/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-label-caps text-label-caps text-[#6dedff] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">lock</span>
                Cryptographic Chain of Custody Proof
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-label-caps text-[10px]">
                HASH VERIFIED
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 bg-[#1b1f2c] p-2.5 rounded border border-[#3c494b]/30">
              <span className="font-code-sm text-[12px] text-[#dfe2f4] break-all select-all">
                {file.sha256}
              </span>
              <button 
                onClick={handleCopyHash}
                className="px-2.5 py-1 rounded bg-[#303442] text-[#6dedff] hover:bg-[#353946] font-label-caps text-[10px] shrink-0 flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {copied ? 'check' : 'content_copy'}
                </span>
                {copied ? 'Copied' : 'Copy Hash'}
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded bg-[#171b28] border border-[#3c494b]/30">
              <span className="font-label-caps text-[10px] text-[#859396]">File Size</span>
              <div className="font-headline-sm text-[18px] text-[#dfe2f4] mt-0.5">{file.sizeMb} MB</div>
            </div>
            <div className="p-3 rounded bg-[#171b28] border border-[#3c494b]/30">
              <span className="font-label-caps text-[10px] text-[#859396]">Row Count</span>
              <div className="font-headline-sm text-[18px] text-[#dfe2f4] mt-0.5">{file.rowCount || 'N/A'}</div>
            </div>
            <div className="p-3 rounded bg-[#171b28] border border-[#3c494b]/30">
              <span className="font-label-caps text-[10px] text-[#859396]">Schema Match</span>
              <div className="font-headline-sm text-[18px] text-[#6dedff] mt-0.5">{file.confidence}% Confidence</div>
            </div>
          </div>

          {/* Parsed Columns */}
          {file.parsedColumns && file.parsedColumns.length > 0 && (
            <div>
              <h4 className="font-label-caps text-label-caps text-[#859396] mb-2">Detected Column Schema</h4>
              <div className="flex flex-wrap gap-1.5">
                {file.parsedColumns.map((col) => (
                  <span key={col} className="px-2.5 py-1 rounded bg-[#0f131f] border border-[#3c494b]/40 font-code-sm text-[11px] text-[#36d9ed]">
                    {col}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sample Data Table */}
          {file.sampleRows && file.sampleRows.length > 0 && (
            <div>
              <h4 className="font-label-caps text-label-caps text-[#859396] mb-2">Parsed Row Preview (First 5 records)</h4>
              <div className="overflow-x-auto rounded border border-[#3c494b]/30 bg-[#0f131f]">
                <table className="w-full text-left font-code-sm text-[11px]">
                  <thead className="bg-[#172034] text-[#859396] border-b border-[#3c494b]/30">
                    <tr>
                      {Object.keys(file.sampleRows[0]).map((key) => (
                        <th key={key} className="px-3 py-2 whitespace-nowrap">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3c494b]/20">
                    {file.sampleRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-[#1b1f2c]">
                        {Object.values(row).map((val: any, vIdx) => (
                          <td key={vIdx} className="px-3 py-1.5 whitespace-nowrap text-[#dfe2f4]">
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

          {/* Notes */}
          <div>
            <h4 className="font-label-caps text-label-caps text-[#859396] mb-2">Analyst Extraction Notes</h4>
            <div className="p-3 rounded bg-[#171b28] border border-[#3c494b]/30 font-body-sm text-body-sm text-[#bbc9cc]">
              {file.notes || 'No custom notes logged.'}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3 border-t border-[#3c494b]/30 bg-[#172034]">
          <button 
            onClick={onClose}
            className="px-5 py-2 rounded bg-[#303442] hover:bg-[#353946] text-[#dfe2f4] font-label-caps text-label-caps transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
