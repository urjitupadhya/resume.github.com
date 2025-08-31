# Firebase Realtime Database Setup Guide

## Overview
This application now uses Firebase Realtime Database (RTDB) instead of Firestore for storing resume data. This provides real-time synchronization and better performance for this use case.

## Database Structure

The Realtime Database follows this structure:

```
/users/{userId}/
├── profile/
│   ├── name
│   ├── email
│   ├── avatar
│   ├── createdAt
│   └── updatedAt
├── resumes/
│   ├── {resumeId}/
│   │   ├── uid
│   │   ├── resumeName
│   │   ├── jobTitle
│   │   ├── companyName
│   │   ├── jobDescription
│   │   ├── analysisResult
│   │   ├── coverLetter
│   │   ├── fileName
│   │   ├── fileSize
│   │   ├── fileType
│   │   ├── createdAt
│   │   └── updatedAt
│   └── ...
└── settings/
    ├── theme
    └── notifications
```

## Setup Instructions

### 1. Enable Realtime Database
1. Go to Firebase Console
2. Select your project
3. Navigate to "Realtime Database" in the left sidebar
4. Click "Create Database"
5. Choose a location (preferably close to your users)
6. Start in test mode (we'll add security rules later)

### 2. Set Security Rules
1. In the Realtime Database section, go to "Rules" tab
2. Replace the default rules with the contents of `firebase-rules.json`
3. Click "Publish"

### 3. Update Environment Variables
Make sure your `.env.local` file includes the Realtime Database URL:

```bash
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.firebaseio.com
```

### 4. Test the Connection
1. Start the development server: `pnpm dev`
2. Navigate to the ATS Score page
3. Sign in with Google
4. Click the "Test Database Connection" button
5. You should see a success message with a record ID

## Features

### Resume Management
- **Create Resume**: Saves resume analysis results to RTDB
- **List Resumes**: Fetches all resumes for the current user
- **Update Resume**: Updates existing resume data
- **Delete Resume**: Removes resume from database

### Real-time Updates
- Data automatically syncs across all connected clients
- Changes are reflected immediately without page refresh

### Data Validation
- Security rules ensure users can only access their own data
- Required fields are validated before saving

## API Functions

The application uses these utility functions from `lib/firebase-utils.ts`:

- `createResume(userId, resumeData)` - Create new resume
- `getResumes(userId)` - Get all resumes for user
- `getResume(userId, resumeId)` - Get specific resume
- `updateResume(userId, resumeId, updates)` - Update resume
- `deleteResume(userId, resumeId)` - Delete resume
- `subscribeToResumes(userId, callback)` - Real-time listener

## Troubleshooting

### Common Issues

1. **Permission Denied**
   - Check that security rules are properly set
   - Ensure user is authenticated
   - Verify the database URL is correct

2. **Data Not Saving**
   - Check browser console for errors
   - Verify Firebase configuration
   - Test database connection using the test button

3. **Real-time Updates Not Working**
   - Check network connection
   - Verify Firebase project settings
   - Ensure proper authentication

### Debug Mode
Enable debug logging by adding to your `.env.local`:
```bash
NEXT_PUBLIC_FIREBASE_DEBUG=true
```

## Migration from Firestore

If you were previously using Firestore:
1. Export your data from Firestore
2. Import it into Realtime Database using the Firebase Console
3. Update your application code (already done in this version)
4. Test thoroughly before switching production traffic

## Performance Considerations

- RTDB is optimized for real-time applications
- Data is stored as JSON and can be queried efficiently
- Consider data structure for optimal performance
- Use indexing for complex queries

## Security Best Practices

- Always validate data on the server side
- Use security rules to restrict access
- Never store sensitive information in client-side code
- Regularly audit your security rules
- Use Firebase Auth for user authentication


