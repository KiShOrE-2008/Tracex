export type EvidenceType = 'CDR' | 'IPDR' | 'BANK' | 'UPI' | 'DEVICE' | 'TOWER' | 'SOCIAL';

export type EvidenceStatus = 'Ready' | 'Needs Review' | 'Parsing' | 'Failed';

export interface EvidenceFile {
  id: string;
  name: string;
  type: EvidenceType;
  schema: string;
  confidence: number;
  status: EvidenceStatus;
  sizeMb: number;
  sha256: string;
  uploadedAt: string;
  rowCount: number;
  parsedColumns?: string[];
  sampleRows?: Record<string, any>[];
  notes?: string;
}

export type NodeType = 'suspect' | 'phone' | 'bank_account' | 'upi' | 'tower' | 'ip_address';

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  riskScore: number; // 0 - 100
  subtext?: string;
  details?: {
    owner?: string;
    alias?: string;
    carrier?: string;
    bankName?: string;
    accountNumber?: string;
    ifsc?: string;
    locationName?: string;
    lat?: number;
    lng?: number;
    totalAmount?: number;
    callCount?: number;
    flaggedReason?: string;
    avatar?: string;
  };
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  type: 'call' | 'transfer' | 'location_ping' | 'chat' | 'ownership';
  weight: number;
  amount?: number;
  timestamp?: string;
  details?: string;
}

export interface TowerPing {
  id: string;
  suspectId: string;
  suspectName: string;
  cellId: string;
  towerName: string;
  lat: number;
  lng: number;
  timestamp: string;
  durationSec: number;
  azimuth?: number;
  signalStrength?: string;
}

export type EventCategory = 'call' | 'sms' | 'upi' | 'bank' | 'location' | 'chat';

export interface TimelineEvent {
  id: string;
  timestamp: string;
  category: EventCategory;
  title: string;
  description: string;
  sourceEntity: string;
  targetEntity: string;
  amount?: number;
  riskLevel: 'high' | 'medium' | 'low';
  evidenceFileId: string;
  location?: string;
}

export interface FinancialTxn {
  id: string;
  txnRef: string;
  sender: string;
  senderAccount: string;
  receiver: string;
  receiverAccount: string;
  amount: number;
  channel: 'UPI' | 'IMPS' | 'NEFT' | 'RTGS' | 'ATM';
  timestamp: string;
  status: 'COMPLETED' | 'FLAGGED' | 'PENDING';
  riskFlag?: string;
}

export interface EntityDNA {
  id: string;
  name: string;
  alias: string;
  role: string;
  riskScore: number;
  photoUrl?: string;
  phoneNumbers: string[];
  bankAccounts: string[];
  upiIds: string[];
  knownLocations: string[];
  totalCallCount: number;
  totalTxnVolume: number;
  flaggedCount: number;
  lastSeen: string;
  summary: string;
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedPrompts?: string[];
  relatedEvidenceIds?: string[];
  queryResults?: {
    type: 'table' | 'graph' | 'stat';
    headers?: string[];
    rows?: any[][];
    stats?: { label: string; value: string | number }[];
  };
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  analyst: string;
  action: string;
  resource: string;
  hash: string;
  ipAddress: string;
}
