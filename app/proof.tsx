'use client'

import { useStats } from './usage-counter'
import { proofLine } from './proof-line'
import copy from './_copy/home.json'

// The proof line under the hero (J2, player-journey-spec 1.2): Kevin's credential from _copy/home.json, then the counts
// once the usage numbers show. The credential renders without JS; the counts join it once /v1/stats answers.
export default function Proof({ className = '' }: { className?: string }) {
  const data = useStats()
  const line = proofLine(copy.proof.credential, copy.proof.counts, data)
  if (!line) return null
  return <p className={`font-mono text-sm text-muted ${className}`}>{line}</p>
}
