import React from 'react';

const Card = ({ 
  children, 
  title, 
  subtitle,
  actions,
  className = '',
  padding = 'normal',
  shadow = true 
}) => {
  const cardClass = `card ${shadow ? 'card-shadow' : ''} card-padding-${padding} ${className}`;

  return (
    <div className={cardClass}>
      {(title || subtitle || actions) && (
        <div className="card-header">
          <div className="card-header-content">
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="card-actions">{actions}</div>}
        </div>
      )}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

export default Card;