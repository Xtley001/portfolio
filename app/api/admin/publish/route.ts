import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '../../../../lib/session'

// Pushes a new or updated MDX file directly to GitHub
// Vercel picks up the commit and auto-deploys — no server needed
export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session.isAdmin) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const {
    slug, name, tagline, year, status,
    tech, github, live, image, featured, description
  } = body

  if (!slug || !name) {
    return NextResponse.json({ error: 'slug and name required' }, { status: 400 })
  }

  const token = process.env.GITHUB_TOKEN
  const owner = process.env.GITHUB_OWNER   // your GitHub username: Xtley001
  const repo  = process.env.GITHUB_REPO    // your portfolio repo name

  if (!token || !owner || !repo) {
    return NextResponse.json({ error: 'GitHub env vars not set' }, { status: 500 })
  }

  const techArray = Array.isArray(tech) ? tech : tech.split(',').map((t: string) => t.trim()).filter(Boolean)
  const featuredBool = featured === true || featured === 'true'

  const mdxContent = `---
name: "${name}"
slug: "${slug}"
tagline: "${tagline || ''}"
year: ${year || new Date().getFullYear()}
status: "${status || 'active'}"
tech: [${techArray.map((t: string) => `"${t}"`).join(', ')}]
github: "${github || ''}"
live: "${live || ''}"
image: "${image || ''}"
featured: ${featuredBool}
---

${description || ''}
`

  const filePath = `content/projects/${slug}.mdx`
  const base64Content = Buffer.from(mdxContent).toString('base64')
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`

  // Check if file already exists (for update — need the SHA)
  let sha: string | undefined
  try {
    const existingRes = await fetch(apiUrl, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    })
    if (existingRes.ok) {
      const existing = await existingRes.json()
      sha = existing.sha
    }
  } catch {}

  const payload: Record<string, unknown> = {
    message: sha ? `update project: ${name}` : `add project: ${name}`,
    content: base64Content,
  }
  if (sha) payload.sha = sha

  const pushRes = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!pushRes.ok) {
    const err = await pushRes.text()
    return NextResponse.json({ error: err }, { status: 500 })
  }

  return NextResponse.json({ ok: true, message: 'Published. Vercel will deploy in ~30s.' })
}
