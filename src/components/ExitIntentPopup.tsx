import { useState, useEffect, useCallback } from 'react';
import { useSubscribe } from '../hooks/useSubscribe';
import styles from './ExitIntentPopup.module.css';

const COOKIE_NAME = 'origines_exit_popup';
const COOKIE_DAYS = 7;
const MIN_TIME_ON_PAGE_MS = 15000;

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value};expires=${expires};path=/;Secure;SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? match[1] : null;
}

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [triggered, setTriggered] = useState(false);
  const [email, setEmail] = useState('');
  const { status, error, subscribe } = useSubscribe({ source: 'exit-intent' });

  const show = useCallback(() => {
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
    if (getCookie(COOKIE_NAME)) return;
    const timer = setTimeout(() => {
      const handleLeave = (e: MouseEvent) => {
        if (e.clientY <= 0) show();
      };
      document.addEventListener('mouseleave', handleLeave);
      return () => document.removeEventListener('mouseleave', handleLeave);
    }, MIN_TIME_ON_PAGE_MS);
    return () => clearTimeout(timer);
  }, [show]);

  const handleSubmit = async (e: React.FormEvent) => {
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
      <div className={styles.modal}>
        <div className={`${styles.card}${closing ? ` ${styles.cardOut}` : ''}`}>
          <div className={styles.header}>
            <button className={styles.close} onClick={close} type="button" aria-label="Fermer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
            <div className={styles.eyebrow}>La lettre du dimanche</div>
            <h2 className={styles.title}>Avant de partir&hellip;</h2>
            <p className={styles.desc}>
              Chaque dimanche, le meilleur d&rsquo;Origines dans votre bo&icirc;te mail. Gratuit, sans spam.
            </p>
          </div>
          <div className={styles.body}>
            {status === 'success' ? (
              <div className={styles.success}>
                <div className={styles.successIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
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
                  <button
                    type="submit"
                    disabled={status === 'loading' || !email}
                    className={styles.submit}
                  >
                    {status === 'loading' ? (
                      'Envoi…'
                    ) : (
                      <>
                        S&rsquo;abonner
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M5 12h14M13 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
                {status === 'error' && error && (
                  <p className={styles.error}>{error}</p>
                )}
                <p className={styles.legal}>D&eacute;sabonnement en 1 clic &middot; Pas de spam</p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
