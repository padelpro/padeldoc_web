import { IS_DEMO, MAIN_SITE } from '../../site'
import copy from '../../_copy/research.json'
import { feedXml, loadPosts } from '../posts'

// /research/feed.xml: RSS 2.0, the 20 newest posts, written at build time. The demo build has none of its own: it sends
// readers to thepadeldoc.com's (next.config.ts does the same before this is reached).
export const dynamic = 'force-static'

export function GET() {
  if (IS_DEMO) return Response.redirect(`${MAIN_SITE}/research/feed.xml`, 308)
  return new Response(feedXml(loadPosts(), copy), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  })
}
