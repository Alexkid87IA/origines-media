// src/pages/HomePage.tsx
// Design épuré - Style minimaliste blanc

import React, { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import SeriesSection from '../components/SeriesSection';
import RecentProductionsSection from '../components/RecentProductionsSection';
import VideosSection from '../components/VideosSection';
import RecommandationsSection from '../components/RecommandationsSection';
import HistoiresSection from '../components/HistoiresSection';
import EngagementSection from '../components/EngagementSection';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { sanityFetch } from '../lib/sanity';
import {
  FEATURED_ARTICLES_QUERY,
  SERIES_QUERY,
  VERTICALES_WITH_PRODUCTIONS_QUERY
} from '../lib/queries';

interface SanityVerticaleWithArticle {
  _id: string;
  nom: string;
  couleurDominante?: string;
  slug?: string;
  article?: {
    _id: string;
    titre: string;
    extrait?: string;
    description?: string;
    contenuTexte?: string;
    typeArticle?: string;
    imageUrl?: string;
    slug?: string;
    datePublication?: string;
    tempsLecture?: number;
  };
}

// Helper: récupère l'extrait avec fallback
const getExtrait = (article: SanityVerticaleWithArticle['article']): string => {
  if (!article) return '';
  // Priorité: extrait > description > contenuTexte (200 premiers caractères)
  if (article.extrait) return article.extrait;
  if (article.description) return article.description;
  if (article.contenuTexte) {
    const text = article.contenuTexte.substring(0, 200);
    return text.length === 200 ? text + '...' : text;
  }
  return '';
};

interface SanityVerticaleRaw {
  _id: string;
  nom: string;
  couleurDominante?: string;
  description?: string;
  imageUrl?: string;
  productions?: Array<{
    _id: string;
    titre: string;
    extrait?: string;
    description?: string;
    contenuTexte?: string;
    imageUrl?: string;
    slug?: string;
  }>;
}

function HomePage() {
  const [featuredArticles, setFeaturedArticles] = useState<any[]>([]);
  const [series, setSeries] = useState<any[]>([]);
  const [verticales, setVerticales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured articles for hero (1 per verticale)
        const verticalesData = await sanityFetch(FEATURED_ARTICLES_QUERY) as SanityVerticaleWithArticle[];
        // Filter out verticales without articles and map to hero format
        const articlesWithVerticale = verticalesData
          .filter((v) => v.article && v.article.titre && v.article.imageUrl)
          .map((v, index: number) => ({
            id: index + 1,
            titre: v.article!.titre,
            categorie: v.nom,
            accroche: getExtrait(v.article),
            imageUrl: v.article!.imageUrl || "/placeholder.svg",
            url: `/article/${v.article!.slug || 'default'}`
          }));
        setFeaturedArticles(articlesWithVerticale);

        // Fetch series
        try {
          const seriesData = await sanityFetch(SERIES_QUERY);
          if (seriesData && seriesData.length > 0) {
            setSeries(seriesData);
          } else {
            setSeries(getFallbackSeries());
          }
        } catch (e) {
          // Silent fail - use fallback
          setSeries(getFallbackSeries());
        }

        try {
          const verticalesData = await sanityFetch(VERTICALES_WITH_PRODUCTIONS_QUERY);

          if (verticalesData && verticalesData.length > 0) {
            const verticalesFormatted = (verticalesData as SanityVerticaleRaw[]).map((v) => ({
              verticale: {
                id: v._id,
                nom: v.nom,
                couleurDominante: v.couleurDominante || '#6366F1',
                description: v.description,
                imageUrl: v.imageUrl
              },
              productions: v.productions?.map((p) => ({
                id: p._id,
                titre: p.titre,
                extrait: p.extrait,
                description: p.description,
                contenuTexte: p.contenuTexte,
                imageUrl: p.imageUrl || "/placeholder.svg",
                url: `/article/${p.slug || 'default'}`
              })) || []
            }));
            setVerticales(verticalesFormatted);
          } else {
            throw new Error('Aucune verticale trouvée');
          }
        } catch {
          setVerticales(getFallbackVerticales());
        }

        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-400 text-lg">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      <SEO
        title="Accueil"
        description="Origines Media - Des récits qui inspirent, transforment et éclairent. Découvrez nos histoires."
        url="/"
      />

      <Navbar />

      <main>
        <HeroSection portraits={featuredArticles} />
        <VideosSection />
        <RecentProductionsSection verticales={verticales} />
        <SeriesSection series={series} />
        <HistoiresSection />
        <RecommandationsSection />
        <EngagementSection />
      </main>

      <Footer />
    </div>
  );
}

function getFallbackSeries() {
  return [
    {
      _id: 's1',
      titre: 'Transmission',
      description: 'L\'héritage qui façonne nos vies',
      imageUrl: '/series/01_transmission.jpg',
      posterUrl: '/series/01_transmission_poster.jpg',
      slug: { current: 'transmission' },
      nombreEpisodes: 12
    },
    {
      _id: 's2',
      titre: 'État d\'esprit',
      description: 'La force du mental au quotidien',
      imageUrl: '/series/02_etat_esprit.jpg',
      posterUrl: '/series/02_etat_esprit_poster.jpg',
      slug: { current: 'etat-d-esprit' },
      nombreEpisodes: 8
    },
    {
      _id: 's3',
      titre: 'Il était une fois',
      description: 'Des destins extraordinaires racontés',
      imageUrl: '/series/03_il_etait_une_fois.jpg',
      posterUrl: '/series/03_il_etait_une_fois_poster.jpg',
      slug: { current: 'il-etait-une-fois' },
      nombreEpisodes: 15
    },
    {
      _id: 's4',
      titre: 'Secrets professionnels',
      description: 'Dans les coulisses des métiers',
      imageUrl: '/series/04_secrets_professionnels.jpg',
      posterUrl: '/series/04_secrets_professionnels_poster.jpg',
      slug: { current: 'secrets-professionnels' },
      nombreEpisodes: 10
    },
    {
      _id: 's5',
      titre: 'La lettre',
      description: 'Des mots qui changent tout',
      imageUrl: '/series/05_la_lettre.jpg',
      posterUrl: '/series/05_la_lettre_poster.jpg',
      slug: { current: 'la-lettre' },
      nombreEpisodes: 6
    },
    {
      _id: 's6',
      titre: 'Imagine',
      description: 'Et si tout était possible ?',
      imageUrl: '/series/06_imagine.jpg',
      posterUrl: '/series/06_imagine_poster.jpg',
      slug: { current: 'imagine' },
      nombreEpisodes: 9
    }
  ];
}

function getFallbackVerticales() {
  return [
    {
      verticale: { id: "1", nom: "Psychologie", couleurDominante: "#6366F1" },
      productions: [
        { id: "p-04", titre: "L'esprit humain", description: "Explorez les mystères de l'esprit", imageUrl: "/placeholder.svg", url: "/article/esprit" },
        { id: "p-05", titre: "Comportements", description: "Comprendre nos actions", imageUrl: "/placeholder.svg", url: "/article/comportements" },
      ]
    },
    {
      verticale: { id: "2", nom: "Société", couleurDominante: "#F59E0B" },
      productions: [
        { id: "p-07", titre: "Vivre ensemble", description: "Les liens qui nous unissent", imageUrl: "/placeholder.svg", url: "/article/ensemble" },
      ]
    },
    {
      verticale: { id: "3", nom: "Carrière", couleurDominante: "#1F2937" },
      productions: [
        { id: "p-10", titre: "Leadership", description: "L'art de guider", imageUrl: "/placeholder.svg", url: "/article/leadership" },
      ]
    },
    {
      verticale: { id: "4", nom: "Art & Créativité", couleurDominante: "#8B5CF6" },
      productions: [
        { id: "p-16", titre: "Créateurs", description: "Portraits d'artistes", imageUrl: "/placeholder.svg", url: "/article/createurs" },
      ]
    },
    {
      verticale: { id: "5", nom: "Spiritualité", couleurDominante: "#A855F7" },
      productions: [
        { id: "p-19", titre: "Méditation", description: "Le chemin intérieur", imageUrl: "/placeholder.svg", url: "/article/meditation" },
      ]
    }
  ];
}

export default HomePage;
