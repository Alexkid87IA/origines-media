import React from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import ActeManifeste from '../components/univers/ActeManifeste';
import ActeIncontournables from '../components/univers/ActeIncontournables';
import ActeBibliotheque from '../components/univers/ActeBibliotheque';
import ActeExplorerSujets from '../components/univers/ActeExplorerSujets';
import ActeAutresUnivers from '../components/univers/ActeAutresUnivers';

const UniversDetailPage: React.FC = () => {
  const { universId } = useParams<{ universId: string }>();
  
  // Données des univers (à remplacer par vos données Sanity)
  const universData = {
    'psychologie': {
      id: 'psychologie',
      nom: 'PSYCHOLOGIE',
      color: '#4299E1',
      philosophie: 'Outiller et inspirer pour mieux se comprendre et grandir',
      description: 'Explorez les méandres de l\'esprit humain à travers des récits authentiques et des analyses profondes.',
      imageHero: 'https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg',
      stats: {
        articles: 127,
        auteurs: 24,
        tempsTotal: '152h'
      }
    },
    'societe': {
      id: 'societe',
      nom: 'SOCIÉTÉ',
      color: '#ED8936',
      philosophie: 'Explorer les changements sociaux, la diversité et les tabous',
      description: 'Décrypter les évolutions sociétales et comprendre les défis de notre époque.',
      imageHero: 'https://images.pexels.com/photos/7848733/pexels-photo-7848733.jpeg',
      stats: {
        articles: 98,
        auteurs: 18,
        tempsTotal: '124h'
      }
    },
    'carriere': {
      id: 'carriere',
      nom: 'CARRIÈRE',
      color: '#4A5568',
      philosophie: 'Parcours professionnels, reconversions et équilibre de vie',
      description: 'Naviguer dans le monde professionnel moderne et trouver sa voie.',
      imageHero: 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg',
      stats: {
        articles: 156,
        auteurs: 32,
        tempsTotal: '198h'
      }
    },
    'voyage': {
      id: 'voyage',
      nom: 'VOYAGE',
      color: '#48BB78',
      philosophie: 'Quêtes identitaires et expériences transformatrices',
      description: 'Partir à la découverte du monde et de soi-même à travers l\'aventure.',
      imageHero: 'https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg',
      stats: {
        articles: 89,
        auteurs: 15,
        tempsTotal: '108h'
      }
    },
    'art-creativite': {
      id: 'art-creativite',
      nom: 'ART & CRÉATIVITÉ',
      color: '#9F7AEA',
      philosophie: 'L\'art comme levier de résilience et de changement',
      description: 'Célébrer la création artistique comme vecteur de transformation personnelle.',
      imageHero: 'https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg',
      stats: {
        articles: 134,
        auteurs: 28,
        tempsTotal: '167h'
      }
    },
    'spiritualite': {
      id: 'spiritualite',
      nom: 'SPIRITUALITÉ',
      color: '#805AD5',
      philosophie: 'Nourrir la recherche de sens et la connexion intérieure',
      description: 'Explorer les dimensions spirituelles de l\'existence humaine.',
      imageHero: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg',
      stats: {
        articles: 112,
        auteurs: 20,
        tempsTotal: '143h'
      }
    },
    'sante': {
      id: 'sante',
      nom: 'SANTÉ',
      color: '#38B2AC',
      philosophie: 'Aborder bien-être physique, mental et émotionnel',
      description: 'Prendre soin de soi dans toutes les dimensions de la santé.',
      imageHero: 'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg',
      stats: {
        articles: 143,
        auteurs: 26,
        tempsTotal: '176h'
      }
    },
    'technologie': {
      id: 'technologie',
      nom: 'TECHNOLOGIE',
      color: '#3182CE',
      philosophie: 'Questionner l\'impact sociotechnique et valoriser l\'innovation',
      description: 'Comprendre et façonner notre rapport à la technologie.',
      imageHero: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
      stats: {
        articles: 87,
        auteurs: 14,
        tempsTotal: '102h'
      }
    },
    'relations': {
      id: 'relations',
      nom: 'RELATIONS',
      color: '#E53E3E',
      philosophie: 'Décrypter dynamiques familiales et défis relationnels',
      description: 'Naviguer dans la complexité des relations humaines.',
      imageHero: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg',
      stats: {
        articles: 165,
        auteurs: 30,
        tempsTotal: '201h'
      }
    },
    'environnement': {
      id: 'environnement',
      nom: 'ENVIRONNEMENT',
      color: '#38A169',
      philosophie: 'Initiatives positives et consommation consciente',
      description: 'Agir pour la planète et repenser nos modes de vie.',
      imageHero: 'https://images.pexels.com/photos/931007/pexels-photo-931007.jpeg',
      stats: {
        articles: 121,
        auteurs: 22,
        tempsTotal: '156h'
      }
    }
  };

  // Récupérer les données de l'univers actuel
  const currentUniversId = universId || 'psychologie';
  const currentUnivers = universData[currentUniversId as keyof typeof universData] || universData['psychologie'];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] overflow-x-hidden">
      {/* Sidebar Desktop */}
      <Sidebar />

      {/* Main Content */}
      <main className="min-h-screen md:ml-[280px]">
        
        {/* Section 1 - Hero/Manifeste */}
        <ActeManifeste 
          universId={currentUnivers.id}
          universName={currentUnivers.nom}
          universColor={currentUnivers.color}
          philosophie={currentUnivers.philosophie}
          description={currentUnivers.description}
          imageHero={currentUnivers.imageHero}
          stats={currentUnivers.stats}
        />
        
        {/* Section 2 - Incontournables */}
        <ActeIncontournables 
          universId={currentUnivers.id}
          universName={currentUnivers.nom}
          universColor={currentUnivers.color}
        />
        
        {/* Section 3 - Bibliothèque */}
        <ActeBibliotheque 
          universId={currentUnivers.id}
          universName={currentUnivers.nom}
          universColor={currentUnivers.color}
        />
        
        {/* Section 4 - Explorer par Sujets */}
        <ActeExplorerSujets 
          universId={currentUnivers.id}
          universName={currentUnivers.nom}
          universColor={currentUnivers.color}
        />
        
        {/* Section 5 - Autres Univers */}
        <ActeAutresUnivers 
          universId={currentUnivers.id}
          universName={currentUnivers.nom}
          universColor={currentUnivers.color}
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default UniversDetailPage;