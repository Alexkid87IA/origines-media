// src/pages/SeriesPage.tsx
// V2 — Angular editorial series catalog

import { useState, useRef, useEffect } from 'react';
import SiteHeader from '@/components/SiteHeader/SiteHeader';
import Footer2 from '@/components/Footer2';
import ScrollToTopV2 from '@/components/ScrollToTop/ScrollToTopV2';
import SEO from '../components/SEO';
import Breadcrumb from '@/components/ui/Breadcrumb';
import s from './SeriesPage.module.css';

/* ══════════════════════════════════════════════════════════
   Types
   ══════════════════════════════════════════════════════════ */

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

/* ══════════════════════════════════════════════════════════
   Placeholder images pool
   ══════════════════════════════════════════════════════════ */

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

const getRandomImage = (index: number): string => {
  return PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length];
};

/* ══════════════════════════════════════════════════════════
   Series data
   ══════════════════════════════════════════════════════════ */

const seriesData: Serie[] = [
  {
    id: 'transmission',
    titre: 'Transmission',
    description: 'Quand les savoirs ancestraux rencontrent les innovations modernes. Une exploration des traditions qui faconnent notre present.',
    posterUrl: '/series/01_transmission_poster.jpg',
    bannerUrl: '/series/01_transmission.jpg',
    couleur: '#6366F1',
    nombreEpisodes: 15,
    nombreSaisons: 2,
    annee: '2024',
    episodes: [
      { id: 't-1', titre: 'L\'art ancestral de la meditation zen', description: 'Un maitre zen partage les secrets d\'une pratique millenaire.', thumbnailUrl: '/placeholder.svg', duree: '18:27', numeroEpisode: 1, saison: 1, datePublication: '2024-01-12', vues: 14560 },
      { id: 't-2', titre: 'Les secrets du savoir-faire japonais', description: 'Un maitre artisan transmet 40 ans d\'expertise.', thumbnailUrl: '/placeholder.svg', duree: '26:15', numeroEpisode: 2, saison: 1, datePublication: '2024-01-03', vues: 11230 },
      { id: 't-3', titre: 'L\'heritage des maitres verriers', description: 'Voyage au coeur d\'un atelier de soufflage de verre centenaire.', thumbnailUrl: '/placeholder.svg', duree: '22:45', numeroEpisode: 3, saison: 1, datePublication: '2024-02-15', vues: 9870 },
      { id: 't-4', titre: 'La voie du the', description: 'Ceremonie et philosophie autour du the japonais.', thumbnailUrl: '/placeholder.svg', duree: '19:30', numeroEpisode: 4, saison: 1, datePublication: '2024-03-01', vues: 12340 },
      { id: 't-5', titre: 'Les gardiens du savoir culinaire', description: 'Recettes familiales transmises de generation en generation.', thumbnailUrl: '/placeholder.svg', duree: '24:18', numeroEpisode: 5, saison: 1, datePublication: '2024-03-20', vues: 15680 },
    ]
  },
  {
    id: 'etat-esprit',
    titre: 'Etat d\'Esprit',
    description: 'Explorez les mindsets gagnants et les philosophies de vie qui transforment. Des conversations profondes sur la psychologie du succes.',
    posterUrl: '/series/02_etat_esprit_poster.jpg',
    bannerUrl: '/series/02_etat_esprit.jpg',
    couleur: '#0EA5E9',
    nombreEpisodes: 19,
    nombreSaisons: 2,
    annee: '2024',
    episodes: [
      { id: 'e-1', titre: 'Transformer l\'echec en opportunite', description: 'Comment les plus grands entrepreneurs utilisent leurs echecs.', thumbnailUrl: '/placeholder.svg', duree: '12:45', numeroEpisode: 1, saison: 1, datePublication: '2024-01-10', vues: 16780 },
      { id: 'e-2', titre: 'La mentalite des champions olympiques', description: 'Plongee dans la psychologie des athletes de haut niveau.', thumbnailUrl: '/placeholder.svg', duree: '19:33', numeroEpisode: 2, saison: 1, datePublication: '2024-01-01', vues: 15670 },
      { id: 'e-3', titre: 'L\'art de la resilience', description: 'Rebondir face a l\'adversite avec force et sagesse.', thumbnailUrl: '/placeholder.svg', duree: '21:15', numeroEpisode: 3, saison: 1, datePublication: '2024-02-05', vues: 18920 },
      { id: 'e-4', titre: 'Cultiver la discipline quotidienne', description: 'Les rituels des personnes hautement performantes.', thumbnailUrl: '/placeholder.svg', duree: '16:42', numeroEpisode: 4, saison: 1, datePublication: '2024-02-20', vues: 14350 },
      { id: 'e-5', titre: 'La puissance de la visualisation', description: 'Techniques mentales pour atteindre vos objectifs.', thumbnailUrl: '/placeholder.svg', duree: '14:28', numeroEpisode: 5, saison: 1, datePublication: '2024-03-10', vues: 11240 },
    ]
  },
  {
    id: 'il-etait-une-fois',
    titre: 'Il etait une fois',
    description: 'Les histoires extraordinaires qui ont marque notre epoque, racontees par ceux qui les ont vecues. Des recits captivants et inspirants.',
    posterUrl: '/series/03_il_etait_une_fois_poster.jpg',
    bannerUrl: '/series/03_il_etait_une_fois.jpg',
    couleur: '#EAB308',
    nombreEpisodes: 32,
    nombreSaisons: 3,
    annee: '2023',
    episodes: [
      { id: 'i-1', titre: 'Steve Jobs et la revolution Apple', description: 'L\'histoire meconnue des premiers pas d\'Apple.', thumbnailUrl: '/placeholder.svg', duree: '28:33', numeroEpisode: 1, saison: 1, datePublication: '2024-01-18', vues: 25670 },
      { id: 'i-2', titre: 'La naissance de Netflix', description: 'Comment deux entrepreneurs ont revolutionne le divertissement.', thumbnailUrl: '/placeholder.svg', duree: '32:15', numeroEpisode: 2, saison: 1, datePublication: '2023-12-18', vues: 28940 },
      { id: 'i-3', titre: 'L\'epopee SpaceX', description: 'De la faillite a la conquete spatiale.', thumbnailUrl: '/placeholder.svg', duree: '35:42', numeroEpisode: 3, saison: 1, datePublication: '2024-01-25', vues: 31200 },
      { id: 'i-4', titre: 'Wikipedia : l\'encyclopedie du peuple', description: 'Comment un reve utopique est devenu realite.', thumbnailUrl: '/placeholder.svg', duree: '24:18', numeroEpisode: 4, saison: 1, datePublication: '2024-02-08', vues: 19450 },
      { id: 'i-5', titre: 'Airbnb : de la colocation a l\'empire', description: 'Trois amis et une idee qui a change le voyage.', thumbnailUrl: '/placeholder.svg', duree: '27:55', numeroEpisode: 5, saison: 1, datePublication: '2024-02-22', vues: 22180 },
    ]
  },
  {
    id: 'secrets-pro',
    titre: 'Secrets professionnels',
    description: 'Immersion dans les coulisses des metiers d\'exception et des expertises rares. Decouvrez ce qui se cache derriere l\'excellence.',
    posterUrl: '/series/04_secrets_professionnels_poster.jpg',
    bannerUrl: '/series/04_secrets_professionnels.jpg',
    couleur: '#EC4899',
    nombreEpisodes: 18,
    nombreSaisons: 2,
    annee: '2024',
    episodes: [
      { id: 's-1', titre: 'Dans les coulisses d\'un chef etoile', description: 'Immersion dans la cuisine de Thomas Keller.', thumbnailUrl: '/placeholder.svg', duree: '22:15', numeroEpisode: 1, saison: 1, datePublication: '2024-01-20', vues: 12340 },
      { id: 's-2', titre: 'Dans l\'atelier d\'un maitre horloger', description: 'L\'art millenaire de l\'horlogerie suisse.', thumbnailUrl: '/placeholder.svg', duree: '25:47', numeroEpisode: 2, saison: 1, datePublication: '2023-12-20', vues: 15670 },
      { id: 's-3', titre: 'Les secrets d\'un sommelier', description: 'L\'art de la degustation et du service du vin.', thumbnailUrl: '/placeholder.svg', duree: '18:32', numeroEpisode: 3, saison: 1, datePublication: '2024-01-28', vues: 9870 },
      { id: 's-4', titre: 'Chirurgien cardiaque : 24h en bloc', description: 'Une journee aux cotes d\'un chirurgien d\'exception.', thumbnailUrl: '/placeholder.svg', duree: '31:20', numeroEpisode: 4, saison: 1, datePublication: '2024-02-12', vues: 21340 },
      { id: 's-5', titre: 'L\'oeil du directeur artistique', description: 'Dans les coulisses de la creation visuelle.', thumbnailUrl: '/placeholder.svg', duree: '20:45', numeroEpisode: 5, saison: 1, datePublication: '2024-03-05', vues: 11560 },
    ]
  },
  {
    id: 'la-lettre',
    titre: 'La Lettre',
    description: 'Chaque semaine, une analyse approfondie des tendances et idees qui faconnent notre monde. Decryptage et perspectives.',
    posterUrl: '/series/05_la_lettre_poster.jpg',
    bannerUrl: '/series/05_la_lettre.jpg',
    couleur: '#10B981',
    nombreEpisodes: 24,
    nombreSaisons: 2,
    annee: '2024',
    episodes: [
      { id: 'l-1', titre: 'Les 7 habitudes des leaders exceptionnels', description: 'Rituels et principes des vrais leaders.', thumbnailUrl: '/placeholder.svg', duree: '15:42', numeroEpisode: 1, saison: 1, datePublication: '2024-01-22', vues: 18450 },
      { id: 'l-2', titre: 'Decryptage de l\'economie creative', description: 'Analyse des nouveaux modeles economiques.', thumbnailUrl: '/placeholder.svg', duree: '17:22', numeroEpisode: 2, saison: 1, datePublication: '2023-12-22', vues: 11230 },
      { id: 'l-3', titre: 'L\'IA et l\'avenir du travail', description: 'Comment l\'intelligence artificielle transforme nos metiers.', thumbnailUrl: '/placeholder.svg', duree: '19:15', numeroEpisode: 3, saison: 1, datePublication: '2024-02-01', vues: 24560 },
      { id: 'l-4', titre: 'La revolution du bien-etre au travail', description: 'Nouvelles approches du management humain.', thumbnailUrl: '/placeholder.svg', duree: '14:48', numeroEpisode: 4, saison: 1, datePublication: '2024-02-15', vues: 13780 },
      { id: 'l-5', titre: 'Tendances 2024 : ce qui va changer', description: 'Les grandes mutations a anticiper.', thumbnailUrl: '/placeholder.svg', duree: '21:33', numeroEpisode: 5, saison: 1, datePublication: '2024-03-01', vues: 19240 },
    ]
  },
  {
    id: 'imagine',
    titre: 'Imagine',
    description: 'Et si on imaginait ensemble un monde different ? Explorations creatives et visionnaires pour reinventer demain.',
    posterUrl: '/series/06_imagine_poster.jpg',
    bannerUrl: '/series/06_imagine.jpg',
    couleur: '#8B5CF6',
    nombreEpisodes: 12,
    nombreSaisons: 1,
    annee: '2024',
    episodes: [
      { id: 'im-1', titre: 'Les villes de demain', description: 'Comment nos espaces urbains vont evoluer.', thumbnailUrl: '/placeholder.svg', duree: '23:45', numeroEpisode: 1, saison: 1, datePublication: '2024-01-15', vues: 17890 },
      { id: 'im-2', titre: 'L\'ecole du futur', description: 'Reinventer l\'education pour les generations a venir.', thumbnailUrl: '/placeholder.svg', duree: '19:22', numeroEpisode: 2, saison: 1, datePublication: '2024-01-29', vues: 14560 },
      { id: 'im-3', titre: 'Vivre sans argent', description: 'Experiences d\'economie alternative.', thumbnailUrl: '/placeholder.svg', duree: '25:18', numeroEpisode: 3, saison: 1, datePublication: '2024-02-12', vues: 21340 },
      { id: 'im-4', titre: 'La fin du travail ?', description: 'Repenser notre rapport au labeur.', thumbnailUrl: '/placeholder.svg', duree: '22:55', numeroEpisode: 4, saison: 1, datePublication: '2024-02-26', vues: 18790 },
      { id: 'im-5', titre: 'Habiter Mars', description: 'Les defis de la colonisation spatiale.', thumbnailUrl: '/placeholder.svg', duree: '28:12', numeroEpisode: 5, saison: 1, datePublication: '2024-03-11', vues: 25670 },
    ]
  }
];

/* ══════════════════════════════════════════════════════════
   SeriesRow sub-component
   ══════════════════════════════════════════════════════════ */

function SeriesRow({ serie }: { serie: Serie }) {
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
    <div id={`serie-${serie.id}`} className={s.row}>
      {/* Row header */}
      <div className={s.rowHeader}>
        <div className={s.rowAccent} style={{ background: serie.couleur }} />
        <h2 className={s.rowTitle}>{serie.titre}</h2>
        <span className={s.rowCount}>{serie.nombreEpisodes} episodes</span>
      </div>

      {/* Row scroll */}
      <div className={s.rowScroll}>
        {/* Left arrow */}
        <button
          onClick={() => scroll('left')}
          aria-label="Episodes precedents"
          className={`${s.scrollArrow} ${s.scrollArrowLeft} ${!showLeftArrow ? s.scrollArrowHidden : ''}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>

        {/* Track */}
        <div
          ref={rowRef}
          onScroll={handleScroll}
          className={s.rowTrack}
        >
          {serie.episodes.map((episode, index) => (
            <div key={episode.id} className={s.epCard}>
              {/* Thumbnail */}
              <div className={s.epThumb}>
                <img
                  src={getRandomImage(index + serie.episodes.length)}
                  alt={episode.titre}
                  loading="lazy"
                  className={s.epImg}
                />

                {/* Lock overlay */}
                <div className={s.epOverlay}>
                  <div className={s.epLockCircle}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                      <rect x="5" y="11" width="14" height="10" />
                      <path d="M8 11V7a4 4 0 018 0v4" />
                    </svg>
                  </div>
                  <span className={s.epLockLabel}>Bientot disponible</span>
                </div>

                {/* Episode badge */}
                <span
                  className={s.epBadge}
                  style={{ background: `${serie.couleur}80` }}
                >
                  Ep. {episode.numeroEpisode}
                </span>
              </div>

              {/* Info */}
              <h3 className={s.epTitle}>{episode.titre}</h3>
              <p className={s.epDesc}>{episode.description}</p>
            </div>
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll('right')}
          aria-label="Episodes suivants"
          className={`${s.scrollArrow} ${s.scrollArrowRight} ${!showRightArrow ? s.scrollArrowHidden : ''}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Main page component
   ══════════════════════════════════════════════════════════ */

export default function SeriesPage() {
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const featuredSerie = seriesData[featuredIndex];

  // Auto-rotation every 6 seconds
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
    setTimeout(() => setIsPaused(false), 10000);
  };

  const handleMoreInfo = () => {
    const targetElement = document.getElementById(`serie-${featuredSerie.id}`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={s.page}>
      <SEO
        title="Series"
        description="Decouvrez nos series documentaires originales. Des recits immersifs qui explorent des thematiques profondes a travers plusieurs episodes."
        url="/series"
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: "Séries", url: "/series" },
        ]}
      />
      <SiteHeader />

      <main>
        <div className="v2-container">
          <Breadcrumb items={[
            { name: "Accueil", url: "/" },
            { name: "Séries", url: "/series" },
          ]} />
        </div>
        {/* ── Hero Banner ── */}
        <section className={s.hero}>
          {/* Background */}
          <div className={s.heroBg}>
            <img
              src={featuredSerie.bannerUrl}
              alt={`Banniere de la serie ${featuredSerie.titre || 'en vedette'}`}
              className={s.heroBgImg}
              loading="eager"
              fetchpriority="high"
            />
            <div className={s.heroBgGradientH} />
            <div className={s.heroBgGradientV} />
          </div>

          {/* Content */}
          <div className={s.heroContent}>
            <div className={s.heroLayout}>
              {/* Left: text */}
              <div className={s.heroText}>
                {/* Badges */}
                <div className={s.heroBadges}>
                  <span
                    className={s.heroBadge}
                    style={{ background: featuredSerie.couleur }}
                  >
                    Serie Origines
                  </span>
                  <div className={s.heroMeta}>
                    <span className={s.heroMetaDot} />
                    <span>
                      {featuredSerie.nombreSaisons} saison{featuredSerie.nombreSaisons > 1 ? 's' : ''}
                    </span>
                    <span className={s.heroMetaDot} />
                    <span>{featuredSerie.nombreEpisodes} episodes</span>
                  </div>
                </div>

                <h1 className="sr-only">Séries Origines</h1>
                <h2 className={s.heroTitle}>{featuredSerie.titre}</h2>
                <p className={s.heroDesc}>{featuredSerie.description}</p>

                {/* Buttons */}
                <div className={s.heroActions}>
                  <button
                    disabled
                    aria-label="Bientot disponible"
                    className={s.heroLockBtn}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                      <rect x="5" y="11" width="14" height="10" />
                      <path d="M8 11V7a4 4 0 018 0v4" />
                    </svg>
                    <span>Bientot disponible</span>
                  </button>
                  <button
                    onClick={handleMoreInfo}
                    aria-label={`Voir les episodes de ${featuredSerie.titre}`}
                    className={s.heroInfoBtn}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4M12 8h.01" />
                    </svg>
                    <span>Plus d&rsquo;infos</span>
                  </button>
                </div>
              </div>

              {/* Right: poster (desktop) */}
              <div className={s.heroPoster}>
                <div className={s.posterFrame}>
                  <div className={s.posterAccentTop} style={{ background: `linear-gradient(to right, ${featuredSerie.couleur}, transparent)` }} />
                  <div className={s.posterAccentLeft} style={{ background: `linear-gradient(to bottom, ${featuredSerie.couleur}, transparent)` }} />
                  <div className={s.posterAccentBottom} style={{ background: `linear-gradient(to left, ${featuredSerie.couleur}, transparent)` }} />
                  <div className={s.posterAccentRight} style={{ background: `linear-gradient(to top, ${featuredSerie.couleur}, transparent)` }} />

                  <div className={s.posterImgWrap}>
                    <img
                      src={featuredSerie.posterUrl}
                      alt={featuredSerie.titre}
                      className={s.posterImg}
                    />
                    <div className={s.posterOverlay} />
                    <div className={s.posterInfo}>
                      <span
                        className={s.posterEpBadge}
                        style={{ background: `${featuredSerie.couleur}CC` }}
                      >
                        {featuredSerie.nombreEpisodes} ep.
                      </span>
                      <span className={s.posterYear}>{featuredSerie.annee}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Series selector ── */}
          <div className={s.selector}>
            <div className={s.selectorGradient} />
            <div className={s.selectorContent}>
              <div className={s.selectorInner}>
                {/* Thumbnails */}
                <div className={s.thumbRow}>
                  {seriesData.map((serie, index) => (
                    <button
                      key={serie.id}
                      onClick={() => handleSelectSerie(index)}
                      aria-label={`Voir ${serie.titre}`}
                      aria-current={index === featuredIndex ? 'true' : undefined}
                      className={`${s.thumbBtn} ${index === featuredIndex ? s.thumbBtnActive : s.thumbBtnInactive}`}
                    >
                      <div
                        className={`${s.thumbImgWrap} ${index === featuredIndex ? s.thumbImgWrapActive : s.thumbImgWrapInactive}`}
                        style={index === featuredIndex ? { borderColor: serie.couleur } : undefined}
                      >
                        <img
                          src={serie.posterUrl}
                          alt={serie.titre}
                          className={s.thumbImg}
                        />
                      </div>
                    </button>
                  ))}
                </div>

                {/* Progress bar */}
                <div className={s.progressRow} role="tablist" aria-label="Selecteur de serie">
                  {seriesData.map((serie, index) => (
                    <button
                      key={serie.id}
                      onClick={() => handleSelectSerie(index)}
                      role="tab"
                      aria-selected={index === featuredIndex}
                      aria-label={`Serie ${index + 1}: ${serie.titre}`}
                      className={`${s.progressBtn} ${index === featuredIndex ? s.progressBtnActive : ''}`}
                    >
                      {index === featuredIndex && (
                        <span
                          key={`progress-${featuredIndex}`}
                          className={s.progressFill}
                          style={{
                            background: `linear-gradient(90deg, ${serie.couleur} 0%, ${serie.couleur}CC 100%)`
                          }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Series rows ── */}
        <section className={s.rows}>
          {seriesData.map((serie) => (
            <SeriesRow key={serie.id} serie={serie} />
          ))}
        </section>
      </main>

      <Footer2 />
      <ScrollToTopV2 />
    </div>
  );
}
