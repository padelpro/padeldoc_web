import type { Metadata, Viewport } from 'next'
import Confirm from './confirm'

// /launch/confirm?t=...: where a "Tell me when it's ready" confirm email lands (padel-coach-src
// specs/launch-1-scope.md, stage 3; the Worker's src/mailLists.js writes the link). Two segments, so the public profile
// rule (profile-path.ts, one segment) never takes it. Not in the sitemap and not for search engines.
export const metadata: Metadata = {
  title: 'Confirm',
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f4f0' },
    { media: '(prefers-color-scheme: dark)', color: '#141517' },
  ],
  colorScheme: 'light dark',
}

export default function ConfirmPage() {
  return <Confirm />
}
