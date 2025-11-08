@echo off
REM ============================================
REM Health & Fitness AI Assistant - Quick Start
REM ============================================

color 0A
title Health & Fitness AI Assistant

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║     Health ^& Fitness AI Assistant - Quick Start             ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python 3.8+ from python.org
    pause
    exit /b 1
)

echo ✅ Python is installed
echo.

REM Check if backend dependencies are installed
echo 🔍 Checking backend dependencies...
cd backend

if not exist ".env" (
    echo.
    echo ⚠️  WARNING: .env file not found!
    echo.
    echo Please create a .env file with your credentials:
    echo   1. Copy .env.example to .env
    echo   2. Add your DEEPSEEK_API_KEY
    echo   3. Add your SUPABASE_URL
    echo   4. Add your SUPABASE_KEY
    echo.
    pause
    exit /b 1
)

echo ✅ .env file found
echo.

REM Install dependencies if needed
echo 📦 Installing/checking dependencies...
pip install -r requirements.txt --quiet
if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies ready
echo.

REM Test connections
echo 🧪 Testing connections...
echo.
python test_connection.py
if errorlevel 1 (
    echo.
    echo ⚠️  Connection test failed!
    echo Please check your .env file and try again.
    echo.
    pause
    exit /b 1
)

echo.
echo ══════════════════════════════════════════════════════════════
echo.

REM Start the backend server
echo 🚀 Starting backend server...
echo.
echo Backend will run on: http://localhost:5000
echo.
echo ⚠️  Keep this window open while using the app!
echo.
echo To stop the server, press Ctrl+C
echo.
echo ══════════════════════════════════════════════════════════════
echo.

REM Start Flask app
python app.py

pause
