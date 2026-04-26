'use client'
import { useEffect, useRef } from 'react'
import type { SiteData } from '../lib/site'

export default function Timeline({ experience, education, timeline }: { experience: SiteData['experience']; education: SiteData['education']; timeline?: SiteData['timeline'] }) {
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

  const hasTimeline = timeline && timeline.length > 0
  const hasContent = experience.length > 0 || education.length > 0 || hasTimeline
  if (!hasContent) return null

  return (
    <section ref={ref} style={{ padding: 'clamp(40px, 8vw, 80px) clamp(16px, 4vw, 40px)', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="reveal" style={{ marginBottom: '40px' }}>
        <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          05 — Timeline
        </span>
      </div>

      {/* timeline-grid CSS class collapses to 1fr on mobile */}
      <div className="timeline-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>
        {experience.length > 0 && (
          <div>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '10px', color: 'var(--text-faint)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '28px' }}>
              Experience
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {experience.map((e, i) => (
                <div key={i} className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {/* Year on its own line — no fixed-width column that can squeeze */}
                  <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: 'var(--accent)', letterSpacing: '0.08em' }}>{e.year}</span>
                  <div>
                    <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '14px', color: 'var(--text)', marginBottom: '2px', fontWeight: 500 }}>{e.role}</div>
                    <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '13px', color: 'var(--text-dim)' }}>{e.org}</div>
                    {e.note && <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '12px', color: 'var(--text-faint)', marginTop: '2px' }}>{e.note}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {education.length > 0 && (
          <div>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '10px', color: 'var(--text-faint)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '28px' }}>
              Education
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {education.map((e, i) => (
                <div key={i} className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: 'var(--accent)', letterSpacing: '0.08em' }}>{e.year}</span>
                  <div>
                    <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '14px', color: 'var(--text)', marginBottom: '2px', fontWeight: 500 }}>{e.role}</div>
                    <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '13px', color: 'var(--text-dim)' }}>{e.org}</div>
                    {e.note && <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '12px', color: 'var(--text-faint)', marginTop: '2px' }}>{e.note}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {hasTimeline && (
        <div style={{ marginTop: '60px' }}>
          <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '10px', color: 'var(--text-faint)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '28px' }}>
            On-chain
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {timeline!.map((entry, i) => (
              <div key={i} className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: 'var(--accent)', letterSpacing: '0.08em' }}>{entry.year}</span>
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '13px', color: 'var(--text-dim)', lineHeight: 1.6 }}>{entry.event}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
