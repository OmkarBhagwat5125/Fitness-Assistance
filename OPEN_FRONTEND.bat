@echo off
REM ============================================
REM Health & Fitness AI Assistant - Open Frontend
REM ============================================

color 0B
title Opening Frontend

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║     Opening Health ^& Fitness AI Assistant Frontend          ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM Check if backend is running
echo 🔍 Checking if backend is running...
curl -s http://localhost:5000/health >nul 2>&1
if errorlevel 1 (
    echo.
    echo ⚠️  WARNING: Backend server is not running!
    echo.
    echo Please start the backend first:
    echo   1. Run START.bat
    echo   2. Wait for "Server running on http://localhost:5000"
    echo   3. Then run this script again
    echo.
    pause
    exit /b 1
)

echo ✅ Backend is running
echo.

REM Open frontend in default browser
echo 🌐 Opening frontend in your browser...
cd frontend
start index.html

echo.
echo ✅ Frontend opened!
echo.
echo If the page doesn't load properly:
echo   1. Make sure backend is running (START.bat)
echo   2. Try a different browser (Chrome/Edge recommended)
echo   3. Check browser console for errors (F12)
echo.
echo 🎤 For voice features:
echo   - Allow microphone permissions when prompted
echo   - Use Chrome, Edge, or Safari for best support
echo.

timeout /t 3 >nul
