@echo off
echo Installing PM2 globally...
call npm install -g pm2

echo.
echo Starting all services with PM2...
call pm2 start ecosystem.config.js

echo.
echo ========================================
echo Services Started!
echo ========================================
echo.
echo Check status: pm2 status
echo View logs: pm2 logs
echo Monitor: pm2 monit
echo.
echo Services:
echo - Product: http://localhost:5006
echo - Cart: http://localhost:5002
echo - Order: http://localhost:5003
echo - Auth: http://localhost:5005
echo - Notification: http://localhost:5004
echo.
