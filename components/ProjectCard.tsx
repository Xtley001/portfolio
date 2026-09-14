'use client'
import Link from 'next/link'
import type { Project } from '../lib/projects'

export default function ProjectCard({ project, small }: { project: Project; small?: boolean }) {
  const { name, tagline, tech, year, github, live, category, ranking, docs, cratesIo } = project

  const rankStr = ranking !== undefined ? `#${ranking.toString().padStart(2, '0')}` : null
  const isTearSheet = live && live.toLowerCase().endsWith('.pdf')

  return (
    <div
      style={{
        background: 'var(--surface)',
        padding: small ? 'clamp(18px, 3vw, 24px)' : 'clamp(26px, 3.5vw, 34px)',
        minHeight: small ? '180px' : '220px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '20px',
        transition: 'all 0.2s ease',
        cursor: 'default',
        height: '100%',
        border: '1px solid transparent',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'var(--surface-2)'
        e.currentTarget.style.borderColor = 'var(--border)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'var(--surface)'
        e.currentTarget.style.borderColor = 'transparent'
      }}
    >
      <div>
        {/* Top meta row: Rank + Category */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          {rankStr && (
            <span style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--accent)',
              letterSpacing: '0.12em',
            }}>
              {rankStr}
            </span>
          )}
          {category && (
            <span style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '9.5px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--text-faint)',
            }}>
              {category}
            </span>
          )}
        </div>

        {/* Project Name */}
        <div style={{ marginBottom: '10px' }}>
          <h3 style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 700,
            fontSize: small ? 'clamp(14px, 2.5vw, 17px)' : 'clamp(16px, 3vw, 20px)',
            letterSpacing: '0.02em',
            color: 'var(--text)',
            textTransform: 'uppercase',
            lineHeight: 1.3,
          }}>
            {name}
          </h3>
        </div>

        {/* Tagline / Summary - clean, readable, uncongested */}
        <p style={{
          fontFamily: 'var(--font-dm-mono)',
          fontSize: 'clamp(12px, 1.3vw, 13px)',
          color: 'var(--text-dim)',
          lineHeight: 1.65,
        }}>
          {tagline}
        </p>
      </div>

      <div>
        {/* Tech tags - subtle and minimalist */}
        {tech.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
            {tech.map(t => (
              <span key={t} style={{
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '9px',
                letterSpacing: '0.06em',
                color: 'var(--text-faint)',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border)',
                padding: '2px 7px',
                borderRadius: '2px',
              }}>
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Actions row */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px 18px',
          alignItems: 'center',
          borderTop: '1px solid var(--border)',
          paddingTop: '14px',
        }}>
          <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: 'var(--text-faint)', letterSpacing: '0.1em' }}>
            {year}
          </span>
          {github && (
            <a href={github} target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: 'var(--text-dim)', letterSpacing: '0.08em', transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-dim)')}>
              github ↗
            </a>
          )}
          {cratesIo && (
            <a href={cratesIo} target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: 'var(--accent)', letterSpacing: '0.08em', transition: 'opacity 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
              crates.io ↗
            </a>
          )}
          {docs && (
            <a href={docs} target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: 'var(--text-dim)', letterSpacing: '0.08em', transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-dim)')}>
              docs ↗
            </a>
          )}
          {live && (
            <a href={live} target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: 'var(--accent)', letterSpacing: '0.08em', transition: 'opacity 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
              {isTearSheet ? 'tearsheet ↗' : 'live demo ↗'}
            </a>
          )}
          <Link href={`/projects/${project.slug}`}
            style={{ marginLeft: 'auto', fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: 'var(--accent-dim)', letterSpacing: '0.08em', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--accent-dim)')}
          >
            details →
          </Link>
        </div>
      </div>
    </div>
  )
}
