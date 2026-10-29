import { NextResponse } from 'next/server'
import { getLiveDownloadStats } from '../../../../lib/downloads'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // 1 hour

export async function GET() {
  try {
    const stats = await getLiveDownloadStats()
    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch download stats', details: (error as Error).message },
      { status: 500 }
    )
  }
}

