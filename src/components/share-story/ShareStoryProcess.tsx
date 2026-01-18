// src/components/share-story/ShareStoryProcess.tsx
import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Premier contact',
    description: 'Envoyez-nous votre idée en quelques lignes. Pas besoin d\'être parfait.',
    color: '#4F46E5',
    gradient: 'from-violet-500 to-indigo-600'
  },
  {
    number: '02',
    title: 'Échange',
    description: 'Notre équipe vous accompagne pour structurer votre récit unique.',
    color: '#EC4899',
    gradient: 'from-pink-500 to-rose-600'
  },
  {
    number: '03',
    title: 'Création',
    description: 'Ensemble, nous donnons vie à votre histoire avec soin et respect.',
    color: '#10B981',
    gradient: 'from-emerald-500 to-teal-600'
  },
  {
    number: '04',
    title: 'Publication',
    description: 'Votre récit rejoint la communauté et inspire des milliers de lecteurs.',
    color: '#F59E0B',
    gradient: 'from-amber-500 to-orange-600'
  }
];

const ShareStoryProcess: React.FC = () => {
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
          <div className="h-1.5 w-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mb-6 mx-auto" />
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Comment ça{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              fonctionne ?
            </span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            De votre première idée à la publication, nous vous accompagnons
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              className="relative group"
            >
              {/* Floating shadow layer */}
              <div
                className="absolute inset-0 rounded-3xl transition-all duration-300 group-hover:opacity-80"
                style={{
                  background: `linear-gradient(135deg, ${step.color}30, ${step.color}10)`,
                  transform: 'translateY(12px) scale(0.92)',
                  filter: 'blur(16px)',
                  opacity: 0.6,
                }}
              />

              {/* Glass Card */}
              <div className="relative h-full min-h-[280px] rounded-3xl overflow-hidden
                bg-white/70 backdrop-blur-xl
                shadow-[0_8px_32px_rgba(0,0,0,0.08)]
                ring-1 ring-white/80
                transition-all duration-300
                group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)]
                group-hover:ring-white
                group-hover:bg-white/80
              ">
                {/* Number badge */}
                <div
                  className="absolute -top-1 -left-1 w-14 h-14 rounded-br-3xl flex items-center justify-center text-white text-lg font-bold shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${step.color}, ${step.color}dd)` }}
                >
                  {step.number}
                </div>

                {/* Content */}
                <div className="p-6 pt-16 h-full flex flex-col">
                  {/* Icon circle */}
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner"
                    style={{ backgroundColor: `${step.color}15` }}
                  >
                    <div
                      className="w-8 h-8 rounded-full"
                      style={{ background: `linear-gradient(135deg, ${step.color}, ${step.color}aa)` }}
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>

                  {/* Description - Fixed height */}
                  <p className="text-gray-500 text-sm leading-relaxed flex-grow">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Connection line (desktop only) */}
        <div className="hidden lg:flex items-center justify-center mt-12">
          <div className="flex items-center gap-2">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div
                  className="w-3 h-3 rounded-full shadow-lg"
                  style={{ backgroundColor: step.color }}
                />
                {index < steps.length - 1 && (
                  <div className="w-24 h-0.5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/70 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] ring-1 ring-white/80">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-gray-600">
              Temps moyen : <span className="font-semibold text-gray-900">2 à 4 semaines</span>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ShareStoryProcess;
