"use client"

import type React from "react"

import { useState, useMemo, useEffect } from "react"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ResumeManager } from "@/components/ResumeManager"
import { AutoSave } from "@/components/AutoSave"
import { useResumeData, ResumeData } from "@/hooks/use-resume-data"

type Experience = {
  id: string
  title: string
  company: string
  start: string
  end: string
  bullets: string[]
  tech: string
}

type Education = {
  id: string
  institution: string
  degree: string
  field: string
  year: string
  gpa?: string
  notes?: string
}

type GitHubProfile = {
  login: string
  name?: string
  bio?: string
  avatar_url?: string
  location?: string
  html_url: string
  public_repos: number
  followers: number
  following: number
}

type GitHubRepo = {
  id: number
  name: string
  full_name: string
  description?: string
  language?: string
  stargazers_count: number
  forks_count: number
  updated_at: string
  html_url: string
}

type PortfolioState = ResumeData

const steps = [
  { id: 1, title: "GitHub" },
  { id: 2, title: "Repositories" },
  { id: 3, title: "Experience" },
  { id: 4, title: "Education" },
  { id: 5, title: "Template" },
  { id: 6, title: "Review" },
] as const

export default function HomePage() {
  const { data: session } = useSession()
  const [current, setCurrent] = useState<number>(1)
  const [state, setState] = useState<PortfolioState>({
    title: "New Resume",
    githubUrl: "",
    githubId: "", // Initialize GitHub ID field
    selectedRepos: [],
    experience: [],
    education: [],
    template: "modern",
    colorScheme: "default",
    links: {},
    repos: [],
    summaries: {},
    noexperienced: false, // Initialize no experience flag
  })
  const [overlayMode, setOverlayMode] = useState<null | "edit" | "preview">(null)

  const progress = useMemo(() => (current / steps.length) * 100, [current])

  function next() {
    setCurrent((c) => Math.min(c + 1, steps.length))
  }
  function prev() {
    setCurrent((c) => Math.max(c - 1, 1))
  }

  async function fetchGitHub(profileUrl: string) {
    try {
      const res = await fetch("/api/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileUrl }),
      })
      const data = await res.json()
      if (!res.ok) {
        return { ok: false, error: data?.error || "Failed to fetch GitHub data" }
      }
      
      // Log the GitHub data received
      console.log("fetchGitHub: Received profile data:", data.profile)
      console.log("fetchGitHub: Received repos count:", data.repos?.length)
      
      // Extract the GitHub username (login) from the profile data
      const githubId = data.profile?.login || ""
      console.log("fetchGitHub: GitHub ID (username):", githubId)
      
      setState((s) => {
        const updatedState = {
          ...s,
          githubUrl: profileUrl, // Ensure the URL is saved
          githubId: githubId, // Store GitHub ID (username) explicitly
          githubProfile: data.profile,
          repos: data.repos ?? [],
          name: s.name || data.profile?.name || s.name,
          bio: s.bio || data.profile?.bio || s.bio,
          location: s.location || data.profile?.location || s.location,
        }
        console.log("fetchGitHub: Updated state:", updatedState)
        console.log("fetchGitHub: GitHub ID saved:", updatedState.githubId)
        return updatedState
      })
      return { ok: true }
    } catch (e: any) {
      console.error("fetchGitHub error:", e)
      return { ok: false, error: e?.message || "Network error" }
    }
  }

  async function generateSummaries(selected: string[]) {
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repos: selected }),
      })
      const data = await res.json()
      if (!res.ok) {
        return { ok: false, error: data?.error || "Failed to generate summaries" }
      }
      setState((s) => ({ ...s, summaries: { ...(s.summaries || {}), ...(data.summaries || {}) } }))
      return { ok: true }
    } catch (e: any) {
      return { ok: false, error: e?.message || "Network error" }
    }
  }

  // Load resume data when user is authenticated
  const { loadResume } = useResumeData()

  const handleLoadResume = (resume: ResumeData) => {
    setState(resume)
  }

  // Load resume from URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const resumeId = urlParams.get('resume');
    
    if (resumeId && session?.user?.id) {
      loadResume(resumeId).then((loadedResume) => {
        if (loadedResume) {
          setState(loadedResume);
        }
      });
    }
  }, [session?.user?.id, loadResume]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <div>
        <h1 className="text-pretty text-2xl font-semibold text-foreground">Portfolio Generator</h1>
        <p className="text-muted-foreground">Create a professional portfolio from your GitHub and experience.</p>
          </div>
          {session && (
            <div className="flex items-center gap-2">
              <AutoSave resumeData={state} enabled={!!session} />
            </div>
          )}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Button variant="outline" onClick={() => setOverlayMode("edit")}>
            Live Edit (Full Screen)
          </Button>
          <Button
            className="bg-primary text-primary-foreground hover:opacity-90"
            onClick={() => setOverlayMode("preview")}
          >
            Live Preview (Full Screen)
          </Button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Resume Manager */}
        <section aria-label="Resume Manager" className="lg:col-span-1">
          <ResumeManager onLoadResume={handleLoadResume} currentResume={state} />
        </section>

        {/* Center: Wizard */}
        <section aria-label="Wizard" className="lg:col-span-2 space-y-4">
      <div className="mb-4 h-2 w-full rounded-full bg-muted">
        <div
          className="h-2 rounded-full bg-primary transition-all"
          style={{ width: `${progress}%` }}
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          role="progressbar"
        />
      </div>

          <StepNav current={current} onStepChange={setCurrent} />
          <Card>
            <CardHeader>
              <CardTitle className="text-pretty">{steps[current - 1].title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {current === 1 && (
                <GitHubStep
                  value={state.githubUrl}
                  onChange={(githubUrl) => setState((s) => ({ ...s, githubUrl }))}
                  onNext={next}
                  onFetch={fetchGitHub}
                  profile={state.githubProfile}
                  reposCount={state.repos.length}
                />
              )}

              {current === 2 && (
                <ReposStep
                  repos={state.repos}
                  selected={state.selectedRepos}
                  onChange={(selectedRepos) => setState((s) => ({ ...s, selectedRepos }))}
                  onPrev={prev}
                  onNext={next}
                  onGenerateSummaries={generateSummaries}
                  summaries={state.summaries || {}}
                />
              )}

              {current === 3 && (
          <ExperienceStep
            value={state.experience}
            onChange={(experience) => {
              console.log('Experience data being updated in state:', experience);
              setState((s) => {
                const updatedState = { ...s, experience };
                console.log('Updated state with new experience data:', updatedState);
                return updatedState;
              });
            }}
            noexperienced={state.noexperienced}
            onNoExperiencedChange={(noexperienced) => setState((s) => ({ ...s, noexperienced }))}
            onPrev={prev}
            onNext={next}
          />
        )}

              {current === 4 && (
                <EducationStep
                  value={state.education}
                  onChange={(education) => setState((s) => ({ ...s, education }))}
                  onPrev={prev}
                  onNext={next}
                />
              )}

              {current === 5 && (
                <TemplateStep
                  template={state.template}
                  colorScheme={state.colorScheme}
                  onChange={(template, colorScheme) => setState((s) => ({ ...s, template, colorScheme }))}
                  onPrev={prev}
                  onNext={next}
                />
              )}

              {current === 6 && <ReviewStep state={state} onChange={setState} onPrev={prev} />}
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Right: Live Preview - Full width below on smaller screens */}
      <div className="mt-6">
        <section aria-label="Live Preview">
          <PortfolioPreview state={state} />
        </section>
      </div>

      {overlayMode && (
        <FullscreenOverlay
          title={overlayMode === "edit" ? "Live Edit" : "Live Preview"}
          onClose={() => setOverlayMode(null)}
        >
          {overlayMode === "edit" ? (
            <LiveEditResume state={state} onChange={setState} onDone={() => setOverlayMode(null)} />
          ) : (
            <div className="mx-auto h-full w-full max-w-4xl overflow-auto p-6">
              <PortfolioPreview state={state} />
              <div className="mt-4 flex justify-end">
                <Button variant="outline" onClick={() => setOverlayMode(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </FullscreenOverlay>
      )}
    </main>
  )
}

function StepNav({
  current,
  onStepChange,
}: {
  current: number
  onStepChange: (n: number) => void
}) {
  return (
    <nav aria-label="Steps" className="flex flex-wrap items-center gap-2">
      {steps.map((s, idx) => {
        const active = current === s.id
        const done = current > s.id
        return (
          <button
            key={s.id}
            onClick={() => onStepChange(s.id)}
            className={cn(
              "flex items-center gap-2 rounded-md border px-3 py-2 text-sm",
              active && "border-primary text-primary",
              done && "border-muted-foreground/30 text-muted-foreground",
              !active && !done && "border-border text-foreground",
            )}
            aria-current={active ? "step" : undefined}
          >
            <span
              className={cn(
                "grid h-5 w-5 place-items-center rounded-full border text-xs",
                active && "bg-primary text-primary-foreground border-primary",
                done && "bg-muted text-foreground",
              )}
            >
              {s.id}
            </span>
            <span className="hidden sm:inline">{s.title}</span>
          </button>
        )
      })}
    </nav>
  )
}

function GitHubStep({
  value,
  onChange,
  onNext,
  onFetch,
  profile,
  reposCount = 0,
}: {
  value: string
  onChange: (v: string) => void
  onNext: () => void
  onFetch: (url: string) => Promise<{ ok: boolean; error?: string }>
  profile?: GitHubProfile
  reposCount?: number
}) {
  const valid = /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9-_.]+\/?$/.test(value)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFetch = async () => {
    if (!valid) return
    setLoading(true)
    setError(null)
    const res = await onFetch(value)
    setLoading(false)
    if (!res.ok) {
      setError(res.error || "Unable to fetch from GitHub")
      return
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="gh" className="text-sm font-medium text-foreground">
          GitHub Profile URL
        </label>
        <Input
          id="gh"
          type="url"
          placeholder="https://github.com/your-username"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={value.length > 0 && !valid}
        />
        <p className="text-xs text-muted-foreground">
          We’ll fetch your profile and repositories. Make sure the profile is public.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={handleFetch}
          disabled={!valid || loading}
          className="bg-primary text-primary-foreground hover:opacity-90"
        >
          {loading ? "Fetching..." : "Fetch from GitHub"}
        </Button>
        <Button onClick={onNext} disabled={reposCount === 0} variant="outline">
          Continue
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {profile && (
        <div className="rounded-md border p-3">
          <p className="text-sm font-medium">{profile.name || profile.login}</p>
          {profile.bio && <p className="text-sm text-muted-foreground">{profile.bio}</p>}
          <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
            <span>Repos: {profile.public_repos}</span>
            <span>Followers: {profile.followers}</span>
            <span>Following: {profile.following}</span>
          </div>
          <p className="mt-2 text-xs">Fetched repos: {reposCount}</p>
        </div>
      )}
    </div>
  )
}

function ReposStep({
  repos,
  selected,
  onChange,
  onPrev,
  onNext,
  onGenerateSummaries,
  summaries,
}: {
  repos: GitHubRepo[]
  selected: string[]
  onChange: (repos: string[]) => void
  onPrev: () => void
  onNext: () => void
  onGenerateSummaries: (selected: string[]) => Promise<{ ok: boolean; error?: string }>
  summaries: Record<string, string[]>
}) {
  const [query, setQuery] = useState("")
  const [lang, setLang] = useState<string>("")
  const [showAll, setShowAll] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const languages = useMemo(() => {
    const set = new Set<string>()
    repos.forEach((r) => {
      if (r.language) set.add(r.language)
    })
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [repos])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return repos
      .filter((r) => {
        const matchesQuery =
          !q ||
          r.name.toLowerCase().includes(q) ||
          (r.description?.toLowerCase().includes(q) ?? false) ||
          r.full_name.toLowerCase().includes(q)
        const matchesLang = !lang || (r.language ?? "") === lang
        return matchesQuery && matchesLang
      })
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
  }, [repos, query, lang])

  const list = showAll ? filtered : filtered.slice(0, 25)

  const toggle = (fullName: string) => {
    if (selected.includes(fullName)) {
      onChange(selected.filter((r) => r !== fullName))
    } else if (selected.length < 3) {
      onChange([...selected, fullName])
    }
  }

  const clearFilters = () => {
    setQuery("")
    setLang("")
  }

  const handleGenerate = async () => {
    if (selected.length !== 3) return
    setLoading(true)
    setError(null)
    const res = await onGenerateSummaries(selected)
    setLoading(false)
    if (!res.ok) {
      setError(res.error || "Failed to generate summaries")
      return
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          placeholder="Search by name or description..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="sm:flex-1"
        />
        <div className="flex items-center gap-2">
          <select
            aria-label="Filter by language"
            className="rounded-md border bg-background px-3 py-2 text-sm"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
          >
            <option value="">All languages</option>
            {languages.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <Button variant="outline" onClick={clearFilters}>
            Clear
          </Button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">Selected {selected.length} / 3</p>

      {repos.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No repositories loaded yet. Go back and fetch from GitHub first.
        </p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">No repositories match your filters.</p>
      ) : (
        <ul className="grid gap-2">
          {list.map((r) => {
            const isSelected = selected.includes(r.full_name)
            const disabled = !isSelected && selected.length >= 3
            const s = summaries[r.full_name]
            return (
              <li key={r.id} className="rounded-md border p-3">
                <button
                  onClick={() => toggle(r.full_name)}
                  disabled={disabled}
                  aria-pressed={isSelected}
                  className={cn("w-full text-left", "flex flex-col gap-2", disabled && "opacity-50")}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{r.full_name}</p>
                      {r.description && <p className="truncate text-xs text-muted-foreground">{r.description}</p>}
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-full border px-2 py-1 text-xs",
                        isSelected ? "border-primary/60 bg-muted" : "border-border",
                      )}
                    >
                      {isSelected ? "Selected" : "Select"}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    {r.language && <span>{r.language}</span>}
                    <span>★ {r.stargazers_count}</span>
                    <span>⑂ {r.forks_count}</span>
                    <span>Updated {new Date(r.updated_at).toLocaleDateString()}</span>
                    <a
                      href={r.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary underline-offset-4 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View on GitHub
                    </a>
                  </div>

                  {s && (
                    <ul className="mt-2 list-disc pl-5 text-xs text-muted-foreground">
                      {s.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {filtered.length > 25 && (
        <div className="flex justify-center">
          <Button variant="ghost" onClick={() => setShowAll((v) => !v)}>
            {showAll ? "Show less" : `Show all (${filtered.length})`}
          </Button>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" onClick={onPrev}>
          Back
        </Button>
        <Button
          onClick={handleGenerate}
          disabled={selected.length !== 3 || loading}
          className="bg-primary text-primary-foreground hover:opacity-90"
        >
          {loading ? "Generating..." : "Generate summaries"}
        </Button>
        <Button onClick={onNext} disabled={selected.length !== 3} variant="secondary">
          Continue
        </Button>
      </div>
    </div>
  )
}

function ExperienceStep({
  value,
  onChange,
  onPrev,
  onNext,
  noexperienced,
  onNoExperiencedChange,
}: {
  value: Experience[]
  onChange: (exp: Experience[]) => void
  onPrev: () => void
  onNext: () => void
  noexperienced?: boolean
  onNoExperiencedChange?: (value: boolean) => void
}) {
  // Minimal add-one form; advanced features (drag-and-drop, autosave) will come later
  const [draft, setDraft] = useState<Experience>({
    id: crypto.randomUUID(),
    title: "",
    company: "",
    start: "",
    end: "",
    bullets: [],
    tech: "",
  })
  const [bullet, setBullet] = useState("")

  const addBullet = () => {
    if (!bullet.trim()) return
    console.log('Adding bullet to experience:', bullet.trim())
    const updatedBullets = [...draft.bullets, bullet.trim()]
    console.log('Updated bullets array:', updatedBullets)
    setDraft((d) => {
      const updated = { ...d, bullets: updatedBullets }
      console.log('Updated draft with new bullet:', updated)
      return updated
    })
    setBullet("")
  }
  const addRole = () => {
    if (!draft.title || !draft.company) return
    console.log('Adding experience role:', draft)
    const updatedExperience = [...value, draft]
    console.log('Updated experience array:', updatedExperience)
    onChange(updatedExperience)
    setDraft({
      id: crypto.randomUUID(),
      title: "",
      company: "",
      start: "",
      end: "",
      bullets: [],
      tech: "",
    })
  }

  const move = (index: number, delta: number) => {
    const next = [...value]
    const newIndex = index + delta
    if (newIndex < 0 || newIndex >= next.length) return
    const [item] = next.splice(index, 1)
    next.splice(newIndex, 0, item)
    onChange(next)
  }
  const removeAt = (index: number) => {
    const next = value.filter((_, i) => i !== index)
    onChange(next)
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <Input
          placeholder="Job title"
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          disabled={noexperienced}
        />
        <Input
          placeholder="Company"
          value={draft.company}
          onChange={(e) => setDraft({ ...draft, company: e.target.value })}
          disabled={noexperienced}
        />
        <Input
          placeholder="Start (e.g., Jan 2022)"
          value={draft.start}
          onChange={(e) => setDraft({ ...draft, start: e.target.value })}
          disabled={noexperienced}
        />
        <Input
          placeholder="End (e.g., Present)"
          value={draft.end}
          onChange={(e) => setDraft({ ...draft, end: e.target.value })}
          disabled={noexperienced}
        />
        <Input
          placeholder="Technologies (comma-separated)"
          value={draft.tech}
          onChange={(e) => setDraft({ ...draft, tech: e.target.value })}
          className="md:col-span-2"
          disabled={noexperienced}
        />
      </div>

      <div className="grid gap-2">
        <div className="flex items-center gap-2">
          <Input 
            placeholder="Add responsibility bullet" 
            value={bullet} 
            onChange={(e) => setBullet(e.target.value)} 
            disabled={noexperienced}
          />
          <Button type="button" onClick={addBullet} disabled={noexperienced}>
            Add
          </Button>
        </div>
        {draft.bullets.length > 0 && (
          <ul className="list-disc pl-6 text-sm text-foreground">
            {draft.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="noexperienced"
            checked={noexperienced}
            onChange={(e) => onNoExperiencedChange?.(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="noexperienced" className="text-sm text-muted-foreground">
            I don't have any work experience
          </label>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onPrev}>
            Back
          </Button>
          <Button onClick={addRole} disabled={noexperienced}>Add position</Button>
          <Button onClick={onNext} className="bg-primary text-primary-foreground hover:opacity-90">
            Continue
          </Button>
        </div>
      </div>

      {value.length > 0 && (
        <div className="pt-2">
          <p className="mb-1 text-sm font-medium">Positions added</p>
          <ul className="space-y-2">
            {value.map((r, idx) => (
              <li key={r.id} className="rounded-md border p-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm">
                    {r.title} • {r.company}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => move(idx, -1)}
                      disabled={idx === 0}
                      aria-label="Move up"
                    >
                      ↑
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => move(idx, 1)}
                      disabled={idx === value.length - 1}
                      aria-label="Move down"
                    >
                      ↓
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => removeAt(idx)} aria-label="Remove">
                      Remove
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function EducationStep({
  value,
  onChange,
  onPrev,
  onNext,
}: {
  value: Education[]
  onChange: (e: Education[]) => void
  onPrev: () => void
  onNext: () => void
}) {
  const [draft, setDraft] = useState<Education>({
    id: crypto.randomUUID(),
    institution: "",
    degree: "",
    field: "",
    year: "",
    gpa: "",
    notes: "",
  })

  const move = (index: number, delta: number) => {
    const next = [...value]
    const newIndex = index + delta
    if (newIndex < 0 || newIndex >= next.length) return
    const [item] = next.splice(index, 1)
    next.splice(newIndex, 0, item)
    onChange(next)
  }
  const removeAt = (index: number) => {
    const next = value.filter((_, i) => i !== index)
    onChange(next)
  }

  const addItem = () => {
    if (!draft.institution || !draft.degree) return
    onChange([...value, draft])
    setDraft({
      id: crypto.randomUUID(),
      institution: "",
      degree: "",
      field: "",
      year: "",
      gpa: "",
      notes: "",
    })
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <Input
          placeholder="Institution"
          value={draft.institution}
          onChange={(e) => setDraft({ ...draft, institution: e.target.value })}
        />
        <Input
          placeholder="Degree / Certification"
          value={draft.degree}
          onChange={(e) => setDraft({ ...draft, degree: e.target.value })}
        />
        <Input
          placeholder="Field of study"
          value={draft.field}
          onChange={(e) => setDraft({ ...draft, field: e.target.value })}
        />
        <Input
          placeholder="Graduation year"
          value={draft.year}
          onChange={(e) => setDraft({ ...draft, year: e.target.value })}
        />
        <Input
          placeholder="GPA (optional)"
          value={draft.gpa}
          onChange={(e) => setDraft({ ...draft, gpa: e.target.value })}
        />
        <Textarea
          placeholder="Relevant coursework/achievements"
          value={draft.notes}
          onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
          className="md:col-span-2"
        />
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onPrev}>
          Back
        </Button>
        <Button onClick={addItem}>Add education</Button>
        <Button onClick={onNext} className="bg-primary text-primary-foreground hover:opacity-90">
          Continue
        </Button>
      </div>

      {value.length > 0 && (
        <div className="pt-2">
          <p className="mb-1 text-sm font-medium">Education added</p>
          <ul className="space-y-2">
            {value.map((r, idx) => (
              <li key={r.id} className="rounded-md border p-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm">
                    {r.degree} • {r.institution}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => move(idx, -1)}
                      disabled={idx === 0}
                      aria-label="Move up"
                    >
                      ↑
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => move(idx, 1)}
                      disabled={idx === value.length - 1}
                      aria-label="Move down"
                    >
                      ↓
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => removeAt(idx)} aria-label="Remove">
                      Remove
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function TemplateStep({
  template,
  colorScheme,
  onChange,
  onPrev,
  onNext,
}: {
  template: PortfolioState["template"]
  colorScheme: PortfolioState["colorScheme"]
  onChange: (t: PortfolioState["template"], c: PortfolioState["colorScheme"]) => void
  onPrev: () => void
  onNext: () => void
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <button
          onClick={() => onChange("modern", colorScheme)}
          className={cn("rounded-md border p-3 text-left", template === "modern" && "border-primary")}
        >
          <p className="font-medium">Modern / Minimal</p>
          <p className="text-sm text-muted-foreground">Clean type, generous spacing.</p>
        </button>
        <button
          onClick={() => onChange("creative", colorScheme)}
          className={cn("rounded-md border p-3 text-left", template === "creative" && "border-primary")}
        >
          <p className="font-medium">Creative / Colorful</p>
          <p className="text-sm text-muted-foreground">Expressive accents.</p>
        </button>
        <button
          onClick={() => onChange("corporate", colorScheme)}
          className={cn("rounded-md border p-3 text-left", template === "corporate" && "border-primary")}
        >
          <p className="font-medium">Professional / Corporate</p>
          <p className="text-sm text-muted-foreground">Structured sections.</p>
        </button>
        <button
          onClick={() => onChange("developer", colorScheme)}
          className={cn("rounded-md border p-3 text-left", template === "developer" && "border-primary")}
        >
          <p className="font-medium">Developer-focused</p>
          <p className="text-sm text-muted-foreground">Tech-forward layout.</p>
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <button
          onClick={() => onChange(template, "default")}
          className={cn("rounded-md border p-3", colorScheme === "default" && "border-primary")}
        >
          <div className="h-6 w-full rounded bg-primary" />
          <p className="mt-2 text-sm">Default</p>
        </button>
        <button
          onClick={() => onChange(template, "green")}
          className={cn("rounded-md border p-3", colorScheme === "green" && "border-primary")}
        >
          <div className="h-6 w-full rounded" style={{ backgroundColor: "var(--primary)" }} />
          <p className="mt-2 text-sm">Green</p>
        </button>
        <button
          onClick={() => onChange(template, "gray")}
          className={cn("rounded-md border p-3", colorScheme === "gray" && "border-primary")}
        >
          <div className="h-6 w-full rounded bg-foreground/60" />
          <p className="mt-2 text-sm">Gray</p>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onPrev}>
          Back
        </Button>
        <Button onClick={onNext} className="bg-primary text-primary-foreground hover:opacity-90">
          Continue
        </Button>
      </div>
    </div>
  )
}

function ReviewStep({
  state,
  onChange,
  onPrev,
}: {
  state: PortfolioState
  onChange: (s: PortfolioState) => void
  onPrev: () => void
}) {
  const buildHtml = () => {
    const title = state.seoTitle || `${state.name || "My"} • Portfolio`
    const desc = state.seoDescription || state.bio || "Personal portfolio generated with Portfolio Generator."
    const url = state.links.website || "" // used for canonical/og:url if provided

    // compute accent by color scheme
    const accent = state.colorScheme === "gray" ? "#374151" : "#15803d" // aligns with current token usage

    const esc = (v: string) => (v || "").replace(/</g, "&lt;").replace(/"/g, "&quot;")

    const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}" />
${url ? `<link rel="canonical" href="${url}" />` : ""}
${url ? `<meta property="og:url" content="${url}" />` : ""}
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(desc)}" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary" />
<meta name="twitter:title" content="${esc(title)}" />
<meta name="twitter:description" content="${esc(desc)}" />
<meta name="robots" content="index,follow" />
<meta name="theme-color" content="${accent}" />
<style>
  :root{--bg:#ffffff;--fg:#111827;--muted:#f3f4f6;--accent:${accent};}
  body{font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Apple Color Emoji, Segoe UI Emoji; background:var(--bg); color:var(--fg); margin:0; padding:24px;}
  .container{max-width: 720px; margin: 0 auto;}
  h1,h2,h3{margin:0 0 8px;}
  .muted{color:#6b7280}
  .card{border:1px solid #e5e7eb; border-radius:8px; padding:16px; margin:16px 0;}
  .accent{color: var(--accent);}
  .grid{display:grid; gap:8px;}
  .list{margin:8px 0 0 18px}
  .row{display:flex; align-items:center; gap:8px; flex-wrap:wrap}
  a{color: var(--accent);}
</style>
</head>
<body>
<div class="container">
  <header class="grid">
    <h1>${esc(state.name || "Your Name")}</h1>
    <div class="muted">${esc(state.role || "Your Role")}</div>
    ${state.location ? `<div class="muted">${esc(state.location)}</div>` : ""}
    ${state.bio ? `<p>${esc(state.bio)}</p>` : ""}
    ${
      state.links?.website || state.links?.linkedin || state.links?.twitter || state.links?.email
        ? `
    <div class="row">
      ${state.links.website ? `<a href="${state.links.website}">Website</a>` : ""}
      ${state.links.linkedin ? `<a href="${state.links.linkedin}">LinkedIn</a>` : ""}
      ${state.links.twitter ? `<a href="${state.links.twitter}">Twitter</a>` : ""}
      ${state.links.email ? `<a href="mailto:${state.links.email}">${state.links.email}</a>` : ""}
    </div>`
        : ""
    }
  </header>

  <section class="card">
    <h2 class="accent">Projects</h2>
    ${
      state.selectedRepos.length
        ? state.selectedRepos
            .map((full) => {
              const r = state.repos.find((x) => x.full_name === full)
              const s = state.summaries?.[full] || []
              return `<div class="grid">
          <strong>${esc(r?.name || full)}</strong>
          <div class="muted row">
            ${r?.language ? `<span>${esc(r.language)}</span>` : ""}
            ${typeof r?.stargazers_count === "number" ? `<span>★ ${r.stargazers_count}</span>` : ""}
            ${typeof r?.forks_count === "number" ? `<span>⑂ ${r.forks_count}</span>` : ""}
            ${r?.html_url ? `<a href="${r.html_url}">GitHub</a>` : ""}
          </div>
          ${s.length ? `<ul class="list">${s.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}
        </div>`
            })
            .join("")
        : `<p class="muted">No projects selected.</p>`
    }
  </section>

  ${
    state.experience.length
      ? `<section class="card">
    <h2 class="accent">Experience</h2>
    ${state.experience
      .map(
        (e) => `
      <div class="grid">
        <strong>${esc(e.title || "")} • ${esc(e.company || "")}</strong>
        <div class="muted">${esc(e.start || "")} - ${esc(e.end || "Present")}</div>
        ${e.bullets?.length ? `<ul class="list">${e.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}
        ${e.tech ? `<div class="muted">Tech: ${esc(e.tech)}</div>` : ""}
      </div>
    `,
      )
      .join("")}
  </section>`
      : ""
  }

  ${
    state.education.length
      ? `<section class="card">
    <h2 class="accent">Education</h2>
    ${state.education
      .map(
        (ed) => `
      <div class="grid">
        <strong>${esc(ed.degree || "")} • ${esc(ed.institution || "")}</strong>
        <div class="muted">${esc(ed.field || "")} • ${esc(ed.year || "")}</div>
        ${ed.gpa ? `<div class="muted">GPA: ${esc(ed.gpa)}</div>` : ""}
        ${ed.notes ? `<div>${esc(ed.notes)}</div>` : ""}
      </div>
    `,
      )
      .join("")}
  </section>`
      : ""
  }
</div>
</body>
</html>`
    return html
  }

  const exportHtml = () => {
    const html = buildHtml()
    const blob = new Blob([html], { type: "text/html;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "portfolio.html"
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const printPdf = () => {
    const html = buildHtml()
    const w = window.open("", "_blank")
    if (!w) return
    w.document.open()
    w.document.write(html)
    w.document.close()
    w.focus()
    w.print()
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Preview your information. You can still make changes.</p>

      <div className="grid gap-2">
        <Input
          placeholder="Your name"
          value={state.name ?? ""}
          onChange={(e) => onChange({ ...state, name: e.target.value })}
        />
        <Input
          placeholder="Professional title"
          value={state.role ?? ""}
          onChange={(e) => onChange({ ...state, role: e.target.value })}
        />
        <Input
          placeholder="Location"
          value={state.location ?? ""}
          onChange={(e) => onChange({ ...state, location: e.target.value })}
        />
        <Textarea
          placeholder="Short bio"
          value={state.bio ?? ""}
          onChange={(e) => onChange({ ...state, bio: e.target.value })}
        />
        <Input
          placeholder="Website URL"
          value={state.links.website ?? ""}
          onChange={(e) => onChange({ ...state, links: { ...state.links, website: e.target.value } })}
        />
        <Input
          placeholder="LinkedIn URL"
          value={state.links.linkedin ?? ""}
          onChange={(e) => onChange({ ...state, links: { ...state.links, linkedin: e.target.value } })}
        />
        <Input
          placeholder="Twitter/X URL"
          value={state.links.twitter ?? ""}
          onChange={(e) => onChange({ ...state, links: { ...state.links, twitter: e.target.value } })}
        />
        <Input
          placeholder="Email"
          type="email"
          value={state.links.email ?? ""}
          onChange={(e) => onChange({ ...state, links: { ...state.links, email: e.target.value } })}
        />
        <Input
          placeholder="SEO Title (optional)"
          value={state.seoTitle ?? ""}
          onChange={(e) => onChange({ ...state, seoTitle: e.target.value })}
        />
        <Textarea
          placeholder="SEO Description (optional)"
          value={state.seoDescription ?? ""}
          onChange={(e) => onChange({ ...state, seoDescription: e.target.value })}
        />
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onPrev}>
          Back
        </Button>
        <Button onClick={exportHtml} className="bg-primary text-primary-foreground hover:opacity-90">
          Export HTML
        </Button>
        <Button variant="secondary" onClick={printPdf}>
          Print to PDF
        </Button>
      </div>
    </div>
  )
}

function PortfolioPreview({ state }: { state: PortfolioState }) {
  const headlineClass = state.colorScheme === "gray" ? "text-foreground" : "text-primary"
  const sectionTitleClass = state.colorScheme === "gray" ? "text-foreground" : "text-primary"
  const wrapperClass =
    state.template === "developer"
      ? "font-mono"
      : state.template === "corporate"
        ? "border border-border"
        : state.template === "creative"
          ? "ring-1 ring-primary/20"
          : ""

  return (
    <Card className={cn("sticky top-6", wrapperClass)}>
      <CardHeader>
        <CardTitle className={cn("text-pretty", headlineClass)}>Live Preview</CardTitle>
      </CardHeader>
      <CardContent className={cn("space-y-6", state.template === "developer" && "text-sm leading-relaxed")}>
        <header className="space-y-1">
          <h2 className={cn("text-xl font-semibold", headlineClass)}>{state.name || "Your Name"}</h2>
          <p className="text-sm text-muted-foreground">{state.role || "Your Role"}</p>
          {state.location && <p className="text-xs text-muted-foreground">{state.location}</p>}
          {(state.links?.website || state.links?.linkedin || state.links?.twitter || state.links?.email) && (
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
              {state.links.website && (
                <a
                  className="text-primary underline-offset-4 hover:underline"
                  href={state.links.website}
                  target="_blank"
                  rel="noreferrer"
                >
                  Website
                </a>
              )}
              {state.links.linkedin && (
                <a
                  className="text-primary underline-offset-4 hover:underline"
                  href={state.links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
              )}
              {state.links.twitter && (
                <a
                  className="text-primary underline-offset-4 hover:underline"
                  href={state.links.twitter}
                  target="_blank"
                  rel="noreferrer"
                >
                  Twitter
                </a>
              )}
              {state.links.email && (
                <a className="text-primary underline-offset-4 hover:underline" href={`mailto:${state.links.email}`}>
                  {state.links.email}
                </a>
              )}
            </div>
          )}
        </header>

        {state.bio && (
          <p
            className={cn(
              "text-pretty text-sm leading-relaxed",
              state.template === "corporate" && "border-l-2 pl-3 border-primary/30",
            )}
          >
            {state.bio}
          </p>
        )}

        <section className="space-y-2">
          <h3 className={cn("text-sm font-medium", sectionTitleClass)}>Projects</h3>
          {state.selectedRepos.length === 0 ? (
            <p className="text-sm text-muted-foreground">Select up to 3 repositories to showcase.</p>
          ) : (
            <ul className="grid gap-2">
              {state.selectedRepos.map((full) => {
                const r = state.repos.find((x) => x.full_name === full)
                const s = state.summaries?.[full]
                return (
                  <li key={full} className="rounded-md border p-3">
                    <p className="text-sm font-medium">{r?.name ?? full}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      {r?.language && <span>{r.language}</span>}
                      {typeof r?.stargazers_count === "number" && <span>★ {r.stargazers_count}</span>}
                      {typeof r?.forks_count === "number" && <span>⑂ {r.forks_count}</span>}
                      {r?.updated_at && <span>Updated {new Date(r.updated_at).toLocaleDateString()}</span>}
                      {r?.html_url && (
                        <a
                          href={r.html_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary underline-offset-4 hover:underline"
                        >
                          GitHub
                        </a>
                      )}
                    </div>
                    <ul className="mt-2 list-disc pl-5 text-xs text-muted-foreground">
                      {s ? (
                        s.map((b, i) => <li key={i}>{b}</li>)
                      ) : (
                        <>
                          <li>Primary purpose will be generated</li>
                          <li>Key technologies detected</li>
                          <li>Notable features/achievements</li>
                        </>
                      )}
                    </ul>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <section className="space-y-2">
          <h3 className={cn("text-sm font-medium", sectionTitleClass)}>Experience</h3>
          {state.experience.length === 0 ? (
            <p className="text-sm text-muted-foreground">Add your positions and responsibilities.</p>
          ) : (
            <ul className="space-y-2">
              {state.experience.map((e) => (
                <li key={e.id} className="rounded-md border p-3">
                  <p className="text-sm font-medium">
                    {e.title} • {e.company}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {e.start} - {e.end || "Present"}
                  </p>
                  {e.bullets.length > 0 && (
                    <ul className="mt-1 list-disc pl-5 text-xs text-muted-foreground">
                      {e.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  )}
                  {e.tech && <p className="mt-1 text-xs">Tech: {e.tech}</p>}
                </li>
              ))}
            </ul>
          )}
        </section>

        {state.education.length > 0 && (
          <section className="space-y-2">
            <h3 className={cn("text-sm font-medium", sectionTitleClass)}>Education</h3>
            <ul className="space-y-2">
              {state.education.map((ed) => (
                <li key={ed.id} className="rounded-md border p-3">
                  <p className="text-sm font-medium">
                    {ed.degree} • {ed.institution}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {ed.field} • {ed.year}
                  </p>
                  {ed.gpa && <p className="text-xs">GPA: {ed.gpa}</p>}
                  {ed.notes && <p className="text-xs">{ed.notes}</p>}
                </li>
              ))}
            </ul>
          </section>
        )}
      </CardContent>
    </Card>
  )
}

function FullscreenOverlay({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex h-full w-full flex-col bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <p className="text-pretty text-lg font-semibold">{title}</p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Press Esc to close</span>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}

function EditableInline({
  value,
  onChange,
  className,
  ariaLabel,
  multiline = false,
}: {
  value?: string
  onChange: (v: string) => void
  className?: string
  ariaLabel: string
  multiline?: boolean
}) {
  function handleInput(e: React.FormEvent<HTMLElement>) {
    const txt = (e.currentTarget as HTMLElement).innerText
    onChange(txt)
  }
  const Comp: any = multiline ? "div" : "span"
  return (
    <Comp
      role="textbox"
      aria-label={ariaLabel}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      className={cn(
        "outline-none ring-0 focus:outline-none focus:ring-2 focus:ring-primary/40",
        multiline && "whitespace-pre-wrap",
        className,
      )}
    >
      {value || ""}
    </Comp>
  )
}

function LiveEditResume({
  state,
  onChange,
  onDone,
}: {
  state: PortfolioState
  onChange: React.Dispatch<React.SetStateAction<PortfolioState>>
  onDone: () => void
}) {
  // helpers to update nested arrays immutably
  const updateExperience = (id: string, patch: Partial<Experience>) => {
    onChange((s) => ({
      ...s,
      experience: s.experience.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }))
  }
  const updateExperienceBullet = (id: string, index: number, txt: string) => {
    onChange((s) => ({
      ...s,
      experience: s.experience.map((e) =>
        e.id === id ? { ...e, bullets: e.bullets.map((b, i) => (i === index ? txt : b)) } : e,
      ),
    }))
  }
  const updateEducation = (id: string, patch: Partial<Education>) => {
    onChange((s) => ({
      ...s,
      education: s.education.map((ed) => (ed.id === id ? { ...ed, ...patch } : ed)),
    }))
  }
  const updateSummaryBullet = (fullName: string, idx: number, txt: string) => {
    onChange((s) => {
      const next = { ...(s.summaries || {}) }
      const arr = (next[fullName] || []).slice()
      if (idx < arr.length) arr[idx] = txt
      next[fullName] = arr
      return { ...s, summaries: next }
    })
  }

  return (
    <div className="mx-auto w-full max-w-4xl p-6">
      <header className="mb-6 space-y-2">
        <EditableInline
          ariaLabel="Name"
          value={state.name}
          onChange={(v) => onChange((s) => ({ ...s, name: v }))}
          className={cn(
            "block text-2xl font-semibold",
            state.colorScheme === "gray" ? "text-foreground" : "text-primary",
          )}
        />
        <EditableInline
          ariaLabel="Role"
          value={state.role}
          onChange={(v) => onChange((s) => ({ ...s, role: v }))}
          className="block text-sm text-muted-foreground"
        />
        <EditableInline
          ariaLabel="Location"
          value={state.location}
          onChange={(v) => onChange((s) => ({ ...s, location: v }))}
          className="block text-xs text-muted-foreground"
        />

        <div className="mt-3">
          <EditableInline
            ariaLabel="Bio"
            value={state.bio}
            multiline
            onChange={(v) => onChange((s) => ({ ...s, bio: v }))}
            className={cn(
              "block text-sm leading-relaxed",
              state.template === "corporate" && "border-l-2 border-primary/30 pl-3",
            )}
          />
        </div>
      </header>

      <section className="space-y-3">
        <h3 className={cn("text-sm font-medium", state.colorScheme === "gray" ? "text-foreground" : "text-primary")}>
          Projects
        </h3>
        {state.selectedRepos.length === 0 ? (
          <p className="text-sm text-muted-foreground">Select up to 3 repositories to showcase.</p>
        ) : (
          <ul className="grid gap-3">
            {state.selectedRepos.map((full) => {
              const r = state.repos.find((x) => x.full_name === full)
              const s = state.summaries?.[full] || []
              return (
                <li key={full} className="rounded-md border p-3">
                  <p className="text-sm font-medium">{r?.name ?? full}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    {r?.language && <span>{r.language}</span>}
                    {typeof r?.stargazers_count === "number" && <span>★ {r.stargazers_count}</span>}
                    {typeof r?.forks_count === "number" && <span>⑂ {r.forks_count}</span>}
                    {r?.updated_at && <span>Updated {new Date(r.updated_at).toLocaleDateString()}</span>}
                    {r?.html_url && (
                      <a
                        href={r.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary underline-offset-4 hover:underline"
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                  <ul className="mt-2 list-disc pl-5 text-xs text-muted-foreground">
                    {s.length > 0 ? (
                      s.map((b, i) => (
                        <li key={i}>
                          <EditableInline
                            ariaLabel={`Project bullet ${i + 1}`}
                            value={b}
                            onChange={(v) => updateSummaryBullet(full, i, v)}
                            className="inline"
                          />
                        </li>
                      ))
                    ) : (
                      <>
                        <li className="opacity-70">Primary purpose will be generated</li>
                        <li className="opacity-70">Key technologies detected</li>
                        <li className="opacity-70">Notable features/achievements</li>
                      </>
                    )}
                  </ul>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <section className="mt-6 space-y-3">
        <h3 className={cn("text-sm font-medium", state.colorScheme === "gray" ? "text-foreground" : "text-primary")}>
          Experience
        </h3>
        {state.experience.length === 0 ? (
          <p className="text-sm text-muted-foreground">Add your positions and responsibilities.</p>
        ) : (
          <ul className="space-y-3">
            {state.experience.map((e) => (
              <li key={e.id} className="rounded-md border p-3">
                <p className="text-sm font-medium">
                  <EditableInline
                    ariaLabel="Job title"
                    value={e.title}
                    onChange={(v) => updateExperience(e.id, { title: v })}
                    className="mr-1"
                  />
                  •
                  <EditableInline
                    ariaLabel="Company"
                    value={e.company}
                    onChange={(v) => updateExperience(e.id, { company: v })}
                    className="ml-1"
                  />
                </p>
                <p className="text-xs text-muted-foreground">
                  <EditableInline
                    ariaLabel="Start date"
                    value={e.start}
                    onChange={(v) => updateExperience(e.id, { start: v })}
                    className="mr-1"
                  />
                  -
                  <EditableInline
                    ariaLabel="End date"
                    value={e.end}
                    onChange={(v) => updateExperience(e.id, { end: v })}
                    className="ml-1"
                  />
                </p>
                {e.bullets.length > 0 && (
                  <ul className="mt-1 list-disc pl-5 text-xs text-muted-foreground">
                    {e.bullets.map((b, i) => (
                      <li key={i}>
                        <EditableInline
                          ariaLabel={`Experience bullet ${i + 1}`}
                          value={b}
                          onChange={(v) => updateExperienceBullet(e.id, i, v)}
                          className="inline"
                        />
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-1 text-xs">
                  Tech:&nbsp;
                  <EditableInline
                    ariaLabel="Technologies"
                    value={e.tech}
                    onChange={(v) => updateExperience(e.id, { tech: v })}
                    className="inline"
                  />
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {state.education.length > 0 && (
        <section className="mt-6 space-y-3">
          <h3 className={cn("text-sm font-medium", state.colorScheme === "gray" ? "text-foreground" : "text-primary")}>
            Education
          </h3>
          <ul className="space-y-3">
            {state.education.map((ed) => (
              <li key={ed.id} className="rounded-md border p-3">
                <p className="text-sm font-medium">
                  <EditableInline
                    ariaLabel="Degree"
                    value={ed.degree}
                    onChange={(v) => updateEducation(ed.id, { degree: v })}
                    className="mr-1"
                  />
                  •
                  <EditableInline
                    ariaLabel="Institution"
                    value={ed.institution}
                    onChange={(v) => updateEducation(ed.id, { institution: v })}
                    className="ml-1"
                  />
                </p>
                <p className="text-xs text-muted-foreground">
                  <EditableInline
                    ariaLabel="Field of study"
                    value={ed.field}
                    onChange={(v) => updateEducation(ed.id, { field: v })}
                    className="mr-1"
                  />
                  •
                  <EditableInline
                    ariaLabel="Graduation year"
                    value={ed.year}
                    onChange={(v) => updateEducation(ed.id, { year: v })}
                    className="ml-1"
                  />
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-8 flex justify-end">
        <Button onClick={onDone} className="bg-primary text-primary-foreground hover:opacity-90">
          Done
        </Button>
      </div>
    </div>
  )
}
