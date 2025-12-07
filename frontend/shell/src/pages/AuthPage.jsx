import React, { Suspense, useState } from 'react';

const AuthApp = React.lazy(() => import('auth/AuthApp').catch(() => ({ default: () => <SimpleLoginForm /> })));

const SimpleLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:5000/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        window.location.href = '/';
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '350px', 
      margin: '2rem auto', 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '4px',
      backgroundColor: 'white',
      fontFamily: 'Amazon Ember, Arial, sans-serif'
    }}>
      <h1 style={{ 
        fontSize: '28px', 
        fontWeight: '400', 
        lineHeight: '1.2', 
        marginBottom: '18px',
        color: '#0F1111'
      }}>
        Sign in
      </h1>
      
      {error && (
        <div style={{ 
          padding: '14px 18px', 
          marginBottom: '14px', 
          backgroundColor: '#fdf2f2', 
          border: '1px solid #d70000', 
          borderRadius: '4px',
          fontSize: '13px',
          color: '#d70000'
        }}>
          <strong>There was a problem</strong><br/>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '14px' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '13px', 
            fontWeight: '700', 
            color: '#111', 
            marginBottom: '2px' 
          }}>Email or mobile phone number</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ 
              width: '100%', 
              padding: '3px 7px', 
              border: '1px solid #a6a6a6', 
              borderRadius: '3px',
              fontSize: '13px',
              lineHeight: '19px',
              boxSizing: 'border-box'
            }}
          />
        </div>
        <div style={{ marginBottom: '22px' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '13px', 
            fontWeight: '700', 
            color: '#111', 
            marginBottom: '2px' 
          }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ 
              width: '100%', 
              padding: '3px 7px', 
              border: '1px solid #a6a6a6', 
              borderRadius: '3px',
              fontSize: '13px',
              lineHeight: '19px',
              boxSizing: 'border-box'
            }}
          />
          <div style={{ fontSize: '11px', color: '#767676', marginTop: '2px' }}>
            Passwords must be at least 6 characters.
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: '#ffd814',
            border: '1px solid #fcd200',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '13px',
            lineHeight: '29px',
            textAlign: 'center',
            color: '#0f1111',
            marginBottom: '14px'
          }}
        >
          {loading ? 'Signing In...' : 'Sign in'}
        </button>
        
        <div style={{ textAlign: 'left', marginBottom: '14px' }}>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            style={{
              color: '#0066c0',
              fontSize: '13px',
              textDecoration: 'none'
            }}
          >
            Forgot your password?
          </a>
        </div>
      </form>
      
      <div style={{ 
        textAlign: 'center', 
        fontSize: '12px', 
        color: '#767676', 
        margin: '22px 0 14px 0',
        position: 'relative'
      }}>
        <div style={{
          borderTop: '1px solid #e7e7e7',
          position: 'absolute',
          top: '50%',
          left: '0',
          right: '0'
        }}></div>
        <span style={{
          backgroundColor: 'white',
          padding: '0 8px',
          position: 'relative'
        }}>New to Amazon?</span>
      </div>
      
      <a
        href="/register"
        style={{
          display: 'block',
          width: '100%',
          padding: '8px',
          backgroundColor: '#f7f8fa',
          border: '1px solid #adb1b8',
          borderRadius: '8px',
          fontSize: '13px',
          lineHeight: '29px',
          textAlign: 'center',
          color: '#0f1111',
          textDecoration: 'none',
          marginBottom: '14px',
          boxSizing: 'border-box'
        }}
      >
        Create your Amazon account
      </a>
      
      <div style={{ marginTop: '16px', padding: '14px', backgroundColor: '#f7f8fa', borderRadius: '4px', border: '1px solid #ddd' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 'bold', color: '#0f1111' }}>Demo Credentials:</p>
        <p style={{ margin: '0', fontSize: '12px', color: '#565959' }}>Email: admin@example.com</p>
        <p style={{ margin: '0', fontSize: '12px', color: '#565959' }}>Password: admin123</p>
      </div>
    </div>
  );
};

const AuthPage = () => {
  // Redirect to login page instead of showing modal
  React.useEffect(() => {
    window.location.href = '/login';
  }, []);

  return <div>Redirecting to login...</div>;
};

export default AuthPage;