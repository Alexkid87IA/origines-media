export function sanityImg(url: string | undefined, w = 800): string {
  if (!url) return '';
  if (!url.includes('cdn.sanity.io')) return url;
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}fm=webp&w=${w}&q=80&fit=max`;
}

export function sanityOgImg(url: string | undefined): string {
  if (!url) return '';
  if (!url.includes('cdn.sanity.io')) return url;
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}fm=jpg&w=1200&h=630&fit=crop`;
}
