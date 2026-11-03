// Unit tests for shared Marketplace links: the preview tags and the edge function. Run with `npm test`.
import test from 'node:test'
import assert from 'node:assert/strict'
import { listingIdOf, cardTags, metaTags, withTags, readCard, WORKER, type Card } from './market-card.ts'
import edge, { config } from '../netlify/edge-functions/market-listing.ts'

const CARD: Card = { id: 'ABC234', title: 'StarVie Radar 2024', kind: 'racket', wanted: false, price: { cents: 8000, currency: 'EUR' },
  condition: 'good', region: 'Dublin', county: 'Dublin', country: 'IE', status: 'active', photos: ['/v1/market/photos/abcdefghijk1', '/v1/market/photos/abcdefghijk2'] }
const PAGE = '<!doctype html><html><head><meta charset="utf-8" /><title>Padel Doc Coach</title></head><body><div id="root"></div></body></html>'
const content = (html: string, key: string) => {
  const m = new RegExp(`<meta (?:property|name)="${key.replace(/[:.]/g, '\\$&')}" content="([^"]*)" />`).exec(html)
  return m ? m[1] : null
}

test('the listing path: /community/market/l/<id> only, a real listing id', () => {
  assert.equal(listingIdOf('/community/market/l/ABC234'), 'ABC234')
  assert.equal(listingIdOf('/community/market/l/ABC234/'), 'ABC234')
  for (const p of ['/community/market', '/community/market/l/abc234', '/community/market/l/ABC10', '/community/market/l/ABC234/x', '/community/market/edit/ABC234'])
    assert.equal(listingIdOf(p), null, p)
  assert.equal(config.path, '/community/market/l/*')
})

test('what the preview says: title and price, condition and town, the first photo', () => {
  assert.deepEqual(cardTags(CARD), { title: 'StarVie Radar 2024 · €80', description: 'Good · Dublin, Ireland', image: `${WORKER}/v1/market/photos/abcdefghijk1` })
  assert.equal(cardTags({ ...CARD, price: { cents: 9550, currency: 'GBP' }, country: 'GB', region: null, county: null }).title, 'StarVie Radar 2024 · £95.50')
  assert.equal(cardTags({ ...CARD, region: null, county: null }).description, 'Good · Ireland')
  // any country and currency (0055)
  assert.equal(cardTags({ ...CARD, region: 'Madrid', country: 'ES' }).description, 'Good · Madrid, Spain')
  assert.equal(cardTags({ ...CARD, region: null, county: null, country: 'GB' }).description, 'Good · United Kingdom')
  assert.equal(cardTags({ ...CARD, region: null, county: null, country: 'UK' }).description, 'Good · United Kingdom', 'a Worker before 0055')
  assert.equal(cardTags({ ...CARD, region: null, county: 'Kildare' }).description, 'Good · Kildare, Ireland', "a Worker before 0055's county")
  assert.equal(cardTags({ ...CARD, price: { cents: 150000, currency: 'SEK' } }).title, 'StarVie Radar 2024 · SEK 1,500')
  assert.equal(cardTags({ ...CARD, price: { cents: 350000, currency: 'MXN' } }).title, 'StarVie Radar 2024 · MX$3,500')
  const sold = cardTags({ ...CARD, status: 'sold', price: null })
  assert.deepEqual([sold.title, sold.description], ['StarVie Radar 2024 · Sold', 'This item has sold.'])
  assert.equal(cardTags({ ...CARD, wanted: true, condition: null, price: null }).title, 'Wanted: StarVie Radar 2024')
  assert.equal(cardTags({ ...CARD, wanted: true, condition: null }).title, 'Wanted: StarVie Radar 2024 · up to €80')
  assert.equal(cardTags({ ...CARD, photos: [] }).image, null)
  for (const t of Object.values(cardTags(CARD))) assert.ok(!String(t).includes('—'), 'no em dashes')
})

test('the tags: og:title, og:description, og:image and twitter:card, escaped, before </head>', () => {
  const html = withTags(PAGE, metaTags(CARD, 'https://thepadeldoc.com/community/market/l/ABC234'))
  assert.equal(content(html, 'og:title'), 'StarVie Radar 2024 · €80')
  assert.equal(content(html, 'og:description'), 'Good · Dublin, Ireland')
  assert.equal(content(html, 'og:image'), `${WORKER}/v1/market/photos/abcdefghijk1`)
  assert.equal(content(html, 'og:url'), 'https://thepadeldoc.com/community/market/l/ABC234')
  assert.equal(content(html, 'twitter:card'), 'summary_large_image')
  assert.ok(html.indexOf('og:title') < html.indexOf('</head>'))
  assert.ok(html.includes('<div id="root"></div>'), 'the page is untouched otherwise')
  const nasty = withTags(PAGE, metaTags({ ...CARD, title: 'Bad "quote" <script>x</script> & co' }, 'u'))
  assert.equal(content(nasty, 'og:title'), 'Bad &quot;quote&quot; &lt;script&gt;x&lt;/script&gt; &amp; co · €80')
  assert.ok(!nasty.includes('<script>x'))
  const bare = withTags(PAGE, metaTags({ ...CARD, photos: [] }, 'u'))
  assert.equal(content(bare, 'og:image'), null)
  assert.equal(content(bare, 'twitter:card'), 'summary')
  assert.equal(withTags('<p>no head</p>', 'x'), '<p>no head</p>')
})

test('readCard: only the Worker card shape, only photo paths on the Worker', () => {
  assert.equal(readCard(null), null)
  assert.equal(readCard({ error: 'Not found' }), null)
  assert.deepEqual(readCard({ card: { ...CARD, photos: ['/v1/market/photos/abcdefghijk1', 'https://evil.example/x.jpg'] } })!.photos, ['/v1/market/photos/abcdefghijk1'])
})

// The edge function with Netlify's context.next() and the Worker faked.
async function run(path: string, worker: () => Promise<Response>) {
  const realFetch = globalThis.fetch
  const asked: string[] = []
  globalThis.fetch = (async (u: string) => { asked.push(String(u)); return worker() }) as typeof fetch
  try {
    const page = new Response(PAGE, { headers: { 'content-type': 'text/html; charset=utf-8', 'content-length': String(PAGE.length) } })
    const res = await edge(new Request(`https://thepadeldoc.com${path}`), { next: async () => page })
    return { res, asked, html: res ? await res.text() : null }
  } finally { globalThis.fetch = realFetch }
}

test('the edge function: the tags from the card; the plain page if the Worker is down or the listing is gone', async () => {
  const ok = await run('/community/market/l/ABC234', async () => Response.json({ card: CARD }))
  assert.deepEqual(ok.asked, [`${WORKER}/v1/market/listings/ABC234/card`])
  assert.equal(ok.res!.status, 200)
  assert.equal(ok.res!.headers.get('content-length'), null)
  assert.equal(content(ok.html!, 'og:title'), 'StarVie Radar 2024 · €80')
  assert.equal(content(ok.html!, 'twitter:card'), 'summary_large_image')

  const gone = await run('/community/market/l/ABC234', async () => Response.json({ error: 'Not found' }, { status: 404 }))
  assert.equal(gone.html, PAGE, 'removed or hidden: the plain page')
  const down = await run('/community/market/l/ABC234', async () => { throw new Error('down') })
  assert.equal(down.html, PAGE, 'Worker down: the plain page')
  const junk = await run('/community/market/l/ABC234', async () => new Response('<html>oops', { status: 200 }))
  assert.equal(junk.html, PAGE, 'not JSON: the plain page')

  const other = await run('/community/market/l/nope', async () => Response.json({ card: CARD }))
  assert.equal(other.res, undefined, 'not a listing: left to the site')
  assert.deepEqual(other.asked, [])
})
