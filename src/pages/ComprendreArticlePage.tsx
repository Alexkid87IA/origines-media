import { useParams } from "react-router-dom";
import SEO from "@/components/SEO";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2";
import EmailCapture from "@/components/EmailCapture";
import s from "./ComprendreArticlePage.module.css";

const MOCK = {
  title: "Pourquoi le cerveau résiste au changement",
  seoTitle: "Pourquoi le cerveau résiste au changement — neurosciences et habitudes",
  slug: "cerveau-resistance-changement",
  chapeau: "Changer d'habitude, c'est aller contre des millions d'années d'évolution. Voici ce que la neuroscience dit — et ce qu'on peut faire.",
  author: "Émilie Roux",
  date: "22 avril 2026",
  readTime: "14 min",
  univers: "L'Esprit",
  universColor: "#7B5CD6",
  keyTakeaways: [
    "Le cerveau préfère l'habitude par économie d'énergie — c'est biologique, pas moral.",
    "21 jours ne suffisent pas : les études montrent plutôt 66 jours en moyenne.",
    "Le contexte (lieu, heure, routine) compte plus que la motivation ou la volonté.",
  ],
  toc: [
    { id: "pourquoi", label: "Pourquoi on résiste" },
    { id: "mecanismes", label: "Les mécanismes neurologiques" },
    { id: "mythe-21", label: "Le mythe des 21 jours" },
    { id: "contexte", label: "Le rôle du contexte" },
    { id: "strategies", label: "Stratégies qui fonctionnent" },
  ],
  sections: [
    {
      id: "pourquoi",
      title: "Pourquoi on résiste au changement",
      content: "Le cerveau humain consomme environ 20% de notre énergie totale, alors qu'il ne représente que 2% de notre masse corporelle. Pour économiser cette énergie précieuse, il a développé un mécanisme redoutablement efficace : l'habitude.\n\nQuand vous répétez un comportement, les connexions neuronales impliquées se renforcent — c'est ce qu'on appelle la potentialisation à long terme. Au bout d'un certain temps, le comportement passe du cortex préfrontal (décision consciente) aux ganglions de la base (automatisme). C'est comme passer de la conduite supervisée à la conduite automatique.\n\nLe problème ? Une fois automatisé, un comportement ne disparaît jamais vraiment. Il peut être remplacé, mais le circuit neuronal reste — prêt à se réactiver au moindre signal.",
    },
    {
      id: "mecanismes",
      title: "Les mécanismes neurologiques en jeu",
      content: "Trois systèmes cérébraux s'opposent quand vous essayez de changer :\n\nLe système de récompense (dopamine) : il favorise ce qui est connu et prévisible. L'habitude, même mauvaise, active le circuit de la récompense parce qu'elle est familière.\n\nL'amygdale : elle interprète le nouveau comme une menace potentielle. Changer, c'est s'aventurer en terrain inconnu — et l'amygdale déteste l'inconnu.\n\nLe cortex préfrontal : c'est lui qui veut changer. Mais il se fatigue vite. Sa capacité de décision est limitée — c'est pourquoi vous tenez votre résolution le matin mais craquez le soir.",
    },
    {
      id: "mythe-21",
      title: "Le mythe des 21 jours",
      content: "L'idée que 21 jours suffisent pour créer une habitude vient du Dr Maxwell Maltz, chirurgien plastique dans les années 1960. Il avait observé que ses patients mettaient environ 21 jours à s'habituer à leur nouveau visage.\n\nMais une étude rigoureuse publiée dans le European Journal of Social Psychology en 2009 (Phillippa Lally, University College London) a mesuré le temps réel : 66 jours en moyenne, avec une fourchette allant de 18 à 254 jours selon la complexité du comportement.\n\nBoire un verre d'eau au réveil ? 18 jours. Faire 50 pompes avant le petit-déjeuner ? Jusqu'à 254 jours. La complexité et l'effort requis changent tout.",
    },
    {
      id: "contexte",
      title: "Le rôle du contexte",
      content: "La recherche de Wendy Wood (Duke University) a montré que 43% de nos comportements quotidiens sont des habitudes déclenchées par le contexte, pas par une décision consciente.\n\nCela signifie que changer de contexte est souvent plus efficace que changer de motivation. Les personnes qui déménagent, changent de travail ou modifient leur routine quotidienne ont significativement plus de chances de modifier leurs habitudes — même sans le vouloir consciemment.",
    },
    {
      id: "strategies",
      title: "Stratégies qui fonctionnent",
      content: "La science pointe vers trois approches validées :\n\n1. L'empilement d'habitudes (habit stacking) : rattacher le nouveau comportement à un automatisme existant. « Après mon café, je médite 2 minutes. »\n\n2. La réduction de friction : rendre le nouveau comportement le plus facile possible. Vous voulez courir le matin ? Dormez en tenue de sport.\n\n3. La conception d'environnement : modifier votre espace pour que le bon choix soit le choix par défaut. Pas de malbouffe à la maison = pas de malbouffe consommée.",
    },
  ],
  sources: [
    { label: "Lally, P. et al. (2009). How are habits formed. European Journal of Social Psychology.", url: "#" },
    { label: "Wood, W. & Neal, D.T. (2007). A New Look at Habits. Psychological Review.", url: "#" },
    { label: "Maltz, M. (1960). Psycho-Cybernetics. Simon & Schuster.", url: "#" },
  ],
  faq: [
    { question: "Combien de temps faut-il pour changer une habitude ?", answer: "En moyenne 66 jours selon l'étude de Phillippa Lally (UCL, 2009), mais cela varie de 18 à 254 jours selon la complexité du comportement." },
    { question: "Est-ce que la volonté suffit pour changer ?", answer: "Non. La recherche montre que le contexte et l'environnement sont plus déterminants que la motivation. Modifier son environnement est souvent plus efficace que « vouloir plus fort »." },
    { question: "Les mauvaises habitudes disparaissent-elles ?", answer: "Non, les circuits neuronaux restent. Mais on peut les remplacer par de nouvelles habitudes qui activent les mêmes déclencheurs avec une récompense différente." },
  ],
  relatedGuide: {
    title: "Le guide Origines : Reprendre le contrôle de ses habitudes",
    description: "21 exercices pratiques sur 6 semaines pour transformer vos routines. Basé sur les neurosciences.",
    href: "/boutique/guide-habitudes",
  },
};

export default function ComprendreArticlePage() {
  const { slug } = useParams();
  const a = MOCK;

  return (
    <div className={s.page}>
      <SEO
        title={a.seoTitle}
        description={a.chapeau}
        url={`/comprendre/${a.slug}`}
        type="article"
        author={a.author}
        section="Comprendre"
        jsonLd="article"
        faqData={a.faq.map((f) => ({ question: f.question, answer: f.answer }))}
      />
      <SiteHeader />

      {/* ── Hero ── */}
      <header className={s.hero}>
        <div className={s.heroInner}>
          <a href="/comprendre" className={s.breadcrumb}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
            Comprendre
          </a>
          <span className={s.heroMeta}>
            <span className={s.heroUniv} style={{ background: a.universColor }}>{a.univers}</span>
            {a.readTime} &middot; {a.date}
          </span>
          <h1 className={s.heroTitle}>{a.title}</h1>
          <p className={s.heroDeck}>{a.chapeau}</p>
          <span className={s.heroAuthor}>Par {a.author}</span>
        </div>
      </header>

      {/* ── Key Takeaways ── */}
      <div className={s.takeaways}>
        <div className={s.takeawaysInner}>
          <span className={s.takeawaysLabel}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>
            &Agrave; retenir
          </span>
          <ul className={s.takeawaysList}>
            {a.keyTakeaways.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Content with sidebar ── */}
      <div className={s.content}>
        <aside className={s.sidebar}>
          <nav className={s.toc}>
            <span className={s.tocLabel}>Sommaire</span>
            {a.toc.map((t) => (
              <a key={t.id} href={`#${t.id}`} className={s.tocLink}>{t.label}</a>
            ))}
          </nav>

          {/* Guide CTA */}
          <div className={s.guideCard}>
            <span className={s.guideLabel}>Guide associ&eacute;</span>
            <span className={s.guideTitle}>{a.relatedGuide.title}</span>
            <span className={s.guideDesc}>{a.relatedGuide.description}</span>
            <a href={a.relatedGuide.href} className={s.guideBtn}>D&eacute;couvrir le guide</a>
          </div>
        </aside>

        <article className={s.article}>
          {a.sections.map((sec, i) => (
            <section key={sec.id} id={sec.id} className={s.section}>
              <h2 className={s.sectionTitle}>{sec.title}</h2>
              {sec.content.split("\n\n").map((p, j) => (
                <p key={j} className={s.sectionP}>{p}</p>
              ))}

              {/* Ad placeholder after section 2 and 4 */}
              {(i === 1 || i === 3) && (
                <div className={s.adSlot}>
                  <span className={s.adLabel}>Publicit&eacute;</span>
                  <div className={s.adPlaceholder}>Espace publicitaire</div>
                </div>
              )}
            </section>
          ))}

          {/* ── FAQ ── */}
          <section className={s.faqSection}>
            <h2 className={s.faqTitle}>Questions fr&eacute;quentes</h2>
            {a.faq.map((f, i) => (
              <details key={i} className={s.faqItem}>
                <summary className={s.faqQ}>{f.question}</summary>
                <p className={s.faqA}>{f.answer}</p>
              </details>
            ))}
          </section>

          {/* ── Sources ── */}
          <section className={s.sourcesSection}>
            <h3 className={s.sourcesTitle}>Sources</h3>
            <ol className={s.sourcesList}>
              {a.sources.map((src, i) => (
                <li key={i}>
                  <a href={src.url} className={s.sourceLink} target="_blank" rel="noopener noreferrer">{src.label}</a>
                </li>
              ))}
            </ol>
          </section>

          {/* ── Newsletter CTA ── */}
          <div className={s.nlBlock}>
            <span className={s.nlLabel}>La lettre du dimanche</span>
            <span className={s.nlTitle}>Recevez nos meilleurs articles <em>Comprendre</em> chaque semaine.</span>
            <EmailCapture source="comprendre-article" variant="dark" placeholder="votre@email.com" buttonText="S'inscrire" />
          </div>
        </article>
      </div>

      <Footer2 />
    </div>
  );
}
