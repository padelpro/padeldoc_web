'use client'

import { useEffect, useRef, useState } from 'react'

// Version B's gentle reveal: the wrapped block fades and slides up 16px once, the first time it scrolls into view.
// Visible by default, so the page reads without JS. The hidden start is only applied once the observer is set up, and
// never for anyone who asked for less motion or for a block already on screen when the page loads.
type Phase = 'idle' | 'armed' | 'shown'

export default function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<Phase>('idle')

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    if (el.getBoundingClientRect().top < window.innerHeight) return // already on screen: leave it be
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        setPhase('shown')
        io.disconnect()
      }
    }, { rootMargin: '0px 0px -8% 0px' })
    setPhase('armed')
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const style: React.CSSProperties = phase === 'idle' ? {} : {
    opacity: phase === 'armed' ? 0 : 1,
    transform: phase === 'armed' ? 'translateY(16px)' : 'none',
    transition: 'opacity 400ms ease-out, transform 400ms ease-out',
  }
  return <div ref={ref} className={className} style={style}>{children}</div>
}
