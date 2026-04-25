import { Helmet } from "react-helmet-async";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2/Footer2";
import s from "./PortraitsPage.module.css";

interface MockPortrait {
  name: string;
  role: string;
  slug: string;
  accroche: string;
  image: string;
  date: string;
  readTime: string;
  univpilar: string;
}

const MOCK: MockPortrait[] = [
  {
    name: "Fatou Diome",
    role: "Écrivaine, autrice de Le Ventre de l'Atlantique",
    slug: "fatou-diome",
    accroche: "« On ne quitte jamais vraiment son pays. On l'emporte dans sa façon de marcher. »",
    image: "/covers/cover-01.jpg",
    date: "22 avril 2026",
    readTime: "28 min",
    univpilar: "monde",
  },
  {
    name: "Dr. Christophe André",
    role: "Psychiatre, pionnier de la méditation en milieu hospitalier",
    slug: "christophe-andre",
    accroche: "« La méditation n'est pas une fuite. C'est un retour — brutal parfois — à ce qui est là. »",
    image: "/covers/cover-02.jpg",
    date: "18 avril 2026",
    readTime: "32 min",
    univpilar: "esprit",
  },
  {
    name: "Céline Alvarez",
    role: "Chercheuse en sciences cognitives, ex-institutrice",
    slug: "celine-alvarez",
    accroche: "« On forme les enfants à un monde qui n'existera plus. Il faut réinventer l'école — pas la réparer. »",
    image: "/covers/cover-03.jpg",
    date: "14 avril 2026",
    readTime: "24 min",
    univpilar: "liens",
  },
  {
    name: "Idriss Aberkane",
    role: "Essayiste, chercheur en neurosciences cognitives",
    slug: "idriss-aberkane",
    accroche: "« Le savoir est la seule richesse qu'on multiplie en la partageant. C'est la seule économie qui ne connaît pas la rareté. »",
    image: "/covers/cover-04.jpg",
    date: "10 avril 2026",
    readTime: "26 min",
    univpilar: "avenir",
  },
  {
    name: "Élise Lucet",
    role: "Journaliste d'investigation",
    slug: "elise-lucet",
    accroche: "« On me dit que je dérange. Tant mieux. Un journaliste qui ne dérange personne ne sert à rien. »",
    image: "/covers/cover-05.jpg",
    date: "6 avril 2026",
    readTime: "30 min",
    univpilar: "liens",
  },
];

export default function PortraitsPage() {
  return (
    <div className={s.page}>
      <Helmet>
        <title>Portraits — Origines Media</title>
        <meta name="description" content="Des rencontres en profondeur avec ceux qui façonnent notre époque. Interviews longues, parcours de vie, confidences." />
      </Helmet>
      <SiteHeader />

      <div className={s.container}>
        <header className={s.header}>
          <span className={s.kicker}>Rubrique</span>
          <h1 className={s.title}>Portraits.</h1>
          <p className={s.deck}>
            Des rencontres en profondeur. On prend le temps de s&rsquo;asseoir,
            d&rsquo;&eacute;couter, de comprendre un parcours &mdash; et d&rsquo;en
            tirer quelque chose qui nous &eacute;claire tous.
          </p>
        </header>

        <div className={s.list}>
          {MOCK.map((p, i) => (
            <article key={p.slug} className={`${s.card} ${i % 2 === 1 ? s.cardFlipped : ""}`}>
              <a href={`/portraits/${p.slug}`} className={s.cardLink}>
                <div className={s.cardImgWrap}>
                  <img src={p.image} alt={p.name} className={s.cardImg} loading="lazy" />
                </div>
                <div className={s.cardBody}>
                  <span className={s.cardMeta}>{p.date} &middot; {p.readTime}</span>
                  <h2 className={s.cardName}>{p.name}</h2>
                  <span className={s.cardRole}>{p.role}</span>
                  <blockquote className={s.cardQuote}>{p.accroche}</blockquote>
                  <span className={s.cardCta}>
                    Lire le portrait
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </a>
            </article>
          ))}
        </div>
      </div>

      <Footer2 />
    </div>
  );
}
