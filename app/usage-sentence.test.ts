// Unit tests for the pure decision function behind the front-page usage counter.
//
// Run with `npm test` (node --test app/). No test framework, no loader: Node 22 strips the types
// natively. The import carries an explicit .ts extension because Node ESM requires it, which is
// why tsconfig sets allowImportingTsExtensions.
import test from 'node:test'
import assert from 'node:assert/strict'
import { usageSentence } from './usage-sentence.ts'

test('both keys render the full sentence', () => {
  assert.equal(usageSentence({ matches: 54, americanos: 8 }), '54 matches and 8 americanos tracked')
})

test('matches only renders one clause, and groups thousands', () => {
  const out = usageSentence({ matches: 1234 })
  assert.equal(out, '1,234 matches tracked')
  // Locale-independent half of the assertion: whatever the separator, it must not read "1234".
  assert.notEqual(out, '1234 matches tracked', 'toLocaleString must group thousands')
})

test('americanos only renders the other clause', () => {
  assert.equal(usageSentence({ americanos: 8 }), '8 americanos tracked')
})

test('neither key renders nothing', () => {
  assert.equal(usageSentence({}), null)
  assert.equal(usageSentence({ other: 5 }), null)
})

test('non-object bodies render nothing', () => {
  for (const body of [null, undefined, 'matches', 42, true, [], [54, 8]]) {
    assert.equal(usageSentence(body), null, `expected null for ${String(JSON.stringify(body))}`)
  }
})

test('non-numeric, non-finite and negative values render nothing', () => {
  for (const bad of ['54', null, undefined, true, {}, [], NaN, Infinity, -Infinity, -1, -0.5]) {
    assert.equal(usageSentence({ matches: bad }), null, `matches: ${String(bad)}`)
    assert.equal(usageSentence({ americanos: bad }), null, `americanos: ${String(bad)}`)
  }
})

test('zero renders nothing — it can only mean a missing or reset row', () => {
  // The counters seed at 54 and 8 and only ever increase (§3), so a zero is never a real count.
  assert.equal(usageSentence({ matches: 0, americanos: 0 }), null)
  assert.equal(usageSentence({ matches: 0 }), null)
  // And a zero on one key falls back to the other, per §7 rule 2.
  assert.equal(usageSentence({ matches: 54, americanos: 0 }), '54 matches tracked')
})
