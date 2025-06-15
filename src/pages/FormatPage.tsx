import React from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import EngagementSection from '../components/EngagementSection';
import ActeHeroFormat from '../components/formats/ActeHeroFormat';
import ActeEpisodesRecents from '../components/formats/ActeEpisodesRecents';
import ActeBibliothequeFormat from '../components/formats/ActeBibliothequeFormat';
import ActeEquipeCredits from '../components/formats/ActeEquipeCredits';

interface Episode {
  id: string;
  titre: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  datePublication: string;
  duree: string;
  vues: number;
  likes: number;
  episode?: number;
  saison?: number;
  isPopular?: boolean;
  isRecent?: boolean;
  tags: string[];
}

interface FormatData {
  id: string;
  nom: string;
  couleur: string;
  description: string;
  tagline: string;
  imageHero: string;
  stats: {
    episodes: number;
    dureeTotal: string;
    vuesMoyennes: number;
    frequence: string;
  };
  animateur: {
    nom: string;
    bio: string;
    avatar: string;
    role: string;
  };
  credits: {
    producteur?: string;
    realisateur?: string;
    montage?: string;
    musique?: string;
  };
  episodes: Episode[];
}

const FormatPage: React.FC = () => {
  const { formatId } = useParams<{ formatId: string }>();

  // ✅ DONNÉES COMPLÈTES pour tous les 8 formats
  const formatsData: { [key: string]: FormatData } = {
    'la-lettre': {
      id: 'la-lettre',
      nom: 'La Lettre',
      couleur: '#8B5CF6',
      description: 'Analyses hebdomadaires approfondies des tendances qui façonnent notre époque',
      tagline: 'L\'analyse qui va plus loin',
      imageHero: 'https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg',
      stats: {
        episodes: 24,
        dureeTotal: '6h 30min',
        vuesMoyennes: 15400,
        frequence: 'Hebdomadaire'
      },
      animateur: {
        nom: 'Marie Dubois',
        bio: 'Journaliste et analyste, Marie décrypte les tendances sociétales avec une approche unique mêlant données et intuition.',
        avatar: 'https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg',
        role: 'Analyste en chef'
      },
      credits: {
        producteur: 'Origines Media',
        realisateur: 'Thomas Martin',
        montage: 'Sophie Chen',
        musique: 'Julien Rousseau'
      },
      episodes: [
        {
          id: 'lettre-001',
          titre: 'Les 7 habitudes des leaders exceptionnels',
          description: 'Découvrez les rituels quotidiens et les principes fondamentaux qui distinguent les vrais leaders.',
          thumbnailUrl: 'https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg',
          videoUrl: '/video/7-habitudes-leaders',
          datePublication: '2024-01-22',
          duree: '15:42',
          vues: 18450,
          likes: 1203,
          episode: 12,
          saison: 2,
          isPopular: true,
          isRecent: true,
          tags: ['Leadership', 'Habitudes', 'Excellence']
        },
        {
          id: 'lettre-002',
          titre: 'Décryptage de l\'économie créative',
          description: 'Analyse approfondie des nouveaux modèles économiques dans les industries créatives.',
          thumbnailUrl: 'https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg',
          videoUrl: '/video/economie-creative-analyse',
          datePublication: '2023-12-22',
          duree: '17:22',
          vues: 11230,
          likes: 834,
          episode: 11,
          saison: 2,
          tags: ['Économie', 'Créativité', 'Innovation']
        }
      ]
    },
    'secrets-pro': {
      id: 'secrets-pro',
      nom: 'Secrets Pro',
      couleur: '#EC4899',
      description: 'Plongée exclusive dans les coulisses des métiers et l\'expertise de professionnels d\'exception',
      tagline: 'Les coulisses de l\'excellence',
      imageHero: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
      stats: {
        episodes: 18,
        dureeTotal: '8h 15min',
        vuesMoyennes: 12800,
        frequence: 'Bi-mensuel'
      },
      animateur: {
        nom: 'Thomas Martin',
        bio: 'Réalisateur passionné par l\'artisanat et l\'excellence, Thomas révèle les secrets des maîtres de leur art.',
        avatar: 'https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg',
        role: 'Réalisateur'
      },
      credits: {
        producteur: 'Origines Media',
        realisateur: 'Thomas Martin',
        montage: 'Marie Dubois'
      },
      episodes: [
        {
          id: 'secrets-001',
          titre: 'Dans les coulisses d\'un chef étoilé',
          description: 'Immersion exclusive dans la cuisine de Thomas Keller pour comprendre l\'obsession de la perfection.',
          thumbnailUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
          videoUrl: '/video/coulisses-chef-etoile',
          datePublication: '2024-01-20',
          duree: '22:15',
          vues: 12340,
          likes: 892,
          episode: 8,
          saison: 1,
          isPopular: true,
          tags: ['Gastronomie', 'Excellence', 'Passion']
        }
      ]
    },
    'il-etait-une-fois': {
      id: 'il-etait-une-fois',
      nom: 'Il était une fois',
      couleur: '#F59E0B',
      description: 'Récits narratifs immersifs qui racontent les histoires extraordinaires qui ont marqué notre époque',
      tagline: 'Les histoires qui ont tout changé',
      imageHero: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
      stats: {
        episodes: 32,
        dureeTotal: '16h 45min',
        vuesMoyennes: 22100,
        frequence: 'Mensuel'
      },
      animateur: {
        nom: 'Sophie Chen',
        bio: 'Storyteller née, Sophie transforme les faits en récits captivants qui révèlent la magie du réel.',
        avatar: 'https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg',
        role: 'Narratrice'
      },
      credits: {
        producteur: 'Origines Media',
        realisateur: 'Sophie Chen',
        montage: 'Thomas Martin',
        musique: 'Julien Rousseau'
      },
      episodes: [
        {
          id: 'histoire-001',
          titre: 'Steve Jobs et la révolution Apple',
          description: 'L\'histoire méconnue des premiers pas d\'Apple, racontée par ceux qui ont vécu cette aventure.',
          thumbnailUrl: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
          videoUrl: '/video/steve-jobs-apple',
          datePublication: '2024-01-18',
          duree: '28:33',
          vues: 25670,
          likes: 1876,
          episode: 5,
          saison: 3,
          isPopular: true,
          tags: ['Innovation', 'Entrepreneuriat', 'Technologie']
        }
      ]
    },
    'connexion': {
      id: 'connexion',
      nom: 'Connexion',
      couleur: '#10B981',
      description: 'Rencontres inspirantes avec des personnalités qui transforment notre vision du monde',
      tagline: 'Les conversations qui inspirent',
      imageHero: 'https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg',
      stats: {
        episodes: 21,
        dureeTotal: '18h 30min',
        vuesMoyennes: 19200,
        frequence: 'Bi-mensuel'
      },
      animateur: {
        nom: 'Julien Rousseau',
        bio: 'Journaliste et philosophe, Julien crée des espaces de dialogue authentique avec les esprits les plus brillants.',
        avatar: 'https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg',
        role: 'Animateur'
      },
      credits: {
        producteur: 'Origines Media',
        realisateur: 'Marie Dubois'
      },
      episodes: [
        {
          id: 'connexion-001',
          titre: 'Connexion avec Yuval Noah Harari',
          description: 'Une conversation profonde avec l\'historien sur l\'avenir de l\'humanité et les défis du 21ème siècle.',
          thumbnailUrl: 'https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg',
          videoUrl: '/video/yuval-harari-connexion',
          datePublication: '2024-01-15',
          duree: '45:12',
          vues: 31200,
          likes: 2134,
          episode: 15,
          saison: 2,
          isPopular: true,
          tags: ['Philosophie', 'Futur', 'Société']
        }
      ]
    },
    'transmission': {
      id: 'transmission',
      nom: 'Transmission',
      couleur: '#3B82F6',
      description: 'Savoirs ancestraux et modernes transmis par les maîtres de leur discipline',
      tagline: 'La sagesse qui traverse les âges',
      imageHero: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg',
      stats: {
        episodes: 15,
        dureeTotal: '12h 20min',
        vuesMoyennes: 13500,
        frequence: 'Mensuel'
      },
      animateur: {
        nom: 'Maître Chen',
        bio: 'Gardien des traditions et passeur de savoirs, Maître Chen révèle les enseignements millénaires.',
        avatar: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg',
        role: 'Maître transmetteur'
      },
      credits: {
        producteur: 'Origines Media',
        realisateur: 'Thomas Martin'
      },
      episodes: [
        {
          id: 'transmission-001',
          titre: 'L\'art ancestral de la méditation zen',
          description: 'Transmission millénaire : un maître zen partage les secrets d\'une pratique qui transforme l\'esprit.',
          thumbnailUrl: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg',
          videoUrl: '/video/meditation-zen-transmission',
          datePublication: '2024-01-12',
          duree: '18:27',
          vues: 14560,
          likes: 1045,
          episode: 3,
          saison: 1,
          tags: ['Méditation', 'Spiritualité', 'Tradition']
        }
      ]
    },
    'etat-esprit': {
      id: 'etat-esprit',
      nom: 'État d\'Esprit',
      couleur: '#EF4444',
      description: 'Mindset et philosophie de vie pour développer une mentalité de champion',
      tagline: 'Transformer sa vision du monde',
      imageHero: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg',
      stats: {
        episodes: 19,
        dureeTotal: '9h 45min',
        vuesMoyennes: 16800,
        frequence: 'Hebdomadaire'
      },
      animateur: {
        nom: 'Dr. Sarah Wilson',
        bio: 'Psychologue du sport et coach mental, Sarah révèle les secrets de la performance mentale.',
        avatar: 'https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg',
        role: 'Coach mental'
      },
      credits: {
        producteur: 'Origines Media',
        realisateur: 'Sophie Chen'
      },
      episodes: [
        {
          id: 'mindset-001',
          titre: 'Transformer l\'échec en opportunité',
          description: 'Comment les plus grands entrepreneurs utilisent leurs échecs comme tremplin vers le succès.',
          thumbnailUrl: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg',
          videoUrl: '/video/echec-opportunite-mindset',
          datePublication: '2024-01-10',
          duree: '12:45',
          vues: 16780,
          likes: 1234,
          episode: 7,
          saison: 1,
          isRecent: true,
          tags: ['Mindset', 'Résilience', 'Entrepreneuriat']
        }
      ]
    },
    'apparence': {
      id: 'apparence',
      nom: 'Apparence',
      couleur: '#8B5CF6',
      description: 'Image et authenticité : redéfinir sa relation à l\'apparence dans un monde d\'images',
      tagline: 'L\'authenticité comme force',
      imageHero: 'https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg',
      stats: {
        episodes: 12,
        dureeTotal: '6h 15min',
        vuesMoyennes: 11200,
        frequence: 'Mensuel'
      },
      animateur: {
        nom: 'Emma Rodriguez',
        bio: 'Sociologue et experte en image, Emma déconstruit les codes de beauté pour révéler l\'authenticité.',
        avatar: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg',
        role: 'Sociologue'
      },
      credits: {
        producteur: 'Origines Media',
        realisateur: 'Marie Dubois'
      },
      episodes: [
        {
          id: 'apparence-001',
          titre: 'L\'authenticité comme force',
          description: 'Pourquoi être soi-même est la stratégie la plus puissante dans un monde d\'apparences.',
          thumbnailUrl: 'https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg',
          videoUrl: '/video/authenticite-apparence',
          datePublication: '2024-01-08',
          duree: '14:18',
          vues: 9876,
          likes: 723,
          episode: 4,
          saison: 1,
          tags: ['Authenticité', 'Image', 'Confiance']
        }
      ]
    },
    'je-suis': {
      id: 'je-suis',
      nom: 'Je Suis',
      couleur: '#06B6D4',
      description: 'Identité et transformation personnelle : portraits intimes de vies extraordinaires',
      tagline: 'Les histoires qui nous définissent',
      imageHero: 'https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg',
      stats: {
        episodes: 15,
        dureeTotal: '10h 30min',
        vuesMoyennes: 14300,
        frequence: 'Bi-mensuel'
      },
      animateur: {
        nom: 'Alex Morgan',
        bio: 'Documentariste et portraitiste, Alex révèle l\'humanité derrière les parcours extraordinaires.',
        avatar: 'https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg',
        role: 'Documentariste'
      },
      credits: {
        producteur: 'Origines Media',
        realisateur: 'Alex Morgan',
        montage: 'Thomas Martin'
      },
      episodes: [
        {
          id: 'jesuis-001',
          titre: 'Je suis... une femme qui a révolutionné la tech',
          description: 'Portrait intime d\'une pionnière qui a brisé les codes dans l\'univers masculin de la technologie.',
          thumbnailUrl: 'https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg',
          videoUrl: '/video/femme-tech-revolution',
          datePublication: '2024-01-05',
          duree: '20:33',
          vues: 13450,
          likes: 967,
          episode: 6,
          saison: 2,
          tags: ['Technologie', 'Féminisme', 'Innovation']
        }
      ]
    }
  };

  // Obtenir les données du format actuel
  const currentFormat = formatsData[formatId || 'la-lettre'];

  if (!currentFormat) {
    return <div>Format non trouvé</div>;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] overflow-x-hidden">
      {/* Sidebar Desktop */}
      <Sidebar />

      {/* Main Content */}
      <main className="min-h-screen md:ml-[280px]">
        
        {/* 🎭 Acte 1 : Hero du Format */}
        <ActeHeroFormat
          formatId={currentFormat.id}
          formatName={currentFormat.nom}
          formatColor={currentFormat.couleur}
          tagline={currentFormat.tagline}
          description={currentFormat.description}
          imageHero={currentFormat.imageHero}
          stats={currentFormat.stats}
        />

        {/* 📺 Acte 2 : Épisodes Récents */}
        <ActeEpisodesRecents
          formatId={currentFormat.id}
          formatName={currentFormat.nom}
          formatColor={currentFormat.couleur}
          episodes={currentFormat.episodes}
        />

        {/* 📚 Acte 3 : Bibliothèque Complète */}
        <ActeBibliothequeFormat
          formatId={currentFormat.id}
          formatName={currentFormat.nom}
          formatColor={currentFormat.couleur}
        />

        {/* 👥 Acte 4 : L'Équipe & Crédits */}
        <ActeEquipeCredits
          formatId={currentFormat.id}
          formatName={currentFormat.nom}
          formatColor={currentFormat.couleur}
          animateur={currentFormat.animateur}
          credits={currentFormat.credits}
        />

        {/* 🎯 Acte 5 : Kit d'Introspection */}
        <EngagementSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default FormatPage;