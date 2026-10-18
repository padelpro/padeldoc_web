import test from 'node:test'
import assert from 'node:assert/strict'
import { publicReviews } from './reviews.ts'
import { accountsSentence } from './usage-sentence.ts'

test('reviews: well-formed ones with text pass, at most six', () => {
  const ok = { stars: 5, body: ' Great ', name: 'Sam', role: 'coach' }
  assert.deepEqual(publicReviews({ reviews: [ok] }), [{ stars: 5, body: 'Great', name: 'Sam', role: 'coach' }])
  assert.equal(publicReviews({ reviews: Array(9).fill(ok) }).length, 6)
  for (const bad of [{ ...ok, stars: 0 }, { ...ok, stars: 6 }, { ...ok, stars: 4.5 }, { ...ok, body: ' ' }, { ...ok, name: 1 }, null, 'x']) {
    assert.deepEqual(publicReviews({ reviews: [bad] }), [])
  }
  for (const body of [null, {}, { reviews: 'x' }, []]) assert.deepEqual(publicReviews(body), [])
})

test('accounts sentence: only with at least one of each, singulars right', () => {
  assert.equal(accountsSentence({ coaches: 12, players: 30, clubs: 5 }), '12 coaches, 30 players and 5 clubs use thepadeldoc.com')
  assert.equal(accountsSentence({ coaches: 1, players: 1, clubs: 1 }), '1 coach, 1 player and 1 club use thepadeldoc.com')
  assert.equal(accountsSentence({ coaches: 12, players: 30, clubs: 0 }), null)
  assert.equal(accountsSentence({ coaches: 12, players: 30 }), null)
  assert.equal(accountsSentence({ matches: 54 }), null)
  assert.equal(accountsSentence(null), null)
})
