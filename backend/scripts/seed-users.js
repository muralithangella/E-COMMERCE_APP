const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const testUsers = [
  {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  },
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  }
];

async function seedUsers() {
  try {
    await mongoose.connect('mongodb+srv://muralithangella_db_user:sW6i6ceY2q1W0oTc@fullstack.qnyvzwj.mongodb.net/ecommerce', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
    
    await User.deleteMany({});
    
    const createdUsers = await User.insertMany(testUsers);
    console.log('Users seeded:', createdUsers.length);
    
    console.log('Test users created:');
    createdUsers.forEach(user => {
      console.log(`- ${user.email} (${user.role})`);
    });
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
}

seedUsers();