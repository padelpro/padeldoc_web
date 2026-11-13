// Which of the repo's two Netlify sites this build is (padel-coach-src specs/demo-site-spec.md 10.2; Kevin 12 Nov 2026,
// D7): thepadeldoc.com with PADELDOC_SITE unset (exactly as before), demo.thepadeldoc.com with PADELDOC_SITE=demo.
// Read at build time by server components only (the layout, the pages, robots and the sitemap); next.config.ts stops
// the build on any other value.
export const IS_DEMO: boolean = process.env.PADELDOC_SITE === 'demo'

// Launch 1 (Kevin 13 Nov 2026; padel-coach-src specs/launch-1-scope.md): the one line that makes the launch page the
// home page. false: today's home page, with the launch page at /preview/launch. true: / is the launch page; the old
// role pages (/players, /coaches, /clubs), which sell things that aren't open yet, go to it; they and the box league
// page leave the sitemap; the footer loses Clubs. Undo: back to false.
export const LAUNCH_HOME: boolean = false
// The pages that go to the launch page while LAUNCH_HOME is on.
export const LAUNCH_MOVED = ['/players', '/coaches', '/clubs', '/tools/box-league']
export const MAIN_SITE = 'https://thepadeldoc.com'
export const DEMO_HOST = 'demo.thepadeldoc.com'
// Plausible counts the demo as its own site (spec 9.4, question 7): production's stats never count a demo visit.
export const plausibleDomain = (demo: boolean): string => (demo ? DEMO_HOST : 'thepadeldoc.com')

// On the demo build the marketing pages live on thepadeldoc.com only: each of these moves there, same path.
export const DEMO_MOVED = ['/about', '/coaches', '/players', '/clubs', '/tools', '/tools/:slug', '/contribute', '/cookies']

// /robots.txt (app/robots.ts): thepadeldoc.com open with its sitemap; the demo shut, no sitemap (spec 9.3).
export const robotsFor = (demo: boolean) =>
  demo ? { rules: { userAgent: '*', disallow: '/' } } : { rules: { userAgent: '*', allow: '/' }, sitemap: 'https://thepadeldoc.com/sitemap.xml' }
