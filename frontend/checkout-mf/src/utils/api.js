export { default as api } from '../../../shared/services/api';
export { ordersApi, useCreateOrderMutation, useGetOrderQuery } from '../../../shared/services/ordersApi';

// Legacy API for backward compatibility
export const checkoutAPI = {
  processPayment: (paymentData) => api.post('/api/payments/process', paymentData),
  createOrder: (orderData) => api.post('/api/orders', orderData),
  getOrder: (orderId) => api.get(`/api/orders/${orderId}`),
  validateAddress: (address) => api.post('/api/address/validate', address),
  calculateShipping: (address, items) => api.post('/api/shipping/calculate', { address, items }),
  calculateTax: (address, items) => api.post('/api/tax/calculate', { address, items })
};