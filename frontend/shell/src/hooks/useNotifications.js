import { useEffect, useState, useRef } from 'react';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const ws = new WebSocket('ws://localhost:5004');
        wsRef.current = ws;

        ws.onopen = () => {
          setConnected(true);
          console.log('✅ WebSocket connected to notification service');
          // Clear any pending reconnection attempts
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
          }
        };

        ws.onmessage = (event) => {
          try {
            const notification = JSON.parse(event.data);
            setNotifications(prev => [notification, ...prev]);
            console.log('📬 Notification received:', notification);
          } catch (error) {
            console.error('Failed to parse notification:', error);
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setConnected(false);
        };

        ws.onclose = () => {
          setConnected(false);
          console.log('WebSocket disconnected');
          // Attempt to reconnect after 3 seconds
          if (!reconnectTimeoutRef.current) {
            reconnectTimeoutRef.current = setTimeout(() => {
              console.log('Attempting to reconnect WebSocket...');
              connectWebSocket();
            }, 3000);
          }
        };
      } catch (error) {
        console.error('Failed to create WebSocket connection:', error);
        setConnected(false);
      }
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return { notifications, connected };
};

