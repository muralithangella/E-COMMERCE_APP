require('dotenv').config();
const mongoose = require('mongoose');

async function testMongoDB() {
  console.log('🔍 Testing MongoDB Connection...');
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB: Connected successfully');
    
    // Test database operations
    const testCollection = mongoose.connection.db.collection('test_connection');
    await testCollection.insertOne({ test: true, timestamp: new Date() });
    console.log('✅ MongoDB Write: Test document inserted');
    
    const doc = await testCollection.findOne({ test: true });
    console.log('✅ MongoDB Read: Test document retrieved');
    
    await testCollection.deleteOne({ test: true });
    console.log('✅ MongoDB Delete: Test document removed');
    
    console.log('\n🎉 MongoDB is ready for development!');
    
    await mongoose.disconnect();
    process.exit(0);
    
  } catch (error) {
    console.log('❌ MongoDB Connection Failed:', error.message);
    console.log('\n💡 Check your MongoDB Atlas connection');
    process.exit(1);
  }
}

testMongoDB();