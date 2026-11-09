// The proof line under the hero (padel-coach-src specs/player-journey-spec.md 1.2, J2): Kevin's credential as written in
// _copy/home.json, then the counts once the usage numbers show (showUsage: 50 players or more, as the numbers strip).
// Below that, or with no answer from the Worker, the credential alone, so nothing on the page is made up. PURE, in a .ts
// file so Node's test runner can load it (usage-sentence.ts says why); tested in proof-line.test.ts.
import { showUsage } from './usage-figures.ts'

const count = (v: unknown): string | null => (typeof v === 'number' && Number.isInteger(v) && v > 0 ? v.toLocaleString('en-IE') : null)

// credential: "Made by Dr Kevin O'Brien, ..."; counts: "{players} players and {coaches} coaches use The Padel Doc".
export function proofLine(credential: string, counts: string, data: unknown): string {
  const first = String(credential || '').trim().replace(/\.+$/, '')
  if (!showUsage(data)) return first ? `${first}.` : ''
  const d = data as { players?: unknown; coaches?: unknown }
  const p = count(d.players), c = count(d.coaches)
  const tail = p && c ? counts.replace('{players}', p).replace('{coaches}', c) + '.' : ''
  return [first ? `${first}.` : '', tail].filter(Boolean).join(' ')
}
