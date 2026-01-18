// src/components/share-story/ShareStoryFormats.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenTool, Video, Mic, Camera, BookOpen, Check } from 'lucide-react';

const formats = [
  {
    id: 'article',
    icon: PenTool,
    title: 'Article écrit',
    subtitle: 'Pour les conteurs',
    description: 'Racontez votre histoire avec vos mots, à votre rythme.',
    features: ['800 à 2000 mots', 'Accompagnement éditorial', 'Photos d\'illustration', 'Relecture collaborative'],
    color: '#4F46E5',
  },
  {
    id: 'video',
    icon: Video,
    title: 'Interview vidéo',
    subtitle: 'Pour les expressifs',
    description: 'Une conversation filmée, authentique et personnelle.',
    features: ['45 min à 1h30', 'Équipe de tournage', 'Montage professionnel', 'Sous-titrage inclus'],
    color: '#EC4899',
  },
  {
    id: 'podcast',
    icon: Mic,
    title: 'Podcast audio',
    subtitle: 'Pour les voix',
    description: 'Partagez votre histoire par la voix, intime et personnel.',
    features: ['45 min à 1h30', 'Studio d\'enregistrement', 'Production audio pro', 'Diffusion multi-plateforme'],
    color: '#10B981',
  },
  {
    id: 'photo',
    icon: Camera,
    title: 'Photo-récit',
    subtitle: 'Pour les visuels',
    description: 'Une histoire racontée en images avec des légendes.',
    features: ['10 à 20 photos', 'Direction artistique', 'Légendes narratives', 'Mise en page magazine'],
    color: '#F59E0B',
  },
  {
    id: 'livre',
    icon: BookOpen,
    title: 'Livre',
    subtitle: 'Pour les ambitieux',
    description: 'Transformez votre parcours en un livre complet et inspirant.',
    features: ['Accompagnement d\'écriture', 'Structure narrative', 'Édition professionnelle', 'Publication accompagnée'],
    color: '#8B5CF6',
  }
];

const ShareStoryFormats: React.FC = () => {
  const [activeFormat, setActiveFormat] = useState(formats[0]);

  return (
    <section className="py-24 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="h-1.5 w-16 bg-gradient-to-r from-rose-500 to-orange-500 rounded-full mb-6 mx-auto" />
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Choisissez votre{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">
              format
            </span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Chaque histoire mérite son propre mode d'expression
          </p>
        </motion.div>

        {/* Format selector */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left: Format buttons - Glass Cards */}
          <div className="space-y-4">
            {formats.map((format, index) => {
              const isActive = activeFormat.id === format.id;

              return (
                <motion.div
                  key={format.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 4, transition: { duration: 0.2 } }}
                  className="relative group"
                >
                  {/* Floating shadow */}
                  {isActive && (
                    <div
                      className="absolute inset-0 rounded-2xl transition-all duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${format.color}25, ${format.color}08)`,
                        transform: 'translateY(8px) scale(0.96)',
                        filter: 'blur(12px)',
                        opacity: 0.8,
                      }}
                    />
                  )}

                  <button
                    onClick={() => setActiveFormat(format)}
                    className={`relative w-full text-left p-5 rounded-2xl transition-all duration-300
                      ${isActive
                        ? 'bg-white/80 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.1)] ring-2'
                        : 'bg-white/50 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.04)] ring-1 ring-white/60 hover:bg-white/70 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]'
                      }`}
                    style={{
                      ringColor: isActive ? format.color : 'transparent'
                    }}
                  >
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div
                        className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          isActive ? 'scale-110 shadow-lg' : ''
                        }`}
                        style={{
                          backgroundColor: isActive ? format.color : `${format.color}15`,
                        }}
                      >
                        <format.icon
                          className="w-6 h-6"
                          style={{ color: isActive ? 'white' : format.color }}
                        />
                      </div>

                      {/* Text */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900">{format.title}</h3>
                          <span className="text-xs text-gray-400">{format.subtitle}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                          {format.description}
                        </p>
                      </div>

                      {/* Check */}
                      {isActive && (
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center shadow-md"
                          style={{ backgroundColor: format.color }}
                        >
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Right: Format details - Glass Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFormat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative group"
            >
              {/* Floating shadow */}
              <div
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: `linear-gradient(135deg, ${activeFormat.color}20, ${activeFormat.color}05)`,
                  transform: 'translateY(16px) scale(0.95)',
                  filter: 'blur(24px)',
                  opacity: 0.8,
                }}
              />

              {/* Glass Card */}
              <div className="relative rounded-3xl overflow-hidden
                bg-white/70 backdrop-blur-xl
                shadow-[0_12px_48px_rgba(0,0,0,0.1)]
                ring-1 ring-white/80
              ">
                {/* Header with gradient */}
                <div
                  className="relative h-40 flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${activeFormat.color}, ${activeFormat.color}cc)` }}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <activeFormat.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{activeFormat.title}</h3>
                    <p className="text-white/80 text-sm">{activeFormat.subtitle}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {activeFormat.description}
                  </p>

                  {/* Features - Grid 2x2 */}
                  <div className="grid grid-cols-2 gap-3">
                    {activeFormat.features.map((feature, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/80"
                      >
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${activeFormat.color}15` }}
                        >
                          <Check className="w-3.5 h-3.5" style={{ color: activeFormat.color }} />
                        </div>
                        <span className="text-sm text-gray-700 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ShareStoryFormats;
