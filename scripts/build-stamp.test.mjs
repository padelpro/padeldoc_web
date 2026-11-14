// scripts/build-stamp.mjs (launch readiness, Kevin 14 Nov 2026): the commit a build says it is, on made-up folders.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { commitOf, stampOf, writeStamp, STAMP_FILE } from './build-stamp.mjs'

const A = 'a'.repeat(40), B = 'b'.repeat(40)
const here = new URL('..', import.meta.url)
const read = (p) => readFileSync(new URL(p, here), 'utf8')

test('the commit is Netlify\'s COMMIT_REF, then git\'s HEAD, then unknown; only ever a full hash', () => {
  assert.equal(commitOf({ COMMIT_REF: A }, B), A)
  assert.equal(commitOf({ COMMIT_REF: ` ${A.toUpperCase()} ` }, B), A, 'tidied')
  assert.equal(commitOf({}, B), B, 'a desk build')
  assert.equal(commitOf({ COMMIT_REF: 'main' }, B), B, 'a branch name is not a commit')
  assert.equal(commitOf({ COMMIT_REF: 'abc1234' }, ''), 'unknown', 'a short hash is not taken')
  assert.equal(commitOf(undefined, ''), 'unknown')
})

test('the stamp holds the commit, the time and which site: nothing else', () => {
  const s = stampOf({ COMMIT_REF: A, NEXT_PUBLIC_PADELDOC_WORKER: 'x', SECRET: 'never' }, new Date('2026-11-14T20:00:00.000Z'))
  assert.deepEqual(s, { commit: A, built: '2026-11-14T20:00:00.000Z', site: 'padeldoc' })
  assert.equal(stampOf({ PADELDOC_SITE: 'demo' }, new Date(0), B).site, 'demo')
})

test('it is written to public/build.json, one line of JSON', () => {
  const root = mkdtempSync(join(tmpdir(), 'build-stamp-'))
  try {
    const s = writeStamp(root, { COMMIT_REF: A }, new Date('2026-11-14T20:00:00.000Z'), B)
    const text = readFileSync(join(root, STAMP_FILE), 'utf8')
    assert.deepEqual(JSON.parse(text), s)
    assert.equal(text.trim().split('\n').length, 1)
  } finally { rmSync(root, { recursive: true, force: true }) }
})

test('npm writes it before every build, it is never committed, and it is never served stale', () => {
  const pkg = JSON.parse(read('package.json'))
  assert.equal(pkg.scripts.prebuild, 'node scripts/build-stamp.mjs && node scripts/demo-prebuild.mjs', 'the stamp first, then the demo\'s steps as before')
  assert.match(read('.gitignore'), /^public\/build\.json$/m)
  assert.match(read('netlify.toml'), /for = "\/build\.json"\s+\[headers\.values\]\s+Cache-Control = "no-store"/)
})
