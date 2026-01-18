// src/components/RecommandationsSection.tsx
// Section recommandations - Coups de cœur culturels

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Film, Headphones, Youtube, Instagram, AudioLines, Landmark, Theater } from 'lucide-react';
import { typo } from '../lib/typography';

// Couleurs et icônes par type
const typeConfig: Record<string, { color: string; icon: typeof BookOpen }> = {
  'Lecture du mois': { color: '#EC4899', icon: BookOpen },
  'Sélection cinéma': { color: '#8B5CF6', icon: Film },
  'À écouter': { color: '#14B8A6', icon: Headphones },
  'Livres': { color: '#EC4899', icon: BookOpen },
  'Films': { color: '#8B5CF6', icon: Film },
  'Podcasts': { color: '#14B8A6', icon: Headphones },
  'Chaîne YouTube': { color: '#FF0000', icon: Youtube },
  'Compte Instagram': { color: '#E4405F', icon: Instagram },
  'Livre audio': { color: '#F59E0B', icon: AudioLines },
  'Musée': { color: '#6366F1', icon: Landmark },
  'Théâtre': { color: '#10B981', icon: Theater },
};

// Données statiques (à remplacer par Sanity plus tard)
const featuredRecommendations = [
  {
    id: '1',
    type: 'Lecture du mois',
    title: "La BD de l'année, des bonnes résolutions et évidemment Heated Rivalry : on lit quoi ce mois-ci ?",
    description: "Notre sélection de lectures pour bien commencer l'année",
    imageUrl: '/placeholder.svg',
    slug: 'lectures-janvier-2026',
  },
  {
    id: '2',
    type: 'Sélection cinéma',
    title: "Les 10 films qui ont marqué 2025",
    description: "Rétrospective des œuvres incontournables",
    imageUrl: '/placeholder.svg',
    slug: 'films-2025',
  },
  {
    id: '3',
    type: 'À écouter',
    title: "5 podcasts pour booster votre mindset",
    description: "Des voix inspirantes à écouter sans modération",
    imageUrl: '/placeholder.svg',
    slug: 'podcasts-mindset-2026',
  },
];

export default function RecommandationsSection() {
  const mainReco = featuredRecommendations[0];
  const sideRecos = featuredRecommendations.slice(1, 3);
  const MainIcon = typeConfig[mainReco.type]?.icon || BookOpen;

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-8 lg:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header avec introduction étoffée */}
        <div className="mb-6 lg:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4"
          >
            <div className="max-w-xl">
              <div className="h-0.5 w-10 bg-gray-900 rounded-full mb-3" />

              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">
                Nos recommandations
              </h2>

              <p className="text-gray-600 text-sm leading-relaxed">
                {typo("Chaque jour, notre équipe partage ses découvertes culturelles : les livres qui nous ont bouleversés, les films qui nous ont marqués, les podcasts qui nous accompagnent. Des recommandations sincères, testées et approuvées, pour nourrir votre curiosité.")}
              </p>
            </div>

            <Link
              to="/recommandations"
              className="group inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full font-medium text-xs hover:bg-gray-800 transition-colors self-start lg:self-center flex-shrink-0"
            >
              Toutes nos recommandations
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Grid des recommandations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Main Card - Grande carte à gauche */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:row-span-2"
          >
            <Link
              to={`/recommandation/${mainReco.slug}`}
              className="group relative block h-full rounded-2xl overflow-hidden bg-gray-900"
            >
              {/* Image avec aspect ratio préservé */}
              <div className="aspect-[4/5] lg:aspect-auto lg:absolute lg:inset-0">
                <img
                  src={mainReco.imageUrl}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-5 lg:p-6">
                {/* Badge type */}
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-[10px] font-bold uppercase tracking-wider"
                    style={{ backgroundColor: typeConfig[mainReco.type]?.color || '#6B7280' }}
                  >
                    <MainIcon className="w-3 h-3" />
                    {mainReco.type}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg lg:text-xl font-bold text-white leading-snug mb-2">
                  {typo(mainReco.title)}
                </h3>

                {/* Description */}
                <p className="text-white/70 text-sm mb-4 line-clamp-2">
                  {mainReco.description}
                </p>

                {/* CTA */}
                <span className="inline-flex items-center gap-1.5 text-white text-xs font-semibold group-hover:gap-2.5 transition-all">
                  Découvrir cette sélection
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Side Cards - Deux cartes à droite */}
          {sideRecos.map((reco, index) => {
            const TypeIcon = typeConfig[reco.type]?.icon || BookOpen;
            const typeColor = typeConfig[reco.type]?.color || '#6B7280';

            return (
              <motion.div
                key={reco.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link
                  to={`/recommandation/${reco.slug}`}
                  className="group flex gap-4 p-4 bg-white rounded-2xl ring-1 ring-gray-100 hover:ring-gray-200 hover:shadow-lg transition-all duration-300"
                >
                  {/* Image thumbnail */}
                  <div className="flex-shrink-0 w-24 lg:w-28 aspect-[3/4] rounded-xl overflow-hidden">
                    <img
                      src={reco.imageUrl}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-center min-w-0">
                    {/* Badge type */}
                    <span
                      className="inline-flex items-center gap-1 self-start px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider mb-2"
                      style={{
                        backgroundColor: `${typeColor}15`,
                        color: typeColor
                      }}
                    >
                      <TypeIcon className="w-2.5 h-2.5" />
                      {reco.type}
                    </span>

                    {/* Title */}
                    <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 mb-1.5 group-hover:text-gray-700 transition-colors">
                      {typo(reco.title)}
                    </h3>

                    {/* CTA */}
                    <span
                      className="inline-flex items-center gap-1 text-[11px] font-semibold group-hover:gap-1.5 transition-all"
                      style={{ color: typeColor }}
                    >
                      Découvrir
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Footer optionnel - Catégories */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-6 pt-6 border-t border-gray-100"
        >
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-xs text-gray-400">Explorer par catégorie :</span>
            {['Livres', 'Films', 'Podcasts', 'Chaîne YouTube', 'Compte Instagram', 'Livre audio', 'Musée', 'Théâtre'].map((cat) => {
              const config = typeConfig[cat];
              const Icon = config?.icon || BookOpen;
              return (
                <Link
                  key={cat}
                  to={`/recommandations?type=${cat.toLowerCase()}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-full text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <Icon className="w-3 h-3" style={{ color: config?.color }} />
                  {cat}
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
