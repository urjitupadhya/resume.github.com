// Template 6: Timeline Pro (vertical timeline for experience)
import { cn } from "@/lib/utils"

export default function Template6({ resume, className }) {
  const { name, title, summary, experience = [], education = [], skills = [] } = resume || {}
  return (
    <div className={cn("text-gray-900", className)}>
      <header className="mb-6">
        <h1 className="text-3xl font-semibold">{name}</h1>
        <p className="text-muted-foreground">{title}</p>
        {summary && <p className="mt-3 text-sm leading-relaxed">{summary}</p>}
      </header>

      <section className="mb-6">
        <h2 className="text-sm font-semibold tracking-wide text-gray-700">Experience</h2>
        <div className="mt-3 grid grid-cols-1 gap-5">
          {experience.map((exp, i) => (
            <div key={i} className="relative pl-6">
              <div className="absolute left-2 top-1 h-full w-px bg-gray-200" />
              <div className="absolute left-1 top-1 h-2 w-2 rounded-full bg-primary" />
              <div className="rounded-md border p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">
                    {exp.role} — {exp.company}
                  </h3>
                  <span className="text-xs text-muted-foreground">{exp.years}</span>
                </div>
                {exp.description && <p className="mt-2 text-sm leading-relaxed">{exp.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-6">
        <section>
          <h2 className="text-sm font-semibold tracking-wide text-gray-700">Education</h2>
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
        </section>

        <section>
          <h2 className="text-sm font-semibold tracking-wide text-gray-700">Skills</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {skills.map((s, i) => (
              <span key={i} className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                {s}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
