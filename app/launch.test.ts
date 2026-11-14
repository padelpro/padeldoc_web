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
  // The home page becomes the launch page by one line, not yet switched.
  assert.match(read('./site.ts'), /^export const LAUNCH_HOME: boolean = false$/m, 'not switched yet')
  assert.ok(read('./page.tsx').includes('{LAUNCH_HOME ? <LaunchPage /> : <HomePage />}'))
  // With it on: the role pages go to the launch page, leave the sitemap, and the footer loses them.
  assert.ok(read('../next.config.ts').includes('LAUNCH_HOME ? LAUNCH_MOVED.map'))
  assert.ok(read('./sitemap.ts').includes('LAUNCH_HOME ? pages.filter'))
  assert.ok(read('./site.ts').includes("export const LAUNCH_MOVED = ['/players', '/coaches', '/clubs', '/tools/box-league']"))
  assert.ok(!read('./sitemap.ts').includes('preview'), 'not in the sitemap')
  assert.ok(existsSync(new URL('./launch-page.tsx', import.meta.url)))
  // Dark is for this page only.
  const css = read('./globals.css')
  assert.match(css, /@media \(prefers-color-scheme: dark\) \{\s+html:has\(\[data-launch\]\)/)
  assert.match(read('./launch-page.tsx'), /<div data-launch /)
})

// Launch 1 stage 3 (Kevin 13 Nov 2026): the box sends a confirm email first, and the email's link lands on a page that
// POSTs its token.
test('coming soon is confirmed first: the box says to check your email, and /launch/confirm posts the link\'s token', async () => {
  const { tokenOf, confirmSaid } = await import('./launch.ts')
  assert.equal(copy.soon.done, 'Check your email to confirm.')
  assert.equal(confirmSaid('done', 'Training', copy.confirm), 'Done. One email when Training opens.')
  assert.equal(confirmSaid('open', 'Academy', copy.confirm), 'Academy is open already.')
  assert.equal(confirmSaid('expired', '', copy.confirm), 'That link has run out. Ask again on the home page.')
  assert.equal(confirmSaid('nonsense', '', copy.confirm), copy.confirm.failed)
  const t = 'training.1794000000.bWFldmVAZXhhbXBsZS50ZXN0.q3Jz-_AbC'
  assert.equal(tokenOf(`?t=${t}`), t)
  for (const bad of ['', '?t=', '?t=x', '?t=training.1.x.y', '?t=<script>.1794000000.a.b', `?x=${t}`]) assert.equal(tokenOf(bad), '', bad)
  const page = read('./launch/confirm/confirm.tsx')
  assert.ok(page.includes("fetch(`${WORKER}/v1/launch/confirm`, { method: 'POST'"), 'a POST once the page has loaded: a scanner that only fetches the link confirms nothing')
  assert.ok(read('./launch/confirm/page.tsx').includes('robots: { index: false, follow: false }'))
  const box = read('./launch-soon.tsx')
  assert.ok(box.includes('JSON.stringify({ ...body, website: trap })') && !box.includes('TODO'))
  for (const v of Object.values(copy.confirm)) assert.ok(!/[–—]/.test(String(v)), String(v))
})
