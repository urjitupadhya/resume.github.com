"use client";
import Image from "next/image";
import Link from "next/link";
import ResumeCard from "@/components/ResumeCard";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from 'next-auth/react';
// import SignIn from "@/components/SignIn";
import { useRef } from "react";
import { generateATSResults, generateCoverLetter } from "@/lib/actions";
import { getResumeImage } from '@/lib/pdf-utils'
import { getStorage, ref, uploadBytes, listAll, getBlob, StorageReference, getDownloadURL } from "firebase/storage";
import { createResume, getResumes, updateResume } from "@/lib/firebase-utils";
// import Navbar from "@/components/Navbar";


interface UploadedResume {
  id: string;
  name: string;
  jobTitle: string;
  atsScore: number;
  storageRef: StorageReference;
  analysisResult?: string;
  createdAt?: any;
}

export default function Home()  {
  const { data: session } = useSession();
 
  const [jobDescription, setJobDescription] = useState('')
  const [resume, setResume] = useState<File | null>(null)
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [selectedResume, setSelectedResume] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [previewResumeImage, setPreviewResumeImage] = useState<string | null>(null);
  const [uploadedResumes, setUploadedResumes] = useState<UploadedResume[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isResumesLoading, setIsResumesLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const router = useRouter();


  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      const fetchResumes = async () => {
        setIsResumesLoading(true);
        try {
          const storage = getStorage();
          const resumesData = await getResumes(session.user.id);
          
          const processedResumes = resumesData.map(resume => {
            let score = 0;
            try {
              if (resume.analysisResult) {
                const analysis = JSON.parse(resume.analysisResult);
                score = analysis.overallScore || 0;
              }
            } catch (e) {
              console.error("Failed to parse analysisResult:", resume.analysisResult, e);
            }
            
            return {
              id: resume.id,
              name: resume.resumeName || resume.title || 'Untitled Resume',
              jobTitle: resume.jobTitle || '',
              atsScore: score,
                             storageRef: ref(storage, `resumes/${session.user.id}/${resume.resumeName || resume.title}`),
              analysisResult: resume.analysisResult,
              createdAt: resume.createdAt ? new Date(resume.createdAt).toLocaleDateString() : 'Unknown'
            };
          });
          
          setUploadedResumes(processedResumes);
        } catch (error) {
          console.error("Error fetching resumes: ", error);
        } finally {
          setIsResumesLoading(false);
        }
           };
     fetchResumes();
   }
 }, [session?.user?.id]);

  useEffect(() => {
    if (isModalOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isModalOpen]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error(err);
    }
  };

  const testDatabaseConnection = async () => {
    if (!session?.user?.id) {
      alert("Please sign in first");
      return;
    }
    
    try {
      const testData = {
        uid: session.user.id,
        testField: "Database connection test",
        timestamp: new Date().toISOString(),
      };
      
      const result = await createResume(session.user.id, testData);
      
      if (result.success) {
        alert(`Database connection successful! Test record created with ID: ${result.resumeId}`);
        // Refresh the resumes list
        const resumes = await getResumes(session.user.id);
        console.log('Current resumes in database:', resumes);
      } else {
        alert(`Database connection failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Database test error:", error);
      alert(`Database test failed: ${error}`);
    }
  };

  const handleSelectUploadedResume = async (resumeRef: StorageReference) => {
    try {
      const blob = await getBlob(resumeRef);
      const file = new File([blob], resumeRef.name, { type: blob.type });
      setResume(file);
    } catch (error) {
      console.error("Error downloading resume: ", error);
      alert("There was an error selecting the resume. The file may not be available in storage.");
    }
  };

  const showResume = async (resumeRef: string) => {
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `resumes/${session?.user?.id}/${resumeRef}.png`);
      const url = await getDownloadURL(storageRef);
      setPreviewResumeImage(url);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error loading resume preview:", error);
      alert("Could not load resume preview. The image may not be available yet.");
    }
  };

  const handleCoverLetter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id || !resume) {
      alert("Please make sure you are logged in and have selected a resume.");
      return;
    }
    setIsLoading(true);
    
    try {
      const result = await generateCoverLetter(resume, jobDescription, companyName, jobTitle);
      setCoverLetter(result);
      console.log(result);
      
      if (result.length > 0) {
        const cleaned = result.replace(/```json\n|```/g, '').trim();
        
                 // Save cover letter data to Realtime Database
         const coverLetterData = {
           uid: session.user.id,
           resumeName: resume.name,
           jobTitle: jobTitle,
           companyName: companyName,
           jobDescription: jobDescription,
           coverLetter: cleaned,
           fileName: resume.name,
           fileSize: resume.size,
           fileType: resume.type,
           createdAt: new Date().toISOString(),
         };
         
         const createResult = await createResume(session.user.id, coverLetterData);
        
        if (createResult.success) {
          console.log('Cover letter saved to Realtime Database with ID:', createResult.resumeId);
        } else {
          console.error('Failed to save cover letter to database:', createResult.error);
        }
        
        setIsLoading(false);
        return cleaned;
      } else {
        alert("There was an error processing your resume. Please try again.");
      }
    } catch (error) {
      console.error("Error generating cover letter:", error);
      alert("There was an error generating the cover letter. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume) {
      alert("Please make sure you are logged in and have selected a resume.");
      return;
    }

    if (!isMounted) {
      alert("Please wait for the page to fully load before submitting.");
      return;
    }

    setIsLoading(true);

    try {
        // Create a placeholder image for now (PDF processing is temporarily disabled)
        const imageBlob = await getResumeImage(resume);
        
        // Convert blob to data URL for display first
        const imageUrl = URL.createObjectURL(imageBlob);
        setGeneratedImage(imageUrl);
        
        // Generate ATS results using the server action
        const result = await generateATSResults(resume, jobDescription, companyName, jobTitle);
        setAnalysisResult(result);
        
        if (result.length > 0) {
          const cleaned = result.replace(/```json\n|```/g, '').trim();
          
                     // Save resume data to Firebase Realtime Database
           const resumeData = {
             uid: session.user.id,
             resumeName: resume.name,
             jobTitle: jobTitle,
             companyName: companyName,
             jobDescription: jobDescription,
             analysisResult: cleaned,
             fileName: resume.name,
             fileSize: resume.size,
             fileType: resume.type,
             createdAt: new Date().toISOString(),
           };
           
           const createResult = await createResume(session.user.id, resumeData);
          
          if (createResult.success) {
            console.log('Resume saved to Realtime Database with ID:', createResult.resumeId);
            
                         // Upload files to Firebase Storage
             const storage = getStorage();
             const storageRef = ref(storage, `resumes/${session.user.id}/${resume.name}.png`);
             const resumeRef = ref(storage, `resumes/${session.user.id}/${resume.name}`);
            
            uploadBytes(storageRef, imageBlob).then((snapshot) => {
                console.log('Uploaded resume preview image!');
            });
            uploadBytes(resumeRef, resume).then((snapshot) => {
                console.log('Uploaded original resume file!');
            });
            
            router.push(`/resumes/${resume.name}?analysisResult=${encodeURIComponent(cleaned)}`);
          } else {
            console.error('Failed to save resume to database:', createResult.error);
            alert("Resume analysis completed but failed to save to database. Please try again.");
          }
        } else {
          alert("There was an error processing your resume. Please try again.");
        }
    } catch (error: any) {
      console.error("Error processing resume: ", error);
      if (error.code === 'permission-denied') {
        alert("Authentication error: You don't have permission to perform this action. Please check your Firebase security rules.");
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <main className="flex flex-col justify-between font-sans min-h-screen p-4 dark:bg-gray-900 relative">

      <div className="lg:mx-75 mx-auto">
      {/* <Navbar user={user} className='mt-8' /> */}

        <div className="mt-8 bg-white p-6 rounded-2xl shadow-md dark:bg-gray-800 border border-gray-50 dark:border-gray-700">
          <h1 className="text-3xl font-bold text-center mb-8 text-white">Upload Your Resume</h1>
          
          <div className="lg:space-y-8 space-y-0">


            <div className="flex flex-col lg:flex-row w-full animate-slide-in-up delay-400">
               {/* Company Information Section */}
               <div className="p-6 w-full lg:w-1/2">
              <div className="space-y-4">
                <div>
                  <label htmlFor="company-name" className="block text-sm font-medium text-gray-300 mb-2">Company Name</label>
                  <input 
                    type="text" 
                    id="company-name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-700 border-gray-600 border rounded-lg pt-3 pr-4 pb-3 pl-4 text-white"
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <label htmlFor="company-job-title" className="block text-sm font-medium text-gray-300 mb-2">Job Title</label>
                  <input 
                    type="text" 
                    id="company-job-title"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-700 border-gray-600 border rounded-lg pt-3 pr-4 pb-3 pl-4 text-white"
                    placeholder="Enter Job Title (e.g., Software Engineer, Data Analyst)"
                  />
                </div>
              </div>
            </div>
            
            {/* Job Description Upload Section */}
            <div className="p-6 w-full lg:w-1/2">
              <h2 className="block text-sm font-medium text-gray-300 mb-2">Job Description Upload</h2>
              <div className="flex flex-col items-center justify-center w-full">
                <label htmlFor="job-description-upload" className="w-full">
                </label>
                  <textarea 
                    id="job-description-upload" 
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none text-white" 
                    placeholder="Enter job description here... (Max 5000 characters)" 
                    maxLength={5000}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
              </div>
            </div>
            </div>


                         {/* Resume Upload Section */}
             <div className="p-6 animate-slide-in-up delay-500">
                 <h2 className="block text-sm font-medium text-gray-300 mb-4">Resume Upload</h2>
                 
                                   {/* Temporary notice about PDF processing */}
                  <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
                    <p className="text-yellow-300 text-sm">
                      <strong>Note:</strong> PDF preview is temporarily using placeholder images due to compatibility issues. 
                      Resume analysis functionality remains fully operational.
                    </p>
                  </div>
                  
                  {/* Database test button */}
                  <div className="mb-4">
                    <button 
                      onClick={testDatabaseConnection}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-all duration-200"
                    >
                      Test Database Connection
                    </button>
                  </div>
                 
                 <div className="flex flex-col sm:flex-row gap-4">


                  <div className="flex w-full">
                    <form className="w-full">
                    <label htmlFor="resume" className="block text-sm font-medium text-gray-900 dark:text-white"></label>
                    <select 
                      id="resume" 
                      value={selectedResume|| ''}
                      onChange={(e) => {
                        const resumeName = e.target.value;
                        setSelectedResume(resumeName);
                        if (resumeName) {
                          const resumeData = uploadedResumes.find(res => res.name === resumeName);
                          if (resumeData) {
                            handleSelectUploadedResume(resumeData.storageRef);
                          }
                        } else {
                          setResume(null);
                        }
                      }}

                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 cursor-pointer"
                    >
                      <option value="">Choose a resume</option>
                      {uploadedResumes.map((resume) => (
                        <option key={resume.id} value={resume.name}>{resume.name}</option>
                      ))}
                    </select>    
                    </form>
                  </div>



                  <label htmlFor="resume-upload" className="flex items-center justify-center w-full hover:border-gray-500 cursor-pointer transition-all duration-200 bg-gray-700 border-gray-600 border rounded-lg pt-1 pb-1 text-white">    
                    {!resume ? 
                    <>
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={"w-6 h-6 mr-2"}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"
                    />
                  </svg> 
                    Upload a new resume
                                  
                    <input 
                        id="resume-upload" 
                        type="file" 
                        className="hidden" 
                        accept=".pdf, .docx, .txt" 
                        onChange={(e) => setResume(e.target.files ? e.target.files[0] : null)} 
                      />
                    </>
                    
                    :
                    <>
                          <p className="text-sm font-medium text-white-700">Selected: {resume.name}</p>
                      <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={ "w-4 h-4 ml-4"}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            onClick={() => setResume(null)}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                    </>
                    }

                  
                </label>

                </div>
                {selectedResume && (
                <div className="flex flex-row items-center justify-start w-full mt-2 cursor-pointer" onClick={() => showResume(selectedResume)}>
                  <p className="text-sm font-medium text-gray-400 hover:text-gray-300 transition-all duration-200">View Resume Preview</p>
                        <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={"w-4 h-4 ml-2 text-gray-400"}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  >
                  <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                  </svg>
                  </div>
                    )}
                </div>
            <div className="flex justify-center pl-6 pr-6 animate-slide-in-up delay-600">
            {isLoading && (
                <button type="button" className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 disabled:bg-gray-400" disabled>
                <svg className="mr-3 -ml-1 size-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path></svg>
                    Processing…
                    </button>
            )} {!isLoading && (
                <div className="flex flex-row gap-4 w-full">
              <button 
                type="submit" 
                onClick={handleSubmit}
                disabled={isLoading || !isMounted}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 border border-blue-500 hover:border-blue-400 rounded-lg transition-all duration-200 font-medium text-white cursor-pointer"
              >
                    <svg
            xmlns="http://www.w3.org/2000/svg"
            className={"w-6 h-6 mr-2"}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
                {'Analyze Resume'}
              </button>
              <button 
                type="submit" 
                onClick={handleCoverLetter}
                disabled={isLoading || !isMounted}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 border border-gray-600 hover:border-gray-500 rounded-lg transition-all duration-200 font-medium text-white cursor-pointer"
              >
                    <svg
                xmlns="http://www.w3.org/2000/svg"
                className={ "w-6 h-6 mr-2"}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6M9 16h6M8 9h8M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z"
                />
              </svg>
                {'Create Cover Letter'}
              </button>
              </div>
            )}
            </div>
          </div>
          {coverLetter && (
            <div className="animate-fade-in mt-8">
              <div className="flex flex-row items-center justify-between">
      
              <h2 className="text-xl font-semibold mb-4 text-white">Cover Letter</h2>
              <button onClick={() => copyToClipboard(coverLetter)} className="text-sm font-medium text-gray-400 hover:text-gray-300 transition-all duration-200 cursor-pointer">
                {copied ? (
                  <div className="flex flex-row items-center justify-between">
                    <svg className="w-4 h-4 mr-1 text-green-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-sm font-medium text-gray-400 hover:text-gray-300 transition-all duration-200 cursor-pointer">Copied!</p> 
              </div>
                ) : (
                  <>Copy to Clipboard</>
                )}
              </button>
              </div>
              <div className="hover:border-gray-600/50 transition-all duration-200 bg-gray-800 border-gray-700/50 border rounded-xl pt-6 pr-6 pb-6 pl-6 shadow-2xl text-gray-400">
                <p>{coverLetter}</p>
              </div>

            </div>
          )}
          {previewResumeImage && (
  <dialog ref={dialogRef} id="image-preview-modal" className="p-0 rounded-lg shadow-xl justify-center items-center m-auto animate-fade-in" onClose={() => setIsModalOpen(false)}>
       <div className="relative">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="cursor-pointer absolute top-2 right-2 text-black bg-white rounded-full p-1 text-2xl font-bold leading-none"
            >
              &times;
            </button>
            <img src={previewResumeImage} alt="Resume Preview" className="w-full h-auto rounded-lg" />
        </div>
   </dialog>
 
        )}
        </div>
        <div className="animate-slide-in-up delay-700">
            <h2 className="text-2xl font-bold text-left mb-8 mt-8 text-white">Your Resumes</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {uploadedResumes.map((resume, index) => (
                <ResumeCard 
                  key={resume.id} 
                  title={resume.name} 
                  description={resume.jobTitle || ''} 
                  ATS_Score={resume.atsScore} 
                  createdAt={resume.createdAt} 
                  analysisResult={resume.analysisResult || ''} 
                  className=''
                />
              ))}
            </div>
          </div>
        </div>


      </main>

  );
}
