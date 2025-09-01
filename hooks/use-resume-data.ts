import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { 
  createResume, 
  getResumes, 
  getResume, 
  updateResume, 
  deleteResume, 
  subscribeToResumes 
} from '@/lib/firebase-utils';

export interface ResumeData {
  id?: string;
  title: string;
  githubUrl: string;
  githubId?: string; // GitHub username/ID
  selectedRepos: string[];
  experience: Experience[];
  education: Education[];
  template: "modern" | "creative" | "corporate" | "developer";
  colorScheme: "default" | "green" | "gray";
  name?: string;
  role?: string;
  location?: string;
  bio?: string;
  links: {
    linkedin?: string;
    twitter?: string;
    website?: string;
    email?: string;
  };
  githubProfile?: GitHubProfile;
  repos: GitHubRepo[];
  summaries?: Record<string, string[]>;
  seoTitle?: string;
  seoDescription?: string;
  noexperienced?: boolean; // Flag for no experience
  createdAt?: string;
  updatedAt?: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  start: string;
  end: string;
  bullets: string[];
  tech: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  year: string;
  gpa?: string;
  notes?: string;
}

export interface GitHubProfile {
  login: string;
  name?: string;
  bio?: string;
  avatar_url?: string;
  location?: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description?: string;
  language?: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  html_url: string;
}

// Helper function to ensure resume data has proper structure
const ensureResumeStructure = (resume: any): ResumeData => {
  // Make sure we have a valid resume object
  if (!resume) {
    console.error('ensureResumeStructure: Resume is null or undefined');
    resume = {};
  }
  
  // Ensure experience is properly initialized and each experience has all required fields
  let experience = [];
  if (Array.isArray(resume.experience)) {
    experience = resume.experience.map(exp => ({
      id: exp.id || crypto.randomUUID(),
      title: exp.title || '',
      company: exp.company || '',
      start: exp.start || '',
      end: exp.end || '',
      bullets: Array.isArray(exp.bullets) ? exp.bullets : [],
      tech: exp.tech || ''
    }));
  }
  
  // Ensure education is properly initialized
  const education = Array.isArray(resume.education) ? resume.education : [];
  
  // Ensure selectedRepos is properly initialized
  const selectedRepos = Array.isArray(resume.selectedRepos) ? resume.selectedRepos : [];
  
  // Ensure repos is properly initialized
  const repos = Array.isArray(resume.repos) ? resume.repos : [];
  
  // Ensure githubUrl is a string
  const githubUrl = typeof resume.githubUrl === 'string' ? resume.githubUrl : "";
  
  const baseResume = {
    id: resume.id,
    title: resume.title || "New Resume",
    githubUrl: githubUrl,
    githubId: resume.githubId || '',
    selectedRepos: selectedRepos,
    experience: experience,
    education: education,
    template: resume.template || "modern",
    colorScheme: resume.colorScheme || "default",
    links: resume.links ? Object.fromEntries(
      Object.entries(resume.links).filter(([_, value]) => value !== undefined && value !== null && value !== '')
    ) : {},
    repos: repos,
    summaries: resume.summaries || {},
    noexperienced: typeof resume.noexperienced === 'boolean' ? resume.noexperienced : false,
    createdAt: resume.createdAt,
    updatedAt: resume.updatedAt,
  };

  // Only add optional properties if they have values
  if (resume.name) baseResume.name = resume.name;
  if (resume.role) baseResume.role = resume.role;
  if (resume.location) baseResume.location = resume.location;
  if (resume.bio) baseResume.bio = resume.bio;
  if (resume.githubProfile) baseResume.githubProfile = resume.githubProfile;
  if (resume.seoTitle) baseResume.seoTitle = resume.seoTitle;
  if (resume.seoDescription) baseResume.seoDescription = resume.seoDescription;

  console.log('ensureResumeStructure: Processed experience:', experience);
  console.log('ensureResumeStructure: Processed githubUrl:', githubUrl);
  console.log('ensureResumeStructure: GitHub ID:', baseResume.githubId);
  console.log('ensureResumeStructure: No Experience flag:', baseResume.noexperienced);

  return baseResume;
};

export function useResumeData() {
  // Always call hooks in the same order
  const { data: session, status } = useSession();
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentResume, setCurrentResume] = useState<ResumeData | null>(null);

  // Derive userId from session
  const userId = session?.user?.id;
  
  console.log('useResumeData: Session status:', status);
  console.log('useResumeData: Session data:', session);
  console.log('useResumeData: User ID:', userId);

  // Load resumes on mount and when user changes
  useEffect(() => {
    console.log('useResumeData: userId changed to:', userId);
    console.log('useResumeData: Session status:', status);
    console.log('useResumeData: Full session data:', session);
    
    // Default unsubscribe function
    let unsubscribe = () => {};
    
    // Clear state if not authenticated
    if (status !== 'authenticated' || !userId) {
      console.log('useResumeData: Session not ready or no userId, clearing resumes');
      setResumes([]);
      setCurrentResume(null);
      setLoading(false);
      return () => unsubscribe();
    }

    // Set loading state
    setLoading(true);
    setError(null);
    console.log('useResumeData: Subscribing to resumes for userId:', userId);
    console.log('useResumeData: User ID type:', typeof userId);
    console.log('useResumeData: User ID length:', userId?.length);

    // Subscribe to real-time updates
    unsubscribe = subscribeToResumes(userId, (resumeList) => {
      console.log('useResumeData: Received resumeList:', resumeList);
      const normalizedResumes = resumeList.map(ensureResumeStructure);
      console.log('useResumeData: Normalized resumes:', normalizedResumes);
      setResumes(normalizedResumes);
      setLoading(false);
    });

    // Also try to fetch resumes directly as a fallback
    getResumes(userId).then((resumeList) => {
      console.log('useResumeData: Fallback getResumes result:', resumeList);
      if (resumeList.length > 0) {
        const normalizedResumes = resumeList.map(ensureResumeStructure);
        console.log('useResumeData: Setting resumes from fallback:', normalizedResumes);
        setResumes(normalizedResumes);
        setLoading(false);
      }
    }).catch((err) => {
      console.error('useResumeData: Fallback getResumes failed:', err);
      setLoading(false);
    });

    return () => {
      console.log('useResumeData: Unsubscribing from resumes');
      unsubscribe();
    };
  }, [userId, status, session]);

  // Save resume data
  const saveResume = useCallback(async (resumeData: ResumeData) => {
    if (!userId || status !== 'authenticated') {
      setError('User not authenticated');
      return { success: false, error: 'User not authenticated' };
    }

    setLoading(true);
    setError(null);

    // Ensure the resume data has proper structure
    const normalizedResumeData = ensureResumeStructure(resumeData);

    // Log the resume data to ensure all fields are being saved
    console.log('saveResume: Resume data:', normalizedResumeData);
    console.log('saveResume: Experience data:', normalizedResumeData.experience);
    console.log('saveResume: Education data:', normalizedResumeData.education);
    console.log('saveResume: GitHub profile data:', normalizedResumeData.githubProfile);
    console.log('saveResume: GitHub URL:', normalizedResumeData.githubUrl);
    console.log('saveResume: Repos count:', normalizedResumeData.repos?.length);

    try {
      if (normalizedResumeData.id) {
        // Update existing resume
        const result = await updateResume(userId, normalizedResumeData.id, normalizedResumeData);
        if (result.success) {
          setCurrentResume(normalizedResumeData);
          return { success: true, resumeId: normalizedResumeData.id };
        } else {
          setError('Failed to update resume');
          return { success: false, error: 'Failed to update resume' };
        }
      } else {
        // Create new resume
        const result = await createResume(userId, normalizedResumeData);
        if (result.success) {
          const updatedResume = { ...normalizedResumeData, id: result.resumeId };
          setCurrentResume(updatedResume);
          return { success: true, resumeId: result.resumeId };
        } else {
          setError('Failed to create resume');
          return { success: false, error: 'Failed to create resume' };
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [userId, status, setLoading, setError, setCurrentResume, session]);

  // Load specific resume
  const loadResume = useCallback(async (resumeId: string) => {
    if (!userId || status !== 'authenticated') {
      setError('User not authenticated');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const resume = await getResume(userId, resumeId);
      if (resume) {
        const normalizedResume = ensureResumeStructure(resume);
        setCurrentResume(normalizedResume);
        return normalizedResume;
      } else {
        setError('Resume not found');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId, status, setLoading, setError, setCurrentResume, session]);

  // Delete resume
  const deleteResumeData = useCallback(async (resumeId: string) => {
    if (!userId || status !== 'authenticated') {
      setError('User not authenticated');
      return { success: false, error: 'User not authenticated' };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await deleteResume(userId, resumeId);
      if (result.success) {
        if (currentResume?.id === resumeId) {
          setCurrentResume(null);
        }
        return { success: true };
      } else {
        setError('Failed to delete resume');
        return { success: false, error: 'Failed to delete resume' };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [userId, status, currentResume, setLoading, setError, setCurrentResume, session]);

  // Auto-save functionality
  const autoSave = useCallback(async (resumeData: ResumeData) => {
    if (!userId || status !== 'authenticated') return;

    try {
      await saveResume(resumeData);
    } catch (err) {
      console.error('Auto-save failed:', err);
    }
  }, [userId, status, saveResume, session]);

  return {
    resumes,
    currentResume,
    loading,
    error,
    saveResume,
    loadResume,
    deleteResume: deleteResumeData,
    autoSave,
    setCurrentResume,
    clearError: () => setError(null),
  };
}
