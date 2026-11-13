import type { Metadata, Viewport } from 'next'
import LaunchPage from '../../launch-page'
import copy from '../../_copy/launch.json'
import { headlineOf } from '../../launch'

// The launch landing page at a preview address (padel-coach-src specs/launch-1-scope.md, Kevin 13 Nov 2026): today's
// home page is untouched. Not in the sitemap and not for search engines. On launch day app/page.tsx draws LaunchPage
// and this folder goes. Two segments, so the public profile rule (profile-path.ts, one segment) never takes it.
export const metadata: Metadata = {
  title: 'Launch preview',
  description: headlineOf(copy),
  alternates: { canonical: '/preview/launch' },
  robots: { index: false, follow: false },
}

// The browser's bar colour follows the device here, as the page does.
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f4f0' },
    { media: '(prefers-color-scheme: dark)', color: '#141517' },
  ],
  colorScheme: 'light dark',
}

export default function LaunchPreview() {
  return <LaunchPage />
}
