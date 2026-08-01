'use client'

import { useEffect, useState } from 'react'
import { usageSentence } from './usage-sentence'

// The padel-share Worker's public counters. A LITERAL, not an env var: this endpoint is
// unauthenticated and already public — the same base URL is baked into every tool bundle under
// public/ — so there is nothing here to keep out of a client bundle. An env var would only add a
// deployment-time failure mode (unset in one environment, counter silently gone) to a value that
// does not vary by environment: one Worker serves both brands.
const STATS_URL = 'https://padel-share.padel-coach.workers.dev/v1/stats'

// Give up rather than hang. §7 rule 1 treats a timeout exactly as a failure — render nothing —
// so the abort and a network error deliberately land in the same catch.
const TIMEOUT_MS = 4000

export default function UsageCounter() {
  const [sentence, setSentence] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
    let live = true

    void (async () => {
      try {
        const res = await fetch(STATS_URL, { signal: controller.signal })
        if (!res.ok) return                      // any non-200: nothing to say
        const data: unknown = await res.json()   // a malformed body throws, and is caught below
        if (live) setSentence(usageSentence(data))
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

  // Nothing to show means no element at all, rather than an empty <p> whose margins would still
  // occupy space. That is the whole of §7's reservation rule: absent, the DOM is untouched and the
  // page is byte-identical to one without this component.
  if (!sentence) return null

  // A normal in-flow line. No top margin is needed: the intro's mb-14 is an adjacent sibling
  // margin and collapses to the larger of the two, so it already supplies the 3.5rem above. This
  // element's own mb-14 preserves the same 3.5rem before the tools section, so the page grows by
  // exactly one line height when the counter renders.
  return <p className="text-sm font-mono text-muted mb-14">{sentence}</p>
}
