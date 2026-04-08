import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Badge from '../Badge';

describe('Badge', () => {
  it('affiche le label', () => {
    render(<Badge>Nouveau</Badge>);
    expect(screen.getByText('Nouveau')).toBeInTheDocument();
  });

  it('applique la couleur custom en variant solid', () => {
    render(
      <Badge variant="solid" color="#FF0000">
        Solid
      </Badge>
    );
    const badge = screen.getByText('Solid');
    // backgroundColor est convertie par le navigateur/jsdom
    expect(badge.style.backgroundColor).toBeTruthy();
    expect(badge.style.color).toBeTruthy();
  });

  it('applique la couleur custom en variant outline', () => {
    render(
      <Badge variant="outline" color="#00FF00">
        Outline
      </Badge>
    );
    const badge = screen.getByText('Outline');
    expect(badge.style.borderColor).toBeTruthy();
    expect(badge.style.color).toBeTruthy();
  });
});
