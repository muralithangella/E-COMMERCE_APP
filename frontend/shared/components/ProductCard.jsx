import React from 'react';
import { useCart } from '../hooks/useCart';

const ProductCard = ({ product }) => {
  const { addToCart, isAdding } = useCart();

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '16px',
      textAlign: 'center'
    }}>
      <img
        src={product.images?.[0] || `https://picsum.photos/200/150?random=${product._id}`}
        alt={product.name}
        style={{
          width: '100%',
          height: '150px',
          objectFit: 'cover',
          borderRadius: '4px',
          marginBottom: '12px'
        }}
      />
      <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{product.name}</h3>
      <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#B12704' }}>
        ${product.price}
      </p>
      <p style={{ fontSize: '14px', color: '#666' }}>
        {product.description}
      </p>
      <button
        onClick={() => addToCart(product.id)}
        disabled={isAdding}
        style={{
          backgroundColor: '#ff9f00',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '4px',
          cursor: isAdding ? 'not-allowed' : 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          marginTop: '10px',
          opacity: isAdding ? 0.6 : 1
        }}
      >
        {isAdding ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  );
};

export default ProductCard;