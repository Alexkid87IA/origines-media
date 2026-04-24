// src/pages/JoinPage.tsx
// V2 — Angular editorial design, CSS modules, no lucide-react

import { useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import SEO from "../components/SEO";
import s from "./JoinPage.module.css";

/* ------------------------------------------------------------------ */
/*  Inline SVG icons                                                   */
/* ------------------------------------------------------------------ */

const IconHeart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const IconUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconPalette = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <circle cx="13.5" cy="6.5" r="2.5" />
    <circle cx="19" cy="11.5" r="2.5" />
    <circle cx="6" cy="12.5" r="2.5" />
    <circle cx="17" cy="18.5" r="2.5" />
    <path d="M12 2a10 10 0 0 0 0 20c1 0 2-.5 2-2 0-.5-.2-1-.5-1.5-.3-.4-.5-.9-.5-1.5 0-1.1.9-2 2-2h2.3c3 0 5.7-2.5 5.7-5.5C23 5.8 18 2 12 2z" />
  </svg>
);

const IconBook = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const IconPen = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z" />
  </svg>
);

const IconVideo = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <rect x="2" y="4" width="15" height="16" rx="0" />
    <path d="m17 8 5-3v14l-5-3z" />
  </svg>
);

const IconMegaphone = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const IconCode = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const IconBriefcase = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <rect x="2" y="7" width="20" height="14" rx="0" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const IconMapPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconSend = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path d="m22 2-7 20-4-9-9-4z" />
    <path d="m22 2-11 11" />
  </svg>
);

const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <rect x="2" y="4" width="20" height="16" rx="0" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const IconArrowRight = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);

const IconLink = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const IconClipboard = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <rect x="8" y="2" width="8" height="4" rx="0" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface JobOpening {
  id: string;
  title: string;
  type: string;
  location: string;
  description: string;
  Icon: React.FC;
  color: string;
}

const jobOpenings: JobOpening[] = [
  {
    id: "journaliste",
    title: "Journaliste / Redacteur",
    type: "CDI",
    location: "Paris",
    description:
      "Vous redigez des recits authentiques et menez des interviews inspirantes.",
    Icon: IconPen,
    color: "#8B5CF6",
  },
  {
    id: "realisateur",
    title: "Realisateur / Videaste",
    type: "CDI",
    location: "Paris",
    description:
      "Vous donnez vie a nos histoires a travers des productions video de qualite.",
    Icon: IconVideo,
    color: "#EC4899",
  },
  {
    id: "community",
    title: "Community Manager",
    type: "CDI",
    location: "Paris / Remote",
    description:
      "Vous animez notre communaute et developpez notre presence sur les reseaux.",
    Icon: IconMegaphone,
    color: "#F59E0B",
  },
  {
    id: "dev",
    title: "Developpeur Full Stack",
    type: "CDI",
    location: "Remote",
    description:
      "Vous construisez les outils qui permettent a nos recits de toucher des millions de personnes.",
    Icon: IconCode,
    color: "#10B981",
  },
];

const teamValues = [
  { title: "Passion", description: "L'amour des belles histoires", Icon: IconHeart },
  { title: "Collaboration", description: "On construit ensemble", Icon: IconUsers },
  { title: "Creativite", description: "L'innovation au quotidien", Icon: IconPalette },
  { title: "Authenticite", description: "La verite avant tout", Icon: IconBook },
];

const teamStats = [
  { value: "15+", label: "Membres", color: "#8B5CF6" },
  { value: "5B", label: "Vues generees", color: "#EC4899" },
  { value: "100%", label: "Remote-friendly", color: "#10B981" },
];

const whyReasons = [
  { text: "Impact reel sur des millions de vies", Icon: IconHeart, color: "#EC4899" },
  { text: "Equipe jeune et dynamique", Icon: IconUsers, color: "#8B5CF6" },
  { text: "Flexibilite remote / hybride", Icon: IconMapPin, color: "#10B981" },
  { text: "Projets creatifs varies", Icon: IconPalette, color: "#F59E0B" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function JoinPage() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    linkedin: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className={s.page}>
      <SEO
        title="Rejoindre l'equipe - Carrieres"
        description="Rejoignez l'equipe Origines Media. Decouvrez nos offres d'emploi et participez a la creation de contenus qui inspirent des millions de personnes."
        url="/rejoindre"
      />
      <SiteHeader />

      <main>
        {/* ── Page header ── */}
        <header className={s.header}>
          <div className={s.headerInner}>
            <div className={s.headerLabel}>
              <span className={s.kicker}>
                <span className={s.kickerDot} />
                Carrieres
              </span>
              <h1 className={s.headerTitle}>
                Rejoindre l&rsquo;<em>equipe</em>
              </h1>
              <p className={s.headerDeck}>
                Creez l&rsquo;impact avec nous. Rejoignez une equipe passionnee
                qui produit des contenus vus par des millions de personnes.
              </p>
            </div>

            <div className={s.statsRow}>
              {teamStats.map((stat) => (
                <div key={stat.label} className={s.statPill}>
                  <span
                    className={s.statPillValue}
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </span>
                  <span className={s.statPillLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* ── Intro section ── */}
        <section className={s.intro}>
          <div className={s.inner}>
            <div className={s.introGrid}>
              {/* Main dark panel */}
              <div className={s.introMain}>
                <h2 className={s.introTitle}>
                  Construisez l&rsquo;avenir du media avec nous
                </h2>
                <p className={s.introBody}>
                  Chez <strong>Origines</strong>, nous croyons au pouvoir des
                  histoires pour transformer les vies. Rejoignez une equipe
                  passionnee qui produit des contenus vus par des millions de
                  personnes.
                </p>

                <div className={s.valuesGrid}>
                  {teamValues.map((v) => (
                    <div key={v.title} className={s.valueCard}>
                      <div className={s.valueIcon}>
                        <v.Icon />
                      </div>
                      <div>
                        <div className={s.valueTitle}>{v.title}</div>
                        <div className={s.valueDesc}>{v.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right side */}
              <div className={s.introSide}>
                <div className={s.whyCard}>
                  <h3 className={s.whyTitle}>Pourquoi nous rejoindre</h3>
                  <ul className={s.whyList}>
                    {whyReasons.map((item) => (
                      <li key={item.text} className={s.whyItem}>
                        <div
                          className={s.whyItemIcon}
                          style={{ background: `${item.color}12` }}
                        >
                          <span style={{ color: item.color }}>
                            <item.Icon />
                          </span>
                        </div>
                        <span className={s.whyItemText}>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={s.noticeCard}>
                  <p className={s.noticeText}>
                    <strong>Candidatures spontanees :</strong> Meme si aucune
                    offre ne correspond a votre profil, n&rsquo;hesitez pas a
                    nous ecrire !
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Job openings ── */}
        <section className={s.jobs}>
          <div className={s.inner}>
            <span className={s.sectionKicker}>
              <span className={s.sectionKickerDot} />
              Offres actuelles
            </span>
            <h2 className={s.sectionTitle}>Postes ouverts</h2>

            <div className={s.jobsGrid}>
              {jobOpenings.map((job) => {
                const isSelected = selectedJob === job.id;

                return (
                  <div
                    key={job.id}
                    className={`${s.jobCard} ${isSelected ? s.jobCardSelected : ""}`}
                    onClick={() =>
                      setSelectedJob(isSelected ? null : job.id)
                    }
                  >
                    <div
                      className={s.jobAccent}
                      style={{ background: job.color }}
                    />

                    <div className={s.jobTop}>
                      <div
                        className={s.jobIcon}
                        style={{ background: `${job.color}12` }}
                      >
                        <span style={{ color: job.color }}>
                          <job.Icon />
                        </span>
                      </div>

                      <div className={s.jobContent}>
                        <h3 className={s.jobTitle}>{job.title}</h3>

                        <div className={s.jobMeta}>
                          <span className={s.jobTag}>
                            <IconBriefcase />
                            {job.type}
                          </span>
                          <span className={s.jobTag}>
                            <IconMapPin />
                            {job.location}
                          </span>
                        </div>

                        <p className={s.jobDesc}>{job.description}</p>

                        {isSelected && (
                          <button
                            className={s.jobApplyBtn}
                            style={{ background: job.color }}
                            onClick={(e) => {
                              e.stopPropagation();
                              document
                                .getElementById("candidature-form")
                                ?.scrollIntoView({ behavior: "smooth" });
                            }}
                          >
                            Postuler
                            <IconArrowRight />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Application form ── */}
        <section id="candidature-form" className={s.formSection}>
          <div className={s.inner}>
            <span className={s.sectionKicker}>
              <span className={s.sectionKickerDot} />
              Candidature
            </span>

            {!isSubmitted ? (
              <div className={s.formCard}>
                <div className={s.formHeader}>
                  <div className={s.formIcon}>
                    <IconClipboard />
                  </div>
                  <h2 className={s.formTitle}>
                    {selectedJob
                      ? `Postuler pour : ${jobOpenings.find((j) => j.id === selectedJob)?.title}`
                      : "Envoyez votre candidature"}
                  </h2>
                </div>

                <p className={s.formDeck}>
                  {selectedJob
                    ? "Remplissez le formulaire ci-dessous"
                    : "Candidature spontanee ou pour un poste specifique"}
                </p>

                <form onSubmit={handleSubmit} className={s.form}>
                  {/* Name + Email row */}
                  <div className={s.fieldRow}>
                    <div className={s.fieldGroup}>
                      <label htmlFor="name" className={s.label}>
                        Nom complet <span className={s.required}>*</span>
                      </label>
                      <div className={s.inputWrap}>
                        <span className={s.inputIcon}>
                          <IconUser />
                        </span>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className={s.input}
                          placeholder="Jean Dupont"
                        />
                      </div>
                    </div>

                    <div className={s.fieldGroup}>
                      <label htmlFor="email" className={s.label}>
                        Email <span className={s.required}>*</span>
                      </label>
                      <div className={s.inputWrap}>
                        <span className={s.inputIcon}>
                          <IconMail />
                        </span>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className={s.input}
                          placeholder="votre@email.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* LinkedIn / Portfolio */}
                  <div className={s.fieldGroup}>
                    <label htmlFor="linkedin" className={s.label}>
                      LinkedIn / Portfolio (optionnel)
                    </label>
                    <div className={s.inputWrap}>
                      <span className={s.inputIcon}>
                        <IconLink />
                      </span>
                      <input
                        type="url"
                        id="linkedin"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleChange}
                        className={s.input}
                        placeholder="https://linkedin.com/in/..."
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className={s.fieldGroup}>
                    <label htmlFor="message" className={s.label}>
                      Presentez-vous <span className={s.required}>*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className={s.textarea}
                      placeholder="Parlez-nous de vous, votre parcours et pourquoi vous souhaitez rejoindre Origines..."
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      !formData.name ||
                      !formData.email ||
                      !formData.message
                    }
                    className={s.submitBtn}
                  >
                    {isSubmitting ? (
                      <>
                        <span className={s.spinner} />
                        Envoi...
                      </>
                    ) : (
                      <>
                        <IconSend />
                        Envoyer ma candidature
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              /* ── Success state ── */
              <div className={s.successCard}>
                <div className={s.successIcon}>
                  <IconCheck />
                </div>
                <h3 className={s.successTitle}>Candidature envoyee !</h3>
                <p className={s.successText}>
                  Merci {formData.name.split(" ")[0]} ! Nous etudions votre
                  profil et reviendrons vers vous tres vite.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      name: "",
                      email: "",
                      linkedin: "",
                      message: "",
                    });
                    setSelectedJob(null);
                  }}
                  className={s.resetBtn}
                >
                  Nouvelle candidature
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ── CTA Final ── */}
        <section className={s.ctaSection}>
          <div className={`${s.inner} ${s.ctaInner}`}>
            <h2 className={s.ctaTitle}>
              Une question sur nos offres&nbsp;?
            </h2>
            <p className={s.ctaDeck}>
              N&rsquo;hesitez pas a nous contacter pour en savoir plus sur la
              vie chez Origines.
            </p>

            <div className={s.ctaActions}>
              <a href="mailto:jobs@origines.media" className={s.ctaBtnPrimary}>
                <IconMail />
                jobs@origines.media
              </a>
              <Link to="/a-propos" className={s.ctaBtnSecondary}>
                En savoir plus sur nous
                <IconArrowRight />
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
