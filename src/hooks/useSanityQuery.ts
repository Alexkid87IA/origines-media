// src/hooks/useSanityQuery.ts
// Hook custom pour utiliser React Query avec Sanity
import { useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { sanityFetch } from '../lib/sanity';

interface UseSanityQueryOptions<T> extends Omit<UseQueryOptions<T, Error, T, string[]>, 'queryKey' | 'queryFn'> {
  params?: Record<string, unknown>;
}

/**
 * Sérialisation déterministe d'un objet : trie les clés pour garantir
 * que {a:1,b:2} et {b:2,a:1} produisent la même chaîne (cache key stable).
 */
function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return '[' + value.map(stableStringify).join(',') + ']';
  }
  const keys = Object.keys(value as Record<string, unknown>).sort();
  return '{' + keys
    .map(k => JSON.stringify(k) + ':' + stableStringify((value as Record<string, unknown>)[k]))
    .join(',') + '}';
}

function buildCacheKey(queryKey: string | string[], params?: Record<string, unknown>): string[] {
  const key = Array.isArray(queryKey) ? queryKey : [queryKey];
  return params && Object.keys(params).length > 0
    ? [...key, stableStringify(params)]
    : key;
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
  const fullKey = buildCacheKey(queryKey, params);

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
  const queryClient = useQueryClient();

  return <T,>(queryKey: string | string[], query: string, params?: Record<string, unknown>) => {
    const fullKey = buildCacheKey(queryKey, params);

    queryClient.prefetchQuery({
      queryKey: fullKey,
      queryFn: () => sanityFetch<T>(query, params),
      staleTime: 5 * 60 * 1000,
    });
  };
}

export default useSanityQuery;
