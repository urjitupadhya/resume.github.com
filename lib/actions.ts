"use server";

import { GoogleAIFileManager } from '@google/generative-ai/server';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

export const generateATSResults = async (resume: File, jobDescription: string, companyName: string, jobTitle: string) => {
  const prompt = `
  Act as an advanced AI-powered Applicant Tracking System (ATS) resume checker. Your task is to analyze the provided CV against the given job description and company details and provide the output in a structured JSON format.
  
  Inputs:
  companyName: ${companyName}
  jobTitle: ${jobTitle}
  jobDescription: ${jobDescription}
  cvPdf: ${resume.name}
  
  Instructions:
  Generate a detailed ATS analysis. The output MUST be a well-formed JSON object with the following structure and components. Do not include any explanatory text outside of the JSON structure.
  
  1. overallScore:
  A numerical value (integer) from 0 to 100 representing the CV's match percentage to the job description.
  
  2. keywordAnalysis:
  keywordsMatched: An array of strings, where each string is a keyword or phrase from the job description that is present in the CV.
  keywordsMissing: An array of strings, where each string is a critical keyword or skill from the job description not found in the CV.
  skillGapAnalysis: An array of objects, where each object contains a "skill" (string) and a "score" (number), analyzing different skill categories.
  
  3. experienceQualificationMatch:
  experienceAlignment: A string assessing how well the candidate's work experience aligns with the job requirements, mentioning specific relevant roles or projects.
  educationAndCertifications: A string verifying if the candidate's education and certifications meet the specified requirements.
  
  4. atsCompatibility:
  readabilityScore: A string evaluating the CV's layout and structure for ATS readability (e.g., "Excellent", "Good", "Needs Improvement").
  readabilityNotes: A string providing specific feedback on formatting issues like complex tables, images, or unconventional fonts that might hinder parsing.
  fileType: A string confirming the file type (e.g., "PDF").
  
  5. detailedSuggestions:
  summary: A string with actionable suggestions to optimize the CV's summary/objective to better reflect the job title and key requirements.
  workExperience: A string recommending the use of action verbs, quantified achievements, and tailoring job descriptions to match the language in the job posting.
  skillsSection: A string advising on adding any missing hard and soft skills identified in the keyword analysis.
  overallRecommendations: An array of 2-3 strings, each containing a high-impact recommendation for improving the CV for this specific job application.
  
  Expected JSON Output Structure:
  {
    "overallScore": 85,
    "keywordAnalysis": {
      "keywordsMatched": [
        "Java",
        "Spring Boot",
        "Microservices",
        "Agile Methodology",
        "RESTful APIs",
        "SQL"
      ],
      "keywordsMissing": [
        "Kubernetes",
        "Docker",
        "CI/CD"
      ],
      "skillGapAnalysis": [
        {
          "skill": "Technical Skills",
          "score": 85
        },
        {
          "skill": "Industry Knowledge",
          "score": 75
        },
        {
          "skill": "Experience Matching",
          "score": 70
        }
      ]
    },
    "experienceQualificationMatch": {
      "experienceAlignment": "The candidate's experience as a Software Engineer at XYZ Corp directly aligns with the core responsibilities. The project on API development is highly relevant. However, experience with cloud deployment is not explicitly mentioned.",
      "educationAndCertifications": "The Bachelor's degree in Computer Science meets the educational requirements. No required certifications were listed in the job description."
    },
    "atsCompatibility": {
      "readabilityScore": "Excellent",
      "readabilityNotes": "The CV uses a clean, single-column layout with standard fonts (Calibri) and clear headings, making it highly compatible with ATS parsing.",
      "fileType": "PDF"
    },
    "detailedSuggestions": {
      "summary": "Consider tailoring the summary to explicitly mention 'Senior Software Engineer' and include top keywords like 'Microservices' and 'Agile' to immediately grab attention.",
      "workExperience": "Incorporate metrics to quantify achievements. For example, instead of 'Developed new features,' use 'Developed new features that improved system performance by 15%.' Align the language more closely with the job description's responsibilities.",
      "skillsSection": "Create a 'Technical Skills' subsection and add a 'DevOps' category to include technologies like Docker and Kubernetes if you have experience with them.",
      "overallRecommendations": [
        "Integrate the missing keywords 'Kubernetes', 'Docker', and 'CI/CD' into your skills section or work experience if applicable.",
        "Quantify at least 3-4 key achievements in your work experience section to demonstrate impact.",
        "Revise the professional summary to mirror the language and top requirements of the job description."
      ]
    }
  }
  `;
  
    const ai = genkit({
        plugins: [googleAI()],
      });
      
      const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY || '');
      
      // Convert File to Buffer
      const resumeBuffer = Buffer.from(await resume.arrayBuffer());

      const uploadResult = await fileManager.uploadFile(resumeBuffer, {
        mimeType: 'application/pdf',
        displayName: 'CV',
      });
      
      const response = await ai.generate({
        model: googleAI.model('gemini-2.5-flash'),
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'object',
            properties: {
              overallScore: { type: 'number' },
              keywordAnalysis: {
                type: 'object',
                properties: {
                  keywordsMatched: {
                    type: 'array',
                    items: { type: 'string' },
                  },
                  keywordsMissing: {
                    type: 'array',
                    items: { type: 'string' },
                  },
                  skillGapAnalysis: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        skill: { type: 'string' },
                        score: { type: 'number' },
                      },
                      required: ['skill', 'score'],
                    },
                  },
                },
                required: ['keywordsMatched', 'keywordsMissing', 'skillGapAnalysis'],
              },
              experienceQualificationMatch: {
                type: 'object',
                properties: {
                  experienceAlignment: { type: 'string' },
                  educationAndCertifications: { type: 'string' },
                },
                required: ['experienceAlignment', 'educationAndCertifications'],
              },
              atsCompatibility: {
                type: 'object',
                properties: {
                  readabilityScore: { type: 'string' },
                  readabilityNotes: { type: 'string' },
                  fileType: { type: 'string' },
                },
                required: ['readabilityScore', 'readabilityNotes', 'fileType'],
              },
              detailedSuggestions: {
                type: 'object',
                properties: {
                  summary: { type: 'string' },
                  workExperience: { type: 'string' },
                  skillsSection: { type: 'string' },
                  overallRecommendations: {
                    type: 'array',
                    items: { type: 'string' },
                  },
                },
                required: ['summary', 'workExperience', 'skillsSection', 'overallRecommendations'],
              },
            },
            required: ['overallScore', 'keywordAnalysis', 'experienceQualificationMatch', 'atsCompatibility', 'detailedSuggestions'],
          },
        },
        prompt: [
          { text: prompt || ''},
          {
            media: {
              contentType: uploadResult.file.mimeType,
              url: uploadResult.file.uri,
            },
          },
        ],
      });
      
      // The response object's types are misleading. We cast to 'any' to access the real structure.
      const anyResponse = response as any;
      console.log(anyResponse.text);
      // The text is inside the `message.content` array. We loop through it and join the parts.
      if (anyResponse.message && anyResponse.message.content && Array.isArray(anyResponse.message.content)) {
        let fullText = '';
        for (const part of anyResponse.message.content) {
          if (part.text) {
            fullText += part.text;
          }
        }
        return fullText;
      }

      // Fallback if the structure is not as expected.
      return "Error: Could not extract text from AI response.";
} 


export const generateCoverLetter = async (
  resume: File,
  jobDescription: string,
  companyName: string,
  jobTitle: string
) => {
  const prompt = `
You are an expert career coach and professional copywriter specializing in crafting tailored, impactful cover letters.

Your task is to write a fully personalized cover letter using the following inputs:

[Inputs]
1. Resume: Attached
2. Job Description: ${jobDescription}
3. Company Name: ${companyName}
4. Job Title: ${jobTitle}

[Instructions]
- Read the resume carefully and identify the most relevant skills, experiences, and achievements that match the job description.
- Emphasize measurable results (e.g., “increased revenue by X%” or “reduced processing time by Y%”) whenever possible.
- Showcase how the applicant’s background directly aligns with the company’s mission, values, and the responsibilities listed in the job description.
- Use the company name and job title naturally throughout the letter.
- Maintain a professional yet approachable tone, avoiding generic or overly formal phrasing.
- Write in first person, as if the applicant is speaking.
- Structure:
    1. **Opening Paragraph:** Capture attention by referencing the company and role, showing enthusiasm, and hinting at a key strength or achievement.
    2. **Middle Paragraph(s):** Match 3–5 core requirements from the job description with concrete examples from the resume.
    3. **Closing Paragraph:** Reaffirm enthusiasm for the role, suggest a next step (e.g., interview), and express gratitude for consideration.
- Keep the cover letter concise: around 250–350 words, 3–4 paragraphs.
- Do NOT repeat the resume word-for-word — reframe achievements into narrative form.
- Ensure the final letter reads as if written specifically for this company and position, not a generic template.
- Output only the final cover letter, in plain text, ready to send.
  `;

  const ai = genkit({
    plugins: [googleAI()],
  });

  const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY || '');

  // Convert File to Buffer
  const resumeBuffer = Buffer.from(await resume.arrayBuffer());

  const uploadResult = await fileManager.uploadFile(resumeBuffer, {
    mimeType: 'application/pdf',
    displayName: 'CV',
  });

  const response = await ai.generate({
    model: googleAI.model('gemini-2.5-flash'),
    prompt: [
      { text: prompt || '' },
      {
        media: {
          contentType: uploadResult.file.mimeType,
          url: uploadResult.file.uri,
        },
      },
    ],
  });

  // The response object's types are misleading. We cast to 'any' to access the real structure.
  const anyResponse = response as any;
  console.log(anyResponse.text);
  // The text is inside the `message.content` array. We loop through it and join the parts.
  if (anyResponse.message && anyResponse.message.content && Array.isArray(anyResponse.message.content)) {
    let fullText = '';
    for (const part of anyResponse.message.content) {
      if (part.text) {
        fullText += part.text;
      }
    }
    return fullText;
  }

  // Fallback if the structure is not as expected.
  return "Error: Could not extract text from AI response.";
};