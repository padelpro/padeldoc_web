import type { Metadata } from 'next'
import { Footer, SiteHeader } from './site-parts'
import PhoneFrame from './phone-frame'
import Reveal from './reveal'

// The three role pages, /players, /coaches and /clubs (Kevin 2 Nov 2026): a hero in the role's colour with its set-up
// button and a phone, five or six feature blocks with a screenshot each (alternating sides on wider screens), common
// questions and the button again. The words are in _copy/<role>.json; this is the markup around them. Class names are
// written out in full so Tailwind finds them.

export type Shot = { src: string; alt: string; position?: 'top' | 'bottom'; todo?: string }   // todo: a shot still to take (Claude outputs/site-shots/TODO.md)
export type RoleCopy = {
  title: string
  description: string
  heading: string
  line: string
  cta: string
  heroShot: Shot
  features: { heading: string; body: string; shot: Shot }[]
  faqTitle: string
  faq: { q: string; a: string }[]
  closing: { heading: string }
}

export type RoleId = 'players' | 'coaches' | 'clubs'

// Each role's colour (the homepage's: player copper, coach blue, club green) and where its button goes.
const LOOK: Record<RoleId, { text: string; fill: string; ring: string; band: string; href: string }> = {
  players: { text: 'text-accent', fill: 'bg-accent', ring: 'border-accent/30', href: '/me/join',
    band: 'bg-[color-mix(in_srgb,var(--color-accent)_6%,var(--color-bg))]' },
  coaches: { text: 'text-accent-2', fill: 'bg-accent-2', ring: 'border-accent-2/30', href: '/coach/join',
    band: 'bg-[color-mix(in_srgb,var(--color-accent-2)_5%,var(--color-bg))]' },
  clubs: { text: 'text-accent-3', fill: 'bg-accent-3', ring: 'border-accent-3/30', href: '/club/join',
    band: 'bg-[color-mix(in_srgb,var(--color-accent-3)_6%,var(--color-bg))]' },
}

// The desktop shots' sizes (scripts/shots.mjs), so the space is kept before they load. Phone shots are all 780 x 1520.
const SIZES: Record<string, [number, number]> = { '/shots/tactics.png': [1040, 650], '/shots/americano.png': [765, 770] }
const isPhone = (src: string) => src.startsWith('/shots/phone-')

// The page's title, description and Open Graph card (the image is the segment's opengraph-image.tsx).
export function roleMetadata(id: RoleId, c: RoleCopy): Metadata {
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical: `/${id}` },
    openGraph: { type: 'website', siteName: 'The Padel Doc', url: `/${id}`, title: `${c.title} · The Padel Doc`, description: c.description },
    twitter: { card: 'summary_large_image', title: `${c.title} · The Padel Doc`, description: c.description },
  }
}

function Screenshot({ shot, eager = false }: { shot: Shot; eager?: boolean }) {
  if (isPhone(shot.src)) {
    return <PhoneFrame src={shot.src} alt={shot.alt} eager={eager} className="mx-auto w-[260px] max-w-full" />
  }
  const [w, h] = SIZES[shot.src] || [1440, 900]
  // Cropped to one shape so the blocks line up: the top of the shot, or the bottom when the copy says so.
  return (
    <div className="rounded-xl border border-edge bg-panel-2 overflow-hidden shadow-[0_40px_80px_-40px_color-mix(in_srgb,var(--color-shade)_45%,transparent)]">
      <img src={shot.src} alt={shot.alt} width={w} height={h} loading={eager ? 'eager' : 'lazy'}
        className={`block w-full aspect-[16/10] object-cover ${shot.position === 'bottom' ? 'object-bottom' : 'object-top'}`} />
    </div>
  )
}

export default function RolePage({ id, copy: c }: { id: RoleId; copy: RoleCopy }) {
  const look = LOOK[id]
  const button = (
    <a href={look.href} className={`inline-block rounded-lg px-7 py-4 text-lg font-semibold text-on-accent hover:brightness-110 ${look.fill}`}>{c.cta}</a>
  )
  return (
    <>
      <SiteHeader />
      <div className="min-h-screen">
        <section className={`${look.band} py-12 sm:py-16`}>
          <div className="mx-auto max-w-6xl px-6 md:grid md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-12">
            <div>
              <h1 className={`text-5xl sm:text-6xl font-bold tracking-tight leading-[1.02] ${look.text}`}>{c.heading}</h1>
              <p className="mt-5 text-xl sm:text-2xl text-text/85 leading-relaxed max-w-prose">{c.line}</p>
              <div className="mt-8">{button}</div>
            </div>
            <PhoneFrame src={c.heroShot.src} alt={c.heroShot.alt} eager className="mt-10 md:mt-0 mx-auto w-[280px] md:w-[300px]" />
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-6">
          {c.features.map((f, i) => (
            <section key={f.heading} aria-labelledby={`f${i}`}
              className="py-12 sm:py-16 border-b border-edge md:grid md:grid-cols-2 md:items-center md:gap-14">
              <div className={i % 2 ? 'md:order-2' : ''}>
                <h2 id={`f${i}`} className="text-3xl sm:text-4xl font-bold tracking-tight">{f.heading}</h2>
                <p className="mt-4 text-lg text-text/85 leading-relaxed max-w-prose">{f.body}</p>
              </div>
              <Reveal className={`mt-8 md:mt-0 ${i % 2 ? 'md:order-1' : ''}`}>
                <Screenshot shot={f.shot} />
              </Reveal>
            </section>
          ))}

          <section aria-labelledby="faq" className="py-12 sm:py-16">
            <h2 id="faq" className="text-3xl sm:text-4xl font-bold tracking-tight">{c.faqTitle}</h2>
            <dl className="mt-8 grid gap-x-12 gap-y-8 md:grid-cols-2">
              {c.faq.map((x) => (
                <div key={x.q}>
                  <dt className={`text-lg font-semibold ${look.text}`}>{x.q}</dt>
                  <dd className="mt-2 text-text/85 leading-relaxed">{x.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className={`rounded-xl border ${look.ring} ${look.band} p-8 sm:p-10 text-center`}>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{c.closing.heading}</h2>
            <div className="mt-6">{button}</div>
          </section>

          <div className="pb-16"><Footer /></div>
        </div>
      </div>
    </>
  )
}
