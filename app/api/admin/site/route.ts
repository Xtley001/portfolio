import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '../../../../lib/session'
import fs from 'fs'
import path from 'path'

const FILE_PATH = 'content/site.json'
const LOCAL_PATH = path.join(process.cwd(), FILE_PATH)

function hasGithubEnv() {
  return !!(process.env.GITHUB_TOKEN && process.env.GITHUB_OWNER && process.env.GITHUB_REPO)
}

function apiUrl() {
  const owner = process.env.GITHUB_OWNER
  const repo = process.env.GITHUB_REPO
  return `https://api.github.com/repos/${owner}/${repo}/contents/${FILE_PATH}`
}

function githubHeaders() {
  return {
    Authorization: `token ${process.env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  }
}

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session.isAdmin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  if (!hasGithubEnv()) {
    try {
      const content = JSON.parse(fs.readFileSync(LOCAL_PATH, 'utf8'))
      return NextResponse.json({ content, sha: '' })
    } catch {
      return NextResponse.json({ error: 'content/site.json not found' }, { status: 404 })
    }
  }

  const res = await fetch(apiUrl(), { headers: githubHeaders() })
  if (!res.ok) return NextResponse.json({ error: 'not found' }, { status: 404 })

  const file = await res.json()
  const content = JSON.parse(Buffer.from(file.content, 'base64').toString('utf8'))
  return NextResponse.json({ content, sha: file.sha })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session.isAdmin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { content, sha } = await req.json()

  if (!hasGithubEnv()) {
    try {
      fs.writeFileSync(LOCAL_PATH, JSON.stringify(content, null, 2), 'utf8')
      return NextResponse.json({ ok: true, message: 'Saved locally (no GitHub env configured).' })
    } catch (e: unknown) {
      return NextResponse.json({ error: String(e) }, { status: 500 })
    }
  }

  const encoded = Buffer.from(JSON.stringify(content, null, 2)).toString('base64')

  const payload: Record<string, unknown> = {
    message: 'update site content via admin panel',
    content: encoded,
  }
  if (sha) payload.sha = sha

  const res = await fetch(apiUrl(), {
    method: 'PUT',
    headers: githubHeaders(),
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const err = await res.text()
    return NextResponse.json({ error: err }, { status: 500 })
  }

  return NextResponse.json({ ok: true, message: 'Saved. Vercel will deploy in ~30s.' })
}
