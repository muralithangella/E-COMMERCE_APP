const axios = require('axios');

async function testServices() {
  console.log('Testing API Gateway and Backend Services...\n');
  
  const tests = [
    { name: 'API Gateway Health', url: 'http://localhost:8081/health' },
    { name: 'Product Service Health', url: 'http://localhost:5006/health' },
    { name: 'Cart Service Health', url: 'http://localhost:5002/health' },
    { name: 'Products API via Gateway', url: 'http://localhost:8081/api/products' },
    { name: 'Categories API via Gateway', url: 'http://localhost:8081/api/categories' }
  ];

  for (const test of tests) {
    try {
      const response = await axios.get(test.url, { timeout: 5000 });
      console.log(`✅ ${test.name}: OK (${response.status})`);
    } catch (error) {
      console.log(`❌ ${test.name}: FAILED`);
      if (error.code === 'ECONNREFUSED') {
        console.log(`   Service not running on ${test.url}`);
      } else {
        console.log(`   Error: ${error.message}`);
      }
    }
  }
}

testServices();