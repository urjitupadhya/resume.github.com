import { ref, set, get, push, remove, update, query, orderByChild, limitToFirst, onValue, off } from 'firebase/database';
import { db } from '@/lib/firebase';

// Utility function to remove undefined values from objects
const removeUndefinedValues = (obj: any): any => {
  if (obj === null || obj === undefined) {
    return null;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(removeUndefinedValues).filter(item => item !== null);
  }
  
  if (typeof obj === 'object') {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = removeUndefinedValues(value);
      }
    }
    return cleaned;
  }
  
  return obj;
};

// User management functions
export const createUser = async (userId: string, userData: any) => {
  try {
    const userRef = ref(db, `users/${userId}`);
    
    // Check if user already exists to preserve existing data
    const existingUser = await getUser(userId);
    
    const finalUserData = {
      ...userData,
      // Preserve existing resumes if they exist
      resumes: existingUser?.resumes || userData.resumes || {},
      createdAt: existingUser?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await set(userRef, finalUserData);
    return { success: true, userId };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, error };
  }
};

export const getUser = async (userId: string) => {
  try {
    const userRef = ref(db, `users/${userId}`);
    const snapshot = await get(userRef);
    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const updateUser = async (userId: string, updates: any) => {
  try {
    const userRef = ref(db, `users/${userId}`);
    
    // Get existing user data to preserve resumes
    const existingUser = await getUser(userId);
    
    const finalUpdates = {
      ...updates,
      // Preserve existing resumes if they exist
      resumes: existingUser?.resumes || updates.resumes || {},
      updatedAt: new Date().toISOString(),
    };
    
    await update(userRef, finalUpdates);
    return { success: true };
  } catch (error) {
    console.error('Error updating user:', error);
    return { success: false, error };
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const userRef = ref(db, `users/${userId}`);
    await remove(userRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, error };
  }
};

// Resume management functions
export const createResume = async (userId: string, resumeData: any) => {
  try {
    console.log('createResume: Called with userId:', userId);
    console.log('createResume: User ID type:', typeof userId);
    console.log('createResume: User ID length:', userId?.length);
    console.log('createResume: Resume data:', resumeData);
    
    const resumesRef = ref(db, `users/${userId}/resumes`);
    console.log('createResume: Database path:', `users/${userId}/resumes`);
    
    const newResumeRef = push(resumesRef);
    const resumeId = newResumeRef.key;
    console.log('createResume: Generated resumeId:', resumeId);
    
    // Clean the data by removing undefined values
    const cleanedData = removeUndefinedValues({
      ...resumeData,
      id: resumeId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    console.log('createResume: Cleaned data:', cleanedData);
    await set(newResumeRef, cleanedData);
    console.log('createResume: Successfully saved to database');
    
    return { success: true, resumeId };
  } catch (error) {
    console.error('Error creating resume:', error);
    return { success: false, error };
  }
};

export const getResumes = async (userId: string) => {
  try {
    console.log('getResumes: Called with userId:', userId);
    console.log('getResumes: User ID type:', typeof userId);
    console.log('getResumes: User ID length:', userId?.length);
    
    const resumesRef = ref(db, `users/${userId}/resumes`);
    console.log('getResumes: Database path:', `users/${userId}/resumes`);
    
    const snapshot = await get(resumesRef);
    console.log('getResumes: Snapshot exists:', snapshot.exists());
    console.log('getResumes: Snapshot value:', snapshot.val());
    
    if (snapshot.exists()) {
      const resumes = snapshot.val();
      const result = Object.keys(resumes).map(key => ({
        id: key,
        ...resumes[key]
      }));
      console.log('getResumes: Returning resumes:', result);
      return result;
    }
    console.log('getResumes: No resumes found, returning empty array');
    return [];
  } catch (error) {
    console.error('Error getting resumes:', error);
    return [];
  }
};

export const getResume = async (userId: string, resumeId: string) => {
  try {
    const resumeRef = ref(db, `users/${userId}/resumes/${resumeId}`);
    const snapshot = await get(resumeRef);
    return snapshot.exists() ? { id: resumeId, ...snapshot.val() } : null;
  } catch (error) {
    console.error('Error getting resume:', error);
    return null;
  }
};

export const updateResume = async (userId: string, resumeId: string, updates: any) => {
  try {
    const resumeRef = ref(db, `users/${userId}/resumes/${resumeId}`);
    
    // Clean the data by removing undefined values
    const cleanedUpdates = removeUndefinedValues({
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    
    await update(resumeRef, cleanedUpdates);
    return { success: true };
  } catch (error) {
    console.error('Error updating resume:', error);
    return { success: false, error };
  }
};

export const deleteResume = async (userId: string, resumeId: string) => {
  try {
    const resumeRef = ref(db, `users/${userId}/resumes/${resumeId}`);
    await remove(resumeRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting resume:', error);
    return { success: false, error };
  }
};

// Real-time listeners
export const subscribeToUser = (userId: string, callback: (userData: any) => void) => {
  const userRef = ref(db, `users/${userId}`);
  const unsubscribe = onValue(userRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    } else {
      callback(null);
    }
  });
  
  return () => off(userRef, 'value', unsubscribe);
};

export const subscribeToResumes = (userId: string, callback: (resumes: any[]) => void) => {
  console.log('subscribeToResumes: Setting up subscription for userId:', userId);
  console.log('subscribeToResumes: User ID type:', typeof userId);
  console.log('subscribeToResumes: User ID length:', userId?.length);
  
  const resumesRef = ref(db, `users/${userId}/resumes`);
  console.log('subscribeToResumes: Database path:', `users/${userId}/resumes`);
  
  const unsubscribe = onValue(resumesRef, (snapshot) => {
    console.log('subscribeToResumes: Snapshot received:', snapshot.exists(), snapshot.val());
    if (snapshot.exists()) {
      const resumes = snapshot.val();
      console.log('subscribeToResumes: Raw resumes data:', resumes);
      const resumeList = Object.keys(resumes).map(key => ({
        id: key,
        ...resumes[key]
      }));
      console.log('subscribeToResumes: Processed resumeList:', resumeList);
      callback(resumeList);
    } else {
      console.log('subscribeToResumes: No resumes found, calling callback with empty array');
      callback([]);
    }
  });
  
  return () => {
    console.log('subscribeToResumes: Cleaning up subscription');
    off(resumesRef, 'value', unsubscribe);
  };
};

// Search and query functions
export const searchUsersByEmail = async (email: string) => {
  try {
    const usersRef = ref(db, 'users');
    const emailQuery = query(usersRef, orderByChild('email'), limitToFirst(10));
    const snapshot = await get(emailQuery);
    
    if (snapshot.exists()) {
      const users = snapshot.val();
      return Object.keys(users).map(key => ({
        id: key,
        ...users[key]
      }));
    }
    return [];
  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
};

// Database structure helper
export const getDatabaseStructure = () => {
  return {
    users: {
      [':userId']: {
        profile: {
          name: 'string',
          email: 'string',
          avatar: 'string',
          createdAt: 'timestamp',
          updatedAt: 'timestamp'
        },
        resumes: {
          [':resumeId']: {
            title: 'string',
            content: 'object',
            template: 'string',
            createdAt: 'timestamp',
            updatedAt: 'timestamp'
          }
        },
        settings: {
          theme: 'string',
          notifications: 'boolean'
        }
      }
    },
    sessions: {
      [':sessionId']: {
        sessionToken: 'string',
        userId: 'string',
        expires: 'timestamp'
      }
    },
    accounts: {
      [':accountId']: {
        userId: 'string',
        provider: 'string',
        providerAccountId: 'string',
        accessToken: 'string',
        refreshToken: 'string'
      }
    }
  };
};
