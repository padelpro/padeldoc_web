// Unit tests for reading who's signed in. Run with `npm test`.
import test from 'node:test'
import assert from 'node:assert/strict'
import { storedKey, roleOf, firstName, HOME, KEY_SLOTS } from './signed-in.ts'

const K = 'a'.repeat(64), C = 'b'.repeat(64)
const store = (o: Record<string, string>) => (name: string) => (name in o ? o[name] : null)

test('the slots are the tools’ storage names', () => {
  assert.equal(KEY_SLOTS.tools, 'pc_vtag_coachkey')
  assert.equal(KEY_SLOTS.club, 'pc_club_key')
})

test('storedKey: no key, no one signed in', () => {
  assert.equal(storedKey(store({})), null)
  assert.equal(storedKey(store({ pc_vtag_coachkey: 'null' })), null)
  assert.equal(storedKey(store({ pc_vtag_coachkey: JSON.stringify('  ') })), null)
  assert.equal(storedKey(store({ pc_vtag_coachkey: 'not json' })), null)
  assert.equal(storedKey(store({ pc_vtag_coachkey: '42' })), null)
  assert.equal(storedKey(() => { throw new Error('blocked') }), null)
})

test('storedKey: the tools’ key first, then the club’s', () => {
  assert.deepEqual(storedKey(store({ pc_vtag_coachkey: JSON.stringify(K) })), { key: K, slot: 'tools' })
  assert.deepEqual(storedKey(store({ pc_club_key: JSON.stringify(C) })), { key: C, slot: 'club' })
  assert.deepEqual(storedKey(store({ pc_vtag_coachkey: JSON.stringify(K), pc_club_key: JSON.stringify(C) })), { key: K, slot: 'tools' })
  assert.deepEqual(storedKey(store({ pc_vtag_coachkey: 'bad', pc_club_key: JSON.stringify(C) })), { key: C, slot: 'club' })
})

test('roleOf: from /v1/me and the slot', () => {
  assert.equal(roleOf({ role: 'player', name: 'Pat' }, 'tools'), 'player')
  assert.equal(roleOf({ role: 'coach' }, 'tools'), 'coach')
  assert.equal(roleOf({ role: 'admin' }, 'tools'), 'coach')
  assert.equal(roleOf({ role: 'coach', clubs: [{ id: 'x' }] }, 'tools'), 'coach')
  assert.equal(roleOf({ role: 'club' }, 'tools'), 'club')
  assert.equal(roleOf({ role: 'coach' }, 'club'), 'club')
  assert.equal(roleOf(null, 'tools'), null)
  assert.equal(roleOf({ error: 'nope' }, 'tools'), null)
  assert.equal(roleOf('player', 'tools'), null)
})

test('HOME: each role’s button', () => {
  assert.deepEqual(HOME.player, { label: 'My page', href: '/me' })
  assert.deepEqual(HOME.coach, { label: 'Dashboard', href: '/coach' })
  assert.deepEqual(HOME.club, { label: 'Club', href: '/club' })
})

test('firstName', () => {
  assert.equal(firstName({ name: '  Kevin O’Brien ' }), 'Kevin')
  assert.equal(firstName({ name: '' }), '')
  assert.equal(firstName({}), '')
  assert.equal(firstName(null), '')
})
