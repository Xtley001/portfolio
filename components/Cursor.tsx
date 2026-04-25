'use client'
import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ringX = 0, ringY = 0
    let mouseX = 0, mouseY = 0

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX; mouseY = e.clientY
      if (dot.current) {
        dot.current.style.left = mouseX + 'px'
        dot.current.style.top = mouseY + 'px'
        dot.current.style.opacity = '1'
      }
    }

    const onEnter = (e: MouseEvent) => {
      const target = e.target as Element
      if (target.closest('a, button') && ring.current) {
        ring.current.style.transform = 'translate(-50%, -50%) scale(2.5)'
      }
    }
    const onLeave = (e: MouseEvent) => {
      const target = e.target as Element
      if (target.closest('a, button') && ring.current) {
        ring.current.style.transform = 'translate(-50%, -50%) scale(1)'
      }
    }
    document.addEventListener('mouseover', onEnter)
    document.addEventListener('mouseout', onLeave)

    const animate = () => {
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      if (ring.current) { ring.current.style.left = ringX + 'px'; ring.current.style.top = ringY + 'px' }
      requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove)
    animate()
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onEnter)
      document.removeEventListener('mouseout', onLeave)
    }
  }, [])

  return (
    <>
      <div ref={dot} className="cursor" />
      <div ref={ring} className="cursor-ring" />
    </>
  )
}
