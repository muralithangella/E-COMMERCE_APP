import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../store/slices/cartSlice';

const CheckoutPage = () => {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [orderData, setOrderData] = useState({
    shippingAddress: {
      fullName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      phone: ''
    },
    paymentMethod: {
      type: 'card',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      nameOnCard: ''
    },
    billingAddress: {
      sameAsShipping: true,
      fullName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    }
  });

  const { items: cartItems } = useSelector(state => state.cart);
  const dispatch = useDispatch();

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 35 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleInputChange = (section, field, value) => {
    setOrderData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        const addr = orderData.shippingAddress;
        return addr.fullName && addr.addressLine1 && addr.city && addr.state && addr.zipCode && addr.phone;
      case 2:
        const payment = orderData.paymentMethod;
        return payment.cardNumber && payment.expiryDate && payment.cvv && payment.nameOnCard;
      default:
        return true;
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    console.log('🛒 Starting order placement...');
    
    try {
      // Add delay to show loading
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const orderId = Date.now().toString();
      
      const order = {
        id: orderId,
        items: cartItems,
        shippingAddress: orderData.shippingAddress,
        paymentMethod: { ...orderData.paymentMethod, cardNumber: '**** **** **** ' + orderData.paymentMethod.cardNumber.slice(-4) },
        subtotal,
        shipping,
        tax,
        total,
        status: 'confirmed',
        orderDate: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        userEmail: orderData.shippingAddress.email || 'customer@example.com',
        userPhone: orderData.shippingAddress.phone
      };
      
      console.log('📦 Order created:', order);
      
      // Submit order to backend API for notifications
      try {
        const response = await fetch('http://localhost:3008/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(order)
        });
        
        if (response.ok) {
          console.log('✅ Order submitted to backend - notifications will be sent');
        } else {
          console.warn('⚠️ Backend response not OK:', response.status);
        }
      } catch (apiError) {
        console.warn('⚠️ Backend API unavailable:', apiError.message);
      }

      localStorage.setItem('lastOrder', JSON.stringify(order));
      dispatch(clearCart());
      
      console.log('🎉 Redirecting to order confirmation...');
      window.location.href = `/order-confirmation?orderId=${order.id}`;
    } catch (error) {
      console.error('❌ Order placement failed:', error);
      alert('Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Your cart is empty</h2>
        <a href="/products" style={{ color: '#0066c0', textDecoration: 'none' }}>
          Continue Shopping
        </a>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f3f3f3', minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Progress Steps */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {[
              { step: 1, title: 'Shipping Address' },
              { step: 2, title: 'Payment Method' },
              { step: 3, title: 'Review Order' }
            ].map(({ step, title }) => (
              <div key={step} style={{
                display: 'flex',
                alignItems: 'center',
                color: currentStep >= step ? '#ff9f00' : '#666'
              }}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: currentStep >= step ? '#ff9f00' : '#ddd',
                  color: currentStep >= step ? 'white' : '#666',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  marginRight: '10px'
                }}>
                  {step}
                </div>
                <span style={{ fontWeight: currentStep === step ? 'bold' : 'normal' }}>
                  {title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          
          {/* Main Content */}
          <div style={{ flex: 2 }}>
            
            {/* Step 1: Shipping Address */}
            {currentStep === 1 && (
              <div style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <h2 style={{ margin: '0 0 20px 0' }}>Shipping Address</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={orderData.shippingAddress.fullName}
                    onChange={(e) => handleInputChange('shippingAddress', 'fullName', e.target.value)}
                    style={{
                      gridColumn: '1 / -1',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                  
                  <input
                    type="text"
                    placeholder="Address Line 1"
                    value={orderData.shippingAddress.addressLine1}
                    onChange={(e) => handleInputChange('shippingAddress', 'addressLine1', e.target.value)}
                    style={{
                      gridColumn: '1 / -1',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                  
                  <input
                    type="text"
                    placeholder="Address Line 2 (Optional)"
                    value={orderData.shippingAddress.addressLine2}
                    onChange={(e) => handleInputChange('shippingAddress', 'addressLine2', e.target.value)}
                    style={{
                      gridColumn: '1 / -1',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                  
                  <input
                    type="text"
                    placeholder="City"
                    value={orderData.shippingAddress.city}
                    onChange={(e) => handleInputChange('shippingAddress', 'city', e.target.value)}
                    style={{
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                  
                  <input
                    type="text"
                    placeholder="State"
                    value={orderData.shippingAddress.state}
                    onChange={(e) => handleInputChange('shippingAddress', 'state', e.target.value)}
                    style={{
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                  
                  <input
                    type="text"
                    placeholder="ZIP Code"
                    value={orderData.shippingAddress.zipCode}
                    onChange={(e) => handleInputChange('shippingAddress', 'zipCode', e.target.value)}
                    style={{
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                  
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={orderData.shippingAddress.phone}
                    onChange={(e) => handleInputChange('shippingAddress', 'phone', e.target.value)}
                    style={{
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                  
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={orderData.shippingAddress.email || ''}
                    onChange={(e) => handleInputChange('shippingAddress', 'email', e.target.value)}
                    style={{
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                
                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={!validateStep(1)}
                  style={{
                    marginTop: '20px',
                    padding: '12px 24px',
                    backgroundColor: validateStep(1) ? '#ff9f00' : '#ccc',
                    color: validateStep(1) ? 'black' : '#666',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: validateStep(1) ? 'pointer' : 'not-allowed',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {currentStep === 2 && (
              <div style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <h2 style={{ margin: '0 0 20px 0' }}>Payment Method</h2>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <input
                      type="radio"
                      name="paymentType"
                      value="card"
                      checked={orderData.paymentMethod.type === 'card'}
                      onChange={(e) => handleInputChange('paymentMethod', 'type', e.target.value)}
                      style={{ marginRight: '8px' }}
                    />
                    Credit or Debit Card
                  </label>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <input
                    type="text"
                    placeholder="Card Number"
                    value={orderData.paymentMethod.cardNumber}
                    onChange={(e) => handleInputChange('paymentMethod', 'cardNumber', e.target.value)}
                    style={{
                      gridColumn: '1 / -1',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                  
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={orderData.paymentMethod.expiryDate}
                    onChange={(e) => handleInputChange('paymentMethod', 'expiryDate', e.target.value)}
                    style={{
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                  
                  <input
                    type="text"
                    placeholder="CVV"
                    value={orderData.paymentMethod.cvv}
                    onChange={(e) => handleInputChange('paymentMethod', 'cvv', e.target.value)}
                    style={{
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                  
                  <input
                    type="text"
                    placeholder="Name on Card"
                    value={orderData.paymentMethod.nameOnCard}
                    onChange={(e) => handleInputChange('paymentMethod', 'nameOnCard', e.target.value)}
                    style={{
                      gridColumn: '1 / -1',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <button
                    onClick={() => setCurrentStep(1)}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#f0f0f0',
                      color: '#333',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '16px'
                    }}
                  >
                    Back
                  </button>
                  
                  <button
                    onClick={() => setCurrentStep(3)}
                    disabled={!validateStep(2)}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: validateStep(2) ? '#ff9f00' : '#ccc',
                      color: validateStep(2) ? 'black' : '#666',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: validateStep(2) ? 'pointer' : 'not-allowed',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review Order */}
            {currentStep === 3 && (
              <div style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <h2 style={{ margin: '0 0 20px 0' }}>Review Your Order</h2>
                
                {/* Shipping Address Review */}
                <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  <h4 style={{ margin: '0 0 10px 0' }}>Shipping Address</h4>
                  <p style={{ margin: 0, lineHeight: '1.5' }}>
                    {orderData.shippingAddress.fullName}<br />
                    {orderData.shippingAddress.addressLine1}<br />
                    {orderData.shippingAddress.addressLine2 && <>{orderData.shippingAddress.addressLine2}<br /></>}
                    {orderData.shippingAddress.city}, {orderData.shippingAddress.state} {orderData.shippingAddress.zipCode}<br />
                    {orderData.shippingAddress.phone}
                  </p>
                </div>
                
                {/* Payment Method Review */}
                <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  <h4 style={{ margin: '0 0 10px 0' }}>Payment Method</h4>
                  <p style={{ margin: 0 }}>
                    **** **** **** {orderData.paymentMethod.cardNumber.slice(-4)}<br />
                    {orderData.paymentMethod.nameOnCard}
                  </p>
                </div>
                
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <button
                    onClick={() => setCurrentStep(2)}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#f0f0f0',
                      color: '#333',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '16px'
                    }}
                  >
                    Back
                  </button>
                  
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: loading ? '#ccc' : '#ff9f00',
                      color: loading ? '#666' : 'black',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}
                  >
                    {loading ? 'Placing Order...' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div style={{ flex: 1 }}>
            <div style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              position: 'sticky',
              top: '20px'
            }}>
              <h3 style={{ margin: '0 0 20px 0' }}>Order Summary</h3>
              
              {cartItems.map(item => (
                <div key={item.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '16px',
                  paddingBottom: '16px',
                  borderBottom: '1px solid #eee'
                }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: '60px',
                      height: '60px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      marginRight: '12px'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <h5 style={{ margin: '0 0 4px 0', fontSize: '14px' }}>{item.name}</h5>
                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                      Qty: {item.quantity} × ${item.price}
                    </p>
                  </div>
                  <div style={{ fontWeight: 'bold' }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
              
              <div style={{ borderTop: '2px solid #eee', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Shipping:</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Tax:</span>
                  <span>${tax.toFixed(2)}</span>
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
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;