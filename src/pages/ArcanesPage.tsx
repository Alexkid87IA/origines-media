import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Vote, MessageSquare, Radar, ShieldCheck, Menu, X, Play, Newspaper, FolderOpen, ArrowRight, Lock, Bell, Users, ChevronDown } from 'lucide-react';
import s from './ArcanesPage.module.css';

const SOCIAL_LINKS = [
  {
    href: "https://youtube.com/@thabordepaix",
    label: "YouTube",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    href: "https://x.com/Thabordepaix",
    label: "X",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    href: "https://instagram.com/thabordepaix",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    href: "https://tiktok.com/@thabordepaix",
    label: "TikTok",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
];

// ─── Galaxies & Univers ──────────────────────────────────────

interface GalaxyUnivers { slug: string; label: string }

interface Galaxy {
  key: string;
  label: string;
  title: string;
  text: string;
  univers: GalaxyUnivers[];
}

const GALAXIES: Galaxy[] = [
  {
    key: 'geopolitique', label: 'Géopolitique',
    title: 'Comprendre les rapports de force',
    text: 'Conflits, alliances, zones grises — décoder ce qui se joue entre les nations.',
    univers: [
      { slug: 'conflits', label: 'Conflits armés' },
      { slug: 'diplomatie', label: 'Diplomatie' },
      { slug: 'renseignement', label: 'Renseignement' },
      { slug: 'afrique', label: 'Afrique' },
      { slug: 'asie-pacifique', label: 'Asie-Pacifique' },
      { slug: 'moyen-orient', label: 'Moyen-Orient' },
      { slug: 'europe', label: 'Europe' },
    ],
  },
  {
    key: 'energie', label: 'Énergie',
    title: 'Le nerf de la souveraineté',
    text: `Nucléaire, renouvelables, dépendances — l'énergie détermine notre autonomie.`,
    univers: [
      { slug: 'nucleaire', label: 'Nucléaire' },
      { slug: 'renouvelables', label: 'Renouvelables' },
      { slug: 'hydrocarbures', label: 'Hydrocarbures' },
      { slug: 'reseau-electrique', label: 'Réseau électrique' },
      { slug: 'transition', label: 'Transition' },
      { slug: 'climat', label: 'Climat' },
    ],
  },
  {
    key: 'politique', label: 'Politique',
    title: 'Au-delà des postures',
    text: 'Institutions, réformes, lobbies — les mécanismes du pouvoir sans simplifier.',
    univers: [
      { slug: 'institutions', label: 'Institutions' },
      { slug: 'justice', label: 'Justice' },
      { slug: 'lobbies', label: 'Lobbies' },
      { slug: 'elections', label: 'Élections' },
      { slug: 'libertes', label: 'Libertés' },
      { slug: 'medias', label: 'Médias' },
    ],
  },
  {
    key: 'economie', label: 'Économie',
    title: `Suivre l'argent`,
    text: `Dette, industrie, commerce — l'économie rendue lisible, sans jargon.`,
    univers: [
      { slug: 'dette', label: 'Dette' },
      { slug: 'industrie', label: 'Industrie' },
      { slug: 'inegalites', label: 'Inégalités' },
      { slug: 'emploi', label: 'Emploi' },
      { slug: 'finance', label: 'Finance' },
      { slug: 'commerce', label: 'Commerce' },
    ],
  },
  {
    key: 'technologie', label: 'Technologie',
    title: 'Surveiller ceux qui surveillent',
    text: `IA, cybersécurité, données — la technologie redessine le pouvoir.`,
    univers: [
      { slug: 'ia', label: 'Intelligence artificielle' },
      { slug: 'cyber', label: 'Cybersécurité' },
      { slug: 'donnees', label: 'Données' },
      { slug: 'spatial', label: 'Spatial' },
      { slug: 'numerique', label: 'Numérique' },
      { slug: 'biotech', label: 'Biotech' },
    ],
  },
  {
    key: 'souverainete', label: 'Souveraineté',
    title: 'Défendre ce qui nous appartient',
    text: `Industrie, défense, culture — ce que la France peut encore maîtriser.`,
    univers: [
      { slug: 'defense', label: 'Défense' },
      { slug: 'cloud', label: 'Cloud & Data' },
      { slug: 'culture', label: 'Culture' },
      { slug: 'alimentaire', label: 'Alimentation' },
      { slug: 'industrielle', label: 'Industrie' },
      { slug: 'numerique', label: 'Numérique' },
    ],
  },
];

const PILLARS = GALAXIES.map(g => ({ label: g.label, title: g.title, text: g.text }));

// ─── Mock Data ───────────────────────────────────────────────

const FEATURED = {
  title: 'La guerre invisible : comment la France perd sa souveraineté numérique',
  guest: 'Général (2S) François Delattre',
  role: 'Ancien directeur du renseignement militaire',
  category: 'Souveraineté',
  date: '5 mai 2026',
  duration: '2h34',
  isNew: true,
  img: 'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=1200',
};

const BAROMETRE = {
  question: `La France doit-elle relancer un programme nucléaire civil d'envergure ?`,
  totalVotes: 8432,
  options: [
    { id: 'oui', label: 'Oui, priorité stratégique', votes: 5481 },
    { id: 'non', label: 'Non, risques trop élevés', votes: 1687 },
    { id: 'informer', label: `Je veux d'abord m'informer`, votes: 1264 },
  ],
};

const ARTICLES = [
  { slug: 'cyberattaque-apt28', category: 'Technologie', title: 'APT28 : anatomie de la cyberattaque contre le ministère des Armées', readTime: '12 min', author: 'Marion Leblanc', img: 'https://images.pexels.com/photos/5240541/pexels-photo-5240541.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { slug: 'nucleaire-epr2', category: 'Énergie', title: `EPR2 : pourquoi la France mise tout sur le nucléaire de nouvelle génération`, readTime: '9 min', author: 'Thomas Renaud', img: 'https://images.pexels.com/photos/18334961/pexels-photo-18334961.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { slug: 'dette-publique-3500', category: 'Économie', title: `3 500 milliards : la dette française est-elle encore soutenable ?`, readTime: '14 min', author: 'Claire Fontaine', img: 'https://images.pexels.com/photos/26743048/pexels-photo-26743048.jpeg?auto=compress&cs=tinysrgb&w=800' },
];

const VIDEOS = [
  { slug: 'delattre-souverainete', title: 'François Delattre — Souveraineté numérique', duration: '2h34', category: 'Souveraineté' },
  { slug: 'jancovici-energie', title: 'Jean-Marc Jancovici — Transition ou effondrement ?', duration: '1h52', category: 'Énergie' },
  { slug: 'laidi-geopolitique', title: 'Zaki Laïdi — Le piège des sanctions occidentales', duration: '1h28', category: 'Géopolitique' },
];

const LAST_INTERVIEW = {
  slug: 'delattre-souverainete',
  headline: 'La guerre invisible : comment la France',
  headlineEm: 'perd sa souveraineté numérique',
  guest: 'Général (2S) François Delattre',
  guestRole: 'Ancien directeur du renseignement militaire',
  excerpt: `Ancien directeur du renseignement militaire, il décrypte les nouvelles menaces cyber, le retard français en matière de cloud souverain et les alliances à nouer pour reprendre le contrôle. Un entretien fleuve de 2h34 où rien n'est éludé.`,
  category: 'Souveraineté',
  duration: '2h34',
  timeLabel: 'il y a 2 jours',
  episodeNum: 412,
  img: 'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=1200',
};

const DOSSIERS = [
  { slug: 'guerre-numerique', title: 'La guerre numérique : qui contrôle nos données ?', articleCount: 7, category: 'Technologie' },
  { slug: 'energie-souveraine', title: `Énergie souveraine : le pari nucléaire français`, articleCount: 5, category: 'Énergie' },
  { slug: 'influence-etrangere', title: `Ingérences étrangères : cartographie des opérations d'influence`, articleCount: 9, category: 'Géopolitique' },
];

function catKey(label: string): string {
  const map: Record<string, string> = {
    'Géopolitique': 'geopolitique', 'Énergie': 'energie', 'Politique': 'politique',
    'Économie': 'economie', 'Technologie': 'technologie', 'Souveraineté': 'souverainete',
  };
  return map[label] || 'geopolitique';
}

const FORUM_THREADS = [
  { slug: 'nucleaire-relance', title: `Relance du nucléaire : opportunité industrielle ou fuite en avant ?`, category: 'Énergie', replies: 247, participants: 89, lastActivity: 'il y a 12 min', hot: true },
  { slug: 'apt28-riposte', title: `Cyberattaque APT28 : la France doit-elle riposter ?`, category: 'Technologie', replies: 183, participants: 64, lastActivity: 'il y a 34 min', hot: true },
  { slug: 'sanctions-russie', title: `Sanctions contre la Russie : bilan deux ans après — qui perd vraiment ?`, category: 'Géopolitique', replies: 312, participants: 127, lastActivity: 'il y a 1 h', hot: false },
  { slug: 'dette-3500', title: `3 500 milliards de dette : faut-il un plan d'austérité ?`, category: 'Économie', replies: 156, participants: 53, lastActivity: 'il y a 2 h', hot: false },
  { slug: 'ia-souverainete', title: `IA souveraine : la France peut-elle encore rattraper les États-Unis ?`, category: 'Souveraineté', replies: 91, participants: 38, lastActivity: 'il y a 3 h', hot: false },
];

const PILLAR_COLORS: Record<string, { accent: string; bg: string; border: string }> = {
  geopolitique:  { accent: '#8B6B4A', bg: 'rgba(139,107,74,0.06)',  border: 'rgba(139,107,74,0.18)' },
  energie:       { accent: '#7A8B4A', bg: 'rgba(122,139,74,0.06)',  border: 'rgba(122,139,74,0.18)' },
  politique:     { accent: '#6B5B8A', bg: 'rgba(107,91,138,0.06)',  border: 'rgba(107,91,138,0.18)' },
  economie:      { accent: '#4A7A8B', bg: 'rgba(74,122,139,0.06)',  border: 'rgba(74,122,139,0.18)' },
  technologie:   { accent: '#5A6B8B', bg: 'rgba(90,107,139,0.06)', border: 'rgba(90,107,139,0.18)' },
  souverainete:  { accent: '#8B5A5A', bg: 'rgba(139,90,90,0.06)',   border: 'rgba(139,90,90,0.18)' },
};

interface CompArticle { slug: string; title: string; readTime: string; author: string }

const COMP_COVERS = [
  'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1550337/pexels-photo-1550337.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/2832382/pexels-photo-2832382.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/2156/sky-earth-space-working.jpg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1089438/pexels-photo-1089438.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=600',
];
function compCover(slug: string) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) | 0;
  return COMP_COVERS[Math.abs(h) % COMP_COVERS.length];
}

const COMPRENDRE_ARTICLES: Record<string, Record<string, CompArticle[]>> = {
  geopolitique: {
    conflits: [
      { slug: 'sahel-bilan', title: `Sahel : le vrai bilan du retrait français, un an après`, readTime: '16 min', author: 'Marion Leblanc' },
      { slug: 'ukraine-front-sud', title: `Ukraine : ce qui se joue vraiment sur le front sud`, readTime: '12 min', author: 'Thomas Renaud' },
      { slug: 'armes-autonomes', title: `Armes autonomes : la guerre sans humain est-elle déjà là ?`, readTime: '10 min', author: 'Claire Fontaine' },
    ],
    diplomatie: [
      { slug: 'sanctions-russie-bilan', title: `Sanctions contre la Russie : deux ans après, qui perd vraiment ?`, readTime: '14 min', author: 'Claire Fontaine' },
      { slug: 'otan-flanc-est', title: `L'OTAN renforce son flanc est : ce que la France joue vraiment`, readTime: '18 min', author: 'Thomas Renaud' },
      { slug: 'brics-monnaie', title: `Les BRICS et le dollar : la dédollarisation est-elle crédible ?`, readTime: '11 min', author: 'Marion Leblanc' },
    ],
    renseignement: [
      { slug: 'dgse-cyber', title: `DGSE : comment le renseignement français s'est réinventé`, readTime: '15 min', author: 'Thomas Renaud' },
      { slug: 'pegasus-europe', title: `Pegasus en Europe : les États qui espionnent leurs citoyens`, readTime: '13 min', author: 'Marion Leblanc' },
      { slug: 'sources-ouvertes', title: `OSINT : quand les citoyens enquêtent mieux que les États`, readTime: '9 min', author: 'Claire Fontaine' },
    ],
    afrique: [
      { slug: 'sahel-wagner', title: `Wagner en Afrique : le vrai coût de l'influence russe au Sahel`, readTime: '14 min', author: 'Marion Leblanc' },
      { slug: 'afrique-dette-chine', title: `La dette africaine : piège chinois ou partenariat gagnant ?`, readTime: '12 min', author: 'Claire Fontaine' },
      { slug: 'rdc-minerais', title: `RDC : la guerre silencieuse pour les minerais stratégiques`, readTime: '11 min', author: 'Thomas Renaud' },
    ],
    'asie-pacifique': [
      { slug: 'mer-chine-tensions', title: `Mer de Chine : pourquoi la marine française y envoie le Charles de Gaulle`, readTime: '11 min', author: 'Thomas Renaud' },
      { slug: 'taiwan-semi-conducteurs', title: `Taïwan : la guerre des semi-conducteurs a déjà commencé`, readTime: '13 min', author: 'Claire Fontaine' },
      { slug: 'aukus-france', title: `AUKUS : ce que la France a perdu (et ce qu'elle peut encore gagner)`, readTime: '10 min', author: 'Marion Leblanc' },
    ],
    'moyen-orient': [
      { slug: 'iran-nucleaire', title: `Iran : le programme nucléaire à l'épreuve des inspections`, readTime: '14 min', author: 'Marion Leblanc' },
      { slug: 'golfe-normalisation', title: `Accords d'Abraham : normalisation ou mirage diplomatique ?`, readTime: '12 min', author: 'Thomas Renaud' },
      { slug: 'syrie-reconstruction', title: `Syrie : la reconstruction impossible d'un pays en ruines`, readTime: '15 min', author: 'Claire Fontaine' },
    ],
    europe: [
      { slug: 'europe-defense', title: `Défense européenne : l'armée commune est-elle un fantasme ?`, readTime: '13 min', author: 'Thomas Renaud' },
      { slug: 'frontex-enquete', title: `Frontex : enquête sur l'agence qui gère les frontières de l'UE`, readTime: '16 min', author: 'Marion Leblanc' },
      { slug: 'balkans-poudriere', title: `Balkans : la poudrière que l'Europe refuse de voir`, readTime: '11 min', author: 'Claire Fontaine' },
    ],
  },
  energie: {
    nucleaire: [
      { slug: 'nucleaire-epr2', title: `EPR2 : pourquoi la France mise tout sur le nucléaire de nouvelle génération`, readTime: '9 min', author: 'Thomas Renaud' },
      { slug: 'smr-revolution', title: `Petits réacteurs modulaires : révolution ou effet d'annonce ?`, readTime: '11 min', author: 'Claire Fontaine' },
      { slug: 'dechets-nucleaires', title: `Déchets nucléaires : Cigéo, le stockage à 500 mètres sous terre`, readTime: '14 min', author: 'Marion Leblanc' },
    ],
    renouvelables: [
      { slug: 'eolien-offshore', title: `Éolien offshore : la France rattrape enfin son retard`, readTime: '10 min', author: 'Claire Fontaine' },
      { slug: 'solaire-agrivoltaisme', title: `Agrivoltaïsme : quand les panneaux solaires nourrissent les champs`, readTime: '8 min', author: 'Thomas Renaud' },
      { slug: 'stockage-batteries', title: `Batteries : le maillon faible de la transition énergétique`, readTime: '12 min', author: 'Marion Leblanc' },
    ],
    hydrocarbures: [
      { slug: 'gaz-lng-europe', title: `GNL américain : comment l'Europe s'est rendue dépendante`, readTime: '13 min', author: 'Marion Leblanc' },
      { slug: 'petro-etats-transition', title: `Pétro-États : comment les monarchies du Golfe préparent l'après-pétrole`, readTime: '15 min', author: 'Thomas Renaud' },
      { slug: 'total-strategie', title: `TotalEnergies : multinationale ou outil géopolitique français ?`, readTime: '11 min', author: 'Claire Fontaine' },
    ],
    'reseau-electrique': [
      { slug: 'blackout-france', title: `Blackout : la France est-elle prête pour une panne géante ?`, readTime: '10 min', author: 'Thomas Renaud' },
      { slug: 'rte-equilibre', title: `RTE : l'équilibriste invisible du réseau électrique`, readTime: '9 min', author: 'Claire Fontaine' },
      { slug: 'interconnexions', title: `Interconnexions : quand l'électricité ne connaît pas les frontières`, readTime: '8 min', author: 'Marion Leblanc' },
    ],
    transition: [
      { slug: 'hydrogene-mirage', title: `Hydrogène vert : promesse industrielle ou mirage subventionné ?`, readTime: '12 min', author: 'Claire Fontaine' },
      { slug: 'mix-energetique-2050', title: `Mix énergétique 2050 : les scénarios qui façonnent notre avenir`, readTime: '14 min', author: 'Thomas Renaud' },
      { slug: 'sobriete-tabou', title: `Sobriété énergétique : le mot tabou de la transition`, readTime: '9 min', author: 'Marion Leblanc' },
    ],
    climat: [
      { slug: 'electricite-prix', title: `Prix de l'électricité : anatomie d'une facture devenue politique`, readTime: '8 min', author: 'Marion Leblanc' },
      { slug: 'adaptation-littoral', title: `Littoral français : reculer ou se noyer, le dilemme climatique`, readTime: '13 min', author: 'Thomas Renaud' },
      { slug: 'canicules-mortalite', title: `Canicules : pourquoi la France n'est pas prête pour les prochaines`, readTime: '10 min', author: 'Claire Fontaine' },
    ],
  },
  politique: {
    institutions: [
      { slug: 'abstention-record', title: `Abstention record : la démocratie française est-elle en panne ?`, readTime: '10 min', author: 'Thomas Renaud' },
      { slug: 'senat-utilite', title: `Le Sénat sert-il encore à quelque chose ?`, readTime: '12 min', author: 'Claire Fontaine' },
      { slug: 'decentralisation', title: `Décentralisation : les régions ont-elles vraiment le pouvoir ?`, readTime: '11 min', author: 'Marion Leblanc' },
    ],
    justice: [
      { slug: 'reforme-justice', title: `Réforme de la justice : ce que le gouvernement ne dit pas`, readTime: '13 min', author: 'Marion Leblanc' },
      { slug: 'prisons-surpopulation', title: `Prisons françaises : 150 % d'occupation, 0 % de réforme`, readTime: '15 min', author: 'Thomas Renaud' },
      { slug: 'pnf-enquete', title: `PNF : enquête sur le parquet qui fait trembler les politiques`, readTime: '14 min', author: 'Claire Fontaine' },
    ],
    lobbies: [
      { slug: 'lobbies-bruxelles', title: `Lobbies à Bruxelles : qui influence vraiment les lois européennes ?`, readTime: '15 min', author: 'Claire Fontaine' },
      { slug: 'pharma-influence', title: `Big Pharma : les coulisses du lobbying sanitaire en France`, readTime: '13 min', author: 'Marion Leblanc' },
      { slug: 'pantouflage', title: `Pantouflage : quand les hauts fonctionnaires passent au privé`, readTime: '10 min', author: 'Thomas Renaud' },
    ],
    elections: [
      { slug: 'machines-voter', title: `Machines à voter : fiabilité, sécurité, le vrai débat`, readTime: '9 min', author: 'Thomas Renaud' },
      { slug: 'sondages-pouvoir', title: `Sondages : comment ils façonnent l'opinion plus qu'ils ne la mesurent`, readTime: '11 min', author: 'Claire Fontaine' },
      { slug: 'financement-partis', title: `Financement des partis : l'argent roi de la démocratie française`, readTime: '14 min', author: 'Marion Leblanc' },
    ],
    libertes: [
      { slug: 'surveillance-generalisee', title: `Surveillance généralisée : la France, laboratoire sécuritaire ?`, readTime: '16 min', author: 'Marion Leblanc' },
      { slug: 'liberte-presse', title: `Liberté de la presse : la France recule, enquête sur les pressions`, readTime: '12 min', author: 'Claire Fontaine' },
      { slug: 'droit-manifester', title: `Droit de manifester : état des lieux après cinq ans de répression`, readTime: '13 min', author: 'Thomas Renaud' },
    ],
    medias: [
      { slug: 'concentration-medias', title: `Concentration des médias : qui possède l'information en France ?`, readTime: '14 min', author: 'Claire Fontaine' },
      { slug: 'desinformation', title: `Désinformation : anatomie d'une fake news devenue virale`, readTime: '10 min', author: 'Thomas Renaud' },
      { slug: 'audiovisuel-public', title: `Audiovisuel public : entre indépendance proclamée et pressions réelles`, readTime: '11 min', author: 'Marion Leblanc' },
    ],
  },
  economie: {
    dette: [
      { slug: 'dette-publique-3500', title: `3 500 milliards : la dette française est-elle encore soutenable ?`, readTime: '14 min', author: 'Claire Fontaine' },
      { slug: 'agences-notation', title: `Agences de notation : les juges invisibles de la France`, readTime: '10 min', author: 'Thomas Renaud' },
      { slug: 'austérite-relance', title: `Austérité ou relance : le faux dilemme de la politique budgétaire`, readTime: '12 min', author: 'Marion Leblanc' },
    ],
    industrie: [
      { slug: 'desindustrialisation', title: `Désindustrialisation : la France peut-elle encore produire ?`, readTime: '11 min', author: 'Thomas Renaud' },
      { slug: 'semi-conducteurs-europe', title: `Semi-conducteurs : l'Europe peut-elle créer son propre TSMC ?`, readTime: '13 min', author: 'Claire Fontaine' },
      { slug: 'relocalisation', title: `Relocalisation : effet d'annonce ou vrai mouvement de fond ?`, readTime: '9 min', author: 'Marion Leblanc' },
    ],
    inegalites: [
      { slug: 'inflation-alimentaire', title: `Inflation alimentaire : pourquoi les prix ne redescendent pas`, readTime: '7 min', author: 'Marion Leblanc' },
      { slug: 'salaires-stagnation', title: `Pouvoir d'achat : 20 ans de stagnation salariale en France`, readTime: '12 min', author: 'Thomas Renaud' },
      { slug: 'patrimoine-france', title: `Patrimoine : les 10 % les plus riches possèdent la moitié du pays`, readTime: '14 min', author: 'Claire Fontaine' },
    ],
    emploi: [
      { slug: 'chomage-methode', title: `Chômage : ce que cachent les chiffres officiels`, readTime: '10 min', author: 'Claire Fontaine' },
      { slug: 'uberisation', title: `Ubérisation : la précarité comme modèle économique`, readTime: '11 min', author: 'Marion Leblanc' },
      { slug: 'formation-pro', title: `Formation professionnelle : 32 milliards par an, pour quels résultats ?`, readTime: '13 min', author: 'Thomas Renaud' },
    ],
    finance: [
      { slug: 'bce-taux', title: `BCE : la hausse des taux, arme anti-inflation ou frein à l'économie ?`, readTime: '9 min', author: 'Thomas Renaud' },
      { slug: 'crypto-regulation', title: `Crypto : la régulation européenne change-t-elle la donne ?`, readTime: '8 min', author: 'Claire Fontaine' },
      { slug: 'evasion-fiscale', title: `Évasion fiscale : les milliards qui échappent à l'État`, readTime: '15 min', author: 'Marion Leblanc' },
    ],
    commerce: [
      { slug: 'mercosur-accord', title: `Mercosur : l'accord qui divise l'Europe et ses agriculteurs`, readTime: '12 min', author: 'Marion Leblanc' },
      { slug: 'guerre-commerciale', title: `Guerre commerciale US-Chine : l'Europe prise en étau`, readTime: '14 min', author: 'Thomas Renaud' },
      { slug: 'made-in-france', title: `Made in France : réalité industrielle ou argument marketing ?`, readTime: '10 min', author: 'Claire Fontaine' },
    ],
  },
  technologie: {
    ia: [
      { slug: 'ia-souveraine', title: `IA souveraine : la France peut-elle rattraper les États-Unis ?`, readTime: '10 min', author: 'Thomas Renaud' },
      { slug: 'ia-emploi', title: `IA et emploi : combien de métiers vont vraiment disparaître ?`, readTime: '12 min', author: 'Claire Fontaine' },
      { slug: 'ia-justice', title: `Justice prédictive : quand l'algorithme remplace le juge`, readTime: '11 min', author: 'Marion Leblanc' },
    ],
    cyber: [
      { slug: 'cyberattaque-apt28', title: `APT28 : anatomie de la cyberattaque contre le ministère des Armées`, readTime: '12 min', author: 'Marion Leblanc' },
      { slug: 'ransomware-hopitaux', title: `Rançongiciels : pourquoi les hôpitaux français sont des cibles`, readTime: '10 min', author: 'Thomas Renaud' },
      { slug: 'anssi-mission', title: `ANSSI : les gardiens invisibles de la cybersécurité française`, readTime: '9 min', author: 'Claire Fontaine' },
    ],
    donnees: [
      { slug: 'donnees-sante', title: `Données de santé : qui a accès à votre dossier médical ?`, readTime: '9 min', author: 'Claire Fontaine' },
      { slug: 'rgpd-bilan', title: `RGPD : cinq ans après, un bouclier ou un tigre de papier ?`, readTime: '11 min', author: 'Marion Leblanc' },
      { slug: 'gafam-donnees', title: `GAFAM : ce que Google et Meta savent vraiment de vous`, readTime: '13 min', author: 'Thomas Renaud' },
    ],
    spatial: [
      { slug: 'ariane-6', title: `Ariane 6 : le lanceur européen face à SpaceX`, readTime: '10 min', author: 'Thomas Renaud' },
      { slug: 'starlink-souverainete', title: `Starlink : la souveraineté spatiale face à Elon Musk`, readTime: '12 min', author: 'Claire Fontaine' },
      { slug: 'debris-spatiaux', title: `Débris spatiaux : la menace invisible au-dessus de nos têtes`, readTime: '8 min', author: 'Marion Leblanc' },
    ],
    numerique: [
      { slug: 'fibre-deserts', title: `Fibre optique : les déserts numériques de la France rurale`, readTime: '9 min', author: 'Marion Leblanc' },
      { slug: 'identite-numerique', title: `Identité numérique : vers un passeport digital européen`, readTime: '11 min', author: 'Thomas Renaud' },
      { slug: 'fracture-generationnelle', title: `Fracture numérique : 13 millions de Français déconnectés`, readTime: '10 min', author: 'Claire Fontaine' },
    ],
    biotech: [
      { slug: 'crispr-ethique', title: `CRISPR : la modification génétique entre promesses et éthique`, readTime: '14 min', author: 'Claire Fontaine' },
      { slug: 'vaccins-arnm', title: `ARN messager : ce que la technologie vaccinale change pour la médecine`, readTime: '11 min', author: 'Thomas Renaud' },
      { slug: 'cerveau-interface', title: `Neuralink : l'interface cerveau-machine est-elle souhaitable ?`, readTime: '12 min', author: 'Marion Leblanc' },
    ],
  },
  souverainete: {
    defense: [
      { slug: 'defense-budget', title: `Budget Défense : la France investit-elle assez pour son armée ?`, readTime: '11 min', author: 'Thomas Renaud' },
      { slug: 'dissuasion-nucleaire', title: `Dissuasion nucléaire : la France peut-elle rester crédible ?`, readTime: '14 min', author: 'Claire Fontaine' },
      { slug: 'armee-recrutement', title: `Recrutement militaire : la Grande Muette peine à séduire`, readTime: '9 min', author: 'Marion Leblanc' },
    ],
    cloud: [
      { slug: 'cloud-souverain', title: `Cloud souverain : pourquoi la France confie encore ses données aux GAFAM`, readTime: '13 min', author: 'Marion Leblanc' },
      { slug: 'health-data-hub', title: `Health Data Hub : nos données de santé chez Microsoft`, readTime: '10 min', author: 'Thomas Renaud' },
      { slug: 'ovhcloud-ambitions', title: `OVHcloud : champion français ou nain face aux hyperscalers ?`, readTime: '11 min', author: 'Claire Fontaine' },
    ],
    culture: [
      { slug: 'culture-soft-power', title: `Soft power français : le déclin silencieux de notre influence culturelle`, readTime: '8 min', author: 'Claire Fontaine' },
      { slug: 'francophonie-avenir', title: `Francophonie : 321 millions de locuteurs, et après ?`, readTime: '10 min', author: 'Marion Leblanc' },
      { slug: 'exception-culturelle', title: `Exception culturelle : la France peut-elle résister au streaming ?`, readTime: '12 min', author: 'Thomas Renaud' },
    ],
    alimentaire: [
      { slug: 'souverainete-alimentaire', title: `Souveraineté alimentaire : la France importe 50 % de ses fruits`, readTime: '11 min', author: 'Thomas Renaud' },
      { slug: 'pac-reforme', title: `PAC : la réforme agricole qui divise l'Europe`, readTime: '13 min', author: 'Claire Fontaine' },
      { slug: 'eau-rarefaction', title: `L'eau se raréfie : la France face aux conflits d'usage`, readTime: '14 min', author: 'Marion Leblanc' },
    ],
    industrielle: [
      { slug: 'terres-rares', title: `Terres rares : la dépendance critique de l'industrie européenne`, readTime: '12 min', author: 'Marion Leblanc' },
      { slug: 'medicaments-penurie', title: `Pénurie de médicaments : quand la France dépend de la Chine et l'Inde`, readTime: '10 min', author: 'Thomas Renaud' },
      { slug: 'base-industrielle-defense', title: `Base industrielle de défense : le tissu français résiste-t-il ?`, readTime: '15 min', author: 'Claire Fontaine' },
    ],
    numerique: [
      { slug: 'os-souverain', title: `Système d'exploitation souverain : utopie ou nécessité ?`, readTime: '9 min', author: 'Claire Fontaine' },
      { slug: 'cables-sous-marins', title: `Câbles sous-marins : les artères invisibles de l'internet mondial`, readTime: '11 min', author: 'Thomas Renaud' },
      { slug: 'dns-souverainete', title: `DNS : qui contrôle vraiment l'annuaire d'internet ?`, readTime: '10 min', author: 'Marion Leblanc' },
    ],
  },
};

const TICKER_ITEMS = [
  'Cyberattaque attribuée à APT28 contre le ministère des Armées',
  `L'OTAN renforce son flanc est : 3 nouvelles brigades en Pologne`,
  'Document déclassifié sur les failles du système de surveillance',
  'Tensions en mer de Chine : la marine mobilise le Charles de Gaulle',
  `Sommet énergie à Paris : coulisses d'un accord sur le nucléaire`,
];

// ─── Page ────────────────────────────────────────────────────

export default function ArcanesPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [vote, setVote] = useState<string | null>(null);
  const [activePillar, setActivePillar] = useState<number | null>(null);
  const [activeCompPillar, setActiveCompPillar] = useState(0);
  const [activeCompUnivers, setActiveCompUnivers] = useState(0);
  const [megaOpen, setMegaOpen] = useState(false);
  const [tagsOpen, setTagsOpen] = useState(false);
  const [footerTab, setFooterTab] = useState<'galaxies' | 'formats' | 'apropos'>('galaxies');
  const pillarRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);


  useEffect(() => {
    document.body.style.background = '#F0EDE6';
    document.body.style.color = '#0A0A0A';
    return () => {
      document.body.style.background = '';
      document.body.style.color = '';
    };
  }, []);

  const measure = useCallback(() => {
    if (activePillar === null || !containerRef.current || !pillarRefs.current[activePillar]) {
      setIndicator(null);
      return;
    }
    const cRect = containerRef.current.getBoundingClientRect();
    const bRect = pillarRefs.current[activePillar]!.getBoundingClientRect();
    setIndicator({ left: bRect.left - cRect.left, width: bRect.width });
  }, [activePillar]);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  return (
    <div className={s.page}>
      {/* ══════════ BANDE NOIRE — Ticker ══════════ */}
      <div className={s.tickerBar}>
        <div className={s.inner}>
          <span className={s.tickerLive}>
            <span className={s.tickerDot} />
            En direct — {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} Paris
          </span>
          <div className={s.tickerCenter}>
            <div className={s.tickerScroll}>
              {[...TICKER_ITEMS, ...TICKER_ITEMS].map((msg, i) => (
                <span key={i}>{msg}</span>
              ))}
            </div>
          </div>
          <span className={s.tickerEdition}>
            Édition du <time>{new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
          </span>
        </div>
      </div>

      {/* ══════════ HEADER ══════════ */}
      <header className={s.header}>
        <div className={s.inner}>
          <a href="/arcanes" className={s.logo}>
            <img src="/thinkerview-logo.png" alt="Thinkerview" className={s.logoImg} />
          </a>

          <nav className={s.nav}>
            <div
              className={s.megaTrigger}
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
            >
              <button
                type="button"
                className={`${s.navLink} ${megaOpen ? s.navLinkActive : ''}`}
                onClick={() => setMegaOpen(o => !o)}
              >
                <svg className={s.navIconSvg} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
                  <circle cx="8" cy="8" r="6" />
                  <ellipse cx="8" cy="8" rx="6" ry="2.5" />
                  <ellipse cx="8" cy="8" rx="6" ry="2.5" transform="rotate(60 8 8)" />
                  <ellipse cx="8" cy="8" rx="6" ry="2.5" transform="rotate(120 8 8)" />
                </svg>
                Galaxies
                <ChevronDown className={`${s.navChevron} ${megaOpen ? s.navChevronOpen : ''}`} />
              </button>
            </div>
            {[
              { label: 'Comprendre', href: '/articles' },
              { label: 'Actualité', href: '/actu' },
              { label: 'Dossiers', href: '/dossiers' },
              { label: 'Forum', href: '#forum' },
              { label: 'Newsletter', href: '/newsletter' },
            ].map(item => (
              <a key={item.label} href={item.href} className={s.navLink}>
                {item.label}
              </a>
            ))}
          </nav>

          <a href="/inscription" className={s.joinBtn}>
            <ShieldCheck className={s.joinIcon} />
            Rejoindre
          </a>

          <button
            className={s.menuBtn}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Fermer' : 'Menu'}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* ── Mega dropdown — toutes les galaxies ── */}
        <div
          className={`${s.mega} ${megaOpen ? s.megaOpen : ''}`}
          onMouseEnter={() => setMegaOpen(true)}
          onMouseLeave={() => setMegaOpen(false)}
        >
          <div className={s.inner}>
            <div className={s.megaHeader}>
              <span className={s.megaHeaderLabel}>Les 6 Galaxies</span>
              <span className={s.megaHeaderHint}>Explorer par thème</span>
            </div>
            <div className={s.megaGrid}>
              {GALAXIES.map((g, i) => {
                const colors = PILLAR_COLORS[g.key];
                return (
                  <div key={g.key} className={s.megaCol} style={{ '--col-color': colors.accent } as React.CSSProperties}>
                    <div className={s.megaColAccent} />
                    <span className={s.megaNum}>{String(i + 1).padStart(2, '0')}</span>
                    <a href={`/articles?galaxie=${g.key}`} className={s.megaTitle}>
                      <span className={s.megaDot} style={{ background: colors.accent }} />
                      {g.label}
                    </a>
                    <p className={s.megaTagline}>{g.text}</p>
                    <div className={s.megaLinks}>
                      {g.univers.map(u => (
                        <a key={u.slug} href={`/articles?galaxie=${g.key}&univers=${u.slug}`} className={s.megaLink}>
                          {u.label}
                        </a>
                      ))}
                    </div>
                    <a href={`/articles?galaxie=${g.key}`} className={s.megaAll}>
                      Explorer {g.label.toLowerCase()} <span aria-hidden="true">&rarr;</span>
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {/* ── Univers bar — sous-catégories, expansion inline ── */}
        <div className={s.universBar}>
          <div className={s.inner}>
            <div className={`${s.universBarTrack} ${tagsOpen ? s.universBarTrackOpen : ''}`}>
              {GALAXIES.flatMap(g =>
                g.univers.map(u => (
                  <a
                    key={`${g.key}-${u.slug}`}
                    href={`/articles?galaxie=${g.key}&univers=${u.slug}`}
                    className={s.universBarItem}
                  >
                    {u.label}
                  </a>
                ))
              )}
            </div>
            <div className={s.universBarActions}>
              <button
                type="button"
                className={s.universBarToggle}
                onClick={() => setTagsOpen(o => !o)}
              >
                {tagsOpen ? 'Voir moins' : 'Voir plus'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ══════════ HERO — Brand intro ══════════ */}
      <section className={s.hero} aria-label="Accueil Thinkerview">
        <motion.p className={s.kicker} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.1 }}>
          Portail citoyen souverain
        </motion.p>

        <motion.div className={s.masthead} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }}>
          <h1 className={s.title}>THINKERVIEW</h1>
          <div className={s.social}>
            <span className={s.socialLabel}>Suivez Thinkerview</span>
            <div className={s.socialIcons}>
              {SOCIAL_LINKS.map(link => (
                <a key={link.href} href={link.href} aria-label={link.label} target="_blank" rel="noopener" className={s.socialLink}>
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div className={s.rule} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }} />

        <motion.p className={s.tagline} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.8 }}>
          Zéro bot, zéro manipulation, zéro censure — une communauté de citoyens qui pensent par eux-mêmes.
        </motion.p>

        {/* ── Pillars ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1 }}>
          <div className={s.pillars} ref={containerRef}>
            <AnimatePresence>
              {indicator && activePillar !== null && (
                <motion.div
                  className={s.slider}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, left: indicator.left, width: indicator.width }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 30, opacity: { duration: 0.12 } }}
                />
              )}
            </AnimatePresence>
            {PILLARS.map((p, i) => (
              <button
                key={p.label}
                ref={el => { pillarRefs.current[i] = el; }}
                className={`${s.pillar}${activePillar === i ? ` ${s.pillarActive}` : ''}`}
                onClick={() => setActivePillar(prev => prev === i ? null : i)}
              >
                {p.label}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            {activePillar !== null && (
              <motion.div key={activePillar} className={s.card} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}>
                <div className={s.cardInner}>
                  <span className={s.cardTitle}>{PILLARS[activePillar].title}</span>
                  <p className={s.cardText}>{PILLARS[activePillar].text}</p>
                  <a href={`/articles?rubrique=${PILLARS[activePillar].label.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')}`} className={s.cardCta}>
                    Explorer cette rubrique <ArrowRight />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ══════════ HERO GRID — 3 colonnes simultanées ══════════ */}
      <section className={s.heroSection}>
        <div className={s.sectionHeader}>
          <div className={s.chapterMark}>
            <span className={s.chNum}>Ch.01</span>
            <span className={s.chSep}>/</span>
            <span className={s.chLabel}>À la une</span>
          </div>
          <h2 className={s.sectionTitle}>{`L'essentiel,`} <em>maintenant</em>.</h2>
          <p className={s.sectionDesc}>Interviews, analyses, votes — tout ce qui compte en ce moment sur la plateforme.</p>
        </div>

        <div className={s.heroGrid}>
          {/* ── COL 1 : Interview immersive (pleine hauteur) ── */}
          <a href={`/video/delattre-souverainete`} className={s.mainCol}>
            <img src={FEATURED.img} alt="" className={s.mainBgImg} />
            <div className={s.mainGradient} />
            {FEATURED.isNew && <span className={s.badge}>Nouveau</span>}
            <div className={s.mainPlayWrap}>
              <div className={s.mainPlayBtn}><Play /></div>
            </div>
            <div className={s.mainContent}>
              <div className={s.mainKicker}>
                <span className={s.mainTag}>{FEATURED.category}</span>
                <span className={s.mainMeta}>{FEATURED.duration}</span>
              </div>
              <h2 className={s.mainTitle}>{FEATURED.title}</h2>
              <p className={s.mainDeck}>{FEATURED.guest} — {FEATURED.role}</p>
              <div className={s.mainByline}>
                <span>{FEATURED.date}</span>
                <span className={s.dot} />
                <span>Interview exclusive</span>
              </div>
            </div>
          </a>

          {/* ── COL 2 : Baromètre (haut) + Articles (bas) ── */}
          <div className={s.centerCol}>
            {/* Baromètre */}
            <div className={s.barometreBlock}>
              <div className={s.barometreHead}>
                <span className={s.barometreLbl}>Baromètre citoyen</span>
                <span className={s.barometreVotes}>{BAROMETRE.totalVotes.toLocaleString('fr-FR')} votes</span>
              </div>
              <h3 className={s.barometreQ}>{BAROMETRE.question}</h3>
              <div className={s.barometreOpts}>
                {!vote ? (
                  BAROMETRE.options.map(o => (
                    <button key={o.id} className={s.opt} onClick={() => setVote(o.id)}>{o.label}</button>
                  ))
                ) : (
                  BAROMETRE.options.map(o => {
                    const pct = Math.round((o.votes / BAROMETRE.totalVotes) * 100);
                    return (
                      <div key={o.id} className={`${s.result} ${vote === o.id ? s.resultSelected : ''}`}>
                        <div className={s.resultBar} style={{ transform: `scaleX(${pct / 100})` }} />
                        <div className={s.resultContent}>
                          <span className={s.resultLabel}>{o.label}</span>
                          <span className={s.resultPct}>{pct}%</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              <div className={s.barometreFoot}>
                <span className={s.footVerified}><ShieldCheck /> 1 citoyen = 1 vote</span>
                <a href="/inscription" className={s.footCta}>Connexion pour voter <ArrowRight /></a>
              </div>
            </div>

            {/* Articles empilés */}
            <div className={s.articlesBlock}>
              <div className={s.blockHead}>
                <span className={s.blockLabel}>Comprendre</span>
                <a href="/articles" className={s.blockLink}>Tout voir <ArrowRight /></a>
              </div>
              {ARTICLES.map(a => (
                <a key={a.slug} href={`/article/${a.slug}`} className={s.articleItem}>
                  <div className={s.articleItemThumb}>
                    <img src={a.img} alt="" className={s.articleItemImg} />
                  </div>
                  <div className={s.articleItemBody}>
                    <span className={s.articleItemCat}>{a.category}</span>
                    <h4 className={s.articleItemTitle}>{a.title}</h4>
                    <span className={s.articleItemMeta}>{a.author} · {a.readTime}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* ── COL 3 : Articles + Dossier + 2 boxes ── */}
          <div className={s.rightCol}>
            {/* Articles récents */}
            <div className={s.articlesBlock}>
              <div className={s.blockHead}>
                <span className={s.blockLabel}>Lire</span>
                <a href="/articles" className={s.blockLink}>Tout voir <ArrowRight /></a>
              </div>
              {ARTICLES.map(a => (
                <a key={a.slug} href={`/article/${a.slug}`} className={s.articleItem}>
                  <div className={s.articleItemThumb}>
                    <img src={a.img} alt="" className={s.articleItemImg} />
                  </div>
                  <div className={s.articleItemBody}>
                    <span className={s.articleItemCat}>{a.category}</span>
                    <h4 className={s.articleItemTitle}>{a.title}</h4>
                    <span className={s.articleItemMeta}>{a.author} · {a.readTime}</span>
                  </div>
                </a>
              ))}
            </div>

            {/* Dossier vedette */}
            <a href={`/dossiers/${DOSSIERS[0].slug}`} className={s.dossierBlock}>
              <span className={s.dossierLabel}>Dossier</span>
              <span className={s.dossierCat}>{DOSSIERS[0].category}</span>
              <h3 className={s.dossierTitle}>{DOSSIERS[0].title}</h3>
              <div className={s.dossierFoot}>
                <span className={s.dossierCount}>{DOSSIERS[0].articleCount} articles</span>
                <span className={s.dossierCta}>Lire <ArrowRight /></span>
              </div>
            </a>

            {/* 2 mini boxes */}
            <div className={s.miniBoxes}>
              <a href="/newsletter" className={s.miniBox}>
                <Bell className={s.miniBoxIcon} />
                <div className={s.miniBoxBody}>
                  <span className={s.miniBoxTitle}>Newsletter</span>
                  <span className={s.miniBoxDesc}>Chaque dimanche, l'essentiel.</span>
                </div>
              </a>
              <a href="/ensemble" className={s.miniBox}>
                <Users className={s.miniBoxIcon} />
                <div className={s.miniBoxBody}>
                  <span className={s.miniBoxTitle}>Communauté</span>
                  <span className={s.miniBoxDesc}>43 271 membres vérifiés</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ COMMUNAUTÉ VÉRIFIÉE ══════════ */}
      <section className={s.joinSection}>
        <div className={s.joinNoise} aria-hidden="true" />
        <div className={s.joinInner}>
          {/* ── Left: brand statement ── */}
          <div className={s.joinBrand}>
            <span className={s.joinKicker}>
              <ShieldCheck className={s.joinKickerIcon} />
              Communauté vérifiée
            </span>
            <h2 className={s.joinTitle}>
              Chaque voix est <em>identifiée</em>.
            </h2>
          </div>

          {/* ── Center: pillars strip ── */}
          <div className={s.joinPillars}>
            {[
              { icon: Vote, label: 'Voter' },
              { icon: Lock, label: 'Dossiers' },
              { icon: MessageSquare, label: 'Débattre' },
              { icon: Bell, label: 'Alertes' },
            ].map(p => (
              <div key={p.label} className={s.joinPillar}>
                <p.icon className={s.joinPillarIcon} />
                <span className={s.joinPillarLabel}>{p.label}</span>
              </div>
            ))}
          </div>

          {/* ── Right: CTA ── */}
          <div className={s.joinAction}>
            <a href="/inscription" className={s.joinCta}>
              Rejoindre
              <ArrowRight />
            </a>
            <span className={s.joinCtaNote}>43 271 membres</span>
          </div>
        </div>
      </section>

      {/* ══════════ DERNIÈRE INTERVIEW ══════════ */}
      <section className={s.spotlightSection}>
        <a href={`/video/${LAST_INTERVIEW.slug}`} className={s.spotlightLink}>
          <div className={s.spotlightBg}>
            <img src={LAST_INTERVIEW.img} alt="" className={s.spotlightBgImg} aria-hidden="true" />
            <div className={s.spotlightOverlay} aria-hidden="true" />
            <div className={s.spotlightNoise} aria-hidden="true" />
          </div>

          <div className={s.spotlightContent}>
            <div className={s.spotlightTop}>
              <div className={`${s.sectionHeader} ${s.sectionHeaderLight}`}>
                <div className={s.chapterMark}>
                  <span className={s.chNum}>Ch.02</span>
                  <span className={s.chSep}>/</span>
                  <span className={s.chLabel}>{`Dernière interview`}</span>
                </div>
                <h2 className={s.sectionTitle}>Voir, écouter, <em>comprendre</em>.</h2>
                <p className={s.sectionDesc}>{`Des entretiens longs, sans coupure, sans filtre — pour aller au fond des sujets.`}</p>
                <a href="/videos" className={s.sectionLink}>Toutes les interviews <ArrowRight /></a>
              </div>
              <span className={s.spotlightEpisode}>
                Épisode #{LAST_INTERVIEW.episodeNum}
              </span>
            </div>

            <div className={s.spotlightCenter}>
              <span className={s.spotlightPlayRing}>
                <Play />
              </span>
              <span className={s.spotlightDuration}>{LAST_INTERVIEW.duration}</span>
            </div>

            <div className={s.spotlightBottom}>
              <div className={s.spotlightEditorial}>
                <span className={s.spotlightMeta}>
                  <span className={s.spotlightDot} aria-hidden="true" />
                  {LAST_INTERVIEW.timeLabel}
                  <span className={s.spotlightMetaSep}>·</span>
                  Interview · {LAST_INTERVIEW.category}
                </span>
                <h2 className={s.spotlightH}>
                  {LAST_INTERVIEW.headline} <em>{LAST_INTERVIEW.headlineEm}</em>.
                </h2>
                <p className={s.spotlightExcerpt}>{LAST_INTERVIEW.excerpt}</p>
              </div>
              <div className={s.spotlightGuest}>
                <div className={s.spotlightAvatar} aria-hidden="true" />
                <div className={s.spotlightGuestInfo}>
                  <span className={s.spotlightGuestName}>{LAST_INTERVIEW.guest}</span>
                  <span className={s.spotlightGuestRole}>{LAST_INTERVIEW.guestRole}</span>
                </div>
              </div>
            </div>
          </div>
        </a>
      </section>

      {/* ══════════ FORUM CITOYEN ══════════ */}
      <section className={s.forumSection}>
        <div className={s.forumInner}>
          {/* ── Header ── */}
          <div className={s.sectionHeader}>
            <div className={s.chapterMark}>
              <span className={s.chNum}>Ch.03</span>
              <span className={s.chSep}>/</span>
              <span className={s.chLabel}>Forum citoyen</span>
            </div>
            <h2 className={s.sectionTitle}>Les débats <em>en cours</em>.</h2>
            <p className={s.sectionDesc}>Zéro anonymat, zéro bot — chaque participant est un citoyen vérifié.</p>
            <a href="#" className={s.sectionLink}>Tout le forum <ArrowRight /></a>
          </div>

          {/* ── Live bar ── */}
          <div className={s.forumLive}>
            <div className={s.forumLiveDot} />
            <span className={s.forumLiveLabel}>En direct</span>
            <div className={s.forumLiveStats}>
              <span><strong>1 247</strong> en ligne</span>
              <span className={s.forumLiveSep}>·</span>
              <span><strong>38</strong> débats actifs</span>
            </div>
          </div>

          {/* ── Threads ── */}
          <div className={s.forumThreads}>
            {FORUM_THREADS.map(t => {
              const colors = PILLAR_COLORS[catKey(t.category)];
              return (
                <a key={t.slug} href={`/forum/${t.slug}`} className={s.thread}>
                  <div className={s.threadAccent} style={{ background: colors.accent }} aria-hidden="true" />
                  <div className={s.threadBody}>
                    <div className={s.threadTop}>
                      <a href={`/articles?rubrique=${catKey(t.category)}`} className={s.threadCat} style={{ color: colors.accent }} onClick={e => e.stopPropagation()}>{t.category}</a>
                      {t.hot && (
                        <span className={s.threadHot}>
                          <span className={s.threadHotDot} />
                          Tendance
                        </span>
                      )}
                    </div>
                    <h3 className={s.threadTitle}>{t.title}</h3>
                    <div className={s.threadMeta}>
                      <span className={s.threadStat}>
                        <MessageSquare className={s.threadIcon} />
                        {t.replies}
                      </span>
                      <span className={s.threadStat}>
                        <Users className={s.threadIcon} />
                        {t.participants}
                      </span>
                      <span className={s.threadActivity}>{t.lastActivity}</span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════ COMPRENDRE ══════════ */}
      <section className={s.compSection}>
        <div className={s.compInner}>
          {/* ── Header ── */}
          <div className={s.sectionHeader}>
            <div className={s.chapterMark}>
              <span className={s.chNum}>Ch.04</span>
              <span className={s.chSep}>/</span>
              <span className={s.chLabel}>Comprendre</span>
            </div>
            <h2 className={s.sectionTitle}>{`Nos analyses, au-delà`} <em>du flux</em>.</h2>
            <p className={s.sectionDesc}>{`Articles, décryptages, enquêtes — le fond éditorial produit par la rédaction.`}</p>
            <a href="/articles" className={s.sectionLink}>Tous les articles <ArrowRight /></a>
          </div>

          {/* ── Galaxy tabs ── */}
          <nav className={s.compTabs}>
            {GALAXIES.map((g, i) => (
              <button
                key={g.key}
                className={`${s.compTab} ${activeCompPillar === i ? s.compTabActive : ''}`}
                onClick={() => { setActiveCompPillar(i); setActiveCompUnivers(0); }}
                style={{ '--pillar-accent': PILLAR_COLORS[g.key].accent } as React.CSSProperties}
              >
                <span className={s.compTabDot} style={{ background: PILLAR_COLORS[g.key].accent }} />
                {g.label}
              </button>
            ))}
          </nav>

          {/* ── Active galaxy content ── */}
          <div className={s.compPanel} key={`${activeCompPillar}-${activeCompUnivers}`}>
            {(() => {
              const galaxy = GALAXIES[activeCompPillar];
              const colors = PILLAR_COLORS[galaxy.key];
              const universKey = galaxy.univers[activeCompUnivers]?.slug;
              const galaxyArticles = COMPRENDRE_ARTICLES[galaxy.key] || {};
              const articles = galaxyArticles[universKey] || [];
              return (
                <>
                  {/* ── Univers sub-tabs ── */}
                  <nav className={s.compUniversNav}>
                    {galaxy.univers.map((u, i) => (
                      <button
                        key={u.slug}
                        className={`${s.compUniversBtn} ${activeCompUnivers === i ? s.compUniversBtnActive : ''}`}
                        onClick={() => setActiveCompUnivers(i)}
                        style={{ '--pillar-accent': colors.accent } as React.CSSProperties}
                      >
                        {u.label}
                      </button>
                    ))}
                  </nav>

                  {/* ── 3 article cards ── */}
                  <div className={s.compGrid}>
                    {articles.map((a, i) => (
                      <a key={a.slug} href={`/article/${a.slug}`} className={s.compCard} style={{ '--pillar-accent': colors.accent } as React.CSSProperties}>
                        <div className={s.compCardAccent} style={{ background: colors.accent }} />
                        <div className={s.compCardCover}>
                          <img src={compCover(a.slug)} alt="" className={s.compCardCoverImg} />
                        </div>
                        <div className={s.compCardInner}>
                          <div className={s.compCardHead}>
                            <span className={s.compCardNum}>{String(i + 1).padStart(2, '0')}</span>
                            <span className={s.compCardBadge} style={{ color: colors.accent, borderColor: colors.border }}>
                              {galaxy.univers[activeCompUnivers]?.label}
                            </span>
                          </div>
                          <h4 className={s.compCardTitle}>{a.title}</h4>
                          <div className={s.compCardFoot}>
                            <span className={s.compCardAuthor}>{a.author}</span>
                            <span className={s.compCardTime}>{a.readTime}</span>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className={s.compFooter}>
                    <a href={`/articles?galaxie=${galaxy.key}&univers=${universKey}`} className={s.compAllLink} style={{ '--pillar-accent': colors.accent } as React.CSSProperties}>
                      Tous les articles « {galaxy.univers[activeCompUnivers]?.label} » <ArrowRight />
                    </a>
                    <span className={s.compCount}>+ de 40 articles dans cette galaxie</span>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </section>

      {/* ══════════ MISSION ══════════ */}
      <section className={s.missionSection}>
        <div className={s.missionNoise} aria-hidden="true" />
        <div className={s.missionInner}>
          <div className={`${s.sectionHeader} ${s.sectionHeaderLight}`}>
            <div className={s.chapterMark}>
              <span className={s.chNum}>Ch.05</span>
              <span className={s.chSep}>/</span>
              <span className={s.chLabel}>La mission</span>
            </div>
            <h2 className={s.sectionTitle}>Un portail citoyen pour <em>comprendre le monde</em>.</h2>
            <p className={s.sectionDesc}>{`Thinkerview construit un espace souverain d'information — sans publicité, sans algorithme, sans compromis éditorial. Voici ce que vous y trouverez.`}</p>
          </div>

          <div className={s.missionGrid}>
            {[
              { num: '01', title: 'Interviews longues', desc: `Des entretiens de 1 à 3 heures, sans coupure, face à des experts, chercheurs, lanceurs d'alerte. Le format signature de Thinkerview.`, href: '/videos', cta: 'Voir les interviews' },
              { num: '02', title: 'Articles & décryptages', desc: `Analyses de fond, enquêtes sourcées, décryptages pédagogiques — la rédaction produit ce que la vidéo ne peut pas couvrir.`, href: '/articles', cta: 'Lire les articles' },
              { num: '03', title: 'Dossiers thématiques', desc: `Des investigations au long cours qui croisent plusieurs sources et angles pour faire le tour complet d'un sujet.`, href: '/dossiers', cta: 'Explorer les dossiers' },
              { num: '04', title: 'Baromètre citoyen', desc: `Un vote = une voix vérifiée. Aucune manipulation, aucun bot — le baromètre reflète l'opinion réelle de la communauté.`, href: '/inscription', cta: 'Participer' },
              { num: '05', title: 'Forum citoyen', desc: `Un espace de débat modéré par la communauté elle-même, où chaque participant est identifié et chaque argument compte.`, href: '#forum', cta: 'Rejoindre les débats' },
              { num: '06', title: 'Alertes Signal', desc: `Analyses géopolitiques en temps réel, documents déclassifiés et signaux faibles — directement sur votre téléphone.`, href: '/newsletter', cta: 'Activer les alertes' },
            ].map(item => (
              <a key={item.num} href={item.href} className={s.missionCard}>
                <span className={s.missionNum}>{item.num}</span>
                <h3 className={s.missionCardTitle}>{item.title}</h3>
                <p className={s.missionCardDesc}>{item.desc}</p>
                <span className={s.missionCardCta}>{item.cta} <ArrowRight /></span>
              </a>
            ))}
          </div>

          <div className={s.missionPillarsWrap}>
            <span className={s.missionPillarsLabel}>6 piliers éditoriaux</span>
            <div className={s.missionPillarsList}>
              {PILLARS.map(p => {
                const key = p.label.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
                const colors = PILLAR_COLORS[key] || PILLAR_COLORS.geopolitique;
                return (
                  <a key={p.label} href={`/articles?rubrique=${key}`} className={s.missionPillarTag} style={{ borderColor: colors.accent, color: colors.accent }}>
                    {p.label}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ TICKER ══════════ */}
      <div className={s.ticker}>
        <div className={s.tickerRow}>
          <span className={s.tickerDot} />
          <span className={s.tickerLbl}>Signal</span>
          <div className={s.tickerOverflow}>
            <div className={s.tickerTrack}>
              {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                <span key={i} className={s.tickerItem}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ ABOUT BAND ══════════ */}
      <section className={s.aboutBand}>
        <div className={s.aboutInner}>
          <div className={s.aboutCol}>
            <h3 className={s.aboutLabel}>{`Qu'est-ce que Thinkerview ?`}</h3>
            <p className={s.aboutText}>
              {`ThinkerView est un groupe indépendant issu d'internet, très différent de la plupart des think-tanks qui sont inféodés à des partis politiques ou des intérêts privés.`}
            </p>
            <span className={s.aboutSubLabel}>Suivre la veille</span>
            <div className={s.aboutSocials}>
              {SOCIAL_LINKS.map(social => (
                <a key={social.href} href={social.href} aria-label={social.label} rel="noopener" className={s.aboutSocialLink}>
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className={s.aboutCol}>
            <h3 className={s.aboutLabel}>Thinkerview a pour objectifs</h3>
            <ul className={s.aboutList}>
              <li>{`Mettre à l'épreuve les idées et discours en décelant leurs failles, leurs limites.`}</li>
              <li>{`Écouter les points de vue peu médiatisés afin d'élargir nos prismes de lecture.`}</li>
              <li>{`Appréhender toute la complexité des enjeux actuels et futurs de notre monde.`}</li>
            </ul>
          </div>

          <div className={s.aboutCol}>
            <h3 className={s.aboutLabel}>Soutenez Thinkerview</h3>
            <p className={s.aboutText}>
              {`Vous pouvez soutenir l'équipe bénévole de Thinkerview via notre page Tipeee.`}
            </p>
            <a href="https://tipeee.com/Thinkerview" rel="noopener" className={s.aboutCta}>
              tipeee.com/Thinkerview <ArrowRight />
            </a>
          </div>

          <div className={s.aboutCol}>
            <h3 className={s.aboutLabel}>{`S'abonner au podcast`}</h3>
            <div className={s.aboutPodcasts}>
              <a href="https://podcasts.apple.com/fr/podcast/thinkerview/id1276262046" rel="noopener" className={`${s.podcastBtn} ${s.podcastApple}`}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 2.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Zm0 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm-2 5.5h4l-.5 5h-3l-.5-5Z" /></svg>
                Apple Podcasts
              </a>
              <a href="https://thinkerview.com/feed/podcast" rel="noopener" className={`${s.podcastBtn} ${s.podcastRss}`}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20S4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18ZM4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44ZM4 10.1a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1Z" /></svg>
                via RSS
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer className={s.footer}>
        <div className={s.inner}>

          {/* ── Explorez — tabbed ── */}
          <section className={s.ftExplore}>
            <header className={s.ftHead}>
              <span className={s.ftKicker}><span className={s.ftKickerDot} />Tout Thinkerview</span>
              <h2 className={s.ftTitle}>Explorez <em>par entrée.</em></h2>
              <p className={s.ftDeck}>Par galaxie, par univers, par format — chaque chemin mène quelque part.</p>
            </header>

            <nav className={s.ftTabs}>
              {([
                { id: 'galaxies' as const, label: 'Galaxies' },
                { id: 'formats' as const, label: 'Formats' },
                { id: 'apropos' as const, label: 'À propos' },
              ]).map(tab => (
                <button key={tab.id} className={`${s.ftTab} ${footerTab === tab.id ? s.ftTabActive : ''}`} onClick={() => setFooterTab(tab.id)}>
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Panel: Galaxies */}
            <div className={`${s.ftPanel} ${footerTab === 'galaxies' ? s.ftPanelActive : ''}`}>
              <div className={s.ftGrid6}>
                {GALAXIES.map((g, i) => {
                  const colors = PILLAR_COLORS[g.key];
                  return (
                    <div key={g.key} className={s.ftGalaxyCol} style={{ '--col-color': colors.accent } as React.CSSProperties}>
                      <div className={s.ftColAccent} />
                      <div className={s.ftColHead}>
                        <span className={s.ftColDot} />
                        <h3 className={s.ftColName}>{g.label}</h3>
                      </div>
                      <p className={s.ftColDesc}>{g.text}</p>
                      <div className={s.ftColLinks}>
                        {g.univers.map(u => (
                          <a key={u.slug} href={`/articles?galaxie=${g.key}&univers=${u.slug}`} className={s.ftColLink}>{u.label}</a>
                        ))}
                      </div>
                      <a href={`/articles?galaxie=${g.key}`} className={s.ftColCta}>
                        Explorer <ArrowRight />
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Panel: Formats */}
            <div className={`${s.ftPanel} ${footerTab === 'formats' ? s.ftPanelActive : ''}`}>
              <div className={s.ftGrid4}>
                {[
                  { name: 'Interviews longues', desc: `Des entretiens de 1 à 3 heures, sans coupure, face à des experts et lanceurs d'alerte.`, href: '/videos', cta: 'Voir les interviews', articles: ['François Delattre — Souveraineté numérique', 'Jean-Marc Jancovici — Transition ou effondrement ?', 'Zaki Laïdi — Le piège des sanctions'] },
                  { name: 'Articles & décryptages', desc: `Analyses de fond, enquêtes sourcées, décryptages pédagogiques produits par la rédaction.`, href: '/articles', cta: 'Lire les articles', articles: ['APT28 : anatomie de la cyberattaque', 'EPR2 : le pari nucléaire français', '3 500 milliards : la dette est-elle soutenable ?'] },
                  { name: 'Dossiers thématiques', desc: `Investigations au long cours croisant plusieurs sources et angles.`, href: '/dossiers', cta: 'Explorer les dossiers', articles: ['La guerre numérique', 'Énergie souveraine', `Cartographie des ingérences`] },
                  { name: 'Alertes Signal', desc: `Analyses géopolitiques en temps réel, documents déclassifiés et signaux faibles.`, href: '/newsletter', cta: 'Activer les alertes', articles: ['Câbles sous-marins : artères invisibles', 'DNS : qui contrôle l\'annuaire ?', 'Cloud Act et souveraineté des données'] },
                ].map(item => (
                  <div key={item.name} className={s.ftFormatCol}>
                    <h3 className={s.ftFormatName}>{item.name}</h3>
                    <p className={s.ftFormatDesc}>{item.desc}</p>
                    <div className={s.ftFormatArticles}>
                      {item.articles.map((a, i) => (
                        <span key={i} className={s.ftFormatArticle}>{a}</span>
                      ))}
                    </div>
                    <a href={item.href} className={s.ftColCta}>{item.cta} <ArrowRight /></a>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel: À propos */}
            <div className={`${s.ftPanel} ${footerTab === 'apropos' ? s.ftPanelActive : ''}`}>
              <div className={s.ftGrid3}>
                {[
                  { name: 'La mission', desc: `Thinkerview construit un espace souverain d'information — sans publicité, sans algorithme, sans compromis éditorial.`, href: '/a-propos', cta: 'En savoir plus' },
                  { name: 'Contact', desc: `Une question, un sujet à proposer, un partenariat — écrivez-nous. Réponse sous 48h.`, href: '/contact', cta: 'Nous écrire' },
                  { name: 'Communauté', desc: `43 271 citoyens vérifiés. Rejoignez un espace de débat sans bots, sans trolls, sans algorithme.`, href: '/ensemble', cta: 'Rejoindre' },
                ].map(item => (
                  <div key={item.name} className={s.ftFormatCol}>
                    <h3 className={s.ftFormatName}>{item.name}</h3>
                    <p className={s.ftFormatDesc}>{item.desc}</p>
                    <a href={item.href} className={s.ftColCta}>{item.cta} <ArrowRight /></a>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Navigation secondaire ── */}
          <nav className={s.ftNav}>
            {[
              { title: 'Plateforme', links: [
                { label: 'Articles', href: '/articles' },
                { label: 'Interviews', href: '/videos' },
                { label: 'Dossiers', href: '/dossiers' },
                { label: 'Forum citoyen', href: '#forum' },
                { label: 'Baromètre', href: '/inscription' },
                { label: 'Newsletter', href: '/newsletter' },
              ]},
              { title: 'Rejoindre', links: [
                { label: 'Créer un compte', href: '/inscription' },
                { label: 'Se connecter', href: '/connexion' },
                { label: 'Proposer un sujet', href: '/contact' },
                { label: 'Devenir partenaire', href: '/partenariats' },
              ]},
              { title: 'À propos', links: [
                { label: 'La mission', href: '/a-propos' },
                { label: 'Contact', href: '/contact' },
                { label: `L'équipe`, href: '/a-propos' },
              ]},
            ].map(section => (
              <div key={section.title} className={s.ftNavCol}>
                <span className={s.ftNavLabel}>{section.title}</span>
                {section.links.map(link => (
                  <a key={link.href + link.label} href={link.href} className={s.ftNavLink}>{link.label}</a>
                ))}
              </div>
            ))}
            <div className={s.ftNavCol}>
              <span className={s.ftNavLabel}>Suivre</span>
              <div className={s.ftSocial}>
                {SOCIAL_LINKS.map(social => (
                  <a key={social.href} href={social.href} aria-label={social.label} rel="noopener" className={s.ftSocialLink}>
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </nav>

          {/* ── Bottom strip ── */}
          <div className={s.ftStrip}>
            <div className={s.ftStripLeft}>
              <span className={s.ftCopy}>&copy; 2026 Thinkerview &middot; Paris</span>
            </div>
            <div className={s.ftLegal}>
              {[
                { href: '/mentions-legales', label: 'Mentions légales' },
                { href: '/cgu', label: 'CGU' },
                { href: '/confidentialite', label: 'Confidentialité' },
                { href: '/cookies', label: 'Cookies' },
                { href: '/plan-du-site', label: 'Plan du site' },
              ].map(link => (
                <a key={link.href} href={link.href} className={s.ftLegalLink}>{link.label}</a>
              ))}
            </div>
            <div className={s.ftStripSocial}>
              {SOCIAL_LINKS.map(social => (
                <a key={social.href} href={social.href} aria-label={social.label} rel="noopener" className={s.ftStripSocialLink}>
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Signature ── */}
          <div className={s.ftSignature}>
            <span className={s.ftWordmark}>Think<em>erview</em></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
