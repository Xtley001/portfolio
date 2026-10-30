'use client'
import { useEffect, useRef, useState } from 'react'
import type { SiteData } from '../lib/site'

function StatCard({
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
      className="reveal stat-card visible"
      style={{
        padding: 'clamp(20px, 2.5vw, 28px) clamp(22px, 2.8vw, 32px)',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '4px',
        transitionDelay: `${index * 0.1}s`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        minHeight: '175px',
      }}
    >
      {/* Top index counter & live status indicator */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: 'var(--accent)', letterSpacing: '0.15em', fontWeight: 600 }}>
            // 0{index + 1}
          </span>
          <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: 'var(--text-faint)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            {index === 0 ? '· TRACTION' : '· INFRASTRUCTURE'}
          </span>
        </div>

        {isLive ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 9px',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.28)',
              borderRadius: '2px',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 8px #10b981',
                display: 'inline-block',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '10px',
                color: '#10b981',
                letterSpacing: '0.12em',
                fontWeight: 600,
              }}
            >
              LIVE SYNC
            </span>
          </div>
        ) : (
          <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '10px', color: 'var(--text-faint)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            CRATES.IO & PYPI
          </span>
        )}
      </div>

      {/* Hero Metric Number */}
      <div
        style={{
          fontFamily: 'var(--font-syne)',
          fontWeight: 800,
          fontSize: 'clamp(2.6rem, 3.8vw, 3.6rem)',
          color: 'var(--text)',
          lineHeight: 1,
          letterSpacing: '-0.025em',
          marginBottom: '8px',
        }}
      >
        {display}
      </div>

      {/* Clear, Readable Uppercase Label */}
      <div
        style={{
          fontFamily: 'var(--font-dm-mono)',
          fontSize: '12.5px',
          color: 'var(--accent)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          fontWeight: 600,
          marginBottom: '16px',
        }}
      >
        {label}
      </div>

      {/* Distinct Breakdown Row */}
      {breakdown && breakdown.length > 0 && (
        <div
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '12px',
            color: 'var(--text-dim)',
            letterSpacing: '0.04em',
            borderTop: '1px solid var(--border)',
            paddingTop: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          {breakdown.map((item, idx) => (
            <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {idx > 0 && <span style={{ color: 'var(--border-bright)', marginRight: '6px' }}>•</span>}
              <span style={{ color: 'var(--text)', fontWeight: 500 }}>{item.count}</span>
              <span style={{ color: 'var(--text-faint)' }}>{item.name}</span>
            </div>
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
      total: 7835,
      crates: 740,
      pypi: 7095,
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
    <div className="stats-grid">
      {stats.map((s, i) => {
        const isDownloadStat = s.label.toLowerCase().includes('download')
        const value = isDownloadStat ? `${downloadMetrics.total.toLocaleString()}+` : s.value
        const label = isDownloadStat ? 'Total Open Source Downloads' : 'Published Production Packages'
        
        const breakdown = isDownloadStat
          ? [
              { count: `${downloadMetrics.crates.toLocaleString()}+`, name: 'crates.io' },
              { count: `${downloadMetrics.pypi.toLocaleString()}+`, name: 'PyPI' },
            ]
          : [
              { count: '12', name: 'Rust Workspace Crates' },
              { count: '9', name: 'Python Native Packages' },
            ]

        return (
          <StatCard
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
