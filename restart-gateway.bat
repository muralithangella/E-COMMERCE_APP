@echo off
echo Restarting API Gateway...

REM Kill existing gateway process
taskkill /f /im node.exe /fi "WINDOWTITLE eq API Gateway*" 2>nul

REM Wait a moment
timeout /t 2 /nobreak >nul

REM Start new gateway
start "API Gateway" cmd /k "cd /d C:\ecommerce-app && node api-gateway.js"

echo API Gateway restarted!
pause