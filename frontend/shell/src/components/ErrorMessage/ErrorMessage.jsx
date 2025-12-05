import React from 'react';
import Button from '../Button/Button.jsx';
import styles from './ErrorMessage.module.css';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className={styles.errorMessage}>
      <div className={styles.icon}>⚠️</div>
      <p className={styles.text}>{message}</p>
      {onRetry && (
        <Button variant="primary" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorMessage;