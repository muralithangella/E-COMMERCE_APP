import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateCartItem, removeFromCart } from '../store/cartSlice';

const CartItem = ({ item }) => {
  console.log('CartItem received item:', item);
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    
    setIsUpdating(true);
    setQuantity(newQuantity);
    
    try {
      await dispatch(updateCartItem({
        itemId: item._id,
        quantity: newQuantity
      })).unwrap();
    } catch (error) {
      setQuantity(item.quantity); // Revert on error
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    try {
      await dispatch(removeFromCart(item.productId)).unwrap();
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getItemPrice = () => {
    return item.price || 0;
  };

  const getItemImage = () => {
    return item.image || 'https://via.placeholder.com/300x200';
  };

  const getVariantText = () => {
    if (!item.variant) return null;
    
    const variants = [];
    if (item.variant.size) variants.push(`Size: ${item.variant.size}`);
    if (item.variant.color) variants.push(`Color: ${item.variant.color}`);
    
    return variants.length > 0 ? variants.join(', ') : null;
  };

  const itemTotal = getItemPrice() * quantity;

  return (
    <div className={`cart-item ${isUpdating ? 'updating' : ''}`}>
      <div className="item-image">
        <img 
          src={getItemImage()} 
          alt={item.name || 'Product'}
        />
      </div>
      
      <div className="item-details">
        <h4 className="item-name">{item.name}</h4>
        
        {item.brand && (
          <div className="item-brand">{item.brand}</div>
        )}
        
        {getVariantText() && (
          <div className="item-variant">{getVariantText()}</div>
        )}
        
        <div className="item-price">
          ${getItemPrice().toFixed(2)} each
        </div>
      </div>
      
      <div className="item-quantity">
        <button 
          className="quantity-btn"
          onClick={() => handleQuantityChange(quantity - 1)}
          disabled={quantity <= 1 || isUpdating}
        >
          -
        </button>
        
        <input
          type="number"
          value={quantity}
          onChange={(e) => {
            const newQty = parseInt(e.target.value);
            if (newQty > 0) {
              handleQuantityChange(newQty);
            }
          }}
          min="1"
          disabled={isUpdating}
          className="quantity-input"
        />
        
        <button 
          className="quantity-btn"
          onClick={() => handleQuantityChange(quantity + 1)}
          disabled={isUpdating}
        >
          +
        </button>
      </div>
      
      <div className="item-total">
        ${itemTotal.toFixed(2)}
      </div>
      
      <div className="item-actions">
        <button 
          className="remove-btn"
          onClick={handleRemove}
          disabled={isUpdating}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;