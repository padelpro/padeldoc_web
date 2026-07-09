import type { NextConfig } from 'next'

// The five tools are self-contained static HTML bundles in public/<tool>/index.html
// (synced from the padel-coach-src build — see scripts/sync-tools.mjs). Rewrite the clean
// route to the static file so /tactics serves public/tactics/index.html, etc. Mirrors the
// padelpro_web setup so both brands serve the same tool set the same way.
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: '/tracker', destination: '/tracker/index.html' },
      { source: '/tactics', destination: '/tactics/index.html' },
      { source: '/analyse', destination: '/analyse/index.html' },
      { source: '/balance', destination: '/balance/index.html' },
      { source: '/americano', destination: '/americano/index.html' },
    ]
  },
}

export default nextConfig
