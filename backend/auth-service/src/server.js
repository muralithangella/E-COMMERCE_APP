const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5004;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

const certPath = path.join(__dirname, '../../certs/cert.pem');
const keyPath = path.join(__dirname, '../../certs/key.pem');

if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
  const options = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
  };
  https.createServer(options, app).listen(PORT, () => {
    console.log(`Auth Service running on HTTPS port ${PORT}`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`Auth Service running on HTTP port ${PORT} (SSL certs not found)`);
  });
}

module.exports = app;
