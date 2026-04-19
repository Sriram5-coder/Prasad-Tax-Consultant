@echo off
echo.
echo  ====================================
echo   Prasad CA Works — Starting Server
echo  ====================================
cd /d "%~dp0backend"
call npm install
echo.
echo  Website:  http://localhost:3001
echo  Admin:    http://localhost:3001/admin
echo.
node server.js
pause
