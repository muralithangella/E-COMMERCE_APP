# Google reCAPTCHA Setup Guide

## 1. Get reCAPTCHA Keys

1. Go to [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Click "+" to create a new site
3. Fill in:
   - **Label**: Your app name (e.g., "E-commerce App")
   - **reCAPTCHA type**: Select "reCAPTCHA v2" → "I'm not a robot" Checkbox
   - **Domains**: Add `localhost` for development
4. Accept terms and submit
5. Copy your **Site Key** and **Secret Key**

## 2. Configure Backend

Add to `backend/.env`:
```env
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

## 3. Configure Frontend

Add to `frontend/auth-mf/.env`:
```env
REACT_APP_RECAPTCHA_SITE_KEY=your_site_key_here
```

## 4. Install Dependencies

```bash
# Backend
cd backend/auth-service
npm install

# Frontend
cd frontend/auth-mf
npm install
```

## 5. Test

1. Start auth service: `npm start` (in backend/auth-service)
2. Start auth frontend: `npm start` (in frontend/auth-mf)
3. Navigate to login page
4. Complete the reCAPTCHA checkbox before logging in

## Testing Keys (Development Only)

Google provides test keys that always pass:
- **Site Key**: `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`
- **Secret Key**: `6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe`

These are already set as defaults in the code for quick testing.
