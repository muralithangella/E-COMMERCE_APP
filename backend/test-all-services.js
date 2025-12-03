require('dotenv').config();
const mongoose = require('mongoose');
const redis = require('redis');
const { connectRabbitMQ } = require('./config/rabbitmq');

async function testAllServices() {
  console.log('🚀 Testing All Services...\n');
  
  const results = { mongodb: false, redis: false, rabbitmq: false };
  
  // Test MongoDB
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB: Connected');
    results.mongodb = true;
    await mongoose.disconnect();
  } catch (error) {
    console.log('❌ MongoDB: Failed -', error.message);
  }
  
  // Test Redis
  try {
    const client = redis.createClient({ url: process.env.REDIS_URL });
    await client.connect();
    await client.ping();
    console.log('✅ Redis: Connected');
    results.redis = true;
    await client.quit();
  } catch (error) {
    console.log('❌ Redis: Failed -', error.message);
  }
  
  // Test RabbitMQ
  try {
    await connectRabbitMQ();
    console.log('✅ RabbitMQ: Connected');
    results.rabbitmq = true;
  } catch (error) {
    console.log('❌ RabbitMQ: Failed -', error.message);
  }
  
  console.log('\n📊 Results:');
  const passed = Object.values(results).filter(Boolean).length;
  console.log(`${passed}/3 services working`);
  
  if (passed === 3) {
    console.log('🎉 All services ready!');
  }
  
  process.exit(0);
}

testAllServices();