'use client'
import Link from 'next/link'
import type { Project } from '../lib/projects'

const statusColor: Record<string, string> = {
  active: '#c8b89a',
  completed: '#777',
  archived: '#555',
  stealth: '#555',
}

export default function ProjectCard({ project, small }: { project: Project; small?: boolean }) {
  const { name, tagline, tech, status, year, github, live } = project

  return (
    <div
      style={{
        background: 'var(--surface)',
        padding: small ? 'clamp(18px, 3vw, 28px)' : 'clamp(24px, 4vw, 40px)',
        minHeight: small ? '140px' : '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '16px',
        transition: 'background 0.2s',
        cursor: 'default',
        height: '100%',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'var(--surface)')}
    >
      <div>
        {/* Name + status row — allow wrapping */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '10px', flexWrap: 'wrap' }}>
          <h3 style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 700,
            fontSize: small ? 'clamp(13px, 3vw, 15px)' : 'clamp(16px, 4vw, 22px)',
            letterSpacing: '0.04em',
            color: 'var(--text)',
            textTransform: 'uppercase',
            lineHeight: 1.2,
          }}>
            {name}
          </h3>
          <span style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '10px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: statusColor[status] || '#666',
            paddingTop: '2px',
            flexShrink: 0,
          }}>
            {status}
          </span>
        </div>
        <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 'clamp(12px, 1.5vw, 13px)', color: 'var(--text-dim)', lineHeight: 1.8 }}>
          {tagline}
        </p>
      </div>

      <div>
        {/* Tech tags */}
        {tech.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '14px' }}>
            {tech.map(t => (
              <span key={t} style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '10px', letterSpacing: '0.08em', color: 'var(--text-faint)', border: '1px solid var(--border)', padding: '3px 8px', borderRadius: '2px' }}>
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Actions row — wraps cleanly on narrow mobile */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 20px', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: 'var(--text-faint)', letterSpacing: '0.1em' }}>
            {year}
          </span>
          {github && (
            <a href={github} target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: 'var(--text-dim)', letterSpacing: '0.08em', transition: 'color 0.15s', WebkitTapHighlightColor: 'transparent' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-dim)')}>
              github ↗
            </a>
          )}
          {live && (
            <a href={live} target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: 'var(--accent)', letterSpacing: '0.08em', transition: 'opacity 0.15s', WebkitTapHighlightColor: 'transparent' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
              live ↗
            </a>
          )}
          {!github && !live && (
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: 'var(--text-faint)', letterSpacing: '0.08em' }}>
              private
            </span>
          )}
          <Link href={`/projects/${project.slug}`}
            style={{ marginLeft: 'auto', fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: 'var(--text-dim)', letterSpacing: '0.08em', transition: 'color 0.15s', WebkitTapHighlightColor: 'transparent' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-dim)')}
          >
            details →
          </Link>
        </div>
      </div>
    </div>
  )
}
