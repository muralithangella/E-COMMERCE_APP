# Google SSO Setup Guide

## 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen:
   - User Type: External
   - App name: Your E-commerce App
   - User support email: your-email@example.com
   - Developer contact: your-email@example.com
6. Create OAuth Client ID:
   - Application type: Web application
   - Name: E-commerce Web Client
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
7. Copy **Client ID** and **Client Secret**

## 2. Configure Backend

Create `.env` file in `backend/` directory:

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
SESSION_SECRET=random-secret-key-here
```

## 3. How It Works

1. User clicks "Continue with Google" button
2. Redirected to Google login page
3. After authentication, Google redirects back to callback URL
4. Backend creates/finds user and generates JWT tokens
5. User is redirected to homepage with authentication cookies

## 4. Security Features

- HTTP-only cookies for token storage
- Session management with express-session
- Automatic user creation on first login
- Email verification through Google
- Secure password hashing for fallback authentication

## 5. Testing

1. Start backend: `npm start` (from backend directory)
2. Start frontend: `npm run start:shell` (from root)
3. Go to http://localhost:3000/login
4. Click "Continue with Google"
5. Login with your Google account

## 6. Production Setup

For production, update:
- Authorized JavaScript origins: `https://yourdomain.com`
- Authorized redirect URIs: `https://yourdomain.com/api/auth/google/callback`
- Set `secure: true` in cookie options
- Use environment variables for all secrets
