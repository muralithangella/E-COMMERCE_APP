import axios from 'axios';

const API_BASE_URL =
  (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) ||
  (typeof window !== 'undefined' && window.__API_URL__) ||
  'http://localhost:8080/api';

const wishlistClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const wishlistService = {
  async getWishlists() {
    const res = await wishlistClient.get('/wishlist');
    return res.data?.data || res.data;
  },

  async getWishlist(wishlistId, token) {
    const res = await wishlistClient.get(`/wishlist/${wishlistId}`, {
      params: token ? { token } : {},
    });
    return res.data?.data || res.data;
  },

  async createWishlist(payload = {}) {
    const res = await wishlistClient.post('/wishlist', payload);
    return res.data;
  },

  async addItem(wishlistId, payload) {
    const res = await wishlistClient.post(`/wishlist/${wishlistId}/items`, payload);
    return res.data;
  },

  async removeItem(wishlistId, itemId) {
    const res = await wishlistClient.delete(`/wishlist/${wishlistId}/items/${itemId}`);
    return res.data;
  },
};

export default wishlistService;

