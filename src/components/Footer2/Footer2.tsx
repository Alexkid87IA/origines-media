import { useState } from "react";
import { UNIVERS, type UniversId } from "@/data/univers";
import s from "./Footer2.module.css";

/* ---- Social SVG icons (same as SiteHeader) ---- */

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.9 31.9 0 0 0 0 12a31.9 31.9 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8ZM9.5 15.6V8.4l6.3 3.6-6.3 3.6Z" />
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.3 7.1A4.5 4.5 0 0 1 16 5.6V2h-3.5v13.5a3 3 0 1 1-2-2.8V9a6.5 6.5 0 1 0 5.5 6.4V9.9a8 8 0 0 0 4.5 1.4V7.8a4.5 4.5 0 0 1-1.2-.7Z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2ZM8 19H5v-9h3v9ZM6.5 8.5A1.75 1.75 0 1 1 8.3 6.8 1.75 1.75 0 0 1 6.5 8.5ZM20 19h-3v-4.7c0-1.1 0-2.6-1.6-2.6S13.5 13 13.5 14.2V19h-3v-9h2.9v1.2h0a3.2 3.2 0 0 1 2.8-1.5c3 0 3.6 2 3.6 4.5V19Z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.2 2.3h3.5l-7.7 8.8L23 21.7h-7.1l-5.5-7.2-6.3 7.2H.6l8.2-9.4L.3 2.3h7.3l5 6.6 5.6-6.6Zm-1.2 17.5h1.9L7.1 4.2H5l12 15.6Z" />
  </svg>
);

const SnapchatIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.2 2c2.4 0 4.1 1.3 4.7 3.6.2.7.2 1.7.1 2.8l-.1.9c.4.2.9.3 1.3.2.5-.1 1 .2 1.1.6.1.5-.1.9-.5 1.1-.3.1-.6.2-1 .3-.3.1-.7.2-.9.3-.1.1-.2.2-.1.4.4 1.4 1.3 2.4 2.5 3.1.3.2.7.3 1 .4.4.1.7.5.6.9-.1.5-.6.8-1.2.9-.5.1-1 .2-1.5.4-.2.1-.3.2-.4.5-.1.3-.2.6-.5.9-.3.4-.8.5-1.3.4-.5-.1-1-.2-1.6-.1-.7.1-1.3.5-2 1-.8.6-1.5.9-2.2.9s-1.4-.3-2.2-.9c-.7-.5-1.3-.9-2-1-.6-.1-1.1 0-1.6.1-.5.1-1 0-1.3-.4-.2-.3-.4-.6-.5-.9-.1-.2-.2-.4-.4-.5-.5-.2-1-.3-1.5-.4-.6-.1-1.1-.4-1.2-.9-.1-.4.2-.8.6-.9.3-.1.7-.2 1-.4 1.2-.7 2.1-1.7 2.5-3.1.1-.2 0-.3-.1-.4-.2-.1-.6-.2-.9-.3-.4-.1-.7-.2-1-.3-.4-.2-.6-.6-.5-1.1.1-.4.6-.7 1.1-.6.4.1.9 0 1.3-.2l-.1-.9c-.1-1.1-.1-2.1.1-2.8C7.9 3.3 9.6 2 12 2h.2Z" />
  </svg>
);

/* ---- Data ---- */

const LEGAL_LINKS = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/cgu", label: "CGU" },
  { href: "/confidentialite", label: "Confidentialité" },
  { href: "/cookies", label: "Cookies" },
  { href: "/plan-du-site", label: "Plan du site" },
];

const SOCIAL_LINKS = [
  { href: "https://instagram.com/origines.media", label: "Instagram", icon: <InstagramIcon /> },
  { href: "https://youtube.com/@originesmedia", label: "YouTube", icon: <YouTubeIcon /> },
  { href: "https://tiktok.com/@origines.media", label: "TikTok", icon: <TikTokIcon /> },
  { href: "https://linkedin.com/company/origines-media", label: "LinkedIn", icon: <LinkedInIcon /> },
  { href: "https://x.com/originesmedia", label: "X", icon: <XIcon /> },
  { href: "https://snapchat.com/add/originesmedia", label: "Snapchat", icon: <SnapchatIcon /> },
];

/* ---- Explorez tab data ---- */

type TabId = "galaxie" | "univers" | "formats" | "dossiers" | "videos" | "guides" | "boutique" | "ensemble" | "apropos";

const TABS: { id: TabId; label: string }[] = [
  { id: "galaxie", label: "Galaxie" },
  { id: "univers", label: "Univers" },
  { id: "formats", label: "Formats" },
  { id: "dossiers", label: "Dossiers" },
  { id: "videos", label: "Vidéos" },
  { id: "guides", label: "Guides" },
  { id: "boutique", label: "Boutique" },
  { id: "ensemble", label: "Ensemble" },
  { id: "apropos", label: "À propos" },
];

/* ── Univers descriptions & icons ── */

const UNIVERS_DESCRIPTIONS: Record<UniversId, string> = {
  esprit: "Psychologie, neurosciences, conscience de soi, quête de sens. L'Esprit explore ce qui se joue dans notre tête — et pourquoi ça compte.",
  corps: "Nutrition, sommeil, mouvement, prévention. Le Corps raconte comment habiter son corps avec plus d'attention et moins d'injonctions.",
  liens: "Parentalité, couples, amitiés, ruptures, générations. Les Liens décryptent ce qui nous relie aux autres — et ce qui nous en sépare.",
  monde: "Voyages, art, littérature, cinéma, photographie. Le Monde ouvre des fenêtres sur ce qui existe ailleurs — et ce que ça change en nous.",
  avenir: "Travail, innovation, économie, numérique, intelligence artificielle. L'Avenir interroge ce qui vient — et comment s'y préparer.",
};

const ICONS: Record<UniversId, React.ReactNode> = {
  esprit: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className={s.itemSvg}>
      <path d="M12 2a7 7 0 017 7c0 3-1.5 4.5-3 6-.7.7-1 1.5-1 2.5V19a2 2 0 01-2 2h-2a2 2 0 01-2-2v-1.5c0-1-.3-1.8-1-2.5C6.5 13.5 5 12 5 9a7 7 0 017-7z" />
      <path d="M9 19h6M10 22h4" />
    </svg>
  ),
  corps: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className={s.itemSvg}>
      <circle cx="12" cy="4" r="2.5" />
      <path d="M12 8v5M12 13l-4 7M12 13l4 7" />
      <path d="M8 10l-4 3M16 10l4 3" />
    </svg>
  ),
  liens: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className={s.itemSvg}>
      <path d="M17 8a5 5 0 00-10 0c0 4 5 8 5 12 0-4 5-8 5-12z" />
      <path d="M12 20c0 0-3-2.5-3-5a3 3 0 016 0c0 2.5-3 5-3 5z" />
    </svg>
  ),
  monde: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className={s.itemSvg}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3.5 9h17M3.5 15h17" />
      <path d="M12 3c2 2.5 3.2 5.5 3.2 9S14 18.5 12 21c-2-2.5-3.2-5.5-3.2-9S10 5.5 12 3z" />
    </svg>
  ),
  avenir: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className={s.itemSvg}>
      <path d="M12 2l3 7h7l-5.5 4.5 2 7L12 16l-6.5 4.5 2-7L2 9h7l3-7z" />
    </svg>
  ),
};

/* ── Piliers (Galaxie) ── */

interface Pilier {
  id: string;
  name: string;
  description: string;
  color: string;
  href: string;
  subtopics: { label: string; href: string }[];
}

const PILIERS: Pilier[] = [
  {
    id: "media",
    name: "Média",
    description: "Articles, récits, immersions, témoignages. Le cœur éditorial d'Origines — cinq univers, des centaines d'histoires, et une question : d'où vient-on, et vers quoi ?",
    color: "#6D28D9",
    href: "/media",
    subtopics: [
      { label: "Articles", href: "/articles" },
      { label: "Réflexions", href: "/reflexions" },
      { label: "Témoignages", href: "/temoignages" },
      { label: "Portraits", href: "/portraits" },
      { label: "Dossiers", href: "/dossiers" },
      { label: "Newsletter", href: "/newsletter" },
      { label: "Recommandations", href: "/recommandations" },
    ],
  },
  {
    id: "prod",
    name: "Prod",
    description: "Reportages, documentaires, interviews et formats courts. 10 programmes, 106 vidéos — des histoires qu'on ne raconte pas ailleurs.",
    color: "#C2410C",
    href: "/programmes",
    subtopics: [
      { label: "Reportages", href: "/videos?format=reportages" },
      { label: "Documentaires", href: "/videos?format=documentaires" },
      { label: "Interviews", href: "/videos?format=interviews" },
      { label: "Shorts", href: "/videos?format=shorts" },
      { label: "Live", href: "/videos?format=live" },
      { label: "Programmes", href: "/programmes" },
    ],
  },
  {
    id: "ateliers",
    name: "Ateliers",
    description: "Masterclass, ateliers pratiques, programmes sur plusieurs semaines et kits gratuits. Apprendre, pratiquer, progresser — à votre rythme.",
    color: "#059669",
    href: "/guides",
    subtopics: [
      { label: "Masterclass", href: "/guides/masterclass" },
      { label: "Ateliers", href: "/guides/ateliers" },
      { label: "Programmes", href: "/guides/programmes" },
      { label: "Kits gratuits", href: "/guides/kits-gratuits" },
    ],
  },
  {
    id: "boutique",
    name: "Boutique",
    description: "E-books, workbooks, méditations audio, carnets et coffrets. L'univers Origines chez vous — des objets pensés pour écrire, penser et ralentir.",
    color: "#E11D48",
    href: "/boutique",
    subtopics: [
      { label: "E-books", href: "/boutique?cat=ebooks" },
      { label: "Workbooks", href: "/boutique?cat=workbooks" },
      { label: "Audio", href: "/boutique?cat=audio" },
      { label: "Carnets", href: "/boutique?cat=carnets" },
      { label: "Coffrets", href: "/boutique?cat=coffrets" },
    ],
  },
];

const PILIER_ICONS: Record<string, React.ReactNode> = {
  media: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className={s.itemSvg}>
      <path d="M4 4h16v16H4z" />
      <path d="M4 9h16M9 4v16" />
    </svg>
  ),
  prod: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className={s.itemSvg}>
      <polygon points="5,3 19,12 5,21" />
    </svg>
  ),
  ateliers: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className={s.itemSvg}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  boutique: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className={s.itemSvg}>
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
};

/* ── Other tabs: static data ── */

const FORMATS = [
  {
    id: "comprendre",
    name: "Comprendre",
    tagline: "Les clés pour décrypter un sujet en profondeur.",
    color: "#2E94B5",
    href: "/comprendre",
    articles: [
      { title: "Pourquoi le cerveau résiste au changement.", href: "/comprendre/cerveau-resistance-changement" },
      { title: "Le microbiote : ce deuxième cerveau qui nous gouverne.", href: "/comprendre/microbiote-deuxieme-cerveau" },
      { title: "Économie de l'attention : comment on vous vole votre temps.", href: "/comprendre/economie-attention" },
    ],
  },
  {
    id: "reflexions",
    name: "Réflexions",
    tagline: "Des essais qui prennent le temps de penser.",
    color: "#7B5CD6",
    href: "/reflexions",
    articles: [
      { title: "Le silence, le dernier luxe collectif.", href: "/reflexions/silence-luxe-collectif" },
      { title: "Pourquoi on a cessé de s'ennuyer — et ce qu'on y a perdu.", href: "/reflexions/ennui-perdu" },
      { title: "La lenteur comme acte politique.", href: "/reflexions/lenteur-acte-politique" },
    ],
  },
  {
    id: "temoignages",
    name: "Témoignages",
    tagline: "Des histoires vraies, racontées à la première personne.",
    color: "#E67839",
    href: "/temoignages",
    articles: [
      { title: "La lettre que je n'ai jamais envoyée.", href: "/temoignages/lettre-jamais-envoyee" },
      { title: "J'ai arrêté de parler à ma mère il y a trois ans.", href: "/temoignages/arrete-parler-mere" },
      { title: "Mon burn-out n'a pas commencé au travail.", href: "/temoignages/burnout-pas-commence-travail" },
    ],
  },
  {
    id: "portraits",
    name: "Portraits",
    tagline: "Rencontres avec ceux qui façonnent notre époque.",
    color: "#2E9B74",
    href: "/portraits",
    articles: [
      { title: "Fatou Diome : « On ne quitte jamais vraiment son pays. »", href: "/portraits/fatou-diome" },
      { title: "Dr. Christophe André : le psychiatre qui médite.", href: "/portraits/christophe-andre" },
      { title: "Céline Alvarez : réinventer l'école, pas la réparer.", href: "/portraits/celine-alvarez" },
    ],
  },
];

const DOSSIERS = [
  {
    id: "cerveau-et-decision",
    name: "Le cerveau et la décision",
    tagline: "1 question, 7 jours, 7 articles.",
    color: "#7B5CD6",
    href: "/dossiers/cerveau-et-decision",
    semaine: 17,
    articles: [
      { title: "Pourquoi on prend de mauvaises décisions.", href: "/dossiers/cerveau-et-decision/mauvaises-decisions" },
      { title: "Le biais de confirmation, notre ennemi intime.", href: "/dossiers/cerveau-et-decision/biais-confirmation" },
      { title: "Décider sous pression : ce que dit la science.", href: "/dossiers/cerveau-et-decision/decider-sous-pression" },
    ],
  },
  {
    id: "solitude-choisie",
    name: "La solitude choisie",
    tagline: "1 question, 7 jours, 7 articles.",
    color: "#E67839",
    href: "/dossiers/solitude-choisie",
    semaine: 16,
    articles: [
      { title: "Être seul n'est pas être isolé.", href: "/dossiers/solitude-choisie/seul-pas-isole" },
      { title: "Les bienfaits de la retraite volontaire.", href: "/dossiers/solitude-choisie/retraite-volontaire" },
      { title: "La solitude comme espace de création.", href: "/dossiers/solitude-choisie/espace-creation" },
    ],
  },
  {
    id: "corps-au-travail",
    name: "Le corps au travail",
    tagline: "1 question, 7 jours, 7 articles.",
    color: "#5AA352",
    href: "/dossiers/corps-au-travail",
    semaine: 15,
    articles: [
      { title: "Pourquoi votre dos vous parle de votre métier.", href: "/dossiers/corps-au-travail/dos-et-metier" },
      { title: "L'open space est-il un danger pour la santé ?", href: "/dossiers/corps-au-travail/open-space-sante" },
      { title: "Bouger au bureau : les micro-gestes qui changent tout.", href: "/dossiers/corps-au-travail/micro-gestes" },
    ],
  },
  {
    id: "education-numerique",
    name: "Éducation & numérique",
    tagline: "1 question, 7 jours, 7 articles.",
    color: "#2E94B5",
    href: "/dossiers/education-numerique",
    semaine: 14,
    articles: [
      { title: "Faut-il interdire les écrans avant 6 ans ?", href: "/dossiers/education-numerique/ecrans-avant-6-ans" },
      { title: "L'IA à l'école : promesse ou menace ?", href: "/dossiers/education-numerique/ia-ecole" },
      { title: "Les enfants qui codent apprennent-ils mieux ?", href: "/dossiers/education-numerique/enfants-codent" },
    ],
  },
];

const VIDEOS = [
  {
    id: "reportages",
    name: "Reportages",
    tagline: "Sur le terrain, au plus près du réel.",
    color: "#2E94B5",
    href: "/videos?format=reportages",
    articles: [
      { title: "Le grand sommeil français.", href: "/video/sommeil-enquete" },
      { title: "Le village qui a dit non.", href: "/video/village-qui-a-dit-non" },
      { title: "La rivière qu'on a oubliée.", href: "/video/riviere-oubliee" },
    ],
  },
  {
    id: "documentaires",
    name: "Documentaires",
    tagline: "Enquêtes longues, récits de fond.",
    color: "#7B5CD6",
    href: "/videos?format=documentaires",
    articles: [
      { title: "Ce que cache la procrastination.", href: "/video/procrastination-short" },
      { title: "La honte, en nous, sans nous.", href: "/video/honte-et-parole" },
      { title: "Le sens du silence.", href: "/video/sens-du-silence" },
    ],
  },
  {
    id: "interviews",
    name: "Interviews",
    tagline: "Face à face, sans filtre.",
    color: "#E67839",
    href: "/videos?format=interviews",
    articles: [
      { title: "J'ai démissionné à 29 ans.", href: "/video/demission-29-ans" },
      { title: "L'artisan qui refuse de grandir.", href: "/video/artisan-du-temps" },
      { title: "Les mains qui pensent.", href: "/video/les-mains-qui-pensent" },
    ],
  },
  {
    id: "shorts",
    name: "Shorts",
    tagline: "L'essentiel en moins de 10 minutes.",
    color: "#D64C90",
    href: "/videos?format=shorts",
    articles: [
      { title: "Le mot juste.", href: "/video/le-mot-juste" },
      { title: "Travailler moins pour créer plus.", href: "/video/travailler-moins" },
      { title: "Le retour du numérique lent.", href: "/video/ia-lente" },
    ],
  },
  {
    id: "live",
    name: "Live",
    tagline: "En direct, avec vous.",
    color: "#5AA352",
    href: "/videos?format=live",
    articles: [
      { title: "Pourquoi on ne sait plus s'ennuyer.", href: "/video/ennui-modernite" },
      { title: "La beauté des ruines.", href: "/video/beaute-des-ruines" },
      { title: "Lire à voix haute.", href: "/video/lire-a-voix-haute" },
    ],
  },
];

const GUIDES = [
  {
    id: "masterclass",
    name: "Masterclass",
    tagline: "Des experts partagent leur savoir en profondeur.",
    color: "#D64C90",
    href: "/guides/masterclass",
    articles: [
      { title: "Maîtriser l'art de la prise de parole.", href: "/guides/masterclass/prise-de-parole" },
      { title: "Écrire pour convaincre : les fondamentaux.", href: "/guides/masterclass/ecrire-convaincre" },
      { title: "Méditation : de débutant à pratiquant.", href: "/guides/masterclass/meditation-debutant" },
    ],
  },
  {
    id: "ateliers",
    name: "Ateliers",
    tagline: "Des exercices pratiques, pas à pas.",
    color: "#5A66D6",
    href: "/guides/ateliers",
    articles: [
      { title: "Atelier d'écriture introspective.", href: "/guides/ateliers/ecriture-introspective" },
      { title: "30 jours pour changer une habitude.", href: "/guides/ateliers/changer-habitude" },
      { title: "Journal de gratitude : mode d'emploi.", href: "/guides/ateliers/journal-gratitude" },
    ],
  },
  {
    id: "programmes",
    name: "Programmes",
    tagline: "Des parcours structurés sur plusieurs semaines.",
    color: "#2E9B74",
    href: "/guides/programmes",
    articles: [
      { title: "Programme Sommeil : 21 jours pour mieux dormir.", href: "/guides/programmes/sommeil-21-jours" },
      { title: "Détox numérique : le programme complet.", href: "/guides/programmes/detox-numerique" },
      { title: "Reprendre le sport après 40 ans.", href: "/guides/programmes/sport-40-ans" },
    ],
  },
  {
    id: "kits-gratuits",
    name: "Kits gratuits",
    tagline: "Des ressources téléchargeables, sans inscription.",
    color: "#5AA352",
    href: "/guides/kits-gratuits",
    articles: [
      { title: "Kit d'introspection — 12 questions essentielles.", href: "/guides/kits-gratuits/introspection" },
      { title: "Checklist bien-être au quotidien.", href: "/guides/kits-gratuits/checklist-bien-etre" },
      { title: "Template : planifier sa semaine avec intention.", href: "/guides/kits-gratuits/planifier-semaine" },
    ],
  },
];

const BOUTIQUE = [
  {
    id: "ebooks",
    name: "E-books",
    tagline: "Guides numériques à lire où vous voulez.",
    color: "#8B5CF6",
    href: "/boutique?cat=ebooks",
    articles: [
      { title: "Le Guide de l'Introspection — 120 pages.", href: "/boutique/guide-introspection" },
      { title: "Comprendre ses émotions — Le manuel.", href: "/boutique/comprendre-emotions" },
      { title: "Écrire pour se connaître.", href: "/boutique/ecrire-se-connaitre" },
    ],
  },
  {
    id: "workbooks",
    name: "Workbooks",
    tagline: "Cahiers d'exercices à remplir, pas à lire.",
    color: "#EC4899",
    href: "/boutique?cat=workbooks",
    articles: [
      { title: "Workbook Mindset — 48 exercices.", href: "/boutique/workbook-mindset" },
      { title: "Journal de Gratitude — 90 jours.", href: "/boutique/journal-gratitude" },
      { title: "Kit Objectifs — Planifier avec intention.", href: "/boutique/kit-objectifs" },
    ],
  },
  {
    id: "audio",
    name: "Audio",
    tagline: "Méditations guidées, séances et ambiances sonores.",
    color: "#0891B2",
    href: "/boutique?cat=audio",
    articles: [
      { title: "Pack Méditation — 12 séances guidées.", href: "/boutique/pack-meditation" },
      { title: "Ambiances Sonores — Concentration & calme.", href: "/boutique/ambiances-sonores" },
      { title: "Séance Respiration — 7 exercices.", href: "/boutique/seance-respiration" },
    ],
  },
  {
    id: "carnets",
    name: "Carnets & papeterie",
    tagline: "Objets physiques pensés pour écrire, penser, ralentir.",
    color: "#10B981",
    href: "/boutique?cat=carnets",
    articles: [
      { title: "Carnet Origines — 200 pages, papier premium.", href: "/boutique/carnet-origines" },
      { title: "Carnet de Route — Format voyage.", href: "/boutique/carnet-route" },
      { title: "Set de Cartes Postales — 12 illustrations.", href: "/boutique/cartes-postales" },
    ],
  },
  {
    id: "coffrets",
    name: "Coffrets",
    tagline: "Des coffrets thématiques à offrir ou s'offrir.",
    color: "#F59E0B",
    href: "/boutique?cat=coffrets",
    articles: [
      { title: "Coffret Nouveau Départ.", href: "/boutique/coffret-nouveau-depart" },
      { title: "Coffret Introspection — Le kit complet.", href: "/boutique/coffret-introspection" },
      { title: "Coffret Duo — Pour deux.", href: "/boutique/coffret-duo" },
    ],
  },
];

const ENSEMBLE = [
  {
    id: "histoires",
    name: "Vos histoires",
    tagline: "Des récits partagés par la communauté.",
    color: "#D64C90",
    href: "/histoires",
    articles: [
      { title: "J'ai écrit cette lettre à 22 ans. Je ne l'ai postée qu'à 34.", href: "/histoire/la-lettre-que-j-ai-jamais-envoyee" },
      { title: "Ce n'est pas la paresse. C'est la honte.", href: "/histoire/procrastination-honte" },
      { title: "À 52 ans, après le divorce, je suis partie seule.", href: "/histoire/partir-seul-a-50" },
    ],
  },
  {
    id: "recommandations",
    name: "Recommandations",
    tagline: "Ce qu'on lit, regarde et écoute pour vous.",
    color: "#7B5CD6",
    href: "/recommandations",
    articles: [
      { title: "5 livres qui changent le regard sur soi.", href: "/recommandations/livres-regard-soi" },
      { title: "Les podcasts qu'on écoute en boucle.", href: "/recommandations/podcasts-boucle" },
      { title: "Films et séries : notre sélection du mois.", href: "/recommandations/films-series-mois" },
    ],
  },
  {
    id: "newsletter",
    name: "La Lettre du dimanche",
    tagline: "Chaque semaine, l'essentiel d'Origines dans votre boîte.",
    color: "#C99B1E",
    href: "/newsletter",
    articles: [
      { title: "Édition #42 — Pourquoi on procrastine les choses qui comptent.", href: "/newsletter/edition-42" },
      { title: "Édition #41 — Le corps se souvient de tout.", href: "/newsletter/edition-41" },
      { title: "Édition #40 — Apprendre à dire non sans culpabiliser.", href: "/newsletter/edition-40" },
    ],
  },
  {
    id: "boutique",
    name: "Boutique",
    tagline: "Carnets, affiches, kits — l'univers Origines chez vous.",
    color: "#A07850",
    href: "/boutique",
    articles: [
      { title: "Kit d'Introspection — Gratuit.", href: "/boutique/kit-introspection" },
      { title: "Guide Mindset — 48 pages illustrées.", href: "/boutique/guide-mindset" },
      { title: "Carnet Origines — 200 pages, papier premium.", href: "/boutique/carnet-origines" },
    ],
  },
];

const APROPOS = [
  {
    id: "mission",
    name: "Notre mission",
    tagline: "Pourquoi Origines existe — et pour qui.",
    color: "#8B5CF6",
    href: "/a-propos",
    articles: [
      { title: "Des contenus d'utilité publique, depuis 2021.", href: "/a-propos" },
      { title: "Un média indépendant, sans publicité invasive.", href: "/a-propos" },
      { title: "Des récits qui transforment, pas qui divertissent.", href: "/a-propos" },
    ],
  },
  {
    id: "equipe",
    name: "L'équipe",
    tagline: "Les personnes derrière chaque histoire.",
    color: "#EC4899",
    href: "/a-propos#equipe",
    articles: [
      { title: "Alexandre Quilghini — Co-fondateur, direction éditoriale.", href: "/a-propos#equipe" },
      { title: "Alexis Chavetnoir — Co-fondateur, direction social media.", href: "/a-propos#equipe" },
      { title: "Une équipe qui grandit avec le projet.", href: "/a-propos#equipe" },
    ],
  },
  {
    id: "contact",
    name: "Contact",
    tagline: "Une question, un projet, une idée — écrivez-nous.",
    color: "#10B981",
    href: "/contact",
    articles: [
      { title: "Formulaire de contact — réponse sous 48h.", href: "/contact" },
      { title: "Proposer un partenariat éditorial.", href: "/partenariats" },
      { title: "Rejoindre l'équipe Origines.", href: "/rejoindre" },
    ],
  },
  {
    id: "communaute",
    name: "Communauté",
    tagline: "Rejoignez ceux qui racontent et ceux qui lisent.",
    color: "#F59E0B",
    href: "/temoignages",
    articles: [
      { title: "Raconter votre histoire sur Origines.", href: "/ecrire-mon-histoire" },
      { title: "Lire les témoignages de la communauté.", href: "/temoignages" },
      { title: "S'inscrire à la Lettre du dimanche.", href: "/newsletter" },
    ],
  },
];

/* ---- Generic item (for non-univers tabs) ---- */

interface ItemData {
  id: string;
  name: string;
  tagline: string;
  color: string;
  href: string;
  articles: { title: string; href: string }[];
  semaine?: number;
  icon?: React.ReactNode;
  ctaLabel?: string;
}

function ExploreItem({ item }: { item: ItemData }) {
  return (
    <div
      className={s.item}
      style={{ "--u-color": item.color } as React.CSSProperties}
    >
      <div className={s.itemHead}>
        <span className={s.itemDot} aria-hidden="true" />
        {item.icon}
        <h3 className={s.itemName}>{item.name}</h3>
      </div>
      {item.semaine != null && (
        <span className={s.itemBadge}>S{item.semaine}</span>
      )}
      <p className={s.itemTagline}>{item.tagline}</p>

      <div className={s.itemArticles}>
        {item.articles.map((a, i) => (
          <a key={`${a.href}-${i}`} href={a.href} className={s.itemLink}>
            {a.title}
          </a>
        ))}
      </div>

      <a href={item.href} className={s.itemExplore}>
        {item.ctaLabel || "Explorer"}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  );
}

/* ---- Univers item (structural, description + subtopics) ---- */

function UniversItem({ u }: { u: typeof UNIVERS[number] }) {
  return (
    <div
      className={s.uItem}
      style={{ "--u-color": u.color } as React.CSSProperties}
    >
      <div className={s.itemHead}>
        <span className={s.itemDot} aria-hidden="true" />
        {ICONS[u.id]}
        <h3 className={s.itemName}>{u.name}</h3>
      </div>

      <p className={s.uDesc}>{UNIVERS_DESCRIPTIONS[u.id]}</p>

      <div className={s.uSubtopics}>
        {u.subtopics.map((st) => (
          <a
            key={st.slug}
            href={`/${u.id}/${st.slug}`}
            className={s.uSubtopic}
          >
            {st.label}
          </a>
        ))}
      </div>

      <a href={`/${u.id}`} className={s.itemExplore}>
        Explorer {u.name.toLowerCase()}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  );
}

/* ---- Pilier item (structural, description + subtopics) ---- */

function PilierItem({ p }: { p: Pilier }) {
  return (
    <div
      className={s.uItem}
      style={{ "--u-color": p.color } as React.CSSProperties}
    >
      <div className={s.itemHead}>
        <span className={s.itemDot} aria-hidden="true" />
        {PILIER_ICONS[p.id]}
        <h3 className={s.itemName}>{p.name}</h3>
      </div>

      <p className={s.uDesc}>{p.description}</p>

      <div className={s.uSubtopics}>
        {p.subtopics.map((st) => (
          <a
            key={st.href}
            href={st.href}
            className={s.uSubtopic}
          >
            {st.label}
          </a>
        ))}
      </div>

      <a href={p.href} className={s.itemExplore}>
        Explorer {p.name.toLowerCase()}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  );
}

/* ---- Component ---- */

const MOBILE_SECTIONS = [
  {
    title: "Univers",
    links: [
      { label: "L'Esprit", href: "/esprit", color: "#7B5CD6" },
      { label: "Le Corps", href: "/corps", color: "#5AA352" },
      { label: "Les Liens", href: "/liens", color: "#E67839" },
      { label: "Le Monde", href: "/monde", color: "#2E9B74" },
      { label: "L'Avenir", href: "/avenir", color: "#2E94B5" },
    ],
  },
  {
    title: "Origines",
    links: [
      { label: "Média" , href: "/media" },
      { label: "Prod", href: "/programmes" },
      { label: "Guides & Ateliers", href: "/guides" },
      { label: "Boutique", href: "/boutique" },
      { label: "Newsletter", href: "/newsletter" },
    ],
  },
  {
    title: "Formats",
    links: [
      { label: "Articles", href: "/articles" },
      { label: "Vidéos", href: "/videos" },
      { label: "Dossiers", href: "/dossiers" },
      { label: "Témoignages", href: "/temoignages" },
      { label: "Recommandations", href: "/recommandations" },
    ],
  },
  {
    title: "À propos",
    links: [
      { label: "Notre mission", href: "/a-propos" },
      { label: "L'équipe", href: "/a-propos#equipe" },
      { label: "Contact", href: "/contact" },
      { label: "Partenariats", href: "/partenariats" },
    ],
  },
];

export default function Footer2() {
  const [activeTab, setActiveTab] = useState<TabId>("galaxie");
  const [openSection, setOpenSection] = useState<number | null>(null);

  const panels: { id: TabId; gridClass: string; items: ItemData[]; allHref?: string; allLabel?: string }[] = [
    { id: "formats", gridClass: s.grid4, items: FORMATS.map((f) => ({ ...f, ctaLabel: "Tout voir" })) },
    { id: "dossiers", gridClass: s.grid4, items: DOSSIERS.map((d) => ({ ...d, ctaLabel: "Lire le dossier" })), allHref: "/dossiers", allLabel: "Tous les dossiers" },
    { id: "videos", gridClass: s.grid5, items: VIDEOS.map((v) => ({ ...v, ctaLabel: "Voir les vidéos" })), allHref: "/videos", allLabel: "Toutes les vidéos" },
    { id: "guides", gridClass: s.grid4, items: GUIDES.map((g) => ({ ...g, ctaLabel: "Découvrir" })), allHref: "/guides", allLabel: "Tous les guides" },
    { id: "boutique", gridClass: s.grid5, items: BOUTIQUE.map((b) => ({ ...b, ctaLabel: "Voir" })), allHref: "/boutique", allLabel: "Toute la boutique" },
    { id: "ensemble", gridClass: s.grid4, items: ENSEMBLE.map((e) => ({ ...e, ctaLabel: "Voir" })), allHref: "/ensemble", allLabel: "Tout Ensemble" },
    { id: "apropos", gridClass: s.grid4, items: APROPOS.map((a) => ({ ...a, ctaLabel: "Découvrir" })), allHref: "/a-propos", allLabel: "En savoir plus" },
  ];

  return (
    <footer className={s.footer} role="contentinfo">
      <div className="v2-container">
        {/* ── Explorez section ── */}
        <section className={s.explore} aria-labelledby="explore-heading">
          <header className={s.sectionHead}>
            <div className={s.sectionLabel}>
              <span className={s.sectionKicker}>
                <span className={s.sectionKickerDot} aria-hidden="true" />
                Tout Origines
              </span>
              <h2 id="explore-heading" className={s.sectionTitle}>
                Explorez <em>par entr&eacute;e.</em>
              </h2>
              <p className={s.sectionDeck}>
                Par univers, par format, par dossier ou par vid&eacute;o &mdash;
                chaque chemin m&egrave;ne quelque part.
              </p>
            </div>
          </header>

          <nav className={s.tabs} aria-label="Mode d'exploration">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`${s.tab} ${activeTab === tab.id ? s.tabActive : ""}`}
                onClick={() => setActiveTab(tab.id)}
                aria-selected={activeTab === tab.id}
                role="tab"
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* ── Galaxie panel (4 piliers) ── */}
          <div
            className={`${s.panel} ${activeTab === "galaxie" ? s.panelActive : ""}`}
            role="tabpanel"
            aria-label="Galaxie"
          >
            <div className={s.grid4}>
              {PILIERS.map((p) => (
                <PilierItem key={p.id} p={p} />
              ))}
            </div>
          </div>

          {/* ── Univers panel (5 thèmes) ── */}
          <div
            className={`${s.panel} ${activeTab === "univers" ? s.panelActive : ""}`}
            role="tabpanel"
            aria-label="Univers"
          >
            <div className={s.grid5}>
              {UNIVERS.map((u) => (
                <UniversItem key={u.id} u={u} />
              ))}
            </div>
          </div>

          {/* ── Other panels (editorial) ── */}
          {panels.map((panel) => (
            <div
              key={panel.id}
              className={`${s.panel} ${activeTab === panel.id ? s.panelActive : ""}`}
              role="tabpanel"
              aria-label={TABS.find((t) => t.id === panel.id)?.label}
            >
              <div className={panel.gridClass}>
                {panel.items.map((item) => (
                  <ExploreItem key={item.id} item={item} />
                ))}
              </div>

              {panel.allHref && (
                <a href={panel.allHref} className={s.seeAll}>
                  {panel.allLabel}
                  <span aria-hidden="true">&rarr;</span>
                </a>
              )}
            </div>
          ))}
        </section>

        {/* ── Mobile compact footer ── */}
        <nav className={s.mobileNav} aria-label="Navigation mobile">
          {MOBILE_SECTIONS.map((section, i) => (
            <div key={section.title} className={s.mobileSection}>
              <button
                type="button"
                className={`${s.mobileSectionBtn}${openSection === i ? ` ${s.mobileSectionOpen}` : ""}`}
                onClick={() => setOpenSection(openSection === i ? null : i)}
                aria-expanded={openSection === i}
              >
                {section.title}
                <svg
                  className={s.mobileSectionChevron}
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M4 6l4 4 4-4" />
                </svg>
              </button>
              <div className={`${s.mobileSectionBody}${openSection === i ? ` ${s.mobileSectionBodyOpen}` : ""}`}>
                {section.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className={s.mobileLink}
                  >
                    {"color" in link && (
                      <span
                        className={s.mobileLinkDot}
                        style={{ background: (link as { color: string }).color }}
                        aria-hidden="true"
                      />
                    )}
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}

          <div className={s.mobileSocial}>
            {SOCIAL_LINKS.map((social) => (
              <a key={social.href} href={social.href} aria-label={social.label} rel="noopener" className={s.mobileSocialLink}>
                {social.icon}
              </a>
            ))}
          </div>
        </nav>

        {/* ── Bottom strip — DO NOT TOUCH ── */}
        <div className={s.footerStrip}>
          <div className={s.left}>
            <img
              src="/logos/logo-black.png"
              alt="Origines"
              style={{ height: 28, width: "auto" }}
            />
            <div className={s.copy}>
              &copy; 2026 Origines Media<br />
              ISSN 2974-0912 &middot; Paris
            </div>
          </div>
          <div className={s.legal}>
            {LEGAL_LINKS.map((link) => (
              <a key={link.href} href={link.href}>{link.label}</a>
            ))}
          </div>
          <div className={s.footerSocial} aria-label="Réseaux sociaux">
            {SOCIAL_LINKS.map((social) => (
              <a key={social.href} href={social.href} aria-label={social.label} rel="noopener">
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* ── Signature wordmark — DO NOT TOUCH ── */}
        <div className={s.footerSignature}>
          <div className={s.wordmarkHuge}>Orig<em>ines</em></div>
        </div>
      </div>
    </footer>
  );
}
