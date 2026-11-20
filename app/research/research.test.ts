// The research blog (padel-coach-src specs/research-blog-spec.md; Kevin 17 and 18 Nov 2026): front matter, drafts, the
// safe renderer, JSON-LD, the feed, the links in and the demo rule.
import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync, rmSync, readFileSync, readdirSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { splitFrontMatter, postFrom, loadPosts, showDrafts, renderMarkdown, safeUrl, articleJsonLd, feedXml, longDate,
  imageUrl, latestPost, type Post } from './posts.ts'
import { resolveTheme, THEME_BOOT } from './theme.ts'
import { DEMO_MOVED, researchHref, MAIN_SITE } from '../site.ts'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const copy = JSON.parse(readFileSync(join(root, 'app', '_copy', 'research.json'), 'utf8'))

const front = (o: Record<string, string>) => `---\n${Object.entries(o).map(([k, v]) => `${k}: ${v}`).join('\n')}\n---\n`
const good = { title: '"Padel Research Roundup: 17 November 2026"', slug: '"2026-11-17-research-roundup"', date: '"2026-11-17"',
  summary: '"One sentence."', image: '"research-roundup-2026-11-17-single.jpg"', tags: '["padel", "injury", "caffeine"]',
  type: '"roundup"        # roundup | deep-dive', draft: 'false           # true = built in dev only' }

test('front matter: the spec\'s own example reads as written, comments and all', () => {
  const p = postFrom(front(good) + '\nBody **here**.\n', '2026-11-17-research-roundup')
  assert.equal(p.title, 'Padel Research Roundup: 17 November 2026')
  assert.deepEqual(p.tags, ['padel', 'injury', 'caffeine'])
  assert.equal(p.type, 'roundup')
  assert.equal(p.draft, false)
  assert.equal(p.body.trim(), 'Body **here**.')
  // A # inside quotes is text; CRLF and a BOM are fine.
  const { data } = splitFrontMatter('﻿---\r\ntitle: "Roundup #3: a, b"  # note\r\ntags: ["a #1", b]\r\n---\r\nx')
  assert.equal(data.title, 'Roundup #3: a, b')
  assert.deepEqual(data.tags, ['a #1', 'b'])
})

test('front matter: a post that breaks a rule stops the build with the file and the reason', () => {
  const bad: [Record<string, string>, RegExp][] = [
    [{ ...good, slug: '"other-name"' }, /must be the file's name/],
    [{ ...good, date: '"17 Nov 2026"' }, /YYYY-MM-DD/],
    [{ ...good, type: '"news"' }, /roundup or deep-dive/],
    [{ ...good, image: '"../secret.txt"' }, /image/],
    [{ ...good, draft: '"yes"' }, /true or false/],
    [{ ...good, title: '"Unclosed' }, /closed/],
  ]
  for (const [o, re] of bad) assert.throws(() => postFrom(front(o), '2026-11-17-research-roundup'), re)
  const { summary: _s, ...noSummary } = good
  assert.throws(() => postFrom(front(noSummary), '2026-11-17-research-roundup'), /summary is missing/)
  assert.throws(() => postFrom('no front matter', 'x'), /front matter/)
})

test('drafts: in next dev, never in the release build; newest first', () => {
  assert.equal(showDrafts({ NODE_ENV: 'production' }), false)
  assert.equal(showDrafts({ NODE_ENV: 'development' }), true)
  const dir = mkdtempSync(join(tmpdir(), 'research-'))
  try {
    const write = (slug: string, date: string, draft: boolean) =>
      writeFileSync(join(dir, `${slug}.md`), front({ ...good, slug: `"${slug}"`, date: `"${date}"`, draft: String(draft) }) + 'x')
    write('a-old', '2026-11-03', false)
    write('b-new', '2026-11-17', false)
    write('c-draft', '2026-11-24', true)
    writeFileSync(join(dir, 'notes.txt'), 'not a post')
    assert.deepEqual(loadPosts({ dir, drafts: false }).map((p) => p.slug), ['b-new', 'a-old'])
    assert.deepEqual(loadPosts({ dir, drafts: true }).map((p) => p.slug), ['c-draft', 'b-new', 'a-old'])
    // The home page's card: the newest released post in the release build, a draft only in next dev.
    assert.equal(latestPost(loadPosts({ dir, drafts: false }))?.slug, 'b-new')
    assert.equal(latestPost(loadPosts({ dir, drafts: true }))?.slug, 'c-draft')
  } finally { rmSync(dir, { recursive: true, force: true }) }
  assert.deepEqual(loadPosts({ dir: join(tmpdir(), 'no-such-research-dir') }), [])
})

test('Latest research on the home page: the newest post whatever the order, nothing with none, spot A', () => {
  const at = (slug: string, date: string, title = slug) => ({ ...postFrom(front({ ...good, slug: `"${slug}"`, date: `"${date}"` }) + 'x', slug), title })
  assert.equal(latestPost([]), null)
  assert.equal(latestPost([at('a', '2026-11-03'), at('c', '2026-11-24'), at('b', '2026-11-17')])?.slug, 'c')
  assert.equal(latestPost([at('y', '2026-11-24', 'Zebra'), at('x', '2026-11-24', 'Apple')])?.slug, 'x')   // as /research lists them
  // The release build (Kevin 20 Nov 2026): the first two posts are out, both dated 17 November, so the card shows the
  // first by title, the deep dive. Written to hold as posts are added: the card is always the first /research lists.
  const released = loadPosts({ dir: join(root, 'content', 'research'), drafts: false })
  const first = ['2026-11-17-padel-app-stats', '2026-11-17-research-roundup']
  for (const slug of first) assert.ok(released.some((p) => p.slug === slug), `${slug} is released`)
  assert.equal(latestPost(released.filter((p) => first.includes(p.slug)))?.slug, '2026-11-17-padel-app-stats')
  assert.equal(latestPost(released)?.slug, released[0].slug)
  // Every released post's picture is a file the site has (a missing one would be a broken image on three pages).
  for (const p of released) assert.ok(existsSync(join(root, 'public', imageUrl(p.image))), `${p.slug}: ${imageUrl(p.image)} isn't in public/`)
  const home = readFileSync(join(root, 'app', 'home-page.tsx'), 'utf8')
  assert.match(home, /const latest = latestPost\(loadPosts\(\)\)/)
  // Between the reviews and Help build padel-vision; without a post the band is exactly as before.
  assert.match(home, /<ReviewsStrip[^>]*\/>\s*\{\/\*[\s\S]*?\*\/\}\s*\{latest \? <><LatestResearchCard post=\{latest\}[^>]*\/><Community top="mt-6" \/><\/> : <Community \/>\}/)
  const card = readFileSync(join(root, 'app', 'research', 'latest-card.tsx'), 'utf8')
  for (const label of ['copy.latest', 'copy.types[post.type]', 'copy.read', 'postPath(post.slug)', 'longDate(post.date)']) assert.ok(card.includes(label), label)
  assert.match(card, /min-h-11/)   // Read, and the card around it, at least 44px
  // No words of its own: every text node is a value from the copy or the post.
  for (const m of card.matchAll(/>([^<>{}]+)</g)) assert.match(m[1], /^[\s·]*$/, `words in the card: ${m[1]}`)
})

test('the repo\'s posts all read, and the sample post is a draft (never released)', () => {
  const dir = join(root, 'content', 'research')
  const all = loadPosts({ dir, drafts: true })
  assert.ok(all.length >= 3)   // the sample and the first two posts (20 Nov 2026)
  const sample = all.find((p) => p.slug === '2026-11-18-sample-layout')
  assert.ok(sample && sample.draft)
  assert.ok(!loadPosts({ dir, drafts: false }).some((p) => p.slug === sample!.slug))
  assert.equal(readdirSync(dir).filter((f) => f.endsWith('.md')).length, all.length)
})

// Every tag and attribute the renderer may write.
const TAGS = new Set(['p', 'a', 'strong', 'em', 'del', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'hr', 'br',
  'code', 'pre', 'img', 'div', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'input'])
const ATTRS = new Set(['href', 'title', 'rel', 'src', 'alt', 'loading', 'decoding', 'class', 'align', 'start', 'type', 'checked', 'disabled'])
function tagsIn(html: string) {
  const out: { name: string; attrs: Record<string, string> }[] = []
  for (const m of html.matchAll(/<\/?([a-zA-Z][\w-]*)([^>]*)>/g)) {
    const attrs: Record<string, string> = {}
    for (const a of m[2].matchAll(/([^\s=/]+)(?:="([^"]*)")?/g)) attrs[a[1].toLowerCase()] = a[2] ?? ''
    out.push({ name: m[1].toLowerCase(), attrs })
  }
  return out
}

test('markdown renders sanitised: raw HTML is text, unsafe addresses are dropped, only known tags come out', () => {
  const attacks = [
    '<script>alert(1)</script>',
    '<img src=x onerror=alert(1)>',
    '<iframe src="https://evil.example"></iframe>',
    'Inline <span onclick="alert(1)">html</span> and <a href="javascript:alert(1)">a link</a>.',
    '[click](javascript:alert(1))',
    '[click](JaVaScRiPt:alert(1))',
    '[click](java\tscript:alert(1))',
    '[click]( vbscript:msgbox(1))',
    '[click](data:text/html;base64,PHNjcmlwdD4=)',
    '[elsewhere](//evil.example/x)',
    '![pic](javascript:alert(1))',
    '![pic](data:image/svg+xml,<svg onload=alert(1)>)',
    '[t](https://ok.example "a \\" onmouseover=\\"alert(1)")',
    '<javascript:alert(1)>',
    '<style>body{display:none}</style>',
  ].join('\n\n')
  const html = renderMarkdown(attacks)
  for (const t of tagsIn(html)) {
    assert.ok(TAGS.has(t.name), `tag <${t.name}> in ${html}`)
    for (const [k, v] of Object.entries(t.attrs)) {
      assert.ok(ATTRS.has(k), `attribute ${k} on <${t.name}>`)
      if (k === 'href' || k === 'src') assert.ok(!/^\s*(javascript|vbscript|data):/i.test(v) && !v.startsWith('//'), `${k}="${v}"`)
      if (k === 'class') assert.equal(v, 'r-table')
    }
  }
  assert.ok(!/<script/i.test(html) && !/<iframe/i.test(html) && !/<style/i.test(html))
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/)          // shown as text, not run
  assert.equal(safeUrl('https://ok.example/a', 'link'), 'https://ok.example/a')
  assert.equal(safeUrl('mailto:hello@padelpro.ie', 'link'), 'mailto:hello@padelpro.ie')
  assert.equal(safeUrl('mailto:x@y.z', 'image'), null)
  assert.equal(safeUrl('/tools', 'link'), '/tools')
  assert.equal(safeUrl('#sources', 'link'), '#sources')
  assert.equal(safeUrl('\u0000javascript:alert(1)', 'link'), null)
})

test('markdown: headings, bold lead-ins, lists, links and tables as the posts need them', () => {
  const html = renderMarkdown([
    '## Study one', '### Subheading', '**What I take from it:** the takeaway.', '- a\n- b', '1. one\n2. two',
    '[tools](/tools) and [out](https://example.com) and ![pic](roundup.jpg)',
    '| A | B |\n|---|---|\n| 1 | 2 |',
  ].join('\n\n'))
  assert.match(html, /<h2>Study one<\/h2>/)
  assert.match(html, /<h3>Subheading<\/h3>/)
  assert.match(html, /<p><strong>What I take from it:<\/strong> the takeaway.<\/p>/)
  assert.match(html, /<ul>\s*<li>a<\/li>/)
  assert.match(html, /<ol>\s*<li>one<\/li>/)
  assert.match(html, /<a href="\/tools">tools<\/a>/)
  assert.match(html, /<a href="https:\/\/example.com" rel="noopener noreferrer">out<\/a>/)
  assert.match(html, /<img src="\/research\/img\/roundup.jpg" alt="pic" loading="lazy" decoding="async">/)
  assert.match(html, /<div class="r-table"><table>[\s\S]*<td>2<\/td>[\s\S]*<\/table>\s*<\/div>/)
})

const post = (o: Partial<Post> = {}): Post => ({ title: 'Roundup & more <b>', slug: '2026-11-17-research-roundup', date: '2026-11-17',
  summary: 'One "sentence" & a half.', image: 'r.jpg', tags: ['padel', 'injury'], type: 'roundup', draft: false, body: '', ...o })

test('JSON-LD: an Article with headline, date, author Kevin O\'Brien and publisher The Padel Doc, safe in a script tag', () => {
  const s = articleJsonLd(post({ title: 'A </script><script>alert(1)</script> title' }))
  assert.ok(!s.includes('</script'))
  const d = JSON.parse(s)
  assert.equal(d['@type'], 'Article')
  assert.equal(d.headline, 'A </script><script>alert(1)</script> title')
  assert.equal(d.datePublished, '2026-11-17')
  assert.equal(d.author.name, "Kevin O'Brien")
  assert.equal(d.publisher.name, 'The Padel Doc')
  assert.deepEqual(d.image, ['https://thepadeldoc.com/research/img/r.jpg'])
  assert.equal(d.mainEntityOfPage['@id'], 'https://thepadeldoc.com/research/2026-11-17-research-roundup')
})

// A strict little XML check: one root, every tag closed in order, entities known, no stray & or <.
function wellFormed(xml: string): string | null {
  const body = xml.replace(/^<\?xml[^?]*\?>\s*/, '')
  const stack: string[] = []
  let roots = 0
  const re = /<(\/?)([A-Za-z][\w:.-]*)((?:\s+[\w:.-]+="[^"<&]*(?:&(?:amp|lt|gt|quot|apos);[^"<&]*)*")*)\s*(\/?)>|([^<]+)/g
  let last = 0
  for (const m of body.matchAll(re)) {
    if (m.index !== last) return `stray text at ${last}`
    last = m.index + m[0].length
    if (m[5] !== undefined) {
      if (/&(?!(?:amp|lt|gt|quot|apos|#\d+);)/.test(m[5])) return `bare & in "${m[5].trim()}"`
      if (!stack.length && m[5].trim()) return 'text outside the root'
      continue
    }
    if (m[1]) { if (stack.pop() !== m[2]) return `</${m[2]}> closes the wrong tag` }
    else if (!m[4]) { if (!stack.length) roots++; stack.push(m[2]) }
    else if (!stack.length) roots++
  }
  if (last !== body.length) return 'unreadable markup'
  if (stack.length) return `unclosed <${stack[stack.length - 1]}>`
  return roots === 1 ? null : `${roots} roots`
}

test('feed.xml: RSS 2.0 that validates: well formed, the channel\'s required parts, items escaped, 20 at most', () => {
  const many = Array.from({ length: 25 }, (_, i) => post({ slug: `post-${i}`, date: `2026-${String(1 + (i % 12)).padStart(2, '0')}-10` }))
  const xml = feedXml(many, copy)
  assert.equal(wellFormed(xml), null)
  assert.match(xml, /^<\?xml version="1.0" encoding="UTF-8"\?>\n<rss version="2.0" xmlns:atom="http:\/\/www.w3.org\/2005\/Atom">/)
  for (const tag of ['title', 'link', 'description']) assert.match(xml, new RegExp(`<channel>[\\s\\S]*<${tag}>[^<]+</${tag}>`))
  assert.match(xml, /<atom:link href="https:\/\/thepadeldoc.com\/research\/feed.xml" rel="self" type="application\/rss\+xml"\/>/)
  assert.equal((xml.match(/<item>/g) || []).length, 20)
  assert.match(xml, /<title>Roundup &amp; more &lt;b&gt;<\/title>/)
  assert.match(xml, /<description>One &quot;sentence&quot; &amp; a half.<\/description>/)
  assert.match(xml, /<pubDate>Tue, 10 Feb 2026 09:00:00 GMT<\/pubDate>/)     // RFC 822
  assert.match(xml, /<guid isPermaLink="true">https:\/\/thepadeldoc.com\/research\/post-1<\/guid>/)
  const empty = feedXml([], copy)
  assert.equal(wellFormed(empty), null)
  assert.ok(!empty.includes('<item>'))
  assert.notEqual(wellFormed('<rss><channel></rss>'), null)                  // the check itself catches a broken feed
  assert.notEqual(wellFormed('<rss><title>a & b</title></rss>'), null)
})

test('dates, images and the theme', () => {
  assert.equal(longDate('2026-11-17'), '17 November 2026')
  assert.equal(longDate('2026-01-05'), '5 January 2026')
  assert.equal(imageUrl('a.jpg'), '/research/img/a.jpg')
  assert.equal(imageUrl('/shots/tagger.png'), '/shots/tagger.png')
  assert.equal(resolveTheme(undefined, true), 'light')       // Light by default, as the tools
  assert.equal(resolveTheme('device', true), 'dark')
  assert.equal(resolveTheme('device', false), 'light')
  assert.equal(resolveTheme('dark', false), 'dark')
  assert.equal(resolveTheme('blue', true), 'light')
  assert.match(THEME_BOOT, /localStorage\.getItem\("pc_theme"\)/)
})

test('links in: the top bar and the footer; on the demo, thepadeldoc.com\'s page, never a copy', () => {
  assert.equal(researchHref(false), '/research')
  assert.equal(researchHref(true), `${MAIN_SITE}/research`)
  assert.ok(DEMO_MOVED.includes('/research') && DEMO_MOVED.includes('/research/:path*'))
  const parts = readFileSync(join(root, 'app', 'site-parts.tsx'), 'utf8')
  assert.match(parts, /href=\{research\.href\}>\{research\.label\}<\/a>/)          // the footer
  assert.match(parts, /<HeaderAccount research=\{research\} \/>/)                // the top bar
  assert.match(parts, /<HeaderAccount big research=\{research\} \/>/)
  const header = readFileSync(join(root, 'app', 'signed-in-header.tsx'), 'utf8')
  assert.equal((header.match(/\{research && <a href=\{research\.href\}/g) || []).length, 2)  // signed out only, both bars
  const page = readFileSync(join(root, 'app', 'research', 'page.tsx'), 'utf8')
  const one = readFileSync(join(root, 'app', 'research', '[slug]', 'page.tsx'), 'utf8')
  assert.match(page, /if \(IS_DEMO\) redirect\(`\$\{MAIN_SITE\}\/research`\)/)
  assert.match(one, /if \(IS_DEMO\) return \[\]/)
  assert.match(one, /dynamicParams = false/)
  assert.equal(copy.nav, 'Research')
  assert.equal(copy.latest, 'Latest research')
  for (const v of Object.values(copy).flatMap((x) => (typeof x === 'string' ? [x] : Object.values(x as object)))) {
    assert.ok(!String(v).includes('—'), `no em dash: ${v}`)
  }
})
