import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

// ============================================
// PALETTE CINÉMA PREMIUM
// ============================================
const COLORS = {
  violet: '#8B5CF6',
  pink: '#EC4899',
  amber: '#F59E0B',
  emerald: '#10B981',
  indigo: '#6366F1',
  cyan: '#06B6D4',
  rose: '#F43F5E',
  purple: '#A855F7',
};

const COLOR_ARRAY = Object.values(COLORS);

// Characters for scramble effect
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';

// ============================================
// HOOK: Text Scramble Effect
// ============================================
const useScrambleText = (text: string, isActive: boolean, speed: number = 50) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setDisplayText('');
      setIsComplete(false);
      return;
    }

    let iteration = 0;
    const maxIterations = text.length;

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) return text[index];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('')
      );

      if (iteration >= maxIterations) {
        clearInterval(interval);
        setIsComplete(true);
      }

      iteration += 1 / 3;
    }, speed);

    return () => clearInterval(interval);
  }, [text, isActive, speed]);

  return { displayText, isComplete };
};

// ============================================
// COMPOSANT: Scanlines (CRT Effect)
// ============================================
const Scanlines: React.FC<{ opacity: number }> = ({ opacity }) => (
  <div
    className="absolute inset-0 pointer-events-none z-50"
    style={{
      opacity,
      background: `repeating-linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.03),
        rgba(0, 0, 0, 0.03) 1px,
        transparent 1px,
        transparent 2px
      )`,
    }}
  />
);

// ============================================
// COMPOSANT: Vignette
// ============================================
const Vignette: React.FC<{ intensity: number }> = ({ intensity }) => (
  <div
    className="absolute inset-0 pointer-events-none z-40"
    style={{
      background: `radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0,0,0,${intensity}) 100%)`,
    }}
  />
);

// ============================================
// COMPOSANT: Shockwave Ripple
// ============================================
const Shockwave: React.FC<{ trigger: boolean }> = ({ trigger }) => (
  <AnimatePresence>
    {trigger && (
      <>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{
              border: `2px solid ${COLOR_ARRAY[i]}`,
              boxShadow: `0 0 20px ${COLOR_ARRAY[i]}40`,
            }}
            initial={{ width: 0, height: 0, opacity: 1 }}
            animate={{ width: 1500, height: 1500, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2,
              delay: i * 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        ))}
      </>
    )}
  </AnimatePresence>
);

// ============================================
// COMPOSANT: Particle Explosion
// ============================================
const ParticleExplosion: React.FC<{ trigger: boolean }> = ({ trigger }) => {
  const particles = useMemo(() =>
    Array.from({ length: 100 }, (_, i) => ({
      id: i,
      angle: (i / 100) * Math.PI * 2 + Math.random() * 0.5,
      distance: 200 + Math.random() * 400,
      size: 2 + Math.random() * 6,
      color: COLOR_ARRAY[i % COLOR_ARRAY.length],
      duration: 1 + Math.random() * 1,
    })), []
  );

  return (
    <AnimatePresence>
      {trigger && (
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute left-1/2 top-1/2 rounded-full"
              style={{
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
              }}
              initial={{
                x: 0,
                y: 0,
                opacity: 1,
                scale: 0,
              }}
              animate={{
                x: Math.cos(p.angle) * p.distance,
                y: Math.sin(p.angle) * p.distance,
                opacity: [1, 1, 0],
                scale: [0, 1.5, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: p.duration,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

// ============================================
// COMPOSANT: Magnetic Logo
// ============================================
const MagneticLogo: React.FC<{
  isVisible: boolean;
  isExiting: boolean;
  mouseX: number;
  mouseY: number;
}> = ({ isVisible, isExiting, mouseX, mouseY }) => {
  const x = useSpring(0, { stiffness: 150, damping: 15 });
  const y = useSpring(0, { stiffness: 150, damping: 15 });
  const rotateX = useSpring(0, { stiffness: 150, damping: 15 });
  const rotateY = useSpring(0, { stiffness: 150, damping: 15 });

  useEffect(() => {
    if (isExiting || !isVisible) {
      x.set(0);
      y.set(0);
      rotateX.set(0);
      rotateY.set(0);
      return;
    }
    x.set(mouseX * 30);
    y.set(mouseY * 30);
    rotateY.set(mouseX * 15);
    rotateX.set(-mouseY * 15);
  }, [mouseX, mouseY, isExiting, isVisible, x, y, rotateX, rotateY]);

  const logoExitPosition = {
    x: typeof window !== 'undefined' ? -window.innerWidth / 2 + 85 : -500,
    y: typeof window !== 'undefined' ? -window.innerHeight / 2 + 45 : -300,
  };

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 z-50"
      initial={{
        x: '-50%',
        y: '-50%',
        scale: 0,
        opacity: 0,
      }}
      animate={isExiting ? {
        x: logoExitPosition.x,
        y: logoExitPosition.y,
        scale: 0.28,
        opacity: 0,
      } : {
        x: '-50%',
        y: '-50%',
        scale: isVisible ? 1 : 0,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{
        duration: isExiting ? 1 : 1.5,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ perspective: '1200px' }}
    >
      <motion.div
        style={{
          x,
          y,
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Multiple glow layers */}
        <motion.div
          className="absolute -inset-24 -z-10"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: isVisible && !isExiting ? 1 : 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <div
            className="w-full h-full rounded-full blur-3xl"
            style={{
              background: `radial-gradient(circle, ${COLORS.violet}40 0%, ${COLORS.pink}20 40%, transparent 70%)`,
            }}
          />
        </motion.div>

        {/* Logo with chromatic effect on hover */}
        <motion.img
          src="/logo-origines.png"
          alt="Origines Media"
          className="h-32 sm:h-36 md:h-40 lg:h-44 w-auto"
          style={{
            filter: 'drop-shadow(0 25px 50px rgba(139, 92, 246, 0.4))',
          }}
          initial={{ scale: 3, filter: 'blur(40px) brightness(3)' }}
          animate={{
            scale: isExiting ? 0.8 : 1,
            filter: isExiting ? 'blur(5px) brightness(1)' : 'blur(0px) brightness(1)',
          }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Animated underline */}
        <motion.div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 h-1 rounded-full overflow-hidden"
          initial={{ width: 0, opacity: 0 }}
          animate={{
            width: isExiting ? 0 : 200,
            opacity: isExiting ? 0 : 1,
          }}
          transition={{ duration: 1, delay: isExiting ? 0 : 0.8 }}
        >
          <motion.div
            className="h-full w-[300%]"
            style={{
              background: `linear-gradient(90deg, transparent, ${COLORS.violet}, ${COLORS.pink}, ${COLORS.amber}, ${COLORS.cyan}, transparent)`,
            }}
            animate={{ x: ['-66%', '0%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// ============================================
// COMPOSANT PRINCIPAL: SplashScreen
// ============================================
const SplashScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [stage, setStage] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [showExplosion, setShowExplosion] = useState(false);
  const [showShockwave, setShowShockwave] = useState(false);

  // Mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set((clientX / innerWidth) - 0.5);
    mouseY.set((clientY / innerHeight) - 0.5);
  }, [mouseX, mouseY]);

  // Text scramble for tagline
  const tagline = "Des récits qui ont du sens";
  const { displayText } = useScrambleText(tagline, stage >= 2, 40);

  useEffect(() => {
    // Le tagline "Des récits qui ont du sens" = 26 caractères
    // Scramble: 26 chars * 3 iterations * 40ms = ~3100ms
    // On démarre le scramble à 1400ms, il finit vers 4500ms
    // On attend 1.5s après la fin pour que l'utilisateur puisse lire
    const timers = [
      // Start with explosion + white reveal
      setTimeout(() => {
        setShowExplosion(true);
        setShowShockwave(true);
        setStage(1);
      }, 100),
      setTimeout(() => setShowExplosion(false), 1100),
      setTimeout(() => setStage(2), 1400),     // Tagline scramble starts
      setTimeout(() => setIsExiting(true), 6000),  // Exit after tagline is complete + pause
      setTimeout(() => setIsVisible(false), 7000),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] overflow-hidden bg-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          onMouseMove={handleMouseMove}
          onClick={() => stage >= 1 && !isExiting && setIsExiting(true)}
          style={{ cursor: stage >= 1 ? 'pointer' : 'default' }}
        >
          {/* Shockwave */}
          <Shockwave trigger={showShockwave} />

          {/* Particle Explosion */}
          <ParticleExplosion trigger={showExplosion} />

          {/* Magnetic Logo */}
          <MagneticLogo
            isVisible={stage >= 1}
            isExiting={isExiting}
            mouseX={smoothMouseX.get()}
            mouseY={smoothMouseY.get()}
          />

          {/* Scrambled Tagline */}
          {stage >= 2 && (
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 mt-36 sm:mt-40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: isExiting ? 0 : 1 }}
              transition={{ duration: isExiting ? 0.3 : 0.5 }}
            >
              <p className="text-xl sm:text-2xl md:text-3xl text-gray-600 font-mono tracking-wide text-center">
                {displayText || tagline.replace(/./g, ' ')}
              </p>
            </motion.div>
          )}

          {/* Premium corners */}
          {stage >= 1 && (
            <>
              {[
                { pos: 'top-6 left-6 sm:top-10 sm:left-10', border: 'border-l-2 border-t-2', color: COLORS.violet },
                { pos: 'top-6 right-6 sm:top-10 sm:right-10', border: 'border-r-2 border-t-2', color: COLORS.pink },
                { pos: 'bottom-6 left-6 sm:bottom-10 sm:left-10', border: 'border-l-2 border-b-2', color: COLORS.amber },
                { pos: 'bottom-6 right-6 sm:bottom-10 sm:right-10', border: 'border-r-2 border-b-2', color: COLORS.cyan },
              ].map((corner, i) => (
                <motion.div
                  key={i}
                  className={`absolute ${corner.pos}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: isExiting ? 0 : 0.5, scale: isExiting ? 0 : 1 }}
                  transition={{ duration: 0.5, delay: isExiting ? 0 : 0.3 + i * 0.1 }}
                >
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 ${corner.border}`}
                    style={{ borderColor: `${corner.color}50` }}
                  />
                </motion.div>
              ))}
            </>
          )}

          {/* Animated gradient line */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1.5 overflow-hidden"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: stage >= 1 && !isExiting ? 1 : 0, scaleX: stage >= 1 ? 1 : 0 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              className="h-full w-[200%]"
              style={{ background: `linear-gradient(90deg, ${[...COLOR_ARRAY, ...COLOR_ARRAY].join(', ')})` }}
              animate={{ x: [0, '-50%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>

          {/* Scanlines & Vignette */}
          <Scanlines opacity={0.03} />
          <Vignette intensity={0.15} />

          {/* Skip hint */}
          {stage >= 2 && !isExiting && (
            <motion.div
              className="absolute bottom-12 left-1/2 -translate-x-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 1 }}
            >
              <span className="text-xs text-gray-400 tracking-[0.3em] uppercase">
                Cliquez pour continuer
              </span>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
