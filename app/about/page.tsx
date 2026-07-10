import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { absolute: 'About — The Padel Doc' },
  alternates: { canonical: '/about' },
}

export default function About() {
  return (
    <div className="min-h-screen mx-auto max-w-2xl px-6 py-16 sm:py-24">
      <header className="mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">About</h1>
      </header>

      <p className="text-text/90 leading-relaxed mb-14 max-w-prose">
        I'm a padel coach based in Dublin with a PhD in Sport Science, which
        is where the name comes from. It also shapes how I coach: I don't
        guess. If I tell a player their bandeja is late, it's because the
        video shows it frame by frame, not because it looked that way from
        across the court. The tools on this site come from the same place.
        The americano organiser exists because I got tired of scribbling
        rotations on the back of a receipt while twelve people shouted
        suggestions, and because the maths of a fair draw is a solved problem
        that no app had bothered to solve. Everything here gets tested on
        real courts with real players before it goes near this site. Some of
        it is rough around the edges. All of it works. Use whatever helps
        your game or your coaching, and if something's broken or missing,
        tell me and I'll probably build it.
      </p>

      <footer className="mt-16 text-sm text-muted">
        <a className="text-accent-2 hover:underline" href="/">
          ← Back to tools
        </a>
      </footer>
    </div>
  )
}
