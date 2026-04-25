'use client'
import { useEffect, useRef } from 'react'
import type { SiteData } from '../lib/site'

export default function Focus({ focus, mindBody }: { focus: SiteData['focus']; mindBody?: string }) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const t = setTimeout(() => {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
      }, { threshold: 0.05 })
      ref.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    }, 80)
    return () => clearTimeout(t)
  }, [])

  if (!focus || focus.length === 0) return null

  return (
    <section ref={ref} id="about" style={{ padding: 'clamp(40px, 8vw, 80px) clamp(16px, 4vw, 40px)', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="reveal" style={{ marginBottom: '32px' }}>
        <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          02 — Focus
        </span>
      </div>

      {/* Mind quote — lives here as section intro */}
      {mindBody && (
        <div className="reveal" style={{ marginBottom: '48px', maxWidth: '640px' }}>
          <p style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: 'clamp(0.85rem, 1.4vw, 0.98rem)',
            color: 'var(--text-dim)',
            lineHeight: 2,
          }}>
            {mindBody}
          </p>
        </div>
      )}

      <div className="focus-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1px', background: 'var(--border)' }}>
        {focus.map((item) => (
          <div
            key={item.area}
            className="reveal"
            style={{ background: 'var(--bg)', padding: 'clamp(24px, 4vw, 36px) clamp(20px, 3vw, 32px)', transition: 'background 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg)')}
          >
            <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '17px', color: 'var(--text)', letterSpacing: '0.03em', marginBottom: '18px' }}>
              {item.area}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {item.subs.map(s => (
                <span key={s} style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '13px', color: 'var(--text-dim)', letterSpacing: '0.03em', lineHeight: 1.6 }}>
                  — {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
