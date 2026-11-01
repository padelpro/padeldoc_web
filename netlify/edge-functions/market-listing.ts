// thepadeldoc.com/community/market/l/<id>: a shared Marketplace listing (Kevin 1 Nov 2026). The page is the player
// bundle (netlify.toml /community/*); this puts og: and twitter: tags in it from the Worker's card, so WhatsApp and
// Facebook show the title, price, condition, town and the first photo. If the Worker is slow or down, or the listing
// is gone, the plain page goes out as it is. The rules are app/market-card.ts.
import { WORKER, listingIdOf, readCard, metaTags, withTags } from '../../app/market-card.ts'

type Context = { next: () => Promise<Response> }   // the part of Netlify's context used here
const WAIT_MS = 1500

export default async (request: Request, context: Context) => {
  const url = new URL(request.url)
  const id = listingIdOf(url.pathname)
  if (!id) return
  const [page, card] = await Promise.all([
    context.next(),
    fetch(`${WORKER}/v1/market/listings/${id}/card`, { signal: AbortSignal.timeout(WAIT_MS) })
      .then((r) => (r.ok ? r.json() : null)).then(readCard).catch(() => null),
  ])
  if (!card || !(page.headers.get('content-type') || '').includes('text/html')) return page
  const html = withTags(await page.text(), metaTags(card, `https://thepadeldoc.com/community/market/l/${id}`))
  const headers = new Headers(page.headers)
  headers.delete('content-length')
  headers.delete('etag')
  return new Response(html, { status: page.status, headers })
}

export const config = { path: '/community/market/l/*' }
