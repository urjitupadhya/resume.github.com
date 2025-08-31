"use client";
import React from 'react'
import { useRouter } from "next/navigation";

interface ResumeCardProps {
  title: string;
  description: string;
  ATS_Score: number;
  createdAt: string;
  analysisResult: string;
  className?: string;
}



const ResumeCard = ( { title, description, ATS_Score, createdAt, analysisResult, className }: ResumeCardProps ) => {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/resumes/${title}?analysisResult=${encodeURIComponent(analysisResult)}`);
  };
  return (
    <div className={`hover:border-gray-600/50 transition-all duration-200 bg-gray-800 border-gray-700/50 border rounded-xl pt-6 pr-6 pb-6 pl-6 shadow-2xl ${className || ''}`}>
        <div className="flex mb-4 items-start justify-between">
            <div className="p-3 bg-blue-600/20 rounded-lg">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={ "w-6 h-6 text-blue-500"}
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
            </div>
          <div className={ATS_Score>75 ? ("text-2xl font-semibold text-green-400") : ATS_Score>50 ? ("text-2xl font-semibold text-yellow-400") : ("text-2xl font-semibold text-red-400")}>
            {ATS_Score}%
            <p className="text-sm text-gray-400">ATS Score</p>
          </div>
        </div>
        <h3 className="font-semibold text-lg mb-2 text-white">{title}</h3>
        <p className="text-gray-400 text-sm mb-4">{description}</p>
        <div className="flex items-center justify-between">
        <span className="text-gray-400 text-sm">Uploaded on {createdAt}</span>
        <span className="flex items-center justify-between text-sm text-gray-500 cursor-pointer" onClick={handleClick}>View Resume</span>
        </div>

    </div>
  )
}

export default ResumeCard