import { IS_DEMO, MAIN_SITE } from '../../site'
import { latestJson, loadPosts } from '../posts'

// /research/latest.json (Kevin 23 Nov 2026): the newest released post's slug, title, date and summary, written at build
// time, for the app's New dot and Latest research card (padel-coach-src src/research/latest.js). The demo build sends
// readers to thepadeldoc.com's, as the feed does.
export const dynamic = 'force-static'

export function GET() {
  if (IS_DEMO) return Response.redirect(`${MAIN_SITE}/research/latest.json`, 308)
  return new Response(JSON.stringify(latestJson(loadPosts())), {
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=600' },
  })
}
