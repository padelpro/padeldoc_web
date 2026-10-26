import type { Metadata } from 'next'
import { intro, sections, VERSION, CONTACT } from '../legal/privacy-content'
import { Blocks, LegalFooter } from '../legal/blocks'
import { SiteHeader } from '../site-parts'

export const metadata: Metadata = {
  title: 'Privacy policy',
  description: 'What The Padel Doc and PadelPro.ie collect, why, who sees it, how long it is kept and your rights.',
  alternates: { canonical: '/privacy' },
}

export default function Privacy() {
  return (
    <>
      <SiteHeader />
      <div className="min-h-screen mx-auto max-w-2xl px-6 py-16 sm:py-24">
        <header className="mb-10">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted mb-3">Legal</p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Privacy policy</h1>
          <p className="mt-3 text-sm text-muted">{VERSION} · Questions to <a className="text-accent-2 hover:underline" href={`mailto:${CONTACT}`}>{CONTACT}</a></p>
        </header>

        <Blocks blocks={intro} />

        <nav aria-label="Sections" className="my-8 rounded-lg border border-edge bg-panel p-5 text-sm">
          <ul className="space-y-1.5">
            {sections.map((s) => <li key={s.id}><a className="text-accent-2 hover:underline" href={`#${s.id}`}>{s.title}</a></li>)}
          </ul>
        </nav>

        {sections.map((s) => (
          <section key={s.id} id={s.id} className="mt-12 scroll-mt-8">
            <h2 className="text-2xl font-bold tracking-tight">{s.title}</h2>
            <Blocks blocks={s.blocks} />
          </section>
        ))}

        <p className="mt-12 text-sm text-muted">{VERSION}. Our <a className="text-accent-2 hover:underline" href="/cookies">cookie policy</a> lists everything stored on your device.</p>
        <LegalFooter />
      </div>
    </>
  )
}
