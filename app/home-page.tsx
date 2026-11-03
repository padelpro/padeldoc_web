import { Community, Footer, SiteHeader } from './site-parts'
import UsageNumbers from './usage-numbers'
import UsedByStrip from './used-by-strip'
import ReviewsStrip from './reviews-strip'
import PhoneFrame from './phone-frame'
import Reveal from './reveal'
import copy from './_copy/home.json'

// The homepage (Kevin 26 Oct 2026): one question, a pill per role, then a section per role with its main tool, what it
// does in a few ticks, its button and Learn more (its own page, /players, /coaches or /clubs). Each role has its colour: player copper, coach
// blue, club green. Class names are written out in full so Tailwind finds them. Every tool is listed on /tools (the
// footer's All tools).
//
// Mobile uplift (Kevin 27 Oct 2026, version B of the A/B preview): a phone beside the hero, the usage numbers under it,
// dark phone shots in a phone frame on phones, a soft band of each role's colour behind its section and a gentle reveal
// on scroll.

// The words are in _copy/home.json (Kevin 2 Nov 2026: the free line and "Signed in as" went, a line about the community
// went under the question, each role got a Learn more link to its own page and new ticks). The shots and colours are here.
const looks = {
  player: {
    shot: '/shots/tagger.png', phoneShot: '/shots/phone-dark-player.png',
    shotAlt: 'The Match Tagger', phoneAlt: "A player's home page on a phone",
    href: '/me/join', more: '/players',
    text: 'text-accent', fill: 'bg-accent', pillCls: 'border-accent text-accent hover:bg-accent',
    outline: 'border-accent text-accent hover:bg-accent',
    band: 'bg-[color-mix(in_srgb,var(--color-accent)_6%,var(--color-bg))]',
  },
  coach: {
    shot: '/shots/player.png', phoneShot: '/shots/phone-dark-coach.png',
    shotAlt: 'The coach page', phoneAlt: "A player's ratings on the coach page, on a phone",
    href: '/coach/join', more: '/coaches',
    text: 'text-accent-2', fill: 'bg-accent-2', pillCls: 'border-accent-2 text-accent-2 hover:bg-accent-2',
    outline: 'border-accent-2 text-accent-2 hover:bg-accent-2',
    band: 'bg-[color-mix(in_srgb,var(--color-accent-2)_5%,var(--color-bg))]',
  },
  club: {
    shot: '/shots/box-league.png', phoneShot: '/shots/phone-dark-club.png',
    shotAlt: 'Box League', phoneAlt: 'A box league on a phone',
    href: '/club/join', more: '/clubs',
    text: 'text-accent-3', fill: 'bg-accent-3', pillCls: 'border-accent-3 text-accent-3 hover:bg-accent-3',
    outline: 'border-accent-3 text-accent-3 hover:bg-accent-3',
    band: 'bg-[color-mix(in_srgb,var(--color-accent-3)_6%,var(--color-bg))]',
  },
}

const roles = (['player', 'coach', 'club'] as const).map((id) => ({ id, ...copy.roles[id], ...looks[id] }))

export default function HomePage() {
  return (
    <>
      <SiteHeader big />
      <div className="min-h-screen">
        <div className="mx-auto max-w-6xl px-6">
          <section className="pt-12 pb-4 md:grid md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-12">
            <div>
              <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.02] max-w-4xl">
                Are you a <span className="text-accent">player</span>, a <span className="text-accent-2">coach</span> or
                a <span className="text-accent-3">club</span>?
              </h1>
              <p className="mt-5 text-xl text-text/85 leading-relaxed max-w-2xl">{copy.subline}</p>
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
            className={`${i === 0 ? 'mt-12 sm:mt-16 ' : ''}${r.band} py-14 sm:py-20`}>
            <div className="mx-auto max-w-6xl px-6">
              <div>
                <h2 id={`${r.id}-heading`} className={`text-4xl sm:text-5xl font-bold tracking-tight ${r.text}`}>{r.heading}</h2>
                <p className="mt-4 text-xl text-text/85 leading-relaxed max-w-prose">{r.line}</p>
                <Reveal>
                  {/* Phones: a dark phone shot in the CSS phone frame. sm and up: the 1440 x 900 desktop shot, as before. */}
                  <PhoneFrame src={r.phoneShot} alt={r.phoneAlt} className="sm:hidden mt-8 mx-auto w-[300px] max-w-full" />
                  <div className="hidden sm:block mt-10 rounded-xl border border-edge bg-panel-2 overflow-hidden shadow-[0_40px_80px_-40px_color-mix(in_srgb,var(--color-shade)_45%,transparent)]">
                    <img src={r.shot} alt={r.shotAlt} width={1440} height={900} loading="lazy" className="w-full h-auto" />
                  </div>
                </Reveal>
                <ul className="mt-8 sm:mt-10 grid gap-x-10 gap-y-3 sm:grid-cols-2">
                  {r.ticks.map((t) => (
                    <li key={t} className="flex gap-3 text-lg">
                      <span className={`font-mono font-bold ${r.text}`} aria-hidden="true">&#10003;</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 sm:mt-10 flex flex-wrap gap-3">
                  <a href={r.href} className={`inline-block rounded-lg border-2 border-transparent px-7 py-[14px] text-lg font-semibold text-on-accent hover:brightness-110 ${r.fill}`}>{r.cta}</a>
                  <a href={r.more} className={`inline-block rounded-lg border-2 bg-transparent px-7 py-[14px] text-lg font-semibold hover:text-on-accent ${r.outline}`}>{copy.learnMore}</a>
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
    </>
  )
}
