import fs from 'fs'
import path from 'path'
import type { DimensionKey } from './questions'
import type { PrimaryResult } from './scoring'

const FILE_PATH = 'content/leads/leads.jsonl'
const LOCAL_PATH = path.join(process.cwd(), FILE_PATH)
const LOCAL_DIR = path.dirname(LOCAL_PATH)
const DEDUPE_WINDOW_MS = 24 * 60 * 60 * 1000 // 24h
const DEDUPE_SCAN_LINES = 50

export interface LeadRecord {
  id: string
  timestamp: string
  name: string
  email: string
  whatsapp: string
  businessType: string
  businessStage: string
  intent: 'hot' | 'warm' | 'cold'
  scores: Record<DimensionKey, number>
  rawPoints: Record<DimensionKey, number>
  primaryResult: PrimaryResult
  lowestQuestionId: string
  bottleneckChip: string
  bottleneckText: string
}

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

function splitLines(content: string): string[] {
  return content.split('\n').filter(l => l.trim().length > 0)
}

// Reads the current file. Returns all non-empty lines plus the GitHub sha (if applicable).
async function readCurrent(): Promise<{ lines: string[]; sha?: string }> {
  if (!hasGithubEnv()) {
    console.warn('[assessment/leads] GITHUB_TOKEN/GITHUB_OWNER/GITHUB_REPO not set — using local fs fallback for leads.jsonl.')
    try {
      if (!fs.existsSync(LOCAL_PATH)) return { lines: [] }
      const content = fs.readFileSync(LOCAL_PATH, 'utf8')
      return { lines: splitLines(content) }
    } catch {
      return { lines: [] }
    }
  }

  const res = await fetch(apiUrl(), { headers: githubHeaders() })
  if (res.status === 404) return { lines: [] }
  if (!res.ok) {
    console.warn(`[assessment/leads] GitHub read failed (${res.status}) — treating as empty file for this request.`)
    return { lines: [] }
  }
  const file = await res.json()
  const content = Buffer.from(file.content, 'base64').toString('utf8')
  return { lines: splitLines(content), sha: file.sha }
}

async function writeLine(newLine: string, existingLines: string[], sha?: string): Promise<void> {
  const newContent = [...existingLines, newLine].join('\n') + '\n'

  if (!hasGithubEnv()) {
    fs.mkdirSync(LOCAL_DIR, { recursive: true })
    fs.appendFileSync(LOCAL_PATH, newLine + '\n', 'utf8')
    return
  }

  const encoded = Buffer.from(newContent).toString('base64')
  const payload: Record<string, unknown> = {
    message: 'new assessment lead',
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
    console.warn(`[assessment/leads] GitHub write failed: ${err}`)
  }
}

function isRecentDuplicate(lines: string[], email: string, whatsapp: string): boolean {
  const scan = lines.slice(-DEDUPE_SCAN_LINES)
  const now = Date.now()
  const normEmail = email.trim().toLowerCase()
  const normWhatsapp = whatsapp.trim().replace(/[^0-9]/g, '')

  for (const line of scan) {
    try {
      const record = JSON.parse(line) as LeadRecord
      const ts = new Date(record.timestamp).getTime()
      if (isNaN(ts) || now - ts > DEDUPE_WINDOW_MS) continue

      const recordEmail = (record.email || '').trim().toLowerCase()
      const recordWhatsapp = (record.whatsapp || '').trim().replace(/[^0-9]/g, '')

      if (normEmail && recordEmail && normEmail === recordEmail) return true
      if (normWhatsapp && recordWhatsapp && normWhatsapp === recordWhatsapp) return true
    } catch {
      continue // malformed line — skip, never crash the submit flow over one bad row
    }
  }
  return false
}

// Used by the admin Leads tab (MD1 §11) — read-only, parses every line.
export async function readAllLeads(): Promise<LeadRecord[]> {
  const { lines } = await readCurrent()
  const leads: LeadRecord[] = []
  for (const line of lines) {
    try {
      leads.push(JSON.parse(line) as LeadRecord)
    } catch {
      continue // malformed line — skip rather than fail the whole tab
    }
  }
  return leads
}

export async function saveLead(input: Omit<LeadRecord, 'id' | 'timestamp'>): Promise<{ lead: LeadRecord; isDuplicate: boolean }> {
  const lead: LeadRecord = {
    ...input,
    id: (globalThis.crypto?.randomUUID?.() as string | undefined) || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    timestamp: new Date().toISOString(),
  }

  const { lines, sha } = await readCurrent()
  const duplicate = isRecentDuplicate(lines, lead.email, lead.whatsapp)

  if (duplicate) {
    // Don't create a duplicate lead line (MD1 §5 / MD2 §6).
    return { lead, isDuplicate: true }
  }

  await writeLine(JSON.stringify(lead), lines, sha)
  return { lead, isDuplicate: false }
}
