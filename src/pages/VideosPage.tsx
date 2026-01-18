// src/pages/VideosPage.tsx
// Page catalogue vidéos - Style YouTube avec sidebar et grille

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Clock, Eye, Filter, Grid, List, Search,
  SlidersHorizontal, ChevronDown, Flame, Clock3, TrendingUp,
  Sparkles, X
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { typo } from '../lib/typography';

// Types
interface Video {
  id: string;
  titre: string;
  description: string;
  thumbnailUrl: string;
  duree: string;
  vues: number;
  datePublication: string;
  univers: string;
  universColor: string;
  createur: {
    nom: string;
    avatar: string;
  };
}

interface Univers {
  id: string;
  nom: string;
  color: string;
  count: number;
}

// Données des univers
const universData: Univers[] = [
  { id: 'tous', nom: 'Tous les univers', color: '#6366F1', count: 156 },
  { id: 'psychologie', nom: 'Psychologie', color: '#4F46E5', count: 24 },
  { id: 'societe', nom: 'Société', color: '#F59E0B', count: 18 },
  { id: 'carriere', nom: 'Carrière', color: '#06B6D4', count: 32 },
  { id: 'art-creativite', nom: 'Art & Créativité', color: '#8B5CF6', count: 21 },
  { id: 'spiritualite', nom: 'Spiritualité', color: '#EC4899', count: 15 },
  { id: 'sante', nom: 'Santé', color: '#14B8A6', count: 19 },
  { id: 'technologie', nom: 'Technologie', color: '#3B82F6', count: 27 },
];

// Mock vidéos
const videosData: Video[] = [
  {
    id: '1',
    titre: 'Comment transformer l\'échec en tremplin vers le succès',
    description: 'Découvrez les stratégies des entrepreneurs qui ont rebondi après leurs plus grands échecs.',
    thumbnailUrl: '/placeholder.svg',
    duree: '18:42',
    vues: 45200,
    datePublication: '2024-01-15',
    univers: 'Psychologie',
    universColor: '#4F46E5',
    createur: { nom: 'Marie Dupont', avatar: '/placeholder.svg' }
  },
  {
    id: '2',
    titre: 'Les secrets de la méditation profonde',
    description: 'Un guide complet pour maîtriser l\'art de la méditation et trouver la paix intérieure.',
    thumbnailUrl: '/placeholder.svg',
    duree: '24:15',
    vues: 78300,
    datePublication: '2024-01-12',
    univers: 'Spiritualité',
    universColor: '#EC4899',
    createur: { nom: 'Thomas Chen', avatar: '/placeholder.svg' }
  },
  {
    id: '3',
    titre: 'L\'art du storytelling visuel moderne',
    description: 'Apprenez à raconter des histoires captivantes à travers l\'image.',
    thumbnailUrl: '/placeholder.svg',
    duree: '32:08',
    vues: 124500,
    datePublication: '2024-01-10',
    univers: 'Art & Créativité',
    universColor: '#8B5CF6',
    createur: { nom: 'Sophie Martin', avatar: '/placeholder.svg' }
  },
  {
    id: '4',
    titre: 'Négocier son salaire : les techniques qui fonctionnent',
    description: 'Les stratégies éprouvées pour obtenir la rémunération que vous méritez.',
    thumbnailUrl: '/placeholder.svg',
    duree: '15:33',
    vues: 89700,
    datePublication: '2024-01-08',
    univers: 'Carrière',
    universColor: '#06B6D4',
    createur: { nom: 'Jean-Pierre Blanc', avatar: '/placeholder.svg' }
  },
  {
    id: '5',
    titre: 'Intelligence artificielle : ce qui va changer en 2024',
    description: 'Les tendances IA qui vont transformer notre quotidien cette année.',
    thumbnailUrl: '/placeholder.svg',
    duree: '28:45',
    vues: 156000,
    datePublication: '2024-01-05',
    univers: 'Technologie',
    universColor: '#3B82F6',
    createur: { nom: 'Alex Kumar', avatar: '/placeholder.svg' }
  },
  {
    id: '6',
    titre: 'Comprendre les inégalités sociales aujourd\'hui',
    description: 'Une analyse approfondie des mécanismes qui perpétuent les inégalités.',
    thumbnailUrl: '/placeholder.svg',
    duree: '21:17',
    vues: 34200,
    datePublication: '2024-01-03',
    univers: 'Société',
    universColor: '#F59E0B',
    createur: { nom: 'Claire Durand', avatar: '/placeholder.svg' }
  },
  {
    id: '7',
    titre: 'Nutrition : les mythes à oublier définitivement',
    description: 'Un nutritionniste démonte les idées reçues sur l\'alimentation.',
    thumbnailUrl: '/placeholder.svg',
    duree: '19:52',
    vues: 67800,
    datePublication: '2024-01-01',
    univers: 'Santé',
    universColor: '#14B8A6',
    createur: { nom: 'Dr. Paul Mercier', avatar: '/placeholder.svg' }
  },
  {
    id: '8',
    titre: 'La puissance de l\'écoute active',
    description: 'Comment vraiment écouter pour améliorer toutes vos relations.',
    thumbnailUrl: '/placeholder.svg',
    duree: '14:28',
    vues: 52100,
    datePublication: '2023-12-28',
    univers: 'Psychologie',
    universColor: '#4F46E5',
    createur: { nom: 'Marie Dupont', avatar: '/placeholder.svg' }
  },
  {
    id: '9',
    titre: 'Créer sa première entreprise : guide complet',
    description: 'Toutes les étapes pour lancer votre business avec succès.',
    thumbnailUrl: '/placeholder.svg',
    duree: '42:15',
    vues: 198000,
    datePublication: '2023-12-25',
    univers: 'Carrière',
    universColor: '#06B6D4',
    createur: { nom: 'Lucas Bernard', avatar: '/placeholder.svg' }
  },
  {
    id: '10',
    titre: 'Photographie : maîtriser la lumière naturelle',
    description: 'Les techniques des pros pour sublimer vos photos.',
    thumbnailUrl: '/placeholder.svg',
    duree: '26:33',
    vues: 87400,
    datePublication: '2023-12-22',
    univers: 'Art & Créativité',
    universColor: '#8B5CF6',
    createur: { nom: 'Emma Lefebvre', avatar: '/placeholder.svg' }
  },
  {
    id: '11',
    titre: 'Blockchain expliquée simplement',
    description: 'Comprendre la technologie qui révolutionne la finance.',
    thumbnailUrl: '/placeholder.svg',
    duree: '17:45',
    vues: 73200,
    datePublication: '2023-12-20',
    univers: 'Technologie',
    universColor: '#3B82F6',
    createur: { nom: 'Alex Kumar', avatar: '/placeholder.svg' }
  },
  {
    id: '12',
    titre: 'Yoga matinal : routine de 15 minutes',
    description: 'Commencez votre journée avec énergie et sérénité.',
    thumbnailUrl: '/placeholder.svg',
    duree: '15:00',
    vues: 245000,
    datePublication: '2023-12-18',
    univers: 'Santé',
    universColor: '#14B8A6',
    createur: { nom: 'Léa Fontaine', avatar: '/placeholder.svg' }
  },
];

// Filtres de tri
const sortOptions = [
  { id: 'recent', label: 'Plus récentes', icon: Clock3 },
  { id: 'popular', label: 'Plus populaires', icon: Flame },
  { id: 'trending', label: 'Tendances', icon: TrendingUp },
];

// Composant carte vidéo
const VideoCard: React.FC<{ video: Video; index: number }> = ({ video, index }) => {
  const formatViews = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'k';
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 7) return `il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    if (diffDays < 30) return `il y a ${Math.floor(diffDays / 7)} semaine${Math.floor(diffDays / 7) > 1 ? 's' : ''}`;
    if (diffDays < 365) return `il y a ${Math.floor(diffDays / 30)} mois`;
    return `il y a ${Math.floor(diffDays / 365)} an${Math.floor(diffDays / 365) > 1 ? 's' : ''}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link
        to={`/video/${video.id}`}
        className="group block"
      >
        {/* Thumbnail */}
        <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-gray-100">
          <img
            src={video.thumbnailUrl}
            alt={video.titre}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Overlay au hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

          {/* Bouton play au hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-sm transition-transform group-hover:scale-110"
              style={{ backgroundColor: video.universColor }}
            >
              <Play className="w-6 h-6 text-white ml-1" fill="white" />
            </div>
          </div>

          {/* Badge durée */}
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded text-white text-xs font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {video.duree}
          </div>

          {/* Badge univers */}
          <div
            className="absolute top-2 left-2 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
            style={{ backgroundColor: video.universColor }}
          >
            {video.univers}
          </div>
        </div>

        {/* Infos */}
        <div className="flex gap-3">
          {/* Avatar créateur */}
          <img
            src={video.createur.avatar}
            alt={video.createur.nom}
            className="w-9 h-9 rounded-full object-cover flex-shrink-0"
          />

          <div className="flex-1 min-w-0">
            {/* Titre */}
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1 group-hover:text-gray-700 transition-colors">
              {typo(video.titre)}
            </h3>

            {/* Créateur */}
            <p className="text-xs text-gray-500 mb-1">
              {video.createur.nom}
            </p>

            {/* Stats */}
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {formatViews(video.vues)} vues
              </span>
              <span>•</span>
              <span>{formatDate(video.datePublication)}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// Page principale
const VideosPage: React.FC = () => {
  const [selectedUnivers, setSelectedUnivers] = useState('tous');
  const [sortBy, setSortBy] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filtrer les vidéos
  const filteredVideos = videosData.filter(video => {
    const matchesUnivers = selectedUnivers === 'tous' ||
      video.univers.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-') === selectedUnivers;
    const matchesSearch = !searchQuery ||
      video.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.createur.nom.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesUnivers && matchesSearch;
  });

  // Trier les vidéos
  const sortedVideos = [...filteredVideos].sort((a, b) => {
    if (sortBy === 'popular') return b.vues - a.vues;
    if (sortBy === 'recent') return new Date(b.datePublication).getTime() - new Date(a.datePublication).getTime();
    return 0;
  });

  const currentUnivers = universData.find(u => u.id === selectedUnivers);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="pt-4 pb-16">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-1.5 h-8 rounded-full"
                style={{ backgroundColor: currentUnivers?.color || '#6366F1' }}
              />
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Vidéos
              </h1>
              <span className="text-gray-400 text-sm">
                {sortedVideos.length} vidéo{sortedVideos.length > 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-gray-500 text-sm ml-5">
              Explorez notre collection de contenus vidéo inspirants
            </p>
          </div>

          <div className="flex gap-6">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:block w-56 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                {/* Recherche */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Univers */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
                    Univers
                  </h3>
                  <div className="space-y-1">
                    {universData.map((univers) => (
                      <button
                        key={univers.id}
                        onClick={() => setSelectedUnivers(univers.id)}
                        className={`
                          w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all
                          ${selectedUnivers === univers.id
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                          }
                        `}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: univers.color }}
                          />
                          <span className="font-medium">{univers.nom}</span>
                        </div>
                        <span className={`text-xs ${selectedUnivers === univers.id ? 'text-white/60' : 'text-gray-400'}`}>
                          {univers.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tri */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
                    Trier par
                  </h3>
                  <div className="space-y-1">
                    {sortOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setSortBy(option.id)}
                        className={`
                          w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all
                          ${sortBy === option.id
                            ? 'bg-gray-100 text-gray-900 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                          }
                        `}
                      >
                        <option.icon className="w-4 h-4" />
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Contenu principal */}
            <div className="flex-1 min-w-0">
              {/* Barre de filtres mobile */}
              <div className="lg:hidden flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-300"
                  />
                </div>
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filtres
                </button>
              </div>

              {/* Filtres mobile expandable */}
              <AnimatePresence>
                {showMobileFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="lg:hidden overflow-hidden mb-4"
                  >
                    <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-4">
                      {/* Univers mobile */}
                      <div>
                        <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Univers</h4>
                        <div className="flex flex-wrap gap-2">
                          {universData.map((univers) => (
                            <button
                              key={univers.id}
                              onClick={() => setSelectedUnivers(univers.id)}
                              className={`
                                px-3 py-1.5 rounded-full text-xs font-medium transition-all
                                ${selectedUnivers === univers.id
                                  ? 'text-white'
                                  : 'bg-gray-100 text-gray-600'
                                }
                              `}
                              style={{
                                backgroundColor: selectedUnivers === univers.id ? univers.color : undefined
                              }}
                            >
                              {univers.nom}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Tri mobile */}
                      <div>
                        <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Trier par</h4>
                        <div className="flex gap-2">
                          {sortOptions.map((option) => (
                            <button
                              key={option.id}
                              onClick={() => setSortBy(option.id)}
                              className={`
                                flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all
                                ${sortBy === option.id
                                  ? 'bg-gray-900 text-white'
                                  : 'bg-gray-100 text-gray-600'
                                }
                              `}
                            >
                              <option.icon className="w-3 h-3" />
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Grille de vidéos */}
              {sortedVideos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
                  {sortedVideos.map((video, index) => (
                    <VideoCard key={video.id} video={video} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Aucune vidéo trouvée
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Essayez de modifier vos filtres ou votre recherche
                  </p>
                </div>
              )}

              {/* Bouton charger plus (simulation infinite scroll) */}
              {sortedVideos.length > 0 && (
                <div className="mt-12 text-center">
                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full font-medium text-sm hover:bg-gray-800 transition-colors">
                    <Sparkles className="w-4 h-4" />
                    Charger plus de vidéos
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VideosPage;
