const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testAPI() {
  console.log('🚀 Testing E-commerce API...\n');

  const tests = [
    { name: 'Health Check', url: '/health' },
    { name: 'Readiness Check', url: '/ready' },
    { name: 'Products API', url: '/api/products' },
    { name: 'Categories API', url: '/api/categories' }
  ];

  for (const test of tests) {
    try {
      const response = await axios.get(`${BASE_URL}${test.url}`);
      console.log(`✅ ${test.name}: ${response.status} - ${response.statusText}`);
    } catch (error) {
      console.log(`❌ ${test.name}: ${error.response?.status || 'Connection Error'} - ${error.message}`);
    }
  }

  console.log('\n🎉 API testing completed!');
}

testAPI();