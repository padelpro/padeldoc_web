// Service worker for player alerts on thepadeldoc.com (/p/:code pages). Registered by the player page with
// the scope of the page's folder (/p/). It only shows alerts and opens the page when one is tapped: there
// is no fetch handler, so it never caches or changes how the site loads.
// Payload (padel-share-api src/push.js): { title, body, url, tag }.
// It also tells the site's open pages (Kevin, 5 Nov 2026): { kind: "padel-alert", tag } when an alert arrives and
// { kind: "padel-open", tag } when one is tapped, so a page showing that thread fetches it again (notify/refetch.js).
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

async function tellPages(kind, tag) {
  try {
    const all = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of all) c.postMessage({ kind, tag: tag || "" });
  } catch (e) { /* no pages open */ }
}

self.addEventListener("push", (event) => {
  let d = {};
  try { d = event.data ? event.data.json() : {}; } catch (e) { d = { body: event.data ? event.data.text() : "" }; }
  const title = d.title || "Padel Doc";
  event.waitUntil(tellPages("padel-alert", d.tag).then(() => self.registration.showNotification(title, {
    body: d.body || "Your coach sent you something new.",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    tag: d.tag || "padel",
    renotify: true,
    data: { url: typeof d.url === "string" && d.url.startsWith("/") && !d.url.startsWith("//") ? d.url : "/" },
  })));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = new URL(event.notification.data && event.notification.data.url || "/", self.location.origin).href;
  const tag = event.notification.tag;
  event.waitUntil((async () => {
    await tellPages("padel-open", tag);
    const all = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of all) {
      if (c.url.split("#")[0] === url && "focus" in c) { await c.focus(); if ("navigate" in c) c.navigate(url).catch(() => {}); return; }
    }
    await self.clients.openWindow(url);
  })());
});
