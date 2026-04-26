'use client'
import { useEffect, useState } from 'react'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    const calc = () => {
      const s = window.scrollY
      const t = document.documentElement.scrollHeight - window.innerHeight
      const show = s > 150
      setVisible(show)
      setOpacity(show ? Math.min(1, 0.5 + (t > 0 ? (s / t) * 0.5 : 0)) : 0)
    }
    calc()
    window.addEventListener('scroll', calc, { passive: true })
    return () => window.removeEventListener('scroll', calc)
  }, [])

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label='Back to top'
      style={{
        position: 'fixed',
        bottom: '80px',
        right: '20px',
        zIndex: 9999,
        background: 'none',
        border: 'none',
        outline: 'none',
        padding: '12px',
        cursor: 'pointer',
        color: 'var(--accent)',
        opacity: visible ? opacity : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.4s ease',
        WebkitTapHighlightColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '44px',
        minHeight: '44px',
      }}
    >
      <svg width='20' height='20' viewBox='0 0 20 20' fill='none'
        stroke='currentColor' strokeWidth='1.6'
        strokeLinecap='round' strokeLinejoin='round'>
        <line x1='10' y1='17' x2='10' y2='3' />
        <polyline points='4,9 10,3 16,9' />
      </svg>
    </button>
  )
}