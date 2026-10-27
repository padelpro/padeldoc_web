'use client'

import { useStats } from './usage-counter'
import { usageFigures } from './usage-figures'
import { accountsSentence } from './usage-sentence'

// The usage numbers as big mono figures under the hero (preview-mobile-layout, Kevin 27 Oct 2026). Same fetch and the
// same rule as the one-line counter: nothing to show, or no answer from the Worker, means no element at all.
export default function UsageNumbers({ className = '' }: { className?: string }) {
  const data = useStats()
  const figures = data === null ? [] : usageFigures(data)
  const who = data === null ? null : accountsSentence(data)
  if (!figures.length && !who) return null

  return (
    <section className={className} aria-label="The Padel Doc in numbers">
      <div className="border-y border-edge py-6 sm:py-8">
      {figures.length > 0 && <ul className="flex flex-wrap gap-x-10 gap-y-6 sm:gap-x-16">
        {figures.map((f) => (
          <li key={f.label}>
            <span className="block font-mono text-4xl sm:text-5xl font-semibold tracking-tight tabular-nums">{f.value}</span>
            <span className="mt-1 block text-muted">{f.label}</span>
          </li>
        ))}
      </ul>}
      {who && <p className={`${figures.length ? 'mt-5' : ''} font-mono text-sm text-muted`}>{who}.</p>}
      </div>
    </section>
  )
}
