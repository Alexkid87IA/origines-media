import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Grid3X3, List, Calendar, Clock, Filter, Search, TrendingUp, Star, Play, Heart, Download, ExternalLink, Sparkles, ChevronDown, X, Eye, Award, Zap, Headphones, Video, BookOpen, Layers } from 'lucide-react';

interface ActeBibliothequeFormatProps {
  formatId: string;
  formatName: string;
  formatColor: string;
}

interface EpisodeItem {
  id: string;
  titre: string;
  description: string;
  thumbnailUrl: string;
  saison: number;
  episode: number;
  duree: string;
  datePublication: string;
  vues: number;
  rating: number;
  tags: string[];
  type: 'regular' | 'special' | 'bonus' | 'making-of';
  isLocked?: boolean;
}

const ActeBibliothequeFormat: React.FC<ActeBibliothequeFormatProps> = ({
  formatId,
  formatName,
  formatColor
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [viewMode, setViewMode] = useState<'bento' | 'list' | 'timeline'>('bento');
  const [selectedSeason, setSelectedSeason] = useState<'all' | number>('all');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  const seasons = [
    { number: 1, episodes: 12, year: 2023 },
    { number: 2, episodes: 10, year: 2024 },
    { number: 3, episodes: 8, year: 2024 }
  ];

  const allTags = ['Leadership', 'Innovation', 'Créativité', 'Stratégie', 'Mindset', 'Technologie', 'Design', 'Culture'];

  const episodes: EpisodeItem[] = [
    {
      id: 'ep1',
      titre: 'L\'art de commencer',
      description: 'Les premiers pas sont toujours les plus difficiles. Découvrez comment transformer vos idées en actions concrètes.',
      thumbnailUrl: '/placeholder.svg',
      saison: 1,
      episode: 1,
      duree: '42:16',
      datePublication: '2024-01-15',
      vues: 45230,
      rating: 4.9,
      tags: ['Leadership', 'Mindset'],
      type: 'regular'
    },
    {
      id: 'ep2',
      titre: 'Édition spéciale : Les coulisses',
      description: 'Un regard exclusif derrière la caméra sur la création de notre format.',
      thumbnailUrl: '/placeholder.svg',
      saison: 1,
      episode: 0,
      duree: '25:30',
      datePublication: '2024-01-20',
      vues: 32100,
      rating: 4.7,
      tags: ['Making-of', 'Exclusif'],
      type: 'special'
    },
    {
      id: 'ep3',
      titre: 'Innovation disruptive',
      description: 'Comment les startups changent les règles du jeu dans leurs industries.',
      thumbnailUrl: '/placeholder.svg',
      saison: 2,
      episode: 5,
      duree: '38:45',
      datePublication: '2024-02-10',
      vues: 56780,
      rating: 4.8,
      tags: ['Innovation', 'Technologie'],
      type: 'regular'
    },
    {
      id: 'ep4',
      titre: 'Bonus : Masterclass créativité',
      description: 'Session exclusive avec les plus grands créatifs de notre époque.',
      thumbnailUrl: '/placeholder.svg',
      saison: 2,
      episode: 0,
      duree: '1:15:00',
      datePublication: '2024-02-15',
      vues: 23450,
      rating: 5.0,
      tags: ['Créativité', 'Masterclass'],
      type: 'bonus',
      isLocked: true
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'special': return <Star className="w-4 h-4" />;
      case 'bonus': return <Zap className="w-4 h-4" />;
      case 'making-of': return <Video className="w-4 h-4" />;
      default: return <Play className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'special': return '#F59E0B';
      case 'bonus': return '#8B5CF6';
      case 'making-of': return '#EC4899';
      default: return formatColor;
    }
  };

  const filteredEpisodes = episodes.filter(ep => {
    const matchesSeason = selectedSeason === 'all' || ep.saison === selectedSeason;
    const matchesSearch = ep.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ep.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => ep.tags.includes(tag));
    const matchesFilter = selectedFilter === 'all' || ep.type === selectedFilter;

    return matchesSeason && matchesSearch && matchesTags && matchesFilter;
  });

  return (
    <section
      ref={sectionRef}
      className="py-24 px-8 lg:px-16 bg-white"
    >
      <div className="max-w-[1600px] mx-auto">

        {/* Section Header */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="inline-flex items-center gap-4 mb-6">
            <div
              className="w-16 h-px"
              style={{
                background: `linear-gradient(to right, transparent, ${formatColor}, transparent)`
              }}
            />
            <span
              className="font-inter text-sm tracking-[0.3em] uppercase font-medium flex items-center gap-2"
              style={{ color: formatColor }}
            >
              <Layers className="w-4 h-4" />
              Acte 3
            </span>
            <div
              className="w-16 h-px"
              style={{
                background: `linear-gradient(to right, transparent, ${formatColor}, transparent)`
              }}
            />
          </div>

          <h2 className="font-montserrat font-black text-4xl lg:text-5xl text-gray-900 mb-6">
            Bibliothèque{' '}
            <span style={{ color: formatColor }}>
              Complète
            </span>
          </h2>

          <p className="font-inter text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Explorez l'intégralité de notre collection {formatName}
          </p>
        </div>

        {/* Controls Bar */}
        <div className={`mb-12 transform transition-all duration-1000 delay-200 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">

            {/* Left Controls */}
            <div className="flex items-center gap-4 flex-wrap">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 border border-gray-200 rounded-2xl p-1">
                <button
                  onClick={() => setViewMode('bento')}
                  className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 ${
                    viewMode === 'bento'
                      ? 'text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  style={{
                    backgroundColor: viewMode === 'bento' ? formatColor : 'transparent'
                  }}
                >
                  <Grid3X3 className="w-4 h-4" />
                  <span className="text-sm font-medium">Grille</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 ${
                    viewMode === 'list'
                      ? 'text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  style={{
                    backgroundColor: viewMode === 'list' ? formatColor : 'transparent'
                  }}
                >
                  <List className="w-4 h-4" />
                  <span className="text-sm font-medium">Liste</span>
                </button>
                <button
                  onClick={() => setViewMode('timeline')}
                  className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 ${
                    viewMode === 'timeline'
                      ? 'text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  style={{
                    backgroundColor: viewMode === 'timeline' ? formatColor : 'transparent'
                  }}
                >
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">Timeline</span>
                </button>
              </div>

              {/* Season Selector */}
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="px-5 py-2.5 bg-white border border-gray-200 rounded-2xl text-gray-700 font-inter text-sm focus:outline-none focus:border-gray-400 transition-all duration-300 shadow-sm"
              >
                <option value="all">Toutes les saisons</option>
                {seasons.map(season => (
                  <option key={season.number} value={season.number}>
                    Saison {season.number} ({season.episodes} épisodes)
                  </option>
                ))}
              </select>

              {/* Filter Button */}
              <button
                onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                className={`px-5 py-2.5 border rounded-2xl flex items-center gap-2 transition-all duration-300 ${
                  isFilterPanelOpen || selectedFilter !== 'all' || selectedTags.length > 0
                    ? 'bg-gray-100 border-gray-300 text-gray-900'
                    : 'bg-white border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filtres</span>
                {(selectedFilter !== 'all' || selectedTags.length > 0) && (
                  <span
                    className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white"
                    style={{ backgroundColor: formatColor }}
                  >
                    {(selectedFilter !== 'all' ? 1 : 0) + selectedTags.length}
                  </span>
                )}
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isFilterPanelOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un épisode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-2.5 w-80 bg-white border border-gray-200 rounded-2xl text-gray-700 placeholder-gray-400 font-inter text-sm focus:outline-none focus:border-gray-400 transition-all duration-300 shadow-sm"
                />
              </div>

              {/* Download All Button */}
              <button
                className="px-5 py-2.5 border rounded-2xl flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-sm"
                style={{
                  backgroundColor: `${formatColor}10`,
                  borderColor: `${formatColor}40`,
                  color: formatColor
                }}
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Tout télécharger</span>
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {isFilterPanelOpen && (
            <div className="mt-6 p-6 bg-gray-50 border border-gray-200 rounded-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Type Filters */}
                <div>
                  <h4 className="font-inter font-medium text-gray-900 mb-4">Type de contenu</h4>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'regular', 'special', 'bonus', 'making-of'].map(type => (
                      <button
                        key={type}
                        onClick={() => setSelectedFilter(type)}
                        className={`px-4 py-2 rounded-xl font-inter text-sm transition-all duration-300 ${
                          selectedFilter === type
                            ? 'text-white'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                        style={{
                          backgroundColor: selectedFilter === type ? formatColor : undefined
                        }}
                      >
                        {type === 'all' ? 'Tous' : type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tag Filters */}
                <div>
                  <h4 className="font-inter font-medium text-gray-900 mb-4">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map(tag => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedTags(selectedTags.filter(t => t !== tag));
                            } else {
                              setSelectedTags([...selectedTags, tag]);
                            }
                          }}
                          className={`px-4 py-2 rounded-xl font-inter text-sm transition-all duration-300 ${
                            isSelected
                              ? 'text-white'
                              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                          style={{
                            backgroundColor: isSelected ? formatColor : undefined
                          }}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedFilter !== 'all' || selectedTags.length > 0) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setSelectedFilter('all');
                      setSelectedTags([]);
                    }}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-300"
                  >
                    <X className="w-4 h-4" />
                    <span className="text-sm">Effacer tous les filtres</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Episodes Grid/List/Timeline */}
        <div className={`transform transition-all duration-1000 delay-400 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          {viewMode === 'bento' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-[280px]">
              {filteredEpisodes.map((episode, index) => {
                const isSpecial = episode.type !== 'regular';
                const isLarge = index % 5 === 0;
                const typeColor = getTypeColor(episode.type);

                return (
                  <div
                    key={episode.id}
                    className={`
                      group relative overflow-hidden rounded-2xl cursor-pointer
                      transform transition-all duration-700 hover:scale-[1.02] hover:z-10
                      ${isLarge ? 'md:col-span-2 md:row-span-2' : ''}
                      ${isSpecial ? 'ring-2' : ''}
                    `}
                    style={{
                      ringColor: isSpecial ? `${typeColor}40` : undefined
                    }}
                    onMouseEnter={() => setHoveredItem(episode.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <img
                        src={episode.thumbnailUrl}
                        alt={episode.titre}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                        style={{
                          filter: hoveredItem === episode.id ? 'brightness(0.4)' : 'brightness(0.6)'
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    </div>

                    {/* Lock Overlay for Locked Content */}
                    {episode.isLocked && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex items-center justify-center">
                        <div className="text-center">
                          <Award className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                          <p className="text-white font-medium">Contenu Premium</p>
                          <p className="text-white/60 text-sm mt-1">Débloquer avec un abonnement</p>
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="relative z-20 h-full p-6 flex flex-col justify-between">
                      {/* Top Badges */}
                      <div className="flex items-start justify-between">
                        <div className="flex flex-wrap gap-2">
                          {/* Type Badge */}
                          <div
                            className="px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-2"
                            style={{
                              backgroundColor: `${typeColor}20`,
                              border: `1px solid ${typeColor}40`
                            }}
                          >
                            {getTypeIcon(episode.type)}
                            <span className="text-xs font-medium" style={{ color: typeColor }}>
                              {episode.type === 'regular' ? `S${episode.saison}:E${episode.episode}` : episode.type.toUpperCase()}
                            </span>
                          </div>

                          {/* Duration Badge */}
                          <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-white/80" />
                            <span className="text-xs font-medium text-white">{episode.duree}</span>
                          </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-1 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-full">
                          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs font-bold text-white">{episode.rating}</span>
                        </div>
                      </div>

                      {/* Bottom Content */}
                      <div>
                        {/* Title */}
                        <h3 className={`font-montserrat font-bold text-white mb-2 leading-tight ${
                          isLarge ? 'text-2xl' : 'text-lg'
                        }`}>
                          {episode.titre}
                        </h3>

                        {/* Description - Visible on larger cards or hover */}
                        {(isLarge || hoveredItem === episode.id) && (
                          <p className="font-inter text-white/80 text-sm leading-relaxed mb-4 line-clamp-3">
                            {episode.description}
                          </p>
                        )}

                        {/* Meta Info */}
                        <div className="flex items-center gap-4 text-white/60 text-xs">
                          <div className="flex items-center gap-1.5">
                            <Eye className="w-3.5 h-3.5" />
                            <span>{formatNumber(episode.vues)} vues</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{new Date(episode.datePublication).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </div>

                        {/* Tags - Visible on hover */}
                        {hoveredItem === episode.id && episode.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {episode.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-white/10 backdrop-blur-sm rounded-md text-white/80 text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Play Button on Hover */}
                        <div className={`absolute bottom-6 right-6 transition-all duration-500 ${
                          hoveredItem === episode.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                        }`}>
                          <button
                            className="w-14 h-14 rounded-full backdrop-blur-md border-2 flex items-center justify-center transform hover:scale-110 transition-transform duration-300"
                            style={{
                              backgroundColor: `${formatColor}30`,
                              borderColor: formatColor
                            }}
                          >
                            <Play className="w-6 h-6 ml-0.5" style={{ color: formatColor }} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Hover Glow Effect */}
                    <div
                      className={`absolute inset-0 rounded-2xl transition-all duration-500 pointer-events-none ${
                        hoveredItem === episode.id ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{
                        boxShadow: `inset 0 0 40px ${typeColor}20, 0 0 40px ${typeColor}15`
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {viewMode === 'list' && (
            <div className="space-y-4">
              {filteredEpisodes.map((episode) => {
                const typeColor = getTypeColor(episode.type);

                return (
                  <div
                    key={episode.id}
                    className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-500"
                    onMouseEnter={() => setHoveredItem(episode.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div className="flex items-center p-6 gap-6">
                      {/* Thumbnail */}
                      <div className="relative flex-shrink-0 w-48 h-28 rounded-xl overflow-hidden">
                        <img
                          src={episode.thumbnailUrl}
                          alt={episode.titre}
                          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        {episode.isLocked && (
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                            <Award className="w-8 h-8 text-yellow-400" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              {/* Type Badge */}
                              <div
                                className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5"
                                style={{
                                  backgroundColor: `${typeColor}15`,
                                  color: typeColor
                                }}
                              >
                                {getTypeIcon(episode.type)}
                                <span>
                                  {episode.type === 'regular' ? `S${episode.saison}:E${episode.episode}` : episode.type.toUpperCase()}
                                </span>
                              </div>

                              {/* Duration */}
                              <span className="text-gray-500 text-sm flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {episode.duree}
                              </span>

                              {/* Rating */}
                              <div className="flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                <span className="text-gray-700 text-sm font-medium">{episode.rating}</span>
                              </div>
                            </div>

                            <h3 className="font-montserrat font-bold text-xl text-gray-900 mb-2">
                              {episode.titre}
                            </h3>

                            <p className="font-inter text-gray-600 text-sm leading-relaxed line-clamp-2">
                              {episode.description}
                            </p>
                          </div>

                          {/* Play Button */}
                          <button
                            className="w-12 h-12 rounded-full border flex items-center justify-center transform hover:scale-110 transition-all duration-300 shadow-sm"
                            style={{
                              backgroundColor: `${formatColor}10`,
                              borderColor: `${formatColor}40`
                            }}
                          >
                            <Play className="w-5 h-5 ml-0.5" style={{ color: formatColor }} />
                          </button>
                        </div>

                        {/* Meta Info */}
                        <div className="flex items-center gap-6 text-gray-500 text-sm">
                          <div className="flex items-center gap-1.5">
                            <Eye className="w-4 h-4" />
                            <span>{formatNumber(episode.vues)} vues</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(episode.datePublication).toLocaleDateString('fr-FR')}</span>
                          </div>

                          {/* Tags */}
                          <div className="flex items-center gap-2">
                            {episode.tags.slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-gray-100 rounded-md text-gray-600 text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hover Accent */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-500"
                      style={{
                        backgroundColor: typeColor,
                        opacity: hoveredItem === episode.id ? 1 : 0
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {viewMode === 'timeline' && (
            <div className="relative">
              {/* Timeline Line */}
              <div
                className="absolute left-8 top-0 bottom-0 w-0.5"
                style={{ backgroundColor: `${formatColor}30` }}
              />

              {/* Timeline Items */}
              <div className="space-y-8">
                {filteredEpisodes.map((episode, index) => {
                  const typeColor = getTypeColor(episode.type);

                  return (
                    <div
                      key={episode.id}
                      className={`relative flex items-start gap-8 transform transition-all duration-700 ${
                        isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'
                      }`}
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      {/* Timeline Node */}
                      <div
                        className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: `${typeColor}15`,
                          border: `2px solid ${typeColor}`
                        }}
                      >
                        {getTypeIcon(episode.type)}
                      </div>

                      {/* Content Card */}
                      <div className="flex-1 group">
                        <div className="mb-2 text-gray-500 text-sm">
                          {new Date(episode.datePublication).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-500">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-gray-500 text-sm font-medium">
                                  {episode.type === 'regular' ? `Saison ${episode.saison}, Épisode ${episode.episode}` : episode.type.toUpperCase()}
                                </span>
                                <span className="text-gray-400">•</span>
                                <span className="text-gray-500 text-sm">{episode.duree}</span>
                              </div>
                              <h3 className="font-montserrat font-bold text-xl text-gray-900 mb-2">
                                {episode.titre}
                              </h3>
                              <p className="font-inter text-gray-600 text-sm leading-relaxed">
                                {episode.description}
                              </p>
                            </div>

                            <button
                              className="w-12 h-12 rounded-full border flex items-center justify-center transform hover:scale-110 transition-all duration-300 shadow-sm"
                              style={{
                                backgroundColor: `${formatColor}10`,
                                borderColor: `${formatColor}40`
                              }}
                            >
                              <Play className="w-5 h-5 ml-0.5" style={{ color: formatColor }} />
                            </button>
                          </div>

                          <div className="flex items-center gap-6 text-gray-500 text-sm">
                            <div className="flex items-center gap-1.5">
                              <Eye className="w-4 h-4" />
                              <span>{formatNumber(episode.vues)} vues</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span>{episode.rating}/5</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <div className={`text-center mt-16 transform transition-all duration-1000 delay-600 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <a
            href="/series"
            className="group inline-flex items-center gap-4 px-8 py-4 bg-white border border-gray-200 text-gray-700 font-inter font-medium tracking-wider uppercase text-sm transition-all duration-500 rounded-full hover:scale-105 hover:shadow-lg hover:border-gray-300"
          >
            <span>Explorer plus de formats</span>
            <ArrowRight
              className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500"
              style={{ color: formatColor }}
            />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ActeBibliothequeFormat;
