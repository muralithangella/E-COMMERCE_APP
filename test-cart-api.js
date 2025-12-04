const http = require('http');

// Test cart API
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/cart',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Cart API Response:', JSON.parse(data));
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
});

req.end();