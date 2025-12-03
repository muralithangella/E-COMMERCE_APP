require('dotenv').config();
const redis = require('redis');

async function testRedis() {
  console.log('🔍 Testing Redis Connection...');
  
  const configs = [
    { url: 'redis://localhost:6379' },
    { host: 'localhost', port: 6379 },
    { host: '127.0.0.1', port: 6379 }
  ];
  
  for (const config of configs) {
    try {
      console.log(`Trying config:`, config);
      const client = redis.createClient(config);
      
      client.on('error', (err) => {
        console.log('Redis error:', err.message);
      });
      
      await client.connect();
      const result = await client.ping();
      
      if (result === 'PONG') {
        console.log('✅ Redis: Connected successfully');
        await client.set('test', 'working');
        const value = await client.get('test');
        console.log('✅ Redis: Read/Write test passed');
        await client.del('test');
        await client.quit();
        return true;
      }
    } catch (error) {
      console.log('❌ Config failed:', error.message);
    }
  }
  
  console.log('❌ All Redis connection attempts failed');
  console.log('💡 Try running: start-redis.bat');
  return false;
}

testRedis();