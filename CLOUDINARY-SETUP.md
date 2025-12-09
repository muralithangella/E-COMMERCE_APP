# Cloudinary Image Management Setup

## ✅ Implementation Complete

### Features
- ✅ Images stored in Cloudinary (not DB)
- ✅ Metadata (URL, publicId) stored in MongoDB
- ✅ Auto-delete from Cloudinary when product deleted
- ✅ Multi-image upload support (up to 5 images)
- ✅ Primary image designation
- ✅ 5MB file size limit

## Configuration

### Environment Variables (.env)
```env
CLOUDINARY_CLOUD_NAME=djoxvhddm
CLOUDINARY_API_KEY=567492534165198
CLOUDINARY_API_SECRET=khtxWIDz81DdoY9ASD7pmMoMDuA
```

## Product Schema

```javascript
images: [{
  url: String,        // Cloudinary secure URL
  publicId: String,   // Cloudinary public ID for deletion
  isPrimary: Boolean  // Primary product image
}]
```

## API Endpoints

### Upload Images
```
POST /api/products/:id/images
Content-Type: multipart/form-data
Body: images[] (up to 5 files)
```

### Delete Image
```
DELETE /api/products/:id/images/:imageId
```
- Deletes from Cloudinary
- Removes metadata from DB

### Delete Product
```
DELETE /api/products/:id
```
- Deletes all product images from Cloudinary
- Deletes product from DB

### Create Product
```
POST /api/products
Body: { name, description, price, category, brand, sku, inventory }
```

### Update Product
```
PUT /api/products/:id
Body: { ...fields to update }
```

## Setup Steps

### 1. Install Dependencies
```bash
cd backend/product-service
npm install
```

### 2. Seed Products with Images
```bash
cd backend/product-service
node seed-with-cloudinary.js
```

This will:
- Clear existing products
- Upload sample images to Cloudinary
- Create products with image metadata

### 3. Test Image Upload
```bash
curl -X POST https://localhost:8080/api/products/{productId}/images \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg"
```

## Frontend Integration

ProductCard component automatically displays:
- Primary image from `product.images[0].url`
- Fallback to placeholder if no image
- Error handling with placeholder

## Image Flow

### Upload Flow
1. Client uploads image(s) via multipart/form-data
2. Multer receives file in memory
3. File buffer sent to Cloudinary
4. Cloudinary returns secure_url and public_id
5. Metadata saved to MongoDB

### Delete Flow
1. Client requests image deletion
2. Backend fetches publicId from DB
3. Cloudinary deletes image using publicId
4. Metadata removed from MongoDB

### Product Delete Flow
1. Client requests product deletion
2. Backend fetches all image publicIds
3. All images deleted from Cloudinary in parallel
4. Product deleted from MongoDB

## Cloudinary Dashboard

Access: https://cloudinary.com/console

- View all uploaded images
- Monitor storage usage
- Check transformations
- View API usage

## File Structure

```
backend/product-service/
├── src/
│   ├── config/
│   │   └── cloudinary.js          # Cloudinary config
│   ├── utils/
│   │   └── imageUpload.js         # Upload/delete utilities
│   ├── models/
│   │   └── product.js             # Product schema with images
│   ├── controllers/
│   │   └── productController.js   # Image CRUD operations
│   └── routes/
│       └── productRoutes.js       # Image routes
└── seed-with-cloudinary.js        # Seed script
```

## Testing

### 1. Check Products Have Images
```bash
curl https://localhost:8080/api/products
```

Response should include:
```json
{
  "images": [
    {
      "url": "https://res.cloudinary.com/djoxvhddm/image/upload/v1234/products/xyz.jpg",
      "publicId": "products/xyz",
      "isPrimary": true
    }
  ]
}
```

### 2. Upload New Image
Use Postman or curl with multipart form data

### 3. Delete Image
```bash
curl -X DELETE https://localhost:8080/api/products/{productId}/images/{imageId}
```

### 4. Verify Cloudinary
- Login to Cloudinary dashboard
- Check "products" folder
- Verify images are uploaded/deleted

## Notes

- Images stored in "products" folder in Cloudinary
- Max 5 images per upload request
- 5MB file size limit per image
- Supported formats: jpg, png, gif, webp
- Images auto-optimized by Cloudinary
- Secure HTTPS URLs
- CDN delivery for fast loading

## Troubleshooting

### Images not uploading
- Check Cloudinary credentials in .env
- Verify file size < 5MB
- Check network connectivity

### Images not deleting
- Verify publicId is correct
- Check Cloudinary API permissions
- Review error logs

### Frontend not showing images
- Check product has images array
- Verify URL is accessible
- Check CORS settings
