'use client'
import type { SiteData } from '../lib/site'
import Stats from './Stats'

export default function Hero({
  hero,
  stats,
  initialLiveDownloads,
}: {
  hero: SiteData['hero']
  stats?: SiteData['stats']
  initialLiveDownloads?: {
    total: number
    crates: number
    pypi: number
  }
}) {
  const roleTitle = hero.role || 'Rust Systems Engineer'
  const subheader = hero.tagline || 'Building low-latency execution engines, distributed state machines, and high-performance infrastructure.'

  return (
    <section
      style={{
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingTop: 'clamp(90px, 12vh, 130px)',
        paddingBottom: 'clamp(44px, 6vh, 68px)',
        paddingLeft: 'clamp(20px, 5vw, 64px)',
        paddingRight: 'clamp(20px, 5vw, 64px)',
        position: 'relative',
        overflow: 'hidden',
        maxWidth: '100vw',
      }}
    >
      {/* Subtle architectural grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
          opacity: 0.22,
        }}
      />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '1180px', margin: '0 auto' }}>
        {/* Main Header */}
        <div
          className="animate-fade-up delay-100"
          style={{
            marginBottom: '16px',
          }}
        >
          <h1
            className="hero-name"
            style={{
              fontFamily: 'var(--font-syne)',
              fontWeight: 700,
              fontSize: 'clamp(2.1rem, 4.4vw, 3.4rem)',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: 'var(--text)',
              margin: 0,
            }}
          >
            {hero.firstName} {hero.lastName}{' '}
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
              — {roleTitle}
            </span>
          </h1>
        </div>

        {/* Subtle, soft divider line */}
        <div style={{ height: '1px', background: 'var(--border)', margin: '20px 0 24px' }} />

        {/* Subheader + Action */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '24px',
            marginBottom: 'clamp(40px, 6vh, 60px)',
          }}
          className="animate-fade-up delay-200"
        >
          <p
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: 'clamp(0.95rem, 1.2vw, 1.08rem)',
              color: 'var(--text-dim)',
              maxWidth: '760px',
              lineHeight: 1.75,
              margin: 0,
            }}
          >
            {subheader}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            <a
              href="/Christley_Olubela_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '11px',
                color: 'var(--accent)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                border: '1px solid var(--border)',
                padding: '6px 14px',
                borderRadius: '2px',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 500,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--accent)'
                e.currentTarget.style.color = 'var(--accent)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.color = 'var(--accent)'
              }}
            >
              resume ↗
            </a>
          </div>
        </div>

        {/* Minimalist, Borderless Telemetry Row */}
        {stats && stats.length > 0 && (
          <div className="animate-fade-up delay-300">
            <Stats stats={stats} initialLiveDownloads={initialLiveDownloads} />
          </div>
        )}
      </div>
    </section>
  )
}
