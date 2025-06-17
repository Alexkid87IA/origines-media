// src/pages/BibliothequePage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Clock, Calendar, ArrowRight, X } from 'lucide-react';
import { createClient } from '@sanity/client';
import { VERTICALES_WITH_PRODUCTIONS_QUERY } from '../lib/queries';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

// Configuration du client Sanity
const client = createClient({
  projectId: 'sf5v7lj3',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-03-01',
});

interface Production {
  _id: string;
  titre: string;
  description: string;
  imageUrl: string;
  slug: { current: string };
  datePublication: string;
  duree?: number;
}

interface Verticale {
  _id: string;
  nom: string;
  slug: { current: string };
  couleurDominante: string;
  description?: string;
  productions: Production[];
}

function BibliothequePage() {
  const [verticales, setVerticales] = useState<Verticale[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVerticale, setSelectedVerticale] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchVerticales = async () => {
      try {
        const data = await client.fetch(VERTICALES_WITH_PRODUCTIONS_QUERY);
        console.log('Verticales data:', data);
        setVerticales(data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des verticales:', error);
        setLoading(false);
      }
    };

    fetchVerticales();
  }, []);

  // Toutes les productions aplaties
  const allProductions = verticales.flatMap(v => 
    v.productions.map(p => ({ ...p, verticale: v }))
  );

  // Filtrage des productions
  const filteredProductions = allProductions.filter(production => {
    const matchesSearch = 
      production.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      production.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesVerticale = 
      selectedVerticale === 'all' || production.verticale._id === selectedVerticale;
    
    return matchesSearch && matchesVerticale;
  });

  // Compter les productions par verticale
  const getProductionCount = (verticaleId: string) => {
    if (verticaleId === 'all') return allProductions.length;
    return allProductions.filter(p => p.verticale._id === verticaleId).length;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Chargement de la bibliothèque...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5]">
      <Sidebar />

      <main className="md:ml-[280px]">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#0A0A0A] py-20 px-8 lg:px-16">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
              <span className="font-inter text-violet-400 text-sm tracking-[0.2em] uppercase">
                Bibliothèque
              </span>
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
            </div>
            
            <h1 className="font-montserrat font-black text-4xl md:text-5xl lg:text-6xl uppercase tracking-wider text-white mb-6 leading-[0.9]">
              Tous nos
              <br />
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Contenus
              </span>
            </h1>
            
            <p className="font-inter text-lg text-white/70 max-w-2xl mx-auto">
              Explorez l'intégralité de notre collection d'articles et de productions
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mt-12">
              <div className="text-center">
                <div className="font-montserrat font-bold text-3xl text-violet-400 mb-2">
                  {allProductions.length}
                </div>
                <div className="font-inter text-white/60 text-sm uppercase tracking-wider">
                  Productions
                </div>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <div className="font-montserrat font-bold text-3xl text-fuchsia-400 mb-2">
                  {verticales.length}
                </div>
                <div className="font-inter text-white/60 text-sm uppercase tracking-wider">
                  Verticales
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search & Filters */}
        <section className="bg-[#0F0F0F] border-t border-white/10 py-8 px-8 lg:px-16 sticky top-0 z-40 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  placeholder="Rechercher par titre ou description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/20 rounded-xl text-white placeholder-white/50 font-inter focus:outline-none focus:border-violet-500/50 focus:bg-black/60 transition-all duration-300"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 flex-wrap justify-center">
                {/* All filter */}
                <button
                  onClick={() => setSelectedVerticale('all')}
                  className={`
                    px-4 py-2 rounded-full font-inter font-medium text-sm transition-all duration-300 border
                    ${selectedVerticale === 'all'
                      ? 'bg-violet-600 border-violet-500 text-white'
                      : 'text-white/70 bg-black/20 border-white/20 hover:bg-black/30 hover:border-white/30'
                    }
                  `}
                >
                  Tous ({getProductionCount('all')})
                </button>

                {/* Verticale filters */}
                {verticales.map((verticale) => (
                  <button
                    key={verticale._id}
                    onClick={() => setSelectedVerticale(verticale._id)}
                    className={`
                      px-4 py-2 rounded-full font-inter font-medium text-sm transition-all duration-300 border
                      ${selectedVerticale === verticale._id
                        ? 'text-white'
                        : 'text-white/70 bg-black/20 border-white/20 hover:bg-black/30 hover:border-white/30'
                      }
                    `}
                    style={selectedVerticale === verticale._id ? {
                      backgroundColor: verticale.couleurDominante,
                      borderColor: `${verticale.couleurDominante}80`,
                    } : {}}
                  >
                    {verticale.nom} ({getProductionCount(verticale._id)})
                  </button>
                ))}
              </div>
            </div>

            {/* Results count */}
            <div className="mt-6 text-center">
              <span className="font-inter text-white/60 text-sm">
                {filteredProductions.length} résultat{filteredProductions.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </section>

        {/* Productions Grid */}
        <section className="py-16 px-8 lg:px-16">
          <div className="max-w-7xl mx-auto">
            {filteredProductions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProductions.map((production) => {
                  const themeColor = production.verticale.couleurDominante || '#8B5CF6';
                  
                  return (
                    <Link
                      key={production._id}
                      to={`/production/${production.slug.current}`}
                      className="group relative overflow-hidden rounded-2xl bg-black/40 border border-white/10 hover:border-white/20 transition-all duration-300"
                    >
                      {/* Image */}
                      <div className="aspect-video overflow-hidden">
                        <div 
                          className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                          style={{
                            backgroundImage: `url(${production.imageUrl || 'https://images.pexels.com/photos/3184416/pexels-photo-3184416.jpeg'})`,
                          }}
                        />
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        {/* Verticale Badge */}
                        <div className="flex items-center gap-3 mb-4">
                          <span 
                            className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                            style={{
                              backgroundColor: `${themeColor}20`,
                              color: themeColor,
                              borderWidth: '1px',
                              borderColor: `${themeColor}40`
                            }}
                          >
                            {production.verticale.nom}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-montserrat font-bold text-xl text-white mb-3 line-clamp-2 group-hover:text-violet-400 transition-colors">
                          {production.titre}
                        </h3>

                        {/* Description */}
                        <p className="font-inter text-white/70 text-sm leading-relaxed mb-4 line-clamp-3">
                          {production.description}
                        </p>

                        {/* Meta */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-white/50 text-xs">
                            {production.datePublication && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{formatDate(production.datePublication)}</span>
                              </div>
                            )}
                            {production.duree && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{production.duree} min</span>
                              </div>
                            )}
                          </div>

                          {/* Arrow */}
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                            style={{
                              backgroundColor: `${themeColor}20`,
                              borderWidth: '1px',
                              borderColor: `${themeColor}40`
                            }}
                          >
                            <ArrowRight 
                              className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
                              style={{ color: themeColor }}
                            />
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              /* No results */
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-white/40" />
                </div>
                <h3 className="font-montserrat font-bold text-2xl text-white mb-4">
                  Aucun résultat trouvé
                </h3>
                <p className="font-inter text-white/60 text-lg mb-8">
                  Essayez de modifier vos critères de recherche
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedVerticale('all');
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white font-inter font-medium rounded-xl hover:bg-violet-500 transition-all duration-300"
                >
                  <X className="w-4 h-4" />
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default BibliothequePage;