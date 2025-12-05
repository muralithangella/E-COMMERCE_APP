import React from 'react';
import styles from './HeroBanner.module.css';

const HeroBanner = () => {
  return (
    <div className={styles.heroBanner}>
      <div className={styles.heroContent}>
        <h1>Welcome to Our Store</h1>
        <p>Discover amazing products at great prices</p>
      </div>
    </div>
  );
};

export default HeroBanner;