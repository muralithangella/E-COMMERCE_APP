require('dotenv').config();
const Application = require('./src/app');

const app = new Application();

// Start the application
app.start().catch(error => {
  console.error('Failed to start application:', error);
  process.exit(1);
});

module.exports = app.getApp();