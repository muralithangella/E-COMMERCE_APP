@echo off
echo Stopping Production System...

echo [1/2] Stopping PM2 services...
call pm2 stop all
call pm2 delete all

echo [2/2] Stopping Docker containers...
docker-compose -f docker-compose.prod.yml down

echo.
echo Production System Stopped Successfully!
