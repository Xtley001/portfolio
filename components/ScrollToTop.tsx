'use client'
import { useEffect } from 'react'

export default function ScrollToTop() {
  useEffect(() => {
    const btn = document.getElementById('stt-btn')
    if (!btn) return
    const onScroll = () => {
      btn.style.opacity = window.scrollY > 150 ? '1' : '0'
      btn.style.pointerEvents = window.scrollY > 150 ? 'auto' : 'none'
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      id='stt-btn'
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
        opacity: '0',
        pointerEvents: 'none',
        transition: 'opacity 0.3s ease',
        WebkitTapHighlightColor: 'transparent',
        display: 'block',
        lineHeight: 1,
      }}
    >
      <svg width='22' height='22' viewBox='0 0 22 22' fill='none'
        stroke='currentColor' strokeWidth='1.6'
        strokeLinecap='round' strokeLinejoin='round'>
        <line x1='11' y1='19' x2='11' y2='3' />
        <polyline points='4,10 11,3 18,10' />
      </svg>
    </button>
  )
}