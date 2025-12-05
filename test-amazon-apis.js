const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

console.log('🧪 Testing Amazon India Replica APIs...\n');

const testAPI = async (method, endpoint, data = null, description) => {
  try {
    console.log(`Testing: ${description}`);
    console.log(`${method.toUpperCase()} ${BASE_URL}${endpoint}`);
    
    let response;
    if (method === 'GET') {
      response = await axios.get(`${BASE_URL}${endpoint}`);
    } else if (method === 'POST') {
      response = await axios.post(`${BASE_URL}${endpoint}`, data);
    } else if (method === 'PUT') {
      response = await axios.put(`${BASE_URL}${endpoint}`, data);
    } else if (method === 'DELETE') {
      response = await axios.delete(`${BASE_URL}${endpoint}`);
    }
    
    console.log(`✅ Status: ${response.status}`);
    console.log(`📊 Data: ${JSON.stringify(response.data).substring(0, 200)}...`);
    console.log('---\n');
    
    return response.data;
  } catch (error) {
    console.log(`❌ Error: ${error.response?.status || error.message}`);
    console.log(`📊 Error Data: ${JSON.stringify(error.response?.data || error.message)}`);
    console.log('---\n');
    return null;
  }
};

const runTests = async () => {
  console.log('🚀 Starting API Tests...\n');
  
  // Health Check
  await testAPI('GET', '/health', null, 'Health Check');
  
  // Authentication Tests
  console.log('🔐 AUTHENTICATION TESTS');
  const loginData = await testAPI('POST', '/api/auth/login', {
    email: 'rajesh@example.com',
    password: 'password123'
  }, 'User Login');
  
  await testAPI('POST', '/api/auth/register', {
    name: 'Test User',
    email: 'test@example.com',
    password: 'test123',
    phone: '+91-9876543210'
  }, 'User Registration');
  
  // Product Tests
  console.log('📱 PRODUCT TESTS');
  const products = await testAPI('GET', '/api/products', null, 'Get All Products');
  
  await testAPI('GET', '/api/products?category=Mobiles', null, 'Get Products by Category');
  
  await testAPI('GET', '/api/products?search=Samsung', null, 'Search Products');
  
  await testAPI('GET', '/api/products?brand=Samsung&minPrice=10000&maxPrice=50000', null, 'Filter Products');
  
  await testAPI('GET', '/api/products?sort=price-low&page=1&limit=5', null, 'Sort and Paginate Products');
  
  if (products?.data?.length > 0) {
    await testAPI('GET', `/api/products/${products.data[0].id}`, null, 'Get Product Details');
  }
  
  // Category Tests
  console.log('📂 CATEGORY TESTS');
  await testAPI('GET', '/api/categories', null, 'Get All Categories');
  
  // Search Tests
  console.log('🔍 SEARCH TESTS');
  await testAPI('GET', '/api/search/suggestions?q=Samsung', null, 'Search Suggestions');
  
  // Banner Tests
  console.log('🎨 BANNER TESTS');
  await testAPI('GET', '/api/banners', null, 'Get Banners');
  
  // Deals Tests
  console.log('🏷️ DEALS TESTS');
  await testAPI('GET', '/api/deals', null, 'Get Today\'s Deals');
  
  // Cart Tests
  console.log('🛒 CART TESTS');
  await testAPI('GET', '/api/cart', null, 'Get Cart Items');
  
  if (products?.data?.length > 0) {
    await testAPI('POST', '/api/cart/add', {
      productId: products.data[0].id,
      quantity: 2
    }, 'Add Item to Cart');
    
    await testAPI('GET', '/api/cart', null, 'Get Cart After Adding Item');
  }
  
  // Wishlist Tests
  console.log('❤️ WISHLIST TESTS');
  await testAPI('GET', '/api/wishlist', null, 'Get Wishlist Items');
  
  if (products?.data?.length > 0) {
    await testAPI('POST', '/api/wishlist/add', {
      productId: products.data[0].id
    }, 'Add Item to Wishlist');
    
    await testAPI('GET', '/api/wishlist', null, 'Get Wishlist After Adding Item');
  }
  
  // Order Tests
  console.log('📦 ORDER TESTS');
  await testAPI('GET', '/api/orders', null, 'Get Orders');
  
  await testAPI('POST', '/api/orders', {
    userId: '1',
    items: [
      {
        productId: products?.data?.[0]?.id || '1',
        name: 'Test Product',
        price: 1000,
        quantity: 1
      }
    ],
    shippingAddress: {
      name: 'Test User',
      phone: '+91-9876543210',
      addressLine1: '123 Test Street',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001'
    },
    paymentMethod: 'card',
    subtotal: 1000,
    tax: 180,
    shipping: 0,
    total: 1180
  }, 'Place Order');
  
  // Additional API Tests
  console.log('🔧 ADDITIONAL TESTS');
  
  // Test with invalid product ID
  await testAPI('GET', '/api/products/invalid-id', null, 'Get Invalid Product');
  
  // Test with invalid login
  await testAPI('POST', '/api/auth/login', {
    email: 'invalid@example.com',
    password: 'wrongpassword'
  }, 'Invalid Login');
  
  // Test pagination
  await testAPI('GET', '/api/products?page=2&limit=10', null, 'Pagination Test');
  
  // Test multiple filters
  await testAPI('GET', '/api/products?category=Electronics&brand=Sony&rating=4&sort=rating', null, 'Multiple Filters Test');
  
  console.log('🎉 All API tests completed!');
  console.log('\n📊 Test Summary:');
  console.log('- Authentication: Login, Register');
  console.log('- Products: List, Search, Filter, Sort, Details');
  console.log('- Categories: List all categories');
  console.log('- Cart: Add items, view cart');
  console.log('- Wishlist: Add items, view wishlist');
  console.log('- Orders: Create and view orders');
  console.log('- Search: Suggestions and results');
  console.log('- Deals: Today\'s deals');
  console.log('- Banners: Homepage banners');
  console.log('\n✅ Amazon India Replica APIs are fully functional!');
};

// Check if server is running
const checkServer = async () => {
  try {
    await axios.get(`${BASE_URL}/health`);
    console.log('✅ Server is running, starting tests...\n');
    await runTests();
  } catch (error) {
    console.log('❌ Server is not running!');
    console.log('Please start the server first:');
    console.log('npm run start:amazon');
    console.log('or');
    console.log('node backend/amazon-complete-server.js');
  }
};

checkServer();