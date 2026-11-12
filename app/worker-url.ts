// The Worker the pages and components ask (padel-coach-src specs/demo-site-spec.md 10.2; Kevin 12 Nov 2026, D7): one
// address for every file of app/. next.config.ts always sets NEXT_PUBLIC_PADELDOC_WORKER for the build (production's
// Worker with nothing set, the demo's on the demo site, checked by app/worker-default.ts), and Next writes it into the
// pages as text. No address is written here, so the demo build's pages hold nothing of production's.
export const WORKER: string = process.env.NEXT_PUBLIC_PADELDOC_WORKER as string
