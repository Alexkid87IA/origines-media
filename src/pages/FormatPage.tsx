// src/pages/FormatPage.tsx
// Design épuré - Style minimaliste blanc

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sanityFetch } from '../lib/sanity';
import ActeHeroFormat from '../components/formats/ActeHeroFormat';
import ActeEpisodesRecents from '../components/formats/ActeEpisodesRecents';
import ActeBibliothequeFormat from '../components/formats/ActeBibliothequeFormat';
import ActeEquipeCredits from '../components/formats/ActeEquipeCredits';
import EngagementSection from '../components/EngagementSection';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Types pour les formats
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

const formatsData: Record<string, FormatData> = {
  'la-lettre': {
    id: 'la-lettre',
    name: 'La Lettre',
    color: '#8B5CF6',
    tagline: 'Des conversations intimes qui transforment',
    description: 'Analyses hebdomadaires approfondies. Chaque semaine, une personnalité se livre à travers une lettre qu\'elle n\'a jamais osé écrire.',
    imageHero: '/placeholder.svg',
    stats: {
      episodes: 24,
      dureeTotal: '12h30',
      vuesMoyennes: 15000,
      frequence: 'Hebdomadaire'
    },
    animateur: {
      nom: 'Sophie Martin',
      bio: 'Journaliste et auteure, Sophie a l\'art de créer des espaces de confiance où les mots trouvent leur chemin.',
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
    tagline: 'Les coulisses du succès enfin révélées',
    description: 'Coulisses des métiers et expertises. Des entrepreneurs et créateurs partagent leurs échecs, leurs doutes et les vraies clés de leur réussite.',
    imageHero: '/placeholder.svg',
    stats: {
      episodes: 18,
      dureeTotal: '9h00',
      vuesMoyennes: 22000,
      frequence: 'Bi-mensuel'
    },
    animateur: {
      nom: 'Marc Lefebvre',
      bio: 'Serial entrepreneur et mentor, Marc sait poser les questions qui révèlent l\'essence du parcours entrepreneurial.',
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
    name: 'Il était une fois',
    color: '#F59E0B',
    tagline: 'Quand l\'histoire personnelle rencontre l\'Histoire',
    description: 'Récits narratifs immersifs. Des récits de vie extraordinaires qui nous rappellent que chaque existence est une épopée.',
    imageHero: '/placeholder.svg',
    stats: {
      episodes: 32,
      dureeTotal: '16h00',
      vuesMoyennes: 18000,
      frequence: 'Hebdomadaire'
    },
    animateur: {
      nom: 'Louise Moreau',
      bio: 'Historienne et conteuse, Louise transforme chaque témoignage en une fresque vivante et touchante.',
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
    tagline: 'Là où les esprits se rencontrent',
    description: 'Rencontres inspirantes. Des dialogues profonds entre deux personnalités qui ne se seraient jamais rencontrées.',
    imageHero: '/placeholder.svg',
    stats: {
      episodes: 21,
      dureeTotal: '10h30',
      vuesMoyennes: 25000,
      frequence: 'Mensuel'
    },
    animateur: {
      nom: 'Alexandre Costa',
      bio: 'Philosophe et médiateur, Alexandre orchestre des rencontres qui transcendent les différences.',
      avatar: '/placeholder.svg',
      role: 'Médiateur'
    },
    credits: {
      producteur: 'Origines Media',
      realisateur: 'Nina Patel',
      montage: 'David Kim',
      musique: 'Léa Martin'
    }
  },
  'transmission': {
    id: 'transmission',
    name: 'Transmission',
    color: '#3B82F6',
    tagline: 'Le savoir qui se partage, la sagesse qui se transmet',
    description: 'Savoirs ancestraux et modernes. Des maîtres dans leur art partagent leur expertise et leur vision.',
    imageHero: '/placeholder.svg',
    stats: {
      episodes: 15,
      dureeTotal: '7h30',
      vuesMoyennes: 20000,
      frequence: 'Bi-mensuel'
    },
    animateur: {
      nom: 'Catherine Dubois',
      bio: 'Pédagogue passionnée, Catherine sait extraire et transmettre l\'essence d\'un savoir-faire.',
      avatar: '/placeholder.svg',
      role: 'Animatrice'
    },
    credits: {
      producteur: 'Origines Media',
      realisateur: 'Philippe Roy',
      montage: 'Isabelle Mercier',
      musique: 'François Leblanc'
    }
  },
  'etat-esprit': {
    id: 'etat-esprit',
    name: 'État d\'Esprit',
    color: '#EF4444',
    tagline: 'La force mentale au service du succès',
    description: 'Mindset et philosophie de vie. Explorer les stratégies mentales des plus grands performeurs.',
    imageHero: '/placeholder.svg',
    stats: {
      episodes: 19,
      dureeTotal: '9h30',
      vuesMoyennes: 16000,
      frequence: 'Bi-mensuel'
    },
    animateur: {
      nom: 'David Rousseau',
      bio: 'Coach mental et ancien sportif de haut niveau, David décrypte les mécanismes de la performance.',
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
    tagline: 'L\'authenticité comme nouvelle élégance',
    description: 'Image et authenticité. Redéfinir sa relation à l\'image dans un monde d\'apparences.',
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
    tagline: 'Des identités qui transcendent les étiquettes',
    description: 'Identité et transformation personnelle. Portraits intimes de parcours extraordinaires.',
    imageHero: '/placeholder.svg',
    stats: {
      episodes: 15,
      dureeTotal: '7h30',
      vuesMoyennes: 17000,
      frequence: 'Bi-mensuel'
    },
    animateur: {
      nom: 'Yasmine Belkacem',
      bio: 'Documentariste et sociologue, Yasmine révèle la beauté des parcours humains singuliers.',
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

function FormatPage() {
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
                titre: `${formatData.name} - Épisode pilote`,
                description: 'Découvrez le premier épisode de notre format exclusif qui pose les bases de cette série unique.',
                thumbnailUrl: formatData.imageHero,
                videoUrl: `/article/${formatId}-episode-1`,
                datePublication: '2024-03-01',
                duree: '30 min',
                vues: 15000,
                likes: 1200,
                episode: 1,
                saison: 1,
                isRecent: true,
                tags: ['Découverte', 'Introduction']
              }
            ];
            setEpisodes(mockEpisodes);
          }
        } catch (error) {
          setEpisodes([]);
        }

        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    if (formatId) {
      loadFormatData();
    }
  }, [formatId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600 text-xl animate-pulse">Chargement...</div>
      </div>
    );
  }

  if (!format) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-gray-900 text-2xl font-bold mb-4">Format non trouvé</h1>
          <button
            onClick={() => navigate('/series')}
            className="text-violet-600 hover:text-violet-700 font-medium"
          >
            Retour aux séries
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <main>
        {/* Acte 1: Hero */}
        <ActeHeroFormat
          formatId={format.id}
          formatName={format.name}
          formatColor={format.color}
          tagline={format.tagline}
          description={format.description}
          imageHero={format.imageHero}
          stats={format.stats}
        />

        {/* Acte 2: Episodes Récents */}
        {episodes.length > 0 && (
          <ActeEpisodesRecents
            formatId={format.id}
            formatName={format.name}
            formatColor={format.color}
            episodes={episodes}
          />
        )}

        {/* Acte 3: Bibliothèque */}
        <ActeBibliothequeFormat
          formatId={format.id}
          formatName={format.name}
          formatColor={format.color}
        />

        {/* Acte 4: Équipe & Crédits */}
        <ActeEquipeCredits
          formatId={format.id}
          formatName={format.name}
          formatColor={format.color}
          animateur={format.animateur}
          credits={format.credits}
        />

        {/* Acte 5: Engagement Section */}
        <EngagementSection />
      </main>

      <Footer />
    </div>
  );
}

export default FormatPage;
