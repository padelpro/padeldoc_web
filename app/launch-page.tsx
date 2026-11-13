import copy from './_copy/launch.json'
import { headlineOf } from './launch'
import ComingSoon from './launch-soon'

// The launch landing page (padel-coach-src specs/launch-1-scope.md, Kevin 13 Nov 2026). The whole page: the headline,
// a button per role, what it does during the match and afterwards, the coming-soon line, and a footer with the free
// tools, Privacy and Terms. Every word is in _copy/launch.json; the headline is one number there.
//
// Light and dark: [data-launch] on the page turns on the dark tokens for a device set to dark (globals.css). The rest
// of the site stays light.
const FILL: Record<string, string> = {
  player: 'bg-accent text-on-accent',
  coach: 'bg-accent-2 text-on-accent',
}
const row = 'py-6 sm:py-7 border-b border-edge sm:grid sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-6 sm:items-baseline'
const label = 'font-mono text-xs uppercase tracking-[0.14em] text-muted'
const foot = 'inline-flex items-center min-h-11 sm:min-h-0 hover:text-text'

export default function LaunchPage() {
  return (
    <div data-launch className="min-h-screen flex flex-col">
      <header className="mx-auto w-full max-w-3xl px-6 pt-5 flex items-center gap-3">
        {/* The mark for each set: the site's own icon in light, the white mark on a device set to dark. */}
        <img src="/icon-192.png" alt="" width={32} height={32} className="h-8 w-8 dark:hidden" />
        <img src="/logo-mark.png" alt="" width={32} height={32} className="hidden h-8 w-8 object-contain dark:block" />
        <span className="text-lg font-bold tracking-tight">The Padel Doc</span>
        <a href="/signin" className="ml-auto inline-flex items-center min-h-11 text-base text-muted hover:text-text">{copy.signIn}</a>
      </header>

      <div className="mx-auto w-full max-w-3xl px-6 flex-1">
        <h1 data-launch-headline className="mt-14 sm:mt-28 text-[40px] sm:text-6xl font-bold tracking-tight leading-[1.05] text-balance">{headlineOf(copy)}</h1>
        <nav aria-label="Set up an account" className="mt-8 sm:mt-10 grid grid-cols-1 sm:flex gap-3">
          {copy.roles.map((r) => (
            <a key={r.id} href={r.href} data-launch-role={r.id}
              className={`inline-flex items-center justify-center min-h-14 rounded-lg px-8 text-lg font-semibold hover:brightness-110 ${FILL[r.id]}`}>{r.label}</a>
          ))}
        </nav>

        <dl className="mt-14 sm:mt-24 border-t border-edge">
          {copy.rows.map((r) => (
            <div key={r.label} className={row}>
              <dt className={label}>{r.label}</dt>
              <dd className="mt-2 sm:mt-0 text-2xl sm:text-[28px] font-medium leading-snug">{r.line}</dd>
            </div>
          ))}
          <div className={row}>
            <dt className={label}>{copy.soon.label}</dt>
            <dd className="mt-1 sm:mt-0"><ComingSoon /></dd>
          </div>
        </dl>
      </div>

      {/* A phone: the free tools on their rows, then Privacy and Terms on their own. sm and up: one row. */}
      <footer className="mx-auto w-full max-w-3xl px-6 pt-8 sm:pt-10 pb-12 text-sm text-muted sm:flex sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2">
        <div className="flex flex-wrap items-center gap-x-6 sm:contents">
          <span className="w-full sm:w-auto">{copy.footer.tools}</span>
          {copy.footer.links.map((l) => <a key={l.href} href={l.href} className={foot}>{l.name}</a>)}
        </div>
        <span aria-hidden="true" className="hidden sm:inline">·</span>
        <div className="mt-3 flex flex-wrap items-center gap-x-6 sm:mt-0 sm:contents">
          {copy.footer.legal.map((l) => <a key={l.href} href={l.href} className={foot}>{l.name}</a>)}
        </div>
      </footer>
    </div>
  )
}
