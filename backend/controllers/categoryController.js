const mockCategories = [
  {
    _id: 'electronics',
    name: 'Electronics',
    image: 'https://via.placeholder.com/200x150/2c3e50/FFFFFF?text=Electronics'
  },
  {
    _id: 'fashion',
    name: 'Fashion',
    image: 'https://via.placeholder.com/200x150/e74c3c/FFFFFF?text=Fashion'
  },
  {
    _id: 'home-kitchen',
    name: 'Home & Kitchen',
    image: 'https://via.placeholder.com/200x150/27ae60/FFFFFF?text=Home+Kitchen'
  },
  {
    _id: 'sports',
    name: 'Sports',
    image: 'https://via.placeholder.com/200x150/f39c12/FFFFFF?text=Sports'
  },
  {
    _id: 'books',
    name: 'Books',
    image: 'https://via.placeholder.com/200x150/9b59b6/FFFFFF?text=Books'
  },
  {
    _id: 'beauty',
    name: 'Beauty',
    image: 'https://via.placeholder.com/200x150/e91e63/FFFFFF?text=Beauty'
  }
];

const getCategories = async (req, res) => {
  try {
    const startTime = Date.now();
    
    // Add caching headers
    res.set({
      'Cache-Control': 'public, max-age=300',
      'ETag': `"categories-${Date.now()}"`
    });
    
    const responseTime = Date.now() - startTime;
    
    res.json({
      data: mockCategories,
      total: mockCategories.length,
      responseTime: `${responseTime}ms`
    });
  } catch (error) {
    res.status(500).json({ error: 'Categories unavailable' });
  }
};

module.exports = {
  getCategories
};