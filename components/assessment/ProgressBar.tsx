export default function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.min(100, Math.max(0, (current / total) * 100))
  return (
    <div style={{ marginBottom: 'clamp(28px, 6vw, 44px)' }}>
      <div
        style={{
          fontFamily: 'var(--font-dm-mono)',
          fontSize: '11px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--text-faint)',
          marginBottom: '10px',
        }}
      >
        Question {current} of {total}
      </div>
      <div style={{ height: '1px', width: '100%', background: 'var(--border)', position: 'relative' }}>
        <div
          style={{
            height: '1px',
            width: `${pct}%`,
            background: 'var(--accent)',
            transition: 'width 0.4s cubic-bezier(0.76, 0, 0.24, 1)',
          }}
        />
      </div>
    </div>
  )
}
