import { redirect } from 'next/navigation'
import HomePage from './home-page'
import UsageBeacon from './usage-beacon'
import { IS_DEMO } from './site'

// The homepage itself is in home-page.tsx. UsageBeacon counts a visit for the admin's usage dashboard.
// On the demo build (demo.thepadeldoc.com) / is the Try it as screen, which the player bundle draws at /signin there
// (padel-coach-src src/demo/TryItAs.jsx); next.config.ts moves / to it, and this is the same move if a request ever
// reaches the page.
export default function Home() {
  if (IS_DEMO) redirect('/signin')
  return (
    <>
      <UsageBeacon />
      <HomePage />
    </>
  )
}
