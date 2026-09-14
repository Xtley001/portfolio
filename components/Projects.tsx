'use client'
import { useEffect, useRef, useState } from 'react'
import ProjectCard from './ProjectCard'
import type { Project } from '../lib/projects'

const CATEGORIES = [
  'All',
  'MEV & Liquidations',
  'Systems & Infrastructure',
  'Systematic Trading',
  'Quant & Machine Learning',
] as const

type CategoryFilter = typeof CATEGORIES[number]

export default function Projects({ projects }: { projects: Project[] }) {
  const ref = useRef<HTMLElement>(null)
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All')

  useEffect(() => {
    const t = setTimeout(() => {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
      }, { threshold: 0.05 })
      ref.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    }, 80)
    return () => clearTimeout(t)
  }, [activeCategory])

  if (!projects || projects.length === 0) return null

  const filteredProjects = projects.filter(p => {
    if (activeCategory === 'All') return true
    return p.category === activeCategory
  })

  return (
    <section ref={ref} id="projects" style={{ padding: 'clamp(40px, 8vw, 80px) clamp(16px, 4vw, 40px)', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="reveal" style={{ marginBottom: '28px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            03 — Selected Work & Systems
          </span>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '12px', color: 'var(--text-faint)', marginTop: '4px' }}>
            Ranked production systems, liquidation engines, published libraries & quant infrastructure.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a href="/Christley_Olubela_Resume.pdf" target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: 'var(--accent)', letterSpacing: '0.1em', transition: 'opacity 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
            view resume ↗
          </a>
          <a href="https://github.com/Xtley001" target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: 'var(--text-dim)', letterSpacing: '0.1em', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-dim)')}>
            all repos ↗
          </a>
        </div>
      </div>

      {/* Category filter tabs */}
      <div className="reveal" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '28px' }}>
        {CATEGORIES.map(cat => {
          const isActive = activeCategory === cat
          const count = cat === 'All' ? projects.length : projects.filter(p => p.category === cat).length
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '11px',
                letterSpacing: '0.08em',
                padding: '6px 14px',
                background: isActive ? 'var(--accent)' : 'var(--surface)',
                color: isActive ? 'var(--bg)' : 'var(--text-dim)',
                border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: '2px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = 'var(--accent-dim)'
                  e.currentTarget.style.color = 'var(--text)'
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.color = 'var(--text-dim)'
                }
              }}
            >
              {cat} <span style={{ opacity: 0.6, fontSize: '9.5px', marginLeft: '4px' }}>({count})</span>
            </button>
          )
        })}
      </div>

      {/* Projects Grid */}
      <div
        className="projects-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1px',
          background: 'var(--border)',
        }}
      >
        {filteredProjects.map((p, i) => (
          <div key={p.slug} className="reveal visible" style={{ transitionDelay: `${(i % 6) * 0.05}s` }}>
            <ProjectCard project={p} />
          </div>
        ))}
      </div>
    </section>
  )
}
