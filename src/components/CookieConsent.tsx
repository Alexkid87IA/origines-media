import { useState, useEffect } from 'react';
import styles from './CookieConsent.module.css';

const CONSENT_KEY = 'cookie-consent';

export type ConsentType = 'accepted' | 'refused' | null;

export const useCookieConsent = () => {
  const [consent, setConsent] = useState<ConsentType>(() => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(CONSENT_KEY);
    return stored as ConsentType;
  });

  const acceptCookies = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setConsent('accepted');
  };

  const refuseCookies = () => {
    localStorage.setItem(CONSENT_KEY, 'refused');
    setConsent('refused');
  };

  return { consent, hasConsent: consent === 'accepted', hasResponded: consent !== null, acceptCookies, refuseCookies };
};

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const { hasResponded, acceptCookies, refuseCookies } = useCookieConsent();

  useEffect(() => {
    if (!hasResponded) {
      const t = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(t);
    }
  }, [hasResponded]);

  const dismiss = (accept: boolean) => {
    setClosing(true);
    setTimeout(() => {
      if (accept) acceptCookies(); else refuseCookies();
      setVisible(false);
    }, 400);
  };

  if (!visible) return null;

  return (
    <div className={`${styles.banner}${closing ? ` ${styles.bannerOut}` : ''}`}>
      <div className={styles.inner}>
        <span className={styles.label}>Cookies</span>
        <p className={styles.text}>
          Nous utilisons des cookies pour am&eacute;liorer votre exp&eacute;rience et analyser le trafic.{' '}
          <a href="/mentions-legales">En savoir plus</a>
        </p>
        <div className={styles.actions}>
          <button className={styles.refuse} onClick={() => dismiss(false)} type="button">
            Refuser
          </button>
          <button className={styles.accept} onClick={() => dismiss(true)} type="button">
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
