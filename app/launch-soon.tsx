'use client'

import { useId, useState } from 'react'
import copy from './_copy/launch.json'
import { soonBody, withName, type SoonTopic } from './launch'
import { WORKER } from './worker-url'

// The coming-soon line (padel-coach-src specs/launch-1-scope.md): one quiet line of names; each opens a "Tell me when
// it's ready" email box under the line. The email goes to the Worker with the name it was left for (POST
// /v1/launch/notify, padel-share-api src/mailLists.js), which sends one email to confirm it was them; nothing is kept
// until that email's link is opened (app/launch/confirm). While the Worker's MAIL_LISTS is off, Send answers
// "Couldn't save that. Try again." and nothing is sent or kept anywhere.
const NOTIFY_URL = `${WORKER}/v1/launch/notify`

type Phase = 'idle' | 'sending' | 'done' | 'bad' | 'failed'

export default function ComingSoon() {
  const S = copy.soon
  const [open, setOpen] = useState<SoonTopic | null>(null)
  const [email, setEmail] = useState('')
  const [trap, setTrap] = useState('')   // the hidden box people never see: a bot that fills it is told yes and sent nothing
  const [phase, setPhase] = useState<Phase>('idle')
  const boxId = useId()
  const name = S.names.find((n) => n.id === open)?.name || ''

  const pick = (id: SoonTopic) => { setOpen((was) => (was === id ? null : id)); setPhase('idle') }

  async function send(e: React.FormEvent) {
    e.preventDefault()
    const body = soonBody(open, email)
    if (!body) { setPhase('bad'); return }
    setPhase('sending')
    try {
      const res = await fetch(NOTIFY_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...body, website: trap }), credentials: 'omit' })
      setPhase(res.ok ? 'done' : 'failed')
    } catch { setPhase('failed') }
  }

  const said = phase === 'done' ? withName(S.done, name) : phase === 'bad' ? S.bad : phase === 'failed' ? S.failed : ''

  return (
    <div data-soon>
      <p className="text-lg text-muted">
        {S.names.map((n, i) => (
          <span key={n.id}>
            <button type="button" data-soon-name={n.id} aria-expanded={open === n.id} aria-controls={boxId} onClick={() => pick(n.id as SoonTopic)}
              className={`inline-flex items-center min-h-11 sm:min-h-0 underline decoration-dotted underline-offset-4 hover:text-text ${open === n.id ? 'text-text' : ''}`}>{n.name}</button>
            {i < S.names.length - 1 ? ', ' : ''}
          </span>
        ))}
      </p>
      <div id={boxId}>
        {open && (phase === 'done'
          ? <p role="status" data-soon-said="done" className="mt-3 text-base text-text">{said}</p>
          : <form onSubmit={send} noValidate className="mt-3 max-w-md" data-soon-box={open}>
              <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden"><label>Website<input tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} /></label></div>
              <label htmlFor={`${boxId}-email`} className="block text-base font-medium text-text">{withName(S.ask, name)}</label>
              <div className="mt-2 flex gap-2">
                <input id={`${boxId}-email`} type="email" inputMode="email" autoComplete="email" required value={email} placeholder={S.email}
                  onChange={(e) => { setEmail(e.target.value); if (phase !== 'sending') setPhase('idle') }}
                  aria-invalid={phase === 'bad'} aria-describedby={`${boxId}-note`}
                  className="min-w-0 flex-1 min-h-11 rounded-lg border border-edge bg-panel px-3 text-base text-text placeholder:text-muted focus:outline-2 focus:outline-accent-2" />
                <button type="submit" disabled={phase === 'sending'}
                  className="min-h-11 shrink-0 rounded-lg border border-text/30 px-4 text-base font-semibold text-text hover:border-text/70 disabled:opacity-60">{S.send}</button>
              </div>
              <p id={`${boxId}-note`} className="mt-2 text-sm text-muted">
                {said ? <span role="alert" data-soon-said={phase} className="text-text">{said}</span> : S.note}
              </p>
            </form>)}
      </div>
    </div>
  )
}
