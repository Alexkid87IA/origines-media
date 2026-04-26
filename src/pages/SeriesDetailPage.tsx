// src/pages/SeriesDetailPage.tsx
// V2 — Angular cinematic design

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SiteHeader from '@/components/SiteHeader/SiteHeader';
import Footer2 from '@/components/Footer2';
import ScrollToTopV2 from '@/components/ScrollToTop/ScrollToTopV2';
import SEO from '../components/SEO';
import s from './SeriesDetailPage.module.css';

/* ── Types ── */

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

/* ── Inline SVG icons ── */

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="6,3 20,12 6,21" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

/* ── Static data (to be replaced by Sanity) ── */

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

/* ── Component ── */

export default function SeriesDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [serie, setSerie] = useState<Serie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement depuis Sanity
    const foundSerie = seriesData.find(s => s.slug === slug);
    setSerie(foundSerie || null);
    setLoading(false);
  }, [slug]);

  /* ── Loading state ── */

  if (loading) {
    return (
      <div className={s.loadingWrap}>
        <div className={s.loadingText}>Chargement...</div>
      </div>
    );
  }

  /* ── Not found state ── */

  if (!serie) {
    return (
      <div className={s.notFoundWrap}>
        <h1 className={s.notFoundTitle}>Série non trouvée</h1>
        <Link to="/series" className={s.notFoundLink}>
          Retour aux séries
        </Link>
      </div>
    );
  }

  /* ── Main render ── */

  return (
    <div className={s.page}>
      <SEO
        title={serie.titre}
        description={serie.description}
        url={`/series/${serie.slug}`}
        image={serie.imageUrl}
        breadcrumbs={[
          { name: 'Accueil', url: '/' },
          { name: 'Séries', url: '/series' },
          { name: serie.titre, url: `/series/${serie.slug}` },
        ]}
      />

      <SiteHeader />

      <main>
        {/* ══ Hero — cinematic ══ */}
        <section className={s.hero}>
          {/* Background image */}
          <div className={s.heroBg}>
            <img
              src={serie.imageUrl}
              alt={`Image de couverture : ${serie.titre || 'Série'}`}
              className={s.heroBgImg}
            />
            <div className={s.heroOverlayH} />
            <div className={s.heroOverlayV} />
          </div>

          {/* Content */}
          <div className={s.heroContent}>
            {/* Back link */}
            <Link to="/series" className={s.backLink}>
              <ArrowLeftIcon className={s.backLinkIcon} />
              <span>Toutes les séries</span>
            </Link>

            <div className={s.heroGrid}>
              {/* Left — info */}
              <div>
                {/* Kicker */}
                <div className={s.heroKicker}>
                  <span
                    className={s.heroKickerMark}
                    style={{ color: serie.couleur }}
                  >
                    O
                  </span>
                  <span className={s.heroKickerLabel}>Série Origines</span>
                </div>

                {/* Title */}
                <h1 className={s.heroTitle}>{serie.titre}</h1>

                {/* Meta */}
                <div className={s.heroMeta}>
                  <span className={s.heroMetaCount}>
                    {serie.nombreEpisodes} épisodes
                  </span>
                  <span className={s.heroMetaDot} />
                  <span className={s.heroMetaType}>Série documentaire</span>
                  <span className={s.heroMetaDot} />
                  <span
                    className={s.heroMetaBadge}
                    style={{ backgroundColor: serie.couleur }}
                  >
                    HD
                  </span>
                </div>

                {/* Description */}
                <p className={s.heroDesc}>{serie.descriptionLongue}</p>

                {/* CTA */}
                <button className={s.heroCta}>
                  <PlayIcon className={s.heroCtaIcon} />
                  Regarder
                </button>
              </div>

              {/* Right — poster */}
              <div className={s.posterWrap}>
                <div className={s.posterFrame}>
                  <img
                    src={serie.posterUrl}
                    alt={serie.titre}
                    className={s.posterImg}
                  />
                </div>
                <div className={s.posterShadow} />
              </div>
            </div>
          </div>
        </section>

        {/* ══ Episodes list ══ */}
        <section className={s.episodes}>
          <div className={s.inner}>
            <h2 className={s.episodesTitle}>Tous les épisodes</h2>

            <div className={s.episodesList}>
              {serie.episodes.map((episode) => (
                <div key={episode.id} className={s.episodeCard}>
                  {/* Number */}
                  <div
                    className={s.episodeNum}
                    style={{
                      backgroundColor: `${serie.couleur}15`,
                      color: serie.couleur,
                    }}
                  >
                    {episode.numero}
                  </div>

                  {/* Thumbnail */}
                  <div className={s.episodeThumb}>
                    <img
                      src={episode.imageUrl}
                      alt={episode.titre}
                      className={s.episodeThumbImg}
                    />
                    <div className={s.episodeThumbOverlay}>
                      <div
                        className={s.episodePlayBtn}
                        style={{ backgroundColor: serie.couleur }}
                      >
                        <PlayIcon className={s.episodePlayIcon} />
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className={s.episodeInfo}>
                    <h3 className={s.episodeInfoTitle}>{episode.titre}</h3>
                    <p className={s.episodeInfoDesc}>{episode.description}</p>
                  </div>

                  {/* Duration */}
                  <div className={s.episodeDuration}>
                    <ClockIcon className={s.episodeDurationIcon} />
                    <span>{episode.duree}</span>
                  </div>

                  {/* Arrow */}
                  <div
                    className={s.episodeArrow}
                    style={{ color: serie.couleur }}
                  >
                    <ChevronRightIcon className={s.episodeArrowIcon} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer2 />
      <ScrollToTopV2 />
    </div>
  );
}
