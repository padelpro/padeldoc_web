// The head check the research pages are held to (scripts/research-check.mjs): it passes a full head and names each gap.
import test from 'node:test'
import assert from 'node:assert/strict'
import { checkHead } from './research-check.mjs'

const want = { title: 'A post', description: 'One sentence.', canonical: '/research/a-post', type: 'article', jsonLd: 'Article' }
const ld = { '@type': 'Article', headline: 'A post', datePublished: '2026-11-17', author: { name: "Kevin O'Brien" }, publisher: { name: 'The Padel Doc' } }
const head = (o = {}) => {
  const v = { title: 'A post · Padel Doc', desc: 'One sentence.', canon: 'https://thepadeldoc.com/research/a-post', ogType: 'article', ld, ...o }
  return `<html><head><title>${v.title}</title><meta name="description" content="${v.desc}"/>
<link rel="canonical" href="${v.canon}"/><meta property="og:title" content="A post"/><meta property="og:description" content="One sentence."/>
<meta property="og:url" content="https://thepadeldoc.com/research/a-post"/><meta property="og:type" content="${v.ogType}"/>
<meta property="og:image" content="https://thepadeldoc.com/research/img/a.jpg"/><meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="A post"/><meta name="twitter:description" content="One sentence."/>
<meta name="twitter:image" content="https://thepadeldoc.com/research/img/a.jpg"/></head><body>
<script type="application/ld+json">${JSON.stringify(v.ld)}</script></body></html>`
}

test('a full head passes', () => assert.deepEqual(checkHead(head(), want), []))

test('each gap is named', () => {
  assert.match(checkHead(head({ title: 'Something else' }), want).join(), /title/)
  assert.match(checkHead(head({ desc: 'Other' }), want).join(), /description/)
  assert.match(checkHead(head({ canon: 'https://thepadeldoc.com/research' }), want).join(), /canonical/)
  assert.match(checkHead(head({ ogType: 'website' }), want).join(), /og:type/)
  assert.match(checkHead(head({ ld: { ...ld, author: { name: 'Someone' } } }), want).join(), /author/)
  assert.match(checkHead(head().replace(/<meta name="twitter:card"[^>]*>/, ''), want).join(), /twitter:card/)
  assert.match(checkHead(head().replace(/<script[\s\S]*<\/script>/, ''), want).join(), /JSON-LD/)
})
