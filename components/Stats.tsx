'use client'
import { useEffect, useRef, useState } from 'react'
import type { SiteData } from '../lib/site'

function StatCard({
  value,
  label,
  index,
  sublabel,
  badges,
  isLive,
}: {
  value: string
  label: string
  index: number
  sublabel?: string
  badges?: string[]
  isLive?: boolean
}) {
  const cleanVal = value.replace(/,/g, '')
  const match = cleanVal.match(/^([^0-9]*)([0-9]+)(.*)$/)
  const prefix = match ? match[1] : ''
  const numeric = match ? match[2] : ''
  const suffix = match ? match[3] : ''
  const isNum = numeric !== '' && !isNaN(Number(numeric))

  const [display, setDisplay] = useState(isNum ? `${prefix}0${suffix}` : value)
  const ref = useRef<HTMLDivElement>(null)
  const animated = useRef(false)

  useEffect(() => {
    if (animated.current && isNum) {
      const target = Number(numeric)
      setDisplay(prefix + target.toLocaleString() + suffix)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true
          if (ref.current) ref.current.classList.add('visible')
          if (!isNum) {
            setDisplay(value)
            return
          }
          const target = Number(numeric)
          const duration = 1200
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
      { threshold: 0.25 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value, numeric, prefix, suffix, isNum])

  return (
    <div
      ref={ref}
      className="reveal stat-card"
      style={{
        padding: 'clamp(24px, 3.5vw, 32px) clamp(22px, 3vw, 28px)',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '4px',
        transitionDelay: `${index * 0.1}s`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '168px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top index counter & live status indicator */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: 'var(--text-faint)', letterSpacing: '0.15em' }}>
            0{index + 1}
          </span>
          <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '10px', color: 'var(--accent-dim)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {index === 0 ? '· Traction' : '· Infrastructure'}
          </span>
        </div>

        {isLive ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '2px 8px',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '2px',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 6px #10b981',
                display: 'inline-block',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '9px',
                color: '#10b981',
                letterSpacing: '0.12em',
                fontWeight: 600,
              }}
            >
              LIVE SYNC
            </span>
          </div>
        ) : (
          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--accent)', opacity: 0.5 }} />
        )}
      </div>

      <div>
        <div
          style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 800,
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            color: 'var(--text)',
            lineHeight: 1,
            letterSpacing: '-0.02em',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            marginBottom: '10px',
          }}
        >
          {display}
        </div>

        <div
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '12px',
            color: 'var(--text)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontWeight: 500,
            lineHeight: 1.4,
          }}
        >
          {label}
        </div>

        {sublabel && (
          <div
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '11px',
              color: 'var(--text-dim)',
              letterSpacing: '0.06em',
              marginTop: '6px',
              lineHeight: 1.5,
            }}
          >
            {sublabel}
          </div>
        )}

        {badges && badges.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '14px' }}>
            {badges.map(b => (
              <span
                key={b}
                style={{
                  fontFamily: 'var(--font-dm-mono)',
                  fontSize: '9.5px',
                  color: 'var(--text-faint)',
                  border: '1px solid var(--border)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  padding: '2px 8px',
                  borderRadius: '2px',
                  letterSpacing: '0.08em',
                }}
              >
                {b}
              </span>
            ))}
          </div>
        )}
      </div>
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
    <section style={{ padding: '0 clamp(16px, 4vw, 40px) clamp(40px, 6vw, 60px)', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="stats-grid">
        {stats.map((s, i) => {
          const isDownloadStat = s.label.toLowerCase().includes('download')
          const value = isDownloadStat ? `${downloadMetrics.total.toLocaleString()}+` : s.value
          const sublabel = isDownloadStat
            ? `${downloadMetrics.crates.toLocaleString()}+ on crates.io · ${downloadMetrics.pypi.toLocaleString()}+ on PyPI`
            : '12 Rust Workspace Crates · 9 Python Native Packages'
          const badges = isDownloadStat
            ? ['crates.io', 'PyPI', 'Real-Time Telemetry']
            : ['driftbrake (8)', 'optimal-sizing (10)', 'brain-libraries (7)']

          return (
            <StatCard
              key={s.label}
              value={value}
              label={s.label}
              index={i}
              sublabel={sublabel}
              badges={badges}
              isLive={isDownloadStat}
            />
          )
        })}
      </div>
    </section>
  )
}
