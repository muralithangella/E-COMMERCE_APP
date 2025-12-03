const compression = require('compression');
const CacheService = require('../services/cacheService');

// Response compression with dynamic level
const dynamicCompression = compression({
  level: (req, res) => {
    if (req.headers['x-no-compression']) return 0;
    return compression.filter(req, res) ? 6 : 0;
  },
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  }
});

// Response caching with ETags
const responseCache = (ttl = 300) => {
  return async (req, res, next) => {
    if (req.method !== 'GET') return next();

    const cacheKey = `response:${req.originalUrl}:${JSON.stringify(req.query)}`;
    
    try {
      const cached = await CacheService.get(cacheKey);
      if (cached) {
        res.set('X-Cache', 'HIT');
        res.set('ETag', cached.etag);
        
        if (req.headers['if-none-match'] === cached.etag) {
          return res.status(304).end();
        }
        
        return res.json(cached.data);
      }

      const originalSend = res.json;
      res.json = function(data) {
        const etag = `"${Buffer.from(JSON.stringify(data)).toString('base64')}"`;
        res.set('ETag', etag);
        res.set('X-Cache', 'MISS');
        
        CacheService.set(cacheKey, { data, etag }, ttl);
        originalSend.call(this, data);
      };

      next();
    } catch (error) {
      next();
    }
  };
};

// Database query optimization
const queryOptimization = (req, res, next) => {
  // Add lean() to mongoose queries for better performance
  const originalQuery = req.query;
  
  // Limit pagination
  if (originalQuery.limit) {
    originalQuery.limit = Math.min(parseInt(originalQuery.limit), 100);
  }
  
  // Add select fields optimization
  if (originalQuery.fields) {
    req.selectFields = originalQuery.fields.split(',').join(' ');
  }
  
  next();
};

// Memory usage monitoring
const memoryMonitor = (req, res, next) => {
  const used = process.memoryUsage();
  
  if (used.heapUsed > 500 * 1024 * 1024) { // 500MB threshold
    console.warn('High memory usage detected:', {
      heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(used.heapTotal / 1024 / 1024)} MB`,
      external: `${Math.round(used.external / 1024 / 1024)} MB`
    });
  }
  
  res.set('X-Memory-Usage', `${Math.round(used.heapUsed / 1024 / 1024)}MB`);
  next();
};

// Response time tracking
const responseTime = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    res.set('X-Response-Time', `${duration}ms`);
    
    if (duration > 5000) { // Log slow requests
      console.warn('Slow request detected:', {
        method: req.method,
        url: req.url,
        duration: `${duration}ms`,
        userAgent: req.get('User-Agent')
      });
    }
  });
  
  next();
};

module.exports = {
  dynamicCompression,
  responseCache,
  queryOptimization,
  memoryMonitor,
  responseTime
};