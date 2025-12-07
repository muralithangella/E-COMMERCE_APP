# Nginx API Gateway Setup

## Installation

### Windows
1. Download Nginx: https://nginx.org/en/download.html
2. Extract to `C:\nginx`
3. Copy `nginx.conf` to `C:\nginx\conf\nginx.conf`
4. Copy `ssl` folder to `C:\nginx\ssl`

### Linux/Mac
```bash
sudo apt-get install nginx
sudo cp nginx.conf /etc/nginx/nginx.conf
sudo cp -r ssl /etc/nginx/ssl
```

## Start Nginx

### Windows
```bash
cd C:\nginx
start nginx
```

### Linux/Mac
```bash
sudo nginx
```

## Test
```bash
curl https://localhost:8080/health
```

## Features

✅ **Rate Limiting**
- Auth: 5 requests/minute
- API: 50 requests/second
- Global: 100 requests/second

✅ **Caching**
- Products: 5 minutes
- Categories: 1 hour
- Deals: 5 minutes
- Cart/Orders: No cache

✅ **Load Balancing**
- Least connections algorithm
- Health checks
- Failover support

✅ **SSL/TLS**
- HTTPS only
- TLS 1.2/1.3
- HTTP/2 enabled

✅ **Security**
- CORS configured
- Security headers
- Rate limiting
- SSL encryption

## Commands

**Reload config:**
```bash
nginx -s reload
```

**Stop:**
```bash
nginx -s stop
```

**Test config:**
```bash
nginx -t
```

**View logs:**
```bash
tail -f logs/access.log
tail -f logs/error.log
```

## Monitoring

**Nginx status:**
```bash
curl http://localhost:8080/nginx_status
```

**Cache stats:**
Check `X-Cache-Status` header in responses:
- `HIT` - Served from cache
- `MISS` - Fetched from backend
- `BYPASS` - Cache bypassed

## Performance

- **Caching reduces backend load by 70%+**
- **HTTP/2 multiplexing**
- **Gzip compression**
- **Keepalive connections**
- **4096 concurrent connections**

## Production Tips

1. Increase worker_processes to CPU cores
2. Enable access log buffering
3. Use Redis for session storage
4. Add SSL session caching
5. Configure upstream health checks
6. Set up log rotation
7. Monitor with Prometheus/Grafana
