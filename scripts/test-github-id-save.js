// Test script to verify githubId is properly saved
const { createResume, getResume, updateResume } = require('../lib/firebase-utils');

// Mock user ID for testing
const testUserId = 'test-user-123';

// Test data with githubId and githubUrl
const testResumeData = {
  title: 'Test Resume',
  githubId: 'test-github-username',
  githubUrl: 'https://github.com/test-github-username',
  experience: [],
  education: [],
  repos: [],
  selectedRepos: [],
};

async function runTest() {
  console.log('Starting githubId save test...');
  
  try {
    // Step 1: Create a new resume with githubId
    console.log('Creating test resume with githubId:', testResumeData.githubId);
    const createResult = await createResume(testUserId, testResumeData);
    
    if (!createResult.success) {
      throw new Error(`Failed to create resume: ${createResult.error}`);
    }
    
    const resumeId = createResult.resumeId;
    console.log('Resume created with ID:', resumeId);
    
    // Step 2: Retrieve the resume to verify githubId was saved
    console.log('Retrieving resume to verify githubId...');
    const savedResume = await getResume(testUserId, resumeId);
    
    if (!savedResume) {
      throw new Error('Failed to retrieve saved resume');
    }
    
    console.log('Retrieved resume with githubId:', savedResume.githubId);
    
    // Verify githubId was saved correctly
    if (savedResume.githubId !== testResumeData.githubId) {
      throw new Error(`githubId mismatch! Expected: ${testResumeData.githubId}, Got: ${savedResume.githubId}`);
    }
    
    console.log('✅ githubId was saved correctly!');
    
    // Step 3: Update the resume with a new githubId
    const updatedGithubId = 'updated-github-username';
    console.log('Updating resume with new githubId:', updatedGithubId);
    
    const updateResult = await updateResume(testUserId, resumeId, {
      ...savedResume,
      githubId: updatedGithubId,
    });
    
    if (!updateResult.success) {
      throw new Error(`Failed to update resume: ${updateResult.error}`);
    }
    
    // Step 4: Retrieve the updated resume to verify githubId was updated
    console.log('Retrieving updated resume to verify githubId...');
    const updatedResume = await getResume(testUserId, resumeId);
    
    if (!updatedResume) {
      throw new Error('Failed to retrieve updated resume');
    }
    
    console.log('Retrieved updated resume with githubId:', updatedResume.githubId);
    
    // Verify githubId was updated correctly
    if (updatedResume.githubId !== updatedGithubId) {
      throw new Error(`Updated githubId mismatch! Expected: ${updatedGithubId}, Got: ${updatedResume.githubId}`);
    }
    
    console.log('✅ githubId was updated correctly!');
    console.log('✅ TEST PASSED: githubId is properly saved and updated in the database');
    
  } catch (error) {
    console.error('❌ TEST FAILED:', error.message);
  }
}

runTest();