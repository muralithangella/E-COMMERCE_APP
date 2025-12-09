require('dotenv').config({ path: '../../.env' });
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.RECOMMENDATION_SERVICE_PORT || 5007;
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:5001';

// In-memory view tracking (can be swapped for Redis)
const recentViews = new Map(); // key: userId|sessionId, value: [{productId, ts}]
const MAX_RECENT_VIEWS = 20;

app.use(cors());
app.use(express.json());

// Helper: fetch products from product service
const fetchProducts = async (params = {}) => {
  const res = await axios.get(`${PRODUCT_SERVICE_URL}/api/products`, { params: { limit: 100, ...params } });
  return res.data?.data || res.data || [];
};

const fetchProductById = async (id) => {
  const res = await axios.get(`${PRODUCT_SERVICE_URL}/api/products/${id}`);
  return res.data?.data || res.data;
};

const recordView = (userId, sessionId, productId) => {
  const key = userId || sessionId;
  if (!key || !productId) return;
  const existing = recentViews.get(key) || [];
  const filtered = existing.filter(entry => entry.productId !== productId);
  filtered.unshift({ productId, ts: Date.now() });
  recentViews.set(key, filtered.slice(0, MAX_RECENT_VIEWS));
};

const getRecentViewProductIds = (userId, sessionId) => {
  const key = userId || sessionId;
  if (!key) return [];
  return (recentViews.get(key) || []).map(v => v.productId);
};

// Popular recommendations (top rated)
app.get('/api/recommendations', async (req, res) => {
  try {
    const products = await fetchProducts({ sort: 'rating' });
    const sorted = [...products].sort((a, b) => (b.ratings?.average || 0) - (a.ratings?.average || 0));
    res.json({ success: true, data: sorted.slice(0, 12) });
  } catch (error) {
    console.error('Recommendation error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch recommendations' });
  }
});

// Trending (by discount and featured)
app.get('/api/recommendations/trending', async (req, res) => {
  try {
    const products = await fetchProducts();
    const scored = products.map(p => ({
      ...p,
      _score: (p.discount?.percentage || 0) + (p.featured ? 20 : 0) + (p.ratings?.count || 0) * 0.1,
    }));
    const sorted = scored.sort((a, b) => (b._score || 0) - (a._score || 0));
    res.json({ success: true, data: sorted.slice(0, 12) });
  } catch (error) {
    console.error('Trending recommendation error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch trending recommendations' });
  }
});

// Personalized recommendations using user/cart/wishlist signals
app.get('/api/recommendations/personalized', async (req, res) => {
  try {
    const { userId, sessionId, cartProductIds, wishlistProductIds } = req.query;
    const signals = [
      ...(cartProductIds ? cartProductIds.split(',') : []),
      ...(wishlistProductIds ? wishlistProductIds.split(',') : []),
      ...getRecentViewProductIds(userId, sessionId),
    ].filter(Boolean);

    const products = await fetchProducts();

    // Build preference vectors
    const likedProducts = products.filter(p => signals.includes(String(p._id) || String(p.id)));
    const preferredCategories = new Set(likedProducts.map(p => p.category?.name).filter(Boolean));
    const preferredBrands = new Set(likedProducts.map(p => p.brand?.name || p.brand).filter(Boolean));

    const scored = products.map(p => {
      let score = 0;
      if (preferredCategories.has(p.category?.name)) score += 25;
      if (preferredBrands.has(p.brand?.name || p.brand)) score += 20;
      if (p.featured) score += 10;
      if (p.discount?.percentage) score += Math.min(p.discount.percentage, 20);
      if (p.ratings?.average) score += p.ratings.average * 2;
      if (p.ratings?.count) score += Math.min(p.ratings.count / 50, 20);
      return { ...p, _score: score };
    });

    const sorted = scored.sort((a, b) => (b._score || 0) - (a._score || 0));
    res.json({ success: true, data: sorted.slice(0, 12) });
  } catch (error) {
    console.error('Personalized recommendation error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch personalized recommendations' });
  }
});

// Similar products by productId
app.get('/api/recommendations/similar/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const current = await fetchProductById(productId);
    if (!current) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const products = await fetchProducts();
    const scored = products
      .filter(p => String(p._id || p.id) !== String(productId))
      .map(p => {
        let score = 0;
        if (p.category?.name && p.category.name === current.category?.name) score += 40;
        if ((p.brand?.name || p.brand) && (p.brand?.name || p.brand) === (current.brand?.name || current.brand)) score += 25;
        if (p.ratings?.average) score += p.ratings.average * 2;
        if (p.discount?.percentage) score += Math.min(p.discount.percentage, 20);
        return { ...p, _score: score };
      });

    const sorted = scored.sort((a, b) => (b._score || 0) - (a._score || 0));
    res.json({ success: true, data: sorted.slice(0, 10) });
  } catch (error) {
    console.error('Similar recommendation error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch similar recommendations' });
  }
});

// Recently viewed
app.get('/api/recommendations/recently-viewed', async (req, res) => {
  try {
    const { userId, sessionId } = req.query;
    const ids = getRecentViewProductIds(userId, sessionId);
    if (!ids.length) {
      return res.json({ success: true, data: [] });
    }

    // Fetch products and preserve order
    const results = await Promise.all(ids.map(id => fetchProductById(id).catch(() => null)));
    const data = results.filter(Boolean);
    res.json({ success: true, data });
  } catch (error) {
    console.error('Recently viewed error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch recently viewed' });
  }
});

// Event: record product view
app.post('/api/recommendations/events/view', (req, res) => {
  try {
    const { userId, sessionId, productId } = req.body || {};
    recordView(userId, sessionId, productId);
    res.json({ success: true });
  } catch (error) {
    console.error('View event error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to record view' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'recommendation-service', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`✅ Recommendation Service running on port ${PORT}`);
  console.log(`🎯 Recommendations API: http://localhost:${PORT}/api/recommendations`);
});

module.exports = app;


