// Public profile pages (Kevin 28 Oct 2026): thepadeldoc.com/<name> for every player, coach and club, with no @ in the
// address. The page itself shows @name. An edge function (netlify/edge-functions/profile.ts) serves the player bundle,
// which draws the page, for any one-segment path shaped like a name that isn't one of the site's own pages. The old
// /@name form moves to /name. The Worker refuses these same names when someone picks one (padel-share-api profiles.js
// RESERVED), so the two lists must stay in step: a new top-level page goes in both.

// The site's own first path segments: Next pages, public/ folders and the netlify.toml and next.config.ts routes.
export const SITE_PATHS = new Set([
  'about', 'americano', 'americano-25', 'analyse', 'avatars', 'balance', 'club', 'coach', 'community', 'contribute',
  'cookies', 'embed', 'images', 'league', 'legal', 'm', 'me', 'p', 'player', 'privacy', 'scoreboard', 'shots', 'signin',
  't', 'tactics', 'tagger', 'tools', 'tracker', 'unsubscribe', 'v',
])

const NAME = /^[a-z0-9]+(-[a-z0-9]+)*$/

// What the edge does with a path: { kind: 'profile' } to serve the profile page, { kind: 'move', to } for the old /@name
// form, or null to leave it to the site.
export function profilePath(pathname: string): { kind: 'profile' } | { kind: 'move'; to: string } | null {
  const at = /^\/@([^/]+)\/?$/.exec(pathname)
  if (at) {
    let name = ''
    try { name = decodeURIComponent(at[1]).toLowerCase() } catch { return null }
    return NAME.test(name) ? { kind: 'move', to: `/${name}` } : null
  }
  const m = /^\/([^/.]+)\/?$/.exec(pathname)
  if (!m) return null
  const seg = m[1].toLowerCase()
  if (seg.length < 3 || seg.length > 30 || !NAME.test(seg) || SITE_PATHS.has(seg)) return null
  return { kind: 'profile' }
}
