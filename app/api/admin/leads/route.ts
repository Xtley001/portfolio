import { NextResponse } from 'next/server'
import { getSession } from '../../../../lib/session'
import { readAllLeads } from '../../../../lib/assessment/leads'

const INTENT_RANK: Record<string, number> = { hot: 0, warm: 1, cold: 2 }

export async function GET() {
  const session = await getSession()
  if (!session.isAdmin) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const leads = await readAllLeads()

  // Hot intent first, then newest-first within each intent tier (MD1 §11).
  leads.sort((a, b) => {
    const rankDiff = (INTENT_RANK[a.intent] ?? 3) - (INTENT_RANK[b.intent] ?? 3)
    if (rankDiff !== 0) return rankDiff
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  })

  return NextResponse.json({ leads })
}
