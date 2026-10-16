import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { tools } from '../../tools-data'
import { Footer } from '../../site-parts'
import UsedByStrip from '../../used-by-strip'

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const t = tools.find((x) => x.slug === slug)
  if (!t) return {}
  return { title: t.name, description: t.line, alternates: { canonical: `/tools/${t.slug}` } }
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const t = tools.find((x) => x.slug === slug)
  if (!t) notFound()
  const others = tools.filter((x) => x.slug !== t.slug && x.who.some((w) => t.who.includes(w))).slice(0, 3)
  const open = t.cta ? t.cta.label : t.slug === 'coach' ? 'Get free coach access' : `Open the ${t.name}`

  return (
    <div className="min-h-screen mx-auto max-w-6xl px-6">
      <header className="flex items-center gap-3 py-6">
        <a href="/" className="flex items-center gap-3">
          <img src="/logo-mark.png" alt="" className="h-8 w-auto" />
          <span className="font-bold tracking-tight">The Padel Doc</span>
        </a>
        <a href="/club" className="ml-auto text-sm text-text/75 hover:text-text">Club sign in</a>
        <a href="/coach" className="text-sm text-text/75 hover:text-text">Coach sign in</a>
      </header>

      <section className="pt-10 pb-12 max-w-3xl">
        <a href="/" className="text-sm text-muted hover:text-text">All the tools</a>
        <h1 className="mt-3 text-5xl sm:text-6xl font-bold tracking-tight leading-[1.02]">{t.name}</h1>
        <p className="mt-5 text-xl text-text/85 leading-relaxed max-w-prose">{t.line}</p>
        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
          <a href={t.href} className={`${t.laptop ? 'hidden sm:inline-block' : 'inline-block'} font-medium bg-accent text-bg rounded px-5 py-3 hover:brightness-110`}>
            {open}
          </a>
          <span className="text-sm text-muted">{t.cta ? t.cta.note : 'Free, no account needed.'}</span>
        </div>
        {t.signIn && (
          <a href={t.signIn.href} className="mt-4 inline-block text-sm text-accent-2 hover:underline">{t.signIn.label}</a>
        )}
        {t.laptop && (
          <p className="mt-4 text-sm text-accent-2 sm:hidden">This one works on a laptop or computer. Open thepadeldoc.com there to use it.</p>
        )}
      </section>

      <div className="rounded-xl border border-line bg-panel-2 overflow-hidden shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)]">
        <img src={t.shot} alt={`${t.name} screen`} className="w-full" />
      </div>

      {t.slug === 'box-league' && <UsedByStrip className="mt-16" />}

      <section className="mt-20 grid gap-12 lg:grid-cols-[1fr_1fr]">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">What it does</h2>
          <ul className="mt-6 space-y-3">
            {t.points.map((p) => (
              <li key={p} className="flex gap-3 text-lg text-text/85">
                <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-[1px] bg-accent" aria-hidden="true" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
          {t.notes && (
            <div className="mt-10 rounded-lg bg-panel border border-line p-5">
              <h3 className="font-bold">Good to know</h3>
              <ul className="mt-3 space-y-2 text-text/80">
                {t.notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {t.steps && (
          <div>
            <h2 className="text-3xl font-bold tracking-tight">How it works</h2>
            <ol className="mt-6 border-t border-line">
              {t.steps.map((s, i) => (
                <li key={s.title} className="border-b border-line py-5 flex gap-5">
                  <span className="font-mono text-accent text-lg w-6 shrink-0">{i + 1}</span>
                  <div>
                    <p className="font-bold text-lg">{s.title}</p>
                    <p className="mt-1 text-text/75 leading-relaxed">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </section>

      {others.length > 0 && (
        <section className="mt-24">
          <h2 className="text-2xl font-bold tracking-tight">Goes well with</h2>
          <div className="mt-6 grid gap-8 sm:grid-cols-3">
            {others.map((o) => (
              <a key={o.slug} href={`/tools/${o.slug}`} className="group block">
                <img src={o.shot} alt="" className="aspect-[4/3] w-full rounded-lg object-cover object-top border border-line" />
                <h3 className="mt-4 font-bold group-hover:text-accent">{o.name}</h3>
                <p className="mt-1 text-sm text-muted leading-snug">{o.line}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
