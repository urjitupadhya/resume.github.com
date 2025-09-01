// Template 2: Corporate professional (single-column, clean lines)
import { cn } from "@/lib/utils"

export default function Template2({ resume, className }) {
  const { name, title, summary, experience = [], education = [], skills = [] } = resume || {}

  return (
    <div className={cn("text-gray-900", className)}>
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-4xl font-bold">{name}</h1>
        <p className="text-lg text-gray-700">{title}</p>
        {summary && <p className="mt-4 text-sm leading-relaxed">{summary}</p>}
      </header>

      <Rule />

      <Section title="Experience">
        <div className="space-y-5">
          {experience.map((item, i) => (
            <div key={i}>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">
                  {item.role} — {item.company}
                </h3>
                <span className="text-xs text-muted-foreground">{item.years}</span>
              </div>
              {item.description && <p className="mt-1 text-sm leading-relaxed">{item.description}</p>}
            </div>
          ))}
        </div>
      </Section>

      <Rule />

      <Section title="Education">
        <div className="space-y-3">
          {education.map((ed, i) => (
            <div key={i} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{ed.degree}</p>
                <p className="text-sm text-muted-foreground">{ed.college}</p>
              </div>
              <span className="text-xs text-muted-foreground">{ed.year}</span>
            </div>
          ))}
        </div>
      </Section>

      <Rule />

      <Section title="Skills">
        <p className="text-sm leading-relaxed">{skills.join(" • ")}</p>
      </Section>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section className="py-4">
      <h2 className="text-sm font-semibold tracking-wide text-gray-700">{title}</h2>
      <div className="mt-2">{children}</div>
    </section>
  )
}

function Rule() {
  return <div className="my-2 h-px w-full bg-gray-200" />
}
