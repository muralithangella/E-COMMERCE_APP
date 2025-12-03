import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'primary', 
  text = '',
  className = '' 
}) => {
  const spinnerClass = `spinner spinner-${size} spinner-${color} ${className}`;

  return (
    <div className="loading-container">
      <div className={spinnerClass}></div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;