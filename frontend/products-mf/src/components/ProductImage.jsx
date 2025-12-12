import React, { useState } from 'react';

const ProductImage = ({ product, className = '' }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const getImageSrc = () => {
    if (imageError) {
      return `https://via.placeholder.com/300x300/f0f0f0/666666?text=${encodeURIComponent(product.name.substring(0, 20))}`;
    }
    
    return product.image || 
           product.images?.[0]?.url || 
           product.images?.[0] || 
           `https://picsum.photos/300/300?random=${product.id || product._id}`;
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <div className={`product-image-container ${className}`}>
      {imageLoading && !imageError && (
        <div className="image-loading">
          <div className="loading-spinner"></div>
        </div>
      )}
      <img 
        src={getImageSrc()}
        alt={product.name}
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={{ 
          display: imageLoading && !imageError ? 'none' : 'block',
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
      />
    </div>
  );
};

export default ProductImage;