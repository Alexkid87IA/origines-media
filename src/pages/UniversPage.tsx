// src/pages/UniversPage.tsx
// Page Univers connectée à Sanity - Affiche les verticales (catégories principales)

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { sanityFetch } from '../lib/sanity';
import { VERTICALES_FOR_UNIVERS_PAGE_QUERY, VERTICALE_DETAIL_QUERY } from '../lib/queries';
import { typo } from '../lib/typography';
import { getUniversColors } from '../lib/universColors';

// Types
interface Univers {
  _id: string;
  nom: string;
  slug: string;
  couleur: string;
  description: string;
}

interface Verticale {
  _id: string;
  nom: string;
  slug: string;
  couleurDominante: string;
  description: string;
  imageUrl: string;
  ordre: number;
  stats: {
    articles: number;
  };
  univers: Univers[];
}

interface Production {
  _id: string;
  titre: string;
  description: string;
  slug: string;
  imageUrl: string;
  datePublication: string;
  tempsLecture: number;
  univers?: {
    nom: string;
    slug: string;
    couleur: string;
  };
}

interface VerticaleDetail extends Verticale {
  productions: Production[];
}

// Composant pour la page de listing des verticales/univers
const UniversListPage: React.FC = () => {
  const [verticales, setVerticales] = useState<Verticale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVerticales = async () => {
      try {
        setLoading(true);
        const data = await sanityFetch<Verticale[]>(VERTICALES_FOR_UNIVERS_PAGE_QUERY);
        setVerticales(data || []);
      } catch (err) {
        setError('Impossible de charger les univers');
      } finally {
        setLoading(false);
      }
    };

    fetchVerticales();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center h-[40vh]">
          <div className="relative">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[40vh] text-center px-4">
          <p className="text-red-500 text-xs mb-3">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-1.5 bg-gray-900 text-white text-[10px] font-bold rounded-full hover:bg-gray-800 transition-colors"
          >
            Réessayer
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SEO
        title="Nos Univers"
        description={`Explorez nos ${verticales.length} univers thématiques : ${verticales.map(v => v.nom).join(', ')}.`}
        url="/univers"
      />

      <Navbar />

      <main>
        {/* Header */}
        <section className="py-4 lg:py-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <div className="h-0.5 w-10 bg-gray-900 rounded-full mb-2" />
                <h1 className="text-lg lg:text-xl font-bold text-gray-900 mb-0.5">
                  Nos Univers
                </h1>
                <p className="text-gray-500 text-xs">
                  {verticales.length} thématiques à explorer
                </p>
              </div>

              <Link
                to="/bibliotheque"
                className="group inline-flex items-center gap-1 text-gray-900 font-medium text-xs hover:text-violet-600 transition-colors"
              >
                <span>Voir la bibliothèque</span>
                <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* Univers Grid - 2 rangées de 5 */}
        <section className="py-6 lg:py-8 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {verticales.map((verticale, index) => {
                const colors = getUniversColors(verticale.nom);

                return (
                  <motion.article
                    key={verticale._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <Link to={`/univers/${verticale.slug}`} className="block h-full">
                      <div
                        className="h-full rounded-2xl overflow-hidden border border-gray-100 bg-white transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg"
                        style={{
                          boxShadow: `0 2px 15px -3px ${colors.shadow}`,
                        }}
                      >
                        {/* Image */}
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img
                            src={verticale.imageUrl}
                            alt={verticale.nom}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />

                          {/* Overlay léger */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                          {/* Badge nombre d'articles */}
                          <div className="absolute top-2 left-2">
                            <span
                              className="px-2 py-1 rounded-lg text-[9px] font-bold text-white shadow-sm"
                              style={{ backgroundColor: colors.bg }}
                            >
                              {verticale.stats.articles} récits
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-3">
                          {/* Titre avec accent coloré */}
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className="w-1 h-4 rounded-full flex-shrink-0"
                              style={{ backgroundColor: colors.bg }}
                            />
                            <h2 className="font-bold text-sm text-gray-900 leading-tight">
                              {verticale.nom}
                            </h2>
                          </div>

                          {/* Description */}
                          <p className="text-gray-500 text-[10px] leading-relaxed line-clamp-3 mb-3">
                            {verticale.description}
                          </p>

                          {/* CTA */}
                          <div
                            className="inline-flex items-center gap-1 text-[10px] font-semibold group-hover:gap-1.5 transition-all"
                            style={{ color: colors.bg }}
                          >
                            <span>Explorer</span>
                            <ArrowRight className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                );
              })}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-100">
              <span className="text-[10px] text-gray-400">
                {verticales.reduce((acc, v) => acc + v.stats.articles, 0)} récits disponibles
              </span>

              <Link
                to="/bibliotheque"
                className="inline-flex items-center px-3 py-1.5 bg-gray-900 text-white text-[10px] font-bold rounded-full hover:bg-gray-800 transition-all"
              >
                Voir la bibliothèque
                <span className="ml-1">&rarr;</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

// Composant pour la page de détail d'une verticale/univers
const UniversDetailPage: React.FC<{ universId: string }> = ({ universId }) => {
  const [verticale, setVerticale] = useState<VerticaleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allVerticales, setAllVerticales] = useState<Verticale[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [verticaleData, allData] = await Promise.all([
          sanityFetch<VerticaleDetail>(VERTICALE_DETAIL_QUERY, { slug: universId }),
          sanityFetch<Verticale[]>(VERTICALES_FOR_UNIVERS_PAGE_QUERY)
        ]);
        setVerticale(verticaleData);
        setAllVerticales(allData || []);
      } catch (err) {
        setError('Impossible de charger cet univers');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [universId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="relative">
            <div className="w-10 h-10 border-2 border-gray-200 border-t-violet-500 rounded-full animate-spin" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !verticale) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
          <p className="text-red-500 text-sm mb-4">{error || 'Univers non trouvé'}</p>
          <Link
            to="/univers"
            className="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-full hover:bg-gray-800 transition-colors"
          >
            Retour aux univers
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Récupérer les couleurs de l'univers
  const colors = getUniversColors(verticale.nom);
  const featuredProduction = verticale.productions?.[0];
  const otherProductions = verticale.productions?.slice(1) || [];
  const relatedUniverses = allVerticales.filter(v => v.slug !== verticale.slug).slice(0, 4);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SEO
        title={`Univers ${verticale.nom}`}
        description={verticale.description}
        url={`/univers/${verticale.slug}`}
      />

      <Navbar />

      <main>
        {/* Hero Section - Design Magazine Premium */}
        <section className="relative min-h-[60vh] lg:min-h-[75vh] flex items-end overflow-hidden">
          {/* Background Image avec parallax effect */}
          <div className="absolute inset-0">
            <motion.img
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              src={verticale.imageUrl}
              alt={verticale.nom}
              className="w-full h-full object-cover"
            />

            {/* Multi-layer gradient pour profondeur */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div
              className="absolute inset-0 mix-blend-multiply opacity-60"
              style={{ backgroundColor: colors.bg }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${colors.bg}40 0%, transparent 50%, ${colors.bg}20 100%)`
              }}
            />

            {/* Decorative blur shapes */}
            <div
              className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-40"
              style={{ backgroundColor: colors.bg }}
            />
            <div
              className="absolute top-1/4 -right-20 w-64 h-64 rounded-full blur-3xl opacity-30"
              style={{ backgroundColor: colors.bg }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 w-full pt-8 lg:pt-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24">
              <div className="grid lg:grid-cols-12 gap-8 items-end">
                {/* Main content */}
                <div className="lg:col-span-8">
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    {/* Back button + Category pill */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="flex items-center gap-3 mb-6"
                    >
                      <Link
                        to="/univers"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-full text-xs font-medium hover:bg-white/20 transition-all border border-white/20"
                      >
                        <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                        Retour
                      </Link>
                      <span
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-white"
                        style={{ backgroundColor: `${colors.bg}cc` }}
                      >
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        Univers
                      </span>
                    </motion.div>

                    {/* Title with accent */}
                    <div className="relative mb-6">
                      <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-[0.9] tracking-tight">
                        {verticale.nom}
                      </h1>
                      {/* Decorative line */}
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="absolute -bottom-3 left-0 h-1.5 w-24 rounded-full origin-left"
                        style={{ backgroundColor: colors.bg }}
                      />
                    </div>

                    {/* Description */}
                    <p className="text-white/90 text-lg lg:text-xl max-w-2xl leading-relaxed mb-8 font-light">
                      {verticale.description}
                    </p>

                    {/* Tags - Style glassmorphism */}
                    {verticale.univers && verticale.univers.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="flex flex-wrap gap-2 mb-8"
                      >
                        {verticale.univers.map((u, index) => (
                          <motion.span
                            key={u._id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                            className="px-4 py-2 rounded-full text-sm font-medium bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-all cursor-default"
                          >
                            {u.nom}
                          </motion.span>
                        ))}
                      </motion.div>
                    )}

                    {/* CTA Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                    >
                      <Link
                        to={`/bibliotheque?verticale=${verticale.slug}`}
                        className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-900 rounded-full text-base font-bold hover:scale-105 transition-all shadow-2xl hover:shadow-white/20"
                      >
                        <BookOpen className="w-5 h-5" />
                        Explorer les récits
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Stats card - Floating glassmorphism */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="lg:col-span-4 hidden lg:block"
                >
                  <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="text-6xl font-black mb-2 text-white">
                          {verticale.stats.articles}
                        </div>
                        <div className="text-white/70 text-sm uppercase tracking-wider font-medium">
                          Articles
                        </div>
                      </div>

                      <div className="h-px bg-white/20" />

                      {verticale.univers && verticale.univers.length > 0 && (
                        <div className="text-center">
                          <div className="text-6xl font-black mb-2 text-white">
                            {verticale.univers.length}
                          </div>
                          <div className="text-white/70 text-sm uppercase tracking-wider font-medium">
                            Thèmes
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Mobile stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="lg:hidden flex items-center gap-8 mt-8 pt-6 border-t border-white/20"
              >
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-black text-white">
                    {verticale.stats.articles}
                  </span>
                  <span className="text-white/70 text-sm">articles</span>
                </div>
                {verticale.univers && verticale.univers.length > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-black text-white">
                      {verticale.univers.length}
                    </span>
                    <span className="text-white/70 text-sm">thèmes</span>
                  </div>
                )}
              </motion.div>
            </div>
          </div>

        </section>

        {/* Featured Production - Style Article Page */}
        {featuredProduction && (
          <section className="py-10 lg:py-14 bg-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <div className="h-1 w-12 rounded-full mb-3" style={{ backgroundColor: colors.bg }} />
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
                    À la une
                  </h2>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Link to={`/article/${featuredProduction.slug}`} className="group block">
                  <div
                    className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-xl"
                  >
                    <div className="grid lg:grid-cols-2">
                      {/* Image - sans overlay, juste un fade doux vers blanc */}
                      <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[320px] overflow-hidden">
                        <img
                          src={featuredProduction.imageUrl}
                          alt={featuredProduction.titre}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Fade doux vers le contenu - uniquement sur desktop */}
                        <div className="hidden lg:block absolute inset-y-0 right-0 w-32 bg-gradient-to-r from-transparent to-gray-50" />
                      </div>

                      {/* Content - fond clair */}
                      <div className="relative p-6 lg:p-10 flex flex-col justify-center bg-gradient-to-br from-gray-50 to-white">
                        {/* Badge catégorie */}
                        {featuredProduction.univers && (
                          <span
                            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-4"
                            style={{ color: colors.bg }}
                          >
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.bg }} />
                            {featuredProduction.univers.nom}
                          </span>
                        )}

                        <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 leading-tight">
                          {typo(featuredProduction.titre)}
                        </h3>

                        <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                          {featuredProduction.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-xs">
                            {featuredProduction.tempsLecture || 5} min de lecture
                          </span>
                          <span
                            className="inline-flex items-center gap-2 text-sm font-bold group-hover:gap-3 transition-all"
                            style={{ color: colors.bg }}
                          >
                            Lire l'article
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </div>
          </section>
        )}

        {/* Productions Grid - Premium Cards avec Pagination */}
        {otherProductions.length > 0 && (() => {
          const totalPages = Math.ceil(otherProductions.length / ITEMS_PER_PAGE);
          const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
          const paginatedProductions = otherProductions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

          return (
          <section className="py-10 lg:py-14 bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
                <div>
                  <div className="h-1 w-12 rounded-full mb-3" style={{ backgroundColor: colors.bg }} />
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">
                    Tous les récits
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {otherProductions.length} articles sur {verticale.nom.toLowerCase()}
                  </p>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 mr-2">
                      Page {currentPage} / {totalPages}
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 lg:gap-5">
                {paginatedProductions.map((prod, index) => (
                  <motion.article
                    key={prod._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <Link to={`/article/${prod.slug}`} className="block">
                      <div
                        className="relative rounded-2xl overflow-hidden transition-all duration-500 group-hover:-translate-y-2"
                        style={{
                          boxShadow: `0 10px 40px -10px ${colors.shadow}`,
                        }}
                      >
                        <div className="relative aspect-[3/4] overflow-hidden">
                          <img
                            src={prod.imageUrl}
                            alt={prod.titre}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />

                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                          {/* Badge catégorie */}
                          {prod.univers && (
                            <div className="absolute top-3 left-3">
                              <span
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-bold text-white backdrop-blur-sm"
                                style={{ backgroundColor: `${colors.bg}dd` }}
                              >
                                {prod.univers.nom}
                              </span>
                            </div>
                          )}

                          {/* Content */}
                          <div className="absolute inset-x-0 bottom-0 p-4">
                            <h3 className="text-white font-bold text-sm leading-tight line-clamp-2 mb-2">
                              {typo(prod.titre)}
                            </h3>
                            <div className="flex items-center gap-2 text-white/70 text-[10px]">
                              <span>{prod.tempsLecture || 5} min</span>
                            </div>
                          </div>

                          {/* Hover effect - shine */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-3000" />
                          </div>

                          {/* Border */}
                          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 group-hover:ring-white/30 transition-all" />
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  {/* Bouton précédent */}
                  <button
                    onClick={() => {
                      setCurrentPage(p => Math.max(1, p - 1));
                      window.scrollTo({ top: 500, behavior: 'smooth' });
                    }}
                    disabled={currentPage === 1}
                    className="p-2 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                  </button>

                  {/* Numéros de pages */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => {
                          setCurrentPage(page);
                          window.scrollTo({ top: 500, behavior: 'smooth' });
                        }}
                        className={`w-9 h-9 rounded-full text-sm font-semibold transition-all ${
                          currentPage === page
                            ? 'text-white shadow-lg'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        style={{
                          backgroundColor: currentPage === page ? colors.bg : undefined,
                        }}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  {/* Bouton suivant */}
                  <button
                    onClick={() => {
                      setCurrentPage(p => Math.min(totalPages, p + 1));
                      window.scrollTo({ top: 500, behavior: 'smooth' });
                    }}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </section>
          );
        })()}

        {/* Autres Univers - Design Spectaculaire */}
        {relatedUniverses.length > 0 && (
          <section className="py-16 lg:py-24 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-100 rounded-full blur-3xl opacity-50" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-100 rounded-full blur-3xl opacity-50" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-cyan-50 via-transparent to-amber-50 rounded-full blur-3xl opacity-40" />
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              {/* Header avec style editorial */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12 lg:mb-16"
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-xs font-bold uppercase tracking-widest text-gray-600 mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                  Continuez l'exploration
                </span>
                <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black text-gray-900 mb-4">
                  D'autres univers à découvrir
                </h2>
                <p className="text-gray-500 text-base lg:text-lg max-w-xl mx-auto">
                  Chaque univers raconte une histoire unique. Lequel vous appelle ?
                </p>
              </motion.div>

              {/* Cards Grid - Premium Glassmorphism */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {relatedUniverses.map((uni, index) => {
                  const uniColors = getUniversColors(uni.nom);
                  return (
                    <motion.div
                      key={uni._id}
                      initial={{ opacity: 0, y: 30, scale: 0.95 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.15, duration: 0.5, ease: "easeOut" }}
                    >
                      <Link
                        to={`/univers/${uni.slug}`}
                        className="group block h-full"
                      >
                        <div className="relative h-full">
                          {/* Glow effect behind card */}
                          <div
                            className="absolute -inset-2 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl"
                            style={{ backgroundColor: `${uniColors.bg}40` }}
                          />

                          {/* Main card */}
                          <div
                            className="relative rounded-3xl overflow-hidden transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl h-full"
                            style={{
                              boxShadow: `0 20px 50px -15px ${uniColors.shadow}`,
                            }}
                          >
                            {/* Image */}
                            <div className="relative aspect-[4/5] overflow-hidden">
                              <img
                                src={uni.imageUrl}
                                alt={uni.nom}
                                className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                              />

                              {/* Multi-layer gradient */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                              <div
                                className="absolute inset-0 opacity-70 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-50"
                                style={{ backgroundColor: uniColors.bg }}
                              />
                              <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                style={{
                                  background: `radial-gradient(circle at 50% 100%, ${uniColors.bg}80 0%, transparent 70%)`
                                }}
                              />

                              {/* Shine effect */}
                              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-3000" />
                              </div>

                              {/* Content */}
                              <div className="absolute inset-0 flex flex-col justify-end p-6">
                                {/* Badge */}
                                <div className="mb-auto pt-2">
                                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white bg-white/20 backdrop-blur-sm border border-white/30">
                                    {uni.stats.articles} récits
                                  </span>
                                </div>

                                {/* Title & Arrow */}
                                <div className="flex items-end justify-between">
                                  <div>
                                    <h3 className="text-white font-bold text-xl lg:text-2xl leading-tight mb-2 drop-shadow-lg">
                                      {uni.nom}
                                    </h3>
                                    <div
                                      className="h-1 w-0 group-hover:w-16 rounded-full transition-all duration-500"
                                      style={{ backgroundColor: 'white' }}
                                    />
                                  </div>

                                  {/* Arrow button */}
                                  <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                                    style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                                  >
                                    <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-0.5 transition-transform" />
                                  </div>
                                </div>
                              </div>

                              {/* Border overlay */}
                              <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/20 group-hover:ring-white/40 transition-all" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Bottom CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="flex justify-center mt-12 lg:mt-16"
              >
                <Link
                  to="/univers"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-full text-base font-bold hover:bg-gray-800 transition-all hover:scale-105 shadow-xl"
                >
                  Voir tous les univers
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              </motion.div>

              {/* Decorative bottom gradient bar */}
              <div className="mt-16 lg:mt-20 h-1.5 rounded-full overflow-hidden bg-gray-100">
                <div className="h-full flex">
                  {relatedUniverses.map((uni) => {
                    const uniColors = getUniversColors(uni.nom);
                    return (
                      <div
                        key={uni._id}
                        className="flex-1 h-full"
                        style={{ backgroundColor: uniColors.bg }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

// Composant principal qui choisit entre liste et détail
const UniversPage: React.FC = () => {
  const { universId } = useParams<{ universId: string }>();

  // Si pas d'ID, on affiche la liste
  if (!universId) {
    return <UniversListPage />;
  }

  // Sinon on affiche le détail
  return <UniversDetailPage universId={universId} />;
};

export default UniversPage;
