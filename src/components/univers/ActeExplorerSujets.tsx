import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, BookOpen, Clock, TrendingUp } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface SousCategorie {
  id: string;
  nom: string;
  url: string;
  iconName: string;
  description: string;
  imageUrl: string;
  articleCount: number;
  isPopular?: boolean;
}

interface ActeExplorerSujetsProps {
  universId: string;
  universName: string;
  universColor: string;
  sousCategories?: SousCategorie[];
}

const ActeExplorerSujets: React.FC<ActeExplorerSujetsProps> = ({ 
  universId, 
  universName, 
  universColor,
  sousCategories 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Données complètes pour TOUTES les catégories avec sous-catégories
  const defaultSousCategoriesByUnivers = {
    'psychologie': [
      { 
        id: "sub-psy-01", 
        nom: "Résilience & Épreuves", 
        url: "/univers/psychologie/resilience", 
        iconName: "Shield",
        description: "Développer sa capacité à rebondir face aux difficultés de la vie",
        imageUrl: "https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg",
        articleCount: 24,
        isPopular: true
      },
      { 
        id: "sub-psy-02", 
        nom: "Confiance & Estime de soi", 
        url: "/univers/psychologie/confiance-en-soi", 
        iconName: "UserCheck",
        description: "Construire une relation saine avec soi-même et affirmer sa valeur",
        imageUrl: "https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg",
        articleCount: 18
      },
      { 
        id: "sub-psy-03", 
        nom: "Intelligence Émotionnelle", 
        url: "/univers/psychologie/emotions", 
        iconName: "Heart",
        description: "Comprendre et maîtriser ses émotions pour mieux vivre",
        imageUrl: "https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg",
        articleCount: 31,
        isPopular: true
      },
      { 
        id: "sub-psy-04", 
        nom: "Habitudes & Discipline", 
        url: "/univers/psychologie/habitudes", 
        iconName: "Target",
        description: "Créer des routines positives et maintenir la motivation",
        imageUrl: "https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg",
        articleCount: 15
      },
      { 
        id: "sub-psy-05", 
        nom: "Thérapies & Guérison", 
        url: "/univers/psychologie/therapies", 
        iconName: "MessageSquareHeart",
        description: "Explorer les différentes approches thérapeutiques modernes",
        imageUrl: "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg",
        articleCount: 12
      },
      { 
        id: "sub-psy-06", 
        nom: "Mindset & Mental", 
        url: "/univers/psychologie/mindset", 
        iconName: "Brain",
        description: "Développer un état d'esprit de croissance et de réussite",
        imageUrl: "https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg",
        articleCount: 27
      }
    ],
    'societe': [
      { 
        id: "sub-soc-01", 
        nom: "Identités & Représentation", 
        url: "/univers/societe/identites", 
        iconName: "Users",
        description: "Explorer la diversité des identités dans notre société moderne",
        imageUrl: "https://images.pexels.com/photos/5083490/pexels-photo-5083490.jpeg",
        articleCount: 22,
        isPopular: true
      },
      { 
        id: "sub-soc-02", 
        nom: "Grands Débats", 
        url: "/univers/societe/debats", 
        iconName: "MessageSquare",
        description: "Décrypter les enjeux sociétaux qui façonnent notre époque",
        imageUrl: "https://images.pexels.com/photos/7848733/pexels-photo-7848733.jpeg",
        articleCount: 19
      },
      { 
        id: "sub-soc-03", 
        nom: "Rituels & Traditions", 
        url: "/univers/societe/rituels", 
        iconName: "Calendar",
        description: "Comprendre l'évolution de nos pratiques culturelles",
        imageUrl: "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg",
        articleCount: 14
      },
      { 
        id: "sub-soc-04", 
        nom: "Décryptage Culturel", 
        url: "/univers/societe/culture", 
        iconName: "Eye",
        description: "Analyser les phénomènes culturels et leur impact social",
        imageUrl: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg",
        articleCount: 28
      },
      { 
        id: "sub-soc-05", 
        nom: "Évolutions Sociales", 
        url: "/univers/societe/evolutions", 
        iconName: "TrendingUp",
        description: "Observer les transformations de notre société",
        imageUrl: "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg",
        articleCount: 16,
        isPopular: true
      },
      { 
        id: "sub-soc-06", 
        nom: "Diversité & Inclusion", 
        url: "/univers/societe/diversite", 
        iconName: "Globe",
        description: "Construire une société plus inclusive et équitable",
        imageUrl: "https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg",
        articleCount: 21
      }
    ],
    'carriere': [
      { 
        id: "sub-car-01", 
        nom: "Reconversion & Changement", 
        url: "/univers/carriere/reconversion", 
        iconName: "RefreshCw",
        description: "Réussir sa transition professionnelle et changer de voie",
        imageUrl: "https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg",
        articleCount: 33,
        isPopular: true
      },
      { 
        id: "sub-car-02", 
        nom: "Leadership & Management", 
        url: "/univers/carriere/leadership", 
        iconName: "Crown",
        description: "Développer ses compétences de leader et manager",
        imageUrl: "https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg",
        articleCount: 26
      },
      { 
        id: "sub-car-03", 
        nom: "Équilibre Vie Pro/Perso", 
        url: "/univers/carriere/equilibre", 
        iconName: "Scale",
        description: "Trouver l'harmonie entre ambitions et bien-être personnel",
        imageUrl: "https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg",
        articleCount: 29,
        isPopular: true
      },
      { 
        id: "sub-car-04", 
        nom: "Futur du Travail", 
        url: "/univers/carriere/futur-travail", 
        iconName: "Rocket",
        description: "Anticiper les évolutions du monde professionnel",
        imageUrl: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
        articleCount: 17
      },
      { 
        id: "sub-car-05", 
        nom: "Entrepreneuriat", 
        url: "/univers/carriere/entrepreneuriat", 
        iconName: "Lightbulb",
        description: "Créer et développer son entreprise avec succès",
        imageUrl: "https://images.pexels.com/photos/3760072/pexels-photo-3760072.jpeg",
        articleCount: 24
      },
      { 
        id: "sub-car-06", 
        nom: "Compétences & Formation", 
        url: "/univers/carriere/competences", 
        iconName: "GraduationCap",
        description: "Développer ses compétences et se former en continu",
        imageUrl: "https://images.pexels.com/photos/669619/pexels-photo-669619.jpeg",
        articleCount: 20
      }
    ],
    'voyage': [
      { 
        id: "sub-voy-01", 
        nom: "Aventure & Dépassement", 
        url: "/univers/voyage/aventure", 
        iconName: "Mountain",
        description: "Repousser ses limites à travers l'aventure et l'exploration",
        imageUrl: "https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg",
        articleCount: 28,
        isPopular: true
      },
      { 
        id: "sub-voy-02", 
        nom: "Voyage Introspectif", 
        url: "/univers/voyage/introspectif", 
        iconName: "Compass",
        description: "Voyager pour se découvrir et se transformer intérieurement",
        imageUrl: "https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg",
        articleCount: 22
      },
      { 
        id: "sub-voy-03", 
        nom: "Immersion Culturelle", 
        url: "/univers/voyage/immersion", 
        iconName: "MapPin",
        description: "S'immerger dans d'autres cultures pour élargir sa vision",
        imageUrl: "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg",
        articleCount: 19
      },
      { 
        id: "sub-voy-04", 
        nom: "Nomadisme & Nouvelles Vies", 
        url: "/univers/voyage/nomadisme", 
        iconName: "Tent",
        description: "Adopter un mode de vie nomade et repenser sa relation au lieu",
        imageUrl: "https://images.pexels.com/photos/2519392/pexels-photo-2519392.jpeg",
        articleCount: 15,
        isPopular: true
      },
      { 
        id: "sub-voy-05", 
        nom: "Exploration Urbaine", 
        url: "/univers/voyage/urbain", 
        iconName: "Building",
        description: "Découvrir les secrets et l'âme des grandes métropoles",
        imageUrl: "https://images.pexels.com/photos/7848733/pexels-photo-7848733.jpeg",
        articleCount: 13
      },
      { 
        id: "sub-voy-06", 
        nom: "Nature & Wilderness", 
        url: "/univers/voyage/nature", 
        iconName: "Trees",
        description: "Se reconnecter à la nature sauvage et préservée",
        imageUrl: "https://images.pexels.com/photos/931007/pexels-photo-931007.jpeg",
        articleCount: 25
      }
    ],
    'art-creativite': [
      { 
        id: "sub-art-01", 
        nom: "Processus Créatif", 
        url: "/univers/art-creativite/processus", 
        iconName: "Palette",
        description: "Comprendre et optimiser son processus de création artistique",
        imageUrl: "https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg",
        articleCount: 31,
        isPopular: true
      },
      { 
        id: "sub-art-02", 
        nom: "Portraits d'Artistes", 
        url: "/univers/art-creativite/portraits", 
        iconName: "User",
        description: "Rencontrer des créateurs inspirants et leurs parcours uniques",
        imageUrl: "https://images.pexels.com/photos/3747505/pexels-photo-3747505.jpeg",
        articleCount: 27
      },
      { 
        id: "sub-art-03", 
        nom: "Art & Engagement", 
        url: "/univers/art-creativite/engagement", 
        iconName: "Megaphone",
        description: "L'art comme vecteur de changement social et politique",
        imageUrl: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg",
        articleCount: 18
      },
      { 
        id: "sub-art-04", 
        nom: "Industries Créatives", 
        url: "/univers/art-creativite/industries", 
        iconName: "Factory",
        description: "Naviguer dans l'écosystème professionnel de la création",
        imageUrl: "https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg",
        articleCount: 23
      },
      { 
        id: "sub-art-05", 
        nom: "Art Numérique", 
        url: "/univers/art-creativite/numerique", 
        iconName: "Monitor",
        description: "Explorer les nouvelles frontières de la création digitale",
        imageUrl: "https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg",
        articleCount: 16,
        isPopular: true
      },
      { 
        id: "sub-art-06", 
        nom: "Artisanat & Tradition", 
        url: "/univers/art-creativite/artisanat", 
        iconName: "Hammer",
        description: "Préserver et réinventer les savoir-faire traditionnels",
        imageUrl: "https://images.pexels.com/photos/3769999/pexels-photo-3769999.jpeg",
        articleCount: 14
      }
    ],
    'spiritualite': [
      { 
        id: "sub-spi-01", 
        nom: "Quête de Sens", 
        url: "/univers/spiritualite/quete-sens", 
        iconName: "Search",
        description: "Explorer les grandes questions existentielles de l'humanité",
        imageUrl: "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg",
        articleCount: 29,
        isPopular: true
      },
      { 
        id: "sub-spi-02", 
        nom: "Sagesse & Philosophie", 
        url: "/univers/spiritualite/sagesse", 
        iconName: "BookOpen",
        description: "Puiser dans la sagesse ancestrale et contemporaine",
        imageUrl: "https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg",
        articleCount: 24
      },
      { 
        id: "sub-spi-03", 
        nom: "Connexion à la Nature", 
        url: "/univers/spiritualite/nature", 
        iconName: "Leaf",
        description: "Retrouver le lien sacré avec le monde naturel",
        imageUrl: "https://images.pexels.com/photos/931007/pexels-photo-931007.jpeg",
        articleCount: 21
      },
      { 
        id: "sub-spi-04", 
        nom: "Rituels & Pratiques", 
        url: "/univers/spiritualite/rituels", 
        iconName: "Circle",
        description: "Intégrer des pratiques spirituelles dans le quotidien",
        imageUrl: "https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg",
        articleCount: 18
      },
      { 
        id: "sub-spi-05", 
        nom: "Méditation & Mindfulness", 
        url: "/univers/spiritualite/meditation", 
        iconName: "Flower",
        description: "Cultiver la présence et la conscience de l'instant",
        imageUrl: "https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg",
        articleCount: 32,
        isPopular: true
      },
      { 
        id: "sub-spi-06", 
        nom: "Traditions Spirituelles", 
        url: "/univers/spiritualite/traditions", 
        iconName: "Flame",
        description: "Découvrir la richesse des traditions spirituelles mondiales",
        imageUrl: "https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg",
        articleCount: 16
      }
    ],
    'sante': [
      { 
        id: "sub-san-01", 
        nom: "Santé Mentale", 
        url: "/univers/sante/sante-mentale", 
        iconName: "Brain",
        description: "Prendre soin de son bien-être psychologique et émotionnel",
        imageUrl: "https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg",
        articleCount: 35,
        isPopular: true
      },
      { 
        id: "sub-san-02", 
        nom: "Nutrition & Corps", 
        url: "/univers/sante/nutrition", 
        iconName: "Apple",
        description: "Nourrir son corps avec conscience et équilibre",
        imageUrl: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
        articleCount: 28
      },
      { 
        id: "sub-san-03", 
        nom: "Bien-être au Quotidien", 
        url: "/univers/sante/bien-etre", 
        iconName: "Heart",
        description: "Intégrer des pratiques de bien-être dans sa routine",
        imageUrl: "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg",
        articleCount: 31,
        isPopular: true
      },
      { 
        id: "sub-san-04", 
        nom: "Sport & Mouvement", 
        url: "/univers/sante/sport", 
        iconName: "Dumbbell",
        description: "Cultiver une relation saine avec l'activité physique",
        imageUrl: "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg",
        articleCount: 22
      },
      { 
        id: "sub-san-05", 
        nom: "Sommeil & Récupération", 
        url: "/univers/sante/sommeil", 
        iconName: "Moon",
        description: "Optimiser son sommeil pour une meilleure santé",
        imageUrl: "https://images.pexels.com/photos/935777/pexels-photo-935777.jpeg",
        articleCount: 19
      },
      { 
        id: "sub-san-06", 
        nom: "Médecine Préventive", 
        url: "/univers/sante/prevention", 
        iconName: "Shield",
        description: "Prévenir plutôt que guérir : approche holistique de la santé",
        imageUrl: "https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg",
        articleCount: 16
      }
    ],
    'technologie': [
      { 
        id: "sub-tech-01", 
        nom: "Impact Sociétal", 
        url: "/univers/technologie/impact-societal", 
        iconName: "Globe",
        description: "Analyser l'influence de la technologie sur notre société",
        imageUrl: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
        articleCount: 32,
        isPopular: true
      },
      { 
        id: "sub-tech-02", 
        nom: "Innovations Futures", 
        url: "/univers/technologie/innovations", 
        iconName: "Rocket",
        description: "Explorer les technologies émergentes et leurs potentiels",
        imageUrl: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg",
        articleCount: 26
      },
      { 
        id: "sub-tech-03", 
        nom: "Éthique & IA", 
        url: "/univers/technologie/ethique-ia", 
        iconName: "Scale",
        description: "Réflexions sur les enjeux éthiques de l'intelligence artificielle",
        imageUrl: "https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg",
        articleCount: 29,
        isPopular: true
      },
      { 
        id: "sub-tech-04", 
        nom: "Humanité Augmentée", 
        url: "/univers/technologie/humanite-augmentee", 
        iconName: "Cpu",
        description: "L'interface entre technologie et condition humaine",
        imageUrl: "https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg",
        articleCount: 18
      },
      { 
        id: "sub-tech-05", 
        nom: "Cybersécurité & Vie Privée", 
        url: "/univers/technologie/cybersecurite", 
        iconName: "Lock",
        description: "Protéger ses données dans l'ère numérique",
        imageUrl: "https://images.pexels.com/photos/669619/pexels-photo-669619.jpeg",
        articleCount: 24
      },
      { 
        id: "sub-tech-06", 
        nom: "Déconnexion Digitale", 
        url: "/univers/technologie/deconnexion", 
        iconName: "Wifi",
        description: "Retrouver l'équilibre dans notre rapport à la technologie",
        imageUrl: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg",
        articleCount: 21
      }
    ],
    'relations': [
      { 
        id: "sub-rel-01", 
        nom: "Parentalité", 
        url: "/univers/relations/parentalite", 
        iconName: "Baby",
        description: "Élever ses enfants avec bienveillance et conscience",
        imageUrl: "https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg",
        articleCount: 38,
        isPopular: true
      },
      { 
        id: "sub-rel-02", 
        nom: "Relations Amoureuses", 
        url: "/univers/relations/amour", 
        iconName: "Heart",
        description: "Construire et maintenir des relations amoureuses épanouissantes",
        imageUrl: "https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg",
        articleCount: 34
      },
      { 
        id: "sub-rel-03", 
        nom: "Liens Familiaux", 
        url: "/univers/relations/famille", 
        iconName: "Users",
        description: "Naviguer les dynamiques familiales complexes",
        imageUrl: "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg",
        articleCount: 26,
        isPopular: true
      },
      { 
        id: "sub-rel-04", 
        nom: "Amitié", 
        url: "/univers/relations/amitie", 
        iconName: "UserPlus",
        description: "Cultiver des amitiés authentiques et durables",
        imageUrl: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg",
        articleCount: 22
      },
      { 
        id: "sub-rel-05", 
        nom: "Communication", 
        url: "/univers/relations/communication", 
        iconName: "MessageCircle",
        description: "Maîtriser l'art de la communication interpersonnelle",
        imageUrl: "https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg",
        articleCount: 30
      },
      { 
        id: "sub-rel-06", 
        nom: "Conflits & Réconciliation", 
        url: "/univers/relations/conflits", 
        iconName: "Handshake",
        description: "Transformer les conflits en opportunités de croissance",
        imageUrl: "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg",
        articleCount: 19
      }
    ],
    'environnement': [
      { 
        id: "sub-env-01", 
        nom: "Initiatives Positives", 
        url: "/univers/environnement/initiatives", 
        iconName: "Lightbulb",
        description: "Découvrir des projets inspirants pour la planète",
        imageUrl: "https://images.pexels.com/photos/931007/pexels-photo-931007.jpeg",
        articleCount: 41,
        isPopular: true
      },
      { 
        id: "sub-env-02", 
        nom: "Consommation Consciente", 
        url: "/univers/environnement/consommation", 
        iconName: "ShoppingCart",
        description: "Repenser nos habitudes de consommation",
        imageUrl: "https://images.pexels.com/photos/3735747/pexels-photo-3735747.jpeg",
        articleCount: 33
      },
      { 
        id: "sub-env-03", 
        nom: "Vivre Autrement", 
        url: "/univers/environnement/vivre-autrement", 
        iconName: "Home",
        description: "Adopter des modes de vie plus durables et minimalistes",
        imageUrl: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
        articleCount: 28,
        isPopular: true
      },
      { 
        id: "sub-env-04", 
        nom: "Enjeux & Solutions", 
        url: "/univers/environnement/enjeux", 
        iconName: "AlertTriangle",
        description: "Comprendre les défis environnementaux et agir",
        imageUrl: "https://images.pexels.com/photos/7848733/pexels-photo-7848733.jpeg",
        articleCount: 25
      },
      { 
        id: "sub-env-05", 
        nom: "Permaculture & Agriculture", 
        url: "/univers/environnement/permaculture", 
        iconName: "Sprout",
        description: "Cultiver en harmonie avec la nature",
        imageUrl: "https://images.pexels.com/photos/2519392/pexels-photo-2519392.jpeg",
        articleCount: 22
      },
      { 
        id: "sub-env-06", 
        nom: "Biodiversité & Nature", 
        url: "/univers/environnement/biodiversite", 
        iconName: "Trees",
        description: "Protéger et célébrer la richesse du vivant",
        imageUrl: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
        articleCount: 19
      }
    ]
  };

  // Utiliser les sous-catégories passées en props ou les données par défaut
  const currentSousCategories = sousCategories || defaultSousCategoriesByUnivers[universId as keyof typeof defaultSousCategoriesByUnivers] || [];

  // Intersection Observer for scroll animations
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

  // Preload images
  useEffect(() => {
    currentSousCategories.forEach((sousCategorie) => {
      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => new Set([...prev, sousCategorie.id]));
      };
      img.src = sousCategorie.imageUrl;
    });
  }, [currentSousCategories]);

  // Check scroll position to update navigation indicators
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Navigation functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 380 + 24; // Card width + gap
      scrollContainerRef.current.scrollBy({
        left: -cardWidth * 2, // Scroll 2 cards at a time
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 380 + 24; // Card width + gap
      scrollContainerRef.current.scrollBy({
        left: cardWidth * 2, // Scroll 2 cards at a time
        behavior: 'smooth'
      });
    }
  };

  // Add scroll event listener to update navigation indicators
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      // Initial check
      checkScrollPosition();
      
      return () => {
        container.removeEventListener('scroll', checkScrollPosition);
      };
    }
  }, []);

  // Wheel scroll handling for horizontal scroll
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (scrollContainerRef.current && sectionRef.current) {
        const container = scrollContainerRef.current;
        const rect = container.getBoundingClientRect();
        
        // Check if mouse is over the scroll container
        const isOverContainer = e.clientX >= rect.left && 
                               e.clientX <= rect.right && 
                               e.clientY >= rect.top && 
                               e.clientY <= rect.bottom;
        
        if (isOverContainer) {
          const { scrollLeft, scrollWidth, clientWidth } = container;
          const canScrollHorizontally = scrollWidth > clientWidth;
          
          if (canScrollHorizontally) {
            const scrollingRight = e.deltaY > 0;
            const scrollingLeft = e.deltaY < 0;
            
            const canScrollRightMore = scrollLeft < scrollWidth - clientWidth - 1;
            const canScrollLeftMore = scrollLeft > 1;
            
            if ((scrollingRight && canScrollRightMore) || (scrollingLeft && canScrollLeftMore)) {
              e.preventDefault();
              container.scrollLeft += e.deltaY;
              checkScrollPosition();
            }
          }
        }
      }
    };

    document.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      document.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Helper function to get Lucide icon component
  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent || LucideIcons.Circle;
  };

  if (currentSousCategories.length === 0) {
    return null;
  }

  return (
    <section 
      ref={sectionRef}
      className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#0A0A0A] py-20 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodeURIComponent(universColor)}' fill-opacity='0.1'%3E%3Cpath d='M50 50L25 25v50l25-25zm0 0l25 25V25L50 50z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} 
        />
      </div>

      {/* Section Header */}
      <div className={`text-center mb-16 px-8 lg:px-16 transform transition-all duration-1000 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}>
        <div className="inline-flex items-center gap-4 mb-6">
          <div 
            className="w-12 h-px bg-gradient-to-r from-transparent to-transparent"
            style={{
              background: `linear-gradient(to right, transparent, ${universColor}, transparent)`
            }}
          />
          <span 
            className="font-inter text-sm tracking-[0.2em] uppercase"
            style={{ color: universColor }}
          >
            Acte 4
          </span>
          <div 
            className="w-12 h-px bg-gradient-to-r from-transparent to-transparent"
            style={{
              background: `linear-gradient(to right, transparent, ${universColor}, transparent)`
            }}
          />
        </div>
        
        <h2 className="font-montserrat font-black text-4xl md:text-5xl lg:text-6xl xl:text-7xl uppercase tracking-wider text-white mb-6 leading-[0.9]">
          Explorer
          <br />
          <span 
            className="gradient-text-animated"
            style={{
              background: `linear-gradient(-45deg, ${universColor}, #EC4899, #F59E0B, ${universColor})`,
              backgroundSize: '400% 400%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradientShift 3s ease infinite'
            }}
          >
            par Sujet
          </span>
        </h2>
        
        <p className="font-inter text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
          Naviguez par thématiques spécifiques au sein de l'univers {universName.toLowerCase()}
        </p>
      </div>

      {/* Navigation Instructions */}
      <div className={`text-center mb-8 px-8 lg:px-16 transform transition-all duration-1000 delay-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}>
        <div className="flex items-center justify-center gap-6">
          {/* Left Arrow Button */}
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`
              w-12 h-12 rounded-full border border-white/20 backdrop-blur-sm
              flex items-center justify-center transition-all duration-300
              ${canScrollLeft 
                ? 'text-white hover:scale-110 cursor-pointer' 
                : 'text-white/30 cursor-not-allowed'
              }
            `}
            style={{ 
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
              borderColor: canScrollLeft ? `${universColor}40` : 'rgba(255,255,255,0.2)',
              backgroundColor: canScrollLeft ? `${universColor}10` : 'transparent'
            }}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Instructions */}
          <div className="inline-flex items-center gap-3 text-white/70 text-sm font-inter tracking-wider bg-black/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10">
            <div className="w-6 h-px bg-white/40" />
            <span>Explorez les sous-thématiques</span>
            <div className="w-6 h-px bg-white/40" />
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`
              w-12 h-12 rounded-full border border-white/20 backdrop-blur-sm
              flex items-center justify-center transition-all duration-300
              ${canScrollRight 
                ? 'text-white hover:scale-110 cursor-pointer' 
                : 'text-white/30 cursor-not-allowed'
              }
            `}
            style={{ 
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
              borderColor: canScrollRight ? `${universColor}40` : 'rgba(255,255,255,0.2)',
              backgroundColor: canScrollRight ? `${universColor}10` : 'transparent'
            }}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="relative">
        {/* Large Navigation Arrows - Left */}
        <button
          onClick={scrollLeft}
          disabled={!canScrollLeft}
          className={`
            absolute left-4 top-1/2 -translate-y-1/2 z-30
            w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/20
            flex items-center justify-center transition-all duration-300
            ${canScrollLeft 
              ? 'text-white hover:bg-black/80 hover:scale-110 cursor-pointer shadow-2xl' 
              : 'text-white/30 cursor-not-allowed opacity-50'
            }
          `}
          style={{ 
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            borderColor: canScrollLeft ? `${universColor}50` : 'rgba(255,255,255,0.2)'
          }}
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        {/* Large Navigation Arrows - Right */}
        <button
          onClick={scrollRight}
          disabled={!canScrollRight}
          className={`
            absolute right-4 top-1/2 -translate-y-1/2 z-30
            w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/20
            flex items-center justify-center transition-all duration-300
            ${canScrollRight 
              ? 'text-white hover:bg-black/80 hover:scale-110 cursor-pointer shadow-2xl' 
              : 'text-white/30 cursor-not-allowed opacity-50'
            }
          `}
          style={{ 
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            borderColor: canScrollRight ? `${universColor}50` : 'rgba(255,255,255,0.2)'
          }}
        >
          <ChevronRight className="w-8 h-8" />
        </button>

        {/* Scroll Container */}
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto overflow-y-hidden scrollbar-hide pb-8 cursor-grab active:cursor-grabbing"
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitScrollbar: { display: 'none' }
          }}
        >
          <div className="flex gap-6 px-8 lg:px-16" style={{ width: 'max-content' }}>
            {/* Sous-Catégorie Cards - DESIGN PREMIUM */}
            {currentSousCategories.map((sousCategorie, index) => {
              const IconComponent = getIconComponent(sousCategorie.iconName);
              
              return (
                <div
                  key={sousCategorie.id}
                  className={`
                    group relative overflow-hidden rounded-3xl cursor-pointer flex-shrink-0
                    w-[350px] h-[450px] lg:w-[380px] lg:h-[480px]
                    transform transition-all duration-700 hover:scale-[1.03] hover:z-10
                    ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}
                  `}
                  style={{
                    transitionDelay: `${index * 100}ms`,
                  }}
                  onMouseEnter={() => setHoveredCard(sousCategorie.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => window.open(sousCategorie.url, '_blank')}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    {loadedImages.has(sousCategorie.id) ? (
                      <div
                        className="w-full h-full bg-cover bg-center transition-all duration-700 group-hover:scale-105"
                        style={{
                          backgroundImage: `url(${sousCategorie.imageUrl})`,
                          filter: hoveredCard === sousCategorie.id 
                            ? 'brightness(0.4) contrast(1.3) saturate(1.2)' 
                            : 'brightness(0.6) contrast(1.1) saturate(1.1)'
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse" />
                    )}
                    
                    {/* Film Grain Texture */}
                    <div 
                      className="absolute inset-0 film-grain-texture opacity-20 mix-blend-overlay pointer-events-none"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
                        backgroundSize: '256px 256px'
                      }}
                    />
                    
                    {/* Strategic Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/20" />
                  </div>

                  {/* Popular Badge */}
                  {sousCategorie.isPopular && (
                    <div className="absolute top-6 right-6 z-20">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500/30 to-orange-500/30 border border-amber-400/50 rounded-full backdrop-blur-md">
                        <TrendingUp className="w-3 h-3 text-amber-400" />
                        <span className="font-inter text-amber-300 text-xs font-bold tracking-wider uppercase">
                          Populaire
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-between p-8 z-20">
                    
                    {/* Top Section - Icon & Stats */}
                    <div className="flex justify-between items-start">
                      {/* Icon with Dynamic Color */}
                      <div 
                        className={`
                          w-16 h-16 rounded-2xl backdrop-blur-md border transition-all duration-500 
                          flex items-center justify-center
                          ${hoveredCard === sousCategorie.id 
                            ? 'scale-110 shadow-lg' 
                            : 'scale-100'
                          }
                        `}
                        style={{
                          backgroundColor: hoveredCard === sousCategorie.id ? `${universColor}40` : `${universColor}20`,
                          borderColor: hoveredCard === sousCategorie.id ? `${universColor}60` : `${universColor}30`,
                          boxShadow: hoveredCard === sousCategorie.id ? `0 12px 30px ${universColor}40` : 'none'
                        }}
                      >
                        <IconComponent 
                          className="w-8 h-8 transition-all duration-500"
                          style={{
                            color: hoveredCard === sousCategorie.id ? universColor : 'white'
                          }}
                        />
                      </div>

                      {/* Article Count */}
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md border border-white/20 rounded-full">
                        <BookOpen className="w-3 h-3 text-white/70" />
                        <span className="font-inter text-white/90 text-xs font-medium">
                          {sousCategorie.articleCount} articles
                        </span>
                      </div>
                    </div>

                    {/* Bottom Section - Title, Description & CTA */}
                    <div>
                      {/* Title */}
                      <h3 
                        className="font-montserrat font-bold text-2xl lg:text-3xl text-white mb-4 leading-tight transition-all duration-500"
                        style={{
                          color: hoveredCard === sousCategorie.id ? universColor : 'white'
                        }}
                      >
                        {sousCategorie.nom}
                      </h3>

                      {/* Description */}
                      <p className="font-inter text-white/80 text-sm leading-relaxed mb-6 line-clamp-2">
                        {sousCategorie.description}
                      </p>

                      {/* Decorative Line with Dynamic Color */}
                      <div 
                        className="h-1 mb-6 rounded-full transition-all duration-500"
                        style={{
                          width: hoveredCard === sousCategorie.id ? '120px' : '60px',
                          background: `linear-gradient(90deg, ${universColor}, ${universColor}80)`,
                          boxShadow: hoveredCard === sousCategorie.id ? `0 0 20px ${universColor}60` : 'none'
                        }}
                      />

                      {/* CTA Section */}
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-2">
                          <span className="font-inter text-white/90 text-sm tracking-wide uppercase font-medium">
                            Explorer le sujet
                          </span>
                          
                          {/* Reading Time Estimate */}
                          <div className="flex items-center gap-2 text-white/60 text-xs">
                            <Clock className="w-3 h-3" />
                            <span>{Math.floor(sousCategorie.articleCount * 1.5)} min de lecture</span>
                          </div>
                        </div>

                        <div 
                          className={`
                            w-14 h-14 rounded-full flex items-center justify-center 
                            transition-all duration-500 backdrop-blur-md border
                            ${hoveredCard === sousCategorie.id 
                              ? 'scale-110 shadow-lg' 
                              : 'scale-100'
                            }
                          `}
                          style={{
                            backgroundColor: hoveredCard === sousCategorie.id ? `${universColor}40` : `${universColor}20`,
                            borderColor: hoveredCard === sousCategorie.id ? `${universColor}60` : `${universColor}30`,
                            boxShadow: hoveredCard === sousCategorie.id ? `0 12px 30px ${universColor}40` : 'none'
                          }}
                        >
                          <ArrowRight 
                            className={`w-5 h-5 transition-all duration-500 ${
                              hoveredCard === sousCategorie.id ? 'translate-x-1' : ''
                            }`}
                            style={{ color: hoveredCard === sousCategorie.id ? universColor : 'white' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hover Glow Effect with Dynamic Color */}
                  <div 
                    className={`
                      absolute inset-0 rounded-3xl transition-all duration-500 pointer-events-none
                      ${hoveredCard === sousCategorie.id 
                        ? 'ring-2 shadow-2xl' 
                        : ''
                      }
                    `}
                    style={{
                      ringColor: hoveredCard === sousCategorie.id ? `${universColor}60` : 'transparent',
                      boxShadow: hoveredCard === sousCategorie.id ? `0 25px 50px ${universColor}25` : 'none'
                    }}
                  />

                  {/* Premium Border Animation */}
                  <div 
                    className={`
                      absolute inset-0 rounded-3xl border-2 transition-all duration-500 pointer-events-none
                      ${hoveredCard === sousCategorie.id ? 'opacity-100' : 'opacity-0'}
                    `}
                    style={{
                      borderColor: hoveredCard === sousCategorie.id ? `${universColor}50` : 'transparent',
                      background: hoveredCard === sousCategorie.id 
                        ? `linear-gradient(135deg, ${universColor}05 0%, transparent 50%, ${universColor}05 100%)` 
                        : 'transparent'
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className={`text-center mt-16 px-8 lg:px-16 transform transition-all duration-1000 delay-700 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}>
        <a
          href={`/univers/${universId}/sujets`}
          className="group inline-flex items-center gap-4 px-8 py-4 border text-white font-inter font-medium tracking-widest uppercase text-sm transition-all duration-500 backdrop-blur-sm rounded-full hover:scale-105"
          style={{
            borderColor: `${universColor}40`,
            backgroundColor: `${universColor}10`
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = `${universColor}60`;
            e.currentTarget.style.backgroundColor = `${universColor}20`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = `${universColor}40`;
            e.currentTarget.style.backgroundColor = `${universColor}10`;
          }}
        >
          <span>Voir tous les sujets</span>
          <ArrowRight 
            className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500"
            style={{ color: universColor }}
          />
        </a>
      </div>
    </section>
  );
};

export default ActeExplorerSujets;