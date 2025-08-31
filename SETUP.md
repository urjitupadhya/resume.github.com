# Google Authentication & Firebase Setup Guide

## Prerequisites
- Node.js 18+ and pnpm installed
- Google Cloud Console account
- Firebase project

## Step 1: Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Google provider
   - Add your authorized domain (localhost:3000 for development)
4. Enable Firestore Database:
   - Go to Firestore Database
   - Create database in test mode
5. Get your Firebase config:
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Click on the web app icon
   - Copy the config object

## Step 2: Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Go to APIs & Services > Credentials
4. Click "Create Credentials" > "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Copy the Client ID and Client Secret

## Step 3: Environment Variables

Create a `.env.local` file in your project root with:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

## Step 4: Generate NextAuth Secret

Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

## Step 5: Firestore Security Rules

Update your Firestore security rules to allow NextAuth operations:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow NextAuth to manage user sessions
    match /__nextauth__/{document=**} {
      allow read, write: if true;
    }
    
    // Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Step 6: Run the Application

1. Install dependencies:
```bash
pnpm install
```

2. Start the development server:
```bash
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Available Routes

- `/` - Home page
- `/auth/signin` - Sign in page
- `/auth/signout` - Sign out page
- `/auth/error` - Authentication error page
- `/profile` - User profile page (protected)

## Components

- `AuthProvider` - Authentication context provider
- `UserProfile` - User profile dropdown component
- `ProtectedRoute` - Route protection component

## Usage Examples

### Protect a Route
```tsx
import { ProtectedRoute } from '../components/protected-route';

export default function ProtectedPage() {
  return (
    <ProtectedRoute>
      <div>This content is only visible to authenticated users</div>
    </ProtectedRoute>
  );
}
```

### Use Authentication in Components
```tsx
import { useAuth } from '../components/auth-provider';

export default function MyComponent() {
  const { user, isAuthenticated, signIn, signOut } = useAuth();
  
  if (!isAuthenticated) {
    return <button onClick={signIn}>Sign In</button>;
  }
  
  return (
    <div>
      <p>Welcome, {user?.name}!</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**: Check your Firebase API key in `.env.local`
2. **"Redirect URI mismatch"**: Verify redirect URIs in Google Cloud Console
3. **"Firebase not initialized"**: Ensure all environment variables are set
4. **Authentication not working**: Check browser console for errors

### Debug Mode

Enable NextAuth debug mode by adding to `.env.local`:
```bash
NEXTAUTH_DEBUG=true
```

## Production Deployment

1. Update environment variables with production values
2. Set `NEXTAUTH_URL` to your production domain
3. Update Google OAuth redirect URIs
4. Update Firebase authorized domains
5. Deploy to your hosting platform (Vercel, Netlify, etc.)

## Security Notes

- Never commit `.env.local` to version control
- Use strong, unique secrets for production
- Regularly rotate API keys and secrets
- Monitor Firebase usage and costs
- Implement rate limiting for production use








