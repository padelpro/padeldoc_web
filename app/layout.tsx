import type { Metadata } from 'next'
import { Spline_Sans, IBM_Plex_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

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
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${splineSans.variable} ${ibmPlexMono.variable}`}>
      <body>
        <main>{children}</main>
        {/* Privacy-light analytics; no cookies, no personal data. */}
        <Script
          defer
          data-domain="thepadeldoc.com"
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
