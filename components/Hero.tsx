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
        paddingBottom: 'clamp(24px, 3.5vh, 44px)',
        paddingLeft: 'clamp(16px, 4vw, 40px)',
        paddingRight: 'clamp(16px, 4vw, 40px)',
        paddingTop: 'clamp(56px, 8vh, 80px)',
        position: 'relative',
        overflow: 'hidden',
        maxWidth: '100vw',
      }}
    >
      {/* Grid background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
          opacity: 0.3,
        }}
      />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Index number & role indicator */}
        <div
          className="animate-fade-in delay-100"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '11px',
            color: 'var(--text-faint)',
            letterSpacing: '0.2em',
            marginBottom: 'clamp(10px, 1.5vh, 16px)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span>001</span>
          <span style={{ color: 'var(--accent-dim)' }}>//</span>
          <span style={{ textTransform: 'uppercase', letterSpacing: '0.15em' }}>RUST SYSTEMS & MEV INFRASTRUCTURE</span>
        </div>

        {/* Refined, Architectural Name */}
        <div
          className="animate-fade-up delay-100"
          style={{
            marginBottom: 'clamp(12px, 1.8vh, 18px)',
          }}
        >
          <h1
            className="hero-name"
            style={{
              fontFamily: 'var(--font-syne)',
              fontWeight: 800,
              fontSize: 'clamp(2rem, 4.2vw, 3.6rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.025em',
              color: 'var(--text)',
              margin: 0,
            }}
          >
            {hero.firstName}{' '}
            <span style={{ color: 'var(--accent)' }}>{hero.lastName}</span>
          </h1>
        </div>

        <div className="draw-line" style={{ marginBottom: 'clamp(12px, 1.8vh, 18px)' }} />

        {/* Tagline + Resume Action */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
          className="animate-fade-up delay-200"
        >
          <p
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: 'clamp(0.85rem, 1.12vw, 0.98rem)',
              color: 'var(--text-dim)',
              maxWidth: '680px',
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            {hero.tagline}
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
                border: '1px solid var(--accent-dim)',
                padding: '7px 16px',
                borderRadius: '2px',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 500,
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

        {/* Clean, Non-Noisy Live Stats: Perfectly Proportionate Above the Fold */}
        {stats && stats.length > 0 && (
          <div
            className="animate-fade-up delay-300"
            style={{ marginTop: 'clamp(14px, 2.2vh, 22px)' }}
          >
            <Stats stats={stats} initialLiveDownloads={initialLiveDownloads} />
          </div>
        )}

        {/* Subtle scroll cue */}
        <div
          className="animate-fade-in delay-500"
          style={{
            marginTop: 'clamp(14px, 2vh, 20px)',
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '10px',
            color: 'var(--text-faint)',
            letterSpacing: '0.2em',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span style={{ width: '18px', height: '1px', background: 'var(--text-faint)', display: 'inline-block' }} />
          EXPLORE CORE SYSTEMS ↓
        </div>
      </div>
    </section>
  )
}
