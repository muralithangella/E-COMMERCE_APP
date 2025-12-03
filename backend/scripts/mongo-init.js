// MongoDB initialization script for local testing
print('Starting MongoDB initialization...');

// Switch to admin database
db = db.getSiblingDB('admin');

// Create application user
db.createUser({
  user: 'ecommerce_user',
  pwd: 'ecommerce_password',
  roles: [
    { role: 'readWrite', db: 'ecommerce_products' },
    { role: 'readWrite', db: 'ecommerce_orders' },
    { role: 'readWrite', db: 'ecommerce_users' },
    { role: 'readWrite', db: 'ecommerce_inventory' },
    { role: 'readWrite', db: 'ecommerce_payments' },
    { role: 'readWrite', db: 'ecommerce_notifications' }
  ]
});

// Create databases and collections
const databases = [
  'ecommerce_products',
  'ecommerce_orders', 
  'ecommerce_users',
  'ecommerce_inventory',
  'ecommerce_payments',
  'ecommerce_notifications'
];

databases.forEach(dbName => {
  const targetDb = db.getSiblingDB(dbName);
  
  // Create a dummy collection to initialize the database
  targetDb.createCollection('_init');
  targetDb._init.insertOne({ initialized: true, createdAt: new Date() });
  
  print(`Database ${dbName} initialized`);
});

// Initialize replica set (this will be run after all containers are up)
print('MongoDB initialization completed');