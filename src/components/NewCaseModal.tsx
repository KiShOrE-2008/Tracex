import type React from 'react';
import { useState } from 'react';

interface NewCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCase: (caseData: { id: string; title: string; leadOfficer: string; description: string }) => void;
}

export const NewCaseModal: React.FC<NewCaseModalProps> = ({ isOpen, onClose, onCreateCase }) => {
  const [caseId, setCaseId] = useState('PN-2026-004');
  const [title, setTitle] = useState('');
  const [leadOfficer, setLeadOfficer] = useState('Insp. R. S. Gill');
  const [jurisdiction, setJurisdiction] = useState('Chandigarh Cyber Cell');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    onCreateCase({
      id: caseId,
      title,
      leadOfficer,
      description
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#1b1f2c] border border-[#3c494b]/40 rounded-lg max-w-lg w-full p-6 space-y-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#3c494b]/30 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#28d2e6]/20 text-[#6dedff] border border-[#28d2e6]/40 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">folder_special</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-[18px] text-[#dfe2f4] font-bold">Initiate New Investigation</h3>
              <p className="font-code-sm text-[11px] text-[#859396]">Forensic Workspace Case Creation</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#859396] hover:text-[#dfe2f4]">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 font-body-sm">
          <div>
            <label className="font-label-caps text-[10px] text-[#859396] block mb-1">CASE ID REFERENCE</label>
            <input 
              type="text"
              value={caseId}
              onChange={(e) => setCaseId(e.target.value)}
              className="w-full bg-[#0f131f] border border-[#3c494b]/40 rounded px-3 py-2 text-[#6dedff] font-code-sm text-[13px] focus:outline-none focus:border-[#6dedff]"
              required
            />
          </div>

          <div>
            <label className="font-label-caps text-[10px] text-[#859396] block mb-1">CASE TITLE / CODE NAME</label>
            <input 
              type="text"
              placeholder="e.g. Operation Falcon / Cyber Syndicate Investigation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#0f131f] border border-[#3c494b]/40 rounded px-3 py-2 text-[#dfe2f4] focus:outline-none focus:border-[#6dedff]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-label-caps text-[10px] text-[#859396] block mb-1">LEAD INVESTIGATING OFFICER</label>
              <input 
                type="text"
                value={leadOfficer}
                onChange={(e) => setLeadOfficer(e.target.value)}
                className="w-full bg-[#0f131f] border border-[#3c494b]/40 rounded px-3 py-2 text-[#dfe2f4] focus:outline-none focus:border-[#6dedff]"
              />
            </div>
            <div>
              <label className="font-label-caps text-[10px] text-[#859396] block mb-1">JURISDICTION / UNIT</label>
              <input 
                type="text"
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                className="w-full bg-[#0f131f] border border-[#3c494b]/40 rounded px-3 py-2 text-[#dfe2f4] focus:outline-none focus:border-[#6dedff]"
              />
            </div>
          </div>

          <div>
            <label className="font-label-caps text-[10px] text-[#859396] block mb-1">CASE DESCRIPTION & SCOPE</label>
            <textarea 
              rows={3}
              placeholder="Provide context regarding suspect targets, financial scope, or jurisdictional boundaries..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#0f131f] border border-[#3c494b]/40 rounded px-3 py-2 text-[#dfe2f4] focus:outline-none focus:border-[#6dedff]"
            ></textarea>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#3c494b]/30">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-[#303442] hover:bg-[#353946] text-[#dfe2f4] font-label-caps text-label-caps cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded bg-[#6dedff] text-[#00363d] font-label-caps text-label-caps font-bold hover:bg-[#95f1ff] transition-colors shadow-[0_0_12px_rgba(40,210,230,0.25)] cursor-pointer"
            >
              CREATE CASE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
