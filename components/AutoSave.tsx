"use client"

import { useEffect, useRef, useState } from 'react';
import { useResumeData, ResumeData } from '@/hooks/use-resume-data';
import { Badge } from '@/components/ui/badge';
import { Check, AlertCircle, Loader2 } from 'lucide-react';

interface AutoSaveProps {
  resumeData: ResumeData;
  enabled?: boolean;
}

export function AutoSave({ resumeData, enabled = true }: AutoSaveProps) {
  const { autoSave, loading, error } = useResumeData();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedRef = useRef<string>('');

  useEffect(() => {
    if (!enabled || !resumeData.title) return;

    // Log the resume data being saved, especially experience data
    console.log('AutoSave: Resume data to save:', resumeData);
    console.log('AutoSave: Experience data:', resumeData.experience);

    // Create a hash of the current data to detect changes
    const currentHash = JSON.stringify(resumeData);
    
    // If data hasn't changed, don't save
    if (currentHash === lastSavedRef.current) {
      console.log('AutoSave: Data unchanged, skipping save');
      return;
    }

    // Don't auto-save if this is a new resume without an ID and we've already saved once
    // This prevents creating multiple new resumes when the component re-renders
    if (!resumeData.id && lastSavedRef.current) {
      console.log('AutoSave: Skipping save for new resume without ID that was already saved');
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set saving status
    setSaveStatus('saving');

    // Debounce the save operation
    timeoutRef.current = setTimeout(async () => {
      try {
        console.log('AutoSave: Saving resume data with experience:', resumeData.experience);
        await autoSave(resumeData);
        setSaveStatus('saved');
        lastSavedRef.current = currentHash;
        console.log('AutoSave: Successfully saved resume data');
        
        // Clear saved status after 2 seconds
        setTimeout(() => {
          setSaveStatus('idle');
        }, 2000);
      } catch (err) {
        setSaveStatus('error');
        console.error('Auto-save failed:', err);
      }
    }, 1000); // 1 second debounce

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [resumeData, autoSave, enabled]);

  if (!enabled) return null;

  return (
    <div className="flex items-center gap-2">
      {saveStatus === 'idle' && (
        <Badge variant="outline" className="text-xs">
          Ready
        </Badge>
      )}
      {saveStatus === 'saving' && (
        <Badge variant="outline" className="text-xs flex items-center gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          Saving...
        </Badge>
      )}
      {saveStatus === 'saved' && (
        <Badge variant="outline" className="text-xs flex items-center gap-1 text-green-600">
          <Check className="h-3 w-3" />
          Saved
        </Badge>
      )}
      {saveStatus === 'error' && (
        <Badge variant="outline" className="text-xs flex items-center gap-1 text-red-600">
          <AlertCircle className="h-3 w-3" />
          Save failed
        </Badge>
      )}
    </div>
  );
}
