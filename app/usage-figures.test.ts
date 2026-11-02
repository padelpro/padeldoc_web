import test from 'node:test'
import assert from 'node:assert/strict'
import { showUsage, usageFigures } from './usage-figures.ts'

test('figures in a fixed order, labelled', () => {
  assert.deepEqual(usageFigures({ americanos: 57, clubs: 5, matches: 412 }),
    [{ value: '412', label: 'matches tracked' }, { value: '57', label: 'americanos run' }])
})

test('zero, negative, missing and non-numbers are left out', () => {
  assert.deepEqual(usageFigures({ matches: 0, americanos: -3 }), [])
  assert.deepEqual(usageFigures({ matches: '412', americanos: 1.5 }), [])
  assert.deepEqual(usageFigures(null), [])
  assert.deepEqual(usageFigures('x'), [])
})

test('a count of one is singular', () => {
  assert.deepEqual(usageFigures({ americanos: 1 }), [{ value: '1', label: 'americano run' }])
})

test('the numbers show from 50 players', () => {
  assert.equal(showUsage({ players: 49, matches: 412 }), false)
  assert.equal(showUsage({ players: 50, matches: 412 }), true)
  assert.equal(showUsage({ players: '80' }), false)
  assert.equal(showUsage({ matches: 412 }), false)
  assert.equal(showUsage(null), false)
})
