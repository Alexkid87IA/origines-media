// src/pages/AboutPage.tsx
// V3 — Rich editorial redesign

import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import SEO from "../components/SEO";
import { Link } from "react-router-dom";
import s from "./AboutPage.module.css";

/* ── Data ── */

const milestones = [
  {
    year: "2021",
    title: "L’idée",
    text: "Alexandre et Alexis se rencontrent autour d’une conviction : les récits de vie méritent un espace à la hauteur de ce qu’ils racontent.",
  },
  {
    year: "2022",
    title: "Les premiers contenus",
    text: "Lancement de la chaîne YouTube, premiers reportages, premiers témoignages : Origines trouve sa voix.",
  },
  {
    year: "2023",
    title: "La communauté",
    text: "500+ récits reçus, 10 programmes vidéo, une newsletter lue chaque dimanche par des milliers de lecteurs.",
  },
  {
    year: "2024",
    title: "La structure",
    text: "Une rédaction, des partenariats éditoriaux, cinq univers thématiques. Le média prend forme.",
  },
  {
    year: "2025",
    title: "Le nouveau site",
    text: "Une refonte complète pour offrir la meilleure expérience de lecture : vous y êtes.",
  },
];

const founders = [
  {
    name: "Alexandre Quilghini",
    role: "Co-fondateur & Direction éditoriale",
    bio: "Journaliste de formation, Alexandre dirige la ligne éditoriale d’Origines. Il croit que les récits authentiques ont le pouvoir de transformer les vies — et les perspectives.",
    color: "#8B5CF6",
  },
  {
    name: "Alexis Chavetnoir",
    role: "Co-fondateur & Direction social media",
    bio: "Spécialiste des audiences et du storytelling numérique, Alexis construit les ponts entre les histoires d’Origines et les communautés qui les portent.",
    color: "#EC4899",
  },
  {
    name: "Newin Bokhari",
    role: "Co-fondatrice",
    bio: "Newin accompagne Origines depuis ses débuts. Son regard et son exigence contribuent à façonner l’identité du média.",
    color: "#10B981",
  },
];

const team = [
  {
    name: "Jérôme Cristaldi",
    role: "Associé",
    color: "#F59E0B",
  },
  {
    name: "Djamel Aïtoo",
    role: "Directeur de la production",
    color: "#6D28D9",
  },
  {
    name: "Frédéric Fouragnan",
    role: "Chef réalisateur",
    color: "#C2410C",
  },
  {
    name: "Benoît",
    role: "Chef lumière",
    color: "#2E94B5",
  },
  {
    name: "Fabian",
    role: "Chef opérateur",
    color: "#059669",
  },
  {
    name: "Nina",
    role: "Chef de projet",
    color: "#D64C90",
  },
  {
    name: "Inès",
    role: "Directrice de casting",
    color: "#E67839",
  },
  {
    name: "Vincent Dubois",
    role: "Journaliste",
    color: "#10B981",
  },
  {
    name: "Stéphanie Di Motta",
    role: "Journaliste",
    color: "#7B5CD6",
  },
  {
    name: "Welid Sebaï",
    role: "Journaliste",
    color: "#2E9B74",
  },
  {
    name: "Jugurtha Ameur",
    role: "Journaliste",
    color: "#5A66D6",
  },
  {
    name: "Anaïs Merad",
    role: "Journaliste",
    color: "#D64C90",
  },
];

const values = [
  {
    title: "Authenticité",
    text: "Des récits vrais, sans filtre, qui touchent au cœur de l’expérience humaine.",
    color: "#EC4899",
  },
  {
    title: "Profondeur",
    text: "Nous creusons au-delà de la surface pour révéler la complexité de chaque histoire.",
    color: "#8B5CF6",
  },
  {
    title: "Diversité",
    text: "Toutes les voix comptent. Toutes les perspectives enrichissent.",
    color: "#10B981",
  },
  {
    title: "Indépendance",
    text: "Aucun contenu sponsorisé déguisé. La ligne éditoriale n’est pas à vendre.",
    color: "#F59E0B",
  },
];

const stats = [
  { value: "2021", label: "Création" },
  { value: "500+", label: "Récits publiés" },
  { value: "50K+", label: "Lecteurs mensuels" },
  { value: "10", label: "Programmes vidéo" },
  { value: "5", label: "Univers thématiques" },
  { value: "106", label: "Vidéos produites" },
];

function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("");
}

/* ── Component ── */

export default function AboutPage() {
  return (
    <div className={s.page}>
      <SEO
        title="À propos"
        description="Origines Media produit des contenus d’utilité publique depuis 2021. Découvrez notre mission, nos fondateurs, notre équipe et les valeurs qui guident chaque récit."
        url="/a-propos"
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: "À propos", url: "/a-propos" },
        ]}
      />
      <SiteHeader />

      <main>
        {/* ── Hero header ── */}
        <header className={s.hero}>
          <div className={s.inner}>
            <span className={s.heroKicker}>
              <span className={s.heroKickerDot} />
              À propos
            </span>
            <h1 className={s.heroTitle}>
              Des contenus d&rsquo;utilit&eacute; publique,<br />
              <em>depuis 2021.</em>
            </h1>
            <p className={s.heroDeck}>
              Origines Media est un m&eacute;dia ind&eacute;pendant qui produit des r&eacute;cits
              authentiques &mdash; articles, t&eacute;moignages, reportages, documentaires
              &mdash; pour &eacute;clairer, inspirer et faire avancer.
            </p>
          </div>
        </header>

        {/* ── Stats bar ── */}
        <section className={s.statsBar}>
          <div className={s.inner}>
            <div className={s.statsRow}>
              {stats.map((st) => (
                <div key={st.label} className={s.stat}>
                  <span className={s.statVal}>{st.value}</span>
                  <span className={s.statLbl}>{st.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Mission ── */}
        <section className={s.mission}>
          <div className={s.inner}>
            <div className={s.missionGrid}>
              <div className={s.missionLeft}>
                <span className={s.kicker}>
                  <span className={s.kickerDot} />
                  Mission
                </span>
                <h2 className={s.missionTitle}>
                  Pourquoi Origines existe
                </h2>
              </div>
              <div className={s.missionRight}>
                <p className={s.missionLede}>
                  Dans un monde satur&eacute; d&rsquo;informations superficielles, nous
                  avons cr&eacute;&eacute; un espace d&eacute;di&eacute; aux histoires qui comptent
                  vraiment &mdash; celles qui transforment, pas celles qui
                  divertissent.
                </p>
                <p className={s.missionBody}>
                  Chaque article, chaque t&eacute;moignage, chaque vid&eacute;o est pens&eacute;
                  pour donner la parole &agrave; ceux qu&rsquo;on n&rsquo;entend pas
                  assez &mdash; et pour offrir aux lecteurs des cl&eacute;s de
                  compr&eacute;hension sur les sujets qui fa&ccedil;onnent nos vies.
                </p>
                <p className={s.missionBody}>
                  Nous ne produisons pas du contenu. Nous produisons de
                  l&rsquo;utilit&eacute; publique.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Timeline ── */}
        <section className={s.timeline}>
          <div className={s.inner}>
            <span className={s.kicker}>
              <span className={s.kickerDot} />
              Notre parcours
            </span>
            <h2 className={s.sectionTitle}>
              Cinq ans de r&eacute;cits
            </h2>
            <div className={s.timelineGrid}>
              {milestones.map((m) => (
                <div key={m.year} className={s.milestone}>
                  <div className={s.milestoneYear}>{m.year}</div>
                  <div className={s.milestoneLine} />
                  <h3 className={s.milestoneTitle}>{m.title}</h3>
                  <p className={s.milestoneText}>{m.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Founders ── */}
        <section className={s.foundersSection} id="equipe">
          <div className={s.inner}>
            <span className={s.kicker}>
              <span className={s.kickerDot} />
              Fondateurs
            </span>
            <h2 className={s.sectionTitle}>
              Ceux qui ont lanc&eacute; l&rsquo;aventure
            </h2>
            <div className={s.foundersGrid}>
              {founders.map((f) => (
                <div
                  key={f.name}
                  className={s.founderCard}
                  style={{ "--f-color": f.color } as React.CSSProperties}
                >
                  <div className={s.founderAccent} />
                  <div className={s.founderAvatar}>
                    {initials(f.name)}
                  </div>
                  <h3 className={s.founderName}>{f.name}</h3>
                  <span className={s.founderRole}>{f.role}</span>
                  <p className={s.founderBio}>{f.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Team ── */}
        <section className={s.teamSection}>
          <div className={s.inner}>
            <span className={s.kicker}>
              <span className={s.kickerDot} />
              L&rsquo;&eacute;quipe
            </span>
            <h2 className={s.sectionTitle}>
              Les personnes qui donnent vie &agrave; Origines
            </h2>
            <div className={s.teamGrid}>
              {team.map((t) => (
                <div
                  key={t.name}
                  className={s.teamCard}
                  style={{ "--t-color": t.color } as React.CSSProperties}
                >
                  <div className={s.teamAccent} />
                  <div className={s.teamAvatar} style={{ background: t.color }}>
                    {initials(t.name)}
                  </div>
                  <div className={s.teamInfo}>
                    <h3 className={s.teamName}>{t.name}</h3>
                    <p className={s.teamRole}>{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className={s.teamNote}>
              Et une communaut&eacute; de contributeurs, r&eacute;dacteurs invit&eacute;s et
              collaborateurs qui enrichissent Origines chaque semaine.
            </p>
          </div>
        </section>

        {/* ── Values ── */}
        <section className={s.valuesSection}>
          <div className={s.inner}>
            <span className={s.kicker}>
              <span className={s.kickerDot} />
              Nos valeurs
            </span>
            <h2 className={s.sectionTitle}>
              Ce qui guide chaque d&eacute;cision &eacute;ditoriale
            </h2>
            <div className={s.valuesGrid}>
              {values.map((v) => (
                <div key={v.title} className={s.valueCard}>
                  <div
                    className={s.valueAccent}
                    style={{ background: v.color }}
                  />
                  <h3 className={s.valueTitle}>{v.title}</h3>
                  <p className={s.valueText}>{v.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── New site banner ── */}
        <section className={s.newSite}>
          <div className={s.inner}>
            <div className={s.newSiteInner}>
              <span className={s.newSiteBadge}>Nouveau</span>
              <h2 className={s.newSiteTitle}>
                Un tout nouveau site, construit avec vous.
              </h2>
              <p className={s.newSiteText}>
                Ce site est tout neuf. Nous le construisons avec soin, pas
                &agrave; pas, pour vous offrir la meilleure exp&eacute;rience de lecture
                possible. Certaines sections sont encore en cours &mdash; et
                c&rsquo;est volontaire. Nous pr&eacute;f&eacute;rons avancer avec vous
                plut&ocirc;t que de tout lancer d&rsquo;un coup dans le vide.
              </p>
              <p className={s.newSiteText}>
                Vous avez une id&eacute;e, un retour, une envie&nbsp;?
                On est &agrave; l&rsquo;&eacute;coute.
              </p>
            </div>
          </div>
        </section>

        {/* ── Quote ── */}
        <section className={s.quote}>
          <div className={s.quoteInner}>
            <div className={s.quoteMark}>&ldquo;</div>
            <blockquote className={s.quoteText}>
              Les r&eacute;cits qui nous transforment ne sont pas ceux qui nous
              divertissent, mais ceux qui nous r&eacute;v&egrave;lent &agrave; nous-m&ecirc;mes.
            </blockquote>
            <div className={s.quoteAuthor}>
              Alexandre Quilghini &mdash; Co-fondateur, Origines Media
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className={s.cta}>
          <div className={s.inner}>
            <h2 className={s.ctaTitle}>Envie de collaborer&nbsp;?</h2>
            <p className={s.ctaDeck}>
              Vous avez un projet, une histoire &agrave; raconter ou une question &agrave;
              nous poser&nbsp;? On serait ravis d&rsquo;&eacute;changer avec vous.
            </p>
            <div className={s.ctaActions}>
              <Link to="/contact" className={s.ctaBtn}>
                <span>Nous contacter</span>
                <svg
                  className={s.ctaBtnArrow}
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="square"
                >
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </Link>
              <Link to="/partenariats" className={s.ctaBtnOutline}>
                Partenariats
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer2 />
      <ScrollToTopV2 />
    </div>
  );
}
