import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      }, {
        withCredentials: true
      });
      
      const data = response.data;
      
      if (data) {
        // Handle different response formats
        const token = data.token || data.accessToken || 'dummy-token';
        const userData = data.user || data.data || { name: email.split('@')[0], email: email };
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        window.location.href = '/';
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Link to="/" className={styles.logo}>
        <span className={styles.logoAmazon}>amazon</span>.in
      </Link>
      
      <div className={styles.formContainer}>
        <h1 className={styles.title}>Sign in</h1>
        
        {error && (
          <div className={styles.errorBox}>
            <strong>There was a problem</strong><br/>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email or mobile phone number</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.passwordGroup}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
            <div className={styles.passwordHint}>
              Passwords must be at least 6 characters.
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? 'Signing In...' : 'Sign in'}
          </button>
          
          <div className={styles.forgotPassword}>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className={styles.forgotLink}
            >
              Forgot your password?
            </a>
          </div>
        </form>
        
        <div className={styles.divider}>
          <div className={styles.dividerLine}></div>
          <span className={styles.dividerText}>New to Amazon?</span>
        </div>
        
        <Link to="/register" className={styles.createAccountLink}>
          Create your Amazon account
        </Link>
        
        <div className={styles.demoCredentials}>
          <p className={styles.demoTitle}>Demo Credentials:</p>
          <p className={styles.demoText}>Email: admin@example.com</p>
          <p className={styles.demoText}>Password: admin123</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;