export async function POST(req: Request) {
  try {
    const { profileUrl } = (await req.json()) as { profileUrl?: string }
    if (!profileUrl) {
      return Response.json({ error: "Missing profileUrl" }, { status: 400 })
    }

    let username = ""
    try {
      const u = new URL(profileUrl)
      if (!/github\.com$/.test(u.hostname)) {
        return Response.json({ error: "Invalid GitHub URL" }, { status: 400 })
      }
      const seg = u.pathname.split("/").filter(Boolean)
      if (seg.length < 1) {
        return Response.json({ error: "Could not parse username" }, { status: 400 })
      }
      username = seg[0]
    } catch {
      return Response.json({ error: "Invalid URL" }, { status: 400 })
    }

    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    }
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
    }

    const [profileRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, { headers }),
      fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`, {
        headers,
      }),
    ])

    if (profileRes.status === 404) {
      return Response.json({ error: "GitHub user not found" }, { status: 404 })
    }
    if (!profileRes.ok) {
      const t = await profileRes.text()
      return Response.json({ error: `Profile fetch failed: ${t}` }, { status: profileRes.status })
    }
    if (!reposRes.ok) {
      const t = await reposRes.text()
      return Response.json({ error: `Repos fetch failed: ${t}` }, { status: reposRes.status })
    }

    const profile = await profileRes.json()
    const reposRaw = await reposRes.json()

    const repos = (Array.isArray(reposRaw) ? reposRaw : []).map((r: any) => ({
      id: r.id,
      name: r.name,
      full_name: r.full_name,
      description: r.description ?? "",
      language: r.language ?? "",
      stargazers_count: r.stargazers_count ?? 0,
      forks_count: r.forks_count ?? 0,
      updated_at: r.updated_at,
      html_url: r.html_url,
    }))

    return Response.json({
      profile: {
        login: profile.login,
        name: profile.name ?? "",
        bio: profile.bio ?? "",
        avatar_url: profile.avatar_url ?? "",
        location: profile.location ?? "",
        html_url: profile.html_url,
        public_repos: profile.public_repos ?? repos.length,
        followers: profile.followers ?? 0,
        following: profile.following ?? 0,
      },
      repos,
    })
  } catch (err: any) {
    return Response.json({ error: "Unexpected error", detail: err?.message }, { status: 500 })
  }
}
