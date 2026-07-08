// src/components/AdSense.tsx
// Composant Google AdSense réutilisable
// S'affiche si consentement local accepté, ou si la CMP Google (TCF) gère le consentement

import { useEffect, useRef, useState } from 'react';
import { useCookieConsent, isTcfCmpActive } from './CookieConsent';
import { AD_CLIENT, isSlotConfigured } from '@/lib/adsConfig';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

// Autorise les pubs si l'utilisateur a accepté notre bannière, ou si la CMP
// Google (Privacy & Messaging) est active — dans ce cas le script AdSense
// respecte lui-même la chaîne TCF.
function useAdsAllowed(): boolean {
  const { hasConsent } = useCookieConsent();
  const [tcfActive, setTcfActive] = useState(false);

  useEffect(() => {
    if (isTcfCmpActive()) {
      setTcfActive(true);
      return;
    }
    // La CMP se charge en async : on revérifie une fois après 2s
    const t = setTimeout(() => {
      if (isTcfCmpActive()) setTcfActive(true);
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  return hasConsent || tcfActive;
}

interface AdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'horizontal' | 'vertical' | 'fluid' | 'autorelaxed';
  adLayout?: string;
  fullWidthResponsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const AdSense: React.FC<AdSenseProps> = ({
  adSlot,
  adFormat = 'auto',
  adLayout,
  fullWidthResponsive = true,
  className = '',
  style = {}
}) => {
  const adRef = useRef<HTMLModElement>(null);
  const isAdLoaded = useRef(false);
  const adsAllowed = useAdsAllowed();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!adsAllowed || isAdLoaded.current) return;

    try {
      // Le pattern de queue fonctionne même si le script async n'est pas encore chargé
      if (adRef.current && adRef.current.children.length === 0) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isAdLoaded.current = true;
      }
    } catch {
      // Fail silently — bloqueur de pub ou script indisponible
    }
  }, [adsAllowed]);

  if (!adsAllowed || !isSlotConfigured(adSlot)) {
    return null;
  }

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: 'block',
          ...style
        }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        {...(adLayout ? { 'data-ad-layout': adLayout } : {})}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  );
};

// Composants pré-configurés pour différents formats

// Rectangle (300x250 ou responsive)
export const AdRectangle: React.FC<{ adSlot: string; className?: string }> = ({
  adSlot,
  className = ''
}) => (
  <div className={`min-h-[250px] ${className}`}>
    <AdSense
      adSlot={adSlot}
      adFormat="rectangle"
      className="flex items-center justify-center"
    />
  </div>
);

// Bannière horizontale
export const AdBanner: React.FC<{ adSlot: string; className?: string }> = ({
  adSlot,
  className = ''
}) => (
  <div className={`min-h-[90px] ${className}`}>
    <AdSense
      adSlot={adSlot}
      adFormat="horizontal"
    />
  </div>
);

// Format auto (responsive)
export const AdAuto: React.FC<{ adSlot: string; className?: string }> = ({
  adSlot,
  className = ''
}) => (
  <div className={className}>
    <AdSense
      adSlot={adSlot}
      adFormat="auto"
      fullWidthResponsive={true}
    />
  </div>
);

// In-article : s'intègre dans le flux de lecture (format fluid)
export const AdInArticle: React.FC<{ adSlot: string; className?: string }> = ({
  adSlot,
  className = ''
}) => (
  <AdSense
    adSlot={adSlot}
    adFormat="fluid"
    adLayout="in-article"
    className={className}
    style={{ textAlign: 'center' }}
  />
);

// Multiplex : grille "contenus recommandés" (équivalent Taboola natif AdSense)
export const AdMultiplex: React.FC<{ adSlot: string; className?: string }> = ({
  adSlot,
  className = ''
}) => (
  <AdSense
    adSlot={adSlot}
    adFormat="autorelaxed"
    className={className}
  />
);

// Placeholder pour le développement (avant validation AdSense)
export const AdPlaceholder: React.FC<{
  format?: 'rectangle' | 'banner';
  className?: string
}> = ({ format = 'rectangle', className = '' }) => (
  <div className={`relative ${className}`}>
    <div className={`
      p-4 bg-gray-100 border border-dashed border-gray-300 rounded-xl
      flex flex-col items-center justify-center text-center
      ${format === 'banner' ? 'min-h-[100px]' : 'min-h-[250px]'}
    `}>
      <p className="text-[10px] uppercase tracking-widest text-gray-400">
        Publicité
      </p>
    </div>
  </div>
);

export default AdSense;
