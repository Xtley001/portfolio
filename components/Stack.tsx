'use client'
import { useEffect, useRef } from 'react'
import type { SiteData } from '../lib/site'

export default function Stack({ stack }: { stack: SiteData['stack'] }) {
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

  if (!stack || stack.length === 0) return null

  return (
    <section ref={ref} style={{ padding: 'clamp(40px, 8vw, 80px) clamp(16px, 4vw, 40px)', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="reveal" style={{ marginBottom: '40px' }}>
        <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          04 — Stack
        </span>
      </div>

      <div className="stack-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '36px' }}>
        {stack.map(group => (
          <div key={group.category} className="reveal">
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '10px', color: 'var(--text-faint)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
              {group.category}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {group.items.map(item => (
                <span key={item} style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '14px', color: 'var(--text-dim)', letterSpacing: '0.02em' }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
