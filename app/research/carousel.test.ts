// The slide carousel on a research post (Kevin 24 Nov 2026): the slides and hook front matter, the slide files, the card
// picture rule, the carousel's markup with JavaScript on and off, and posts without slides left exactly as they were.
import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync, readdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { postFrom, loadPosts, imageSize, withSlideFiles, articleJsonLd, feedXml, latestJson, type Post } from './posts.ts'
import { carouselHtml } from './carousel.ts'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (...p: string[]) => readFileSync(join(root, ...p), 'utf8')
const copy = JSON.parse(read('app', '_copy', 'research.json'))
const SLUG = '2026-11-24-a'

const front = (o: Record<string, string>, extra = '') =>
  `---\n${Object.entries(o).map(([k, v]) => `${k}: ${v}`).join('\n')}${extra}\n---\nBody.\n`
const base = { title: '"Does it work?"', slug: `"${SLUG}"`, date: '"2026-11-24"', summary: '"One sentence."', tags: '["padel"]', type: '"roundup"', draft: 'false' }
// One slide a line, the last without a comma.
const FIVE = '\nslides: [\n  "/research/img/a/1.png | The first slide, said in words",\n  "/research/img/a/2.png",\n  "/research/img/a/3.png",\n  "/research/img/a/4.png",\n  "/research/img/a/5.png"\n]'

// A PNG header with a size: enough for imageSize (and served as an image/png file).
const png = (w: number, h: number) => {
  const b = Buffer.alloc(33)
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13, 0x49, 0x48, 0x44, 0x52]).copy(b)
  b.writeUInt32BE(w, 16); b.writeUInt32BE(h, 20)
  return b
}

test('slides and hook: read when present, one slide a line, the alt after |, a default alt when it has none', () => {
  const p = postFrom(front({ ...base, hook: '"Got 30 seconds?"' }, FIVE), SLUG)
  assert.equal(p.slides!.length, 5)
  assert.deepEqual(p.slides![0], { src: '/research/img/a/1.png', alt: 'The first slide, said in words' })
  assert.deepEqual(p.slides![1], { src: '/research/img/a/2.png', alt: 'Slide 2 of 5: Does it work?' })
  assert.equal(p.hook, 'Got 30 seconds?')
  // One line works too.
  const one = postFrom(front({ ...base, slides: '["/research/img/x.jpg"]' }), SLUG)
  assert.deepEqual(one.slides, [{ src: '/research/img/x.jpg', alt: 'Slide 1 of 1: Does it work?' }])
  assert.equal('hook' in one, false, 'no hook: the default is the page\'s')
})

test('slides absent: no slides or hook keys at all, and a hook without slides is ignored', () => {
  const p = postFrom(front({ ...base, image: '"/og.png"' }), SLUG)
  assert.deepEqual(Object.keys(p).sort(), ['body', 'date', 'draft', 'image', 'slug', 'summary', 'tags', 'title', 'type'])
  const h = postFrom(front({ ...base, image: '"/og.png"', hook: '"Swipe?"' }), SLUG)
  assert.equal('hook' in h, false)
  assert.equal('slides' in postFrom(front({ ...base, slides: '[]' }), SLUG), false, 'an empty list is no slides')
})

test('slides: a path outside /research/img/ or not a picture is refused; em dashes are refused', () => {
  const bad = ['"/og.png"', '"/research/img/../secret.jpg"', '"research/img/a.jpg"', '"https://x.com/research/img/a.jpg"',
    '"/research/img/a.gif"', '"/research/img/a.svg"', '"/research/imgs/a.jpg"', '"//research/img/a.jpg"']
  for (const s of bad) assert.throws(() => postFrom(front({ ...base, slides: `[${s}]` }), SLUG), /under \/research\/img\//, s)
  assert.throws(() => postFrom(front({ ...base, slides: '"/research/img/a.jpg"' }), SLUG), /slides must be a list/)
  const dash = String.fromCharCode(0x2014)
  assert.throws(() => postFrom(front({ ...base, slides: '["/research/img/a.jpg"]', hook: `"Short ${dash} swipe"` }), SLUG), /hook: no em dashes/)
  assert.throws(() => postFrom(front({ ...base, slides: `["/research/img/a.jpg | A ${dash} B"]` }), SLUG), /alt: no em dashes/)
  assert.throws(() => postFrom(front({ ...base, slides: '["/research/img/a.jpg"]', hook: '""' }), SLUG), /hook must be text/)
  assert.throws(() => postFrom(front({ ...base, slides: '["/research/img/a.jpg"' }), SLUG), /must end with \]/)
})

test('slide files: a missing file stops loadPosts (so the build); a present one gives its size', () => {
  const dir = mkdtempSync(join(tmpdir(), 'carousel-'))
  try {
    const content = join(dir, 'content', 'research')
    const img = join(dir, 'public', 'research', 'img', 'a')
    mkdirSync(content, { recursive: true }); mkdirSync(img, { recursive: true })
    writeFileSync(join(content, `${SLUG}.md`), front(base, FIVE))
    for (const n of [1, 2, 3, 4]) writeFileSync(join(img, `${n}.png`), png(1080, 1350))
    assert.throws(() => loadPosts({ dir: content, drafts: true }), /slide 5 \/research\/img\/a\/5\.png is not in public/)
    writeFileSync(join(img, '5.png'), png(1080, 1080))
    const [p] = loadPosts({ dir: content, drafts: true })
    assert.deepEqual(p.slides!.map((s) => [s.width, s.height]), [[1080, 1350], [1080, 1350], [1080, 1350], [1080, 1350], [1080, 1080]])
  } finally { rmSync(dir, { recursive: true, force: true }) }
})

test('imageSize: PNG, JPEG and WebP headers; null for anything else', () => {
  assert.deepEqual(imageSize(png(1080, 1350)), { width: 1080, height: 1350 })
  const jpg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 4, 0, 0, 0xff, 0xc0, 0, 11, 8, 0x05, 0x46, 0x04, 0x38, 3, 0, 0, 0, 0])
  assert.deepEqual(imageSize(jpg), { width: 1080, height: 1350 })
  const webp = Buffer.alloc(32)
  webp.write('RIFF', 0); webp.write('WEBP', 8); webp.write('VP8X', 12); webp.writeUIntLE(1079, 24, 3); webp.writeUIntLE(1079, 27, 3)
  assert.deepEqual(imageSize(webp), { width: 1080, height: 1080 })
  assert.equal(imageSize(Buffer.from('not a picture at all, just text')), null)
})

test('the card picture: no image and slides, the first slide; its own image kept; neither, /og.png', () => {
  const s = postFrom(front(base, FIVE), SLUG)
  assert.equal(s.image, '/research/img/a/1.png')
  assert.match(articleJsonLd(s), /"image":\["https:\/\/thepadeldoc\.com\/research\/img\/a\/1\.png"\]/, 'og and JSON-LD follow p.image')
  assert.equal(postFrom(front({ ...base, image: '"own.jpg"' }, FIVE), SLUG).image, 'own.jpg')
  assert.equal(postFrom(front(base), SLUG).image, '/og.png')
  // The pages take every picture from p.image: the card, og, twitter, JSON-LD.
  const page = read('app', 'research', '[slug]', 'page.tsx')
  assert.match(page, /const img = \{ url: imageUrl\(p\.image\)/)
  assert.match(read('app', 'research', 'page.tsx'), /<img src=\{imageUrl\(p\.image\)\}/)
})

test('RSS and latest.json: the same structure and fields with slides as without', () => {
  const withSlides = postFrom(front(base, FIVE), SLUG)
  const plain: Post = { ...withSlides }
  delete plain.slides
  assert.equal(feedXml([withSlides], copy), feedXml([plain], copy))
  assert.deepEqual(Object.keys(latestJson([withSlides])!).sort(), ['date', 'slug', 'summary', 'title'])
})

const five = (): Post => withSlideFilesFake(postFrom(front({ ...base, title: '"A <b>& title?"' }, FIVE), SLUG))
function withSlideFilesFake(p: Post): Post {
  return { ...p, slides: p.slides!.map((s, i) => ({ ...s, width: 1080, height: i === 4 ? 1080 : 1350 })) }
}

test('the markup: a labelled carousel, five slides "n of 5", five 44 px dot buttons, the counter, the hook', () => {
  const html = carouselHtml(five(), copy.carousel)
  assert.match(html, /^<section class="r-car" data-carousel aria-roledescription="carousel" aria-label="Slides: A &lt;b&gt;&amp; title\?" style="--car-w:1080;--car-h:1350">/)
  assert.equal((html.match(/role="group" aria-roledescription="slide"/g) || []).length, 5)
  for (let n = 1; n <= 5; n++) assert.ok(html.includes(`aria-label="${n} of 5"`), `slide ${n}`)
  assert.equal((html.match(/<button type="button" class="r-car-dot"/g) || []).length, 5)
  assert.ok(html.includes('aria-label="Go to slide 3"'))
  assert.equal((html.match(/aria-current="true"/g) || []).length, 1, 'the first dot is current')
  assert.ok(html.includes('<span class="r-car-count" data-car-count aria-hidden="true">1 / 5</span>'))
  assert.ok(html.includes('aria-label="Previous slide" disabled'))
  assert.ok(html.includes('aria-label="Next slide">'))
  assert.ok(html.includes('aria-live="polite"'), 'screen readers hear "Slide 3 of 5" as it moves')
  assert.ok(html.includes('<p class="r-car-hook">Short on time? Swipe the slides.</p>'), 'the default hook')
  assert.ok(carouselHtml({ ...five(), hook: 'Got <30> seconds?' }, copy.carousel).includes('<p class="r-car-hook">Got &lt;30&gt; seconds?</p>'))
  // Every slide has real alt text; the first loads at once, the rest lazily; each keeps its own size.
  const imgs = html.match(/<img [^>]*>/g)!
  assert.equal(imgs.length, 5)
  assert.ok(imgs[0].includes('alt="The first slide, said in words"') && imgs[0].includes('fetchpriority="high"') && !imgs[0].includes('loading='))
  for (const i of imgs.slice(1)) assert.ok(i.includes('loading="lazy"') && /alt="Slide \d of 5: A &lt;b&gt;&amp; title\?"/.test(i), i)
  assert.ok(imgs[4].includes('width="1080" height="1080"'))
  assert.ok(!html.includes('autoplay'))
  assert.equal(carouselHtml(postFrom(front(base), SLUG), copy.carousel), '', 'no slides, no carousel')
})

test('with JavaScript off: a scroll row that snaps, the controls hidden until carousel-wire shows them', () => {
  const html = carouselHtml(five(), copy.carousel)
  assert.ok(html.includes('<ul class="r-car-track" tabindex="0" data-car-track>'), 'a focusable row: arrow keys scroll it without JS')
  assert.ok(html.includes('<div class="r-car-bar" data-car-controls hidden>'))
  const css = read('app', 'globals.css')
  assert.match(css, /\.r-car-track \{[^}]*overflow-x: auto;[^}]*scroll-snap-type: x mandatory;/)
  assert.match(css, /\.r-car-slide \{[^}]*flex: 0 0 min\(86%,[^}]*aspect-ratio: var\(--car-w\) \/ var\(--car-h\); scroll-snap-align: start;/, 'the next slide peeks; the shape is fixed')
  assert.match(css, /\.r-car-bar\[hidden\] \{ display: none; \}/)
  assert.match(css, /\.r-car-dot \{ width: 44px; height: 44px;/)
  assert.match(css, /\.r-car-arrow \{[^}]*width: 44px; height: 44px;/)
  assert.match(css, /@media \(prefers-reduced-motion: no-preference\) \{ \.r-car-track \{ scroll-behavior: smooth; \} \}/)
  const wire = read('app', 'research', 'carousel-wire.ts')
  assert.match(wire, /bar\.hidden = false/)
  assert.match(wire, /prefers-reduced-motion: reduce/)
  assert.match(wire, /ArrowRight/)
  assert.match(wire, /ArrowLeft/)
  assert.ok(!/setInterval|setTimeout/.test(wire), 'no autoplay')
})

test('posts without slides: the post page draws them as before, and no real post has slides', () => {
  const page = read('app', 'research', '[slug]', 'page.tsx')
  assert.ok(page.includes(`) : (\n          <img src={imageUrl(p.image)} alt={copy.imageAlt.replace('{title}', p.title)} className="mt-8 w-full rounded-xl border border-edge bg-panel-2" />\n        )}`),
    'the hero picture, unchanged, for a post without slides')
  const content = join(root, 'content', 'research')
  for (const f of readdirSync(content).filter((f) => f.endsWith('.md'))) {
    const p = postFrom(readFileSync(join(content, f), 'utf8'), f.slice(0, -3))
    assert.equal('slides' in p || 'hook' in p, false, f)
    assert.equal(withSlideFiles(p, '/nowhere'), p, 'no slides: the post untouched')
  }
  // The list shows "5 slides" beside a post that has them, and nothing beside one that hasn't.
  assert.match(read('app', 'research', 'page.tsx'), /\{p\.slides && <span>\{copy\.slidesCount\.replace\('\{n\}', String\(p\.slides\.length\)\)\}<\/span>\}/)
  assert.equal(copy.slidesCount.replace('{n}', '5'), '5 slides')
})

test('the 17 Nov deep dive is in sentence case', () => {
  const p = postFrom(read('content', 'research', '2026-11-17-padel-app-stats.md'), '2026-11-17-padel-app-stats')
  assert.equal(p.title, "Can you trust your padel app's stats?")
})
