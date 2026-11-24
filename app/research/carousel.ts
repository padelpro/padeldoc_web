// The slide carousel on a research post (Kevin 24 Nov 2026): the post's Instagram slides above the body, to swipe
// instead of reading. Built here as plain HTML at build time, so with JavaScript off it is a horizontal scroll row
// with snap points; carousel-wire.ts then adds the arrows, the dots, the counter and the arrow keys. Styles: .r-car in
// app/globals.css. Pure and tested in carousel.test.ts.
import { escapeHtml as e, type Post } from './posts.ts'

export type CarouselCopy = {
  hookDefault: string        // "Short on time? Swipe the slides."
  carouselLabel: string      // "Slides: {title}"
  slideLabel: string         // "{n} of {m}"
  prev: string               // "Previous slide"
  next: string               // "Next slide"
  dot: string                // "Go to slide {n}"
}

const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ''))
const FALLBACK = { width: 1080, height: 1350 }         // a slide whose size can't be read: Instagram's 4:5

const arrow = (dir: 'prev' | 'next') =>
  `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false"><path d="${dir === 'prev' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'}" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`

// The carousel's HTML for a post with slides; '' for a post without.
export function carouselHtml(p: Post, copy: CarouselCopy): string {
  const slides = p.slides
  if (!slides || !slides.length) return ''
  const m = slides.length
  const { width, height } = slides[0].width && slides[0].height ? (slides[0] as { width: number; height: number }) : FALLBACK
  const hook = p.hook || copy.hookDefault
  const items = slides.map((s, i) => {
    const w = s.width ?? width
    const h = s.height ?? height
    const lazy = i === 0 ? ' fetchpriority="high"' : ' loading="lazy"'
    return `<li class="r-car-slide" role="group" aria-roledescription="slide" aria-label="${e(fill(copy.slideLabel, { n: i + 1, m }))}" data-car-slide>` +
      `<img src="${e(s.src)}" alt="${e(s.alt)}" width="${w}" height="${h}" decoding="async"${lazy}></li>`
  }).join('')
  const dots = slides.map((_, i) =>
    `<button type="button" class="r-car-dot" data-car-dot="${i}" aria-label="${e(fill(copy.dot, { n: i + 1 }))}"${i === 0 ? ' aria-current="true"' : ''}><span></span></button>`).join('')
  return `<section class="r-car" data-carousel aria-roledescription="carousel" aria-label="${e(fill(copy.carouselLabel, { title: p.title }))}" style="--car-w:${width};--car-h:${height}">` +
    `<p class="r-car-hook">${e(hook)}</p>` +
    `<ul class="r-car-track" tabindex="0" data-car-track>${items}</ul>` +
    `<div class="r-car-bar" data-car-controls hidden>` +
    `<button type="button" class="r-car-arrow" data-car-prev aria-label="${e(copy.prev)}" disabled>${arrow('prev')}</button>` +
    `<div class="r-car-dots">${dots}</div>` +
    `<span class="r-car-count" data-car-count aria-hidden="true">1 / ${m}</span>` +
    `<button type="button" class="r-car-arrow" data-car-next aria-label="${e(copy.next)}"${m < 2 ? ' disabled' : ''}>${arrow('next')}</button>` +
    `</div>` +
    `<p class="r-car-live" data-car-live aria-live="polite"></p>` +
    `</section>`
}
