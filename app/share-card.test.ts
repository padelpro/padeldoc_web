// Unit tests for shared card links (/s/<code>): the preview tags, noindex always, and the edge function. Run with `npm test`.
import test from 'node:test'
import assert from 'node:assert/strict'
import { shareCodeOf, readShare, shareTags, metaTags, withTags, WORKER } from './share-card.ts'
import edge, { config } from '../netlify/edge-functions/share-card.ts'
import { readFileSync } from 'node:fs'

const SHARE = { code: 'Ab3dE6gH9k', line: 'Won 6-4 4-6 6-3 · Padel match · Us v Them · 1 h 32 · Sat 7 Nov', photo: false, createdAt: '2026-11-07T12:00:00.000Z',
  facts: { type: 'match', headline: 'Won', top: 'Won', score: '6-4 4-6 6-3', kind: 'Padel match', who: 'Us v Them', length: '1 h 32', day: 'Sat 7 Nov', effort: null },
  card: '/v1/shares/Ab3dE6gH9k/card', wide: '/v1/shares/Ab3dE6gH9k/wide' }
const PAGE = '<!doctype html><html><head><meta charset="utf-8" /><title>Padel Doc</title></head><body><div id="root"></div></body></html>'
const content = (html: string, key: string) => {
  const m = new RegExp(`<meta (?:property|name)="${key.replace(/[:.]/g, '\\$&')}" content="([^"]*)" />`).exec(html)
  return m ? m[1] : null
}

test('the share path: /s/<code>, ten letters and digits', () => {
  assert.equal(shareCodeOf('/s/Ab3dE6gH9k'), 'Ab3dE6gH9k')
  assert.equal(shareCodeOf('/s/Ab3dE6gH9k/'), 'Ab3dE6gH9k')
  assert.equal(shareCodeOf('/s/short'), null)
  assert.equal(shareCodeOf('/s/Ab3dE6gH9k/x'), null)
  assert.equal(shareCodeOf('/p/Ab3dE6gH9k'), null)
  assert.equal(config.path, '/s/*')
})

test('the preview: the result and score, the rest of the line, the wide image; a review by its title', () => {
  const s = readShare(SHARE)!
  assert.deepEqual(shareTags(s), { title: 'Won 6-4 4-6 6-3', description: 'Padel match · Us v Them · 1 h 32 · Sat 7 Nov', image: WORKER + '/v1/shares/Ab3dE6gH9k/wide' })
  const r = readShare({ ...SHARE, line: 'Bandeja · Technique review · Eoin · Sat 7 Nov', facts: { type: 'review', top: 'Bandeja' } })!
  assert.deepEqual([shareTags(r).title, shareTags(r).description], ['Bandeja', 'Technique review · Eoin · Sat 7 Nov'])
  // After a report, the plain images.
  assert.equal(readShare({ ...SHARE, wide: '/v1/shares/Ab3dE6gH9k/wide-plain', card: '/v1/shares/Ab3dE6gH9k/card-plain' })!.wide, '/v1/shares/Ab3dE6gH9k/wide-plain')
  // Not a share: refused.
  for (const bad of [null, {}, { ...SHARE, code: 'x' }, { ...SHARE, wide: 'https://elsewhere.test/x.png' }, { gone: true }]) assert.equal(readShare(bad), null)
  const tags = metaTags(s, 'https://thepadeldoc.com/s/Ab3dE6gH9k')
  assert.equal(content(tags, 'robots'), 'noindex')
  assert.equal(content(tags, 'og:image:width'), '1200')
  assert.equal(content(tags, 'twitter:card'), 'summary_large_image')
  assert.equal(content(tags, 'og:url'), 'https://thepadeldoc.com/s/Ab3dE6gH9k')
  assert.equal(metaTags(null, 'x'), '<meta name="robots" content="noindex" />', 'no share: noindex alone')
  assert.ok(!/Ab3dE6gH9k.*@|email|profile/i.test(tags), 'no account, no profile link')
  assert.equal(withTags('<html><body></body></html>', tags), '<html><body></body></html>')
})

async function run(path: string, worker: () => Response | Promise<Response>) {
  const realFetch = globalThis.fetch
  const asked: string[] = []
  globalThis.fetch = (async (u: string) => { asked.push(String(u)); return worker() }) as typeof fetch
  try {
    const page = new Response(PAGE, { headers: { 'content-type': 'text/html; charset=utf-8', 'content-length': String(PAGE.length) } })
    const res = await edge(new Request(`https://thepadeldoc.com${path}`), { next: async () => page })
    return { res, asked, html: await res.text() }
  } finally { globalThis.fetch = realFetch }
}

test('the edge function: the tags from the share; noindex always, the Worker down or the link taken down', async () => {
  const ok = await run('/s/Ab3dE6gH9k', () => new Response(JSON.stringify(SHARE), { status: 200, headers: { 'content-type': 'application/json' } }))
  assert.deepEqual(ok.asked, [`${WORKER}/v1/shares/Ab3dE6gH9k`])
  assert.equal(ok.res.headers.get('x-robots-tag'), 'noindex')
  assert.equal(content(ok.html, 'og:title'), 'Won 6-4 4-6 6-3')
  assert.equal(content(ok.html, 'robots'), 'noindex')
  assert.equal(ok.res.headers.get('content-length'), null)
  const gone = await run('/s/Ab3dE6gH9k', () => new Response('{"gone":true}', { status: 410 }))
  assert.equal(gone.res.headers.get('x-robots-tag'), 'noindex')
  assert.equal(content(gone.html, 'og:title'), null, 'taken down: the plain preview')
  assert.equal(content(gone.html, 'robots'), 'noindex')
  const down = await run('/s/Ab3dE6gH9k', () => { throw new Error('down') })
  assert.equal(content(down.html, 'robots'), 'noindex')
  const odd = await run('/s/nope', () => { throw new Error('never asked') })
  assert.deepEqual(odd.asked, [])
  assert.equal(content(odd.html, 'robots'), 'noindex')
})

test('netlify.toml: /s/* is the player bundle, never cached stale, noindex; s is one of the site\'s own paths', () => {
  const toml = readFileSync(new URL('../netlify.toml', import.meta.url), 'utf8')
  assert.match(toml, /from = "\/s\/\*"\s+to = "\/player\/index.html"\s+status = 200/)
  assert.match(toml, /for = "\/s\/\*"\s+\[headers\.values\]\s+Cache-Control = "no-cache"\s+X-Robots-Tag = "noindex"/)
})
