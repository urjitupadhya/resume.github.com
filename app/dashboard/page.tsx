"use client"

import { useSession } from 'next-auth/react';
import { useResumeData } from '@/hooks/use-resume-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ResumeManager } from '@/components/ResumeManager';
import { ResumeData } from '@/hooks/use-resume-data';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Eye, Download, Trash2, Calendar, Briefcase, GraduationCap, Code } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  
  // Always initialize the hook, but we'll only use its values when on client side
  const resumeDataHook = useResumeData();
  
  // Initialize with default values
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Only use the hook values when we're on the client side
  useEffect(() => {
    if (isClient && status === 'authenticated') {
      setResumes(resumeDataHook.resumes);
      setLoading(resumeDataHook.loading);
      setError(resumeDataHook.error);
    }
  }, [isClient, status, resumeDataHook.resumes, resumeDataHook.loading, resumeDataHook.error, resumeDataHook]);
  
  // Log the resume data for debugging
  useEffect(() => {
    if (isClient && status === 'authenticated') {
      console.log('Dashboard: Loaded resumes:', resumes);
      console.log('Dashboard: Resume count:', resumes.length);
      if (resumes.length > 0) {
        console.log('Dashboard: First resume experience:', resumes[0].experience);
        console.log('Dashboard: First resume education:', resumes[0].education);
      }
    }
  }, [isClient, status, resumes]);
  
  console.log('Dashboard: session:', session);
  console.log('Dashboard: session.user:', session?.user);
  console.log('Dashboard: session.user.id:', session?.user?.id);
  console.log('Dashboard: resumes:', resumes);
  console.log('Dashboard: loading:', loading);
  console.log('Dashboard: error:', error);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Welcome to Resume Builder</h1>
          <p className="text-muted-foreground mb-6">Please sign in to access your dashboard.</p>
          <Button onClick={() => router.push('/auth/signin')}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  const handleLoadResume = (resume: ResumeData) => {
    if (isClient && resumeDataHook.loadResume && resume.id) {
      resumeDataHook.loadResume(resume.id);
    }
    if (resume.id) {
      router.push(`/builder?resume=${resume.id}`);
    } else {
      console.error('Resume ID is undefined');
      router.push('/builder');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getResumeStats = (resume: ResumeData) => {
    return {
      experience: resume.experience.length,
      education: resume.education.length,
      projects: resume.selectedRepos.length,
      lastUpdated: resume.updatedAt ? formatDate(resume.updatedAt) : 'Never',
    };
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 mt-16">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Welcome back, {session.user?.name || 'User'}! Manage your resumes and portfolios.
            </p>
            <div className="text-xs text-muted-foreground mt-1">
              User ID: {session.user?.id || 'Not set'} | Email: {session.user?.email || 'Not set'}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              <button 
                onClick={async () => {
                  if (session?.user?.id) {
                    try {
                      const response = await fetch(`/api/test-db?userId=${session.user.id}`);
                      const data = await response.json();
                      console.log('Database test result:', data);
                      alert(`Database test: ${data.message}`);
                    } catch (error) {
                      console.error('Database test error:', error);
                      alert('Database test failed');
                    }
                  }
                }}
                className="text-blue-500 hover:text-blue-700 underline"
              >
                Test Database Connection
              </button>
            </div>
          </div>
          <Button onClick={() => router.push('/builder')} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Resume
          </Button>
        </div>
      </header>

      {error && (
        <div className="mb-6 rounded-md bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                  <div className="h-3 bg-muted rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : resumes.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No resumes yet</h2>
          <p className="text-muted-foreground mb-6">
            Create your first resume to get started with building your professional portfolio.
          </p>
          <Button onClick={() => router.push('/builder')} size="lg">
            Create Your First Resume
          </Button>
          </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resumes.map((resume) => {
              const stats = getResumeStats(resume);
              return (
                <Card key={resume.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">{resume.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Last updated {stats.lastUpdated}
                          </p>
                        </div>
                      </div>
              </CardHeader>
              <CardContent>
                    <div className="space-y-4">
                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center p-2 bg-muted rounded">
                          <Briefcase className="h-3 w-3 mx-auto mb-1" />
                          <span className="font-medium">{stats.experience}</span>
                          <div className="text-muted-foreground">Experience</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded">
                          <GraduationCap className="h-3 w-3 mx-auto mb-1" />
                          <span className="font-medium">{stats.education}</span>
                          <div className="text-muted-foreground">Education</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded">
                          <Code className="h-3 w-3 mx-auto mb-1" />
                          <span className="font-medium">{stats.projects}</span>
                          <div className="text-muted-foreground">Projects</div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleLoadResume(resume)}
                          className="flex-1"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                          </Button>
                        <Button 
                          size="sm"
                          variant="outline" 
                          onClick={() => router.push(`/resumes/${resume.id}`)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                </div>
              </CardContent>
            </Card>
              );
            })}
          </div>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{resumes.length}</div>
                  <div className="text-sm text-muted-foreground">Total Resumes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {resumes.reduce((acc, r) => acc + r.experience.length, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {resumes.reduce((acc, r) => acc + r.education.length, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Education</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {resumes.reduce((acc, r) => acc + r.selectedRepos.length, 0)}
              </div>
                  <div className="text-sm text-muted-foreground">Total Projects</div>
                  </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      </div>
  );
}
