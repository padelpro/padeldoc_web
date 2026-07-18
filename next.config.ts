import type { NextConfig } from 'next'

// The five tools are self-contained static HTML bundles in public/<tool>/index.html
// (synced from the padel-coach-src build — see scripts/sync-tools.mjs). Rewrite the clean
// route to the static file so /tactics serves public/tactics/index.html, etc. Mirrors the
// padelpro_web setup so both brands serve the same tool set the same way.
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Dynamic-source rewrites (/t/:code, /m/:code, /embed/m/:code) are inert on Netlify; the tool HTML is served by netlify.toml edge rewrites.
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
    ]
  },
}

export default nextConfig
