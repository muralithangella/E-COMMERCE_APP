# Test RabbitMQ Order Flow
Write-Host "Testing RabbitMQ Order Creation..." -ForegroundColor Cyan

$body = @{
    items = @(
        @{ 
            productId = "test-123"
            name = "Test Product"
            quantity = 2
            price = 1000
        }
    )
    total = 2000
    customerEmail = "test@example.com"
    customerName = "Test User"
} | ConvertTo-Json

Write-Host "`nSending order to Order Service..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5003/api/orders" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
    Write-Host "✅ Order Created Successfully!" -ForegroundColor Green
    Write-Host $response.Content
    Write-Host "`n📋 Check the following:" -ForegroundColor Cyan
    Write-Host "1. Order Service console should show: '✅ Order event published to RabbitMQ'" -ForegroundColor White
    Write-Host "2. Notification Service console should show: 'Notification sent: Order ORD-xxx'" -ForegroundColor White
    Write-Host "3. RabbitMQ Management UI (http://localhost:15672) should show message activity" -ForegroundColor White
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    Write-Host "`n⚠️ Make sure:" -ForegroundColor Yellow
    Write-Host "1. RabbitMQ is running: docker ps | findstr rabbitmq" -ForegroundColor White
    Write-Host "2. Order Service is running on port 5003" -ForegroundColor White
    Write-Host "3. Notification Service is running on port 5004" -ForegroundColor White
}
