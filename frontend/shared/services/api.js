import axios from 'axios';
import { secureStorage } from '../utils/security';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = secureStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request timestamp for replay attack prevention
    config.headers['X-Timestamp'] = Date.now();
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = secureStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/api/auth/refresh-token`, {
            refreshToken,
          });

          const { accessToken } = response.data;
          secureStorage.setItem('accessToken', accessToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        secureStorage.removeItem('accessToken');
        secureStorage.removeItem('refreshToken');
        secureStorage.removeItem('user');
      }
    }

    // Suppress console errors for auth failures
    if (error.response?.status !== 401) {
      console.error('API Error:', error.response?.data?.message || error.message);
    }
    
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  logout: () => api.post('/api/auth/logout'),
  refreshToken: (refreshToken) => api.post('/api/auth/refresh-token', { refreshToken }),
  forgotPassword: (email) => api.post('/api/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/api/auth/reset-password', { token, password }),
};

// Products API
export const productsAPI = {
  getProducts: (params) => api.get('/api/products', { params }),
  getProduct: (id) => api.get(`/api/products/${id}`),
  createProduct: (product) => api.post('/api/products', product),
  updateProduct: (id, product) => api.put(`/api/products/${id}`, product),
  deleteProduct: (id) => api.delete(`/api/products/${id}`),
  searchProducts: (query, filters) => api.get('/api/products', { 
    params: { search: query, ...filters } 
  }),
};

// Categories API
export const categoriesAPI = {
  getCategories: () => api.get('/api/categories'),
  getCategory: (id) => api.get(`/api/categories/${id}`),
  createCategory: (category) => api.post('/api/categories', category),
  updateCategory: (id, category) => api.put(`/api/categories/${id}`, category),
  deleteCategory: (id) => api.delete(`/api/categories/${id}`),
};

// Cart API
export const cartAPI = {
  getCart: () => api.get('/api/cart'),
  addToCart: (productId, quantity, variant) => api.post('/api/cart/add', { 
    productId, 
    quantity, 
    variant 
  }),
  updateCartItem: (itemId, quantity) => api.put(`/api/cart/items/${itemId}`, { quantity }),
  removeFromCart: (itemId) => api.delete(`/api/cart/items/${itemId}`),
  clearCart: () => api.delete('/api/cart/clear'),
};

// Orders API
export const ordersAPI = {
  getOrders: (params) => api.get('/api/orders', { params }),
  getOrder: (id) => api.get(`/api/orders/${id}`),
  createOrder: (order) => api.post('/api/orders', order),
  updateOrderStatus: (id, status) => api.patch(`/api/orders/${id}/status`, { status }),
  cancelOrder: (id) => api.patch(`/api/orders/${id}/cancel`),
};

// Users API
export const usersAPI = {
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (profile) => api.put('/api/users/profile', profile),
  getAddresses: () => api.get('/api/users/addresses'),
  addAddress: (address) => api.post('/api/users/addresses', address),
  updateAddress: (addressId, address) => api.put(`/api/users/addresses/${addressId}`, address),
  deleteAddress: (addressId) => api.delete(`/api/users/addresses/${addressId}`),
  updatePreferences: (preferences) => api.put('/api/users/preferences', preferences),
};

// Reviews API
export const reviewsAPI = {
  getReviews: (params) => api.get('/api/reviews', { params }),
  createReview: (review) => api.post('/api/reviews', review),
  updateReview: (id, review) => api.put(`/api/reviews/${id}`, review),
  deleteReview: (id) => api.delete(`/api/reviews/${id}`),
  markHelpful: (id) => api.post(`/api/reviews/${id}/helpful`),
};

// Payments API
export const paymentsAPI = {
  createPayment: (paymentData) => api.post('/api/payments', paymentData),
  getPayment: (id) => api.get(`/api/payments/${id}`),
  processPayment: (paymentId) => api.post(`/api/payments/${paymentId}/process`),
  refundPayment: (paymentId, amount) => api.post(`/api/payments/${paymentId}/refund`, { amount }),
};

// Inventory API
export const inventoryAPI = {
  getInventory: () => api.get('/api/inventory'),
  updateStock: (productId, quantity) => api.put('/api/inventory/stock', { productId, quantity }),
};

// Notifications API
export const notificationsAPI = {
  getNotifications: () => api.get('/api/notifications'),
  markAsRead: (id) => api.put(`/api/notifications/${id}/read`),
  deleteNotification: (id) => api.delete(`/api/notifications/${id}`),
};

// Coupons API
export const couponsAPI = {
  getCoupons: () => api.get('/api/coupons'),
  applyCoupon: (code) => api.post('/api/coupons/apply', { code }),
  validateCoupon: (code) => api.post('/api/coupons/validate', { code }),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/api/admin/dashboard'),
  getUsers: (params) => api.get('/api/admin/users', { params }),
  updateUser: (id, userData) => api.put(`/api/admin/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/api/admin/users/${id}`),
  getAnalytics: (params) => api.get('/api/admin/analytics', { params }),
};

export default api;