// src/components/share-story/ShareStoryCTA.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Instagram, ArrowRight, Heart } from 'lucide-react';

const ShareStoryCTA: React.FC = () => {
  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ y: -4, transition: { duration: 0.25 } }}
          className="relative group"
        >
          {/* Floating shadow */}
          <div
            className="absolute inset-0 rounded-[36px]"
            style={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(236,72,153,0.1))',
              transform: 'translateY(20px) scale(0.96)',
              filter: 'blur(32px)',
              opacity: 0.8,
            }}
          />

          {/* Glass Card */}
          <div className="relative rounded-[32px] overflow-hidden
            bg-white/80 backdrop-blur-xl
            shadow-[0_16px_64px_rgba(0,0,0,0.1)]
            ring-1 ring-white/80
            transition-all duration-300
            group-hover:shadow-[0_24px_80px_rgba(0,0,0,0.15)]
          ">
            <div className="p-10 md:p-16 text-center">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 mb-8 shadow-[0_8px_32px_rgba(124,58,237,0.4)]"
              >
                <Send className="w-10 h-10 text-white" />
              </motion.div>

              {/* Title */}
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Prêt à partager{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-rose-500">
                  votre histoire ?
                </span>
              </h2>

              <p className="text-xl text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">
                Contactez-nous et notre équipe vous accompagnera avec bienveillance
              </p>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                <motion.a
                  href="mailto:contact@originesmedia.com"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center gap-3 px-8 py-5 rounded-2xl
                    bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-lg
                    shadow-[0_8px_32px_rgba(124,58,237,0.4)]
                    hover:shadow-[0_12px_40px_rgba(124,58,237,0.5)]
                    transition-all duration-300"
                >
                  <Mail className="w-5 h-5" />
                  contact@originesmedia.com
                  <ArrowRight className="w-5 h-5" />
                </motion.a>

                <motion.a
                  href="https://www.instagram.com/originesmedia/"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center gap-3 px-8 py-5 rounded-2xl
                    bg-white/80 backdrop-blur-sm text-gray-700 font-semibold text-lg
                    shadow-[0_4px_20px_rgba(0,0,0,0.08)] ring-1 ring-gray-200
                    hover:bg-white hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]
                    transition-all duration-300"
                >
                  <Instagram className="w-5 h-5" />
                  @originesmedia
                </motion.a>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span>Réponse sous 48h</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-400" />
                  <span>100% gratuit</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Accompagnement personnalisé</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom quote */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-400 italic text-lg">
            "La plus grande aventure que vous puissiez entreprendre est de vivre la vie de vos rêves."
          </p>
          <p className="text-gray-500 mt-2 font-medium">— Oprah Winfrey</p>
        </motion.div>
      </div>
    </section>
  );
};

export default ShareStoryCTA;
