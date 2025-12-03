import React from 'react';
import { useSearchParams } from 'react-router-dom';

const OrderConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Order Confirmed!</h1>
      <p>Thank you for your order.</p>
      <p>Order ID: <strong>{orderId}</strong></p>
      <p>You will receive a confirmation email shortly.</p>
      <button onClick={() => window.location.href = '/'}>
        Continue Shopping
      </button>
    </div>
  );
};

export default OrderConfirmationPage;