const express = require('express');
const cors = require('cors');
const cartRoutes = require('./routes/cartRoutes');

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());
app.use('/api/cart', cartRoutes);

app.listen(PORT, () => console.log(`Cart Service running on port ${PORT}`));

module.exports = app;
