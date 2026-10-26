import type { Metadata } from 'next'
import { Footer, SiteHeader } from '../site-parts'
import { tools } from '../tools-data'

export const metadata: Metadata = {
  title: 'All tools',
  description: 'Every free Padel Doc tool: match tagging and tracking, video analysis, tactics, Americanos, box leagues, a scoreboard and racket balance.',
  alternates: { canonical: '/tools' },
}

// Every tool, each linking to its own page (the grid that was on the homepage until Kevin 26 Oct 2026). The footer's
// All tools links here.
export default function Tools() {
  return (
    <>
      <SiteHeader />
      <div className="min-h-screen mx-auto max-w-6xl px-6">
        <section className="pt-12">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.02]">All tools</h1>
          <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {tools.map((t) => (
              <a key={t.slug} href={`/tools/${t.slug}`} className="group block">
                <img src={t.shot} alt="" className="aspect-[4/3] w-full rounded-lg object-cover object-top border border-edge" />
                <h2 className="mt-4 font-bold group-hover:text-accent">{t.name}</h2>
                <p className="mt-1 text-sm text-muted leading-snug">{t.line}</p>
              </a>
            ))}
          </div>
        </section>
        <Footer />
      </div>
    </>
  )
}
