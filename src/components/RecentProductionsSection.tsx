// src/components/RecentProductionsSection.tsx
// Style pop avec couleurs par univers

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { getUniversColors } from '../lib/universColors';
import { typo } from '../lib/typography';

interface Production {
  id: string;
  titre: string;
  extrait?: string;
  description?: string;
  contenuTexte?: string;
  imageUrl?: string;
  url: string;
  datePublication?: string;
  verticale?: {
    nom: string;
    couleurDominante?: string;
  };
}

// Helper: récupère l'extrait avec fallback (50 premiers caractères)
const getExtrait = (production: Production): string => {
  if (production.extrait) return production.extrait;
  if (production.description) return production.description;
  if (production.contenuTexte) {
    const text = production.contenuTexte.substring(0, 80);
    return text.length === 80 ? text + '...' : text;
  }
  return '';
};

interface Verticale {
  verticale: {
    id: string;
    nom: string;
    couleurDominante: string;
  };
  productions: Production[];
}

interface RecentProductionsSectionProps {
  verticales: Verticale[];
}

// Fonction de shuffle (Fisher-Yates)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const RecentProductionsSection: React.FC<RecentProductionsSectionProps> = ({ verticales }) => {
  const [activeTab, setActiveTab] = useState('tous');

  // Récupère toutes les productions avec leur verticale
  const allProductions = React.useMemo(() => {
    return verticales.flatMap(v =>
      v.productions.map(p => ({
        ...p,
        verticale: {
          nom: v.verticale.nom,
          couleurDominante: v.verticale.couleurDominante
        }
      }))
    );
  }, [verticales]);

  // Filtre selon l'onglet actif, puis mélange pour la variété
  const filteredProductions = React.useMemo(() => {
    const filtered = activeTab === 'tous'
      ? allProductions
      : allProductions.filter(p => p.verticale?.nom === activeTab);
    return shuffleArray(filtered);
  }, [activeTab, allProductions]);

  const verticaleNames = [...new Set(verticales.map(v => v.verticale.nom))];

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <section className="bg-gray-50 py-6 sm:py-8 lg:py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header avec introduction étoffée */}
        <div className="mb-5 sm:mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 sm:gap-4 mb-4 sm:mb-4">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-1 w-8 bg-emerald-500 rounded-full" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Lire</span>
              </div>
              <h2 className="text-xl sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                Nos articles
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {typo("Chaque univers est un monde à explorer : psychologie, carrière, famille, spiritualité... Trouvez les récits qui résonnent avec vos questionnements du moment et laissez-vous guider par vos centres d'intérêt.")}
              </p>
            </div>

            <Link
              to="/articles"
              className="group inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full font-medium text-xs hover:bg-gray-800 transition-colors self-start lg:self-center flex-shrink-0"
            >
              <span>Tous les articles</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Tabs - Style avec animation layoutId */}
          {/* Version Mobile - Boutons outline comme navbar */}
          <div className="flex flex-wrap gap-1.5 sm:hidden">
            <button
              onClick={() => setActiveTab('tous')}
              className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                activeTab === 'tous'
                  ? 'bg-gray-900 text-white border border-gray-900'
                  : 'bg-white text-gray-900 border border-gray-900'
              }`}
            >
              Tous
              <ArrowRight className="w-3 h-3" />
            </button>
            {verticaleNames.map(name => {
              const colors = getUniversColors(name);
              const isActive = activeTab === name;

              return (
                <button
                  key={name}
                  onClick={() => setActiveTab(name)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200"
                  style={{
                    backgroundColor: isActive ? colors.bg : 'white',
                    color: isActive ? colors.text : colors.bg,
                    border: `1px solid ${colors.bg}`,
                  }}
                >
                  {name}
                  <ArrowRight className="w-3 h-3" />
                </button>
              );
            })}
          </div>

          {/* Version Desktop - Animation layoutId */}
          <div className="hidden sm:flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveTab('tous')}
              className="relative px-3 py-1.5 text-[10px] font-semibold transition-all duration-200 rounded-full"
            >
              {activeTab === 'tous' && (
                <motion.div
                  layoutId="articlesTabIndicator"
                  className="absolute inset-0 bg-gray-900 rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className={`relative z-10 ${activeTab === 'tous' ? 'text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                Tous
              </span>
            </button>
            {verticaleNames.map(name => {
              const colors = getUniversColors(name);
              const isActive = activeTab === name;

              return (
                <button
                  key={name}
                  onClick={() => setActiveTab(name)}
                  className="relative px-3 py-1.5 text-[10px] font-semibold transition-all duration-200 rounded-full"
                >
                  {isActive && (
                    <motion.div
                      layoutId="articlesTabIndicator"
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: colors.bg }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span
                    className="relative z-10 transition-colors duration-200"
                    style={{ color: isActive ? colors.text : '#6B7280' }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.color = colors.bg;
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.color = '#6B7280';
                    }}
                  >
                    {name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Productions Grid - Glassmorphism Premium */}
        {/* Responsive: 6 sur mobile (3×2), 9 sur tablette (3×3), 8 sur desktop (2×4) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-3 lg:gap-3 mb-5 sm:mb-6">
          {filteredProductions.slice(0, 9).map((production, index) => {
            const colors = getUniversColors(production.verticale?.nom);

            // Gestion visibilité responsive pour éviter les trous
            // Cartes 1-6: visibles partout
            // Cartes 7-8: cachées sur mobile
            // Carte 9: visible tablette uniquement
            const visibilityClass = index === 8
              ? 'hidden sm:block lg:hidden' // 9ème carte: tablette uniquement
              : index >= 6
              ? 'hidden sm:block' // 7ème et 8ème: cachées sur mobile
              : ''; // 1-6: partout

            return (
              <motion.article
                key={production.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index, 6) * 0.05 }}
                className={`group ${visibilityClass}`}
              >
                <Link to={production.url} className="block">
                  {/* Card avec glassmorphism */}
                  <div
                    className="relative rounded-2xl p-[1.5px] transition-all duration-500 group-hover:-translate-y-2 lg:group-hover:-translate-y-4"
                    style={{
                      background: `linear-gradient(145deg, rgba(255,255,255,0.5), rgba(255,255,255,0.1))`,
                    }}
                  >
                    {/* Inner card */}
                    <div
                      className="relative rounded-[14px] overflow-visible"
                      style={{
                        boxShadow: `0 20px 40px -15px ${colors.shadow}, 0 8px 20px -8px rgba(0,0,0,0.1)`,
                      }}
                    >
                      {/* Image - 16:9 sur mobile, 4:5 sur tablette/desktop */}
                      <div className="relative aspect-[16/9] sm:aspect-[4/5] lg:aspect-[4/5.5] overflow-hidden rounded-[14px]">
                        <img
                          src={production.imageUrl || '/placeholder.svg'}
                          alt={production.titre}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        {/* Overlay gradient subtil sur l'image */}
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-black/5 to-transparent opacity-50 group-hover:opacity-30 transition-opacity duration-500" />

                        {/* Badge - Dot coloré + texte blanc */}
                        {production.verticale?.nom && (
                          <div className="absolute top-1.5 left-1.5 z-10">
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider text-white bg-black/40 backdrop-blur-sm">
                              <span
                                className="w-1 h-1 rounded-full"
                                style={{ backgroundColor: colors.bg }}
                              />
                              {production.verticale.nom}
                            </span>
                          </div>
                        )}

                        {/* Titre en bas de l'image - Version tablette simple */}
                        <div className="hidden sm:block lg:hidden absolute inset-x-0 bottom-0 p-2 pt-8 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
                          <h3 className="text-white font-bold text-[10px] leading-tight drop-shadow-lg line-clamp-2">
                            {typo(production.titre)}
                          </h3>
                        </div>

                        {/* Effet brillance au hover */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </div>

                        {/* Bordure intérieure subtile */}
                        <div className="absolute inset-0 rounded-[14px] ring-1 ring-inset ring-white/20 group-hover:ring-white/40 transition-all duration-300" />
                      </div>

                      {/* OVERLAY COMPLET - Mobile (par défaut) + Desktop (par défaut aussi) */}
                      <div
                        className="block sm:hidden lg:block absolute inset-x-0 bottom-0 rounded-b-[14px] overflow-hidden"
                      >
                        <div
                          className="p-2.5 sm:p-3 lg:p-4 pt-8 sm:pt-10 lg:pt-16 bg-gradient-to-t from-black via-black/85 to-transparent"
                        >
                          {/* Titre - pas tronqué sur desktop */}
                          <h3 className="text-white font-bold text-[11px] sm:text-sm lg:text-[13px] leading-tight lg:leading-snug mb-1.5 sm:mb-2 drop-shadow-lg line-clamp-2 lg:line-clamp-4">
                            {typo(production.titre)}
                          </h3>

                          {/* Extrait (avec fallback sur contenu) */}
                          {getExtrait(production) && (
                            <p className="text-white/80 text-[9px] sm:text-[10px] lg:text-[11px] leading-relaxed mb-1.5 sm:mb-2 line-clamp-2">
                              {typo(getExtrait(production))}
                            </p>
                          )}

                          {/* Bouton Lire plus */}
                          <span
                            className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] lg:text-[11px] font-semibold transition-all"
                            style={{ color: colors.bg }}
                          >
                            Lire l'article
                            <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-200">
          <span className="text-[10px] text-gray-400">
            {allProductions.length} récits disponibles
          </span>

          <Link
            to="/bibliotheque"
            className="inline-flex items-center px-3 py-1.5 bg-gray-900 text-white text-[10px] font-bold rounded-full hover:bg-gray-800 transition-all hover:scale-105"
          >
            Voir la bibliothèque
            <span className="ml-1">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RecentProductionsSection;
