// ============================================================
// Chamchamal Fine Arts Archive — Service Worker v6
// Strategy: NetworkFirst for all application code, chunks & data.
// CacheFirst only for font binaries.
// Automatically evicts all stale caches on activation.
// ============================================================

const CACHE_VERSION = 'v6';
const CACHE_NAME = `chamchamal-fine-arts-cache-${CACHE_VERSION}`;

// Only pre-cache the app shell manifest — NOT data pages.
// Pages with dynamic data must always go to network first.
const PRECACHE_URLS = [
  '/manifest.webmanifest',
];

// ── Install: pre-cache minimal shell ────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    }).then(() => self.skipWaiting())
  );
});

// ── Activate: delete ALL stale caches immediately ───────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting stale cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('[SW] Activated cache:', CACHE_NAME);
      // Take control of all open clients immediately
      return self.clients.claim();
    })
  );
});

// ── Fetch: route-based caching strategy ─────────────────────
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Ignore non-GET requests (POST, PUT, DELETE — Supabase writes)
  if (request.method !== 'GET') return;

  // Ignore chrome-extension and non-http requests
  if (!url.protocol.startsWith('http')) return;

  // ── STRATEGY 1: CacheFirst — Fonts Only ──
  if (
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.woff')
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // ── STRATEGY 2: NetworkFirst — Everything else (chunks, HTML, textures, GLB, API) ──
  // The user ALWAYS sees the freshest code and 3D assets when online.
  // Falls back to cache only when completely offline.
  event.respondWith(networkFirst(request));
});

// ── CacheFirst helper ────────────────────────────────────────
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (_) {
    // Offline and not cached — return empty response
    return new Response('', { status: 408, statusText: 'Offline' });
  }
}

// ── NetworkFirst helper ──────────────────────────────────────
async function networkFirst(request) {
  try {
    // Always try the network first
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      // Update the cache with the fresh response
      const cache = await caches.open(CACHE_NAME);
      // Only cache same-origin responses (not Supabase API responses
      // which may have CORS-opaque status). We use 'no-cors' check.
      if (networkResponse.type !== 'opaque') {
        cache.put(request, networkResponse.clone());
      }
    }
    return networkResponse;
  } catch (_) {
    // Network failed (offline) — try the cache as fallback
    const cached = await caches.match(request);
    if (cached) return cached;
    // Last resort: return the cached root page for navigation requests
    if (request.mode === 'navigate') {
      const rootCache = await caches.match('/');
      if (rootCache) return rootCache;
    }
    return new Response('You are offline and this page has not been cached yet.', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}
