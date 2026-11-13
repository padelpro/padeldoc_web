import { HeaderAccount } from './signed-in-header'
import { LAUNCH_HOME } from './site'

// The top bar on every page: the band colour, full width. The logo at 40px and the name at 20px (Kevin 2 Nov 2026), with
// the tagline beside them from md up. The home page passes big: its text at twice the size, Sign in and Set up account as
// real buttons (people said the text was too small, Kevin 3 Nov 2026); below lg the wordmark at 28px and the two
// buttons on a row of their own. Every other page keeps the header as it was.
export function SiteHeader({ big = false }: { big?: boolean }) {
  if (big) return (
    <header className="bg-band border-b border-edge">
      <div className="mx-auto max-w-6xl px-4 lg:px-6 py-3 lg:py-4 flex flex-wrap lg:flex-nowrap items-center gap-x-3 gap-y-3">
        <a href="/" className="flex items-center gap-3">
          <img src="/icon-192.png" alt="" className="h-10 w-10 lg:h-14 lg:w-14" />
          <span className="whitespace-nowrap text-[28px] lg:text-[40px] leading-tight font-bold tracking-tight">The Padel Doc</span>
        </a>
        <span className="hidden lg:inline whitespace-nowrap text-[28px] text-muted">Play. Tag. Talk.</span>
        <HeaderAccount big />
      </div>
    </header>
  )
  return (
    <header className="bg-band border-b border-edge">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center gap-3">
        <a href="/" className="flex items-center gap-3">
          <img src="/icon-192.png" alt="" className="h-10 w-10" />
          <span className="text-xl font-bold tracking-tight">The Padel Doc</span>
        </a>
        <span className="hidden md:inline text-sm text-muted">Play. Tag. Talk.</span>
        {/* Sign in and Set up account, or the signed-in visitor's one button (signed-in-header.tsx). */}
        <HeaderAccount />
      </div>
    </header>
  )
}

export function Community() {
  return (
    <section className="mt-12 sm:mt-24 rounded-xl border border-accent/40 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-accent)_10%,transparent),color-mix(in_srgb,var(--color-accent)_2%,transparent))] p-8 sm:p-10">
      <p className="text-accent font-medium">Research project</p>
      <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">Help build padel-vision</h2>
      <p className="mt-4 max-w-prose text-text/85 leading-relaxed">
        We&rsquo;re teaching a computer to tag padel matches. Tag a match with the free tagger, send us the
        video, and help make auto-tagging work for club players.
      </p>
      <a href="/contribute" className="mt-4 sm:mt-6 inline-flex items-center min-h-11 sm:min-h-0 font-medium text-accent underline underline-offset-4">
        How contributing works
      </a>
    </section>
  )
}

// Footer links: 44px tall on phones so a thumb finds them; on sm and up they size to the text, as before.
const link = 'inline-flex items-center min-h-11 sm:min-h-0'

export function Footer() {
  return (
    <footer className="mt-12 sm:mt-24 border-t border-edge pt-8 pb-12 flex flex-wrap items-center gap-x-6 gap-y-0 sm:gap-y-2 text-sm text-muted">
      <span>Free padel tools by Dr Kevin O&rsquo;Brien, padel coach and sport scientist.</span>
      {/* Launch 1: the role pages go to the launch page while it is the home page (site.ts LAUNCH_HOME). */}
      {!LAUNCH_HOME && <>
        <a className={`${link} hover:text-text`} href="/players">Players</a>
        <a className={`${link} hover:text-text`} href="/coaches">Coaches</a>
        <a className={`${link} hover:text-text`} href="/clubs">Clubs</a>
      </>}
      <a className={`${link} hover:text-text`} href="/tools">All tools</a>
      <a className={`${link} hover:text-text`} href="/about">About</a>
      <a className={`${link} hover:text-text`} href="/privacy">Privacy</a>
      <a className={`${link} hover:text-text`} href="/cookies">Cookies</a>
      <a className={`${link} text-accent-2 hover:underline`} href="mailto:hello@padelpro.ie">hello@padelpro.ie</a>
    </footer>
  )
}
