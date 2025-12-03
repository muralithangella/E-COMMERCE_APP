const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Simple proxy for auth
app.post('/api/auth/login', async (req, res) => {
  try {
    const response = await fetch('http://localhost:3009/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Auth service unavailable' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'simple-gateway' });
});

app.listen(PORT, () => {
  console.log(`Simple gateway running on port ${PORT}`);
});