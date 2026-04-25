import { Helmet } from "react-helmet-async";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2/Footer2";
import { UNIVERS_MAP, type UniversId } from "@/data/univers";
import s from "./ComprendrePage.module.css";

interface MockArticle {
  title: string;
  slug: string;
  chapeau: string;
  univpilar: UniversId;
  readTime: string;
  author: string;
  date: string;
  keyTakeaways: string[];
}

const MOCK: MockArticle[] = [
  {
    title: "Pourquoi le cerveau résiste au changement",
    slug: "cerveau-resistance-changement",
    chapeau: "Changer d'habitude, c'est aller contre des millions d'années d'évolution. Voici ce que la neuroscience dit — et ce qu'on peut faire.",
    univpilar: "esprit",
    readTime: "14 min",
    author: "Émilie Roux",
    date: "22 avril 2026",
    keyTakeaways: ["Le cerveau préfère l'habitude par économie d'énergie", "21 jours ne suffisent pas", "Le contexte compte plus que la volonté"],
  },
  {
    title: "Comment fonctionne le microbiote intestinal",
    slug: "microbiote-intestinal-fonctionnement",
    chapeau: "On l'appelle le « deuxième cerveau ». 100 000 milliards de bactéries qui influencent notre humeur, notre immunité et notre sommeil.",
    univpilar: "corps",
    readTime: "18 min",
    author: "Dr. Lucas Fabre",
    date: "18 avril 2026",
    keyTakeaways: ["Le microbiote pèse autant que le cerveau", "Il produit 95% de la sérotonine", "L'alimentation le transforme en 48h"],
  },
  {
    title: "Les mécanismes de l'attachement amoureux",
    slug: "mecanismes-attachement-amoureux",
    chapeau: "Pourquoi certains fuient l'intimité pendant que d'autres s'y agrippent. La théorie de l'attachement, expliquée simplement.",
    univpilar: "liens",
    readTime: "16 min",
    author: "Mathilde Aubry",
    date: "14 avril 2026",
    keyTakeaways: ["3 styles : sécure, anxieux, évitant", "Formé avant 2 ans, modifiable ensuite", "80% des conflits de couple viennent de là"],
  },
  {
    title: "Qu'est-ce que l'économie de l'attention",
    slug: "economie-attention-explication",
    chapeau: "Votre attention vaut de l'argent. Voici comment les plateformes la captent — et ce que ça coûte à votre cerveau.",
    univpilar: "avenir",
    readTime: "12 min",
    author: "Léo Marchand",
    date: "10 avril 2026",
    keyTakeaways: ["Un humain touche son téléphone 2 617 fois/jour", "Le scroll infini est un design intentionnel", "L'attention est une ressource non renouvelable"],
  },
  {
    title: "Comment la lumière bleue perturbe le sommeil",
    slug: "lumiere-bleue-sommeil",
    chapeau: "Ce n'est pas un mythe. La science explique précisément comment les écrans dérèglent notre horloge interne.",
    univpilar: "corps",
    readTime: "10 min",
    author: "Dr. Lucas Fabre",
    date: "6 avril 2026",
    keyTakeaways: ["La lumière bleue bloque la mélatonine", "Effet mesurable dès 30 min d'exposition", "Les lunettes filtrantes aident — un peu"],
  },
  {
    title: "Pourquoi on procrastine (et comment arrêter)",
    slug: "procrastination-mecanismes",
    chapeau: "La procrastination n'est pas de la paresse. C'est une stratégie de régulation émotionnelle. Voici comment la désamorcer.",
    univpilar: "esprit",
    readTime: "15 min",
    author: "Émilie Roux",
    date: "2 avril 2026",
    keyTakeaways: ["La procrastination est liée à l'anxiété", "Les deadlines ne fonctionnent pas pour tout le monde", "La technique des 2 minutes est sous-estimée"],
  },
];

function getUniv(id: UniversId) {
  return UNIVERS_MAP[id] || UNIVERS_MAP.esprit;
}

export default function ComprendrePage() {
  return (
    <div className={s.page}>
      <Helmet>
        <title>Comprendre — Origines Media</title>
        <meta name="description" content="Des articles pour comprendre le monde, la science, le corps et l'esprit. Vulgarisation rigoureuse, sources citées, points clés à retenir." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Comprendre — Origines Media",
          description: "Articles explicatifs et de vulgarisation.",
          url: "https://www.origines.media/comprendre",
        })}</script>
      </Helmet>
      <SiteHeader />

      <div className={s.container}>
        <header className={s.header}>
          <div className={s.headerInner}>
            <span className={s.kicker}>
              <span className={s.kickerIcon} aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
                </svg>
              </span>
              Rubrique
            </span>
            <h1 className={s.title}>Comprendre.</h1>
            <p className={s.deck}>
              Des articles pour aller au fond des choses. On prend un sujet,
              on le d&eacute;monte, on l&rsquo;explique &mdash; avec des sources,
              des experts, et des points cl&eacute;s &agrave; retenir.
            </p>
          </div>
        </header>

        <div className={s.list}>
          {MOCK.map((a, i) => {
            const u = getUniv(a.univpilar);
            return (
              <article key={a.slug} className={s.card}>
                <a href={`/comprendre/${a.slug}`} className={s.cardLink}>
                  <div className={s.cardLeft}>
                    <span className={s.cardNum}>{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div className={s.cardCenter}>
                    <span className={s.cardMeta}>
                      <span className={s.cardDot} style={{ background: u.color }} />
                      {u.name} &middot; {a.readTime}
                    </span>
                    <h2 className={s.cardTitle}>{a.title}</h2>
                    <p className={s.cardChapeau}>{a.chapeau}</p>
                    <span className={s.cardAuthor}>Par {a.author} &middot; {a.date}</span>
                  </div>
                  <div className={s.cardRight}>
                    <span className={s.cardTakeLabel}>Points cl&eacute;s</span>
                    <ul className={s.cardTakes}>
                      {a.keyTakeaways.map((t, j) => (
                        <li key={j}>
                          <span className={s.cardTakeDot} style={{ background: u.color }} />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </a>
              </article>
            );
          })}
        </div>
      </div>

      <Footer2 />
    </div>
  );
}
