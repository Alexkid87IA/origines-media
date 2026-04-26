import SEO from "@/components/SEO";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2";
import { UNIVERS_MAP, type UniversId } from "@/data/univers";
import s from "./TypePage.module.css";

/* ══════════════════════════════════════════════════════════════
   Config
   ══════════════════════════════════════════════════════════════ */

export type ContentType = "comprendre" | "reflexions" | "temoignages" | "portraits";

interface TypeConfig {
  title: string;
  titleIsSerif: boolean;
  kicker: string;
  deck: string;
  seoTitle: string;
  seoDescription: string;
  maxWidth: number;
  hasIcon: boolean;
}

const CONFIG: Record<ContentType, TypeConfig> = {
  comprendre: {
    title: "Comprendre.",
    titleIsSerif: false,
    kicker: "Rubrique",
    deck: "Des articles pour aller au fond des choses. On prend un sujet, on le démonte, on l’explique — avec des sources, des experts, et des points clés à retenir.",
    seoTitle: "Comprendre — Origines Media",
    seoDescription: "Des articles pour comprendre le monde, la science, le corps et l’esprit. Vulgarisation rigoureuse, sources citées, points clés à retenir.",
    maxWidth: 1000,
    hasIcon: true,
  },
  reflexions: {
    title: "Réflexions.",
    titleIsSerif: true,
    kicker: "Rubrique",
    deck: "Des essais, des opinions, des textes qui prennent le temps de penser. Pas de réponses définitives — juste des regards singuliers sur le monde.",
    seoTitle: "Réflexions — Origines Media",
    seoDescription: "Essais, opinions et réflexions personnelles. Des textes pour penser autrement, par des auteurs qui osent dire ce qu’ils pensent.",
    maxWidth: 720,
    hasIcon: false,
  },
  temoignages: {
    title: "Témoignages.",
    titleIsSerif: false,
    kicker: "Rubrique",
    deck: "Des histoires vraies, racontées à la première personne. Pas de jugement, pas de leçon — juste la vérité de ceux qui osent la partager.",
    seoTitle: "Témoignages — Origines Media",
    seoDescription: "Des histoires vraies, racontées à la première personne. Des récits intimes pour comprendre ce que les chiffres ne disent pas.",
    maxWidth: 800,
    hasIcon: false,
  },
  portraits: {
    title: "Portraits.",
    titleIsSerif: false,
    kicker: "Rubrique",
    deck: "Des rencontres en profondeur. On prend le temps de s’asseoir, d’écouter, de comprendre un parcours — et d’en tirer quelque chose qui nous éclaire tous.",
    seoTitle: "Portraits — Origines Media",
    seoDescription: "Des rencontres en profondeur avec ceux qui façonnent notre époque. Interviews longues, parcours de vie, confidences.",
    maxWidth: 1100,
    hasIcon: false,
  },
};

/* ══════════════════════════════════════════════════════════════
   Mock data
   ══════════════════════════════════════════════════════════════ */

interface ComprendreItem {
  title: string;
  slug: string;
  chapeau: string;
  univpilar: UniversId;
  readTime: string;
  author: string;
  date: string;
  keyTakeaways: string[];
}

interface ReflexionItem {
  title: string;
  slug: string;
  pullQuote: string;
  author: string;
  authorNote: string;
  date: string;
  readTime: string;
}

interface TemoignageItem {
  title: string;
  slug: string;
  extrait: string;
  prenom: string;
  age: number;
  ville: string;
  isAnonymous: boolean;
  date: string;
  readTime: string;
}

interface PortraitItem {
  name: string;
  role: string;
  slug: string;
  accroche: string;
  image: string;
  date: string;
  readTime: string;
}

const COMPRENDRE_MOCK: ComprendreItem[] = [
  { title: "Pourquoi le cerveau résiste au changement", slug: "cerveau-resistance-changement", chapeau: "Changer d’habitude, c’est aller contre des millions d’années d’évolution. Voici ce que la neuroscience dit — et ce qu’on peut faire.", univpilar: "esprit", readTime: "14 min", author: "Émilie Roux", date: "22 avril 2026", keyTakeaways: ["Le cerveau préfère l’habitude par économie d’énergie", "21 jours ne suffisent pas", "Le contexte compte plus que la volonté"] },
  { title: "Comment fonctionne le microbiote intestinal", slug: "microbiote-intestinal-fonctionnement", chapeau: "On l’appelle le « deuxième cerveau ». 100 000 milliards de bactéries qui influencent notre humeur, notre immunité et notre sommeil.", univpilar: "corps", readTime: "18 min", author: "Dr. Lucas Fabre", date: "18 avril 2026", keyTakeaways: ["Le microbiote pèse autant que le cerveau", "Il produit 95% de la sérotonine", "L’alimentation le transforme en 48h"] },
  { title: "Les mécanismes de l’attachement amoureux", slug: "mecanismes-attachement-amoureux", chapeau: "Pourquoi certains fuient l’intimité pendant que d’autres s’y agrippent. La théorie de l’attachement, expliquée simplement.", univpilar: "liens", readTime: "16 min", author: "Mathilde Aubry", date: "14 avril 2026", keyTakeaways: ["3 styles : sécure, anxieux, évitant", "Formé avant 2 ans, modifiable ensuite", "80% des conflits de couple viennent de là"] },
  { title: "Qu’est-ce que l’économie de l’attention", slug: "economie-attention-explication", chapeau: "Votre attention vaut de l’argent. Voici comment les plateformes la captent — et ce que ça coûte à votre cerveau.", univpilar: "avenir", readTime: "12 min", author: "Léo Marchand", date: "10 avril 2026", keyTakeaways: ["Un humain touche son téléphone 2 617 fois/jour", "Le scroll infini est un design intentionnel", "L’attention est une ressource non renouvelable"] },
  { title: "Comment la lumière bleue perturbe le sommeil", slug: "lumiere-bleue-sommeil", chapeau: "Ce n’est pas un mythe. La science explique précisément comment les écrans dérèglent notre horloge interne.", univpilar: "corps", readTime: "10 min", author: "Dr. Lucas Fabre", date: "6 avril 2026", keyTakeaways: ["La lumière bleue bloque la mélatonine", "Effet mesurable dès 30 min d’exposition", "Les lunettes filtrantes aident — un peu"] },
  { title: "Pourquoi on procrastine (et comment arrêter)", slug: "procrastination-mecanismes", chapeau: "La procrastination n’est pas de la paresse. C’est une stratégie de régulation émotionnelle. Voici comment la désamorcer.", univpilar: "esprit", readTime: "15 min", author: "Émilie Roux", date: "2 avril 2026", keyTakeaways: ["La procrastination est liée à l’anxiété", "Les deadlines ne fonctionnent pas pour tout le monde", "La technique des 2 minutes est sous-estimée"] },
];

const REFLEXIONS_MOCK: ReflexionItem[] = [
  { title: "Le silence, le dernier luxe collectif", slug: "silence-luxe-collectif", pullQuote: "On ne l’achète pas, mais on le perd chaque jour un peu plus. Le silence est devenu ce que le temps libre était dans les années 80 : un privilège invisible.", author: "Mathilde Aubry", authorNote: "Essayiste, autrice de Disparitions douces (Gallimard, 2025)", date: "20 avril 2026", readTime: "18 min" },
  { title: "Avons-nous encore le droit de ne rien faire ?", slug: "droit-ne-rien-faire", pullQuote: "L’oisiveté n’est plus un repos. Elle est devenue une faute morale. Comme si ne rien produire revenait à ne rien valoir.", author: "Alexandre Dumas-Kieffer", authorNote: "Philosophe, maître de conférences à Paris-Nanterre", date: "16 avril 2026", readTime: "14 min" },
  { title: "La fatigue n’est pas ce qu’on croit", slug: "fatigue-pas-ce-quon-croit", pullQuote: "On dort assez. Parfois même trop. Mais on se réveille épuisés. La fatigue moderne n’est pas physique — elle est décisionnelle.", author: "Émilie Roux", authorNote: "Journaliste santé, chroniqueuse Origines Media", date: "12 avril 2026", readTime: "12 min" },
  { title: "Ce que les morts nous apprennent sur la vie", slug: "morts-apprennent-vie", pullQuote: "J’ai passé trois ans dans les soins palliatifs. Les mourants ne parlent jamais de leur carrière. Ils parlent d’un matin d’été, d’un visage, d’un geste qu’ils auraient voulu faire.", author: "Claire Vasseur", authorNote: "Infirmière, autrice de Les Derniers Matins", date: "8 avril 2026", readTime: "22 min" },
  { title: "Pourquoi je refuse de « guérir »", slug: "refus-guerir", pullQuote: "On m’a dit que j’étais cassée. Que la thérapie me réparerait. Mais peut-être que cette fissure, c’est par là que la lumière entre.", author: "Inès Belkacem", authorNote: "Poétesse, contributrice Origines Media", date: "4 avril 2026", readTime: "9 min" },
];

const TEMOIGNAGES_MOCK: TemoignageItem[] = [
  { title: "La lettre que je n’ai jamais envoyée", slug: "lettre-jamais-envoyee", extrait: "Elle l’a écrite il y a dix ans. Elle ne l’a jamais envoyée. Aujourd’hui, elle la publie ici — pour la première fois.", prenom: "Mathilde", age: 34, ville: "Lyon", isAnonymous: false, date: "21 avril 2026", readTime: "12 min" },
  { title: "J’ai arrêté de parler à ma mère il y a trois ans", slug: "arrete-parler-mere", extrait: "Ce n’est pas une décision qu’on prend un matin. C’est un silence qui s’installe, jour après jour, jusqu’à devenir un mur.", prenom: "Anonyme", age: 28, ville: "Paris", isAnonymous: true, date: "17 avril 2026", readTime: "15 min" },
  { title: "Mon burn-out n’a pas commencé au travail", slug: "burnout-pas-commence-travail", extrait: "Tout le monde pensait que c’était le boulot. Mais le vrai épuisement venait d’ailleurs — d’un endroit que personne ne soupçonnait.", prenom: "Karim", age: 41, ville: "Marseille", isAnonymous: false, date: "13 avril 2026", readTime: "18 min" },
  { title: "J’ai appris que j’étais adopté à 35 ans", slug: "adopte-35-ans", extrait: "Un papier dans un tiroir. Une phrase de ma tante. Et puis tout ce que je croyais savoir sur moi s’est effondré en une seconde.", prenom: "Thomas", age: 37, ville: "Bordeaux", isAnonymous: false, date: "9 avril 2026", readTime: "20 min" },
  { title: "Comment j’ai réappris à dormir", slug: "reappris-dormir", extrait: "Pendant deux ans, je n’ai pas dormi plus de quatre heures par nuit. Voici ce qui a changé — et ce n’est pas ce que vous croyez.", prenom: "Élise", age: 29, ville: "Nantes", isAnonymous: false, date: "5 avril 2026", readTime: "14 min" },
  { title: "Je vis seule depuis dix ans et je ne suis pas malheureuse", slug: "seule-dix-ans", extrait: "On me demande toujours si ça va. Comme si vivre seule était une maladie. Voici ce que j’ai appris en dix ans de solitude choisie.", prenom: "Anonyme", age: 44, ville: "Toulouse", isAnonymous: true, date: "1 avril 2026", readTime: "11 min" },
];

const PORTRAITS_MOCK: PortraitItem[] = [
  { name: "Fatou Diome", role: "Écrivaine, autrice de Le Ventre de l’Atlantique", slug: "fatou-diome", accroche: "« On ne quitte jamais vraiment son pays. On l’emporte dans sa façon de marcher. »", image: "/covers/cover-01.webp", date: "22 avril 2026", readTime: "28 min" },
  { name: "Dr. Christophe André", role: "Psychiatre, pionnier de la méditation en milieu hospitalier", slug: "christophe-andre", accroche: "« La méditation n’est pas une fuite. C’est un retour — brutal parfois — à ce qui est là. »", image: "/covers/cover-02.webp", date: "18 avril 2026", readTime: "32 min" },
  { name: "Céline Alvarez", role: "Chercheuse en sciences cognitives, ex-institutrice", slug: "celine-alvarez", accroche: "« On forme les enfants à un monde qui n’existera plus. Il faut réinventer l’école — pas la réparer. »", image: "/covers/cover-03.webp", date: "14 avril 2026", readTime: "24 min" },
  { name: "Idriss Aberkane", role: "Essayiste, chercheur en neurosciences cognitives", slug: "idriss-aberkane", accroche: "« Le savoir est la seule richesse qu’on multiplie en la partageant. C’est la seule économie qui ne connaît pas la rareté. »", image: "/covers/cover-04.webp", date: "10 avril 2026", readTime: "26 min" },
  { name: "Élise Lucet", role: "Journaliste d’investigation", slug: "elise-lucet", accroche: "« On me dit que je dérange. Tant mieux. Un journaliste qui ne dérange personne ne sert à rien. »", image: "/covers/cover-05.webp", date: "6 avril 2026", readTime: "30 min" },
];

/* ══════════════════════════════════════════════════════════════
   Card variants
   ══════════════════════════════════════════════════════════════ */

function ComprendreCard({ item, index }: { item: ComprendreItem; index: number }) {
  const u = UNIVERS_MAP[item.univpilar] || UNIVERS_MAP.esprit;
  return (
    <article className={s.card}>
      <a href={`/comprendre/${item.slug}`} className={s.compLink}>
        <div className={s.compLeft}>
          <span className={s.compNum}>{String(index + 1).padStart(2, "0")}</span>
        </div>
        <div className={s.compCenter}>
          <span className={s.compMeta}>
            <span className={s.compDot} style={{ background: u.color }} />
            {u.name} &middot; {item.readTime}
          </span>
          <h2 className={s.compTitle}>{item.title}</h2>
          <p className={s.compChapeau}>{item.chapeau}</p>
          <span className={s.compAuthor}>Par {item.author} &middot; {item.date}</span>
        </div>
        <div className={s.compRight}>
          <span className={s.compTakeLabel}>Points cl&eacute;s</span>
          <ul className={s.compTakes}>
            {item.keyTakeaways.map((t, j) => (
              <li key={j}>
                <span className={s.compTakeDot} style={{ background: u.color }} />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </a>
    </article>
  );
}

function ReflexionCard({ item }: { item: ReflexionItem }) {
  return (
    <article className={s.card}>
      <a href={`/reflexions/${item.slug}`} className={s.refLink}>
        <blockquote className={s.refQuote}>
          &laquo;&nbsp;{item.pullQuote}&nbsp;&raquo;
        </blockquote>
        <h2 className={s.refTitle}>{item.title}</h2>
        <div className={s.refFooter}>
          <div className={s.refAuthorBlock}>
            <span className={s.refAuthorName}>{item.author}</span>
            <span className={s.refAuthorNote}>{item.authorNote}</span>
          </div>
          <span className={s.refMeta}>{item.date} &middot; {item.readTime}</span>
        </div>
      </a>
    </article>
  );
}

function TemoignageCard({ item }: { item: TemoignageItem }) {
  return (
    <article className={s.card}>
      <a href={`/temoignages/${item.slug}`} className={s.temLink}>
        <div className={s.temAvatar}>
          <span className={s.temInitial}>
            {item.isAnonymous ? "?" : item.prenom[0]}
          </span>
        </div>
        <div className={s.temBody}>
          <span className={s.temWho}>
            {item.isAnonymous ? "Anonyme" : item.prenom}, {item.age} ans &middot; {item.ville}
          </span>
          <h2 className={s.temTitle}>{item.title}</h2>
          <p className={s.temExtrait}>&laquo;&nbsp;{item.extrait}&nbsp;&raquo;</p>
          <span className={s.temMeta}>{item.date} &middot; {item.readTime}</span>
        </div>
      </a>
    </article>
  );
}

function PortraitCard({ item, index }: { item: PortraitItem; index: number }) {
  const flipped = index % 2 === 1;
  return (
    <article className={`${s.porCard} ${flipped ? s.porFlipped : ""}`}>
      <a href={`/portraits/${item.slug}`} className={s.porLink}>
        <div className={s.porImgWrap}>
          <img src={item.image} alt={item.name} className={s.porImg} loading="lazy" />
        </div>
        <div className={s.porBody}>
          <span className={s.porMeta}>{item.date} &middot; {item.readTime}</span>
          <h2 className={s.porName}>{item.name}</h2>
          <span className={s.porRole}>{item.role}</span>
          <blockquote className={s.porQuote}>{item.accroche}</blockquote>
          <span className={s.porCta}>
            Lire le portrait
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </a>
    </article>
  );
}

function TemoignagesCallout() {
  return (
    <section className={s.callout}>
      <img
        src="/visages-origines.webp"
        alt="Visages de ceux qui ont raconté leur histoire sur Origines"
        className={s.calloutImg}
        loading="lazy"
      />
      <div className={s.calloutOverlay}>
        <span className={s.calloutCount}>1 247</span>
        <h3 className={s.calloutTitle}>
          Ils ont racont&eacute; leur histoire<br />sur <em>Origines.</em>
        </h3>
        <p className={s.calloutText}>
          Et si c&rsquo;&eacute;tait votre tour&nbsp;? Anonymat garanti.
          Votre r&eacute;cit peut aider quelqu&rsquo;un que vous ne
          conna&icirc;trez jamais.
        </p>
        <a href="/racontez-votre-histoire" className={s.calloutBtn}>
          Raconter mon histoire
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   Page
   ══════════════════════════════════════════════════════════════ */

export default function TypePage({ type }: { type: ContentType }) {
  const cfg = CONFIG[type];

  return (
    <div className={s.page}>
      <SEO
        title={cfg.seoTitle}
        description={cfg.seoDescription}
        url={`/${type}`}
        noindex
      />
      <SiteHeader />

      <div className={s.container} style={{ maxWidth: cfg.maxWidth }}>
        <header className={s.header}>
          <span className={s.kicker}>
            {cfg.hasIcon && (
              <span className={s.kickerIcon} aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
                </svg>
              </span>
            )}
            {cfg.kicker}
          </span>
          <h1 className={cfg.titleIsSerif ? s.titleSerif : s.title}>
            {cfg.titleIsSerif ? <em>{cfg.title}</em> : cfg.title}
          </h1>
          <p className={s.deck}>{cfg.deck}</p>
        </header>

        <div className={type === "portraits" ? s.listPortraits : s.list}>
          {type === "comprendre" && COMPRENDRE_MOCK.map((item, i) => (
            <ComprendreCard key={item.slug} item={item} index={i} />
          ))}
          {type === "reflexions" && REFLEXIONS_MOCK.map((item) => (
            <ReflexionCard key={item.slug} item={item} />
          ))}
          {type === "temoignages" && TEMOIGNAGES_MOCK.map((item) => (
            <TemoignageCard key={item.slug} item={item} />
          ))}
          {type === "portraits" && PORTRAITS_MOCK.map((item, i) => (
            <PortraitCard key={item.slug} item={item} index={i} />
          ))}
        </div>
      </div>

      {type === "temoignages" && <TemoignagesCallout />}

      <Footer2 />
    </div>
  );
}
