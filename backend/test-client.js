const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

class APIClient {
  constructor() {
    this.token = null;
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Add request interceptor to include auth token
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });
  }

  async health() {
    return this.client.get('/health');
  }

  async register(userData) {
    return this.client.post('/api/auth/register', userData);
  }

  async login(email, password) {
    const response = await this.client.post('/api/auth/login', { email, password });
    if (response.data.token) {
      this.token = response.data.token;
    }
    return response;
  }

  async getProducts(params = {}) {
    return this.client.get('/api/products', { params });
  }

  async getProduct(id) {
    return this.client.get(`/api/products/${id}`);
  }

  async createProduct(productData) {
    return this.client.post('/api/products', productData);
  }

  async getCategories() {
    return this.client.get('/api/categories');
  }

  async getCart() {
    return this.client.get('/api/cart');
  }

  async addToCart(productId, quantity) {
    return this.client.post('/api/cart/add', { productId, quantity });
  }

  async getOrders() {
    return this.client.get('/api/orders');
  }

  async createOrder(orderData) {
    return this.client.post('/api/orders', orderData);
  }

  async getUserProfile() {
    return this.client.get('/api/users/profile');
  }
}

// Example usage
async function quickTest() {
  const client = new APIClient();
  
  try {
    // Test health
    console.log('Testing health endpoint...');
    const health = await client.health();
    console.log('Health:', health.data);

    // Test products
    console.log('\\nTesting products endpoint...');
    const products = await client.getProducts();
    console.log('Products:', products.data);

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

module.exports = APIClient;

// Run quick test if called directly
if (require.main === module) {
  quickTest();
}