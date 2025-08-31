import { ref, set, get, push, remove, update, query, orderByChild, limitToFirst, onValue, off } from 'firebase/database';
import { db } from './firebase';

// User management functions
export const createUser = async (userId: string, userData: any) => {
  try {
    const userRef = ref(db, `users/${userId}`);
    await set(userRef, {
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
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
    await update(userRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
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
    const resumesRef = ref(db, `users/${userId}/resumes`);
    const newResumeRef = push(resumesRef);
    const resumeId = newResumeRef.key;
    
    await set(newResumeRef, {
      ...resumeData,
      id: resumeId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    return { success: true, resumeId };
  } catch (error) {
    console.error('Error creating resume:', error);
    return { success: false, error };
  }
};

export const getResumes = async (userId: string) => {
  try {
    const resumesRef = ref(db, `users/${userId}/resumes`);
    const snapshot = await get(resumesRef);
    
    if (snapshot.exists()) {
      const resumes = snapshot.val();
      return Object.keys(resumes).map(key => ({
        id: key,
        ...resumes[key]
      }));
    }
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
    await update(resumeRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
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
  const resumesRef = ref(db, `users/${userId}/resumes`);
  const unsubscribe = onValue(resumesRef, (snapshot) => {
    if (snapshot.exists()) {
      const resumes = snapshot.val();
      const resumeList = Object.keys(resumes).map(key => ({
        id: key,
        ...resumes[key]
      }));
      callback(resumeList);
    } else {
      callback([]);
    }
  });
  
  return () => off(resumesRef, 'value', unsubscribe);
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
