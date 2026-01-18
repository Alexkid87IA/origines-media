// src/components/EngagementSection.tsx
// Section Lead Magnet - Kit d'Introspection - Style coloré et lumineux

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Sparkles, Heart, Star } from 'lucide-react';

const EngagementSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  // Features avec couleurs du livre
  const features = [
    { icon: Sparkles, text: '24 pages de contenu exclusif', color: '#06B6D4' }, // Cyan
    { icon: Heart, text: 'Exercices pratiques guidés', color: '#EC4899' }, // Pink
    { icon: Star, text: 'Outils de réflexion personnelle', color: '#F59E0B' }, // Amber
  ];

  return (
    <section className="py-6 lg:py-8 bg-gradient-to-br from-cyan-50 via-white to-pink-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Card - Fond clair et coloré */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-xl overflow-hidden bg-white shadow-lg shadow-cyan-500/10 border border-gray-100"
        >
          <div className="grid lg:grid-cols-2 gap-0">

            {/* Left - Product Image Container */}
            <div className="relative min-h-[200px] lg:min-h-[260px] bg-gradient-to-br from-cyan-100 via-cyan-50 to-pink-50 flex items-center justify-center p-3 lg:p-4">
              {/* Decorative shapes - couleurs du livre */}
              <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-pink-400/20" />
              <div className="absolute top-1/4 right-4 w-6 h-6 rounded-full bg-yellow-400/30" />
              <div className="absolute bottom-1/4 left-6 w-6 h-6 rounded-full bg-cyan-400/30" />
              <div className="absolute bottom-6 right-1/4 w-10 h-10 rounded-full bg-orange-400/20" />

              {/* Decorative dots */}
              <div className="absolute top-1/3 left-1/4 w-1.5 h-1.5 rounded-full bg-pink-400" />
              <div className="absolute bottom-1/3 right-6 w-1 h-1 rounded-full bg-cyan-500" />
              <div className="absolute top-1/2 right-1/3 w-1 h-1 rounded-full bg-yellow-400" />

              {/* Product Image */}
              <div className="relative z-10 w-full max-w-[140px] lg:max-w-[170px]">
                <motion.div
                  initial={{ rotate: -3 }}
                  whileHover={{ rotate: 0, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-lg overflow-hidden shadow-2xl shadow-cyan-500/20"
                >
                  <img
                    src="/kit-introspection.jpg"
                    alt="Le Kit d'Introspection - Guide pratique et exclusif"
                    className="w-full h-auto object-cover"
                  />
                </motion.div>

                {/* Floating badge */}
                <div className="absolute -bottom-1.5 -right-1.5 lg:-bottom-2 lg:-right-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-pink-500 to-orange-400 rounded-full text-white font-bold text-[9px] shadow-lg shadow-pink-500/30">
                    <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                    Gratuit
                  </span>
                </div>
              </div>
            </div>

            {/* Right - Content & Form */}
            <div className="p-3 lg:p-4 flex flex-col justify-center bg-white">
              {/* Badge */}
              <span className="inline-flex items-center gap-1 self-start px-2 py-0.5 bg-gradient-to-r from-cyan-100 to-pink-100 rounded-full text-gray-700 text-[8px] font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-2 h-2 text-pink-500" />
                Ressource gratuite
              </span>

              <h2 className="text-base lg:text-lg font-bold text-gray-900 mb-2">
                Le Kit d'Introspection
              </h2>

              <p className="text-gray-600 text-xs sm:text-sm mb-3 leading-relaxed">
                Nous avons compilé les outils et les questions les plus puissantes de nos intervenants dans un guide pratique et exclusif. 24 pages pour mieux vous connaître, identifier vos blocages et tracer votre chemin.
              </p>

              {/* Features - avec icônes colorées */}
              <div className="space-y-1.5 mb-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${feature.color}15` }}
                    >
                      <feature.icon className="w-2.5 h-2.5" style={{ color: feature.color }} />
                    </div>
                    <span className="text-gray-700 text-[10px] font-medium">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Form */}
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-1.5">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all"
                    placeholder="votre@email.com"
                  />
                  <button
                    type="submit"
                    disabled={!email.trim() || isSubmitting}
                    className="w-full px-3 py-2 bg-gradient-to-r from-cyan-500 to-pink-500 text-white text-xs font-bold rounded-md hover:from-cyan-600 hover:to-pink-600 transition-all disabled:opacity-50 flex items-center justify-center gap-1 shadow-lg shadow-pink-500/20"
                  >
                    {isSubmitting ? (
                      'Envoi en cours...'
                    ) : (
                      <>
                        Recevoir le guide gratuitement
                        <ArrowRight className="w-2.5 h-2.5" />
                      </>
                    )}
                  </button>
                  <p className="text-gray-400 text-[8px] text-center">
                    Vos données sont protégées. Désabonnement possible à tout moment.
                  </p>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 bg-gradient-to-r from-cyan-50 to-pink-50 rounded-md text-center border border-cyan-100"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-pink-500 flex items-center justify-center mx-auto mb-2 shadow-lg shadow-pink-500/20">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-0.5">
                    Merci !
                  </h3>
                  <p className="text-gray-600 text-[10px]">
                    Votre guide vous attend dans votre boîte mail.
                    <br />
                    Vérifiez vos spams si nécessaire.
                  </p>
                </motion.div>
              )}
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default EngagementSection;
