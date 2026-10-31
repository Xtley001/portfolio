export default function Footer({ copyright }: { copyright?: string; domain?: string }) {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: '24px clamp(16px, 4vw, 24px)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: 'var(--text-faint)', letterSpacing: '0.08em' }}>
        {copyright || '© 2026 Olubela Christley. All rights reserved. Zero-latency systems & deterministic execution.'}
      </span>
      <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: 'var(--accent-dim)', letterSpacing: '0.12em' }}>
        RUST / DISTRIBUTED SYSTEMS
      </span>
    </footer>
  )
}
