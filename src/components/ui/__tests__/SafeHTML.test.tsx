import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import SafeHTML from '../SafeHTML';

describe('SafeHTML', () => {
  it('affiche le contenu HTML basique', () => {
    const { container } = render(<SafeHTML html="<p>Bonjour</p>" />);
    expect(container.textContent).toBe('Bonjour');
  });

  it('retire les balises <script> (protection XSS)', () => {
    const { container } = render(
      <SafeHTML html='<p>Safe</p><script>alert("xss")</script>' />
    );
    expect(container.querySelector('script')).toBeNull();
    expect(container.textContent).toBe('Safe');
  });

  it('retire les event handlers inline (onerror, onclick)', () => {
    const { container } = render(
      <SafeHTML html='<img src="x" onerror="alert(1)" alt="test" />' />
    );
    const img = container.querySelector('img');
    expect(img).not.toBeNull();
    expect(img?.getAttribute('onerror')).toBeNull();
  });

  it('conserve les balises whitelisted (p, strong, em)', () => {
    const { container } = render(
      <SafeHTML html="<p><strong>Gras</strong> et <em>italique</em></p>" />
    );
    expect(container.querySelector('strong')?.textContent).toBe('Gras');
    expect(container.querySelector('em')?.textContent).toBe('italique');
  });

  it('bloque les iframes hors whitelist de domaines', () => {
    const { container } = render(
      <SafeHTML html='<iframe src="https://evil.example.com/embed"></iframe>' />
    );
    expect(container.querySelector('iframe')).toBeNull();
    expect(container.textContent).toContain('non disponible');
  });

  it('accepte les iframes YouTube', () => {
    const { container } = render(
      <SafeHTML html='<iframe src="https://www.youtube.com/embed/xyz"></iframe>' />
    );
    expect(container.querySelector('iframe')).not.toBeNull();
  });

  it('ajoute rel="noopener noreferrer" aux liens externes', () => {
    const { container } = render(
      <SafeHTML html='<a href="https://example.com">lien</a>' />
    );
    const link = container.querySelector('a');
    expect(link?.getAttribute('rel')).toContain('noopener');
    expect(link?.getAttribute('rel')).toContain('noreferrer');
  });
});
