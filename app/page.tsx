import { Community, Footer, SiteHeader } from './site-parts'
import UsageCounter from './usage-counter'
import UsedByStrip from './used-by-strip'
import ReviewsStrip from './reviews-strip'
import { SignedInLine } from './signed-in-header'

// The homepage (Kevin 26 Oct 2026): one question, a pill per role, then a section per role with its main tool, what it
// does in a few ticks and one button, with the free line under it. Each role has its colour: player copper, coach
// blue, club green. Class names are written out in full so Tailwind finds them. Every tool is listed on /tools (the
// footer's All tools).
// Said once under the question, so it shows before any scrolling, and again under each role's button.
const FREE = 'Free. Every feature included.'

const roles = [
  {
    id: 'player', pill: 'Player', heading: 'For players',
    line: 'Keep your matches, see your stats and link up with your coach.',
    shot: '/shots/tagger.png', phoneShot: '/shots/phone-player.png', shotAlt: 'The Match Tagger',
    ticks: ['Watch your matches back', 'See where points are won and lost', 'Messages, clips and homework from your coach', 'Your stats over time', 'Set up your racket'],
    cta: { label: 'Set up a player account', href: '/me/join' },
    text: 'text-accent', fill: 'bg-accent', pillCls: 'border-accent text-accent hover:bg-accent',
  },
  {
    id: 'coach', pill: 'Coach', heading: 'For coaches',
    line: 'Give each player a private page with notes, homework, stats and clips.',
    shot: '/shots/player.png', phoneShot: '/shots/phone-coach.png', shotAlt: 'The coach page',
    ticks: ['A private page per player', 'Video analysis and tagging', 'Messages, voice notes and clips', 'Lesson booking and RSVP', 'Daily lesson email'],
    cta: { label: 'Set up a coach account', href: '/coach/join' },
    text: 'text-accent-2', fill: 'bg-accent-2', pillCls: 'border-accent-2 text-accent-2 hover:bg-accent-2',
  },
  {
    id: 'club', pill: 'Club', heading: 'For clubs',
    line: 'Run box leagues, Americanos and Mexicanos, and score matches people can follow live.',
    shot: '/shots/box-league.png', phoneShot: '/shots/phone-club.png', shotAlt: 'Box League',
    ticks: ['Box leagues drawn and scored for you', 'Americanos and Mexicanos', 'Live scoreboard links', 'Member import from a spreadsheet', 'Live results and tables online'],
    cta: { label: 'Set up a club account', href: '/club/join' },
    text: 'text-accent-3', fill: 'bg-accent-3', pillCls: 'border-accent-3 text-accent-3 hover:bg-accent-3',
  },
]

export default function Home() {
  return (
    <>
      <SiteHeader />
      <div className="min-h-screen mx-auto max-w-6xl px-6">
        <UsageCounter className="pt-4" />

        <section className="pt-12 pb-4">
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
        </section>

        {roles.map((r) => (
          <section key={r.id} id={r.id} aria-labelledby={`${r.id}-heading`} className="mt-12 pt-10 sm:mt-20 sm:pt-16 border-t border-edge scroll-mt-6">
            <h2 id={`${r.id}-heading`} className={`text-4xl sm:text-5xl font-bold tracking-tight ${r.text}`}>{r.heading}</h2>
            <p className="mt-4 text-xl text-text/85 leading-relaxed max-w-prose">{r.line}</p>
            <div className="mt-6 sm:mt-10 rounded-xl border border-edge bg-panel-2 overflow-hidden shadow-[0_40px_80px_-40px_color-mix(in_srgb,var(--color-shade)_45%,transparent)]">
              {/* The desktop shots are all 1440 x 900: the size reserves the space, so a pill's jump lands before they load.
                  Under 640px a light phone shot (780 x 1400, a 390px-wide phone at 2x) takes its place, capped at 70vh. */}
              <picture>
                <source media="(max-width: 639px)" srcSet={r.phoneShot} width={780} height={1400} />
                <img src={r.shot} alt={r.shotAlt} width={1440} height={900}
                  className="w-full h-auto max-sm:max-h-[70vh] max-sm:object-cover max-sm:object-top" />
              </picture>
            </div>
            <ul className="mt-6 sm:mt-10 grid gap-x-10 gap-y-3 sm:grid-cols-2">
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
          </section>
        ))}

        <UsedByStrip className="mt-12 sm:mt-24" />
        <ReviewsStrip className="mt-10 sm:mt-16" />
        <Community />
        <Footer />
      </div>
    </>
  )
}
