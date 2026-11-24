'use client'
import { useEffect } from 'react'
import { wireCarousel } from './carousel-wire'

// Wires every slide carousel on the page (carouselHtml's markup) once it has loaded. Draws nothing itself.
export function CarouselWire({ liveLabel }: { liveLabel: string }) {
  useEffect(() => {
    const undo = Array.from(document.querySelectorAll<HTMLElement>('[data-carousel]')).map((el) => wireCarousel(el, liveLabel))
    return () => undo.forEach((f) => f())
  }, [liveLabel])
  return null
}
