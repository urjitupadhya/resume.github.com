// Template 3: Creative design (bold headers, icons for sections)
import { Briefcase, GraduationCap, Star } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Template3({ resume, className }) {
  const { name, title, summary, experience = [], education = [], skills = [] } = resume || {}

  return (
    <div className={cn("text-gray-900", className)}>
      {/* Header with accent background */}
      <header className="mb-6 rounded-md bg-blue-600 p-6 text-white">
        <h1 className="text-4xl font-bold">{name}</h1>
        <p className="text-lg opacity-90">{title}</p>
        {summary && <p className="mt-3 text-sm leading-relaxed opacity-95">{summary}</p>}
      </header>

      <Section title="Experience" icon={<Briefcase className="h-4 w-4" />}>
        <div className="grid gap-4">
          {experience.map((exp, i) => (
            <div key={i} className="rounded-md border p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  {exp.role} — {exp.company}
                </h3>
                <span className="text-xs text-muted-foreground">{exp.years}</span>
              </div>
              {exp.description && <p className="mt-2 text-sm leading-relaxed text-gray-700">{exp.description}</p>}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Education" icon={<GraduationCap className="h-4 w-4" />}>
        <div className="grid gap-3">
          {education.map((ed, i) => (
            <div key={i} className="flex items-center justify-between rounded-md border p-3">
              <div>
                <p className="text-sm font-medium">{ed.degree}</p>
                <p className="text-xs text-muted-foreground">{ed.college}</p>
              </div>
              <span className="text-xs text-muted-foreground">{ed.year}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Skills" icon={<Star className="h-4 w-4" />}>
        <div className="mt-1 flex flex-wrap gap-2">
          {skills.map((s, i) => (
            <span key={i} className="rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700">
              {s}
            </span>
          ))}
        </div>
      </Section>
    </div>
  )
}

function Section({ title, icon, children }) {
  return (
    <section className="mb-5">
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-600 text-white">{icon}</div>
        <h2 className="text-sm font-semibold tracking-wide text-gray-800">{title}</h2>
      </div>
      {children}
    </section>
  )
}
