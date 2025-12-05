const Redis = require('ioredis');

class CacheService {
  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true
    });

    this.defaultTTL = 3600; // 1 hour
    this.keyPrefix = 'ecommerce:';
    
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.redis.on('connect', () => {
      console.log('✅ Cache service connected');
    });

    this.redis.on('error', (error) => {
      console.error('❌ Cache service error:', error);
    });
  }

  generateKey(namespace, identifier) {
    return `${this.keyPrefix}${namespace}:${identifier}`;
  }

  async get(key, namespace = 'default') {
    try {
      const fullKey = this.generateKey(namespace, key);
      const value = await this.redis.get(fullKey);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key, value, ttl = this.defaultTTL, namespace = 'default') {
    try {
      const fullKey = this.generateKey(namespace, key);
      await this.redis.setex(fullKey, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  async del(key, namespace = 'default') {
    try {
      const fullKey = this.generateKey(namespace, key);
      await this.redis.del(fullKey);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  async exists(key, namespace = 'default') {
    try {
      const fullKey = this.generateKey(namespace, key);
      return await this.redis.exists(fullKey);
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  async invalidatePattern(pattern, namespace = 'default') {
    try {
      const fullPattern = this.generateKey(namespace, pattern);
      const keys = await this.redis.keys(fullPattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
      return keys.length;
    } catch (error) {
      console.error('Cache invalidate pattern error:', error);
      return 0;
    }
  }

  // Product-specific caching methods
  async cacheProduct(productId, productData, ttl = 7200) {
    return await this.set(productId, productData, ttl, 'products');
  }

  async getCachedProduct(productId) {
    return await this.get(productId, 'products');
  }

  async cacheProductList(filters, products, ttl = 1800) {
    const key = this.generateFiltersKey(filters);
    return await this.set(key, products, ttl, 'product-lists');
  }

  async getCachedProductList(filters) {
    const key = this.generateFiltersKey(filters);
    return await this.get(key, 'product-lists');
  }

  generateFiltersKey(filters) {
    return Object.keys(filters)
      .sort()
      .map(key => `${key}:${filters[key]}`)
      .join('|');
  }

  // User session caching
  async cacheUserSession(userId, sessionData, ttl = 86400) {
    return await this.set(userId, sessionData, ttl, 'sessions');
  }

  async getCachedUserSession(userId) {
    return await this.get(userId, 'sessions');
  }

  // Cart caching
  async cacheCart(userId, cartData, ttl = 3600) {
    return await this.set(userId, cartData, ttl, 'carts');
  }

  async getCachedCart(userId) {
    return await this.get(userId, 'carts');
  }

  // Rate limiting
  async checkRateLimit(identifier, limit = 100, window = 900) {
    try {
      const key = this.generateKey('rate-limit', identifier);
      const current = await this.redis.incr(key);
      
      if (current === 1) {
        await this.redis.expire(key, window);
      }
      
      return {
        allowed: current <= limit,
        current,
        limit,
        resetTime: await this.redis.ttl(key)
      };
    } catch (error) {
      console.error('Rate limit check error:', error);
      return { allowed: true, current: 0, limit, resetTime: window };
    }
  }

  async getStats() {
    try {
      const info = await this.redis.info('memory');
      const keyspace = await this.redis.info('keyspace');
      
      return {
        memory: this.parseRedisInfo(info),
        keyspace: this.parseRedisInfo(keyspace),
        connected: this.redis.status === 'ready'
      };
    } catch (error) {
      console.error('Cache stats error:', error);
      return { connected: false };
    }
  }

  parseRedisInfo(info) {
    const lines = info.split('\r\n');
    const result = {};
    
    lines.forEach(line => {
      if (line.includes(':')) {
        const [key, value] = line.split(':');
        result[key] = value;
      }
    });
    
    return result;
  }

  async disconnect() {
    await this.redis.disconnect();
  }
}

module.exports = new CacheService();