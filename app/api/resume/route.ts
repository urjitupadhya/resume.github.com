import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { 
  createResume, 
  getResumes, 
  getResume, 
  updateResume, 
  deleteResume 
} from '@/lib/firebase-utils';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const resumeId = searchParams.get('id');

    if (resumeId) {
      // Get specific resume
      const resume = await getResume(session.user.id, resumeId);
      if (!resume) {
        return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
      }
      return NextResponse.json(resume);
    } else {
      // Get all resumes for user
      const resumes = await getResumes(session.user.id);
      return NextResponse.json(resumes);
    }
  } catch (error) {
    console.error('Error fetching resume(s):', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    if (!body.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const result = await createResume(session.user.id, body);
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        resumeId: result.resumeId,
        message: 'Resume created successfully' 
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to create resume' }, 
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating resume:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json({ error: 'Resume ID is required' }, { status: 400 });
    }

    const result = await updateResume(session.user.id, body.id, body);
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Resume updated successfully' 
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to update resume' }, 
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error updating resume:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const resumeId = searchParams.get('id');

    if (!resumeId) {
      return NextResponse.json({ error: 'Resume ID is required' }, { status: 400 });
    }

    const result = await deleteResume(session.user.id, resumeId);
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Resume deleted successfully' 
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to delete resume' }, 
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error deleting resume:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
