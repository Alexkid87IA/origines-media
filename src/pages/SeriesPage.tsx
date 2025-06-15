import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Grid, List, Clock, Play, ArrowRight, TrendingUp, Calendar, Eye, Heart, Share2, X, ChevronDown, Video } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

interface VideoProduction {
  id: string;
  titre: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  format: string;
  datePublication: string;
  duree: string;
  vues: number;
  likes: number;
  isPopular?: boolean;
  isRecent?: boolean;
  tags: string[];
  episode?: number;
  saison?: number;
}

interface FormatVideo {
  id: string;
  nom: string;
  couleur: string;
  count: number;
  description: string;
}

const SeriesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'alphabetical' | 'duration'>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);

  const itemsPerPage = 12;

  // ✅ CORRECTION : Données complètes des 8 formats vidéos exclusifs
  const formatsVideo: FormatVideo[] = [
    { id: 'all', nom: 'Tous les formats', couleur: '#EC4899', count: 156, description: 'Tous nos contenus vidéos exclusifs' },
    { id: 'la-lettre', nom: 'La Lettre', couleur: '#8B5CF6', count: 24, description: 'Analyses hebdomadaires approfondies' },
    { id: 'secrets-pro', nom: 'Secrets Pro', couleur: '#EC4899', count: 18, description: 'Coulisses des métiers et expertises' },
    { id: 'il-etait-une-fois', nom: 'Il était une fois', couleur: '#F59E0B', count: 32, description: 'Récits narratifs immersifs' },
    { id: 'connexion', nom: 'Connexion', couleur: '#10B981', count: 21, description: 'Rencontres inspirantes' },
    { id: 'transmission', nom: 'Transmission', couleur: '#3B82F6', count: 15, description: 'Savoirs ancestraux et modernes' },
    { id: 'etat-esprit', nom: 'État d\'Esprit', couleur: '#EF4444', count: 19, description: 'Mindset et philosophie de vie' },
    { id: 'apparence', nom: 'Apparence', couleur: '#8B5CF6', count: 12, description: 'Image et authenticité' },
    { id: 'je-suis', nom: 'Je Suis', couleur: '#06B6D4', count: 15, description: 'Identité et transformation personnelle' }
  ];

  // Tags populaires pour les vidéos
  const allTags = [
    'Développement personnel', 'Leadership', 'Créativité', 'Entrepreneuriat', 'Mindset',
    'Communication', 'Résilience', 'Innovation', 'Productivité', 'Bien-être',
    'Storytelling', 'Coaching', 'Motivation', 'Stratégie', 'Vision',
    'Transformation', 'Inspiration', 'Excellence', 'Performance', 'Authenticité'
  ];

  // ✅ CORRECTION : Données étendues avec les 4 formats manquants
  const allVideos: VideoProduction[] = [
    {
      id: 'video-001',
      titre: 'Les 7 habitudes des leaders exceptionnels',
      description: 'Découvrez les rituels quotidiens et les principes fondamentaux qui distinguent les vrais leaders des simples managers.',
      thumbnailUrl: 'https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg',
      videoUrl: '/video/7-habitudes-leaders',
      format: 'la-lettre',
      datePublication: '2024-01-22',
      duree: '15:42',
      vues: 18450,
      likes: 1203,
      isPopular: true,
      isRecent: true,
      tags: ['Leadership', 'Habitudes', 'Excellence'],
      episode: 12,
      saison: 2
    },
    {
      id: 'video-002',
      titre: 'Dans les coulisses d\'un chef étoilé',
      description: 'Immersion exclusive dans la cuisine de Thomas Keller pour comprendre l\'obsession de la perfection culinaire.',
      thumbnailUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
      videoUrl: '/video/coulisses-chef-etoile',
      format: 'secrets-pro',
      datePublication: '2024-01-20',
      duree: '22:15',
      vues: 12340,
      likes: 892,
      isPopular: true,
      tags: ['Gastronomie', 'Excellence', 'Passion'],
      episode: 8,
      saison: 1
    },
    {
      id: 'video-003',
      titre: 'Il était une fois... Steve Jobs et la révolution Apple',
      description: 'L\'histoire méconnue des premiers pas d\'Apple, racontée par ceux qui ont vécu cette aventure extraordinaire.',
      thumbnailUrl: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
      videoUrl: '/video/steve-jobs-apple',
      format: 'il-etait-une-fois',
      datePublication: '2024-01-18',
      duree: '28:33',
      vues: 25670,
      likes: 1876,
      isPopular: true,
      tags: ['Innovation', 'Entrepreneuriat', 'Technologie'],
      episode: 5,
      saison: 3
    },
    {
      id: 'video-004',
      titre: 'Connexion avec Yuval Noah Harari',
      description: 'Une conversation profonde avec l\'historien sur l\'avenir de l\'humanité et les défis du 21ème siècle.',
      thumbnailUrl: 'https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg',
      videoUrl: '/video/yuval-harari-connexion',
      format: 'connexion',
      datePublication: '2024-01-15',
      duree: '45:12',
      vues: 31200,
      likes: 2134,
      isPopular: true,
      tags: ['Philosophie', 'Futur', 'Société'],
      episode: 15,
      saison: 2
    },
    {
      id: 'video-005',
      titre: 'L\'art ancestral de la méditation zen',
      description: 'Transmission millénaire : un maître zen partage les secrets d\'une pratique qui transforme l\'esprit.',
      thumbnailUrl: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg',
      videoUrl: '/video/meditation-zen-transmission',
      format: 'transmission',
      datePublication: '2024-01-12',
      duree: '18:27',
      vues: 14560,
      likes: 1045,
      tags: ['Méditation', 'Spiritualité', 'Tradition'],
      episode: 3,
      saison: 1
    },
    {
      id: 'video-006',
      titre: 'État d\'esprit : Transformer l\'échec en opportunité',
      description: 'Comment les plus grands entrepreneurs utilisent leurs échecs comme tremplin vers le succès.',
      thumbnailUrl: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg',
      videoUrl: '/video/echec-opportunite-mindset',
      format: 'etat-esprit',
      datePublication: '2024-01-10',
      duree: '12:45',
      vues: 16780,
      likes: 1234,
      isRecent: true,
      tags: ['Mindset', 'Résilience', 'Entrepreneuriat'],
      episode: 7,
      saison: 1
    },
    {
      id: 'video-007',
      titre: 'Apparence : L\'authenticité comme force',
      description: 'Pourquoi être soi-même est la stratégie la plus puissante dans un monde d\'apparences.',
      thumbnailUrl: 'https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg',
      videoUrl: '/video/authenticite-apparence',
      format: 'apparence',
      datePublication: '2024-01-08',
      duree: '14:18',
      vues: 9876,
      likes: 723,
      tags: ['Authenticité', 'Image', 'Confiance'],
      episode: 4,
      saison: 1
    },
    {
      id: 'video-008',
      titre: 'Je suis... une femme qui a révolutionné la tech',
      description: 'Portrait intime d\'une pionnière qui a brisé les codes dans l\'univers masculin de la technologie.',
      thumbnailUrl: 'https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg',
      videoUrl: '/video/femme-tech-revolution',
      format: 'je-suis',
      datePublication: '2024-01-05',
      duree: '20:33',
      vues: 13450,
      likes: 967,
      tags: ['Technologie', 'Féminisme', 'Innovation'],
      episode: 6,
      saison: 2
    },
    // ✅ NOUVEAUX CONTENUS pour les 4 formats manquants
    {
      id: 'video-009',
      titre: 'Transmission : Les secrets du savoir-faire japonais',
      description: 'Un maître artisan japonais transmet 40 ans d\'expertise dans l\'art de la céramique traditionnelle.',
      thumbnailUrl: 'https://images.pexels.com/photos/3769999/pexels-photo-3769999.jpeg',
      videoUrl: '/video/savoir-faire-japonais',
      format: 'transmission',
      datePublication: '2024-01-03',
      duree: '26:15',
      vues: 11230,
      likes: 834,
      tags: ['Artisanat', 'Tradition', 'Japon'],
      episode: 2,
      saison: 1
    },
    {
      id: 'video-010',
      titre: 'État d\'esprit : La mentalité des champions olympiques',
      description: 'Plongée dans la psychologie des athlètes de haut niveau et leurs stratégies mentales.',
      thumbnailUrl: 'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg',
      videoUrl: '/video/mentalite-champions',
      format: 'etat-esprit',
      datePublication: '2024-01-01',
      duree: '19:33',
      vues: 15670,
      likes: 1156,
      isPopular: true,
      tags: ['Sport', 'Performance', 'Mindset'],
      episode: 6,
      saison: 1
    },
    {
      id: 'video-011',
      titre: 'Apparence : Déconstruire les codes de beauté',
      description: 'Comment redéfinir sa relation à l\'image et s\'affranchir des diktats esthétiques.',
      thumbnailUrl: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg',
      videoUrl: '/video/deconstruire-beaute',
      format: 'apparence',
      datePublication: '2023-12-28',
      duree: '16:42',
      vues: 12940,
      likes: 987,
      tags: ['Beauté', 'Société', 'Confiance'],
      episode: 3,
      saison: 1
    },
    {
      id: 'video-012',
      titre: 'Je suis... un ancien détenu devenu entrepreneur',
      description: 'Récit bouleversant d\'une rédemption par l\'entrepreneuriat social et la seconde chance.',
      thumbnailUrl: 'https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg',
      videoUrl: '/video/detenu-entrepreneur',
      format: 'je-suis',
      datePublication: '2023-12-25',
      duree: '24:18',
      vues: 19560,
      likes: 1423,
      isPopular: true,
      tags: ['Rédemption', 'Entrepreneuriat', 'Société'],
      episode: 5,
      saison: 2
    },
    // Contenus supplémentaires pour enrichir
    {
      id: 'video-013',
      titre: 'La Lettre : Décryptage de l\'économie créative',
      description: 'Analyse approfondie des nouveaux modèles économiques dans les industries créatives.',
      thumbnailUrl: 'https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg',
      videoUrl: '/video/economie-creative-analyse',
      format: 'la-lettre',
      datePublication: '2023-12-22',
      duree: '17:22',
      vues: 11230,
      likes: 834,
      tags: ['Économie', 'Créativité', 'Innovation'],
      episode: 11,
      saison: 2
    },
    {
      id: 'video-014',
      titre: 'Secrets Pro : Dans l\'atelier d\'un maître horloger',
      description: 'L\'art millénaire de l\'horlogerie suisse révélé par un artisan d\'exception.',
      thumbnailUrl: 'https://images.pexels.com/photos/3769999/pexels-photo-3769999.jpeg',
      videoUrl: '/video/maitre-horloger-secrets',
      format: 'secrets-pro',
      datePublication: '2023-12-20',
      duree: '25:47',
      vues: 15670,
      likes: 1156,
      isPopular: true,
      tags: ['Artisanat', 'Tradition', 'Excellence'],
      episode: 7,
      saison: 1
    },
    {
      id: 'video-015',
      titre: 'Il était une fois... La naissance de Netflix',
      description: 'Comment deux entrepreneurs ont révolutionné l\'industrie du divertissement mondial.',
      thumbnailUrl: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
      videoUrl: '/video/naissance-netflix',
      format: 'il-etait-une-fois',
      datePublication: '2023-12-18',
      duree: '32:15',
      vues: 28940,
      likes: 2187,
      isPopular: true,
      tags: ['Entrepreneuriat', 'Disruption', 'Streaming'],
      episode: 4,
      saison: 3
    },
    {
      id: 'video-016',
      titre: 'Connexion avec un moine tibétain',
      description: 'Sagesse millénaire et vision moderne : dialogue entre tradition et contemporanéité.',
      thumbnailUrl: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg',
      videoUrl: '/video/moine-tibetain-connexion',
      format: 'connexion',
      datePublication: '2023-12-15',
      duree: '38:42',
      vues: 19560,
      likes: 1423,
      tags: ['Spiritualité', 'Sagesse', 'Tradition'],
      episode: 14,
      saison: 2
    }
  ];

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Preload images
  useEffect(() => {
    allVideos.forEach((video) => {
      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => new Set([...prev, video.id]));
      };
      img.src = video.thumbnailUrl;
    });
  }, []);

  // Filtrage et tri des vidéos
  const filteredAndSortedVideos = React.useMemo(() => {
    let filtered = allVideos.filter(video => {
      const matchesSearch = video.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           video.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesFormat = selectedFormat === 'all' || video.format === selectedFormat;
      
      const matchesTags = selectedTags.length === 0 || 
                         selectedTags.some(tag => video.tags.includes(tag));
      
      return matchesSearch && matchesFormat && matchesTags;
    });

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.datePublication).getTime() - new Date(a.datePublication).getTime();
        case 'popular':
          return b.vues - a.vues;
        case 'alphabetical':
          return a.titre.localeCompare(b.titre);
        case 'duration':
          const aDuration = a.duree.split(':').reduce((acc, time) => (60 * acc) + +time, 0);
          const bDuration = b.duree.split(':').reduce((acc, time) => (60 * acc) + +time, 0);
          return aDuration - bDuration;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedFormat, selectedTags, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedVideos.length / itemsPerPage);
  const currentVideos = filteredAndSortedVideos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedFormat, selectedTags, sortBy]);

  const getFormatColor = (formatId: string) => {
    const format = formatsVideo.find(f => f.id === formatId);
    return format?.couleur || '#EC4899';
  };

  const getFormatName = (formatId: string) => {
    const format = formatsVideo.find(f => f.id === formatId);
    return format?.nom || formatId;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] overflow-x-hidden">
      {/* Sidebar Desktop */}
      <Sidebar />

      {/* Main Content */}
      <main className="min-h-screen md:ml-[280px]">
        
        {/* Hero Section */}
        <section 
          ref={sectionRef}
          className="relative bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#0A0A0A] py-20 px-8 lg:px-16 overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23EC4899' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          {/* Header Content */}
          <div className={`text-center mb-16 transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent" />
              <span className="font-inter text-fuchsia-400 text-sm tracking-[0.2em] uppercase">
                Formats Exclusifs
              </span>
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent" />
            </div>
            
            <h1 className="font-montserrat font-black text-4xl md:text-5xl lg:text-6xl xl:text-7xl uppercase tracking-wider text-white mb-6 leading-[0.9]">
              Nos
              <br />
              <span className="gradient-text-animated">Séries</span>
            </h1>
            
            <p className="font-inter text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
              Découvrez nos collections exclusives de contenus vidéos organisés en formats uniques
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mt-12">
              <div className="text-center">
                <div className="font-montserrat font-bold text-3xl text-fuchsia-400 mb-2">156</div>
                <div className="font-inter text-white/60 text-sm uppercase tracking-wider">Épisodes</div>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <div className="font-montserrat font-bold text-3xl text-violet-400 mb-2">8</div>
                <div className="font-inter text-white/60 text-sm uppercase tracking-wider">Formats</div>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <div className="font-montserrat font-bold text-3xl text-emerald-400 mb-2">1.8M</div>
                <div className="font-inter text-white/60 text-sm uppercase tracking-wider">Vues</div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters & Search Section */}
        <section className="bg-[#0F0F0F] border-t border-white/10 py-8 px-8 lg:px-16 sticky top-0 z-40 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto">
            
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  placeholder="Rechercher par titre, description ou tag..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/20 rounded-xl text-white placeholder-white/50 font-inter focus:outline-none focus:border-fuchsia-500/50 focus:bg-black/60 transition-all duration-300 backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              
              {/* ✅ CORRECTION : Formats Filter avec les 8 formats (6 visibles + bouton "Plus") */}
              <div className="flex items-center gap-4 flex-wrap">
                <span className="font-inter text-white/70 text-sm font-medium">Formats:</span>
                <div className="flex gap-2 flex-wrap">
                  {formatsVideo.slice(0, 6).map((format) => (
                    <button
                      key={format.id}
                      onClick={() => setSelectedFormat(format.id)}
                      className={`
                        px-4 py-2 rounded-full font-inter font-medium text-sm transition-all duration-300 border backdrop-blur-sm flex items-center gap-2
                        ${selectedFormat === format.id
                          ? 'text-white scale-105 shadow-lg'
                          : 'text-white/70 bg-black/20 border-white/20 hover:bg-black/30 hover:border-white/30 hover:text-white'
                        }
                      `}
                      style={selectedFormat === format.id ? {
                        backgroundColor: format.couleur,
                        borderColor: `${format.couleur}80`,
                        boxShadow: `0 8px 25px ${format.couleur}40`
                      } : {}}
                    >
                      <Video className="w-3 h-3" />
                      {format.nom} ({format.count})
                    </button>
                  ))}
                  
                  {/* More Formats Button */}
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="px-4 py-2 rounded-full font-inter font-medium text-sm text-white/70 bg-black/20 border border-white/20 hover:bg-black/30 hover:border-white/30 hover:text-white transition-all duration-300 backdrop-blur-sm flex items-center gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    Plus de filtres
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Sort & View Controls */}
              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 bg-black/40 border border-white/20 rounded-xl text-white font-inter text-sm focus:outline-none focus:border-fuchsia-500/50 transition-all duration-300 backdrop-blur-sm"
                >
                  <option value="recent">Plus récents</option>
                  <option value="popular">Plus populaires</option>
                  <option value="alphabetical">Alphabétique</option>
                  <option value="duration">Durée</option>
                </select>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-black/40 border border-white/20 rounded-xl p-1 backdrop-blur-sm">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      viewMode === 'grid' 
                        ? 'bg-fuchsia-600 text-white' 
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      viewMode === 'list' 
                        ? 'bg-fuchsia-600 text-white' 
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* ✅ CORRECTION : Extended Filters Panel avec TOUS les 8 formats */}
            {isFilterOpen && (
              <div className="mt-6 p-6 bg-black/40 border border-white/20 rounded-xl backdrop-blur-sm">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* All Formats - MAINTENANT AVEC LES 8 FORMATS COMPLETS */}
                  <div>
                    <h3 className="font-inter font-medium text-white mb-4">Tous les formats</h3>
                    <div className="flex gap-2 flex-wrap">
                      {formatsVideo.map((format) => (
                        <button
                          key={format.id}
                          onClick={() => setSelectedFormat(format.id)}
                          className={`
                            px-3 py-1.5 rounded-full font-inter font-medium text-xs transition-all duration-300 border backdrop-blur-sm flex items-center gap-2
                            ${selectedFormat === format.id
                              ? 'text-white scale-105'
                              : 'text-white/70 bg-black/20 border-white/20 hover:bg-black/30 hover:border-white/30 hover:text-white'
                            }
                          `}
                          style={selectedFormat === format.id ? {
                            backgroundColor: format.couleur,
                            borderColor: `${format.couleur}80`
                          } : {}}
                        >
                          <Video className="w-3 h-3" />
                          {format.nom} ({format.count})
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tags Filter */}
                  <div>
                    <h3 className="font-inter font-medium text-white mb-4">Tags populaires</h3>
                    <div className="flex gap-2 flex-wrap">
                      {allTags.slice(0, 12).map((tag) => (
                        <button
                          key={tag}
                          onClick={() => {
                            if (selectedTags.includes(tag)) {
                              setSelectedTags(selectedTags.filter(t => t !== tag));
                            } else {
                              setSelectedTags([...selectedTags, tag]);
                            }
                          }}
                          className={`
                            px-3 py-1.5 rounded-full font-inter font-medium text-xs transition-all duration-300 border backdrop-blur-sm
                            ${selectedTags.includes(tag)
                              ? 'bg-fuchsia-600 border-fuchsia-500 text-white'
                              : 'text-white/70 bg-black/20 border-white/20 hover:bg-black/30 hover:border-white/30 hover:text-white'
                            }
                          `}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                {(selectedTags.length > 0 || selectedFormat !== 'all') && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <button
                      onClick={() => {
                        setSelectedTags([]);
                        setSelectedFormat('all');
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 text-white/70 hover:text-white transition-colors duration-300 font-inter text-sm"
                    >
                      <X className="w-4 h-4" />
                      Effacer tous les filtres
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Results Count */}
            <div className="mt-6 text-center">
              <span className="font-inter text-white/60 text-sm">
                {filteredAndSortedVideos.length} épisode{filteredAndSortedVideos.length > 1 ? 's' : ''} trouvé{filteredAndSortedVideos.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </section>

        {/* Content Grid/List */}
        <section className="py-16 px-8 lg:px-16 bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#0A0A0A]">
          <div className="max-w-7xl mx-auto">
            
            {viewMode === 'grid' ? (
              /* Grid View */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {currentVideos.map((video, index) => {
                  const formatColor = getFormatColor(video.format);
                  
                  return (
                    <div
                      key={video.id}
                      className={`
                        group relative overflow-hidden rounded-3xl cursor-pointer
                        h-[500px] transform transition-all duration-700 hover:scale-[1.02] hover:z-10
                        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}
                      `}
                      style={{
                        transitionDelay: `${index * 100}ms`,
                      }}
                      onMouseEnter={() => setHoveredCard(video.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      onClick={() => window.open(video.videoUrl, '_blank')}
                    >
                      {/* Thumbnail Container */}
                      <div className="absolute inset-0">
                        {loadedImages.has(video.id) ? (
                          <div
                            className="w-full h-full bg-cover bg-center transition-all duration-700 group-hover:scale-110"
                            style={{
                              backgroundImage: `url(${video.thumbnailUrl})`,
                              filter: hoveredCard === video.id 
                                ? 'brightness(0.3) contrast(1.3) saturate(1.2)' 
                                : 'brightness(0.5) contrast(1.2) saturate(1.1)'
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse" />
                        )}
                        
                        {/* Strategic Gradient Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/20" />
                      </div>

                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div 
                          className={`
                            w-20 h-20 rounded-full backdrop-blur-md border-2 flex items-center justify-center
                            transition-all duration-500
                            ${hoveredCard === video.id 
                              ? 'scale-110 opacity-100' 
                              : 'scale-100 opacity-80'
                            }
                          `}
                          style={{
                            backgroundColor: `${formatColor}30`,
                            borderColor: formatColor
                          }}
                        >
                          <Play 
                            className="w-8 h-8 ml-1"
                            style={{ color: formatColor }}
                          />
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
                        {/* Format Badge */}
                        <div 
                          className="px-3 py-1.5 rounded-full backdrop-blur-md border transition-all duration-500 flex items-center gap-2"
                          style={{
                            backgroundColor: `${formatColor}20`,
                            borderColor: `${formatColor}40`
                          }}
                        >
                          <Video className="w-3 h-3" style={{ color: formatColor }} />
                          <span 
                            className="font-inter font-bold text-xs tracking-[0.15em] uppercase"
                            style={{ color: formatColor }}
                          >
                            {getFormatName(video.format)}
                          </span>
                        </div>

                        {/* Episode Badge */}
                        {video.episode && (
                          <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/20 rounded-full">
                            <span className="font-inter text-white text-xs font-bold">
                              S{video.saison}E{video.episode}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Duration Badge */}
                      <div className="absolute top-4 right-4 z-20">
                        <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/20 rounded-full">
                          <span className="font-inter text-white text-xs font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {video.duree}
                          </span>
                        </div>
                      </div>

                      {/* Content Overlay */}
                      <div className="absolute inset-0 flex flex-col justify-end p-6 z-20">
                        {/* Title */}
                        <h3 className="font-montserrat font-bold text-xl text-white mb-3 leading-tight line-clamp-2">
                          {video.titre}
                        </h3>
                        
                        {/* Description */}
                        <p className="font-inter text-white/80 text-sm leading-relaxed mb-4 line-clamp-2">
                          {video.description}
                        </p>

                        {/* Meta Info */}
                        <div className="flex items-center justify-between text-white/60 text-xs mb-4">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              <span>{formatNumber(video.vues)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              <span>{formatNumber(video.likes)}</span>
                            </div>
                          </div>
                        </div>

                        {/* CTA */}
                        <div className="flex items-center justify-between">
                          <span className="font-inter text-white/90 text-sm tracking-wide uppercase font-medium">
                            Regarder l'épisode
                          </span>
                          <div 
                            className={`
                              w-12 h-12 rounded-full flex items-center justify-center 
                              transition-all duration-500 backdrop-blur-md border
                              ${hoveredCard === video.id 
                                ? 'scale-110 shadow-lg' 
                                : 'scale-100'
                              }
                            `}
                            style={{
                              backgroundColor: hoveredCard === video.id ? `${formatColor}40` : `${formatColor}20`,
                              borderColor: hoveredCard === video.id ? `${formatColor}60` : `${formatColor}30`
                            }}
                          >
                            <ArrowRight 
                              className={`w-5 h-5 transition-all duration-500 ${
                                hoveredCard === video.id ? 'translate-x-1' : ''
                              }`}
                              style={{ color: hoveredCard === video.id ? formatColor : 'white' }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Hover Glow Effect */}
                      <div 
                        className={`
                          absolute inset-0 rounded-3xl transition-all duration-500 pointer-events-none
                          ${hoveredCard === video.id ? 'ring-2 shadow-2xl' : ''}
                        `}
                        style={{
                          ringColor: hoveredCard === video.id ? `${formatColor}60` : 'transparent',
                          boxShadow: hoveredCard === video.id ? `0 25px 50px ${formatColor}25` : 'none'
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              /* List View */
              <div className="space-y-6">
                {currentVideos.map((video, index) => {
                  const formatColor = getFormatColor(video.format);
                  
                  return (
                    <div
                      key={video.id}
                      className={`
                        group relative overflow-hidden rounded-2xl cursor-pointer bg-black/40 border border-white/10 backdrop-blur-sm
                        transform transition-all duration-700 hover:scale-[1.01] hover:bg-black/60 hover:border-white/20
                        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}
                      `}
                      style={{
                        transitionDelay: `${index * 50}ms`,
                      }}
                      onClick={() => window.open(video.videoUrl, '_blank')}
                    >
                      <div className="flex items-center p-6 gap-6">
                        {/* Thumbnail */}
                        <div className="flex-shrink-0 w-40 h-24 rounded-xl overflow-hidden relative">
                          {loadedImages.has(video.id) ? (
                            <div
                              className="w-full h-full bg-cover bg-center transition-all duration-500 group-hover:scale-110"
                              style={{
                                backgroundImage: `url(${video.thumbnailUrl})`,
                                filter: 'brightness(0.8) contrast(1.1)'
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse" />
                          )}
                          
                          {/* Play Button Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div 
                              className="w-10 h-10 rounded-full backdrop-blur-md border flex items-center justify-center"
                              style={{
                                backgroundColor: `${formatColor}30`,
                                borderColor: formatColor
                              }}
                            >
                              <Play 
                                className="w-4 h-4 ml-0.5"
                                style={{ color: formatColor }}
                              />
                            </div>
                          </div>

                          {/* Duration */}
                          <div className="absolute bottom-2 right-2">
                            <span className="px-2 py-1 bg-black/80 text-white text-xs rounded">
                              {video.duree}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              {/* Format Badge */}
                              <div 
                                className="px-3 py-1 rounded-full flex items-center gap-2"
                                style={{
                                  backgroundColor: `${formatColor}20`,
                                  color: formatColor
                                }}
                              >
                                <Video className="w-3 h-3" />
                                <span className="font-inter font-bold text-xs tracking-wider uppercase">
                                  {getFormatName(video.format)}
                                </span>
                              </div>

                              {/* Episode Badge */}
                              {video.episode && (
                                <div className="px-2 py-1 bg-white/10 text-white/80 rounded-full">
                                  <span className="text-xs font-bold">S{video.saison}E{video.episode}</span>
                                </div>
                              )}

                              {/* Badges */}
                              {video.isPopular && (
                                <div className="flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full">
                                  <TrendingUp className="w-3 h-3" />
                                  <span className="text-xs font-bold">Populaire</span>
                                </div>
                              )}
                              {video.isRecent && (
                                <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full">
                                  <Calendar className="w-3 h-3" />
                                  <span className="text-xs font-bold">Récent</span>
                                </div>
                              )}
                            </div>

                            {/* Date */}
                            <span className="text-white/50 text-sm">
                              {formatDate(video.datePublication)}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="font-montserrat font-bold text-xl text-white mb-2 leading-tight group-hover:text-fuchsia-400 transition-colors duration-300">
                            {video.titre}
                          </h3>

                          {/* Description */}
                          <p className="font-inter text-white/70 text-sm leading-relaxed mb-4 line-clamp-2">
                            {video.description}
                          </p>

                          {/* Meta & Tags */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6 text-white/60 text-xs">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{video.duree}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                <span>{formatNumber(video.vues)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="w-3 h-3" />
                                <span>{formatNumber(video.likes)}</span>
                              </div>
                            </div>

                            {/* Tags */}
                            <div className="flex items-center gap-2">
                              {video.tags.slice(0, 2).map((tag) => (
                                <span 
                                  key={tag}
                                  className="px-2 py-1 bg-white/10 text-white/60 rounded-full text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* CTA Arrow */}
                        <div className="flex-shrink-0">
                          <div 
                            className="w-12 h-12 rounded-full border flex items-center justify-center group-hover:scale-110 transition-all duration-300"
                            style={{
                              backgroundColor: `${formatColor}20`,
                              borderColor: `${formatColor}30`
                            }}
                          >
                            <ArrowRight 
                              className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                              style={{ color: formatColor }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-16 flex items-center justify-center gap-4">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-black/40 border border-white/20 rounded-xl text-white font-inter text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black/60 transition-all duration-300 backdrop-blur-sm"
                >
                  Précédent
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`
                          w-10 h-10 rounded-xl font-inter font-medium text-sm transition-all duration-300
                          ${currentPage === pageNum
                            ? 'bg-fuchsia-600 text-white'
                            : 'bg-black/40 border border-white/20 text-white/70 hover:bg-black/60 hover:text-white'
                          }
                        `}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-black/40 border border-white/20 rounded-xl text-white font-inter text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black/60 transition-all duration-300 backdrop-blur-sm"
                >
                  Suivant
                </button>
              </div>
            )}

            {/* No Results */}
            {filteredAndSortedVideos.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Video className="w-10 h-10 text-white/40" />
                </div>
                <h3 className="font-montserrat font-bold text-2xl text-white mb-4">
                  Aucun épisode trouvé
                </h3>
                <p className="font-inter text-white/60 text-lg mb-8">
                  Essayez de modifier vos critères de recherche ou vos filtres
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedFormat('all');
                    setSelectedTags([]);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-fuchsia-600 text-white font-inter font-medium rounded-xl hover:bg-fuchsia-500 transition-all duration-300"
                >
                  <X className="w-4 h-4" />
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SeriesPage;