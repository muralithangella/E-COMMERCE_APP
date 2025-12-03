@echo off
echo Testing E-commerce API Endpoints
echo ================================

set BASE_URL=http://localhost:5000

echo.
echo 1. Testing Health Check...
curl -s -w "Status: %%{http_code}\n" %BASE_URL%/health

echo.
echo 2. Testing Readiness Check...
curl -s -w "Status: %%{http_code}\n" %BASE_URL%/ready

echo.
echo 3. Testing Products API...
curl -s -w "Status: %%{http_code}\n" %BASE_URL%/api/products

echo.
echo 4. Testing Categories API...
curl -s -w "Status: %%{http_code}\n" %BASE_URL%/api/categories

echo.
echo 5. Testing User Registration...
curl -s -w "Status: %%{http_code}\n" -X POST %BASE_URL%/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"Test123!@#\",\"role\":\"customer\"}"

echo.
echo 6. Testing User Login...
curl -s -w "Status: %%{http_code}\n" -X POST %BASE_URL%/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"Test123!@#\"}"

echo.
echo API Testing Complete!
pause