import axios from 'axios'

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export const cartAPI = {
  getCart: () => api.get('/api/cart'),
  addItem: (productId, quantity) => api.post('/api/cart/items', { productId, quantity }),
  updateItem: (itemId, quantity) => api.put(`/api/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId) => api.delete(`/api/cart/items/${itemId}`),
  clearCart: () => api.delete('/api/cart'),
}

export default api