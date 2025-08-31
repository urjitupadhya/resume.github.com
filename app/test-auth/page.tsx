'use client';

import { useAuth } from '../../components/auth-provider';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useState } from 'react';

export default function TestAuthPage() {
  const { user, isAuthenticated, loading, signIn, signOut } = useAuth();
  const [testResult, setTestResult] = useState<string>('');

  const testFirebaseConnection = async () => {
    try {
      const response = await fetch('/api/user/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTestResult(`✅ Success: ${data.message}`);
      } else {
        const error = await response.json();
        setTestResult(`❌ Error: ${error.error}`);
      }
    } catch (error) {
      setTestResult(`❌ Network Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg">Loading authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Authentication Test Page</h1>
        
        <div className="grid gap-6">
          {/* Authentication Status */}
          <Card>
            <CardHeader>
              <CardTitle>Authentication Status</CardTitle>
              <CardDescription>Current authentication state</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Status:</p>
                  <p className={`text-sm ${isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
                    {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Loading:</p>
                  <p className="text-sm">{loading ? '🔄 Yes' : '✅ No'}</p>
                </div>
              </div>
              
              {isAuthenticated && user && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-medium mb-2">User Information:</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>Name:</strong> {user.name || 'N/A'}</p>
                      <p><strong>Email:</strong> {user.email || 'N/A'}</p>
                    </div>
                    <div>
                      <p><strong>ID:</strong> {user.id || 'N/A'}</p>
                      <p><strong>Image:</strong> {user.image ? '✅ Available' : '❌ Not available'}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>Test authentication functions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-4">
                {!isAuthenticated ? (
                  <Button onClick={signIn} className="bg-blue-600 hover:bg-blue-700">
                    Sign In with Google
                  </Button>
                ) : (
                  <Button onClick={signOut} variant="outline" className="text-red-600 hover:text-red-700">
                    Sign Out
                  </Button>
                )}
                
                {isAuthenticated && (
                  <Button onClick={testFirebaseConnection} className="bg-green-600 hover:bg-green-700">
                    Test Firebase Connection
                  </Button>
                )}
              </div>
              
              {testResult && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <p className="font-medium">Test Result:</p>
                  <p className="text-sm mt-1">{testResult}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Testing Instructions</CardTitle>
              <CardDescription>How to test the authentication flow</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>If not authenticated, click "Sign In with Google"</li>
                <li>Complete the Google OAuth flow</li>
                <li>Check if you're redirected back and authenticated</li>
                <li>Click "Test Firebase Connection" to verify database integration</li>
                <li>Check Firebase Console to see if user data is stored</li>
                <li>Try signing out and signing back in</li>
              </ol>
              
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Make sure you have your Firebase environment variables set up in `.env.local` 
                  and Firebase Realtime Database is configured with proper security rules.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}











