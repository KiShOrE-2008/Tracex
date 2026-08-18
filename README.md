# 🛡️ Nexus Evidence (Tracex)
> **Forensic Intelligence & Digital Evidence Workspace**

**Nexus Evidence** is a modern digital forensics and crime investigation workspace designed to assist law enforcement agencies (such as Chandigarh Police) in managing digital evidence, analyzing complex suspect networks, and producing court-admissible reports.

---

## ✨ Key Features

- **📁 Evidence Vault & Cryptographic Verification**  
  Ingest digital evidence files with automatic **SHA-256 cryptographic hash verification** to preserve strict chain-of-custody.

- **🕸️ Entity Link Analysis Graph**  
  Visualize complex networks connecting suspects, phone numbers, IP addresses, bank accounts, vehicle numbers, and crime scenes.

- **📍 Geospatial Cell Tower Mapping**  
  Map Call Detail Records (CDR) and cell tower pings to track suspect movements and spatial patterns.

- **📅 Chronological Event Stream**  
  Timeline view of all case-related events, phone calls, transactions, and location logs in sequential order.

- **💳 Financial Flow & Money Trail**  
  Trace suspicious financial transactions, bank transfers, mule accounts, and fraud patterns.

- **🧬 Entity DNA 360 Profiler**  
  Comprehensive profile summaries for targets, aggregating call frequency, risk scores, linked entities, and criminal background.

- **🤖 AI Forensic Copilot**  
  AI-assisted intelligence query engine to discover hidden patterns, generate leads, and answer case questions.

- **📜 Section 65B Court-Ready Reports**  
  Automated generation of Indian Evidence Act **Section 65B Certificates** and legal case summaries.

- **🔒 Immutable Audit Log**  
  Cryptographically hash-chained audit log recording every user action, file access, and modification for strict legal compliance.

---

## 🛠️ Tech Stack

- **Frontend Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS v4
- **Mapping:** Leaflet & React-Leaflet
- **Icons:** Lucide React
- **Data Parsing:** PapaParse

---

## 🚀 Quick Start

### 1. Prerequisites
Ensure you have **Node.js** (v18 or higher) and **npm** installed.

### 2. Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/Priyanka-IT-cit/Tracex.git
cd Tracex
npm install
```

### 3. Start Development Server
Run the local dev server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
To create an optimized production build:

```bash
npm run build
```

---

## 📁 Project Structure

```
Nexus_Evidence/
├── src/
│   ├── components/     # UI views (Overview, Evidence, Graph, Map, Timeline, etc.)
│   ├── data/           # Mock forensic data & data generators
│   ├── types/          # TypeScript definitions for evidence, entities, and logs
│   ├── App.tsx         # Main layout & navigation container
│   └── main.tsx        # Application entry point
├── public/             # Static assets & icons
├── index.html          # HTML entry point
├── vite.config.ts      # Vite configuration
└── package.json        # Dependencies & scripts
```

---

## 📄 License

Developed for Law Enforcement & Forensic Analysis Workflows.