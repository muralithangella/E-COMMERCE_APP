import axios from 'axios';

const API_BASE_URL =
  (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) ||
  (typeof window !== 'undefined' && window.__API_URL__) ||
  'http://localhost:8080/api';

const reviewClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const reviewService = {
  async getProductReviews(productId, params = {}) {
    const res = await reviewClient.get(`/reviews/product/${productId}`, { params });
    return res.data?.data || res.data;
  },

  async createReview(productId, payload) {
    const res = await reviewClient.post(`/reviews/product/${productId}`, payload);
    return res.data;
  },

  async markHelpful(reviewId) {
    const res = await reviewClient.post(`/reviews/${reviewId}/helpful`);
    return res.data;
  },

  async reportReview(reviewId, reason) {
    const res = await reviewClient.post(`/reviews/${reviewId}/report`, { reason });
    return res.data;
  },
};

export default reviewService;

