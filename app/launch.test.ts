import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { headlineOf, emailOk, soonBody, withName, SOON_TOPICS } from './launch.ts'

const read = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8')
const copy = JSON.parse(read('./_copy/launch.json'))

test('the headline is one number to change, and the page is built with the first', () => {
  assert.equal(copy.headline, 1)
  assert.deepEqual(copy.headlines, [
    'See what really happens in your matches.',
    'Know where your points go.',
    'Your padel, on video and in numbers.',
    'Score your match. Then see why it went that way.',
  ])
  assert.equal(headlineOf(copy), 'See what really happens in your matches.')
  for (const n of [1, 2, 3, 4]) assert.equal(headlineOf({ ...copy, headline: n }), copy.headlines[n - 1])
  // Anything that isn't one of the four: the first, never an empty page.
  for (const bad of [0, 5, 1.5, '2', null, undefined]) assert.equal(headlineOf({ ...copy, headline: bad }), copy.headlines[0])
  assert.equal(headlineOf({}), '')
})

test('the whole page, top to bottom, in Kevin\'s words', () => {
  assert.deepEqual(copy.roles.map((r: { label: string; href: string }) => [r.label, r.href]), [["I'm a player", '/me/join'], ["I'm a coach", '/coach/join']])
  assert.deepEqual(copy.rows, [
    { label: 'During the match', line: 'Score it on your phone or your watch.' },
    { label: 'Afterwards', line: 'Tag the video. Break down any shot and send it.' },
  ])
  assert.equal(copy.soon.label, 'Coming soon')
  assert.deepEqual(copy.soon.names.map((n: { name: string }) => n.name), ['Training', 'Academy', 'Community'])
  assert.deepEqual(copy.soon.names.map((n: { id: string }) => n.id), [...SOON_TOPICS])
  assert.equal(withName(copy.soon.ask, 'Training'), 'Tell me when Training is ready')
  assert.deepEqual(copy.footer.links.map((l: { name: string }) => l.name), ['Scoreboard', 'Americano', 'Balance Calculator', 'Tactics Board'])
  assert.deepEqual(copy.footer.legal.map((l: { name: string }) => l.name), ['Privacy', 'Terms'])
  // No em or en dashes anywhere in the words.
  const words = JSON.stringify({ ...copy, _about: '' })
  assert.ok(!/[–—]/.test(words))
})

test('the email box sends a known name and a real-looking email, tidied', () => {
  assert.deepEqual(soonBody('training', '  Aoife@Example.com '), { topic: 'training', email: 'aoife@example.com' })
  assert.equal(soonBody('wellness', 'a@b.ie'), null, 'not a coming-soon name')
  for (const bad of ['', 'a', 'a@b', 'a b@c.ie', '@b.ie', 'a@.', null, 5, `${'a'.repeat(250)}@b.ie`]) assert.equal(emailOk(bad), false, String(bad))
  assert.equal(emailOk('kev@padel.ie'), true)
})

test('the page is at a preview address: today\'s home page is untouched, and no search engine is asked in', () => {
  const page = read('./preview/launch/page.tsx')
  assert.match(page, /robots: \{ index: false, follow: false \}/)
  assert.ok(!read('./page.tsx').includes('launch'), 'the home page still draws HomePage')
  assert.ok(!read('./sitemap.ts').includes('preview'), 'not in the sitemap')
  assert.ok(existsSync(new URL('./launch-page.tsx', import.meta.url)))
  // Dark is for this page only.
  const css = read('./globals.css')
  assert.match(css, /@media \(prefers-color-scheme: dark\) \{\s+html:has\(\[data-launch\]\)/)
  assert.match(read('./launch-page.tsx'), /<div data-launch /)
})
