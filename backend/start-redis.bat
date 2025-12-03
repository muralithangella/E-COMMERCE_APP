@echo off
echo Starting Redis Server...

REM Check if Redis is in PATH
redis-server --version >nul 2>&1
if %errorlevel% == 0 (
    echo Redis found in PATH, starting server...
    start "Redis Server" redis-server
    goto :test
)

REM Check if Redis is in local redis folder
if exist "redis\redis-server.exe" (
    echo Redis found in local folder, starting server...
    cd redis
    start "Redis Server" redis-server.exe
    cd ..
    goto :test
)

REM Redis not found
echo Redis not found. Installing...
call install-redis-windows.bat
goto :end

:test
echo Waiting for Redis to start...
timeout /t 3 /nobreak

echo Testing Redis connection...
redis-cli ping 2>nul || redis\redis-cli.exe ping 2>nul
if %errorlevel% == 0 (
    echo ✅ Redis is running successfully!
) else (
    echo ❌ Redis failed to start
)

:end
pause