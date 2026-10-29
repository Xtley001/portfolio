export interface PackageStat {
  name: string
  downloads: number
  version?: string
}

export interface DownloadStats {
  totalDownloads: number
  cratesDownloads: number
  pypiDownloads: number
  cratesCount: number
  pypiCount: number
  totalPackages: number
  cratesBreakdown: Record<string, number>
  pypiBreakdown: Record<string, number>
  lastUpdated: string
  source: 'live' | 'fallback'
}

export const TRACKED_CRATES = [
  'driftbrake',
  'driftbrake-core',
  'driftbrake-revm-backend',
  'driftbrake-receipt-poller',
  'driftbrake-reconcile',
  'driftbrake-journal',
  'driftbrake-benchmark',
  'sizing-core',
  'sizing-router',
  'sizing-portfolio',
  'sizing-cli',
  'sizing-watch',
] as const

export const TRACKED_PYPI = [
  'driftbrake-py',
  'optimal-sizing',
  'brain-alpha-core',
  'brain-decorrelator',
  'brain-options',
  'brain-risk-model',
  'brain-sentiment',
  'brain-store',
  'brain-synthesis',
] as const

// Verified snapshot baseline to guarantee zero-latency initial render and offline resilience
const FALLBACK_CRATES: Record<string, number> = {
  driftbrake: 30,
  'driftbrake-core': 221,
  'driftbrake-revm-backend': 68,
  'driftbrake-receipt-poller': 73,
  'driftbrake-reconcile': 112,
  'driftbrake-journal': 20,
  'driftbrake-benchmark': 30,
  'sizing-core': 74,
  'sizing-router': 56,
  'sizing-portfolio': 11,
  'sizing-cli': 22,
  'sizing-watch': 23,
}

const FALLBACK_PYPI: Record<string, number> = {
  'driftbrake-py': 548,
  'optimal-sizing': 534,
  'brain-alpha-core': 699,
  'brain-decorrelator': 1450,
  'brain-options': 611,
  'brain-risk-model': 625,
  'brain-sentiment': 622,
  'brain-store': 575,
  'brain-synthesis': 1431,
}

// In-memory cache for server-side evaluation
let cachedStats: DownloadStats | null = null
let cacheTimestamp = 0
const CACHE_TTL_MS = 1000 * 60 * 60 // 1 hour

export async function getLiveDownloadStats(): Promise<DownloadStats> {
  const now = Date.now()
  if (cachedStats && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedStats
  }

  const cratesBreakdown: Record<string, number> = { ...FALLBACK_CRATES }
  const pypiBreakdown: Record<string, number> = { ...FALLBACK_PYPI }
  let anyLiveSuccess = false

  // Fetch Crates.io statistics with timeout
  const cratePromises = TRACKED_CRATES.map(async name => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 4000)
      const res = await fetch(`https://crates.io/api/v1/crates/${name}`, {
        headers: { 'User-Agent': 'PortfolioStats/1.0 (olubelachristley@gmail.com)' },
        signal: controller.signal,
        next: { revalidate: 3600 },
      })
      clearTimeout(timeoutId)
      if (res.ok) {
        const data = await res.json()
        if (typeof data?.crate?.downloads === 'number') {
          cratesBreakdown[name] = data.crate.downloads
          anyLiveSuccess = true
        }
      }
    } catch {
      // Fallback preserved
    }
  })

  // Fetch PyPI statistics with timeout
  const pypiPromises = TRACKED_PYPI.map(async name => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 4000)
      const res = await fetch(`https://pypistats.org/api/packages/${name}/overall`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        signal: controller.signal,
        next: { revalidate: 3600 },
      })
      clearTimeout(timeoutId)
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data?.data)) {
          const total = data.data.reduce((acc: number, row: { downloads: number }) => acc + (row.downloads || 0), 0)
          if (total > 0) {
            pypiBreakdown[name] = total
            anyLiveSuccess = true
          }
        }
      }
    } catch {
      // Fallback preserved
    }
  })

  await Promise.allSettled([...cratePromises, ...pypiPromises])

  const cratesDownloads = Object.values(cratesBreakdown).reduce((a, b) => a + b, 0)
  const pypiDownloads = Object.values(pypiBreakdown).reduce((a, b) => a + b, 0)
  const totalDownloads = cratesDownloads + pypiDownloads

  const stats: DownloadStats = {
    totalDownloads,
    cratesDownloads,
    pypiDownloads,
    cratesCount: TRACKED_CRATES.length,
    pypiCount: TRACKED_PYPI.length,
    totalPackages: TRACKED_CRATES.length + TRACKED_PYPI.length,
    cratesBreakdown,
    pypiBreakdown,
    lastUpdated: new Date().toISOString(),
    source: anyLiveSuccess ? 'live' : 'fallback',
  }

  cachedStats = stats
  cacheTimestamp = now
  return stats
}

