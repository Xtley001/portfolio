export default function Footer({ copyright, domain }: { copyright?: string; domain?: string }) {
  const year = new Date().getFullYear()
  const copyrightText = copyright || `© ${year} XTLEY001`
  const domainText = domain || 'xtley001.com'
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
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
