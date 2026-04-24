// src/pages/FormatPage.tsx
// V2 — Angular editorial format page

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { sanityFetch } from '../lib/sanity';
import SiteHeader from '@/components/SiteHeader/SiteHeader';
import Footer2 from '@/components/Footer2/Footer2';
import ScrollToTopV2 from '@/components/ScrollToTop/ScrollToTopV2';
import SEO from '../components/SEO';
import s from './FormatPage.module.css';

/* ══════════════════════════════════════════════════════════
   Types
   ══════════════════════════════════════════════════════════ */

interface FormatStats {
  episodes: number;
  dureeTotal: string;
  vuesMoyennes: number;
  frequence: string;
}

interface FormatAnimateur {
  nom: string;
  bio: string;
  avatar: string;
  role: string;
}

interface FormatCredits {
  producteur: string;
  realisateur: string;
  montage: string;
  musique: string;
}

interface FormatData {
  id: string;
  name: string;
  color: string;
  tagline: string;
  description: string;
  imageHero: string;
  stats: FormatStats;
  animateur: FormatAnimateur;
  credits: FormatCredits;
}

interface Episode {
  id: string;
  titre: string;
  description?: string;
  thumbnailUrl: string;
  videoUrl: string;
  datePublication?: string;
  duree: string;
  vues?: number;
  likes?: number;
  episode: number;
  saison: number;
  isRecent: boolean;
  tags: string[];
}

interface SanityProduction {
  _id: string;
  titre: string;
  description?: string;
  imageUrl?: string;
  videoUrl?: string;
  datePublication?: string;
  duree?: number;
  vues?: number;
  likes?: number;
  slug?: { current: string };
}

/* ══════════════════════════════════════════════════════════
   Static format data
   ══════════════════════════════════════════════════════════ */

const formatsData: Record<string, FormatData> = {
  'la-lettre': {
    id: 'la-lettre',
    name: 'La Lettre',
    color: '#8B5CF6',
    tagline: 'Des conversations intimes qui transforment',
    description: 'Analyses hebdomadaires approfondies. Chaque semaine, une personnalite se livre a travers une lettre qu\'elle n\'a jamais ose ecrire.',
    imageHero: '/placeholder.svg',
    stats: {
      episodes: 24,
      dureeTotal: '12h30',
      vuesMoyennes: 15000,
      frequence: 'Hebdomadaire'
    },
    animateur: {
      nom: 'Sophie Martin',
      bio: 'Journaliste et auteure, Sophie a l\'art de creer des espaces de confiance ou les mots trouvent leur chemin.',
      avatar: '/placeholder.svg',
      role: 'Animatrice'
    },
    credits: {
      producteur: 'Origines Media',
      realisateur: 'Thomas Dubois',
      montage: 'Clara Rousseau',
      musique: 'Julien Mercier'
    }
  },
  'secrets-pro': {
    id: 'secrets-pro',
    name: 'Secrets Pro',
    color: '#EC4899',
    tagline: 'Les coulisses du succes enfin revelees',
    description: 'Coulisses des metiers et expertises. Des entrepreneurs et createurs partagent leurs echecs, leurs doutes et les vraies cles de leur reussite.',
    imageHero: '/placeholder.svg',
    stats: {
      episodes: 18,
      dureeTotal: '9h00',
      vuesMoyennes: 22000,
      frequence: 'Bi-mensuel'
    },
    animateur: {
      nom: 'Marc Lefebvre',
      bio: 'Serial entrepreneur et mentor, Marc sait poser les questions qui revelent l\'essence du parcours entrepreneurial.',
      avatar: '/placeholder.svg',
      role: 'Animateur'
    },
    credits: {
      producteur: 'Origines Media',
      realisateur: 'Emma Chen',
      montage: 'Lucas Bernard',
      musique: 'Sarah Petit'
    }
  },
  'il-etait-une-fois': {
    id: 'il-etait-une-fois',
    name: 'Il etait une fois',
    color: '#F59E0B',
    tagline: 'Quand l\'histoire personnelle rencontre l\'Histoire',
    description: 'Recits narratifs immersifs. Des recits de vie extraordinaires qui nous rappellent que chaque existence est une epopee.',
    imageHero: '/placeholder.svg',
    stats: {
      episodes: 32,
      dureeTotal: '16h00',
      vuesMoyennes: 18000,
      frequence: 'Hebdomadaire'
    },
    animateur: {
      nom: 'Louise Moreau',
      bio: 'Historienne et conteuse, Louise transforme chaque temoignage en une fresque vivante et touchante.',
      avatar: '/placeholder.svg',
      role: 'Narratrice'
    },
    credits: {
      producteur: 'Origines Media',
      realisateur: 'Antoine Durand',
      montage: 'Marie Lambert',
      musique: 'Pierre Blanc'
    }
  },
  'connexion': {
    id: 'connexion',
    name: 'Connexion',
    color: '#10B981',
    tagline: 'La ou les esprits se rencontrent',
    description: 'Rencontres inspirantes. Des dialogues profonds entre deux personnalites qui ne se seraient jamais rencontrees.',
    imageHero: '/placeholder.svg',
    stats: {
      episodes: 21,
      dureeTotal: '10h30',
      vuesMoyennes: 25000,
      frequence: 'Mensuel'
    },
    animateur: {
      nom: 'Alexandre Costa',
      bio: 'Philosophe et mediateur, Alexandre orchestre des rencontres qui transcendent les differences.',
      avatar: '/placeholder.svg',
      role: 'Mediateur'
    },
    credits: {
      producteur: 'Origines Media',
      realisateur: 'Nina Patel',
      montage: 'David Kim',
      musique: 'Lea Martin'
    }
  },
  'transmission': {
    id: 'transmission',
    name: 'Transmission',
    color: '#3B82F6',
    tagline: 'Le savoir qui se partage, la sagesse qui se transmet',
    description: 'Savoirs ancestraux et modernes. Des maitres dans leur art partagent leur expertise et leur vision.',
    imageHero: '/placeholder.svg',
    stats: {
      episodes: 15,
      dureeTotal: '7h30',
      vuesMoyennes: 20000,
      frequence: 'Bi-mensuel'
    },
    animateur: {
      nom: 'Catherine Dubois',
      bio: 'Pedagogue passionnee, Catherine sait extraire et transmettre l\'essence d\'un savoir-faire.',
      avatar: '/placeholder.svg',
      role: 'Animatrice'
    },
    credits: {
      producteur: 'Origines Media',
      realisateur: 'Philippe Roy',
      montage: 'Isabelle Mercier',
      musique: 'Francois Leblanc'
    }
  },
  'etat-esprit': {
    id: 'etat-esprit',
    name: 'Etat d\'Esprit',
    color: '#EF4444',
    tagline: 'La force mentale au service du succes',
    description: 'Mindset et philosophie de vie. Explorer les strategies mentales des plus grands performeurs.',
    imageHero: '/placeholder.svg',
    stats: {
      episodes: 19,
      dureeTotal: '9h30',
      vuesMoyennes: 16000,
      frequence: 'Bi-mensuel'
    },
    animateur: {
      nom: 'David Rousseau',
      bio: 'Coach mental et ancien sportif de haut niveau, David decrypte les mecanismes de la performance.',
      avatar: '/placeholder.svg',
      role: 'Coach'
    },
    credits: {
      producteur: 'Origines Media',
      realisateur: 'Julie Martin',
      montage: 'Alexandre Petit',
      musique: 'Sophie Bernard'
    }
  },
  'apparence': {
    id: 'apparence',
    name: 'Apparence',
    color: '#8B5CF6',
    tagline: 'L\'authenticite comme nouvelle elegance',
    description: 'Image et authenticite. Redefinir sa relation a l\'image dans un monde d\'apparences.',
    imageHero: '/placeholder.svg',
    stats: {
      episodes: 12,
      dureeTotal: '6h00',
      vuesMoyennes: 14000,
      frequence: 'Mensuel'
    },
    animateur: {
      nom: 'Clara Fontaine',
      bio: 'Styliste et philosophe de l\'image, Clara explore les liens entre apparence et essence.',
      avatar: '/placeholder.svg',
      role: 'Animatrice'
    },
    credits: {
      producteur: 'Origines Media',
      realisateur: 'Maxime Durand',
      montage: 'Emma Lambert',
      musique: 'Victor Hugo'
    }
  },
  'je-suis': {
    id: 'je-suis',
    name: 'Je Suis',
    color: '#06B6D4',
    tagline: 'Des identites qui transcendent les etiquettes',
    description: 'Identite et transformation personnelle. Portraits intimes de parcours extraordinaires.',
    imageHero: '/placeholder.svg',
    stats: {
      episodes: 15,
      dureeTotal: '7h30',
      vuesMoyennes: 17000,
      frequence: 'Bi-mensuel'
    },
    animateur: {
      nom: 'Yasmine Belkacem',
      bio: 'Documentariste et sociologue, Yasmine revele la beaute des parcours humains singuliers.',
      avatar: '/placeholder.svg',
      role: 'Documentariste'
    },
    credits: {
      producteur: 'Origines Media',
      realisateur: 'Sarah Chen',
      montage: 'Lucas Martin',
      musique: 'Nina Rousseau'
    }
  }
};

/* ══════════════════════════════════════════════════════════
   Helpers
   ══════════════════════════════════════════════════════════ */

function initials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('');
}

function formatViews(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

/* ══════════════════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════════════════ */

export default function FormatPage() {
  const { formatId } = useParams<{ formatId: string }>();
  const navigate = useNavigate();
  const [format, setFormat] = useState<FormatData | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFormatData = async () => {
      try {
        const formatData = formatsData[formatId as keyof typeof formatsData];

        if (!formatData) {
          navigate('/404');
          return;
        }

        setFormat(formatData);

        try {
          const query = `
            *[_type == "production" && formats[]->nom == $formatName] | order(datePublication desc) [0...6] {
              _id,
              titre,
              description,
              imageUrl,
              videoUrl,
              datePublication,
              duree,
              "vues": coalesce(vues, 10000),
              "likes": coalesce(likes, 500),
              slug
            }
          `;

          const productions = await sanityFetch<SanityProduction[]>(query, { formatName: formatData.name });

          if (productions && productions.length > 0) {
            const formattedEpisodes = productions.map((prod, index) => ({
              id: prod._id,
              titre: prod.titre,
              description: prod.description,
              thumbnailUrl: prod.imageUrl || '/placeholder.svg',
              videoUrl: prod.videoUrl || `/article/${prod.slug?.current}`,
              datePublication: prod.datePublication,
              duree: prod.duree ? `${prod.duree} min` : '30 min',
              vues: prod.vues,
              likes: prod.likes,
              episode: index + 1,
              saison: 1,
              isRecent: index < 2,
              tags: []
            }));

            setEpisodes(formattedEpisodes);
          } else {
            const mockEpisodes = [
              {
                id: '1',
                titre: `${formatData.name} - Episode pilote`,
                description: 'Decouvrez le premier episode de notre format exclusif qui pose les bases de cette serie unique.',
                thumbnailUrl: formatData.imageHero,
                videoUrl: `/article/${formatId}-episode-1`,
                datePublication: '2024-03-01',
                duree: '30 min',
                vues: 15000,
                likes: 1200,
                episode: 1,
                saison: 1,
                isRecent: true,
                tags: ['Decouverte', 'Introduction']
              }
            ];
            setEpisodes(mockEpisodes);
          }
        } catch {
          setEpisodes([]);
        }

        setLoading(false);
      } catch {
        setLoading(false);
      }
    };

    if (formatId) {
      loadFormatData();
    }
  }, [formatId, navigate]);

  /* ── Loading state ── */

  if (loading) {
    return (
      <div className={s.loading}>
        <span className={s.loadingText}>Chargement...</span>
      </div>
    );
  }

  /* ── Not found state ── */

  if (!format) {
    return (
      <div className={s.notFound}>
        <div className={s.notFoundInner}>
          <h1 className={s.notFoundTitle}>Format non trouve</h1>
          <button
            onClick={() => navigate('/series')}
            className={s.notFoundLink}
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" width="14" height="14">
              <path d="M13 8H3M7 4L3 8l4 4" />
            </svg>
            <span>Retour aux series</span>
          </button>
        </div>
      </div>
    );
  }

  const slug = format.id;

  return (
    <div className={s.page}>
      <SEO
        title={format.name}
        description={format.description || format.tagline}
        url={`/format/${slug}`}
        image={format.imageHero}
        breadcrumbs={[
          { name: 'Accueil', url: '/' },
          { name: 'Formats', url: '/formats' },
          { name: format.name, url: `/format/${slug}` }
        ]}
      />
      <SiteHeader />

      <main>
        {/* ── Hero ── */}
        <section className={s.hero}>
          <div className={s.heroInner}>
            <div className={s.heroContent}>
              <span className={s.heroKicker}>
                <span className={s.heroKickerDot} style={{ background: format.color }} />
                Format Origines
              </span>
              <h1 className={s.heroTitle}>{format.name}</h1>
              <p className={s.heroTagline}>{format.tagline}</p>
              <p className={s.heroDescription}>{format.description}</p>
            </div>

            <div className={s.heroStats}>
              <div className={s.heroStatCell}>
                <div className={s.heroStatValue} style={{ color: format.color }}>
                  {format.stats.episodes}
                </div>
                <div className={s.heroStatLabel}>Episodes</div>
              </div>
              <div className={s.heroStatCell}>
                <div className={s.heroStatValue} style={{ color: format.color }}>
                  {format.stats.dureeTotal}
                </div>
                <div className={s.heroStatLabel}>Duree totale</div>
              </div>
              <div className={s.heroStatCell}>
                <div className={s.heroStatValue} style={{ color: format.color }}>
                  {formatViews(format.stats.vuesMoyennes)}
                </div>
                <div className={s.heroStatLabel}>Vues moy.</div>
              </div>
              <div className={s.heroStatCell}>
                <div className={s.heroStatValue} style={{ color: format.color }}>
                  {format.stats.frequence}
                </div>
                <div className={s.heroStatLabel}>Frequence</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Episodes recents ── */}
        {episodes.length > 0 && (
          <section className={s.episodes}>
            <div className={s.inner}>
              <span className={s.sectionKicker}>
                <span className={s.sectionKickerDot} />
                Episodes
              </span>
              <h2 className={s.sectionTitle}>Episodes recents</h2>
              <div className={s.episodesGrid}>
                {episodes.map((ep) => (
                  <Link
                    key={ep.id}
                    to={ep.videoUrl}
                    className={s.episodeCard}
                  >
                    <div className={s.episodeThumb}>
                      <img
                        src={ep.thumbnailUrl}
                        alt={ep.titre}
                        loading="lazy"
                        className={s.episodeImg}
                      />
                      <span
                        className={s.episodeBadge}
                        style={{ background: format.color }}
                      >
                        Ep. {ep.episode}
                      </span>
                      <span className={s.episodeDuration}>
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                          <circle cx="8" cy="8" r="6.5" />
                          <path d="M8 4.5V8l2.5 1.5" />
                        </svg>
                        {ep.duree}
                      </span>
                    </div>
                    <div className={s.episodeBody}>
                      <h3 className={s.episodeTitle}>{ep.titre}</h3>
                      {ep.description && (
                        <p className={s.episodeDesc}>{ep.description}</p>
                      )}
                      <div className={s.episodeMeta}>
                        {ep.vues != null && (
                          <span className={s.episodeMetaItem}>
                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                              <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" />
                              <circle cx="8" cy="8" r="2" />
                            </svg>
                            {formatViews(ep.vues)}
                          </span>
                        )}
                        {ep.datePublication && (
                          <span className={s.episodeMetaItem}>
                            {new Date(ep.datePublication).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Equipe & Credits ── */}
        <section className={s.credits}>
          <div className={s.inner}>
            <span className={s.sectionKicker}>
              <span className={s.sectionKickerDot} />
              Equipe
            </span>
            <h2 className={s.sectionTitle}>Equipe &amp; Credits</h2>
            <div className={s.creditsGrid}>
              {/* Animateur */}
              <div className={s.animateurCard}>
                <div className={s.animateurLabel}>Animateur</div>
                <div
                  className={s.animateurAvatar}
                  style={{ background: format.color }}
                >
                  {initials(format.animateur.nom)}
                </div>
                <h3 className={s.animateurName}>{format.animateur.nom}</h3>
                <p className={s.animateurRole}>{format.animateur.role}</p>
                <p className={s.animateurBio}>{format.animateur.bio}</p>
              </div>

              {/* Credits */}
              <div className={s.creditsList}>
                <div className={s.creditsListTitle}>Credits</div>
                <div className={s.creditRow}>
                  <span className={s.creditLabel}>Producteur</span>
                  <span className={s.creditValue}>{format.credits.producteur}</span>
                </div>
                <div className={s.creditRow}>
                  <span className={s.creditLabel}>Realisateur</span>
                  <span className={s.creditValue}>{format.credits.realisateur}</span>
                </div>
                <div className={s.creditRow}>
                  <span className={s.creditLabel}>Montage</span>
                  <span className={s.creditValue}>{format.credits.montage}</span>
                </div>
                <div className={s.creditRow}>
                  <span className={s.creditLabel}>Musique</span>
                  <span className={s.creditValue}>{format.credits.musique}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className={s.cta}>
          <div className={s.inner}>
            <h2 className={s.ctaTitle}>Decouvrir nos series</h2>
            <p className={s.ctaDeck}>
              Explorez l&rsquo;ensemble de nos formats et trouvez les recits qui vous correspondent.
            </p>
            <Link to="/series" className={s.ctaBtn}>
              <span>Voir toutes les series</span>
              <svg
                className={s.ctaBtnArrow}
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="square"
              >
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
          </div>
        </section>
      </main>

      <Footer2 />
      <ScrollToTopV2 />
    </div>
  );
}
