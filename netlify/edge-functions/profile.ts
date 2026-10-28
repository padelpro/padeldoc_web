// thepadeldoc.com/<name>: a public profile page (Kevin 28 Oct 2026). A one-segment path shaped like a name, that isn't
// one of the site's own pages, gets the player bundle, which draws the page; the address stays /<name>. /@name moves
// there. Everything else goes on to the site untouched. The rule is app/profile-path.ts.
import { profilePath } from '../../app/profile-path.ts'

export default async (request: Request) => {
  const url = new URL(request.url)
  const r = profilePath(url.pathname)
  if (!r) return
  if (r.kind === 'move') return Response.redirect(new URL(r.to + url.search, url), 301)
  return new URL('/player/index.html', url)
}

export const config = { path: '/*', excludedPath: ['/_next/*', '/player/*', '/images/*', '/avatars/*', '/shots/*'] }
