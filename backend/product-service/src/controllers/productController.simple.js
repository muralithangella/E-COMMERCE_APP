const { products } = require('../data/products');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/imageUpload');

exports.getProducts = async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 16 } = req.query;
    
    let filtered = products.filter(p => p.isActive);
    
    if (category && category !== 'all') {
      filtered = filtered.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
    }
    
    if (search) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') filtered.sort((a, b) => b.rating.average - a.rating.average);
    
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + parseInt(limit));
    
    res.json({
      success: true,
      data: paginated,
      pagination: { page: parseInt(page), limit: parseInt(limit), total: filtered.length, pages: Math.ceil(filtered.length / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
};

exports.getProduct = async (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, data: product });
};

exports.getCategories = async (req, res) => {
  const categories = [...new Set(products.map(p => p.category))];
  res.json({ success: true, data: categories });
};

exports.uploadProductImages = async (req, res) => {
  try {
    const product = products.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer, 'products'));
    const results = await Promise.all(uploadPromises);

    const images = results.map((result, index) => ({
      url: result.secure_url,
      publicId: result.public_id,
      isPrimary: index === 0 && product.images.length === 0
    }));

    product.images.push(...images);
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to upload images' });
  }
};

exports.deleteProductImage = async (req, res) => {
  try {
    const product = products.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const imageIndex = product.images.findIndex(img => img.publicId === req.params.imageId);
    if (imageIndex === -1) return res.status(404).json({ success: false, message: 'Image not found' });

    await deleteFromCloudinary(product.images[imageIndex].publicId);
    product.images.splice(imageIndex, 1);

    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete image' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Product not found' });

    const deletePromises = products[index].images.map(img => deleteFromCloudinary(img.publicId));
    await Promise.all(deletePromises);

    products.splice(index, 1);
    res.json({ success: true, message: 'Product and images deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
};

exports.createProduct = async (req, res) => {
  const product = { id: Date.now().toString(), ...req.body, images: [], isActive: true };
  products.push(product);
  res.status(201).json({ success: true, data: product });
};

exports.updateProduct = async (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  Object.assign(product, req.body);
  res.json({ success: true, data: product });
};
