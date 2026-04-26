'use client'
import { useEffect, useState } from 'react'

export default function ScrollToTop() {
  const [opacity, setOpacity] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY
      const total = document.body.scrollHeight - window.innerHeight
      if (total <= 0) return
      const progress = scrolled / total           // 0 → 1
      const show = scrolled > 300
      setVisible(show)
      // opacity ramps from 0.25 at 300px to 1.0 at 60% scroll
      setOpacity(show ? Math.min(1, 0.25 + progress * 1.25) : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      style={{
        position: 'fixed',
        bottom: 'clamp(20px, 5vw, 36px)',
        right: 'clamp(16px, 4vw, 32px)',
        zIndex: 90,
        background: 'transparent',
        border: '1px solid var(--border)',
        color: 'var(--accent)',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        opacity: visible ? opacity : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.3s ease, transform 0.3s ease, border-color 0.2s, background 0.2s',
        pointerEvents: visible ? 'auto' : 'none',
        WebkitTapHighlightColor: 'transparent',
        borderRadius: '2px',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget
        el.style.background = 'var(--accent)'
        el.style.borderColor = 'var(--accent)'
        el.style.color = 'var(--bg)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget
        el.style.background = 'transparent'
        el.style.borderColor = 'var(--border)'
        el.style.color = 'var(--accent)'
      }}
    >
      {/* Minimal upward arrow — matches the project's mono aesthetic */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="7" y1="12" x2="7" y2="2" />
        <polyline points="3,6 7,2 11,6" />
      </svg>
    </button>
  )
}
