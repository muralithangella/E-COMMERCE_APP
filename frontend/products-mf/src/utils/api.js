export { default as api } from '../../../shared/services/api';
export { productsApi, useGetProductsQuery, useGetProductQuery, useSearchProductsQuery } from '../../../shared/services/productsApi';

// Legacy API for backward compatibility
export const productsAPI = {
  getProducts: (params) => api.get('/api/products', { params }),
  getProductById: (id) => api.get(`/api/products/${id}`),
  getProductsByCategory: (category) => api.get(`/api/products/category/${category}`),
  searchProducts: (query) => api.get(`/api/products/search?q=${query}`)
};