import { useState, useEffect, useCallback, type FormEvent } from 'react';
import { ArrowRight, Check, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import IconButton from '@/components/ui/IconButton';
import { useSubscribe } from '../hooks/useSubscribe';
import styles from './ExitIntentPopup.module.css';

const COOKIE_NAME = 'origines_exit_popup';
const COOKIE_DAYS = 7;
const MIN_TIME_ON_PAGE_MS = 15000;
const SUPPRESSED_PATHS = [
  '/ecrire-mon-histoire',
  '/racontez-votre-histoire',
  '/inscription',
  '/connexion',
  '/compte',
];

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value};expires=${expires};path=/;Secure;SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? match[1] : null;
}

function isSuppressedPath() {
  if (typeof window === 'undefined') return true;
  return SUPPRESSED_PATHS.some((path) => window.location.pathname.startsWith(path));
}

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [triggered, setTriggered] = useState(false);
  const [email, setEmail] = useState('');
  const { status, error, subscribe } = useSubscribe({ source: 'exit-intent' });

  const show = useCallback(() => {
    if (isSuppressedPath()) return;
    if (triggered || getCookie(COOKIE_NAME)) return;
    setTriggered(true);
    setVisible(true);
  }, [triggered]);

  const close = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      setCookie(COOKIE_NAME, 'dismissed', COOKIE_DAYS);
    }, 300);
  }, []);

  useEffect(() => {
    if (isSuppressedPath()) return;
    if (getCookie(COOKIE_NAME)) return;
    let removeLeave: (() => void) | undefined;
    const timer = setTimeout(() => {
      const handleLeave = (e: MouseEvent) => {
        if (e.clientY <= 0) show();
      };
      document.addEventListener('mouseleave', handleLeave);
      removeLeave = () => document.removeEventListener('mouseleave', handleLeave);
    }, MIN_TIME_ON_PAGE_MS);
    return () => {
      clearTimeout(timer);
      removeLeave?.();
    };
  }, [show]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || status === 'loading') return;
    await subscribe(email);
  };

  if (!visible) return null;

  return (
    <>
      <div
        className={`${styles.overlay}${closing ? ` ${styles.overlayOut}` : ''}`}
        onClick={close}
      />
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="exit-intent-title">
        <Card
          variant="glass"
          size="md"
          className={`${styles.card}${closing ? ` ${styles.cardOut}` : ''}`}
        >
          <span className={styles.accent} aria-hidden="true" />
          <IconButton
            icon={X}
            aria-label="Fermer"
            variant="ghost"
            size="md"
            className={styles.close}
            onClick={close}
            type="button"
          />
          <div className={styles.content}>
            <div className={styles.eyebrow}>La lettre du dimanche</div>
            <h2 id="exit-intent-title" className={styles.title}>Une histoire pour dimanche&nbsp;?</h2>
            <p className={styles.desc}>
              Recevez une s&eacute;lection courte, sensible et utile. Une seule fois par semaine.
            </p>
            {status === 'success' ? (
              <div className={styles.success}>
                <div className={styles.successIcon}>
                  <Check aria-hidden="true" />
                </div>
                <p className={styles.successTitle}>Bienvenue.</p>
                <p className={styles.successDesc}>Rendez-vous dimanche dans votre bo&icirc;te mail.</p>
              </div>
            ) : (
              <>
                <form className={styles.form} onSubmit={handleSubmit}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    required
                    autoComplete="email"
                    spellCheck={false}
                    disabled={status === 'loading'}
                    className={styles.input}
                  />
                  <Button
                    type="submit"
                    disabled={status === 'loading' || !email}
                    variant="gradient"
                    size="lg"
                    fullWidth
                    isLoading={status === 'loading'}
                    rightIcon={ArrowRight}
                    className={styles.submit}
                  >
                    {status === 'loading' ? 'Envoi...' : "S'abonner"}
                  </Button>
                </form>
                {status === 'error' && error && (
                  <p className={styles.error}>{error}</p>
                )}
                <div className={styles.assurances}>
                  <span>1 email / semaine</span>
                  <span>D&eacute;sabonnement en 1 clic</span>
                  <span>Pas de spam</span>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
