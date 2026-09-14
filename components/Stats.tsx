'use client'
import { useEffect, useRef, useState } from 'react'
import type { SiteData } from '../lib/site'

function StatCard({ value, label, index }: { value: string; label: string; index: number }) {
  const match = value.match(/^([^0-9]*)([0-9]+)(.*)$/)
  const prefix = match ? match[1] : ''
  const numeric = match ? match[2] : ''
  const suffix = match ? match[3] : ''
  const isNum = numeric !== '' && !isNaN(Number(numeric))

  const [display, setDisplay] = useState(isNum ? `${prefix}0${suffix}` : value)
  const ref = useRef<HTMLDivElement>(null)
  const animated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animated.current) {
        animated.current = true
        if (ref.current) ref.current.classList.add('visible')
        if (!isNum) {
          setDisplay(value)
          return
        }
        const target = Number(numeric)
        const duration = 1100
        const start = performance.now()
        const tick = (now: number) => {
          const elapsed = now - start
          const progress = Math.min(elapsed / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setDisplay(prefix + String(Math.floor(eased * target)) + suffix)
          if (progress < 1) requestAnimationFrame(tick)
          else setDisplay(value)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.25 })

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value, numeric, prefix, suffix, isNum])

  // Dynamic font sizing to guarantee clean presentation without clipping or overflow
  const charLen = value.length
  const fontSize = charLen <= 3
    ? 'clamp(2.2rem, 4vw, 3.2rem)'
    : charLen <= 6
      ? 'clamp(1.75rem, 3.2vw, 2.4rem)'
      : 'clamp(1.2rem, 2.2vw, 1.6rem)'

  return (
    <div
      ref={ref}
      className="reveal stat-card"
      style={{
        padding: 'clamp(20px, 3vw, 26px) clamp(18px, 2.5vw, 24px)',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '4px',
        transitionDelay: `${index * 0.08}s`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '138px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top index counter & accent dot */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: 'var(--text-faint)', letterSpacing: '0.15em' }}>
          0{index + 1}
        </span>
        <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent)', opacity: 0.4 }} />
      </div>

      <div>
        <div
          style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 800,
            fontSize,
            color: 'var(--text)',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {display}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '11px',
            color: 'var(--text-dim)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginTop: '12px',
            lineHeight: 1.4,
          }}
        >
          {label}
        </div>
      </div>
    </div>
  )
}

export default function Stats({ stats }: { stats: SiteData['stats'] }) {
  if (!stats || stats.length === 0) return null
  return (
    <section style={{ padding: '0 clamp(16px, 4vw, 40px) clamp(40px, 6vw, 60px)', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="stats-grid">
        {stats.map((s, i) => (
          <StatCard key={s.label} value={s.value} label={s.label} index={i} />
        ))}
      </div>
    </section>
  )
}

