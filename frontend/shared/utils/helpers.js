export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getImageUrl = (images, fallback = '/placeholder-image.jpg') => {
  if (!images || images.length === 0) return fallback;
  const primaryImage = images.find(img => img.isPrimary);
  return primaryImage?.url || images[0]?.url || fallback;
};

export const calculateDiscount = (regular, sale) => {
  if (!sale || sale >= regular) return 0;
  return Math.round(((regular - sale) / regular) * 100);
};