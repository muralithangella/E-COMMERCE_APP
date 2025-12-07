import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './RegisterPage.module.css';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password
      }, {
        withCredentials: true
      });
      
      if (response.data.success) {
        setShowToast(true);
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        setError(response.data.message || 'Registration failed');
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
        <h1 className={styles.title}>Create account</h1>
        
        {error && (
          <div className={styles.errorBox}>
            <strong>There was a problem</strong><br/>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Your name</label>
            <input
              type="text"
              placeholder="First and last name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
            <div className={styles.passwordHint}>
              Passwords must be at least 6 characters.
            </div>
          </div>
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>Re-enter password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? 'Creating Account...' : 'Create your Amazon account'}
          </button>
        </form>
        
        <div className={styles.termsText}>
          By creating an account, you agree to Amazon's{' '}
          <a href="#" className={styles.termsLink}>Conditions of Use</a> and{' '}
          <a href="#" className={styles.termsLink}>Privacy Notice</a>.
        </div>
        
        <div className={styles.divider}>
          <div className={styles.dividerLine}></div>
          <span className={styles.dividerText}>Already have an account?</span>
        </div>
        
        <Link to="/login" className={styles.signInLink}>
          Sign in to your account
        </Link>
      </div>
      
      {showToast && (
        <div className={styles.toast}>
          <span className={styles.toastIcon}>✅</span>
          Account created successfully! Redirecting to login...
        </div>
      )}
    </div>
  );
};

export default RegisterPage;