type RepoSummary = {
  full_name: string
  bullets: string[]
}

function firstSentence(text: string): string {
  const cleaned = text
    .replace(/\r/g, "")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("<") && !l.startsWith("#")) // skip headings and html
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
  const match = cleaned.match(/(.+?[.!?])(\s|$)/)
  return (match?.[1] || cleaned || "").slice(0, 220)
}

function extractTech({
  languages,
  pkgJson,
  readmeText,
}: {
  languages: Record<string, number>
  pkgJson?: any
  readmeText: string
}): string[] {
  const langs = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .map(([k]) => k)
    .slice(0, 3)

  const deps: string[] = []
  const depObj = {
    ...(pkgJson?.dependencies || {}),
    ...(pkgJson?.devDependencies || {}),
  }
  const keys = Object.keys(depObj)
  // detect common frameworks/libraries
  const map: Record<string, string> = {
    react: "React",
    next: "Next.js",
    vue: "Vue",
    nuxt: "Nuxt",
    svelte: "Svelte",
    "svelte-kit": "SvelteKit",
    sveltekit: "SvelteKit",
    angular: "Angular",
    vite: "Vite",
    express: "Express",
    koa: "Koa",
    fastify: "Fastify",
    nest: "NestJS",
    tailwind: "Tailwind CSS",
    tailwindcss: "Tailwind CSS",
    prisma: "Prisma",
    drizzle: "Drizzle",
    axios: "Axios",
    "react-router": "React Router",
    shadcn: "shadcn/ui",
  }
  keys.forEach((k) => {
    const low = k.toLowerCase()
    for (const cand in map) {
      if (low.includes(cand)) {
        const label = map[cand]
        if (!deps.includes(label)) deps.push(label)
      }
    }
  })

  // basic README keyword hints
  const readme = readmeText.toLowerCase()
  const readmeHints: string[] = []
  const hintMap: Record<string, string> = {
    graphql: "GraphQL",
    tensorflow: "TensorFlow",
    pytorch: "PyTorch",
    docker: "Docker",
    kubernetes: "Kubernetes",
    "github actions": "GitHub Actions",
    eslint: "ESLint",
    jest: "Jest",
    playwright: "Playwright",
    cypress: "Cypress",
  }
  for (const k in hintMap) {
    if (readme.includes(k)) readmeHints.push(hintMap[k])
  }

  const tech = [...langs, ...deps, ...readmeHints]
  // keep unique and limit
  return Array.from(new Set(tech)).slice(0, 6)
}

async function fetchJson(url: string, headers: Record<string, string>) {
  const res = await fetch(url, { headers })
  if (!res.ok) return null
  return res.json()
}

export async function POST(req: Request) {
  try {
    const { repos } = (await req.json()) as { repos?: string[] }
    if (!repos || !Array.isArray(repos) || repos.length === 0) {
      return Response.json({ error: "Provide 'repos' as array of full_name (owner/name)" }, { status: 400 })
    }
    const limited = repos.slice(0, 3)

    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    }
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
    }

    const out: RepoSummary[] = []

    for (const full of limited) {
      const [owner, name] = full.split("/")
      if (!owner || !name) continue

      // Fetch in parallel
      const [repo, readmeResp, langs, pkg] = await Promise.all([
        fetchJson(`https://api.github.com/repos/${owner}/${name}`, headers),
        fetch(`https://api.github.com/repos/${owner}/${name}/readme`, { headers }),
        fetchJson(`https://api.github.com/repos/${owner}/${name}/languages`, headers),
        fetch(`https://api.github.com/repos/${owner}/${name}/contents/package.json`, { headers }),
      ])

      // README text
      let readmeText = ""
      if (readmeResp && readmeResp.ok) {
        const data = await readmeResp.json()
        if (data?.content) {
          try {
            readmeText = Buffer.from(data.content, "base64").toString("utf-8")
          } catch {
            readmeText = ""
          }
        }
      }

      // package.json parse
      let pkgJson: any = undefined
      if (pkg && pkg.ok) {
        const data = await pkg.json()
        if (data?.content) {
          try {
            const content = Buffer.from(data.content, "base64").toString("utf-8")
            pkgJson = JSON.parse(content)
          } catch {
            pkgJson = undefined
          }
        }
      }

      const purpose = firstSentence(readmeText) || (repo?.description || "").trim() || `A ${name} project by ${owner}`

      const tech = extractTech({
        languages: (langs as any) || {},
        pkgJson,
        readmeText,
      })

      const stars = repo?.stargazers_count ?? 0
      const forks = repo?.forks_count ?? 0
      const updated = repo?.pushed_at ? new Date(repo.pushed_at) : null
      const updatedFmt = updated ? updated.toLocaleDateString(undefined, { year: "numeric", month: "short" }) : ""

      const bullets = [
        `Purpose: ${purpose}`,
        `Tech: ${tech.join(", ") || "N/A"}`,
        `Notable: ${stars}★, ${forks} forks${updatedFmt ? `, updated ${updatedFmt}` : ""}`,
      ].map((b) => (b.length > 220 ? b.slice(0, 217) + "..." : b))

      out.push({ full_name: full, bullets })
    }

    return Response.json({
      summaries: Object.fromEntries(out.map((o) => [o.full_name, o.bullets])),
    })
  } catch (err: any) {
    return Response.json({ error: "Failed to generate summaries", detail: err?.message }, { status: 500 })
  }
}
