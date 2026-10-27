'use client'

import { useEffect, useState } from 'react'
import { usageLine } from './usage-sentence'

// The padel-share Worker's public counters. A LITERAL, not an env var: this endpoint is
// unauthenticated and already public — the same base URL is baked into every tool bundle under
// public/ — so there is nothing here to keep out of a client bundle. An env var would only add a
// deployment-time failure mode (unset in one environment, counter silently gone) to a value that
// does not vary by environment: one Worker serves both brands.
const STATS_URL = 'https://padel-share.padel-coach.workers.dev/v1/stats'

// Give up rather than hang. §7 rule 1 treats a timeout exactly as a failure — render nothing —
// so the abort and a network error deliberately land in the same catch.
const TIMEOUT_MS = 4000

// The fetch, shared with the home page's numbers strip (usage-numbers.tsx): the parsed body, or null while waiting and
// on any failure, so both render nothing when the Worker doesn't answer.
export function useStats(): unknown {
  const [data, setData] = useState<unknown>(null)

  useEffect(() => {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
    let live = true

    void (async () => {
      try {
        const res = await fetch(STATS_URL, { signal: controller.signal })
        if (!res.ok) return                      // any non-200: nothing to say
        const body: unknown = await res.json()   // a malformed body throws, and is caught below
        if (live) setData(body)
      } catch {
        // Fetch failed, timed out, was aborted, or the body was not JSON. Render nothing and say
        // nothing — a console error on a marketing page helps nobody. State stays null.
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

  return data
}

export default function UsageCounter({ className = '' }: { className?: string }) {
  const data = useStats()
  const line = data === null ? null : usageLine(data)

  // Nothing to show means no element at all, rather than an empty <p> whose margins would still
  // occupy space. That is the whole of §7's reservation rule: absent, the DOM is untouched and the
  // page is byte-identical to one without this component.
  if (!line) return null

  // One line under the header band (Kevin 26 Oct 2026); the page sets the spacing through className.
  return <p className={`text-sm font-mono text-muted ${className}`}>{line}</p>
}
