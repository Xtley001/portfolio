export default function Footer() {
  const year = new Date().getFullYear()
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
        {`© ${year} Xtley001`}
      </span>
      <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '10px', color: 'var(--text-faint)', letterSpacing: '0.1em' }}>
        olubelachristley@gmail.com
      </span>
    </footer>
  )
}
