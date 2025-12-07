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
      const response = await axios.post('https://localhost:8080/api/auth/login', {
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
            <Link to="/forgot-password" className={styles.forgotLink}>
              Forgot your password?
            </Link>
          </div>
        </form>
        
        <div className={styles.ssoSection}>
          <div className={styles.dividerLine}></div>
          <span className={styles.dividerText}>OR</span>
          <div className={styles.dividerLine}></div>
        </div>
        
        <button
          onClick={() => window.location.href = 'https://localhost:8080/api/auth/google'}
          className={styles.googleButton}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          Continue with Google
        </button>
        
        <div className={styles.newUserSection}>
          <div className={styles.dividerLine}></div>
          <span className={styles.dividerText}>New to Amazon?</span>
          <div className={styles.dividerLine}></div>
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