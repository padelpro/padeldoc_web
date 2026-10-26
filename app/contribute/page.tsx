import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Help build padel-vision',
  description:
    'A community project teaching a computer to tag padel matches. Tag a match with the free tagger, send the video, and help make auto-tagging work for club players.',
  alternates: { canonical: '/contribute' },
}

const steps = [
  {
    title: 'Tag a match',
    body: 'Use the free YouTube Match Tagger. Press 1st serve or 2nd serve at each serve. Your serve press marks the start of the point. Your point tag marks the end, so Rally end is optional.',
  },
  {
    title: 'Press Contribute',
    body: 'It sits in the tagger header. Pick the video file: .mp4 or .mov, up to 8 GB. It has to be the same recording you tagged, from the same start, or your tags won’t line up.',
  },
  {
    title: 'Tick four boxes and upload',
    body: 'The video goes straight from your browser to our storage. A long match takes a while. If the upload stops, it carries on from where it left off.',
  },
  {
    title: 'Save your remove link',
    body: 'When it’s done you get a link that deletes your video and tags. It’s shown once, so save it.',
  },
]

const ticks = [
  'I filmed this match or have permission to share it.',
  'All four players agree to the video being used to train padel-vision.',
  'All players in the video are 18 or over.',
  'I understand the model may be used in free and paid products by thepadeldoc.com.',
]

const label = 'text-xs font-mono uppercase tracking-[0.2em] text-muted mb-2'

export default function Contribute() {
  return (
    <div className="min-h-screen mx-auto max-w-2xl px-6 py-16 sm:py-24">
      <header className="mb-10">
        <p className={label}>Community project</p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Help build <span className="whitespace-nowrap">padel-vision</span>
        </h1>
      </header>

      <p className="text-text/90 leading-relaxed mb-4 max-w-prose">
        padel-vision is a model we&rsquo;re teaching to tag padel matches on its own: first where each rally
        starts and ends, then the shots. It learns from real club matches that players have tagged by hand.
      </p>
      <p className="text-text/90 leading-relaxed mb-14 max-w-prose">
        Contributing is optional. The tagger stays free whether you contribute or not.
      </p>

      <section>
        <h2 className={label}>How it works</h2>
        <ol className="border-t border-edge">
          {steps.map((s, i) => (
            <li key={s.title} className="border-b border-edge py-4 flex gap-4">
              <span className="font-mono text-accent text-sm font-medium w-5 shrink-0">{i + 1}</span>
              <div className="flex flex-col gap-1">
                <span className="font-medium">{s.title}</span>
                <span className="text-muted text-sm leading-relaxed">{s.body}</span>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <a
            href="/tagger"
            className="hidden sm:inline-block font-mono font-medium bg-accent text-on-accent rounded px-4 py-2 hover:opacity-90"
          >
            Open the tagger
          </a>
          <span className="text-muted sm:hidden">
            The tagger works on a laptop or computer. Open thepadeldoc.com/contribute there to take part.
          </span>
        </div>
      </section>

      <section className="mt-14">
        <h2 className={label}>What you send</h2>
        <div className="border-t border-edge pt-4 text-text/90 leading-relaxed max-w-prose space-y-3">
          <p>
            The video file, and a copy of your tags as they are when you press Upload. Changing the match
            afterwards doesn&rsquo;t change the copy.
          </p>
          <p>
            An email address if you want updates on padel-vision. It&rsquo;s optional. We don&rsquo;t keep the
            file name, since it can carry names or places.
          </p>
          <p>
            How we look after what you send is in our{' '}
            <a className="text-accent-2 hover:underline" href="/privacy#what">privacy policy</a>.
          </p>
        </div>
      </section>

      <section className="mt-14">
        <h2 className={label}>What you agree to</h2>
        <ul className="border-t border-edge">
          {ticks.map((t) => (
            <li key={t} className="border-b border-edge py-3 text-sm text-text/90 flex gap-3">
              <span className="text-accent font-mono" aria-hidden="true">&#10003;</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-muted text-sm">All four are required. Nothing is ticked for you.</p>
      </section>

      <section className="mt-14">
        <h2 className={label}>Changing your mind</h2>
        <div className="border-t border-edge pt-4 text-text/90 leading-relaxed max-w-prose space-y-3">
          <p>
            Open your remove link and press Remove it. The video and tags are deleted. That can&rsquo;t be
            undone.
          </p>
          <p>
            Lost the link? Email{' '}
            <a className="text-accent-2 hover:underline" href="mailto:kevin@padelpro.ie">
              kevin@padelpro.ie
            </a>{' '}
            with your contribution ID and we&rsquo;ll remove it.
          </p>
        </div>
      </section>

      <footer className="mt-16 text-sm text-muted">
        <a className="text-accent-2 hover:underline" href="/">
          &larr; Back to tools
        </a>
      </footer>
    </div>
  )
}
