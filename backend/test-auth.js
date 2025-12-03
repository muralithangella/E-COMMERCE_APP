const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testAuth() {
  try {
    console.log('🧪 Testing Auth Endpoints...\n');

    // 1. Create test user
    console.log('1. Creating test user...');
    try {
      const createResponse = await axios.post(`${BASE_URL}/auth/create-test-user`);
      console.log('✅', createResponse.data.message);
    } catch (error) {
      console.log('ℹ️', error.response?.data?.message || 'Test user creation failed');
    }

    // 2. Check users
    console.log('\n2. Checking users in database...');
    const usersResponse = await axios.get(`${BASE_URL}/auth/test-users`);
    console.log('✅ Users found:', usersResponse.data.count);
    console.log('Users:', usersResponse.data.users);

    // 3. Test login
    console.log('\n3. Testing login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('✅ Login successful!');
    console.log('User:', loginResponse.data.user);
    console.log('Token:', loginResponse.data.token.substring(0, 20) + '...');

  } catch (error) {
    console.error('❌ Test failed:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message || error.message);
  }
}

testAuth();