import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '../../../../lib/session'
import fs from 'fs'
import path from 'path'

const PROJECTS_DIR = path.join(process.cwd(), 'content/projects')

function hasGithubEnv() {
  return !!(process.env.GITHUB_TOKEN && process.env.GITHUB_OWNER && process.env.GITHUB_REPO)
}

function githubHeaders(token: string) {
  return {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json',
  }
}

function parseMdx(raw: string, slug: string, sha = '') {
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/)
  const body = fmMatch ? raw.slice(fmMatch[0].length).trim() : raw
  const fm: Record<string, string> = {}
  if (fmMatch) {
    fmMatch[1].split('\n').forEach(line => {
      const col = line.indexOf(':')
      if (col === -1) return
      const key = line.slice(0, col).trim()
      const val = line.slice(col + 1).trim().replace(/^["']|["']$/g, '')
      fm[key] = val
    })
  }
  const techRaw = fm.tech || ''
  const tech = techRaw
    .replace(/^\[|\]$/g, '')
    .split(',')
    .map((s: string) => s.trim().replace(/^["']|["']$/g, ''))
    .filter(Boolean)

  return {
    slug,
    name: fm.name || slug,
    tagline: fm.tagline || '',
    year: Number(fm.year) || new Date().getFullYear(),
    status: fm.status || 'active',
    tech,
    github: fm.github || '',
    live: fm.live || '',
    image: fm.image || '',
    featured: fm.featured === 'true',
    description: body,
    sha,
  }
}

// GET /api/admin/projects         → list all project files
// GET /api/admin/projects?slug=X  → fetch & parse a single project file
export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session.isAdmin) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const slug = req.nextUrl.searchParams.get('slug')

  // ── Local filesystem fallback ──────────────────────────────────────────────
  if (!hasGithubEnv()) {
    try {
      fs.mkdirSync(PROJECTS_DIR, { recursive: true })
    } catch { /* ignore */ }

    if (slug) {
      const filePath = path.join(PROJECTS_DIR, `${slug}.mdx`)
      if (!fs.existsSync(filePath)) return NextResponse.json({ error: 'not found' }, { status: 404 })
      const raw = fs.readFileSync(filePath, 'utf8')
      return NextResponse.json(parseMdx(raw, slug))
    }

    const files = fs.existsSync(PROJECTS_DIR)
      ? fs.readdirSync(PROJECTS_DIR).filter(f => f.endsWith('.mdx')).map(f => ({ name: f, sha: '' }))
      : []
    return NextResponse.json({ files })
  }

  // ── GitHub path ────────────────────────────────────────────────────────────
  const token = process.env.GITHUB_TOKEN!
  const owner = process.env.GITHUB_OWNER!
  const repo  = process.env.GITHUB_REPO!

  if (slug) {
    const fileRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/content/projects/${slug}.mdx`,
      { headers: githubHeaders(token) }
    )
    if (!fileRes.ok) return NextResponse.json({ error: 'not found' }, { status: 404 })
    const file = await fileRes.json()
    const raw = Buffer.from(file.content, 'base64').toString('utf8')
    return NextResponse.json(parseMdx(raw, slug, file.sha))
  }

  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/content/projects`,
    { headers: githubHeaders(token) }
  )
  if (!res.ok) return NextResponse.json({ files: [] })
  const files = await res.json()
  return NextResponse.json({
    files: files.map((f: { name: string; sha: string }) => ({ name: f.name, sha: f.sha })),
  })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session.isAdmin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = await req.json()
  const { slug, name, tagline, year, status, tech, github, live, image, featured, description, sha } = body

  const techStr = '[' + tech.map((t: string) => `"${t}"`).join(', ') + ']'
  const raw = `---
name: "${name}"
tagline: "${tagline}"
year: ${year}
status: ${status}
tech: ${techStr}
github: "${github}"
live: "${live}"
image: "${image}"
featured: ${featured}
---

${description || ''}`

  if (!hasGithubEnv()) {
    try {
      fs.mkdirSync(PROJECTS_DIR, { recursive: true })
      fs.writeFileSync(path.join(PROJECTS_DIR, `${slug}.mdx`), raw, 'utf8')
      return NextResponse.json({ ok: true, message: 'Saved locally.' })
    } catch (e: unknown) {
      return NextResponse.json({ error: String(e) }, { status: 500 })
    }
  }

  const token = process.env.GITHUB_TOKEN!
  const owner = process.env.GITHUB_OWNER!
  const repo  = process.env.GITHUB_REPO!
  const encoded = Buffer.from(raw).toString('base64')
  const payload: Record<string, unknown> = {
    message: `update project: ${slug}`,
    content: encoded,
  }
  if (sha) payload.sha = sha

  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/content/projects/${slug}.mdx`,
    { method: 'PUT', headers: { ...githubHeaders(token), 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
  )
  if (!res.ok) return NextResponse.json({ error: await res.text() }, { status: 500 })
  return NextResponse.json({ ok: true, message: 'Saved. Vercel will deploy in ~30s.' })
}

export async function DELETE(req: NextRequest) {
  const session = await getSession()
  if (!session.isAdmin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { slug, sha } = await req.json()

  if (!hasGithubEnv()) {
    try {
      const filePath = path.join(PROJECTS_DIR, `${slug}.mdx`)
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
      return NextResponse.json({ ok: true })
    } catch (e: unknown) {
      return NextResponse.json({ error: String(e) }, { status: 500 })
    }
  }

  const token = process.env.GITHUB_TOKEN!
  const owner = process.env.GITHUB_OWNER!
  const repo  = process.env.GITHUB_REPO!

  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/content/projects/${slug}.mdx`,
    {
      method: 'DELETE',
      headers: { ...githubHeaders(token), 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: `remove project: ${slug}`, sha }),
    }
  )
  if (!res.ok) return NextResponse.json({ error: await res.text() }, { status: 500 })
  return NextResponse.json({ ok: true })
}
