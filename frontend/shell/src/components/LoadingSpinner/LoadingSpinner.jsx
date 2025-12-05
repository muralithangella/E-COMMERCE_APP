import React from 'react';
import styles from './LoadingSpinner.module.css';

const LoadingSpinner = ({ size = 'md' }) => {
  return (
    <div className={`${styles.spinner} ${styles[size]}`}>
      <div className={styles.circle}></div>
    </div>
  );
};

export default LoadingSpinner;