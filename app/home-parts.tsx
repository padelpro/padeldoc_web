import copy from './_copy/home.json'

// The home page's journey parts (J2, padel-coach-src specs/player-journey-spec.md 1, Kevin 8 Nov 2026): the two promise
// blocks under the hero, the "what you get" tool row in the player and coach sections, and the pillars band. Every word
// is in _copy/home.json. Class names are written out in full so Tailwind finds them.

type Role = 'coach' | 'player'
const ROLE = {
  coach: { text: 'text-accent-2', fill: 'bg-accent-2', border: 'border-accent-2/40', href: '/coach/join',
    tint: 'bg-[color-mix(in_srgb,var(--color-accent-2)_8%,var(--color-panel))]' },
  player: { text: 'text-accent', fill: 'bg-accent', border: 'border-accent/40', href: '/me/join',
    tint: 'bg-[color-mix(in_srgb,var(--color-accent)_8%,var(--color-panel))]' },
}

// Kevin's own photos, one per block, as the background (spec 1.2: real sessions, everyone's written OK, no stock and no
// AI images). TODO(Kevin): put each in public/photos/ and its path here; until then the block is a plain tint, with a
// marked box in development only so nobody forgets.
const PHOTOS: Record<Role, { src: string; alt: string } | null> = { coach: null, player: null }
const DEV = process.env.NODE_ENV !== 'production'

export function PromiseBlocks({ className = '' }: { className?: string }) {
  return (
    <div className={`grid gap-4 sm:grid-cols-2 ${className}`}>
      {(['coach', 'player'] as const).map((id) => {
        const p = copy.promises[id], look = ROLE[id], photo = PHOTOS[id]
        return (
          <div key={id} data-promise={id} className={`relative overflow-hidden rounded-xl border ${look.border} ${look.tint} p-6 sm:p-8 flex flex-col gap-4`}>
            {photo && <>
              <img src={photo.src} alt={photo.alt} className="absolute inset-0 h-full w-full object-cover" />
              <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent,color-mix(in_srgb,var(--color-bg)_85%,transparent))]" />
            </>}
            {!photo && DEV && (
              <div data-photo-todo className="rounded-lg border-2 border-dashed border-edge bg-panel-2 px-4 py-6 text-center font-mono text-sm text-muted">
                {copy.promises.photoTodo} (dev only)
              </div>
            )}
            <div className="relative">
              <p className={`text-sm font-semibold uppercase tracking-[0.12em] ${look.text}`}>{p.label}</p>
              <p className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight leading-tight">{p.line}</p>
            </div>
            <a href={look.href} className={`relative self-start inline-block rounded-lg px-6 py-3 text-base font-semibold text-on-accent hover:brightness-110 ${look.fill}`}>{p.cta}</a>
          </div>
        )
      })}
    </div>
  )
}

type Tile = { id: string; name: string; href: string | Record<Role, string>; shot: string | null; coach: string; player: string }

// Six tiles: on a phone a row to swipe, from sm up three by two. Each opens the tool's own page (Load and wellness and
// Gym have none yet: the role's page).
export function ToolRow({ role, className = '' }: { role: Role; className?: string }) {
  const look = ROLE[role]
  const tiles = copy.toolRow.tiles as Tile[]
  return (
    <div className={className}>
      <p className={`text-sm font-semibold uppercase tracking-[0.12em] ${look.text}`}>{copy.toolRow.label}</p>
      <ul data-tool-row={role} className="mt-4 -mx-6 px-6 flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-px-6 pb-2 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:pb-0">
        {tiles.map((t) => (
          <li key={t.id} className="snap-start shrink-0 w-[78%] sm:w-auto">
            <a href={typeof t.href === 'string' ? t.href : t.href[role]}
              className="group block h-full rounded-xl border border-edge bg-panel overflow-hidden hover:border-text/40">
              {t.shot
                ? <img src={t.shot} alt="" width={1440} height={900} loading="lazy" className="block w-full aspect-[16/10] object-cover object-top bg-panel-2" />
                : <div className="w-full aspect-[16/10] bg-panel-2 grid place-items-center font-mono text-xs text-muted">{copy.toolRow.noShot}</div>}
              <div className="p-4">
                <p className={`font-semibold ${look.text}`}>{t.name}</p>
                <p className="mt-1 text-text/85 leading-snug">{t[role]}</p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

// The six pillars (spec 5), each naming the tools under it.
export function PillarsBand() {
  return (
    <section aria-labelledby="pillars-heading" className="bg-panel-2 border-y border-edge py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 id="pillars-heading" className="text-3xl sm:text-4xl font-bold tracking-tight">{copy.pillars.line}</h2>
        <ul className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {copy.pillars.tiles.map((p) => (
            <li key={p.id} data-pillar={p.id} className="rounded-xl border border-edge bg-panel p-4 sm:p-5">
              <p className="text-lg font-bold">{p.name}</p>
              <p className="mt-1 text-text/85 leading-snug">{p.line}</p>
              <p className="mt-3 text-sm text-muted leading-snug">{p.tools}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
