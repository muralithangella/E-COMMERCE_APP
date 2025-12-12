const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = 8081;

app.use(cors({
  origin: true,
  credentials: true
}));

app.use('/api/auth', createProxyMiddleware({
  target: 'http://localhost:5005',
  changeOrigin: true
}));

app.use('/api/products', createProxyMiddleware({
  target: 'http://localhost:5006',
  changeOrigin: true,
  pathRewrite: {
    '^/api/products': '/api/products'
  }
}));

app.use('/api/categories', createProxyMiddleware({
  target: 'http://localhost:5006',
  changeOrigin: true,
  pathRewrite: {
    '^/api/categories': '/api/categories'
  }
}));

app.use('/api/deals', createProxyMiddleware({
  target: 'http://localhost:5006',
  changeOrigin: true,
  pathRewrite: {
    '^/api/deals': '/api/deals'
  }
}));

app.use('/api/recommendations', createProxyMiddleware({
  target: 'http://localhost:5006',
  changeOrigin: true,
  pathRewrite: {
    '^/api/recommendations': '/api/recommendations'
  }
}));

app.use('/api/cart', createProxyMiddleware({
  target: 'http://localhost:5002',
  changeOrigin: true,
  pathRewrite: {
    '^/api/cart': '/api/cart'
  }
}));

app.get('/health', (req, res) => {
  res.json({ status: 'OK', gateway: 'nodejs' });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});