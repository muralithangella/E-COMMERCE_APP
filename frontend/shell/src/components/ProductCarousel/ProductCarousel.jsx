import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';

const ProductCarousel = ({ title = 'Featured Products', products = [], onProductClick }) => {
  console.log('ProductCarousel received products:', products);
  const dispatch = useDispatch();
  
  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    dispatch(addToCart({
      id: product.id || product._id,
      name: product.name,
      price: product.price,
      image: null,
      category: product.category,
      quantity: 1
    }));
    alert(`${product.name} added to cart!`);
  };
  

  const getCategoryColor = (category) => {
    const colors = {
      'mobiles': '#4A90E2',
      'electronics': '#6C5CE7', 
      'fashion': '#E74C3C',
      'home': '#F39C12',
      'books': '#27AE60',
      'sports': '#BD10E0',
      'prime': '#34495E'
    };
    return colors[category?.toLowerCase()] || '#9013FE';
  };
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price).replace('₹', '₹');
  };
  
  if (!products || products.length === 0) {
    return (
      <div style={{ padding: '20px', backgroundColor: 'white' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '21px', fontWeight: '700' }}>{title}</h2>
        <p>No products available</p>
      </div>
    );
  }
  
  return (
    <div style={{ padding: '20px', backgroundColor: 'white' }}>
      <h2 style={{ marginBottom: '20px', fontSize: '21px', fontWeight: '700', color: '#0F1111' }}>{title}</h2>
      <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '10px' }}>
        {products.slice(0, 8).map((product) => (
          <div 
            key={product.id || product._id} 
            style={{ 
              minWidth: '220px',
              maxWidth: '220px',
              backgroundColor: 'white',
              border: '1px solid #D5D9D9',
              borderRadius: '8px',
              padding: '16px',
              cursor: 'pointer',
              transition: 'box-shadow 0.15s ease-in-out',
              position: 'relative'
            }}
            onClick={() => onProductClick && onProductClick(product.id || product._id)}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ position: 'relative', marginBottom: '12px' }}>
              <div
                style={{ 
                  width: '100%', 
                  height: '160px', 
                  backgroundColor: getCategoryColor(product.category),
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  padding: '20px'
                }}
              >
                {product.name.split(' ').slice(0, 3).join(' ')}
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
                  fontWeight: 'bold'
                }}>
                  -{product.discount}%
                </div>
              )}
            </div>
            
            <div style={{ marginBottom: '8px' }}>
              <h3 style={{ 
                fontSize: '14px', 
                margin: '0', 
                lineHeight: '20px',
                height: '40px',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                color: '#0F1111'
              }}>
                {product.name}
              </h3>
            </div>
            
            <div style={{ marginBottom: '8px' }}>
              {product.rating && (
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ color: '#FF9900', fontSize: '14px', marginRight: '4px' }}>
                    {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
                  </div>
                  <span style={{ fontSize: '12px', color: '#565959' }}>({product.reviews || 0})</span>
                </div>
              )}
            </div>
            
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '18px', fontWeight: '700', color: '#B12704' }}>
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span style={{ 
                    fontSize: '14px', 
                    color: '#565959', 
                    textDecoration: 'line-through' 
                  }}>
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              {product.freeDelivery && (
                <div style={{ fontSize: '12px', color: '#007600', marginTop: '2px' }}>
                  FREE Delivery
                </div>
              )}
            </div>
            
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddToCart(e, product);
              }}
              style={{
                width: '100%',
                padding: '8px 16px',
                backgroundColor: '#FFD814',
                color: '#0F1111',
                border: '1px solid #FCD200',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '400',
                transition: 'background-color 0.15s ease-in-out',
                zIndex: 10,
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#F7CA00';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#FFD814';
              }}
            >
              Add to cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;