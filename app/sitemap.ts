import type { MetadataRoute } from 'next'
import { tools } from './tools-data'
import { IS_DEMO, LAUNCH_HOME, LAUNCH_MOVED } from './site'

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
  return listed.map((p) => ({
    url: `${BASE}${p === '/' ? '' : p}`,
    changeFrequency: 'monthly',
    priority: p === '/' ? 1 : ['/players', '/coaches', '/clubs'].includes(p) ? 0.9 : 0.6,
  }))
}
