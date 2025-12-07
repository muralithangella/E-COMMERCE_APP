import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductService from '../services/productService';

const OrderConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const lastOrder = localStorage.getItem('lastOrder');
    if (lastOrder) {
      setOrderDetails(JSON.parse(lastOrder));
    }
  }, []);

  if (!orderDetails) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Order Not Found</h1>
        <button onClick={() => window.location.href = '/'}>
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f3f3f3', minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '8px',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>✅</div>
          <h1 style={{ color: '#007600', marginBottom: '10px' }}>Order Placed Successfully!</h1>
          <p style={{ fontSize: '18px', marginBottom: '20px' }}>Thank you for your order. We'll send you shipping confirmation when your item(s) are on the way!</p>
          <div style={{ backgroundColor: '#f0f8ff', padding: '16px', borderRadius: '4px', marginBottom: '20px' }}>
            <strong>Order Number: {orderDetails.id}</strong>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h2 style={{ marginBottom: '20px' }}>Order Details</h2>
          
          <div style={{ marginBottom: '20px' }}>
            <h3>Items Ordered:</h3>
            {orderDetails.items.map(item => {
              const imageData = ProductService.getProductImage(item);
              const isPlaceholder = imageData?.type === 'placeholder';
              
              return (
                <div key={item.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: '1px solid #eee'
                }}>
                  {isPlaceholder ? (
                    <div style={{
                      width: '60px',
                      height: '60px',
                      backgroundColor: imageData.backgroundColor,
                      borderRadius: '4px',
                      marginRight: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px'
                    }}>
                      {imageData.icon}
                    </div>
                  ) : (
                    <img 
                      src={item.image || 'https://via.placeholder.com/60x60?text=Product'} 
                      alt={item.name} 
                      onError={(e) => {
                        const placeholder = ProductService.getProductImage(item);
                        e.target.style.display = 'none';
                        const div = document.createElement('div');
                        div.style.cssText = `width: 60px; height: 60px; background-color: ${placeholder.backgroundColor}; border-radius: 4px; margin-right: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px;`;
                        div.textContent = placeholder.icon;
                        e.target.parentNode.insertBefore(div, e.target);
                      }}
                      style={{ width: '60px', height: '60px', objectFit: 'cover', marginRight: '12px', borderRadius: '4px' }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                    <div style={{ color: '#666' }}>Qty: {item.quantity}</div>
                  </div>
                  <div style={{ fontWeight: 'bold' }}>{ProductService.formatPrice(item.price * item.quantity)}</div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ flex: 1, marginRight: '20px' }}>
              <h3>Shipping Address:</h3>
              <p style={{ margin: 0, lineHeight: '1.5' }}>
                {orderDetails.shippingAddress.fullName}<br/>
                {orderDetails.shippingAddress.addressLine1}<br/>
                {orderDetails.shippingAddress.addressLine2 && <>{orderDetails.shippingAddress.addressLine2}<br/></>}
                {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.zipCode}<br/>
                {orderDetails.shippingAddress.phone}
              </p>
            </div>
            <div style={{ flex: 1 }}>
              <h3>Payment Method:</h3>
              <p style={{ margin: 0 }}>
                {orderDetails.paymentMethod.cardNumber}<br/>
                {orderDetails.paymentMethod.nameOnCard}
              </p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #eee', paddingTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Subtotal:</span>
              <span>{ProductService.formatPrice(orderDetails.subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Shipping:</span>
              <span>{orderDetails.shipping === 0 ? 'FREE' : ProductService.formatPrice(orderDetails.shipping)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Tax:</span>
              <span>{ProductService.formatPrice(orderDetails.tax)}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '18px',
              fontWeight: 'bold',
              borderTop: '1px solid #ddd',
              paddingTop: '8px'
            }}>
              <span>Total:</span>
              <span>{ProductService.formatPrice(orderDetails.total)}</span>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              padding: '12px 24px',
              backgroundColor: '#ff9f00',
              color: 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              marginRight: '12px'
            }}
          >
            Continue Shopping
          </button>
          <button
            onClick={() => window.location.href = '/products'}
            style={{
              padding: '12px 24px',
              backgroundColor: 'white',
              color: '#0066c0',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            View Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;