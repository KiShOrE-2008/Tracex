import type { EvidenceFile, GraphNode, GraphEdge, TowerPing, TimelineEvent, FinancialTxn, EntityDNA, AuditLogItem, AlertItem, CorrelationLink, SocialPost } from '../types/forensic';

export const INITIAL_EVIDENCE_FILES: EvidenceFile[] = [
  {
    id: 'EV-1001',
    name: 'airtel_suspect_1_cdr.csv',
    type: 'CDR',
    schema: 'CDR_AIRTEL_V2',
    confidence: 98,
    status: 'Ready',
    sizeMb: 14.2,
    sha256: '8f4e2b91c83a54d7e6201f9a1c4b7890d2e4f5a6b7c8d9e0f1a2b3c4d5e6f7a',
    uploadedAt: 'Today, 09:42',
    rowCount: 4520,
    parsedColumns: ['call_id', 'calling_num', 'called_num', 'timestamp', 'duration_sec', 'imei', 'imsi', 'cell_tower_id'],
    notes: 'Parsed successfully. Primary caller target: +91 98765 43210 (Vikram "Shadow" Sharma).'
  },
  {
    id: 'EV-1002',
    name: 'hdfc_bank_statement_Q3.pdf',
    type: 'BANK',
    schema: 'BANK_HDFC_OCR',
    confidence: 91,
    status: 'Needs Review',
    sizeMb: 4.8,
    sha256: '3a9c4d8e7b1a2f5c6d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8',
    uploadedAt: 'Today, 09:44',
    rowCount: 1280,
    parsedColumns: ['txn_date', 'value_date', 'description', 'ref_no', 'debit', 'credit', 'balance'],
    notes: 'OCR extracted 1,280 entries. 3 entries flag high-risk round-tripping to shell entity Apex Trading.'
  },
  {
    id: 'EV-1003',
    name: 'phonepe_txns_dump.xlsx',
    type: 'UPI',
    schema: 'UPI_GENERIC',
    confidence: 95,
    status: 'Ready',
    sizeMb: 2.1,
    sha256: '7d1e8a4c5b6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2',
    uploadedAt: 'Today, 09:50',
    rowCount: 890,
    parsedColumns: ['upi_id', 'counterparty_upi', 'amount', 'timestamp', 'txn_type', 'vpa_provider', 'status'],
    notes: 'Contains 890 micro-transactions under Rs. 10,000 threshold to syndicate VPAs.'
  },
  {
    id: 'EV-1004',
    name: 'tower_dump_sector43_chandigarh.csv',
    type: 'TOWER',
    schema: 'TOWER_DUMP_V1',
    confidence: 99,
    status: 'Ready',
    sizeMb: 28.6,
    sha256: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8',
    uploadedAt: 'Today, 10:15',
    rowCount: 18450,
    parsedColumns: ['cell_site_id', 'azimuth', 'msisdn', 'imei', 'timestamp', 'event_type'],
    notes: 'Co-location pings matched between Vikram Sharma and Rajesh Verma near Sector 43 ISBT.'
  },
  {
    id: 'EV-1005',
    name: 'whatsapp_extracted_chats.json',
    type: 'DEVICE',
    schema: 'WHATSAPP_FORENSIC_DB',
    confidence: 94,
    status: 'Ready',
    sizeMb: 8.5,
    sha256: '2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3',
    uploadedAt: 'Today, 10:30',
    rowCount: 3200,
    parsedColumns: ['msg_id', 'sender_jid', 'receiver_jid', 'timestamp', 'message_body', 'media_hash'],
    notes: 'Encrypted chat logs decrypted using UFED extraction key.'
  },
  {
    id: 'EV-1006',
    name: 'ipdr_jio_suspect_2.txt',
    type: 'IPDR',
    schema: 'IPDR_JIO_STANDARD',
    confidence: 88,
    status: 'Needs Review',
    sizeMb: 5.4,
    sha256: '5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6',
    uploadedAt: 'Today, 11:05',
    rowCount: 9400,
    parsedColumns: ['msisdn', 'source_ip', 'dest_ip', 'dest_port', 'start_time', 'end_time', 'bytes_transferred'],
    notes: 'Contains VPN connection logs to ProtonVPN servers.'
  }
];

export const INITIAL_GRAPH_NODES: GraphNode[] = [
  {
    id: 'N-SUS1',
    label: 'Vikram "Shadow" Sharma',
    type: 'suspect',
    riskScore: 94,
    subtext: 'Primary Target (Syndicate Head)',
    details: {
      owner: 'Vikram Sharma',
      alias: 'Shadow / Master V',
      locationName: 'Sector 17, Chandigarh',
      totalAmount: 18500000,
      callCount: 342,
      flaggedReason: 'Mastermind behind hawala operations & bogus invoicing network.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    }
  },
  {
    id: 'N-SUS2',
    label: 'Rajesh Verma',
    type: 'suspect',
    riskScore: 82,
    subtext: 'Logistics Coordinator',
    details: {
      owner: 'Rajesh Verma',
      alias: 'Raju Operator',
      locationName: 'Mohali Phase 7',
      totalAmount: 4200000,
      callCount: 198,
      flaggedReason: 'Coordinates physical cash drops & fake SIM card activations.'
    }
  },
  {
    id: 'N-SUS3',
    label: 'Ananya Gupta',
    type: 'suspect',
    riskScore: 76,
    subtext: 'Shell Corp Director',
    details: {
      owner: 'Ananya Gupta',
      alias: 'AG Enterprises',
      locationName: 'Panchkula Sector 5',
      totalAmount: 9800000,
      callCount: 86,
      flaggedReason: 'Director of Apex Trading Ltd & Zenith Corp (Shell entities).'
    }
  },
  {
    id: 'N-TEL1',
    label: '+91 98765 43210',
    type: 'phone',
    riskScore: 92,
    subtext: 'Airtel Primary (Target A)',
    details: {
      owner: 'Vikram Sharma',
      carrier: 'Bharti Airtel',
      callCount: 452,
      flaggedReason: 'Connected to 14 burner SIMs in last 30 days.'
    }
  },
  {
    id: 'N-TEL2',
    label: '+91 91234 56789',
    type: 'phone',
    riskScore: 78,
    subtext: 'Jio Burner SIM',
    details: {
      owner: 'Rajesh Verma (Fake ID)',
      carrier: 'Reliance Jio',
      callCount: 210,
      flaggedReason: 'Activated using forged Aadhaar card.'
    }
  },
  {
    id: 'N-BNK1',
    label: 'HDFC: ...8921',
    type: 'bank_account',
    riskScore: 90,
    subtext: 'Apex Trading Corp Account',
    details: {
      bankName: 'HDFC Bank, Sector 35, Chd',
      accountNumber: '50200049188921',
      ifsc: 'HDFC0000123',
      totalAmount: 14200000,
      flaggedReason: 'Received 89 UPI micro-deposits, immediately wired overseas.'
    }
  },
  {
    id: 'N-UPI1',
    label: 'apex.trading@icici',
    type: 'upi',
    riskScore: 85,
    subtext: 'Primary Collection VPA',
    details: {
      owner: 'Apex Trading Ltd',
      totalAmount: 6500000,
      flaggedReason: 'High frequency transactions matching extortion victim deposits.'
    }
  },
  {
    id: 'N-UPI2',
    label: 'vikram.sharma@paytm',
    type: 'upi',
    riskScore: 68,
    subtext: 'Personal VPA',
    details: {
      owner: 'Vikram Sharma',
      totalAmount: 850000,
      flaggedReason: 'Transfers to casino wallets and crypto P2P traders.'
    }
  },
  {
    id: 'N-TOW1',
    label: 'Cell Tower #4301 (Sector 43 ISBT)',
    type: 'tower',
    riskScore: 65,
    subtext: 'Chd Sector 43 ISBT Site',
    details: {
      locationName: 'Sector 43 Inter-State Bus Terminus, Chandigarh',
      lat: 30.7230,
      lng: 76.7580,
      flaggedReason: 'Co-location site during 02:15 AM cash handoff event.'
    }
  },
  {
    id: 'N-IP1',
    label: '185.220.101.5 (ProtonVPN)',
    type: 'ip_address',
    riskScore: 88,
    subtext: 'Anonymized Proxy Endpoint',
    details: {
      locationName: 'Frankfurt, Germany (Exit Node)',
      flaggedReason: 'Used for unauthorized net-banking sessions at 03:00 AM.'
    }
  }
];

export const INITIAL_GRAPH_EDGES: GraphEdge[] = [
  { id: 'E-1', source: 'N-SUS1', target: 'N-TEL1', label: 'Registered Owner', type: 'ownership', weight: 5 },
  { id: 'E-2', source: 'N-SUS2', target: 'N-TEL2', label: 'Possesses SIM', type: 'ownership', weight: 4 },
  { id: 'E-3', source: 'N-TEL1', target: 'N-TEL2', label: '142 Calls (34 hrs)', type: 'call', weight: 9, details: 'Frequent night calls between 01:00 AM - 04:00 AM' },
  { id: 'E-4', source: 'N-SUS3', target: 'N-BNK1', label: 'Signatory Director', type: 'ownership', weight: 5 },
  { id: 'E-5', source: 'N-UPI1', target: 'N-BNK1', label: 'Auto-Settlement', type: 'transfer', weight: 8, amount: 6500000 },
  { id: 'E-6', source: 'N-SUS1', target: 'N-UPI2', label: 'Linked VPA', type: 'ownership', weight: 4 },
  { id: 'E-7', source: 'N-BNK1', target: 'N-UPI2', label: 'Rs 8,50,000 Transfer', type: 'transfer', weight: 7, amount: 850000, timestamp: '2026-08-14 14:22' },
  { id: 'E-8', source: 'N-TEL1', target: 'N-TOW1', label: 'Cell Ping (02:14 AM)', type: 'location_ping', weight: 6 },
  { id: 'E-9', source: 'N-TEL2', target: 'N-TOW1', label: 'Cell Ping (02:16 AM)', type: 'location_ping', weight: 6 },
  { id: 'E-10', source: 'N-TEL2', target: 'N-IP1', label: 'VPN Session', type: 'chat', weight: 5 }
];

export const MOCK_TOWER_PINGS: TowerPing[] = [
  { id: 'TP-1', suspectId: 'N-SUS1', suspectName: 'Vikram Sharma (+91 98765 43210)', cellId: 'CHD-4301-A', towerName: 'Sector 43 ISBT Main', lat: 30.7230, lng: 76.7580, timestamp: '2026-08-17 02:14:05', durationSec: 180, azimuth: 45, signalStrength: '-72 dBm' },
  { id: 'TP-2', suspectId: 'N-SUS2', suspectName: 'Rajesh Verma (+91 91234 56789)', cellId: 'CHD-4301-B', towerName: 'Sector 43 ISBT South', lat: 30.7238, lng: 76.7592, timestamp: '2026-08-17 02:16:22', durationSec: 420, azimuth: 180, signalStrength: '-68 dBm' },
  { id: 'TP-3', suspectId: 'N-SUS1', suspectName: 'Vikram Sharma (+91 98765 43210)', cellId: 'CHD-1702-C', towerName: 'Sector 17 Plaza Center', lat: 30.7414, lng: 76.7794, timestamp: '2026-08-17 08:30:11', durationSec: 1200, azimuth: 270, signalStrength: '-60 dBm' },
  { id: 'TP-4', suspectId: 'N-SUS3', suspectName: 'Ananya Gupta', cellId: 'MOH-0701-A', towerName: 'Mohali Phase 7 Industrial Area', lat: 30.7046, lng: 76.7179, timestamp: '2026-08-17 11:45:00', durationSec: 2400, azimuth: 90, signalStrength: '-75 dBm' },
  { id: 'TP-5', suspectId: 'N-SUS1', suspectName: 'Vikram Sharma (+91 98765 43210)', cellId: 'PNC-0504-B', towerName: 'Panchkula Sector 5 Financial Hub', lat: 30.6942, lng: 76.8606, timestamp: '2026-08-17 15:20:40', durationSec: 850, azimuth: 310, signalStrength: '-65 dBm' }
];

export const MOCK_TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'TL-101',
    timestamp: '2026-08-17 02:14:05',
    category: 'location',
    title: 'Co-Location Alert: Sector 43 ISBT',
    description: 'Cell site pings confirmed Vikram Sharma and Rajesh Verma present at Sector 43 ISBT within 120 meters for 15 minutes.',
    sourceEntity: 'Vikram Sharma (+91 98765 43210)',
    targetEntity: 'Rajesh Verma (+91 91234 56789)',
    riskLevel: 'high',
    evidenceFileId: 'EV-1004',
    location: 'Sector 43 ISBT, Chandigarh'
  },
  {
    id: 'TL-102',
    timestamp: '2026-08-17 02:18:12',
    category: 'call',
    title: 'Encrypted Call Event (340 sec)',
    description: 'Direct call initiated from +91 98765 43210 to +91 91234 56789 immediately following tower lock.',
    sourceEntity: '+91 98765 43210',
    targetEntity: '+91 91234 56789',
    riskLevel: 'high',
    evidenceFileId: 'EV-1001'
  },
  {
    id: 'TL-103',
    timestamp: '2026-08-17 03:05:40',
    category: 'bank',
    title: 'High-Value Wire Transfer: Rs 25,00,000',
    description: 'HDFC Account ...8921 debited Rs 25,00,000 via RTGS to offshore shell account Apex Trading UAE.',
    sourceEntity: 'HDFC Account ...8921',
    targetEntity: 'Apex Trading UAE',
    amount: 2500000,
    riskLevel: 'high',
    evidenceFileId: 'EV-1002'
  },
  {
    id: 'TL-104',
    timestamp: '2026-08-17 09:12:00',
    category: 'upi',
    title: 'Structured Micro-Deposits Batch (42 VPAs)',
    description: '42 individual deposits of Rs 9,800 received into apex.trading@icici within 10 minutes.',
    sourceEntity: 'Multiple Victim VPAs',
    targetEntity: 'apex.trading@icici',
    amount: 411600,
    riskLevel: 'medium',
    evidenceFileId: 'EV-1003'
  },
  {
    id: 'TL-105',
    timestamp: '2026-08-17 10:30:15',
    category: 'chat',
    title: 'Decrypted WhatsApp Directive',
    description: 'Sender instructs target: "Clear the cash box before 4 PM. Transfer 10L to Mohali drop point."',
    sourceEntity: 'Vikram Sharma (JID: 919876543210@s.whatsapp.net)',
    targetEntity: 'Rajesh Verma',
    riskLevel: 'high',
    evidenceFileId: 'EV-1005'
  }
];

export const MOCK_FINANCIAL_TXNS: FinancialTxn[] = [
  { id: 'FT-1', txnRef: 'UPI/623819024/PAY', sender: 'Extortion Victim 1', senderAccount: 'sbi.user1@okicici', receiver: 'apex.trading@icici', receiverAccount: '50200049188921', amount: 98000, channel: 'UPI', timestamp: '2026-08-17 09:10:14', status: 'FLAGGED', riskFlag: 'Structured Money Inflow' },
  { id: 'FT-2', txnRef: 'UPI/623819025/PAY', sender: 'Extortion Victim 2', senderAccount: 'hdfc.user2@paytm', receiver: 'apex.trading@icici', receiverAccount: '50200049188921', amount: 95000, channel: 'UPI', timestamp: '2026-08-17 09:11:02', status: 'FLAGGED', riskFlag: 'Structured Money Inflow' },
  { id: 'FT-3', txnRef: 'RTGS/HDFCR520260817001', sender: 'Apex Trading Ltd', senderAccount: '50200049188921', receiver: 'Apex Trading UAE FZE', receiverAccount: 'AE890330000019284', amount: 2500000, channel: 'RTGS', timestamp: '2026-08-17 03:05:40', status: 'FLAGGED', riskFlag: 'Offshore Hawala Outflow' },
  { id: 'FT-4', txnRef: 'IMPS/6239104421/MOB', sender: 'Apex Trading Ltd', senderAccount: '50200049188921', receiver: 'Vikram Sharma', receiverAccount: 'vikram.sharma@paytm', amount: 850000, channel: 'IMPS', timestamp: '2026-08-14 14:22:10', status: 'COMPLETED', riskFlag: 'Promoter Siphoning' },
  { id: 'FT-5', txnRef: 'ATM/CHD-SEC17/CASH', sender: 'Rajesh Verma Debit Card', senderAccount: '3091827465', receiver: 'Cash Withdrawal Sector 17', receiverAccount: 'ATM-CHD-17', amount: 200000, channel: 'ATM', timestamp: '2026-08-17 04:15:00', status: 'FLAGGED', riskFlag: 'High-Volume Cash Drain' }
];

export const MOCK_ENTITY_DNA: EntityDNA[] = [
  {
    id: 'DNA-01',
    name: 'Vikram Sharma',
    alias: 'Shadow / Master V',
    role: 'Syndicate Mastermind / Key Suspect',
    riskScore: 94,
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    phoneNumbers: ['+91 98765 43210', '+91 98111 22233', '+91 99000 88776'],
    bankAccounts: ['HDFC ...8921 (Apex Trading)', 'ICICI ...4092 (Personal)', 'Axis ...1102'],
    upiIds: ['apex.trading@icici', 'vikram.sharma@paytm', 'shadow.v@okaxis'],
    knownLocations: ['Sector 17, Chandigarh', 'Sector 43 ISBT', 'Panchkula Sector 5'],
    totalCallCount: 452,
    totalTxnVolume: 18500000,
    flaggedCount: 18,
    lastSeen: 'Today, 15:20 (Panchkula Sector 5)',
    summary: 'Central coordinator of cyber extortion ring. Directs fund layering through Apex Trading shell accounts and commands physical cash operations via Rajesh Verma.'
  },
  {
    id: 'DNA-02',
    name: 'Rajesh Verma',
    alias: 'Raju Operator / Courier 1',
    role: 'Logistics & SIM Coordinator',
    riskScore: 82,
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    phoneNumbers: ['+91 91234 56789', '+91 94567 89012'],
    bankAccounts: ['SBI ...7465'],
    upiIds: ['raju.verma@ybl'],
    knownLocations: ['Mohali Phase 7', 'Sector 43 ISBT'],
    totalCallCount: 210,
    totalTxnVolume: 4200000,
    flaggedCount: 9,
    lastSeen: 'Today, 02:16 (Sector 43 ISBT)',
    summary: 'Manages fake SIM procurement and physical cash drops. Directly handles ATM cash-outs in Chandigarh and Mohali.'
  },
  {
    id: 'DNA-03',
    name: 'Ananya Gupta',
    alias: 'AG Enterprises / Corporate Proxy',
    role: 'Front Company Director',
    riskScore: 76,
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    phoneNumbers: ['+91 97890 12345'],
    bankAccounts: ['HDFC ...8921 (Director)', 'Kotak ...9012'],
    upiIds: ['ag.enterprises@okicici'],
    knownLocations: ['Panchkula Sector 5', 'Chandigarh IT Park'],
    totalCallCount: 86,
    totalTxnVolume: 9800000,
    flaggedCount: 6,
    lastSeen: 'Today, 11:45 (Mohali Phase 7)',
    summary: 'Provides corporate facade for shell entities Apex Trading and Zenith Corp. Signs banking authorization forms for international wires.'
  }
];

export const MOCK_AUDIT_LOGS: AuditLogItem[] = [
  { id: 'LOG-8801', timestamp: '2026-08-18 09:42:15', analyst: 'Insp. R. S. Gill', role: 'investigator', action: 'LOGIN', resource: 'PN-2026-001', hash: '8f4e2b91c83a54d7e6201f9a1c4b7890d2e4f5a6', prevHash: '0000000000000000000000000000000000000000', ipAddress: '10.240.12.45' },
  { id: 'LOG-8802', timestamp: '2026-08-18 09:43:02', analyst: 'Insp. R. S. Gill', role: 'investigator', action: 'CASE_OPEN', resource: 'PN-2026-001', hash: '3a9c4d8e7b1a2f5c6d0e9f8a7b6c5d4e3f2a1b0c', prevHash: '8f4e2b91c83a54d7e6201f9a1c4b7890d2e4f5a6', ipAddress: '10.240.12.45' },
  { id: 'LOG-8803', timestamp: '2026-08-18 09:44:31', analyst: 'Insp. R. S. Gill', role: 'investigator', action: 'FILE_INGESTION', resource: 'airtel_suspect_1_cdr.csv', hash: '4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f', prevHash: '3a9c4d8e7b1a2f5c6d0e9f8a7b6c5d4e3f2a1b0c', ipAddress: '10.240.12.45' },
  { id: 'LOG-8804', timestamp: '2026-08-18 09:45:08', analyst: 'Insp. R. S. Gill', role: 'investigator', action: 'HASH_GENERATED', resource: 'airtel_suspect_1_cdr.csv', hash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b', prevHash: '4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f', ipAddress: '10.240.12.45' },
  { id: 'LOG-8805', timestamp: '2026-08-18 10:02:44', analyst: 'K. Mehta', role: 'analyst', action: 'GRAPH_LINK_ANALYSIS', resource: 'PN-2026-001 Entity Canvas', hash: '9b8a7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b', prevHash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b', ipAddress: '10.240.12.88' },
  { id: 'LOG-8806', timestamp: '2026-08-18 10:14:21', analyst: 'K. Mehta', role: 'analyst', action: 'CORRELATION_QUERY', resource: 'PN-2026-001', hash: 'ae1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b', prevHash: '9b8a7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b', ipAddress: '10.240.12.88' },
  { id: 'LOG-8807', timestamp: '2026-08-18 10:25:11', analyst: 'K. Mehta', role: 'analyst', action: 'SENSITIVE_DATA_ACCESS', resource: 'Vikram Sharma (phone)', hash: 'bf2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c', prevHash: 'ae1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b', ipAddress: '10.240.12.88' },
  { id: 'LOG-8808', timestamp: '2026-08-18 10:31:42', analyst: 'Insp. R. S. Gill', role: 'investigator', action: 'REPORT_EXPORT', resource: 'Operation_Shadow_Court_Report.pdf', hash: 'cd3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d', prevHash: 'bf2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c', ipAddress: '10.240.12.45' },
];

export const MOCK_ALERTS: AlertItem[] = [
  {
    id: 'ALT-001',
    severity: 'CRITICAL',
    category: 'CDR',
    title: 'Burner SIM Cluster Detected — 14 Activations in 72 hrs',
    body: 'Target A (+91 98765 43210) has been linked to 14 SIM activations using synthetic Aadhaar IDs over 72 hours. Pattern consistent with large-scale OTP fraud infrastructure.',
    timestamp: '2026-08-17 01:42:00',
    relatedEntities: ['Vikram Sharma', '+91 98765 43210'],
    isDismissed: false,
    navigateTo: 'graph'
  },
  {
    id: 'ALT-002',
    severity: 'CRITICAL',
    category: 'BANK',
    title: 'Offshore Wire: Rs 25,00,000 via RTGS to UAE Shell Entity',
    body: 'HDFC Account ...8921 (Apex Trading Ltd) executed an RTGS transfer of Rs 25,00,000 to Apex Trading UAE FZE at 03:05 AM — 51 minutes after verified co-location event at Sector 43 ISBT.',
    timestamp: '2026-08-17 03:05:40',
    relatedEntities: ['Apex Trading Ltd', 'HDFC ...8921'],
    isDismissed: false,
    navigateTo: 'finance'
  },
  {
    id: 'ALT-003',
    severity: 'CRITICAL',
    category: 'GEO',
    title: 'Co-Location Match: Vikram Sharma & Rajesh Verma @ 02:14 AM',
    body: 'Simultaneous cell pings on CHD-4301-A and CHD-4301-B place both suspects within 120 meters at Sector 43 ISBT at 02:14 AM. A direct call followed within 4 minutes.',
    timestamp: '2026-08-17 02:14:05',
    relatedEntities: ['Vikram Sharma', 'Rajesh Verma', 'Cell Site #4301'],
    isDismissed: false,
    navigateTo: 'map'
  },
  {
    id: 'ALT-004',
    severity: 'HIGH',
    category: 'UPI',
    title: 'Structuring Pattern: 42 Micro-Deposits Under ₹10,000 Threshold',
    body: '42 individual UPI payments each just below the ₹10,000 reporting threshold were received into apex.trading@icici within a 10-minute window, totaling ₹4,11,600.',
    timestamp: '2026-08-17 09:12:00',
    relatedEntities: ['apex.trading@icici', 'Apex Trading Ltd'],
    isDismissed: false,
    navigateTo: 'finance'
  },
  {
    id: 'ALT-005',
    severity: 'HIGH',
    category: 'IP',
    title: 'Unauthorized Net-Banking Session via ProtonVPN Exit Node',
    body: 'IPDR logs show HDFC net-banking login from 185.220.101.5 (ProtonVPN Frankfurt exit) at 03:00 AM — 5 minutes before RTGS transaction. Source MSISDN: +91 91234 56789.',
    timestamp: '2026-08-17 03:00:15',
    relatedEntities: ['Rajesh Verma', '185.220.101.5', 'HDFC ...8921'],
    isDismissed: false,
    navigateTo: 'graph'
  },
  {
    id: 'ALT-006',
    severity: 'HIGH',
    category: 'SOCIAL',
    title: 'Coded Directive Detected on Instagram DM — Sector 43 Reference',
    body: 'Account @shadow01 sent a direct message: "Meet at sector 43 near ISBT, bring the bag, V will be there". NLP classification: HIGH-RISK COORDINATION. Timestamp matches tower co-location.',
    timestamp: '2026-08-17 01:58:33',
    relatedEntities: ['@shadow01', 'Vikram Sharma', '@master_v'],
    isDismissed: false,
    navigateTo: 'social_media'
  },
  {
    id: 'ALT-007',
    severity: 'HIGH',
    category: 'CDR',
    title: 'Night Call Cluster: 47 Calls Between 01:00–04:00 AM in 10 Days',
    body: 'CDR analysis shows 47 calls between +91 98765 43210 and +91 91234 56789 exclusively in the 01:00–04:00 AM window over the past 10 days. Operational security pattern.',
    timestamp: '2026-08-17 03:55:00',
    relatedEntities: ['+91 98765 43210', '+91 91234 56789'],
    isDismissed: false,
    navigateTo: 'timeline'
  },
  {
    id: 'ALT-008',
    severity: 'MEDIUM',
    category: 'BANK',
    title: 'Round-Trip Transfer Pattern: Apex Trading → Vikram → Apex',
    body: 'Rs 8,50,000 transferred from Apex Trading to vikram.sharma@paytm, then Rs 8,20,000 returned within 6 hours via IMPS. Classic round-trip laundering signature.',
    timestamp: '2026-08-14 14:22:10',
    relatedEntities: ['Vikram Sharma', 'Apex Trading Ltd'],
    isDismissed: false,
    navigateTo: 'finance'
  },
  {
    id: 'ALT-009',
    severity: 'MEDIUM',
    category: 'GEO',
    title: 'Ananya Gupta at Mohali Phase 7 During Cash Drop Window',
    body: 'Tower pings show Ananya Gupta (Director, Apex Trading) at Mohali Phase 7 Industrial Area for 2,400 seconds on the same morning as the verified ATM cash-out by Rajesh Verma.',
    timestamp: '2026-08-17 11:45:00',
    relatedEntities: ['Ananya Gupta', 'MOH-0701-A'],
    isDismissed: false,
    navigateTo: 'map'
  },
  {
    id: 'ALT-010',
    severity: 'MEDIUM',
    category: 'SOCIAL',
    title: 'Shared Social Account Cluster — 3 Suspects, 1 Common IP',
    body: 'Instagram accounts @shadow01, @master_v, and @ananya.k all logged in from IP 103.24.88.12 within the same 3-hour window, suggesting shared infrastructure or coordinated access.',
    timestamp: '2026-08-16 22:15:00',
    relatedEntities: ['@shadow01', '@master_v', '@ananya.k'],
    isDismissed: false,
    navigateTo: 'social_media'
  },
  {
    id: 'ALT-011',
    severity: 'MEDIUM',
    category: 'IP',
    title: 'Repeated VPN Session to Same Crypto Exchange',
    body: 'IPDR shows 5 separate VPN sessions from MSISDN +91 91234 56789 connecting to Binance API endpoints between Aug 14–17, correlating with post-transfer timing.',
    timestamp: '2026-08-17 05:22:00',
    relatedEntities: ['Rajesh Verma', '185.220.101.5'],
    isDismissed: false,
    navigateTo: 'graph'
  },
  {
    id: 'ALT-012',
    severity: 'LOW',
    category: 'CDR',
    title: 'Anomalous Silence: 48-hr Call Blackout After Wire Transfer',
    body: 'Following the Rs 25L RTGS transfer, all three suspects showed zero call activity for 48 hours — a known counter-surveillance pattern used by organized crime syndicates.',
    timestamp: '2026-08-19 03:00:00',
    relatedEntities: ['Vikram Sharma', 'Rajesh Verma', 'Ananya Gupta'],
    isDismissed: false,
    navigateTo: 'timeline'
  }
];

export const MOCK_CORRELATIONS: CorrelationLink[] = [
  {
    id: 'COR-01',
    entityA: 'Vikram "Shadow" Sharma',
    entityB: 'Rajesh Verma',
    score: 91,
    verdict: 'VERY HIGH',
    evidenceSources: [
      { channel: 'CDR',    label: '142 direct calls over 10 days',              count: 142, navigateTo: 'timeline'       },
      { channel: 'GEO',    label: '3 tower co-location events (night window)',   count: 3,   navigateTo: 'map'            },
      { channel: 'UPI',    label: '₹85,000 UPI transfer via Paytm',             count: 1,   amount: 85000, navigateTo: 'finance' },
      { channel: 'IP',     label: 'Shared IP session (ProtonVPN, 03:00 AM)',    count: 1,   navigateTo: 'graph'          },
      { channel: 'SOCIAL', label: 'Direct Instagram coordination message',      count: 1,   navigateTo: 'social_media'   }
    ]
  },
  {
    id: 'COR-02',
    entityA: 'Vikram "Shadow" Sharma',
    entityB: 'Ananya Gupta',
    score: 78,
    verdict: 'HIGH',
    evidenceSources: [
      { channel: 'BANK',   label: 'Co-signatory on Apex Trading HDFC account',  count: 1,   navigateTo: 'finance'       },
      { channel: 'CDR',    label: '38 calls (mainly business hours)',            count: 38,  navigateTo: 'timeline'      },
      { channel: 'UPI',    label: '₹9,80,000 via apex.trading@icici',           count: 12,  amount: 980000, navigateTo: 'finance' },
      { channel: 'GEO',    label: 'Co-located at Panchkula Sector 5 (once)',    count: 1,   navigateTo: 'map'           }
    ]
  },
  {
    id: 'COR-03',
    entityA: 'Rajesh Verma',
    entityB: 'Ananya Gupta',
    score: 64,
    verdict: 'HIGH',
    evidenceSources: [
      { channel: 'GEO',    label: 'Co-located at Mohali Phase 7 (twice)',        count: 2,   navigateTo: 'map'           },
      { channel: 'CDR',    label: '21 calls via Jio burner SIM',                 count: 21,  navigateTo: 'timeline'      },
      { channel: 'BANK',   label: '₹2,00,000 ATM withdrawal same day as wire',  count: 1,   amount: 200000, navigateTo: 'finance' }
    ]
  },
  {
    id: 'COR-04',
    entityA: 'Vikram "Shadow" Sharma',
    entityB: 'Apex Trading Ltd (HDFC ...8921)',
    score: 97,
    verdict: 'VERY HIGH',
    evidenceSources: [
      { channel: 'BANK',   label: '₹1.85 Cr total inflow / outflow managed',    count: 89,  amount: 18500000, navigateTo: 'finance' },
      { channel: 'UPI',    label: 'Directly controls apex.trading@icici VPA',    count: 1,   navigateTo: 'finance'       },
      { channel: 'CDR',    label: 'Calls before and after every major transfer', count: 22,  navigateTo: 'timeline'      },
      { channel: 'IP',     label: 'Net-banking logins from Vikram\'s IPDR range',count: 5,   navigateTo: 'graph'         }
    ]
  },
  {
    id: 'COR-05',
    entityA: 'Rajesh Verma',
    entityB: '185.220.101.5 (ProtonVPN)',
    score: 82,
    verdict: 'VERY HIGH',
    evidenceSources: [
      { channel: 'IP',     label: '5 IPDR sessions, always post-transfer',       count: 5,   navigateTo: 'graph'         },
      { channel: 'CDR',    label: 'MSISDN matched to source session',            count: 5,   navigateTo: 'timeline'      },
      { channel: 'BANK',   label: 'Unauthorized net-banking access via this IP', count: 1,   navigateTo: 'finance'       }
    ]
  },
  {
    id: 'COR-06',
    entityA: '@shadow01 (Instagram)',
    entityB: 'Vikram "Shadow" Sharma',
    score: 89,
    verdict: 'VERY HIGH',
    evidenceSources: [
      { channel: 'SOCIAL', label: 'Account registered to Vikram\'s phone number',count: 1,   navigateTo: 'social_media'  },
      { channel: 'IP',     label: 'Login IP matches IPDR for +91 98765 43210',   count: 3,   navigateTo: 'graph'         },
      { channel: 'CDR',    label: 'DM timestamps align with 14 CDR events',      count: 14,  navigateTo: 'timeline'      },
      { channel: 'GEO',    label: 'App GPS embedded in media post metadata',     count: 2,   navigateTo: 'map'           }
    ]
  }
];

export const MOCK_SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'SP-001',
    platform: 'Instagram',
    author: 'Vikram Sharma',
    handle: '@shadow01',
    text: 'Meet at sector 43 near ISBT, bring the bag, V will be there. No calls. DM only.',
    timestamp: '2026-08-17 01:58:33',
    sentiment: 'SUSPICIOUS',
    mentionedEntities: ['@master_v', 'Rajesh Verma'],
    linkedIp: '103.24.88.12',
    evidenceId: 'SOCIAL-001',
    location: 'Sector 43, Chandigarh'
  },
  {
    id: 'SP-002',
    platform: 'Instagram',
    author: 'Vikram Sharma',
    handle: '@shadow01',
    text: 'Package cleared ✅ Drop confirmed at Mohali point. Next batch ready by Friday.',
    timestamp: '2026-08-17 04:30:00',
    sentiment: 'SUSPICIOUS',
    mentionedEntities: ['@ananya.k'],
    linkedIp: '103.24.88.12',
    evidenceId: 'SOCIAL-002'
  },
  {
    id: 'SP-003',
    platform: 'Twitter',
    author: 'Rajesh Verma',
    handle: '@raju_op99',
    text: 'Out of office this week. Handling some personal logistics in Mohali. DMs open for biz.',
    timestamp: '2026-08-16 18:10:00',
    sentiment: 'ALERT',
    mentionedEntities: [],
    linkedIp: '103.24.88.55',
    evidenceId: 'SOCIAL-003'
  },
  {
    id: 'SP-004',
    platform: 'WhatsApp',
    author: 'Vikram Sharma',
    handle: 'Master V (919876543210)',
    text: 'Clear the cash box before 4 PM. Transfer 10L to Mohali drop point. Delete this after.',
    timestamp: '2026-08-17 10:30:15',
    sentiment: 'SUSPICIOUS',
    mentionedEntities: ['Rajesh Verma'],
    evidenceId: 'SOCIAL-004'
  },
  {
    id: 'SP-005',
    platform: 'Instagram',
    author: 'Ananya Gupta',
    handle: '@ananya.k',
    text: 'Board meeting done ✨ Exciting new partnership with Apex Group starting next quarter!',
    timestamp: '2026-08-15 14:22:00',
    sentiment: 'ALERT',
    mentionedEntities: ['@shadow01'],
    linkedIp: '103.24.88.12',
    evidenceId: 'SOCIAL-005',
    location: 'Panchkula'
  },
  {
    id: 'SP-006',
    platform: 'Instagram',
    author: 'Vikram Sharma',
    handle: '@shadow01',
    text: 'New account setup done. Tell everyone to move to the new VPA from tomorrow. Old one goes dark.',
    timestamp: '2026-08-14 22:05:00',
    sentiment: 'SUSPICIOUS',
    mentionedEntities: ['@raju_op99', '@ananya.k'],
    linkedIp: '103.24.88.12',
    evidenceId: 'SOCIAL-006'
  },
  {
    id: 'SP-007',
    platform: 'Twitter',
    author: 'Rajesh Verma',
    handle: '@raju_op99',
    text: 'Sector 17 ✅ Sector 43 ✅ Phase 7 ✅ All stops done. Good day.',
    timestamp: '2026-08-17 06:15:00',
    sentiment: 'ALERT',
    mentionedEntities: [],
    linkedIp: '103.24.88.55',
    evidenceId: 'SOCIAL-007'
  },
  {
    id: 'SP-008',
    platform: 'WhatsApp',
    author: 'Ananya Gupta',
    handle: 'Ananya (919789012345)',
    text: 'Paperwork signed. The account is live. Approvals through. Send me the transfer refs.',
    timestamp: '2026-08-13 11:40:00',
    sentiment: 'SUSPICIOUS',
    mentionedEntities: ['Vikram Sharma'],
    evidenceId: 'SOCIAL-008'
  },
  {
    id: 'SP-009',
    platform: 'Instagram',
    author: 'Vikram Sharma',
    handle: '@shadow01',
    text: 'भाई काम हो गया। अब चुप रहो सब। 3 दिन कोई connection नहीं। (Work done. All stay silent. No contact for 3 days.)',
    timestamp: '2026-08-17 05:50:00',
    sentiment: 'SUSPICIOUS',
    mentionedEntities: ['@master_v'],
    linkedIp: '103.24.88.12',
    evidenceId: 'SOCIAL-009'
  },
  {
    id: 'SP-010',
    platform: 'Instagram',
    author: 'Rajesh Verma',
    handle: '@master_v',
    text: 'Roger that. Going dark. Will ping when clear.',
    timestamp: '2026-08-17 05:55:00',
    sentiment: 'SUSPICIOUS',
    mentionedEntities: ['@shadow01'],
    linkedIp: '103.24.88.55',
    evidenceId: 'SOCIAL-010'
  },
  {
    id: 'SP-011',
    platform: 'Twitter',
    author: 'Ananya Gupta',
    handle: '@ananya.k',
    text: 'Proud to announce Apex Trading International expansion into UAE and Singapore markets! #Business #Growth',
    timestamp: '2026-08-10 09:00:00',
    sentiment: 'ALERT',
    mentionedEntities: [],
    linkedIp: '103.24.88.20',
    evidenceId: 'SOCIAL-011'
  },
  {
    id: 'SP-012',
    platform: 'WhatsApp',
    author: 'Vikram Sharma',
    handle: 'Master V (919876543210)',
    text: 'Rajesh bhai — use only new SIM from tomorrow. Old number is hot. I burned it.',
    timestamp: '2026-08-15 23:18:00',
    sentiment: 'SUSPICIOUS',
    mentionedEntities: ['Rajesh Verma'],
    evidenceId: 'SOCIAL-012'
  },
  {
    id: 'SP-013',
    platform: 'Instagram',
    author: 'Vikram Sharma',
    handle: '@shadow01',
    text: 'Confirming: Rs 10L moved. Ananya to sign off on Monday. Tell her to be ready.',
    timestamp: '2026-08-14 18:40:00',
    sentiment: 'SUSPICIOUS',
    mentionedEntities: ['@ananya.k'],
    linkedIp: '103.24.88.12',
    evidenceId: 'SOCIAL-013'
  },
  {
    id: 'SP-014',
    platform: 'Twitter',
    author: 'Rajesh Verma',
    handle: '@raju_op99',
    text: 'Anyone need bulk SIM connections for their business? 50+ available. DM me. No KYC hassle.',
    timestamp: '2026-08-12 14:55:00',
    sentiment: 'SUSPICIOUS',
    mentionedEntities: [],
    linkedIp: '103.24.88.55',
    evidenceId: 'SOCIAL-014'
  },
  {
    id: 'SP-015',
    platform: 'Instagram',
    author: 'Ananya Gupta',
    handle: '@ananya.k',
    text: 'Travel update — Panchkula → Mohali → Chandigarh all in one day 😅 Busy week!',
    timestamp: '2026-08-17 12:10:00',
    sentiment: 'ALERT',
    mentionedEntities: [],
    linkedIp: '103.24.88.20',
    evidenceId: 'SOCIAL-015',
    location: 'Mohali'
  }
];

