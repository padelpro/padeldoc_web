// Tool routes rewrite to static HTML bundles in public/<route>/index.html (see next.config.ts),
// so these are plain anchors, not next/link client navigations.
const tools = [
  { name: 'Tactics Board', href: '/tactics', desc: 'Draw plays and set player positions on a padel court.' },
  { name: 'Match Tracker', href: '/tracker', desc: 'Log shots, winners and errors live while you play.' },
  { name: 'Balance Calculator', href: '/balance', desc: 'Work out lead tape placement and the new balance point.' },
  { name: 'Video Analyser', href: '/analyse', desc: 'Load a clip, trim it, slow it down and annotate technique.' },
  { name: 'Americano Organizer', href: '/americano', desc: 'Set up an Americano, run the schedule and track scores.' },
]

export default function Home() {
  return (
    <div className="min-h-screen mx-auto max-w-2xl px-6 py-16 sm:py-24">
      <header className="mb-10 flex items-center gap-3">
        <img
          src="/logo-mark.png"
          alt="The Padel Doc"
          width={58}
          height={80}
          className="h-10 w-auto shrink-0"
        />
        <div>
          <p className="text-muted text-sm mb-1">The</p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Padel Doc</h1>
        </div>
      </header>

      <p className="text-text/90 leading-relaxed mb-14 max-w-prose">
        A set of free tools for anyone developing padel: players, coaches and
        club managers.
      </p>

      <section>
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-muted mb-2">Tools</h2>
        <ul className="border-t border-line">
          {tools.map((t) => (
            <li key={t.href} className="border-b border-line">
              <a href={t.href} className="flex flex-col gap-1 py-4 hover:bg-panel/40 -mx-3 px-3 rounded transition-colors">
                <span className="font-mono text-accent text-sm font-medium">{t.name}</span>
                <span className="text-muted text-sm">{t.desc}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <footer className="mt-16 text-sm text-muted">
        Feedback:{' '}
        <a className="text-accent-2 hover:underline" href="mailto:hello@padelpro.ie">
          hello@padelpro.ie
        </a>
        <span className="mx-2 text-line">·</span>
        <a className="hover:underline" href="/about">
          About
        </a>
      </footer>
    </div>
  )
}
