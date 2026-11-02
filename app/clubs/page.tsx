import RolePage, { roleMetadata, type RoleCopy } from '../role-page'
import copy from '../_copy/clubs.json'

// /clubs: the role page (role-page.tsx), its words in _copy/clubs.json.
export const metadata = roleMetadata('clubs', copy as RoleCopy)

export default function Clubs() {
  return <RolePage id="clubs" copy={copy as RoleCopy} />
}
