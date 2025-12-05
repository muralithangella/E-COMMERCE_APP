import React from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { addToCart } from '../../store/slices/cartSlice';
import ProductService from '../../services/productService';

const ProductCard = ({ product, onProductClick, size = 'medium' }) => {
  const dispatch = useDispatch();
  
  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!product) return;
    
    dispatch(addToCart({
      id: product.id || product._id,
      name: product.name || 'Product',
      price: product.price || 0,
      image: null,
      category: product.category,
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

  const imageData = ProductService.getProductImage(product);
  const cardWidth = size === 'small' ? '180px' : size === 'large' ? '280px' : '220px';
  const imageHeight = size === 'small' ? '120px' : size === 'large' ? '200px' : '160px';

  return (
    <div 
      style={{ 
        minWidth: cardWidth,
        maxWidth: cardWidth,
        backgroundColor: 'white',
        border: '1px solid #D5D9D9',
        borderRadius: '8px',
        padding: '16px',
        cursor: 'pointer',
        transition: 'all 0.15s ease-in-out',
        position: 'relative'
      }}
      onClick={handleProductClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ position: 'relative', marginBottom: '12px' }}>
        <div
          style={{ 
            width: '100%', 
            height: imageHeight, 
            backgroundColor: imageData.backgroundColor || ProductService.getCategoryColor(product.category),
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: size === 'small' ? '10px' : '12px',
            fontWeight: '600',
            textAlign: 'center',
            padding: '16px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ 
            fontSize: size === 'small' ? '24px' : '32px', 
            marginBottom: '8px',
            opacity: 0.9
          }}>
            {ProductService.getCategoryIcon(product.category)}
          </div>
          <div style={{ 
            fontSize: size === 'small' ? '10px' : '11px',
            lineHeight: '1.3',
            maxWidth: '90%',
            wordBreak: 'break-word'
          }}>
            {product.name?.split(' ').slice(0, 2).join(' ') || 'Product'}
          </div>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.05) 100%)',
            borderRadius: '8px'
          }} />
        </div>
        
        {product.discount > 0 && (
          <div style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            backgroundColor: '#CC0C39',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            -{product.discount}%
          </div>
        )}
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <h3 style={{ 
          fontSize: size === 'small' ? '13px' : '14px', 
          margin: '0', 
          lineHeight: '20px',
          height: '40px',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          color: '#0F1111',
          fontWeight: '400'
        }}>
          {product.name || 'Product Name'}
        </h3>
      </div>
      
      {product.rating && (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ color: '#FF9900', fontSize: '14px', marginRight: '4px' }}>
            {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
          </div>
          <span style={{ fontSize: '12px', color: '#565959' }}>
            ({(product.reviews || 0).toLocaleString()})
          </span>
        </div>
      )}
      
      <div style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ 
            fontSize: size === 'small' ? '16px' : '18px', 
            fontWeight: '700', 
            color: '#B12704' 
          }}>
            {ProductService.formatPrice(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span style={{ 
              fontSize: '14px', 
              color: '#565959', 
              textDecoration: 'line-through' 
            }}>
              {ProductService.formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        {product.freeDelivery && (
          <div style={{ fontSize: '12px', color: '#007600', marginTop: '2px', fontWeight: '500' }}>
            FREE Delivery
          </div>
        )}
        {product.prime && (
          <div style={{ fontSize: '12px', color: '#00A8CC', marginTop: '2px', fontWeight: '500' }}>
            Prime Eligible
          </div>
        )}
      </div>
      
      <button
        onClick={handleAddToCart}
        style={{
          width: '100%',
          padding: size === 'small' ? '6px 12px' : '8px 16px',
          backgroundColor: '#FFD814',
          color: '#0F1111',
          border: '1px solid #FCD200',
          borderRadius: '20px',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: '400',
          transition: 'all 0.15s ease-in-out',
          zIndex: 10,
          position: 'relative'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#F7CA00';
          e.target.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#FFD814';
          e.target.style.transform = 'translateY(0)';
        }}
      >
        Add to cart
      </button>
    </div>
  );
};

export default ProductCard;