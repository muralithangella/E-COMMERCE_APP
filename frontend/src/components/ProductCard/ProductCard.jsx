import React, { memo, useCallback, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { formatCurrency } from '../../utils/formatters';
import { PLACEHOLDER_IMAGE } from '../../constants';
import StarRating from '../StarRating/StarRating';
import Button from '../Button/Button';
import styles from './ProductCard.module.css';

const ProductCard = memo(({
  product,
  onAddToCart,
  onAddToWishlist,
  variant = 'default',
  className = '',
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleProductClick = useCallback(() => {
    navigate(`/products/${product.id}`);
  }, [navigate, product.id]);

  const handleAddToCart = useCallback(async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setIsLoading(true);
    try {
      await onAddToCart(product.id);
    } finally {
      setIsLoading(false);
    }
  }, [onAddToCart, product.id, isAuthenticated, navigate]);

  const handleAddToWishlist = useCallback(async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      await onAddToWishlist(product.id);
    } catch (error) {
      console.error('Wishlist error:', error);
    }
  }, [onAddToWishlist, product.id, isAuthenticated, navigate]);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const discountPercentage = product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const cardClasses = `${styles.card} ${styles[variant]} ${className}`;

  return (
    <article className={cardClasses} onClick={handleProductClick}>
      <div className={styles.imageContainer}>
        <LazyLoadImage
          src={imageError ? PLACEHOLDER_IMAGE : product.images?.[0] || PLACEHOLDER_IMAGE}
          alt={product.name}
          className={styles.image}
          onError={handleImageError}
          effect="blur"
          placeholderSrc={PLACEHOLDER_IMAGE}
        />
        
        {discountPercentage > 0 && (
          <div className={styles.discountBadge}>
            -{discountPercentage}%
          </div>
        )}
        
        {product.prime && (
          <div className={styles.primeBadge}>
            Prime
          </div>
        )}
        
        <button
          className={styles.wishlistButton}
          onClick={handleAddToWishlist}
          aria-label="Add to wishlist"
        >
          <svg className={styles.heartIcon} viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{product.name}</h3>
        
        <div className={styles.rating}>
          <StarRating rating={product.rating} size="sm" />
          <span className={styles.reviewCount}>({product.reviews})</span>
        </div>

        <div className={styles.pricing}>
          <span className={styles.currentPrice}>
            {formatCurrency(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <span className={styles.originalPrice}>
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>

        {product.freeDelivery && (
          <div className={styles.delivery}>
            <span className={styles.freeDelivery}>FREE Delivery</span>
          </div>
        )}

        <div className={styles.seller}>
          by {product.seller || product.brand}
        </div>

        <div className={styles.actions}>
          <Button
            variant="primary"
            size="sm"
            onClick={handleAddToCart}
            disabled={!product.inStock || isLoading}
            loading={isLoading}
            className={styles.addToCartButton}
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </div>
    </article>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;