// src/pages/BoutiquePage.tsx
// V2 — Angular editorial boutique

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import SiteHeader from '@/components/SiteHeader/SiteHeader';
import Footer2 from '@/components/Footer2/Footer2';
import ScrollToTopV2 from '@/components/ScrollToTop/ScrollToTopV2';
import SEO from '../components/SEO';
import { typo } from '../lib/typography';
import { useSubscribe } from '../hooks/useSubscribe';
import s from './BoutiquePage.module.css';

// ============================================================
// INLINE SVG ICONS
// ============================================================

const IconArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconStar = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const IconStarOutline = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const IconRefresh = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
    <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

const IconTruck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
    <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const IconMessage = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
    <rect x="2" y="4" width="20" height="16" /><polyline points="22 4 12 13 2 4" />
  </svg>
);

const IconBell = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

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
    title: "L'Art de la Resilience",
    subtitle: 'Rebondir face aux epreuves',
    description: 'Un guide complet pour developper votre capacite a surmonter les difficultes.',
    price: '14,90€',
    badge: 'Nouveau',
    badgeColor: '#8B5CF6',
    color: '#8B5CF6',
    features: ['120 pages', 'Exercices pratiques', 'Temoignages'],
    format: 'E-book PDF',
    category: 'digital',
    subcategory: 'ebooks',
    image: '/boutique/ebook-resilience.jpg',
  },
  {
    id: 'ebook-confiance',
    title: 'Construire sa Confiance',
    subtitle: "Le guide de l'estime de soi",
    description: 'Decouvrez les cles pour batir une confiance solide et durable.',
    price: '14,90€',
    badgeColor: '#8B5CF6',
    color: '#8B5CF6',
    features: ['100 pages', '30 exercices', "Plan d'action"],
    format: 'E-book PDF',
    category: 'digital',
    subcategory: 'ebooks',
    image: '/boutique/ebook-confiance.jpg',
  },
  {
    id: 'ebook-relations',
    title: 'Relations Authentiques',
    subtitle: 'Creer des liens profonds',
    description: 'Apprenez a cultiver des relations sinceres et epanouissantes.',
    price: '14,90€',
    badgeColor: '#8B5CF6',
    color: '#8B5CF6',
    features: ['90 pages', 'Outils communication', 'Cas pratiques'],
    format: 'E-book PDF',
    category: 'digital',
    subcategory: 'ebooks',
    image: '/boutique/ebook-relations.jpg',
  },

  // WORKBOOKS
  {
    id: 'workbook-introspection-digital',
    title: "Journal d'Introspection",
    subtitle: '90 jours de reflexion',
    description: 'Un journal guide pour explorer votre monde interieur.',
    price: '19,90€',
    badge: 'Best-seller',
    badgeColor: '#111827',
    color: '#EC4899',
    features: ['90 prompts', 'A imprimer', 'Suivi progression'],
    format: 'Workbook PDF',
    category: 'digital',
    subcategory: 'workbooks',
    popular: true,
    featured: true,
    image: '/boutique/workbook-introspection.jpg',
  },
  {
    id: 'workbook-gratitude-digital',
    title: 'Carnet de Gratitude',
    subtitle: '30 jours pour changer',
    description: 'Transformez votre quotidien grace a la pratique de la gratitude.',
    price: '12,90€',
    badgeColor: '#EC4899',
    color: '#EC4899',
    features: ['30 jours', 'Prompts quotidiens', 'Citations'],
    format: 'Workbook PDF',
    category: 'digital',
    subcategory: 'workbooks',
    image: '/boutique/workbook-gratitude.jpg',
  },
  {
    id: 'workbook-objectifs-digital',
    title: "Planificateur d'Objectifs",
    subtitle: "De la vision a l'action",
    description: 'Un systeme complet pour definir et atteindre vos objectifs.',
    price: '16,90€',
    badgeColor: '#EC4899',
    color: '#EC4899',
    features: ['Vision board', 'Plans mensuels', 'Tracker habitudes'],
    format: 'Workbook PDF',
    category: 'digital',
    subcategory: 'workbooks',
    image: '/boutique/workbook-objectifs.jpg',
  },

  // AUDIO
  {
    id: 'audio-meditation-pack',
    title: 'Pack Meditations Guidees',
    subtitle: '10 seances pour se recentrer',
    description: 'Une collection de meditations guidees pour cultiver le calme.',
    price: '24,90€',
    badge: 'Audio HD',
    badgeColor: '#0891B2',
    color: '#0891B2',
    features: ['10 meditations', "5h d'audio", 'MP3 HD'],
    format: 'Audio MP3',
    category: 'digital',
    subcategory: 'audio',
    featured: true,
    image: '/boutique/audio-meditation.jpg',
  },
  {
    id: 'audio-affirmations',
    title: 'Affirmations Positives',
    subtitle: 'Reprogrammez votre mental',
    description: 'Des affirmations puissantes pour renforcer votre confiance.',
    price: '9,90€',
    badgeColor: '#0891B2',
    color: '#0891B2',
    features: ['100 affirmations', "2h d'audio", 'Musique relaxante'],
    format: 'Audio MP3',
    category: 'digital',
    subcategory: 'audio',
    image: '/boutique/audio-affirmations.jpg',
  },
  {
    id: 'audio-sommeil',
    title: 'Histoires pour Dormir',
    subtitle: 'Retrouvez un sommeil paisible',
    description: 'Des recits apaisants pour vous accompagner vers le sommeil.',
    price: '14,90€',
    badgeColor: '#0891B2',
    color: '#0891B2',
    features: ['8 histoires', "4h d'audio", 'Sons nature'],
    format: 'Audio MP3',
    category: 'digital',
    subcategory: 'audio',
    image: '/boutique/audio-sommeil.jpg',
  },

  // FORMATIONS
  {
    id: 'masterclass-storytelling',
    title: 'Masterclass Storytelling',
    subtitle: 'Racontez votre histoire',
    description: "Apprenez l'art de raconter votre histoire de maniere captivante.",
    price: '49€',
    originalPrice: '79€',
    badge: '-38%',
    badgeColor: '#DC2626',
    color: '#F59E0B',
    features: ['12 videos HD', 'Workbook 50p', 'Acces a vie'],
    format: 'Formation video',
    category: 'digital',
    subcategory: 'formations',
    popular: true,
    featured: true,
    image: '/boutique/masterclass-storytelling.jpg',
  },
  {
    id: 'formation-mindset',
    title: 'Formation Mindset',
    subtitle: 'Transformez votre mental',
    description: "Developpez un etat d'esprit de croissance.",
    price: '69€',
    originalPrice: '99€',
    badge: '-30%',
    badgeColor: '#DC2626',
    color: '#F59E0B',
    features: ['8 modules', '6h de video', 'Communaute privee'],
    format: 'Formation video',
    category: 'digital',
    subcategory: 'formations',
    image: '/boutique/formation-mindset.jpg',
  },
  {
    id: 'formation-emotions',
    title: 'Maitrise Emotionnelle',
    subtitle: 'Comprendre et gerer ses emotions',
    description: 'Developpez votre intelligence emotionnelle.',
    price: '59€',
    originalPrice: '89€',
    badge: '-34%',
    badgeColor: '#DC2626',
    color: '#F59E0B',
    features: ['10 modules', '8h de video', 'Certificat'],
    format: 'Formation video',
    category: 'digital',
    subcategory: 'formations',
    image: '/boutique/formation-emotions.jpg',
  },

  // ========== PRODUITS PHYSIQUES ==========

  // CARNETS
  {
    id: 'carnet-vie-en-clair',
    title: 'Ma Vie en Clair',
    subtitle: 'Planner annuel complet',
    description: 'Organisez votre annee avec intention.',
    price: '29€',
    badge: 'Exclusif',
    badgeColor: '#111827',
    color: '#10B981',
    features: ['Format A5', '240 pages', 'Couverture rigide'],
    format: 'Carnet relie',
    category: 'physical',
    subcategory: 'carnets',
    popular: true,
    featured: true,
    image: '/boutique/carnet-vie-en-clair.jpg',
  },
  {
    id: 'journal-intime-guide',
    title: 'Journal Intime Guide',
    subtitle: '365 prompts pour se decouvrir',
    description: 'Une question par jour pendant un an.',
    price: '24€',
    badgeColor: '#10B981',
    color: '#10B981',
    features: ['365 prompts', 'Papier premium', 'Reliure cousue'],
    format: 'Journal relie',
    category: 'physical',
    subcategory: 'carnets',
    image: '/boutique/journal-intime-guide.jpg',
  },
  {
    id: 'carnet-rituels-matin',
    title: 'Rituels du Matin',
    subtitle: '90 jours de routine matinale',
    description: 'Structurez vos matins pour des journees intentionnelles.',
    price: '19€',
    badgeColor: '#10B981',
    color: '#10B981',
    features: ['90 jours', 'Routine structuree', 'Format compact'],
    format: 'Carnet relie',
    category: 'physical',
    subcategory: 'carnets',
    image: '/boutique/carnet-rituels-matin.jpg',
  },
  {
    id: 'agenda-intentionnel',
    title: 'Agenda Intentionnel',
    subtitle: 'Semainier avec reflexion',
    description: 'Planifiez vos semaines avec intentions.',
    price: '34€',
    badge: 'Premium',
    badgeColor: '#8B5CF6',
    color: '#10B981',
    features: ['52 semaines', 'Check-in emotionnel', 'Couverture cuir'],
    format: 'Agenda relie',
    category: 'physical',
    subcategory: 'carnets',
    image: '/boutique/agenda-intentionnel.jpg',
  },
  {
    id: 'bilan-de-vie',
    title: 'Mon Bilan de Vie',
    subtitle: 'Faire le point sur tous les domaines',
    description: 'Un workbook pour evaluer chaque aspect de votre vie.',
    price: '22€',
    badgeColor: '#10B981',
    color: '#10B981',
    features: ['10 domaines', 'Exercices guides', '100 pages'],
    format: 'Workbook relie',
    category: 'physical',
    subcategory: 'carnets',
    image: '/boutique/bilan-de-vie.jpg',
  },

  // CARTES
  {
    id: 'cartes-introspection',
    title: '52 Cartes Introspection',
    subtitle: 'Une question par semaine',
    description: 'Tirez une carte chaque semaine pour une reflexion profonde.',
    price: '19€',
    badge: 'Populaire',
    badgeColor: '#111827',
    color: '#EC4899',
    features: ['52 cartes', 'Boite premium', 'Finition mate'],
    format: 'Deck de cartes',
    category: 'physical',
    subcategory: 'cartes',
    popular: true,
    image: '/boutique/cartes-introspection.jpg',
  },
  {
    id: 'cartes-conversations',
    title: 'Conversations Profondes',
    subtitle: '50 cartes pour se connecter',
    description: 'Des questions pour des discussions authentiques.',
    price: '24€',
    badgeColor: '#EC4899',
    color: '#EC4899',
    features: ['50 cartes', 'Couple & amis', 'Livret inclus'],
    format: 'Deck de cartes',
    category: 'physical',
    subcategory: 'cartes',
    featured: true,
    image: '/boutique/cartes-conversations.jpg',
  },
  {
    id: 'cartes-affirmations',
    title: 'Cartes Affirmations',
    subtitle: '30 affirmations illustrees',
    description: 'Tirez une carte chaque matin.',
    price: '15€',
    badgeColor: '#EC4899',
    color: '#EC4899',
    features: ['30 cartes', 'Illustrations', 'Format voyage'],
    format: 'Deck de cartes',
    category: 'physical',
    subcategory: 'cartes',
    image: '/boutique/cartes-affirmations-deck.jpg',
  },
  {
    id: 'cartes-et-si',
    title: 'Cartes "Et si..."',
    subtitle: '40 questions pour imaginer',
    description: 'Des questions pour explorer vos reves.',
    price: '17€',
    badgeColor: '#EC4899',
    color: '#EC4899',
    features: ['40 cartes', 'Imagination', 'Coaching inclus'],
    format: 'Deck de cartes',
    category: 'physical',
    subcategory: 'cartes',
    image: '/boutique/cartes-et-si.jpg',
  },

  // POSTERS
  {
    id: 'poster-vision-board',
    title: 'Poster Vision Board',
    subtitle: 'Grand format a completer',
    description: 'Visualisez vos reves sur ce poster a personnaliser.',
    price: '15€',
    badgeColor: '#F59E0B',
    color: '#F59E0B',
    features: ['Format A2', 'Papier epais', 'Zones a remplir'],
    format: 'Poster',
    category: 'physical',
    subcategory: 'posters',
    image: '/boutique/poster-vision-board.jpg',
  },
  {
    id: 'set-affiches-citations',
    title: 'Set 5 Affiches Citations',
    subtitle: 'Typographie soignee',
    description: 'Cinq citations inspirantes en affiches decoratives.',
    price: '25€',
    badge: 'Set complet',
    badgeColor: '#F59E0B',
    color: '#F59E0B',
    features: ['5 affiches A4', 'Papier premium', 'Design epure'],
    format: "Set d'affiches",
    category: 'physical',
    subcategory: 'posters',
    image: '/boutique/set-affiches-citations.jpg',
  },
  {
    id: 'calendrier-inspirant',
    title: 'Calendrier Mural Inspirant',
    subtitle: '12 mois, 12 themes',
    description: 'Un calendrier avec un exercice chaque mois.',
    price: '22€',
    badgeColor: '#F59E0B',
    color: '#F59E0B',
    features: ['Format A3', '12 exercices', 'Illustrations'],
    format: 'Calendrier mural',
    category: 'physical',
    subcategory: 'posters',
    image: '/boutique/calendrier-inspirant.jpg',
  },

  // COFFRETS
  {
    id: 'coffret-nouveau-depart',
    title: 'Coffret "Nouveau Depart"',
    subtitle: 'Tout pour commencer',
    description: 'Le kit complet pour demarrer votre transformation.',
    price: '59€',
    originalPrice: '85€',
    badge: '-30%',
    badgeColor: '#DC2626',
    color: '#8B5CF6',
    features: ['Carnet + Cartes + Poster', 'Guide digital', 'Boite cadeau'],
    format: 'Coffret',
    category: 'physical',
    subcategory: 'coffrets',
    popular: true,
    featured: true,
    image: '/boutique/coffret-nouveau-depart.jpg',
  },
  {
    id: 'kit-rituels-soir',
    title: 'Kit Rituels du Soir',
    subtitle: 'Pour des nuits apaisees',
    description: 'Journal, cartes et meditations pour bien finir la journee.',
    price: '45€',
    originalPrice: '62€',
    badge: '-27%',
    badgeColor: '#DC2626',
    color: '#8B5CF6',
    features: ['Journal + Cartes', 'Meditations audio', 'Pochette coton'],
    format: 'Kit',
    category: 'physical',
    subcategory: 'coffrets',
    image: '/boutique/kit-rituels-soir.jpg',
  },
  {
    id: 'box-couple-connecte',
    title: 'Box Couple Connecte',
    subtitle: 'Renforcez votre relation',
    description: 'Cartes conversation, journal partage et guide.',
    price: '49€',
    originalPrice: '68€',
    badge: '-28%',
    badgeColor: '#DC2626',
    color: '#8B5CF6',
    features: ['Cartes + Journal duo', 'Guide relation', 'Emballage cadeau'],
    format: 'Box',
    category: 'physical',
    subcategory: 'coffrets',
    image: '/boutique/box-couple-connecte.jpg',
  },

  // ========== PACKS ==========
  {
    id: 'pack-decouverte',
    title: 'Pack Decouverte Digital',
    subtitle: 'Pour bien demarrer',
    description: "L'essentiel en digital : e-book + workbook + meditations.",
    price: '29,90€',
    originalPrice: '49,70€',
    badge: '-40%',
    badgeColor: '#DC2626',
    color: '#6366F1',
    features: ['1 e-book', '1 workbook', '5 meditations'],
    format: 'Pack digital',
    category: 'packs',
    subcategory: 'packs',
    image: '/boutique/pack-decouverte.jpg',
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
    features: ['Toutes les formations', 'Tous les e-books', 'Tous les audios'],
    format: 'Pack complet',
    category: 'packs',
    subcategory: 'packs',
    popular: true,
    image: '/boutique/pack-transformation.jpg',
  },
  {
    id: 'abonnement-premium',
    title: 'Abonnement Premium',
    subtitle: 'Acces illimite mensuel',
    description: 'Accedez a tout notre catalogue digital.',
    price: '9,90€/mois',
    badge: 'Illimite',
    badgeColor: '#8B5CF6',
    color: '#6366F1',
    features: ['Tout le catalogue', 'Nouveautes incluses', 'Sans engagement'],
    format: 'Abonnement',
    category: 'packs',
    subcategory: 'packs',
    image: '/boutique/abonnement-premium.jpg',
  },
];

// Filtrer les produits
const featuredProducts = products.filter((p) => p.featured);
const digitalProducts = products.filter((p) => p.category === 'digital');
const physicalProducts = products.filter((p) => p.category === 'physical');
const packProducts = products.filter((p) => p.category === 'packs');

// Sous-categories avec couleurs
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

// FAQ data (extracted for SEO structured data)
const faqItems = [
  {
    question: 'Quand la boutique sera-t-elle disponible ?',
    answer:
      'Nous preparons soigneusement chaque produit. Inscrivez-vous a la newsletter pour etre informe du lancement.',
  },
  {
    question: 'Comment acceder a mes achats digitaux ?',
    answer:
      "Apres votre achat, vous recevrez un email avec un lien de telechargement immediat.",
  },
  {
    question: 'Livrez-vous en Europe ?',
    answer:
      "Oui, nous livrons en France metropolitaine et dans toute l'Europe.",
  },
  {
    question: 'Quelle est votre politique de remboursement ?',
    answer:
      'Garantie satisfait ou rembourse de 14 jours sur tous nos produits, sans question.',
  },
  {
    question: 'Proposez-vous le paiement en plusieurs fois ?',
    answer:
      "Oui, pour les achats a partir de 50€, paiement en 3 fois sans frais disponible.",
  },
];

// ============================================================
// COMPOSANTS
// ============================================================

/* ── Modal de notification produit ── */

const ProductModal: React.FC<{
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ product, isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const { status, subscribe, reset } = useSubscribe({
    source: 'boutique',
    productId: product?.id,
    productName: product?.title,
  });

  // Reset state when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setEmail('');
      reset();
    }
  }, [isOpen, reset]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && status !== 'loading') {
      await subscribe(email);
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
            className={s.modalOverlay}
            onClick={onClose}
          />

          {/* Container centre avec scroll */}
          <div className={s.modalWrapper}>
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 16 }}
              transition={{ type: 'spring', duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={s.modalCard}>
                {/* Header avec image */}
                <div className={s.modalImageWrap}>
                  <img src={product.image} alt={product.title} />
                  <div className={s.modalImageOverlay} />

                  {/* Close button */}
                  <button onClick={onClose} className={s.modalClose}>
                    <IconX />
                  </button>

                  {/* Badge format */}
                  <span
                    className={s.modalFormatBadge}
                    style={{ backgroundColor: product.color }}
                  >
                    {product.format}
                  </span>

                  {/* Infos produit sur l'image */}
                  <div className={s.modalProductInfo}>
                    <h3 className={s.modalProductTitle}>
                      {typo(product.title)}
                    </h3>
                    <p className={s.modalProductSubtitle}>
                      {product.subtitle}
                    </p>
                  </div>
                </div>

                {/* Contenu */}
                <div className={s.modalBody}>
                  {/* Prix */}
                  <div className={s.modalPriceRow}>
                    <span className={s.modalPrice}>{product.price}</span>
                    {product.originalPrice && (
                      <span className={s.modalOriginalPrice}>
                        {product.originalPrice}
                      </span>
                    )}
                    <span className={s.modalSoonBadge}>Bientot disponible</span>
                  </div>

                  {/* Description */}
                  <p className={s.modalDescription}>
                    {typo(product.description)}
                  </p>

                  {/* Features */}
                  <div className={s.modalFeatures}>
                    {product.features.map((feature, i) => (
                      <span key={i} className={s.modalFeature}>
                        <span style={{ color: product.color }}>
                          <IconCheck />
                        </span>
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Formulaire notification */}
                  {status !== 'success' ? (
                    <form onSubmit={handleSubmit}>
                      <div className={s.notifyForm}>
                        <div className={s.notifyInputWrap}>
                          <IconMail />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Votre email"
                            required
                            autoComplete="email"
                            spellCheck="false"
                            disabled={status === 'loading'}
                            className={s.notifyInput}
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={status === 'loading' || !email}
                          className={s.notifyBtn}
                        >
                          <IconBell />
                          <span>
                            {status === 'loading' ? 'Envoi...' : 'Etre notifie'}
                          </span>
                        </button>
                      </div>
                      <p className={s.notifyHint}>
                        Recevez un email des que ce produit sera disponible
                      </p>
                      {status === 'error' && (
                        <p className={s.notifyError}>
                          Une erreur est survenue. Reessayez.
                        </p>
                      )}
                    </form>
                  ) : (
                    <div className={s.notifySuccess}>
                      <div className={s.notifySuccessIcon}>
                        <IconCheck />
                      </div>
                      <p className={s.notifySuccessTitle}>
                        Vous etes inscrit !
                      </p>
                      <p className={s.notifySuccessText}>
                        Nous vous previendrons des que ce produit sera
                        disponible.
                      </p>
                    </div>
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

/* ── Carte produit ── */

const ProductCard: React.FC<{
  product: Product;
  index: number;
  onClick: () => void;
}> = ({ product, index, onClick }) => (
  <motion.article
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.25) }}
    className={s.card}
    onClick={onClick}
  >
    <div className={s.cardImage} style={{ backgroundColor: `${product.color}10` }}>
      <img src={product.image} alt={product.title} loading="lazy" />
      <div className={s.cardImageOverlay} />

      {/* Badge */}
      {product.badge && (
        <span
          className={s.cardBadge}
          style={{ backgroundColor: product.badgeColor }}
        >
          {product.badge}
        </span>
      )}

      {/* Popular star */}
      {product.popular && !product.badge && (
        <span className={s.cardStar}>
          <IconStar />
        </span>
      )}

      {/* Coming Soon badge */}
      <span className={s.cardSoon}>Bientot</span>

      {/* Contenu en bas */}
      <div className={s.cardContent}>
        <span
          className={s.cardFormat}
          style={{ backgroundColor: product.color }}
        >
          {product.format}
        </span>

        <h3 className={s.cardTitle}>{typo(product.title)}</h3>
        <p className={s.cardSubtitle}>{product.subtitle}</p>

        <div className={s.cardPriceRow}>
          <div>
            <span className={s.cardPrice}>{product.price}</span>
            {product.originalPrice && (
              <span className={s.cardOriginalPrice}>
                {product.originalPrice}
              </span>
            )}
          </div>
          <span className={s.cardArrow} style={{ color: product.color }}>
            Voir
            <IconArrowRight />
          </span>
        </div>
      </div>
    </div>
  </motion.article>
);

/* ── Tabs filtres ── */

const FilterTabs: React.FC<{
  categories: Array<{ id: string; label: string; color: string }>;
  activeCategory: string;
  setActiveCategory: (id: string) => void;
  products: Product[];
}> = ({ categories, activeCategory, setActiveCategory, products }) => (
  <div className={s.filterTabs}>
    {categories.map((cat) => {
      const isActive = activeCategory === cat.id;
      const count =
        cat.id === 'all'
          ? products.length
          : products.filter((p) => p.subcategory === cat.id).length;

      return (
        <button
          key={cat.id}
          onClick={() => setActiveCategory(cat.id)}
          className={isActive ? s.filterTabActive : s.filterTab}
        >
          {cat.label}
          <span className={s.filterCount}>{count}</span>
        </button>
      );
    })}
  </div>
);

// ============================================================
// PAGE PRINCIPALE
// ============================================================

export default function BoutiquePage() {
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

  const filteredDigital =
    activeDigitalCategory === 'all'
      ? digitalProducts
      : digitalProducts.filter(
          (p) => p.subcategory === activeDigitalCategory,
        );

  const filteredPhysical =
    activePhysicalCategory === 'all'
      ? physicalProducts
      : physicalProducts.filter(
          (p) => p.subcategory === activePhysicalCategory,
        );

  return (
    <div className={s.page}>
      <SEO
        title="Boutique"
        description="Decouvrez nos e-books, workbooks, carnets, cartes et formations pour votre developpement personnel."
        url="/boutique"
        type="website"
        itemListData={products.map((p) => ({
          name: p.title,
          description: p.description,
          image: p.image,
        }))}
        faqData={faqItems}
      />
      <SiteHeader />

      <main>
        {/* Modal Produit */}
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={closeModal}
        />

        {/* ══════════════════════════════════════════════════════════
           HERO — Layout 2 colonnes
           ══════════════════════════════════════════════════════════ */}
        <section className={s.hero}>
          <div className={s.container}>
            <div className={s.heroGrid}>
              {/* Colonne gauche — Texte */}
              <div>
                <span className={s.heroKicker}>
                  <span className={s.heroKickerDot} />
                  Boutique
                </span>

                <h1 className={s.heroTitle}>
                  {typo('Des ressources pour ')}
                  <em>grandir</em>
                </h1>

                <p className={s.heroDeck}>
                  {typo(
                    "E-books, workbooks, formations et objets soigneusement concus pour accompagner votre developpement personnel.",
                  )}
                </p>

                {/* Stats inline */}
                <div className={s.heroStats}>
                  <div className={s.heroStat}>
                    <span className={s.heroStatValue}>{products.length}</span>
                    <span className={s.heroStatLabel}>Produits</span>
                  </div>
                  <div className={s.heroStat}>
                    <span className={s.heroStatIcon}>
                      <IconStar />
                    </span>
                    <span className={s.heroStatValue}>4.9</span>
                    <span className={s.heroStatLabel}>Satisfaction</span>
                  </div>
                  <div className={s.heroStat}>
                    <span className={s.heroStatValue}>2.5k+</span>
                    <span className={s.heroStatLabel}>Clients</span>
                  </div>
                </div>

                {/* CTA gradient */}
                <Link to="/newsletter" className={s.heroCta}>
                  <span>Etre notifie au lancement</span>
                  <IconArrowRight />
                </Link>
              </div>

              {/* Colonne droite — Preview produits */}
              <div className={s.heroPreview}>
                <div className={s.previewGrid}>
                  {featuredProducts.slice(0, 4).map((product) => (
                    <div
                      key={product.id}
                      className={s.previewCard}
                      onClick={() => openModal(product)}
                    >
                      <img src={product.image} alt={product.title} />
                      <div className={s.previewOverlay} />
                      <span
                        className={s.previewBadge}
                        style={{ backgroundColor: product.color }}
                      >
                        {product.format.split(' ')[0]}
                      </span>
                      <div className={s.previewInfo}>
                        <p className={s.previewName}>{product.title}</p>
                        <p className={s.previewPrice}>{product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Badge flottant */}
                <div className={s.previewFloating}>
                  <div className={s.previewFloatingIcon}>
                    <IconStarOutline />
                  </div>
                  <div>
                    <p className={s.previewFloatingTitle}>
                      Bientot disponible
                    </p>
                    <p className={s.previewFloatingSub}>Collection 2026</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
           TRUST BADGES
           ══════════════════════════════════════════════════════════ */}
        <section className={s.trust}>
          <div className={s.container}>
            <div className={s.trustList}>
              <span className={s.trustItem}>
                <span style={{ color: '#10B981' }}>
                  <IconShield />
                </span>
                Paiement securise
              </span>
              <span className={s.trustItem}>
                <span style={{ color: '#F59E0B' }}>
                  <IconRefresh />
                </span>
                Satisfait ou rembourse
              </span>
              <span className={s.trustItem}>
                <span style={{ color: '#3B82F6' }}>
                  <IconTruck />
                </span>
                Livraison rapide
              </span>
              <span className={s.trustItem}>
                <span style={{ color: '#D946EF' }}>
                  <IconMessage />
                </span>
                Support reactif
              </span>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
           FEATURED — Selection
           ══════════════════════════════════════════════════════════ */}
        <section className={s.featured}>
          <div className={s.container}>
            <div className={s.sectionHeader}>
              <div className={s.sectionLabel}>
                <span className={s.sectionKicker}>
                  <span className={s.sectionKickerDot} />
                  Selection
                </span>
                <h2 className={s.sectionTitle}>Nos coups de coeur</h2>
                <p className={s.sectionDeck}>
                  {typo(
                    'Les produits les plus populaires, selectionnes pour leur impact transformateur sur votre quotidien.',
                  )}
                </p>
              </div>

              <Link to="/newsletter" className={s.sectionLink}>
                Etre notifie
                <IconArrowRight />
              </Link>
            </div>

            <div className={s.productGrid3}>
              {featuredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  onClick={() => openModal(product)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
           DIGITAL PRODUCTS
           ══════════════════════════════════════════════════════════ */}
        <section className={s.digital}>
          <div className={s.container}>
            <div className={s.sectionHeader}>
              <div className={s.sectionLabel}>
                <span className={s.sectionKicker}>
                  <span className={s.sectionKickerDot} />
                  Telecharger
                </span>
                <h2 className={s.sectionTitle}>Produits digitaux</h2>
                <p className={s.sectionDeck}>
                  {typo(
                    'E-books, workbooks, meditations et formations video. Telechargez et commencez immediatement.',
                  )}
                </p>
              </div>

              <Link to="/newsletter" className={s.sectionLink}>
                Tout voir
                <IconArrowRight />
              </Link>
            </div>

            <FilterTabs
              categories={digitalSubcategories}
              activeCategory={activeDigitalCategory}
              setActiveCategory={setActiveDigitalCategory}
              products={digitalProducts}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeDigitalCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={s.productGrid4}
              >
                {filteredDigital.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    onClick={() => openModal(product)}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
           PHYSICAL PRODUCTS
           ══════════════════════════════════════════════════════════ */}
        <section className={s.physical}>
          <div className={s.container}>
            <div className={s.sectionHeader}>
              <div className={s.sectionLabel}>
                <span className={s.sectionKicker}>
                  <span className={s.sectionKickerDot} />
                  Commander
                </span>
                <h2 className={s.sectionTitle}>Produits physiques</h2>
                <p className={s.sectionDeck}>
                  {typo(
                    'Carnets, planners, cartes et coffrets. Des objets beaux et utiles pour votre quotidien.',
                  )}
                </p>
              </div>

              <Link to="/newsletter" className={s.sectionLink}>
                Tout voir
                <IconArrowRight />
              </Link>
            </div>

            <FilterTabs
              categories={physicalSubcategories}
              activeCategory={activePhysicalCategory}
              setActiveCategory={setActivePhysicalCategory}
              products={physicalProducts}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={activePhysicalCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={s.productGrid4}
              >
                {filteredPhysical.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    onClick={() => openModal(product)}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
           PACKS
           ══════════════════════════════════════════════════════════ */}
        <section className={s.packs}>
          <div className={s.container}>
            <div className={s.sectionHeaderCenter}>
              <span className={s.sectionKicker}>
                <span className={s.sectionKickerDot} />
                Economiser
                <span className={s.sectionKickerDot} />
              </span>
              <h2 className={s.sectionTitle}>Packs &amp; Abonnements</h2>
              <p className={s.sectionDeck}>
                {typo(
                  "Economisez jusqu'a 50% avec nos offres groupees. Accedez a tout notre catalogue.",
                )}
              </p>
            </div>

            <div className={s.packsGrid}>
              {packProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  onClick={() => openModal(product)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
           NEWSLETTER CTA
           ══════════════════════════════════════════════════════════ */}
        <section className={s.newsletter}>
          <div className={s.container}>
            <div className={s.newsletterInner}>
              <h2 className={s.newsletterTitle}>
                {typo('Soyez les premiers informes')}
              </h2>
              <p className={s.newsletterDeck}>
                {typo(
                  "Inscrivez-vous pour etre prevenu des le lancement et beneficier d'offres exclusives reservees aux early adopters.",
                )}
              </p>
              <Link to="/newsletter" className={s.newsletterCta}>
                <span>S'inscrire a la newsletter</span>
                <IconArrowRight />
              </Link>
              <p className={s.newsletterDisclaimer}>
                Rejoignez 2,500+ abonnes &middot; Pas de spam
              </p>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
           FAQ
           ══════════════════════════════════════════════════════════ */}
        <section className={s.faq}>
          <div className={s.container}>
            <div className={s.faqInner}>
              <div className={s.faqHeaderCenter}>
                <h2 className={s.faqTitle}>Questions frequentes</h2>
                <p className={s.faqDeck}>Tout ce que vous devez savoir</p>
              </div>

              <div className={s.faqList}>
                {faqItems.map((faq, i) => (
                  <div key={i} className={s.faqItem}>
                    <h3 className={s.faqQuestion}>{faq.question}</h3>
                    <p className={s.faqAnswer}>{typo(faq.answer)}</p>
                  </div>
                ))}
              </div>

              <div className={s.faqContact}>
                <Link to="/contact" className={s.faqContactLink}>
                  D'autres questions ? Contactez-nous
                  <IconArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer2 />
      <ScrollToTopV2 />
    </div>
  );
}
