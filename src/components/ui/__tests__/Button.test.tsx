import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Button from '../Button';

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

describe('Button', () => {
  it('affiche le label enfant', () => {
    render(<Button>Cliquez moi</Button>);
    expect(screen.getByRole('button', { name: /cliquez moi/i })).toBeInTheDocument();
  });

  it('appelle onClick quand cliqué', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={handleClick}>Action</Button>);
    await user.click(screen.getByRole('button', { name: /action/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('ne déclenche pas onClick quand disabled', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Button onClick={handleClick} disabled>
        Action
      </Button>
    );
    await user.click(screen.getByRole('button', { name: /action/i }));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('affiche le spinner quand isLoading', () => {
    const { container } = render(<Button isLoading>Chargement</Button>);
    // Le spinner est un <svg> avec la classe animate-spin
    expect(container.querySelector('svg.animate-spin')).toBeInTheDocument();
  });

  it('désactive le bouton quand isLoading', () => {
    render(<Button isLoading>Chargement</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('variant cta applique la couleur custom via style', () => {
    render(
      <Button variant="cta" color="#FF0000">
        CTA
      </Button>
    );
    const button = screen.getByRole('button', { name: /cta/i });
    expect(button.style.backgroundColor).toBeTruthy();
  });

  it("peut se rendre comme un Link React Router via as='link'", () => {
    renderWithRouter(
      <Button as="link" to="/home">
        Accueil
      </Button>
    );
    const link = screen.getByRole('link', { name: /accueil/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/home');
  });
});
