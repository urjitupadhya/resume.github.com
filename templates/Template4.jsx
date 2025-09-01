// Template 4: ATS Compact (clean, single-column, tight spacing)
import { cn } from "@/lib/utils"

export default function Template4({ resume, className }) {
  const { name, title, summary, experience = [], education = [], skills = [] } = resume || {}
  return (
    <div className={cn("text-gray-900", className)}>
      <header className="mb-4">
        <h1 className="text-3xl font-semibold">{name}</h1>
        <p className="text-sm text-gray-700">{title}</p>
        {summary && <p className="mt-2 text-sm leading-relaxed">{summary}</p>}
      </header>

      <Section title="Experience">
        <ul className="space-y-3">
          {experience.map((e, i) => (
            <li key={i}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">
                  {e.role} — {e.company}
                </h3>
                <span className="text-xs text-muted-foreground">{e.years}</span>
              </div>
              {e.description && <p className="mt-1 text-xs leading-relaxed">{e.description}</p>}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Education">
        <ul className="space-y-2">
          {education.map((ed, i) => (
            <li key={i} className="flex items-center justify-between">
              <div className="text-xs">
                <p className="font-medium">{ed.degree}</p>
                <p className="text-muted-foreground">{ed.college}</p>
              </div>
              <span className="text-xs text-muted-foreground">{ed.year}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Skills">
        <p className="text-xs leading-relaxed">{skills.join(" • ")}</p>
      </Section>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section className="py-2">
      <h2 className="text-xs font-semibold tracking-wide text-gray-700">{title}</h2>
      <div className="mt-1">{children}</div>
    </section>
  )
}
