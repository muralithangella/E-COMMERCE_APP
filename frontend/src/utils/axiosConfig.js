import axios from 'axios';
import { API_CONFIG, ERROR_MESSAGES } from '../constants';
import { store } from '../store';
import { logout, setCredentials } from '../store/slices/authSlice';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request ID for tracking
    config.headers['X-Request-ID'] = generateRequestId();
    
    // Add timestamp
    config.metadata = { startTime: Date.now() };
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Log response time
    const duration = Date.now() - response.config.metadata.startTime;
    console.debug(`API Response: ${response.config.url} - ${duration}ms`);
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 errors with token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const state = store.getState();
        const refreshToken = state.auth.refreshToken;
        
        if (refreshToken) {
          const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/refresh`, {
            refreshToken,
          });
          
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          
          store.dispatch(setCredentials({
            token: accessToken,
            refreshToken: newRefreshToken,
          }));
          
          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        store.dispatch(logout());
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Handle network errors
    if (!error.response) {
      error.message = ERROR_MESSAGES.NETWORK_ERROR;
    } else {
      // Handle specific HTTP errors
      switch (error.response.status) {
        case 400:
          error.message = error.response.data?.message || ERROR_MESSAGES.VALIDATION_ERROR;
          break;
        case 401:
          error.message = ERROR_MESSAGES.UNAUTHORIZED;
          break;
        case 403:
          error.message = ERROR_MESSAGES.FORBIDDEN;
          break;
        case 404:
          error.message = ERROR_MESSAGES.NOT_FOUND;
          break;
        case 500:
        default:
          error.message = ERROR_MESSAGES.SERVER_ERROR;
          break;
      }
    }
    
    return Promise.reject(error);
  }
);

// Retry mechanism
const retryRequest = async (config, retryCount = 0) => {
  try {
    return await apiClient(config);
  } catch (error) {
    if (retryCount < API_CONFIG.RETRY_ATTEMPTS && isRetryableError(error)) {
      const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryRequest(config, retryCount + 1);
    }
    throw error;
  }
};

// Check if error is retryable
const isRetryableError = (error) => {
  return (
    !error.response || // Network error
    error.response.status >= 500 || // Server error
    error.response.status === 429 // Rate limit
  );
};

// Generate unique request ID
const generateRequestId = () => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// API methods with retry
export const api = {
  get: (url, config = {}) => retryRequest({ ...config, method: 'GET', url }),
  post: (url, data, config = {}) => retryRequest({ ...config, method: 'POST', url, data }),
  put: (url, data, config = {}) => retryRequest({ ...config, method: 'PUT', url, data }),
  patch: (url, data, config = {}) => retryRequest({ ...config, method: 'PATCH', url, data }),
  delete: (url, config = {}) => retryRequest({ ...config, method: 'DELETE', url }),
};

export default apiClient;