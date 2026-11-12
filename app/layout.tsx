import type { Metadata, Viewport } from 'next'
import { Spline_Sans, IBM_Plex_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { IS_DEMO, plausibleDomain } from './site'
import { DemoRibbon } from './_demo/ribbon'

const splineSans = Spline_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-spline-sans',
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://thepadeldoc.com'),
  title: {
    template: '%s · Padel Doc',
    default: 'Padel Doc: free padel tools',
  },
  description:
    'Free padel tools. Track matches, run Americanos, analyse video, set racket balance and plan tactics. No account needed.',
  alternates: { canonical: '/' },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  openGraph: {
    type: 'website',
    siteName: 'The Padel Doc',
    url: '/',
    images: [
      { url: '/og.png', width: 1200, height: 630, alt: 'The Padel Doc — free padel tools' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [{ url: '/og.png', alt: 'The Padel Doc — free padel tools' }],
  },
  // The demo build only (demo.thepadeldoc.com, padel-coach-src specs/demo-site-spec.md 9.3): no page in a search engine.
  ...(IS_DEMO ? { robots: { index: false, follow: false } } : {}),
}

// The browser's bar colour: the tools' light band (padeldoc.js chromeLight).
export const viewport: Viewport = {
  themeColor: '#e9e4dc',
  colorScheme: 'light',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${splineSans.variable} ${ibmPlexMono.variable}`}>
      <body>
        {/* The demo build only: the ribbon after the page, as the tools' one. thepadeldoc.com's own tree is exactly
            as it was (one child, no empty slot), so its pages come out byte for byte the same. */}
        {IS_DEMO ? <><main>{children}</main><DemoRibbon /></> : <main>{children}</main>}
        {/* Privacy-light analytics; no cookies, no personal data. The demo counts as its own site. */}
        <Script
          defer
          data-domain={plausibleDomain(IS_DEMO)}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
