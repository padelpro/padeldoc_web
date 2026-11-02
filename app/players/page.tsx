import RolePage, { roleMetadata, type RoleCopy } from '../role-page'
import copy from '../_copy/players.json'

// /players: the role page (role-page.tsx), its words in _copy/players.json.
export const metadata = roleMetadata('players', copy as RoleCopy)

export default function Players() {
  return <RolePage id="players" copy={copy as RoleCopy} />
}
