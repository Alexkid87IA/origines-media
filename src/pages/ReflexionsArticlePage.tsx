import { useParams } from "react-router-dom";
import SEO from "@/components/SEO";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2/Footer2";
import EmailCapture from "@/components/EmailCapture";
import s from "./ReflexionsArticlePage.module.css";

const MOCK = {
  title: "Le silence, le dernier luxe collectif",
  slug: "silence-luxe-collectif",
  chapeau: "On ne l'achète pas, mais on le perd chaque jour un peu plus. Le silence est devenu ce que le temps libre était dans les années 80 : un privilège invisible.",
  author: "Mathilde Aubry",
  authorBio: "Essayiste, autrice de Disparitions douces (Gallimard, 2025). Elle écrit sur ce qui disparaît sans bruit.",
  date: "20 avril 2026",
  readTime: "18 min",
  pullQuote: "Le bruit n'est pas le contraire du silence. Le bruit, c'est ce qui arrive quand on a oublié que le silence existait.",
  authorNote: "Ce texte est né d'une semaine passée dans un monastère des Cévennes. Pas pour trouver Dieu — pour trouver le calme. J'y suis restée cinq jours. Le sixième, je suis repartie. Mais quelque chose avait changé.",
  paragraphs: [
    "Il y a un moment, dans une journée, où le bruit cesse d'être un événement et devient un état. On ne l'entend plus. Il est partout — dans la rue, dans le métro, dans les oreilles avec le podcast, dans le salon avec la télé qui parle à personne. Le bruit est devenu l'air qu'on respire. On ne le remarque que quand il disparaît.",
    "J'ai réalisé ça un mardi matin de novembre, dans un train vers Alès. Pas de réseau, pas de musique, le téléphone mort. Et pendant quarante minutes, il ne s'est rien passé. Rien. Pas de notification, pas de voix, pas de stimulus. Juste le paysage, le bruit des rails, et ma propre respiration.",
    "C'était insupportable.",
    "Pas physiquement. Psychologiquement. Mon cerveau cherchait frénétiquement quelque chose à consommer. Un article. Un message. Un titre. N'importe quoi pour combler ce vide que le silence venait de révéler.",
    "Le philosophe Blaise Pascal écrivait déjà en 1670 : « Tout le malheur des hommes vient d'une seule chose, qui est de ne savoir pas demeurer en repos dans une chambre. » Trois siècles plus tard, on a résolu le problème — en mettant un écran dans la chambre.",
    "Mais le silence n'est pas l'absence de bruit. Le silence, c'est la présence de soi. C'est le moment où il n'y a plus rien entre vous et vos pensées. Pas de filtre, pas de distraction, pas d'échappatoire. Et c'est précisément ce qui le rend si effrayant — et si précieux.",
    "Dans les zones urbaines, le niveau sonore moyen dépasse 65 décibels. L'OMS considère que le seuil de nuisance commence à 55. On vit donc, en permanence, au-dessus du seuil de ce que notre organisme considère comme supportable. Et on s'étonne d'être fatigués.",
    "Le silence est devenu un luxe. Pas au sens marchand — même si les retraites silencieuses à 3 000 euros la semaine existent. Un luxe au sens premier du mot : quelque chose de rare, de précieux, et d'inégalement distribué. Ceux qui vivent dans le bruit sont souvent ceux qui n'ont pas le choix.",
    "Je ne propose pas de solution. Je n'en ai pas. Je propose juste une question : quand avez-vous entendu le silence pour la dernière fois ? Pas le calme. Pas le repos. Le silence — celui qui vous fait entendre votre propre souffle, vos propres pensées, votre propre peur ?",
    "Si vous ne vous en souvenez pas, c'est peut-être que le bruit a gagné.",
  ],
};

export default function ReflexionsArticlePage() {
  const { slug } = useParams();
  const a = MOCK;

  return (
    <div className={s.page}>
      <SEO
        title={`${a.title} — Réflexions`}
        description={a.chapeau}
        url={`/reflexions/${a.slug}`}
        type="article"
        author={a.author}
        section="Réflexions"
        jsonLd="article"
      />
      <SiteHeader />

      <article className={s.article}>
        <header className={s.header}>
          <a href="/reflexions" className={s.breadcrumb}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
            R&eacute;flexions
          </a>
          <span className={s.meta}>{a.readTime} &middot; {a.date}</span>
          <h1 className={s.title}>{a.title}</h1>
          <p className={s.chapeau}>{a.chapeau}</p>
          <div className={s.authorBlock}>
            <span className={s.authorName}>Par {a.author}</span>
            <span className={s.authorBio}>{a.authorBio}</span>
          </div>
        </header>

        {/* Author note */}
        <aside className={s.authorNote}>
          <span className={s.authorNoteLabel}>Note de l&rsquo;autrice</span>
          <p>{a.authorNote}</p>
        </aside>

        {/* Body */}
        <div className={s.body}>
          {a.paragraphs.map((p, i) => (
            <div key={i}>
              <p className={p.length < 40 ? s.shortP : s.bodyP}>{p}</p>
              {i === 4 && (
                <blockquote className={s.pullQuote}>
                  {a.pullQuote}
                </blockquote>
              )}
            </div>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className={s.nlBlock}>
          <span className={s.nlKicker}>La lettre du dimanche</span>
          <h3 className={s.nlTitle}>Cet auteur publie chaque dimanche dans la <em>Lettre Origines.</em></h3>
          <p className={s.nlDeck}>Essais in&eacute;dits, recommandations de lecture, un regard diff&eacute;rent sur la semaine &mdash; directement dans votre bo&icirc;te mail.</p>
          <EmailCapture source="reflexions-article" variant="dark" placeholder="votre@email.com" buttonText="Recevoir la lettre" />
          <span className={s.nlTrust}>Gratuit &middot; Chaque dimanche &middot; D&eacute;sinscription en 1 clic</span>
        </div>
      </article>

      <Footer2 />
    </div>
  );
}
