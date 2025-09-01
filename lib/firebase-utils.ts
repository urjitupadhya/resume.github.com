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
    
    // Process experience data to ensure all fields are properly set
    let processedExperience = [];
    if (Array.isArray(resumeData.experience)) {
      console.log('createResume: Processing experience data:', resumeData.experience);
      processedExperience = resumeData.experience.map(exp => ({
        id: exp.id || crypto.randomUUID(),
        title: exp.title || '',
        company: exp.company || '',
        start: exp.start || '',
        end: exp.end || '',
        bullets: Array.isArray(exp.bullets) ? exp.bullets : [],
        tech: exp.tech || ''
      }));
      console.log('createResume: Processed experience data:', processedExperience);
    } else {
      console.log('createResume: No experience data found in resumeData');
    }
    
    // Ensure experience and education arrays are properly initialized
    const enhancedData = {
      ...resumeData,
      id: resumeId,
      name: typeof resumeData.name === 'string' ? resumeData.name : "",
      githubUrl: typeof resumeData.githubUrl === 'string' ? resumeData.githubUrl : "",
      githubId: typeof resumeData.githubId === 'string' ? resumeData.githubId : "",
      experience: processedExperience,
      education: Array.isArray(resumeData.education) ? resumeData.education : [],
      selectedRepos: Array.isArray(resumeData.selectedRepos) ? resumeData.selectedRepos : [],
      repos: Array.isArray(resumeData.repos) ? resumeData.repos : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Ensure name, githubId and githubUrl are properly set and logged
    console.log('createResume: Name before saving:', enhancedData.name);
    console.log('createResume: GitHub URL before saving:', enhancedData.githubUrl);
    console.log('createResume: GitHub ID before saving:', enhancedData.githubId);
    
    console.log('createResume: Enhanced data:', enhancedData);
    console.log('createResume: Experience data:', enhancedData.experience);
    console.log('createResume: Education data:', enhancedData.education);
    console.log('createResume: GitHub URL:', enhancedData.githubUrl);
    console.log('createResume: GitHub ID:', enhancedData.githubId);
    
    // Clean the data by removing undefined values
    const cleanedData = removeUndefinedValues(enhancedData);
    
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
    // Sanitize resumeId to remove invalid Firebase path characters
    const sanitizedResumeId = resumeId.replace(/[.#$\[\]]/g, '_');
    
    const resumeRef = ref(db, `users/${userId}/resumes/${sanitizedResumeId}`);
    const snapshot = await get(resumeRef);
    return snapshot.exists() ? { id: resumeId, ...snapshot.val() } : null;
  } catch (error) {
    console.error('Error getting resume:', error);
    return null;
  }
};

export const updateResume = async (userId: string, resumeId: string, updates: any) => {
  try {
    // Sanitize resumeId to remove invalid Firebase path characters
    const sanitizedResumeId = resumeId.replace(/[.#$\[\]]/g, '_');
    
    const resumeRef = ref(db, `users/${userId}/resumes/${sanitizedResumeId}`);
    
    // Get existing resume data to ensure we don't lose any fields
    const existingResume = await getResume(userId, resumeId);
    
    // Process experience data to ensure all fields are properly set
    let processedExperience = [];
    if (Array.isArray(updates.experience)) {
      console.log('updateResume: Processing experience data from updates:', updates.experience);
      processedExperience = updates.experience.map(exp => ({
        id: exp.id || crypto.randomUUID(),
        title: exp.title || '',
        company: exp.company || '',
        start: exp.start || '',
        end: exp.end || '',
        bullets: Array.isArray(exp.bullets) ? exp.bullets : [],
        tech: exp.tech || ''
      }));
      console.log('updateResume: Processed experience data:', processedExperience);
    } else if (Array.isArray(existingResume?.experience)) {
      console.log('updateResume: Using existing experience data:', existingResume.experience);
      processedExperience = existingResume.experience;
    } else {
      console.log('updateResume: No experience data found in updates or existing resume');
    }
    
    // Ensure experience and education arrays are preserved
    const mergedUpdates = {
      ...existingResume,
      ...updates,
      // Explicitly preserve these arrays if they exist in updates
      name: typeof updates.name === 'string' ? updates.name : (existingResume?.name || ""),
      githubUrl: typeof updates.githubUrl === 'string' ? updates.githubUrl : (existingResume?.githubUrl || ""),
      githubId: typeof updates.githubId === 'string' ? updates.githubId : (existingResume?.githubId || ""),
      experience: processedExperience,
      education: updates.education || existingResume?.education || [],
      selectedRepos: updates.selectedRepos || existingResume?.selectedRepos || [],
      repos: updates.repos || existingResume?.repos || [],
      updatedAt: new Date().toISOString(),
    };
    
    // Ensure name, githubId and githubUrl are properly set and logged
    console.log('updateResume: Name before saving:', mergedUpdates.name);
    console.log('updateResume: GitHub URL before saving:', mergedUpdates.githubUrl);
    console.log('updateResume: GitHub ID before saving:', mergedUpdates.githubId);
    
    console.log('updateResume: Merged updates:', mergedUpdates);
    console.log('updateResume: Experience data:', mergedUpdates.experience);
    console.log('updateResume: Education data:', mergedUpdates.education);
    console.log('updateResume: GitHub URL:', mergedUpdates.githubUrl);
    console.log('updateResume: GitHub ID:', mergedUpdates.githubId);
    
    // Clean the data by removing undefined values
    const cleanedUpdates = removeUndefinedValues(mergedUpdates);
    
    await update(resumeRef, cleanedUpdates);
    return { success: true };
  } catch (error) {
    console.error('Error updating resume:', error);
    return { success: false, error };
  }
};

export const deleteResume = async (userId: string, resumeId: string) => {
  try {
    // Sanitize resumeId to remove invalid Firebase path characters
    const sanitizedResumeId = resumeId.replace(/[.#$\[\]]/g, '_');
    
    const resumeRef = ref(db, `users/${userId}/resumes/${sanitizedResumeId}`);
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

// Function to fetch GitHub profile name from resume
export const fetchGitHubProfileName = async (userId: string, resumeId: string) => {
  try {
    console.log('fetchGitHubProfileName: Called with userId:', userId, 'resumeId:', resumeId);
    
    // Sanitize resumeId to remove invalid Firebase path characters
    const sanitizedResumeId = resumeId.replace(/[.#$\[\]]/g, '_');
    
    const resumeRef = ref(db, `users/${userId}/resumes/${sanitizedResumeId}`);
    const snapshot = await get(resumeRef);
    
    if (snapshot.exists()) {
      const resumeData = snapshot.val();
      console.log('fetchGitHubProfileName: Resume data:', resumeData);
      
      // First try to get the name directly from the resume data
      if (resumeData.name) {
        console.log('fetchGitHubProfileName: Found name in resume data:', resumeData.name);
        return { success: true, name: resumeData.name };
      }
      
      // If no name in resume data, try to get it from the GitHub profile
      if (resumeData.githubProfile && resumeData.githubProfile.name) {
        console.log('fetchGitHubProfileName: Found name in GitHub profile:', resumeData.githubProfile.name);
        return { success: true, name: resumeData.githubProfile.name };
      }
      
      // If no name in GitHub profile, try to use the GitHub ID
      if (resumeData.githubId) {
        console.log('fetchGitHubProfileName: Using GitHub ID as name:', resumeData.githubId);
        return { success: true, name: resumeData.githubId };
      }
      
      // If no name found anywhere, return an error
      return { success: false, error: 'No name found in resume data' };
    }
    
    return { success: false, error: 'Resume not found' };
  } catch (error) {
    console.error('Error fetching GitHub profile name:', error);
    return { success: false, error: 'Error fetching GitHub profile name' };
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
