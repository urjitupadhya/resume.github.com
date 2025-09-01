// Template 1: Modern minimalist (two-column design)
import { cn } from "@/lib/utils"

export default function Template1({ resume, className }) {
  const { name, title, summary, experience = [], education = [], skills = [] } = resume || {}

  return (
    <div className={cn("text-gray-900", className)}>
      {/* Header */}
      <header className="mb-6 border-b pb-4">
        <h1 className="text-3xl font-semibold">{name}</h1>
        <p className="text-muted-foreground">{title}</p>
        {summary && <p className="mt-3 text-sm leading-relaxed">{summary}</p>}
      </header>

      {/* Body */}
      <div className="grid grid-cols-3 gap-8">
        {/* Left column */}
        <aside className="col-span-1">
          <SectionTitle>Skills</SectionTitle>
          <ul className="mt-2 grid grid-cols-1 gap-2">
            {skills.map((s, i) => (
              <li key={i} className="text-sm">
                • {s}
              </li>
            ))}
          </ul>
        </aside>

        {/* Right column */}
        <div className="col-span-2">
          <SectionTitle>Experience</SectionTitle>
          <div className="mt-2 space-y-4">
            {experience.map((exp, i) => (
              <div key={i} className="rounded-md border p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">
                    {exp.role} — {exp.company}
                  </h3>
                  <span className="text-xs text-muted-foreground">{exp.years}</span>
                </div>
                {exp.description && <p className="mt-2 text-sm leading-relaxed">{exp.description}</p>}
              </div>
            ))}
          </div>

          <SectionTitle className="mt-6">Education</SectionTitle>
          <div className="mt-2 space-y-3">
            {education.map((ed, i) => (
              <div key={i} className="flex items-center justify-between border-b pb-2">
                <div className="text-sm">
                  <p className="font-medium">{ed.degree}</p>
                  <p className="text-muted-foreground">{ed.college}</p>
                </div>
                <span className="text-xs text-muted-foreground">{ed.year}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionTitle({ children, className }) {
  return <h2 className={cn("text-sm font-semibold tracking-wide text-gray-700", className)}>{children}</h2>
}
