// The slide carousel's behaviour (Kevin 24 Nov 2026), added to carouselHtml's markup in the browser: the arrows, the
// dots, the "3 / 8" counter, the left and right arrow keys while it has focus, and a polite "Slide 3 of 8" for screen
// readers. Swiping is the browser's own scroll with snap points, so it works the same with JavaScript off. No autoplay.
// Reduced motion: jumps instead of gliding. Returns a function that undoes it.
export function wireCarousel(root: HTMLElement, liveLabel = 'Slide {n} of {m}'): () => void {
  const track = root.querySelector<HTMLElement>('[data-car-track]')
  const slides = Array.from(root.querySelectorAll<HTMLElement>('[data-car-slide]'))
  const bar = root.querySelector<HTMLElement>('[data-car-controls]')
  if (!track || !bar || slides.length < 2) return () => {}
  const dots = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-car-dot]'))
  const prev = root.querySelector<HTMLButtonElement>('[data-car-prev]')
  const next = root.querySelector<HTMLButtonElement>('[data-car-next]')
  const count = root.querySelector<HTMLElement>('[data-car-count]')
  const live = root.querySelector<HTMLElement>('[data-car-live]')
  const m = slides.length
  const reduce = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  const offset = (i: number) => slides[i].offsetLeft - slides[0].offsetLeft
  let current = 0
  let announce = false

  const indexNow = () => {
    // The slide whose left edge is nearest the track's; the last when scrolled to the end.
    if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 2) return m - 1
    let best = 0
    for (let i = 1; i < m; i++) if (Math.abs(offset(i) - track.scrollLeft) < Math.abs(offset(best) - track.scrollLeft)) best = i
    return best
  }
  const show = (i: number) => {
    if (i === current && !announce) return
    current = i
    dots.forEach((d, k) => (k === i ? d.setAttribute('aria-current', 'true') : d.removeAttribute('aria-current')))
    if (count) count.textContent = `${i + 1} / ${m}`
    if (prev) prev.disabled = i === 0
    if (next) next.disabled = i === m - 1
    if (live && announce) live.textContent = liveLabel.replace('{n}', String(i + 1)).replace('{m}', String(m))
    announce = false
  }
  const go = (i: number) => {
    const to = Math.max(0, Math.min(m - 1, i))
    announce = true
    track.scrollTo({ left: offset(to), behavior: reduce() ? 'auto' : 'smooth' })
    show(to)
  }

  let frame = 0
  const onScroll = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => show(indexNow())) }
  const onKey = (ev: KeyboardEvent) => {
    if (ev.key === 'ArrowRight') { ev.preventDefault(); go(current + 1) }
    else if (ev.key === 'ArrowLeft') { ev.preventDefault(); go(current - 1) }
  }
  const onPrev = () => go(current - 1)
  const onNext = () => go(current + 1)
  const onDots = dots.map((d, k) => { const f = () => go(k); d.addEventListener('click', f); return f })

  track.addEventListener('scroll', onScroll, { passive: true })
  root.addEventListener('keydown', onKey)
  prev?.addEventListener('click', onPrev)
  next?.addEventListener('click', onNext)
  bar.hidden = false
  root.classList.add('r-car-js')

  return () => {
    cancelAnimationFrame(frame)
    track.removeEventListener('scroll', onScroll)
    root.removeEventListener('keydown', onKey)
    prev?.removeEventListener('click', onPrev)
    next?.removeEventListener('click', onNext)
    dots.forEach((d, k) => d.removeEventListener('click', onDots[k]))
    bar.hidden = true
    root.classList.remove('r-car-js')
  }
}
