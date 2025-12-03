require('dotenv').config();

// Check required environment variables
const requiredEnvVars = ['JWT_SECRET', 'JWT_REFRESH_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.log('⚠️  Missing environment variables:', missingVars.join(', '));
  console.log('Setting default values for development...');
  
  // Set default values for development
  if (!process.env.JWT_SECRET) process.env.JWT_SECRET = 'dev-jwt-secret-key';
  if (!process.env.JWT_REFRESH_SECRET) process.env.JWT_REFRESH_SECRET = 'dev-refresh-secret-key';
  if (!process.env.MONGODB_URI) process.env.MONGODB_URI = 'mongodb://localhost:27017/ecommerce';
  if (!process.env.REDIS_HOST) process.env.REDIS_HOST = 'localhost';
  if (!process.env.REDIS_PORT) process.env.REDIS_PORT = '6379';
}

console.log('🚀 Starting E-commerce Backend in Development Mode...');

// Start the server
require('./server.js');