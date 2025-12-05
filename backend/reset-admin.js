const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb+srv://muralithangella_db_user:sW6i6ceY2q1W0oTc@fullstack.qnyvzwj.mongodb.net/ecommerce';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function resetAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await User.updateOne(
      { email: 'admin@example.com' },
      { 
        password: hashedPassword,
        name: 'Admin',
        role: 'admin'
      }
    );
    
    console.log('✅ Admin password reset successfully');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error resetting admin:', error);
  }
}

resetAdmin();