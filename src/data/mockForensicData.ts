import type { EvidenceFile, GraphNode, GraphEdge, TowerPing, TimelineEvent, FinancialTxn, EntityDNA, AuditLogItem } from '../types/forensic';

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
  { id: 'LOG-8801', timestamp: '2026-08-18 09:42:15', analyst: 'Insp. R. S. Gill (ID: PN-789)', action: 'FILE_INGESTION', resource: 'airtel_suspect_1_cdr.csv', hash: '8f4e2b91c83a54d7e6201f9a1c4b7890d2e4f5a6', ipAddress: '10.240.12.45' },
  { id: 'LOG-8802', timestamp: '2026-08-18 09:44:30', analyst: 'Insp. R. S. Gill (ID: PN-789)', action: 'OCR_PARSE', resource: 'hdfc_bank_statement_Q3.pdf', hash: '3a9c4d8e7b1a2f5c6d0e9f8a7b6c5d4e3f2a1b0c', ipAddress: '10.240.12.45' },
  { id: 'LOG-8803', timestamp: '2026-08-18 10:15:02', analyst: 'Forensic Analyst K. Mehta', action: 'GRAPH_LINK_ANALYSIS', resource: 'PN-2026-001 Entity Canvas', hash: '4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f', ipAddress: '10.240.12.88' },
  { id: 'LOG-8804', timestamp: '2026-08-18 11:05:40', analyst: 'Forensic Analyst K. Mehta', action: 'TOWER_CO_LOCATION_QUERY', resource: 'Sector 43 ISBT Cell Site', hash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b', ipAddress: '10.240.12.88' },
  { id: 'LOG-8805', timestamp: '2026-08-18 12:30:00', analyst: 'SSP Cyber Cell (Admin)', action: 'REPORT_EXPORT', resource: 'Operation_Shadow_Court_Report.pdf', hash: '9b8a7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b', ipAddress: '10.240.10.01' }
];
