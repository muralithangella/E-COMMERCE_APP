const bcrypt = require('bcryptjs');

async function createTestUser() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const testUser = {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true
    };
    
    console.log('Test user data:');
    console.log(JSON.stringify(testUser, null, 2));
    
    // Test password comparison
    const isValid = await bcrypt.compare('admin123', hashedPassword);
    console.log('Password validation test:', isValid);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

createTestUser();