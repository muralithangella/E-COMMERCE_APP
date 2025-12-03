import React, { useState, useEffect } from 'react';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastStyles = () => {
    const baseStyles = {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 20px',
      borderRadius: '4px',
      color: 'white',
      fontWeight: '500',
      fontSize: '14px',
      zIndex: 9999,
      minWidth: '300px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      transform: visible ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.3s ease-in-out',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    };

    const typeStyles = {
      success: { backgroundColor: '#28a745' },
      error: { backgroundColor: '#dc3545' },
      warning: { backgroundColor: '#ffc107', color: '#212529' },
      info: { backgroundColor: '#17a2b8' }
    };

    return { ...baseStyles, ...typeStyles[type] };
  };

  return (
    <div style={getToastStyles()}>
      <span>{message}</span>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(onClose, 300);
        }}
        style={{
          background: 'none',
          border: 'none',
          color: 'inherit',
          fontSize: '18px',
          cursor: 'pointer',
          marginLeft: '10px'
        }}
      >
        ×
      </button>
    </div>
  );
};

export default Toast;