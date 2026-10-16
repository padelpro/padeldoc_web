import { Community, Footer } from './site-parts'
import UsageCounter from './usage-counter'
import UsedByStrip from './used-by-strip'
import { tools, byWho, type Tool } from './tools-data'

// The homepage: the visitor picks player, coach or club organiser, and each panel lists the tools
// for that job. Every tool links to its own page under /tools/<slug>.
const sides = [
  { key: 'play' as const, title: 'I’m a player', line: 'Watch your matches back, see where points are won and lost, and set up your racket.', ctas: [{ label: 'Tag a match', href: '/tools/tagger' }], note: 'Player sign-in is coming, so you can keep your own matches.' },
  { key: 'coach' as const, title: 'I’m a coach', line: 'Give each player a private page with notes, homework, stats and clips.', ctas: [{ label: 'Get free coach access', href: '/coach/join' }] },
  { key: 'club' as const, title: 'I’m a club organiser', line: 'Run box leagues, Americanos and Mexicanos, and score matches people can follow live.', ctas: [{ label: 'Run a box league', href: '/tools/box-league' }, { label: 'Set up an Americano', href: '/americano' }] },
]

function Mini({ t }: { t: Tool }) {
  return (
    <a href={`/tools/${t.slug}`} className="group flex items-center gap-4 py-3 border-t border-line">
      <img src={t.shot} alt="" className="h-12 w-20 shrink-0 rounded object-cover object-top border border-line" />
      <span>
        <span className="block font-medium group-hover:text-accent">{t.name}</span>
        <span className="block text-sm text-muted leading-snug">{t.line}</span>
      </span>
    </a>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen mx-auto max-w-6xl px-6">
      <header className="flex items-center gap-3 py-6">
        <img src="/logo-mark.png" alt="" className="h-8 w-auto" />
        <span className="font-bold tracking-tight">The Padel Doc</span>
        <a href="/club" className="ml-auto text-sm text-text/75 hover:text-text">Club sign in</a>
        <a href="/coach" className="text-sm text-text/75 hover:text-text">Coach sign in</a>
      </header>

      <section className="pt-12 pb-14 max-w-3xl">
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.02]">Free padel tools to help the game grow.</h1>
        <p className="mt-6 text-lg text-text/80 leading-relaxed max-w-prose">
          Start with what you do. Everything here is free to use.
        </p>
        <div className="mt-6"><UsageCounter /></div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {sides.map((s) => (
          <div key={s.key} className="rounded-xl bg-panel border border-line p-6 flex flex-col">
            <h2 className="text-3xl font-bold tracking-tight">{s.title}</h2>
            <p className="mt-3 text-text/80 leading-relaxed">{s.line}</p>
            <div className="mt-6 flex-1">
              {byWho(s.key).map((t) => (
                <Mini key={t.slug} t={t} />
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {s.ctas.map((c, i) => (
                <a key={c.href} href={c.href} className={i === 0
                  ? 'font-medium bg-accent text-bg rounded px-4 py-2 hover:brightness-110'
                  : 'font-medium border border-accent/60 text-accent rounded px-4 py-2 hover:bg-accent/10'}>{c.label}</a>
              ))}
            </div>
            {s.note && <p className="mt-4 text-sm text-accent-2">{s.note}</p>}
          </div>
        ))}
      </section>

      <UsedByStrip className="mt-16" />

      <section className="mt-24">
        <h2 className="text-3xl font-bold tracking-tight">All the tools</h2>
        <div className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((t) => (
            <a key={t.slug} href={`/tools/${t.slug}`} className="group block">
              <img src={t.shot} alt="" className="aspect-[4/3] w-full rounded-lg object-cover object-top border border-line" />
              <h3 className="mt-4 font-bold group-hover:text-accent">{t.name}</h3>
              <p className="mt-1 text-sm text-muted leading-snug">{t.line}</p>
            </a>
          ))}
        </div>
      </section>

      <Community />
      <Footer />
    </div>
  )
}
