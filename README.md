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

## 🚀 Quick Start (Windows & Kali Linux)

### 1. Prerequisites
- **Node.js**: v18 or v20+ LTS
- **npm**: v9+

---

### 🪟 Windows Instructions

#### Option A: One-Click Runner
Simply double-click or run `start-windows.bat`:
```cmd
.\start-windows.bat
```

#### Option B: Using Command Prompt (CMD)
```cmd
git clone https://github.com/Priyanka-IT-cit/Tracex.git
cd Tracex
npm install
npm run dev
```

#### ⚠️ Common Windows Issue & Fix:
If PowerShell says *"running scripts is disabled on this system"* (`npm.ps1 cannot be loaded`), run this once in PowerShell:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```
*(Or run `npm.cmd run dev` or use CMD instead of PowerShell)*

---

### 🐧 Kali Linux Instructions

#### Step 1: Install Node.js 20+ (NodeSource)
If you don't have Node.js 18+ installed on Kali:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Step 2: Run One-Click Script
```bash
chmod +x start-kali.sh
./start-kali.sh
```

#### Or Run Manually:
```bash
git clone https://github.com/Priyanka-IT-cit/Tracex.git
cd Tracex
npm install
npm run dev
```

Open **`http://localhost:5173`** (or your Kali IP if running inside a VM/WSL) in your browser.

---

### 🔄 Moving Project between Windows & Kali Linux
> **IMPORTANT:** Never copy the `node_modules` folder across different operating systems (Windows and Linux use different native binaries).
> If you copied the folder directly from Linux to Windows (or vice versa), clean and reinstall:
> ```bash
> # Remove existing node_modules & lockfile:
> # Windows (CMD): rmdir /s /q node_modules & del package-lock.json
> # Linux / Kali: rm -rf node_modules package-lock.json
> 
> # Then reinstall:
> npm install
> npm run dev
> ```

---

### 📦 Build for Production
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