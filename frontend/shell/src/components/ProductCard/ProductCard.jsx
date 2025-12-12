import React from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { addToCart } from '../../store/slices/secureCartSlice';
import ProductService from '../../services/productService';
import './ProductCard.css';

const ProductCard = ({ product, onProductClick, size = 'medium' }) => {
  const dispatch = useDispatch();
  
  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!product) return;
    
    dispatch(addToCart({
      productId: product.id || product._id,
      name: product.name || 'Product',
      price: product.price || 0,
      image: product.images?.[0]?.url || product.image,
      quantity: 1
    }));
    toast.success(`${product.name || 'Product'} added to cart!`);
  };

  const handleProductClick = () => {
    if (onProductClick && product) {
      onProductClick(product.id || product._id);
    }
  };

  if (!product) {
    return null;
  }

  return (
    <div 
      className={`product-card ${size}`}
      onClick={handleProductClick}
    >
      <div className="product-image-container">
        <div className={`product-image-wrapper ${size}`}>
          <img
            src={product.images?.[0]?.url || product.image || `https://via.placeholder.com/300x300/F0F0F0/999999?text=${encodeURIComponent(product.name?.substring(0, 15) || 'Product')}`}
            alt={product.name}
            className="product-image"
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/300x300/F0F0F0/999999?text=${encodeURIComponent(product.name?.substring(0, 15) || 'Product')}`;
            }}
          />
        </div>
        
        {product.discount > 0 && (
          <div className="discount-badge">
            -{product.discount}%
          </div>
        )}
      </div>
      
      <div className="product-info">
        <h3 className={`product-title ${size}`}>
          {product.name || 'Product Name'}
        </h3>
      </div>
      
      {product.rating && (
        <div className="product-rating">
          <div className="rating-stars">
            {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
          </div>
          <span className="rating-count">
            ({(product.reviews || 0).toLocaleString()})
          </span>
        </div>
      )}
      
      <div className="product-pricing">
        <div className="price-container">
          <span className={`current-price ${size}`}>
            {ProductService.formatPrice(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="original-price">
              {ProductService.formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        {product.freeDelivery && (
          <div className="delivery-info free-delivery">
            FREE Delivery
          </div>
        )}
        {product.prime && (
          <div className="delivery-info prime-eligible">
            Prime Eligible
          </div>
        )}
      </div>
      
      <button
        onClick={handleAddToCart}
        className={`add-to-cart-btn ${size}`}
      >
        Add to cart
      </button>
    </div>
  );
};

export default ProductCard;