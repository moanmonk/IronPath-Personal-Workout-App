const CACHE_NAME = "workout-planner-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/manifest.json",
  "/apple-touch-icon.png"
];

// Install Event - Pre-cache offline shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Pre-caching offline shell");
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("[Service Worker] Cleaning up old cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Dynamic caching with Network-First (pages) and Stale-While-Revalidate (assets)
self.addEventListener("fetch", (event) => {
  // Only handle HTTP/HTTPS requests
  if (!event.request.url.startsWith("http")) return;

  const url = new URL(event.request.url);

  // Skip WebSocket connections, HMR, and non-GET requests
  if (
    event.request.method !== "GET" ||
    url.pathname.includes("/_next/webpack-hmr") ||
    url.pathname.includes("hot-update") ||
    url.pathname.includes("/api/")
  ) {
    return;
  }

  const isDocument = event.request.mode === "navigate" || url.pathname === "/";

  if (isDocument) {
    // Network-First with Cache-Fallback for pages
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            return caches.match("/");
          });
        })
    );
  } else {
    // Stale-While-Revalidate for sub-resources (JS, CSS, fonts, assets)
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // Fail silently when offline
          });

        return cachedResponse || fetchPromise;
      })
    );
  }
});
