const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Product Service running on port ${PORT}`);
});

module.exports = app;
