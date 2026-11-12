// The demo build (padel-coach-src specs/demo-site-spec.md 10.2; Kevin 12 Nov 2026, D7): which site and which Worker,
// the demo's rules at the edge, robots, Plausible, and that thepadeldoc.com's own files stay as they were.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PRODUCTION_WORKER, DEMO_WORKER, workerFrom, siteFrom, siteConfig, edgeEnv } from './worker-default.ts'
import { demoRule, ROBOTS_HEADER, ROBOTS_VALUE } from './demo-rules.ts'
import { plausibleDomain, robotsFor, DEMO_MOVED, MAIN_SITE, DEMO_HOST } from './site.ts'
import { notice, RIBBON, NOTICE_TITLE } from './_demo/copy.ts'
import demoSite, { config as demoSiteConfig } from '../netlify/demo/demo-site.ts'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p: string) => readFileSync(join(root, p), 'utf8')
const filesUnder = (dir: string): string[] => readdirSync(dir).flatMap((n) => {
  const p = join(dir, n)
  return statSync(p).isDirectory() ? filesUnder(p) : [p]
})

test('the Worker: production with nothing set, the demo only by its exact address, anything else stops', () => {
  assert.equal(workerFrom(undefined), PRODUCTION_WORKER)
  assert.equal(workerFrom(''), PRODUCTION_WORKER)
  assert.equal(workerFrom(PRODUCTION_WORKER), PRODUCTION_WORKER)
  assert.equal(workerFrom(DEMO_WORKER), DEMO_WORKER)
  for (const bad of ['https://padel-share-demo.padel-coach.workers.dev/', 'http://padel-share-demo.padel-coach.workers.dev', 'https://example.com', 'demo', ' ']) {
    assert.throws(() => workerFrom(bad), /NEXT_PUBLIC_PADELDOC_WORKER/, bad)
  }
})

test('the site: padeldoc with nothing set, demo only by "demo"', () => {
  assert.equal(siteFrom(undefined), 'padeldoc')
  assert.equal(siteFrom(''), 'padeldoc')
  assert.equal(siteFrom('demo'), 'demo')
  for (const bad of ['Demo', 'padeldoc', '1', 'true']) assert.throws(() => siteFrom(bad), /PADELDOC_SITE/, bad)
})

test('the pair must agree: no demo site on production\'s Worker, no thepadeldoc.com on the demo\'s', () => {
  assert.deepEqual(siteConfig({}), { site: 'padeldoc', worker: PRODUCTION_WORKER })
  assert.deepEqual(siteConfig({ PADELDOC_SITE: 'demo', NEXT_PUBLIC_PADELDOC_WORKER: DEMO_WORKER }), { site: 'demo', worker: DEMO_WORKER })
  assert.throws(() => siteConfig({ PADELDOC_SITE: 'demo' }), /needs NEXT_PUBLIC_PADELDOC_WORKER/)
  assert.throws(() => siteConfig({ PADELDOC_SITE: 'demo', NEXT_PUBLIC_PADELDOC_WORKER: PRODUCTION_WORKER }), /needs NEXT_PUBLIC_PADELDOC_WORKER/)
  assert.throws(() => siteConfig({ NEXT_PUBLIC_PADELDOC_WORKER: DEMO_WORKER }), /isn't "demo"/)
})

test('an edge function reads Netlify.env first, then process.env', () => {
  assert.equal(edgeEnv('X', { Netlify: { env: { get: () => 'n' } }, process: { env: { X: 'p' } } }), 'n')
  assert.equal(edgeEnv('X', { Netlify: { env: { get: () => undefined } }, process: { env: { X: 'p' } } }), 'p')
  assert.equal(edgeEnv('X', { process: { env: {} } }), undefined)
  assert.equal(edgeEnv('X', {}), undefined)
})

test('the demo\'s rules: the feed and unsubscribe are gone, everything else passes', () => {
  for (const p of ['/unsubscribe', '/unsubscribe/', '/Unsubscribe', '/cal', '/cal/', '/cal/abc.ics', '/CAL/abc.ics']) assert.equal(demoRule(p), 'gone', p)
  for (const p of ['/', '/signin', '/me', '/calendar', '/calx', '/unsubscribed', '/privacy', '/tactics', '/p/ABC234', '/community/market/l/ABC234']) assert.equal(demoRule(p), 'pass', p)
})

test('the demo\'s edge function: 404 before the proxies, noindex on every answer, and nothing at all off the demo', async () => {
  const before = process.env.PADELDOC_SITE
  const page = () => Promise.resolve(new Response('<html></html>', { status: 200, headers: { 'Content-Type': 'text/html', ETag: '"a"' } }))
  let asked = 0
  const ctx = { next: () => { asked += 1; return page() } }
  try {
    // thepadeldoc.com (the variable unset): the function does nothing, whatever the path.
    delete process.env.PADELDOC_SITE
    for (const p of ['/', '/cal/abc.ics', '/unsubscribe']) assert.equal(await demoSite(new Request(`https://thepadeldoc.com${p}`), ctx), undefined, p)
    assert.equal(asked, 0)
    process.env.PADELDOC_SITE = 'demo'
    for (const p of ['/cal/abc.ics', '/unsubscribe', '/unsubscribe?t=1']) {
      const r = await demoSite(new Request(`https://${DEMO_HOST}${p}`), ctx) as Response
      assert.equal(r.status, 404, p)
      assert.equal(r.headers.get(ROBOTS_HEADER), ROBOTS_VALUE)
    }
    assert.equal(asked, 0, 'the proxied paths never go on to the site')
    const r = await demoSite(new Request(`https://${DEMO_HOST}/tactics`), ctx) as Response
    assert.equal(asked, 1)
    assert.deepEqual([r.status, r.headers.get(ROBOTS_HEADER), r.headers.get('ETag'), r.headers.get('Content-Type')], [200, 'noindex', '"a"', 'text/html'])
    assert.equal(await r.text(), '<html></html>')
  } finally {
    if (before === undefined) delete process.env.PADELDOC_SITE
    else process.env.PADELDOC_SITE = before
  }
  assert.deepEqual(demoSiteConfig, { path: '/*' })
})

test('robots, Plausible and the moved pages', () => {
  assert.deepEqual(robotsFor(false), { rules: { userAgent: '*', allow: '/' }, sitemap: 'https://thepadeldoc.com/sitemap.xml' })
  assert.deepEqual(robotsFor(true), { rules: { userAgent: '*', disallow: '/' } })
  assert.equal(plausibleDomain(false), 'thepadeldoc.com')
  assert.equal(plausibleDomain(true), 'demo.thepadeldoc.com')
  assert.equal(MAIN_SITE, 'https://thepadeldoc.com')
  // Every marketing page of app/ moves; privacy stays (the demo has its own notice) and / is Try it as.
  const pages = readdirSync(join(root, 'app')).filter((n) => existsSync(join(root, 'app', n, 'page.tsx'))).map((n) => `/${n}`)
  for (const p of pages) assert.equal(DEMO_MOVED.includes(p), p !== '/privacy', p)
  assert.ok(DEMO_MOVED.includes('/tools/:slug'))
})

test('the demo\'s words: the notice of spec 9.4, no em dashes', () => {
  const text = JSON.stringify({ notice, RIBBON, NOTICE_TITLE })
  assert.equal(/—|–/.test(text), false)
  for (const part of ['made up', 'YouTube', 'technique clip', 'until the reset that night', 'No account, no email and no name', 'one-way hash for two days', 'Plausible', 'demo.thepadeldoc.com']) assert.ok(text.includes(part), part)
  assert.equal(RIBBON.text, 'Demo, made-up people, resets every night')
})

test('one Worker address: no file of app/ or netlify/ writes one but worker-default.ts', () => {
  const holders = [...filesUnder(join(root, 'app')), ...filesUnder(join(root, 'netlify'))]
    .filter((f) => /\.(ts|tsx)$/.test(f) && !f.endsWith('.test.ts'))
    .filter((f) => readFileSync(f, 'utf8').includes('workers.dev'))
    .map((f) => f.slice(root.length + 1).replace(/\\/g, '/'))
  assert.deepEqual(holders, ['app/worker-default.ts'])
  for (const f of ['reviews-strip.tsx', 'signed-in-header.tsx', 'usage-beacon.tsx', 'usage-counter.tsx', 'used-by-strip.tsx']) {
    assert.match(read(`app/${f}`), /import \{ WORKER \} from '.\/worker-url'/, f)
  }
  // The pages' module names no address and never imports the module that does.
  assert.equal(/worker-default|https:/.test(read('app/worker-url.ts').replace(/^\/\/.*$/gm, '')), false)
})

test('thepadeldoc.com is untouched: its proxies still in netlify.toml, the demo\'s edge function never in the repo', () => {
  const toml = read('netlify.toml')
  assert.ok(toml.includes(`to = "${PRODUCTION_WORKER}/v1/signin/unsubscribe"`))
  assert.ok(toml.includes(`to = "${PRODUCTION_WORKER}/v1/cal/:splat"`))
  assert.equal(toml.includes('demo'), false, 'netlify.toml says nothing of the demo')
  assert.ok(read('.gitignore').split(/\r?\n/).includes('netlify/edge-functions/demo-site.ts'))
  const pkg = JSON.parse(read('package.json'))
  assert.equal(pkg.scripts.build, 'next build')
  assert.equal(pkg.scripts.prebuild, 'node scripts/demo-prebuild.mjs')
  assert.equal(pkg.scripts.postbuild, 'node scripts/demo-prebuild.mjs --check')
})
