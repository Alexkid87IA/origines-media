import { useState } from "react";
import { UNIVERS, getArticlesByUnivers, type UniversId } from "@/data/univers";
import s from "./Triad.module.css";

export interface CMSTriadArticle {
  univers: UniversId;
  title: string;
  href: string;
  imgSrc: string;
  imgAlt: string;
}

export interface CMSTriadUnivers {
  id: UniversId;
  articles: CMSTriadArticle[];
}

interface TriadProps {
  cmsUnivers?: CMSTriadUnivers[];
}

/* ------------------------------------------------------------------ */
/*  Tab definitions                                                    */
/* ------------------------------------------------------------------ */

type TabId = "univers" | "formats" | "dossiers" | "videos" | "guides" | "ensemble";

const TABS: { id: TabId; label: string }[] = [
  { id: "univers", label: "Univers" },
  { id: "formats", label: "Formats" },
  { id: "dossiers", label: "Dossiers" },
  { id: "videos", label: "Vidéos" },
  { id: "guides", label: "Guides" },
  { id: "ensemble", label: "Ensemble" },
];

/* ------------------------------------------------------------------ */
/*  Static data per tab                                                */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Icons per univers                                                  */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Generic item renderer                                              */
/* ------------------------------------------------------------------ */

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
        {item.articles.map((a) => (
          <a key={a.href} href={a.href} className={s.itemLink}>
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

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Triad({ cmsUnivers }: TriadProps) {
  const [activeTab, setActiveTab] = useState<TabId>("univers");

  const universItems: ItemData[] = UNIVERS.map((u) => {
    const cmsMatch = cmsUnivers?.find((cu) => cu.id === u.id);
    const articles = cmsMatch
      ? cmsMatch.articles.slice(0, 3).map((a) => ({ title: a.title, href: a.href }))
      : getArticlesByUnivers(u.id).slice(0, 3).map((a) => ({
          title: `${a.headline}${a.headlineEm}${a.headlineSuffix}`,
          href: a.href,
        }));
    return {
      id: u.id,
      name: u.name,
      tagline: u.tagline,
      color: u.color,
      href: `/${u.id}`,
      articles,
      icon: ICONS[u.id],
    };
  });

  const panels: { id: TabId; gridClass: string; items: ItemData[]; allHref?: string; allLabel?: string }[] = [
    { id: "univers", gridClass: s.grid5, items: universItems },
    { id: "formats", gridClass: s.grid4, items: FORMATS.map((f) => ({ ...f, ctaLabel: "Tout voir" })) },
    { id: "dossiers", gridClass: s.grid4, items: DOSSIERS.map((d) => ({ ...d, ctaLabel: "Lire le dossier" })), allHref: "/dossiers", allLabel: "Tous les dossiers" },
    { id: "videos", gridClass: s.grid5, items: VIDEOS.map((v) => ({ ...v, ctaLabel: "Voir les vidéos" })), allHref: "/videos", allLabel: "Toutes les vidéos" },
    { id: "guides", gridClass: s.grid4, items: GUIDES.map((g) => ({ ...g, ctaLabel: "Découvrir" })), allHref: "/guides", allLabel: "Tous les guides" },
    { id: "ensemble", gridClass: s.grid4, items: ENSEMBLE.map((e) => ({ ...e, ctaLabel: "Voir" })), allHref: "/ensemble", allLabel: "Tout Ensemble" },
  ];

  return (
    <section className={s.explore} aria-labelledby="explore-heading">
      <div className={`${s.chapterMark} mono`}>
        <span className={s.cNum}>Ch.04</span>
        <span className={s.cSep}>/</span>
        <span className={s.cLabel}>Explorez</span>
      </div>

      <header className={s.sectionHead}>
        <div className={s.sectionLabel}>
          <span className={s.sectionKicker}>
            <span className={s.sectionKickerDot} aria-hidden="true" />
            Tout Origines
          </span>
          <h2 id="explore-heading" className={s.sectionTitle}>
            Un m&eacute;dia,<br /><em>mille entr&eacute;es.</em>
          </h2>
          <p className={s.sectionDeck}>
            Par univers, par format, par dossier, par vid&eacute;o &mdash;
            trouvez l&rsquo;angle qui vous parle. Chaque chemin m&egrave;ne
            aux m&ecirc;mes histoires, racont&eacute;es diff&eacute;remment.
          </p>
        </div>
      </header>

      {/* ── Tabs ── */}
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

      {/* ── Panels — all rendered for SEO ── */}
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
  );
}
