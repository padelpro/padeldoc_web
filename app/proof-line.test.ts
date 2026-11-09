import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { proofLine } from './proof-line.ts'

const CRED = "Made by Dr Kevin O'Brien, padel coach and sport scientist"
const COUNTS = '{players} players and {coaches} coaches use The Padel Doc'

test('below 50 players, or no answer: the credential alone', () => {
  assert.equal(proofLine(CRED, COUNTS, null), `${CRED}.`)
  assert.equal(proofLine(CRED, COUNTS, { players: 49, coaches: 12 }), `${CRED}.`)
  assert.equal(proofLine(CRED, COUNTS, 'x'), `${CRED}.`)
  assert.equal(proofLine(`${CRED}.`, COUNTS, null), `${CRED}.`, 'one full stop, however it was pasted')
})

test('at 50 players and over: the credential, then the counts', () => {
  assert.equal(proofLine(CRED, COUNTS, { players: 50, coaches: 12, clubs: 3 }), `${CRED}. 50 players and 12 coaches use The Padel Doc.`)
  assert.equal(proofLine(CRED, COUNTS, { players: 1250, coaches: 40 }), `${CRED}. 1,250 players and 40 coaches use The Padel Doc.`)
})

test('a count missing or zero says nothing made up: the credential alone', () => {
  assert.equal(proofLine(CRED, COUNTS, { players: 60 }), `${CRED}.`)
  assert.equal(proofLine(CRED, COUNTS, { players: 60, coaches: 0 }), `${CRED}.`)
  assert.equal(proofLine('', COUNTS, null), '')
})

test('the home copy: the two promise lines as Kevin wrote them, six tiles each way, six pillars, no dashes', () => {
  const copy = JSON.parse(readFileSync(new URL('./_copy/home.json', import.meta.url), 'utf8'))
  assert.equal(copy.promises.coach.line, 'The hour on court is only part of the job.')
  assert.equal(copy.promises.player.line, 'Always know what to work on next.')
  assert.deepEqual(copy.toolRow.tiles.map((t: { id: string }) => t.id), ['tracker', 'tagger', 'analyse', 'tactics', 'wellness', 'gym'])
  for (const t of copy.toolRow.tiles) assert.ok(t.coach && t.player && t.name, t.id)
  assert.deepEqual(copy.pillars.tiles.map((t: { name: string }) => t.name), ['Technical', 'Tactical', 'Physical', 'Mental', 'Wellness', 'Match play'])
  assert.equal(copy.roles.player.ticks.length, 4)
  assert.equal(copy.roles.coach.ticks.length, 4)
  assert.doesNotMatch(JSON.stringify(copy), /[\u2013\u2014]/)
})
