const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Mock products data
const products = [
  {
    _id: '1',
    id: '1',
    name: 'Wireless Headphones',
    price: 99.99,
    originalPrice: 149.99,
    discount: 33,
    description: 'High-quality wireless headphones with noise cancellation',
    image: 'https://picsum.photos/300/200?random=1',
    images: ['https://picsum.photos/300/200?random=1'],
    category: 'Electronics',
    rating: 4.5,
    inventory: { trackQuantity: false, quantity: 100 }
  },
  {
    _id: '2',
    id: '2',
    name: 'Smart Watch',
    price: 199.99,
    originalPrice: 299.99,
    discount: 25,
    description: 'Feature-rich smartwatch with health tracking',
    image: 'https://picsum.photos/300/200?random=2',
    images: ['https://picsum.photos/300/200?random=2'],
    category: 'Electronics',
    rating: 4.8
  },
  {
    _id: '3',
    id: '3',
    name: 'Laptop Backpack',
    price: 49.99,
    originalPrice: 79.99,
    discount: 37,
    description: 'Durable laptop backpack with multiple compartments',
    image: 'https://picsum.photos/300/200?random=3',
    images: ['https://picsum.photos/300/200?random=3'],
    category: 'Accessories',
    rating: 4.2
  },
  {
    _id: '4',
    id: '4',
    name: 'Gaming Mouse',
    price: 79.99,
    originalPrice: 119.99,
    discount: 33,
    description: 'High-precision gaming mouse with RGB lighting',
    image: 'https://picsum.photos/300/200?random=4',
    images: ['https://picsum.photos/300/200?random=4'],
    category: 'Electronics',
    rating: 4.6
  },
  {
    _id: '5',
    id: '5',
    name: 'Coffee Maker',
    price: 129.99,
    description: 'Automatic drip coffee maker with timer',
    image: 'https://picsum.photos/300/200?random=5',
    images: ['https://picsum.photos/300/200?random=5'],
    category: 'Home',
    rating: 4.3
  },
  {
    _id: '6',
    id: '6',
    name: 'Bluetooth Speaker',
    price: 59.99,
    description: 'Portable wireless speaker with deep bass',
    image: 'https://picsum.photos/300/200?random=6',
    images: ['https://picsum.photos/300/200?random=6'],
    category: 'Electronics',
    rating: 4.4
  }
];

// Mock categories data
const categories = [
  {
    _id: '1',
    name: 'Electronics',
    image: 'https://picsum.photos/200/150?random=10'
  },
  {
    _id: '2',
    name: 'Home',
    image: 'https://picsum.photos/200/150?random=11'
  },
  {
    _id: '3',
    name: 'Accessories',
    image: 'https://picsum.photos/200/150?random=12'
  },
  {
    _id: '4',
    name: 'Sports',
    image: 'https://picsum.photos/200/150?random=13'
  }
];

// Auth endpoint
app.post('/api/auth/login', (req, res) => {
  res.json({
    message: 'Login successful',
    user: { id: 1, email: 'admin@example.com', name: 'Admin User' },
    accessToken: 'fake-token'
  });
});

// Categories endpoint
app.get('/api/categories', (req, res) => {
  res.json({ data: categories, categories });
});

// Products endpoints
app.get('/api/products', (req, res) => {
  res.json({ products, data: products });
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// Cart endpoints - Always return working mock data
app.get('/api/cart', (req, res) => {
  const mockCartItems = [
    {
      id: '1',
      productId: '1',
      quantity: 2,
      name: 'Wireless Headphones',
      price: 99.99,
      category: 'Electronics',
      image: 'https://picsum.photos/300/200?random=1'
    },
    {
      id: '2',
      productId: '2',
      quantity: 1,
      name: 'Smart Watch',
      price: 199.99,
      category: 'Electronics',
      image: 'https://picsum.photos/300/200?random=2'
    }
  ];
  res.json({ items: mockCartItems });
});

app.post('/api/cart/add', (req, res) => {
  res.json({ message: 'Added to cart' });
});

app.put('/api/cart/items/:id', (req, res) => {
  res.json({ message: 'Updated cart item' });
});

app.delete('/api/cart/items/:id', (req, res) => {
  res.json({ message: 'Removed cart item' });
});

app.delete('/api/cart/clear', (req, res) => {
  res.json({ message: 'Cart cleared' });
});

app.listen(5000, () => {
  console.log('Simple server with products running on port 5000');
});