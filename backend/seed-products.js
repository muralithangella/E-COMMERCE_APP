const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://muralithangella_db_user:sW6i6ceY2q1W0oTc@fullstack.qnyvzwj.mongodb.net/ecommerce';

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  originalPrice: Number,
  category: String,
  brand: String,
  image: String,
  images: [String],
  stock: Number,
  rating: Number,
  reviews: Number,
  discount: Number,
  inStock: Boolean,
  prime: Boolean,
  freeDelivery: Boolean
});

const categorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  image: String
});

const Product = mongoose.model('Product', productSchema);
const Category = mongoose.model('Category', categorySchema);

const products = [
  {
    name: 'Samsung Galaxy S24 Ultra 5G',
    description: '200MP Camera, S Pen, 5000mAh Battery',
    price: 129999,
    originalPrice: 149999,
    category: 'Mobiles',
    brand: 'Samsung',
    image: 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Samsung+Galaxy+S24',
    rating: 4.5,
    reviews: 1847,
    discount: 13,
    inStock: true,
    prime: true,
    freeDelivery: true
  },
  {
    name: 'iPhone 15 Pro Max',
    description: 'A17 Pro chip, 48MP Main camera',
    price: 159900,
    category: 'Mobiles',
    brand: 'Apple',
    image: 'https://via.placeholder.com/300x200/000000/FFFFFF?text=iPhone+15+Pro',
    rating: 4.7,
    reviews: 2156,
    discount: 0,
    inStock: true,
    prime: true,
    freeDelivery: true
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: '30hr battery, Noise Canceling',
    price: 29990,
    originalPrice: 34990,
    category: 'Electronics',
    brand: 'Sony',
    image: 'https://via.placeholder.com/300x200/2C3E50/FFFFFF?text=Sony+Headphones',
    rating: 4.6,
    reviews: 892,
    discount: 14,
    inStock: true,
    prime: true,
    freeDelivery: true
  },
  {
    name: 'MacBook Air M2',
    description: 'M2 chip, 18-hour battery',
    price: 114900,
    originalPrice: 119900,
    category: 'Electronics',
    brand: 'Apple',
    image: 'https://via.placeholder.com/300x200/95A5A6/FFFFFF?text=MacBook+Air',
    rating: 4.8,
    reviews: 892,
    discount: 4,
    inStock: true,
    prime: true,
    freeDelivery: true
  },
  {
    name: 'Nike Air Max Shoes',
    description: 'Comfortable running shoes',
    price: 7999,
    originalPrice: 12995,
    category: 'Fashion',
    brand: 'Nike',
    image: 'https://via.placeholder.com/300x200/E67E22/FFFFFF?text=Nike+Air+Max',
    rating: 4.4,
    reviews: 3421,
    discount: 38,
    inStock: true,
    prime: true,
    freeDelivery: true
  },
  {
    name: 'Pressure Cooker 6.5L',
    description: 'Stainless steel, Induction compatible',
    price: 2499,
    originalPrice: 3995,
    category: 'Home & Kitchen',
    brand: 'Prestige',
    image: 'https://via.placeholder.com/300x200/F39C12/FFFFFF?text=Pressure+Cooker',
    rating: 4.4,
    reviews: 1234,
    discount: 37,
    inStock: true,
    prime: true,
    freeDelivery: true
  }
];

const categories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Mobiles, Laptops, Cameras & more',
    image: 'https://via.placeholder.com/400x200/2C3E50/FFFFFF?text=Electronics'
  },
  {
    name: 'Fashion',
    slug: 'fashion',
    description: 'Clothing, Footwear & Accessories',
    image: 'https://via.placeholder.com/400x200/E74C3C/FFFFFF?text=Fashion'
  },
  {
    name: 'Home & Kitchen',
    slug: 'home-kitchen',
    description: 'Home Decor, Kitchen & Dining',
    image: 'https://via.placeholder.com/400x200/27AE60/FFFFFF?text=Home+Kitchen'
  },
  {
    name: 'Mobiles',
    slug: 'mobiles',
    description: 'Smartphones & Accessories',
    image: 'https://via.placeholder.com/400x200/3498DB/FFFFFF?text=Mobiles'
  }
];

async function seedData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    await Product.deleteMany({});
    await Category.deleteMany({});
    
    await Product.insertMany(products);
    await Category.insertMany(categories);
    
    console.log('✅ Products and categories seeded successfully');
    console.log(`Added ${products.length} products and ${categories.length} categories`);
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

seedData();