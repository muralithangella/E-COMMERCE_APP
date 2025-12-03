const axios = require('axios');
const colors = require('colors');

const BASE_URL = 'http://localhost:3000';
let authToken = '';

// Test data
const testUser = {
  email: 'test@example.com',
  password: 'Test123!@#',
  name: 'Test User',
  role: 'customer'
};

const testProduct = {
  name: 'Test Product',
  description: 'A test product for API testing',
  price: 99.99,
  category: 'Electronics',
  stock: 100
};

async function makeRequest(method, url, data = null, headers = {}) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${url}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    
    if (data) config.data = data;
    
    const response = await axios(config);
    return { success: true, status: response.status, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      status: error.response?.status || 0, 
      error: error.response?.data?.message || error.message 
    };
  }
}

async function testEndpoint(name, method, url, data = null, headers = {}) {
  console.log(`Testing ${name}...`.yellow);
  const result = await makeRequest(method, url, data, headers);
  
  if (result.success) {
    console.log(`✅ ${name}: ${result.status}`.green);
    return result;
  } else {
    console.log(`❌ ${name}: ${result.status} - ${result.error}`.red);
    return result;
  }
}

async function runTests() {
  console.log('🚀 Starting E-commerce API Endpoint Tests\n'.cyan.bold);

  // 1. Health Checks
  console.log('=== HEALTH CHECKS ==='.blue.bold);
  await testEndpoint('Health Check', 'GET', '/health');
  await testEndpoint('Readiness Check', 'GET', '/ready');
  await testEndpoint('Liveness Check', 'GET', '/live');
  console.log('');

  // 2. Authentication Tests
  console.log('=== AUTHENTICATION TESTS ==='.blue.bold);
  
  // Register
  const registerResult = await testEndpoint('User Registration', 'POST', '/api/auth/register', testUser);
  
  // Login
  const loginResult = await testEndpoint('User Login', 'POST', '/api/auth/login', {
    email: testUser.email,
    password: testUser.password
  });
  
  if (loginResult.success && loginResult.data.token) {
    authToken = loginResult.data.token;
    console.log('🔑 Auth token obtained for protected routes'.green);
  }
  
  // Refresh Token
  if (loginResult.success && loginResult.data.refreshToken) {
    await testEndpoint('Refresh Token', 'POST', '/api/auth/refresh-token', {
      refreshToken: loginResult.data.refreshToken
    });
  }
  console.log('');

  // 3. Products Tests
  console.log('=== PRODUCTS TESTS ==='.blue.bold);
  await testEndpoint('Get All Products', 'GET', '/api/products');
  
  // Create product (requires auth)
  const createProductResult = await testEndpoint('Create Product', 'POST', '/api/products', testProduct, {
    Authorization: `Bearer ${authToken}`
  });
  
  let productId = null;
  if (createProductResult.success && createProductResult.data.product) {
    productId = createProductResult.data.product._id;
  }
  
  // Get specific product
  if (productId) {
    await testEndpoint('Get Product by ID', 'GET', `/api/products/${productId}`);
    await testEndpoint('Update Product', 'PUT', `/api/products/${productId}`, {
      ...testProduct,
      price: 149.99
    }, {
      Authorization: `Bearer ${authToken}`
    });
  }
  console.log('');

  // 4. Categories Tests
  console.log('=== CATEGORIES TESTS ==='.blue.bold);
  await testEndpoint('Get All Categories', 'GET', '/api/categories');
  await testEndpoint('Create Category', 'POST', '/api/categories', {
    name: 'Test Category',
    description: 'A test category'
  }, {
    Authorization: `Bearer ${authToken}`
  });
  console.log('');

  // 5. Cart Tests
  console.log('=== CART TESTS ==='.blue.bold);
  await testEndpoint('Get Cart', 'GET', '/api/cart', null, {
    Authorization: `Bearer ${authToken}`
  });
  
  if (productId) {
    await testEndpoint('Add to Cart', 'POST', '/api/cart/add', {
      productId: productId,
      quantity: 2
    }, {
      Authorization: `Bearer ${authToken}`
    });
  }
  console.log('');

  // 6. Orders Tests
  console.log('=== ORDERS TESTS ==='.blue.bold);
  await testEndpoint('Get Orders', 'GET', '/api/orders', null, {
    Authorization: `Bearer ${authToken}`
  });
  
  await testEndpoint('Create Order', 'POST', '/api/orders', {
    items: productId ? [{
      product: productId,
      quantity: 1,
      price: testProduct.price
    }] : [],
    shippingAddress: {
      street: '123 Test St',
      city: 'Test City',
      state: 'TS',
      zipCode: '12345',
      country: 'Test Country'
    }
  }, {
    Authorization: `Bearer ${authToken}`
  });
  console.log('');

  // 7. User Profile Tests
  console.log('=== USER PROFILE TESTS ==='.blue.bold);
  await testEndpoint('Get User Profile', 'GET', '/api/users/profile', null, {
    Authorization: `Bearer ${authToken}`
  });
  
  await testEndpoint('Update User Profile', 'PUT', '/api/users/profile', {
    name: 'Updated Test User',
    phone: '+1234567890'
  }, {
    Authorization: `Bearer ${authToken}`
  });
  console.log('');

  // 8. Reviews Tests
  console.log('=== REVIEWS TESTS ==='.blue.bold);
  if (productId) {
    await testEndpoint('Create Review', 'POST', '/api/reviews', {
      product: productId,
      rating: 5,
      comment: 'Great product for testing!'
    }, {
      Authorization: `Bearer ${authToken}`
    });
    
    await testEndpoint('Get Product Reviews', 'GET', `/api/reviews/product/${productId}`);
  }
  console.log('');

  // 9. Inventory Tests
  console.log('=== INVENTORY TESTS ==='.blue.bold);
  await testEndpoint('Get Inventory', 'GET', '/api/inventory', null, {
    Authorization: `Bearer ${authToken}`
  });
  console.log('');

  // 10. Notifications Tests
  console.log('=== NOTIFICATIONS TESTS ==='.blue.bold);
  await testEndpoint('Get Notifications', 'GET', '/api/notifications', null, {
    Authorization: `Bearer ${authToken}`
  });
  console.log('');

  // 11. Admin Tests (if user has admin role)
  console.log('=== ADMIN TESTS ==='.blue.bold);
  await testEndpoint('Get Admin Dashboard', 'GET', '/api/admin/dashboard', null, {
    Authorization: `Bearer ${authToken}`
  });
  console.log('');

  // Cleanup - Delete test product
  if (productId) {
    await testEndpoint('Delete Test Product', 'DELETE', `/api/products/${productId}`, null, {
      Authorization: `Bearer ${authToken}`
    });
  }

  console.log('🎉 API Endpoint Testing Completed!'.cyan.bold);
}

// Handle errors gracefully
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
  process.exit(1);
});

// Run tests
runTests().catch(console.error);