import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const checkoutAPI = {
  processPayment: (paymentData) => 
    api.post('/payments/process', paymentData),
  
  createOrder: (orderData) => 
    api.post('/orders', orderData),
  
  getOrder: (orderId) => 
    api.get(`/orders/${orderId}`),
  
  validateAddress: (address) => 
    api.post('/address/validate', address),
  
  calculateShipping: (address, items) => 
    api.post('/shipping/calculate', { address, items }),
  
  calculateTax: (address, items) => 
    api.post('/tax/calculate', { address, items })
}

export default api