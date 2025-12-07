const express = require('express');
const cors = require('cors');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 5003;

app.use(cors());
app.use(express.json());
app.use('/api/orders', orderRoutes);

app.listen(PORT, () => console.log(`Order Service running on port ${PORT}`));

module.exports = app;
