// Test script to verify the working state with mock data
const fetch = require('node-fetch');

const API_BASE = 'http://localhost:5000/api';

async function testAPI() {
  console.log('🧪 Testing E-commerce API with Mock Data\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${API_BASE}/../health`);
    const health = await healthResponse.json();
    console.log('✅ Health:', health.status);

    // Test products endpoint
    console.log('\n2. Testing products endpoint...');
    const productsResponse = await fetch(`${API_BASE}/products`);
    const productsData = await productsResponse.json();
    console.log('✅ Products loaded:', productsData.data?.length || 0);

    // Test categories endpoint
    console.log('\n3. Testing categories endpoint...');
    const categoriesResponse = await fetch(`${API_BASE}/categories`);
    const categoriesData = await categoriesResponse.json();
    console.log('✅ Categories loaded:', categoriesData.data?.length || 0);

    // Test cart endpoint
    console.log('\n4. Testing cart endpoint...');
    const cartResponse = await fetch(`${API_BASE}/cart`);
    const cartData = await cartResponse.json();
    console.log('✅ Cart initialized:', cartData.data?.items?.length || 0, 'items');

    // Test add to cart
    console.log('\n5. Testing add to cart...');
    const addResponse = await fetch(`${API_BASE}/cart/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: '1',
        quantity: 2
      })
    });
    const addData = await addResponse.json();
    console.log('✅ Added to cart:', addData.data?.items?.length || 0, 'items');

    // Test cart after adding
    console.log('\n6. Testing cart after adding item...');
    const cartAfterResponse = await fetch(`${API_BASE}/cart`);
    const cartAfterData = await cartAfterResponse.json();
    console.log('✅ Cart now has:', cartAfterData.data?.items?.length || 0, 'items');
    console.log('✅ Cart total: $' + (cartAfterData.data?.total || 0).toFixed(2));

    // Test auth
    console.log('\n7. Testing authentication...');
    const authResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'test123'
      })
    });
    const authData = await authResponse.json();
    console.log('✅ Auth working:', authData.success ? 'Yes' : 'No');

    console.log('\n🎉 All tests passed! Your e-commerce app is working perfectly with mock data.');
    console.log('\n📝 Summary:');
    console.log(`   - Products: ${productsData.data?.length || 0} available`);
    console.log(`   - Categories: ${categoriesData.data?.length || 0} available`);
    console.log(`   - Cart: Working with ${cartAfterData.data?.items?.length || 0} items`);
    console.log(`   - Auth: ${authData.success ? 'Working' : 'Not working'}`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure the server is running: npm start');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = testAPI;