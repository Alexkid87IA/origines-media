// src/lib/registerSW.ts
// Service Worker registration avec gestion des mises à jour

interface SWConfig {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onError?: (error: Error) => void;
}

export function registerServiceWorker(config: SWConfig = {}): void {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    // Attendre que la page soit complètement chargée
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });

        console.log('[SW] Registration successful:', registration.scope);

        // Vérifier les mises à jour périodiquement (toutes les heures)
        setInterval(() => {
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
                console.log('[SW] New content available, please refresh.');
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
                console.log('[SW] Content cached for offline use.');
                config.onSuccess?.(registration);
              }
            }
          };
        };
      } catch (error) {
        console.error('[SW] Registration failed:', error);
        config.onError?.(error instanceof Error ? error : new Error(String(error)));
      }
    });

    // Écouter les messages du SW
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data?.type === 'CACHE_UPDATED') {
        console.log('[SW] Cache updated:', event.data.url);
      }
    });
  }
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
  console.log('[SW] All caches cleared');
}
