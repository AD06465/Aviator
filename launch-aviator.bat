@echo off
cls
echo.
echo ========================================
echo    AVIATOR LAUNCHER
echo    FlightDeck Task Automation System
echo ========================================
echo.

:: Navigate to script directory
cd /d "%~dp0"
echo [INFO] Working directory: %CD%
echo.

:: ============================================================
:: Check Node.js
:: ============================================================
echo [STEP 1/3] Checking Node.js installation...
where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)
node --version
echo [OK] Node.js is installed
echo.

:: ============================================================
:: Install Dependencies (if needed)
:: ============================================================
echo [STEP 2/3] Checking dependencies...
if not exist "node_modules\" (
    echo [INFO] Installing dependencies...
    call npm install
    echo [OK] Dependencies installed
) else (
    echo [OK] Dependencies already installed
)
echo.

:: ============================================================
:: Launch Server and Browser
:: ============================================================
echo [STEP 3/3] Launching AVIATOR...
echo.
echo ========================================
echo  Starting Development Server
echo ========================================
echo.

:: Start dev server in new PowerShell window
echo [INFO] Opening dev server in new window...
start "AVIATOR Dev Server" powershell -NoExit -Command "cd '%CD%'; Write-Host ''; Write-Host 'AVIATOR Development Server' -ForegroundColor Green; Write-Host '================================' -ForegroundColor Green; Write-Host ''; npm run dev"

:: Wait for server to start
echo [INFO] Waiting 15 seconds for server to initialize...
timeout /t 15 /nobreak >nul

:: Open browser only once
echo [INFO] Opening browser...
echo [INFO] If browser doesn't open, manually visit: http://localhost:3000
start "" http://localhost:3000 2>nul

echo.
echo ========================================
echo  AVIATOR IS RUNNING!
echo ========================================
echo.
echo [OK] Server: Running in separate window
echo [OK] Browser: http://localhost:3000
echo.
echo To stop: Close the "AVIATOR Dev Server" window
echo.
pause
