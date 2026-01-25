// src/pages/BoutiquePage.tsx
// Page Boutique - Style cohérent avec la homepage

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  ChevronRight,
  Download,
  Package,
  Star,
  Headphones,
  Video,
  FileText,
  Layers,
  Image,
  Gift,
  Calendar,
  Heart,
  Target,
  Users,
  Moon,
  Sun,
  Compass,
  Feather,
  Crown,
  MessageCircle,
  PenTool,
  Bookmark,
  Zap,
  Shield,
  RefreshCw,
  Truck,
  X,
  Bell,
  Mail
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { typo } from '../lib/typography';

// ============================================================
// TYPES
// ============================================================

interface Product {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  price: string;
  originalPrice?: string;
  badge?: string;
  badgeColor: string;
  color: string;
  icon: React.ReactNode;
  features: string[];
  format: string;
  category: string;
  subcategory: string;
  popular?: boolean;
  featured?: boolean;
  image: string;
}

// ============================================================
// DATA - PRODUITS
// ============================================================

const products: Product[] = [
  // ========== PRODUITS DIGITAUX ==========

  // E-BOOKS
  {
    id: 'ebook-resilience',
    title: 'L\'Art de la Résilience',
    subtitle: 'Rebondir face aux épreuves',
    description: 'Un guide complet pour développer votre capacité à surmonter les difficultés.',
    price: '14,90€',
    badge: 'Nouveau',
    badgeColor: '#8B5CF6',
    color: '#8B5CF6',
    icon: <Heart className="w-5 h-5" />,
    features: ['120 pages', 'Exercices pratiques', 'Témoignages'],
    format: 'E-book PDF',
    category: 'digital',
    subcategory: 'ebooks',
    image: '/boutique/ebook-resilience.jpg'
  },
  {
    id: 'ebook-confiance',
    title: 'Construire sa Confiance',
    subtitle: 'Le guide de l\'estime de soi',
    description: 'Découvrez les clés pour bâtir une confiance solide et durable.',
    price: '14,90€',
    badgeColor: '#8B5CF6',
    color: '#8B5CF6',
    icon: <Target className="w-5 h-5" />,
    features: ['100 pages', '30 exercices', 'Plan d\'action'],
    format: 'E-book PDF',
    category: 'digital',
    subcategory: 'ebooks',
    image: '/boutique/ebook-confiance.jpg'
  },
  {
    id: 'ebook-relations',
    title: 'Relations Authentiques',
    subtitle: 'Créer des liens profonds',
    description: 'Apprenez à cultiver des relations sincères et épanouissantes.',
    price: '14,90€',
    badgeColor: '#8B5CF6',
    color: '#8B5CF6',
    icon: <Users className="w-5 h-5" />,
    features: ['90 pages', 'Outils communication', 'Cas pratiques'],
    format: 'E-book PDF',
    category: 'digital',
    subcategory: 'ebooks',
    image: '/boutique/ebook-relations.jpg'
  },

  // WORKBOOKS
  {
    id: 'workbook-introspection-digital',
    title: 'Journal d\'Introspection',
    subtitle: '90 jours de réflexion',
    description: 'Un journal guidé pour explorer votre monde intérieur.',
    price: '19,90€',
    badge: 'Best-seller',
    badgeColor: '#111827',
    color: '#EC4899',
    icon: <FileText className="w-5 h-5" />,
    features: ['90 prompts', 'À imprimer', 'Suivi progression'],
    format: 'Workbook PDF',
    category: 'digital',
    subcategory: 'workbooks',
    popular: true,
    featured: true,
    image: '/boutique/workbook-introspection.jpg'
  },
  {
    id: 'workbook-gratitude-digital',
    title: 'Carnet de Gratitude',
    subtitle: '30 jours pour changer',
    description: 'Transformez votre quotidien grâce à la pratique de la gratitude.',
    price: '12,90€',
    badgeColor: '#EC4899',
    color: '#EC4899',
    icon: <Heart className="w-5 h-5" />,
    features: ['30 jours', 'Prompts quotidiens', 'Citations'],
    format: 'Workbook PDF',
    category: 'digital',
    subcategory: 'workbooks',
    image: '/boutique/workbook-gratitude.jpg'
  },
  {
    id: 'workbook-objectifs-digital',
    title: 'Planificateur d\'Objectifs',
    subtitle: 'De la vision à l\'action',
    description: 'Un système complet pour définir et atteindre vos objectifs.',
    price: '16,90€',
    badgeColor: '#EC4899',
    color: '#EC4899',
    icon: <Target className="w-5 h-5" />,
    features: ['Vision board', 'Plans mensuels', 'Tracker habitudes'],
    format: 'Workbook PDF',
    category: 'digital',
    subcategory: 'workbooks',
    image: '/boutique/workbook-objectifs.jpg'
  },

  // AUDIO
  {
    id: 'audio-meditation-pack',
    title: 'Pack Méditations Guidées',
    subtitle: '10 séances pour se recentrer',
    description: 'Une collection de méditations guidées pour cultiver le calme.',
    price: '24,90€',
    badge: 'Audio HD',
    badgeColor: '#0891B2',
    color: '#0891B2',
    icon: <Headphones className="w-5 h-5" />,
    features: ['10 méditations', '5h d\'audio', 'MP3 HD'],
    format: 'Audio MP3',
    category: 'digital',
    subcategory: 'audio',
    featured: true,
    image: '/boutique/audio-meditation.jpg'
  },
  {
    id: 'audio-affirmations',
    title: 'Affirmations Positives',
    subtitle: 'Reprogrammez votre mental',
    description: 'Des affirmations puissantes pour renforcer votre confiance.',
    price: '9,90€',
    badgeColor: '#0891B2',
    color: '#0891B2',
    icon: <MessageCircle className="w-5 h-5" />,
    features: ['100 affirmations', '2h d\'audio', 'Musique relaxante'],
    format: 'Audio MP3',
    category: 'digital',
    subcategory: 'audio',
    image: '/boutique/audio-affirmations.jpg'
  },
  {
    id: 'audio-sommeil',
    title: 'Histoires pour Dormir',
    subtitle: 'Retrouvez un sommeil paisible',
    description: 'Des récits apaisants pour vous accompagner vers le sommeil.',
    price: '14,90€',
    badgeColor: '#0891B2',
    color: '#0891B2',
    icon: <Moon className="w-5 h-5" />,
    features: ['8 histoires', '4h d\'audio', 'Sons nature'],
    format: 'Audio MP3',
    category: 'digital',
    subcategory: 'audio',
    image: '/boutique/audio-sommeil.jpg'
  },

  // FORMATIONS
  {
    id: 'masterclass-storytelling',
    title: 'Masterclass Storytelling',
    subtitle: 'Racontez votre histoire',
    description: 'Apprenez l\'art de raconter votre histoire de manière captivante.',
    price: '49€',
    originalPrice: '79€',
    badge: '-38%',
    badgeColor: '#DC2626',
    color: '#F59E0B',
    icon: <Video className="w-5 h-5" />,
    features: ['12 vidéos HD', 'Workbook 50p', 'Accès à vie'],
    format: 'Formation vidéo',
    category: 'digital',
    subcategory: 'formations',
    popular: true,
    featured: true,
    image: '/boutique/masterclass-storytelling.jpg'
  },
  {
    id: 'formation-mindset',
    title: 'Formation Mindset',
    subtitle: 'Transformez votre mental',
    description: 'Développez un état d\'esprit de croissance.',
    price: '69€',
    originalPrice: '99€',
    badge: '-30%',
    badgeColor: '#DC2626',
    color: '#F59E0B',
    icon: <Zap className="w-5 h-5" />,
    features: ['8 modules', '6h de vidéo', 'Communauté privée'],
    format: 'Formation vidéo',
    category: 'digital',
    subcategory: 'formations',
    image: '/boutique/formation-mindset.jpg'
  },
  {
    id: 'formation-emotions',
    title: 'Maîtrise Émotionnelle',
    subtitle: 'Comprendre et gérer ses émotions',
    description: 'Développez votre intelligence émotionnelle.',
    price: '59€',
    originalPrice: '89€',
    badge: '-34%',
    badgeColor: '#DC2626',
    color: '#F59E0B',
    icon: <Heart className="w-5 h-5" />,
    features: ['10 modules', '8h de vidéo', 'Certificat'],
    format: 'Formation vidéo',
    category: 'digital',
    subcategory: 'formations',
    image: '/boutique/formation-emotions.jpg'
  },

  // ========== PRODUITS PHYSIQUES ==========

  // CARNETS
  {
    id: 'carnet-vie-en-clair',
    title: 'Ma Vie en Clair',
    subtitle: 'Planner annuel complet',
    description: 'Organisez votre année avec intention.',
    price: '29€',
    badge: 'Exclusif',
    badgeColor: '#111827',
    color: '#10B981',
    icon: <Calendar className="w-5 h-5" />,
    features: ['Format A5', '240 pages', 'Couverture rigide'],
    format: 'Carnet relié',
    category: 'physical',
    subcategory: 'carnets',
    popular: true,
    featured: true,
    image: '/boutique/carnet-vie-en-clair.jpg'
  },
  {
    id: 'journal-intime-guide',
    title: 'Journal Intime Guidé',
    subtitle: '365 prompts pour se découvrir',
    description: 'Une question par jour pendant un an.',
    price: '24€',
    badgeColor: '#10B981',
    color: '#10B981',
    icon: <Feather className="w-5 h-5" />,
    features: ['365 prompts', 'Papier premium', 'Reliure cousue'],
    format: 'Journal relié',
    category: 'physical',
    subcategory: 'carnets',
    image: '/boutique/journal-intime-guide.jpg'
  },
  {
    id: 'carnet-rituels-matin',
    title: 'Rituels du Matin',
    subtitle: '90 jours de routine matinale',
    description: 'Structurez vos matins pour des journées intentionnelles.',
    price: '19€',
    badgeColor: '#10B981',
    color: '#10B981',
    icon: <Sun className="w-5 h-5" />,
    features: ['90 jours', 'Routine structurée', 'Format compact'],
    format: 'Carnet relié',
    category: 'physical',
    subcategory: 'carnets',
    image: '/boutique/carnet-rituels-matin.jpg'
  },
  {
    id: 'agenda-intentionnel',
    title: 'Agenda Intentionnel',
    subtitle: 'Semainier avec réflexion',
    description: 'Planifiez vos semaines avec intentions.',
    price: '34€',
    badge: 'Premium',
    badgeColor: '#8B5CF6',
    color: '#10B981',
    icon: <Bookmark className="w-5 h-5" />,
    features: ['52 semaines', 'Check-in émotionnel', 'Couverture cuir'],
    format: 'Agenda relié',
    category: 'physical',
    subcategory: 'carnets',
    image: '/boutique/agenda-intentionnel.jpg'
  },
  {
    id: 'bilan-de-vie',
    title: 'Mon Bilan de Vie',
    subtitle: 'Faire le point sur tous les domaines',
    description: 'Un workbook pour évaluer chaque aspect de votre vie.',
    price: '22€',
    badgeColor: '#10B981',
    color: '#10B981',
    icon: <Compass className="w-5 h-5" />,
    features: ['10 domaines', 'Exercices guidés', '100 pages'],
    format: 'Workbook relié',
    category: 'physical',
    subcategory: 'carnets',
    image: '/boutique/bilan-de-vie.jpg'
  },

  // CARTES
  {
    id: 'cartes-introspection',
    title: '52 Cartes Introspection',
    subtitle: 'Une question par semaine',
    description: 'Tirez une carte chaque semaine pour une réflexion profonde.',
    price: '19€',
    badge: 'Populaire',
    badgeColor: '#111827',
    color: '#EC4899',
    icon: <Layers className="w-5 h-5" />,
    features: ['52 cartes', 'Boîte premium', 'Finition mate'],
    format: 'Deck de cartes',
    category: 'physical',
    subcategory: 'cartes',
    popular: true,
    image: '/boutique/cartes-introspection.jpg'
  },
  {
    id: 'cartes-conversations',
    title: 'Conversations Profondes',
    subtitle: '50 cartes pour se connecter',
    description: 'Des questions pour des discussions authentiques.',
    price: '24€',
    badgeColor: '#EC4899',
    color: '#EC4899',
    icon: <MessageCircle className="w-5 h-5" />,
    features: ['50 cartes', 'Couple & amis', 'Livret inclus'],
    format: 'Deck de cartes',
    category: 'physical',
    subcategory: 'cartes',
    featured: true,
    image: '/boutique/cartes-conversations.jpg'
  },
  {
    id: 'cartes-affirmations',
    title: 'Cartes Affirmations',
    subtitle: '30 affirmations illustrées',
    description: 'Tirez une carte chaque matin.',
    price: '15€',
    badgeColor: '#EC4899',
    color: '#EC4899',
    icon: <Heart className="w-5 h-5" />,
    features: ['30 cartes', 'Illustrations', 'Format voyage'],
    format: 'Deck de cartes',
    category: 'physical',
    subcategory: 'cartes',
    image: '/boutique/cartes-affirmations-deck.jpg'
  },
  {
    id: 'cartes-et-si',
    title: 'Cartes "Et si..."',
    subtitle: '40 questions pour imaginer',
    description: 'Des questions pour explorer vos rêves.',
    price: '17€',
    badgeColor: '#EC4899',
    color: '#EC4899',
    icon: <Compass className="w-5 h-5" />,
    features: ['40 cartes', 'Imagination', 'Coaching inclus'],
    format: 'Deck de cartes',
    category: 'physical',
    subcategory: 'cartes',
    image: '/boutique/cartes-et-si.jpg'
  },

  // POSTERS
  {
    id: 'poster-vision-board',
    title: 'Poster Vision Board',
    subtitle: 'Grand format à compléter',
    description: 'Visualisez vos rêves sur ce poster à personnaliser.',
    price: '15€',
    badgeColor: '#F59E0B',
    color: '#F59E0B',
    icon: <Image className="w-5 h-5" />,
    features: ['Format A2', 'Papier épais', 'Zones à remplir'],
    format: 'Poster',
    category: 'physical',
    subcategory: 'posters',
    image: '/boutique/poster-vision-board.jpg'
  },
  {
    id: 'set-affiches-citations',
    title: 'Set 5 Affiches Citations',
    subtitle: 'Typographie soignée',
    description: 'Cinq citations inspirantes en affiches décoratives.',
    price: '25€',
    badge: 'Set complet',
    badgeColor: '#F59E0B',
    color: '#F59E0B',
    icon: <PenTool className="w-5 h-5" />,
    features: ['5 affiches A4', 'Papier premium', 'Design épuré'],
    format: 'Set d\'affiches',
    category: 'physical',
    subcategory: 'posters',
    image: '/boutique/set-affiches-citations.jpg'
  },
  {
    id: 'calendrier-inspirant',
    title: 'Calendrier Mural Inspirant',
    subtitle: '12 mois, 12 thèmes',
    description: 'Un calendrier avec un exercice chaque mois.',
    price: '22€',
    badgeColor: '#F59E0B',
    color: '#F59E0B',
    icon: <Calendar className="w-5 h-5" />,
    features: ['Format A3', '12 exercices', 'Illustrations'],
    format: 'Calendrier mural',
    category: 'physical',
    subcategory: 'posters',
    image: '/boutique/calendrier-inspirant.jpg'
  },

  // COFFRETS
  {
    id: 'coffret-nouveau-depart',
    title: 'Coffret "Nouveau Départ"',
    subtitle: 'Tout pour commencer',
    description: 'Le kit complet pour démarrer votre transformation.',
    price: '59€',
    originalPrice: '85€',
    badge: '-30%',
    badgeColor: '#DC2626',
    color: '#8B5CF6',
    icon: <Gift className="w-5 h-5" />,
    features: ['Carnet + Cartes + Poster', 'Guide digital', 'Boîte cadeau'],
    format: 'Coffret',
    category: 'physical',
    subcategory: 'coffrets',
    popular: true,
    featured: true,
    image: '/boutique/coffret-nouveau-depart.jpg'
  },
  {
    id: 'kit-rituels-soir',
    title: 'Kit Rituels du Soir',
    subtitle: 'Pour des nuits apaisées',
    description: 'Journal, cartes et méditations pour bien finir la journée.',
    price: '45€',
    originalPrice: '62€',
    badge: '-27%',
    badgeColor: '#DC2626',
    color: '#8B5CF6',
    icon: <Moon className="w-5 h-5" />,
    features: ['Journal + Cartes', 'Méditations audio', 'Pochette coton'],
    format: 'Kit',
    category: 'physical',
    subcategory: 'coffrets',
    image: '/boutique/kit-rituels-soir.jpg'
  },
  {
    id: 'box-couple-connecte',
    title: 'Box Couple Connecté',
    subtitle: 'Renforcez votre relation',
    description: 'Cartes conversation, journal partagé et guide.',
    price: '49€',
    originalPrice: '68€',
    badge: '-28%',
    badgeColor: '#DC2626',
    color: '#8B5CF6',
    icon: <Heart className="w-5 h-5" />,
    features: ['Cartes + Journal duo', 'Guide relation', 'Emballage cadeau'],
    format: 'Box',
    category: 'physical',
    subcategory: 'coffrets',
    image: '/boutique/box-couple-connecte.jpg'
  },

  // ========== PACKS ==========
  {
    id: 'pack-decouverte',
    title: 'Pack Découverte Digital',
    subtitle: 'Pour bien démarrer',
    description: 'L\'essentiel en digital : e-book + workbook + méditations.',
    price: '29,90€',
    originalPrice: '49,70€',
    badge: '-40%',
    badgeColor: '#DC2626',
    color: '#6366F1',
    icon: <Download className="w-5 h-5" />,
    features: ['1 e-book', '1 workbook', '5 méditations'],
    format: 'Pack digital',
    category: 'packs',
    subcategory: 'packs',
    image: '/boutique/pack-decouverte.jpg'
  },
  {
    id: 'pack-transformation',
    title: 'Pack Transformation',
    subtitle: 'Le programme complet',
    description: 'Tout notre catalogue digital.',
    price: '149€',
    originalPrice: '297€',
    badge: '-50%',
    badgeColor: '#DC2626',
    color: '#6366F1',
    icon: <Crown className="w-5 h-5" />,
    features: ['Toutes les formations', 'Tous les e-books', 'Tous les audios'],
    format: 'Pack complet',
    category: 'packs',
    subcategory: 'packs',
    popular: true,
    image: '/boutique/pack-transformation.jpg'
  },
  {
    id: 'abonnement-premium',
    title: 'Abonnement Premium',
    subtitle: 'Accès illimité mensuel',
    description: 'Accédez à tout notre catalogue digital.',
    price: '9,90€/mois',
    badge: 'Illimité',
    badgeColor: '#8B5CF6',
    color: '#6366F1',
    icon: <Star className="w-5 h-5" />,
    features: ['Tout le catalogue', 'Nouveautés incluses', 'Sans engagement'],
    format: 'Abonnement',
    category: 'packs',
    subcategory: 'packs',
    image: '/boutique/abonnement-premium.jpg'
  },
];

// Filtrer les produits
const featuredProducts = products.filter(p => p.featured);
const digitalProducts = products.filter(p => p.category === 'digital');
const physicalProducts = products.filter(p => p.category === 'physical');
const packProducts = products.filter(p => p.category === 'packs');

// Sous-catégories avec couleurs
const digitalSubcategories = [
  { id: 'all', label: 'Tous', color: '#111827' },
  { id: 'ebooks', label: 'E-books', color: '#8B5CF6' },
  { id: 'workbooks', label: 'Workbooks', color: '#EC4899' },
  { id: 'audio', label: 'Audio', color: '#0891B2' },
  { id: 'formations', label: 'Formations', color: '#F59E0B' },
];

const physicalSubcategories = [
  { id: 'all', label: 'Tous', color: '#111827' },
  { id: 'carnets', label: 'Carnets', color: '#10B981' },
  { id: 'cartes', label: 'Cartes', color: '#EC4899' },
  { id: 'posters', label: 'Posters', color: '#F59E0B' },
  { id: 'coffrets', label: 'Coffrets', color: '#8B5CF6' },
];

// ============================================================
// COMPOSANTS
// ============================================================

// Modal de notification produit
const ProductModal: React.FC<{
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ product, isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Reset state when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setIsSubmitted(false);
    }
  }, [isOpen]);

  // Bloquer le scroll du body quand la modal est ouverte
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
    }
  };

  if (!isOpen || !product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Container centré avec scroll */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-md my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                {/* Header avec image */}
                <div className="relative h-44 sm:h-52">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                  {/* Close button */}
                  <button
                    onClick={onClose}
                    className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                  >
                    <X className="w-5 h-5 text-gray-700" />
                  </button>

                  {/* Badge format */}
                  <span
                    className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase text-white"
                    style={{ backgroundColor: product.color }}
                  >
                    {product.format}
                  </span>

                  {/* Infos produit sur l'image */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-0.5 drop-shadow-sm">
                      {typo(product.title)}
                    </h3>
                    <p className="text-white/80 text-xs sm:text-sm">{product.subtitle}</p>
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-4 sm:p-5">
                  {/* Prix */}
                  <div className="flex flex-wrap items-baseline gap-2 mb-3">
                    <span className="text-xl sm:text-2xl font-bold text-gray-900">{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">{product.originalPrice}</span>
                    )}
                    <span
                      className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase text-white"
                      style={{ backgroundColor: '#F59E0B' }}
                    >
                      Bientôt disponible
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                    {typo(product.description)}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {product.features.map((feature, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-[11px] text-gray-700"
                      >
                        <Check className="w-3 h-3" style={{ color: product.color }} />
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Formulaire notification */}
                  {!isSubmitted ? (
                    <form onSubmit={handleSubmit}>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-1.5 bg-gray-100 rounded-xl">
                        <div className="flex-1 relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Votre email"
                            required
                            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                          />
                        </div>
                        <button
                          type="submit"
                          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg font-semibold text-sm hover:bg-gray-800 transition-colors"
                        >
                          <Bell className="w-4 h-4" />
                          <span>Être notifié</span>
                        </button>
                      </div>
                      <p className="text-center text-gray-400 text-[11px] mt-2">
                        Recevez un email dès que ce produit sera disponible
                      </p>
                    </form>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center p-4 bg-emerald-50 rounded-xl"
                    >
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Check className="w-5 h-5 text-emerald-600" />
                      </div>
                      <p className="font-semibold text-emerald-900 text-sm mb-0.5">Vous êtes inscrit !</p>
                      <p className="text-emerald-700 text-xs">
                        Nous vous préviendrons dès que ce produit sera disponible.
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

// Carte produit - Style homepage
const ProductCard: React.FC<{ product: Product; index: number; onClick: () => void }> = ({ product, index, onClick }) => {
  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div
        className="relative rounded-2xl overflow-hidden transition-all duration-500 group-hover:scale-[1.02]"
        style={{
          boxShadow: '0 4px 20px -4px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)',
        }}
      >
        {/* Image zone */}
        <div
          className="relative aspect-[4/5] overflow-hidden"
          style={{ backgroundColor: `${product.color}10` }}
        >
          {/* Image produit */}
          <img
            src={product.image}
            alt={product.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

          {/* Badge */}
          {product.badge && (
            <div className="absolute top-4 left-4 z-10">
              <span
                className="inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide text-white"
                style={{
                  backgroundColor: product.badgeColor,
                  boxShadow: `0 4px 12px ${product.badgeColor}50`
                }}
              >
                {product.badge}
              </span>
            </div>
          )}

          {/* Popular star */}
          {product.popular && !product.badge && (
            <div className="absolute top-4 right-4 z-10">
              <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center shadow-lg">
                <Star className="w-4 h-4 text-white fill-white" />
              </div>
            </div>
          )}

          {/* Coming Soon badge */}
          <div className="absolute top-4 right-4 z-10">
            <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold text-gray-700 shadow">
              Bientôt
            </span>
          </div>

          {/* Contenu en bas */}
          <div className="absolute inset-x-0 bottom-0 p-5 transform transition-transform duration-300 group-hover:translate-y-[-4px]">
            {/* Format */}
            <span
              className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide text-white mb-3"
              style={{ backgroundColor: product.color }}
            >
              {product.format}
            </span>

            {/* Title */}
            <h3 className="font-bold text-white text-base leading-snug line-clamp-2 mb-1.5 drop-shadow-sm">
              {typo(product.title)}
            </h3>

            {/* Subtitle */}
            <p className="text-white/80 text-sm line-clamp-1 mb-3">
              {product.subtitle}
            </p>

            {/* Prix et CTA */}
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-white">{product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-white/60 line-through">{product.originalPrice}</span>
                )}
              </div>
              <span
                className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-300 group-hover:gap-2.5"
                style={{ color: product.color }}
              >
                Voir
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

// Tabs filtres - Style homepage
const FilterTabs: React.FC<{
  categories: Array<{ id: string; label: string; color: string }>;
  activeCategory: string;
  setActiveCategory: (id: string) => void;
  products: Product[];
  layoutId: string;
}> = ({ categories, activeCategory, setActiveCategory, products, layoutId }) => (
  <div className="flex flex-wrap gap-1.5">
    {categories.map(cat => {
      const isActive = activeCategory === cat.id;
      const count = cat.id === 'all'
        ? products.length
        : products.filter(p => p.subcategory === cat.id).length;

      return (
        <button
          key={cat.id}
          onClick={() => setActiveCategory(cat.id)}
          className="relative inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-300"
        >
          {isActive && (
            <motion.div
              layoutId={layoutId}
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: cat.color }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span
            className="relative z-10 transition-colors duration-300"
            style={{ color: isActive ? 'white' : '#6B7280' }}
          >
            {cat.label}
          </span>
          <span
            className="relative z-10 text-[10px] px-1.5 py-0.5 rounded-full font-medium transition-all duration-300"
            style={{
              backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : `${cat.color}15`,
              color: isActive ? 'white' : cat.color,
            }}
          >
            {count}
          </span>
        </button>
      );
    })}
  </div>
);

// ============================================================
// PAGE PRINCIPALE
// ============================================================

const BoutiquePage: React.FC = () => {
  const [activeDigitalCategory, setActiveDigitalCategory] = useState('all');
  const [activePhysicalCategory, setActivePhysicalCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  const filteredDigital = activeDigitalCategory === 'all'
    ? digitalProducts
    : digitalProducts.filter(p => p.subcategory === activeDigitalCategory);

  const filteredPhysical = activePhysicalCategory === 'all'
    ? physicalProducts
    : physicalProducts.filter(p => p.subcategory === activePhysicalCategory);

  return (
    <>
      <SEO
        title="Boutique | Origines Media"
        description="Découvrez nos e-books, workbooks, carnets, cartes et formations pour votre développement personnel."
        type="website"
      />
      <Navbar />

      <main className="min-h-screen bg-white">

        {/* Modal Produit */}
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={closeModal}
        />

        {/* ============================================================ */}
        {/* HERO - Layout 2 colonnes */}
        {/* ============================================================ */}
        <section className="py-10 sm:py-12 lg:py-20 bg-gradient-to-b from-amber-50/50 to-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

              {/* Colonne gauche - Texte */}
              <div>
                {/* Header style homepage */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-3 mb-4"
                >
                  <div className="h-1 w-8 bg-amber-500 rounded-full" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Boutique</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight"
                >
                  {typo("Des ressources pour grandir")}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-gray-600 text-lg leading-relaxed mb-8 max-w-lg"
                >
                  {typo("E-books, workbooks, formations et objets soigneusement conçus pour accompagner votre développement personnel.")}
                </motion.p>

                {/* Stats inline */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex flex-wrap items-center gap-6 mb-8"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900">{products.length}</span>
                    <span className="text-sm text-gray-500">produits</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                    <span className="text-2xl font-bold text-gray-900">4.9</span>
                    <span className="text-sm text-gray-500">satisfaction</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900">2.5k+</span>
                    <span className="text-sm text-gray-500">clients</span>
                  </div>
                </motion.div>

                {/* CTA noir style homepage */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Link
                    to="/newsletter"
                    className="group inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full font-medium text-sm hover:bg-gray-800 transition-all hover:scale-105"
                  >
                    <span>Être notifié au lancement</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </div>

              {/* Colonne droite - Preview produits */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="hidden lg:block"
              >
                <div className="relative">
                  {/* Grille de mini-cartes produits */}
                  <div className="grid grid-cols-2 gap-3">
                    {featuredProducts.slice(0, 4).map((product, i) => (
                      <div
                        key={product.id}
                        onClick={() => openModal(product)}
                        className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-xl cursor-pointer"
                        style={{
                          boxShadow: '0 4px 20px -4px rgba(0,0,0,0.1)',
                        }}
                      >
                        {/* Image */}
                        <div className="aspect-square relative">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                          {/* Badge format */}
                          <span
                            className="absolute top-3 left-3 px-2 py-1 rounded-full text-[9px] font-bold uppercase text-white"
                            style={{ backgroundColor: product.color }}
                          >
                            {product.format.split(' ')[0]}
                          </span>

                          {/* Contenu bas */}
                          <div className="absolute bottom-3 left-3 right-3">
                            <p className="text-white font-semibold text-sm leading-tight line-clamp-1">
                              {product.title}
                            </p>
                            <p className="text-white/70 text-xs mt-0.5">{product.price}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Badge flottant */}
                  <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Bientôt disponible</p>
                      <p className="text-xs text-gray-500">Collection 2026</p>
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* TRUST BADGES */}
        {/* ============================================================ */}
        <section className="py-6 border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500" />
                Paiement sécurisé
              </span>
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-amber-500" />
                Satisfait ou remboursé
              </span>
              <span className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-500" />
                Livraison rapide
              </span>
              <span className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-fuchsia-500" />
                Support réactif
              </span>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* FEATURED - Sélection */}
        {/* ============================================================ */}
        <section className="py-10 sm:py-12 lg:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header style homepage */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-8">
              <div className="max-w-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-1 w-8 bg-amber-500 rounded-full" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Sélection</span>
                </div>
                <h2 className="text-2xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                  Nos coups de cœur
                </h2>
                <p className="text-gray-600 text-base leading-relaxed">
                  {typo("Les produits les plus populaires, sélectionnés pour leur impact transformateur sur votre quotidien.")}
                </p>
              </div>

              <Link
                to="/newsletter"
                className="group inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full font-medium text-xs hover:bg-gray-800 transition-colors self-start lg:self-center flex-shrink-0"
              >
                <span>Être notifié</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {featuredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} onClick={() => openModal(product)} />
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* DIGITAL PRODUCTS */}
        {/* ============================================================ */}
        <section className="py-10 sm:py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                <div className="max-w-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-1 w-8 bg-violet-500 rounded-full" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Télécharger</span>
                  </div>
                  <h2 className="text-2xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    Produits digitaux
                  </h2>
                  <p className="text-gray-600 text-base leading-relaxed">
                    {typo("E-books, workbooks, méditations et formations vidéo. Téléchargez et commencez immédiatement.")}
                  </p>
                </div>

                <Link
                  to="/newsletter"
                  className="group inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full font-medium text-xs hover:bg-gray-800 transition-colors self-start lg:self-center flex-shrink-0"
                >
                  <span>Tout voir</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Tabs */}
              <FilterTabs
                categories={digitalSubcategories}
                activeCategory={activeDigitalCategory}
                setActiveCategory={setActiveDigitalCategory}
                products={digitalProducts}
                layoutId="digitalTabIndicator"
              />
            </div>

            {/* Grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDigitalCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
              >
                {filteredDigital.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} onClick={() => openModal(product)} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* ============================================================ */}
        {/* PHYSICAL PRODUCTS */}
        {/* ============================================================ */}
        <section className="py-10 sm:py-12 lg:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                <div className="max-w-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-1 w-8 bg-emerald-500 rounded-full" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Commander</span>
                  </div>
                  <h2 className="text-2xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    Produits physiques
                  </h2>
                  <p className="text-gray-600 text-base leading-relaxed">
                    {typo("Carnets, planners, cartes et coffrets. Des objets beaux et utiles pour votre quotidien.")}
                  </p>
                </div>

                <Link
                  to="/newsletter"
                  className="group inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full font-medium text-xs hover:bg-gray-800 transition-colors self-start lg:self-center flex-shrink-0"
                >
                  <span>Tout voir</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Tabs */}
              <FilterTabs
                categories={physicalSubcategories}
                activeCategory={activePhysicalCategory}
                setActiveCategory={setActivePhysicalCategory}
                products={physicalProducts}
                layoutId="physicalTabIndicator"
              />
            </div>

            {/* Grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activePhysicalCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
              >
                {filteredPhysical.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} onClick={() => openModal(product)} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* ============================================================ */}
        {/* PACKS */}
        {/* ============================================================ */}
        <section className="py-10 sm:py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header centré */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="h-1 w-8 bg-indigo-500 rounded-full" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Économiser</span>
                <div className="h-1 w-8 bg-indigo-500 rounded-full" />
              </div>
              <h2 className="text-2xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                Packs & Abonnements
              </h2>
              <p className="text-gray-600 text-base leading-relaxed max-w-lg mx-auto">
                {typo("Économisez jusqu'à 50% avec nos offres groupées. Accédez à tout notre catalogue.")}
              </p>
            </div>

            {/* Grid - 3 colonnes centrées */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 max-w-4xl mx-auto">
              {packProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} onClick={() => openModal(product)} />
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* NEWSLETTER CTA */}
        {/* ============================================================ */}
        <section className="py-10 sm:py-12 lg:py-16 bg-gray-900">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              {typo("Soyez les premiers informés")}
            </h2>

            <p className="text-gray-400 text-base mb-8 max-w-xl mx-auto leading-relaxed">
              {typo("Inscrivez-vous pour être prévenu dès le lancement et bénéficier d'offres exclusives réservées aux early adopters.")}
            </p>

            <Link
              to="/newsletter"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-all hover:scale-105"
            >
              <span>S'inscrire à la newsletter</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <p className="text-gray-500 text-sm mt-6">
              Rejoignez 2,500+ abonnés • Pas de spam
            </p>
          </div>
        </section>

        {/* ============================================================ */}
        {/* FAQ */}
        {/* ============================================================ */}
        <section className="py-10 sm:py-12 lg:py-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                Questions fréquentes
              </h2>
              <p className="text-gray-600 text-base">
                Tout ce que vous devez savoir
              </p>
            </div>

            {/* FAQ Items */}
            <div className="space-y-3">
              {[
                {
                  q: "Quand la boutique sera-t-elle disponible ?",
                  a: "Nous préparons soigneusement chaque produit. Inscrivez-vous à la newsletter pour être informé du lancement."
                },
                {
                  q: "Comment accéder à mes achats digitaux ?",
                  a: "Après votre achat, vous recevrez un email avec un lien de téléchargement immédiat."
                },
                {
                  q: "Livrez-vous en Europe ?",
                  a: "Oui, nous livrons en France métropolitaine et dans toute l'Europe."
                },
                {
                  q: "Quelle est votre politique de remboursement ?",
                  a: "Garantie satisfait ou remboursé de 14 jours sur tous nos produits, sans question."
                },
                {
                  q: "Proposez-vous le paiement en plusieurs fois ?",
                  a: "Oui, pour les achats à partir de 50€, paiement en 3 fois sans frais disponible."
                }
              ].map((faq, i) => (
                <div
                  key={i}
                  className="p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900 mb-1.5">{faq.q}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{typo(faq.a)}</p>
                </div>
              ))}
            </div>

            {/* Contact CTA */}
            <div className="mt-8 text-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-gray-600 font-medium hover:text-gray-900 transition-colors text-sm"
              >
                D'autres questions ? Contactez-nous
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
};

export default BoutiquePage;
