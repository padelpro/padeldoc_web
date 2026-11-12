import { Blocks } from '../legal/blocks'
import { notice, NOTICE_TITLE, NOTICE_VERSION, NOTICE_CONTACT } from './copy'
import { MAIN_SITE } from '../site'

// demo.thepadeldoc.com/privacy: the demo's own short notice, in place of production's policy (padel-coach-src
// specs/demo-site-spec.md 9.4; Decided, Kevin 11 Nov 2026). Drawn by app/privacy/page.tsx on the demo build only.
// No site header: its Sign in and Set up account have no place on the demo.
export function DemoPrivacy() {
  return (
    <div className="min-h-screen mx-auto max-w-2xl px-6 py-16 sm:py-24">
      <header className="mb-10">
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted mb-3">Demo</p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">{NOTICE_TITLE}</h1>
        <p className="mt-3 text-sm text-muted">{NOTICE_VERSION} · Questions to <a className="text-accent-2 hover:underline" href={`mailto:${NOTICE_CONTACT}`}>{NOTICE_CONTACT}</a></p>
      </header>
      <Blocks blocks={notice} />
      <footer className="mt-16 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
        <a className="text-accent-2 hover:underline" href="/signin">← Pick a role</a>
        <a className="hover:text-text" href={MAIN_SITE}>The real thing: thepadeldoc.com</a>
        <a className="hover:text-text" href={`${MAIN_SITE}/privacy`}>thepadeldoc.com&apos;s privacy policy</a>
      </footer>
    </div>
  )
}
