const redis = require('redis');

let redisClient;

const initRedis = async () => {
  try {
    redisClient = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    await redisClient.connect();
    console.log('Redis connected for caching');
  } catch (error) {
    console.log('Redis not available, using memory cache');
  }
};

const memoryCache = new Map();

const cache = (duration = 300) => {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;
    
    try {
      let cached;
      if (redisClient) {
        cached = await redisClient.get(key);
      } else {
        const item = memoryCache.get(key);
        if (item && Date.now() < item.expiry) {
          cached = item.data;
        }
      }
      
      if (cached) {
        return res.json(JSON.parse(cached));
      }
      
      const originalSend = res.json;
      res.json = function(data) {
        if (res.statusCode === 200) {
          const cacheData = JSON.stringify(data);
          if (redisClient) {
            redisClient.setEx(key, duration, cacheData);
          } else {
            memoryCache.set(key, {
              data: cacheData,
              expiry: Date.now() + (duration * 1000)
            });
          }
        }
        originalSend.call(this, data);
      };
      
      next();
    } catch (error) {
      next();
    }
  };
};

module.exports = { cache, initRedis };