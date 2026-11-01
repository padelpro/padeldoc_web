// Shared Marketplace links (Kevin 1 Nov 2026): thepadeldoc.com/community/market/l/<id> shows a preview in WhatsApp and
// Facebook. The edge function (netlify/edge-functions/market-listing.ts) asks the Worker for the listing's card
// (padel-share-api market.js listingCard: title, kind, price, condition, county, country, status and photos, nothing
// about the seller) and puts og: and twitter: tags into the player bundle's page. These are the pure parts. The page's
// own copy is padel-coach-src data/market_copy.json; these few lines are for the preview only.

export const WORKER = 'https://padel-share.padel-coach.workers.dev'
export const ID_RE = /^[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{6}$/

export type Card = {
  id: string
  title: string
  kind: string
  wanted: boolean
  price: { cents: number; currency: string } | null
  condition: string | null
  county: string | null
  country: string
  status: string
  photos: string[]
}

const CONDITIONS: Record<string, string> = { new: 'New', like_new: 'Like new', good: 'Good', fair: 'Fair' }
const COUNTRIES: Record<string, string> = { IE: 'Ireland', UK: 'UK' }
const SYMBOL: Record<string, string> = { EUR: '€', GBP: '£' }
const SITE = 'Padel Doc Marketplace'

// The listing id in a /community/market/l/<id> path, or null.
export function listingIdOf(pathname: string): string | null {
  const m = /^\/community\/market\/l\/([A-Za-z0-9]+)\/?$/.exec(pathname)
  return m && ID_RE.test(m[1]) ? m[1] : null
}

// "€80", "£95.50", "" with no price.
export function priceText(p: Card['price']): string {
  if (!p || typeof p.cents !== 'number') return ''
  const whole = p.cents % 100 === 0
  return `${SYMBOL[p.currency] || ''}${whole ? String(p.cents / 100) : (p.cents / 100).toFixed(2)}`
}

// What the preview says: { title, description, image }. "StarVie Radar 2024 · €80" and "Good · Dublin, Ireland".
export function cardTags(c: Card): { title: string; description: string; image: string | null } {
  const price = priceText(c.price)
  const sold = c.status === 'sold'
  const title = c.wanted
    ? ['Wanted: ' + c.title, price ? 'up to ' + price : ''].filter(Boolean).join(' · ')
    : [c.title, sold ? 'Sold' : price].filter(Boolean).join(' · ')
  const place = [c.county, COUNTRIES[c.country] || c.country].filter(Boolean).join(', ')
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
