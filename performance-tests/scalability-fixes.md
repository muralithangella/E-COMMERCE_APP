# Critical Scalability Fixes

## 1. Categories API Issues (URGENT)

### Problem: 1025ms latency, 15 errors
### Root Causes:
- Database connection issues
- Missing indexes
- No caching
- Inefficient queries

### Fixes:
```javascript
// Add to products service
app.get('/api/categories', cache(300), async (req, res) => {
  try {
    const categories = await Category.find({})
      .select('name slug image description')
      .lean()
      .limit(20);
    res.json({ data: categories });
  } catch (error) {
    res.status(500).json({ error: 'Categories unavailable' });
  }
});
```

## 2. Database Optimization
```javascript
// Add indexes
db.categories.createIndex({ "name": 1 })
db.categories.createIndex({ "slug": 1 })
db.products.createIndex({ "category": 1, "status": 1 })
```

## 3. Connection Pooling
```javascript
mongoose.connect(uri, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferCommands: false,
  bufferMaxEntries: 0
});
```

## Scalability Targets:
- Latency: <200ms avg, <500ms p99
- Throughput: >2000 req/sec
- Error Rate: <0.1%
- Handle 1000+ concurrent users