'use client'
import { useEffect, useState } from 'react'
import type { SiteData } from '../lib/site'

function StatItem({
  value,
  label,
  index,
  breakdown,
}: {
  value: string
  label: string
  index: number
  breakdown?: { name: string; count: string }[]
}) {
  return (
    <div
      className="reveal visible"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        paddingTop: '16px',
        borderTop: '1px solid var(--border)',
        transitionDelay: `${index * 0.1}s`,
      }}
    >
      {/* Clean Label — No live badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '11px',
            color: 'var(--text-faint)',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            fontWeight: 500,
          }}
        >
          {label}
        </div>
      </div>

      {/* Immediate, Rock-Solid Number (Guaranteed Never Stuck at 0) */}
      <div
        style={{
          fontFamily: 'var(--font-syne)',
          fontWeight: 700,
          fontSize: 'clamp(2.1rem, 3.4vw, 2.9rem)',
          color: 'var(--text)',
          lineHeight: 1.05,
          letterSpacing: '-0.025em',
        }}
      >
        {value}
      </div>

      {/* Understated Breakdown Context */}
      {breakdown && breakdown.length > 0 && (
        <div
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '11.5px',
            color: 'var(--text-dim)',
            letterSpacing: '0.04em',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          {breakdown.map((item, idx) => (
            <span key={item.name} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              {idx > 0 && <span style={{ color: 'var(--border)', margin: '0 4px' }}>/</span>}
              <span style={{ color: 'var(--accent-dim)', fontWeight: 500 }}>{item.count}</span>
              <span>{item.name}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Stats({
  stats,
  initialLiveDownloads,
}: {
  stats: SiteData['stats']
  initialLiveDownloads?: {
    total: number
    crates: number
    pypi: number
  }
}) {
  const [downloadMetrics, setDownloadMetrics] = useState(
    initialLiveDownloads || {
      total: 8352,
      crates: 774,
      pypi: 7578,
    }
  )

  useEffect(() => {
    let mounted = true
    async function fetchLive() {
      try {
        const res = await fetch('/api/stats/downloads')
        if (res.ok) {
          const data = await res.json()
          if (mounted && data.totalDownloads) {
            setDownloadMetrics({
              total: data.totalDownloads,
              crates: data.cratesDownloads,
              pypi: data.pypiDownloads,
            })
          }
        }
      } catch {
        // preserve current metrics
      }
    }
    fetchLive()
    return () => {
      mounted = false
    }
  }, [])

  if (!stats || stats.length === 0) return null

  return (
    <div className="stats-minimal-grid">
      {stats.map((s, i) => {
        const isDownloadStat = s.label.toLowerCase().includes('download')
        const value = isDownloadStat ? `${downloadMetrics.total.toLocaleString()}+` : s.value
        const label = isDownloadStat ? 'Open Source Downloads' : 'Published Production Packages'

        const breakdown = isDownloadStat
          ? [
              { count: `${downloadMetrics.crates.toLocaleString()}+`, name: 'crates.io' },
              { count: `${downloadMetrics.pypi.toLocaleString()}+`, name: 'PyPI' },
            ]
          : [
              { count: '12', name: 'Rust Crates' },
              { count: '9', name: 'Python Packages' },
            ]

        return (
          <StatItem
            key={s.label}
            value={value}
            label={label}
            index={i}
            breakdown={breakdown}
          />
        )
      })}
    </div>
  )
}
