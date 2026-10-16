'use client'

import { useEffect, useState } from 'react'
import { usedByClubs, type Club } from './used-by'

// "Used by": club logos for clubs that opted in (box-league-spec.md decision 27). Same rules as the usage counter: a
// public endpoint, a literal URL, give up after a few seconds, and render nothing at all when there is nothing to
// show or the Worker doesn't answer.
const USED_BY_URL = 'https://padel-share.padel-coach.workers.dev/v1/used-by'
const TIMEOUT_MS = 4000

export default function UsedByStrip({ className = '' }: { className?: string }) {
  const [clubs, setClubs] = useState<Club[]>([])

  useEffect(() => {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
    let live = true
    void (async () => {
      try {
        const res = await fetch(USED_BY_URL, { signal: controller.signal })
        if (!res.ok) return
        const data: unknown = await res.json()
        if (live) setClubs(usedByClubs(data))
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

  if (!clubs.length) return null

  return (
    <section className={className} aria-label="Clubs using The Padel Doc">
      <p className="text-sm font-medium text-muted">Used by</p>
      <ul className="mt-4 flex flex-wrap items-center gap-x-10 gap-y-6">
        {clubs.map((c) => (
          <li key={c.name + c.logoUrl}>
            <img src={c.logoUrl} alt={c.name} title={c.name} className="h-12 w-auto max-w-[160px] object-contain" loading="lazy" />
          </li>
        ))}
      </ul>
    </section>
  )
}
