import type { NextConfig } from 'next'
import { siteConfig } from './app/worker-default'
import { DEMO_MOVED, MAIN_SITE, LAUNCH_HOME, LAUNCH_MOVED } from './app/site'

// The five tools are self-contained static HTML bundles in public/<tool>/index.html
// (synced from the padel-coach-src build — see scripts/sync-tools.mjs). Rewrite the clean
// route to the static file so /tactics serves public/tactics/index.html, etc. Mirrors the
// padelpro_web setup so both brands serve the same tool set the same way.
//
// The demo (padel-coach-src specs/demo-site-spec.md 10.2; Kevin 12 Nov 2026, D7): a second Netlify site builds this same
// repo with PADELDOC_SITE=demo and NEXT_PUBLIC_PADELDOC_WORKER set to the demo Worker. With neither set the build is
// thepadeldoc.com's, exactly as before. Any other value, or a mix of the two, stops the build (app/worker-default.ts).
const { site, worker } = siteConfig(process.env)
const demo = site === 'demo'

const nextConfig: NextConfig = {
  // The one Worker address the pages hold (app/worker-url.ts): always set here, production's by default.
  env: { NEXT_PUBLIC_PADELDOC_WORKER: worker },
  // The demo only: / is Try it as (the player bundle's page at /signin on demo.thepadeldoc.com), and the marketing
  // pages live on thepadeldoc.com. Nothing here on thepadeldoc.com's build.
  async redirects() {
    // Launch 1: with the launch page as the home page, the old role pages go to it (app/site.ts LAUNCH_HOME).
    if (!demo) return LAUNCH_HOME ? LAUNCH_MOVED.map((source) => ({ source, destination: '/', permanent: false })) : []
    return [
      { source: '/', destination: '/signin', permanent: false },
      ...DEMO_MOVED.map((source) => ({ source, destination: `${MAIN_SITE}${source}`, permanent: false })),
    ]
  },
  // The demo only: no page of it in a search engine (spec 9.3). netlify/demo/demo-site.ts adds the same header at the
  // edge, where the static tool pages are answered.
  async headers() {
    if (!demo) return []
    return [{ source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex' }] }]
  },
  async rewrites() {
    return [
      // Dynamic-source rewrites (/t/:code, /m/:code, /embed/m/:code, /v/:code, /p/:code) are inert on Netlify; the tool HTML is served by netlify.toml edge rewrites.
      { source: '/tracker', destination: '/tracker/index.html' },
      { source: '/tactics', destination: '/tactics/index.html' },
      { source: '/analyse', destination: '/analyse/index.html' },
      { source: '/balance', destination: '/balance/index.html' },
      { source: '/americano', destination: '/americano/index.html' },
      { source: '/t/:code', destination: '/americano/index.html' },
      { source: '/americano-25', destination: '/americano/index.html' },
      { source: '/scoreboard', destination: '/scoreboard/index.html' },
      { source: '/m/:code', destination: '/scoreboard/index.html' },
      { source: '/embed/m/:code', destination: '/scoreboard/index.html' },
      { source: '/tagger', destination: '/tagger/index.html' },
      { source: '/v/:code', destination: '/tagger/index.html' },
      { source: '/player', destination: '/player/index.html' },
      { source: '/p/:code', destination: '/player/index.html' },
      { source: '/coach', destination: '/player/index.html' },
      { source: '/coach/join', destination: '/player/index.html' },
      { source: '/signin', destination: '/player/index.html' },
      { source: '/me', destination: '/player/index.html' },
      { source: '/me/join', destination: '/player/index.html' },
      { source: '/me/link', destination: '/player/index.html' },
      { source: '/community', destination: '/player/index.html' },
    ]
  },
}

export default nextConfig
