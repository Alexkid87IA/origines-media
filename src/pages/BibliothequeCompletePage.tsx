import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Grid, List, Clock, BookOpen, ArrowRight, TrendingUp, Calendar, Eye, Heart, Share2, X, ChevronDown } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

interface Production {
  id: string;
  titre: string;
  description: string;
  imageUrl: string;
  url: string;
  categorie: string;
  datePublication: string;
  tempsLecture: number;
  vues: number;
  likes: number;
  isPopular?: boolean;
  isRecent?: boolean;
  tags: string[];
}

interface Categorie {
  id: string;
  nom: string;
  couleur: string;
  count: number;
}

const BibliothequeCompletePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategorie, setSelectedCategorie] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'alphabetical' | 'reading-time'>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);

  const itemsPerPage = 12;

  // Données des catégories
  const categories: Categorie[] = [
    { id: 'all', nom: 'Tous les contenus', couleur: '#8B5CF6', count: 847 },
    { id: 'psychologie', nom: 'Psychologie', couleur: '#4299E1', count: 127 },
    { id: 'societe', nom: 'Société', couleur: '#ED8936', count: 98 },
    { id: 'carriere', nom: 'Carrière', couleur: '#4A5568', count: 156 },
    { id: 'voyage', nom: 'Voyage', couleur: '#48BB78', count: 89 },
    { id: 'art-creativite', nom: 'Art & Créativité', couleur: '#9F7AEA', count: 134 },
    { id: 'spiritualite', nom: 'Spiritualité', couleur: '#805AD5', count: 112 },
    { id: 'sante', nom: 'Santé', couleur: '#38B2AC', count: 143 },
    { id: 'technologie', nom: 'Technologie', couleur: '#3182CE', count: 87 },
    { id: 'relations', nom: 'Relations', couleur: '#E53E3E', count: 165 },
    { id: 'environnement', nom: 'Environnement', couleur: '#38A169', count: 121 }
  ];

  // Tags populaires
  const allTags = [
    'Développement personnel', 'Reconversion', 'Mindset', 'Créativité', 'Leadership',
    'Bien-être', 'Innovation', 'Entrepreneuriat', 'Communication', 'Résilience',
    'Méditation', 'Écologie', 'Famille', 'Amour', 'Voyage solo', 'Art thérapie',
    'Intelligence émotionnelle', 'Productivité', 'Minimalisme', 'Spiritualité moderne'
  ];

  // Données des productions (exemple étendu)
  const allProductions: Production[] = [
    {
      id: 'prod-001',
      titre: 'Comment j\'ai trouvé le sens en devenant agricultrice urbaine',
      description: 'De cadre supérieure à cultivatrice de légumes sur les toits parisiens, Marie nous raconte sa transformation radicale.',
      imageUrl: 'https://images.pexels.com/photos/2519392/pexels-photo-2519392.jpeg',
      url: '/recit/agricultrice-urbaine',
      categorie: 'carriere',
      datePublication: '2024-01-15',
      tempsLecture: 8,
      vues: 12450,
      likes: 892,
      isPopular: true,
      isRecent: false,
      tags: ['Reconversion', 'Écologie', 'Sens du travail']
    },
    {
      id: 'prod-002',
      titre: 'L\'art de la résilience entrepreneuriale',
      description: 'Comment transformer les obstacles en opportunités et rebondir face aux défis du monde des affaires.',
      imageUrl: 'https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg',
      url: '/recit/resilience-entrepreneuriale',
      categorie: 'carriere',
      datePublication: '2024-01-20',
      tempsLecture: 12,
      vues: 8930,
      likes: 654,
      isPopular: true,
      isRecent: true,
      tags: ['Entrepreneuriat', 'Résilience', 'Leadership']
    },
    {
      id: 'prod-003',
      titre: 'Méditation et neurosciences : ce que dit la science',
      description: 'Une exploration approfondie des bienfaits scientifiquement prouvés de la méditation sur le cerveau.',
      imageUrl: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg',
      url: '/recit/meditation-neurosciences',
      categorie: 'spiritualite',
      datePublication: '2024-01-18',
      tempsLecture: 15,
      vues: 15670,
      likes: 1203,
      isPopular: true,
      isRecent: true,
      tags: ['Méditation', 'Science', 'Bien-être']
    },
    {
      id: 'prod-004',
      titre: 'L\'intelligence artificielle va-t-elle remplacer la créativité humaine ?',
      description: 'Réflexions sur l\'avenir de la création artistique à l\'ère de l\'IA et des nouvelles technologies.',
      imageUrl: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
      url: '/recit/ia-creativite',
      categorie: 'technologie',
      datePublication: '2024-01-22',
      tempsLecture: 10,
      vues: 7234,
      likes: 445,
      isRecent: true,
      tags: ['Intelligence artificielle', 'Créativité', 'Innovation']
    },
    {
      id: 'prod-005',
      titre: 'Communication non-violente : transformer les conflits',
      description: 'Apprendre à communiquer avec bienveillance pour résoudre les tensions relationnelles.',
      imageUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
      url: '/recit/communication-non-violente',
      categorie: 'relations',
      datePublication: '2024-01-12',
      tempsLecture: 9,
      vues: 11200,
      likes: 789,
      isPopular: true,
      tags: ['Communication', 'Relations', 'Développement personnel']
    },
    {
      id: 'prod-006',
      titre: 'Minimalisme : moins pour vivre mieux',
      description: 'Comment adopter un mode de vie minimaliste pour retrouver l\'essentiel et réduire son impact.',
      imageUrl: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
      url: '/recit/minimalisme',
      categorie: 'environnement',
      datePublication: '2024-01-10',
      tempsLecture: 7,
      vues: 9876,
      likes: 567,
      tags: ['Minimalisme', 'Écologie', 'Bien-être']
    },
    {
      id: 'prod-007',
      titre: 'L\'art comme thérapie : guérir par la création',
      description: 'Découvrir comment l\'expression artistique peut devenir un puissant outil de guérison émotionnelle.',
      imageUrl: 'https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg',
      url: '/recit/art-therapie',
      categorie: 'art-creativite',
      datePublication: '2024-01-08',
      tempsLecture: 11,
      vues: 13450,
      likes: 934,
      isPopular: true,
      tags: ['Art thérapie', 'Créativité', 'Guérison']
    },
    {
      id: 'prod-008',
      titre: 'Voyager seul : guide de l\'aventure intérieure',
      description: 'Les leçons de vie apprises en parcourant le monde en solitaire et en se découvrant soi-même.',
      imageUrl: 'https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg',
      url: '/recit/voyage-solitaire',
      categorie: 'voyage',
      datePublication: '2024-01-05',
      tempsLecture: 13,
      vues: 8765,
      likes: 623,
      tags: ['Voyage solo', 'Développement personnel', 'Aventure']
    },
    // Ajouter plus de productions pour la pagination...
    {
      id: 'prod-009',
      titre: 'L\'équilibre vie professionnelle et personnelle',
      description: 'Stratégies concrètes pour harmoniser ambitions professionnelles et épanouissement personnel.',
      imageUrl: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg',
      url: '/recit/equilibre-vie-pro',
      categorie: 'carriere',
      datePublication: '2024-01-03',
      tempsLecture: 14,
      vues: 16789,
      likes: 1156,
      isPopular: true,
      tags: ['Équilibre', 'Productivité', 'Bien-être']
    },
    {
      id: 'prod-010',
      titre: 'Les nouveaux codes de la société moderne',
      description: 'Comment naviguer dans un monde en mutation et comprendre les évolutions sociétales actuelles.',
      imageUrl: 'https://images.pexels.com/photos/7848733/pexels-photo-7848733.jpeg',
      url: '/recit/nouveaux-codes-societe',
      categorie: 'societe',
      datePublication: '2024-01-01',
      tempsLecture: 16,
      vues: 12340,
      likes: 876,
      tags: ['Société', 'Évolution', 'Culture']
    },
    {
      id: 'prod-011',
      titre: 'Sport et santé mentale : le duo gagnant',
      description: 'L\'impact positif de l\'activité physique sur le bien-être psychologique et émotionnel.',
      imageUrl: 'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg',
      url: '/recit/sport-sante-mentale',
      categorie: 'sante',
      datePublication: '2023-12-28',
      tempsLecture: 9,
      vues: 10234,
      likes: 712,
      tags: ['Sport', 'Santé mentale', 'Bien-être']
    },
    {
      id: 'prod-012',
      titre: 'Comprendre et apprivoiser son anxiété',
      description: 'Outils pratiques et approches thérapeutiques pour mieux gérer l\'anxiété au quotidien.',
      imageUrl: 'https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg',
      url: '/recit/comprendre-anxiete',
      categorie: 'psychologie',
      datePublication: '2023-12-25',
      tempsLecture: 12,
      vues: 18567,
      likes: 1345,
      isPopular: true,
      tags: ['Anxiété', 'Psychologie', 'Thérapie']
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
    allProductions.forEach((production) => {
      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => new Set([...prev, production.id]));
      };
      img.src = production.imageUrl;
    });
  }, []);

  // Filtrage et tri des productions
  const filteredAndSortedProductions = React.useMemo(() => {
    let filtered = allProductions.filter(production => {
      const matchesSearch = production.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           production.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           production.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategorie = selectedCategorie === 'all' || production.categorie === selectedCategorie;
      
      const matchesTags = selectedTags.length === 0 || 
                         selectedTags.some(tag => production.tags.includes(tag));
      
      return matchesSearch && matchesCategorie && matchesTags;
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
        case 'reading-time':
          return a.tempsLecture - b.tempsLecture;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedCategorie, selectedTags, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProductions.length / itemsPerPage);
  const currentProductions = filteredAndSortedProductions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategorie, selectedTags, sortBy]);

  const getCategorieColor = (categorieId: string) => {
    const categorie = categories.find(c => c.id === categorieId);
    return categorie?.couleur || '#8B5CF6';
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
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238B5CF6' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          {/* Header Content */}
          <div className={`text-center mb-16 transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
              <span className="font-inter text-violet-400 text-sm tracking-[0.2em] uppercase">
                Bibliothèque Complète
              </span>
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
            </div>
            
            <h1 className="font-montserrat font-black text-4xl md:text-5xl lg:text-6xl xl:text-7xl uppercase tracking-wider text-white mb-6 leading-[0.9]">
              Tous nos
              <br />
              <span className="gradient-text-animated">Contenus</span>
            </h1>
            
            <p className="font-inter text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
              Explorez l'intégralité de notre collection de récits, analyses et documentaires
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mt-12">
              <div className="text-center">
                <div className="font-montserrat font-bold text-3xl text-violet-400 mb-2">847</div>
                <div className="font-inter text-white/60 text-sm uppercase tracking-wider">Contenus</div>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <div className="font-montserrat font-bold text-3xl text-fuchsia-400 mb-2">10</div>
                <div className="font-inter text-white/60 text-sm uppercase tracking-wider">Univers</div>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <div className="font-montserrat font-bold text-3xl text-emerald-400 mb-2">2.1M</div>
                <div className="font-inter text-white/60 text-sm uppercase tracking-wider">Lectures</div>
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
                  className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/20 rounded-xl text-white placeholder-white/50 font-inter focus:outline-none focus:border-violet-500/50 focus:bg-black/60 transition-all duration-300 backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              
              {/* Categories Filter */}
              <div className="flex items-center gap-4 flex-wrap">
                <span className="font-inter text-white/70 text-sm font-medium">Catégories:</span>
                <div className="flex gap-2 flex-wrap">
                  {categories.slice(0, 6).map((categorie) => (
                    <button
                      key={categorie.id}
                      onClick={() => setSelectedCategorie(categorie.id)}
                      className={`
                        px-4 py-2 rounded-full font-inter font-medium text-sm transition-all duration-300 border backdrop-blur-sm
                        ${selectedCategorie === categorie.id
                          ? 'text-white scale-105 shadow-lg'
                          : 'text-white/70 bg-black/20 border-white/20 hover:bg-black/30 hover:border-white/30 hover:text-white'
                        }
                      `}
                      style={selectedCategorie === categorie.id ? {
                        backgroundColor: categorie.couleur,
                        borderColor: `${categorie.couleur}80`,
                        boxShadow: `0 8px 25px ${categorie.couleur}40`
                      } : {}}
                    >
                      {categorie.nom} ({categorie.count})
                    </button>
                  ))}
                  
                  {/* More Categories Button */}
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
                  className="px-4 py-2 bg-black/40 border border-white/20 rounded-xl text-white font-inter text-sm focus:outline-none focus:border-violet-500/50 transition-all duration-300 backdrop-blur-sm"
                >
                  <option value="recent">Plus récents</option>
                  <option value="popular">Plus populaires</option>
                  <option value="alphabetical">Alphabétique</option>
                  <option value="reading-time">Temps de lecture</option>
                </select>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-black/40 border border-white/20 rounded-xl p-1 backdrop-blur-sm">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      viewMode === 'grid' 
                        ? 'bg-violet-600 text-white' 
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      viewMode === 'list' 
                        ? 'bg-violet-600 text-white' 
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Extended Filters Panel */}
            {isFilterOpen && (
              <div className="mt-6 p-6 bg-black/40 border border-white/20 rounded-xl backdrop-blur-sm">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* All Categories */}
                  <div>
                    <h3 className="font-inter font-medium text-white mb-4">Toutes les catégories</h3>
                    <div className="flex gap-2 flex-wrap">
                      {categories.map((categorie) => (
                        <button
                          key={categorie.id}
                          onClick={() => setSelectedCategorie(categorie.id)}
                          className={`
                            px-3 py-1.5 rounded-full font-inter font-medium text-xs transition-all duration-300 border backdrop-blur-sm
                            ${selectedCategorie === categorie.id
                              ? 'text-white scale-105'
                              : 'text-white/70 bg-black/20 border-white/20 hover:bg-black/30 hover:border-white/30 hover:text-white'
                            }
                          `}
                          style={selectedCategorie === categorie.id ? {
                            backgroundColor: categorie.couleur,
                            borderColor: `${categorie.couleur}80`
                          } : {}}
                        >
                          {categorie.nom} ({categorie.count})
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
                {(selectedTags.length > 0 || selectedCategorie !== 'all') && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <button
                      onClick={() => {
                        setSelectedTags([]);
                        setSelectedCategorie('all');
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
                {filteredAndSortedProductions.length} résultat{filteredAndSortedProductions.length > 1 ? 's' : ''} trouvé{filteredAndSortedProductions.length > 1 ? 's' : ''}
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
                {currentProductions.map((production, index) => {
                  const categorieColor = getCategorieColor(production.categorie);
                  
                  return (
                    <div
                      key={production.id}
                      className={`
                        group relative overflow-hidden rounded-3xl cursor-pointer
                        h-[500px] transform transition-all duration-700 hover:scale-[1.02] hover:z-10
                        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}
                      `}
                      style={{
                        transitionDelay: `${index * 100}ms`,
                      }}
                      onMouseEnter={() => setHoveredCard(production.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      onClick={() => window.open(production.url, '_blank')}
                    >
                      {/* Image Container */}
                      <div className="absolute inset-0">
                        {loadedImages.has(production.id) ? (
                          <div
                            className="w-full h-full bg-cover bg-center transition-all duration-700 group-hover:scale-110"
                            style={{
                              backgroundImage: `url(${production.imageUrl})`,
                              filter: hoveredCard === production.id 
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

                      {/* Badges */}
                      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
                        {/* Category Badge */}
                        <div 
                          className="px-3 py-1.5 rounded-full backdrop-blur-md border transition-all duration-500"
                          style={{
                            backgroundColor: `${categorieColor}20`,
                            borderColor: `${categorieColor}40`
                          }}
                        >
                          <span 
                            className="font-inter font-bold text-xs tracking-[0.15em] uppercase"
                            style={{ color: categorieColor }}
                          >
                            {categories.find(c => c.id === production.categorie)?.nom}
                          </span>
                        </div>

                        {/* Popular/Recent Badge */}
                        {(production.isPopular || production.isRecent) && (
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500/30 to-orange-500/30 border border-amber-400/50 rounded-full backdrop-blur-md">
                            {production.isPopular && <TrendingUp className="w-3 h-3 text-amber-400" />}
                            {production.isRecent && <Calendar className="w-3 h-3 text-emerald-400" />}
                            <span className="font-inter text-amber-300 text-xs font-bold tracking-wider uppercase">
                              {production.isPopular ? 'Populaire' : 'Récent'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content Overlay */}
                      <div className="absolute inset-0 flex flex-col justify-end p-6 z-20">
                        {/* Title */}
                        <h3 className="font-montserrat font-bold text-xl text-white mb-3 leading-tight line-clamp-2">
                          {production.titre}
                        </h3>
                        
                        {/* Description */}
                        <p className="font-inter text-white/80 text-sm leading-relaxed mb-4 line-clamp-2">
                          {production.description}
                        </p>

                        {/* Meta Info */}
                        <div className="flex items-center justify-between text-white/60 text-xs mb-4">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{production.tempsLecture} min</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              <span>{formatNumber(production.vues)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              <span>{formatNumber(production.likes)}</span>
                            </div>
                          </div>
                        </div>

                        {/* CTA */}
                        <div className="flex items-center justify-between">
                          <span className="font-inter text-white/90 text-sm tracking-wide uppercase font-medium">
                            Lire l'article
                          </span>
                          <div 
                            className={`
                              w-12 h-12 rounded-full flex items-center justify-center 
                              transition-all duration-500 backdrop-blur-md border
                              ${hoveredCard === production.id 
                                ? 'scale-110 shadow-lg' 
                                : 'scale-100'
                              }
                            `}
                            style={{
                              backgroundColor: hoveredCard === production.id ? `${categorieColor}40` : `${categorieColor}20`,
                              borderColor: hoveredCard === production.id ? `${categorieColor}60` : `${categorieColor}30`
                            }}
                          >
                            <ArrowRight 
                              className={`w-5 h-5 transition-all duration-500 ${
                                hoveredCard === production.id ? 'translate-x-1' : ''
                              }`}
                              style={{ color: hoveredCard === production.id ? categorieColor : 'white' }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Hover Glow Effect */}
                      <div 
                        className={`
                          absolute inset-0 rounded-3xl transition-all duration-500 pointer-events-none
                          ${hoveredCard === production.id ? 'ring-2 shadow-2xl' : ''}
                        `}
                        style={{
                          ringColor: hoveredCard === production.id ? `${categorieColor}60` : 'transparent',
                          boxShadow: hoveredCard === production.id ? `0 25px 50px ${categorieColor}25` : 'none'
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              /* List View */
              <div className="space-y-6">
                {currentProductions.map((production, index) => {
                  const categorieColor = getCategorieColor(production.categorie);
                  
                  return (
                    <div
                      key={production.id}
                      className={`
                        group relative overflow-hidden rounded-2xl cursor-pointer bg-black/40 border border-white/10 backdrop-blur-sm
                        transform transition-all duration-700 hover:scale-[1.01] hover:bg-black/60 hover:border-white/20
                        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}
                      `}
                      style={{
                        transitionDelay: `${index * 50}ms`,
                      }}
                      onClick={() => window.open(production.url, '_blank')}
                    >
                      <div className="flex items-center p-6 gap-6">
                        {/* Image */}
                        <div className="flex-shrink-0 w-32 h-24 rounded-xl overflow-hidden">
                          {loadedImages.has(production.id) ? (
                            <div
                              className="w-full h-full bg-cover bg-center transition-all duration-500 group-hover:scale-110"
                              style={{
                                backgroundImage: `url(${production.imageUrl})`,
                                filter: 'brightness(0.8) contrast(1.1)'
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              {/* Category Badge */}
                              <div 
                                className="px-3 py-1 rounded-full"
                                style={{
                                  backgroundColor: `${categorieColor}20`,
                                  color: categorieColor
                                }}
                              >
                                <span className="font-inter font-bold text-xs tracking-wider uppercase">
                                  {categories.find(c => c.id === production.categorie)?.nom}
                                </span>
                              </div>

                              {/* Badges */}
                              {production.isPopular && (
                                <div className="flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full">
                                  <TrendingUp className="w-3 h-3" />
                                  <span className="text-xs font-bold">Populaire</span>
                                </div>
                              )}
                              {production.isRecent && (
                                <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full">
                                  <Calendar className="w-3 h-3" />
                                  <span className="text-xs font-bold">Récent</span>
                                </div>
                              )}
                            </div>

                            {/* Date */}
                            <span className="text-white/50 text-sm">
                              {formatDate(production.datePublication)}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="font-montserrat font-bold text-xl text-white mb-2 leading-tight group-hover:text-violet-400 transition-colors duration-300">
                            {production.titre}
                          </h3>

                          {/* Description */}
                          <p className="font-inter text-white/70 text-sm leading-relaxed mb-4 line-clamp-2">
                            {production.description}
                          </p>

                          {/* Meta & Tags */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6 text-white/60 text-xs">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{production.tempsLecture} min</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                <span>{formatNumber(production.vues)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="w-3 h-3" />
                                <span>{formatNumber(production.likes)}</span>
                              </div>
                            </div>

                            {/* Tags */}
                            <div className="flex items-center gap-2">
                              {production.tags.slice(0, 2).map((tag) => (
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
                          <div className="w-12 h-12 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center group-hover:bg-violet-600/40 group-hover:scale-110 transition-all duration-300">
                            <ArrowRight className="w-5 h-5 text-violet-400 group-hover:translate-x-1 transition-transform duration-300" />
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
                            ? 'bg-violet-600 text-white'
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
            {filteredAndSortedProductions.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-white/40" />
                </div>
                <h3 className="font-montserrat font-bold text-2xl text-white mb-4">
                  Aucun résultat trouvé
                </h3>
                <p className="font-inter text-white/60 text-lg mb-8">
                  Essayez de modifier vos critères de recherche ou vos filtres
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategorie('all');
                    setSelectedTags([]);
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

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default BibliothequeCompletePage;