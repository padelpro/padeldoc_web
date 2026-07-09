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
      <header className="mb-10">
        <p className="text-muted text-sm mb-1">The</p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Padel Doc</h1>
      </header>

      <p className="text-text/90 leading-relaxed mb-14 max-w-prose">
        I'm a padel coach based in Dublin with a PhD in Sport Science, which is
        where the name comes from. My sport science background shapes how I coach: Informed coaching, not guesswork. Here are some of the key tools that coaches and players can use to empower their knowledge to help their players improve. Video plays an important role in coaching, assessing skills frame by frame, not because it looked that way from across the court. The tools on this site come from the same place. The americano organiser
        exists because I got tired of scribbling rotations on the back of a
        receipt while twelve people shouted suggestions, searching whatsapp groups for the picture, and because the maths of a fair draw is a solved problem that no app had bothered to solve.
        Everything here gets tested on real courts with real players before it
        goes near this site. Use whatever helps your game or your coaching, and if something's
        broken or missing, tell me and I'll probably build it.
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
      </footer>
    </div>
  )
}
