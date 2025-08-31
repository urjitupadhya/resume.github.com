# 🔥 Firebase Realtime Database & Google Authentication Setup Guide

## 🚀 **Complete Setup Instructions**

### **Step 1: Create Environment Variables File**

Create a `.env.local` file in your project root with these exact values:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBxGgOeJfcI-MlVjCcoHhDXGYGJtfK3kgk
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=resume-builder-415208.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=resume-builder-415208
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=resume-builder-415208.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=10987654321
NEXT_PUBLIC_FIREBASE_APP_ID=1:10987654321:web:abc123def456

# Google OAuth
GOOGLE_CLIENT_ID=10987654321-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz123456

# NextAuth
NEXTAUTH_SECRET=your_generated_secret_here
NEXTAUTH_URL=http://localhost:3000
```

### **Step 2: Generate NextAuth Secret**

Run this command in your terminal:
```bash
openssl rand -base64 32
```

Copy the output and replace `your_generated_secret_here` in your `.env.local` file.

### **Step 3: Firebase Console Setup**

1. **Go to [Firebase Console](https://console.firebase.google.com/)**
2. **Create New Project** (or use existing):
   - Project name: `resume-builder-415208`
   - Enable Google Analytics (optional)
   - Click "Create project"

3. **Enable Authentication**:
   - Go to Authentication → Sign-in method
   - Click "Google" provider
   - Enable it
   - Add authorized domain: `localhost`
   - Click "Save"

4. **Enable Realtime Database**:
   - Go to Realtime Database
   - Click "Create Database"
   - Choose location (closest to your users)
   - Start in test mode (for development)
   - Click "Done"

5. **Get Project Configuration**:
   - Go to Project Settings (gear icon)
   - Scroll down to "Your apps"
   - Click "Web app" icon (</>)
   - Register app with nickname: "Resume Builder Web"
   - Copy the config object

### **Step 4: Google Cloud Console Setup**

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Select your Firebase project** (`resume-builder-415208`)
3. **Enable APIs**:
   - Go to APIs & Services → Library
   - Search for "Google+ API" and enable it
   - Search for "Google Identity" and enable it

4. **Create OAuth Credentials**:
   - Go to APIs & Services → Credentials
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Name: "Resume Builder Web Client"
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
     - `http://localhost:3000/auth/callback/google`
   - Click "Create"
   - Copy Client ID and Client Secret

### **Step 5: Update Environment Variables**

Replace the placeholder values in your `.env.local` with the actual values from Firebase and Google:

```bash
# Replace these with your actual values:
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

GOOGLE_CLIENT_ID=your_actual_client_id
GOOGLE_CLIENT_SECRET=your_actual_client_secret
```

### **Step 6: Database Security Rules**

In Firebase Console → Realtime Database → Rules, update the rules to:

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null",
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid == $uid",
        ".write": "auth != null && auth.uid == $uid"
      }
    },
    "sessions": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "accounts": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "verificationTokens": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

### **Step 7: Test the Application**

1. **Start the development server**:
   ```bash
   pnpm dev
   ```

2. **Open [http://localhost:3000](http://localhost:3000)**

3. **Test the authentication flow**:
   - Click "Sign In" in navigation
   - Complete Google OAuth
   - Check if you're redirected back
   - Verify user profile is created

## 🔧 **Troubleshooting Common Issues**

### **Issue 1: "Invalid API key" error**
- ✅ Check your Firebase API key in `.env.local`
- ✅ Ensure the key matches exactly from Firebase Console
- ✅ Restart your dev server after updating environment variables

### **Issue 2: "Redirect URI mismatch" error**
- ✅ Verify redirect URIs in Google Cloud Console
- ✅ Check that `http://localhost:3000/api/auth/callback/google` is added
- ✅ Ensure no extra spaces or characters

### **Issue 3: "Firebase not initialized" error**
- ✅ Check browser console for missing environment variables
- ✅ Verify all Firebase config values are set
- ✅ Ensure `.env.local` is in project root (same level as `package.json`)

### **Issue 4: Authentication not working**
- ✅ Check browser console for errors
- ✅ Verify Google OAuth is enabled in Firebase
- ✅ Ensure authorized domains include `localhost`
- ✅ Check if NextAuth secret is generated and set

### **Issue 5: Database operations failing**
- ✅ Verify Realtime Database is created (not Firestore)
- ✅ Check database security rules
- ✅ Ensure database location is set
- ✅ Check if database is in test mode

## 📱 **What You Should See After Setup**

### **Before Authentication:**
- Navigation shows "Sign In" button
- Homepage loads without errors
- No user-specific content visible

### **After Authentication:**
- Navigation shows user avatar and "Profile" link
- Dashboard link appears in navigation
- User can access `/profile` and `/dashboard`
- Real-time data syncs with Firebase

### **Database Structure Created:**
```
resume-builder-415208-default-rtdb/
├── users/
│   └── [userId]/
│       ├── profile/
│       ├── resumes/
│       └── settings/
├── sessions/
├── accounts/
└── verificationTokens/
```

## 🎯 **Testing Checklist**

- [ ] Environment variables file created
- [ ] Firebase project configured
- [ ] Authentication enabled with Google
- [ ] Realtime Database created
- [ ] Google OAuth credentials set up
- [ ] NextAuth secret generated
- [ ] App starts without errors
- [ ] Sign-in button visible
- [ ] Google authentication works
- [ ] User redirected after sign-in
- [ ] Profile page accessible
- [ ] Dashboard shows user data
- [ ] Resume creation works
- [ ] Data persists in Firebase

## 🚀 **Next Steps After Setup**

1. **Customize the resume builder** - Add more templates and fields
2. **Implement real-time collaboration** - Multiple users editing same resume
3. **Add export functionality** - PDF, DOCX export
4. **Implement ATS scoring** - Resume optimization suggestions
5. **Add analytics** - Track user engagement and resume performance

## 📞 **Need Help?**

If you encounter issues:
1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Ensure Firebase project is properly configured
4. Check Google OAuth redirect URIs
5. Restart your development server after changes

The setup should work smoothly once all credentials are properly configured! 🎉
