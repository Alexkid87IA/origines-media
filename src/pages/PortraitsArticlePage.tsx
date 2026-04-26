import { useParams } from "react-router-dom";
import SEO from "@/components/SEO";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2";
import { estimateReadingTimeFromText } from "@/lib/typography";
import s from "./PortraitsArticlePage.module.css";

const MOCK = {
  title: "Fatou Diome",
  slug: "fatou-diome",
  role: "Écrivaine, autrice de Le Ventre de l'Atlantique",
  chapeau: "Elle est partie du Sénégal à 22 ans avec un sac et un rêve. Trente ans plus tard, elle est l'une des voix les plus puissantes de la littérature francophone. Rencontre.",
  image: "/covers/cover-01.webp",
  author: "Camille Dufresne",
  date: "22 avril 2026",
  get readTime() {
    const allText = this.chapeau + " " + this.intro.join(" ") + " " + this.interview.map((qa: any) => qa.question + " " + qa.answer).join(" ");
    return `${estimateReadingTimeFromText(allText)} min`;
  },
  sponsor: {
    name: "Fondation pour les Lettres",
    note: "Ce portrait fait partie de la série Parcours, soutenue par la Fondation pour les Lettres.",
  },
  intro: [
    "On la rencontre dans un café du 11e, un mardi de pluie. Elle arrive en retard — « les bus parisiens ne connaissent pas l'heure sénégalaise » — et commande un thé à la menthe. Elle parle comme elle écrit : avec une précision qui coupe et une tendresse qui rattrape.",
    "Fatou Diome a 56 ans. Elle a publié huit romans, donné mille conférences, refusé deux fois la Légion d'honneur. Elle dit qu'elle n'est pas là pour les médailles. Elle est là pour les mots.",
  ],
  interview: [
    {
      question: "Vous avez quitté le Sénégal à 22 ans. Qu'est-ce qui vous a poussée à partir ?",
      answer: "La faim. Pas celle du ventre — celle de l'esprit. Je voulais lire des livres qui n'existaient pas dans ma bibliothèque de village. Je voulais rencontrer des gens qui pensaient autrement. Je voulais voir si le monde était aussi grand que je l'imaginais. Il l'était — et il était aussi plus dur que je ne le pensais.",
    },
    {
      question: "Votre premier livre a été refusé par douze éditeurs. Comment on survit à ça ?",
      answer: "On ne survit pas. On meurt un peu à chaque refus. Et puis on se relève. La treizième fois, quelqu'un dit oui — et toutes les fois où on a dit non deviennent l'histoire qu'on raconte dans les interviews, trente ans plus tard, en souriant.\n\nMais je ne souriais pas à l'époque. À l'époque, je pleurais. Et c'est important de le dire, parce que les gens croient que la résilience, c'est ne pas pleurer. Non. La résilience, c'est pleurer et continuer.",
    },
    {
      question: "Vous avez refusé la Légion d'honneur. Deux fois. Pourquoi ?",
      answer: "Parce qu'on ne décore pas la liberté. Un écrivain qui accepte une médaille de l'État devient, qu'il le veuille ou non, une caution. Or je ne cautionne rien — je questionne tout. C'est mon métier.",
    },
    {
      question: "Qu'est-ce que vous diriez à une jeune femme de 22 ans qui veut écrire ?",
      answer: "Lis. Lis tout. Lis ce que tu aimes et lis ce que tu détestes. Lis les morts et lis les vivants. Et quand tu auras lu assez pour comprendre que tout a déjà été dit — alors commence à écrire. Parce que tout a été dit, mais pas par toi.",
    },
    {
      question: "Quel est le livre que vous auriez voulu écrire ?",
      answer: "Les Misérables. Pas pour l'histoire — pour le geste. Hugo a écrit un livre qui dit : voici le monde tel qu'il est, et voici le monde tel qu'il devrait être. Et entre les deux, il y a nous. C'est ça, la littérature. L'espace entre ce qui est et ce qui devrait être.",
    },
  ],
};

export default function PortraitsArticlePage() {
  const { slug } = useParams();
  const p = MOCK;

  return (
    <div className={s.page}>
      <SEO
        title={`${p.title} — Portraits`}
        description={p.chapeau}
        url={`/portraits/${p.slug}`}
        type="article"
        image={p.image}
        author={p.author}
        section="Portraits"
        jsonLd="article"
      />
      <SiteHeader />

      {/* ── Sponsor banner ── */}
      <div className={s.sponsorBar}>
        <span className={s.sponsorText}>
          {p.sponsor.note}
        </span>
      </div>

      {/* ── Breadcrumb ── */}
      <nav className={s.breadcrumbBar}>
        <a href="/portraits" className={s.breadcrumb}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
          Portraits
        </a>
      </nav>

      {/* ── Hero image ── */}
      <div className={s.heroImg}>
        <img src={p.image} alt={p.title} className={s.heroPhoto} loading="eager" fetchpriority="high" />
      </div>

      {/* ── Content ── */}
      <article className={s.article}>
        <header className={s.header}>
          <span className={s.meta}>{p.readTime} &middot; {p.date} &middot; Par {p.author}</span>
          <h1 className={s.name}>{p.title}</h1>
          <span className={s.role}>{p.role}</span>
          <p className={s.chapeau}>{p.chapeau}</p>
        </header>

        {/* Intro paragraphs */}
        <div className={s.intro}>
          {p.intro.map((para, i) => (
            <p key={i} className={s.introP}>{para}</p>
          ))}
        </div>

        {/* Interview Q&A */}
        <div className={s.interview}>
          <span className={s.interviewLabel}>Entretien</span>
          {p.interview.map((qa, i) => (
            <div key={i} className={s.qa}>
              <p className={s.question}>{qa.question}</p>
              {qa.answer.split("\n\n").map((a, j) => (
                <p key={j} className={s.answer}>{a}</p>
              ))}
            </div>
          ))}
        </div>

        {/* Sponsor footer */}
        <div className={s.sponsorFoot}>
          <span className={s.sponsorFootLabel}>Ce portrait est soutenu par</span>
          <span className={s.sponsorFootName}>{p.sponsor.name}</span>
          <p className={s.sponsorFootNote}>
            Le contenu &eacute;ditorial reste ind&eacute;pendant. Le partenaire n&rsquo;a aucun
            droit de regard sur les questions pos&eacute;es ni les r&eacute;ponses publi&eacute;es.
          </p>
        </div>
      </article>

      <Footer2 />
    </div>
  );
}
