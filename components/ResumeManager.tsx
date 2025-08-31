"use client"

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { useResumeData, ResumeData } from '@/hooks/use-resume-data';
import { cn } from '@/lib/utils';
import { Plus, Edit, Trash2, Download, Eye } from 'lucide-react';

interface ResumeManagerProps {
  onLoadResume: (resume: ResumeData) => void;
  currentResume: ResumeData | null;
}

export function ResumeManager({ onLoadResume, currentResume }: ResumeManagerProps) {
  const { data: session } = useSession();
  const { resumes, loading, error, saveResume, deleteResume, clearError } = useResumeData();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newResumeTitle, setNewResumeTitle] = useState('');
  const [saving, setSaving] = useState(false);

  if (!session) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Resume Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Please sign in to manage your resumes.</p>
        </CardContent>
      </Card>
    );
  }

  const handleCreateResume = async () => {
    if (!newResumeTitle.trim()) return;

    setSaving(true);
    try {
      const newResume: ResumeData = {
        title: newResumeTitle.trim(),
        githubUrl: '',
        selectedRepos: [],
        experience: [],
        education: [],
        template: 'modern',
        colorScheme: 'default',
        links: {},
        repos: [],
        summaries: {},
      };

      const result = await saveResume(newResume);
      if (result.success) {
        setIsCreateDialogOpen(false);
        setNewResumeTitle('');
        onLoadResume({ ...newResume, id: result.resumeId });
      }
    } catch (err) {
      console.error('Failed to create resume:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleLoadResume = (resume: ResumeData) => {
    onLoadResume(resume);
  };

  const handleDeleteResume = async (resumeId: string) => {
    try {
      const result = await deleteResume(resumeId);
      if (result.success && currentResume?.id === resumeId) {
        onLoadResume({
          title: 'New Resume',
          githubUrl: '',
          selectedRepos: [],
          experience: [],
          education: [],
          template: 'modern',
          colorScheme: 'default',
          links: {},
          repos: [],
          summaries: {},
        });
      }
    } catch (err) {
      console.error('Failed to delete resume:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>My Resumes</CardTitle>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Resume
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Resume</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label htmlFor="resume-title" className="text-sm font-medium">
                  Resume Title
                </label>
                <Input
                  id="resume-title"
                  placeholder="Enter resume title..."
                  value={newResumeTitle}
                  onChange={(e) => setNewResumeTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateResume();
                    }
                  }}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateResume} disabled={!newResumeTitle.trim() || saving}>
                  {saving ? 'Creating...' : 'Create'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
            <Button variant="ghost" size="sm" onClick={clearError} className="ml-2">
              Dismiss
            </Button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-muted-foreground">Loading resumes...</div>
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground mb-4">No resumes saved yet.</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              Create Your First Resume
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border transition-colors",
                  currentResume?.id === resume.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium truncate">{resume.title}</h3>
                    {currentResume?.id === resume.id && (
                      <Badge variant="secondary" className="text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {resume.updatedAt && (
                      <span>Updated {formatDate(resume.updatedAt)}</span>
                    )}
                    {resume.experience && resume.experience.length > 0 && (
                      <span>{resume.experience.length} experience{resume.experience.length !== 1 ? 's' : ''}</span>
                    )}
                    {resume.education && resume.education.length > 0 && (
                      <span>{resume.education.length} education{resume.education.length !== 1 ? 's' : ''}</span>
                    )}
                    {resume.selectedRepos && resume.selectedRepos.length > 0 && (
                      <span>{resume.selectedRepos.length} project{resume.selectedRepos.length !== 1 ? 's' : ''}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLoadResume(resume)}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Resume</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{resume.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => resume.id && handleDeleteResume(resume.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
