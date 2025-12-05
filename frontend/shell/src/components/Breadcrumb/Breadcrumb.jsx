import React from 'react';

const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className="breadcrumb">
      {items.map((item, index) => (
        <span key={index}>
          {item.link ? <a href={item.link}>{item.label}</a> : item.label}
          {index < items.length - 1 && ' > '}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumb;