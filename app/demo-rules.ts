// The demo site's own rules at the edge (padel-coach-src specs/demo-site-spec.md 6.3, 9.3 and 10.2; Kevin 12 Nov 2026,
// D7). Pure: netlify/demo/demo-site.ts is the edge function, on the demo site only.
// - /unsubscribe and /cal/*: netlify.toml proxies these to production's Worker for thepadeldoc.com. The demo has no
//   email and no calendar feed, and nothing on the demo may reach production's Worker: 404 here, before the proxy.
// - Every other answer goes out with X-Robots-Tag: noindex.
export const ROBOTS_HEADER = 'X-Robots-Tag'
export const ROBOTS_VALUE = 'noindex'

export function demoRule(pathname: string): 'gone' | 'pass' {
  const p = pathname.replace(/\/+$/, '').toLowerCase()
  if (p === '/unsubscribe' || p === '/cal' || p.startsWith('/cal/')) return 'gone'
  return 'pass'
}
