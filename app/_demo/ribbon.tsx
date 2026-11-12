import { RIBBON } from './copy'

// The demo's ribbon on the demo build's own pages (padel-coach-src specs/demo-site-spec.md 10.2), as the tools' one
// (padel-coach-src src/demo/demoChrome.js): fixed at the bottom so it never covers a page's own bar. Words with the
// links, never colour alone. Drawn by the layout on the demo build only.
export function DemoRibbon() {
  return (
    <>
      {/* Room for the ribbon under the page's last line. */}
      <div aria-hidden className="h-12" />
      <aside aria-label={RIBBON.label} data-demo-ribbon className="fixed inset-x-0 bottom-0 z-50 border-t border-edge bg-band">
        <div className="mx-auto max-w-6xl px-4 py-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm">
          <span className="font-semibold">{RIBBON.text}</span>
          <a className="text-accent-2 underline" href="/signin">{RIBBON.pick}</a>
          <a className="text-accent-2 underline" href="/privacy">{RIBBON.privacy}</a>
        </div>
      </aside>
    </>
  )
}
