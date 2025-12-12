@echo off
echo Starting All E-commerce Services...

start "API Gateway" cmd /k "cd /d C:\ecommerce-app && node api-gateway.js"
timeout /t 2 /nobreak >nul

start "Auth Service" cmd /k "cd /d C:\ecommerce-app\backend\auth-service && npm start"
timeout /t 2 /nobreak >nul

start "Product Service" cmd /k "cd /d C:\ecommerce-app\backend\product-service && npm start"
timeout /t 2 /nobreak >nul

start "Cart Service" cmd /k "cd /d C:\ecommerce-app\backend\cart-service && npm start"
timeout /t 3 /nobreak >nul

start "Shell App" cmd /k "cd /d C:\ecommerce-app\frontend\shell && npm start"
timeout /t 2 /nobreak >nul

start "Products MF" cmd /k "cd /d C:\ecommerce-app\frontend\products-mf && npm start"
timeout /t 2 /nobreak >nul

start "Cart MF" cmd /k "cd /d C:\ecommerce-app\frontend\cart-mf && npm start"
timeout /t 2 /nobreak >nul

start "Auth MF" cmd /k "cd /d C:\ecommerce-app\frontend\auth-mf && npm start"

echo All services are starting...
echo Main App will be available at: http://localhost:3000
echo API Gateway at: http://localhost:8081
pause