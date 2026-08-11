export default function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="reveal visible" style={{ width: '100%', maxWidth: '560px', textAlign: 'center' }}>
      <div
        style={{
          fontFamily: 'var(--font-dm-mono)',
          fontSize: '11px',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--accent-dim)',
          marginBottom: '20px',
        }}
      >
        Business Growth Assessment
      </div>

      <h1
        style={{
          fontFamily: 'var(--font-syne)',
          fontWeight: 800,
          fontSize: 'clamp(26px, 5.5vw, 40px)',
          color: 'var(--text)',
          lineHeight: 1.25,
          marginBottom: '20px',
        }}
      >
        What's Holding Your Service Business Back From Getting More Clients?
      </h1>

      <p
        style={{
          fontFamily: 'var(--font-dm-mono)',
          fontSize: '14px',
          lineHeight: 1.8,
          color: 'var(--text-dim)',
          marginBottom: '32px',
        }}
      >
        Answer 8 quick questions and get a personalized breakdown of where your business is strong, where
        it's leaking opportunity, and what to fix first.
      </p>

      <button
        onClick={onStart}
        style={{
          background: 'var(--accent)',
          color: 'var(--bg)',
          border: 'none',
          borderRadius: '2px',
          padding: '16px 32px',
          fontFamily: 'var(--font-dm-mono)',
          fontSize: '13px',
          fontWeight: 500,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          minHeight: '44px',
        }}
      >
        Get My Free Business Assessment →
      </button>

      <div
        style={{
          marginTop: '20px',
          fontFamily: 'var(--font-dm-mono)',
          fontSize: '11px',
          color: 'var(--text-faint)',
          letterSpacing: '0.04em',
        }}
      >
        ~90 seconds · No spam. Just your results and one follow-up.
      </div>
    </div>
  )
}
