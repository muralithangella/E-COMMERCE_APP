const DatabaseManager = require('../config/database');

class CacheService {
  constructor() {
    this.defaultTTL = 300; // 5 minutes
  }

  getRedisClient() {
    return DatabaseManager.getRedisClient();
  }

  async get(key) {
    try {
      const client = this.getRedisClient();
      if (!client) return null;

      const value = await client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key, value, ttl = this.defaultTTL) {
    try {
      const client = this.getRedisClient();
      if (!client) return false;

      await client.setex(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  async del(key) {
    try {
      const client = this.getRedisClient();
      if (!client) return false;

      await client.del(key);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  async invalidatePattern(pattern) {
    try {
      const client = this.getRedisClient();
      if (!client) return false;

      const keys = await client.keys(pattern);
      if (keys.length > 0) {
        await client.del(keys);
      }
      return true;
    } catch (error) {
      console.error('Cache invalidate pattern error:', error);
      return false;
    }
  }

  // Product cache methods
  async cacheProduct(productId, product, ttl = 600) {
    return this.set(`product:${productId}`, product, ttl);
  }

  async getCachedProduct(productId) {
    return this.get(`product:${productId}`);
  }

  async invalidateProductCache(productId) {
    await this.del(`product:${productId}`);
    await this.invalidatePattern(`products:*`);
  }

  // Category cache methods
  async cacheCategories(categories, ttl = 1800) {
    return this.set('categories:all', categories, ttl);
  }

  async getCachedCategories() {
    return this.get('categories:all');
  }

  async invalidateCategoryCache() {
    await this.invalidatePattern('categories:*');
    await this.invalidatePattern('products:*');
  }

  // User session cache
  async cacheUserSession(userId, sessionData, ttl = 3600) {
    return this.set(`session:${userId}`, sessionData, ttl);
  }

  async getCachedUserSession(userId) {
    return this.get(`session:${userId}`);
  }

  async invalidateUserSession(userId) {
    return this.del(`session:${userId}`);
  }

  // Cart cache methods
  async cacheCart(userId, cart, ttl = 1800) {
    return this.set(`cart:${userId}`, cart, ttl);
  }

  async getCachedCart(userId) {
    return this.get(`cart:${userId}`);
  }

  async invalidateCartCache(userId) {
    return this.del(`cart:${userId}`);
  }

  // Search results cache
  async cacheSearchResults(query, filters, results, ttl = 300) {
    const key = `search:${this.generateSearchKey(query, filters)}`;
    return this.set(key, results, ttl);
  }

  async getCachedSearchResults(query, filters) {
    const key = `search:${this.generateSearchKey(query, filters)}`;
    return this.get(key);
  }

  generateSearchKey(query, filters) {
    const filterString = Object.keys(filters)
      .sort()
      .map(key => `${key}:${filters[key]}`)
      .join('|');
    
    return Buffer.from(`${query}|${filterString}`).toString('base64');
  }

  // Analytics cache
  async cacheDashboardStats(stats, ttl = 900) {
    return this.set('dashboard:stats', stats, ttl);
  }

  async getCachedDashboardStats() {
    return this.get('dashboard:stats');
  }

  async invalidateDashboardCache() {
    await this.invalidatePattern('dashboard:*');
  }

  // Rate limiting helpers
  async incrementRateLimit(key, windowMs, maxRequests) {
    try {
      const client = this.getRedisClient();
      if (!client) return { count: 1, remaining: maxRequests - 1 };

      const current = await client.incr(key);
      
      if (current === 1) {
        await client.expire(key, Math.ceil(windowMs / 1000));
      }

      const remaining = Math.max(0, maxRequests - current);
      
      return {
        count: current,
        remaining,
        exceeded: current > maxRequests
      };
    } catch (error) {
      console.error('Rate limit increment error:', error);
      return { count: 1, remaining: maxRequests - 1, exceeded: false };
    }
  }
}

module.exports = new CacheService();