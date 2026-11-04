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

// The home page's big header (site-parts.tsx SiteHeader big): 28px text and twice the padding, a row of their own
// below lg. At 375px Sign in and Set up account measure 324px together; the row wraps rather than scrolls.
const bigBtn = 'inline-flex items-center justify-center min-h-11 whitespace-nowrap rounded-xl border-2 px-2 py-2.5 lg:px-6 lg:py-3 text-[28px] leading-tight font-semibold'
const bigRow = 'w-full lg:w-auto lg:ml-auto flex flex-wrap items-center gap-2 lg:gap-3'
const bigFill = `${bigBtn} border-accent bg-accent text-on-accent hover:brightness-110`
// Signed in (Kevin 4 Nov 2026): the visitor's name and their one button a step down from Sign in's 28px, to 24px, one
// clear step above the hero line (text-xl, 20px). Padding scaled with it (lg 24x12 -> 20x10); still at least 44px tall.
const inText = 'text-[24px] leading-tight'
const inFill = `inline-flex items-center justify-center min-h-11 whitespace-nowrap rounded-xl border-2 px-2 py-2 lg:px-5 lg:py-2.5 ${inText} font-semibold border-accent bg-accent text-on-accent hover:brightness-110`

// The header's right side: Sign in and Set up account, or the signed-in visitor's first name and their one button
// (the home page's "Signed in as" line went, Kevin 2 Nov 2026).
export function HeaderAccount({ big = false }: { big?: boolean }) {
  const who = useWho()
  if (big) {
    if (who.phase === 'checking') return <div className={bigRow} />
    if (who.phase === 'in') {
      const home = HOME[who.role]
      return (
        <div className={bigRow}>
          {who.name && <span className={`${inText} font-medium`}>{who.name}</span>}
          <a href={home.href} className={inFill}>{home.label}</a>
        </div>
      )
    }
    return (
      <div className={bigRow}>
        <a href="/signin" className={`${bigBtn} border-text/30 text-text hover:border-text/70`}>Sign in</a>
        <a href="/signin#new" className={bigFill}>Set up account</a>
      </div>
    )
  }
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
