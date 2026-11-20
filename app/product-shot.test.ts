// node --test app/product-shot.test.ts
// The framed product screenshot (Kevin 20 Nov 2026): a laptop and a phone outline in plain CSS; alt text required;
// lazy-loaded with its width and height set; and not on any page yet (Kevin picks from the contact sheet first).
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = readFileSync(join(root, 'app', 'product-shot.tsx'), 'utf8')
const css = readFileSync(join(root, 'app', 'product-shot.module.css'), 'utf8')

test('the component: alt required, lazy, width and height set for each frame', () => {
  assert.match(src, /\n\s*alt: string\s/, 'alt is required by its type')
  assert.doesNotMatch(src, /alt\?:/, 'never optional')
  assert.match(src, /if \(!alt \|\| !alt\.trim\(\)\) throw new Error/, 'and an empty one stops the build')
  assert.match(src, /<img className=\{styles\.shot\} src=\{productShotSrc\(name, frame\)\} alt=\{alt\} width=\{size\.width\} height=\{size\.height\} loading="lazy" decoding="async" \/>/)
  assert.equal((src.match(/<img /g) || []).length, 1, 'one picture, one place its attributes are set')
  assert.match(src, /laptop: \{ suffix: 1440, width: 1440, height: 900 \}/)
  assert.match(src, /phone: \{ suffix: 390, width: 780, height: 1688 \}/, 'the 390 x 844 phone at 2x')
  assert.match(src, /`\/images\/product\/\$\{name\}-\$\{PRODUCT_SHOTS\[frame\]\.suffix\}\.webp`/)
  assert.match(src, /frame === 'phone' \?/)
  assert.match(src, /<div className=\{styles\.base\} aria-hidden="true" \/>/, "the laptop's base is decoration")
})

test('the frames are plain CSS: no image, no script; a laptop and a phone', () => {
  for (const cls of ['.frame', '.shot', '.laptop', '.lid', '.base', '.phone']) assert.ok(css.includes(`${cls} {`) || css.includes(`${cls} `), cls)
  assert.doesNotMatch(css, /url\(/, 'drawn, not a picture')
  assert.doesNotMatch(css, /@import/)
  assert.match(css, /\.shot \{[^}]*width: 100%;[^}]*height: auto;/, 'the picture scales with its frame')
  assert.match(css, /border-radius/)
})

test("it isn't on a page yet, and a picture that is there is a WebP under 200 KB", () => {
  const files = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? files(join(dir, e.name)) : /\.(tsx|ts)$/.test(e.name) ? [join(dir, e.name)] : [])
  const users = files(join(root, 'app')).filter((f) => !/product-shot\.(tsx|test\.ts)$/.test(f) && /product-shot|ProductShot/.test(readFileSync(f, 'utf8')))
  assert.deepEqual(users, [], 'no page places one yet (Kevin 20 Nov 2026: he picks first)')
  const dir = join(root, 'public', 'images', 'product')
  assert.ok(!existsSync(join(root, 'public', 'img')), 'no new top-level img/ folder: it would be a profile name to reserve (profile-path.ts SITE_PATHS)')
  if (!existsSync(dir)) return   // before the first npm run shots
  const shots = readdirSync(dir).filter((f) => f.endsWith('.webp'))
  for (const f of shots) {
    assert.match(f, /^[a-z0-9]+(?:-[a-z0-9]+)*-(1440|390)\.webp$/, f)
    assert.ok(statSync(join(dir, f)).size <= 200 * 1024, `${f} is over 200 KB`)
    const head = readFileSync(join(dir, f)).subarray(0, 12).toString('latin1')
    assert.ok(head.startsWith('RIFF') && head.endsWith('WEBP'), `${f} is a WebP`)
  }
  // Every screen has both sizes.
  const names = new Set(shots.map((f) => f.replace(/-(1440|390)\.webp$/, '')))
  for (const n of names) for (const w of [1440, 390]) assert.ok(shots.includes(`${n}-${w}.webp`), `${n}-${w}.webp`)
})
