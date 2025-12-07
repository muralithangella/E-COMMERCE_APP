@echo off
echo Starting All Microservices...
echo.

start "Product Service (5001)" cmd /k "cd product-service && npm start"
timeout /t 2 /nobreak >nul

start "Cart Service (5002)" cmd /k "cd cart-service && npm start"
timeout /t 2 /nobreak >nul

start "Order Service (5003)" cmd /k "cd order-service && npm start"
timeout /t 2 /nobreak >nul

start "Auth Service (5004)" cmd /k "cd auth-service && npm start"

echo.
echo All services started!
echo Product Service: http://localhost:5001
echo Cart Service: http://localhost:5002
echo Order Service: http://localhost:5003
echo Auth Service: http://localhost:5004
pause
