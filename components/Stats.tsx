'use client'
import { useEffect, useRef, useState } from 'react'
import type { SiteData } from '../lib/site'

function useCountUp(target: number, duration: number = 1300) {
  const [count, setCount] = useState(0)
  const isStarted = useRef(false)
  const currentValRef = useRef(0)

  useEffect(() => {
    let animId: number | null = null

    const runAnimation = (from: number, to: number, dur: number) => {
      const start = performance.now()
      const diff = to - from
      if (diff === 0) {
        setCount(to)
        currentValRef.current = to
        return
      }

      const step = (now: number) => {
        const elapsed = now - start
        const progress = Math.min(elapsed / dur, 1)
        // Ease-out cubic: rapidly climbs then decelerates into the target
        const easeOut = 1 - Math.pow(1 - progress, 3)
        const val = Math.round(from + diff * easeOut)
        setCount(val)
        currentValRef.current = val

        if (progress < 1) {
          animId = requestAnimationFrame(step)
        } else {
          setCount(to)
          currentValRef.current = to
        }
      }
      animId = requestAnimationFrame(step)
    }

    if (!isStarted.current) {
      isStarted.current = true
      runAnimation(0, target, duration)
    } else {
      // If target updated dynamically after live fetch
      if (target !== currentValRef.current) {
        runAnimation(currentValRef.current, target, 800)
      }
    }

    return () => {
      if (animId) cancelAnimationFrame(animId)
    }
  }, [target, duration])

  return count
}

function AnimatedNumber({
  value,
  duration = 1300,
  style,
}: {
  value: string
  duration?: number
  style?: React.CSSProperties
}) {
  const clean = value.replace(/,/g, '')
  const match = clean.match(/^([^0-9]*)([0-9]+)(.*)$/)
  const prefix = match ? match[1] : ''
  const target = match ? parseInt(match[2], 10) : 0
  const suffix = match ? match[3] : ''

  const count = useCountUp(target, duration)

  return (
    <span
      style={{
        fontVariantNumeric: 'tabular-nums',
        fontFeatureSettings: '"tnum"',
        display: 'inline-block',
        ...style,
      }}
    >
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

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
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={ref}
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

      {/* Clean, Animated Number */}
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
        <AnimatedNumber value={value} duration={1300} />
      </div>

      {/* Understated Breakdown Context with Animated Counts */}
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
              <span style={{ color: 'var(--accent-dim)', fontWeight: 500 }}>
                <AnimatedNumber value={item.count} duration={1300} />
              </span>
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
      total: 8500,
      crates: 1500,
      pypi: 7000,
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
