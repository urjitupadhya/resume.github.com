// Test script to verify experience data saving
const { createResume, updateResume, getResume } = require('@/lib/firebase-utils');

// Mock user ID for testing
const testUserId = 'test-user-123';

// Test resume data with experience
const testResumeData = {
  title: 'Test Resume',
  githubUrl: 'https://github.com/testuser',
  githubId: 'testuser',
  selectedRepos: [],
  experience: [
    {
      id: 'exp-1',
      title: 'SDE',
      company: 'Test Company',
      start: 'Jan 2022',
      end: 'Present',
      bullets: ['Developed features', 'Fixed bugs'],
      tech: 'JavaScript, React'
    }
  ],
  education: [],
  template: 'modern',
  colorScheme: 'default',
  links: {}
};

async function testExperienceSave() {
  console.log('Starting experience data save test...');
  console.log('Test resume data:', JSON.stringify(testResumeData, null, 2));
  
  try {
    // Step 1: Create a new resume with experience data
    console.log('\nStep 1: Creating resume with experience data...');
    const createResult = await createResume(testUserId, testResumeData);
    console.log('Create result:', createResult);
    
    if (!createResult.success || !createResult.resumeId) {
      console.error('Failed to create resume');
      return;
    }
    
    const resumeId = createResult.resumeId;
    console.log('Resume created with ID:', resumeId);
    
    // Step 2: Retrieve the resume to verify experience data was saved
    console.log('\nStep 2: Retrieving resume to verify experience data...');
    const savedResume = await getResume(testUserId, resumeId);
    console.log('Retrieved resume:', JSON.stringify(savedResume, null, 2));
    
    if (!savedResume) {
      console.error('Failed to retrieve resume');
      return;
    }
    
    console.log('Experience data in retrieved resume:', JSON.stringify(savedResume.experience, null, 2));
    
    // Step 3: Update the resume with new experience data
    console.log('\nStep 3: Updating resume with new experience data...');
    const updatedExperience = [
      ...savedResume.experience,
      {
        id: 'exp-2',
        title: 'Senior SDE',
        company: 'Another Company',
        start: 'Jan 2020',
        end: 'Dec 2021',
        bullets: ['Led team', 'Improved performance'],
        tech: 'TypeScript, Node.js'
      }
    ];
    
    const updateResult = await updateResume(testUserId, resumeId, {
      experience: updatedExperience
    });
    console.log('Update result:', updateResult);
    
    // Step 4: Retrieve the updated resume to verify experience data was updated
    console.log('\nStep 4: Retrieving updated resume to verify experience data...');
    const updatedResume = await getResume(testUserId, resumeId);
    console.log('Updated resume:', JSON.stringify(updatedResume, null, 2));
    
    if (!updatedResume) {
      console.error('Failed to retrieve updated resume');
      return;
    }
    
    console.log('Experience data in updated resume:', JSON.stringify(updatedResume.experience, null, 2));
    console.log('\nTest completed successfully!');
  } catch (error) {
    console.error('Test failed with error:', error);
  }
}

// Run the test
testExperienceSave();