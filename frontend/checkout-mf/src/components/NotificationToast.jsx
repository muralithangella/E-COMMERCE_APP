import React from 'react';
import { useNotifications } from '../utils/useNotifications';

const NotificationToast = () => {
  const { notifications, connected } = useNotifications();

  return (
    <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999 }}>
      {!connected && (
        <div style={{ padding: '10px', background: '#ffc107', borderRadius: '4px', marginBottom: '10px' }}>
          Connecting to notifications...
        </div>
      )}
      {notifications.slice(0, 3).map((notif, idx) => (
        <div key={idx} style={{ 
          padding: '15px', 
          background: '#4caf50', 
          color: 'white', 
          borderRadius: '4px', 
          marginBottom: '10px',
          minWidth: '300px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}>
          <strong>{notif.type}</strong>
          <p style={{ margin: '5px 0 0 0' }}>{notif.message}</p>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;
