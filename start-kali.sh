#!/usr/bin/env bash
# ===================================================
#   NEXUS Evidence Forensic Workspace - Kali Linux Runner
# ===================================================

set -e

echo "==================================================="
echo "  NEXUS Evidence Forensic Workspace - Kali Linux"
echo "==================================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "[!] Node.js is not installed."
    echo "[*] Recommended installation for Kali Linux / Debian:"
    echo "    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -"
    echo "    sudo apt-get install -y nodejs"
    exit 1
fi

NODE_VER=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VER" -lt 18 ]; then
    echo "[WARNING] Detected Node.js $(node -v). Vite 8 and React 19 require Node.js >= 18."
    echo "[*] Update Node.js via NodeSource: curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt install -y nodejs"
    echo ""
fi

# Check npm
if ! command -v npm &> /dev/null; then
    echo "[!] npm is not found. Please install via: sudo apt-get install -y npm"
    exit 1
fi

# Check node_modules
if [ ! -d "node_modules" ]; then
    echo "[*] Installing dependencies with npm install..."
    npm install
fi

echo "[*] Starting Vite dev server bound to 0.0.0.0 (port 5173)..."
echo "[*] Access locally: http://localhost:5173"
echo "[*] Press Ctrl+C to terminate."
echo ""

npm run dev -- --host 0.0.0.0
