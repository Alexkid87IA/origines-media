import { useState } from "react";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import SEO from "../components/SEO";
import { typo } from "../lib/typography";
import s from "./GuidesPage.module.css";

/* ================================================================
   DATA
   ================================================================ */

const NAV_SECTIONS = [
  { id: "masterclass", label: "Masterclass", color: "#D64C90" },
  { id: "programmes", label: "Programmes", color: "#2E9B74" },
  { id: "ateliers", label: "Ateliers", color: "#5A66D6" },
  { id: "kits", label: "Kits gratuits", color: "#5AA352" },
];

const MASTERCLASSES = [
  {
    title: "Maîtriser ses émotions",
    subtitle: "Comprendre, accueillir, transformer",
    author: "Dr. Sophie Leclerc",
    duration: "6 modules · 4h30",
    price: "49 €",
    badge: "Bestseller",
    image: "/histoires/histoire_emotions_bienetre.webp",
    color: "#D64C90",
    students: "2 340",
  },
  {
    title: "Construire sa résilience",
    subtitle: "Rebondir après l'épreuve",
    author: "Camille Dufresne",
    duration: "8 modules · 5h",
    price: "59 €",
    badge: "Nouveau",
    image: "/histoires/histoire_parcours_resilience.webp",
    color: "#7B5CD6",
    students: "890",
  },
  {
    title: "L'art de la conversation profonde",
    subtitle: "Créer des liens vrais",
    author: "Émilie Roux",
    duration: "5 modules · 3h",
    price: "39 €",
    image: "/histoires/histoire_relations_famille.webp",
    color: "#2E94B5",
    students: "1 150",
  },
];

const PROGRAMMES = [
  {
    title: "8 semaines pour se connaître",
    desc: "Un parcours structuré mêlant articles, exercices et réflexions pour découvrir qui vous êtes vraiment.",
    modules: 8,
    format: "Articles + exercices",
    price: "79 €",
    color: "#2E9B74",
    tag: "Transformation",
  },
  {
    title: "30 jours d'écriture intérieure",
    desc: "Chaque jour, un prompt pour explorer votre monde intérieur. Journal guidé, progressif, sans jugement.",
    modules: 30,
    format: "Journal guidé",
    price: "29 €",
    color: "#7B5CD6",
    tag: "Introspection",
  },
  {
    title: "Reprendre le contrôle de son temps",
    desc: "Un programme en 4 étapes pour sortir de l'urgence permanente et retrouver de l'espace.",
    modules: 4,
    format: "Vidéo + fiches",
    price: "49 €",
    color: "#E67839",
    tag: "Productivité",
  },
];

const ATELIERS = [
  { title: "Atelier écriture : raconter son histoire", duration: "2h", price: "19 €", color: "#D64C90" },
  { title: "Communication non violente : les bases", duration: "1h30", price: "14 €", color: "#5A66D6" },
  { title: "Méditation : premiers pas", duration: "45 min", price: "9 €", color: "#2E9B74" },
  { title: "Comprendre son ennéagramme", duration: "2h", price: "19 €", color: "#7B5CD6" },
  { title: "Gérer le conflit en couple", duration: "1h30", price: "14 €", color: "#E67839" },
  { title: "Respiration et stress : toolkit", duration: "1h", price: "9 €", color: "#2E94B5" },
];

const KITS = [
  {
    title: "Kit Découverte — 5 exercices pour commencer",
    desc: "Cinq exercices simples pour explorer la connaissance de soi. Aucun prérequis.",
    format: "PDF · 12 pages",
    color: "#5AA352",
  },
  {
    title: "Carnet de gratitude — 30 jours",
    desc: "Un prompt par jour pendant un mois pour cultiver la gratitude au quotidien.",
    format: "PDF · 34 pages",
    color: "#2E94B5",
  },
  {
    title: "Guide : bien démarrer sa journée",
    desc: "Routine matinale en 4 étapes, adaptée à votre rythme.",
    format: "PDF · 8 pages",
    color: "#7B5CD6",
  },
];

const FAQ_ITEMS = [
  { q: "Comment accéder à mon achat ?", a: "Dès le paiement confirmé, vous recevez un e-mail avec un lien de téléchargement. Le contenu est aussi disponible dans votre espace personnel." },
  { q: "Les accès sont-ils à vie ?", a: "Oui. Une fois acheté, le contenu est à vous. Vous pouvez le consulter et le télécharger autant de fois que vous le souhaitez." },
  { q: "Puis-je offrir un guide ou une masterclass ?", a: "Absolument. Chaque produit peut être offert sous forme de carte cadeau numérique, envoyée par e-mail à la date de votre choix." },
  { q: "Quelle est votre politique de remboursement ?", a: "Si le contenu ne vous convient pas, vous disposez de 14 jours pour demander un remboursement intégral, sans condition." },
];

/* ================================================================
   PAGE
   ================================================================ */

export default function GuidesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className={s.page}>
      <SEO
        title="Guides — Masterclass, programmes et kits gratuits"
        description="Apprenez à votre rythme. Masterclass vidéo, programmes structurés, ateliers pratiques et kits gratuits pour avancer dans votre vie."
        url="/guides"
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: "Guides", url: "/guides" },
        ]}
      />
      <SiteHeader />

      <main>
        <div className="v2-container">
          {/* ═══ HERO ═══ */}
          <section className={s.hero}>
            <div className={`${s.chapterMark} mono`}>
              <span className={s.cNum}>Ch.03</span>
              <span className={s.cSep}>/</span>
              <span className={s.cLabel}>Guides</span>
            </div>

            <h1 className={s.heroTitle}>
              Apprenez &agrave; votre rythme.<br />
              Avancez pour de <em>vrai.</em>
            </h1>
            <p className={s.heroDeck}>
              Masterclass vid&eacute;o, programmes structur&eacute;s, ateliers
              pratiques et ressources gratuites&nbsp;&mdash; chaque format est
              con&ccedil;u pour vous aider &agrave; passer de la compr&eacute;hension
              &agrave; l&rsquo;action.
            </p>

            <div className={s.heroCtas}>
              <a href="#masterclass" className={s.heroBtn}>
                D&eacute;couvrir les masterclass
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </a>
              <a href="#kits" className={s.heroBtnGhost}>
                Commencer gratuitement
              </a>
            </div>

            <nav className={s.pillars} aria-label="Formats">
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

          {/* ═══ STATS BAR ═══ */}
          <div className={s.stats}>
            <div className={s.stat}>
              <span className={s.statNum}>4 200+</span>
              <span className={s.statLabel}>participants</span>
            </div>
            <div className={s.stat}>
              <span className={s.statNum}>4,8 / 5</span>
              <span className={s.statLabel}>note moyenne</span>
            </div>
            <div className={s.stat}>
              <span className={s.statNum}>14 jours</span>
              <span className={s.statLabel}>satisfait ou rembours&eacute;</span>
            </div>
            <div className={s.stat}>
              <span className={s.statNum}>&infin;</span>
              <span className={s.statLabel}>acc&egrave;s &agrave; vie</span>
            </div>
          </div>
        </div>

        {/* ═══ MASTERCLASS — dark immersive section ═══ */}
        <section id="masterclass" className={s.masterSection}>
          <div className="v2-container">
            <div className={`${s.chapterMark} ${s.chapterMarkLight} mono`}>
              <span className={s.cNum}>Format premium</span>
              <span className={s.cSep}>/</span>
              <span className={s.cLabel}>Masterclass</span>
            </div>

            <header className={s.masterHead}>
              <h2 className={s.masterTitle}>
                Nos <em>masterclass.</em>
              </h2>
              <p className={s.masterDeck}>
                Des parcours vid&eacute;o complets, guid&eacute;s par des experts.
                Chaque masterclass est un voyage&nbsp;: on apprend, on pratique,
                on avance.
              </p>
            </header>

            <div className={s.masterGrid}>
              {MASTERCLASSES.map((mc, i) => (
                <div key={i} className={`${s.masterCard} ${s.cardSoon}`}>
                  <div className={s.masterImg}>
                    <img src={mc.image} alt={mc.title} loading="lazy" />
                    <span className={s.masterGrad} />
                    <span className={s.soonBadge}>Bient&ocirc;t dispo</span>
                    <span className={s.masterPlay} aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="8,5 19,12 8,19" /></svg>
                    </span>
                  </div>
                  <div className={s.masterBody}>
                    <span className={s.masterAuthor}>{mc.author}</span>
                    <h3 className={s.masterCardTitle}>{typo(mc.title)}</h3>
                    <p className={s.masterSub}>{mc.subtitle}</p>
                    <div className={s.masterFoot}>
                      <span className={s.masterDuration}>{mc.duration}</span>
                    </div>
                    <div className={s.masterPriceLine}>
                      <span className={s.masterPrice}>{mc.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ VERBATIM ═══ */}
        <section className={s.verbatim}>
          <div className="v2-container">
            <div className={s.verbatimInner}>
              <span className={s.verbatimMark}>&ldquo;</span>
              <blockquote className={s.verbatimQuote}>
                J&rsquo;ai suivi la masterclass sur les &eacute;motions en une semaine.
                &Agrave; la fin, j&rsquo;ai compris pourquoi je r&eacute;agissais toujours
                de la m&ecirc;me fa&ccedil;on. &Ccedil;a a tout chang&eacute;.
              </blockquote>
              <cite className={s.verbatimCite}>&mdash; Participant, Paris &middot; Masterclass &laquo;&nbsp;Ma&icirc;triser ses &eacute;motions&nbsp;&raquo;</cite>
            </div>
          </div>
        </section>

        <div className="v2-container">
          {/* ═══ PROGRAMMES ═══ */}
          <section id="programmes" className={s.section}>
            <header className={s.sectionHead}>
              <div className={s.sectionLabel}>
                <span className={s.sectionKicker}>
                  <span className={s.sectionKickerDot} style={{ background: "#2E9B74" }} />
                  Programmes
                </span>
                <h2 className={s.sectionTitle}>Des parcours pour <em>changer.</em></h2>
                <p className={s.sectionDeck}>
                  Des programmes structur&eacute;s sur plusieurs semaines.
                  On avance pas &agrave; pas, avec un objectif clair et un accompagnement complet.
                </p>
              </div>
            </header>

            <div className={s.progGrid}>
              {PROGRAMMES.map((p, i) => (
                <div key={i} className={`${s.progCard} ${s.cardSoon}`}>
                  <div className={s.progHeader}>
                    <span className={s.progTag} style={{ color: p.color }}>{p.tag}</span>
                    <span className={s.soonBadgeSmall}>Bient&ocirc;t dispo</span>
                  </div>
                  <h3 className={s.progTitle}>{typo(p.title)}</h3>
                  <p className={s.progDesc}>{p.desc}</p>
                  <div className={s.progFoot}>
                    <span className={s.progFormat}>{p.format}</span>
                    <span className={s.progPrice}>{p.price}</span>
                  </div>
                  <div className={s.progBar} style={{ background: p.color }} aria-hidden="true" />
                </div>
              ))}
            </div>
          </section>

          {/* ═══ ATELIERS ═══ */}
          <section id="ateliers" className={s.section}>
            <header className={s.sectionHead}>
              <div className={s.sectionLabel}>
                <span className={s.sectionKicker}>
                  <span className={s.sectionKickerDot} style={{ background: "#5A66D6" }} />
                  Ateliers
                </span>
                <h2 className={s.sectionTitle}>Allez &agrave; <em>l&rsquo;essentiel.</em></h2>
                <p className={s.sectionDeck}>
                  Des sessions courtes et cibl&eacute;es, pour apprendre une comp&eacute;tence
                  pr&eacute;cise en une ou deux heures.
                </p>
              </div>
            </header>

            <div className={s.atelierGrid}>
              {ATELIERS.map((a, i) => (
                <div key={i} className={`${s.atelierCard} ${s.cardSoon}`}>
                  <span className={s.atelierDot} style={{ background: a.color }} />
                  <div className={s.atelierBody}>
                    <h3 className={s.atelierTitle}>{typo(a.title)}</h3>
                    <div className={s.atelierMeta}>
                      <span>{a.duration}</span>
                      <span className={s.dot} />
                      <span className={s.atelierPrice}>{a.price}</span>
                    </div>
                  </div>
                  <span className={s.soonBadgeSmall}>Bient&ocirc;t</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ═══ KITS GRATUITS — tinted section ═══ */}
        <section id="kits" className={s.kitsSection}>
          <div className="v2-container">
            <header className={s.sectionHead}>
              <div className={s.sectionLabel}>
                <span className={s.sectionKicker} style={{ color: "#5AA352" }}>
                  <span className={s.sectionKickerDot} style={{ background: "#5AA352" }} />
                  Gratuit
                </span>
                <h2 className={s.sectionTitle}>Commencez <em>ici.</em></h2>
                <p className={s.sectionDeck}>
                  Pas besoin de payer pour avancer. Ces kits sont gratuits,
                  sans engagement&nbsp;&mdash; juste un premier pas.
                </p>
              </div>
            </header>

            <div className={s.kitsGrid}>
              {KITS.map((k, i) => (
                <div key={i} className={s.kitCard}>
                  <span className={s.kitDot} style={{ background: k.color }} />
                  <h3 className={s.kitTitle}>{typo(k.title)}</h3>
                  <p className={s.kitDesc}>{k.desc}</p>
                  <div className={s.kitFoot}>
                    <span className={s.kitFormat}>{k.format}</span>
                    <button className={s.kitBtn} style={{ color: k.color }}>
                      T&eacute;l&eacute;charger
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ VERBATIM #2 ═══ */}
        <section className={s.verbatim}>
          <div className="v2-container">
            <div className={s.verbatimInner}>
              <span className={s.verbatimMark}>&ldquo;</span>
              <blockquote className={s.verbatimQuote}>
                Le kit gratuit m&rsquo;a convaincu. J&rsquo;ai pris le programme
                ensuite. Meilleur investissement de l&rsquo;ann&eacute;e.
              </blockquote>
              <cite className={s.verbatimCite}>&mdash; Abonn&eacute;e, Bordeaux</cite>
            </div>
          </div>
        </section>

        <div className="v2-container">
          {/* ═══ FAQ ═══ */}
          <section className={s.section}>
            <header className={s.sectionHead}>
              <div className={s.sectionLabel}>
                <span className={s.sectionKicker}>
                  <span className={s.sectionKickerDot} />
                  Questions fr&eacute;quentes
                </span>
                <h2 className={s.sectionTitle}>Avant de vous <em>lancer.</em></h2>
              </div>
            </header>

            <div className={s.faqList}>
              {FAQ_ITEMS.map((faq, i) => (
                <div key={i} className={`${s.faqItem} ${openFaq === i ? s.faqItemOpen : ""}`}>
                  <button
                    className={s.faqQ}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                  >
                    <span className={s.faqNum}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={s.faqQText}>{faq.q}</span>
                    <svg className={s.faqChevron} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="M4 6l4 4 4-4" />
                    </svg>
                  </button>
                  {openFaq === i && (
                    <p className={s.faqA}>{faq.a}</p>
                  )}
                </div>
              ))}
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
                Chaque guide est une porte. &Agrave; vous de choisir laquelle ouvrir.
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
