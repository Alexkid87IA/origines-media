// src/hooks/useScrollProgress.ts
// Hook partagé pour le suivi de progression de lecture et scroll-to-top

import { useState, useEffect, useCallback } from 'react';

interface UseScrollProgressReturn {
  scrollProgress: number;
  showScrollTop: boolean;
  scrollToTop: () => void;
}

export function useScrollProgress(): UseScrollProgressReturn {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
      setShowScrollTop(scrollTop > 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return { scrollProgress, showScrollTop, scrollToTop };
}
