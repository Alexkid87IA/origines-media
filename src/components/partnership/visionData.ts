import { type LucideIcon } from 'lucide-react';
import {
  Coffee, Heart, Home, Car, Briefcase,
  Book, Activity, Shirt, Palette, Leaf,
  Baby, Accessibility, Tv, ShoppingBag, GraduationCap,
  Film, Play, Smartphone, Layers
} from 'lucide-react';

// ---- Types ----

export interface Verticale {
  id: number;
  name: string;
  icon: LucideIcon;
  color: string;
  desc: string;
  edito: string;
}

export interface MetroLine {
  id: string;
  name: string;
  color: string;
  icon: LucideIcon;
  description: string;
}

export interface TimeframeStats {
  members: string;
  exchanges: string;
  cities: string;
  impact: string;
}

export interface TimeframeLines {
  phygital: string[];
  media: string[];
  marketplace: string[];
  academy: string[];
}

export interface Timeframe {
  id: number;
  label: string;
  title: string;
  description: string;
  stats: TimeframeStats;
  lines: TimeframeLines;
}

export interface ProductionItem {
  type: string;
  count: number;
  desc: string;
  icon: LucideIcon;
  color: string;
}

export interface ProductionData {
  total: number;
  breakdown: ProductionItem[];
}

// ---- Data ----

export const verticales: Verticale[] = [
  { id: 1, name: 'Animaux', icon: Heart, color: '#EC4899', desc: 'Adoptions, pet-sitting, v\u00e9tos solidaires', edito: 'mignon + urgent + solution = adoption' },
  { id: 2, name: 'Alimentation', icon: Coffee, color: '#F97316', desc: 'Repas suspendus, anti-gaspi', edito: 'faim + partage + dignit\u00e9 = sati\u00e9t\u00e9' },
  { id: 3, name: 'Logement', icon: Home, color: '#10B981', desc: 'Couch-surfing, urgences', edito: 'gal\u00e8re + solidarit\u00e9 + toit = dignit\u00e9' },
  { id: 4, name: 'Mobilit\u00e9', icon: Car, color: '#3B82F6', desc: 'Covoiturage, pr\u00eat v\u00e9los', edito: 'distance + partage + trajet = libert\u00e9' },
  { id: 5, name: 'Business', icon: Briefcase, color: '#8B5CF6', desc: 'Mentors, micro-invest', edito: '\u00e9chec + mentor + rebond = success' },
  { id: 6, name: 'Formation', icon: Book, color: '#6366F1', desc: 'Soutien scolaire, MOOC', edito: 'ignorance + savoir + partage = comp\u00e9tence' },
  { id: 7, name: 'Sant\u00e9', icon: Activity, color: '#EF4444', desc: 'Sport solidaire, \u00e9coute', edito: 'mal-\u00eatre + soutien + action = mieux-\u00eatre' },
  { id: 8, name: 'Mode', icon: Shirt, color: '#A855F7', desc: 'Dressing circulaire', edito: 'gaspillage + cr\u00e9ativit\u00e9 + seconde vie = style' },
  { id: 9, name: 'Culture', icon: Palette, color: '#F59E0B', desc: 'Billets suspendus, sc\u00e8nes', edito: 'exclusion + art + partage = \u00e9merveillement' },
  { id: 10, name: 'Environnement', icon: Leaf, color: '#84CC16', desc: 'Repair caf\u00e9s, troc plantes', edito: 'd\u00e9chet + r\u00e9paration + transmission = durabilit\u00e9' },
  { id: 11, name: 'Famille', icon: Baby, color: '#06B6D4', desc: 'Gardes, jouets, aide', edito: 'isolement + entraide + lien = famille \u00e9largie' },
  { id: 12, name: 'Seniors', icon: Accessibility, color: '#64748B', desc: 'Visites, petits travaux', edito: 'solitude + pr\u00e9sence + utilit\u00e9 = joie de vivre' }
];

export const metroLines: MetroLine[] = [
  {
    id: 'phygital',
    name: 'Ligne Phygital',
    color: '#F97316',
    icon: Coffee,
    description: 'Caf\u00e9s + studios \u00e9v\u00e9nementiels'
  },
  {
    id: 'media',
    name: 'Ligne Media',
    color: '#8B5CF6',
    icon: Tv,
    description: '200 contenus/mois multi-formats'
  },
  {
    id: 'marketplace',
    name: 'Ligne Marketplace',
    color: '#10B981',
    icon: ShoppingBag,
    description: 'Dons, troc, services, IA Valuator'
  },
  {
    id: 'academy',
    name: 'Ligne Academy',
    color: '#3B82F6',
    icon: GraduationCap,
    description: 'Formations, certifications, mentorat'
  }
];

export const timeframes: Timeframe[] = [
  {
    id: 0,
    label: 'MAINTENANT',
    title: '1,5M membres',
    description: 'Un tr\u00e9sor inexploit\u00e9',
    stats: {
      members: '1,5M',
      exchanges: '\u2014',
      cities: '1',
      impact: '0\u20ac'
    },
    lines: {
      phygital: ['Caf\u00e9 Paris'],
      media: [],
      marketplace: [],
      academy: []
    }
  },
  {
    id: 1,
    label: 'SPRINT 30J',
    title: 'Brain-juice',
    description: '200 contenus/mois',
    stats: {
      members: '10k',
      exchanges: '5k',
      cities: '1',
      impact: '1M vues'
    },
    lines: {
      phygital: ['Caf\u00e9 Paris 2.0', 'Studio'],
      media: ['200 contenus/mois', '2 tests'],
      marketplace: ['IA Valuator', 'Hashtags'],
      academy: ['Module pilote', '30 certifi\u00e9s']
    }
  },
  {
    id: 2,
    label: '6 MOIS',
    title: '12 cha\u00eenes',
    description: '20M de vues',
    stats: {
      members: '50k',
      exchanges: '25k',
      cities: '3',
      impact: '20M vues'
    },
    lines: {
      phygital: ['Hub Lille', 'Hub Lyon', 'Events'],
      media: ['12 verticales', 'StoryCrafter IA'],
      marketplace: ['Matching IA', '12 flux'],
      academy: ['5 parcours', 'Bootcamp']
    }
  },
  {
    id: 3,
    label: '1 AN',
    title: 'Cash solidaire',
    description: 'Autofinancement',
    stats: {
      members: '200k',
      exchanges: '500k',
      cities: '7',
      impact: '100M/an'
    },
    lines: {
      phygital: ['5 hubs FR', 'Mexico', 'LA'],
      media: ['2400 contenus/an', 'Wanted Daily'],
      marketplace: ['API ouverte', 'Trust Score'],
      academy: ['500 entreprises', '25k apprenants']
    }
  },
  {
    id: 4,
    label: '3 ANS',
    title: 'Netflix Solidaire',
    description: 'LE m\u00e9dia r\u00e9f\u00e9rence',
    stats: {
      members: '5M',
      exchanges: '10M',
      cities: '20',
      impact: '1Md/an'
    },
    lines: {
      phygital: ['20 villes', 'WantedFest'],
      media: ['10k contenus/an', 'Fiction'],
      marketplace: ['12 verticales', '10M\u20ac CA'],
      academy: ['University', '100k certifi\u00e9s']
    }
  }
];

export const productionData: ProductionData = {
  total: 200,
  breakdown: [
    { type: 'Longs', count: 8, desc: '15-20 min', icon: Film, color: '#8B5CF6' },
    { type: 'Moyens', count: 40, desc: '3-5 min', icon: Play, color: '#EC4899' },
    { type: 'Shorts', count: 120, desc: '15-60s', icon: Smartphone, color: '#F97316' },
    { type: 'Carrousels', count: 32, desc: 'Data stories', icon: Layers, color: '#10B981' }
  ]
};
