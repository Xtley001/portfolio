'use client'
import { useEffect, useRef } from 'react'
import ProjectCard from './ProjectCard'
import type { Project } from '../lib/projects'

export default function Projects({ projects }: { projects: Project[] }) {
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

  if (!projects || projects.length === 0) return null

  const featured = projects.filter(p => p.featured)
  const rest     = projects.filter(p => !p.featured)

  // Build the CSS gridTemplateColumns via a style variable so it can be
  // overridden by the .projects-grid media-query rules in globals.css
  const featuredCols = Math.min(featured.length, 2)
  const restCols     = Math.min(rest.length, 3)

  return (
    <section ref={ref} id="projects" style={{ padding: 'clamp(40px, 8vw, 80px) clamp(16px, 4vw, 40px)', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="reveal" style={{ marginBottom: '36px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          03 — Work
        </span>
        <a href="https://github.com/Xtley001" target="_blank" rel="noopener noreferrer"
          style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: 'var(--text-dim)', letterSpacing: '0.1em', transition: 'color 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-dim)')}>
          all repos ↗
        </a>
      </div>

      {featured.length > 0 && (
        <div
          className="projects-grid"
          style={{
            display: 'grid',
            /* inline style sets the desktop value; CSS media queries win on mobile via !important */
            gridTemplateColumns: `repeat(${featuredCols}, 1fr)`,
            gap: '1px',
            background: 'var(--border)',
            marginBottom: rest.length > 0 ? '1px' : 0,
          }}
        >
          {featured.map((p, i) => (
            <div key={p.slug} className="reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
              <ProjectCard project={p} />
            </div>
          ))}
        </div>
      )}

      {rest.length > 0 && (
        <div
          className="projects-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${restCols}, 1fr)`,
            gap: '1px',
            background: 'var(--border)',
          }}
        >
          {rest.map((p, i) => (
            <div key={p.slug} className="reveal" style={{ transitionDelay: `${(featured.length + i) * 0.08}s` }}>
              <ProjectCard project={p} small />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
