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
        paddingBottom: 'clamp(40px, 6vw, 80px)',
        paddingLeft: 'clamp(16px, 4vw, 40px)',
        paddingRight: 'clamp(16px, 4vw, 40px)',
        paddingTop: 'clamp(60px, 7vw, 90px)',
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
            marginBottom: 'clamp(16px, 3vw, 36px)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span>001</span>
          <span style={{ color: 'var(--accent-dim)' }}>//</span>
          <span style={{ textTransform: 'uppercase', letterSpacing: '0.15em' }}>RUST SYSTEMS & MEV INFRASTRUCTURE</span>
        </div>

        {/* Name */}
        <div
          style={{
            marginBottom: '24px',
            paddingBottom: '4px',
          }}
        >
          <h1
            className="animate-fade-up delay-100 hero-name"
            style={{
              fontFamily: 'var(--font-syne)',
              fontWeight: 800,
              fontSize: 'clamp(2.5rem, 8.5vw, 6.4rem)',
              lineHeight: 0.96,
              letterSpacing: '-0.025em',
              color: 'var(--text)',
              display: 'block',
              paddingBottom: '0.04em',
              whiteSpace: 'nowrap',
            }}
          >
            {hero.firstName}
          </h1>
          <h1
            className="animate-fade-up delay-200 hero-name"
            style={{
              fontFamily: 'var(--font-syne)',
              fontWeight: 800,
              fontSize: 'clamp(2.5rem, 8.5vw, 6.4rem)',
              lineHeight: 0.96,
              letterSpacing: '-0.025em',
              color: 'var(--accent)',
              display: 'block',
              paddingBottom: '0.04em',
              whiteSpace: 'nowrap',
            }}
          >
            {hero.lastName}
          </h1>
        </div>

        <div className="draw-line" style={{ marginBottom: '24px' }} />

        {/* Tagline + Resume Action */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '20px',
          }}
          className="animate-fade-up delay-400"
        >
          <p
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: 'clamp(0.85rem, 1.8vw, 1.05rem)',
              color: 'var(--text-dim)',
              maxWidth: '680px',
              lineHeight: 1.8,
            }}
          >
            {hero.tagline}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                padding: '8px 18px',
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

        {/* Embedded Live Stats: Right on the First View / Hero */}
        {stats && stats.length > 0 && (
          <div
            className="animate-fade-up delay-500"
            style={{ marginTop: 'clamp(28px, 3.5vw, 42px)' }}
          >
            <Stats stats={stats} initialLiveDownloads={initialLiveDownloads} />
          </div>
        )}

        {/* Subtle scroll prompt */}
        <div
          className="animate-fade-in delay-700"
          style={{
            marginTop: 'clamp(24px, 3vw, 36px)',
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '11px',
            color: 'var(--text-faint)',
            letterSpacing: '0.2em',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span style={{ width: '20px', height: '1px', background: 'var(--text-faint)', display: 'inline-block' }} />
          EXPLORE SYSTEMS
        </div>
      </div>
    </section>
  )
}
