import type { Metadata } from 'next'
import { intro, sections, rows, outro, tableIntro, VERSION } from '../legal/cookie-content'
import { LegalFooter } from '../legal/blocks'
import { SiteHeader } from '../site-parts'

export const metadata: Metadata = {
  title: 'Cookie policy',
  description: 'Every cookie and browser storage item the Padel Doc tools use, what it holds and how long it lasts.',
  alternates: { canonical: '/cookies' },
}

const para = 'my-4 text-text/85 leading-relaxed'

export default function Cookies() {
  return (
    <>
      <SiteHeader />
      <div className="min-h-screen mx-auto max-w-2xl px-6 py-16 sm:py-24">
        <header className="mb-10">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted mb-3">Legal</p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Cookie policy</h1>
          <p className="mt-3 text-sm text-muted">{VERSION} · Part of our <a className="text-accent-2 hover:underline" href="/privacy">privacy policy</a></p>
        </header>

        {intro.map((t, i) => <p key={i} className={para}>{t}</p>)}

        {sections.map((s) => (
          <section key={s.title} className="mt-10">
            <h2 className="text-2xl font-bold tracking-tight">{s.title}</h2>
            {s.text.map((t, i) => <p key={i} className={para}>{t}</p>)}
          </section>
        ))}

        <section className="mt-10">
          <h2 className="text-2xl font-bold tracking-tight">What the tools store on your device</h2>
          <p className={para}>{tableIntro}</p>
          <div className="mt-4 overflow-x-auto rounded-lg border border-edge bg-panel">
            <table className="w-full text-sm">
              <thead className="bg-band text-left text-xs font-mono uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-3 py-2.5 font-medium">Tool</th>
                  <th className="px-3 py-2.5 font-medium">Name</th>
                  <th className="px-3 py-2.5 font-medium">What it holds</th>
                  <th className="px-3 py-2.5 font-medium">Lasts</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-t border-edge align-top">
                    <td className="px-3 py-2.5 whitespace-nowrap text-text">{r.tool}</td>
                    <td className="px-3 py-2.5 font-mono text-xs text-text/90 break-words">{r.name}</td>
                    <td className="px-3 py-2.5 text-text/85">{r.holds}</td>
                    <td className="px-3 py-2.5 text-muted">{r.lasts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {outro.map((t, i) => <p key={i} className={para}>{t}</p>)}
        <LegalFooter />
      </div>
    </>
  )
}
