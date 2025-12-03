const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
require('dotenv').config();

const categories = [
  { name: 'Electronics', slug: 'electronics', description: 'Electronic devices and gadgets', image: 'https://picsum.photos/200/150?random=1' },
  { name: 'Fashion', slug: 'fashion', description: 'Clothing and accessories', image: 'https://picsum.photos/200/150?random=2' },
  { name: 'Home & Kitchen', slug: 'home-kitchen', description: 'Home appliances and kitchen items', image: 'https://picsum.photos/200/150?random=3' },
  { name: 'Sports', slug: 'sports', description: 'Sports equipment and gear', image: 'https://picsum.photos/200/150?random=4' },
  { name: 'Books', slug: 'books', description: 'Books and educational materials', image: 'https://picsum.photos/200/150?random=5' },
  { name: 'Beauty', slug: 'beauty', description: 'Beauty and personal care products', image: 'https://picsum.photos/200/150?random=6' }
];

const products = [
  {
    name: 'MacBook Pro 16-inch',
    description: 'Apple MacBook Pro with M2 Pro chip, 16GB RAM, 512GB SSD',
    price: 1999.99,
    originalPrice: 2399.99,
    category: 'Electronics',
    brand: 'Apple',
    images: ['https://picsum.photos/400/300?random=11'],
    stock: 15,
    rating: 4.8,
    discount: 17
  },
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Industry-leading noise canceling headphones',
    price: 299.99,
    originalPrice: 399.99,
    category: 'Electronics',
    brand: 'Sony',
    images: ['https://picsum.photos/400/300?random=12'],
    stock: 8,
    rating: 4.6,
    discount: 25
  },
  {
    name: 'Apple Watch Series 9',
    description: 'Advanced health monitoring and fitness tracking',
    price: 199.99,
    originalPrice: 299.99,
    category: 'Electronics',
    brand: 'Apple',
    images: ['https://picsum.photos/400/300?random=13'],
    stock: 23,
    rating: 4.7,
    discount: 33
  },
  {
    name: 'Wireless Speaker',
    description: 'Portable Bluetooth speaker with premium sound',
    price: 89.99,
    originalPrice: 129.99,
    category: 'Electronics',
    brand: 'JBL',
    images: ['https://picsum.photos/400/300?random=14'],
    stock: 12,
    rating: 4.5,
    discount: 31
  },
  {
    name: 'iPhone 15 Pro',
    description: 'Latest iPhone with advanced camera system',
    price: 999.99,
    category: 'Electronics',
    brand: 'Apple',
    images: ['https://picsum.photos/400/300?random=21'],
    stock: 20,
    rating: 4.8
  },
  {
    name: 'Samsung 55" 4K TV',
    description: 'Smart TV with Crystal UHD display',
    price: 799.99,
    category: 'Electronics',
    brand: 'Samsung',
    images: ['https://picsum.photos/400/300?random=22'],
    stock: 5,
    rating: 4.6
  },
  {
    name: 'Nike Air Max Shoes',
    description: 'Comfortable running shoes with air cushioning',
    price: 129.99,
    category: 'Fashion',
    brand: 'Nike',
    images: ['https://picsum.photos/400/300?random=23'],
    stock: 30,
    rating: 4.7
  },
  {
    name: 'Coffee Maker',
    description: 'Programmable drip coffee maker',
    price: 79.99,
    category: 'Home & Kitchen',
    brand: 'Cuisinart',
    images: ['https://picsum.photos/400/300?random=24'],
    stock: 15,
    rating: 4.5
  },
  {
    name: 'Gaming Chair',
    description: 'Ergonomic gaming chair with lumbar support',
    price: 299.99,
    category: 'Home & Kitchen',
    brand: 'DXRacer',
    images: ['https://picsum.photos/400/300?random=25'],
    stock: 8,
    rating: 4.4
  },
  {
    name: 'iPad Air',
    description: '10.9-inch tablet with M1 chip',
    price: 399.99,
    category: 'Electronics',
    brand: 'Apple',
    images: ['https://picsum.photos/400/300?random=26'],
    stock: 18,
    rating: 4.6
  },
  {
    name: 'The Great Gatsby',
    description: 'Classic American novel by F. Scott Fitzgerald',
    price: 12.99,
    category: 'Books',
    brand: 'Scribner',
    images: ['https://picsum.photos/400/300?random=31'],
    stock: 50,
    rating: 4.3
  },
  {
    name: 'JavaScript: The Good Parts',
    description: 'Programming book by Douglas Crockford',
    price: 29.99,
    category: 'Books',
    brand: "O'Reilly",
    images: ['https://picsum.photos/400/300?random=32'],
    stock: 25,
    rating: 4.5
  },
  {
    name: 'Basketball',
    description: 'Official size basketball for indoor/outdoor play',
    price: 24.99,
    category: 'Sports',
    brand: 'Spalding',
    images: ['https://picsum.photos/400/300?random=33'],
    stock: 40,
    rating: 4.4
  },
  {
    name: 'Yoga Mat',
    description: 'Non-slip exercise mat for yoga and fitness',
    price: 39.99,
    category: 'Sports',
    brand: 'Gaiam',
    images: ['https://picsum.photos/400/300?random=34'],
    stock: 30,
    rating: 4.6
  },
  {
    name: 'Face Moisturizer',
    description: 'Hydrating daily face moisturizer with SPF',
    price: 18.99,
    category: 'Beauty',
    brand: 'CeraVe',
    images: ['https://picsum.photos/400/300?random=35'],
    stock: 60,
    rating: 4.7
  },
  {
    name: 'Lipstick Set',
    description: 'Matte lipstick collection in 6 shades',
    price: 45.99,
    category: 'Beauty',
    brand: 'MAC',
    images: ['https://picsum.photos/400/300?random=36'],
    stock: 20,
    rating: 4.5
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect('mongodb+srv://muralithangella_db_user:sW6i6ceY2q1W0oTc@fullstack.qnyvzwj.mongodb.net/ecommerce', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
    
    await Category.deleteMany({});
    await Product.deleteMany({});
    
    const createdCategories = await Category.insertMany(categories);
    console.log('Categories seeded:', createdCategories.length);
    
    // Create category lookup map
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });
    
    // Transform products to match schema
    const transformedProducts = products.map((product, index) => ({
      name: product.name,
      slug: product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: product.description,
      sku: `SKU-${String(index + 1).padStart(3, '0')}`,
      price: {
        regular: product.price,
        sale: product.originalPrice ? product.price : undefined
      },
      category: categoryMap[product.category],
      brand: product.brand,
      images: product.images ? product.images.map(img => ({ url: img, isPrimary: true })) : [],
      inventory: {
        quantity: product.stock || 0
      },
      ratings: {
        average: product.rating || 0,
        count: Math.floor(Math.random() * 1000) + 100
      },
      status: 'published',
      featured: product.discount > 20
    }));
    
    const createdProducts = await Product.insertMany(transformedProducts);
    console.log('Products seeded:', createdProducts.length);
    
    console.log('Database seeded successfully!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();