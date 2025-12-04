export { default as api } from '../../../shared/services/api';
export { ordersApi, useGetOrdersQuery } from '../../../shared/services/ordersApi';

// Legacy API for backward compatibility
export const profileAPI = {
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (data) => api.put('/api/users/profile', data),
  getOrderHistory: () => api.get('/api/orders/user'),
};