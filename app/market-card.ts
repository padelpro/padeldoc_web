// Shared Marketplace links (Kevin 1 Nov 2026): thepadeldoc.com/community/market/l/<id> shows a preview in WhatsApp and
// Facebook. The edge function (netlify/edge-functions/market-listing.ts) asks the Worker for the listing's card
// (padel-share-api market.js listingCard: title, kind, price, condition, region, country, status and photos, nothing
// about the seller) and puts og: and twitter: tags into the player bundle's page. These are the pure parts. The page's
// own copy is padel-coach-src data/market_copy.json; these few lines are for the preview only.

import { workerFrom, edgeEnv, WORKER_VAR } from './worker-default.ts'

// The Worker: production's, or the demo's on the demo site (app/worker-default.ts; this file runs in the edge function
// and under node's tests, never in a page).
export const WORKER = workerFrom(edgeEnv(WORKER_VAR))
export const ID_RE = /^[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{6}$/

export type Card = {
  id: string
  title: string
  kind: string
  wanted: boolean
  price: { cents: number; currency: string } | null
  condition: string | null
  region?: string | null   // 0055: the seller's region or city
  county?: string | null   // the same, as a Worker from before 0055 calls it
  country: string
  status: string
  photos: string[]
}

const CONDITIONS: Record<string, string> = { new: 'New', like_new: 'Like new', good: 'Good', fair: 'Fair' }
const SITE = 'Padel Doc Marketplace'

// The listing id in a /community/market/l/<id> path, or null.
export function listingIdOf(pathname: string): string | null {
  const m = /^\/community\/market\/l\/([A-Za-z0-9]+)\/?$/.exec(pathname)
  return m && ID_RE.test(m[1]) ? m[1] : null
}

// Any country and any currency (0055, Kevin 2 Nov 2026). A preview is read by WhatsApp's or Facebook's crawler, whose
// reader isn't known, so it's in English like the rest of its words: the country's English name, the price in the
// seller's currency.

// "€80", "£95.50", "SEK 1,500", "" with no price.
export function priceText(p: Card['price']): string {
  if (!p || typeof p.cents !== 'number') return ''
  const n = p.cents / 100
  try {
    return new Intl.NumberFormat('en', { style: 'currency', currency: p.currency, currencyDisplay: 'symbol',
      minimumFractionDigits: n % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 }).format(n)
  } catch { return `${p.currency || ''} ${n}`.trim() }
}

// "Ireland", "United Kingdom" (UK from a Worker before 0055 too), the code itself if it can't be named.
export function countryName(code: string): string {
  const c = code === 'UK' ? 'GB' : code
  try { return new Intl.DisplayNames(['en'], { type: 'region' }).of(c) || c } catch { return c }
}

// What the preview says: { title, description, image }. "StarVie Radar 2024 · €80" and "Good · Madrid, Spain".
export function cardTags(c: Card): { title: string; description: string; image: string | null } {
  const price = priceText(c.price)
  const sold = c.status === 'sold'
  const title = c.wanted
    ? ['Wanted: ' + c.title, price ? 'up to ' + price : ''].filter(Boolean).join(' · ')
    : [c.title, sold ? 'Sold' : price].filter(Boolean).join(' · ')
  const place = [c.region || c.county, c.country ? countryName(c.country) : ''].filter(Boolean).join(', ')
  const description = sold ? 'This item has sold.' : [c.condition ? CONDITIONS[c.condition] || '' : '', place].filter(Boolean).join(' · ') || SITE
  const first = c.photos && c.photos[0]
  return { title, description, image: first ? WORKER + first : null }
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// The <meta> tags for a card, one string.
export function metaTags(c: Card, url: string): string {
  const t = cardTags(c)
  const tags: [string, string, string][] = [
    ['property', 'og:title', t.title],
    ['property', 'og:description', t.description],
    ['property', 'og:type', 'website'],
    ['property', 'og:url', url],
    ['property', 'og:site_name', SITE],
    ...(t.image ? [['property', 'og:image', t.image] as [string, string, string]] : []),
    ['name', 'twitter:card', t.image ? 'summary_large_image' : 'summary'],
    ['name', 'twitter:title', t.title],
    ['name', 'twitter:description', t.description],
    ...(t.image ? [['name', 'twitter:image', t.image] as [string, string, string]] : []),
  ]
  return tags.map(([a, k, v]) => `<meta ${a}="${k}" content="${esc(v)}" />`).join('\n')
}

// The page with the tags put in before </head>. A page with no </head> is left as it was.
export function withTags(html: string, tags: string): string {
  const i = html.search(/<\/head>/i)
  return i < 0 ? html : html.slice(0, i) + tags + '\n' + html.slice(i)
}

// A card from the Worker's answer, or null if it doesn't look like one.
export function readCard(body: unknown): Card | null {
  const c = body && typeof body === 'object' ? (body as { card?: unknown }).card : null
  if (!c || typeof c !== 'object') return null
  const x = c as Card
  if (typeof x.id !== 'string' || typeof x.title !== 'string' || typeof x.status !== 'string') return null
  return { ...x, photos: Array.isArray(x.photos) ? x.photos.filter((p) => typeof p === 'string' && p.startsWith('/v1/market/photos/')) : [] }
}
