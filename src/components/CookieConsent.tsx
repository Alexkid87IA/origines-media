// src/components/CookieConsent.tsx
// Bannière de consentement cookies RGPD

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

// Clé localStorage pour stocker le consentement
const CONSENT_KEY = 'cookie-consent';

// Types de consentement
export type ConsentType = 'accepted' | 'refused' | null;

// Hook pour récupérer/gérer le consentement
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

  const hasConsent = consent === 'accepted';
  const hasResponded = consent !== null;

  return { consent, hasConsent, hasResponded, acceptCookies, refuseCookies };
};

// Composant bannière
const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { hasResponded, acceptCookies, refuseCookies } = useCookieConsent();

  useEffect(() => {
    // Afficher la bannière après un court délai si pas de réponse
    if (!hasResponded) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [hasResponded]);

  const handleAccept = () => {
    acceptCookies();
    setIsVisible(false);
  };

  const handleRefuse = () => {
    refuseCookies();
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[9998] p-4 sm:p-6"
        >
          <div className="max-w-4xl mx-auto">
            <div
              className="relative bg-gray-900 rounded-2xl p-5 sm:p-6 shadow-2xl border border-gray-800"
              style={{ boxShadow: '0 -10px 40px rgba(0,0,0,0.3)' }}
            >
              {/* Bouton fermer (refuse) */}
              <button
                onClick={handleRefuse}
                className="absolute top-3 right-3 p-2 text-gray-500 hover:text-gray-300 transition-colors"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                {/* Icône */}
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center">
                  <Cookie className="w-6 h-6 text-white" />
                </div>

                {/* Contenu */}
                <div className="flex-1 pr-8 sm:pr-0">
                  <h3 className="text-white font-bold text-base sm:text-lg mb-1">
                    Nous respectons votre vie privée
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Nous utilisons des cookies pour améliorer votre expérience et analyser le trafic.
                    En cliquant sur "Accepter", vous consentez à l'utilisation de tous les cookies.{' '}
                    <Link
                      to="/mentions-legales"
                      className="text-violet-400 hover:text-violet-300 underline underline-offset-2"
                    >
                      En savoir plus
                    </Link>
                  </p>
                </div>

                {/* Boutons */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleRefuse}
                    className="flex-1 sm:flex-none px-5 py-2.5 text-sm font-semibold text-gray-400 hover:text-white border border-gray-700 hover:border-gray-600 rounded-xl transition-all"
                  >
                    Refuser
                  </button>
                  <button
                    onClick={handleAccept}
                    className="flex-1 sm:flex-none px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 rounded-xl transition-all shadow-lg shadow-violet-500/25"
                  >
                    Accepter
                  </button>
                </div>
              </div>

              {/* Badge sécurité */}
              <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-gray-800">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[11px] text-gray-500">
                  Vos données sont protégées conformément au RGPD
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
