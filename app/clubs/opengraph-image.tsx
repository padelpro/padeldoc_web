import { roleOg, ogSize } from '../role-og'
import type { RoleCopy } from '../role-page'
import copy from '../_copy/clubs.json'

// The /clubs page's Open Graph card (role-og.tsx).
export const alt = `${copy.heading} · The Padel Doc`
export const size = ogSize
export const contentType = 'image/png'

export default function Image() {
  return roleOg('clubs', copy as RoleCopy)
}
