'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isMobile
}

export default function Nav({ githubUrl = 'https://github.com/Xtley001', logoText = 'XTLEY001' }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  const links = [
    { label: 'work',    href: '#projects' },
    { label: 'about',   href: '#about'    },
    { label: 'contact', href: '#contact'  },
  ]

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 clamp(16px, 4vw, 24px)', height: '56px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(10,10,10,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}>
        <Link href="/" style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '13px', letterSpacing: '0.12em', color: 'var(--text)', WebkitTapHighlightColor: 'transparent' }}>
          {logoText}
        </Link>

        {/* Desktop nav */}
        {mounted && !isMobile && (
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            {links.map(l => (
              <a key={l.label} href={l.href}
                style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: 'var(--text-dim)', letterSpacing: '0.1em', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-dim)')}>
                {l.label}
              </a>
            ))}
            <a href={githubUrl} target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: 'var(--accent)', letterSpacing: '0.1em', border: '1px solid var(--accent-dim)', padding: '4px 12px', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = 'var(--bg)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--accent)' }}>
              github ↗
            </a>
            <a href="/admin" style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: 'var(--text-faint)', padding: '4px 8px' }}>⚙</a>
          </div>
        )}

        {/* Mobile hamburger — enlarged tap target */}
        {mounted && isMobile && (
          <button
            onClick={() => setOpen(!open)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '12px', margin: '-12px', WebkitTapHighlightColor: 'transparent' }}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <div style={{ width: '22px', height: '1px', background: 'var(--text)', marginBottom: '6px', transition: 'all 0.25s', transform: open ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
            <div style={{ width: '22px', height: '1px', background: 'var(--text)', transition: 'all 0.25s', opacity: open ? 0 : 1 }} />
            <div style={{ width: '22px', height: '1px', background: 'var(--text)', marginTop: '6px', transition: 'all 0.25s', transform: open ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
          </button>
        )}
      </nav>

      {/* Mobile fullscreen menu */}
      {mounted && isMobile && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99,
          background: 'var(--bg)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '40px',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.25s ease',
        }}>
          {links.map(l => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)}
              style={{ fontFamily: 'var(--font-syne)', fontSize: '2rem', fontWeight: 700, color: 'var(--text)', letterSpacing: '0.1em', textTransform: 'uppercase', WebkitTapHighlightColor: 'transparent', padding: '8px 0' }}>
              {l.label}
            </a>
          ))}
          <a href={githubUrl} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}
            style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '13px', color: 'var(--accent)', WebkitTapHighlightColor: 'transparent', padding: '8px 0' }}>
            github ↗
          </a>
        </div>
      )}
    </>
  )
}
