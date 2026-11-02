import type { MetadataRoute } from 'next'
import { tools } from './tools-data'

// /sitemap.xml (Kevin 2 Nov 2026): the site's own pages, the three role pages and each tool's page. Not the tools
// themselves or anything behind a sign-in.
const BASE = 'https://thepadeldoc.com'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['/', '/players', '/coaches', '/clubs', '/tools', ...tools.map((t) => `/tools/${t.slug}`), '/contribute', '/about', '/privacy', '/cookies']
  return pages.map((p) => ({
    url: `${BASE}${p === '/' ? '' : p}`,
    changeFrequency: 'monthly',
    priority: p === '/' ? 1 : ['/players', '/coaches', '/clubs'].includes(p) ? 0.9 : 0.6,
  }))
}
