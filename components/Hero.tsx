'use client'
import type { SiteData } from '../lib/site'

export default function Hero({ hero }: { hero: SiteData['hero'] }) {
  return (
    <section
      style={{
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingBottom: '80px',
        paddingLeft: 'clamp(16px, 4vw, 40px)',
        paddingRight: 'clamp(16px, 4vw, 40px)',
        paddingTop: '80px',
        position: 'relative',
        overflow: 'hidden',
        maxWidth: '100vw',
      }}
    >
      {/* Grid background */}
      <div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
          backgroundSize: '80px 80px', opacity: 0.3,
        }}
      />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '1200px' }}>
        {/* Index number */}
        <div className="animate-fade-in delay-100" style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '12px', color: 'var(--text-faint)', letterSpacing: '0.2em', marginBottom: 'clamp(20px, 4vw, 48px)' }}>
          001
        </div>

        {/* Name */}
        <div style={{ marginBottom: '24px', paddingBottom: '4px' }}>
          <h1
            className="animate-fade-up delay-100 hero-name"
            style={{
              fontFamily: 'var(--font-syne)',
              fontWeight: 800,
              fontSize: 'clamp(2.8rem, 12vw, 8.5rem)',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              color: 'var(--text)',
              display: 'block',
              paddingBottom: '0.08em',
              wordBreak: 'break-word',
            }}
          >
            {hero.firstName}
          </h1>
          <h1
            className="animate-fade-up delay-200 hero-name"
            style={{
              fontFamily: 'var(--font-syne)',
              fontWeight: 800,
              fontSize: 'clamp(2.8rem, 12vw, 8.5rem)',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              color: 'var(--accent)',
              display: 'block',
              paddingBottom: '0.08em',
              wordBreak: 'break-word',
            }}
          >
            {hero.lastName}
          </h1>
        </div>

        <div className="draw-line" style={{ marginBottom: '28px' }} />

        {/* Tagline + availability — stacks on mobile */}
        <div
          style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '20px' }}
          className="animate-fade-up delay-400"
        >
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 'clamp(0.78rem, 2vw, 1rem)', color: 'var(--text-dim)', maxWidth: '500px', lineHeight: 1.9, whiteSpace: 'pre-line' }}>
            {hero.tagline}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
            {hero.available && (
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '12px', color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                ● Available
              </span>
            )}
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '12px', color: 'var(--text-faint)', letterSpacing: '0.1em' }}>
              {hero.location} · {hero.handle}
            </span>
          </div>
        </div>

        <div className="animate-fade-in delay-700" style={{ marginTop: '40px', fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: 'var(--text-faint)', letterSpacing: '0.2em', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ width: '24px', height: '1px', background: 'var(--text-faint)', display: 'inline-block' }} />
          SCROLL
        </div>
      </div>
    </section>
  )
}
