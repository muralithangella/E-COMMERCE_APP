@echo off
echo Starting Production Infrastructure...

echo [1/3] Starting Redis, RabbitMQ, and Nginx...
docker-compose -f docker-compose.prod.yml up -d

timeout /t 5 /nobreak > nul

echo [2/3] Installing PM2 globally (if not installed)...
call npm list -g pm2 >nul 2>&1 || npm install -g pm2

echo [3/3] Starting all microservices with PM2...
cd %~dp0
call pm2 start ecosystem.config.js

echo.
echo ========================================
echo Production System Started Successfully!
echo ========================================
echo.
echo Services Running:
echo - Product Service: Multiple instances (PM2 cluster mode)
echo - Cart Service: Multiple instances (PM2 cluster mode)
echo - Order Service: 4 instances
echo - Auth Service: 4 instances
echo - Notification Service: 2 instances
echo - Redis: localhost:6379
echo - RabbitMQ: localhost:5672 (Management: localhost:15672)
echo - Nginx Load Balancer: https://localhost:8080
echo.
echo Monitoring Commands:
echo - pm2 status          : View all services
echo - pm2 monit           : Real-time monitoring
echo - pm2 logs            : View logs
echo - pm2 restart all     : Restart all services
echo - pm2 stop all        : Stop all services
echo.
