"use client"

import { useMemo, useRef, useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { AnimatePresence, motion } from "framer-motion"
import { useSession } from "next-auth/react"
import { useResumeData } from "@/hooks/use-resume-data"

import resumeData from "./data/resumeData.json"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import TemplateGallery from "@/components/TemplateGallery"
import ResumePreview from "@/components/ResumePre"

export default function Page() {
  const { data: session, status } = useSession()
  const { resumes, loading, saveResume } = useResumeData()
  const [showGallery, setShowGallery] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState("template1")
  const [fontClass, setFontClass] = useState("font-sans")
  const [userResume, setUserResume] = useState(resumeData)
  const previewRef = useRef<HTMLDivElement | null>(null)
  const { theme, setTheme } = useTheme()

  // Use the first resume from user's data if available
  useEffect(() => {
    if (resumes && resumes.length > 0) {
      // Transform the resume data to match the template format
      const firstResume = resumes[0]
      // Log the resume data to debug
      console.log('Template page: First resume data:', firstResume)
      console.log('Template page: Session user:', session?.user)
      console.log('Template page: GitHub ID:', firstResume.githubId)
      
      // Save the name to the resume data if it's not already there
      if (!firstResume.name && (firstResume.githubId || session?.user?.name)) {
        const resumeWithName = {
          ...firstResume,
          name: firstResume.githubId || session?.user?.name
        };
        console.log('Template page: Saving resume with name:', resumeWithName.name);
        // Update the resume with the name field
        saveResume(resumeWithName);
      }
      
      const formattedResume = {
        // Use name from resume if available, otherwise use GitHub ID or session user name
        name: firstResume.name || firstResume.githubId || session?.user?.name || "John Doe",
        // Use GitHub ID as part of the title
        title: firstResume.githubId ? `${firstResume.role || "Software Engineer"} (GitHub: ${firstResume.githubId})` : (firstResume.role || "Software Engineer"),
        summary: firstResume.bio || "Passionate software engineer with experience building high-quality web applications and scalable systems.",
        experience: firstResume.experience?.map(exp => ({
          company: exp.company,
          role: exp.title,
          years: `${exp.start}-${exp.end}`,
          description: exp.bullets?.join(" ") || exp.tech
        })) || [],
        education: firstResume.education?.map(edu => ({
          degree: edu.degree,
          college: edu.institution,
          year: edu.year
        })) || [],
        skills: firstResume.skills || ["Java", "React", "SQL", "Node.js", "Tailwind CSS"]
      }
      setUserResume(formattedResume)
    }
  }, [resumes])

  const templates = useMemo(
    () => [
      { id: "template1", name: "Modern Minimalist" },
      { id: "template2", name: "Corporate Professional" },
      { id: "template3", name: "Creative Design" },
      { id: "template4", name: "ATS Compact" },
      { id: "template5", name: "Elegant Sidebar" },
      { id: "template6", name: "Timeline Pro" },
      { id: "template7", name: "Bold Header" },
    ],
    [],
  )

  const handleSelectTemplate = (id: string) => {
    setSelectedTemplate(id)
    setShowGallery(false)
  }

  const handlePrint = () => {
    if (typeof window === "undefined") return
    const node = previewRef.current
    if (!node) return

    const printWindow = window.open("", "", "width=820,height=1100")
    if (!printWindow) return

    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
      .map((el) => (el as HTMLElement).outerHTML)
      .join("")

    const pageStyle = `
      @page { size: A4; margin: 16mm; }
      @media print {
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .no-print { display: none !important; }
      }
    `

    printWindow.document.write(`<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Resume</title>
  ${styles}
  <style>${pageStyle}</style>
</head>
<body class="${fontClass}">
  ${node.outerHTML}
</body>
</html>`)
    printWindow.document.close()
    printWindow.focus()
    printWindow.onload = () => {
      try {
        printWindow.print()
      } finally {
        printWindow.close()
      }
    }
  }

  return (
    <div className="min-h-dvh bg-background text-foreground mt-16 bg-gradient-to-b from-blue-50 to-blue-200">
      <header className="border-b bg-background">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-balance">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-primary align-middle" />
            Resume Maker — Professional Templates
          </h1>

          <div className="flex items-center gap-2 no-print">
            {!showGallery && (
              <Button
                variant="outline"
                onClick={() => setShowGallery(true)}
                className="transition-colors hover:bg-primary/5"
              >
                Back to Gallery
              </Button>
            )}

            <Select value={fontClass} onValueChange={setFontClass} disabled={showGallery}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Font" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="font-sans">Sans</SelectItem>
                <SelectItem value="font-serif">Serif</SelectItem>
                <SelectItem value="font-mono">Mono</SelectItem>
              </SelectContent>
            </Select>

            {/* <Button
              variant="outline"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="transition-colors hover:bg-primary/5"
            >
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </Button> */}

            <Button
              onClick={handlePrint}
              className="transition-transform hover:-translate-y-0.5"
              disabled={showGallery}
            >
              Download PDF
            </Button>
          </div>
        </div>
      </header>

      {showGallery ? (
        <main className="mx-auto max-w-7xl px-4 py-6">
          <Card className="transition-shadow hover:shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Choose a Template</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="min-h-[70vh]">
                <TemplateGallery
                  templates={templates}
                  selectedTemplate={selectedTemplate}
                  onSelect={handleSelectTemplate}
                  resume={userResume as any}
                />
              </div>
            </CardContent>
          </Card>
        </main>
      ) : (
        <main className="mx-auto max-w-7xl px-4 py-6">
          <Card className="transition-shadow hover:shadow-sm">
            <CardHeader className="no-print">
              <CardTitle className="text-base">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedTemplate + fontClass}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <ResumePreview
                    ref={previewRef}
                    resume={userResume as any}
                    templateKey={selectedTemplate}
                    fontClass={fontClass}
                  />
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>
        </main>
      )}
    </div>
  )
}
