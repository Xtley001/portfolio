'use client'
import { useEffect, useRef, useState } from 'react'
import type { SiteData } from '../lib/site'

function StatCard({ value, label, index }: { value: string; label: string; index: number }) {
  const [display, setDisplay] = useState('0')
  const ref = useRef<HTMLDivElement>(null)
  const animated = useRef(false)

  const numeric = value.replace(/[^0-9]/g, '')
  const prefix = value.match(/^[^0-9]*/)?.[0] || ''
  const suffix = value.match(/[^0-9]*$/)?.[0] || ''

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animated.current) {
        animated.current = true
        if (ref.current) ref.current.classList.add('visible')
        const isNum = numeric !== '' && !isNaN(Number(numeric))
        if (!isNum) { setDisplay(value); return }
        const target = Number(numeric)
        const duration = 1000
        const start = Date.now()
        const tick = () => {
          const elapsed = Date.now() - start
          const progress = Math.min(elapsed / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setDisplay(prefix + String(Math.floor(eased * target)) + suffix)
          if (progress < 1) requestAnimationFrame(tick)
          else setDisplay(value)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value, numeric, prefix, suffix])

  return (
    <div
      ref={ref}
      className="reveal"
      style={{ padding: 'clamp(24px, 4vw, 36px) clamp(20px, 3vw, 32px)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', transitionDelay: `${index * 0.1}s` }}
    >
      <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--text)', lineHeight: 1, letterSpacing: '-0.02em' }}>
        {display}
      </div>
      <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '12px', color: 'var(--text-dim)', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '12px' }}>
        {label}
      </div>
    </div>
  )
}

export default function Stats({ stats }: { stats: SiteData['stats'] }) {
  if (!stats || stats.length === 0) return null
  return (
    <section style={{ padding: '0 clamp(16px, 4vw, 40px) clamp(40px, 6vw, 60px)', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
        {stats.map((s, i) => (
          <StatCard key={s.label} value={s.value} label={s.label} index={i} />
        ))}
      </div>
    </section>
  )
}
