// thepadeldoc.com/s/<code>: a shared card's page (Kevin 14 Nov 2026; padel-coach-src specs/share-outside-spec.md 3 and
// 10). The page is the player bundle (netlify.toml /s/*); this puts the preview's og: and twitter: tags in it from the
// Worker's share, with the wide 1200 x 630 card as the image, and marks every /s/ page noindex (a header and a tag),
// whatever the Worker says. Slow, down or taken down: the plain page goes out, still noindex. The rules are
// app/share-card.ts.
import { WORKER, shareCodeOf, readShare, metaTags, withTags, ROBOTS } from '../../app/share-card.ts'
import { siteFrom, edgeEnv, SITE_VAR } from '../../app/worker-default.ts'

type Context = { next: () => Promise<Response> }   // the part of Netlify's context used here
const WAIT_MS = 1500
const SITE = siteFrom(edgeEnv(SITE_VAR)) === 'demo' ? 'https://demo.thepadeldoc.com' : 'https://thepadeldoc.com'

export default async (request: Request, context: Context) => {
  const url = new URL(request.url)
  const code = shareCodeOf(url.pathname)
  const [page, share] = await Promise.all([
    context.next(),
    code ? fetch(`${WORKER}/v1/shares/${code}`, { signal: AbortSignal.timeout(WAIT_MS) })
      .then((r) => (r.ok ? r.json() : null)).then(readShare).catch(() => null) : Promise.resolve(null),
  ])
  const headers = new Headers(page.headers)
  headers.set('X-Robots-Tag', ROBOTS)
  if (!(page.headers.get('content-type') || '').includes('text/html')) return new Response(page.body, { status: page.status, headers })
  const html = withTags(await page.text(), metaTags(share, `${SITE}/s/${code || ''}`))
  headers.delete('content-length')
  headers.delete('etag')
  return new Response(html, { status: page.status, headers })
}

export const config = { path: '/s/*' }
