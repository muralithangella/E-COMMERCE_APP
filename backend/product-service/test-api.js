require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Product = require('./src/models/product');

async function testAPI() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const products = await Product.find().limit(2).lean();
    console.log('\nProducts from DB:');
    console.log(JSON.stringify(products, null, 2));

    mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

testAPI();
