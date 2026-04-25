import { NextResponse } from 'next/server'
import { getSession } from '../../../../lib/session'

export async function GET() {
  const session = await getSession()
  if (session.isAdmin) return NextResponse.json({ ok: true })
  return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
}
