// src/hooks/usePerformance.ts
// Hook pour monitorer les performances des composants

import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  componentName: string;
  renderTime: number;
  mountTime?: number;
}

// Store pour les métriques (accessible globalement pour debug)
const metricsStore: PerformanceMetrics[] = [];

/**
 * Hook pour mesurer le temps de rendu d'un composant
 * Usage: usePerformance('MyComponent')
 */
export function usePerformance(componentName: string): void {
  const startTime = useRef(performance.now());
  const mounted = useRef(false);

  useEffect(() => {
    const mountTime = performance.now() - startTime.current;

    if (!mounted.current) {
      mounted.current = true;

      const metrics: PerformanceMetrics = {
        componentName,
        renderTime: mountTime,
        mountTime,
      };

      metricsStore.push(metrics);

      // Log en développement uniquement
      if (import.meta.env.DEV && mountTime > 16) {
        console.warn(
          `[Perf] ${componentName} took ${mountTime.toFixed(2)}ms to mount (>16ms = janky)`
        );
      }
    }
  }, [componentName]);
}

/**
 * Hook pour mesurer le temps d'une opération async
 * Usage: const measure = useAsyncPerformance('fetchData')
 *        await measure(async () => fetch(...))
 */
export function useAsyncPerformance(operationName: string) {
  return async function measure<T>(operation: () => Promise<T>): Promise<T> {
    const start = performance.now();
    try {
      const result = await operation();
      const duration = performance.now() - start;

      if (import.meta.env.DEV) {
        console.log(`[Perf] ${operationName}: ${duration.toFixed(2)}ms`);
      }

      return result;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`[Perf] ${operationName} failed after ${duration.toFixed(2)}ms`);
      throw error;
    }
  };
}

/**
 * Obtenir toutes les métriques collectées
 */
export function getPerformanceMetrics(): PerformanceMetrics[] {
  return [...metricsStore];
}

/**
 * Effacer les métriques
 */
export function clearPerformanceMetrics(): void {
  metricsStore.length = 0;
}

/**
 * Hook pour observer les Long Tasks (>50ms)
 * Utile pour détecter les problèmes de performance
 */
export function useLongTaskObserver(callback?: (duration: number) => void): void {
  useEffect(() => {
    if (typeof PerformanceObserver === 'undefined') return;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const duration = entry.duration;

          if (import.meta.env.DEV) {
            console.warn(`[Perf] Long task detected: ${duration.toFixed(2)}ms`);
          }

          callback?.(duration);
        }
      });

      observer.observe({ entryTypes: ['longtask'] });

      return () => observer.disconnect();
    } catch {
      // Long task observer not supported
    }
  }, [callback]);
}

/**
 * Hook pour observer le Largest Contentful Paint
 */
export function useLCPObserver(callback?: (value: number) => void): void {
  useEffect(() => {
    if (typeof PerformanceObserver === 'undefined') return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];

        if (lastEntry) {
          const lcpValue = lastEntry.startTime;

          if (import.meta.env.DEV) {
            const rating = lcpValue <= 2500 ? 'good' : lcpValue <= 4000 ? 'needs-improvement' : 'poor';
            console.log(`[Perf] LCP: ${lcpValue.toFixed(2)}ms (${rating})`);
          }

          callback?.(lcpValue);
        }
      });

      observer.observe({ type: 'largest-contentful-paint', buffered: true });

      return () => observer.disconnect();
    } catch {
      // LCP observer not supported
    }
  }, [callback]);
}

/**
 * Hook pour observer le Cumulative Layout Shift
 */
export function useCLSObserver(callback?: (value: number) => void): void {
  useEffect(() => {
    if (typeof PerformanceObserver === 'undefined') return;

    let clsValue = 0;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as any[]) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }

        if (import.meta.env.DEV) {
          const rating = clsValue <= 0.1 ? 'good' : clsValue <= 0.25 ? 'needs-improvement' : 'poor';
          console.log(`[Perf] CLS: ${clsValue.toFixed(4)} (${rating})`);
        }

        callback?.(clsValue);
      });

      observer.observe({ type: 'layout-shift', buffered: true });

      return () => observer.disconnect();
    } catch {
      // CLS observer not supported
    }
  }, [callback]);
}
