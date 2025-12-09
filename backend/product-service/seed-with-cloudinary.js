require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Product = require('./src/models/product');
const cloudinary = require('./src/config/cloudinary');

const sampleProducts = [
  { name: 'MacBook Air M2', description: 'Apple MacBook Air with M2 chip, 13.6-inch Liquid Retina display', category: 'electronics', price: 114900, brand: 'Apple', sku: 'MBA-M2-001', inventory: { quantity: 50 }, discount: 4, rating: { average: 4.5, count: 892 } },
  { name: 'iPhone 15 Pro Max', description: 'Latest iPhone with A17 Pro chip, titanium design, 48MP camera', category: 'mobiles', price: 159900, brand: 'Apple', sku: 'IP15-PM-001', inventory: { quantity: 100 }, discount: 0, rating: { average: 4.7, count: 2156 } },
  { name: 'Sony WH-1000XM5 Headphones', description: 'Premium noise cancelling wireless headphones with 30hr battery', category: 'electronics', price: 29990, brand: 'Sony', sku: 'SONY-WH-001', inventory: { quantity: 75 }, discount: 14, rating: { average: 4.6, count: 892 } },
  { name: 'Samsung Galaxy S24 Ultra 5G', description: 'Flagship Samsung phone with S Pen, 200MP camera, AI features', category: 'mobiles', price: 129999, brand: 'Samsung', sku: 'SGS24-U-001', inventory: { quantity: 80 }, discount: 13, rating: { average: 4.5, count: 1847 } },
  { name: 'Nike Air Max Shoes', description: 'Comfortable running shoes with air cushioning technology', category: 'fashion', price: 7999, brand: 'Nike', sku: 'NIKE-AM-001', inventory: { quantity: 120 }, discount: 38, rating: { average: 4.3, count: 3421 } },
  { name: 'Pressure Cooker 6.5L', description: 'Stainless steel pressure cooker for fast and healthy cooking', category: 'home & kitchen', price: 2499, brand: 'Prestige', sku: 'PC-65-001', inventory: { quantity: 200 }, discount: 37, rating: { average: 4.4, count: 1234 } }
];

const imageUrls = {
  'MacBook Air M2': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
  'iPhone 15 Pro Max': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
  'Sony WH-1000XM5 Headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
  'Samsung Galaxy S24 Ultra 5G': 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500',
  'Nike Air Max Shoes': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
  'Pressure Cooker 6.5L': 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500'
};

async function uploadImageFromUrl(url, folder) {
  try {
    const result = await cloudinary.uploader.upload(url, { folder });
    return { url: result.secure_url, publicId: result.public_id, isPrimary: true };
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    await Product.deleteMany({});
    console.log('Cleared existing products');

    for (const product of sampleProducts) {
      const imageUrl = imageUrls[product.name];
      if (imageUrl) {
        console.log(`Uploading image for ${product.name}...`);
        const image = await uploadImageFromUrl(imageUrl, 'products');
        if (image) {
          product.images = [image];
          console.log(`Image uploaded: ${image.url}`);
        }
      }
      
      await Product.create(product);
      console.log(`Created: ${product.name}`);
    }

    console.log('Seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedProducts();
