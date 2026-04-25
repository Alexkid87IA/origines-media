import { Helmet } from "react-helmet-async";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2/Footer2";
import s from "./TemoignagesPage.module.css";

interface MockTemoignage {
  title: string;
  slug: string;
  extrait: string;
  prenom: string;
  age: number;
  ville: string;
  isAnonymous: boolean;
  date: string;
  readTime: string;
  univpilar: string;
}

const MOCK: MockTemoignage[] = [
  {
    title: "La lettre que je n'ai jamais envoyée",
    slug: "lettre-jamais-envoyee",
    extrait: "Elle l'a écrite il y a dix ans. Elle ne l'a jamais envoyée. Aujourd'hui, elle la publie ici — pour la première fois.",
    prenom: "Mathilde",
    age: 34,
    ville: "Lyon",
    isAnonymous: false,
    date: "21 avril 2026",
    readTime: "12 min",
    univpilar: "liens",
  },
  {
    title: "J'ai arrêté de parler à ma mère il y a trois ans",
    slug: "arrete-parler-mere",
    extrait: "Ce n'est pas une décision qu'on prend un matin. C'est un silence qui s'installe, jour après jour, jusqu'à devenir un mur.",
    prenom: "Anonyme",
    age: 28,
    ville: "Paris",
    isAnonymous: true,
    date: "17 avril 2026",
    readTime: "15 min",
    univpilar: "liens",
  },
  {
    title: "Mon burn-out n'a pas commencé au travail",
    slug: "burnout-pas-commence-travail",
    extrait: "Tout le monde pensait que c'était le boulot. Mais le vrai épuisement venait d'ailleurs — d'un endroit que personne ne soupçonnait.",
    prenom: "Karim",
    age: 41,
    ville: "Marseille",
    isAnonymous: false,
    date: "13 avril 2026",
    readTime: "18 min",
    univpilar: "esprit",
  },
  {
    title: "J'ai appris que j'étais adopté à 35 ans",
    slug: "adopte-35-ans",
    extrait: "Un papier dans un tiroir. Une phrase de ma tante. Et puis tout ce que je croyais savoir sur moi s'est effondré en une seconde.",
    prenom: "Thomas",
    age: 37,
    ville: "Bordeaux",
    isAnonymous: false,
    date: "9 avril 2026",
    readTime: "20 min",
    univpilar: "liens",
  },
  {
    title: "Comment j'ai réappris à dormir",
    slug: "reappris-dormir",
    extrait: "Pendant deux ans, je n'ai pas dormi plus de quatre heures par nuit. Voici ce qui a changé — et ce n'est pas ce que vous croyez.",
    prenom: "Élise",
    age: 29,
    ville: "Nantes",
    isAnonymous: false,
    date: "5 avril 2026",
    readTime: "14 min",
    univpilar: "corps",
  },
  {
    title: "Je vis seule depuis dix ans et je ne suis pas malheureuse",
    slug: "seule-dix-ans",
    extrait: "On me demande toujours si ça va. Comme si vivre seule était une maladie. Voici ce que j'ai appris en dix ans de solitude choisie.",
    prenom: "Anonyme",
    age: 44,
    ville: "Toulouse",
    isAnonymous: true,
    date: "1 avril 2026",
    readTime: "11 min",
    univpilar: "esprit",
  },
];

export default function TemoignagesPage() {
  return (
    <div className={s.page}>
      <Helmet>
        <title>T&eacute;moignages — Origines Media</title>
        <meta name="description" content="Des histoires vraies, racontées à la première personne. Des récits intimes pour comprendre ce que les chiffres ne disent pas." />
      </Helmet>
      <SiteHeader />

      <div className={s.container}>
        <header className={s.header}>
          <span className={s.kicker}>Rubrique</span>
          <h1 className={s.title}>T&eacute;moignages.</h1>
          <p className={s.deck}>
            Des histoires vraies, racont&eacute;es &agrave; la premi&egrave;re personne.
            Pas de jugement, pas de le&ccedil;on &mdash; juste la v&eacute;rit&eacute;
            de ceux qui osent la partager.
          </p>
        </header>

        <div className={s.list}>
          {MOCK.map((t) => (
            <article key={t.slug} className={s.card}>
              <a href={`/temoignages/${t.slug}`} className={s.cardLink}>
                <div className={s.cardAvatar}>
                  <span className={s.cardInitial}>
                    {t.isAnonymous ? "?" : t.prenom[0]}
                  </span>
                </div>
                <div className={s.cardBody}>
                  <span className={s.cardWho}>
                    {t.isAnonymous ? "Anonyme" : t.prenom}, {t.age} ans &middot; {t.ville}
                  </span>
                  <h2 className={s.cardTitle}>{t.title}</h2>
                  <p className={s.cardExtrait}>&laquo;&nbsp;{t.extrait}&nbsp;&raquo;</p>
                  <span className={s.cardMeta}>{t.date} &middot; {t.readTime}</span>
                </div>
              </a>
            </article>
          ))}
        </div>

      </div>

      <section className={s.callout}>
        <img
          src="/visages-origines.png"
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

      <Footer2 />
    </div>
  );
}
