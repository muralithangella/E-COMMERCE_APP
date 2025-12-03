const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const createCloudinaryStorage = (folder) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `ecommerce/${folder}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 1000, height: 1000, crop: 'limit', quality: 'auto' }]
    }
  });
};

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, JPG, PNG, WebP) are allowed'));
  }
};

const createUploadMiddleware = (folder, maxFiles = 1) => {
  const storage = createCloudinaryStorage(folder);
  
  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
      files: maxFiles
    }
  });

  return maxFiles === 1 ? upload.single('image') : upload.array('images', maxFiles);
};

const uploadProductImages = createUploadMiddleware('products', 5);
const uploadCategoryImage = createUploadMiddleware('categories', 1);
const uploadUserAvatar = createUploadMiddleware('users', 1);
const uploadReviewImages = createUploadMiddleware('reviews', 3);

const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary deletion error:', error);
    throw error;
  }
};

const extractPublicId = (url) => {
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  return filename.split('.')[0];
};

const optimizeImage = async (publicId, options = {}) => {
  try {
    const defaultOptions = {
      quality: 'auto',
      fetch_format: 'auto',
      ...options
    };
    
    return cloudinary.url(publicId, defaultOptions);
  } catch (error) {
    console.error('Image optimization error:', error);
    throw error;
  }
};

const generateImageVariants = async (publicId) => {
  const variants = {
    thumbnail: cloudinary.url(publicId, { width: 150, height: 150, crop: 'fill' }),
    medium: cloudinary.url(publicId, { width: 500, height: 500, crop: 'limit' }),
    large: cloudinary.url(publicId, { width: 1000, height: 1000, crop: 'limit' })
  };
  
  return variants;
};

module.exports = {
  uploadProductImages,
  uploadCategoryImage,
  uploadUserAvatar,
  uploadReviewImages,
  deleteFromCloudinary,
  extractPublicId,
  optimizeImage,
  generateImageVariants,
  createUploadMiddleware
};