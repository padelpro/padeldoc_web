// Research inside the app (Kevin 23 Nov 2026, choice B): /research/latest.json carries the newest released post's slug,
// title, date and summary and nothing of its body; the research pages clear the app's New dot and say "Back to the app"
// to a signed-in visitor.
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { latestJson, type Post } from './posts.ts'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (...p: string[]) => readFileSync(join(root, ...p), 'utf8')
const post = (o: Partial<Post>): Post => ({ title: 'T', slug: 's', date: '2026-11-17', summary: 'S', image: '/og.png', tags: [], type: 'roundup',
  draft: false, body: 'The whole post, never in latest.json.', ...o } as Post)

test('latest.json: the newest post, four fields, no body; null with no post', () => {
  const posts = [post({ slug: 'a', date: '2026-11-17', title: 'Old' }), post({ slug: 'b', date: '2026-11-23', title: 'New', summary: 'One line.' })]
  assert.deepEqual(latestJson(posts), { slug: 'b', title: 'New', date: '2026-11-23', summary: 'One line.' })
  assert.ok(!JSON.stringify(latestJson(posts)).includes('whole post'))
  assert.equal(latestJson([]), null)
})

test('latest.json is written at build time, and the demo sends readers to the main site', () => {
  const route = read('app', 'research', 'latest.json', 'route.ts')
  assert.match(route, /export const dynamic = 'force-static'/)
  assert.match(route, /latestJson\(loadPosts\(\)\)/)
  assert.match(route, /if \(IS_DEMO\) return Response\.redirect\(`\$\{MAIN_SITE\}\/research\/latest\.json`, 308\)/)
})

test('the research pages: "Back to the app" for a signed-in visitor, and the New dot cleared', () => {
  const copy = JSON.parse(read('app', '_copy', 'research.json'))
  assert.equal(copy.backToApp, 'Back to the app')
  for (const f of [['app', 'research', 'page.tsx'], ['app', 'research', '[slug]', 'page.tsx']]) {
    const page = read(...f)
    assert.match(page, /<SiteHeader back=\{copy\.backToApp\} \/>/, f.join('/'))
    assert.match(page, /<SeenMark date=\{latestPost\(/, f.join('/'))
  }
  const header = read('app', 'signed-in-header.tsx')
  assert.equal((header.match(/\{back \|\| home\.label\}/g) || []).length, 2, 'both bars, signed in only')
  const mark = read('app', 'research', 'seen-mark.tsx')
  assert.match(mark, /export const SEEN_KEY = 'pd_research_seen'/, 'the key the app reads')
  assert.match(mark, /try \{/)
})
