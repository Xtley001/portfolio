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
            HIGH-PERFORMANCE DISTRIBUTED SYSTEMS & EXECUTION LAYER (RUST)
          </span>
        </div>

        {/* Name */}
        <div
          className="animate-fade-up delay-100"
          style={{
            marginBottom: '14px',
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

        {/* Hero Headline */}
        <div
          className="animate-fade-up delay-150"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: 'clamp(1rem, 1.3vw, 1.2rem)',
            color: 'var(--accent)',
            letterSpacing: '0.04em',
            fontWeight: 500,
            marginBottom: '16px',
          }}
        >
          {hero.headline || 'High-Performance Distributed Systems & Execution Layer Engineer (Rust)'}
        </div>

        {/* Hero Tagline */}
        <p
          className="animate-fade-up delay-200"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: 'clamp(0.98rem, 1.25vw, 1.12rem)',
            color: '#e4e4e7',
            maxWidth: '820px',
            lineHeight: 1.65,
            marginBottom: '12px',
            fontWeight: 500,
          }}
        >
          {hero.tagline || 'Architecting ultra-low latency execution engines, consensus primitives, and PBS block-building infrastructure.'}
        </p>

        {/* Hero Bio */}
        <p
          className="animate-fade-up delay-250"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: 'clamp(0.88rem, 1.1vw, 0.98rem)',
            color: 'var(--text-dim)',
            maxWidth: '780px',
            lineHeight: 1.7,
            marginBottom: '28px',
          }}
        >
          {hero.bio || 'Specializing in bare-metal systems, lock-free concurrency, MEV extraction pipelines, and deterministic execution environments. Author of published crates on crates.io and PyPI.'}
        </p>

        {/* CTAs */}
        <div
          className="animate-fade-up delay-300"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '12px',
            marginBottom: 'clamp(36px, 5vh, 48px)',
          }}
        >
          <a
            href="#projects"
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '11.5px',
              color: 'var(--bg)',
              background: 'var(--accent)',
              border: '1px solid var(--accent)',
              padding: '8px 18px',
              borderRadius: '2px',
              textDecoration: 'none',
              fontWeight: 600,
              letterSpacing: '0.08em',
              transition: 'all 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--accent)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--accent)'
              e.currentTarget.style.color = 'var(--bg)'
            }}
          >
            View Systems & Infrastructure ↓
          </a>

          <a
            href="https://github.com/Xtley001"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '11.5px',
              color: 'var(--text)',
              background: 'transparent',
              border: '1px solid var(--border)',
              padding: '8px 18px',
              borderRadius: '2px',
              textDecoration: 'none',
              fontWeight: 500,
              letterSpacing: '0.08em',
              transition: 'all 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--accent)'
              e.currentTarget.style.color = 'var(--accent)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.color = 'var(--text)'
            }}
          >
            GitHub (@Xtley001) ↗
          </a>

          <a
            href="/Christley_Olubela_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '11px',
              color: 'var(--text-dim)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              border: '1px solid var(--border)',
              padding: '8px 14px',
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
              e.currentTarget.style.color = 'var(--text-dim)'
            }}
          >
            resume ↗
          </a>
        </div>

        {/* Minimalist, Borderless Telemetry Row */}
        {stats && stats.length > 0 && (
          <div className="animate-fade-up delay-350">
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
