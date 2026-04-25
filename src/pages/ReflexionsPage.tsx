import { Helmet } from "react-helmet-async";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2/Footer2";
import s from "./ReflexionsPage.module.css";

interface MockEssai {
  title: string;
  slug: string;
  pullQuote: string;
  author: string;
  authorNote: string;
  date: string;
  readTime: string;
}

const MOCK: MockEssai[] = [
  {
    title: "Le silence, le dernier luxe collectif",
    slug: "silence-luxe-collectif",
    pullQuote: "On ne l'achète pas, mais on le perd chaque jour un peu plus. Le silence est devenu ce que le temps libre était dans les années 80 : un privilège invisible.",
    author: "Mathilde Aubry",
    authorNote: "Essayiste, autrice de Disparitions douces (Gallimard, 2025)",
    date: "20 avril 2026",
    readTime: "18 min",
  },
  {
    title: "Avons-nous encore le droit de ne rien faire ?",
    slug: "droit-ne-rien-faire",
    pullQuote: "L'oisiveté n'est plus un repos. Elle est devenue une faute morale. Comme si ne rien produire revenait à ne rien valoir.",
    author: "Alexandre Dumas-Kieffer",
    authorNote: "Philosophe, maître de conférences à Paris-Nanterre",
    date: "16 avril 2026",
    readTime: "14 min",
  },
  {
    title: "La fatigue n'est pas ce qu'on croit",
    slug: "fatigue-pas-ce-quon-croit",
    pullQuote: "On dort assez. Parfois même trop. Mais on se réveille épuisés. La fatigue moderne n'est pas physique — elle est décisionnelle.",
    author: "Émilie Roux",
    authorNote: "Journaliste santé, chroniqueuse Origines Media",
    date: "12 avril 2026",
    readTime: "12 min",
  },
  {
    title: "Ce que les morts nous apprennent sur la vie",
    slug: "morts-apprennent-vie",
    pullQuote: "J'ai passé trois ans dans les soins palliatifs. Les mourants ne parlent jamais de leur carrière. Ils parlent d'un matin d'été, d'un visage, d'un geste qu'ils auraient voulu faire.",
    author: "Claire Vasseur",
    authorNote: "Infirmière, autrice de Les Derniers Matins",
    date: "8 avril 2026",
    readTime: "22 min",
  },
  {
    title: "Pourquoi je refuse de « guérir »",
    slug: "refus-guerir",
    pullQuote: "On m'a dit que j'étais cassée. Que la thérapie me réparerait. Mais peut-être que cette fissure, c'est par là que la lumière entre.",
    author: "Inès Belkacem",
    authorNote: "Poétesse, contributrice Origines Media",
    date: "4 avril 2026",
    readTime: "9 min",
  },
];

export default function ReflexionsPage() {
  return (
    <div className={s.page}>
      <Helmet>
        <title>R&eacute;flexions — Origines Media</title>
        <meta name="description" content="Essais, opinions et réflexions personnelles. Des textes pour penser autrement, par des auteurs qui osent dire ce qu'ils pensent." />
      </Helmet>
      <SiteHeader />

      <div className={s.container}>
        <header className={s.header}>
          <span className={s.kicker}>Rubrique</span>
          <h1 className={s.title}>
            <em>R&eacute;flexions.</em>
          </h1>
          <p className={s.deck}>
            Des essais, des opinions, des textes qui prennent le temps de penser.
            Pas de r&eacute;ponses d&eacute;finitives &mdash; juste des regards
            singuliers sur le monde.
          </p>
        </header>

        <div className={s.list}>
          {MOCK.map((a) => (
            <article key={a.slug} className={s.card}>
              <a href={`/reflexions/${a.slug}`} className={s.cardLink}>
                <blockquote className={s.cardQuote}>
                  &laquo;&nbsp;{a.pullQuote}&nbsp;&raquo;
                </blockquote>
                <h2 className={s.cardTitle}>{a.title}</h2>
                <div className={s.cardFooter}>
                  <div className={s.cardAuthorBlock}>
                    <span className={s.cardAuthorName}>{a.author}</span>
                    <span className={s.cardAuthorNote}>{a.authorNote}</span>
                  </div>
                  <span className={s.cardMeta}>{a.date} &middot; {a.readTime}</span>
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
