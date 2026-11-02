import type { MetadataRoute } from 'next'

// /robots.txt: everything open to crawlers, and where the sitemap is (sitemap.ts).
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: '/' }, sitemap: 'https://thepadeldoc.com/sitemap.xml' }
}
