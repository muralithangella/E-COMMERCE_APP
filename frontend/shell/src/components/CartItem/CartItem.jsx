import React from 'react';

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  return (
    <div>
      <h4>{item.name}</h4>
      <p>₹{item.price}</p>
      <input 
        type="number" 
        value={item.quantity} 
        onChange={(e) => onQuantityChange(item.id, parseInt(e.target.value))}
      />
      <button onClick={() => onRemove(item.id)}>Remove</button>
    </div>
  );
};

export default CartItem;