@echo off
echo ========================================
echo RabbitMQ Connection Test
echo ========================================
echo.

node test-rabbitmq-connection.js

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Test completed successfully!
    echo ========================================
) else (
    echo.
    echo ========================================
    echo Test failed! Check the errors above.
    echo ========================================
    echo.
    echo Troubleshooting:
    echo 1. Make sure RabbitMQ is running
    echo 2. Check if port 5672 is accessible
    echo 3. Verify RABBITMQ_URL in .env file
    echo.
)

pause

