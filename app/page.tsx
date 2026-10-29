import HomePage from './home-page'
import UsageBeacon from './usage-beacon'

// The homepage itself is in home-page.tsx. UsageBeacon counts a visit for the admin's usage dashboard.
export default function Home() {
  return (
    <>
      <UsageBeacon />
      <HomePage />
    </>
  )
}
