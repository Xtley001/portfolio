'use client'
import { useEffect, useState } from 'react'

export default function ScrollToTop() {
  const [show, setShow] = useState(false)
  const [opacity, setOpacity] = useState(0.4)

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      setShow(scrolled > 200)
      if (total > 0) setOpacity(Math.min(1, 0.4 + (scrolled / total) * 0.6))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!show) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label='Back to top'
      style={{
        position: 'fixed',
        bottom: 'clamp(20px, 5vw, 36px)',
        right: 'clamp(16px, 4vw, 32px)',
        zIndex: 9000,
        background: 'transparent',
        border: '1px solid var(--accent-dim)',
        color: 'var(--accent)',
        width: '44px',
        height: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        opacity: opacity,
        borderRadius: '2px',
        transition: 'opacity 0.3s ease',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <svg width='14' height='14' viewBox='0 0 14 14' fill='none'
        stroke='currentColor' strokeWidth='1.5'
        strokeLinecap='round' strokeLinejoin='round'>
        <line x1='7' y1='12' x2='7' y2='2' />
        <polyline points='3,6 7,2 11,6' />
      </svg>
    </button>
  )
}