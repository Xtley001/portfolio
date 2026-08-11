import type { ResultCopy } from '../../lib/assessment/resultCopy'

export default function ResultsScreen({
  name,
  resultCopy,
  bookingLink,
  whatsappLink,
}: {
  name: string
  resultCopy: ResultCopy
  bookingLink: string
  whatsappLink: string
}) {
  return (
    <div className="reveal visible" style={{ width: '100%', maxWidth: '560px' }}>
      <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '13px', color: 'var(--text-dim)', marginBottom: '8px' }}>
        {resultCopy.emoji} Your primary opportunity
      </div>

      <h1
        style={{
          fontFamily: 'var(--font-syne)',
          fontWeight: 700,
          fontSize: 'clamp(24px, 5vw, 32px)',
          color: 'var(--text)',
          lineHeight: 1.25,
          marginBottom: '16px',
        }}
      >
        {resultCopy.headline}
      </h1>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '28px' }}>
        <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 'clamp(2.4rem, 8vw, 3.5rem)', color: 'var(--accent)', lineHeight: 1 }}>
          {resultCopy.score}
        </span>
        <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '13px', color: 'var(--text-faint)' }}>/100</span>
      </div>

      <hr style={{ marginBottom: '24px' }} />

      <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '14px', lineHeight: 1.9, color: 'var(--text-dim)', marginBottom: '32px' }}>
        {name ? `${name}, ` : ''}
        {resultCopy.reflection}
      </p>

      <div
        style={{
          fontFamily: 'var(--font-dm-mono)',
          fontSize: '11px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--accent)',
          marginBottom: '8px',
        }}
      >
        Recommended
      </div>
      <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '16px', color: 'var(--text)', marginBottom: '10px' }}>
        {resultCopy.primaryOffer}
      </div>
      <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '13px', color: 'var(--text-faint)', marginBottom: '36px' }}>
        Also consider: {resultCopy.secondaryOffers.join(' · ')}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <a
          href={bookingLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            textAlign: 'center',
            background: 'var(--accent)',
            color: 'var(--bg)',
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            padding: '16px 28px',
            borderRadius: '2px',
            minHeight: '44px',
          }}
        >
          {resultCopy.ctaLabel}
        </a>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            textAlign: 'center',
            background: 'transparent',
            color: 'var(--accent)',
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '13px',
            letterSpacing: '0.02em',
            textDecoration: 'none',
            padding: '15px 27px',
            border: '1px solid var(--border-bright)',
            borderRadius: '2px',
            minHeight: '44px',
          }}
        >
          Message me on WhatsApp
        </a>
      </div>
    </div>
  )
}
