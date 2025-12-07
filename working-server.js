const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const users = [
  { email: 'admin@example.com', password: 'admin123', name: 'Admin', id: '1' }
];

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    res.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email },
      token: 'test-token'
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Sample data
const products = Array.from({length: 20}, (_, i) => ({
  id: String(i + 1),
  name: `Product ${i + 1}`,
  price: Math.floor(Math.random() * 5000) + 500,
  originalPrice: Math.floor(Math.random() * 7000) + 1000,
  image: `https://picsum.photos/300/300?random=${i + 1}`,
  rating: (Math.random() * 2 + 3).toFixed(1),
  reviews: Math.floor(Math.random() * 5000) + 100,
  inStock: Math.random() > 0.2,
  prime: Math.random() > 0.3
}));

const categories = [
  { id: '1', name: 'Electronics', slug: 'electronics', icon: '📱' },
  { id: '2', name: 'Fashion', slug: 'fashion', icon: '👕' },
  { id: '3', name: 'Home & Kitchen', slug: 'home-kitchen', icon: '🏠' },
  { id: '4', name: 'Books', slug: 'books', icon: '📚' },
  { id: '5', name: 'Sports', slug: 'sports', icon: '⚽' },
  { id: '6', name: 'Beauty', slug: 'beauty', icon: '💄' }
];

// Homepage API endpoints
app.get('/api/products', (req, res) => {
  const { minPrice, maxPrice, sort } = req.query;
  let filtered = [...products];
  
  if (minPrice) filtered = filtered.filter(p => p.price >= Number(minPrice));
  if (maxPrice) filtered = filtered.filter(p => p.price <= Number(maxPrice));
  
  if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
  else if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);
  else if (sort === 'name-asc') filtered.sort((a, b) => a.name.localeCompare(b.name));
  else if (sort === 'name-desc') filtered.sort((a, b) => b.name.localeCompare(a.name));
  
  res.json(filtered);
});

app.get('/api/categories', (req, res) => {
  res.json(categories);
});

app.get('/api/deals', (req, res) => {
  res.json(products.slice(0, 8).map(p => ({...p, discount: Math.floor(Math.random() * 50) + 10})));
});

app.get('/api/recommendations', (req, res) => {
  res.json(products.slice(5, 15));
});

app.listen(5000, () => console.log('✅ Server running on port 5000 with auth + homepage APIs'));