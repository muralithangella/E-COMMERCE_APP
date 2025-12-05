const database = require('../config/database');

class CacheManager {
  constructor() {
    this.redis = database.getRedis();
    this.defaultTTL = 300; // 5 minutes
  }

  async get(key) {
    try {
      const cached = await this.redis.get(this.formatKey(key));
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key, value, ttl = this.defaultTTL) {
    try {
      await this.redis.setex(this.formatKey(key), ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  async del(key) {
    try {
      await this.redis.del(this.formatKey(key));
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  async invalidatePattern(pattern) {
    try {
      const keys = await this.redis.keys(this.formatKey(pattern));
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
      return true;
    } catch (error) {
      console.error('Cache invalidate error:', error);
      return false;
    }
  }

  async mget(keys) {
    try {
      const formattedKeys = keys.map(key => this.formatKey(key));
      const values = await this.redis.mget(...formattedKeys);
      return values.map(value => value ? JSON.parse(value) : null);
    } catch (error) {
      console.error('Cache mget error:', error);
      return new Array(keys.length).fill(null);
    }
  }

  async mset(keyValuePairs, ttl = this.defaultTTL) {
    try {
      const pipeline = this.redis.pipeline();
      
      keyValuePairs.forEach(({ key, value }) => {
        pipeline.setex(this.formatKey(key), ttl, JSON.stringify(value));
      });
      
      await pipeline.exec();
      return true;
    } catch (error) {
      console.error('Cache mset error:', error);
      return false;
    }
  }

  formatKey(key) {
    return `amazon:${key}`;
  }

  // Cache warming strategies
  async warmCache(warmingFunctions) {
    const promises = warmingFunctions.map(async ({ key, fn, ttl }) => {
      try {
        const data = await fn();
        await this.set(key, data, ttl);
      } catch (error) {
        console.error(`Cache warming failed for ${key}:`, error);
      }
    });

    await Promise.allSettled(promises);
  }
}

module.exports = { CacheManager };