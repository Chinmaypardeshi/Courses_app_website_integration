@echo off
TITLE UPSC EdTech Platform - Unified Enterprise Services
COLOR 0A

echo ==============================================================================
echo                 UPSC EDTECH UNIFIED ENTERPRISE PLATFORM
echo ==============================================================================
echo  1. Starting Unified Backend Service on Port 3000...
start "UPSC Backend Service" cmd /k "cd /d %~dp0backend && npm start"

timeout /t 3 /nobreak >nul

echo  2. Starting React Web Client on Port 5173...
start "UPSC React Web Client" cmd /k "cd /d %~dp0web && npm run dev"

echo ==============================================================================
echo  Services started successfully!
echo  - Unified Backend API:  http://localhost:3000
echo  - React Web Dashboard:  http://localhost:5173
echo  - Health Check:         http://localhost:3000/api/health
echo.
echo  To run the Flutter Mobile App:
echo  1. Open a new terminal
echo  2. cd mobile
echo  3. flutter run
echo ==============================================================================
pause
