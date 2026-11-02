import RolePage, { roleMetadata, type RoleCopy } from '../role-page'
import copy from '../_copy/coaches.json'

// /coaches: the role page (role-page.tsx), its words in _copy/coaches.json.
export const metadata = roleMetadata('coaches', copy as RoleCopy)

export default function Coaches() {
  return <RolePage id="coaches" copy={copy as RoleCopy} />
}
