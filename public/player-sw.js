// Service worker for player alerts on thepadeldoc.com (/p/:code pages). Registered by the player page with
// the scope of the page's folder (/p/). It only shows alerts and opens the page when one is tapped: there
// is no fetch handler, so it never caches or changes how the site loads.
// Payload (padel-share-api src/push.js): { title, body, url, tag }.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let d = {};
  try { d = event.data ? event.data.json() : {}; } catch (e) { d = { body: event.data ? event.data.text() : "" }; }
  const title = d.title || "Padel Doc";
  event.waitUntil(self.registration.showNotification(title, {
    body: d.body || "Your coach sent you something new.",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    tag: d.tag || "padel",
    renotify: true,
    data: { url: typeof d.url === "string" && d.url.startsWith("/") && !d.url.startsWith("//") ? d.url : "/" },
  }));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = new URL(event.notification.data && event.notification.data.url || "/", self.location.origin).href;
  event.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of all) {
      if (c.url.split("#")[0] === url && "focus" in c) { await c.focus(); if ("navigate" in c) c.navigate(url).catch(() => {}); return; }
    }
    await self.clients.openWindow(url);
  })());
});
