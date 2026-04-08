// src/lib/registerSW.ts
// Service Worker registration avec gestion des mises à jour

interface SWConfig {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onError?: (error: Error) => void;
}

const isDev = import.meta.env.DEV;
const log = (...args: unknown[]) => {
  if (isDev) console.log(...args);
};

export function registerServiceWorker(config: SWConfig = {}): () => void {
  // No-op si SW non supporté ou en dev
  if (!('serviceWorker' in navigator) || !import.meta.env.PROD) {
    return () => {};
  }

  let updateInterval: ReturnType<typeof setInterval> | null = null;

  const messageHandler = (event: MessageEvent) => {
    if (event.data?.type === 'CACHE_UPDATED') {
      log('[SW] Cache updated:', event.data.url);
    }
  };

  const loadHandler = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      log('[SW] Registration successful:', registration.scope);

      // Vérifier les mises à jour périodiquement (toutes les heures)
      updateInterval = setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000);

      // Gérer les mises à jour
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (!installingWorker) return;

        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // Nouvelle version disponible
              log('[SW] New content available, please refresh.');
              config.onUpdate?.(registration);

              // Afficher une notification de mise à jour (optionnel)
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Origines Media', {
                  body: 'Une nouvelle version est disponible. Actualisez pour en profiter.',
                  icon: '/favicon-192x192.png',
                });
              }
            } else {
              // Premier cache
              log('[SW] Content cached for offline use.');
              config.onSuccess?.(registration);
            }
          }
        };
      };
    } catch (error) {
      console.error('[SW] Registration failed:', error);
      config.onError?.(error instanceof Error ? error : new Error(String(error)));
    }
  };

  window.addEventListener('load', loadHandler);
  navigator.serviceWorker.addEventListener('message', messageHandler);

  // Cleanup function pour éviter les fuites mémoire
  return () => {
    window.removeEventListener('load', loadHandler);
    navigator.serviceWorker.removeEventListener('message', messageHandler);
    if (updateInterval !== null) {
      clearInterval(updateInterval);
      updateInterval = null;
    }
  };
}

// Fonction pour forcer la mise à jour du SW
export async function updateServiceWorker(): Promise<void> {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration?.waiting) {
      registration.waiting.postMessage('skipWaiting');
      window.location.reload();
    }
  }
}

// Fonction pour vérifier si le SW est actif
export async function isServiceWorkerActive(): Promise<boolean> {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.getRegistration();
    return !!registration?.active;
  }
  return false;
}

// Fonction pour nettoyer tous les caches
export async function clearAllCaches(): Promise<void> {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map((name) => caches.delete(name)));
  log('[SW] All caches cleared');
}
