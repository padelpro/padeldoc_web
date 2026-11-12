// The two Workers this repo's two Netlify sites talk to (padel-coach-src specs/demo-site-spec.md 10.2; Kevin 12 Nov 2026,
// D7). thepadeldoc.com: production's, with nothing set. demo.thepadeldoc.com: the demo's, from that site's build
// variable NEXT_PUBLIC_PADELDOC_WORKER. Only these two addresses are taken; anything else stops the build (or the edge
// function), so a typing slip on the demo site can never fall back to production's Worker.
// Never imported by a page or a component: next.config.ts, the edge functions and the build scripts only, so the demo
// build's pages hold nothing of production's address (app/worker-url.ts is the pages' one).
export const PRODUCTION_WORKER = 'https://padel-share.padel-coach.workers.dev'
export const DEMO_WORKER = 'https://padel-share-demo.padel-coach.workers.dev'
export const WORKER_VAR = 'NEXT_PUBLIC_PADELDOC_WORKER'
export const SITE_VAR = 'PADELDOC_SITE'

export function workerFrom(value: string | undefined | null): string {
  if (value === undefined || value === null || value === '') return PRODUCTION_WORKER
  if (value === PRODUCTION_WORKER || value === DEMO_WORKER) return value
  throw new Error(`${WORKER_VAR} must be ${DEMO_WORKER} (the demo site) or unset; it is something else.`)
}

// Which site is being built or served: "padeldoc" with PADELDOC_SITE unset, "demo" with it "demo"; anything else stops.
export function siteFrom(value: string | undefined | null): 'padeldoc' | 'demo' {
  if (value === undefined || value === null || value === '') return 'padeldoc'
  if (value === 'demo') return 'demo'
  throw new Error(`${SITE_VAR} must be "demo" or unset; it is something else.`)
}

// The pair must agree: the demo site with the demo Worker, thepadeldoc.com with production's. Throws on a mix.
export function siteConfig(env: Record<string, string | undefined>): { site: 'padeldoc' | 'demo'; worker: string } {
  const site = siteFrom(env[SITE_VAR])
  const worker = workerFrom(env[WORKER_VAR])
  if (site === 'demo' && worker !== DEMO_WORKER) throw new Error(`${SITE_VAR}=demo needs ${WORKER_VAR}=${DEMO_WORKER}.`)
  if (site === 'padeldoc' && worker !== PRODUCTION_WORKER) throw new Error(`${WORKER_VAR} is the demo Worker but ${SITE_VAR} isn't "demo".`)
  return { site, worker }
}

// An edge function's variables (Netlify.env there; process.env under node's tests).
type EnvGlobal = { Netlify?: { env?: { get?: (k: string) => string | undefined } }; process?: { env?: Record<string, string | undefined> } }
export function edgeEnv(name: string, g: EnvGlobal = globalThis as EnvGlobal): string | undefined {
  const fromNetlify = g.Netlify?.env?.get?.(name)
  if (fromNetlify !== undefined && fromNetlify !== null) return fromNetlify
  return g.process?.env?.[name]
}
