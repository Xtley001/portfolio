export default function Footer({ copyright, domain }: { copyright?: string; domain?: string }) {
  const year = new Date().getFullYear()
  const copyrightText = copyright || `© ${year} XTLEY001`
  const domainText = domain || 'xtley001.com'
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '24px clamp(16px, 4vw, 24px)',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '8px',
    }}>
      <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '10px', color: 'var(--text-faint)', letterSpacing: '0.1em' }}>
        {copyrightText}
      </span>
      <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '10px', color: 'var(--text-faint)', letterSpacing: '0.1em' }}>
        {domainText}
      </span>
    </footer>
  )
}
