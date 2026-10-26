// Who's signed in on this device, for the home page and the header (Kevin 26 Oct 2026). The tools keep the account key
// in localStorage (padel-coach-src src/data.js STORAGE): players and coaches in the tools' slot, a club account in its
// own. A key carries no role (every key is 64 random hex characters), so the role comes the way /signin finds it
// (coach/signin.js destinationsFor): the slot the key is in, then GET /v1/me with it. Pure; signed-in-header.tsx draws
// it. Tested in signed-in.test.ts.

// The same names as STORAGE.vtagCoachKey and STORAGE.clubKey. Values are JSON strings, as the tools write them.
export const KEY_SLOTS = { tools: 'pc_vtag_coachkey', club: 'pc_club_key' } as const
export type Slot = keyof typeof KEY_SLOTS
export type Role = 'player' | 'coach' | 'club'

// The key on this device and its slot: the tools' slot first (a coach who also runs a club is a coach here, as in the
// tools' top bar), then the club's. get: localStorage.getItem, or a stand-in. null when there's no usable key.
export function storedKey(get: (name: string) => string | null): { key: string; slot: Slot } | null {
  for (const slot of ['tools', 'club'] as const) {
    let raw: string | null = null
    try { raw = get(KEY_SLOTS[slot]) } catch { raw = null }   // storage blocked: as if empty
    if (raw == null) continue
    let v: unknown
    try { v = JSON.parse(raw) } catch { continue }
    if (typeof v === 'string' && v.trim()) return { key: v.trim(), slot }
  }
  return null
}

// The role from GET /v1/me's answer: a player, a club account (or any key from the club's slot), else a coach (admins
// included). null for an answer that isn't an account.
export function roleOf(me: unknown, slot: Slot): Role | null {
  if (!me || typeof me !== 'object') return null
  const role = (me as { role?: unknown }).role
  if (typeof role !== 'string' || !role) return null
  if (role === 'player') return 'player'
  if (role === 'club' || slot === 'club') return 'club'
  return 'coach'
}

// Where a signed-in visitor goes, and the button's words.
export const HOME: Record<Role, { label: string; href: string }> = {
  player: { label: 'My page', href: '/me' },
  coach: { label: 'Dashboard', href: '/coach' },
  club: { label: 'Club', href: '/club' },
}

// "Kevin" from "Kevin O'Brien"; '' when there's no name.
export function firstName(me: unknown): string {
  const name = me && typeof me === 'object' ? (me as { name?: unknown }).name : null
  return typeof name === 'string' ? name.trim().split(/\s+/)[0] || '' : ''
}
