// Service Worker for PX Case Study Sharpener PWA
const CACHE_NAME = "px-case-study-sharpener-v2";

// Install: skip waiting to activate immediately
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

// Activate: clean ALL old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network-first — always try to get fresh content
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Skip non-GET and API calls
  if (request.method !== "GET" || request.url.includes("/api/") || request.url.includes("chat.int.bayer.com")) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
