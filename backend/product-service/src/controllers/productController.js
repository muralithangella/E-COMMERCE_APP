const Product = require('../models/product');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/imageUpload');

exports.getProducts = async (req, res) => {
  try {
    const { category, search, brand, minPrice, maxPrice, rating, sort, page = 1, limit = 16 } = req.query;
    
    // Input validation
    const sanitizedPage = Math.max(1, parseInt(page) || 1);
    const sanitizedLimit = Math.min(100, Math.max(1, parseInt(limit) || 16));
    
    let query = { isActive: true };
    
    if (category && category !== 'all') {
      query.category = new RegExp(category, 'i');
    }
    
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { brand: new RegExp(search, 'i') }
      ];
    }
    
    if (brand) {
      query.brand = new RegExp(brand, 'i');
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    if (rating) {
      query['rating.average'] = { $gte: parseFloat(rating) };
    }
    
    let sortQuery = {};
    switch (sort) {
      case 'price-asc':
      case 'price-low':
        sortQuery = { price: 1 };
        break;
      case 'price-desc':
      case 'price-high':
        sortQuery = { price: -1 };
        break;
      case 'rating':
        sortQuery = { 'rating.average': -1 };
        break;
      case 'popularity':
        sortQuery = { 'rating.count': -1 };
        break;
      case 'discount':
        sortQuery = { discount: -1 };
        break;
      case 'newest':
        sortQuery = { createdAt: -1 };
        break;
      case 'name-asc':
        sortQuery = { name: 1 };
        break;
      case 'name-desc':
        sortQuery = { name: -1 };
        break;
      default:
        sortQuery = { createdAt: -1 };
    }
    
    const skip = (sanitizedPage - 1) * sanitizedLimit;
    
    const [products, total] = await Promise.all([
      Product.find(query)
        .select('+images')
        .sort(sortQuery)
        .skip(skip)
        .limit(sanitizedLimit)
        .lean(),
      Product.countDocuments(query)
    ]);
    
    console.log('First product from DB:', JSON.stringify(products[0], null, 2));
    console.log('First product has images:', products[0]?.images);
    
    const pages = Math.ceil(total / sanitizedLimit);
    
    res.json({
      success: true,
      data: products,
      pagination: {
        page: sanitizedPage,
        limit: sanitizedLimit,
        total,
        pages
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products', error: error.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch product', error: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category', { isActive: true });
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch categories', error: error.message });
  }
};

exports.uploadProductImages = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer, 'products'));
    const results = await Promise.all(uploadPromises);

    const images = results.map((result, index) => ({
      url: result.secure_url,
      publicId: result.public_id,
      isPrimary: index === 0 && product.images.length === 0
    }));

    product.images.push(...images);
    await product.save();

    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ success: false, message: 'Failed to upload images', error: error.message });
  }
};

exports.deleteProductImage = async (req, res) => {
  try {
    const { id, imageId } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const image = product.images.id(imageId);
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    await deleteFromCloudinary(image.publicId);
    product.images.pull(imageId);
    await product.save();

    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ success: false, message: 'Failed to delete image', error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, message: 'Failed to create product', error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, message: 'Failed to update product', error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const deletePromises = product.images.map(img => deleteFromCloudinary(img.publicId));
    await Promise.all(deletePromises);

    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product and images deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, message: 'Failed to delete product', error: error.message });
  }
};
