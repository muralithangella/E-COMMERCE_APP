export { default as api } from '../../../shared/services/api';
export { cartApi, useGetCartQuery, useAddToCartMutation, useUpdateCartItemMutation, useRemoveFromCartMutation, useClearCartMutation } from '../../../shared/services/cartApi';

// Legacy API for backward compatibility
export const cartAPI = {
  getCart: () => api.get('/api/cart'),
  addItem: (productId, quantity) => api.post('/api/cart/add', { productId, quantity }),
  updateItem: (itemId, quantity) => api.put(`/api/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId) => api.delete(`/api/cart/items/${itemId}`),
  clearCart: () => api.delete('/api/cart/clear'),
};