import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useSession } from 'next-auth/react';
import ScoreCircle from './Score';

const ResumeDetailCard = ({ analysisResult, title }: { analysisResult: string, title: string }) => {
    const { data: session } = useSession();
    const [url, setUrl] = useState<string | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      setIsMounted(true);
    }, []);

        useEffect(() => {
            if (session?.user?.id && title) {
                const storage = getStorage();
                const storageRef = ref(storage, `resumes/${session.user.id}/${title}.png`);
                
                const fetchUrl = async () => {
                    try {
                        const url = await getDownloadURL(storageRef);
                        setUrl(url);
                    } catch (error) {
                        console.error('Error fetching resume image:', error);
                    }
                }
                fetchUrl();
            }
        }, [session?.user?.id, title]);
    const { overallScore, keywordAnalysis, experienceQualificationMatch, atsCompatibility,  detailedSuggestions } = JSON.parse(analysisResult);

  return (
    <div className='grid lg:grid-cols-2 gap-8 bg-gray-900'>
        <div className="animate-fade-in delay-300">

                <div className='bg-gray-800 border-gray-700/50 border rounded-2xl pt-8 pr-8 pb-8 pl-8 shadow-2xl'>
                    {url && <img src={url}  alt="Resume"  className='fit-contain' />}
                    {!url && <img src={'/placeholder.svg'}  alt="Resume"  className='fit-contain' loading='lazy' />}
                </div>
        </div>

    <div className="bg-gray-800 border-gray-700/50 border rounded-2xl pt-8 pr-8 pb-8 pl-8 shadow-2xl animate-fade-in delay-400">
     
     <div className="mb-8">
     <h3 className="text-xl font-semibold mb-4 tracking-tight text-white">ATS SCORE</h3>
      <div className="flex items-center space-x-6">
      
        <div className="flex items-center">

          <ScoreCircle score={overallScore} size={120} strokeWidth={10} color="lab(59.0978% -58.6621 41.2579)" bgColor="#374151" />
        </div>
        <div className="flex flex-col">
            <p  className="font-semibold text-green-400">{atsCompatibility.readabilityScore}</p>
            <p className="text-sm text-gray-400">Your resume has a high probability of passing ATS screening</p>
        </div>
        {!atsCompatibility && <p className="text-sm text-gray-400">No ATS compatibility found</p>}
     </div>
      </div>



      <div className="mb-6 flex flex-col gap-4">
            <h3 className='text-lg font-semibold mb-2 text-white'>Matched Keywords</h3>
           
            <div className="flex flex-wrap gap-2">
                {keywordAnalysis.keywordsMatched.map((keyword: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm border border-green-500/30">{keyword}</span>
                ))}
    
            </div>
            
        </div>

        <div className="mb-6 flex flex-col gap-4">
            <h3 className='text-lg font-semibold mb-2 text-white'>Matched Keywords</h3>
           
            <div className="flex flex-wrap gap-2">
                {keywordAnalysis.keywordsMissing.map((keyword: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-red-600/20 text-red-400 rounded-full text-sm border border-red-500/30">{keyword}</span>
                ))}
    
            </div>
            
        </div>

        <div className="space-y-3">
            <h3 className="text-lg font-semibold mb-4 text-white">Skill Gap Analysis</h3>
            <div className="space-y-4">    
                {keywordAnalysis.skillGapAnalysis.map((skill: {skill: string, score: number}, index: number) => (
                <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">{skill.skill}</span>
                        <span className="text-sm text-gray-300">{skill.score}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div className= {skill.score > 70 ? "bg-green-600  h-2.5 rounded-full transition-all duration-30" : skill.score > 50 ? "bg-yellow-600  h-2.5 rounded-full transition-all duration-300" : "bg-red-600 h-2.5 rounded-full transition-all duration-300"}  style={{width: `${skill.score}%`}}></div>
                    </div>
                </div>
                ))}
            </div>
              
        </div>

        


      <div className="mt-8">                
        <h3 className="text-xl font-semibold mb-2 text-red-400">What to Improve</h3>
        <div className="flex flex-col gap-4">

 
        <div className="hover:border-gray-600/50 transition-all duration-200 bg-gray-800 border-gray-700/50 border rounded-xl pt-6 pr-6 pb-6 pl-6 shadow-2xl">
        <h5 className="text-white  ">Summary</h5>
        <p className="text-gray-400">{detailedSuggestions.summary}</p>    
            </div>

        <div className="hover:border-gray-600/50 transition-all duration-200 bg-gray-800 border-gray-700/50 border rounded-xl pt-6 pr-6 pb-6 pl-6 shadow-2xl">
            <h5 className="text-white ">Work Experience</h5>
            <p className="text-gray-400">{detailedSuggestions.workExperience}</p>
        </div>

        <div className="hover:border-gray-600/50 transition-all duration-200 bg-gray-800 border-gray-700/50 border rounded-xl pt-6 pr-6 pb-6 pl-6 shadow-2xl">
            <h5 className="text-white ">Skills Section</h5>
            <p className="text-gray-400">{detailedSuggestions.skillsSection}</p>
        </div>

        <div className="hover:border-gray-600/50 transition-all duration-200 bg-gray-800 border-gray-700/50 border rounded-xl pt-6 pr-6 pb-6 pl-6 shadow-2xl">
            <h5 className="text-white ">Overall Recommendations</h5>
            <ul className="list-disc list-inside space-y-2">
                {detailedSuggestions.overallRecommendations.map((suggestion: string, index: number) => (
                    <li key={index} className="text-gray-400">{suggestion}</li>
                ))}
            </ul>
        </div>
       </div>
      </div>
      </div>
    </div>

    
    
    
  )
}

export default ResumeDetailCard