'use client'
import { useEffect, useRef } from 'react'
import type { SiteData } from '../lib/site'

const GOODREADS_URL = 'https://www.goodreads.com/user/show/184917569-christley-olubela'

export default function Persona({ persona, goodreads }: { persona: SiteData['persona']; goodreads?: string }) {
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

  const hasResearch = persona.research.length > 0
  const hasOutside = persona.outside.length > 0
  if (!hasResearch && !hasOutside) return null

  return (
    <section ref={ref} style={{ padding: 'clamp(40px, 8vw, 80px) clamp(16px, 4vw, 40px)', maxWidth: '1200px', margin: '0 auto' }}>
      <hr style={{ marginBottom: '48px' }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '48px' }}>

        {hasResearch && (
          <div className="reveal">
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '10px', color: 'var(--text-faint)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '24px' }}>
              Currently Researching
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {persona.research.map(s => (
                <span key={s} style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '14px', color: 'var(--text-dim)', lineHeight: 1.7 }}>
                  → {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {hasOutside && (
          <div className="reveal">
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '10px', color: 'var(--text-faint)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '24px' }}>
              Outside the Terminal
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {persona.outside.map(item => {
                const isReading = item.label.toLowerCase() === 'reading'
                return (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--border)', padding: '12px 0' }}>
                    <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '14px', color: 'var(--text)' }}>{item.label}</span>
                    {isReading ? (
                      <a
                        href={GOODREADS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '12px', color: 'var(--text-faint)', letterSpacing: '0.08em', transition: 'color 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-faint)')}
                      >
                        goodreads ↗
                      </a>
                    ) : (
                      item.note && <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '12px', color: 'var(--text-faint)' }}>{item.note}</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
