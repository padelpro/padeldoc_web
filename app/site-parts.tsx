import { HeaderAccount } from './signed-in-header'

// The top bar on every page: the band colour, full width, 54px like the tools' top bar.
export function SiteHeader() {
  return (
    <header className="bg-band border-b border-edge">
      <div className="mx-auto max-w-6xl px-6 h-[54px] flex items-center gap-3">
        <a href="/" className="flex items-center gap-3">
          <img src="/icon-192.png" alt="" className="h-8 w-auto" />
          <span className="font-bold tracking-tight">The Padel Doc</span>
        </a>
        {/* Sign in and Set up account, or the signed-in visitor's one button (signed-in-header.tsx). */}
        <HeaderAccount />
      </div>
    </header>
  )
}

export function Community() {
  return (
    <section className="mt-24 rounded-xl border border-accent/40 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-accent)_10%,transparent),color-mix(in_srgb,var(--color-accent)_2%,transparent))] p-8 sm:p-10">
      <p className="text-accent font-medium">Community project</p>
      <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">Help build padel-vision</h2>
      <p className="mt-4 max-w-prose text-text/85 leading-relaxed">
        We&rsquo;re teaching a computer to tag padel matches. Tag a match with the free tagger, send us the
        video, and help make auto-tagging work for club players.
      </p>
      <a href="/contribute" className="mt-6 inline-block font-medium text-accent underline underline-offset-4">
        How contributing works
      </a>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-edge pt-8 pb-12 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
      <span>Free padel tools by Dr Kevin O&rsquo;Brien, padel coach and sport scientist.</span>
      <a className="hover:text-text" href="/tools">All tools</a>
      <a className="hover:text-text" href="/about">About</a>
      <a className="hover:text-text" href="/privacy">Privacy</a>
      <a className="hover:text-text" href="/cookies">Cookies</a>
      <a className="text-accent-2 hover:underline" href="mailto:hello@padelpro.ie">hello@padelpro.ie</a>
    </footer>
  )
}
