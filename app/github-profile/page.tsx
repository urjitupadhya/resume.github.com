'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import GitHubProfileName from '../../components/GitHubProfileName';
import { useResumeData } from '../../hooks/use-resume-data';

export default function GitHubProfilePage() {
  const { data: session } = useSession();
  const { resumes, loading: resumesLoading } = useResumeData();
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');

  // Handle resume selection
  const handleResumeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedResumeId(e.target.value);
  };

  if (!session) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">GitHub Profile Name</h1>
        <p>Please sign in to view your GitHub profile name.</p>
      </div>
    );
  }

  if (resumesLoading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">GitHub Profile Name</h1>
        <p>Loading your resumes...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">GitHub Profile Name</h1>
      
      {resumes.length === 0 ? (
        <p>You don't have any resumes yet. Create a resume to see your GitHub profile name.</p>
      ) : (
        <div>
          <div className="mb-4">
            <label htmlFor="resume-select" className="block text-sm font-medium text-gray-700 mb-1">
              Select a resume:
            </label>
            <select
              id="resume-select"
              className="block w-full max-w-md px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={selectedResumeId}
              onChange={handleResumeSelect}
            >
              <option value="">Select a resume</option>
              {resumes.map((resume) => (
                <option key={resume.id} value={resume.id}>
                  {resume.title || 'Untitled Resume'}
                </option>
              ))}
            </select>
          </div>

          {selectedResumeId ? (
            <div className="mt-6 p-4 border rounded-md bg-gray-50">
              <h2 className="text-lg font-semibold mb-2">GitHub Profile Information</h2>
              <p className="mb-2">
                <span className="font-medium">Name: </span>
                <GitHubProfileName 
                  resumeId={selectedResumeId} 
                  className="text-indigo-600"
                />
              </p>
              <p className="text-sm text-gray-500 mt-4">
                This name is fetched from your GitHub profile information stored in the resume.
              </p>
            </div>
          ) : (
            <p className="mt-4 text-gray-600">Select a resume to view the GitHub profile name.</p>
          )}
        </div>
      )}
    </div>
  );
}