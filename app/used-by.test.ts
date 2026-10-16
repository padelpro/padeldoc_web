// Unit tests for the "Used by" strip's data. Run with `npm test`.
import test from 'node:test'
import assert from 'node:assert/strict'
import { usedByClubs } from './used-by.ts'

test('keeps well-formed clubs in order', () => {
  const data = { clubs: [{ name: ' Naas LTC ', logoUrl: 'https://x/v1/logos/a' }, { name: 'Riverside', logoUrl: 'https://x/v1/logos/b' }] }
  assert.deepEqual(usedByClubs(data), [{ name: 'Naas LTC', logoUrl: 'https://x/v1/logos/a' }, { name: 'Riverside', logoUrl: 'https://x/v1/logos/b' }])
})

test('drops anything malformed or not https', () => {
  const data = { clubs: [null, 'x', { name: '' , logoUrl: 'https://x/a' }, { name: 'A', logoUrl: 'http://x/a' }, { name: 'B', logoUrl: 'javascript:alert(1)' }, { name: 'C' }, { name: 'D', logoUrl: 'https://x/d' }] }
  assert.deepEqual(usedByClubs(data), [{ name: 'D', logoUrl: 'https://x/d' }])
})

test('a bad body is an empty list', () => {
  for (const bad of [null, undefined, 'x', 3, {}, { clubs: 'x' }, []]) assert.deepEqual(usedByClubs(bad), [])
})
