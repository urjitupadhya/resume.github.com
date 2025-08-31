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
  const baseResume = {
    id: resume.id,
    title: resume.title || "New Resume",
    githubUrl: resume.githubUrl || "",
    selectedRepos: resume.selectedRepos || [],
    experience: resume.experience || [],
    education: resume.education || [],
    template: resume.template || "modern",
    colorScheme: resume.colorScheme || "default",
    links: resume.links ? Object.fromEntries(
      Object.entries(resume.links).filter(([_, value]) => value !== undefined && value !== null && value !== '')
    ) : {},
    repos: resume.repos || [],
    summaries: resume.summaries || {},
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

  return baseResume;
};

export function useResumeData() {
  const { data: session, status } = useSession();
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentResume, setCurrentResume] = useState<ResumeData | null>(null);

  const userId = session?.user?.id;
  
  console.log('useResumeData: Session status:', status);
  console.log('useResumeData: Session data:', session);
  console.log('useResumeData: User ID:', userId);

  // Load resumes on mount and when user changes
  useEffect(() => {
    console.log('useResumeData: userId changed to:', userId);
    console.log('useResumeData: Session status:', status);
    console.log('useResumeData: Full session data:', session);
    
    // Only proceed if session is authenticated and we have a userId
    if (status !== 'authenticated' || !userId) {
      console.log('useResumeData: Session not ready or no userId, clearing resumes');
      setResumes([]);
      setCurrentResume(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    console.log('useResumeData: Subscribing to resumes for userId:', userId);
    console.log('useResumeData: User ID type:', typeof userId);
    console.log('useResumeData: User ID length:', userId?.length);

    // Subscribe to real-time updates
    const unsubscribe = subscribeToResumes(userId, (resumeList) => {
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
  }, [userId]);

  // Save resume data
  const saveResume = useCallback(async (resumeData: ResumeData) => {
    if (!userId) {
      setError('User not authenticated');
      return { success: false, error: 'User not authenticated' };
    }

    setLoading(true);
    setError(null);

    // Ensure the resume data has proper structure
    const normalizedResumeData = ensureResumeStructure(resumeData);

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
          setCurrentResume({ ...normalizedResumeData, id: result.resumeId });
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
  }, [userId]);

  // Load specific resume
  const loadResume = useCallback(async (resumeId: string) => {
    if (!userId) {
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
  }, [userId]);

  // Delete resume
  const deleteResumeData = useCallback(async (resumeId: string) => {
    if (!userId) {
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
  }, [userId, currentResume]);

  // Auto-save functionality
  const autoSave = useCallback(async (resumeData: ResumeData) => {
    if (!userId) return;

    try {
      await saveResume(resumeData);
    } catch (err) {
      console.error('Auto-save failed:', err);
    }
  }, [userId, saveResume]);

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
