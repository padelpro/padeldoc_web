// The demo site's build steps (padel-coach-src specs/demo-site-spec.md 10.2; Kevin 12 Nov 2026, D7). npm runs this
// before and after `next build` (package.json prebuild and postbuild). With PADELDOC_SITE unset (thepadeldoc.com) it
// does nothing at all and prints nothing. With PADELDOC_SITE=demo (the demo's own Netlify site):
//   before the build
//     1. the two variables must be the demo's pair (the demo Worker's address, nothing else);
//     2. the tool bundles in public/ must be a release with demo mode in it (padel-coach-src D6: they hold the demo
//        Worker's address), or the demo would serve thepadeldoc.com's own sign-in page: the build stops;
//     3. the tool pages' Plausible tag is taken out, in the build's own copy of public/ (never committed): the demo has
//        no Plausible site of its own (Kevin 16 Nov 2026), so production's stats never count a demo visit and nothing
//        counts it elsewhere (the demo Worker counts role taps, a role and a day);
//     4. netlify/demo/demo-site.ts is copied to netlify/edge-functions/demo-site.ts (git-ignored), the demo's edge
//        function: /unsubscribe and /cal/* 404, X-Robots-Tag: noindex on every answer.
//   after the build (--check)
//     5. no file Next wrote holds production's Worker address (the tool bundles hold it by design, and aren't Next's),
//        and none holds Plausible's script (the layout leaves it out on the demo).
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, copyFileSync, rmSync, mkdirSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

export const PRODUCTION_WORKER = 'https://padel-share.padel-coach.workers.dev'
export const DEMO_WORKER = 'https://padel-share-demo.padel-coach.workers.dev'
export const PROD_TAG = 'data-domain="thepadeldoc.com"'
export const PLAUSIBLE_SRC = 'plausible.io/js/script.js'
// The whole tag sync-tools.mjs writes into each tool page, and the line it sits on.
const PLAUSIBLE_TAG = /[ \t]*<script\b[^>]*data-domain="[^"]*"[^>]*plausible\.io\/js\/script\.js[^>]*><\/script>[ \t]*\r?\n?/g
export const EDGE_SOURCE = 'netlify/demo/demo-site.ts'
export const EDGE_TARGET = 'netlify/edge-functions/demo-site.ts'
// Where a release's bundles keep the Worker's address (the split pages' own chunks included).
export const BUNDLE_DIRS = ['public/player', 'public/me', 'public/tabs']

// Every file under dir, as paths.
export function filesUnder(dir) {
  if (!existsSync(dir)) return []
  const out = []
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) out.push(...filesUnder(p))
    else out.push(p)
  }
  return out
}

// The demo's pair, or a reason. Never the values back (only which variable is wrong).
export function demoEnvProblem(env) {
  if (env.PADELDOC_SITE !== 'demo') return 'PADELDOC_SITE is not "demo"'
  if (env.NEXT_PUBLIC_PADELDOC_WORKER !== DEMO_WORKER) return `NEXT_PUBLIC_PADELDOC_WORKER must be ${DEMO_WORKER}`
  return null
}

export const bundlesHaveDemoMode = (root) =>
  BUNDLE_DIRS.some((d) => filesUnder(join(root, d)).some((f) => /\.(html|js)$/.test(f) && readFileSync(f, 'utf8').includes(DEMO_WORKER)))

// Takes the tool pages' Plausible tag out. Returns the pages changed.
export function dropPlausible(root) {
  const changed = []
  for (const f of filesUnder(join(root, 'public'))) {
    if (!f.endsWith('.html')) continue
    const html = readFileSync(f, 'utf8')
    if (!html.includes(PLAUSIBLE_SRC)) continue
    const out = html.replace(PLAUSIBLE_TAG, '')
    if (out === html) continue
    writeFileSync(f, out)
    changed.push(relative(root, f).replace(/\\/g, '/'))
  }
  return changed
}
// Pages (the tool pages, and every file Next wrote) still holding Plausible's script.
export function plausibleIn(root) {
  const next = join(root, '.next')
  return [...filesUnder(join(root, 'public')).filter((f) => f.endsWith('.html')), ...filesUnder(next).filter((f) => !relative(next, f).replace(/\\/g, '/').startsWith('cache/'))]
    .filter((f) => readFileSync(f).includes(PLAUSIBLE_SRC))
    .map((f) => relative(root, f).replace(/\\/g, '/'))
}

export function placeEdgeFunction(root) {
  mkdirSync(join(root, dirname(EDGE_TARGET)), { recursive: true })
  copyFileSync(join(root, EDGE_SOURCE), join(root, EDGE_TARGET))
}

// Files Next wrote that hold production's Worker address. The build's cache and trace aren't served or deployed pages.
export function productionAddressIn(root) {
  const next = join(root, '.next')
  return filesUnder(next)
    .filter((f) => !relative(next, f).replace(/\\/g, '/').startsWith('cache/'))
    .filter((f) => readFileSync(f).includes(PRODUCTION_WORKER))
    .map((f) => relative(root, f).replace(/\\/g, '/'))
}

export function prebuild(root, env, log = console.log) {
  if (env.PADELDOC_SITE === undefined || env.PADELDOC_SITE === '') {
    // thepadeldoc.com: nothing to do. A copy left by a local demo build is removed so it can never ride along.
    if (existsSync(join(root, EDGE_TARGET))) rmSync(join(root, EDGE_TARGET))
    return { demo: false }
  }
  const problem = demoEnvProblem(env)
  if (problem) throw new Error(`demo-prebuild: ${problem}. Nothing built.`)
  if (!bundlesHaveDemoMode(root)) throw new Error('demo-prebuild: the tool bundles in public/ have no demo mode (they do not hold the demo Worker\'s address). Release padel-coach-src (demo site D6 or later) to padeldoc_web first. Nothing built.')
  const pages = dropPlausible(root)
  if (!pages.length) throw new Error('demo-prebuild: no tool page had the Plausible tag to take out. Nothing built.')
  placeEdgeFunction(root)
  log(`demo-prebuild: the demo site. Plausible tag taken out of ${pages.length} tool pages; ${EDGE_TARGET} in place.`)
  return { demo: true, pages }
}

export function postbuild(root, env, log = console.log) {
  if (env.PADELDOC_SITE === undefined || env.PADELDOC_SITE === '') return { demo: false }
  const problem = demoEnvProblem(env)
  if (problem) throw new Error(`demo-prebuild: ${problem}.`)
  const found = productionAddressIn(root)
  if (found.length) throw new Error(`demo-prebuild: production's Worker address is in the demo build: ${found.slice(0, 10).join(', ')}`)
  const tagged = plausibleIn(root)
  if (tagged.length) throw new Error(`demo-prebuild: Plausible's script is in the demo build: ${tagged.slice(0, 10).join(', ')}`)
  log('demo-prebuild: the build check passed, no file Next wrote holds production\'s Worker address, and no page holds Plausible.')
  return { demo: true }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const root = join(dirname(fileURLToPath(import.meta.url)), '..')
  try {
    if (process.argv.includes('--check')) postbuild(root, process.env)
    else prebuild(root, process.env)
  } catch (e) {
    console.error(e.message)
    process.exit(1)
  }
}
