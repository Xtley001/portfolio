'use client'
import { useEffect, useState } from 'react'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const calc = () => setVisible(window.scrollY > 150)
    calc()
    window.addEventListener('scroll', calc, { passive: true })
    return () => window.removeEventListener('scroll', calc)
  }, [])

  return (
    <>
      <style>{`
        .scroll-top-btn {
          position: fixed;
          bottom: 80px;
          right: 20px;
          z-index: 9999;
          background: none;
          border: none;
          outline: none;
          padding: 12px;
          cursor: pointer;
          color: var(--accent);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.4s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 44px;
          min-height: 44px;
          -webkit-tap-highlight-color: transparent;
        }
        .scroll-top-btn.visible {
          opacity: 0.8;
          pointer-events: auto;
        }
      `}</style>
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label='Back to top'
        className={`scroll-top-btn${visible ? ' visible' : ''}`}
      >
        <svg width='22' height='22' viewBox='0 0 22 22' fill='none'
          stroke='currentColor' strokeWidth='1.6'
          strokeLinecap='round' strokeLinejoin='round'>
          <line x1='11' y1='19' x2='11' y2='3' />
          <polyline points='4,10 11,3 18,10' />
        </svg>
      </button>
    </>
  )
}