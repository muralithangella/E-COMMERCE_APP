
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

console.log('🚀 AMAZON INDIA REPLICA - Complete E-commerce API');

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// COMPREHENSIVE DATA
const products = [
  {
    "id": "1",
    "name": "Realme Mobiles Product 1",
    "description": "High-quality mobiles product from Realme. Features advanced technology and premium build quality.",
    "brand": "Realme",
    "category": "Mobiles",
    "price": 22653,
    "originalPrice": 31032,
    "discount": 27,
    "images": [
      "https://picsum.photos/400/400?random=1",
      "https://picsum.photos/400/400?random=1001"
    ],
    "rating": 3.1,
    "reviews": 4138,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Realme Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "2",
    "name": "Oppo Mobiles Product 2",
    "description": "High-quality mobiles product from Oppo. Features advanced technology and premium build quality.",
    "brand": "Oppo",
    "category": "Mobiles",
    "price": 3781,
    "originalPrice": 12199,
    "discount": 69,
    "images": [
      "https://picsum.photos/400/400?random=2",
      "https://picsum.photos/400/400?random=1002"
    ],
    "rating": 3.2,
    "reviews": 3116,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Oppo Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "3",
    "name": "Xiaomi Mobiles Product 3",
    "description": "High-quality mobiles product from Xiaomi. Features advanced technology and premium build quality.",
    "brand": "Xiaomi",
    "category": "Mobiles",
    "price": 1813,
    "originalPrice": 1971,
    "discount": 8,
    "images": [
      "https://picsum.photos/400/400?random=3",
      "https://picsum.photos/400/400?random=1003"
    ],
    "rating": 3.7,
    "reviews": 730,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Xiaomi Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "4",
    "name": "Oppo Mobiles Product 4",
    "description": "High-quality mobiles product from Oppo. Features advanced technology and premium build quality.",
    "brand": "Oppo",
    "category": "Mobiles",
    "price": 16467,
    "originalPrice": 17154,
    "discount": 4,
    "images": [
      "https://picsum.photos/400/400?random=4",
      "https://picsum.photos/400/400?random=1004"
    ],
    "rating": 3.4,
    "reviews": 4115,
    "inStock": false,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Oppo Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "5",
    "name": "Samsung Mobiles Product 5",
    "description": "High-quality mobiles product from Samsung. Features advanced technology and premium build quality.",
    "brand": "Samsung",
    "category": "Mobiles",
    "price": 588,
    "originalPrice": 626,
    "discount": 6,
    "images": [
      "https://picsum.photos/400/400?random=5",
      "https://picsum.photos/400/400?random=1005"
    ],
    "rating": 3.4,
    "reviews": 2796,
    "inStock": false,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Samsung Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "6",
    "name": "OnePlus Mobiles Product 6",
    "description": "High-quality mobiles product from OnePlus. Features advanced technology and premium build quality.",
    "brand": "OnePlus",
    "category": "Mobiles",
    "price": 33883,
    "originalPrice": 47061,
    "discount": 28,
    "images": [
      "https://picsum.photos/400/400?random=6",
      "https://picsum.photos/400/400?random=1006"
    ],
    "rating": 4.4,
    "reviews": 4238,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "OnePlus Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "7",
    "name": "Samsung Mobiles Product 7",
    "description": "High-quality mobiles product from Samsung. Features advanced technology and premium build quality.",
    "brand": "Samsung",
    "category": "Mobiles",
    "price": 8645,
    "originalPrice": 17291,
    "discount": 50,
    "images": [
      "https://picsum.photos/400/400?random=7",
      "https://picsum.photos/400/400?random=1007"
    ],
    "rating": 4.1,
    "reviews": 3520,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Samsung Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "8",
    "name": "OnePlus Mobiles Product 8",
    "description": "High-quality mobiles product from OnePlus. Features advanced technology and premium build quality.",
    "brand": "OnePlus",
    "category": "Mobiles",
    "price": 28861,
    "originalPrice": 49762,
    "discount": 42,
    "images": [
      "https://picsum.photos/400/400?random=8",
      "https://picsum.photos/400/400?random=1008"
    ],
    "rating": 4.5,
    "reviews": 2560,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "OnePlus Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "9",
    "name": "Vivo Mobiles Product 9",
    "description": "High-quality mobiles product from Vivo. Features advanced technology and premium build quality.",
    "brand": "Vivo",
    "category": "Mobiles",
    "price": 14213,
    "originalPrice": 21535,
    "discount": 34,
    "images": [
      "https://picsum.photos/400/400?random=9",
      "https://picsum.photos/400/400?random=1009"
    ],
    "rating": 4.2,
    "reviews": 1002,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Vivo Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "10",
    "name": "Samsung Mobiles Product 10",
    "description": "High-quality mobiles product from Samsung. Features advanced technology and premium build quality.",
    "brand": "Samsung",
    "category": "Mobiles",
    "price": 24226,
    "originalPrice": 25236,
    "discount": 4,
    "images": [
      "https://picsum.photos/400/400?random=10",
      "https://picsum.photos/400/400?random=1010"
    ],
    "rating": 4.1,
    "reviews": 829,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Samsung Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "11",
    "name": "Xiaomi Mobiles Product 11",
    "description": "High-quality mobiles product from Xiaomi. Features advanced technology and premium build quality.",
    "brand": "Xiaomi",
    "category": "Mobiles",
    "price": 38895,
    "originalPrice": 47433,
    "discount": 18,
    "images": [
      "https://picsum.photos/400/400?random=11",
      "https://picsum.photos/400/400?random=1011"
    ],
    "rating": 4.7,
    "reviews": 1205,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Xiaomi Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "12",
    "name": "Oppo Mobiles Product 12",
    "description": "High-quality mobiles product from Oppo. Features advanced technology and premium build quality.",
    "brand": "Oppo",
    "category": "Mobiles",
    "price": 12511,
    "originalPrice": 29096,
    "discount": 57,
    "images": [
      "https://picsum.photos/400/400?random=12",
      "https://picsum.photos/400/400?random=1012"
    ],
    "rating": 3.7,
    "reviews": 3175,
    "inStock": false,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Oppo Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "13",
    "name": "Samsung Mobiles Product 13",
    "description": "High-quality mobiles product from Samsung. Features advanced technology and premium build quality.",
    "brand": "Samsung",
    "category": "Mobiles",
    "price": 11116,
    "originalPrice": 32697,
    "discount": 66,
    "images": [
      "https://picsum.photos/400/400?random=13",
      "https://picsum.photos/400/400?random=1013"
    ],
    "rating": 3.3,
    "reviews": 4099,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Samsung Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "14",
    "name": "Apple Mobiles Product 14",
    "description": "High-quality mobiles product from Apple. Features advanced technology and premium build quality.",
    "brand": "Apple",
    "category": "Mobiles",
    "price": 28364,
    "originalPrice": 31516,
    "discount": 10,
    "images": [
      "https://picsum.photos/400/400?random=14",
      "https://picsum.photos/400/400?random=1014"
    ],
    "rating": 4.4,
    "reviews": 1079,
    "inStock": true,
    "prime": false,
    "freeDelivery": false,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Apple Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "15",
    "name": "OnePlus Mobiles Product 15",
    "description": "High-quality mobiles product from OnePlus. Features advanced technology and premium build quality.",
    "brand": "OnePlus",
    "category": "Mobiles",
    "price": 30448,
    "originalPrice": 43498,
    "discount": 30,
    "images": [
      "https://picsum.photos/400/400?random=15",
      "https://picsum.photos/400/400?random=1015"
    ],
    "rating": 4.8,
    "reviews": 1954,
    "inStock": false,
    "prime": false,
    "freeDelivery": false,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "OnePlus Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "16",
    "name": "Samsung Mobiles Product 16",
    "description": "High-quality mobiles product from Samsung. Features advanced technology and premium build quality.",
    "brand": "Samsung",
    "category": "Mobiles",
    "price": 6196,
    "originalPrice": 6885,
    "discount": 10,
    "images": [
      "https://picsum.photos/400/400?random=16",
      "https://picsum.photos/400/400?random=1016"
    ],
    "rating": 3.4,
    "reviews": 5094,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Samsung Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "17",
    "name": "Oppo Mobiles Product 17",
    "description": "High-quality mobiles product from Oppo. Features advanced technology and premium build quality.",
    "brand": "Oppo",
    "category": "Mobiles",
    "price": 19123,
    "originalPrice": 50325,
    "discount": 62,
    "images": [
      "https://picsum.photos/400/400?random=17",
      "https://picsum.photos/400/400?random=1017"
    ],
    "rating": 3.9,
    "reviews": 2491,
    "inStock": true,
    "prime": false,
    "freeDelivery": false,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Oppo Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "18",
    "name": "Samsung Mobiles Product 18",
    "description": "High-quality mobiles product from Samsung. Features advanced technology and premium build quality.",
    "brand": "Samsung",
    "category": "Mobiles",
    "price": 22362,
    "originalPrice": 42194,
    "discount": 47,
    "images": [
      "https://picsum.photos/400/400?random=18",
      "https://picsum.photos/400/400?random=1018"
    ],
    "rating": 3.9,
    "reviews": 1799,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Samsung Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "19",
    "name": "Samsung Mobiles Product 19",
    "description": "High-quality mobiles product from Samsung. Features advanced technology and premium build quality.",
    "brand": "Samsung",
    "category": "Mobiles",
    "price": 21714,
    "originalPrice": 36804,
    "discount": 41,
    "images": [
      "https://picsum.photos/400/400?random=19",
      "https://picsum.photos/400/400?random=1019"
    ],
    "rating": 3,
    "reviews": 2710,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Samsung Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "20",
    "name": "Samsung Mobiles Product 20",
    "description": "High-quality mobiles product from Samsung. Features advanced technology and premium build quality.",
    "brand": "Samsung",
    "category": "Mobiles",
    "price": 18665,
    "originalPrice": 30599,
    "discount": 39,
    "images": [
      "https://picsum.photos/400/400?random=20",
      "https://picsum.photos/400/400?random=1020"
    ],
    "rating": 4.1,
    "reviews": 2374,
    "inStock": true,
    "prime": false,
    "freeDelivery": false,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Samsung Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "21",
    "name": "Panasonic Electronics Product 1",
    "description": "High-quality electronics product from Panasonic. Features advanced technology and premium build quality.",
    "brand": "Panasonic",
    "category": "Electronics",
    "price": 38554,
    "originalPrice": 43320,
    "discount": 11,
    "images": [
      "https://picsum.photos/400/400?random=21",
      "https://picsum.photos/400/400?random=1021"
    ],
    "rating": 4.4,
    "reviews": 436,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Panasonic Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "22",
    "name": "Bose Electronics Product 2",
    "description": "High-quality electronics product from Bose. Features advanced technology and premium build quality.",
    "brand": "Bose",
    "category": "Electronics",
    "price": 9376,
    "originalPrice": 12671,
    "discount": 26,
    "images": [
      "https://picsum.photos/400/400?random=22",
      "https://picsum.photos/400/400?random=1022"
    ],
    "rating": 4.8,
    "reviews": 4439,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Bose Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "23",
    "name": "Panasonic Electronics Product 3",
    "description": "High-quality electronics product from Panasonic. Features advanced technology and premium build quality.",
    "brand": "Panasonic",
    "category": "Electronics",
    "price": 27564,
    "originalPrice": 31323,
    "discount": 12,
    "images": [
      "https://picsum.photos/400/400?random=23",
      "https://picsum.photos/400/400?random=1023"
    ],
    "rating": 3.2,
    "reviews": 2324,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Panasonic Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "24",
    "name": "Sony Electronics Product 4",
    "description": "High-quality electronics product from Sony. Features advanced technology and premium build quality.",
    "brand": "Sony",
    "category": "Electronics",
    "price": 9811,
    "originalPrice": 27253,
    "discount": 64,
    "images": [
      "https://picsum.photos/400/400?random=24",
      "https://picsum.photos/400/400?random=1024"
    ],
    "rating": 3.8,
    "reviews": 3127,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Sony Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "25",
    "name": "Sony Electronics Product 5",
    "description": "High-quality electronics product from Sony. Features advanced technology and premium build quality.",
    "brand": "Sony",
    "category": "Electronics",
    "price": 9674,
    "originalPrice": 24806,
    "discount": 61,
    "images": [
      "https://picsum.photos/400/400?random=25",
      "https://picsum.photos/400/400?random=1025"
    ],
    "rating": 4.6,
    "reviews": 1689,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Sony Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "26",
    "name": "LG Electronics Product 6",
    "description": "High-quality electronics product from LG. Features advanced technology and premium build quality.",
    "brand": "LG",
    "category": "Electronics",
    "price": 4543,
    "originalPrice": 13363,
    "discount": 66,
    "images": [
      "https://picsum.photos/400/400?random=26",
      "https://picsum.photos/400/400?random=1026"
    ],
    "rating": 4,
    "reviews": 2663,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "LG Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "27",
    "name": "Panasonic Electronics Product 7",
    "description": "High-quality electronics product from Panasonic. Features advanced technology and premium build quality.",
    "brand": "Panasonic",
    "category": "Electronics",
    "price": 33014,
    "originalPrice": 35122,
    "discount": 6,
    "images": [
      "https://picsum.photos/400/400?random=27",
      "https://picsum.photos/400/400?random=1027"
    ],
    "rating": 4,
    "reviews": 4090,
    "inStock": true,
    "prime": true,
    "freeDelivery": false,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Panasonic Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "28",
    "name": "Philips Electronics Product 8",
    "description": "High-quality electronics product from Philips. Features advanced technology and premium build quality.",
    "brand": "Philips",
    "category": "Electronics",
    "price": 13758,
    "originalPrice": 42995,
    "discount": 68,
    "images": [
      "https://picsum.photos/400/400?random=28",
      "https://picsum.photos/400/400?random=1028"
    ],
    "rating": 4.1,
    "reviews": 3305,
    "inStock": true,
    "prime": true,
    "freeDelivery": false,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Philips Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "29",
    "name": "Panasonic Electronics Product 9",
    "description": "High-quality electronics product from Panasonic. Features advanced technology and premium build quality.",
    "brand": "Panasonic",
    "category": "Electronics",
    "price": 10292,
    "originalPrice": 27818,
    "discount": 63,
    "images": [
      "https://picsum.photos/400/400?random=29",
      "https://picsum.photos/400/400?random=1029"
    ],
    "rating": 4.3,
    "reviews": 3772,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Panasonic Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "30",
    "name": "JBL Electronics Product 10",
    "description": "High-quality electronics product from JBL. Features advanced technology and premium build quality.",
    "brand": "JBL",
    "category": "Electronics",
    "price": 25371,
    "originalPrice": 30568,
    "discount": 17,
    "images": [
      "https://picsum.photos/400/400?random=30",
      "https://picsum.photos/400/400?random=1030"
    ],
    "rating": 4.8,
    "reviews": 3833,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "JBL Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "31",
    "name": "JBL Electronics Product 11",
    "description": "High-quality electronics product from JBL. Features advanced technology and premium build quality.",
    "brand": "JBL",
    "category": "Electronics",
    "price": 21050,
    "originalPrice": 25362,
    "discount": 17,
    "images": [
      "https://picsum.photos/400/400?random=31",
      "https://picsum.photos/400/400?random=1031"
    ],
    "rating": 4.7,
    "reviews": 3181,
    "inStock": true,
    "prime": true,
    "freeDelivery": false,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "JBL Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "32",
    "name": "Bose Electronics Product 12",
    "description": "High-quality electronics product from Bose. Features advanced technology and premium build quality.",
    "brand": "Bose",
    "category": "Electronics",
    "price": 19459,
    "originalPrice": 29044,
    "discount": 33,
    "images": [
      "https://picsum.photos/400/400?random=32",
      "https://picsum.photos/400/400?random=1032"
    ],
    "rating": 4.2,
    "reviews": 3570,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Bose Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "33",
    "name": "Sony Electronics Product 13",
    "description": "High-quality electronics product from Sony. Features advanced technology and premium build quality.",
    "brand": "Sony",
    "category": "Electronics",
    "price": 8486,
    "originalPrice": 19737,
    "discount": 57,
    "images": [
      "https://picsum.photos/400/400?random=33",
      "https://picsum.photos/400/400?random=1033"
    ],
    "rating": 4,
    "reviews": 2930,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Sony Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "34",
    "name": "JBL Electronics Product 14",
    "description": "High-quality electronics product from JBL. Features advanced technology and premium build quality.",
    "brand": "JBL",
    "category": "Electronics",
    "price": 11466,
    "originalPrice": 13651,
    "discount": 16,
    "images": [
      "https://picsum.photos/400/400?random=34",
      "https://picsum.photos/400/400?random=1034"
    ],
    "rating": 3.6,
    "reviews": 2022,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "JBL Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "35",
    "name": "Philips Electronics Product 15",
    "description": "High-quality electronics product from Philips. Features advanced technology and premium build quality.",
    "brand": "Philips",
    "category": "Electronics",
    "price": 14835,
    "originalPrice": 20323,
    "discount": 27,
    "images": [
      "https://picsum.photos/400/400?random=35",
      "https://picsum.photos/400/400?random=1035"
    ],
    "rating": 4,
    "reviews": 2535,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Philips Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "36",
    "name": "JBL Electronics Product 16",
    "description": "High-quality electronics product from JBL. Features advanced technology and premium build quality.",
    "brand": "JBL",
    "category": "Electronics",
    "price": 4617,
    "originalPrice": 6156,
    "discount": 25,
    "images": [
      "https://picsum.photos/400/400?random=36",
      "https://picsum.photos/400/400?random=1036"
    ],
    "rating": 4.9,
    "reviews": 3060,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "JBL Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "37",
    "name": "Bose Electronics Product 17",
    "description": "High-quality electronics product from Bose. Features advanced technology and premium build quality.",
    "brand": "Bose",
    "category": "Electronics",
    "price": 16894,
    "originalPrice": 22230,
    "discount": 24,
    "images": [
      "https://picsum.photos/400/400?random=37",
      "https://picsum.photos/400/400?random=1037"
    ],
    "rating": 3.9,
    "reviews": 1385,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Bose Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "38",
    "name": "Philips Electronics Product 18",
    "description": "High-quality electronics product from Philips. Features advanced technology and premium build quality.",
    "brand": "Philips",
    "category": "Electronics",
    "price": 16204,
    "originalPrice": 27465,
    "discount": 41,
    "images": [
      "https://picsum.photos/400/400?random=38",
      "https://picsum.photos/400/400?random=1038"
    ],
    "rating": 4.3,
    "reviews": 4959,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Philips Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "39",
    "name": "JBL Electronics Product 19",
    "description": "High-quality electronics product from JBL. Features advanced technology and premium build quality.",
    "brand": "JBL",
    "category": "Electronics",
    "price": 19750,
    "originalPrice": 19750,
    "discount": 0,
    "images": [
      "https://picsum.photos/400/400?random=39",
      "https://picsum.photos/400/400?random=1039"
    ],
    "rating": 4,
    "reviews": 4888,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "JBL Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "40",
    "name": "Bose Electronics Product 20",
    "description": "High-quality electronics product from Bose. Features advanced technology and premium build quality.",
    "brand": "Bose",
    "category": "Electronics",
    "price": 27866,
    "originalPrice": 48045,
    "discount": 42,
    "images": [
      "https://picsum.photos/400/400?random=40",
      "https://picsum.photos/400/400?random=1040"
    ],
    "rating": 3.9,
    "reviews": 1558,
    "inStock": true,
    "prime": true,
    "freeDelivery": false,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Bose Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "41",
    "name": "Adidas Fashion Product 1",
    "description": "High-quality fashion product from Adidas. Features advanced technology and premium build quality.",
    "brand": "Adidas",
    "category": "Fashion",
    "price": 28553,
    "originalPrice": 50094,
    "discount": 43,
    "images": [
      "https://picsum.photos/400/400?random=41",
      "https://picsum.photos/400/400?random=1041"
    ],
    "rating": 4.9,
    "reviews": 1204,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Adidas Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "42",
    "name": "Adidas Fashion Product 2",
    "description": "High-quality fashion product from Adidas. Features advanced technology and premium build quality.",
    "brand": "Adidas",
    "category": "Fashion",
    "price": 10458,
    "originalPrice": 12912,
    "discount": 19,
    "images": [
      "https://picsum.photos/400/400?random=42",
      "https://picsum.photos/400/400?random=1042"
    ],
    "rating": 4.6,
    "reviews": 4164,
    "inStock": false,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Adidas Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "43",
    "name": "Puma Fashion Product 3",
    "description": "High-quality fashion product from Puma. Features advanced technology and premium build quality.",
    "brand": "Puma",
    "category": "Fashion",
    "price": 33270,
    "originalPrice": 42655,
    "discount": 22,
    "images": [
      "https://picsum.photos/400/400?random=43",
      "https://picsum.photos/400/400?random=1043"
    ],
    "rating": 4.3,
    "reviews": 4018,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Puma Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "44",
    "name": "Adidas Fashion Product 4",
    "description": "High-quality fashion product from Adidas. Features advanced technology and premium build quality.",
    "brand": "Adidas",
    "category": "Fashion",
    "price": 11609,
    "originalPrice": 16585,
    "discount": 30,
    "images": [
      "https://picsum.photos/400/400?random=44",
      "https://picsum.photos/400/400?random=1044"
    ],
    "rating": 4.7,
    "reviews": 524,
    "inStock": true,
    "prime": true,
    "freeDelivery": false,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Adidas Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "45",
    "name": "Puma Fashion Product 5",
    "description": "High-quality fashion product from Puma. Features advanced technology and premium build quality.",
    "brand": "Puma",
    "category": "Fashion",
    "price": 5256,
    "originalPrice": 5476,
    "discount": 4,
    "images": [
      "https://picsum.photos/400/400?random=45",
      "https://picsum.photos/400/400?random=1045"
    ],
    "rating": 3.5,
    "reviews": 1384,
    "inStock": true,
    "prime": true,
    "freeDelivery": false,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Puma Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "46",
    "name": "Puma Fashion Product 6",
    "description": "High-quality fashion product from Puma. Features advanced technology and premium build quality.",
    "brand": "Puma",
    "category": "Fashion",
    "price": 4209,
    "originalPrice": 4295,
    "discount": 2,
    "images": [
      "https://picsum.photos/400/400?random=46",
      "https://picsum.photos/400/400?random=1046"
    ],
    "rating": 3.4,
    "reviews": 1184,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Puma Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "47",
    "name": "Puma Fashion Product 7",
    "description": "High-quality fashion product from Puma. Features advanced technology and premium build quality.",
    "brand": "Puma",
    "category": "Fashion",
    "price": 6287,
    "originalPrice": 6689,
    "discount": 6,
    "images": [
      "https://picsum.photos/400/400?random=47",
      "https://picsum.photos/400/400?random=1047"
    ],
    "rating": 3.5,
    "reviews": 1742,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Puma Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "48",
    "name": "Puma Fashion Product 8",
    "description": "High-quality fashion product from Puma. Features advanced technology and premium build quality.",
    "brand": "Puma",
    "category": "Fashion",
    "price": 3158,
    "originalPrice": 8098,
    "discount": 61,
    "images": [
      "https://picsum.photos/400/400?random=48",
      "https://picsum.photos/400/400?random=1048"
    ],
    "rating": 3.8,
    "reviews": 3901,
    "inStock": true,
    "prime": false,
    "freeDelivery": false,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Puma Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "49",
    "name": "Adidas Fashion Product 9",
    "description": "High-quality fashion product from Adidas. Features advanced technology and premium build quality.",
    "brand": "Adidas",
    "category": "Fashion",
    "price": 14676,
    "originalPrice": 16491,
    "discount": 11,
    "images": [
      "https://picsum.photos/400/400?random=49",
      "https://picsum.photos/400/400?random=1049"
    ],
    "rating": 4.5,
    "reviews": 3342,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Adidas Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "50",
    "name": "Levi's Fashion Product 10",
    "description": "High-quality fashion product from Levi's. Features advanced technology and premium build quality.",
    "brand": "Levi's",
    "category": "Fashion",
    "price": 1977,
    "originalPrice": 2908,
    "discount": 32,
    "images": [
      "https://picsum.photos/400/400?random=50",
      "https://picsum.photos/400/400?random=1050"
    ],
    "rating": 4.3,
    "reviews": 2608,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Levi's Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "51",
    "name": "Puma Fashion Product 11",
    "description": "High-quality fashion product from Puma. Features advanced technology and premium build quality.",
    "brand": "Puma",
    "category": "Fashion",
    "price": 29882,
    "originalPrice": 32481,
    "discount": 8,
    "images": [
      "https://picsum.photos/400/400?random=51",
      "https://picsum.photos/400/400?random=1051"
    ],
    "rating": 3.2,
    "reviews": 4167,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Puma Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "52",
    "name": "Puma Fashion Product 12",
    "description": "High-quality fashion product from Puma. Features advanced technology and premium build quality.",
    "brand": "Puma",
    "category": "Fashion",
    "price": 5776,
    "originalPrice": 14441,
    "discount": 60,
    "images": [
      "https://picsum.photos/400/400?random=52",
      "https://picsum.photos/400/400?random=1052"
    ],
    "rating": 3.5,
    "reviews": 1685,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Puma Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "53",
    "name": "Adidas Fashion Product 13",
    "description": "High-quality fashion product from Adidas. Features advanced technology and premium build quality.",
    "brand": "Adidas",
    "category": "Fashion",
    "price": 20860,
    "originalPrice": 49668,
    "discount": 58,
    "images": [
      "https://picsum.photos/400/400?random=53",
      "https://picsum.photos/400/400?random=1053"
    ],
    "rating": 3.1,
    "reviews": 3125,
    "inStock": true,
    "prime": false,
    "freeDelivery": false,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Adidas Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "54",
    "name": "Nike Fashion Product 14",
    "description": "High-quality fashion product from Nike. Features advanced technology and premium build quality.",
    "brand": "Nike",
    "category": "Fashion",
    "price": 13761,
    "originalPrice": 15290,
    "discount": 10,
    "images": [
      "https://picsum.photos/400/400?random=54",
      "https://picsum.photos/400/400?random=1054"
    ],
    "rating": 3.3,
    "reviews": 3858,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Nike Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "55",
    "name": "Adidas Fashion Product 15",
    "description": "High-quality fashion product from Adidas. Features advanced technology and premium build quality.",
    "brand": "Adidas",
    "category": "Fashion",
    "price": 3032,
    "originalPrice": 6593,
    "discount": 54,
    "images": [
      "https://picsum.photos/400/400?random=55",
      "https://picsum.photos/400/400?random=1055"
    ],
    "rating": 3,
    "reviews": 839,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Adidas Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "56",
    "name": "Adidas Fashion Product 16",
    "description": "High-quality fashion product from Adidas. Features advanced technology and premium build quality.",
    "brand": "Adidas",
    "category": "Fashion",
    "price": 37297,
    "originalPrice": 48438,
    "discount": 23,
    "images": [
      "https://picsum.photos/400/400?random=56",
      "https://picsum.photos/400/400?random=1056"
    ],
    "rating": 4.4,
    "reviews": 4397,
    "inStock": false,
    "prime": true,
    "freeDelivery": false,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Adidas Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "57",
    "name": "Puma Fashion Product 17",
    "description": "High-quality fashion product from Puma. Features advanced technology and premium build quality.",
    "brand": "Puma",
    "category": "Fashion",
    "price": 32944,
    "originalPrice": 41180,
    "discount": 20,
    "images": [
      "https://picsum.photos/400/400?random=57",
      "https://picsum.photos/400/400?random=1057"
    ],
    "rating": 4.1,
    "reviews": 4488,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Puma Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "58",
    "name": "Nike Fashion Product 18",
    "description": "High-quality fashion product from Nike. Features advanced technology and premium build quality.",
    "brand": "Nike",
    "category": "Fashion",
    "price": 1213,
    "originalPrice": 3791,
    "discount": 68,
    "images": [
      "https://picsum.photos/400/400?random=58",
      "https://picsum.photos/400/400?random=1058"
    ],
    "rating": 4.4,
    "reviews": 3685,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Nike Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "59",
    "name": "Levi's Fashion Product 19",
    "description": "High-quality fashion product from Levi's. Features advanced technology and premium build quality.",
    "brand": "Levi's",
    "category": "Fashion",
    "price": 17965,
    "originalPrice": 35930,
    "discount": 50,
    "images": [
      "https://picsum.photos/400/400?random=59",
      "https://picsum.photos/400/400?random=1059"
    ],
    "rating": 3.6,
    "reviews": 354,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Levi's Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "60",
    "name": "H&M Fashion Product 20",
    "description": "High-quality fashion product from H&M. Features advanced technology and premium build quality.",
    "brand": "H&M",
    "category": "Fashion",
    "price": 6013,
    "originalPrice": 15418,
    "discount": 61,
    "images": [
      "https://picsum.photos/400/400?random=60",
      "https://picsum.photos/400/400?random=1060"
    ],
    "rating": 3.4,
    "reviews": 1298,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "H&M Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "61",
    "name": "Pigeon Home & Kitchen Product 1",
    "description": "High-quality home & kitchen product from Pigeon. Features advanced technology and premium build quality.",
    "brand": "Pigeon",
    "category": "Home & Kitchen",
    "price": 9577,
    "originalPrice": 13489,
    "discount": 29,
    "images": [
      "https://picsum.photos/400/400?random=61",
      "https://picsum.photos/400/400?random=1061"
    ],
    "rating": 3.5,
    "reviews": 3477,
    "inStock": false,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Pigeon Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "62",
    "name": "Pigeon Home & Kitchen Product 2",
    "description": "High-quality home & kitchen product from Pigeon. Features advanced technology and premium build quality.",
    "brand": "Pigeon",
    "category": "Home & Kitchen",
    "price": 19220,
    "originalPrice": 25973,
    "discount": 26,
    "images": [
      "https://picsum.photos/400/400?random=62",
      "https://picsum.photos/400/400?random=1062"
    ],
    "rating": 4.5,
    "reviews": 3080,
    "inStock": false,
    "prime": true,
    "freeDelivery": false,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Pigeon Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "63",
    "name": "Pigeon Home & Kitchen Product 3",
    "description": "High-quality home & kitchen product from Pigeon. Features advanced technology and premium build quality.",
    "brand": "Pigeon",
    "category": "Home & Kitchen",
    "price": 2938,
    "originalPrice": 3302,
    "discount": 11,
    "images": [
      "https://picsum.photos/400/400?random=63",
      "https://picsum.photos/400/400?random=1063"
    ],
    "rating": 4,
    "reviews": 1593,
    "inStock": true,
    "prime": false,
    "freeDelivery": false,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Pigeon Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "64",
    "name": "Pigeon Home & Kitchen Product 4",
    "description": "High-quality home & kitchen product from Pigeon. Features advanced technology and premium build quality.",
    "brand": "Pigeon",
    "category": "Home & Kitchen",
    "price": 13646,
    "originalPrice": 27850,
    "discount": 51,
    "images": [
      "https://picsum.photos/400/400?random=64",
      "https://picsum.photos/400/400?random=1064"
    ],
    "rating": 3.7,
    "reviews": 4730,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Pigeon Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "65",
    "name": "Milton Home & Kitchen Product 5",
    "description": "High-quality home & kitchen product from Milton. Features advanced technology and premium build quality.",
    "brand": "Milton",
    "category": "Home & Kitchen",
    "price": 251,
    "originalPrice": 559,
    "discount": 55,
    "images": [
      "https://picsum.photos/400/400?random=65",
      "https://picsum.photos/400/400?random=1065"
    ],
    "rating": 3.4,
    "reviews": 1317,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Milton Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "66",
    "name": "Milton Home & Kitchen Product 6",
    "description": "High-quality home & kitchen product from Milton. Features advanced technology and premium build quality.",
    "brand": "Milton",
    "category": "Home & Kitchen",
    "price": 4743,
    "originalPrice": 5390,
    "discount": 12,
    "images": [
      "https://picsum.photos/400/400?random=66",
      "https://picsum.photos/400/400?random=1066"
    ],
    "rating": 3.6,
    "reviews": 4919,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Milton Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "67",
    "name": "Pigeon Home & Kitchen Product 7",
    "description": "High-quality home & kitchen product from Pigeon. Features advanced technology and premium build quality.",
    "brand": "Pigeon",
    "category": "Home & Kitchen",
    "price": 30400,
    "originalPrice": 47500,
    "discount": 36,
    "images": [
      "https://picsum.photos/400/400?random=67",
      "https://picsum.photos/400/400?random=1067"
    ],
    "rating": 4.2,
    "reviews": 2863,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Pigeon Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "68",
    "name": "Hawkins Home & Kitchen Product 8",
    "description": "High-quality home & kitchen product from Hawkins. Features advanced technology and premium build quality.",
    "brand": "Hawkins",
    "category": "Home & Kitchen",
    "price": 5255,
    "originalPrice": 13475,
    "discount": 61,
    "images": [
      "https://picsum.photos/400/400?random=68",
      "https://picsum.photos/400/400?random=1068"
    ],
    "rating": 4.7,
    "reviews": 1960,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Hawkins Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "69",
    "name": "Hawkins Home & Kitchen Product 9",
    "description": "High-quality home & kitchen product from Hawkins. Features advanced technology and premium build quality.",
    "brand": "Hawkins",
    "category": "Home & Kitchen",
    "price": 27803,
    "originalPrice": 46339,
    "discount": 40,
    "images": [
      "https://picsum.photos/400/400?random=69",
      "https://picsum.photos/400/400?random=1069"
    ],
    "rating": 5,
    "reviews": 3278,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Hawkins Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "70",
    "name": "Prestige Home & Kitchen Product 10",
    "description": "High-quality home & kitchen product from Prestige. Features advanced technology and premium build quality.",
    "brand": "Prestige",
    "category": "Home & Kitchen",
    "price": 16189,
    "originalPrice": 33729,
    "discount": 52,
    "images": [
      "https://picsum.photos/400/400?random=70",
      "https://picsum.photos/400/400?random=1070"
    ],
    "rating": 4.5,
    "reviews": 4002,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Prestige Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "71",
    "name": "Prestige Home & Kitchen Product 11",
    "description": "High-quality home & kitchen product from Prestige. Features advanced technology and premium build quality.",
    "brand": "Prestige",
    "category": "Home & Kitchen",
    "price": 13992,
    "originalPrice": 27985,
    "discount": 50,
    "images": [
      "https://picsum.photos/400/400?random=71",
      "https://picsum.photos/400/400?random=1071"
    ],
    "rating": 4,
    "reviews": 1341,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Prestige Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "72",
    "name": "Borosil Home & Kitchen Product 12",
    "description": "High-quality home & kitchen product from Borosil. Features advanced technology and premium build quality.",
    "brand": "Borosil",
    "category": "Home & Kitchen",
    "price": 13845,
    "originalPrice": 34613,
    "discount": 60,
    "images": [
      "https://picsum.photos/400/400?random=72",
      "https://picsum.photos/400/400?random=1072"
    ],
    "rating": 4.3,
    "reviews": 3943,
    "inStock": false,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Borosil Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "73",
    "name": "Borosil Home & Kitchen Product 13",
    "description": "High-quality home & kitchen product from Borosil. Features advanced technology and premium build quality.",
    "brand": "Borosil",
    "category": "Home & Kitchen",
    "price": 6012,
    "originalPrice": 8351,
    "discount": 28,
    "images": [
      "https://picsum.photos/400/400?random=73",
      "https://picsum.photos/400/400?random=1073"
    ],
    "rating": 3,
    "reviews": 5049,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Borosil Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "74",
    "name": "Pigeon Home & Kitchen Product 14",
    "description": "High-quality home & kitchen product from Pigeon. Features advanced technology and premium build quality.",
    "brand": "Pigeon",
    "category": "Home & Kitchen",
    "price": 2797,
    "originalPrice": 6822,
    "discount": 59,
    "images": [
      "https://picsum.photos/400/400?random=74",
      "https://picsum.photos/400/400?random=1074"
    ],
    "rating": 3.8,
    "reviews": 539,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Pigeon Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "75",
    "name": "Milton Home & Kitchen Product 15",
    "description": "High-quality home & kitchen product from Milton. Features advanced technology and premium build quality.",
    "brand": "Milton",
    "category": "Home & Kitchen",
    "price": 14499,
    "originalPrice": 17901,
    "discount": 19,
    "images": [
      "https://picsum.photos/400/400?random=75",
      "https://picsum.photos/400/400?random=1075"
    ],
    "rating": 4.5,
    "reviews": 3133,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Milton Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "76",
    "name": "Milton Home & Kitchen Product 16",
    "description": "High-quality home & kitchen product from Milton. Features advanced technology and premium build quality.",
    "brand": "Milton",
    "category": "Home & Kitchen",
    "price": 14218,
    "originalPrice": 30910,
    "discount": 54,
    "images": [
      "https://picsum.photos/400/400?random=76",
      "https://picsum.photos/400/400?random=1076"
    ],
    "rating": 4.5,
    "reviews": 1222,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Milton Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "77",
    "name": "Hawkins Home & Kitchen Product 17",
    "description": "High-quality home & kitchen product from Hawkins. Features advanced technology and premium build quality.",
    "brand": "Hawkins",
    "category": "Home & Kitchen",
    "price": 14747,
    "originalPrice": 44690,
    "discount": 67,
    "images": [
      "https://picsum.photos/400/400?random=77",
      "https://picsum.photos/400/400?random=1077"
    ],
    "rating": 4.1,
    "reviews": 1547,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Hawkins Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "78",
    "name": "Prestige Home & Kitchen Product 18",
    "description": "High-quality home & kitchen product from Prestige. Features advanced technology and premium build quality.",
    "brand": "Prestige",
    "category": "Home & Kitchen",
    "price": 1635,
    "originalPrice": 1652,
    "discount": 1,
    "images": [
      "https://picsum.photos/400/400?random=78",
      "https://picsum.photos/400/400?random=1078"
    ],
    "rating": 4.9,
    "reviews": 4126,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Prestige Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "79",
    "name": "Prestige Home & Kitchen Product 19",
    "description": "High-quality home & kitchen product from Prestige. Features advanced technology and premium build quality.",
    "brand": "Prestige",
    "category": "Home & Kitchen",
    "price": 30695,
    "originalPrice": 50321,
    "discount": 39,
    "images": [
      "https://picsum.photos/400/400?random=79",
      "https://picsum.photos/400/400?random=1079"
    ],
    "rating": 4.2,
    "reviews": 3640,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Prestige Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "80",
    "name": "Milton Home & Kitchen Product 20",
    "description": "High-quality home & kitchen product from Milton. Features advanced technology and premium build quality.",
    "brand": "Milton",
    "category": "Home & Kitchen",
    "price": 24700,
    "originalPrice": 31266,
    "discount": 21,
    "images": [
      "https://picsum.photos/400/400?random=80",
      "https://picsum.photos/400/400?random=1080"
    ],
    "rating": 3.2,
    "reviews": 3630,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Milton Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "81",
    "name": "Maybelline Beauty & Personal Care Product 1",
    "description": "High-quality beauty & personal care product from Maybelline. Features advanced technology and premium build quality.",
    "brand": "Maybelline",
    "category": "Beauty & Personal Care",
    "price": 32514,
    "originalPrice": 48529,
    "discount": 33,
    "images": [
      "https://picsum.photos/400/400?random=81",
      "https://picsum.photos/400/400?random=1081"
    ],
    "rating": 4.4,
    "reviews": 2883,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Maybelline Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "82",
    "name": "Maybelline Beauty & Personal Care Product 2",
    "description": "High-quality beauty & personal care product from Maybelline. Features advanced technology and premium build quality.",
    "brand": "Maybelline",
    "category": "Beauty & Personal Care",
    "price": 13059,
    "originalPrice": 20729,
    "discount": 37,
    "images": [
      "https://picsum.photos/400/400?random=82",
      "https://picsum.photos/400/400?random=1082"
    ],
    "rating": 3,
    "reviews": 3249,
    "inStock": true,
    "prime": true,
    "freeDelivery": false,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Maybelline Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "83",
    "name": "Maybelline Beauty & Personal Care Product 3",
    "description": "High-quality beauty & personal care product from Maybelline. Features advanced technology and premium build quality.",
    "brand": "Maybelline",
    "category": "Beauty & Personal Care",
    "price": 17651,
    "originalPrice": 45259,
    "discount": 61,
    "images": [
      "https://picsum.photos/400/400?random=83",
      "https://picsum.photos/400/400?random=1083"
    ],
    "rating": 4.4,
    "reviews": 1554,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Maybelline Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "84",
    "name": "Maybelline Beauty & Personal Care Product 4",
    "description": "High-quality beauty & personal care product from Maybelline. Features advanced technology and premium build quality.",
    "brand": "Maybelline",
    "category": "Beauty & Personal Care",
    "price": 22415,
    "originalPrice": 39326,
    "discount": 43,
    "images": [
      "https://picsum.photos/400/400?random=84",
      "https://picsum.photos/400/400?random=1084"
    ],
    "rating": 3.4,
    "reviews": 2059,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Maybelline Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "85",
    "name": "L'Oreal Beauty & Personal Care Product 5",
    "description": "High-quality beauty & personal care product from L'Oreal. Features advanced technology and premium build quality.",
    "brand": "L'Oreal",
    "category": "Beauty & Personal Care",
    "price": 4187,
    "originalPrice": 13086,
    "discount": 68,
    "images": [
      "https://picsum.photos/400/400?random=85",
      "https://picsum.photos/400/400?random=1085"
    ],
    "rating": 3.5,
    "reviews": 4559,
    "inStock": false,
    "prime": true,
    "freeDelivery": false,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "L'Oreal Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "86",
    "name": "Dove Beauty & Personal Care Product 6",
    "description": "High-quality beauty & personal care product from Dove. Features advanced technology and premium build quality.",
    "brand": "Dove",
    "category": "Beauty & Personal Care",
    "price": 18810,
    "originalPrice": 24429,
    "discount": 23,
    "images": [
      "https://picsum.photos/400/400?random=86",
      "https://picsum.photos/400/400?random=1086"
    ],
    "rating": 3.2,
    "reviews": 2180,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Dove Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "87",
    "name": "Dove Beauty & Personal Care Product 7",
    "description": "High-quality beauty & personal care product from Dove. Features advanced technology and premium build quality.",
    "brand": "Dove",
    "category": "Beauty & Personal Care",
    "price": 19245,
    "originalPrice": 26364,
    "discount": 27,
    "images": [
      "https://picsum.photos/400/400?random=87",
      "https://picsum.photos/400/400?random=1087"
    ],
    "rating": 4.7,
    "reviews": 1568,
    "inStock": true,
    "prime": true,
    "freeDelivery": false,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Dove Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "88",
    "name": "Nivea Beauty & Personal Care Product 8",
    "description": "High-quality beauty & personal care product from Nivea. Features advanced technology and premium build quality.",
    "brand": "Nivea",
    "category": "Beauty & Personal Care",
    "price": 25543,
    "originalPrice": 28382,
    "discount": 10,
    "images": [
      "https://picsum.photos/400/400?random=88",
      "https://picsum.photos/400/400?random=1088"
    ],
    "rating": 4.6,
    "reviews": 695,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Nivea Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "89",
    "name": "Maybelline Beauty & Personal Care Product 9",
    "description": "High-quality beauty & personal care product from Maybelline. Features advanced technology and premium build quality.",
    "brand": "Maybelline",
    "category": "Beauty & Personal Care",
    "price": 7637,
    "originalPrice": 21822,
    "discount": 65,
    "images": [
      "https://picsum.photos/400/400?random=89",
      "https://picsum.photos/400/400?random=1089"
    ],
    "rating": 3.8,
    "reviews": 4830,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Maybelline Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "90",
    "name": "Maybelline Beauty & Personal Care Product 10",
    "description": "High-quality beauty & personal care product from Maybelline. Features advanced technology and premium build quality.",
    "brand": "Maybelline",
    "category": "Beauty & Personal Care",
    "price": 15445,
    "originalPrice": 37672,
    "discount": 59,
    "images": [
      "https://picsum.photos/400/400?random=90",
      "https://picsum.photos/400/400?random=1090"
    ],
    "rating": 4,
    "reviews": 2586,
    "inStock": true,
    "prime": true,
    "freeDelivery": false,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Maybelline Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "91",
    "name": "L'Oreal Beauty & Personal Care Product 11",
    "description": "High-quality beauty & personal care product from L'Oreal. Features advanced technology and premium build quality.",
    "brand": "L'Oreal",
    "category": "Beauty & Personal Care",
    "price": 27941,
    "originalPrice": 45806,
    "discount": 39,
    "images": [
      "https://picsum.photos/400/400?random=91",
      "https://picsum.photos/400/400?random=1091"
    ],
    "rating": 3.6,
    "reviews": 846,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "L'Oreal Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "92",
    "name": "Nivea Beauty & Personal Care Product 12",
    "description": "High-quality beauty & personal care product from Nivea. Features advanced technology and premium build quality.",
    "brand": "Nivea",
    "category": "Beauty & Personal Care",
    "price": 7801,
    "originalPrice": 10402,
    "discount": 25,
    "images": [
      "https://picsum.photos/400/400?random=92",
      "https://picsum.photos/400/400?random=1092"
    ],
    "rating": 4.7,
    "reviews": 4415,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Nivea Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "93",
    "name": "Maybelline Beauty & Personal Care Product 13",
    "description": "High-quality beauty & personal care product from Maybelline. Features advanced technology and premium build quality.",
    "brand": "Maybelline",
    "category": "Beauty & Personal Care",
    "price": 11051,
    "originalPrice": 21669,
    "discount": 49,
    "images": [
      "https://picsum.photos/400/400?random=93",
      "https://picsum.photos/400/400?random=1093"
    ],
    "rating": 4.3,
    "reviews": 3397,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Maybelline Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "94",
    "name": "L'Oreal Beauty & Personal Care Product 14",
    "description": "High-quality beauty & personal care product from L'Oreal. Features advanced technology and premium build quality.",
    "brand": "L'Oreal",
    "category": "Beauty & Personal Care",
    "price": 17012,
    "originalPrice": 24303,
    "discount": 30,
    "images": [
      "https://picsum.photos/400/400?random=94",
      "https://picsum.photos/400/400?random=1094"
    ],
    "rating": 4.1,
    "reviews": 2373,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "L'Oreal Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "95",
    "name": "Dove Beauty & Personal Care Product 15",
    "description": "High-quality beauty & personal care product from Dove. Features advanced technology and premium build quality.",
    "brand": "Dove",
    "category": "Beauty & Personal Care",
    "price": 22404,
    "originalPrice": 28360,
    "discount": 21,
    "images": [
      "https://picsum.photos/400/400?random=95",
      "https://picsum.photos/400/400?random=1095"
    ],
    "rating": 4.4,
    "reviews": 1130,
    "inStock": true,
    "prime": false,
    "freeDelivery": false,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Dove Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "96",
    "name": "Maybelline Beauty & Personal Care Product 16",
    "description": "High-quality beauty & personal care product from Maybelline. Features advanced technology and premium build quality.",
    "brand": "Maybelline",
    "category": "Beauty & Personal Care",
    "price": 1134,
    "originalPrice": 1533,
    "discount": 26,
    "images": [
      "https://picsum.photos/400/400?random=96",
      "https://picsum.photos/400/400?random=1096"
    ],
    "rating": 3.2,
    "reviews": 3702,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Maybelline Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "97",
    "name": "L'Oreal Beauty & Personal Care Product 17",
    "description": "High-quality beauty & personal care product from L'Oreal. Features advanced technology and premium build quality.",
    "brand": "L'Oreal",
    "category": "Beauty & Personal Care",
    "price": 17064,
    "originalPrice": 41621,
    "discount": 59,
    "images": [
      "https://picsum.photos/400/400?random=97",
      "https://picsum.photos/400/400?random=1097"
    ],
    "rating": 3.5,
    "reviews": 649,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "L'Oreal Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "98",
    "name": "Maybelline Beauty & Personal Care Product 18",
    "description": "High-quality beauty & personal care product from Maybelline. Features advanced technology and premium build quality.",
    "brand": "Maybelline",
    "category": "Beauty & Personal Care",
    "price": 2691,
    "originalPrice": 3094,
    "discount": 13,
    "images": [
      "https://picsum.photos/400/400?random=98",
      "https://picsum.photos/400/400?random=1098"
    ],
    "rating": 4,
    "reviews": 4459,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Maybelline Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "99",
    "name": "Dove Beauty & Personal Care Product 19",
    "description": "High-quality beauty & personal care product from Dove. Features advanced technology and premium build quality.",
    "brand": "Dove",
    "category": "Beauty & Personal Care",
    "price": 7840,
    "originalPrice": 8910,
    "discount": 12,
    "images": [
      "https://picsum.photos/400/400?random=99",
      "https://picsum.photos/400/400?random=1099"
    ],
    "rating": 3.5,
    "reviews": 2459,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Dove Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "100",
    "name": "Maybelline Beauty & Personal Care Product 20",
    "description": "High-quality beauty & personal care product from Maybelline. Features advanced technology and premium build quality.",
    "brand": "Maybelline",
    "category": "Beauty & Personal Care",
    "price": 14469,
    "originalPrice": 22261,
    "discount": 35,
    "images": [
      "https://picsum.photos/400/400?random=100",
      "https://picsum.photos/400/400?random=1100"
    ],
    "rating": 4.9,
    "reviews": 2427,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Maybelline Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "101",
    "name": "Generic Brand Books Product 1",
    "description": "High-quality books product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Books",
    "price": 14279,
    "originalPrice": 38594,
    "discount": 63,
    "images": [
      "https://picsum.photos/400/400?random=101",
      "https://picsum.photos/400/400?random=1101"
    ],
    "rating": 4.9,
    "reviews": 1174,
    "inStock": false,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "102",
    "name": "Generic Brand Books Product 2",
    "description": "High-quality books product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Books",
    "price": 22066,
    "originalPrice": 29035,
    "discount": 24,
    "images": [
      "https://picsum.photos/400/400?random=102",
      "https://picsum.photos/400/400?random=1102"
    ],
    "rating": 4.4,
    "reviews": 1629,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "103",
    "name": "Generic Brand Books Product 3",
    "description": "High-quality books product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Books",
    "price": 32320,
    "originalPrice": 48240,
    "discount": 33,
    "images": [
      "https://picsum.photos/400/400?random=103",
      "https://picsum.photos/400/400?random=1103"
    ],
    "rating": 4.9,
    "reviews": 1159,
    "inStock": true,
    "prime": true,
    "freeDelivery": false,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "104",
    "name": "Generic Brand Books Product 4",
    "description": "High-quality books product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Books",
    "price": 19458,
    "originalPrice": 28616,
    "discount": 32,
    "images": [
      "https://picsum.photos/400/400?random=104",
      "https://picsum.photos/400/400?random=1104"
    ],
    "rating": 3,
    "reviews": 2137,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "105",
    "name": "Generic Brand Books Product 5",
    "description": "High-quality books product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Books",
    "price": 8409,
    "originalPrice": 10132,
    "discount": 17,
    "images": [
      "https://picsum.photos/400/400?random=105",
      "https://picsum.photos/400/400?random=1105"
    ],
    "rating": 3.4,
    "reviews": 3834,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "106",
    "name": "Generic Brand Books Product 6",
    "description": "High-quality books product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Books",
    "price": 22301,
    "originalPrice": 37799,
    "discount": 41,
    "images": [
      "https://picsum.photos/400/400?random=106",
      "https://picsum.photos/400/400?random=1106"
    ],
    "rating": 3.7,
    "reviews": 2091,
    "inStock": false,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "107",
    "name": "Generic Brand Books Product 7",
    "description": "High-quality books product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Books",
    "price": 10908,
    "originalPrice": 19834,
    "discount": 45,
    "images": [
      "https://picsum.photos/400/400?random=107",
      "https://picsum.photos/400/400?random=1107"
    ],
    "rating": 4.8,
    "reviews": 5011,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "108",
    "name": "Generic Brand Books Product 8",
    "description": "High-quality books product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Books",
    "price": 12171,
    "originalPrice": 13230,
    "discount": 8,
    "images": [
      "https://picsum.photos/400/400?random=108",
      "https://picsum.photos/400/400?random=1108"
    ],
    "rating": 4.4,
    "reviews": 497,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "109",
    "name": "Generic Brand Books Product 9",
    "description": "High-quality books product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Books",
    "price": 23440,
    "originalPrice": 47838,
    "discount": 51,
    "images": [
      "https://picsum.photos/400/400?random=109",
      "https://picsum.photos/400/400?random=1109"
    ],
    "rating": 3.2,
    "reviews": 152,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "110",
    "name": "Generic Brand Books Product 10",
    "description": "High-quality books product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Books",
    "price": 17950,
    "originalPrice": 49863,
    "discount": 64,
    "images": [
      "https://picsum.photos/400/400?random=110",
      "https://picsum.photos/400/400?random=1110"
    ],
    "rating": 3.4,
    "reviews": 1288,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "111",
    "name": "Generic Brand Books Product 11",
    "description": "High-quality books product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Books",
    "price": 1920,
    "originalPrice": 2043,
    "discount": 6,
    "images": [
      "https://picsum.photos/400/400?random=111",
      "https://picsum.photos/400/400?random=1111"
    ],
    "rating": 3.5,
    "reviews": 3582,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "112",
    "name": "Generic Brand Books Product 12",
    "description": "High-quality books product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Books",
    "price": 6424,
    "originalPrice": 17845,
    "discount": 64,
    "images": [
      "https://picsum.photos/400/400?random=112",
      "https://picsum.photos/400/400?random=1112"
    ],
    "rating": 3.3,
    "reviews": 4325,
    "inStock": true,
    "prime": false,
    "freeDelivery": false,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "113",
    "name": "Generic Brand Books Product 13",
    "description": "High-quality books product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Books",
    "price": 8676,
    "originalPrice": 21690,
    "discount": 60,
    "images": [
      "https://picsum.photos/400/400?random=113",
      "https://picsum.photos/400/400?random=1113"
    ],
    "rating": 4.1,
    "reviews": 1489,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "114",
    "name": "Generic Brand Books Product 14",
    "description": "High-quality books product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Books",
    "price": 9455,
    "originalPrice": 18911,
    "discount": 50,
    "images": [
      "https://picsum.photos/400/400?random=114",
      "https://picsum.photos/400/400?random=1114"
    ],
    "rating": 4.6,
    "reviews": 4559,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "115",
    "name": "Generic Brand Books Product 15",
    "description": "High-quality books product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Books",
    "price": 46771,
    "originalPrice": 48720,
    "discount": 4,
    "images": [
      "https://picsum.photos/400/400?random=115",
      "https://picsum.photos/400/400?random=1115"
    ],
    "rating": 4.1,
    "reviews": 1757,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "116",
    "name": "Generic Brand Books Product 16",
    "description": "High-quality books product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Books",
    "price": 26191,
    "originalPrice": 49417,
    "discount": 47,
    "images": [
      "https://picsum.photos/400/400?random=116",
      "https://picsum.photos/400/400?random=1116"
    ],
    "rating": 3.6,
    "reviews": 3817,
    "inStock": true,
    "prime": false,
    "freeDelivery": false,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "117",
    "name": "Generic Brand Books Product 17",
    "description": "High-quality books product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Books",
    "price": 41249,
    "originalPrice": 45329,
    "discount": 9,
    "images": [
      "https://picsum.photos/400/400?random=117",
      "https://picsum.photos/400/400?random=1117"
    ],
    "rating": 4.2,
    "reviews": 4061,
    "inStock": true,
    "prime": false,
    "freeDelivery": false,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "118",
    "name": "Generic Brand Books Product 18",
    "description": "High-quality books product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Books",
    "price": 25188,
    "originalPrice": 35477,
    "discount": 29,
    "images": [
      "https://picsum.photos/400/400?random=118",
      "https://picsum.photos/400/400?random=1118"
    ],
    "rating": 3.2,
    "reviews": 4390,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "119",
    "name": "Generic Brand Books Product 19",
    "description": "High-quality books product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Books",
    "price": 20558,
    "originalPrice": 22346,
    "discount": 8,
    "images": [
      "https://picsum.photos/400/400?random=119",
      "https://picsum.photos/400/400?random=1119"
    ],
    "rating": 3.7,
    "reviews": 1856,
    "inStock": false,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "120",
    "name": "Generic Brand Books Product 20",
    "description": "High-quality books product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Books",
    "price": 3386,
    "originalPrice": 6390,
    "discount": 47,
    "images": [
      "https://picsum.photos/400/400?random=120",
      "https://picsum.photos/400/400?random=1120"
    ],
    "rating": 4.4,
    "reviews": 955,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "121",
    "name": "Generic Brand Sports, Fitness & Outdoors Product 1",
    "description": "High-quality sports, fitness & outdoors product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Sports, Fitness & Outdoors",
    "price": 14119,
    "originalPrice": 42787,
    "discount": 67,
    "images": [
      "https://picsum.photos/400/400?random=121",
      "https://picsum.photos/400/400?random=1121"
    ],
    "rating": 3.2,
    "reviews": 991,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "122",
    "name": "Generic Brand Sports, Fitness & Outdoors Product 2",
    "description": "High-quality sports, fitness & outdoors product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Sports, Fitness & Outdoors",
    "price": 46094,
    "originalPrice": 47035,
    "discount": 2,
    "images": [
      "https://picsum.photos/400/400?random=122",
      "https://picsum.photos/400/400?random=1122"
    ],
    "rating": 3.7,
    "reviews": 1525,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "123",
    "name": "Generic Brand Sports, Fitness & Outdoors Product 3",
    "description": "High-quality sports, fitness & outdoors product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Sports, Fitness & Outdoors",
    "price": 19504,
    "originalPrice": 48761,
    "discount": 60,
    "images": [
      "https://picsum.photos/400/400?random=123",
      "https://picsum.photos/400/400?random=1123"
    ],
    "rating": 4.9,
    "reviews": 1264,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "124",
    "name": "Generic Brand Sports, Fitness & Outdoors Product 4",
    "description": "High-quality sports, fitness & outdoors product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Sports, Fitness & Outdoors",
    "price": 27643,
    "originalPrice": 45318,
    "discount": 39,
    "images": [
      "https://picsum.photos/400/400?random=124",
      "https://picsum.photos/400/400?random=1124"
    ],
    "rating": 3.5,
    "reviews": 3532,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "125",
    "name": "Generic Brand Sports, Fitness & Outdoors Product 5",
    "description": "High-quality sports, fitness & outdoors product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Sports, Fitness & Outdoors",
    "price": 18630,
    "originalPrice": 21171,
    "discount": 12,
    "images": [
      "https://picsum.photos/400/400?random=125",
      "https://picsum.photos/400/400?random=1125"
    ],
    "rating": 3.7,
    "reviews": 455,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "126",
    "name": "Generic Brand Sports, Fitness & Outdoors Product 6",
    "description": "High-quality sports, fitness & outdoors product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Sports, Fitness & Outdoors",
    "price": 20091,
    "originalPrice": 35877,
    "discount": 44,
    "images": [
      "https://picsum.photos/400/400?random=126",
      "https://picsum.photos/400/400?random=1126"
    ],
    "rating": 4,
    "reviews": 1761,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "127",
    "name": "Generic Brand Sports, Fitness & Outdoors Product 7",
    "description": "High-quality sports, fitness & outdoors product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Sports, Fitness & Outdoors",
    "price": 14542,
    "originalPrice": 31615,
    "discount": 54,
    "images": [
      "https://picsum.photos/400/400?random=127",
      "https://picsum.photos/400/400?random=1127"
    ],
    "rating": 5,
    "reviews": 1283,
    "inStock": true,
    "prime": true,
    "freeDelivery": false,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "128",
    "name": "Generic Brand Sports, Fitness & Outdoors Product 8",
    "description": "High-quality sports, fitness & outdoors product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Sports, Fitness & Outdoors",
    "price": 41442,
    "originalPrice": 46047,
    "discount": 10,
    "images": [
      "https://picsum.photos/400/400?random=128",
      "https://picsum.photos/400/400?random=1128"
    ],
    "rating": 3.1,
    "reviews": 1021,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "129",
    "name": "Generic Brand Sports, Fitness & Outdoors Product 9",
    "description": "High-quality sports, fitness & outdoors product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Sports, Fitness & Outdoors",
    "price": 4033,
    "originalPrice": 4246,
    "discount": 5,
    "images": [
      "https://picsum.photos/400/400?random=129",
      "https://picsum.photos/400/400?random=1129"
    ],
    "rating": 4.9,
    "reviews": 2366,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "130",
    "name": "Generic Brand Sports, Fitness & Outdoors Product 10",
    "description": "High-quality sports, fitness & outdoors product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Sports, Fitness & Outdoors",
    "price": 24789,
    "originalPrice": 25556,
    "discount": 3,
    "images": [
      "https://picsum.photos/400/400?random=130",
      "https://picsum.photos/400/400?random=1130"
    ],
    "rating": 4,
    "reviews": 2240,
    "inStock": true,
    "prime": false,
    "freeDelivery": false,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "131",
    "name": "Generic Brand Sports, Fitness & Outdoors Product 11",
    "description": "High-quality sports, fitness & outdoors product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Sports, Fitness & Outdoors",
    "price": 18339,
    "originalPrice": 29111,
    "discount": 37,
    "images": [
      "https://picsum.photos/400/400?random=131",
      "https://picsum.photos/400/400?random=1131"
    ],
    "rating": 4.2,
    "reviews": 1217,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "132",
    "name": "Generic Brand Sports, Fitness & Outdoors Product 12",
    "description": "High-quality sports, fitness & outdoors product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Sports, Fitness & Outdoors",
    "price": 13304,
    "originalPrice": 25103,
    "discount": 47,
    "images": [
      "https://picsum.photos/400/400?random=132",
      "https://picsum.photos/400/400?random=1132"
    ],
    "rating": 4.4,
    "reviews": 4797,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "133",
    "name": "Generic Brand Sports, Fitness & Outdoors Product 13",
    "description": "High-quality sports, fitness & outdoors product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Sports, Fitness & Outdoors",
    "price": 17630,
    "originalPrice": 32056,
    "discount": 45,
    "images": [
      "https://picsum.photos/400/400?random=133",
      "https://picsum.photos/400/400?random=1133"
    ],
    "rating": 4.1,
    "reviews": 730,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "134",
    "name": "Generic Brand Sports, Fitness & Outdoors Product 14",
    "description": "High-quality sports, fitness & outdoors product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Sports, Fitness & Outdoors",
    "price": 28624,
    "originalPrice": 44726,
    "discount": 36,
    "images": [
      "https://picsum.photos/400/400?random=134",
      "https://picsum.photos/400/400?random=1134"
    ],
    "rating": 3.6,
    "reviews": 4804,
    "inStock": true,
    "prime": true,
    "freeDelivery": false,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "135",
    "name": "Generic Brand Sports, Fitness & Outdoors Product 15",
    "description": "High-quality sports, fitness & outdoors product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Sports, Fitness & Outdoors",
    "price": 2318,
    "originalPrice": 4458,
    "discount": 48,
    "images": [
      "https://picsum.photos/400/400?random=135",
      "https://picsum.photos/400/400?random=1135"
    ],
    "rating": 3.7,
    "reviews": 767,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "136",
    "name": "Generic Brand Sports, Fitness & Outdoors Product 16",
    "description": "High-quality sports, fitness & outdoors product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Sports, Fitness & Outdoors",
    "price": 11721,
    "originalPrice": 19535,
    "discount": 40,
    "images": [
      "https://picsum.photos/400/400?random=136",
      "https://picsum.photos/400/400?random=1136"
    ],
    "rating": 3.7,
    "reviews": 4649,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "137",
    "name": "Generic Brand Sports, Fitness & Outdoors Product 17",
    "description": "High-quality sports, fitness & outdoors product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Sports, Fitness & Outdoors",
    "price": 7784,
    "originalPrice": 12761,
    "discount": 39,
    "images": [
      "https://picsum.photos/400/400?random=137",
      "https://picsum.photos/400/400?random=1137"
    ],
    "rating": 3.9,
    "reviews": 2754,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "138",
    "name": "Generic Brand Sports, Fitness & Outdoors Product 18",
    "description": "High-quality sports, fitness & outdoors product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Sports, Fitness & Outdoors",
    "price": 3727,
    "originalPrice": 11647,
    "discount": 68,
    "images": [
      "https://picsum.photos/400/400?random=138",
      "https://picsum.photos/400/400?random=1138"
    ],
    "rating": 4.9,
    "reviews": 329,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "139",
    "name": "Generic Brand Sports, Fitness & Outdoors Product 19",
    "description": "High-quality sports, fitness & outdoors product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Sports, Fitness & Outdoors",
    "price": 29439,
    "originalPrice": 44605,
    "discount": 34,
    "images": [
      "https://picsum.photos/400/400?random=139",
      "https://picsum.photos/400/400?random=1139"
    ],
    "rating": 4.2,
    "reviews": 2662,
    "inStock": true,
    "prime": true,
    "freeDelivery": false,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "140",
    "name": "Generic Brand Sports, Fitness & Outdoors Product 20",
    "description": "High-quality sports, fitness & outdoors product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Sports, Fitness & Outdoors",
    "price": 11761,
    "originalPrice": 17554,
    "discount": 33,
    "images": [
      "https://picsum.photos/400/400?random=140",
      "https://picsum.photos/400/400?random=1140"
    ],
    "rating": 4.3,
    "reviews": 3481,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "141",
    "name": "Generic Brand Toys & Games Product 1",
    "description": "High-quality toys & games product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Toys & Games",
    "price": 1105,
    "originalPrice": 3072,
    "discount": 64,
    "images": [
      "https://picsum.photos/400/400?random=141",
      "https://picsum.photos/400/400?random=1141"
    ],
    "rating": 3.2,
    "reviews": 4329,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "142",
    "name": "Generic Brand Toys & Games Product 2",
    "description": "High-quality toys & games product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Toys & Games",
    "price": 6174,
    "originalPrice": 14700,
    "discount": 58,
    "images": [
      "https://picsum.photos/400/400?random=142",
      "https://picsum.photos/400/400?random=1142"
    ],
    "rating": 4.4,
    "reviews": 1538,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "143",
    "name": "Generic Brand Toys & Games Product 3",
    "description": "High-quality toys & games product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Toys & Games",
    "price": 6197,
    "originalPrice": 7946,
    "discount": 22,
    "images": [
      "https://picsum.photos/400/400?random=143",
      "https://picsum.photos/400/400?random=1143"
    ],
    "rating": 3.1,
    "reviews": 2360,
    "inStock": true,
    "prime": false,
    "freeDelivery": false,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "144",
    "name": "Generic Brand Toys & Games Product 4",
    "description": "High-quality toys & games product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Toys & Games",
    "price": 5186,
    "originalPrice": 6031,
    "discount": 14,
    "images": [
      "https://picsum.photos/400/400?random=144",
      "https://picsum.photos/400/400?random=1144"
    ],
    "rating": 4.5,
    "reviews": 2099,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "145",
    "name": "Generic Brand Toys & Games Product 5",
    "description": "High-quality toys & games product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Toys & Games",
    "price": 32887,
    "originalPrice": 46320,
    "discount": 29,
    "images": [
      "https://picsum.photos/400/400?random=145",
      "https://picsum.photos/400/400?random=1145"
    ],
    "rating": 4.9,
    "reviews": 4871,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "146",
    "name": "Generic Brand Toys & Games Product 6",
    "description": "High-quality toys & games product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Toys & Games",
    "price": 7368,
    "originalPrice": 15350,
    "discount": 52,
    "images": [
      "https://picsum.photos/400/400?random=146",
      "https://picsum.photos/400/400?random=1146"
    ],
    "rating": 3.3,
    "reviews": 2171,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "147",
    "name": "Generic Brand Toys & Games Product 7",
    "description": "High-quality toys & games product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Toys & Games",
    "price": 8577,
    "originalPrice": 9859,
    "discount": 13,
    "images": [
      "https://picsum.photos/400/400?random=147",
      "https://picsum.photos/400/400?random=1147"
    ],
    "rating": 3.6,
    "reviews": 3221,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "148",
    "name": "Generic Brand Toys & Games Product 8",
    "description": "High-quality toys & games product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Toys & Games",
    "price": 16922,
    "originalPrice": 36005,
    "discount": 53,
    "images": [
      "https://picsum.photos/400/400?random=148",
      "https://picsum.photos/400/400?random=1148"
    ],
    "rating": 3.8,
    "reviews": 2399,
    "inStock": true,
    "prime": true,
    "freeDelivery": false,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "149",
    "name": "Generic Brand Toys & Games Product 9",
    "description": "High-quality toys & games product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Toys & Games",
    "price": 5306,
    "originalPrice": 10405,
    "discount": 49,
    "images": [
      "https://picsum.photos/400/400?random=149",
      "https://picsum.photos/400/400?random=1149"
    ],
    "rating": 3.1,
    "reviews": 4774,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "150",
    "name": "Generic Brand Toys & Games Product 10",
    "description": "High-quality toys & games product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Toys & Games",
    "price": 14911,
    "originalPrice": 36369,
    "discount": 59,
    "images": [
      "https://picsum.photos/400/400?random=150",
      "https://picsum.photos/400/400?random=1150"
    ],
    "rating": 3.3,
    "reviews": 2223,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "151",
    "name": "Generic Brand Toys & Games Product 11",
    "description": "High-quality toys & games product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Toys & Games",
    "price": 451,
    "originalPrice": 1075,
    "discount": 58,
    "images": [
      "https://picsum.photos/400/400?random=151",
      "https://picsum.photos/400/400?random=1151"
    ],
    "rating": 4.6,
    "reviews": 4706,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "152",
    "name": "Generic Brand Toys & Games Product 12",
    "description": "High-quality toys & games product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Toys & Games",
    "price": 20991,
    "originalPrice": 33858,
    "discount": 38,
    "images": [
      "https://picsum.photos/400/400?random=152",
      "https://picsum.photos/400/400?random=1152"
    ],
    "rating": 4,
    "reviews": 3600,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "153",
    "name": "Generic Brand Toys & Games Product 13",
    "description": "High-quality toys & games product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Toys & Games",
    "price": 38902,
    "originalPrice": 43711,
    "discount": 11,
    "images": [
      "https://picsum.photos/400/400?random=153",
      "https://picsum.photos/400/400?random=1153"
    ],
    "rating": 3.9,
    "reviews": 1764,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "154",
    "name": "Generic Brand Toys & Games Product 14",
    "description": "High-quality toys & games product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Toys & Games",
    "price": 36887,
    "originalPrice": 42892,
    "discount": 14,
    "images": [
      "https://picsum.photos/400/400?random=154",
      "https://picsum.photos/400/400?random=1154"
    ],
    "rating": 3.5,
    "reviews": 4066,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "155",
    "name": "Generic Brand Toys & Games Product 15",
    "description": "High-quality toys & games product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Toys & Games",
    "price": 7668,
    "originalPrice": 15977,
    "discount": 52,
    "images": [
      "https://picsum.photos/400/400?random=155",
      "https://picsum.photos/400/400?random=1155"
    ],
    "rating": 3.3,
    "reviews": 2590,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "156",
    "name": "Generic Brand Toys & Games Product 16",
    "description": "High-quality toys & games product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Toys & Games",
    "price": 23507,
    "originalPrice": 36166,
    "discount": 35,
    "images": [
      "https://picsum.photos/400/400?random=156",
      "https://picsum.photos/400/400?random=1156"
    ],
    "rating": 3.6,
    "reviews": 3831,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "157",
    "name": "Generic Brand Toys & Games Product 17",
    "description": "High-quality toys & games product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Toys & Games",
    "price": 25794,
    "originalPrice": 48669,
    "discount": 47,
    "images": [
      "https://picsum.photos/400/400?random=157",
      "https://picsum.photos/400/400?random=1157"
    ],
    "rating": 4,
    "reviews": 2099,
    "inStock": true,
    "prime": true,
    "freeDelivery": false,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "158",
    "name": "Generic Brand Toys & Games Product 18",
    "description": "High-quality toys & games product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Toys & Games",
    "price": 42756,
    "originalPrice": 42756,
    "discount": 0,
    "images": [
      "https://picsum.photos/400/400?random=158",
      "https://picsum.photos/400/400?random=1158"
    ],
    "rating": 3.7,
    "reviews": 1195,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "159",
    "name": "Generic Brand Toys & Games Product 19",
    "description": "High-quality toys & games product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Toys & Games",
    "price": 13692,
    "originalPrice": 24895,
    "discount": 45,
    "images": [
      "https://picsum.photos/400/400?random=159",
      "https://picsum.photos/400/400?random=1159"
    ],
    "rating": 4.9,
    "reviews": 203,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "160",
    "name": "Generic Brand Toys & Games Product 20",
    "description": "High-quality toys & games product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Toys & Games",
    "price": 16639,
    "originalPrice": 42666,
    "discount": 61,
    "images": [
      "https://picsum.photos/400/400?random=160",
      "https://picsum.photos/400/400?random=1160"
    ],
    "rating": 3.1,
    "reviews": 3195,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "161",
    "name": "Generic Brand Grocery & Gourmet Foods Product 1",
    "description": "High-quality grocery & gourmet foods product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Grocery & Gourmet Foods",
    "price": 14622,
    "originalPrice": 14921,
    "discount": 2,
    "images": [
      "https://picsum.photos/400/400?random=161",
      "https://picsum.photos/400/400?random=1161"
    ],
    "rating": 4.5,
    "reviews": 3309,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "162",
    "name": "Generic Brand Grocery & Gourmet Foods Product 2",
    "description": "High-quality grocery & gourmet foods product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Grocery & Gourmet Foods",
    "price": 5690,
    "originalPrice": 8891,
    "discount": 36,
    "images": [
      "https://picsum.photos/400/400?random=162",
      "https://picsum.photos/400/400?random=1162"
    ],
    "rating": 4.7,
    "reviews": 3656,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "163",
    "name": "Generic Brand Grocery & Gourmet Foods Product 3",
    "description": "High-quality grocery & gourmet foods product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Grocery & Gourmet Foods",
    "price": 10221,
    "originalPrice": 10991,
    "discount": 7,
    "images": [
      "https://picsum.photos/400/400?random=163",
      "https://picsum.photos/400/400?random=1163"
    ],
    "rating": 3.1,
    "reviews": 645,
    "inStock": true,
    "prime": true,
    "freeDelivery": false,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "164",
    "name": "Generic Brand Grocery & Gourmet Foods Product 4",
    "description": "High-quality grocery & gourmet foods product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Grocery & Gourmet Foods",
    "price": 25793,
    "originalPrice": 29311,
    "discount": 12,
    "images": [
      "https://picsum.photos/400/400?random=164",
      "https://picsum.photos/400/400?random=1164"
    ],
    "rating": 4.4,
    "reviews": 2949,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "165",
    "name": "Generic Brand Grocery & Gourmet Foods Product 5",
    "description": "High-quality grocery & gourmet foods product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Grocery & Gourmet Foods",
    "price": 27504,
    "originalPrice": 31614,
    "discount": 13,
    "images": [
      "https://picsum.photos/400/400?random=165",
      "https://picsum.photos/400/400?random=1165"
    ],
    "rating": 3.1,
    "reviews": 4097,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "166",
    "name": "Generic Brand Grocery & Gourmet Foods Product 6",
    "description": "High-quality grocery & gourmet foods product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Grocery & Gourmet Foods",
    "price": 16549,
    "originalPrice": 24338,
    "discount": 32,
    "images": [
      "https://picsum.photos/400/400?random=166",
      "https://picsum.photos/400/400?random=1166"
    ],
    "rating": 3.9,
    "reviews": 1350,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "167",
    "name": "Generic Brand Grocery & Gourmet Foods Product 7",
    "description": "High-quality grocery & gourmet foods product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Grocery & Gourmet Foods",
    "price": 6401,
    "originalPrice": 7621,
    "discount": 16,
    "images": [
      "https://picsum.photos/400/400?random=167",
      "https://picsum.photos/400/400?random=1167"
    ],
    "rating": 4.3,
    "reviews": 496,
    "inStock": true,
    "prime": true,
    "freeDelivery": false,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "168",
    "name": "Generic Brand Grocery & Gourmet Foods Product 8",
    "description": "High-quality grocery & gourmet foods product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Grocery & Gourmet Foods",
    "price": 2303,
    "originalPrice": 4265,
    "discount": 46,
    "images": [
      "https://picsum.photos/400/400?random=168",
      "https://picsum.photos/400/400?random=1168"
    ],
    "rating": 4.4,
    "reviews": 4683,
    "inStock": true,
    "prime": true,
    "freeDelivery": false,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "169",
    "name": "Generic Brand Grocery & Gourmet Foods Product 9",
    "description": "High-quality grocery & gourmet foods product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Grocery & Gourmet Foods",
    "price": 19726,
    "originalPrice": 20765,
    "discount": 5,
    "images": [
      "https://picsum.photos/400/400?random=169",
      "https://picsum.photos/400/400?random=1169"
    ],
    "rating": 4.7,
    "reviews": 2926,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "170",
    "name": "Generic Brand Grocery & Gourmet Foods Product 10",
    "description": "High-quality grocery & gourmet foods product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Grocery & Gourmet Foods",
    "price": 16619,
    "originalPrice": 22159,
    "discount": 25,
    "images": [
      "https://picsum.photos/400/400?random=170",
      "https://picsum.photos/400/400?random=1170"
    ],
    "rating": 3.4,
    "reviews": 4040,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "171",
    "name": "Generic Brand Grocery & Gourmet Foods Product 11",
    "description": "High-quality grocery & gourmet foods product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Grocery & Gourmet Foods",
    "price": 25095,
    "originalPrice": 34378,
    "discount": 27,
    "images": [
      "https://picsum.photos/400/400?random=171",
      "https://picsum.photos/400/400?random=1171"
    ],
    "rating": 3.3,
    "reviews": 2479,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "172",
    "name": "Generic Brand Grocery & Gourmet Foods Product 12",
    "description": "High-quality grocery & gourmet foods product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Grocery & Gourmet Foods",
    "price": 11596,
    "originalPrice": 28284,
    "discount": 59,
    "images": [
      "https://picsum.photos/400/400?random=172",
      "https://picsum.photos/400/400?random=1172"
    ],
    "rating": 4.9,
    "reviews": 480,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "173",
    "name": "Generic Brand Grocery & Gourmet Foods Product 13",
    "description": "High-quality grocery & gourmet foods product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Grocery & Gourmet Foods",
    "price": 15846,
    "originalPrice": 23652,
    "discount": 33,
    "images": [
      "https://picsum.photos/400/400?random=173",
      "https://picsum.photos/400/400?random=1173"
    ],
    "rating": 4.2,
    "reviews": 3267,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "174",
    "name": "Generic Brand Grocery & Gourmet Foods Product 14",
    "description": "High-quality grocery & gourmet foods product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Grocery & Gourmet Foods",
    "price": 28613,
    "originalPrice": 31443,
    "discount": 9,
    "images": [
      "https://picsum.photos/400/400?random=174",
      "https://picsum.photos/400/400?random=1174"
    ],
    "rating": 4.6,
    "reviews": 5080,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "175",
    "name": "Generic Brand Grocery & Gourmet Foods Product 15",
    "description": "High-quality grocery & gourmet foods product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Grocery & Gourmet Foods",
    "price": 17083,
    "originalPrice": 27117,
    "discount": 37,
    "images": [
      "https://picsum.photos/400/400?random=175",
      "https://picsum.photos/400/400?random=1175"
    ],
    "rating": 3,
    "reviews": 2984,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "176",
    "name": "Generic Brand Grocery & Gourmet Foods Product 16",
    "description": "High-quality grocery & gourmet foods product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Grocery & Gourmet Foods",
    "price": 8245,
    "originalPrice": 10571,
    "discount": 22,
    "images": [
      "https://picsum.photos/400/400?random=176",
      "https://picsum.photos/400/400?random=1176"
    ],
    "rating": 4.8,
    "reviews": 2557,
    "inStock": false,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "177",
    "name": "Generic Brand Grocery & Gourmet Foods Product 17",
    "description": "High-quality grocery & gourmet foods product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Grocery & Gourmet Foods",
    "price": 20792,
    "originalPrice": 43318,
    "discount": 52,
    "images": [
      "https://picsum.photos/400/400?random=177",
      "https://picsum.photos/400/400?random=1177"
    ],
    "rating": 3.7,
    "reviews": 3351,
    "inStock": false,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "178",
    "name": "Generic Brand Grocery & Gourmet Foods Product 18",
    "description": "High-quality grocery & gourmet foods product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Grocery & Gourmet Foods",
    "price": 12125,
    "originalPrice": 13038,
    "discount": 7,
    "images": [
      "https://picsum.photos/400/400?random=178",
      "https://picsum.photos/400/400?random=1178"
    ],
    "rating": 4.4,
    "reviews": 4198,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "179",
    "name": "Generic Brand Grocery & Gourmet Foods Product 19",
    "description": "High-quality grocery & gourmet foods product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Grocery & Gourmet Foods",
    "price": 47468,
    "originalPrice": 50498,
    "discount": 6,
    "images": [
      "https://picsum.photos/400/400?random=179",
      "https://picsum.photos/400/400?random=1179"
    ],
    "rating": 3.3,
    "reviews": 4166,
    "inStock": true,
    "prime": false,
    "freeDelivery": false,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "180",
    "name": "Generic Brand Grocery & Gourmet Foods Product 20",
    "description": "High-quality grocery & gourmet foods product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Grocery & Gourmet Foods",
    "price": 21908,
    "originalPrice": 33706,
    "discount": 35,
    "images": [
      "https://picsum.photos/400/400?random=180",
      "https://picsum.photos/400/400?random=1180"
    ],
    "rating": 4.1,
    "reviews": 1440,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "181",
    "name": "Generic Brand Health & Household Product 1",
    "description": "High-quality health & household product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Health & Household",
    "price": 30614,
    "originalPrice": 36885,
    "discount": 17,
    "images": [
      "https://picsum.photos/400/400?random=181",
      "https://picsum.photos/400/400?random=1181"
    ],
    "rating": 4.1,
    "reviews": 3340,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "182",
    "name": "Generic Brand Health & Household Product 2",
    "description": "High-quality health & household product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Health & Household",
    "price": 6794,
    "originalPrice": 11138,
    "discount": 39,
    "images": [
      "https://picsum.photos/400/400?random=182",
      "https://picsum.photos/400/400?random=1182"
    ],
    "rating": 3.1,
    "reviews": 2335,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "183",
    "name": "Generic Brand Health & Household Product 3",
    "description": "High-quality health & household product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Health & Household",
    "price": 30409,
    "originalPrice": 30409,
    "discount": 0,
    "images": [
      "https://picsum.photos/400/400?random=183",
      "https://picsum.photos/400/400?random=1183"
    ],
    "rating": 3,
    "reviews": 1768,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "184",
    "name": "Generic Brand Health & Household Product 4",
    "description": "High-quality health & household product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Health & Household",
    "price": 7836,
    "originalPrice": 17414,
    "discount": 55,
    "images": [
      "https://picsum.photos/400/400?random=184",
      "https://picsum.photos/400/400?random=1184"
    ],
    "rating": 3.3,
    "reviews": 480,
    "inStock": false,
    "prime": true,
    "freeDelivery": false,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "185",
    "name": "Generic Brand Health & Household Product 5",
    "description": "High-quality health & household product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Health & Household",
    "price": 3715,
    "originalPrice": 10041,
    "discount": 63,
    "images": [
      "https://picsum.photos/400/400?random=185",
      "https://picsum.photos/400/400?random=1185"
    ],
    "rating": 4.7,
    "reviews": 2361,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "186",
    "name": "Generic Brand Health & Household Product 6",
    "description": "High-quality health & household product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Health & Household",
    "price": 39532,
    "originalPrice": 43925,
    "discount": 10,
    "images": [
      "https://picsum.photos/400/400?random=186",
      "https://picsum.photos/400/400?random=1186"
    ],
    "rating": 3.3,
    "reviews": 4823,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "187",
    "name": "Generic Brand Health & Household Product 7",
    "description": "High-quality health & household product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Health & Household",
    "price": 36102,
    "originalPrice": 50143,
    "discount": 28,
    "images": [
      "https://picsum.photos/400/400?random=187",
      "https://picsum.photos/400/400?random=1187"
    ],
    "rating": 3.2,
    "reviews": 531,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "188",
    "name": "Generic Brand Health & Household Product 8",
    "description": "High-quality health & household product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Health & Household",
    "price": 11949,
    "originalPrice": 12712,
    "discount": 6,
    "images": [
      "https://picsum.photos/400/400?random=188",
      "https://picsum.photos/400/400?random=1188"
    ],
    "rating": 3.8,
    "reviews": 4027,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "189",
    "name": "Generic Brand Health & Household Product 9",
    "description": "High-quality health & household product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Health & Household",
    "price": 39207,
    "originalPrice": 39604,
    "discount": 1,
    "images": [
      "https://picsum.photos/400/400?random=189",
      "https://picsum.photos/400/400?random=1189"
    ],
    "rating": 3.7,
    "reviews": 4377,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "190",
    "name": "Generic Brand Health & Household Product 10",
    "description": "High-quality health & household product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Health & Household",
    "price": 5420,
    "originalPrice": 7635,
    "discount": 29,
    "images": [
      "https://picsum.photos/400/400?random=190",
      "https://picsum.photos/400/400?random=1190"
    ],
    "rating": 4.8,
    "reviews": 4763,
    "inStock": false,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "191",
    "name": "Generic Brand Health & Household Product 11",
    "description": "High-quality health & household product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Health & Household",
    "price": 11966,
    "originalPrice": 24422,
    "discount": 51,
    "images": [
      "https://picsum.photos/400/400?random=191",
      "https://picsum.photos/400/400?random=1191"
    ],
    "rating": 3.3,
    "reviews": 1961,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "192",
    "name": "Generic Brand Health & Household Product 12",
    "description": "High-quality health & household product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Health & Household",
    "price": 19199,
    "originalPrice": 33102,
    "discount": 42,
    "images": [
      "https://picsum.photos/400/400?random=192",
      "https://picsum.photos/400/400?random=1192"
    ],
    "rating": 4,
    "reviews": 3077,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "193",
    "name": "Generic Brand Health & Household Product 13",
    "description": "High-quality health & household product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Health & Household",
    "price": 14009,
    "originalPrice": 19191,
    "discount": 27,
    "images": [
      "https://picsum.photos/400/400?random=193",
      "https://picsum.photos/400/400?random=1193"
    ],
    "rating": 4.8,
    "reviews": 3756,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "194",
    "name": "Generic Brand Health & Household Product 14",
    "description": "High-quality health & household product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Health & Household",
    "price": 43321,
    "originalPrice": 49229,
    "discount": 12,
    "images": [
      "https://picsum.photos/400/400?random=194",
      "https://picsum.photos/400/400?random=1194"
    ],
    "rating": 4.2,
    "reviews": 1012,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "195",
    "name": "Generic Brand Health & Household Product 15",
    "description": "High-quality health & household product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Health & Household",
    "price": 11783,
    "originalPrice": 36824,
    "discount": 68,
    "images": [
      "https://picsum.photos/400/400?random=195",
      "https://picsum.photos/400/400?random=1195"
    ],
    "rating": 4.8,
    "reviews": 5027,
    "inStock": false,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "196",
    "name": "Generic Brand Health & Household Product 16",
    "description": "High-quality health & household product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Health & Household",
    "price": 25053,
    "originalPrice": 48180,
    "discount": 48,
    "images": [
      "https://picsum.photos/400/400?random=196",
      "https://picsum.photos/400/400?random=1196"
    ],
    "rating": 3.8,
    "reviews": 1522,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "197",
    "name": "Generic Brand Health & Household Product 17",
    "description": "High-quality health & household product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Health & Household",
    "price": 3198,
    "originalPrice": 7996,
    "discount": 60,
    "images": [
      "https://picsum.photos/400/400?random=197",
      "https://picsum.photos/400/400?random=1197"
    ],
    "rating": 3.9,
    "reviews": 990,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "198",
    "name": "Generic Brand Health & Household Product 18",
    "description": "High-quality health & household product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Health & Household",
    "price": 17719,
    "originalPrice": 28126,
    "discount": 37,
    "images": [
      "https://picsum.photos/400/400?random=198",
      "https://picsum.photos/400/400?random=1198"
    ],
    "rating": 3.8,
    "reviews": 1135,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "199",
    "name": "Generic Brand Health & Household Product 19",
    "description": "High-quality health & household product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Health & Household",
    "price": 9087,
    "originalPrice": 13171,
    "discount": 31,
    "images": [
      "https://picsum.photos/400/400?random=199",
      "https://picsum.photos/400/400?random=1199"
    ],
    "rating": 4.4,
    "reviews": 2992,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "200",
    "name": "Generic Brand Health & Household Product 20",
    "description": "High-quality health & household product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Health & Household",
    "price": 16027,
    "originalPrice": 24658,
    "discount": 35,
    "images": [
      "https://picsum.photos/400/400?random=200",
      "https://picsum.photos/400/400?random=1200"
    ],
    "rating": 3.2,
    "reviews": 3048,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "201",
    "name": "Generic Brand Car & Motorbike Product 1",
    "description": "High-quality car & motorbike product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Car & Motorbike",
    "price": 6538,
    "originalPrice": 18681,
    "discount": 65,
    "images": [
      "https://picsum.photos/400/400?random=201",
      "https://picsum.photos/400/400?random=1201"
    ],
    "rating": 4.8,
    "reviews": 2201,
    "inStock": false,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "202",
    "name": "Generic Brand Car & Motorbike Product 2",
    "description": "High-quality car & motorbike product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Car & Motorbike",
    "price": 13358,
    "originalPrice": 15533,
    "discount": 14,
    "images": [
      "https://picsum.photos/400/400?random=202",
      "https://picsum.photos/400/400?random=1202"
    ],
    "rating": 4.5,
    "reviews": 1917,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "203",
    "name": "Generic Brand Car & Motorbike Product 3",
    "description": "High-quality car & motorbike product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Car & Motorbike",
    "price": 21504,
    "originalPrice": 26881,
    "discount": 20,
    "images": [
      "https://picsum.photos/400/400?random=203",
      "https://picsum.photos/400/400?random=1203"
    ],
    "rating": 4.4,
    "reviews": 298,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "204",
    "name": "Generic Brand Car & Motorbike Product 4",
    "description": "High-quality car & motorbike product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Car & Motorbike",
    "price": 29186,
    "originalPrice": 37905,
    "discount": 23,
    "images": [
      "https://picsum.photos/400/400?random=204",
      "https://picsum.photos/400/400?random=1204"
    ],
    "rating": 4.4,
    "reviews": 4917,
    "inStock": true,
    "prime": true,
    "freeDelivery": false,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "205",
    "name": "Generic Brand Car & Motorbike Product 5",
    "description": "High-quality car & motorbike product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Car & Motorbike",
    "price": 29713,
    "originalPrice": 40704,
    "discount": 27,
    "images": [
      "https://picsum.photos/400/400?random=205",
      "https://picsum.photos/400/400?random=1205"
    ],
    "rating": 5,
    "reviews": 2977,
    "inStock": true,
    "prime": true,
    "freeDelivery": false,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "206",
    "name": "Generic Brand Car & Motorbike Product 6",
    "description": "High-quality car & motorbike product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Car & Motorbike",
    "price": 31454,
    "originalPrice": 46257,
    "discount": 32,
    "images": [
      "https://picsum.photos/400/400?random=206",
      "https://picsum.photos/400/400?random=1206"
    ],
    "rating": 3.9,
    "reviews": 2884,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "207",
    "name": "Generic Brand Car & Motorbike Product 7",
    "description": "High-quality car & motorbike product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Car & Motorbike",
    "price": 12076,
    "originalPrice": 36594,
    "discount": 67,
    "images": [
      "https://picsum.photos/400/400?random=207",
      "https://picsum.photos/400/400?random=1207"
    ],
    "rating": 4.7,
    "reviews": 2887,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "208",
    "name": "Generic Brand Car & Motorbike Product 8",
    "description": "High-quality car & motorbike product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Car & Motorbike",
    "price": 14267,
    "originalPrice": 24599,
    "discount": 42,
    "images": [
      "https://picsum.photos/400/400?random=208",
      "https://picsum.photos/400/400?random=1208"
    ],
    "rating": 4.1,
    "reviews": 949,
    "inStock": true,
    "prime": true,
    "freeDelivery": false,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "209",
    "name": "Generic Brand Car & Motorbike Product 9",
    "description": "High-quality car & motorbike product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Car & Motorbike",
    "price": 1164,
    "originalPrice": 2588,
    "discount": 55,
    "images": [
      "https://picsum.photos/400/400?random=209",
      "https://picsum.photos/400/400?random=1209"
    ],
    "rating": 3.1,
    "reviews": 3156,
    "inStock": false,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "210",
    "name": "Generic Brand Car & Motorbike Product 10",
    "description": "High-quality car & motorbike product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Car & Motorbike",
    "price": 5778,
    "originalPrice": 11113,
    "discount": 48,
    "images": [
      "https://picsum.photos/400/400?random=210",
      "https://picsum.photos/400/400?random=1210"
    ],
    "rating": 3.5,
    "reviews": 761,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "211",
    "name": "Generic Brand Car & Motorbike Product 11",
    "description": "High-quality car & motorbike product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Car & Motorbike",
    "price": 20361,
    "originalPrice": 33936,
    "discount": 40,
    "images": [
      "https://picsum.photos/400/400?random=211",
      "https://picsum.photos/400/400?random=1211"
    ],
    "rating": 5,
    "reviews": 1977,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "212",
    "name": "Generic Brand Car & Motorbike Product 12",
    "description": "High-quality car & motorbike product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Car & Motorbike",
    "price": 9285,
    "originalPrice": 22647,
    "discount": 59,
    "images": [
      "https://picsum.photos/400/400?random=212",
      "https://picsum.photos/400/400?random=1212"
    ],
    "rating": 3.6,
    "reviews": 4059,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "213",
    "name": "Generic Brand Car & Motorbike Product 13",
    "description": "High-quality car & motorbike product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Car & Motorbike",
    "price": 42829,
    "originalPrice": 49229,
    "discount": 13,
    "images": [
      "https://picsum.photos/400/400?random=213",
      "https://picsum.photos/400/400?random=1213"
    ],
    "rating": 4.6,
    "reviews": 1758,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "214",
    "name": "Generic Brand Car & Motorbike Product 14",
    "description": "High-quality car & motorbike product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Car & Motorbike",
    "price": 31925,
    "originalPrice": 49116,
    "discount": 35,
    "images": [
      "https://picsum.photos/400/400?random=214",
      "https://picsum.photos/400/400?random=1214"
    ],
    "rating": 4.5,
    "reviews": 1285,
    "inStock": false,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "215",
    "name": "Generic Brand Car & Motorbike Product 15",
    "description": "High-quality car & motorbike product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Car & Motorbike",
    "price": 11510,
    "originalPrice": 12511,
    "discount": 8,
    "images": [
      "https://picsum.photos/400/400?random=215",
      "https://picsum.photos/400/400?random=1215"
    ],
    "rating": 4.5,
    "reviews": 1222,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "216",
    "name": "Generic Brand Car & Motorbike Product 16",
    "description": "High-quality car & motorbike product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Car & Motorbike",
    "price": 22246,
    "originalPrice": 28521,
    "discount": 22,
    "images": [
      "https://picsum.photos/400/400?random=216",
      "https://picsum.photos/400/400?random=1216"
    ],
    "rating": 3.4,
    "reviews": 193,
    "inStock": true,
    "prime": true,
    "freeDelivery": false,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "217",
    "name": "Generic Brand Car & Motorbike Product 17",
    "description": "High-quality car & motorbike product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Car & Motorbike",
    "price": 15054,
    "originalPrice": 23896,
    "discount": 37,
    "images": [
      "https://picsum.photos/400/400?random=217",
      "https://picsum.photos/400/400?random=1217"
    ],
    "rating": 3.6,
    "reviews": 2070,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "218",
    "name": "Generic Brand Car & Motorbike Product 18",
    "description": "High-quality car & motorbike product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Car & Motorbike",
    "price": 7830,
    "originalPrice": 16314,
    "discount": 52,
    "images": [
      "https://picsum.photos/400/400?random=218",
      "https://picsum.photos/400/400?random=1218"
    ],
    "rating": 3.9,
    "reviews": 3228,
    "inStock": false,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "219",
    "name": "Generic Brand Car & Motorbike Product 19",
    "description": "High-quality car & motorbike product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Car & Motorbike",
    "price": 5112,
    "originalPrice": 15493,
    "discount": 67,
    "images": [
      "https://picsum.photos/400/400?random=219",
      "https://picsum.photos/400/400?random=1219"
    ],
    "rating": 4.6,
    "reviews": 2424,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "220",
    "name": "Generic Brand Car & Motorbike Product 20",
    "description": "High-quality car & motorbike product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Car & Motorbike",
    "price": 7877,
    "originalPrice": 21290,
    "discount": 63,
    "images": [
      "https://picsum.photos/400/400?random=220",
      "https://picsum.photos/400/400?random=1220"
    ],
    "rating": 3.1,
    "reviews": 3628,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "221",
    "name": "Generic Brand Baby Product 1",
    "description": "High-quality baby product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Baby",
    "price": 29099,
    "originalPrice": 37791,
    "discount": 23,
    "images": [
      "https://picsum.photos/400/400?random=221",
      "https://picsum.photos/400/400?random=1221"
    ],
    "rating": 3.5,
    "reviews": 1441,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "222",
    "name": "Generic Brand Baby Product 2",
    "description": "High-quality baby product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Baby",
    "price": 14159,
    "originalPrice": 44247,
    "discount": 68,
    "images": [
      "https://picsum.photos/400/400?random=222",
      "https://picsum.photos/400/400?random=1222"
    ],
    "rating": 3.3,
    "reviews": 1118,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "223",
    "name": "Generic Brand Baby Product 3",
    "description": "High-quality baby product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Baby",
    "price": 10719,
    "originalPrice": 20225,
    "discount": 47,
    "images": [
      "https://picsum.photos/400/400?random=223",
      "https://picsum.photos/400/400?random=1223"
    ],
    "rating": 3.9,
    "reviews": 302,
    "inStock": true,
    "prime": true,
    "freeDelivery": false,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "224",
    "name": "Generic Brand Baby Product 4",
    "description": "High-quality baby product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Baby",
    "price": 45107,
    "originalPrice": 46503,
    "discount": 3,
    "images": [
      "https://picsum.photos/400/400?random=224",
      "https://picsum.photos/400/400?random=1224"
    ],
    "rating": 3.2,
    "reviews": 985,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Blue"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "225",
    "name": "Generic Brand Baby Product 5",
    "description": "High-quality baby product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Baby",
    "price": 7183,
    "originalPrice": 8869,
    "discount": 19,
    "images": [
      "https://picsum.photos/400/400?random=225",
      "https://picsum.photos/400/400?random=1225"
    ],
    "rating": 4,
    "reviews": 2578,
    "inStock": true,
    "prime": false,
    "freeDelivery": false,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "226",
    "name": "Generic Brand Baby Product 6",
    "description": "High-quality baby product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Baby",
    "price": 32628,
    "originalPrice": 38843,
    "discount": 16,
    "images": [
      "https://picsum.photos/400/400?random=226",
      "https://picsum.photos/400/400?random=1226"
    ],
    "rating": 4.2,
    "reviews": 1394,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "227",
    "name": "Generic Brand Baby Product 7",
    "description": "High-quality baby product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Baby",
    "price": 5004,
    "originalPrice": 6950,
    "discount": 28,
    "images": [
      "https://picsum.photos/400/400?random=227",
      "https://picsum.photos/400/400?random=1227"
    ],
    "rating": 3.3,
    "reviews": 2225,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "228",
    "name": "Generic Brand Baby Product 8",
    "description": "High-quality baby product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Baby",
    "price": 30452,
    "originalPrice": 30452,
    "discount": 0,
    "images": [
      "https://picsum.photos/400/400?random=228",
      "https://picsum.photos/400/400?random=1228"
    ],
    "rating": 3.8,
    "reviews": 4992,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "229",
    "name": "Generic Brand Baby Product 9",
    "description": "High-quality baby product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Baby",
    "price": 46371,
    "originalPrice": 49862,
    "discount": 7,
    "images": [
      "https://picsum.photos/400/400?random=229",
      "https://picsum.photos/400/400?random=1229"
    ],
    "rating": 3.1,
    "reviews": 3770,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "230",
    "name": "Generic Brand Baby Product 10",
    "description": "High-quality baby product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Baby",
    "price": 5484,
    "originalPrice": 13376,
    "discount": 59,
    "images": [
      "https://picsum.photos/400/400?random=230",
      "https://picsum.photos/400/400?random=1230"
    ],
    "rating": 4.6,
    "reviews": 1720,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "231",
    "name": "Generic Brand Baby Product 11",
    "description": "High-quality baby product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Baby",
    "price": 14106,
    "originalPrice": 31348,
    "discount": 55,
    "images": [
      "https://picsum.photos/400/400?random=231",
      "https://picsum.photos/400/400?random=1231"
    ],
    "rating": 3.7,
    "reviews": 1533,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "232",
    "name": "Generic Brand Baby Product 12",
    "description": "High-quality baby product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Baby",
    "price": 21242,
    "originalPrice": 46179,
    "discount": 54,
    "images": [
      "https://picsum.photos/400/400?random=232",
      "https://picsum.photos/400/400?random=1232"
    ],
    "rating": 5,
    "reviews": 410,
    "inStock": true,
    "prime": true,
    "freeDelivery": false,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "233",
    "name": "Generic Brand Baby Product 13",
    "description": "High-quality baby product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Baby",
    "price": 10669,
    "originalPrice": 34417,
    "discount": 69,
    "images": [
      "https://picsum.photos/400/400?random=233",
      "https://picsum.photos/400/400?random=1233"
    ],
    "rating": 4.9,
    "reviews": 4334,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "234",
    "name": "Generic Brand Baby Product 14",
    "description": "High-quality baby product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Baby",
    "price": 15097,
    "originalPrice": 48702,
    "discount": 69,
    "images": [
      "https://picsum.photos/400/400?random=234",
      "https://picsum.photos/400/400?random=1234"
    ],
    "rating": 4.3,
    "reviews": 3556,
    "inStock": true,
    "prime": false,
    "freeDelivery": false,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "235",
    "name": "Generic Brand Baby Product 15",
    "description": "High-quality baby product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Baby",
    "price": 13797,
    "originalPrice": 25550,
    "discount": 46,
    "images": [
      "https://picsum.photos/400/400?random=235",
      "https://picsum.photos/400/400?random=1235"
    ],
    "rating": 3.5,
    "reviews": 4261,
    "inStock": true,
    "prime": false,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "236",
    "name": "Generic Brand Baby Product 16",
    "description": "High-quality baby product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Baby",
    "price": 22570,
    "originalPrice": 46063,
    "discount": 51,
    "images": [
      "https://picsum.photos/400/400?random=236",
      "https://picsum.photos/400/400?random=1236"
    ],
    "rating": 3.7,
    "reviews": 2285,
    "inStock": true,
    "prime": true,
    "freeDelivery": false,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "237",
    "name": "Generic Brand Baby Product 17",
    "description": "High-quality baby product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Baby",
    "price": 21877,
    "originalPrice": 39067,
    "discount": 44,
    "images": [
      "https://picsum.photos/400/400?random=237",
      "https://picsum.photos/400/400?random=1237"
    ],
    "rating": 3.9,
    "reviews": 1915,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Black"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "238",
    "name": "Generic Brand Baby Product 18",
    "description": "High-quality baby product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Baby",
    "price": 20185,
    "originalPrice": 46942,
    "discount": 57,
    "images": [
      "https://picsum.photos/400/400?random=238",
      "https://picsum.photos/400/400?random=1238"
    ],
    "rating": 3.3,
    "reviews": 3971,
    "inStock": true,
    "prime": true,
    "freeDelivery": false,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "239",
    "name": "Generic Brand Baby Product 19",
    "description": "High-quality baby product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Baby",
    "price": 4461,
    "originalPrice": 8922,
    "discount": 50,
    "images": [
      "https://picsum.photos/400/400?random=239",
      "https://picsum.photos/400/400?random=1239"
    ],
    "rating": 3.5,
    "reviews": 1386,
    "inStock": true,
    "prime": true,
    "freeDelivery": true,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "Red"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  },
  {
    "id": "240",
    "name": "Generic Brand Baby Product 20",
    "description": "High-quality baby product from Generic Brand. Features advanced technology and premium build quality.",
    "brand": "Generic Brand",
    "category": "Baby",
    "price": 24659,
    "originalPrice": 26234,
    "discount": 6,
    "images": [
      "https://picsum.photos/400/400?random=240",
      "https://picsum.photos/400/400?random=1240"
    ],
    "rating": 4.2,
    "reviews": 953,
    "inStock": true,
    "prime": true,
    "freeDelivery": false,
    "specifications": {
      "Material": "Premium Quality",
      "Warranty": "1 Year",
      "Color": "White"
    },
    "features": [
      "High Quality Build",
      "Latest Technology",
      "User Friendly Design",
      "Durable Construction"
    ],
    "seller": "Generic Brand Official Store",
    "warranty": "1 Year Manufacturer Warranty"
  }
];

const categories = [
  { id: '1', name: 'Mobiles', slug: 'mobiles' },
  { id: '2', name: 'Electronics', slug: 'electronics' },
  { id: '3', name: 'Fashion', slug: 'fashion' },
  { id: '4', name: 'Home & Kitchen', slug: 'home-kitchen' },
  { id: '5', name: 'Beauty & Personal Care', slug: 'beauty' },
  { id: '6', name: 'Books', slug: 'books' },
  { id: '7', name: 'Sports, Fitness & Outdoors', slug: 'sports' },
  { id: '8', name: 'Toys & Games', slug: 'toys' },
  { id: '9', name: 'Grocery & Gourmet Foods', slug: 'grocery' },
  { id: '10', name: 'Health & Household', slug: 'health' },
  { id: '11', name: 'Car & Motorbike', slug: 'automotive' },
  { id: '12', name: 'Baby', slug: 'baby' }
];

const banners = [
  {
    id: '1', title: 'Great Indian Festival', subtitle: 'Up to 80% off on everything',
    image: 'https://images-eu.ssl-images-amazon.com/images/G/31/img22/Wireless/devjyoti/GW/Uber/Nov/D103625178_DesktopTallHero_3000x1200.jpg',
    cta: 'Shop Now', link: '/festival-sale', active: true
  },
  {
    id: '2', title: 'Prime Day Special', subtitle: 'Exclusive deals for Prime members',
    image: 'https://images-eu.ssl-images-amazon.com/images/G/31/prime/PrimeDay/2023/GW/PD23_GW_PC_Hero_NTA_2x._CB595001705_.jpg',
    cta: 'Shop Prime Deals', link: '/prime-deals', active: true
  }
];

const users = [
  {
    id: '1', name: 'Rajesh Kumar', email: 'rajesh@example.com', password: 'password123',
    phone: '+91-9876543210', prime: true
  }
];

let cartItems = [];
let wishlistItems = [];
let orders = [
  {
    "id": "1",
    "orderNumber": "AMZ1764855681878",
    "userId": "1",
    "items": [
      {
        "productId": "30",
        "name": "Sample Product 1",
        "price": 4355,
        "quantity": 2
      }
    ],
    "status": "delivered",
    "total": 8021,
    "createdAt": "2025-11-29T22:36:09.796Z",
    "estimatedDelivery": "2025-12-05T03:44:15.895Z"
  },
  {
    "id": "2",
    "orderNumber": "AMZ1764855681882",
    "userId": "1",
    "items": [
      {
        "productId": "34",
        "name": "Sample Product 2",
        "price": 516,
        "quantity": 3
      }
    ],
    "status": "shipped",
    "total": 11386,
    "createdAt": "2025-12-01T12:43:13.899Z",
    "estimatedDelivery": "2025-12-07T01:11:46.509Z"
  },
  {
    "id": "3",
    "orderNumber": "AMZ1764855681883",
    "userId": "1",
    "items": [
      {
        "productId": "13",
        "name": "Sample Product 3",
        "price": 3343,
        "quantity": 2
      }
    ],
    "status": "processing",
    "total": 14269,
    "createdAt": "2025-12-02T11:35:16.872Z",
    "estimatedDelivery": "2025-12-08T02:40:18.380Z"
  },
  {
    "id": "4",
    "orderNumber": "AMZ1764855681884",
    "userId": "1",
    "items": [
      {
        "productId": "14",
        "name": "Sample Product 4",
        "price": 4970,
        "quantity": 3
      }
    ],
    "status": "delivered",
    "total": 7454,
    "createdAt": "2025-11-10T01:59:28.949Z",
    "estimatedDelivery": "2025-12-06T02:22:47.427Z"
  },
  {
    "id": "5",
    "orderNumber": "AMZ1764855681885",
    "userId": "1",
    "items": [
      {
        "productId": "28",
        "name": "Sample Product 5",
        "price": 7746,
        "quantity": 1
      }
    ],
    "status": "confirmed",
    "total": 10172,
    "createdAt": "2025-11-09T12:06:43.935Z",
    "estimatedDelivery": "2025-12-10T15:04:11.374Z"
  },
  {
    "id": "6",
    "orderNumber": "AMZ1764855681886",
    "userId": "1",
    "items": [
      {
        "productId": "40",
        "name": "Sample Product 6",
        "price": 4746,
        "quantity": 3
      }
    ],
    "status": "confirmed",
    "total": 2877,
    "createdAt": "2025-12-02T01:47:38.409Z",
    "estimatedDelivery": "2025-12-05T16:16:57.355Z"
  },
  {
    "id": "7",
    "orderNumber": "AMZ1764855681887",
    "userId": "1",
    "items": [
      {
        "productId": "6",
        "name": "Sample Product 7",
        "price": 8236,
        "quantity": 1
      }
    ],
    "status": "confirmed",
    "total": 7425,
    "createdAt": "2025-11-30T14:54:12.773Z",
    "estimatedDelivery": "2025-12-09T07:34:23.581Z"
  },
  {
    "id": "8",
    "orderNumber": "AMZ1764855681889",
    "userId": "1",
    "items": [
      {
        "productId": "27",
        "name": "Sample Product 8",
        "price": 4996,
        "quantity": 3
      }
    ],
    "status": "delivered",
    "total": 13168,
    "createdAt": "2025-11-09T16:58:50.962Z",
    "estimatedDelivery": "2025-12-10T11:23:18.305Z"
  },
  {
    "id": "9",
    "orderNumber": "AMZ1764855681890",
    "userId": "1",
    "items": [
      {
        "productId": "26",
        "name": "Sample Product 9",
        "price": 9735,
        "quantity": 3
      }
    ],
    "status": "confirmed",
    "total": 6148,
    "createdAt": "2025-11-08T01:23:24.881Z",
    "estimatedDelivery": "2025-12-07T10:31:56.037Z"
  },
  {
    "id": "10",
    "orderNumber": "AMZ1764855681891",
    "userId": "1",
    "items": [
      {
        "productId": "44",
        "name": "Sample Product 10",
        "price": 6240,
        "quantity": 1
      }
    ],
    "status": "delivered",
    "total": 8767,
    "createdAt": "2025-11-11T21:36:03.235Z",
    "estimatedDelivery": "2025-12-08T14:00:11.332Z"
  }
];

// AUTHENTICATION ROUTES
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
  
  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        prime: user.prime
      },
      token: 'jwt-token-' + Date.now()
    }
  });
});

// PRODUCT ROUTES
app.get('/api/products', (req, res) => {
  const { category, search, brand, minPrice, maxPrice, rating, sort, page = 1, limit = 20 } = req.query;
  let filteredProducts = [...products];
  
  // Filter by category
  if (category && category !== 'all') {
    filteredProducts = filteredProducts.filter(p => 
      p.category.toLowerCase().includes(category.toLowerCase())
    );
  }
  
  // Search filter
  if (search) {
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  // Brand filter
  if (brand) {
    filteredProducts = filteredProducts.filter(p => 
      p.brand.toLowerCase() === brand.toLowerCase()
    );
  }
  
  // Price filter
  if (minPrice) {
    filteredProducts = filteredProducts.filter(p => p.price >= parseInt(minPrice));
  }
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(p => p.price <= parseInt(maxPrice));
  }
  
  // Rating filter
  if (rating) {
    filteredProducts = filteredProducts.filter(p => p.rating >= parseFloat(rating));
  }
  
  // Sorting
  if (sort) {
    switch (sort) {
      case 'price-low':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filteredProducts.sort((a, b) => b.id - a.id);
        break;
      case 'popularity':
        filteredProducts.sort((a, b) => b.reviews - a.reviews);
        break;
    }
  }
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    data: paginatedProducts,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredProducts.length,
      pages: Math.ceil(filteredProducts.length / limit)
    },
    filters: {
      brands: [...new Set(products.map(p => p.brand))],
      categories: [...new Set(products.map(p => p.category))],
      priceRange: {
        min: Math.min(...products.map(p => p.price)),
        max: Math.max(...products.map(p => p.price))
      }
    }
  });
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }
  
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  
  res.json({
    success: true,
    data: {
      ...product,
      relatedProducts
    }
  });
});

// CATEGORY ROUTES
app.get('/api/categories', (req, res) => {
  res.json({
    success: true,
    data: categories
  });
});

// DEALS ROUTES
app.get('/api/deals', (req, res) => {
  const deals = products
    .filter(p => p.discount > 20)
    .slice(0, 8)
    .map(p => ({
      ...p,
      timeLeft: '23:45:30'
    }));
  
  res.json({
    success: true,
    data: deals
  });
});

// BANNER ROUTES
app.get('/api/banners', (req, res) => {
  res.json({
    success: true,
    data: banners.filter(b => b.active)
  });
});

// SEARCH ROUTES
app.get('/api/search/suggestions', (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.json({ success: true, data: [] });
  }
  
  const suggestions = products
    .filter(p => p.name.toLowerCase().includes(q.toLowerCase()))
    .slice(0, 8)
    .map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      image: p.images[0]
    }));
  
  res.json({
    success: true,
    data: suggestions
  });
});

// CART ROUTES
app.get('/api/cart', (req, res) => {
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = cartItems.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    if (product && product.originalPrice > product.price) {
      return sum + ((product.originalPrice - product.price) * item.quantity);
    }
    return sum;
  }, 0);
  
  res.json({
    success: true,
    data: {
      items: cartItems,
      total: parseFloat(total.toFixed(2)),
      savings: parseFloat(savings.toFixed(2)),
      count: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      deliveryFee: total > 499 ? 0 : 40
    }
  });
});

app.post('/api/cart/add', (req, res) => {
  const { productId, quantity = 1 } = req.body;
  
  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }
  
  const existingItem = cartItems.find(item => item.productId === productId);
  
  if (existingItem) {
    existingItem.quantity += parseInt(quantity);
  } else {
    cartItems.push({
      id: Date.now().toString(),
      productId,
      quantity: parseInt(quantity),
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      brand: product.brand,
      inStock: product.inStock
    });
  }
  
  res.json({
    success: true,
    message: 'Added to cart'
  });
});

// WISHLIST ROUTES
app.get('/api/wishlist', (req, res) => {
  const wishlistProducts = wishlistItems.map(item => {
    const product = products.find(p => p.id === item.productId);
    return product;
  }).filter(Boolean);
  
  res.json({
    success: true,
    data: wishlistProducts
  });
});

app.post('/api/wishlist/add', (req, res) => {
  const { productId } = req.body;
  
  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }
  
  const exists = wishlistItems.find(item => item.productId === productId);
  if (!exists) {
    wishlistItems.push({
      id: Date.now().toString(),
      productId,
      addedAt: new Date().toISOString()
    });
  }
  
  res.json({
    success: true,
    message: 'Added to wishlist'
  });
});

// ORDER ROUTES
app.get('/api/orders', (req, res) => {
  const { userId } = req.query;
  let userOrders = orders;
  
  if (userId) {
    userOrders = orders.filter(order => order.userId === userId);
  }
  
  res.json({
    success: true,
    data: userOrders
  });
});

app.post('/api/orders', (req, res) => {
  const newOrder = {
    id: Date.now().toString(),
    orderNumber: 'AMZ' + Date.now(),
    ...req.body,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };
  
  orders.push(newOrder);
  
  res.json({
    success: true,
    data: newOrder,
    message: 'Order placed successfully'
  });
});

// Start server

// Simple test users
const testUsers = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', password: 'admin123', role: 'admin' },
  { id: '2', name: 'Test User', email: 'test@example.com', password: 'test123', role: 'user' }
];

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = testUsers.find(u => u.email === email && u.password === password);
  
  if (user) {
    res.json({
      success: true,
      message: 'Login successful',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token: `token_${user.id}_${Date.now()}`
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  const existing = testUsers.find(u => u.email === email);
  
  if (existing) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }
  
  const newUser = { id: String(testUsers.length + 1), name, email, password, role: 'user' };
  testUsers.push(newUser);
  
  res.json({
    success: true,
    message: 'Registration successful',
    user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
    token: `token_${newUser.id}_${Date.now()}`
  });
});

app.listen(PORT, () => {
  console.log(`✅ Amazon India Replica API running on http://localhost:${PORT}`);
  console.log(`📱 Products: http://localhost:${PORT}/api/products`);
  console.log(`🛒 Cart: http://localhost:${PORT}/api/cart`);
  console.log(`❤️  Wishlist: http://localhost:${PORT}/api/wishlist`);
  console.log(`🏷️  Deals: http://localhost:${PORT}/api/deals`);
  console.log(`📦 Orders: http://localhost:${PORT}/api/orders`);
  console.log(`🔍 Search: http://localhost:${PORT}/api/search/suggestions`);
  console.log('');
  console.log('🎉 Amazon India Replica is ready!');
  console.log('📊 Database contains:');
  console.log(`   - ${products.length} products across ${categories.length} categories`);
  console.log(`   - ${orders.length} sample orders`);
  console.log(`   - ${users.length} sample users`);
});

module.exports = app;
