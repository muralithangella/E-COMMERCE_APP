import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateOrderSummary } from '../store/checkoutSlice';

const OrderSummary = () => {
  const dispatch = useDispatch();
  const { items, totalPrice } = useSelector(state => state.cart);
  const { orderSummary } = useSelector(state => state.checkout);

  useEffect(() => {
    // Calculate order totals
    const subtotal = totalPrice;
    const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    dispatch(updateOrderSummary({
      items: items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price?.sale || item.product.price?.regular || item.price,
        variant: item.variant
      })),
      subtotal: subtotal,
      shipping: shipping,
      tax: tax,
      total: total
    }));
  }, [items, totalPrice, dispatch]);

  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <div className="order-summary">
      <h3>Order Summary</h3>
      
      <div className="order-items">
        {items.map((item) => (
          <div key={item._id} className="summary-item">
            <div className="item-info">
              <img 
                src={item.product.images?.[0]?.url || '/placeholder-image.jpg'} 
                alt={item.product.name}
                className="item-image"
              />
              <div className="item-details">
                <h4>{item.product.name}</h4>
                {item.variant && (
                  <div className="item-variant">
                    {item.variant.size && `Size: ${item.variant.size}`}
                    {item.variant.color && ` Color: ${item.variant.color}`}
                  </div>
                )}
                <div className="item-quantity">Qty: {item.quantity}</div>
              </div>
            </div>
            <div className="item-price">
              {formatPrice((item.product.price?.sale || item.product.price?.regular || item.price) * item.quantity)}
            </div>
          </div>
        ))}
      </div>
      
      <div className="order-totals">
        <div className="total-line">
          <span>Subtotal:</span>
          <span>{formatPrice(orderSummary.subtotal)}</span>
        </div>
        
        <div className="total-line">
          <span>Shipping:</span>
          <span>
            {orderSummary.shipping === 0 ? 'FREE' : formatPrice(orderSummary.shipping)}
          </span>
        </div>
        
        <div className="total-line">
          <span>Tax:</span>
          <span>{formatPrice(orderSummary.tax)}</span>
        </div>
        
        <div className="total-line total">
          <span>Total:</span>
          <span>{formatPrice(orderSummary.total)}</span>
        </div>
      </div>
      
      {orderSummary.subtotal > 0 && orderSummary.subtotal < 50 && (
        <div className="shipping-notice">
          Add {formatPrice(50 - orderSummary.subtotal)} more for free shipping!
        </div>
      )}
    </div>
  );
};

export default OrderSummary;