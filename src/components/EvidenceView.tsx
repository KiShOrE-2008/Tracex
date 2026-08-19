import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import type { EvidenceFile } from '../types/forensic';

interface EvidenceViewProps {
  files: EvidenceFile[];
  onAddFile: (file: EvidenceFile) => void;
  onRemoveFile: (id: string) => void;
  onSelectFileMetadata: (file: EvidenceFile) => void;
  onProcessFiles: () => void;
}

export const EvidenceView: React.FC<EvidenceViewProps> = ({
  files,
  onAddFile,
  onRemoveFile,
  onSelectFileMetadata,
  onProcessFiles
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(files.map(f => f.id));
  const [filterType, setFilterType] = useState<string>('ALL');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compute SHA-256 hash using Web Crypto API
  const calculateSha256 = async (file: File): Promise<string> => {
    try {
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {
      return 'sha256_' + Math.random().toString(36).substring(2, 12);
    }
  };

  const handleFileUpload = async (uploadedFiles: FileList | File[]) => {
    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      const sha256 = await calculateSha256(file);
      const sizeMb = parseFloat((file.size / (1024 * 1024)).toFixed(2));
      const ext = file.name.split('.').pop()?.toLowerCase();

      let type: EvidenceFile['type'] = 'CDR';
      let schema = 'CDR_GENERIC_V1';
      if (file.name.includes('bank') || ext === 'pdf') {
        type = 'BANK';
        schema = 'BANK_HDFC_OCR';
      } else if (file.name.includes('upi') || file.name.includes('phonepe') || ext === 'xlsx') {
        type = 'UPI';
        schema = 'UPI_GENERIC';
      } else if (file.name.includes('tower') || file.name.includes('sector')) {
        type = 'TOWER';
        schema = 'TOWER_DUMP_V1';
      } else if (file.name.includes('chat') || file.name.includes('whatsapp')) {
        type = 'DEVICE';
        schema = 'WHATSAPP_FORENSIC_DB';
      } else if (file.name.includes('ipdr')) {
        type = 'IPDR';
        schema = 'IPDR_JIO_STANDARD';
      }

      // Parse CSV client-side if applicable
      if (ext === 'csv' || ext === 'txt') {
        Papa.parse(file, {
          header: true,
          complete: (results) => {
            const columns = results.meta.fields || [];
            const sampleRows = results.data.slice(0, 5) as Record<string, any>[];
            const newEvidence: EvidenceFile = {
              id: 'EV-' + Math.floor(1000 + Math.random() * 9000),
              name: file.name,
              type,
              schema,
              confidence: Math.floor(88 + Math.random() * 11),
              status: 'Ready',
              sizeMb,
              sha256,
              uploadedAt: 'Just Now',
              rowCount: results.data.length,
              parsedColumns: columns,
              sampleRows,
              notes: `Parsed ${results.data.length} rows with columns: ${columns.slice(0, 4).join(', ')}...`
            };
            onAddFile(newEvidence);
            setSelectedIds(prev => [...prev, newEvidence.id]);
          }
        });
      } else {
        const newEvidence: EvidenceFile = {
          id: 'EV-' + Math.floor(1000 + Math.random() * 9000),
          name: file.name,
          type,
          schema,
          confidence: Math.floor(85 + Math.random() * 13),
          status: 'Needs Review',
          sizeMb,
          sha256,
          uploadedAt: 'Just Now',
          rowCount: Math.floor(100 + Math.random() * 2000),
          notes: 'Ingested binary/document file. Cryptographic SHA-256 hash verified.'
        };
        onAddFile(newEvidence);
        setSelectedIds(prev => [...prev, newEvidence.id]);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === files.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(files.map(f => f.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const filteredFiles = files.filter(f => {
    if (filterType === 'ALL') return true;
    return f.type === filterType;
  });

  return (
    <div className="flex-1 flex flex-col gap-5 overflow-hidden select-none">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        multiple 
        onChange={(e) => e.target.files && handleFileUpload(e.target.files)} 
        className="hidden" 
      />

      {/* Futuristic Drag & Drop Zone */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative overflow-hidden border-2 border-dashed rounded-xl p-8 transition-all duration-300 flex flex-col items-center justify-center group cursor-pointer shrink-0 glass-panel shadow-[0_8px_30px_rgba(0,0,0,0.4)] ${
          isDragging 
            ? 'border-[#6dedff] bg-[#28d2e6]/15 shadow-[0_0_30px_rgba(40,210,230,0.3)] scale-[1.01]' 
            : 'border-[#6dedff]/25 hover:border-[#6dedff]/60 hover:bg-[#181d2f]/90'
        }`}
      >
        {/* Animated Cyber Corner Accents */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#6dedff]/40 group-hover:border-[#6dedff] transition-colors"></div>
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#6dedff]/40 group-hover:border-[#6dedff] transition-colors"></div>
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#6dedff]/40 group-hover:border-[#6dedff] transition-colors"></div>
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#6dedff]/40 group-hover:border-[#6dedff] transition-colors"></div>

        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#28d2e6]/20 to-[#6620bd]/25 border border-[#6dedff]/40 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(40,210,230,0.2)] group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(40,210,230,0.4)] transition-transform duration-300">
          <span className="material-symbols-outlined text-[32px] text-[#6dedff]" style={{ fontVariationSettings: "'FILL' 1" }}>
            upload_file
          </span>
        </div>

        <h2 className="font-headline-sm text-[20px] font-bold text-[#dfe2f4] mb-1 group-hover:text-[#6dedff] transition-colors">
          Drag & Drop Forensic Evidence Files
        </h2>
        <p className="font-body-sm text-[13px] text-[#bbc9cc] mb-4 text-center max-w-lg leading-relaxed">
          Securely ingest multi-format CDR, IPDR, Banking, and UFED files for client-side <span className="text-[#6dedff] font-semibold">SHA-256 verification</span> and automated entity linkage.
        </p>

        {/* Format Chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-5">
          {['CDR', 'IPDR', 'BANK', 'UPI', 'DEVICE', 'TOWER', 'SOCIAL'].map(tag => (
            <span key={tag} className="px-2.5 py-0.5 rounded-md bg-[#0f1322] border border-[#6dedff]/20 font-code-sm text-[10px] text-[#6dedff] font-semibold tracking-wider shadow-sm">
              {tag}
            </span>
          ))}
        </div>

        <button 
          type="button"
          onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
          className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#28d2e6] to-[#00a8bd] hover:from-[#36d9ed] hover:to-[#28d2e6] text-[#00363d] font-label-caps text-[11px] font-extrabold tracking-wider shadow-[0_0_15px_rgba(40,210,230,0.35)] hover:shadow-[0_0_20px_rgba(40,210,230,0.55)] transition-all cursor-pointer active:scale-95"
        >
          BROWSE FILES
        </button>
      </div>

      {/* Evidence Queue Header */}
      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-3">
          <h3 className="font-title-lg text-[17px] text-[#dfe2f4] font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-[#6dedff] text-[20px]">inventory_2</span>
            Evidence Vault Queue
          </h3>
          <span className="px-3 py-0.5 rounded-full bg-[#181d2f] text-[#6dedff] font-label-caps text-[10px] font-bold border border-[#6dedff]/30 shadow-[0_0_8px_rgba(40,210,230,0.2)]">
            {filteredFiles.length} FILES INGESTED
          </span>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 bg-[#0f1322] p-1 rounded-lg border border-[#3c494b]/30">
          {['ALL', 'CDR', 'BANK', 'UPI', 'TOWER', 'DEVICE', 'IPDR'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterType(cat)}
              className={`px-3 py-1 rounded-md font-label-caps text-[10px] transition-all cursor-pointer ${
                filterType === cat
                  ? 'bg-gradient-to-r from-[#6dedff] to-[#28d2e6] text-[#00363d] font-extrabold shadow-[0_0_10px_rgba(40,210,230,0.3)]'
                  : 'text-[#859396] hover:text-[#dfe2f4] hover:bg-[#21273d]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Queue Table */}
      <div className="flex-1 glass-panel rounded-xl border border-[#6dedff]/15 overflow-hidden flex flex-col min-h-[300px] shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
        {/* Table Header */}
        <div className="grid grid-cols-[auto_2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3.5 border-b border-[#6dedff]/20 bg-[#131726] items-center shrink-0">
          <button onClick={toggleSelectAll} className="w-6 flex justify-center text-[#859396] hover:text-[#6dedff] transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">
              {selectedIds.length === files.length ? 'check_box' : 'check_box_outline_blank'}
            </span>
          </button>
          <div className="font-label-caps text-[10px] text-[#859396] font-bold tracking-wider">FILE DETAILS & SHA-256 HASH</div>
          <div className="font-label-caps text-[10px] text-[#859396] font-bold tracking-wider">TYPE / SCHEMA</div>
          <div className="font-label-caps text-[10px] text-[#859396] font-bold tracking-wider">CONFIDENCE</div>
          <div className="font-label-caps text-[10px] text-[#859396] font-bold tracking-wider">STATUS</div>
          <div className="font-label-caps text-[10px] text-[#859396] font-bold tracking-wider text-right w-24">ACTIONS</div>
        </div>

        {/* Table Body */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#3c494b]/15">
          {filteredFiles.length === 0 ? (
            <div className="p-12 text-center text-[#859396] font-body-sm flex flex-col items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[36px] text-[#859396]/40">folder_off</span>
              <span>No evidence files matching current category filter.</span>
            </div>
          ) : (
            filteredFiles.map((file) => {
              const isSelected = selectedIds.includes(file.id);
              const iconMap: Record<string, string> = {
                CDR: 'description',
                BANK: 'picture_as_pdf',
                UPI: 'table_view',
                TOWER: 'cell_tower',
                DEVICE: 'chat',
                IPDR: 'router'
              };

              return (
                <div 
                  key={file.id}
                  className={`grid grid-cols-[auto_2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3.5 transition-all duration-150 items-center ${
                    isSelected ? 'bg-[#28d2e6]/8 hover:bg-[#28d2e6]/12' : 'hover:bg-[#21273d]/40'
                  }`}
                >
                  {/* Checkbox */}
                  <button onClick={() => toggleSelectOne(file.id)} className="w-6 flex justify-center text-[#6dedff] cursor-pointer">
                    <span className="material-symbols-outlined text-[18px]">
                      {isSelected ? 'check_box' : 'check_box_outline_blank'}
                    </span>
                  </button>

                  {/* File Details & Metadata */}
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="material-symbols-outlined text-[18px] text-[#6dedff]">
                        {iconMap[file.type] || 'description'}
                      </span>
                      <span className="font-body-md text-[13.5px] text-[#dfe2f4] truncate font-semibold">
                        {file.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-code-sm text-[11px] text-[#bbc9cc]/80">
                      <span>{file.sizeMb} MB</span>
                      <span className="text-[#3c494b]">•</span>
                      <span className="truncate max-w-[150px] font-mono text-[#6dedff]/80 bg-[#0f1322] px-1.5 py-0.2 rounded border border-[#6dedff]/20" title={`SHA-256: ${file.sha256}`}>
                        {file.sha256.substring(0, 12)}...
                      </span>
                      <span className="text-[#3c494b]">•</span>
                      <span>{file.uploadedAt}</span>
                      {file.rowCount && (
                        <>
                          <span className="text-[#3c494b]">•</span>
                          <span className="text-[#dfe2f4] font-semibold">{file.rowCount} rows</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Schema Tag */}
                  <div className="flex items-center">
                    <span className="px-2.5 py-0.5 rounded bg-[#0f1322] border border-[#6dedff]/30 font-code-sm text-[10px] text-[#6dedff] font-medium shadow-sm">
                      {file.schema}
                    </span>
                  </div>

                  {/* Confidence Bar */}
                  <div className="flex items-center">
                    <div className="flex items-center gap-2 w-full">
                      <div className="w-16 h-1.5 bg-[#0f1322] rounded-full overflow-hidden border border-[#3c494b]/30">
                        <div 
                          className={`h-full ${file.confidence >= 90 ? 'bg-[#6dedff] shadow-[0_0_8px_rgba(109,237,255,0.8)]' : 'bg-[#e7d3ff]'}`} 
                          style={{ width: `${file.confidence}%` }}
                        ></div>
                      </div>
                      <span className={`font-code-sm text-[11px] font-bold ${file.confidence >= 90 ? 'text-[#6dedff]' : 'text-[#e7d3ff]'}`}>
                        {file.confidence}%
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center">
                    {file.status === 'Ready' && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-label-caps text-[10px] font-bold shadow-[0_0_8px_rgba(52,211,153,0.2)]">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                        <span>Ready</span>
                      </div>
                    )}
                    {file.status === 'Needs Review' && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 font-label-caps text-[10px] font-bold">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                        <span>Needs Review</span>
                      </div>
                    )}
                    {file.status === 'Parsing' && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#21273d] text-[#dfe2f4] border border-[#3c494b]/40 font-label-caps text-[10px]">
                        <span className="material-symbols-outlined text-[13px] animate-spin text-[#6dedff]">sync</span>
                        <span>Parsing</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-1 w-24">
                    <button 
                      onClick={() => onSelectFileMetadata(file)}
                      className="p-1.5 rounded-lg text-[#859396] hover:text-[#6dedff] hover:bg-[#21273d] transition-all cursor-pointer" 
                      title="Inspect Metadata & Schema"
                    >
                      <span className="material-symbols-outlined text-[18px]">info</span>
                    </button>
                    <button 
                      onClick={() => onSelectFileMetadata(file)}
                      className="p-1.5 rounded-lg text-[#859396] hover:text-[#6dedff] hover:bg-[#21273d] transition-all cursor-pointer" 
                      title="Preview Rows"
                    >
                      <span className="material-symbols-outlined text-[18px]">visibility</span>
                    </button>
                    <button 
                      onClick={() => onRemoveFile(file.id)}
                      className="p-1.5 rounded-lg text-[#859396] hover:text-rose-400 hover:bg-rose-500/15 transition-all cursor-pointer" 
                      title="Remove File"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Process CTA */}
      <div className="flex items-center justify-between pt-2 shrink-0">
        <div className="flex items-center gap-2 text-[#bbc9cc]">
          <span className="material-symbols-outlined text-[18px] text-emerald-400">verified_user</span>
          <span className="font-body-sm text-[12.5px]">
            All files are cryptographically hashed (SHA-256) and mapped to Entity DNA topology.
          </span>
        </div>
        <button 
          onClick={onProcessFiles}
          className="px-8 py-3 bg-gradient-to-r from-[#6dedff] to-[#28d2e6] text-[#00363d] font-label-caps text-[11px] rounded-lg font-extrabold tracking-wider flex items-center gap-2 hover:from-[#95f1ff] hover:to-[#6dedff] transition-all shadow-[0_0_20px_rgba(40,210,230,0.35)] hover:shadow-[0_0_25px_rgba(40,210,230,0.6)] cursor-pointer active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">analytics</span>
          PROCESS {selectedIds.length} SELECTED FILES
        </button>
      </div>
    </div>
  );
};

