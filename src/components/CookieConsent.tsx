import { useState, useEffect } from 'react';
import styles from './CookieConsent.module.css';

const CONSENT_KEY = 'cookie-consent';

export type ConsentType = 'accepted' | 'refused' | null;

// La CMP Google (Privacy & Messaging / TCF) expose window.__tcfapi quand elle est
// active : dans ce cas c'est elle qui gère le consentement, pas notre bannière.
export const isTcfCmpActive = () =>
  typeof window !== 'undefined' && typeof (window as any).__tcfapi === 'function';

function updateGtagConsent(granted: boolean) {
  const w = window as any;
  if (typeof w.gtag !== 'function') return;
  const value = granted ? 'granted' : 'denied';
  w.gtag('consent', 'update', {
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
    analytics_storage: value,
  });
}

export const useCookieConsent = () => {
  const [consent, setConsent] = useState<ConsentType>(() => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(CONSENT_KEY);
    return stored as ConsentType;
  });

  const acceptCookies = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    updateGtagConsent(true);
    setConsent('accepted');
  };

  const refuseCookies = () => {
    localStorage.setItem(CONSENT_KEY, 'refused');
    updateGtagConsent(false);
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
      const t = setTimeout(() => {
        if (!isTcfCmpActive()) setVisible(true);
      }, 1500);
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
          Nous utilisons des cookies pour mesurer l&apos;audience et financer le site par la publicit&eacute;.{' '}
          <a href="/cookies">En savoir plus</a>
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
