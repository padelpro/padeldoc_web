// The build stamp (launch readiness, Kevin 14 Nov 2026): /build.json says which commit this build is, so
// C:\users\hp\ship.ps1 -Site can wait for Netlify and print LIVE or FAILED with the commit, with no token. Until now a
// failed Netlify build was silent: the old site simply stayed up.
// npm runs this before `next build` (package.json prebuild), so the file is in public/ when Next gathers it. The commit
// is Netlify's COMMIT_REF; on a desk build, git's HEAD; with neither, "unknown". The file is never committed
// (.gitignore). It holds a commit hash, the time and which of the two sites this is: nothing else, nothing personal.
import { writeFileSync, mkdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

export const STAMP_FILE = 'public/build.json'
export const SHA_RE = /^[0-9a-f]{40}$/

// git's HEAD here, or "" (no git, or not a checkout).
export function gitHead(root) {
  try { return String(execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], { stdio: ['ignore', 'pipe', 'ignore'] })).trim().toLowerCase() } catch { return '' }
}

// Netlify's COMMIT_REF first (the commit it is building), then git, then "unknown". Only ever a full hash.
export function commitOf(env, head = '') {
  const ref = String((env && env.COMMIT_REF) || '').trim().toLowerCase()
  if (SHA_RE.test(ref)) return ref
  return SHA_RE.test(head) ? head : 'unknown'
}

export const stampOf = (env, now = new Date(), head = '') => ({
  commit: commitOf(env, head),
  built: now.toISOString(),
  site: env && env.PADELDOC_SITE === 'demo' ? 'demo' : 'padeldoc',
})

export function writeStamp(root, env, now = new Date(), head = gitHead(root)) {
  const stamp = stampOf(env, now, head)
  mkdirSync(join(root, 'public'), { recursive: true })
  writeFileSync(join(root, STAMP_FILE), JSON.stringify(stamp) + '\n')
  return stamp
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const root = join(dirname(fileURLToPath(import.meta.url)), '..')
  const s = writeStamp(root, process.env)
  console.log(`build stamp: ${s.commit.slice(0, 7)} (${STAMP_FILE})`)
}
