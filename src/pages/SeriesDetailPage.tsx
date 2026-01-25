// src/pages/SeriesDetailPage.tsx
// Page de détail d'une série avec hero cinématique

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Clock, ArrowLeft, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

interface Episode {
  id: string;
  numero: number;
  titre: string;
  description: string;
  duree: string;
  imageUrl: string;
  videoUrl?: string;
}

interface Serie {
  slug: string;
  titre: string;
  description: string;
  descriptionLongue: string;
  imageUrl: string;
  posterUrl: string;
  couleur: string;
  nombreEpisodes: number;
  episodes: Episode[];
}

// Données des séries (à remplacer par Sanity)
const seriesData: Serie[] = [
  {
    slug: 'il-etait-une-fois',
    titre: 'Il était une fois',
    description: 'Des destins extraordinaires racontés',
    descriptionLongue: 'Plongez dans les récits fascinants de personnalités qui ont marqué leur époque. Chaque épisode est une immersion dans un destin hors du commun, raconté avec une narration cinématographique unique.',
    imageUrl: '/series/03_il_etait_une_fois.jpg',
    posterUrl: '/series/03_il_etait_une_fois_poster.jpg',
    couleur: '#F59E0B',
    nombreEpisodes: 15,
    episodes: [
      { id: 'e1', numero: 1, titre: 'Steve Jobs et la révolution Apple', description: 'L\'histoire méconnue des premiers pas d\'Apple', duree: '28:33', imageUrl: '/placeholder.svg' },
      { id: 'e2', numero: 2, titre: 'La naissance de Netflix', description: 'Comment deux entrepreneurs ont révolutionné le divertissement', duree: '32:15', imageUrl: '/placeholder.svg' },
      { id: 'e3', numero: 3, titre: 'Coco Chanel, l\'insoumise', description: 'Le parcours d\'une femme qui a redéfini la mode', duree: '25:42', imageUrl: '/placeholder.svg' },
    ]
  },
  {
    slug: 'transmission',
    titre: 'Transmission',
    description: 'L\'héritage qui façonne nos vies',
    descriptionLongue: 'Explorer les savoirs ancestraux et modernes qui se transmettent de génération en génération. Une célébration de l\'héritage culturel et des traditions qui nous définissent.',
    imageUrl: '/series/01_transmission.jpg',
    posterUrl: '/series/01_transmission_poster.jpg',
    couleur: '#3B82F6',
    nombreEpisodes: 12,
    episodes: [
      { id: 'e1', numero: 1, titre: 'L\'art ancestral de la méditation zen', description: 'Un maître zen partage les secrets d\'une pratique millénaire', duree: '18:27', imageUrl: '/placeholder.svg' },
      { id: 'e2', numero: 2, titre: 'Les secrets du savoir-faire japonais', description: '40 ans d\'expertise dans l\'art de la céramique traditionnelle', duree: '26:15', imageUrl: '/placeholder.svg' },
    ]
  },
  {
    slug: 'etat-d-esprit',
    titre: 'État d\'esprit',
    description: 'La force du mental au quotidien',
    descriptionLongue: 'Découvrez comment les grands leaders et entrepreneurs cultivent leur mindset pour atteindre l\'excellence. Des stratégies mentales concrètes pour transformer votre quotidien.',
    imageUrl: '/series/02_etat_esprit.jpg',
    posterUrl: '/series/02_etat_esprit_poster.jpg',
    couleur: '#EF4444',
    nombreEpisodes: 8,
    episodes: [
      { id: 'e1', numero: 1, titre: 'Transformer l\'échec en opportunité', description: 'Comment utiliser ses échecs comme tremplin vers le succès', duree: '12:45', imageUrl: '/placeholder.svg' },
      { id: 'e2', numero: 2, titre: 'La mentalité des champions olympiques', description: 'Plongée dans la psychologie des athlètes de haut niveau', duree: '19:33', imageUrl: '/placeholder.svg' },
    ]
  },
  {
    slug: 'secrets-professionnels',
    titre: 'Secrets professionnels',
    description: 'Dans les coulisses des métiers',
    descriptionLongue: 'Une immersion exclusive dans les coulisses des métiers les plus fascinants. Découvrez les secrets, techniques et passions de professionnels d\'exception.',
    imageUrl: '/series/04_secrets_professionnels.jpg',
    posterUrl: '/series/04_secrets_professionnels_poster.jpg',
    couleur: '#EC4899',
    nombreEpisodes: 10,
    episodes: [
      { id: 'e1', numero: 1, titre: 'Dans les coulisses d\'un chef étoilé', description: 'Immersion exclusive dans une cuisine gastronomique', duree: '22:15', imageUrl: '/placeholder.svg' },
      { id: 'e2', numero: 2, titre: 'Dans l\'atelier d\'un maître horloger', description: 'L\'art millénaire de l\'horlogerie suisse', duree: '25:47', imageUrl: '/placeholder.svg' },
    ]
  },
  {
    slug: 'la-lettre',
    titre: 'La lettre',
    description: 'Des mots qui changent tout',
    descriptionLongue: 'Des analyses hebdomadaires approfondies sur les sujets qui façonnent notre monde. Une exploration intellectuelle des idées et tendances qui définissent notre époque.',
    imageUrl: '/series/05_la_lettre.jpg',
    posterUrl: '/series/05_la_lettre_poster.jpg',
    couleur: '#8B5CF6',
    nombreEpisodes: 6,
    episodes: [
      { id: 'e1', numero: 1, titre: 'Décryptage de l\'économie créative', description: 'Analyse des nouveaux modèles économiques', duree: '17:22', imageUrl: '/placeholder.svg' },
      { id: 'e2', numero: 2, titre: 'Les 7 habitudes des leaders exceptionnels', description: 'Les principes qui distinguent les vrais leaders', duree: '15:42', imageUrl: '/placeholder.svg' },
    ]
  },
  {
    slug: 'imagine',
    titre: 'Imagine',
    description: 'Et si tout était possible ?',
    descriptionLongue: 'Une série qui repousse les limites de l\'imagination. Explorez des futurs possibles, des idées audacieuses et des visions qui pourraient transformer notre monde.',
    imageUrl: '/series/06_imagine.jpg',
    posterUrl: '/series/06_imagine_poster.jpg',
    couleur: '#06B6D4',
    nombreEpisodes: 9,
    episodes: [
      { id: 'e1', numero: 1, titre: 'Le futur du travail', description: 'Comment travaillerons-nous dans 20 ans ?', duree: '20:15', imageUrl: '/placeholder.svg' },
      { id: 'e2', numero: 2, titre: 'Villes de demain', description: 'Les métropoles du futur', duree: '23:42', imageUrl: '/placeholder.svg' },
    ]
  },
];

const SeriesDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [serie, setSerie] = useState<Serie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement depuis Sanity
    const foundSerie = seriesData.find(s => s.slug === slug);
    setSerie(foundSerie || null);
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white/50 text-lg">Chargement...</div>
      </div>
    );
  }

  if (!serie) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center">
        <h1 className="text-white text-2xl font-bold mb-4">Série non trouvée</h1>
        <Link to="/series" className="text-white/60 hover:text-white transition-colors">
          Retour aux séries
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SEO
        title={serie.titre}
        description={serie.description}
        url={`/series/${serie.slug}`}
        image={serie.imageUrl}
        breadcrumbs={[
          { name: 'Accueil', url: '/' },
          { name: 'Séries', url: '/series' },
          { name: serie.titre, url: `/series/${serie.slug}` }
        ]}
      />

      <Navbar />

      <main>
        {/* Hero Section - Style cinématique */}
        <section className="relative min-h-[55vh] overflow-hidden bg-gray-950">
          {/* Image de fond */}
          <div className="absolute inset-0">
            <img
              src={serie.imageUrl}
              alt={`Image de couverture : ${serie.titre || 'Série'}`}
              className="w-full h-full object-cover"
            />
            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/80 to-gray-950/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent" />
          </div>

          {/* Glow coloré */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              background: `radial-gradient(ellipse at 70% 50%, ${serie.couleur}40 0%, transparent 60%)`
            }}
          />

          {/* Contenu */}
          <div className="relative max-w-6xl mx-auto px-6 pt-6 pb-16 lg:pt-8 lg:pb-20">
            {/* Retour */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                to="/series"
                className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Toutes les séries</span>
              </Link>
            </motion.div>

            <div className="grid lg:grid-cols-[1fr,auto] gap-12 items-center">
              {/* Gauche - Infos */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {/* Badge */}
                <div className="flex items-center gap-3 mb-6">
                  <span
                    className="text-sm font-bold tracking-wider"
                    style={{ color: serie.couleur }}
                  >
                    O
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                    Série Origines
                  </span>
                </div>

                {/* Titre */}
                <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
                  {serie.titre}
                </h1>

                {/* Métadonnées */}
                <div className="flex items-center gap-4 mb-6 text-sm">
                  <span className="text-white/70 font-medium">
                    {serie.nombreEpisodes} épisodes
                  </span>
                  <span className="w-1 h-1 rounded-full bg-white/30" />
                  <span className="text-white/50">Série documentaire</span>
                  <span className="w-1 h-1 rounded-full bg-white/30" />
                  <span
                    className="px-2 py-0.5 text-xs font-bold rounded"
                    style={{ backgroundColor: serie.couleur }}
                  >
                    HD
                  </span>
                </div>

                {/* Description */}
                <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-xl">
                  {serie.descriptionLongue}
                </p>

                {/* CTA */}
                <div className="flex items-center gap-4">
                  <button
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-bold rounded-lg hover:bg-white/90 transition-all"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    Regarder
                  </button>
                </div>
              </motion.div>

              {/* Droite - Affiche avec glassmorphism */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative hidden lg:block"
              >
                {/* Glow coloré derrière */}
                <div
                  className="absolute -inset-8 blur-3xl opacity-40 rounded-3xl"
                  style={{ backgroundColor: serie.couleur }}
                />

                {/* Affiche avec glassmorphism */}
                <div
                  className="relative w-[280px] rounded-xl p-[2px]"
                  style={{
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.3), rgba(255,255,255,0.05))',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
                  }}
                >
                  <div className="relative w-full rounded-[10px] overflow-hidden bg-black">
                    <img
                      src={serie.posterUrl}
                      alt={serie.titre}
                      className="w-full h-auto"
                    />

                    {/* Reflet subtil */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>

                {/* Ombre portée */}
                <div className="absolute -bottom-4 left-8 right-8 h-12 bg-black/40 blur-2xl rounded-full" />
              </motion.div>
            </div>
          </div>

        </section>

        {/* Liste des épisodes */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Tous les épisodes
            </h2>

            <div className="space-y-4">
              {serie.episodes.map((episode, index) => (
                <motion.div
                  key={episode.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div
                    className="relative rounded-2xl p-[1px] transition-all duration-300 group-hover:-translate-y-1"
                    style={{
                      background: 'linear-gradient(145deg, rgba(0,0,0,0.1), rgba(0,0,0,0.02))',
                    }}
                  >
                    <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-[15px] group-hover:bg-white transition-colors">
                      {/* Numéro */}
                      <div
                        className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
                        style={{
                          backgroundColor: `${serie.couleur}15`,
                          color: serie.couleur,
                        }}
                      >
                        {episode.numero}
                      </div>

                      {/* Thumbnail */}
                      <div className="relative flex-shrink-0 w-40 h-24 rounded-lg overflow-hidden">
                        <img
                          src={episode.imageUrl}
                          alt={episode.titre}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ backgroundColor: serie.couleur }}
                          >
                            <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                          </div>
                        </div>
                      </div>

                      {/* Infos */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">
                          {episode.titre}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {episode.description}
                        </p>
                      </div>

                      {/* Durée */}
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>{episode.duree}</span>
                      </div>

                      {/* Flèche */}
                      <div
                        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                        style={{
                          backgroundColor: `${serie.couleur}10`,
                        }}
                      >
                        <ChevronRight
                          className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5"
                          style={{ color: serie.couleur }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SeriesDetailPage;
