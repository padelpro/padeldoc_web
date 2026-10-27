import { Community, Footer, SiteHeader } from './site-parts'
import UsageNumbers from './usage-numbers'
import UsedByStrip from './used-by-strip'
import ReviewsStrip from './reviews-strip'
import { SignedInLine } from './signed-in-header'
import PhoneFrame from './phone-frame'
import Reveal from './reveal'

// The homepage (Kevin 26 Oct 2026): one question, a pill per role, then a section per role with its main tool, what it
// does in a few ticks and one button, with the free line under it. Each role has its colour: player copper, coach
// blue, club green. Class names are written out in full so Tailwind finds them. Every tool is listed on /tools (the
// footer's All tools).
//
// Two versions for a side-by-side look on a phone (preview-mobile-layout, Kevin 27 Oct 2026; never merged):
// A, calm: a phone beside the hero, the usage numbers under it, dark phone shots in a phone frame on phones.
// B, fuller: A plus a soft band of each role's colour behind its section and a gentle reveal on scroll.
export type Variant = 'a' | 'b'

// Said once under the question, so it shows before any scrolling, and again under each role's button.
const FREE = 'Free. Every feature included.'

const roles = [
  {
    id: 'player', pill: 'Player', heading: 'For players',
    line: 'Keep your matches, see your stats and link up with your coach.',
    shot: '/shots/tagger.png', phoneShot: '/shots/phone-dark-player.png',
    shotAlt: 'The Match Tagger', phoneAlt: "A player's My page on a phone",
    ticks: ['Watch your matches back', 'See where points are won and lost', 'Messages, clips and homework from your coach', 'Your stats over time', 'Set up your racket'],
    cta: { label: 'Set up a player account', href: '/me/join' },
    text: 'text-accent', fill: 'bg-accent', pillCls: 'border-accent text-accent hover:bg-accent',
    band: 'bg-[color-mix(in_srgb,var(--color-accent)_6%,var(--color-bg))]',
  },
  {
    id: 'coach', pill: 'Coach', heading: 'For coaches',
    line: 'Give each player a private page with notes, homework, stats and clips.',
    shot: '/shots/player.png', phoneShot: '/shots/phone-dark-coach.png',
    shotAlt: 'The coach page', phoneAlt: "A player's ratings on the coach page, on a phone",
    ticks: ['A private page per player', 'Video analysis and tagging', 'Messages, voice notes and clips', 'Lesson booking and RSVP', 'Daily lesson email'],
    cta: { label: 'Set up a coach account', href: '/coach/join' },
    text: 'text-accent-2', fill: 'bg-accent-2', pillCls: 'border-accent-2 text-accent-2 hover:bg-accent-2',
    band: 'bg-[color-mix(in_srgb,var(--color-accent-2)_5%,var(--color-bg))]',
  },
  {
    id: 'club', pill: 'Club', heading: 'For clubs',
    line: 'Run box leagues, Americanos and Mexicanos, and score matches people can follow live.',
    shot: '/shots/box-league.png', phoneShot: '/shots/phone-dark-club.png',
    shotAlt: 'Box League', phoneAlt: 'A box league on a phone',
    ticks: ['Box leagues drawn and scored for you', 'Americanos and Mexicanos', 'Live scoreboard links', 'Member import from a spreadsheet', 'Live results and tables online'],
    cta: { label: 'Set up a club account', href: '/club/join' },
    text: 'text-accent-3', fill: 'bg-accent-3', pillCls: 'border-accent-3 text-accent-3 hover:bg-accent-3',
    band: 'bg-[color-mix(in_srgb,var(--color-accent-3)_6%,var(--color-bg))]',
  },
]

// The reveal is version B's alone; in A the block renders as is.
function Maybe({ on, children }: { on: boolean; children: React.ReactNode }) {
  return on ? <Reveal>{children}</Reveal> : <>{children}</>
}

// A small fixed link to the other version, bottom right, above everything.
function VersionPill({ variant }: { variant: Variant }) {
  const [label, href] = variant === 'a' ? ['Version A · see B', '/b'] : ['Version B · see A', '/']
  return (
    <a href={href}
      className="fixed bottom-4 right-4 z-50 inline-flex h-11 items-center rounded-full border border-edge bg-panel/95 px-4 text-sm font-medium text-muted shadow-[0_8px_24px_-12px_color-mix(in_srgb,var(--color-shade)_50%,transparent)] backdrop-blur hover:text-text">
      {label}
    </a>
  )
}

export default function HomePage({ variant }: { variant: Variant }) {
  const b = variant === 'b'
  return (
    <>
      <SiteHeader />
      <div className="min-h-screen">
        <div className="mx-auto max-w-6xl px-6">
          <section className="pt-12 pb-4 md:grid md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-12">
            <div>
              <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.02] max-w-4xl">
                Are you a <span className="text-accent">player</span>, a <span className="text-accent-2">coach</span> or
                a <span className="text-accent-3">club</span>?
              </h1>
              <p className="mt-5 text-xl text-muted">{FREE}</p>
              <SignedInLine className="mt-6" />
              <nav aria-label="Pick your role" className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {roles.map((r) => (
                  <a key={r.id} href={`#${r.id}`}
                    className={`rounded-full border-2 bg-panel px-6 py-3 text-center text-lg font-semibold hover:text-on-accent ${r.pillCls}`}>{r.pill}</a>
                ))}
              </nav>
            </div>
            <PhoneFrame src="/shots/phone-dark-hero.png" alt="The coach dashboard on a phone, one card per player" eager
              className="mt-10 md:mt-0 mx-auto w-[280px] md:w-[300px]" />
          </section>

          <UsageNumbers className="mt-10 sm:mt-14" />
        </div>

        {roles.map((r, i) => (
          <section key={r.id} id={r.id} aria-labelledby={`${r.id}-heading`}
            className={b ? `${i === 0 ? 'mt-12 sm:mt-16 ' : ''}${r.band} py-14 sm:py-20` : 'scroll-mt-6'}>
            <div className="mx-auto max-w-6xl px-6">
              <div className={b ? '' : 'mt-12 pt-10 sm:mt-20 sm:pt-16 border-t border-edge'}>
                <h2 id={`${r.id}-heading`} className={`text-4xl sm:text-5xl font-bold tracking-tight ${r.text}`}>{r.heading}</h2>
                <p className="mt-4 text-xl text-text/85 leading-relaxed max-w-prose">{r.line}</p>
                <Maybe on={b}>
                  {/* Phones: a dark phone shot in the CSS phone frame. sm and up: the 1440 x 900 desktop shot, as before. */}
                  <PhoneFrame src={r.phoneShot} alt={r.phoneAlt} className="sm:hidden mt-8 mx-auto w-[300px] max-w-full" />
                  <div className="hidden sm:block mt-10 rounded-xl border border-edge bg-panel-2 overflow-hidden shadow-[0_40px_80px_-40px_color-mix(in_srgb,var(--color-shade)_45%,transparent)]">
                    <img src={r.shot} alt={r.shotAlt} width={1440} height={900} loading="lazy" className="w-full h-auto" />
                  </div>
                </Maybe>
                <ul className="mt-8 sm:mt-10 grid gap-x-10 gap-y-3 sm:grid-cols-2">
                  {r.ticks.map((t) => (
                    <li key={t} className="flex gap-3 text-lg">
                      <span className={`font-mono font-bold ${r.text}`} aria-hidden="true">&#10003;</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 sm:mt-10">
                  <a href={r.cta.href} className={`inline-block rounded-lg px-7 py-4 text-lg font-semibold text-on-accent hover:brightness-110 ${r.fill}`}>{r.cta.label}</a>
                  <p className="mt-3 text-muted">{FREE}</p>
                </div>
              </div>
            </div>
          </section>
        ))}

        <div className="mx-auto max-w-6xl px-6 pb-16">
          <UsedByStrip className="mt-12 sm:mt-24" />
          <ReviewsStrip className="mt-10 sm:mt-16" />
          <Community />
          <Footer />
        </div>
      </div>
      <VersionPill variant={variant} />
    </>
  )
}
