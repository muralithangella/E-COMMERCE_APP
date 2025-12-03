const redis = require('redis');

async function testRedis() {
  console.log('Testing Redis connection...');
  
  try {
    // Try to connect to Redis
    const client = redis.createClient({
      url: 'redis://localhost:6379'
    });

    client.on('error', (err) => {
      console.log('❌ Redis Client Error:', err.message);
    });

    client.on('connect', () => {
      console.log('🔄 Connecting to Redis...');
    });

    client.on('ready', () => {
      console.log('✅ Redis connection ready');
    });

    await client.connect();
    
    // Test basic operations
    await client.set('test_key', 'test_value');
    const value = await client.get('test_key');
    console.log('✅ Redis test operation successful:', value);
    
    await client.del('test_key');
    await client.quit();
    
    console.log('✅ Redis test completed successfully');
    
  } catch (error) {
    console.log('❌ Redis connection failed:', error.message);
    console.log('\n💡 Solutions:');
    console.log('1. Install Redis: https://redis.io/download');
    console.log('2. Start Redis server: redis-server');
    console.log('3. Or use Docker: docker run -d -p 6379:6379 redis:alpine');
  }
}

testRedis();