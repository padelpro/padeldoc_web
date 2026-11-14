'use client'

import { useEffect, useState } from 'react'
import copy from '../../_copy/launch.json'
import { confirmSaid, tokenOf } from '../../launch'
import { WORKER } from '../../worker-url'

// The page a "Tell me when it's ready" confirm email opens (padel-coach-src specs/launch-1-scope.md, stage 3). The
// link carries a signed token; this page POSTS it to the Worker once it has loaded, so a mail scanner that only fetches
// the link confirms nothing. One line says what happened.
type Phase = 'working' | 'done' | 'open' | 'expired' | 'failed'

export default function Confirm() {
  const C = copy.confirm
  const [phase, setPhase] = useState<Phase>('working')
  const [name, setName] = useState('')
  const [again, setAgain] = useState(0)

  useEffect(() => {
    const token = tokenOf(window.location.search)
    if (!token) { setPhase('expired'); return }
    let live = true
    setPhase('working')
    fetch(`${WORKER}/v1/launch/confirm`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token }), credentials: 'omit' })
      .then(async (res) => {
        const data = await res.json().catch(() => null)
        if (!live) return
        if (res.ok && data && typeof data.name === 'string') { setName(data.name); setPhase(data.open ? 'open' : 'done') }
        else setPhase(res.status === 400 ? 'expired' : 'failed')
      })
      .catch(() => { if (live) setPhase('failed') })
    return () => { live = false }
  }, [again])

  return (
    <main data-launch data-confirm={phase} className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p role={phase === 'failed' || phase === 'expired' ? 'alert' : 'status'} className="text-2xl sm:text-3xl font-semibold tracking-tight text-balance max-w-xl">{confirmSaid(phase, name, C)}</p>
      {phase === 'failed' && (
        <button type="button" onClick={() => setAgain((n) => n + 1)} className="mt-6 min-h-11 rounded-lg border border-text/30 px-5 text-base font-semibold text-text hover:border-text/70">{C.again}</button>
      )}
      <a href="/" className="mt-8 inline-flex items-center min-h-11 text-base text-muted underline underline-offset-4 hover:text-text">{C.home}</a>
    </main>
  )
}
