// src/components/AdSense.tsx
// Composant Google AdSense réutilisable

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  fullWidthResponsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const AdSense: React.FC<AdSenseProps> = ({
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = true,
  className = '',
  style = {}
}) => {
  const adRef = useRef<HTMLModElement>(null);
  const isAdLoaded = useRef(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Protection SSR
    if (typeof window === 'undefined') return;

    // Éviter de charger plusieurs fois la même pub
    if (isAdLoaded.current) return;

    try {
      if (adRef.current) {
        // Vérifier que le script AdSense est chargé
        if (!window.adsbygoogle) {
          console.warn('AdSense script not loaded yet');
          setHasError(true);
          return;
        }

        // Vérifier que l'élément n'a pas déjà une pub
        if (adRef.current.children.length === 0) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          isAdLoaded.current = true;
        }
      }
    } catch (error) {
      console.error('AdSense error:', error);
      setHasError(true);
    }
  }, []);

  // Si erreur, ne rien afficher (fail silently)
  if (hasError) {
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
        data-ad-client="ca-pub-1236201752351510"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
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
