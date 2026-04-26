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
        bottom: '28px',
        right: '20px',
        zIndex: 9999,
        background: 'none',
        border: 'none',
        padding: '8px',
        margin: '-8px',
        cursor: 'pointer',
        opacity: opacity,
        color: 'var(--accent)',
        transition: 'opacity 0.3s ease',
        WebkitTapHighlightColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width='18' height='18' viewBox='0 0 18 18' fill='none'
        stroke='currentColor' strokeWidth='1.8'
        strokeLinecap='round' strokeLinejoin='round'>
        <polyline points='3,13 9,4 15,13' />
        <line x1='9' y1='4' x2='9' y2='16' />
      </svg>
    </button>
  )
}