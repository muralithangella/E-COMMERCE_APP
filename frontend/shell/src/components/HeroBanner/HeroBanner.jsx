import React, { useState, useEffect } from 'react';
import styles from './HeroBanner.module.css';

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const banners = [
    {
      id: 1,
      title: 'Great Indian Festival',
      subtitle: 'Up to 80% off on Electronics, Fashion & more',
      cta: 'Shop Now',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      id: 2,
      title: 'Prime Day Deals',
      subtitle: 'Exclusive deals for Prime members',
      cta: 'Explore Deals',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      id: 3,
      title: 'New Arrivals',
      subtitle: 'Latest products from top brands',
      cta: 'Discover',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    }
  ];
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [banners.length]);
  
  return (
    <div 
      style={{
        height: '400px',
        background: banners[currentSlide].gradient,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.2)'
      }} />
      
      <div style={{ zIndex: 2, maxWidth: '600px', padding: '0 20px' }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: '700',
          marginBottom: '16px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          {banners[currentSlide].title}
        </h1>
        <p style={{
          fontSize: '20px',
          marginBottom: '32px',
          opacity: 0.9,
          textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
        }}>
          {banners[currentSlide].subtitle}
        </p>
        <button style={{
          padding: '12px 32px',
          fontSize: '16px',
          fontWeight: '600',
          backgroundColor: '#FF9900',
          color: 'white',
          border: 'none',
          borderRadius: '25px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#e88900';
          e.target.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#FF9900';
          e.target.style.transform = 'translateY(0)';
        }}>
          {banners[currentSlide].cta}
        </button>
      </div>
      
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '8px',
        zIndex: 2
      }}>
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: currentSlide === index ? 'white' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;