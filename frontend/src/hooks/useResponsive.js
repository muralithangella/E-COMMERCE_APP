import { useState, useEffect, useCallback } from 'react';
import { BREAKPOINTS } from '../constants';

export const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : BREAKPOINTS.DESKTOP,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  const handleResize = useCallback(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const debouncedHandleResize = debounce(handleResize, 150);
    
    window.addEventListener('resize', debouncedHandleResize);
    
    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
    };
  }, [handleResize]);

  const isMobile = windowSize.width < BREAKPOINTS.MOBILE;
  const isTablet = windowSize.width >= BREAKPOINTS.MOBILE && windowSize.width < BREAKPOINTS.TABLET;
  const isDesktop = windowSize.width >= BREAKPOINTS.DESKTOP;
  const isLargeDesktop = windowSize.width >= 1440;

  return {
    windowSize,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    breakpoints: BREAKPOINTS,
  };
};

// Debounce utility
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}