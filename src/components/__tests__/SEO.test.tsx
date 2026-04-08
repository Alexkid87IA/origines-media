import { describe, it, expect, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import SEO from '../SEO';

const renderSEO = (props: React.ComponentProps<typeof SEO>) =>
  render(
    <HelmetProvider>
      <SEO {...props} />
    </HelmetProvider>
  );

describe('SEO', () => {
  beforeEach(() => {
    // Reset l'état du <head> entre les tests
    document.head.innerHTML = '';
  });

  it('génère un title avec le suffixe du site', async () => {
    renderSEO({ title: 'Article de test' });
    await waitFor(() => {
      expect(document.title).toBe('Article de test | Origines Media');
    });
  });

  it('utilise le title par défaut sans prop title', async () => {
    renderSEO({});
    await waitFor(() => {
      expect(document.title).toBe('Origines Media');
    });
  });

  it('génère un canonical correct', async () => {
    renderSEO({ url: '/article/mon-slug' });
    await waitFor(() => {
      const canonical = document.head.querySelector('link[rel="canonical"]');
      expect(canonical?.getAttribute('href')).toBe(
        'https://origines.media/article/mon-slug'
      );
    });
  });

  it('génère le JSON-LD Organization', async () => {
    renderSEO({ jsonLd: 'organization' });
    await waitFor(() => {
      const scripts = document.head.querySelectorAll(
        'script[type="application/ld+json"]'
      );
      expect(scripts.length).toBeGreaterThanOrEqual(1);
      const parsed = JSON.parse(scripts[0].textContent || '{}');
      expect(parsed['@type']).toBe('Organization');
      expect(parsed.name).toBe('Origines Media');
    });
  });

  it('ne duplique pas le breadcrumb quand jsonLd est "breadcrumb"', async () => {
    renderSEO({
      jsonLd: 'breadcrumb',
      breadcrumbs: [
        { name: 'Accueil', url: '/' },
        { name: 'Articles', url: '/articles' },
      ],
    });
    await waitFor(() => {
      const scripts = document.head.querySelectorAll(
        'script[type="application/ld+json"]'
      );
      // Un seul script JSON-LD et non deux
      const breadcrumbScripts = Array.from(scripts).filter((s) => {
        try {
          const parsed = JSON.parse(s.textContent || '{}');
          return parsed['@type'] === 'BreadcrumbList';
        } catch {
          return false;
        }
      });
      expect(breadcrumbScripts.length).toBe(1);
    });
  });

  it('génère le breadcrumb en plus quand jsonLd est autre', async () => {
    renderSEO({
      jsonLd: 'article',
      publishedTime: '2024-01-01',
      breadcrumbs: [{ name: 'Accueil', url: '/' }],
    });
    await waitFor(() => {
      const scripts = document.head.querySelectorAll(
        'script[type="application/ld+json"]'
      );
      const types = Array.from(scripts).map((s) => {
        try {
          return JSON.parse(s.textContent || '{}')['@type'];
        } catch {
          return null;
        }
      });
      expect(types).toContain('Article');
      expect(types).toContain('BreadcrumbList');
    });
  });
});
