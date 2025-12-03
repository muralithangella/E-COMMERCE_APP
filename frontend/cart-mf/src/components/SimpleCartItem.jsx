import React from 'react';

const SimpleCartItem = ({ item }) => {
  console.log('SimpleCartItem received:', item);
  
  const handleRemove = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${item.productId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        window.location.reload(); // Simple reload for now
      }
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

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
        src={item.image || 'https://via.placeholder.com/100x100'} 
        alt={item.name || 'Product'}
        style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '15px' }}
      />
      
      <div style={{ flex: 1 }}>
        <h4 style={{ margin: '0 0 5px 0' }}>{item.name && item.name !== 'Unknown Product' ? item.name : `Product ${item.productId}`}</h4>
        <p style={{ margin: '0', color: '#666' }}>Quantity: {item.quantity}</p>
        <p style={{ margin: '5px 0 0 0', fontSize: '18px', fontWeight: 'bold' }}>
          ${(item.price || 0).toFixed(2)} each
        </p>
      </div>
      
      <div style={{ textAlign: 'right' }}>
        <p style={{ margin: '0 0 10px 0', fontSize: '20px', fontWeight: 'bold' }}>
          ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
        </p>
        <button 
          onClick={handleRemove}
          style={{
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default SimpleCartItem;