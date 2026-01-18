// src/components/share-story/ShareStoryHero.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

const ShareStoryHero: React.FC = () => {
  const words = ['parcours', 'transformation', 'renaissance', 'histoire', 'chemin'];
  const [currentWord, setCurrentWord] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center">
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Main title - Compact */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-[1.1]">
            Votre{' '}
            <motion.span
              key={currentWord}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-rose-500"
            >
              {words[currentWord]}
            </motion.span>
            {' '}mérite d'être racontée
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Rejoignez les voix qui inspirent, transforment et éclairent.
            Partagez votre récit avec la communauté Origines.
          </p>

          {/* CTA Button - Plus petit et coloré */}
          <motion.a
            href="#temoignages"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full
              bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium
              shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            Découvrir les témoignages
            <ArrowDown className="w-4 h-4" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default ShareStoryHero;
