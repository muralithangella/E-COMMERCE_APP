@echo off
echo Installing Redis on Windows...

echo 1. Downloading Redis for Windows...
powershell -Command "Invoke-WebRequest -Uri 'https://github.com/microsoftarchive/redis/releases/download/win-3.0.504/Redis-x64-3.0.504.zip' -OutFile 'redis.zip'"

echo 2. Extracting Redis...
powershell -Command "Expand-Archive -Path 'redis.zip' -DestinationPath 'redis' -Force"

echo 3. Starting Redis server...
cd redis
start "Redis Server" redis-server.exe

echo 4. Waiting for Redis to start...
timeout /t 3 /nobreak

echo 5. Testing Redis...
redis-cli.exe ping

echo Redis installation complete!
echo Redis server is running in a separate window.

pause