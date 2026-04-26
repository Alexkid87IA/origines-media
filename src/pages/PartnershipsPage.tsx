// src/pages/PartnershipsPage.tsx
// V2 — angular design system, CSS modules, no lucide-react

import React from "react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import SEO from "../components/SEO";
import s from "./PartnershipsPage.module.css";

/* ------------------------------------------------------------------ */
/*  Inline SVG icons                                                   */
/* ------------------------------------------------------------------ */

const IconDownload = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const IconArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

const IconTarget = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const IconTrendingUp = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const IconMessageCircle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

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

const IconPlay = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const IconVideo = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <rect x="2" y="5" width="14" height="14" rx="0" />
    <polygon points="23 7 16 12 23 17 23 7" />
  </svg>
);

const IconFileText = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const IconMegaphone = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path d="M3 11l18-5v12L3 13v-2z" />
    <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
  </svg>
);

const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <rect x="2" y="4" width="20" height="16" rx="0" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

/* — Social platform icons — */

const FacebookIcon = ({ style }: { style?: React.CSSProperties }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={style}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = ({ style }: { style?: React.CSSProperties }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={style}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const TikTokIcon = ({ style }: { style?: React.CSSProperties }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={style}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);

const YouTubeIcon = ({ style }: { style?: React.CSSProperties }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={style}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const SnapchatIcon = ({ style }: { style?: React.CSSProperties }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={style}>
    <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301a.794.794 0 01.304-.065c.24 0 .47.09.644.255.183.166.305.421.305.69 0 .3-.15.554-.404.765-.165.135-.435.27-.82.39-.27.09-.495.15-.645.195-.245.075-.39.135-.42.195-.03.06-.03.15 0 .27.045.18.21.57.615 1.215.735 1.17 1.665 2.115 2.175 2.475.375.24.39.375.39.39 0 .12-.06.225-.195.315-.315.21-.86.37-1.62.48-.135.015-.24.045-.3.075-.06.03-.135.09-.195.195-.06.12-.135.27-.21.405-.09.165-.195.345-.33.495-.18.21-.42.33-.69.33-.135 0-.285-.03-.45-.075-.315-.09-.645-.21-1.08-.36-.18-.06-.375-.105-.57-.105-.105 0-.225.015-.345.045-.21.06-.42.165-.66.345-.6.45-1.26.675-1.92.675-.66 0-1.32-.225-1.92-.675-.24-.18-.45-.285-.66-.345-.12-.03-.24-.045-.345-.045-.195 0-.39.045-.57.105-.435.15-.765.27-1.08.36-.165.045-.315.075-.45.075-.27 0-.51-.12-.69-.33-.135-.15-.24-.33-.33-.495-.075-.135-.15-.285-.21-.405-.06-.105-.135-.165-.195-.195-.06-.03-.165-.06-.3-.075-.76-.11-1.305-.27-1.62-.48-.135-.09-.195-.195-.195-.315 0-.015.015-.15.39-.39.51-.36 1.44-1.305 2.175-2.475.405-.645.57-1.035.615-1.215.03-.12.03-.21 0-.27-.03-.06-.18-.12-.42-.195-.15-.045-.375-.105-.645-.195-.385-.12-.66-.255-.82-.39-.254-.211-.404-.465-.404-.765 0-.27.12-.525.305-.69.174-.165.405-.255.644-.255.105 0 .21.015.305.065.374.18.734.285 1.033.301.18 0 .315-.045.4-.09-.007-.165-.017-.33-.029-.51l-.004-.06c-.104-1.628-.23-3.654.299-4.847C7.86 1.069 11.216.793 12.206.793z" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const PartnershipsPage: React.FC = () => {
  /* ── Data ── */

  const socialStats = [
    { platform: "Facebook", followers: "2,12M", Icon: FacebookIcon, color: "#1877F2" },
    { platform: "Snapchat", followers: "800K", Icon: SnapchatIcon, color: "#FFFC00" },
    { platform: "Instagram", followers: "261K", Icon: InstagramIcon, color: "#E4405F" },
    { platform: "TikTok", followers: "130K", Icon: TikTokIcon, color: "#000000" },
    { platform: "YouTube", followers: "100K", Icon: YouTubeIcon, color: "#FF0000" },
  ];

  const partnershipFormats = [
    { title: "1 Reel", description: "Instagram", Icon: IconPlay, color: "#EC4899" },
    { title: "1 Serie", description: "Episodes dedies", Icon: IconVideo, color: "#8B5CF6" },
    { title: "1 Video YouTube", description: "Long format", Icon: YouTubeIcon, color: "#EF4444" },
    { title: "1 Documentaire", description: "Sur-mesure", Icon: IconFileText, color: "#F59E0B" },
    { title: "Multi-plateformes", description: "Tous reseaux", Icon: IconMegaphone, color: "#6366F1" },
  ];

  const caseStudies = [
    {
      title: "Paola Locatelli & Julia",
      subtitle: "Transmission",
      description:
        "Rencontre emouvante entre Paola et Julia Wallach, rescapee d'Auschwitz.",
      vues: "20M",
      impressions: "46M",
      color: "#8B5CF6",
    },
    {
      title: "Louane",
      subtitle: "La Lettre",
      description:
        "Face camera, Louane ecrit une lettre a la jeune fille qu'elle etait.",
      vues: "10M",
      impressions: "950K",
      color: "#EC4899",
    },
    {
      title: "Naestro",
      subtitle: "Urban Opera",
      description:
        "Dispositif 100% organique pour le lancement du clip de Naestro.",
      vues: "15M+",
      impressions: "3min12",
      color: "#F59E0B",
    },
  ];

  const ageData = [
    { age: "13-24", percent: 24, color: "#8B5CF6" },
    { age: "25-34", percent: 40, color: "#EC4899" },
    { age: "34-44", percent: 24, color: "#F59E0B" },
    { age: "45+", percent: 12, color: "#6366F1" },
  ];

  const heroStats = [
    { value: "3M+", label: "Abonnes" },
    { value: "43M", label: "Reach/mois" },
    { value: "3:42", label: "Temps moyen" },
    { value: "9M", label: "Interactions" },
  ];

  const offerCards = [
    {
      title: "Nos Medias",
      description: "Notre expertise sociale au service de nos medias",
      bg: "linear-gradient(135deg, #7B5CD6, #6344B8)",
    },
    {
      title: "Nos Productions",
      description: "Faire matcher l'ADN de nos medias avec vos enjeux",
      bg: "linear-gradient(135deg, #D64C90, #C03A7C)",
    },
    {
      title: "Nos Createurs",
      description: "Accompagner les generateurs d'engagement",
      bg: "linear-gradient(135deg, #F59E0B, #D97706)",
    },
  ];

  /* ── Render ── */

  return (
    <div className={s.page}>
      <SEO
        title="Partenariats - Annonceurs"
        description="Associez votre marque a des histoires incroyables. Origines Media : 5 milliards de vues, 3 millions d'abonnes."
        url="/partenariats"
        breadcrumbs={[
          { name: 'Accueil', url: '/' },
          { name: 'Partenariats', url: '/partenariats' },
        ]}
      />

      <SiteHeader />

      <main>
        {/* ── Hero / Header ── */}
        <section className={s.header}>
          <div className={s.headerInner}>
            <div className={s.headerLabel}>
              <p className={s.kicker}>
                <span className={s.kickerDot} />
                Partenariats
              </p>
              <h1 className={s.title}>Partenariats</h1>
              <p className={s.subtitle}>
                Associez votre marque a des histoires incroyables
              </p>
            </div>

            <a
              href="/kit-media-origines.pdf"
              download="Kit-Media-Origines-2024.pdf"
              className={s.downloadBadge}
            >
              <IconDownload />
              Telecharger le kit media
            </a>
          </div>
        </section>

        {/* ── Stats principales ── */}
        <section className={s.statsSection}>
          <div className={s.inner}>
            <div className={s.statsGrid}>
              {/* Hero stat card */}
              <div className={s.statHeroCard}>
                <p className={s.statHeroBig}>
                  5B<span className={s.statHeroBigSuffix}>+</span>
                </p>
                <p className={s.statHeroLabel}>
                  Vues sur nos reseaux depuis 2022
                </p>

                <div className={s.miniStatGrid}>
                  {heroStats.map((stat) => (
                    <div key={stat.label} className={s.miniStat}>
                      <p className={s.miniStatValue}>{stat.value}</p>
                      <p className={s.miniStatLabel}>{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description + social badges */}
              <div className={s.descriptionCard}>
                <p className={s.descriptionText}>
                  <strong>Origines</strong> est un media 100% video dedie aux
                  recits authentiques. Nous touchons une audience jeune,
                  diversifiee, en quete de contenus qui resonnent.
                  <strong> Chaque histoire compte.</strong>
                </p>

                <div className={s.socialRow}>
                  {socialStats.map((social) => (
                    <div key={social.platform} className={s.socialBadge}>
                      <social.Icon
                        style={{
                          color:
                            social.color === "#FFFC00"
                              ? "#FFCC00"
                              : social.color,
                        }}
                      />
                      <span className={s.socialBadgeCount}>
                        {social.followers}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Audience ── */}
        <section className={s.audienceSection}>
          <div className={s.inner}>
            <p className={s.sectionLabel}>
              <span className={s.sectionLabelDot} />
              Audience
            </p>

            <div className={s.audienceGrid}>
              {/* Age distribution */}
              <div className={s.audienceCard}>
                <h3 className={s.audienceCardTitle}>Repartition par age</h3>
                {ageData.map((item) => (
                  <div key={item.age} className={s.ageRow}>
                    <span className={s.ageLabel}>{item.age}</span>
                    <div className={s.ageBarTrack}>
                      <div
                        className={s.ageBarFill}
                        style={{
                          width: `${item.percent * 2}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                    <span className={s.agePercent}>{item.percent}%</span>
                  </div>
                ))}
              </div>

              {/* Gender */}
              <div className={s.genderCard}>
                <h3 className={s.audienceCardTitle}>Genre</h3>
                <div className={s.genderRow}>
                  <div className={s.genderBlock}>
                    <div className={s.genderValue} style={{ color: "#EC4899" }}>
                      56%
                    </div>
                    <div className={s.genderLabel}>Femmes</div>
                  </div>
                  <div className={s.genderDivider} />
                  <div className={s.genderBlock}>
                    <div className={s.genderValue} style={{ color: "#8B5CF6" }}>
                      44%
                    </div>
                    <div className={s.genderLabel}>Hommes</div>
                  </div>
                </div>
              </div>

              {/* Engagement */}
              <div className={s.engagementCard}>
                <h3 className={s.audienceCardTitle}>Engagement</h3>
                <div className={s.engagementRow}>
                  <span className={s.engagementLabel}>
                    <IconClock /> Temps
                  </span>
                  <span className={s.engagementValue}>3:42</span>
                </div>
                <div className={s.engagementRow}>
                  <span className={s.engagementLabel}>
                    <IconMessageCircle /> Interactions
                  </span>
                  <span className={s.engagementValue}>9M/mois</span>
                </div>
                <div className={s.engagementRow}>
                  <span className={s.engagementLabel}>
                    <IconTarget /> Taux
                  </span>
                  <span className={s.engagementValue}>+5%</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Formats de partenariat ── */}
        <section className={s.formatsSection}>
          <div className={s.inner}>
            <p className={s.sectionLabel}>
              <span className={s.sectionLabelDot} />
              Formats
            </p>
            <h2 className={s.sectionTitle}>
              Des formats adaptes a vos objectifs
            </h2>

            <div className={s.formatsGrid}>
              {partnershipFormats.map((format) => (
                <div key={format.title} className={s.formatCard}>
                  <div
                    className={s.formatIconWrap}
                    style={{ backgroundColor: `${format.color}15` }}
                  >
                    <format.Icon style={{ color: format.color }} />
                  </div>
                  <h3 className={s.formatTitle}>{format.title}</h3>
                  <p className={s.formatDesc}>{format.description}</p>
                </div>
              ))}
            </div>

            {/* Values pills */}
            <div className={s.valuesRow}>
              {[
                { text: "Histoires 100% authentiques", Icon: IconCheck, color: "#8B5CF6" },
                { text: "Communaute bienveillante", Icon: IconHeart, color: "#EC4899" },
                { text: "Diversite des parcours", Icon: IconUsers, color: "#F59E0B" },
              ].map((value) => (
                <div key={value.text} className={s.valuePill}>
                  <value.Icon />
                  <span
                    className={s.valuePillText}
                    style={{ color: value.color }}
                  >
                    {value.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Case Studies ── */}
        <section className={s.caseStudiesSection}>
          <div className={s.inner}>
            <div className={s.caseStudiesHeader}>
              <p className={s.sectionLabel}>
                <span
                  className={s.sectionLabelDot}
                  style={{ background: "#F59E0B" }}
                />
                Etudes de cas
              </p>
              <h2 className={s.caseSectionTitle}>
                Des histoires qui marquent
              </h2>
              <p className={s.caseSectionDeck}>
                Nos collaborations les plus impactantes
              </p>
            </div>

            <div className={s.caseGrid}>
              {caseStudies.map((study) => (
                <div key={study.title} className={s.caseCard}>
                  <div
                    className={s.caseAccent}
                    style={{ backgroundColor: study.color }}
                  />
                  <div className={s.caseBody}>
                    <span
                      className={s.caseTag}
                      style={{
                        backgroundColor: `${study.color}15`,
                        color: study.color,
                      }}
                    >
                      {study.subtitle}
                    </span>
                    <h3 className={s.caseTitle}>{study.title}</h3>
                    <p className={s.caseDesc}>{study.description}</p>
                    <div className={s.caseStats}>
                      <div className={s.caseStat}>
                        <span
                          className={s.caseStatValue}
                          style={{ color: study.color }}
                        >
                          {study.vues}
                        </span>
                        <span className={s.caseStatLabel}>Vues</span>
                      </div>
                      <div className={s.caseStat}>
                        <span
                          className={s.caseStatValue}
                          style={{ color: study.color }}
                        >
                          {study.impressions}
                        </span>
                        <span className={s.caseStatLabel}>
                          {study.title === "Naestro"
                            ? "Temps moyen"
                            : "Impressions"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Ce qu'on apporte ── */}
        <section className={s.offerSection}>
          <div className={s.inner}>
            <p className={s.sectionLabel}>
              <span className={s.sectionLabelDot} />
              Notre offre
            </p>

            <div className={s.offerGrid}>
              {offerCards.map((item) => (
                <div
                  key={item.title}
                  className={s.offerCard}
                  style={{ background: item.bg }}
                >
                  <h3 className={s.offerTitle}>{item.title}</h3>
                  <p className={s.offerDesc}>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Final ── */}
        <section className={s.ctaSection}>
          <div className={s.ctaInner}>
            <h2 className={s.ctaTitle}>
              Etes-vous pret a ecrire l'histoire ?
            </h2>
            <p className={s.ctaDeck}>
              Rejoignez-nous pour creer ensemble des contenus authentiques qui
              touchent des millions de personnes.
            </p>

            <div className={s.ctaButtons}>
              <a
                href="/kit-media-origines.pdf"
                download="Kit-Media-Origines-2024.pdf"
                className={s.ctaPrimary}
              >
                <IconDownload />
                Telecharger le kit media
              </a>

              <Link to="/contact" className={s.ctaSecondary}>
                Nous contacter
                <IconArrowRight />
              </Link>
            </div>

            <div className={s.ctaMeta}>
              <span className={s.ctaMetaItem}>
                <IconTrendingUp />
                Reponse sous 48h
              </span>
              <span className={s.ctaMetaDot} />
              <span className={s.ctaMetaItem}>
                <IconTarget />
                Solutions sur-mesure
              </span>
            </div>
          </div>
        </section>

        {/* ── Contact strip ── */}
        <section className={s.contactStrip}>
          <div className={s.contactInner}>
            <p className={s.contactText}>
              Devenez ambassadeur, proposez des projets ou inscrivez-vous a
              notre newsletter.
            </p>
            <div className={s.contactRight}>
              <span className={s.contactLabel}>Contact :</span>
              <span className={s.contactName}>Alex, president</span>
              <a href="mailto:Alex@origines.media" className={s.contactLink}>
                <IconMail />
                Alex@origines.media
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer2 />
      <ScrollToTopV2 />
    </div>
  );
};

export default PartnershipsPage;
