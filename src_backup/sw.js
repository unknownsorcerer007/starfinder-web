// StarFinder Web - Service Worker for Offline PWA support (sw.js)

const CACHE_NAME = "starfinder-cache-v2";
const ASSETS = [
  "index.html",
  "about.html",
  "privacy.html",
  "terms.html",
  "index.css",
  "stars_db.js",
  "plate_solver.js",
  "solver_worker.js",
  "app.js",
  "manifest.json",
  "assets/icon-192.png",
  "assets/icon-512.png"
];

// Install Event - Pre-cache all essential assets
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching app assets...");
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate Event - Clean up old cache versions
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[Service Worker] Removing old cache:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Serve cached items immediately for 100% offline access
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // Fallback to network if not pre-cached
      return fetch(e.request).catch(() => {
        // If fetch fails and offline, we could return a default fallback page if available
        console.warn("[Service Worker] Resource not found offline:", e.request.url);
      });
    })
  );
});
