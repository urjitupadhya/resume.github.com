'use client';

import { useAuth } from '../../components/auth-provider';
import { ProtectedRoute } from '../../components/protected-route';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { User, FileText, Settings, LogOut, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getResumes, createResume, deleteResume } from '../../lib/firebase-utils';
import { useToast } from '../../hooks/use-toast';

interface Resume {
  id: string;
  title: string;
  template: string;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user?.id) {
      loadResumes();
    }
  }, [user?.id]);

  const loadResumes = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const userResumes = await getResumes(user.id);
      setResumes(userResumes);
    } catch (error) {
      console.error('Error loading resumes:', error);
      toast({
        title: "Error",
        description: "Failed to load resumes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateResume = async () => {
    if (!user?.id) return;
    
    setIsCreating(true);
    try {
      const newResume = {
        title: `New Resume ${resumes.length + 1}`,
        template: 'modern',
        content: {
          personalInfo: {
            name: user.name || '',
            email: user.email || '',
            phone: '',
            location: '',
            summary: ''
          },
          experience: [],
          education: [],
          skills: [],
          projects: []
        }
      };

      const result = await createResume(user.id, newResume);
      
      if (result.success) {
        toast({
          title: "Resume Created",
          description: "Your new resume has been created successfully.",
        });
        await loadResumes(); // Reload the list
      } else {
        throw new Error('Failed to create resume');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteResume = async (resumeId: string) => {
    if (!user?.id) return;
    
    try {
      const result = await deleteResume(user.id, resumeId);
      
      if (result.success) {
        toast({
          title: "Resume Deleted",
          description: "Resume has been deleted successfully.",
        });
        await loadResumes(); // Reload the list
      } else {
        throw new Error('Failed to delete resume');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name}!</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Resumes</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{resumes.length}</div>
                <p className="text-xs text-muted-foreground">
                  {resumes.length > 0 ? `Last updated ${formatDate(resumes[0]?.updatedAt || '')}` : 'No resumes yet'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Templates</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{resumes.length}</div>
                <p className="text-xs text-muted-foreground">
                  {resumes.length > 0 ? 'Templates in use' : 'No templates active'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{resumes.length * 2}MB</div>
                <p className="text-xs text-muted-foreground">
                  {resumes.length > 0 ? 'Approximate storage' : 'No data stored'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Get started with your resume building
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={handleCreateResume} 
                  className="w-full" 
                  size="lg"
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Plus className="mr-2 h-4 w-4" />
                  )}
                  {isCreating ? 'Creating...' : 'Create New Resume'}
                </Button>
                <Link href="/profile" className="w-full">
                  <Button variant="outline" className="w-full" size="lg">
                    <User className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest resume updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {isLoading ? (
                  <div className="space-y-3">
                    <div className="animate-pulse">
                      <div className="h-12 bg-gray-200 rounded-md"></div>
                    </div>
                    <div className="animate-pulse">
                      <div className="h-12 bg-gray-200 rounded-md"></div>
                    </div>
                  </div>
                ) : resumes.length > 0 ? (
                  resumes.slice(0, 2).map((resume) => (
                    <div key={resume.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium">{resume.title}</p>
                          <p className="text-xs text-gray-500">
                            Updated {formatDate(resume.updatedAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link href={`/builder/${resume.id}`}>
                          <Button variant="outline" size="sm">Edit</Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteResume(resume.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p>No resumes yet</p>
                    <p className="text-sm">Create your first resume to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Resumes List */}
          {resumes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>All Resumes</CardTitle>
                <CardDescription>
                  Manage and edit your resumes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {resumes.map((resume) => (
                    <div key={resume.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">{resume.title}</p>
                          <p className="text-sm text-gray-500">
                            Template: {resume.template} • Created: {formatDate(resume.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link href={`/builder/${resume.id}`}>
                          <Button variant="outline" size="sm">
                            Edit Resume
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteResume(resume.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Account Management */}
          <Card>
            <CardHeader>
              <CardTitle>Account Management</CardTitle>
              <CardDescription>
                Manage your account settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Profile Information</p>
                    <p className="text-sm text-gray-500">Update your personal details</p>
                  </div>
                </div>
                <Link href="/profile">
                  <Button variant="outline" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Manage
                  </Button>
                </Link>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <LogOut className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Sign Out</p>
                    <p className="text-sm text-gray-500">Sign out of your account</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
