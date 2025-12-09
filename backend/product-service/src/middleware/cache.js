const redis = require('redis');

const client = redis.createClient({ 
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: { reconnectStrategy: (retries) => Math.min(retries * 50, 500) }
});

client.connect().catch(console.error);

module.exports = (duration) => async (req, res, next) => {
  if (req.method !== 'GET') return next();
  
  const key = `cache:${req.originalUrl}`;
  
  try {
    const cached = await client.get(key);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    
    res.originalJson = res.json;
    res.json = function(data) {
      client.setEx(key, duration, JSON.stringify(data)).catch(console.error);
      res.originalJson(data);
    };
    next();
  } catch (err) {
    next();
  }
};
