const http = require('http');

function testAPI(path, name) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:8081${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`✅ ${name}: ${res.statusCode}`);
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            console.log(`   Response: ${JSON.stringify(json).substring(0, 100)}...`);
          } catch (e) {
            console.log(`   Response: ${data.substring(0, 100)}...`);
          }
        }
        resolve(true);
      });
    });
    
    req.on('error', (err) => {
      console.log(`❌ ${name}: ${err.message}`);
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log(`❌ ${name}: TIMEOUT`);
      req.destroy();
      resolve(false);
    });
  });
}

async function testEndpoints() {
  console.log('Testing API endpoints...\n');
  
  await testAPI('/api/products', 'Products API');
  await testAPI('/api/categories', 'Categories API');
  await testAPI('/api/deals', 'Deals API');
  await testAPI('/api/cart', 'Cart API');
}

testEndpoints();