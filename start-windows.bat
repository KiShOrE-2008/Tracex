@echo off
title NEXUS Evidence - Dev Server (Windows)
echo ===================================================
echo   NEXUS Evidence Forensic Workspace - Windows Runner
echo ===================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please download and install Node.js v18 or v20+ from:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm is not found in PATH!
    echo.
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo [INFO] node_modules not found. Installing dependencies...
    call npm.cmd install
    if %errorlevel% neq 0 (
        echo.
        echo [ERROR] npm install failed.
        pause
        exit /b 1
    )
)

echo [INFO] Starting Vite development server...
echo [INFO] Press Ctrl+C in this terminal to stop the server.
echo.
call npm.cmd run dev

if %errorlevel% neq 0 (
    echo.
    echo [NOTE] If you encountered an execution policy error in PowerShell,
    echo run this in PowerShell as Administrator:
    echo     Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
    echo.
    pause
)
