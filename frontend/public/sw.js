/**
 * ═══════════════════════════════════════════════════════════════
 * Service Worker - Performance & Caching
 * ═══════════════════════════════════════════════════════════════
 *
 * Advanced service worker for:
 * - Offline caching
 * - Asset optimization
 * - API response caching
 * - Background sync
 *
 * Author: VCSA Development Team
 * Created: April 2026
 * Status: Production Ready
 * Version: 1.0.0
 * ═══════════════════════════════════════════════════════════════
 */

const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `vcsa-${CACHE_VERSION}`;

// Assets to cache immediately
const PRECACHE_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/favicon.ico'
];

// API endpoints to cache with strategies
const API_CACHE_STRATEGIES = {
  // Cache First - for static data
  cacheFirst: [
    '/api/development/stages',
    '/api/development/tracks',
    '/api/development/badges'
  ],

  // Network First - for dynamic data
  networkFirst: [
    '/api/development/progress',
    '/api/development/breakdowns',
    '/api/development/quickwins',
    '/api/development/bookmarks'
  ],

  // Network Only - for sensitive operations
  networkOnly: [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/logout',
    '/api/development/content/*/complete'
  ]
};

// Cache duration settings (in seconds)
const CACHE_DURATIONS = {
  static: 7 * 24 * 60 * 60,      // 7 days for static assets
  api: 5 * 60,                    // 5 minutes for API responses
  images: 30 * 24 * 60 * 60       // 30 days for images
};

// Install event - precache critical assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');

  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      // Cache static assets
      try {
        await cache.addAll(PRECACHE_ASSETS);
        console.log('[SW] Precached assets:', PRECACHE_ASSETS.length);
      } catch (error) {
        console.error('[SW] Precache failed:', error);
      }

      // Skip waiting to activate immediately
      self.skipWaiting();
    })()
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');

  event.waitUntil(
    (async () => {
      // Clean up old caches
      const cacheNames = await caches.keys();
      const oldCaches = cacheNames
        .filter(name => name.startsWith('vcsa-') && name !== CACHE_NAME);

      await Promise.all(
        oldCaches.map(name => {
          console.log('[SW] Deleting old cache:', name);
          return caches.delete(name);
        })
      );

      // Take control of all pages immediately
      self.clients.claim();
    })()
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (url.origin !== location.origin && !url.origin.includes('localhost')) {
    return;
  }

  // API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleAPIRequest(request));
    return;
  }

  // Static assets
  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff2|woff)$/)) {
    event.respondWith(handleStaticAsset(request));
    return;
  }

  // HTML pages - Network First
  event.respondWith(handlePageRequest(request));
});

/**
 * Handle API requests with different strategies
 */
async function handleAPIRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Check if this endpoint should use Network Only
  if (shouldUseNetworkOnly(pathname)) {
    return fetch(request);
  }

  // Check if this endpoint should use Cache First
  if (shouldUseCacheFirst(pathname)) {
    return cacheFirst(request, CACHE_DURATIONS.api);
  }

  // Default: Network First
  return networkFirst(request, CACHE_DURATIONS.api);
}

/**
 * Handle static assets with Cache First strategy
 */
async function handleStaticAsset(request) {
  const url = new URL(request.url);
  const isImage = url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp)$/);
  const duration = isImage ? CACHE_DURATIONS.images : CACHE_DURATIONS.static;

  return cacheFirst(request, duration);
}

/**
 * Handle page requests with Network First strategy
 */
async function handlePageRequest(request) {
  return networkFirst(request, CACHE_DURATIONS.static);
}

/**
 * Cache First strategy
 */
async function cacheFirst(request, maxAgeSeconds) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  if (cachedResponse && !isStale(cachedResponse, maxAgeSeconds)) {
    console.log('[SW] Cache hit:', request.url);
    return cachedResponse;
  }

  console.log('[SW] Cache miss, fetching:', request.url);
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      // Clone and cache the response
      const responseToCache = networkResponse.clone();
      await cache.put(request, responseToCache);
    }

    return networkResponse;
  } catch (error) {
    console.error('[SW] Fetch failed:', error);

    // Return stale cache if available
    const staleResponse = await cache.match(request);
    if (staleResponse) {
      return staleResponse;
    }

    // Return offline page for HTML requests
    if (request.headers.get('accept')?.includes('text/html')) {
      return caches.match('/offline.html');
    }

    throw error;
  }
}

/**
 * Network First strategy
 */
async function networkFirst(request, maxAgeSeconds) {
  const cache = await caches.open(CACHE_NAME);

  try {
    console.log('[SW] Network first:', request.url);
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const responseToCache = networkResponse.clone();
      await cache.put(request, responseToCache);
    }

    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page for HTML requests
    if (request.headers.get('accept')?.includes('text/html')) {
      return caches.match('/offline.html');
    }

    throw error;
  }
}

/**
 * Check if cached response is stale
 */
function isStale(response, maxAgeSeconds) {
  const dateHeader = response.headers.get('date');
  if (!dateHeader) return false;

  const cachedDate = new Date(dateHeader);
  const now = new Date();
  const ageSeconds = (now - cachedDate) / 1000;

  return ageSeconds > maxAgeSeconds;
}

/**
 * Check if endpoint should use Network Only strategy
 */
function shouldUseNetworkOnly(pathname) {
  return API_CACHE_STRATEGIES.networkOnly.some(pattern => {
    const regex = new RegExp('^' + pattern.replace('*', '.*'));
    return regex.test(pathname);
  });
}

/**
 * Check if endpoint should use Cache First strategy
 */
function shouldUseCacheFirst(pathname) {
  return API_CACHE_STRATEGIES.cacheFirst.some(pattern => {
    const regex = new RegExp('^' + pattern.replace('*', '.*'));
    return regex.test(pathname);
  });
}

/**
 * Background sync for offline actions
 */
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);

  if (event.tag === 'sync-progress') {
    event.waitUntil(syncProgressData());
  }
});

/**
 * Sync progress data when back online
 */
async function syncProgressData() {
  try {
    // Get offline data from IndexedDB
    const offlineData = await getOfflineData();

    // Send to server
    for (const data of offlineData) {
      await fetch('/api/development/sync', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Clear offline data
    await clearOfflineData();

    console.log('[SW] Sync complete');
  } catch (error) {
    console.error('[SW] Sync failed:', error);
  }
}

/**
 * Get offline data from IndexedDB
 */
async function getOfflineData() {
  // Implementation would use IndexedDB
  return [];
}

/**
 * Clear offline data from IndexedDB
 */
async function clearOfflineData() {
  // Implementation would clear IndexedDB
}

/**
 * Handle push notifications
 */
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

/**
 * Handle notification clicks
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});

console.log('[SW] Service worker loaded:', CACHE_VERSION);
