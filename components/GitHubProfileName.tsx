'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { fetchGitHubProfileName } from '../lib/firebase-utils';

interface GitHubProfileNameProps {
  resumeId: string;
  className?: string;
}

export default function GitHubProfileName({ resumeId, className = '' }: GitHubProfileNameProps) {
  const { data: session } = useSession();
  const [name, setName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadName() {
      if (!session?.user?.id || !resumeId) {
        setLoading(false);
        setError('Missing user ID or resume ID');
        return;
      }

      try {
        const result = await fetchGitHubProfileName(session.user.id, resumeId);
        
        if (result.success && result.name) {
          setName(result.name);
          setError(null);
        } else {
          setError(result.error || 'Failed to fetch name');
        }
      } catch (err) {
        console.error('Error in GitHubProfileName component:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    }

    loadName();
  }, [session, resumeId]);

  if (loading) {
    return <span className={className}>Loading...</span>;
  }

  if (error) {
    return <span className={className}>Unknown</span>;
  }

  return <span className={className}>{name}</span>;
}