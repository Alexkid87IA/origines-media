// src/hooks/useSanityQuery.ts
// Hook custom pour utiliser React Query avec Sanity
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { sanityFetch } from '../lib/sanity';

interface UseSanityQueryOptions<T> extends Omit<UseQueryOptions<T, Error, T, string[]>, 'queryKey' | 'queryFn'> {
  params?: Record<string, unknown>;
}

/**
 * Hook pour fetcher des données Sanity avec React Query
 * Bénéficie du cache automatique et de la déduplication des requêtes
 *
 * @example
 * const { data, isLoading, error } = useSanityQuery<Article[]>(
 *   'articles',
 *   ARTICLES_QUERY,
 *   { params: { limit: 10 } }
 * );
 */
export function useSanityQuery<T>(
  queryKey: string | string[],
  query: string,
  options?: UseSanityQueryOptions<T>
) {
  const { params = {}, ...queryOptions } = options || {};

  // Normaliser la clé de query
  const key = Array.isArray(queryKey) ? queryKey : [queryKey];

  // Ajouter les params à la clé pour différencier les variantes
  const fullKey = params && Object.keys(params).length > 0
    ? [...key, JSON.stringify(params)]
    : key;

  return useQuery<T, Error>({
    queryKey: fullKey,
    queryFn: () => sanityFetch<T>(query, params),
    ...queryOptions,
  });
}

/**
 * Hook pour précharger des données Sanity
 * Utile pour le prefetching au survol d'un lien
 */
export function usePrefetchSanity() {
  // Import dynamique pour éviter les dépendances circulaires
  const { useQueryClient } = require('@tanstack/react-query');
  const queryClient = useQueryClient();

  return <T,>(queryKey: string | string[], query: string, params?: Record<string, unknown>) => {
    const key = Array.isArray(queryKey) ? queryKey : [queryKey];
    const fullKey = params && Object.keys(params).length > 0
      ? [...key, JSON.stringify(params)]
      : key;

    queryClient.prefetchQuery({
      queryKey: fullKey,
      queryFn: () => sanityFetch<T>(query, params),
      staleTime: 5 * 60 * 1000,
    });
  };
}

export default useSanityQuery;
