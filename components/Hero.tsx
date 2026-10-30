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
        {/* Index indicator */}
        <div
          className="animate-fade-in delay-100"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '11px',
            color: 'var(--text-faint)',
            letterSpacing: '0.22em',
            marginBottom: '16px',
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

        {/* Refined, Calm Typography */}
        <div
          className="animate-fade-up delay-100"
          style={{
            marginBottom: '20px',
          }}
        >
          <h1
            className="hero-name"
            style={{
              fontFamily: 'var(--font-syne)',
              fontWeight: 700,
              fontSize: 'clamp(2.1rem, 4.4vw, 3.4rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              color: 'var(--text)',
              margin: 0,
            }}
          >
            {hero.firstName}{' '}
            <span style={{ color: 'var(--accent)' }}>{hero.lastName}</span>
          </h1>
        </div>

        {/* Tagline + Minimal Action */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '20px',
            marginBottom: 'clamp(36px, 5vh, 52px)',
          }}
          className="animate-fade-up delay-200"
        >
          <p
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: 'clamp(0.92rem, 1.15vw, 1.05rem)',
              color: 'var(--text-dim)',
              maxWidth: '740px',
              lineHeight: 1.75,
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

        {/* Subtle scroll cue */}
        <div
          className="animate-fade-in delay-500"
          style={{
            marginTop: 'clamp(28px, 4vh, 40px)',
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '10.5px',
            color: 'var(--text-faint)',
            letterSpacing: '0.2em',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span style={{ width: '20px', height: '1px', background: 'var(--border)', display: 'inline-block' }} />
          EXPLORE CORE SYSTEMS ↓
        </div>
      </div>
    </section>
  )
}
