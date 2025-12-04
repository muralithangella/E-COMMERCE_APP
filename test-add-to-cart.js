const http = require('http');

// Test adding product to cart
const postData = JSON.stringify({
  productId: '1',
  quantity: 1
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/cart/add',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Add to Cart Response:', JSON.parse(data));
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
});

req.write(postData);
req.end();