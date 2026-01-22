// src/components/navbar/navData.ts
// Données statiques pour la navigation

import { YouTubeIcon, XIcon, SnapchatIcon, FacebookIcon, InstagramIcon, TikTokIcon } from './SocialIcons';
import type { SocialLink, SeriesItem, FeaturedContent, UniversItem, AcademieItem, RecoItem, NavItem } from './types';

// Liens réseaux sociaux
export const socialLinks: SocialLink[] = [
  { icon: YouTubeIcon, href: 'https://youtube.com/@originesmedia', label: 'YouTube', color: '#FF0000' },
  { icon: XIcon, href: 'https://x.com/originesmedia', label: 'X', color: '#000000' },
  { icon: SnapchatIcon, href: 'https://snapchat.com/add/originesmedia', label: 'Snapchat', color: '#FFFC00' },
  { icon: FacebookIcon, href: 'https://facebook.com/originesmedia', label: 'Facebook', color: '#1877F2' },
  { icon: InstagramIcon, href: 'https://instagram.com/originesmedia', label: 'Instagram', color: '#E4405F' },
  { icon: TikTokIcon, href: 'https://tiktok.com/@originesmedia', label: 'TikTok', color: '#000000' },
];

// Séries pour le mega menu showcase
export const seriesShowcase: SeriesItem[] = [
  { title: 'Transmission', image: '/series/01_transmission_poster.jpg', href: '/series/transmission', episodes: 12, color: '#6366F1' },
  { title: 'État d\'esprit', image: '/series/02_etat_esprit_poster.jpg', href: '/series/etat-d-esprit', episodes: 8, color: '#06B6D4' },
  { title: 'Il était une fois', image: '/series/03_il_etait_une_fois_poster.jpg', href: '/series/il-etait-une-fois', episodes: 15, color: '#F59E0B' },
  { title: 'Secrets pro', image: '/series/04_secrets_professionnels_poster.jpg', href: '/series/secrets-professionnels', episodes: 10, color: '#8B5CF6' },
  { title: 'La lettre', image: '/series/05_la_lettre_poster.jpg', href: '/series/la-lettre', episodes: 6, color: '#10B981' },
  { title: 'Imagine', image: '/series/06_imagine_poster.jpg', href: '/series/imagine', episodes: 9, color: '#EC4899' },
];

// Contenus dynamiques par univers
export const universFeaturedByCategory: Record<string, FeaturedContent[]> = {
  'default': [
    { title: 'Les secrets du bonheur', image: '/placeholder.svg', href: '/article/secrets-bonheur', tag: 'Psychologie', tagColor: '#4F46E5' },
    { title: 'Voyager autrement', image: '/placeholder.svg', href: '/article/voyager-autrement', tag: 'Voyage', tagColor: '#10B981' }
  ],
  'Psychologie': [
    { title: 'Les secrets du bonheur', image: '/placeholder.svg', href: '/article/secrets-bonheur', tag: 'Psychologie', tagColor: '#4F46E5' },
    { title: 'Comprendre ses émotions', image: '/placeholder.svg', href: '/article/comprendre-emotions', tag: 'Psychologie', tagColor: '#4F46E5' }
  ],
  'Société': [
    { title: 'Vivre ensemble demain', image: '/placeholder.svg', href: '/article/vivre-ensemble', tag: 'Société', tagColor: '#D97706' },
    { title: 'Les nouveaux liens sociaux', image: '/placeholder.svg', href: '/article/liens-sociaux', tag: 'Société', tagColor: '#D97706' }
  ],
  'Famille': [
    { title: 'Transmission entre générations', image: '/placeholder.svg', href: '/article/transmission-generations', tag: 'Famille', tagColor: '#FB7185' },
    { title: 'L\'amour au quotidien', image: '/placeholder.svg', href: '/article/amour-quotidien', tag: 'Famille', tagColor: '#FB7185' }
  ],
  'Voyage': [
    { title: 'Voyager autrement', image: '/placeholder.svg', href: '/article/voyager-autrement', tag: 'Voyage', tagColor: '#10B981' },
    { title: 'Destinations inspirantes', image: '/placeholder.svg', href: '/article/destinations-inspirantes', tag: 'Voyage', tagColor: '#10B981' }
  ],
  'Spiritualité': [
    { title: 'Le chemin intérieur', image: '/placeholder.svg', href: '/article/chemin-interieur', tag: 'Spiritualité', tagColor: '#9333EA' },
    { title: 'Méditation guidée', image: '/placeholder.svg', href: '/article/meditation-guidee', tag: 'Spiritualité', tagColor: '#9333EA' }
  ],
  'Carrière': [
    { title: 'Réussir sa reconversion', image: '/placeholder.svg', href: '/article/reussir-reconversion', tag: 'Carrière', tagColor: '#0EA5E9' },
    { title: 'Leadership au féminin', image: '/placeholder.svg', href: '/article/leadership-feminin', tag: 'Carrière', tagColor: '#0EA5E9' }
  ],
  'Art & Créativité': [
    { title: 'L\'art de créer', image: '/placeholder.svg', href: '/article/art-creer', tag: 'Créativité', tagColor: '#D946EF' },
    { title: 'Portraits d\'artistes', image: '/placeholder.svg', href: '/article/portraits-artistes', tag: 'Créativité', tagColor: '#D946EF' }
  ],
  'Santé': [
    { title: 'Prendre soin de soi', image: '/placeholder.svg', href: '/article/prendre-soin', tag: 'Santé', tagColor: '#DC2626' },
    { title: 'Bien-être au naturel', image: '/placeholder.svg', href: '/article/bien-etre-naturel', tag: 'Santé', tagColor: '#DC2626' }
  ],
  'Tech': [
    { title: 'L\'IA au service de l\'humain', image: '/placeholder.svg', href: '/article/ia-humain', tag: 'Tech', tagColor: '#2563EB' },
    { title: 'Innovations de demain', image: '/placeholder.svg', href: '/article/innovations-demain', tag: 'Tech', tagColor: '#2563EB' }
  ],
  'Business': [
    { title: 'Entreprendre autrement', image: '/placeholder.svg', href: '/article/entreprendre-autrement', tag: 'Business', tagColor: '#14B8A6' },
    { title: 'Success stories', image: '/placeholder.svg', href: '/article/success-stories', tag: 'Business', tagColor: '#14B8A6' }
  ]
};

// Épisodes mis en avant pour Séries
export const seriesFeatured: FeaturedContent[] = [
  {
    title: 'Transmission - Ép. 1 : L\'héritage',
    image: '/series/01_transmission.jpg',
    href: '/series/transmission/episode-1',
    tag: 'Nouveau',
    tagColor: '#6366F1'
  },
  {
    title: 'État d\'esprit - Ép. 3 : La résilience',
    image: '/series/02_etat_esprit.jpg',
    href: '/series/etat-d-esprit/episode-3',
    tag: 'Populaire',
    tagColor: '#EC4899'
  },
  {
    title: 'Il était une fois - Ép. 5 : Le destin',
    image: '/series/03_il_etait_une_fois.jpg',
    href: '/series/il-etait-une-fois/episode-5',
    tag: 'Tendance',
    tagColor: '#F59E0B'
  }
];

// Items pour le dropdown Univers
export const universItems: UniversItem[] = [
  { name: 'Psychologie', href: '/univers/psychologie', color: '#4F46E5' },
  { name: 'Société', href: '/univers/societe', color: '#D97706' },
  { name: 'Famille', href: '/univers/famille', color: '#FB7185' },
  { name: 'Voyage', href: '/univers/voyage', color: '#10B981' },
  { name: 'Spiritualité', href: '/univers/spiritualite', color: '#9333EA' },
  { name: 'Carrière', href: '/univers/carriere', color: '#0EA5E9' },
  { name: 'Art & Créativité', href: '/univers/art-creativite', color: '#D946EF' },
  { name: 'Santé', href: '/univers/sante', color: '#DC2626' },
  { name: 'Tech', href: '/univers/tech', color: '#2563EB' },
  { name: 'Business', href: '/univers/business', color: '#14B8A6' },
];

// Items pour le dropdown Académie
export const academieItems: AcademieItem[] = [
  { name: 'Kit d\'Introspection', subtitle: 'Démarrez votre voyage', href: '/academie/kit-introspection', price: 'Gratuit', free: true },
  { name: 'Masterclass Storytelling', subtitle: 'L\'art du récit', href: '/academie/masterclass-storytelling', price: '29€', originalPrice: '49€', highlight: true },
  { name: 'Guide Mindset', subtitle: 'Transformez votre mental', href: '/academie/guide-mindset', price: '19€' },
  { name: 'Programme Complet', subtitle: 'Accès illimité à vie', href: '/academie/programme-complet', price: '79€', originalPrice: '147€' },
];

// Items pour le dropdown Recos
export const recoItems: RecoItem[] = [
  { name: 'Livres', href: '/recommandations?type=livre', color: '#EC4899' },
  { name: 'Films & Séries', href: '/recommandations?type=film', color: '#8B5CF6' },
  { name: 'Musique', href: '/recommandations?type=musique', color: '#6366F1' },
  { name: 'Podcasts', href: '/recommandations?type=podcast', color: '#14B8A6' },
  { name: 'Social', href: '/recommandations?type=reseaux-sociaux', color: '#0891B2' },
  { name: 'YouTube', href: '/recommandations?type=youtube', color: '#EF4444' },
  { name: 'Activité', href: '/recommandations?type=activite', color: '#10B981' },
  { name: 'Destination', href: '/recommandations?type=destination', color: '#0EA5E9' },
  { name: 'Culture', href: '/recommandations?type=culture', color: '#A855F7' },
  { name: 'Produits', href: '/recommandations?type=produit', color: '#F59E0B' },
];

// Items pour le dropdown Articles
export const articlesItems: UniversItem[] = [
  { name: 'Psychologie', href: '/articles?verticale=psychologie', color: '#4F46E5' },
  { name: 'Société', href: '/articles?verticale=societe', color: '#D97706' },
  { name: 'Famille', href: '/articles?verticale=famille', color: '#FB7185' },
  { name: 'Voyage', href: '/articles?verticale=voyage', color: '#10B981' },
  { name: 'Spiritualité', href: '/articles?verticale=spiritualite', color: '#9333EA' },
  { name: 'Carrière', href: '/articles?verticale=carriere', color: '#0EA5E9' },
  { name: 'Art & Créativité', href: '/articles?verticale=art-creativite', color: '#D946EF' },
  { name: 'Santé', href: '/articles?verticale=sante', color: '#DC2626' },
  { name: 'Tech', href: '/articles?verticale=tech', color: '#2563EB' },
  { name: 'Business', href: '/articles?verticale=business', color: '#14B8A6' },
];

// Items pour le dropdown Histoires
export const histoiresItems: UniversItem[] = [
  { name: 'Émotions & Bien-être', href: '/histoires?categorie=emotions', color: '#EC4899' },
  { name: 'Développement', href: '/histoires?categorie=developpement', color: '#10B981' },
  { name: 'Parcours & Résilience', href: '/histoires?categorie=parcours', color: '#8B5CF6' },
  { name: 'Relations & Famille', href: '/histoires?categorie=relations', color: '#F59E0B' },
  { name: 'Santé mentale', href: '/histoires?categorie=sante', color: '#06B6D4' },
  { name: 'Épreuves & Inspiration', href: '/histoires?categorie=epreuves', color: '#6366F1' },
];

// Items pour le dropdown Vidéos
export const videosItems: UniversItem[] = [
  { name: 'Reportages', href: '/videos?format=reportages', color: '#0891B2' },
  { name: 'Témoignages', href: '/videos?format=temoignages', color: '#8B5CF6' },
  { name: 'Concept YouTube', href: '/videos?format=youtube', color: '#EF4444' },
  { name: 'Shorts', href: '/videos?format=shorts', color: '#EC4899' },
  { name: 'Live', href: '/videos?format=live', color: '#10B981' },
  { name: 'Vlogs', href: '/videos?format=vlogs', color: '#F59E0B' },
  { name: 'Décryptages', href: '/videos?format=decryptages', color: '#6366F1' },
  { name: 'Débats', href: '/videos?format=debats', color: '#DC2626' },
  { name: 'Portraits', href: '/videos?format=portraits', color: '#14B8A6' },
  { name: 'News', href: '/videos?format=news', color: '#1F2937' },
];

// Items de navigation principale
export const navItems: NavItem[] = [
  { label: 'Articles', href: '/articles', hasDropdown: true, color: '#374151', hoverColor: '#059669', hoverBg: 'bg-emerald-50' },
  { label: 'Vidéos', href: '/videos', hasDropdown: true, color: '#374151', hoverColor: '#0891B2', hoverBg: 'bg-cyan-50' },
  { label: 'Histoires', href: '/histoires', hasDropdown: true, color: '#374151', hoverColor: '#DB2777', hoverBg: 'bg-rose-50' },
  { label: 'Séries', href: '/series', hasDropdown: true, color: '#374151', hoverColor: '#8B5CF6', hoverBg: 'bg-violet-50' },
  { label: 'Recos', href: '/recommandations', hasDropdown: true, color: '#374151', hoverColor: '#EC4899', hoverBg: 'bg-pink-50' },
  { label: 'Académie', href: '/academie', hasDropdown: true, color: '#374151', hoverColor: '#D97706', hoverBg: 'bg-amber-50' },
];
