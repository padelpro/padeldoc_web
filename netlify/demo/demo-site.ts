// demo.thepadeldoc.com only (padel-coach-src specs/demo-site-spec.md 6.3, 9.3 and 10.2; Kevin 12 Nov 2026, D7).
// This file is NOT an edge function where it lies: scripts/demo-prebuild.mjs copies it to
// netlify/edge-functions/demo-site.ts on the demo site's build (PADELDOC_SITE=demo) and nowhere else, so
// thepadeldoc.com's deploy has no such function and answers exactly as before. It checks the variable again itself.
// - /unsubscribe and /cal/* answer 404 here, before netlify.toml's proxies to production's Worker (the demo has no
//   email and no feed, and nothing on the demo reaches production).
// - Every other answer goes out with X-Robots-Tag: noindex, the static tool pages included.
// The rules are app/demo-rules.ts.
import { demoRule, ROBOTS_HEADER, ROBOTS_VALUE } from '../../app/demo-rules.ts'
import { edgeEnv, SITE_VAR } from '../../app/worker-default.ts'

type Context = { next: () => Promise<Response> }   // the part of Netlify's context used here

export default async (request: Request, context: Context) => {
  if (edgeEnv(SITE_VAR) !== 'demo') return
  if (demoRule(new URL(request.url).pathname) === 'gone') {
    return new Response('Not found', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8', [ROBOTS_HEADER]: ROBOTS_VALUE, 'Cache-Control': 'no-store' } })
  }
  const page = await context.next()
  const headers = new Headers(page.headers)
  headers.set(ROBOTS_HEADER, ROBOTS_VALUE)
  return new Response(page.body, { status: page.status, statusText: page.statusText, headers })
}

export const config = { path: '/*' }
