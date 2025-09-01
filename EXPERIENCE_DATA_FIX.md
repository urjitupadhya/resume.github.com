# Experience Data Saving Fix

## Problem
Experience data ("SDE at XX") was not being properly saved in the database when users entered it in the builder page.

## Investigation
After investigating the codebase, we identified several potential issues in how experience data was being processed and saved:

1. The experience data flow from the UI to the database wasn't properly logging or tracking the data at each step
2. There might be issues with how the experience array was being updated in the state
3. The experience data might not be properly processed before saving to the database

## Solution
We implemented the following changes to fix the experience data saving issue:

### 1. Enhanced Logging in ExperienceStep Component
- Added detailed logging in the `addBullet` function to track bullet additions
- Added detailed logging in the `addRole` function to track role additions
- These logs will help verify that experience data is properly captured at the UI level

### 2. Improved State Updates in Builder Page
- Enhanced the experience data state update logic with proper logging
- Added explicit state update verification to ensure experience data is properly stored in the component state

### 3. Enhanced AutoSave Component
- Added detailed logging of resume data before saving
- Added specific logging for experience data to verify it's included in the save operation
- Added success/failure logging for save operations

### 4. Improved Firebase Utils
- Enhanced the `createResume` function with better experience data processing and logging
- Enhanced the `updateResume` function with better experience data processing and logging
- Added fallback handling for missing experience data

### 5. Test Script
- Created a test script (`test-experience-save.js`) to verify experience data saving
- Created a batch file (`run-experience-test.bat`) to easily run the test

## Verification
To verify the fix:

1. Run the application and add experience data in the builder page
2. Check the browser console for logs showing the experience data being processed
3. Verify that the experience data appears in the saved resume
4. Run the test script to verify experience data saving in isolation

## Technical Details

### Experience Data Structure
The experience data structure follows this format:
```javascript
{
  id: string,
  title: string,
  company: string,
  start: string,
  end: string,
  bullets: string[],
  tech: string
}
```

### Data Flow
1. User enters experience data in the ExperienceStep component
2. Data is updated in the component state
3. When the user adds a role, it's added to the experience array in the parent state
4. The AutoSave component detects the state change and triggers a save
5. The save operation processes the experience data and saves it to the database

The enhanced logging at each step helps identify where any issues might occur in this flow.