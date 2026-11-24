'use client'
import { useEffect } from 'react'

// Opening /research clears the app's New dot (Kevin 23 Nov 2026): this device keeps the newest post's date as seen,
// under the key the app reads (padel-coach-src src/research/latest.js SEEN_KEY). Storage blocked: nothing happens.
export const SEEN_KEY = 'pd_research_seen'
export function SeenMark({ date }: { date: string | null }) {
  useEffect(() => {
    if (!date) return
    try {
      const was = JSON.parse(window.localStorage.getItem(SEEN_KEY) || 'null')
      if (typeof was !== 'string' || was < date) window.localStorage.setItem(SEEN_KEY, JSON.stringify(date))
    } catch { /* a private window or blocked storage */ }
  }, [date])
  return null
}
