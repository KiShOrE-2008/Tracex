import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import type { NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewView } from './components/OverviewView';
import { EvidenceView } from './components/EvidenceView';
import { GraphView } from './components/GraphView';
import { MapView } from './components/MapView';
import { TimelineView } from './components/TimelineView';
import { FinanceView } from './components/FinanceView';
import { EntityDnaView } from './components/EntityDnaView';
import { CopilotView } from './components/CopilotView';
import { ReportsView } from './components/ReportsView';
import { AuditLogView } from './components/AuditLogView';
import { FileMetadataModal } from './components/FileMetadataModal';
import { NewCaseModal } from './components/NewCaseModal';

import {
  INITIAL_EVIDENCE_FILES,
  INITIAL_GRAPH_NODES,
  INITIAL_GRAPH_EDGES,
  MOCK_TOWER_PINGS,
  MOCK_TIMELINE_EVENTS,
  MOCK_FINANCIAL_TXNS,
  MOCK_ENTITY_DNA,
  MOCK_AUDIT_LOGS
} from './data/mockForensicData';

import type { EvidenceFile } from './types/forensic';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [currentCaseId, setCurrentCaseId] = useState<string>('PN-2026-001');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Data States
  const [evidenceFiles, setEvidenceFiles] = useState<EvidenceFile[]>(INITIAL_EVIDENCE_FILES);
  const [selectedFileForMetadata, setSelectedFileForMetadata] = useState<EvidenceFile | null>(null);
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState<boolean>(false);
  const [targetEntityForDna, setTargetEntityForDna] = useState<string | undefined>(undefined);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddFile = (newFile: EvidenceFile) => {
    setEvidenceFiles((prev: EvidenceFile[]) => [newFile, ...prev]);
    showToast(`Added ${newFile.name} (SHA-256 Verified)`);
  };

  const handleRemoveFile = (id: string) => {
    setEvidenceFiles((prev: EvidenceFile[]) => prev.filter((f: EvidenceFile) => f.id !== id));
    showToast(`Removed evidence file ${id}`);
  };

  const handleProcessFiles = () => {
    showToast(`Normalized ${evidenceFiles.length} files. Linked 147 entities to Graph.`);
    setActiveTab('overview');
  };

  const handleCreateCase = (caseData: { id: string; title: string; leadOfficer: string }) => {
    setCurrentCaseId(caseData.id);
    showToast(`Case ${caseData.id} (${caseData.title}) created successfully.`);
  };

  const handleOpenGraphForEntity = (entityName: string) => {
    setActiveTab('graph');
    showToast(`Mapping link network for ${entityName}`);
  };

  const handleSelectEntityDnaFromGraph = (suspectName: string) => {
    setTargetEntityForDna(suspectName);
    setActiveTab('entity_dna');
  };

  const tabLabels: Record<NavTab, string> = {
    overview: 'Overview Dashboard',
    evidence: 'Evidence Vault & Ingestion Queue',
    processing: 'Processing Pipeline',
    graph: 'Entity Link Analysis Canvas',
    map: 'Geospatial Cell Tower Mapping',
    timeline: 'Chronological Event Stream',
    finance: 'Financial Flow & Money Trail',
    entity_dna: 'Entity DNA 360 Profiler',
    copilot: 'AI Forensic Copilot Assistant',
    reports: 'Court-Ready Section 65B Reports',
    audit_log: 'Immutable Audit Log & Hash Chain',
    settings: 'Workspace Configuration'
  };

  return (
    <div className="flex h-screen bg-[#0f131f] text-[#dfe2f4] overflow-hidden selection:bg-[#28d2e6]/30 selection:text-[#6dedff]">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewCaseModal={() => setIsNewCaseModalOpen(true)}
        evidenceCount={evidenceFiles.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0f131f] relative overflow-hidden">
        {/* Header */}
        <Header
          currentCaseId={currentCaseId}
          onSelectCase={setCurrentCaseId}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeTabLabel={tabLabels[activeTab]}
        />

        {/* Dynamic Canvas Container */}
        <main className="flex-1 overflow-y-auto p-6 flex flex-col">
          {activeTab === 'overview' && (
            <OverviewView
              onNavigateTab={(tab) => setActiveTab(tab)}
              fileCount={evidenceFiles.length}
            />
          )}

          {activeTab === 'evidence' && (
            <EvidenceView
              files={evidenceFiles}
              onAddFile={handleAddFile}
              onRemoveFile={handleRemoveFile}
              onSelectFileMetadata={setSelectedFileForMetadata}
              onProcessFiles={handleProcessFiles}
            />
          )}

          {(activeTab === 'processing') && (
            <OverviewView
              onNavigateTab={(tab) => setActiveTab(tab)}
              fileCount={evidenceFiles.length}
            />
          )}

          {activeTab === 'graph' && (
            <GraphView
              nodes={INITIAL_GRAPH_NODES}
              edges={INITIAL_GRAPH_EDGES}
              onSelectEntityDna={handleSelectEntityDnaFromGraph}
            />
          )}

          {activeTab === 'map' && (
            <MapView pings={MOCK_TOWER_PINGS} />
          )}

          {activeTab === 'timeline' && (
            <TimelineView events={MOCK_TIMELINE_EVENTS} />
          )}

          {activeTab === 'finance' && (
            <FinanceView txns={MOCK_FINANCIAL_TXNS} />
          )}

          {activeTab === 'entity_dna' && (
            <EntityDnaView
              entities={MOCK_ENTITY_DNA}
              initialSelectedName={targetEntityForDna}
              onOpenGraphForEntity={handleOpenGraphForEntity}
            />
          )}

          {activeTab === 'copilot' && (
            <CopilotView onNavigateTab={(tab) => setActiveTab(tab as NavTab)} />
          )}

          {activeTab === 'reports' && (
            <ReportsView files={evidenceFiles} caseId={currentCaseId} />
          )}

          {activeTab === 'audit_log' && (
            <AuditLogView logs={MOCK_AUDIT_LOGS} />
          )}

          {activeTab === 'settings' && (
            <div className="glass-panel p-6 rounded-lg space-y-4 max-w-2xl">
              <h3 className="font-title-lg text-title-lg text-[#dfe2f4]">Workspace Security & Regex Rules</h3>
              <div className="space-y-3 font-body-sm">
                <div>
                  <label className="font-label-caps text-[10px] text-[#859396] block mb-1">DEFAULT SHA-256 HASH VERIFICATION</label>
                  <select className="w-full bg-[#1b1f2c] border border-[#3c494b]/40 rounded p-2 text-[#6dedff]">
                    <option>Enforce SHA-256 Cryptographic Verification (Strict)</option>
                    <option>Lenient Verification</option>
                  </select>
                </div>
                <div>
                  <label className="font-label-caps text-[10px] text-[#859396] block mb-1">AUTOMATED SCHEMA RESOLUTION CONFIDENCE</label>
                  <input type="text" value="85% minimum threshold" readOnly className="w-full bg-[#1b1f2c] border border-[#3c494b]/40 rounded p-2 text-[#859396]" />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg bg-[#172034] text-[#6dedff] border border-[#6dedff]/40 shadow-[0_0_20px_rgba(40,210,230,0.3)] font-body-sm text-[13px] flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          {toastMessage}
        </div>
      )}

      {/* File Metadata Inspector Modal */}
      <FileMetadataModal
        file={selectedFileForMetadata}
        onClose={() => setSelectedFileForMetadata(null)}
      />

      {/* New Case Creation Modal */}
      <NewCaseModal
        isOpen={isNewCaseModalOpen}
        onClose={() => setIsNewCaseModalOpen(false)}
        onCreateCase={handleCreateCase}
      />
    </div>
  );
}

export default App;
