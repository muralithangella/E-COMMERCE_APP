const axios = require('axios');

async function testServer() {
  try {
    console.log('Testing server endpoints...\n');
    
    // Test products endpoint
    const productsResponse = await axios.get('http://localhost:5000/api/products?limit=5');
    console.log('✅ Products endpoint working');
    console.log('Sample product:', JSON.stringify(productsResponse.data.data[0], null, 2));
    console.log('Image URL:', productsResponse.data.data[0].images[0].url);
    
    // Test categories endpoint
    const categoriesResponse = await axios.get('http://localhost:5000/api/categories');
    console.log('\n✅ Categories endpoint working');
    console.log('Categories:', categoriesResponse.data.data.map(c => c.name));
    
    // Test deals endpoint
    const dealsResponse = await axios.get('http://localhost:5000/api/deals');
    console.log('\n✅ Deals endpoint working');
    console.log('Deals count:', dealsResponse.data.data.length);
    
    // Test recommendations endpoint
    const recommendationsResponse = await axios.get('http://localhost:5000/api/recommendations');
    console.log('\n✅ Recommendations endpoint working');
    console.log('Recommendations count:', recommendationsResponse.data.data.length);
    
    console.log('\n🎉 All endpoints are working correctly!');
    
  } catch (error) {
    console.error('❌ Error testing server:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testServer();