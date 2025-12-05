import React from 'react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#232f3e', color: 'white', marginTop: '40px' }}>
      {/* Back to top */}
      <div 
        style={{
          backgroundColor: '#37475a',
          textAlign: 'center',
          padding: '15px',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: '700'
        }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        Back to top
      </div>

      {/* Main footer content */}
      <div style={{ padding: '40px 0', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '40px',
          padding: '0 20px'
        }}>
          {/* Get to Know Us */}
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '14px' }}>Get to Know Us</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '8px' }}>
                <a href="#" style={{ color: '#ddd', textDecoration: 'none', fontSize: '14px' }}>About Amazon</a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="#" style={{ color: '#ddd', textDecoration: 'none', fontSize: '14px' }}>Careers</a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="#" style={{ color: '#ddd', textDecoration: 'none', fontSize: '14px' }}>Press Releases</a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="#" style={{ color: '#ddd', textDecoration: 'none', fontSize: '14px' }}>Amazon Science</a>
              </li>
            </ul>
          </div>

          {/* Connect with Us */}
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '14px' }}>Connect with Us</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '8px' }}>
                <a href="#" style={{ color: '#ddd', textDecoration: 'none', fontSize: '14px' }}>Facebook</a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="#" style={{ color: '#ddd', textDecoration: 'none', fontSize: '14px' }}>Twitter</a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="#" style={{ color: '#ddd', textDecoration: 'none', fontSize: '14px' }}>Instagram</a>
              </li>
            </ul>
          </div>

          {/* Make Money with Us */}
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '14px' }}>Make Money with Us</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '8px' }}>
                <a href="#" style={{ color: '#ddd', textDecoration: 'none', fontSize: '14px' }}>Sell on Amazon</a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="#" style={{ color: '#ddd', textDecoration: 'none', fontSize: '14px' }}>Sell under Amazon Accelerator</a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="#" style={{ color: '#ddd', textDecoration: 'none', fontSize: '14px' }}>Protect and Build Your Brand</a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="#" style={{ color: '#ddd', textDecoration: 'none', fontSize: '14px' }}>Amazon Global Selling</a>
              </li>
            </ul>
          </div>

          {/* Let Us Help You */}
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '14px' }}>Let Us Help You</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '8px' }}>
                <a href="#" style={{ color: '#ddd', textDecoration: 'none', fontSize: '14px' }}>COVID-19 and Amazon</a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="#" style={{ color: '#ddd', textDecoration: 'none', fontSize: '14px' }}>Your Account</a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="#" style={{ color: '#ddd', textDecoration: 'none', fontSize: '14px' }}>Returns Centre</a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="#" style={{ color: '#ddd', textDecoration: 'none', fontSize: '14px' }}>Help</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div style={{
        borderTop: '1px solid #3a4553',
        padding: '30px 0',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#ff9f00' }}>amazon</span>
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>.in</span>
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '20px',
          fontSize: '12px',
          color: '#ccc'
        }}>
          <span>🇮🇳 India</span>
        </div>
      </div>

      {/* Copyright */}
      <div style={{
        backgroundColor: '#131a22',
        padding: '20px',
        textAlign: 'center',
        fontSize: '11px',
        color: '#ddd'
      }}>
        <div style={{ marginBottom: '10px' }}>
          © 1996-2024, Amazon.com, Inc. or its affiliates
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <a href="#" style={{ color: '#ddd', textDecoration: 'none' }}>Conditions of Use & Sale</a>
          <a href="#" style={{ color: '#ddd', textDecoration: 'none' }}>Privacy Notice</a>
          <a href="#" style={{ color: '#ddd', textDecoration: 'none' }}>Interest-Based Ads</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;