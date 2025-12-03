@echo off
echo ========================================
echo E-Commerce Manual Setup (No Docker)
echo ========================================

echo.
echo This will guide you through manual installation of services.
echo.

echo 1. MongoDB Installation:
echo   - Download from: https://www.mongodb.com/try/download/community
echo   - Install and start MongoDB service
echo   - Default port: 27017
echo.

echo 2. Redis Installation:
echo   - Download from: https://github.com/microsoftarchive/redis/releases
echo   - Or use: https://redis.io/download
echo   - Start Redis server on port 6379
echo.

echo 3. Apache Kafka Installation:
echo   - Download from: https://kafka.apache.org/downloads
echo   - Extract and follow quickstart guide
echo   - Start Zookeeper first, then Kafka
echo.

echo 4. Test connections:
node test-local-setup.js

pause