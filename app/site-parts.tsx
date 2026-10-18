export function Community() {
  return (
    <section className="mt-24 rounded-xl border border-accent/40 bg-[linear-gradient(135deg,rgba(193,131,78,0.14),rgba(193,131,78,0.02))] p-8 sm:p-10">
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
    <footer className="mt-24 border-t border-line pt-8 pb-12 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
      <span>Free padel tools by Dr Kevin O&rsquo;Brien, padel coach and sport scientist.</span>
      <a className="hover:text-text" href="/about">About</a>
      <a className="hover:text-text" href="/privacy">Privacy</a>
      <a className="hover:text-text" href="/cookies">Cookies</a>
      <a className="text-accent-2 hover:underline" href="mailto:hello@padelpro.ie">hello@padelpro.ie</a>
    </footer>
  )
}
