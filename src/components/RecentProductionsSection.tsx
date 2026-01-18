// src/components/RecentProductionsSection.tsx
// Style pop avec couleurs par univers

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getUniversColors } from '../lib/universColors';
import { typo } from '../lib/typography';

interface Production {
  id: string;
  titre: string;
  description?: string;
  imageUrl?: string;
  url: string;
  datePublication?: string;
  verticale?: {
    nom: string;
    couleurDominante?: string;
  };
}

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
    <section className="bg-gray-50 py-6 lg:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3 mb-4">
          <div>
            <div className="h-0.5 w-10 bg-gray-900 rounded-full mb-2" />
            <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-0.5">
              Par univers
            </h2>
            <p className="text-gray-500 text-xs">
              Explorez nos récits organisés par thématiques
            </p>
          </div>

          {/* Tabs - Style outline sobre */}
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setActiveTab('tous')}
              className={`px-2.5 py-1 text-[10px] font-semibold transition-all duration-200 rounded-full border ${
                activeTab === 'tous'
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-transparent text-gray-600 border-gray-300 hover:border-gray-900 hover:text-gray-900'
              }`}
            >
              Tous
            </button>
            {verticaleNames.map(name => {
              const colors = getUniversColors(name);
              const isActive = activeTab === name;

              return (
                <button
                  key={name}
                  onClick={() => setActiveTab(name)}
                  className="px-2.5 py-1 text-[10px] font-semibold transition-all duration-200 rounded-full border"
                  style={{
                    backgroundColor: isActive ? colors.bg : 'transparent',
                    color: isActive ? colors.text : '#6B7280',
                    borderColor: isActive ? colors.bg : '#D1D5DB',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = colors.bg;
                      e.currentTarget.style.color = colors.bg;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = '#D1D5DB';
                      e.currentTarget.style.color = '#6B7280';
                    }
                  }}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Productions Grid - Glassmorphism Premium */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-3 mb-5">
          {filteredProductions.slice(0, 8).map((production, index) => {
            const colors = getUniversColors(production.verticale?.nom);

            return (
              <motion.article
                key={production.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <Link to={production.url} className="block">
                  {/* Card avec glassmorphism */}
                  <div
                    className="relative rounded-2xl p-[1.5px] transition-all duration-500 group-hover:-translate-y-2"
                    style={{
                      background: `linear-gradient(145deg, rgba(255,255,255,0.5), rgba(255,255,255,0.1))`,
                    }}
                  >
                    {/* Inner card */}
                    <div
                      className="relative rounded-[14px] overflow-hidden"
                      style={{
                        boxShadow: `0 20px 40px -15px ${colors.shadow}, 0 8px 20px -8px rgba(0,0,0,0.1)`,
                      }}
                    >
                      {/* Image */}
                      <div className="relative aspect-[4/5] overflow-hidden">
                        <img
                          src={production.imageUrl || '/placeholder.svg'}
                          alt={production.titre}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        {/* Overlay gradient subtil sur l'image */}
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-black/5 to-transparent opacity-50 group-hover:opacity-30 transition-opacity duration-500" />

                        {/* Badge - Dot coloré + texte blanc */}
                        {production.verticale?.nom && (
                          <div className="absolute top-1.5 left-1.5">
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider text-white bg-black/40 backdrop-blur-sm">
                              <span
                                className="w-1 h-1 rounded-full"
                                style={{ backgroundColor: colors.bg }}
                              />
                              {production.verticale.nom}
                            </span>
                          </div>
                        )}

                        {/* Titre en bas de l'image avec overlay dédié */}
                        <div className="absolute inset-x-0 bottom-0 p-2 pt-8 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
                          <h3 className="text-white font-bold text-[10px] lg:text-xs leading-tight drop-shadow-lg line-clamp-2">
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
                    </div>
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
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
