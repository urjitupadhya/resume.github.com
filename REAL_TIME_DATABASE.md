# Real-Time Database Integration

This document describes the real-time database functionality implemented for the resume builder application.

## Overview

The application now stores all resume data in Firebase Realtime Database, providing:
- Real-time data synchronization
- Automatic saving as users type
- Persistent storage across sessions
- Multi-resume management
- User authentication integration

## Features

### 1. Real-Time Data Storage
- All resume data (experience, education, projects, etc.) is stored in Firebase Realtime Database
- Data is automatically saved as users make changes
- Real-time synchronization across multiple browser tabs/windows

### 2. Auto-Save Functionality
- Resume data is automatically saved with 1-second debouncing
- Visual indicators show save status (Ready, Saving, Saved, Error)
- No manual save required - all changes are preserved

### 3. Multi-Resume Management
- Users can create multiple resumes
- Each resume has a unique title and ID
- Easy switching between different resumes
- Resume list with statistics and metadata

### 4. User Authentication Integration
- Resumes are tied to authenticated users
- Secure access control - users can only access their own resumes
- Automatic user creation when first signing in

## Database Structure

```
users/
  {userId}/
    profile/
      name: string
      email: string
      avatar: string
      createdAt: timestamp
      updatedAt: timestamp
    resumes/
      {resumeId}/
        title: string
        githubUrl: string
        selectedRepos: string[]
        experience: Experience[]
        education: Education[]
        template: string
        colorScheme: string
        name: string
        role: string
        location: string
        bio: string
        links: {
          linkedin?: string
          twitter?: string
          website?: string
          email?: string
        }
        githubProfile: GitHubProfile
        repos: GitHubRepo[]
        summaries: Record<string, string[]>
        seoTitle: string
        seoDescription: string
        createdAt: timestamp
        updatedAt: timestamp
```

## Components

### 1. useResumeData Hook
Location: `hooks/use-resume-data.ts`

Provides:
- Real-time data synchronization
- CRUD operations for resumes
- Auto-save functionality
- Error handling

```typescript
const {
  resumes,
  currentResume,
  loading,
  error,
  saveResume,
  loadResume,
  deleteResume,
  autoSave,
  setCurrentResume,
  clearError,
} = useResumeData();
```

### 2. ResumeManager Component
Location: `components/ResumeManager.tsx`

Provides:
- List of all user resumes
- Create new resume functionality
- Load existing resume
- Delete resume with confirmation
- Resume statistics display

### 3. AutoSave Component
Location: `components/AutoSave.tsx`

Provides:
- Visual save status indicators
- Debounced auto-save functionality
- Real-time feedback to users

## API Routes

### Resume API
Location: `app/api/resume/route.ts`

Endpoints:
- `GET /api/resume` - Get all resumes for user
- `GET /api/resume?id={resumeId}` - Get specific resume
- `POST /api/resume` - Create new resume
- `PUT /api/resume` - Update existing resume
- `DELETE /api/resume?id={resumeId}` - Delete resume

## Usage Examples

### Creating a New Resume
```typescript
const { saveResume } = useResumeData();

const newResume = {
  title: "My Professional Resume",
  githubUrl: "",
  selectedRepos: [],
  experience: [],
  education: [],
  template: "modern",
  colorScheme: "default",
  links: {},
  repos: [],
  summaries: {},
  seoTitle: "",
  seoDescription: "",
};

const result = await saveResume(newResume);
```

### Loading a Resume
```typescript
const { loadResume } = useResumeData();

const resume = await loadResume("resume-id");
if (resume) {
  setState(resume);
}
```

### Auto-Save Integration
```typescript
import { AutoSave } from '@/components/AutoSave';

<AutoSave resumeData={state} enabled={!!session} />
```

## Firebase Configuration

Ensure your Firebase configuration includes the Realtime Database URL:

```typescript
const firebaseConfig = {
  // ... other config
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || 
    `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`,
};
```

## Security Rules

Make sure your Firebase Realtime Database has proper security rules:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid",
        "resumes": {
          ".read": "$uid === auth.uid",
          ".write": "$uid === auth.uid"
        }
      }
    }
  }
}
```

## Environment Variables

Required environment variables:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_DATABASE_URL` (optional, auto-generated if not provided)

## Benefits

1. **Data Persistence**: All resume data is automatically saved and persists across sessions
2. **Real-Time Sync**: Changes are immediately synchronized across all devices
3. **User Experience**: No manual saving required, seamless editing experience
4. **Scalability**: Firebase handles the infrastructure and scaling
5. **Security**: User data is properly isolated and secured
6. **Offline Support**: Firebase provides offline capabilities (can be extended)

## Future Enhancements

1. **Collaboration**: Real-time collaboration on resumes
2. **Version History**: Track changes and allow rollbacks
3. **Templates**: Pre-built resume templates
4. **Sharing**: Share resumes with others
5. **Analytics**: Track resume views and downloads
6. **Export Formats**: Additional export formats (PDF, DOCX, etc.)
