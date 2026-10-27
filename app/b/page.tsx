import type { Metadata } from 'next'
import HomePage from '../home-page'

// Version B, the fuller one, for a side-by-side look with / on a phone (preview-mobile-layout). Not for search engines.
export const metadata: Metadata = {
  title: { absolute: 'Version B · Padel Doc' },
  robots: { index: false, follow: false },
  alternates: { canonical: '/' },
}

export default function HomeB() {
  return <HomePage variant="b" />
}
