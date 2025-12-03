import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../cart-mf/src/store/cartSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({
      productId: product._id,
      quantity: 1
    }));
  };

  const getProductPrice = () => {
    if (product.price?.sale && product.price.sale < product.price.regular) {
      return (
        <div className="price">
          <span className="sale-price">${product.price.sale}</span>
          <span className="regular-price">${product.price.regular}</span>
        </div>
      );
    }
    return <div className="price">${product.price?.regular || product.price}</div>;
  };

  const getProductImage = () => {
    const primaryImage = product.images?.find(img => img.isPrimary);
    return primaryImage?.url || product.images?.[0]?.url || '/placeholder-image.jpg';
  };

  const isOutOfStock = () => {
    return product.inventory?.trackQuantity && product.inventory?.quantity === 0;
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img 
          src={getProductImage()} 
          alt={product.name}
          loading="lazy"
        />
        {product.featured && <span className="featured-badge">Featured</span>}
        {isOutOfStock() && <span className="out-of-stock-badge">Out of Stock</span>}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.shortDescription}</p>
        
        {product.brand && (
          <div className="product-brand">{product.brand}</div>
        )}
        
        {getProductPrice()}
        
        {product.ratings?.count > 0 && (
          <div className="product-rating">
            <span className="stars">{'★'.repeat(Math.floor(product.ratings.average))}</span>
            <span className="rating-text">
              {product.ratings.average.toFixed(1)} ({product.ratings.count} reviews)
            </span>
          </div>
        )}
        
        <div className="product-actions">
          <button 
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={isOutOfStock()}
          >
            {isOutOfStock() ? 'Out of Stock' : 'Add to Cart'}
          </button>
          
          <button className="view-details-btn">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;