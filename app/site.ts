// Which of the repo's two Netlify sites this build is (padel-coach-src specs/demo-site-spec.md 10.2; Kevin 12 Nov 2026,
// D7): thepadeldoc.com with PADELDOC_SITE unset (exactly as before), demo.thepadeldoc.com with PADELDOC_SITE=demo.
// Read at build time by server components only (the layout, the pages, robots and the sitemap); next.config.ts stops
// the build on any other value.
export const IS_DEMO: boolean = process.env.PADELDOC_SITE === 'demo'
export const MAIN_SITE = 'https://thepadeldoc.com'
export const DEMO_HOST = 'demo.thepadeldoc.com'
// Plausible counts the demo as its own site (spec 9.4, question 7): production's stats never count a demo visit.
export const plausibleDomain = (demo: boolean): string => (demo ? DEMO_HOST : 'thepadeldoc.com')

// On the demo build the marketing pages live on thepadeldoc.com only: each of these moves there, same path.
export const DEMO_MOVED = ['/about', '/coaches', '/players', '/clubs', '/tools', '/tools/:slug', '/contribute', '/cookies']

// /robots.txt (app/robots.ts): thepadeldoc.com open with its sitemap; the demo shut, no sitemap (spec 9.3).
export const robotsFor = (demo: boolean) =>
  demo ? { rules: { userAgent: '*', disallow: '/' } } : { rules: { userAgent: '*', allow: '/' }, sitemap: 'https://thepadeldoc.com/sitemap.xml' }
