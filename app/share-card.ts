// Shared links (Kevin 14 Nov 2026; padel-coach-src specs/share-outside-spec.md 3 and 10; padel-share-api 0121,
// shareLinks.js): thepadeldoc.com/s/<code> shows the player's card in WhatsApp, Messages, Facebook and X. The edge
// function (netlify/edge-functions/share-card.ts) asks the Worker for the share (its facts and the paths of its square
// card and its wide 1200 x 630 preview, nothing about the account) and puts og: and twitter: tags into the player
// bundle's page, the wide image as the preview. Every /s/ page is noindex (answer 8), the Worker slow or down included.
// A link taken down gets the site's plain preview. These are the pure parts.

import { workerFrom, edgeEnv, WORKER_VAR } from './worker-default.ts'

export const WORKER = workerFrom(edgeEnv(WORKER_VAR))
export const CODE_RE = /^[A-Za-z0-9]{10}$/
export const ROBOTS = 'noindex'

export type Share = { code: string; line: string; facts: { type?: string; top?: string | null; headline?: string | null; score?: string | null }; wide: string; card: string }

// The code in a /s/<code> path, or null.
export function shareCodeOf(pathname: string): string | null {
  const m = /^\/s\/([A-Za-z0-9]+)\/?$/.exec(pathname)
  return m && CODE_RE.test(m[1]) ? m[1] : null
}

// A share from the Worker's answer, or null if it doesn't look like one (or it was taken down: 410).
export function readShare(body: unknown): Share | null {
  if (!body || typeof body !== 'object') return null
  const x = body as Share
  if (typeof x.code !== 'string' || !CODE_RE.test(x.code) || typeof x.line !== 'string' || !x.facts || typeof x.facts !== 'object') return null
  const path = (p: unknown) => (typeof p === 'string' && /^\/v1\/shares\/[A-Za-z0-9]{10}\/(card|wide)(-plain)?$/.test(p) ? p : '')
  if (!path(x.wide) || !path(x.card)) return null
  return { code: x.code, line: x.line.slice(0, 200), facts: x.facts, wide: path(x.wide), card: path(x.card) }
}

// What the preview says: "Won 6-4 4-6 6-3" and "Padel match · Us v Them · 1 h 32 · Sat 7 Nov", the wide image.
export function shareTags(s: Share): { title: string; description: string; image: string } {
  const f = s.facts || {}
  const title = f.type === 'review' ? String(f.top || 'Technique review') : [f.headline, f.score].filter(Boolean).join(' ') || String(f.top || 'Padel')
  const rest = s.line.startsWith(title) ? s.line.slice(title.length).replace(/^ · /, '') : s.line
  return { title, description: rest || 'The Padel Doc', image: WORKER + s.wide }
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// The <meta> tags, one string: robots always; with a share, the preview's too.
export function metaTags(s: Share | null, url: string): string {
  const tags: [string, string, string][] = [['name', 'robots', ROBOTS]]
  if (s) {
    const t = shareTags(s)
    tags.push(['property', 'og:title', t.title], ['property', 'og:description', t.description], ['property', 'og:type', 'website'], ['property', 'og:url', url],
      ['property', 'og:site_name', 'The Padel Doc'], ['property', 'og:image', t.image], ['property', 'og:image:width', '1200'], ['property', 'og:image:height', '630'],
      ['property', 'og:image:alt', s.line], ['name', 'twitter:card', 'summary_large_image'], ['name', 'twitter:title', t.title],
      ['name', 'twitter:description', t.description], ['name', 'twitter:image', t.image])
  }
  return tags.map(([a, k, v]) => `<meta ${a}="${k}" content="${esc(v)}" />`).join('\n')
}

// The page with the tags put in before </head>. A page with no </head> is left as it was.
export function withTags(html: string, tags: string): string {
  const i = html.search(/<\/head>/i)
  return i < 0 ? html : html.slice(0, i) + tags + '\n' + html.slice(i)
}
