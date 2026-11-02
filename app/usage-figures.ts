// The two counters as figures for the home page's numbers strip (preview-mobile-layout, Kevin 27 Oct 2026), from the
// same GET /v1/stats body as usage-sentence.ts and under the same rules: a missing, non-numeric, negative or zero count
// says nothing, so it is left out. Who uses the site stays a sentence (accountsSentence). Tested in usage-figures.test.ts.

export type Figure = { value: string; label: string }

export function usageFigures(data: unknown): Figure[] {
  if (typeof data !== 'object' || data === null) return []
  const d = data as Record<string, unknown>
  const rows: [string, string, string][] = [
    ['matches', 'matches tracked', 'match tracked'],
    ['americanos', 'americanos run', 'americano run'],
  ]
  return rows.flatMap(([key, plural, single]) => {
    const v = d[key]
    if (typeof v !== 'number' || !Number.isInteger(v) || v <= 0) return []
    return [{ value: v.toLocaleString(), label: v === 1 ? single : plural }]
  })
}

// The home page shows its numbers only once there are at least this many players (Kevin 2 Nov 2026): below it, the
// whole block stays hidden. Counted from /v1/stats' players.
export const MIN_PLAYERS = 50

export function showUsage(data: unknown): boolean {
  if (typeof data !== 'object' || data === null) return false
  const v = (data as { players?: unknown }).players
  return typeof v === 'number' && Number.isInteger(v) && v >= MIN_PLAYERS
}
