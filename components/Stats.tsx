'use client'
import { useEffect, useRef, useState } from 'react'
import type { SiteData } from '../lib/site'

function StatItem({
  value,
  label,
  index,
  breakdown,
  isLive,
}: {
  value: string
  label: string
  index: number
  breakdown?: { name: string; count: string }[]
  isLive?: boolean
}) {
  const cleanVal = value.replace(/,/g, '')
  const match = cleanVal.match(/^([^0-9]*)([0-9]+)(.*)$/)
  const prefix = match ? match[1] : ''
  const numeric = match ? match[2] : ''
  const suffix = match ? match[3] : ''
  const isNum = numeric !== '' && !isNaN(Number(numeric))

  const [display, setDisplay] = useState(value)
  const ref = useRef<HTMLDivElement>(null)
  const animated = useRef(false)

  useEffect(() => {
    if (!isNum) return

    const target = Number(numeric)

    if (typeof IntersectionObserver === 'undefined') {
      setDisplay(prefix + target.toLocaleString() + suffix)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true
          if (ref.current) ref.current.classList.add('visible')
          const duration = 1000
          const start = performance.now()
          const tick = (now: number) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            const current = Math.floor(eased * target)
            setDisplay(prefix + current.toLocaleString() + suffix)
            if (progress < 1) {
              requestAnimationFrame(tick)
            } else {
              setDisplay(prefix + target.toLocaleString() + suffix)
            }
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.05 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [numeric, prefix, suffix, isNum])

  useEffect(() => {
    if (animated.current && isNum) {
      const target = Number(numeric)
      setDisplay(prefix + target.toLocaleString() + suffix)
    }
  }, [value, numeric, prefix, suffix, isNum])

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
      {/* Label + quiet Live indicator */}
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
        {isLive ? (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 6px rgba(16, 185, 129, 0.6)',
                display: 'inline-block',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '9px',
                color: '#10b981',
                letterSpacing: '0.1em',
                fontWeight: 600,
              }}
            >
              LIVE
            </span>
          </div>
        ) : (
          <span
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '9px',
              color: 'var(--text-faint)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            CRATES.IO & PYPI
          </span>
        )}
      </div>

      {/* Clean, Refined Number */}
      <div
        style={{
          fontFamily: 'var(--font-syne)',
          fontWeight: 700,
          fontSize: 'clamp(2rem, 3.2vw, 2.8rem)',
          color: 'var(--text)',
          lineHeight: 1.05,
          letterSpacing: '-0.025em',
        }}
      >
        {display}
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
            isLive={isDownloadStat}
          />
        )
      })}
    </div>
  )
}
