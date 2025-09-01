// Template 7: Bold Header (accent band header, clean sections)
import { cn } from "@/lib/utils"

export default function Template7({ resume, className }) {
  const { name, title, summary, experience = [], education = [], skills = [] } = resume || {}
  return (
    <div className={cn("text-gray-900", className)}>
      <header className="mb-6 rounded-md bg-secondary p-6 text-secondary-foreground">
        <h1 className="text-4xl font-bold">{name}</h1>
        <p className="text-lg opacity-90">{title}</p>
        {summary && <p className="mt-3 text-sm leading-relaxed opacity-95">{summary}</p>}
      </header>

      <Section title="Experience">
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

      <Section title="Education">
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

      <Section title="Skills">
        <div className="mt-1 flex flex-wrap gap-2">
          {skills.map((s, i) => (
            <span key={i} className="rounded-full bg-secondary/10 px-2 py-1 text-xs text-secondary-foreground">
              {s}
            </span>
          ))}
        </div>
      </Section>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section className="mb-5">
      <div className="mb-2 flex items-center gap-2">
        <div className="h-5 w-1 rounded bg-secondary" />
        <h2 className="text-sm font-semibold tracking-wide text-gray-800">{title}</h2>
      </div>
      {children}
    </section>
  )
}
