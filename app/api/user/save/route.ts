import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { createUser, updateUser } from '../../../../lib/firebase-utils';

export async function POST(request: NextRequest) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { user } = session;
    const userId = user.id || user.email; // Use email as fallback ID

    if (!userId) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    // Prepare user data for Firebase
    const userData = {
      profile: {
        name: user.name || '',
        email: user.email || '',
        avatar: user.image || '',
      },
      resumes: {},
      settings: {
        theme: 'light',
        notifications: true,
      }
    };

    // Try to create or update user in Firebase
    let result;
    try {
      result = await createUser(userId, userData);
    } catch (error) {
      // If user already exists, try to update
      result = await updateUser(userId, userData);
    }

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'User data saved to Firebase',
        userId 
      });
    } else {
      throw new Error('Failed to save user data');
    }

  } catch (error) {
    console.error('Error saving user data:', error);
    return NextResponse.json({ 
      error: 'Failed to save user data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
