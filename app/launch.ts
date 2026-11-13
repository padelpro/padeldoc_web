// The launch landing page's pure parts (padel-coach-src specs/launch-1-scope.md, Kevin 13 Nov 2026). PURE, in a .ts file
// so Node's test runner can load it (usage-sentence.ts says why); tested in launch.test.ts. The page is launch-page.tsx.

// The headline shown: _copy/launch.json's "headline" is its number, 1 to 4. Anything else: the first.
export function headlineOf(copy: { headline?: unknown; headlines?: unknown }): string {
  const all = Array.isArray(copy.headlines) ? copy.headlines.filter((h): h is string => typeof h === 'string' && !!h.trim()) : []
  const n = typeof copy.headline === 'number' && Number.isInteger(copy.headline) ? copy.headline : 1
  return all[n - 1] || all[0] || ''
}

// The coming-soon names an email can be left for.
export const SOON_TOPICS = ['training', 'academy', 'community'] as const
export type SoonTopic = (typeof SOON_TOPICS)[number]
export const isSoonTopic = (v: unknown): v is SoonTopic => typeof v === 'string' && (SOON_TOPICS as readonly string[]).includes(v)

// An email worth sending to the Worker: one @, something either side, a dot in the host, no spaces, 254 at most.
export function emailOk(v: unknown): boolean {
  if (typeof v !== 'string') return false
  const e = v.trim()
  return e.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
}

// What the "Tell me when it's ready" box sends: { topic, email }, or null when either isn't right.
export function soonBody(topic: unknown, email: unknown): { topic: SoonTopic; email: string } | null {
  if (!isSoonTopic(topic) || !emailOk(email)) return null
  return { topic, email: (email as string).trim().toLowerCase() }
}

// "Tell me when {name} is ready" with the name in.
export const withName = (words: string, name: string): string => String(words || '').replace('{name}', name)
