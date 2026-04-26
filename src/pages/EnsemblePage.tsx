import { useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import SEO from "../components/SEO";
import { typo } from "../lib/typography";
import s from "./EnsemblePage.module.css";

/* ================================================================
   DATA
   ================================================================ */

const NAV_SECTIONS = [
  { id: "histoires", label: "Histoires", color: "#D64C90" },
  { id: "recommandations", label: "Recommandations", color: "#7B5CD6" },
  { id: "lettre", label: "Lettre du dimanche", color: "#C99B1E" },
  { id: "question", label: "Question", color: "#2E94B5" },
  { id: "sondages", label: "Sondages", color: "#E67839" },
  { id: "calendrier", label: "Calendrier", color: "#5AA352" },
];

const HISTOIRES = [
  { title: "J’ai quitté mon CDI pour traverser l’Atlantique à la voile", cat: "Parcours", author: "Camille Dufresne", time: "18 min", image: "/histoires/histoire_parcours_resilience.png" },
  { title: "Comment j’ai appris à vivre avec mon TDAH à 35 ans", cat: "Épreuves", author: "Mathilde Aubry", time: "22 min", image: "/histoires/histoire_sante_mentale.png" },
  { title: "Ma mère m’a donné un prénom que je n’ai jamais porté", cat: "Relations", author: "Émilie Roux", time: "14 min", image: "/histoires/histoire_relations_famille.png" },
];

const RECOS = [
  { type: "Livre", title: "L’Art de la joie", author: "Goliarda Sapienza", color: "#8B5CF6", image: "/recos/reco_livre.png" },
  { type: "Podcast", title: "Les Chemins de la philosophie", author: "France Culture", color: "#EC4899", image: "/recos/reco_podcast.png" },
  { type: "Film", title: "Perfect Days", author: "Wim Wenders", color: "#F59E0B", image: "/recos/reco_film_serie.png" },
  { type: "Musique", title: "Multitude", author: "Stromae", color: "#0891B2", image: "/recos/reco_musique.png" },
];

const LETTRES = [
  { num: "N°47", title: "Sur le besoin de ralentir", date: "20 avril 2026" },
  { num: "N°46", title: "Ce que la colère essaie de nous dire", date: "13 avril 2026" },
  { num: "N°45", title: "Pourquoi on s’attache aux lieux", date: "6 avril 2026" },
  { num: "N°44", title: "Le droit de changer d’avis", date: "30 mars 2026" },
];

const QUESTION_OPTIONS = [
  "La peur du regard des autres",
  "Le manque d’argent",
  "Le manque de temps",
  "Je ne sais pas ce que je veux",
];

const SONDAGE_OPTIONS = [
  "Oui, absolument",
  "Pourquoi pas, à tester",
  "Non, je préfère lire",
];

const SONDAGE_RESULTS = [62, 24, 14];

const CALENDRIER = [
  { period: "Aujourd’hui", accent: "#D64C90", items: [
    { label: "Article de fond", type: "Écriture" },
    { label: "Recommandation", type: "Partage" },
  ]},
  { period: "Cette semaine", accent: "#7B5CD6", items: [
    { label: "Portrait vidéo", type: "Mercredi" },
    { label: "Question de la semaine", type: "Mercredi" },
    { label: "Nouvel épisode de série", type: "Vendredi" },
    { label: "Sondage communautaire", type: "Vendredi" },
  ]},
  { period: "Dimanche", accent: "#C99B1E", items: [
    { label: "La Lettre du dimanche", type: "Newsletter" },
    { label: "Récap’ de la semaine", type: "Bilan" },
  ]},
];

const PARTICIPATE = [
  { title: "Racontez votre histoire", desc: "Vous avez un parcours, une expérience à partager ? On veut vous entendre.", href: "/racontez-votre-histoire", color: "#D64C90" },
  { title: "Suggérez un sujet", desc: "Un thème qu’on devrait explorer ? Un angle qu’on a manqué ?", href: "/contact?sujet=idee", color: "#7B5CD6" },
  { title: "Proposez une amélioration", desc: "Une idée pour améliorer Origines ? Vos retours nous font avancer.", href: "/contact?sujet=suggestion", color: "#5AA352" },
];

/* ================================================================
   PAGE
   ================================================================ */

export default function EnsemblePage() {
  const [votedQuestion, setVotedQuestion] = useState<number | null>(null);
  const [votedSondage, setVotedSondage] = useState<number | null>(null);

  const questionResults = [34, 28, 22, 16];

  return (
    <div className={s.page}>
      <SEO
        title="Ensemble — Vie du média"
        description="Histoires, recommandations, lettres du dimanche, sondages et calendrier. La vie du média Origines."
        url="/ensemble"
      />
      <SiteHeader />

      <main>
        <div className="v2-container">
          {/* ═══ HERO ═══ */}
          <section className={s.hero}>
            <div className={`${s.chapterMark} mono`}>
              <span className={s.cNum}>Ch.04</span>
              <span className={s.cSep}>/</span>
              <span className={s.cLabel}>Ensemble</span>
            </div>

            <h1 className={s.heroTitle}>
              La vie du <em>m&eacute;dia.</em>
            </h1>
            <p className={s.heroDeck}>
              Ce qui se passe chez Origines au-del&agrave; des articles&nbsp;:
              les histoires que vous nous confiez, les recommandations qu&rsquo;on partage,
              les questions qu&rsquo;on se pose ensemble.
            </p>

            <nav className={s.pillars} aria-label="Sections">
              <span className={s.spectrumLine} aria-hidden="true" />
              {NAV_SECTIONS.map((sec, i) => (
                <div key={sec.id} className={s.pillarWrap}>
                  <a
                    href={`#${sec.id}`}
                    className={s.pillar}
                    style={{ "--pillar-color": sec.color, "--pillar-i": i } as React.CSSProperties}
                  >
                    {i > 0 && <span className={s.pillarBar} aria-hidden="true" />}
                    <span className={s.pillarDot} aria-hidden="true" />
                    <span className={s.pillarLabel}>{sec.label}</span>
                  </a>
                </div>
              ))}
            </nav>
          </section>

          {/* ═══ MOT DE LA RÉDAC' ═══ */}
          <section className={s.edito}>
            <div className={s.editoInner}>
              <span className={s.editoKicker}>Mot de la r&eacute;daction &middot; Semaine 17</span>
              <blockquote className={s.editoQuote}>
                <p>
                  On a lanc&eacute; Origines avec une conviction simple&nbsp;: les histoires
                  personnelles ont un pouvoir que les th&eacute;ories n&rsquo;ont pas. Elles ne
                  cherchent pas &agrave; prouver. Elles montrent. Et quand on se reconna&icirc;t
                  dans le parcours d&rsquo;un autre, quelque chose bouge.
                </p>
                <p>
                  Cette semaine, on vous propose trois r&eacute;cits qui n&rsquo;ont rien en commun
                  sauf &ccedil;a&nbsp;: ils sont vrais.
                </p>
              </blockquote>
              <div className={s.editoSign}>
                <span className={s.editoAuthor}>L&rsquo;&eacute;quipe Origines</span>
                <span className={s.editoDate}>26 avril 2026</span>
              </div>
            </div>
          </section>

          {/* ═══ HISTOIRES ═══ */}
          <section id="histoires" className={s.section}>
            <header className={s.sectionHead}>
              <div className={s.sectionLabel}>
                <span className={s.sectionKicker}>
                  <span className={s.sectionKickerDot} style={{ background: "#D64C90" }} />
                  Histoires
                </span>
                <h2 className={s.sectionTitle}>Vos <em>r&eacute;cits.</em></h2>
                <p className={s.sectionDeck}>
                  Des parcours de vie racont&eacute;s &agrave; la premi&egrave;re personne.
                  Chaque histoire est une fen&ecirc;tre sur un monde.
                </p>
              </div>
              <Link className={s.sectionAll} to="/histoires">
                Toutes les histoires
                <span className={s.sectionAllArrow}>&rarr;</span>
              </Link>
            </header>
            <div className={s.grid3}>
              {HISTOIRES.map((h, i) => (
                <Link key={i} to="/histoires" className={s.card}>
                  <div className={s.cardImg}>
                    <img src={h.image} alt={h.title} loading="lazy" />
                    <span className={s.cardGrad} />
                    <span className={s.cardBadge}>{h.cat}</span>
                  </div>
                  <div className={s.cardBody}>
                    <h3 className={s.cardTitle}>{typo(h.title)}</h3>
                    <div className={s.cardFoot}>
                      <span>Par <strong>{h.author}</strong></span>
                      <span className={s.dot} />
                      <span>{h.time}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* ═══ VERBATIM #1 ═══ */}
        <section className={s.verbatim}>
          <div className="v2-container">
            <div className={s.verbatimInner}>
              <span className={s.verbatimMark}>&ldquo;</span>
              <blockquote className={s.verbatimQuote}>
                J&rsquo;ai lu l&rsquo;histoire de Camille un dimanche matin.
                &Agrave; la fin, j&rsquo;ai appel&eacute; mon fr&egrave;re. On ne s&rsquo;&eacute;tait
                pas parl&eacute; depuis huit mois.
              </blockquote>
              <cite className={s.verbatimCite}>&mdash; Lectrice, Lyon</cite>
            </div>
          </div>
        </section>

        <div className="v2-container">
          {/* ═══ RECOMMANDATIONS ═══ */}
          <section id="recommandations" className={s.section}>
            <header className={s.sectionHead}>
              <div className={s.sectionLabel}>
                <span className={s.sectionKicker}>
                  <span className={s.sectionKickerDot} style={{ background: "#7B5CD6" }} />
                  Recommandations
                </span>
                <h2 className={s.sectionTitle}>On a aim&eacute; <em>&ccedil;a.</em></h2>
                <p className={s.sectionDeck}>
                  Livres, films, podcasts, musique&nbsp;&mdash; nos coups de c&oelig;ur
                  de la r&eacute;daction, chaque semaine.
                </p>
              </div>
              <Link className={s.sectionAll} to="/recommandations">
                Toutes les recos
                <span className={s.sectionAllArrow}>&rarr;</span>
              </Link>
            </header>
            <div className={s.grid4}>
              {RECOS.map((r, i) => (
                <Link key={i} to="/recommandations" className={s.card}>
                  <div className={s.cardImg} style={{ aspectRatio: "1" }}>
                    <img src={r.image} alt={r.title} loading="lazy" />
                    <span className={s.cardGrad} />
                    <span className={s.cardBadge} style={{ background: r.color }}>{r.type}</span>
                  </div>
                  <div className={s.cardBody}>
                    <h3 className={s.cardTitle}>{typo(r.title)}</h3>
                    <span className={s.cardAuthor}>{r.author}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* ═══ LA LETTRE DU DIMANCHE ═══ */}
        <section id="lettre" className={s.lettre}>
          <div className="v2-container">
            <div className={`${s.chapterMark} ${s.chapterMarkLight} mono`}>
              <span className={s.cNum}>Chaque dimanche</span>
              <span className={s.cSep}>/</span>
              <span className={s.cLabel}>La Lettre</span>
            </div>

            <div className={s.lettreGrid}>
              <div className={s.lettreText}>
                <h2 className={s.lettreTitle}>
                  La Lettre du <em>dimanche.</em>
                </h2>
                <p className={s.lettreDeck}>
                  Chaque dimanche matin, une lettre &eacute;crite avec soin.
                  Des r&eacute;flexions, des recommandations et une question
                  pour bien commencer la semaine.
                </p>
                <div className={s.lettreCtas}>
                  <Link to="/newsletter" className={s.lettreBtn}>
                    S&rsquo;inscrire
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                  </Link>
                  <Link to="/newsletter" className={s.lettreBtnGhost}>
                    Lire les &eacute;ditions
                  </Link>
                </div>
              </div>
              <div className={s.lettreArchive}>
                <span className={s.lettreArchiveLabel}>Derni&egrave;res &eacute;ditions</span>
                {LETTRES.map((l, i) => (
                  <Link key={i} to="/newsletter" className={s.lettreItem}>
                    <span className={s.lettreNum}>{l.num}</span>
                    <span className={s.lettreItemTitle}>{typo(l.title)}</span>
                    <span className={s.lettreDate}>{l.date}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ QUESTION DE LA SEMAINE — full width ═══ */}
        <section id="question" className={s.questionSection}>
          <div className="v2-container">
            <span className={s.questionKicker}>
              <span className={s.questionKickerDot} />
              Question de la semaine
            </span>
            <h2 className={s.questionTitle}>
              Qu&rsquo;est-ce qui vous emp&ecirc;che de faire ce que vous voulez <em>vraiment&nbsp;?</em>
            </h2>

            <div className={s.questionGrid}>
              {QUESTION_OPTIONS.map((opt, i) => {
                const hasVoted = votedQuestion !== null;
                const isSelected = votedQuestion === i;
                return (
                  <button
                    key={i}
                    className={`${s.questionOpt} ${isSelected ? s.questionOptSelected : ""} ${hasVoted ? s.questionOptVoted : ""}`}
                    onClick={() => !hasVoted && setVotedQuestion(i)}
                    disabled={hasVoted}
                  >
                    {hasVoted && (
                      <span className={s.questionFill} style={{ width: `${questionResults[i]}%` }} />
                    )}
                    <span className={s.questionOptNum}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={s.questionOptLabel}>{opt}</span>
                    {hasVoted && <span className={s.questionOptPct}>{questionResults[i]}&nbsp;%</span>}
                    {!hasVoted && (
                      <svg className={s.questionOptArrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 6 15 12 9 18" /></svg>
                    )}
                  </button>
                );
              })}
            </div>

            <p className={s.questionMeta}>
              {votedQuestion !== null ? "Merci pour votre vote ! — 2 340 réponses" : "Cliquez pour voter — 2 340 réponses cette semaine"}
            </p>
          </div>
        </section>

        {/* ═══ VERBATIM #2 ═══ */}
        <section className={s.verbatim}>
          <div className="v2-container">
            <div className={s.verbatimInner}>
              <span className={s.verbatimMark}>&ldquo;</span>
              <blockquote className={s.verbatimQuote}>
                Ce n&rsquo;est pas un m&eacute;dia qui me dit quoi penser.
                C&rsquo;est un m&eacute;dia qui me pose les bonnes questions.
              </blockquote>
              <cite className={s.verbatimCite}>&mdash; Abonn&eacute;, Bruxelles</cite>
            </div>
          </div>
        </section>

        <div className="v2-container">
          {/* ═══ SONDAGES ═══ */}
          <section id="sondages" className={s.section}>
            <header className={s.sectionHead}>
              <div className={s.sectionLabel}>
                <span className={s.sectionKicker}>
                  <span className={s.sectionKickerDot} style={{ background: "#E67839" }} />
                  Sondage en cours
                </span>
                <h2 className={s.sectionTitle}>Votre <em>avis.</em></h2>
              </div>
            </header>
            <div className={s.pollCard}>
              <h3 className={s.pollTitle}>{typo("Origines devrait-il lancer un podcast hebdomadaire ?")}</h3>
              <p className={s.pollSub}>Votre avis nous aide &agrave; construire le m&eacute;dia de demain.</p>
              <div className={s.pollOptions}>
                {SONDAGE_OPTIONS.map((opt, i) => {
                  const hasVoted = votedSondage !== null;
                  const isSelected = votedSondage === i;
                  return (
                    <button
                      key={i}
                      className={`${s.pollOpt} ${isSelected ? s.pollOptSelected : ""}`}
                      onClick={() => !hasVoted && setVotedSondage(i)}
                      disabled={hasVoted}
                    >
                      {hasVoted && (
                        <span className={s.pollFill} style={{ width: `${SONDAGE_RESULTS[i]}%`, background: isSelected ? "#E67839" : "rgba(10,10,10,0.06)" }} />
                      )}
                      <span className={s.pollOptLabel}>{opt}</span>
                      {hasVoted && <span className={s.pollOptPct}>{SONDAGE_RESULTS[i]}&nbsp;%</span>}
                    </button>
                  );
                })}
              </div>
              <p className={s.pollMeta}>
                {votedSondage !== null ? "Merci ! — 1 870 votes" : "Votez — 1 870 participants"}
              </p>
            </div>
          </section>

          {/* ═══ CALENDRIER — timeline ═══ */}
          <section id="calendrier" className={s.section}>
            <header className={s.sectionHead}>
              <div className={s.sectionLabel}>
                <span className={s.sectionKicker}>
                  <span className={s.sectionKickerDot} style={{ background: "#5AA352" }} />
                  Rythme &eacute;ditorial
                </span>
                <h2 className={s.sectionTitle}>Ce qui para&icirc;t, <em>et quand.</em></h2>
              </div>
            </header>
            <div className={s.timeline}>
              {CALENDRIER.map((col, i) => (
                <div key={i} className={s.timelineCol}>
                  <div className={s.timelineHeader}>
                    <span className={s.timelineDot} style={{ background: col.accent }} />
                    <span className={s.timelinePeriod}>{col.period}</span>
                  </div>
                  <div className={s.timelineItems}>
                    {col.items.map((item, j) => (
                      <div key={j} className={s.timelineItem}>
                        <span className={s.timelineType}>{item.type}</span>
                        <span className={s.timelineLabel}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ═══ PARTICIPEZ ═══ */}
          <section className={s.section}>
            <header className={s.sectionHead}>
              <div className={s.sectionLabel}>
                <span className={s.sectionKicker}>
                  <span className={s.sectionKickerDot} />
                  Communaut&eacute;
                </span>
                <h2 className={s.sectionTitle}>Participez.</h2>
                <p className={s.sectionDeck}>
                  Origines, c&rsquo;est aussi vous&nbsp;&mdash; contribuez au projet.
                </p>
              </div>
            </header>
            <div className={s.grid3}>
              {PARTICIPATE.map((act, i) => (
                <Link key={i} to={act.href} className={s.actCard}>
                  <span className={s.actDot} style={{ background: act.color }} />
                  <h3 className={s.actTitle}>{act.title}</h3>
                  <p className={s.actDesc}>{act.desc}</p>
                  <span className={s.actCta} style={{ color: act.color }}>
                    En savoir plus
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* ═══ CONTACT ═══ */}
          <section className={s.section}>
            <header className={s.sectionHead}>
              <div className={s.sectionLabel}>
                <span className={s.sectionKicker}>
                  <span className={s.sectionKickerDot} />
                  Contact
                </span>
                <h2 className={s.sectionTitle}>Restons en <em>contact.</em></h2>
              </div>
            </header>
            <div className={s.contactGrid}>
              <Link to="/rejoindre" className={s.contactCard}>
                <h3 className={s.contactTitle}>Rejoindre l&rsquo;&eacute;quipe</h3>
                <p className={s.contactDesc}>Contributeur, cr&eacute;ateur ou partenaire</p>
                <svg className={s.contactArrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </Link>
              <Link to="/contact" className={s.contactCard}>
                <h3 className={s.contactTitle}>Nous contacter</h3>
                <p className={s.contactDesc}>Une question, une id&eacute;e&nbsp;?</p>
                <svg className={s.contactArrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </Link>
              <Link to="/partenariats" className={s.contactCard}>
                <h3 className={s.contactTitle}>Partenariats</h3>
                <p className={s.contactDesc}>Collaborons ensemble</p>
                <svg className={s.contactArrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </Link>
            </div>
          </section>
        </div>

        {/* ═══ CLOSING ═══ */}
        <section className={s.closing}>
          <div className="v2-container">
            <div className={s.closingInner}>
              <div className={s.closingRule} />
              <p className={s.closingLogo}>Origines Media</p>
              <p className={s.closingText}>
                Un m&eacute;dia construit avec vous, pour aller plus loin ensemble.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer2 />
      <ScrollToTopV2 />
    </div>
  );
}
