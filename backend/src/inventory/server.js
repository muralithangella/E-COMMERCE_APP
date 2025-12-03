require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const inventoryRoutes = require('../../routes/inventoryRoutes');
const { errorHandler } = require('../../middleware/errorHandler');
const DatabaseManager = require('../../config/database');

const app = express();
const PORT = process.env.INVENTORY_SERVICE_PORT || 3005;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/inventory', inventoryRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'inventory-service' });
});

app.use(errorHandler);

const startServer = async () => {
  try {
    await DatabaseManager.connectMongoDB();
    
    // Skip Redis connection
    console.log('Skipping Redis connection');
    
    app.listen(PORT, () => {
      console.log(`Inventory Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start inventory service:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;