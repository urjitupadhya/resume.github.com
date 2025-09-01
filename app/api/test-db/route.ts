import { NextRequest, NextResponse } from 'next/server';
import { getResumes } from '@/lib/firebase-utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        message: 'No userId provided',
        error: 'Missing userId parameter'
      });
    }

    console.log('API test-db: Testing with userId:', userId);
    console.log('API test-db: User ID type:', typeof userId);
    console.log('API test-db: User ID length:', userId.length);

    // Try to get resumes for this user
    const resumes = await getResumes(userId);
    
    console.log('API test-db: Retrieved resumes:', resumes);

    return NextResponse.json({
      success: true,
      message: `Database connection successful. Found ${resumes.length} resumes for user ${userId}`,
      userId,
      userIdType: typeof userId,
      userIdLength: userId.length,
      resumesCount: resumes.length,
      resumes: resumes
    });

  } catch (error) {
    console.error('API test-db: Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

