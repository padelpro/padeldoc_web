// The Tactics Board's offline service worker (drill-builder-spec 3.5, decided question 11; phase D1). thepadeldoc.com
// serves it as /tactics-sw.js, registered by the Board page (src/drill/tacticsSw.js) with scope "/tactics", so it
// controls the Board's own page and nothing else on the site. It keeps one copy of the Board page so a reload with no
// network still opens it, and answers network first: the page from the network when it comes within 3 seconds (a new
// release arrives the moment there's signal), else the kept copy, while the network answer still updates it.
//
// Built from this file by build/build.mjs into dist/padeldoc/tactics-sw.js, with the build's version (a hash of the
// Board page) and the kill switch (BRAND.features.tacticsOffline) written in; release.mjs copies it to
// padeldoc_web/public/tactics-sw.js. A new build is a new file, so the browser installs it on the next visit: it keeps
// the new page under the new version's cache, and on activate every older tactics cache is deleted.
//
// Kill switch: with tacticsOffline false the build writes OFF below. This worker then caches nothing, answers nothing,
// deletes its caches and unregisters itself, and the page unregisters it too (tacticsSw.js).
//
// Only requests for the Board page itself (/tactics, /tactics/...) are answered here; every other request (the rest of
// the site, the fonts, the API, Plausible) is left to the browser as if there were no worker. player-sw.js (alerts) is
// a separate worker and stays as it is.
const VERSION = "5949c015181d";
const ON = true;
const PREFIX = "pd-tactics-";
const CACHE = PREFIX + VERSION;
const PAGE = "/tactics";
const WAIT_MS = 3000;

const isBoard = (url) => url.origin === self.location.origin && (url.pathname === "/tactics" || url.pathname.startsWith("/tactics/"));

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    if (ON) {
      try {
        const res = await fetch(PAGE, { cache: "no-store" });
        if (res && res.ok) await (await caches.open(CACHE)).put(PAGE, res);
      } catch { /* no network while installing: the first visit online fills it */ }
    }
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith(PREFIX) && (!ON || k !== CACHE)).map((k) => caches.delete(k)));
    if (!ON) { await self.registration.unregister(); return; }
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  if (!ON) return;
  const req = event.request;
  if (req.method !== "GET" || req.mode !== "navigate") return;
  let url;
  try { url = new URL(req.url); } catch { return; }
  if (!isBoard(url)) return;
  event.respondWith(networkFirst(event, req));
});

async function networkFirst(event, req) {
  const cache = await caches.open(CACHE);
  const net = fetch(req).then(async (res) => {
    if (res && res.ok && res.type === "basic") await cache.put(PAGE, res.clone());
    return res;
  });
  event.waitUntil(net.catch(() => {}));   // a slow answer still lands in the cache after the kept copy is shown
  let timer;
  try {
    return await Promise.race([net, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error("slow")), WAIT_MS); })]);
  } catch {
    const kept = await cache.match(PAGE);
    return kept || net;   // nothing kept yet: wait for the network, as the browser would
  } finally {
    clearTimeout(timer);
  }
}
