@echo off
echo Installing Redis for Windows...

echo 1. Download Redis from GitHub releases
echo    https://github.com/microsoftarchive/redis/releases
echo.
echo 2. Or use Chocolatey:
echo    choco install redis-64
echo.
echo 3. Or use WSL:
echo    wsl --install
echo    sudo apt update
echo    sudo apt install redis-server
echo    redis-server
echo.
echo 4. Test Redis:
echo    redis-cli ping

pause