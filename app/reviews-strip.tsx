'use client'

import { useEffect, useState } from 'react'
import { publicReviews, type Review } from './reviews'

// What people say (SU1): approved reviews the writers allowed. Same rules as the counter and the Used by strip: a
// public endpoint, a literal URL, give up after a few seconds, and nothing at all when there is nothing to show.
const REVIEWS_URL = 'https://padel-share.padel-coach.workers.dev/v1/reviews'
const TIMEOUT_MS = 4000

export default function ReviewsStrip({ className = '' }: { className?: string }) {
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
    let live = true
    void (async () => {
      try {
        const res = await fetch(REVIEWS_URL, { signal: controller.signal })
        if (!res.ok) return
        const data: unknown = await res.json()
        if (live) setReviews(publicReviews(data))
      } catch {
        // Failed, timed out or not JSON: show nothing.
      } finally {
        clearTimeout(timer)
      }
    })()
    return () => {
      live = false
      controller.abort()
      clearTimeout(timer)
    }
  }, [])

  if (!reviews.length) return null

  return (
    <section className={className} aria-label="What people say">
      <p className="text-sm font-medium text-muted">What people say</p>
      <ul className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r, i) => (
          <li key={i} className="rounded-xl bg-panel border border-line p-5">
            <div className="text-accent tracking-widest" aria-label={`${r.stars} out of 5`}>
              {'★'.repeat(r.stars)}<span className="text-line">{'★'.repeat(5 - r.stars)}</span>
            </div>
            <p className="mt-3 text-text/90 leading-relaxed">{r.body}</p>
            <p className="mt-3 text-sm text-muted">{r.name}, {r.role}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
