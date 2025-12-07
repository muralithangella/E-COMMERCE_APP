# SSL/HTTPS Setup Guide

## Development Setup

1. **Generate SSL Certificates**
```bash
cd backend
node generate-ssl.js
```

This creates self-signed certificates in `backend/certs/`:
- `cert.pem` - SSL certificate
- `key.pem` - Private key

2. **Update Frontend API URLs**
Change all API URLs from `http://` to `https://`:
- `http://localhost:5001` → `https://localhost:5001`
- `http://localhost:5002` → `https://localhost:5002`
- `http://localhost:5003` → `https://localhost:5003`
- `http://localhost:5004` → `https://localhost:5004`

3. **Trust Self-Signed Certificate**
Your browser will show a security warning. Click "Advanced" → "Proceed to localhost" to trust the certificate.

## Production Setup

For production, use certificates from a trusted Certificate Authority:

### Option 1: Let's Encrypt (Free)
```bash
# Install certbot
sudo apt-get install certbot

# Generate certificate
sudo certbot certonly --standalone -d yourdomain.com

# Certificates will be in /etc/letsencrypt/live/yourdomain.com/
```

Update server.js files to use production certificates:
```javascript
const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/fullchain.pem')
};
```

### Option 2: AWS Certificate Manager
If deploying on AWS, use ACM with Application Load Balancer for automatic SSL termination.

## Security Features Enabled

✅ **TLS 1.2/1.3** - Modern encryption protocols
✅ **Encrypted Data Transfer** - All requests/responses encrypted
✅ **HTTPS Only** - Secure communication channel
✅ **No Data Leaking** - Traffic encrypted end-to-end

## Environment Variables

Add to `.env`:
```
SSL_ENABLED=true
SSL_CERT_PATH=./certs/cert.pem
SSL_KEY_PATH=./certs/key.pem
```
