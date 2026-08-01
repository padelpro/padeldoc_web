// The sentence to render for a parsed /v1/stats response, or null when there is nothing honest
// to say.
//
// PURE, and in its own .ts file rather than beside the component: the component is a 'use client'
// .tsx, and Node's test runner cannot load .tsx at all (ERR_UNKNOWN_FILE_EXTENSION — type
// stripping does not cover JSX). Keeping the decision logic here is what makes it testable
// without a DOM, a loader, or React.
//
// Returns null rather than any partial or zeroed sentence (§7 rules 1-3). A non-object body, an
// absent key, a non-numeric value, a non-finite number, a negative count and a ZERO all read as
// "no data".
//
// Plurals are unconditional: the counters seed at 54 and 8 and only ever increase (§3), so "1
// match" is unreachable and a singular branch would be dead code.
export function usageSentence(data: unknown): string | null {
  if (typeof data !== 'object' || data === null) return null
  const { matches, americanos } = data as { matches?: unknown; americanos?: unknown }

  // `> 0`, NOT `>= 0`. A zero is a claim that nothing has happened, and this goes on a public
  // page. It also cannot be true: the counters seed at 54 and 8 and only ever increase (§3), so
  // a zero reaching here means a missing or reset row, not a real count. Rendering "0 matches
  // tracked" would state something false with more confidence than rendering nothing at all.
  //
  // toLocaleString so these still read correctly at four figures.
  const count = (v: unknown, noun: string): string | null =>
    typeof v === 'number' && Number.isFinite(v) && v > 0
      ? `${v.toLocaleString()} ${noun}`
      : null

  const m = count(matches, 'matches')
  const a = count(americanos, 'americanos')

  if (m && a) return `${m} and ${a} tracked`
  if (m) return `${m} tracked`
  if (a) return `${a} tracked`
  return null
}
