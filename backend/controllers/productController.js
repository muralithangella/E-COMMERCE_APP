const Product = require('../models/Product');

// Mock products data for now
const mockProducts = [
  {
    _id: '1',
    name: 'MacBook Pro 16-inch M3',
    description: 'Apple MacBook Pro with M3 Pro chip, 18GB RAM, 512GB SSD. Perfect for professional work and creative tasks.',
    price: 2399.99,
    originalPrice: 2599.99,
    category: 'Electronics',
    brand: 'Apple',
    rating: 4.8,
    reviewCount: 1247,
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-spacegray-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697311054290'
    ],
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop&crop=center',
    inStock: true,
    stockCount: 15,
    freeShipping: true,
    prime: true,
    features: ['M3 Pro chip', '18GB Unified Memory', '512GB SSD', 'Liquid Retina XDR display'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    _id: '2',
    name: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Industry-leading noise canceling with Dual Noise Sensor technology. 30-hour battery life with quick charge.',
    price: 349.99,
    originalPrice: 399.99,
    category: 'Electronics',
    brand: 'Sony',
    rating: 4.6,
    reviewCount: 892,
    images: [
      'https://m.media-amazon.com/images/I/61+btTqnAGL._AC_SL1500_.jpg'
    ],
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&crop=center',
    inStock: true,
    stockCount: 8,
    freeShipping: true,
    prime: true,
    features: ['30-hour battery', 'Quick Charge', 'Multipoint connection', 'Speak-to-Chat'],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    _id: '3',
    name: 'Apple Watch Series 9 GPS',
    description: 'Advanced health monitoring, fitness tracking, and safety features. Always-On Retina display.',
    price: 429.99,
    originalPrice: 449.99,
    category: 'Electronics',
    brand: 'Apple',
    rating: 4.7,
    reviewCount: 2156,
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-s9-45mm-pink-sport-band-pink?wid=1000&hei=1000&fmt=png-alpha&.v=1692720175'
    ],
    image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=300&fit=crop&crop=center',
    inStock: true,
    stockCount: 23,
    freeShipping: true,
    prime: true,
    features: ['Blood Oxygen monitoring', 'ECG app', 'Always-On display', 'Water resistant'],
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08')
  },
  {
    _id: '4',
    name: 'Samsung 65" 4K Smart TV',
    description: 'Crystal UHD 4K Smart TV with HDR, built-in streaming apps, and voice control.',
    price: 799.99,
    originalPrice: 999.99,
    category: 'Electronics',
    brand: 'Samsung',
    rating: 4.5,
    reviewCount: 567,
    images: [
      'https://m.media-amazon.com/images/I/81vFXMS8ixL._AC_SL1500_.jpg'
    ],
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop&crop=center',
    inStock: true,
    stockCount: 12,
    freeShipping: true,
    prime: false,
    features: ['4K Crystal UHD', 'HDR support', 'Smart TV platform', 'Voice control'],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05')
  },
  {
    _id: '5',
    name: 'Nike Air Max 270 Running Shoes',
    description: 'Lifestyle shoe with large Max Air unit for all-day comfort. Breathable mesh upper.',
    price: 149.99,
    originalPrice: 160.00,
    category: 'Fashion',
    brand: 'Nike',
    rating: 4.3,
    reviewCount: 1834,
    images: [
      'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/awjogtdnqxniqqk0wpgf/air-max-270-mens-shoes-KkLcGR.png'
    ],
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop&crop=center',
    inStock: true,
    stockCount: 67,
    freeShipping: true,
    prime: false,
    features: ['Max Air cushioning', 'Breathable mesh', 'Rubber outsole', 'Lifestyle design'],
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03')
  },
  {
    _id: '6',
    name: 'Instant Pot Duo 7-in-1 Pressure Cooker',
    description: '7-in-1 multi-cooker: pressure cooker, slow cooker, rice cooker, steamer, sauté, yogurt maker, and warmer.',
    price: 79.99,
    originalPrice: 99.99,
    category: 'Kitchen',
    brand: 'Instant Pot',
    rating: 4.6,
    reviewCount: 3421,
    images: [
      'https://m.media-amazon.com/images/I/71VxJd-rIyL._AC_SL1500_.jpg'
    ],
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&crop=center',
    inStock: true,
    stockCount: 156,
    freeShipping: true,
    prime: true,
    features: ['7-in-1 functionality', '6-quart capacity', 'Smart programming', 'Safety features'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

const getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    let filteredProducts = mockProducts;
    
    if (category && category !== 'all') {
      const categoryMap = {
        'home and kitchen': 'Kitchen',
        'kitchen': 'Kitchen',
        'electronics': 'Electronics',
        'fashion': 'Fashion'
      };
      
      const targetCategory = categoryMap[category.toLowerCase()] || category;
      filteredProducts = mockProducts.filter(product => 
        product.category === targetCategory
      );
    }
    
    res.json({
      data: filteredProducts,
      products: filteredProducts,
      total: filteredProducts.length
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.json({
      data: mockProducts,
      products: mockProducts,
      total: mockProducts.length
    });
  }
};

const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = mockProducts.find(p => p._id === id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
};

const getFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = mockProducts
      .filter(product => product.prime || product.rating >= 4.5)
      .slice(0, 6);
    
    res.json({ data: featuredProducts });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ message: 'Failed to fetch featured products', error: error.message });
  }
};

const getDeals = async (req, res) => {
  try {
    const deals = mockProducts
      .filter(product => product.originalPrice && product.originalPrice > product.price)
      .slice(0, 4);
    
    res.json({ data: deals });
  } catch (error) {
    console.error('Get deals error:', error);
    res.status(500).json({ message: 'Failed to fetch deals', error: error.message });
  }
};

module.exports = {
  getProducts,
  getProduct,
  getFeaturedProducts,
  getDeals
};