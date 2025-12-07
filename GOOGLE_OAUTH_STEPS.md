# Complete Google OAuth Setup Steps

## Current Status: ✅ Project Created (My First Project)

## Next Steps:

### Step 1: Enable Google+ API
1. In Google Cloud Console, use the search bar at top
2. Search for "**Google+ API**" or "**People API**"
3. Click on it and click "**ENABLE**"

### Step 2: Configure OAuth Consent Screen
1. Click hamburger menu (☰) → "**APIs & Services**" → "**OAuth consent screen**"
2. Select "**External**" → Click "**CREATE**"
3. Fill in the form:
   - **App name**: `E-commerce App`
   - **User support email**: `murali.thangella@gmail.com`
   - **App logo**: (Optional - skip for now)
   - **App domain**: (Optional - skip for now)
   - **Authorized domains**: (Optional - skip for now)
   - **Developer contact email**: `murali.thangella@gmail.com`
4. Click "**SAVE AND CONTINUE**"
5. **Scopes page**: Click "**ADD OR REMOVE SCOPES**"
   - Select: `userinfo.email` and `userinfo.profile`
   - Click "**UPDATE**" → "**SAVE AND CONTINUE**"
6. **Test users page**: Click "**SAVE AND CONTINUE**" (skip for now)
7. **Summary page**: Click "**BACK TO DASHBOARD**"

### Step 3: Create OAuth Client ID
1. Go to "**APIs & Services**" → "**Credentials**"
2. Click "**+ CREATE CREDENTIALS**" at top
3. Select "**OAuth client ID**"
4. If prompted to configure consent screen, complete Step 2 first
5. Fill in:
   - **Application type**: `Web application`
   - **Name**: `E-commerce Web Client`
   - **Authorized JavaScript origins**: 
     - Click "**+ ADD URI**"
     - Enter: `http://localhost:3000`
   - **Authorized redirect URIs**:
     - Click "**+ ADD URI**"
     - Enter: `http://localhost:5000/api/auth/google/callback`
6. Click "**CREATE**"
7. A popup will show your credentials:
   - **Client ID**: Copy this (looks like: xxxxx.apps.googleusercontent.com)
   - **Client Secret**: Copy this (looks like: GOCSPX-xxxxx)

### Step 4: Update .env File
1. Open `backend/.env` file
2. Replace:
   - `YOUR_CLIENT_ID_HERE` with your actual Client ID
   - `YOUR_CLIENT_SECRET_HERE` with your actual Client Secret
3. Save the file

### Step 5: Test the Integration
1. Restart your backend server
2. Go to http://localhost:3000/login
3. Click "Continue with Google"
4. Login with your Google account
5. You should be redirected back to the app

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Make sure redirect URI in Google Console exactly matches: `http://localhost:5000/api/auth/google/callback`
- No trailing slash
- Check for typos

### Error: "Access blocked: This app's request is invalid"
- Complete OAuth consent screen configuration
- Add test users if app is not published

### Error: "invalid_client"
- Check Client ID and Client Secret are correct in .env file
- Restart backend server after updating .env

## Quick Navigation URLs
- OAuth Consent Screen: https://console.cloud.google.com/apis/credentials/consent
- Credentials: https://console.cloud.google.com/apis/credentials
- APIs & Services: https://console.cloud.google.com/apis/dashboard
