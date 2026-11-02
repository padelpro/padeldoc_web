'use client'

import { useEffect, useState } from 'react'
import { storedKey, roleOf, firstName, HOME, type Role } from './signed-in'

// GET /v1/me on the padel-share Worker, as the tools call it (X-Coach-Key). The same literal base as usage-counter.tsx.
const ME_URL = 'https://padel-share.padel-coach.workers.dev/v1/me'
const TIMEOUT_MS = 6000

type Who = { phase: 'out' } | { phase: 'checking' } | { phase: 'in'; role: Role; name: string }

// One read per page load.
let pending: Promise<Who> | null = null
function whoIsIn(): Promise<Who> {
  if (pending) return pending
  pending = (async (): Promise<Who> => {
    const found = storedKey((n) => window.localStorage.getItem(n))
    if (!found) return { phase: 'out' }
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
    try {
      const res = await fetch(ME_URL, { headers: { 'X-Coach-Key': found.key }, signal: controller.signal })
      if (!res.ok) return { phase: 'out' }   // a refused key, or the Worker down: the visitor's links, as before
      const me: unknown = await res.json()
      const role = roleOf(me, found.slot)
      return role ? { phase: 'in', role, name: firstName(me) } : { phase: 'out' }
    } catch {
      return { phase: 'out' }
    } finally {
      clearTimeout(timer)
    }
  })()
  return pending
}

// Rendered on the server as a visitor (no key there); on this device, a stored key hides Sign in until /v1/me says
// whose it is, then shows their one button. No key: nothing changes.
function useWho(): Who {
  const [who, setWho] = useState<Who>({ phase: 'out' })
  useEffect(() => {
    let live = true
    let has = false
    try { has = !!storedKey((n) => window.localStorage.getItem(n)) } catch { has = false }
    if (!has) return
    setWho({ phase: 'checking' })
    void whoIsIn().then((w) => { if (live) setWho(w) })
    return () => { live = false }
  }, [])
  return who
}

const buttonCls = 'inline-block rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-on-accent hover:brightness-110'

// The header's right side: Sign in and Set up account, or the signed-in visitor's first name and their one button
// (the home page's "Signed in as" line went, Kevin 2 Nov 2026).
export function HeaderAccount() {
  const who = useWho()
  if (who.phase === 'checking') return <span className="ml-auto" />
  if (who.phase === 'in') {
    const home = HOME[who.role]
    return (
      <>
        {who.name && <span className="ml-auto text-sm font-medium">{who.name}</span>}
        <a href={home.href} className={`${who.name ? '' : 'ml-auto '}${buttonCls}`}>{home.label}</a>
      </>
    )
  }
  return (
    <>
      <a href="/signin" className="ml-auto inline-flex items-center min-h-11 sm:min-h-0 text-sm text-text/75 hover:text-text">Sign in</a>
      <a href="/signin#new" className="inline-flex items-center min-h-11 sm:min-h-0 text-sm font-medium text-accent hover:underline">Set up account</a>
    </>
  )
}
