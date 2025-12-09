import React from 'react';
import { useNotifications } from '../hooks/useNotifications';

const NotificationToast = () => {
  const { notifications, connected } = useNotifications();

  return (
    <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999 }}>
      {!connected && (
        <div style={{ 
          padding: '10px', 
          background: '#ffc107', 
          borderRadius: '4px', 
          marginBottom: '10px',
          color: '#000',
          fontSize: '14px'
        }}>
          Connecting to notifications...
        </div>
      )}
      {notifications.slice(0, 3).map((notif, idx) => (
        <div 
          key={idx} 
          style={{ 
            padding: '15px', 
            background: '#4caf50', 
            color: 'white', 
            borderRadius: '4px', 
            marginBottom: '10px',
            minWidth: '300px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            animation: 'slideIn 0.3s ease-out'
          }}
        >
          <strong style={{ display: 'block', marginBottom: '5px' }}>{notif.type}</strong>
          <p style={{ margin: 0, fontSize: '14px' }}>{notif.message}</p>
        </div>
      ))}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationToast;

