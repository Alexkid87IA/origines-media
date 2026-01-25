// Service Worker pour Origines Media
// Stratégie: Cache-First pour assets statiques, Network-First pour API

const CACHE_NAME = 'origines-media-v1';
const STATIC_CACHE = 'origines-static-v1';
const DYNAMIC_CACHE = 'origines-dynamic-v1';
const IMAGE_CACHE = 'origines-images-v1';

// Assets statiques à pré-cacher
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/site.webmanifest',
  '/favicon-32x32.png',
  '/favicon-192x192.png',
  '/og-image.png',
];

// Patterns pour le cache
const CACHE_PATTERNS = {
  static: /\.(js|css|woff2?|ttf|eot)$/,
  images: /\.(png|jpg|jpeg|gif|webp|avif|svg|ico)$/,
  api: /\/api\//,
  sanity: /cdn\.sanity\.io/,
  youtube: /youtube\.com|ytimg\.com/,
};

// Installation - Pré-cache des assets statiques
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Pre-caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  // Activer immédiatement sans attendre les onglets
  self.skipWaiting();
});

// Activation - Nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            return name.startsWith('origines-') &&
                   name !== STATIC_CACHE &&
                   name !== DYNAMIC_CACHE &&
                   name !== IMAGE_CACHE;
          })
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  // Prendre le contrôle immédiatement
  self.clients.claim();
});

// Stratégie Cache-First pour les images
async function cacheFirstStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network request failed:', request.url);
    // Retourner une image placeholder si disponible
    return caches.match('/og-image.png');
  }
}

// Stratégie Network-First avec fallback cache
async function networkFirstStrategy(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Stratégie Stale-While-Revalidate pour les pages
async function staleWhileRevalidateStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => cachedResponse);

  return cachedResponse || fetchPromise;
}

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorer les requêtes non-GET
  if (request.method !== 'GET') return;

  // Ignorer les requêtes vers d'autres origines (sauf CDN autorisés)
  if (url.origin !== self.location.origin &&
      !CACHE_PATTERNS.sanity.test(url.href) &&
      !CACHE_PATTERNS.youtube.test(url.href)) {
    return;
  }

  // Images Sanity - Cache First avec durée longue
  if (CACHE_PATTERNS.sanity.test(url.href)) {
    event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE));
    return;
  }

  // Images locales - Cache First
  if (CACHE_PATTERNS.images.test(url.pathname)) {
    event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE));
    return;
  }

  // Assets statiques (JS, CSS, fonts) - Cache First
  if (CACHE_PATTERNS.static.test(url.pathname)) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
    return;
  }

  // API - Network First
  if (CACHE_PATTERNS.api.test(url.pathname)) {
    event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE));
    return;
  }

  // Pages HTML - Stale While Revalidate
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(staleWhileRevalidateStrategy(request, DYNAMIC_CACHE));
    return;
  }

  // Fallback - Network First
  event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE));
});

// Gestion des messages (pour les mises à jour)
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});

console.log('[SW] Service Worker loaded');
