// Blog titles (Kevin 24 Nov 2026): a post's title is a question a player or coach would ask, with no date in it (the date is
// on the card and the page). An optional "kicker" in the front matter is a small line above the title on the post page
// only, never on the /research card. latest.json goes by date, so an older post added later never takes the New dot.
import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync, rmSync, readFileSync, readdirSync, copyFileSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { postFrom, loadPosts, latestJson, feedXml } from './posts.ts'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (...p: string[]) => readFileSync(join(root, ...p), 'utf8')
const CONTENT = join(root, 'content', 'research')
const copy = JSON.parse(read('app', '_copy', 'research.json'))

const front = (o: Record<string, string>) => `---\n${Object.entries(o).map(([k, v]) => `${k}: ${v}`).join('\n')}\n---\nBody.\n`
const base = { title: '"A question?"', slug: '"2026-11-24-a"', date: '"2026-11-24"', summary: '"One sentence."', image: '"/og.png"',
  tags: '["padel"]', type: '"roundup"', draft: 'false' }

test('kicker: read when present, trimmed; absent leaves the post exactly as before', () => {
  const withK = postFrom(front({ ...base, kicker: '"  Research Roundup "' }), '2026-11-24-a')
  assert.equal(withK.kicker, 'Research Roundup')
  const without = postFrom(front(base), '2026-11-24-a')
  assert.equal('kicker' in without, false, 'no kicker key at all')
  assert.deepEqual(Object.keys(without).sort(), ['body', 'date', 'draft', 'image', 'slug', 'summary', 'tags', 'title', 'type'])
  assert.throws(() => postFrom(front({ ...base, kicker: '""' }), '2026-11-24-a'), /kicker must be text/)
  assert.throws(() => postFrom(front({ ...base, kicker: 'true' }), '2026-11-24-a'), /kicker must be text/)
})

test('kicker: drawn above the title on the post page only, never on the /research card or the home card', () => {
  const post = read('app', 'research', '[slug]', 'page.tsx')
  assert.match(post, /\{p\.kicker && <p [^>]*>\{p\.kicker\}<\/p>\}\s*<h1/, 'the post page: the kicker, then the title')
  assert.ok(!read('app', 'research', 'page.tsx').includes('kicker'), 'not on the list card')
  assert.ok(!read('app', 'research', 'latest-card.tsx').includes('kicker'), 'not on the home card')
  // The date once on each: one <time> on the card and one on the post page.
  assert.equal((read('app', 'research', 'page.tsx').match(/<time /g) || []).length, 1)
  assert.equal((post.match(/<time /g) || []).length, 1)
})

test('the 23 Nov roundup: the new title and kicker, slug, date and summary unchanged, no date in the title', () => {
  const p = loadPosts({ dir: CONTENT, drafts: false }).find((x) => x.slug === '2026-11-23-research-roundup')!
  assert.equal(p.title, 'Is stretching before padel a waste of time?')
  assert.equal(p.kicker, 'Research Roundup')
  assert.equal(p.date, '2026-11-23')
  assert.equal(p.summary, 'In amateur padel the losers moved more per minute than the winners, plus why short neuromuscular warm-ups beat stretching for injury prevention.')
  assert.ok(!/November|2026/.test(p.title))
  assert.ok(!/\d{4}|November/.test(p.kicker!), 'no date in the kicker')
  const feed = feedXml(loadPosts({ dir: CONTENT, drafts: false }), copy)
  assert.ok(feed.includes('<title>Is stretching before padel a waste of time?</title>'))
  assert.ok(!feed.includes('Padel Research Roundup: 23 November 2026'))
})

test('latest.json: names the 23 Nov post, and an older post added later (the TUD post, 25 Jun 2026) never takes it', () => {
  const now = latestJson(loadPosts({ dir: CONTENT, drafts: false }))!
  assert.equal(now.slug, '2026-11-23-research-roundup')
  assert.equal(now.title, 'Is stretching before padel a waste of time?')
  assert.deepEqual(Object.keys(now).sort(), ['date', 'slug', 'summary', 'title'], 'no kicker in latest.json')
  const dir = mkdtempSync(join(tmpdir(), 'blog-titles-'))
  try {
    for (const f of readdirSync(CONTENT).filter((f) => f.endsWith('.md'))) copyFileSync(join(CONTENT, f), join(dir, f))
    const tud = '2026-06-25-irish-padel-1000-rallies'
    if (!existsSync(join(dir, `${tud}.md`))) {
      writeFileSync(join(dir, `${tud}.md`), front({ ...base, title: '"What actually wins points at club level in Ireland?"',
        slug: `"${tud}"`, date: '"2026-06-25"', type: '"deep-dive"' }))
    }
    const posts = loadPosts({ dir, drafts: false })
    assert.ok(posts.some((p) => p.slug === tud))
    assert.equal(latestJson(posts)!.slug, '2026-11-23-research-roundup')
    assert.equal(posts[0].slug, '2026-11-23-research-roundup', 'first on /research too')
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('no em dashes in any post or the research pages', () => {
  const files = [...readdirSync(CONTENT).filter((f) => f.endsWith('.md')).map((f) => ['content', 'research', f]),
    ['app', 'research', 'page.tsx'], ['app', 'research', '[slug]', 'page.tsx'], ['app', 'research', 'posts.ts'], ['app', '_copy', 'research.json']]
  for (const f of files) assert.ok(!read(...f).includes(String.fromCharCode(0x2014)), f.join('/'))
})
