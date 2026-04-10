import { Coffee, Users, TrendingUp, Zap, Calendar, Target, Heart, Share2, DollarSign, Package, Brain, BarChart3, Rocket, Film, Globe, Shield } from 'lucide-react';
import type { Slide } from './carouselTypes';

export const slides: Slide[] = [
  {
    id: 1,
    type: 'cover',
    title: 'Wanted × Origines Media',
    subtitle: 'L\'empire média de l\'entraide',
    punchline: '« 1.5M de membres. 12 verticales. 0€ de monétisation média. C\'est fini. »',
    bgGradient: 'from-orange-900/20 via-purple-900/20 to-pink-900/20',
    icon: Heart
  },
  {
    id: 2,
    type: 'problem',
    title: 'Le constat brutal',
    subtitle: '90% de valeur perdue',
    points: [
      '1.5 million de membres ultra-engagés sur Facebook',
      'Des milliers d\'histoires qui changent des vies chaque jour',
      'Mais tout meurt dans le flux, aucune monétisation, impact non mesuré'
    ],
    conclusion: 'C\'est comme posséder Netflix mais diffuser sur Périscope.',
    bgGradient: 'from-red-900/20 via-orange-900/20 to-amber-900/20',
    icon: TrendingUp
  },
  {
    id: 3,
    type: 'solution',
    title: 'La transformation',
    subtitle: 'De Facebook à empire média',
    components: [
      { icon: Users, label: 'Wanted', desc: 'La scène : 1.5M membres, 12 verticales' },
      { icon: Film, label: 'Origines', desc: 'La machine : 200 contenus/mois' },
      { icon: Zap, label: 'Ensemble', desc: 'L\'alchimie : stories → viral → revenus' },
      { icon: Heart, label: 'Impact', desc: '100% réinvesti dans l\'entraide' }
    ],
    flow: '1 histoire Facebook → 1 tournage pro → 14 formats → 1M vues → Actions financées',
    bgGradient: 'from-violet-900/20 via-purple-900/20 to-indigo-900/20',
    icon: Rocket
  },
  {
    id: 4,
    type: 'verticales',
    title: 'Les 12 empires verticaux',
    subtitle: 'Chacun son audience, sa ligne édito, ses sponsors',
    verticales: [
      { name: 'WantedAnimaux', metric: '500 adoptions/mois', sponsor: 'Purina', color: '#F97316' },
      { name: 'WantedBusiness', metric: '50 entreprises créées', sponsor: 'LinkedIn', color: '#3B82F6' },
      { name: 'WantedLogement', metric: '200 hébergements', sponsor: 'Airbnb', color: '#10B981' },
      { name: 'WantedSanté', metric: '300 consultations', sponsor: 'Doctolib', color: '#EC4899' }
    ],
    total: '12 verticales = 12 business units autonomes',
    bgGradient: 'from-blue-900/20 via-purple-900/20 to-pink-900/20',
    icon: Globe
  },
  {
    id: 5,
    type: 'troc',
    title: 'Le troc réinventé',
    subtitle: 'L\'économie circulaire qui génère des vues',
    ecosystem: [
      { step: 'Post Facebook', desc: 'Marie cherche un vélo', icon: Users },
      { step: 'Live Wanted', desc: 'Paul propose d\'échanger', icon: Coffee },
      { step: 'Match trouvé', desc: 'Sophie complète le triangle', icon: Zap },
      { step: 'Story virale', desc: '1M vues = 50 nouveaux trocs', icon: Heart }
    ],
    stats: {
      monthly: '10k échanges/mois',
      value: '500k€ de valeur échangée',
      impact: 'Zéro déchet, 100% solidaire'
    },
    bgGradient: 'from-green-900/20 via-emerald-900/20 to-cyan-900/20',
    icon: Package
  },
  {
    id: 6,
    type: 'orchestration',
    title: 'La machine parfaitement huilée',
    subtitle: 'Du post Facebook aux millions d\'euros',
    flow: [
      { source: 'Groupes FB', action: 'Détection besoins', result: '1000 posts/jour', icon: Users },
      { source: 'Cafés Wanted', action: 'Lives quotidiens', result: '50k€ dons/mois', icon: Coffee },
      { source: 'Production', action: 'Stories virales', result: '20M vues/mois', icon: Film },
      { source: 'Data & Sponsors', action: 'Monétisation', result: '400k€/mois', icon: DollarSign }
    ],
    magic: 'Chaque euro gagné = 1 action financée. La boucle est bouclée.',
    bgGradient: 'from-orange-900/20 via-purple-900/20 to-blue-900/20',
    icon: Target
  },
  {
    id: 7,
    type: 'production',
    title: 'La machine de production',
    subtitle: '1 tournage = 14 contenus = 100x plus de reach',
    formula: {
      input: '1 histoire touchante filmée en live',
      outputs: [
        { format: '1 vidéo longue', detail: '15-20 min YouTube' },
        { format: '10 shorts', detail: 'TikTok, Reels, Shorts' },
        { format: '3 carrousels', detail: 'LinkedIn, Instagram' },
        { format: '1 podcast', detail: 'Version audio Spotify' }
      ]
    },
    stats: '200 contenus/mois × 12 verticales = 2400/an',
    bgGradient: 'from-pink-900/20 via-purple-900/20 to-violet-900/20',
    icon: Film
  },
  {
    id: 8,
    type: 'tech',
    title: 'La tech qui scale',
    subtitle: 'IA + Algorithmes + Data = Machine automatisée',
    features: [
      { name: 'IA Editor', desc: 'Découpe automatique en shorts', icon: Brain },
      { name: 'Smart Titles', desc: 'A/B testing des accroches', icon: Target },
      { name: 'Impact Tracker', desc: 'Dashboard temps réel', icon: BarChart3 },
      { name: 'Viral Engine', desc: 'Optimisation multi-plateformes', icon: Zap }
    ],
    result: 'Production 10x plus rapide, reach 100x plus large',
    bgGradient: 'from-cyan-900/20 via-blue-900/20 to-indigo-900/20',
    icon: Shield
  },
  {
    id: 9,
    type: 'business',
    title: 'Modèle économique',
    subtitle: '400k€/mois de potentiel',
    revenues: [
      { name: 'Sponsors verticales', amount: '30k€ × 12', color: '#8B5CF6' },
      { name: 'Branded content', amount: '40k€/mois', color: '#EC4899' },
      { name: 'Events & activations', amount: '20k€/mois', color: '#F97316' },
      { name: 'Formations & masterclass', amount: '15k€/mois', color: '#10B981' }
    ],
    distribution: '50% production Origines, 50% actions terrain Wanted',
    bgGradient: 'from-emerald-900/20 via-green-900/20 to-teal-900/20',
    icon: DollarSign
  },
  {
    id: 10,
    type: 'traction',
    title: 'La traction actuelle',
    subtitle: 'Les preuves que ça marche déjà',
    metrics: [
      { label: 'Membres actifs', value: '1.5M', growth: '+15%/mois' },
      { label: 'Vues actuelles', value: '2M/mois', growth: 'Potentiel: 20M' },
      { label: 'Actions terrain', value: '50k/an', growth: 'Objectif: 500k' },
      { label: 'Cafés ouverts', value: '3 villes', growth: 'Plan: 20 villes' }
    ],
    highlight: 'La communauté est là. Il manque juste la machine média.',
    bgGradient: 'from-orange-900/20 via-red-900/20 to-pink-900/20',
    icon: BarChart3
  },
  {
    id: 11,
    type: 'roadmap',
    title: 'Les 4 actes de transformation',
    subtitle: 'De 0 à 10M€ en 3 ans',
    phases: [
      { name: 'Sprint 30j', goal: '200 contenus/mois', desc: 'Machine lancée', icon: Rocket },
      { name: '6 mois', goal: '20M vues/mois', desc: '12 verticales actives', icon: Target },
      { name: '1 an', goal: '500k€ CA', desc: 'Autofinancé', icon: TrendingUp },
      { name: '3 ans', goal: '10M€ CA', desc: 'Netflix de la solidarité', icon: Globe }
    ],
    bgGradient: 'from-violet-900/20 via-purple-900/20 to-pink-900/20',
    icon: Calendar
  },
  {
    id: 12,
    type: 'team',
    title: 'L\'équipe de choc',
    subtitle: '120+ passionnés prêts à transformer l\'entraide',
    stats: [
      { role: '2 fondateurs visionnaires', detail: 'Wanted + Origines' },
      { role: '50 créateurs de contenus', detail: 'Tous formats' },
      { role: '12 responsables verticales', detail: '1 expert/thématique' },
      { role: '10 développeurs', detail: 'Tech & IA' }
    ],
    culture: 'Impact first. Authenticité. Excellence Netflix.',
    bgGradient: 'from-indigo-900/20 via-purple-900/20 to-pink-900/20',
    icon: Users
  },
  {
    id: 13,
    type: 'impact',
    title: 'L\'impact projeté',
    subtitle: 'Ce qu\'on va accomplir ensemble',
    projections: [
      { timeline: '6 mois', metric: '100k actions financées', equivalent: '= 1 stade de France aidé' },
      { timeline: '1 an', metric: '1M heures de bénévolat', equivalent: '= 500 emplois créés' },
      { timeline: '2 ans', metric: '5M personnes touchées', equivalent: '= Lyon + Marseille' },
      { timeline: '3 ans', metric: '10M€ redistribués', equivalent: '= 1000 vies transformées' }
    ],
    bgGradient: 'from-green-900/20 via-emerald-900/20 to-teal-900/20',
    icon: Heart
  },
  {
    id: 14,
    type: 'cta',
    title: 'Le futur commence dans 48h',
    subtitle: 'On se voit. On pose tout. On lance.',
    actions: [
      { text: 'Dans 48h → Workshop stratégie ensemble' },
      { text: 'Dans 30 jours → 200 premiers contenus en ligne' },
      { text: 'Dans 6 mois → Tu ne reconnais plus Wanted' },
      { text: 'Dans 3 ans → Standard mondial créé' }
    ],
    punchline: 'Tes 1.5M de membres méritent mieux qu\'un groupe Facebook.',
    bgGradient: 'from-orange-900/20 via-purple-900/20 to-violet-900/20',
    icon: Share2
  }
];
