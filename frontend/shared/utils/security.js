// XSS Protection
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
};

// CSRF Token Management
export const getCsrfToken = () => {
  return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
};

// Secure Local Storage
export const secureStorage = {
  setItem: (key, value) => {
    try {
      const encrypted = btoa(JSON.stringify(value));
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Storage error:', error);
    }
  },
  
  getItem: (key) => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      // Check if it's base64 encoded
      try {
        return JSON.parse(atob(item));
      } catch {
        // If not base64, try parsing directly (for backward compatibility)
        return JSON.parse(item);
      }
    } catch (error) {
      console.error('Storage error:', error);
      // Clear corrupted data
      localStorage.removeItem(key);
      return null;
    }
  },
  
  removeItem: (key) => {
    localStorage.removeItem(key);
  }
};

// Input Validation
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 8 && 
         /[A-Z]/.test(password) && 
         /[a-z]/.test(password) && 
         /\d/.test(password);
};