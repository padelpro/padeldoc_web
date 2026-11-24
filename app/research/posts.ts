// The research blog (padel-coach-src specs/research-blog-spec.md; Kevin 17 and 18 Nov 2026): one markdown file a post in
// content/research/<slug>.md, read at build time. Pure parts here (front matter, the safe renderer, the feed, JSON-LD),
// tested in research.test.ts; the pages are in this folder. No CMS, no database.
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { Marked, Renderer, type Tokens } from 'marked'

export const SITE = 'https://thepadeldoc.com'
export const AUTHOR = "Kevin O'Brien"
export const PUBLISHER = 'The Padel Doc'
export const TYPES = ['roundup', 'deep-dive'] as const
export type PostType = (typeof TYPES)[number]

export type Post = {
  title: string
  kicker?: string         // optional: a small line above the title on the post page only (Kevin 24 Nov 2026), no date in it
  slug: string
  date: string            // YYYY-MM-DD
  summary: string
  image: string           // a file in public/research/img/, or a site path starting with /. With no image in the front
                          // matter: the first slide, else /og.png (Kevin 24 Nov 2026)
  tags: string[]
  type: PostType
  draft: boolean
  body: string            // the markdown after the front matter
  slides?: Slide[]        // optional: the post's Instagram slides, a carousel above the body (Kevin 24 Nov 2026)
  hook?: string           // optional, slides only: the line above the carousel (the default is in _copy/research.json)
}

// A slide: a picture under /research/img/ and its alt text. width and height are read from the file by loadPosts.
export type Slide = { src: string; alt: string; width?: number; height?: number }

export const SLIDE_PATH = /^\/research\/img\/(?:[\w-]+\/)*[\w-][\w.-]*\.(?:jpe?g|png|webp)$/i
export const DEFAULT_IMAGE = '/og.png'
const EM_DASH = String.fromCharCode(0x2014)

// --- Front matter: the small YAML the spec shows (key: "text", key: [ "a", "b" ], key: true, # comments) -------------
// A "quoted" string from the start of s: [value, the rest]. A # inside the quotes is part of the text.
function quoted(s: string, where: string): [string, string] {
  let i = 1
  while (i < s.length && s[i] !== '"') i += s[i] === '\\' ? 2 : 1
  if (i >= s.length) throw new Error(`${where}: a quoted value must be closed`)
  return [JSON.parse(s.slice(0, i + 1)) as string, s.slice(i + 1)]
}

const onlyComment = (rest: string, where: string) => {
  if (rest.trim() && !/^\s+#/.test(rest)) throw new Error(`${where}: unexpected "${rest.trim()}" after the value`)
}

function scalar(raw: string, where: string): string | boolean | string[] {
  const v = raw.trim()
  if (v.startsWith('"')) {
    const [text, rest] = quoted(v, where)
    onlyComment(rest, where)
    return text
  }
  if (v.startsWith('[')) {
    const items: string[] = []
    let s = v.slice(1).trimStart()
    while (!s.startsWith(']')) {
      if (!s) throw new Error(`${where}: a list must end with ]`)
      let item: string
      if (s.startsWith('"')) [item, s] = quoted(s, where)
      else { const m = /^[^,\]]*/.exec(s)![0]; item = m.trim(); s = s.slice(m.length) }
      items.push(item)
      s = s.trimStart()
      if (s.startsWith(',')) s = s.slice(1).trimStart()
      else if (!s) throw new Error(`${where}: a list must end with ]`)
      else if (!s.startsWith(']')) throw new Error(`${where}: items in a list are split by commas`)
    }
    onlyComment(s.slice(1), where)
    return items.filter((x) => x !== '')
  }
  const bare = v.replace(/\s+#.*$/, '').trim()
  if (bare === 'true') return true
  if (bare === 'false') return false
  return bare
}

export function splitFrontMatter(text: string, where = 'post'): { data: Record<string, unknown>; body: string } {
  const src = text.replace(/^﻿/, '').replace(/\r\n/g, '\n')
  const m = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(src)
  if (!m) throw new Error(`${where}: no front matter (--- lines at the top)`)
  const data: Record<string, unknown> = {}
  const lines = m[1].split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim() || line.trim().startsWith('#')) continue
    const kv = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line)
    if (!kv) throw new Error(`${where}: can't read the line "${line}"`)
    // A [ list may run over several lines (the slides, one a line) until its ]: the lines are joined and read as one.
    let raw = kv[2]
    for (;;) {
      try { data[kv[1]] = scalar(raw, `${where} ${kv[1]}`); break } catch (e) {
        if (!/must end with \]/.test((e as Error).message) || i + 1 >= lines.length || /^[A-Za-z_][\w-]*:/.test(lines[i + 1])) throw e
        raw += ' ' + lines[++i].trim()
      }
    }
  }
  return { data, body: m[2] }
}

export function postFrom(text: string, fileSlug: string): Post {
  const where = `content/research/${fileSlug}.md`
  const { data, body } = splitFrontMatter(text, where)
  const str = (k: string) => {
    const v = data[k]
    if (typeof v !== 'string' || !v.trim()) throw new Error(`${where}: ${k} is missing`)
    return v.trim()
  }
  const slug = str('slug')
  if (slug !== fileSlug) throw new Error(`${where}: slug "${slug}" must be the file's name`)
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`${where}: slug may hold a-z, 0-9 and single hyphens only`)
  const date = str('date')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) throw new Error(`${where}: date must be YYYY-MM-DD`)
  const type = str('type')
  if (!(TYPES as readonly string[]).includes(type)) throw new Error(`${where}: type must be roundup or deep-dive`)
  const tags = data.tags === undefined ? [] : data.tags
  if (!Array.isArray(tags)) throw new Error(`${where}: tags must be a list`)
  const title = str('title')
  const slides = slidesFrom(data.slides, title, where)
  // The picture for the card, og, twitter and JSON-LD: the post's own image, else its first slide, else the site's.
  const image = data.image !== undefined ? str('image') : slides ? slides[0].src : DEFAULT_IMAGE
  if (!/^[\w.-]+\.(jpe?g|png|webp|gif|avif)$/i.test(image) && !/^\/[\w./-]+\.(jpe?g|png|webp|gif|avif)$/i.test(image)) {
    throw new Error(`${where}: image must be a file name in public/research/img/ (or a site path)`)
  }
  if (data.draft !== undefined && typeof data.draft !== 'boolean') throw new Error(`${where}: draft must be true or false`)
  if (data.kicker !== undefined && (typeof data.kicker !== 'string' || !data.kicker.trim())) throw new Error(`${where}: kicker must be text`)
  const kicker = data.kicker === undefined ? {} : { kicker: (data.kicker as string).trim() }
  if (data.hook !== undefined && (typeof data.hook !== 'string' || !data.hook.trim())) throw new Error(`${where}: hook must be text`)
  if (typeof data.hook === 'string' && data.hook.includes(EM_DASH)) throw new Error(`${where}: hook: no em dashes`)
  // A post without slides ignores its hook.
  const extra = slides ? { slides, ...(typeof data.hook === 'string' ? { hook: data.hook.trim() } : {}) } : {}
  return { title, ...kicker, slug, date, summary: str('summary'), image, tags: tags.map(String), type: type as PostType,
    draft: data.draft === true, body, ...extra }
}

// slides: ["/research/img/a-1.jpg | Alt text", "/research/img/a-2.jpg", ...]: a path under /research/img/ (jpg, png or
// webp), then optionally " | " and the alt text. No alt: "Slide N of M: <title>". undefined when there are none.
function slidesFrom(v: unknown, title: string, where: string): Slide[] | undefined {
  if (v === undefined) return undefined
  if (!Array.isArray(v)) throw new Error(`${where}: slides must be a list`)
  if (!v.length) return undefined
  return v.map((item, i) => {
    const s = String(item)
    const bar = s.indexOf('|')
    const src = (bar < 0 ? s : s.slice(0, bar)).trim()
    const alt = bar < 0 ? '' : s.slice(bar + 1).trim()
    if (!SLIDE_PATH.test(src)) throw new Error(`${where}: slide ${i + 1} "${src}" must be a .jpg, .png or .webp under /research/img/`)
    if (alt.includes(EM_DASH)) throw new Error(`${where}: slide ${i + 1} alt: no em dashes`)
    return { src, alt: alt || `Slide ${i + 1} of ${v.length}: ${title}` }
  })
}

// Width and height of a JPEG, PNG or WebP from its bytes, or null.
export function imageSize(b: Uint8Array): { width: number; height: number } | null {
  const u16 = (i: number) => (b[i] << 8) | b[i + 1]
  const u32 = (i: number) => ((b[i] << 24) | (b[i + 1] << 16) | (b[i + 2] << 8) | b[i + 3]) >>> 0
  const le16 = (i: number) => b[i] | (b[i + 1] << 8)
  const le24 = (i: number) => b[i] | (b[i + 1] << 8) | (b[i + 2] << 16)
  const ascii = (i: number, n: number) => String.fromCharCode(...b.slice(i, i + n))
  if (b.length > 24 && b[0] === 0x89 && ascii(1, 3) === 'PNG') return { width: u32(16), height: u32(20) }
  if (b.length > 30 && ascii(0, 4) === 'RIFF' && ascii(8, 4) === 'WEBP') {
    const kind = ascii(12, 4)
    if (kind === 'VP8X') return { width: le24(24) + 1, height: le24(27) + 1 }
    if (kind === 'VP8L') { const n = b[21] | (b[22] << 8) | (b[23] << 16) | (b[24] << 24); return { width: (n & 0x3fff) + 1, height: ((n >>> 14) & 0x3fff) + 1 } }
    if (kind === 'VP8 ') return { width: le16(26) & 0x3fff, height: le16(28) & 0x3fff }
    return null
  }
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) { i++; continue }
      const marker = b[i + 1]
      if (marker === 0xff) { i++; continue }
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return { width: u16(i + 7), height: u16(i + 5) }
      if (marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd7) || marker === 0x01) { i += 2; continue }
      i += 2 + u16(i + 2)
    }
  }
  return null
}

// The slides' files (Kevin 24 Nov 2026): each must exist in public/ (else the build stops), and each gets its size.
export function withSlideFiles(p: Post, publicDir: string): Post {
  if (!p.slides) return p
  const slides = p.slides.map((s, i) => {
    const file = join(publicDir, ...s.src.split('/').filter(Boolean))
    if (!existsSync(file)) throw new Error(`content/research/${p.slug}.md: slide ${i + 1} ${s.src} is not in public${s.src}`)
    const size = imageSize(readFileSync(file))
    return size ? { ...s, ...size } : s
  })
  return { ...p, slides }
}

// The release build (next build) leaves drafts out; next dev and the tests can show them.
export const showDrafts = (env: Record<string, string | undefined> = process.env): boolean => env.NODE_ENV !== 'production'

export const CONTENT_DIR = join(process.cwd(), 'content', 'research')

// Every post, newest first (then by title), drafts only when asked for. Slides are checked against publicDir (by default
// the public/ beside content/): a missing slide file stops the build.
export function loadPosts({ dir = CONTENT_DIR, drafts = showDrafts(), publicDir = join(dir, '..', '..', 'public') }:
  { dir?: string; drafts?: boolean; publicDir?: string } = {}): Post[] {
  if (!existsSync(dir)) return []
  const posts = readdirSync(dir).filter((f) => f.endsWith('.md'))
    .map((f) => postFrom(readFileSync(join(dir, f), 'utf8'), f.slice(0, -3)))
    .filter((p) => drafts || !p.draft)
    .map((p) => withSlideFiles(p, publicDir))
  return posts.sort((a, b) => (a.date === b.date ? a.title.localeCompare(b.title) : a.date < b.date ? 1 : -1))
}

// The home page's Latest research card (Kevin 18 Nov 2026): the newest of the posts given, whatever their order, or null
// for no card. Given loadPosts(), in the release build that is the newest released post (drafts are already out); in
// next dev a draft can be it. On the same date, the first by title, as /research lists them.
export const latestPost = (posts: Post[]): Post | null =>
  posts.reduce<Post | null>((best, p) => (!best || p.date > best.date || (p.date === best.date && p.title.localeCompare(best.title) < 0) ? p : best), null)

// /research/latest.json (Kevin 23 Nov 2026): what the app needs for its New dot and its Latest research card, and nothing
// of the post's body. null when there is no released post.
export type LatestJson = { slug: string; title: string; date: string; summary: string }
export function latestJson(posts: Post[]): LatestJson | null {
  const p = latestPost(posts)
  return p ? { slug: p.slug, title: p.title, date: p.date, summary: p.summary } : null
}

export const imageUrl = (image: string): string => (image.startsWith('/') ? image : `/research/img/${image}`)
export const postPath = (slug: string): string => `/research/${slug}`

// "17 November 2026": en-IE, from the date alone (no time zone can move it a day).
export function longDate(date: string): string {
  const [y, m, d] = date.split('-').map(Number)
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  return `${d} ${months[m - 1]} ${y}`
}

// --- Markdown to HTML, safe by construction ------------------------------------------------------------------------
// Everything marked writes is escaped text inside tags it chose. The three ways in for anything else are closed: raw
// HTML in a post is shown as text, and a link or an image keeps its address only when it is http(s), mailto (links),
// or a path on this site.
export const escapeHtml = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

export function safeUrl(href: string, kind: 'link' | 'image'): string | null {
  // eslint-disable-next-line no-control-regex
  const h = (href || '').replace(/[\u0000- \u007f-\u009f]/g, '')
  if (!h) return null
  if (/^https?:\/\//i.test(h)) return h
  if (kind === 'link' && /^mailto:/i.test(h)) return h
  if (kind === 'link' && h.startsWith('#')) return h
  if (/^[a-z][a-z0-9+.-]*:/i.test(h)) return null           // any other scheme: javascript:, data:, vbscript: ...
  if (h.startsWith('//')) return null                       // another site without saying so
  return h                                                  // a path on this site, absolute or relative
}

const renderer = new Renderer()
const md = new Marked({
  gfm: true,
  breaks: false,
  renderer: {
    html({ text }: Tokens.HTML | Tokens.Tag) { return escapeHtml(text) },
    link(this: Renderer, { href, title, tokens }: Tokens.Link) {
      const inner = this.parser.parseInline(tokens)
      const url = safeUrl(href, 'link')
      if (!url) return inner
      const t = title ? ` title="${escapeHtml(title)}"` : ''
      const ext = /^https?:\/\//i.test(url) && !url.startsWith(SITE) ? ' rel="noopener noreferrer"' : ''
      return `<a href="${escapeHtml(url)}"${t}${ext}>${inner}</a>`
    },
    image({ href, title, text }: Tokens.Image) {
      const url = safeUrl(href, 'image')
      if (!url) return escapeHtml(text)
      const src = /^[\w.-]+$/.test(url) ? imageUrl(url) : url      // a bare file name: from public/research/img/
      const t = title ? ` title="${escapeHtml(title)}"` : ''
      return `<img src="${escapeHtml(src)}" alt="${escapeHtml(text)}"${t} loading="lazy" decoding="async">`
    },
    // Tables scroll sideways in their own box on a narrow phone, never the page.
    table(this: Renderer, token: Tokens.Table) {
      return `<div class="r-table">${renderer.table.call(this, token)}</div>\n`
    },
  },
})

export function renderMarkdown(body: string): string {
  return md.parse(body, { async: false }) as string
}

// --- Page data -----------------------------------------------------------------------------------------------------
// JSON-LD for a post, safe inside <script> (a "<" never closes it).
export function articleJsonLd(p: Post): string {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: p.title,
    description: p.summary,
    datePublished: p.date,
    dateModified: p.date,
    image: [`${SITE}${imageUrl(p.image)}`],
    author: { '@type': 'Person', name: AUTHOR, url: `${SITE}/about` },
    publisher: { '@type': 'Organization', name: PUBLISHER, url: SITE, logo: { '@type': 'ImageObject', url: `${SITE}/icon-512.png` } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE}${postPath(p.slug)}` },
    keywords: p.tags.join(', '),
  }
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

export type FeedCopy = { rssTitle: string; rssDescription: string }

// RSS 2.0, the newest 20 (spec). pubDate in RFC 822, from the post's date at 09:00 UTC.
export function feedXml(posts: Post[], copy: FeedCopy): string {
  const x = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
  const items = posts.slice(0, 20).map((p) => {
    const url = `${SITE}${postPath(p.slug)}`
    return [
      '    <item>',
      `      <title>${x(p.title)}</title>`,
      `      <link>${url}</link>`,
      `      <guid isPermaLink="true">${url}</guid>`,
      `      <pubDate>${new Date(`${p.date}T09:00:00Z`).toUTCString()}</pubDate>`,
      `      <description>${x(p.summary)}</description>`,
      ...p.tags.map((t) => `      <category>${x(t)}</category>`),
      '    </item>',
    ].join('\n')
  })
  const newest = posts[0] ? new Date(`${posts[0].date}T09:00:00Z`).toUTCString() : null
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${x(copy.rssTitle)}</title>`,
    `    <link>${SITE}/research</link>`,
    `    <description>${x(copy.rssDescription)}</description>`,
    '    <language>en-ie</language>',
    `    <atom:link href="${SITE}/research/feed.xml" rel="self" type="application/rss+xml"/>`,
    ...(newest ? [`    <lastBuildDate>${newest}</lastBuildDate>`] : []),
    ...items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n')
}
