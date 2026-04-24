// src/pages/AboutPage.tsx
// V2 — Angular editorial design

import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import SEO from "../components/SEO";
import { Link } from "react-router-dom";
import s from "./AboutPage.module.css";

/* ── Data ── */

const teamMembers = [
  {
    id: 1,
    name: "Alexandre Quilghini",
    role: "Co-fondateur & Direction editoriale",
    color: "#8B5CF6",
  },
  {
    id: 2,
    name: "Alexis Chavetnoir",
    role: "Co-fondateur & Direction social media",
    color: "#EC4899",
  },
  {
    id: 3,
    name: "Tabatha Vannieu",
    role: "Directrice des operations",
    color: "#F59E0B",
  },
  {
    id: 4,
    name: "Vincent Dubois",
    role: "Journaliste",
    color: "#10B981",
  },
];

const values = [
  {
    title: "Authenticite",
    description:
      "Nous privilegions les recits vrais, sans filtre, qui touchent au coeur de l’experience humaine.",
    color: "#EC4899",
  },
  {
    title: "Profondeur",
    description:
      "Nous creusons au-dela de la surface pour reveler les nuances et la complexite de chaque histoire.",
    color: "#8B5CF6",
  },
  {
    title: "Diversite",
    description:
      "Nous celebrons la richesse des perspectives et des experiences de toutes les communautes.",
    color: "#10B981",
  },
  {
    title: "Inspiration",
    description:
      "Nous croyons au pouvoir transformateur des recits pour eclairer et guider nos vies.",
    color: "#F59E0B",
  },
];

const stats = [
  { value: "2021", label: "Creation", color: "#8B5CF6" },
  { value: "500+", label: "Recits", color: "#D946EF" },
  { value: "50K+", label: "Lecteurs", color: "#10B981" },
  { value: "10", label: "Univers", color: "#F59E0B" },
];

/* ── Helpers ── */

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
        title="A propos - Qui sommes-nous"
        description="Origines Media produit des contenus d'utilite publique. Decouvrez notre equipe, notre mission et nos valeurs. Des recits authentiques qui inspirent et transforment."
        url="/a-propos"
      />
      <SiteHeader />

      <main>
        {/* ── Page header ── */}
        <header className={s.header}>
          <div className={s.inner}>
            <span className={s.headerKicker}>
              <span className={s.headerKickerDot} />
              A propos
            </span>
            <h1 className={s.headerTitle}>Qui sommes-nous</h1>
            <p className={s.headerDeck}>
              Notre histoire, notre mission et les valeurs qui guident chaque
              recit que nous publions.
            </p>
          </div>
        </header>

        {/* ── Mission ── */}
        <section className={s.mission}>
          <div className={s.inner}>
            <div className={s.missionLabel}>Mission</div>
            <h2 className={s.missionTitle}>
              Des contenus d&rsquo;utilite publique
            </h2>
            <div className={s.missionBody}>
              <p>
                <strong>Origines Media</strong> produit des contenus d&rsquo;utilite
                publique : des recits authentiques qui ont le pouvoir de
                transformer nos vies et nos perspectives.
              </p>
              <p>
                Dans un monde sature d&rsquo;informations superficielles, nous
                creons un espace dedie aux histoires qui comptent vraiment
                &mdash; celles qui inspirent, eclairent et font avancer.
              </p>
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className={s.stats}>
          <div className={s.inner}>
            <div className={s.statsGrid}>
              {stats.map((stat) => (
                <div key={stat.label} className={s.statCard}>
                  <div className={s.statValue} style={{ color: stat.color }}>
                    {stat.value}
                  </div>
                  <div className={s.statLabel}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Values ── */}
        <section className={s.values}>
          <div className={s.inner}>
            <span className={s.sectionKicker}>
              <span className={s.sectionKickerDot} />
              Nos valeurs
            </span>
            <h2 className={s.sectionTitle}>
              Les principes qui guident notre travail editorial
            </h2>
            <div className={s.valuesGrid}>
              {values.map((v) => (
                <div key={v.title} className={s.valueCard}>
                  <div
                    className={s.valueAccent}
                    style={{ background: v.color }}
                  />
                  <h3 className={s.valueTitle}>{v.title}</h3>
                  <p className={s.valueDesc}>{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Team ── */}
        <section className={s.team}>
          <div className={s.inner}>
            <span className={s.sectionKicker}>
              <span className={s.sectionKickerDot} />
              L&rsquo;equipe
            </span>
            <h2 className={s.sectionTitle}>
              Les personnes qui donnent vie a Origines Media
            </h2>
            <div className={s.teamGrid}>
              {teamMembers.map((member) => (
                <div key={member.id} className={s.teamCard}>
                  <div
                    className={s.teamAccent}
                    style={{ background: member.color }}
                  />
                  <div
                    className={s.teamAvatar}
                    style={{ background: member.color }}
                  >
                    {initials(member.name)}
                  </div>
                  <div className={s.teamInfo}>
                    <h3 className={s.teamName}>{member.name}</h3>
                    <p className={s.teamRole}>{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Quote ── */}
        <section className={s.quote}>
          <div className={s.quoteInner}>
            <div className={s.quoteMark}>&ldquo;</div>
            <blockquote className={s.quoteText}>
              Les recits qui nous transforment ne sont pas ceux qui nous
              divertissent, mais ceux qui nous revelent a nous-memes.
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
              Vous avez un projet, une histoire a raconter ou une question a
              nous poser&nbsp;? On serait ravis d&rsquo;echanger avec vous.
            </p>
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
          </div>
        </section>
      </main>

      <Footer2 />
      <ScrollToTopV2 />
    </div>
  );
}
