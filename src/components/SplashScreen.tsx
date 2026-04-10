import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// SplashScreen léger — logo + fade, ~1.6s total
// Skip: sessionStorage, prefers-reduced-motion
// ============================================
const SplashScreen: React.FC = () => {
  const [shouldSkip] = useState(() => {
    if (typeof window === 'undefined') return true;
    return (
      sessionStorage.getItem('splashSeen') === 'true' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  });

  const [visible, setVisible] = useState(!shouldSkip);

  useEffect(() => {
    if (shouldSkip) return;
    sessionStorage.setItem('splashSeen', 'true');
    const timer = setTimeout(() => setVisible(false), 1600);
    return () => clearTimeout(timer);
  }, [shouldSkip]);

  if (shouldSkip) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => setVisible(false)}
          style={{ cursor: 'pointer' }}
        >
          {/* Logo */}
          <motion.img
            src="/logo-origines.png"
            alt="Origines Media"
            className="h-28 sm:h-36 w-auto"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Underline animée */}
          <motion.div
            className="mt-6 h-0.5 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-rose-400"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 120, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />

          {/* Tagline */}
          <motion.p
            className="mt-4 text-sm text-gray-400 tracking-widest uppercase font-inter"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Des récits qui ont du sens
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
