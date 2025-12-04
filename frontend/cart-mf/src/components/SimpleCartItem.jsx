import React from 'react';
import { useCart } from '../../../shared/hooks/useCart';

const SimpleCartItem = ({ item }) => {
  const { removeItem, isRemoving } = useCart();

  const handleRemove = () => {
    const itemId = item._id || item.productId;
    removeItem(itemId);
  };

  // Safely get product details with better fallbacks
  const productName = item.name || item.product?.name || 'Unknown Product';
  const productPrice = item.price || item.product?.price || 0;
  const productImage = item.image || item.product?.images?.[0]?.url || 'https://via.placeholder.com/100x100';
  const quantity = item.quantity || 1;
  const totalPrice = (productPrice * quantity).toFixed(2);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '15px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      marginBottom: '10px',
      backgroundColor: '#fff'
    }}>
      <img 
        src={productImage} 
        alt={productName}
        style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '15px' }}
      />
      
      <div style={{ flex: 1 }}>
        <h4 style={{ margin: '0 0 5px 0' }}>{productName}</h4>
        <p style={{ margin: '0', color: '#666' }}>Quantity: {quantity}</p>
        <p style={{ margin: '5px 0 0 0', fontSize: '18px', fontWeight: 'bold' }}>
          ${productPrice.toFixed(2)} each
        </p>
      </div>
      
      <div style={{ textAlign: 'right' }}>
        <p style={{ margin: '0 0 10px 0', fontSize: '20px', fontWeight: 'bold' }}>
          ${totalPrice}
        </p>
        <button 
          onClick={handleRemove}
          disabled={isRemoving}
          style={{
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '4px',
            cursor: isRemoving ? 'not-allowed' : 'pointer',
            opacity: isRemoving ? 0.6 : 1
          }}
        >
          {isRemoving ? 'Removing...' : 'Remove'}
        </button>
      </div>
    </div>
  );
};

export default SimpleCartItem;