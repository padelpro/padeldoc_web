'use client'

import { useEffect } from 'react'

// One "home" open per homepage load for the admin's usage dashboard (padel-share-api POST /v1/usage, Kevin 29 Oct
// 2026). Fire and forget: text/plain keeps it a simple request, and any failure is simply not counted. No cookies.
const USAGE_URL = 'https://padel-share.padel-coach.workers.dev/v1/usage'

export default function UsageBeacon({ tool = 'home' }: { tool?: string }) {
  useEffect(() => {
    try {
      fetch(USAGE_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ tool, event: 'open' }), keepalive: true, credentials: 'omit' })
        .catch(() => {})
    } catch { /* never break the page */ }
  }, [tool])
  return null
}
