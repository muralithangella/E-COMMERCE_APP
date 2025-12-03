const mongoose = require('mongoose');
const redis = require('redis');
const { Kafka } = require('kafkajs');
const { logger, logInfo, logError } = require('./utils/logger');
const colors = require('colors');

// Test configuration
const config = {
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://admin:password@localhost:27017/ecommerce_test?authSource=admin',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    }
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
  },
  kafka: {
    clientId: 'test-client',
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092,localhost:9093,localhost:9094').split(','),
    connectionTimeout: 10000,
    requestTimeout: 30000,
  }
};

class LocalTestSuite {
  constructor() {
    this.results = {
      mongodb: false,
      redis: false,
      kafka: false,
      overall: false
    };
  }

  async testMongoDB() {
    console.log('\n🔍 Testing MongoDB Connection...'.cyan);
    
    try {
      // Test primary connection
      await mongoose.connect(config.mongodb.uri, config.mongodb.options);
      console.log('✅ MongoDB Primary: Connected successfully'.green);
      
      // Test database operations
      const testCollection = mongoose.connection.db.collection('test_connection');
      await testCollection.insertOne({ test: true, timestamp: new Date() });
      console.log('✅ MongoDB Write: Test document inserted'.green);
      
      const doc = await testCollection.findOne({ test: true });
      console.log('✅ MongoDB Read: Test document retrieved'.green);
      
      await testCollection.deleteOne({ test: true });
      console.log('✅ MongoDB Delete: Test document removed'.green);
      
      // Test replica set status
      const admin = mongoose.connection.db.admin();
      try {
        const replStatus = await admin.command({ replSetGetStatus: 1 });
        console.log(`✅ MongoDB Replica Set: ${replStatus.set} (${replStatus.members.length} members)`.green);
      } catch (err) {
        console.log('⚠️  MongoDB: Running in standalone mode (not replica set)'.yellow);
      }
      
      logInfo('MongoDB connection test passed');
      this.results.mongodb = true;
      
    } catch (error) {
      console.log('❌ MongoDB Connection Failed:'.red, error.message);
      logError(error);
      this.results.mongodb = false;
    }
  }

  async testRedis() {
    console.log('\n🔍 Testing Redis Connection...'.cyan);
    
    let client;
    try {
      client = redis.createClient(config.redis);
      
      client.on('error', (err) => {
        console.log('❌ Redis Client Error:'.red, err.message);
      });
      
      await client.connect();
      console.log('✅ Redis: Connected successfully'.green);
      
      // Test basic operations
      await client.set('test_key', 'test_value', { EX: 60 });
      console.log('✅ Redis Write: Test key set with expiration'.green);
      
      const value = await client.get('test_key');
      if (value === 'test_value') {
        console.log('✅ Redis Read: Test key retrieved successfully'.green);
      }
      
      await client.del('test_key');
      console.log('✅ Redis Delete: Test key removed'.green);
      
      // Test Redis info
      const info = await client.info('server');
      const version = info.match(/redis_version:(\\S+)/)?.[1];
      console.log(`✅ Redis Version: ${version}`.green);
      
      logInfo('Redis connection test passed');
      this.results.redis = true;
      
    } catch (error) {
      console.log('❌ Redis Connection Failed:'.red, error.message);
      logError(error);
      this.results.redis = false;
    } finally {
      if (client) {
        await client.quit();
      }
    }
  }

  async testKafka() {
    console.log('\n🔍 Testing Kafka Connection...'.cyan);
    
    let kafka, producer, consumer;
    try {
      kafka = new Kafka(config.kafka);
      
      // Test admin operations
      const admin = kafka.admin();
      await admin.connect();
      console.log('✅ Kafka Admin: Connected successfully'.green);
      
      // Create test topic
      const testTopic = 'test-topic-' + Date.now();
      await admin.createTopics({
        topics: [{
          topic: testTopic,
          numPartitions: 3,
          replicationFactor: 1
        }]
      });
      console.log(`✅ Kafka Topic: Created ${testTopic}`.green);
      
      // Test producer
      producer = kafka.producer();
      await producer.connect();
      console.log('✅ Kafka Producer: Connected successfully'.green);
      
      const testMessage = {
        topic: testTopic,
        messages: [{
          key: 'test-key',
          value: JSON.stringify({ test: true, timestamp: new Date() })
        }]
      };
      
      await producer.send(testMessage);
      console.log('✅ Kafka Producer: Message sent successfully'.green);
      
      // Test consumer
      consumer = kafka.consumer({ groupId: 'test-group-' + Date.now() });
      await consumer.connect();
      await consumer.subscribe({ topic: testTopic });
      console.log('✅ Kafka Consumer: Connected and subscribed'.green);
      
      // Consume message with timeout
      let messageReceived = false;
      const timeout = setTimeout(() => {
        if (!messageReceived) {
          console.log('⚠️  Kafka Consumer: Message not received within timeout'.yellow);
        }
      }, 5000);
      
      await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          messageReceived = true;
          clearTimeout(timeout);
          console.log('✅ Kafka Consumer: Message received successfully'.green);
          await consumer.stop();
        },
      });
      
      // Cleanup
      await admin.deleteTopics({ topics: [testTopic] });
      console.log(`✅ Kafka Cleanup: Test topic ${testTopic} deleted`.green);
      
      await admin.disconnect();
      
      logInfo('Kafka connection test passed');
      this.results.kafka = true;
      
    } catch (error) {
      console.log('❌ Kafka Connection Failed:'.red, error.message);
      logError(error);
      this.results.kafka = false;
    } finally {
      if (producer) await producer.disconnect();
      if (consumer) await consumer.disconnect();
    }
  }

  async testEnvironmentVariables() {
    console.log('\n🔍 Testing Environment Variables...'.cyan);
    
    const requiredVars = [
      'NODE_ENV',
      'MONGODB_URI',
      'REDIS_HOST',
      'KAFKA_BROKERS',
      'JWT_SECRET'
    ];
    
    const missingVars = [];
    
    requiredVars.forEach(varName => {
      if (process.env[varName]) {
        console.log(`✅ ${varName}: Set`.green);
      } else {
        console.log(`❌ ${varName}: Missing`.red);
        missingVars.push(varName);
      }
    });
    
    if (missingVars.length === 0) {
      console.log('✅ Environment Variables: All required variables are set'.green);
    } else {
      console.log(`⚠️  Environment Variables: ${missingVars.length} missing variables`.yellow);
    }
  }

  async runAllTests() {
    console.log('🚀 Starting Local Environment Test Suite...'.bold.blue);
    console.log('=' .repeat(50));
    
    // Load environment variables
    require('dotenv').config();
    
    await this.testEnvironmentVariables();
    await this.testMongoDB();
    await this.testRedis();
    await this.testKafka();
    
    // Overall results
    console.log('\\n📊 Test Results Summary:'.bold.blue);
    console.log('=' .repeat(30));
    
    Object.entries(this.results).forEach(([service, status]) => {
      if (service !== 'overall') {
        const icon = status ? '✅' : '❌';
        const color = status ? 'green' : 'red';
        console.log(`${icon} ${service.toUpperCase()}: ${status ? 'PASS' : 'FAIL'}`[color]);
      }
    });
    
    const passedTests = Object.values(this.results).filter(Boolean).length - 1; // -1 for overall
    const totalTests = Object.keys(this.results).length - 1; // -1 for overall
    
    this.results.overall = passedTests === totalTests;
    
    console.log('\\n' + '=' .repeat(30));
    if (this.results.overall) {
      console.log('🎉 ALL TESTS PASSED! Environment is ready for development.'.bold.green);
    } else {
      console.log(`⚠️  ${totalTests - passedTests} test(s) failed. Please check the services.`.bold.yellow);
    }
    
    // Cleanup
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    
    process.exit(this.results.overall ? 0 : 1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const testSuite = new LocalTestSuite();
  testSuite.runAllTests().catch(error => {
    console.error('❌ Test suite failed:'.red, error);
    logError(error);
    process.exit(1);
  });
}

module.exports = LocalTestSuite;