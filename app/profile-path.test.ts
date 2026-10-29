// Unit tests for the profile path rule. Run with `npm test`.
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { profilePath, SITE_PATHS } from './profile-path.ts'

test('a name is a profile; the site keeps its own pages', () => {
  assert.deepEqual(profilePath('/kevin-obrien'), { kind: 'profile' })
  assert.deepEqual(profilePath('/naas-ltc/'), { kind: 'profile' })
  assert.deepEqual(profilePath('/Kevin'), { kind: 'profile' }, 'any case; the page reads it lower case')
  for (const p of ['/', '/about', '/coach', '/signin', '/tools', '/privacy', '/tactics', '/community', '/unsubscribe']) assert.equal(profilePath(p), null, p)
  for (const p of ['/favicon.ico', '/og.png', '/player-sw.js', '/ab', '/a'.repeat(1) + 'x'.repeat(31), '/-kev', '/kev--in', '/_next', '/p/ABC123', '/kevin/clips'])
    assert.equal(profilePath(p), null, p)
})

test('the old /@name moves to /name', () => {
  assert.deepEqual(profilePath('/@kevin-obrien'), { kind: 'move', to: '/kevin-obrien' })
  assert.deepEqual(profilePath('/@Kevin'), { kind: 'move', to: '/kevin' })
  assert.equal(profilePath('/@bad name'), null)
})

test("every top-level page, folder and route the site has is in SITE_PATHS", () => {
  const firsts = new Set<string>()
  for (const d of readdirSync(new URL('./', import.meta.url), { withFileTypes: true })) if (d.isDirectory()) firsts.add(d.name)
  for (const d of readdirSync(new URL('../public/', import.meta.url), { withFileTypes: true })) if (d.isDirectory()) firsts.add(d.name)
  const toml = readFileSync(new URL('../netlify.toml', import.meta.url), 'utf8')
  for (const m of toml.matchAll(/from = "\/([^/"*@]+)/g)) firsts.add(m[1])
  const next = readFileSync(new URL('../next.config.ts', import.meta.url), 'utf8')
  for (const m of next.matchAll(/source: '\/([^/':]+)/g)) firsts.add(m[1])
  for (const f of firsts) if (profilePath(`/${f}`)) assert.ok(SITE_PATHS.has(f), `${f} is a site path, add it to SITE_PATHS (and the Worker's RESERVED)`)
})

test("underscores are their own names, not hyphens (Kevin 29 Oct 2026)", () => {
  assert.deepEqual(profilePath('/anna_zuka'), { kind: 'profile' })
  assert.deepEqual(profilePath('/anna-zuka'), { kind: 'profile' })
  assert.deepEqual(profilePath('/@anna_zuka'), { kind: 'move', to: '/anna_zuka' })
  for (const p of ['/_anna', '/anna_', '/anna__zuka', '/anna_-zuka']) assert.equal(profilePath(p), null, p)
})
