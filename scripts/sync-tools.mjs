// Sync the built Padel Doc tool bundles from the padel-coach-src repo into public/,
// injecting a canonical tag (-> thepadeldoc.com/<route>) and the Plausible snippet into
// each tool's <head>. The bundles themselves are brand-built in padel-coach-src (Style D
// fonts, padeldoc tokens); this script only relocates them and adds the two site-level tags.
//
// Run from the padeldoc_web root:  npm run sync-tools
// Assumes padel-coach-src is a sibling checkout at ../padel-coach-src.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(root, '..', 'padel-coach-src')

// clean route  ->  source bundle in padel-coach-src
const MAP = [
  { route: 'tactics', src: 'dist/padeldoc/board.html' },
  { route: 'tracker', src: 'dist/padeldoc/tracker.html' },
  { route: 'analyse', src: 'dist/padeldoc/analyse.html' },
  { route: 'americano', src: 'dist/padeldoc/americano.html' },
  { route: 'balance', src: 'dist/padeldoc/balance.html' },
]

const PLAUSIBLE =
  '<script defer data-domain="thepadeldoc.com" src="https://plausible.io/js/script.js"></script>'

for (const { route, src } of MAP) {
  const html = readFileSync(join(SRC, src), 'utf8')
  const canonical = `<link rel="canonical" href="https://thepadeldoc.com/${route}" />`
  // Inject once, before the FIRST </head> (the document head; any later literal in the
  // inlined script is left untouched).
  const out = html.replace('</head>', `${canonical}\n${PLAUSIBLE}\n</head>`)
  const outDir = join(root, 'public', route)
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'index.html'), out)
  console.log(`synced public/${route}/index.html  <-  padel-coach-src/${src}`)
}
