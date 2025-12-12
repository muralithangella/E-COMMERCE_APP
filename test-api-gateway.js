const axios = require('axios');

async function testAPIGateway() {
  console.log('Testing API Gateway...');
  
  try {
    // Test gateway health
    const healthResponse = await axios.get('http://localhost:8081/health');
    console.log('✅ Gateway Health:', healthResponse.data);
    
    // Test products endpoint
    const productsResponse = await axios.get('http://localhost:8081/api/products');
    console.log('✅ Products API:', productsResponse.data);
    
    // Test categories endpoint
    const categoriesResponse = await axios.get('http://localhost:8081/api/categories');
    console.log('✅ Categories API:', categoriesResponse.data);
    
  } catch (error) {
    console.error('❌ API Gateway Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
  }
}

testAPIGateway();