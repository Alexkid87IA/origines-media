// src/pages/SeriesPage.tsx
// Design Netflix - Navigation par séries avec rows horizontales

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { typo } from '../lib/typography';

// Types
interface Episode {
  id: string;
  titre: string;
  description: string;
  thumbnailUrl: string;
  duree: string;
  numeroEpisode: number;
  saison: number;
  datePublication: string;
  vues: number;
}

interface Serie {
  id: string;
  titre: string;
  description: string;
  posterUrl: string;
  bannerUrl: string;
  couleur: string;
  nombreEpisodes: number;
  nombreSaisons: number;
  annee: string;
  episodes: Episode[];
}

// Pool d'images aléatoires pour les épisodes "bientôt disponible"
const PLACEHOLDER_IMAGES = [
  '/series/01_transmission.jpg',
  '/series/02_etat_esprit.jpg',
  '/series/03_il_etait_une_fois.jpg',
  '/series/04_secrets_professionnels.jpg',
  '/series/05_la_lettre.jpg',
  '/series/06_imagine.jpg',
  '/academy/masterclass-storytelling.jpg',
  '/academy/guide-mindset.jpg',
  '/academy/programme-complet.jpg',
  '/kit-introspection.jpg',
];

// Fonction pour obtenir une image aléatoire
const getRandomImage = (index: number): string => {
  return PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length];
};

// Données des séries avec leurs épisodes
const seriesData: Serie[] = [
  {
    id: 'transmission',
    titre: 'Transmission',
    description: 'Quand les savoirs ancestraux rencontrent les innovations modernes. Une exploration des traditions qui façonnent notre présent.',
    posterUrl: '/series/01_transmission_poster.jpg',
    bannerUrl: '/series/01_transmission.jpg',
    couleur: '#6366F1', // Bleu violet
    nombreEpisodes: 15,
    nombreSaisons: 2,
    annee: '2024',
    episodes: [
      { id: 't-1', titre: 'L\'art ancestral de la méditation zen', description: 'Un maître zen partage les secrets d\'une pratique millénaire.', thumbnailUrl: '/placeholder.svg', duree: '18:27', numeroEpisode: 1, saison: 1, datePublication: '2024-01-12', vues: 14560 },
      { id: 't-2', titre: 'Les secrets du savoir-faire japonais', description: 'Un maître artisan transmet 40 ans d\'expertise.', thumbnailUrl: '/placeholder.svg', duree: '26:15', numeroEpisode: 2, saison: 1, datePublication: '2024-01-03', vues: 11230 },
      { id: 't-3', titre: 'L\'héritage des maîtres verriers', description: 'Voyage au cœur d\'un atelier de soufflage de verre centenaire.', thumbnailUrl: '/placeholder.svg', duree: '22:45', numeroEpisode: 3, saison: 1, datePublication: '2024-02-15', vues: 9870 },
      { id: 't-4', titre: 'La voie du thé', description: 'Cérémonie et philosophie autour du thé japonais.', thumbnailUrl: '/placeholder.svg', duree: '19:30', numeroEpisode: 4, saison: 1, datePublication: '2024-03-01', vues: 12340 },
      { id: 't-5', titre: 'Les gardiens du savoir culinaire', description: 'Recettes familiales transmises de génération en génération.', thumbnailUrl: '/placeholder.svg', duree: '24:18', numeroEpisode: 5, saison: 1, datePublication: '2024-03-20', vues: 15680 },
    ]
  },
  {
    id: 'etat-esprit',
    titre: 'État d\'Esprit',
    description: 'Explorez les mindsets gagnants et les philosophies de vie qui transforment. Des conversations profondes sur la psychologie du succès.',
    posterUrl: '/series/02_etat_esprit_poster.jpg',
    bannerUrl: '/series/02_etat_esprit.jpg',
    couleur: '#0EA5E9', // Bleu ciel
    nombreEpisodes: 19,
    nombreSaisons: 2,
    annee: '2024',
    episodes: [
      { id: 'e-1', titre: 'Transformer l\'échec en opportunité', description: 'Comment les plus grands entrepreneurs utilisent leurs échecs.', thumbnailUrl: '/placeholder.svg', duree: '12:45', numeroEpisode: 1, saison: 1, datePublication: '2024-01-10', vues: 16780 },
      { id: 'e-2', titre: 'La mentalité des champions olympiques', description: 'Plongée dans la psychologie des athlètes de haut niveau.', thumbnailUrl: '/placeholder.svg', duree: '19:33', numeroEpisode: 2, saison: 1, datePublication: '2024-01-01', vues: 15670 },
      { id: 'e-3', titre: 'L\'art de la résilience', description: 'Rebondir face à l\'adversité avec force et sagesse.', thumbnailUrl: '/placeholder.svg', duree: '21:15', numeroEpisode: 3, saison: 1, datePublication: '2024-02-05', vues: 18920 },
      { id: 'e-4', titre: 'Cultiver la discipline quotidienne', description: 'Les rituels des personnes hautement performantes.', thumbnailUrl: '/placeholder.svg', duree: '16:42', numeroEpisode: 4, saison: 1, datePublication: '2024-02-20', vues: 14350 },
      { id: 'e-5', titre: 'La puissance de la visualisation', description: 'Techniques mentales pour atteindre vos objectifs.', thumbnailUrl: '/placeholder.svg', duree: '14:28', numeroEpisode: 5, saison: 1, datePublication: '2024-03-10', vues: 11240 },
    ]
  },
  {
    id: 'il-etait-une-fois',
    titre: 'Il était une fois',
    description: 'Les histoires extraordinaires qui ont marqué notre époque, racontées par ceux qui les ont vécues. Des récits captivants et inspirants.',
    posterUrl: '/series/03_il_etait_une_fois_poster.jpg',
    bannerUrl: '/series/03_il_etait_une_fois.jpg',
    couleur: '#EAB308', // Or
    nombreEpisodes: 32,
    nombreSaisons: 3,
    annee: '2023',
    episodes: [
      { id: 'i-1', titre: 'Steve Jobs et la révolution Apple', description: 'L\'histoire méconnue des premiers pas d\'Apple.', thumbnailUrl: '/placeholder.svg', duree: '28:33', numeroEpisode: 1, saison: 1, datePublication: '2024-01-18', vues: 25670 },
      { id: 'i-2', titre: 'La naissance de Netflix', description: 'Comment deux entrepreneurs ont révolutionné le divertissement.', thumbnailUrl: '/placeholder.svg', duree: '32:15', numeroEpisode: 2, saison: 1, datePublication: '2023-12-18', vues: 28940 },
      { id: 'i-3', titre: 'L\'épopée SpaceX', description: 'De la faillite à la conquête spatiale.', thumbnailUrl: '/placeholder.svg', duree: '35:42', numeroEpisode: 3, saison: 1, datePublication: '2024-01-25', vues: 31200 },
      { id: 'i-4', titre: 'Wikipedia : l\'encyclopédie du peuple', description: 'Comment un rêve utopique est devenu réalité.', thumbnailUrl: '/placeholder.svg', duree: '24:18', numeroEpisode: 4, saison: 1, datePublication: '2024-02-08', vues: 19450 },
      { id: 'i-5', titre: 'Airbnb : de la colocation à l\'empire', description: 'Trois amis et une idée qui a changé le voyage.', thumbnailUrl: '/placeholder.svg', duree: '27:55', numeroEpisode: 5, saison: 1, datePublication: '2024-02-22', vues: 22180 },
    ]
  },
  {
    id: 'secrets-pro',
    titre: 'Secrets professionnels',
    description: 'Immersion dans les coulisses des métiers d\'exception et des expertises rares. Découvrez ce qui se cache derrière l\'excellence.',
    posterUrl: '/series/04_secrets_professionnels_poster.jpg',
    bannerUrl: '/series/04_secrets_professionnels.jpg',
    couleur: '#EC4899', // Rose/Pink
    nombreEpisodes: 18,
    nombreSaisons: 2,
    annee: '2024',
    episodes: [
      { id: 's-1', titre: 'Dans les coulisses d\'un chef étoilé', description: 'Immersion dans la cuisine de Thomas Keller.', thumbnailUrl: '/placeholder.svg', duree: '22:15', numeroEpisode: 1, saison: 1, datePublication: '2024-01-20', vues: 12340 },
      { id: 's-2', titre: 'Dans l\'atelier d\'un maître horloger', description: 'L\'art millénaire de l\'horlogerie suisse.', thumbnailUrl: '/placeholder.svg', duree: '25:47', numeroEpisode: 2, saison: 1, datePublication: '2023-12-20', vues: 15670 },
      { id: 's-3', titre: 'Les secrets d\'un sommelier', description: 'L\'art de la dégustation et du service du vin.', thumbnailUrl: '/placeholder.svg', duree: '18:32', numeroEpisode: 3, saison: 1, datePublication: '2024-01-28', vues: 9870 },
      { id: 's-4', titre: 'Chirurgien cardiaque : 24h en bloc', description: 'Une journée aux côtés d\'un chirurgien d\'exception.', thumbnailUrl: '/placeholder.svg', duree: '31:20', numeroEpisode: 4, saison: 1, datePublication: '2024-02-12', vues: 21340 },
      { id: 's-5', titre: 'L\'œil du directeur artistique', description: 'Dans les coulisses de la création visuelle.', thumbnailUrl: '/placeholder.svg', duree: '20:45', numeroEpisode: 5, saison: 1, datePublication: '2024-03-05', vues: 11560 },
    ]
  },
  {
    id: 'la-lettre',
    titre: 'La Lettre',
    description: 'Chaque semaine, une analyse approfondie des tendances et idées qui façonnent notre monde. Décryptage et perspectives.',
    posterUrl: '/series/05_la_lettre_poster.jpg',
    bannerUrl: '/series/05_la_lettre.jpg',
    couleur: '#10B981', // Vert
    nombreEpisodes: 24,
    nombreSaisons: 2,
    annee: '2024',
    episodes: [
      { id: 'l-1', titre: 'Les 7 habitudes des leaders exceptionnels', description: 'Rituels et principes des vrais leaders.', thumbnailUrl: '/placeholder.svg', duree: '15:42', numeroEpisode: 1, saison: 1, datePublication: '2024-01-22', vues: 18450 },
      { id: 'l-2', titre: 'Décryptage de l\'économie créative', description: 'Analyse des nouveaux modèles économiques.', thumbnailUrl: '/placeholder.svg', duree: '17:22', numeroEpisode: 2, saison: 1, datePublication: '2023-12-22', vues: 11230 },
      { id: 'l-3', titre: 'L\'IA et l\'avenir du travail', description: 'Comment l\'intelligence artificielle transforme nos métiers.', thumbnailUrl: '/placeholder.svg', duree: '19:15', numeroEpisode: 3, saison: 1, datePublication: '2024-02-01', vues: 24560 },
      { id: 'l-4', titre: 'La révolution du bien-être au travail', description: 'Nouvelles approches du management humain.', thumbnailUrl: '/placeholder.svg', duree: '14:48', numeroEpisode: 4, saison: 1, datePublication: '2024-02-15', vues: 13780 },
      { id: 'l-5', titre: 'Tendances 2024 : ce qui va changer', description: 'Les grandes mutations à anticiper.', thumbnailUrl: '/placeholder.svg', duree: '21:33', numeroEpisode: 5, saison: 1, datePublication: '2024-03-01', vues: 19240 },
    ]
  },
  {
    id: 'imagine',
    titre: 'Imagine',
    description: 'Et si on imaginait ensemble un monde différent ? Explorations créatives et visionnaires pour réinventer demain.',
    posterUrl: '/series/06_imagine_poster.jpg',
    bannerUrl: '/series/06_imagine.jpg',
    couleur: '#8B5CF6', // Violet
    nombreEpisodes: 12,
    nombreSaisons: 1,
    annee: '2024',
    episodes: [
      { id: 'im-1', titre: 'Les villes de demain', description: 'Comment nos espaces urbains vont évoluer.', thumbnailUrl: '/placeholder.svg', duree: '23:45', numeroEpisode: 1, saison: 1, datePublication: '2024-01-15', vues: 17890 },
      { id: 'im-2', titre: 'L\'école du futur', description: 'Réinventer l\'éducation pour les générations à venir.', thumbnailUrl: '/placeholder.svg', duree: '19:22', numeroEpisode: 2, saison: 1, datePublication: '2024-01-29', vues: 14560 },
      { id: 'im-3', titre: 'Vivre sans argent', description: 'Expériences d\'économie alternative.', thumbnailUrl: '/placeholder.svg', duree: '25:18', numeroEpisode: 3, saison: 1, datePublication: '2024-02-12', vues: 21340 },
      { id: 'im-4', titre: 'La fin du travail ?', description: 'Repenser notre rapport au labeur.', thumbnailUrl: '/placeholder.svg', duree: '22:55', numeroEpisode: 4, saison: 1, datePublication: '2024-02-26', vues: 18790 },
      { id: 'im-5', titre: 'Habiter Mars', description: 'Les défis de la colonisation spatiale.', thumbnailUrl: '/placeholder.svg', duree: '28:12', numeroEpisode: 5, saison: 1, datePublication: '2024-03-11', vues: 25670 },
    ]
  }
];

// Composant Row horizontale (style Netflix)
const SeriesRow: React.FC<{
  serie: Serie;
}> = ({ serie }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const scrollAmount = rowRef.current.clientWidth * 0.8;
      rowRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (rowRef.current) {
      setShowLeftArrow(rowRef.current.scrollLeft > 0);
      setShowRightArrow(
        rowRef.current.scrollLeft < rowRef.current.scrollWidth - rowRef.current.clientWidth - 10
      );
    }
  };

  return (
    <div id={`serie-${serie.id}`} className="mb-8 group/row scroll-mt-20">
      {/* Row Header */}
      <div className="flex items-center gap-3 mb-3 px-4 sm:px-8 lg:px-12">
        <div
          className="w-1 h-6 rounded-full"
          style={{ backgroundColor: serie.couleur }}
        />
        <h2 className="text-xl lg:text-2xl font-bold text-white">
          {typo(serie.titre)}
        </h2>
        <span className="text-white/50 text-sm">
          {serie.nombreEpisodes} épisodes
        </span>
      </div>

      {/* Row Content */}
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          aria-label="Épisodes précédents"
          className={`
            absolute left-0 top-0 bottom-0 z-20 w-12 lg:w-16
            bg-gradient-to-r from-gray-950 to-transparent
            flex items-center justify-start pl-2
            transition-opacity duration-300
            ${showLeftArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>

        {/* Episodes Row - Bientôt disponible */}
        <div
          ref={rowRef}
          onScroll={handleScroll}
          className="flex gap-2 overflow-x-auto scrollbar-hide px-4 sm:px-8 lg:px-12 pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {serie.episodes.map((episode, index) => (
            <motion.div
              key={episode.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="flex-shrink-0 w-[280px] lg:w-[320px] group cursor-not-allowed"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video rounded-lg overflow-hidden mb-2 ring-2 ring-white/10">
                <img
                  src={getRandomImage(index + serie.episodes.length)}
                  alt={episode.titre}
                  loading="lazy"
                  className="w-full h-full object-cover grayscale-[30%] brightness-75"
                />

                {/* Overlay permanent "Bientôt disponible" */}
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-2 bg-white/10 backdrop-blur-sm"
                  >
                    <Lock className="w-5 h-5 text-white/80" />
                  </div>
                  <span className="text-white/90 text-xs font-semibold uppercase tracking-wider">
                    Bientôt disponible
                  </span>
                </div>

                {/* Episode number badge */}
                <div className="absolute top-2 left-2">
                  <span
                    className="px-2 py-1 rounded text-xs font-bold text-white/80"
                    style={{ backgroundColor: `${serie.couleur}80` }}
                  >
                    Ép. {episode.numeroEpisode}
                  </span>
                </div>
              </div>

              {/* Episode Info */}
              <h3 className="text-white/60 font-semibold text-sm leading-tight line-clamp-1">
                {typo(episode.titre)}
              </h3>
              <p className="text-white/40 text-xs line-clamp-2 mt-1">
                {episode.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          aria-label="Épisodes suivants"
          className={`
            absolute right-0 top-0 bottom-0 z-20 w-12 lg:w-16
            bg-gradient-to-l from-gray-950 to-transparent
            flex items-center justify-end pr-2
            transition-opacity duration-300
            ${showRightArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}
        >
          <ChevronRight className="w-8 h-8 text-white" />
        </button>
      </div>
    </div>
  );
};

// Page principale
const SeriesPage: React.FC = () => {
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const featuredSerie = seriesData[featuredIndex];

  // Auto-rotation toutes les 6 secondes
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % seriesData.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isPaused, featuredIndex]);

  const handleSelectSerie = (index: number) => {
    setFeaturedIndex(index);
    setIsPaused(true);
    // Reprend l'auto-rotation après 10 secondes
    setTimeout(() => setIsPaused(false), 10000);
  };

  const handleMoreInfo = () => {
    // Scroll vers la row de la série featured
    const targetElement = document.getElementById(`serie-${featuredSerie.id}`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <main>
        {/* Hero Banner - Série à la une */}
        <section className="relative h-[65vh] sm:h-[70vh] lg:h-[80vh] overflow-hidden">
          {/* Background Image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={featuredSerie.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <img
                src={featuredSerie.bannerUrl}
                alt=""
                className="w-full h-full object-cover"
              />
              {/* Gradients */}
              <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/90 to-gray-950/30" />
            </motion.div>
          </AnimatePresence>

          {/* Content : Gauche (texte) + Droite (poster en grand) */}
          <div className="absolute inset-0 flex items-end sm:items-center pb-32 sm:pb-28">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-8">

              {/* Left: Content */}
              <div className="flex-1 max-w-xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={featuredSerie.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Badge avec couleur de la série */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span
                        className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider"
                        style={{ backgroundColor: featuredSerie.couleur }}
                      >
                        Série Origines
                      </span>
                      <span className="text-white/50 text-xs sm:text-sm">
                        {featuredSerie.nombreSaisons} saison{featuredSerie.nombreSaisons > 1 ? 's' : ''} • {featuredSerie.nombreEpisodes} épisodes
                      </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
                      {typo(featuredSerie.titre)}
                    </h1>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-white/70 mb-5 sm:mb-6 max-w-lg leading-relaxed">
                      {featuredSerie.description}
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 sm:gap-3">
                      <button
                        disabled
                        aria-label="Bientôt disponible"
                        className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-white/20 text-white/70 rounded-md font-semibold text-sm cursor-not-allowed"
                      >
                        <Lock className="w-4 h-4" />
                        <span className="whitespace-nowrap">Bientôt disponible</span>
                      </button>
                      <button
                        onClick={handleMoreInfo}
                        aria-label={`Voir les épisodes de ${featuredSerie.titre}`}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-white/15 backdrop-blur-sm text-white rounded-md font-medium text-sm hover:bg-white/25 transition-colors"
                      >
                        <Info className="w-4 h-4" />
                        <span className="whitespace-nowrap">Plus d'infos</span>
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right: Poster de la série active en grand avec glassmorphism */}
              <div className="hidden lg:block">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={featuredSerie.id}
                    initial={{ opacity: 0, scale: 0.9, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9, x: -20 }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                  >
                    {/* Glassmorphism container */}
                    <div
                      className="relative p-4 xl:p-5 rounded-2xl backdrop-blur-xl"
                      style={{
                        background: `linear-gradient(135deg, ${featuredSerie.couleur}15 0%, ${featuredSerie.couleur}08 50%, rgba(255,255,255,0.05) 100%)`,
                        boxShadow: `
                          0 0 0 1px ${featuredSerie.couleur}30,
                          0 0 40px ${featuredSerie.couleur}20,
                          inset 0 1px 0 rgba(255,255,255,0.1)
                        `
                      }}
                    >
                      {/* Glow effect derrière le poster */}
                      <div
                        className="absolute inset-0 rounded-2xl blur-3xl opacity-40 -z-10"
                        style={{ backgroundColor: featuredSerie.couleur }}
                      />

                      {/* Decorative corner accents */}
                      <div
                        className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 rounded-tl-lg opacity-50"
                        style={{ borderColor: featuredSerie.couleur }}
                      />
                      <div
                        className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 rounded-br-lg opacity-50"
                        style={{ borderColor: featuredSerie.couleur }}
                      />

                      {/* Poster */}
                      <div
                        className="relative w-44 xl:w-52 rounded-lg overflow-hidden shadow-2xl"
                        style={{
                          boxShadow: `0 20px 40px -12px ${featuredSerie.couleur}50, 0 0 0 1px ${featuredSerie.couleur}40`
                        }}
                      >
                        <img
                          src={featuredSerie.posterUrl}
                          alt={featuredSerie.titre}
                          className="w-full h-auto"
                        />

                        {/* Shine effect on poster */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
                      </div>

                      {/* Series badge under poster */}
                      <div className="mt-3 text-center">
                        <span
                          className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
                          style={{ backgroundColor: featuredSerie.couleur }}
                        >
                          {featuredSerie.nombreEpisodes} épisodes
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Sélecteur de séries en bas avec miniatures */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-950 via-gray-950/95 to-transparent pt-6 pb-3 sm:pb-4">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-12">
              {/* Miniatures */}
              <div className="flex items-end justify-center gap-2 sm:gap-3 py-2">
                {seriesData.map((serie, index) => (
                  <button
                    key={serie.id}
                    onClick={() => handleSelectSerie(index)}
                    aria-label={`Voir ${serie.titre}`}
                    aria-current={index === featuredIndex ? 'true' : undefined}
                    className={`
                      flex-shrink-0 relative rounded overflow-hidden transition-all duration-300
                      ${index === featuredIndex
                        ? 'scale-110 sm:scale-110 z-10'
                        : 'opacity-50 hover:opacity-90 hover:scale-105'
                      }
                    `}
                    style={{
                      boxShadow: index === featuredIndex
                        ? `0 0 0 2px ${serie.couleur}, 0 4px 12px -2px ${serie.couleur}50`
                        : '0 2px 8px rgba(0,0,0,0.3)'
                    }}
                  >
                    <div className="w-12 sm:w-11 lg:w-12 aspect-[2/3]">
                      <img
                        src={serie.posterUrl}
                        alt={serie.titre}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </button>
                ))}
              </div>

              {/* Progress bar */}
              <div className="flex gap-1 mt-3 max-w-[280px] sm:max-w-[260px] mx-auto" role="tablist" aria-label="Sélecteur de série">
                {seriesData.map((serie, index) => (
                  <button
                    key={serie.id}
                    onClick={() => handleSelectSerie(index)}
                    role="tab"
                    aria-selected={index === featuredIndex}
                    aria-label={`Série ${index + 1}: ${serie.titre}`}
                    className="flex-1 h-1 rounded-full overflow-hidden bg-white/20"
                  >
                    {index === featuredIndex && (
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: serie.couleur }}
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 6, ease: 'linear' }}
                        key={`progress-${featuredIndex}`}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Series Rows */}
        <section className="pt-6 pb-8 relative z-10">
          {seriesData.map((serie) => (
            <SeriesRow
              key={serie.id}
              serie={serie}
            />
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SeriesPage;
