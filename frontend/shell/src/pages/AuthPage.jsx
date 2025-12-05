import React, { Suspense, useState } from 'react';

const AuthApp = React.lazy(() => import('auth/AuthApp').catch(() => ({ default: () => <SimpleLoginForm /> })));

const SimpleLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const body = isRegister 
        ? { name, email, password }
        : { email, password };

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Include cookies
        body: JSON.stringify(body)
      });

      const data = await response.json();
      console.log('Login response:', { status: response.status, data });
      
      if (response.ok && data.success) {
        // Tokens are now stored in HTTP-only cookies automatically
        console.log('Login successful, redirecting...');
        window.location.href = '/';
      } else {
        console.log('Login failed:', data);
        setError(data.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>{isRegister ? 'Register' : 'Login'}</h2>
      
      {error && (
        <div style={{ 
          padding: '0.75rem', 
          marginBottom: '1rem', 
          backgroundColor: '#fee', 
          color: '#c33', 
          border: '1px solid #fcc', 
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
        )}
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#ff9f00',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {loading ? (isRegister ? 'Creating Account...' : 'Signing In...') : (isRegister ? 'Create Account' : 'Sign In')}
        </button>
      </form>
      
      <div style={{ textAlign: 'center', margin: '1rem 0' }}>
        <button
          type="button"
          onClick={() => {
            setIsRegister(!isRegister);
            setError('');
            setName('');
            setEmail('');
            setPassword('');
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#007bff',
            cursor: 'pointer',
            textDecoration: 'underline',
            fontSize: '14px'
          }}
        >
          {isRegister ? 'Already have an account? Sign In' : 'Need an account? Create one'}
        </button>
      </div>
      
      <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <p style={{ margin: '0 0 0.5rem 0', fontSize: '14px', fontWeight: 'bold' }}>Test Credentials:</p>
        <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>Email: admin@example.com</p>
        <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>Password: admin123</p>
      </div>
    </div>
  );
};

const AuthPage = () => {
  const [shouldRedirect, setShouldRedirect] = React.useState(false);

  // Check if already logged in by testing an authenticated endpoint
  React.useEffect(() => {
    fetch('http://localhost:5000/api/test', {
      credentials: 'include'
    })
    .then(response => {
      if (response.ok) {
        // User is likely authenticated, but we'll let the app handle this
        // setShouldRedirect(true);
        // window.location.href = '/';
      }
    })
    .catch(() => {
      // Not authenticated, stay on auth page
    });
  }, []);

  if (shouldRedirect) {
    return <div>Redirecting...</div>;
  }

  return (
    <div>
      <Suspense fallback={<div>Loading authentication...</div>}>
        <AuthApp />
      </Suspense>
    </div>
  );
};

export default AuthPage;