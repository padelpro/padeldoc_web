import type { MetadataRoute } from 'next'
import { IS_DEMO, robotsFor } from './site'

// /robots.txt: everything open to crawlers, and where the sitemap is (sitemap.ts). On the demo build
// (demo.thepadeldoc.com, padel-coach-src specs/demo-site-spec.md 9.3): nothing open, no sitemap. The rule is site.ts.
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return robotsFor(IS_DEMO)
}
