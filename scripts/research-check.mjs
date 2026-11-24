// The research pages' heads, checked on a running site (padel-coach-src specs/research-blog-spec.md; Kevin 18 Nov 2026):
//   node scripts/research-check.mjs <base url> [--drafts]
// Fetches /research, every post the content folder has (drafts too with --drafts: next dev shows them; a release build
// must answer 404 for a draft), /research/feed.xml and /sitemap.xml, and checks each page has its own title, the
// description, the canonical address, Open Graph and Twitter tags and JSON-LD. Exits 1 on the first page that hasn't.
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SITE = 'https://thepadeldoc.com'

const unescape = (s) => s.replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
const metaOf = (html, key, attr) => {
  const re = new RegExp(`<meta[^>]*\\b${attr}="${key.replace(/[:.]/g, '\\$&')}"[^>]*>`, 'i')
  const tag = re.exec(html)
  if (!tag) return null
  const c = /\bcontent="([^"]*)"/i.exec(tag[0])
  return c ? unescape(c[1]) : null
}

// [problems] for one page's HTML. want: { title, description, canonical, type ('article' | 'website'), jsonLd ('Article' | 'Blog') }
export function checkHead(html, want) {
  const bad = []
  const title = /<title>([^<]*)<\/title>/i.exec(html)
  if (!title || !unescape(title[1]).includes(want.title)) bad.push(`title: ${title ? unescape(title[1]) : 'none'}`)
  if ((html.match(/<title>/gi) || []).length !== 1) bad.push('one <title> only')
  if (metaOf(html, 'description', 'name') !== want.description) bad.push(`description: ${metaOf(html, 'description', 'name')}`)
  const canon = /<link[^>]*rel="canonical"[^>]*href="([^"]*)"/i.exec(html)
  if (!canon || canon[1] !== `${SITE}${want.canonical}`) bad.push(`canonical: ${canon ? canon[1] : 'none'}`)
  if (!(metaOf(html, 'og:title', 'property') || '').includes(want.title)) bad.push(`og:title: ${metaOf(html, 'og:title', 'property')}`)
  for (const [k, v] of [['og:description', want.description], ['og:url', `${SITE}${want.canonical}`], ['og:type', want.type]]) {
    if (metaOf(html, k, 'property') !== v) bad.push(`${k}: ${metaOf(html, k, 'property')}`)
  }
  const ogImage = metaOf(html, 'og:image', 'property')
  if (!ogImage || !ogImage.startsWith(`${SITE}/`)) bad.push(`og:image: ${ogImage}`)
  if (metaOf(html, 'twitter:card', 'name') !== 'summary_large_image') bad.push('twitter:card')
  if (!(metaOf(html, 'twitter:title', 'name') || '').includes(want.title)) bad.push(`twitter:title: ${metaOf(html, 'twitter:title', 'name')}`)
  if (metaOf(html, 'twitter:description', 'name') !== want.description) bad.push('twitter:description')
  if (!metaOf(html, 'twitter:image', 'name')) bad.push('twitter:image')
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)].map((m) => { try { return JSON.parse(m[1]) } catch { return null } })
  const found = ld.find((d) => d && d['@type'] === want.jsonLd)
  if (!found) bad.push(`JSON-LD ${want.jsonLd}: ${ld.length ? 'not that type or unreadable' : 'none'}`)
  if (found && want.jsonLd === 'Article') {
    if (found.headline !== want.title) bad.push('JSON-LD headline')
    if (!found.datePublished) bad.push('JSON-LD datePublished')
    if (!found.author || found.author.name !== "Kevin O'Brien") bad.push('JSON-LD author')
    if (!found.publisher || found.publisher.name !== 'The Padel Doc') bad.push('JSON-LD publisher')
  }
  return bad
}

async function main() {
  const base = process.argv[2]
  const drafts = process.argv.includes('--drafts')
  if (!base) { console.error('usage: node scripts/research-check.mjs <base url> [--drafts]'); process.exit(2) }
  const { loadPosts, postPath } = await import(pathToFileURL(join(ROOT, 'app', 'research', 'posts.ts')).href)
  const copy = JSON.parse(readFileSync(join(ROOT, 'app', '_copy', 'research.json'), 'utf8'))
  let fails = 0
  const say = (ok, what, extra = '') => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}${extra ? `: ${extra}` : ''}`); if (!ok) fails++ }
  // Every post must read, its slides included (Kevin 24 Nov 2026): a slide outside /research/img/ or a slide file that
  // isn't in public/ fails the release here (and stops next build).
  let all
  try { all = loadPosts({ dir: join(ROOT, 'content', 'research'), drafts: true, publicDir: join(ROOT, 'public') }) }
  catch (e) { say(false, 'the posts read', e.message); console.log('\n1 check(s) failed'); process.exit(1) }
  say(true, 'the posts read, their slides in public/research/img/')
  const get = async (p) => { const r = await fetch(base + p, { redirect: 'manual' }); return { status: r.status, text: await r.text(), type: r.headers.get('content-type') } }

  const idx = await get('/research')
  say(idx.status === 200, '/research 200', String(idx.status))
  const ib = checkHead(idx.text, { title: copy.indexTitle, description: copy.indexDescription, canonical: '/research', type: 'website', jsonLd: 'Blog' })
  say(!ib.length, '/research head', ib.join('; '))
  const feed = await get('/research/feed.xml')
  say(feed.status === 200 && /rss\+xml/.test(feed.type || ''), '/research/feed.xml', `${feed.status} ${feed.type}`)
  const sitemap = await get('/sitemap.xml')
  say(sitemap.text.includes(`<loc>${SITE}/research</loc>`), 'sitemap has /research')
  for (const p of all) {
    const path = postPath(p.slug)
    const r = await get(path)
    const shown = !p.draft || drafts
    if (!shown) {
      say(r.status === 404, `${path} (draft) is not built`, String(r.status))
      say(!sitemap.text.includes(path), `${path} (draft) not in the sitemap`)
      say(!feed.text.includes(path), `${path} (draft) not in the feed`)
      say(!idx.text.includes(path), `${path} (draft) not on the index`)
      continue
    }
    say(r.status === 200, `${path} 200`, String(r.status))
    const b = checkHead(r.text, { title: p.title, description: p.summary, canonical: path, type: 'article', jsonLd: 'Article' })
    say(!b.length, `${path} head`, b.join('; '))
    say(idx.text.includes(`href="${path}"`), `${path} on the index`)
    say(feed.text.includes(`<link>${SITE}${path}</link>`), `${path} in the feed`)
    say(sitemap.text.includes(`<loc>${SITE}${path}</loc>`) || p.draft, `${path} in the sitemap${p.draft ? ' (a draft: the dev sitemap may list it)' : ''}`)
    if (p.slides) {
      // Counted on the HTML's own attributes: the page data repeats the markup with its quotes escaped (\").
      say(r.text.includes('data-carousel') && (r.text.match(/ aria-roledescription="slide"/g) || []).length === p.slides.length,
        `${path} carousel with ${p.slides.length} slides`)
      for (const s of p.slides) {
        const img = await fetch(base + s.src)
        say(img.status === 200 && /^image\//.test(img.headers.get('content-type') || ''), `${s.src} is served`, `${img.status} ${img.headers.get('content-type')}`)
      }
    }
  }
  console.log(fails ? `\n${fails} check(s) failed` : '\nall research checks passed')
  process.exit(fails ? 1 : 0)
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) await main()
