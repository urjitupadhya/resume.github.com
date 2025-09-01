"use client"

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useResumeData } from '@/hooks/use-resume-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Edit, Download, ArrowLeft, Calendar, MapPin, Mail, Globe, Github, Linkedin, Twitter } from 'lucide-react';
import { cn } from '@/lib/utils';
import ResumeDetailCard from '@/components/ResumeDetailCard';

export default function ResumeViewPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const analysisResult = searchParams.get('analysisResult');
  const { data: session } = useSession();
  const { loadResume, loading, error } = useResumeData();
  const [resume, setResume] = useState<any>(null);

  useEffect(() => {
    if (id && session?.user?.id) {
      // Sanitize the resumeId from URL to match Firebase path requirements
      const sanitizedResumeId = (id as string).replace(/[.#$\[\]]/g, '_');
      loadResume(sanitizedResumeId).then((loadedResume) => {
        if (loadedResume) {
          setResume(loadedResume);
        }
      });
    }
  }, [id, session?.user?.id, loadResume]);

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Please Sign In</h1>
          <p className="text-muted-foreground mb-6">You need to be signed in to view resumes.</p>
          <Button onClick={() => router.push('/auth/signin')}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Resume Not Found</h1>
          <p className="text-muted-foreground mb-6">The resume you're looking for doesn't exist or you don't have access to it.</p>
          <Button onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  const exportToPDF = () => {
    window.print();
  };

  const exportToHTML = () => {
    const html = generateHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resume.title || 'resume'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateHTML = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${resume.name || 'Resume'}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .name { font-size: 2.5em; font-weight: bold; margin-bottom: 10px; }
        .title { font-size: 1.2em; color: #666; margin-bottom: 10px; }
        .contact { margin-bottom: 20px; }
        .section { margin-bottom: 30px; }
        .section-title { font-size: 1.5em; font-weight: bold; border-bottom: 2px solid #333; margin-bottom: 15px; }
        .item { margin-bottom: 20px; }
        .item-header { font-weight: bold; margin-bottom: 5px; }
        .item-subheader { color: #666; margin-bottom: 10px; }
        .bullets { margin-left: 20px; }
        .bullets li { margin-bottom: 5px; }
    </style>
</head>
<body>
    <div class="header">
       <div class="name">${resume.name || '💙 ATS Insights Dashboard ✨'}</div>

 
        <div class="contact">
            ${resume.location ? `<div>${resume.location}</div>` : ''}
            ${resume.links?.email ? `<div>${resume.links.email}</div>` : ''}
            ${resume.links?.website ? `<div>${resume.links.website}</div>` : ''}
        </div>
    </div>

    ${resume.bio ? `<div class="section">
        <div class="section-title">Summary</div>
        <p>${resume.bio}</p>
    </div>` : ''}

    ${resume.experience && resume.experience.length > 0 ? `<div class="section">
        <div class="section-title">Experience</div>
        ${resume.experience.map((exp: any) => `
            <div class="item">
                <div class="item-header">${exp.title} at ${exp.company}</div>
                <div class="item-subheader">${exp.start} - ${exp.end || 'Present'}</div>
                ${exp.bullets && exp.bullets.length > 0 ? `<ul class="bullets">
                    ${exp.bullets.map((bullet: string) => `<li>${bullet}</li>`).join('')}
                </ul>` : ''}
                ${exp.tech ? `<div><strong>Technologies:</strong> ${exp.tech}</div>` : ''}
            </div>
        `).join('')}
    </div>` : ''}

    ${resume.education && resume.education.length > 0 ? `<div class="section">
        <div class="section-title">Education</div>
        ${resume.education.map((edu: any) => `
            <div class="item">
                <div class="item-header">${edu.degree} in ${edu.field}</div>
                <div class="item-subheader">${edu.institution} - ${edu.year}</div>
                ${edu.gpa ? `<div>GPA: ${edu.gpa}</div>` : ''}
                ${edu.notes ? `<div>${edu.notes}</div>` : ''}
            </div>
        `).join('')}
    </div>` : ''}

    ${resume.selectedRepos && resume.selectedRepos.length > 0 ? `<div class="section">
        <div class="section-title">Projects</div>
        ${resume.selectedRepos.map((repoName: string) => {
            const repo = resume.repos && resume.repos.find((r: any) => r.full_name === repoName);
            const summaries = resume.summaries?.[repoName] || [];
            return `
                <div class="item">
                    <div class="item-header">${repo?.name || repoName}</div>
                    ${repo?.description ? `<div class="item-subheader">${repo.description}</div>` : ''}
                    ${summaries && summaries.length > 0 ? `<ul class="bullets">
                        ${summaries.map((summary: string) => `<li>${summary}</li>`).join('')}
                    </ul>` : ''}
                </div>
            `;
        }).join('')}
    </div>` : ''}
</body>
</html>`;
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 mt-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{resume.title}</h1>
            <p className="text-muted-foreground">
              Last updated {resume.updatedAt ? formatDate(resume.updatedAt) : 'Never'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => router.push(`/builder?resume=${resume.id}`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" onClick={exportToHTML}>
            <Download className="h-4 w-4 mr-2" />
            Export HTML
          </Button>
          <Button variant="outline" onClick={exportToPDF}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Resume Content */}
      <Card className="print:shadow-none print:border-none">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{resume.name || '💙 ATS Insights Dashboard ✨'}</h1>
           
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              {resume.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {resume.location}
                </div>
              )}
              {resume.links?.email && (
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {resume.links.email}
                </div>
              )}
              {resume.links?.website && (
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  {resume.links.website}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
              {resume.links?.linkedin && (
                <a href={resume.links.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
              {resume.links?.twitter && (
                <a href={resume.links.twitter} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  <Twitter className="h-4 w-4" />
                </a>
              )}
              {resume.githubUrl && (
                <a href={resume.githubUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  <Github className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {resume.bio && (
            <>
              <Separator className="my-6" />
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Summary</h2>
                <p className="text-muted-foreground leading-relaxed">{resume.bio}</p>
              </div>
            </>
          )}

          {/* Experience */}
          {resume.experience.length > 0 && (
            <>
              <Separator className="my-6" />
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Experience</h2>
                <div className="space-y-6">
                  {resume.experience.map((exp: any, index: number) => (
                    <div key={exp.id || index}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{exp.title}</h3>
                          <p className="text-muted-foreground">{exp.company}</p>
                        </div>
                        <div className="text-sm text-muted-foreground text-right">
                          <div>{exp.start} - {exp.end || 'Present'}</div>
                        </div>
                      </div>
                      {exp.bullets && exp.bullets.length > 0 && (
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mt-2">
                          {exp.bullets.map((bullet: string, bulletIndex: number) => (
                            <li key={bulletIndex}>{bullet}</li>
                          ))}
                        </ul>
                      )}
                      {exp.tech && (
                        <div className="mt-2">
                          <span className="text-sm font-medium">Technologies: </span>
                          <span className="text-sm text-muted-foreground">{exp.tech}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Education */}
          {resume.education && resume.education.length > 0 && (
            <>
              <Separator className="my-6" />
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Education</h2>
                <div className="space-y-4">
                  {resume.education.map((edu: any, index: number) => (
                    <div key={edu.id || index}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{edu.degree}</h3>
                          <p className="text-muted-foreground">{edu.institution}</p>
                          <p className="text-sm text-muted-foreground">{edu.field}</p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {edu.year}
                        </div>
                      </div>
                      {edu.gpa && (
                        <p className="text-sm text-muted-foreground mt-1">GPA: {edu.gpa}</p>
                      )}
                      {edu.notes && (
                        <p className="text-sm text-muted-foreground mt-1">{edu.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Projects */}
          {resume.selectedRepos && resume.selectedRepos.length > 0 && (
            <>
              <Separator className="my-6" />
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Projects</h2>
                <div className="space-y-6">
                  {resume.selectedRepos.map((repoName: string, index: number) => {
                    const repo = resume.repos.find((r: any) => r.full_name === repoName);
                    const summaries = resume.summaries?.[repoName] || [];
                    return (
                      <div key={index}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">{repo?.name || repoName}</h3>
                            {repo?.description && (
                              <p className="text-muted-foreground">{repo.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {repo?.language && (
                              <Badge variant="outline">{repo.language}</Badge>
                            )}
                            {repo?.stargazers_count !== undefined && (
                              <span>★ {repo.stargazers_count}</span>
                            )}
                          </div>
                        </div>
                        {summaries.length > 0 && (
                          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            {summaries.map((summary: string, summaryIndex: number) => (
                              <li key={summaryIndex}>{summary}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Display ATS Analysis Results if available and needed */}
      {analysisResult && searchParams.get('showAnalysis') === 'true' && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>ATS Analysis Results</CardTitle>
            </CardHeader>
            <CardContent>
              <ResumeDetailCard analysisResult={analysisResult} title={id as string} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
