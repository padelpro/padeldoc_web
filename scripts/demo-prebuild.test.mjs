// scripts/demo-prebuild.mjs (padel-coach-src specs/demo-site-spec.md 10.2; Kevin 12 Nov 2026, D7), on made-up folders
// under the system's temp, each removed after its test.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { prebuild, postbuild, demoEnvProblem, bundlesHaveDemoMode, productionAddressIn, PRODUCTION_WORKER, DEMO_WORKER, PROD_TAG, DEMO_TAG, EDGE_SOURCE, EDGE_TARGET } from './demo-prebuild.mjs'
import { PRODUCTION_WORKER as P2, DEMO_WORKER as D2 } from '../app/worker-default.ts'

const here = dirname(fileURLToPath(import.meta.url))
const DEMO = { PADELDOC_SITE: 'demo', NEXT_PUBLIC_PADELDOC_WORKER: DEMO_WORKER }
const quiet = () => {}

function site({ demoMode = true } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'demo-prebuild-'))
  const put = (p, text) => { mkdirSync(dirname(join(root, p)), { recursive: true }); writeFileSync(join(root, p), text) }
  put('public/tactics/index.html', `<head><script defer ${PROD_TAG} src="https://plausible.io/js/script.js"></script></head>const api="${PRODUCTION_WORKER}"`)
  put('public/player/index.html', `<head><script defer ${PROD_TAG} src="x"></script></head>`)
  put('public/tabs/app-abc.js', `const a="${PRODUCTION_WORKER}"${demoMode ? `,d="${DEMO_WORKER}"` : ''}`)
  put('public/images/x.txt', PROD_TAG)
  put(EDGE_SOURCE, '// the demo edge function')
  return { root, put, read: (p) => readFileSync(join(root, p), 'utf8'), done: () => rmSync(root, { recursive: true, force: true }) }
}

test('the two addresses are app/worker-default.ts\'s own', () => {
  assert.equal(PRODUCTION_WORKER, P2)
  assert.equal(DEMO_WORKER, D2)
})

test('thepadeldoc.com (nothing set): nothing changes, nothing printed, a stray copy of the edge function removed', () => {
  const s = site()
  try {
    const before = s.read('public/tactics/index.html')
    const lines = []
    assert.deepEqual(prebuild(s.root, {}, (l) => lines.push(l)), { demo: false })
    assert.deepEqual(postbuild(s.root, {}, (l) => lines.push(l)), { demo: false })
    assert.equal(s.read('public/tactics/index.html'), before)
    assert.equal(existsSync(join(s.root, EDGE_TARGET)), false)
    assert.deepEqual(lines, [])
    s.put(EDGE_TARGET, 'left by a local demo build')
    prebuild(s.root, { PADELDOC_SITE: '' }, quiet)
    assert.equal(existsSync(join(s.root, EDGE_TARGET)), false)
  } finally { s.done() }
})

test('the demo: the Plausible tag rewritten in the tool pages only, the edge function put in place', () => {
  const s = site()
  try {
    const r = prebuild(s.root, DEMO, quiet)
    assert.deepEqual(r.pages.sort(), ['public/player/index.html', 'public/tactics/index.html'])
    for (const p of r.pages) { assert.ok(s.read(p).includes(DEMO_TAG), p); assert.equal(s.read(p).includes(PROD_TAG), false, p) }
    assert.equal(s.read('public/images/x.txt'), PROD_TAG, 'only .html pages')
    assert.ok(s.read('public/tactics/index.html').includes(PRODUCTION_WORKER), 'the bundle itself is left as released')
    assert.equal(s.read(EDGE_TARGET), '// the demo edge function')
  } finally { s.done() }
})

test('the demo stops: the wrong pair, bundles from before demo mode, no tag to rewrite', () => {
  assert.equal(demoEnvProblem(DEMO), null)
  for (const env of [{ PADELDOC_SITE: 'demo' }, { PADELDOC_SITE: 'demo', NEXT_PUBLIC_PADELDOC_WORKER: PRODUCTION_WORKER }, { PADELDOC_SITE: 'Demo', NEXT_PUBLIC_PADELDOC_WORKER: DEMO_WORKER }]) {
    const s = site()
    try {
      assert.throws(() => prebuild(s.root, env, quiet), /Nothing built/)
      assert.equal(existsSync(join(s.root, EDGE_TARGET)), false)
      assert.ok(s.read('public/tactics/index.html').includes(PROD_TAG))
    } finally { s.done() }
  }
  const old = site({ demoMode: false })
  try {
    assert.equal(bundlesHaveDemoMode(old.root), false)
    assert.throws(() => prebuild(old.root, DEMO, quiet), /no demo mode/)
    assert.ok(old.read('public/tactics/index.html').includes(PROD_TAG), 'nothing rewritten')
    assert.equal(existsSync(join(old.root, EDGE_TARGET)), false)
  } finally { old.done() }
  const none = site()
  try {
    none.put('public/tactics/index.html', '<head></head>'); none.put('public/player/index.html', '<head></head>')
    assert.throws(() => prebuild(none.root, DEMO, quiet), /no tool page had the Plausible tag/)
  } finally { none.done() }
})

test('the build check: production\'s address in anything Next wrote stops the demo build; the cache and public/ don\'t count', () => {
  const s = site()
  try {
    s.put('.next/server/app/index.html', `<script>fetch("${DEMO_WORKER}/v1/stats")</script>`)
    s.put('.next/cache/webpack/x.pack', PRODUCTION_WORKER)
    assert.deepEqual(productionAddressIn(s.root), [])
    assert.deepEqual(postbuild(s.root, DEMO, quiet), { demo: true })
    s.put('.next/static/chunks/a.js', `const u="${PRODUCTION_WORKER}/v1/me"`)
    assert.deepEqual(productionAddressIn(s.root), ['.next/static/chunks/a.js'])
    assert.throws(() => postbuild(s.root, DEMO, quiet), /production's Worker address is in the demo build: \.next\/static\/chunks\/a\.js/)
    assert.deepEqual(postbuild(s.root, {}, quiet), { demo: false }, 'thepadeldoc.com\'s build is never checked')
  } finally { s.done() }
})

test('run as npm runs it: silent and exit 0 with nothing set, exit 1 and a reason on a wrong pair', () => {
  const env = { ...process.env }
  delete env.PADELDOC_SITE; delete env.NEXT_PUBLIC_PADELDOC_WORKER
  // --check with nothing set reads nothing and writes nothing (the plain run would only remove a stray edge copy).
  const ok = spawnSync(process.execPath, [join(here, 'demo-prebuild.mjs'), '--check'], { env, encoding: 'utf8' })
  assert.deepEqual([ok.status, ok.stdout, ok.stderr], [0, '', ''])
  const bad = spawnSync(process.execPath, [join(here, 'demo-prebuild.mjs'), '--check'], { env: { ...env, PADELDOC_SITE: 'demo' }, encoding: 'utf8' })
  assert.equal(bad.status, 1)
  assert.match(bad.stderr, /NEXT_PUBLIC_PADELDOC_WORKER must be/)
})
