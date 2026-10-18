// Renders the policy data (privacy-content.ts, cookie-content.ts) in the site's own type and colours.
import type { Block } from './privacy-content'

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.kind === 'h3') return <h3 key={i} className="mt-8 mb-2 text-base font-semibold text-text">{b.text}</h3>
        if (b.kind === 'list') return (
          <ul key={i} className="my-4 list-disc pl-5 space-y-2 text-text/85 leading-relaxed">
            {b.items.map((t, j) => <li key={j}>{t}</li>)}
          </ul>
        )
        return <p key={i} className="my-4 text-text/85 leading-relaxed">{b.text}</p>
      })}
    </>
  )
}

export function LegalFooter() {
  return (
    <footer className="mt-16 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
      <a className="text-accent-2 hover:underline" href="/">← Back to tools</a>
      <a className="hover:text-text" href="/privacy">Privacy</a>
      <a className="hover:text-text" href="/cookies">Cookies</a>
    </footer>
  )
}
