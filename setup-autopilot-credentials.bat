@echo off
REM ====================================================
REM AVIATOR - Secure Credential Setup
REM ====================================================
REM This script launches the credential setup wizard
REM with masked password input
REM ====================================================

title AVIATOR - Secure Credential Setup

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ ERROR: Node.js is not installed or not in PATH
    echo.
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Navigate to the script directory
cd /d "%~dp0"

REM Run the credential setup script
node setup-credentials.js

REM Check if the script executed successfully
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ════════════════════════════════════════════════════════════
    echo  ✅ Setup Complete!
    echo ════════════════════════════════════════════════════════════
    echo.
    echo  Next Steps:
    echo  1. Restart your development server: npm run dev
    echo  2. The Autopilot Monitor will now work with your credentials
    echo.
    echo ════════════════════════════════════════════════════════════
    echo.
) else (
    echo.
    echo ❌ Setup failed. Please try again.
    echo.
)

pause
