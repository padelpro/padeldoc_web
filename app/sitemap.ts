import type { MetadataRoute } from 'next'
import { tools } from './tools-data'
import { IS_DEMO, LAUNCH_HOME, LAUNCH_MOVED } from './site'
import { loadPosts, postPath } from './research/posts'

// /sitemap.xml (Kevin 2 Nov 2026): the site's own pages, the three role pages and each tool's page. Not the tools
// themselves or anything behind a sign-in.
const BASE = 'https://thepadeldoc.com'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  // The demo build has no sitemap (robots.ts shuts every path there): an empty one.
  if (IS_DEMO) return []
  const pages = ['/', '/players', '/coaches', '/clubs', '/tools', ...tools.map((t) => `/tools/${t.slug}`), '/contribute', '/about', '/privacy', '/cookies']
  // Launch 1: the pages that go to the launch page aren't listed.
  const listed = LAUNCH_HOME ? pages.filter((p) => !LAUNCH_MOVED.includes(p)) : pages
  const site: MetadataRoute.Sitemap = listed.map((p) => ({
    url: `${BASE}${p === '/' ? '' : p}`,
    changeFrequency: 'monthly',
    priority: p === '/' ? 1 : ['/players', '/coaches', '/clubs'].includes(p) ? 0.9 : 0.6,
  }))
  // The research blog (Kevin 18 Nov 2026): its index and every post the build shows (drafts never in a release).
  const posts = loadPosts()
  return [
    ...site,
    { url: `${BASE}/research`, changeFrequency: 'weekly', priority: 0.7, ...(posts[0] ? { lastModified: posts[0].date } : {}) },
    ...posts.map((p) => ({ url: `${BASE}${postPath(p.slug)}`, lastModified: p.date, changeFrequency: 'yearly' as const, priority: 0.6 })),
  ]
}
