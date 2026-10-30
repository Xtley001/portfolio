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
  return (
    <section
      style={{
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingTop: 'clamp(84px, 11vh, 120px)',
        paddingBottom: 'clamp(40px, 6vh, 72px)',
        paddingLeft: 'clamp(20px, 4.5vw, 56px)',
        paddingRight: 'clamp(20px, 4.5vw, 56px)',
        position: 'relative',
        overflow: 'hidden',
        maxWidth: '100vw',
      }}
    >
      {/* Subtle grid background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
          opacity: 0.28,
        }}
      />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '1360px', margin: '0 auto' }}>
        {/* Index number & role indicator */}
        <div
          className="animate-fade-in delay-100"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '12px',
            color: 'var(--text-faint)',
            letterSpacing: '0.22em',
            marginBottom: 'clamp(14px, 2vh, 22px)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span>001</span>
          <span style={{ color: 'var(--accent-dim)' }}>//</span>
          <span style={{ textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--accent-dim)' }}>
            RUST SYSTEMS & MEV INFRASTRUCTURE
          </span>
        </div>

        {/* Refined, Commanding Name */}
        <div
          className="animate-fade-up delay-100"
          style={{
            marginBottom: 'clamp(16px, 2.2vh, 24px)',
          }}
        >
          <h1
            className="hero-name"
            style={{
              fontFamily: 'var(--font-syne)',
              fontWeight: 800,
              fontSize: 'clamp(2.4rem, 5.2vw, 4.5rem)',
              lineHeight: 1.02,
              letterSpacing: '-0.025em',
              color: 'var(--text)',
              margin: 0,
            }}
          >
            {hero.firstName}{' '}
            <span style={{ color: 'var(--accent)' }}>{hero.lastName}</span>
          </h1>
        </div>

        <div className="draw-line" style={{ marginBottom: 'clamp(18px, 2.5vh, 28px)' }} />

        {/* Tagline + Resume Action: High legibility, no eye squeezing */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            marginBottom: 'clamp(24px, 3.5vh, 36px)',
          }}
          className="animate-fade-up delay-200"
        >
          <p
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: 'clamp(1.02rem, 1.35vw, 1.2rem)',
              color: '#d8d8d8',
              maxWidth: '860px',
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {hero.tagline}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
            <a
              href="/Christley_Olubela_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '12px',
                color: 'var(--accent)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                border: '1px solid var(--accent-dim)',
                padding: '9px 20px',
                borderRadius: '3px',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 600,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--accent)'
                e.currentTarget.style.color = 'var(--bg)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = 'var(--accent)'
              }}
            >
              resume ↗
            </a>
          </div>
        </div>

        {/* Spacious, Highly Readable Live Stats Telemetry Cards */}
        {stats && stats.length > 0 && (
          <div className="animate-fade-up delay-300">
            <Stats stats={stats} initialLiveDownloads={initialLiveDownloads} />
          </div>
        )}

        {/* Subtle scroll cue */}
        <div
          className="animate-fade-in delay-500"
          style={{
            marginTop: 'clamp(20px, 3vh, 32px)',
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '11px',
            color: 'var(--text-faint)',
            letterSpacing: '0.2em',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span style={{ width: '24px', height: '1px', background: 'var(--text-faint)', display: 'inline-block' }} />
          EXPLORE CORE SYSTEMS ↓
        </div>
      </div>
    </section>
  )
}
