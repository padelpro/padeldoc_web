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
