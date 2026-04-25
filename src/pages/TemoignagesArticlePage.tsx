import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2/Footer2";
import s from "./TemoignagesArticlePage.module.css";

const MOCK = {
  title: "La lettre que je n'ai jamais envoyée",
  slug: "lettre-jamais-envoyee",
  chapeau: "Elle l'a écrite il y a dix ans. Elle ne l'a jamais envoyée. Aujourd'hui, elle la publie ici — pour la première fois.",
  prenom: "Mathilde",
  age: 34,
  ville: "Lyon",
  isAnonymous: false,
  date: "21 avril 2026",
  readTime: "12 min",
  paragraphs: [
    "Je ne sais pas pourquoi je l'ai écrite ce soir-là. Il devait être minuit, peut-être une heure. L'appartement était vide — Thomas venait de partir. Pas pour toujours, pas encore. Juste pour la nuit. Il faisait ça de plus en plus souvent.",
    "J'ai pris un carnet. Un vieux Moleskine noir que ma mère m'avait offert pour mes vingt ans. Je ne m'en étais jamais servie — j'avais peur de gâcher les pages. Cette nuit-là, j'avais plus peur du silence que du gâchis.",
    "« Papa. Je ne t'ai pas parlé depuis quatre ans. Je ne sais même pas si tu sais que j'ai déménagé. Je ne sais pas si tu sais que je vis avec quelqu'un. Je ne sais pas si tu te souviens de mon visage. »",
    "J'ai écrit sept pages. D'un trait. Sans m'arrêter. Sept pages de tout ce que je n'avais jamais dit — les anniversaires manqués, les coups de téléphone qui ne venaient jamais, les mensonges que je racontais à mes amis quand ils demandaient pourquoi mon père n'était pas là.",
    "Le lendemain matin, j'ai relu la lettre. Elle était maladroite, pleine de ratures, de phrases qui ne finissaient pas. Mais elle était vraie. C'était peut-être la chose la plus vraie que j'avais jamais écrite.",
    "Je l'ai pliée. Mise dans une enveloppe. Écrit l'adresse — celle de la maison de mon enfance, la seule que je connaissais. Et puis je l'ai posée sur la table de l'entrée.",
    "Elle est restée là pendant six mois.",
    "Je la voyais chaque matin en partant travailler. Chaque soir en rentrant. Elle était là, blanche, silencieuse, avec son timbre collé et son adresse écrite trop gros. Elle attendait. Et moi aussi.",
    "Un jour de juin, Thomas m'a demandé ce que c'était. J'ai dit « rien ». Il n'a pas insisté. C'était ça, notre problème — on n'insistait jamais. Sur rien.",
    "En septembre, j'ai mis la lettre dans un tiroir. En décembre, j'ai changé d'appartement. La lettre est venue avec moi. Elle est toujours là, dans une boîte à chaussures, avec d'autres choses que je garde sans savoir pourquoi.",
    "Je n'ai jamais envoyé cette lettre. Je ne l'enverrai probablement jamais. Mon père est mort l'année dernière. Crise cardiaque, à 62 ans. Je l'ai appris par ma tante. Trois jours après.",
    "Mais cette lettre m'a sauvée. Pas parce qu'elle a changé quelque chose entre nous. Rien n'a changé. Elle m'a sauvée parce qu'en l'écrivant, j'ai arrêté de porter tout ça seule. Les mots étaient sortis. Ils existaient quelque part, même si personne ne les avait lus.",
    "Aujourd'hui, quelqu'un les lit. Vous.",
  ],
};

export default function TemoignagesArticlePage() {
  const { slug } = useParams();
  const t = MOCK;

  return (
    <div className={s.page}>
      <Helmet>
        <title>{t.title} — T&eacute;moignages — Origines Media</title>
        <meta name="description" content={t.chapeau} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: t.title,
          description: t.chapeau,
          author: { "@type": "Person", name: t.isAnonymous ? "Anonyme" : t.prenom },
          publisher: { "@type": "Organization", name: "Origines Media" },
          articleSection: "Témoignages",
        })}</script>
      </Helmet>
      <SiteHeader />

      <div className={s.layout}>
        {/* Sticky sidebar */}
        <aside className={s.sidebar}>
          <div className={s.avatarBlock}>
            <span className={s.avatar}>{t.isAnonymous ? "?" : t.prenom[0]}</span>
            <span className={s.who}>{t.isAnonymous ? "Anonyme" : t.prenom}</span>
            <span className={s.whoDetail}>{t.age} ans &middot; {t.ville}</span>
          </div>
          <span className={s.sidebarMeta}>{t.readTime}</span>
          <span className={s.sidebarMeta}>{t.date}</span>
        </aside>

        <article className={s.article}>
          <header className={s.header}>
            <a href="/temoignages" className={s.breadcrumb}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
              T&eacute;moignages
            </a>
            <h1 className={s.title}>{t.title}</h1>
            <p className={s.chapeau}>{t.chapeau}</p>
            <div className={s.headerWho}>
              <span className={s.headerAvatar}>{t.isAnonymous ? "?" : t.prenom[0]}</span>
              <span>
                <strong>{t.isAnonymous ? "Anonyme" : t.prenom}</strong>, {t.age} ans &middot; {t.ville}
              </span>
            </div>
          </header>

          <div className={s.body}>
            {t.paragraphs.map((p, i) => {
              const isQuote = p.startsWith("«");
              return (
                <p key={i} className={isQuote ? s.inlineQuote : (p.length < 50 ? s.shortP : s.bodyP)}>
                  {p}
                </p>
              );
            })}
          </div>

          {/* CTA communauté */}
          <div className={s.ctaBlock}>
            <div className={s.ctaCommunity}>
              <h3 className={s.ctaTitle}>Ce r&eacute;cit vous parle&nbsp;?</h3>
              <p className={s.ctaText}>
                Rejoignez la communaut&eacute; Ensemble pour &eacute;changer avec d&rsquo;autres lecteurs
                qui vivent des situations similaires. Espace bienveillant, mod&eacute;r&eacute;.
              </p>
              <a href="/ensemble" className={s.ctaBtn}>
                Rejoindre la communaut&eacute;
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
              </a>
            </div>

            <div className={s.ctaShare}>
              <h3 className={s.ctaTitle}>Vous aussi, racontez.</h3>
              <p className={s.ctaText}>
                Votre histoire peut aider quelqu&rsquo;un. Anonymat garanti si vous le souhaitez.
              </p>
              <a href="/racontez-votre-histoire" className={s.ctaBtnOutline}>
                Partager mon histoire
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
              </a>
            </div>
          </div>
        </article>
      </div>

      <Footer2 />
    </div>
  );
}
