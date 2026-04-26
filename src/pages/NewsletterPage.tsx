// src/pages/NewsletterPage.tsx
// Newsletter page — V2 design system

import React from 'react';
import SiteHeader from '@/components/SiteHeader/SiteHeader';
import Footer2 from '@/components/Footer2/Footer2';
import ScrollToTopV2 from '@/components/ScrollToTop/ScrollToTopV2';
import SEO from '../components/SEO';
import EmailCapture from '../components/EmailCapture';
import s from './NewsletterPage.module.css';

/* ── Inline SVG icons ── */

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" strokeLinejoin="miter">
    <path d="M2 6l10 7 10-7" />
    <rect x="2" y="4" width="20" height="16" />
  </svg>
);

const BookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" strokeLinejoin="miter">
    <path d="M4 19V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14" />
    <path d="M4 19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2" />
    <path d="M4 19h16" />
    <path d="M9 7h6" />
  </svg>
);

const VideoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" strokeLinejoin="miter">
    <rect x="2" y="4" width="15" height="16" />
    <path d="M17 8l5-3v14l-5-3" />
  </svg>
);

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" strokeLinejoin="miter">
    <path d="M12 21C12 21 3 13.5 3 8a4.5 4.5 0 0 1 9-1 4.5 4.5 0 0 1 9 1c0 5.5-9 13-9 13z" />
  </svg>
);

const GiftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" strokeLinejoin="miter">
    <rect x="3" y="8" width="18" height="4" />
    <rect x="5" y="12" width="14" height="9" />
    <path d="M12 8v13" />
    <path d="M7.5 8C6 8 5 6.5 5 5.5S6 3 7.5 3c2.5 0 4.5 5 4.5 5" />
    <path d="M16.5 8C18 8 19 6.5 19 5.5S18 3 16.5 3C14 3 12 8 12 8" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
    <path d="M5 12l5 5L20 7" />
  </svg>
);

const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" strokeLinejoin="miter">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

/* ── Data ── */

const benefits = [
  {
    icon: BookIcon,
    title: 'Récits exclusifs',
    description: 'Accès en avant-première à nos histoires les plus inspirantes',
    color: '#7B5CD6',
    label: 'AVANT-PREMIÈRE',
  },
  {
    icon: VideoIcon,
    title: 'Coulisses vidéo',
    description: 'Les making-of et interviews bonus de nos productions',
    color: '#D64C90',
    label: 'MAKING-OF',
  },
  {
    icon: HeartIcon,
    title: 'Sélections personnalisées',
    description: 'Des recommandations basées sur vos univers préférés',
    color: '#E08A2B',
    label: 'CURATED',
  },
  {
    icon: GiftIcon,
    title: 'Contenus exclusifs',
    description: 'Des ressources et surprises réservées aux abonnés',
    color: '#10B981',
    label: 'EXCLUSIF',
  },
];

const stats = [
  { value: '1/sem', label: 'Fréquence', color: '#7B5CD6' },
  { value: 'Gratuit', label: 'Toujours', color: '#10B981' },
];

const testimonials = [
  {
    quote: "La seule newsletter que j'ouvre systématiquement. Les histoires sont toujours touchantes.",
    name: 'Sophie M.',
    role: 'Abonnée depuis 2023',
    color: '#7B5CD6',
  },
  {
    quote: "J'adore les coulisses de tournage et les interviews exclusives. Un vrai plus !",
    name: 'Thomas L.',
    role: 'Abonné depuis 2022',
    color: '#D64C90',
  },
  {
    quote: "Des recommandations personnalisées qui tombent toujours juste. Merci Origines !",
    name: 'Marie D.',
    role: 'Abonnée depuis 2024',
    color: '#E08A2B',
  },
];

const checklist = [
  'Notre sélection hebdomadaire de récits',
  'Les coulisses de nos productions',
  'Des interviews exclusives',
  'Les actualités de la communauté',
];

/* ── Component ── */

const NewsletterPage: React.FC = () => {
  return (
    <div className={s.page}>
      <SEO
        title="Newsletter — Restez inspirés chaque semaine"
        description="Inscrivez-vous à la newsletter Origines Media. Recevez nos meilleurs récits, coulisses de tournage et recommandations directement dans votre boîte mail."
        url="/newsletter"
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: "Newsletter", url: "/newsletter" },
        ]}
      />

      <SiteHeader />

      <main>
        {/* ── Page header ── */}
        <section className={s.header}>
          <div className={s.container}>
            <div className={s.headerInner}>
              <div>
                <div className={s.kicker}>
                  <span className={s.kickerDot} />
                  NEWSLETTER
                </div>
                <h1 className={s.title}>
                  Restez <em>inspirés</em>
                </h1>
                <p className={s.deck}>
                  Restez connectés à nos histoires
                </p>
              </div>

              <div className={s.stats}>
                {stats.map((stat, i) => (
                  <div key={i} className={s.stat}>
                    <span className={s.statValue} style={{ color: stat.color }}>
                      {stat.value}
                    </span>
                    <span className={s.statLabel}>{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Main signup (ink bg) ── */}
        <section className={s.signupSection}>
          <div className={s.container}>
            <div className={s.signupGrid}>
              {/* Form panel */}
              <div className={s.formPanel}>
                <div className={s.formHeader}>
                  <div className={s.formIcon}>
                    <MailIcon />
                  </div>
                  <div>
                    <h2 className={s.formTitle}>Newsletter Origines</h2>
                    <p className={s.formSubtitle}>Une dose d'inspiration chaque semaine</p>
                  </div>
                </div>

                <p className={s.formDesc}>
                  Rejoignez notre communauté et recevez chaque vendredi nos meilleurs récits,
                  coulisses de tournage et recommandations personnalisées.
                </p>

                <EmailCapture
                  source="newsletter"
                  variant="gradient"
                  placeholder="votre@email.com"
                  buttonText="S'abonner"
                  successMessage="Bienvenue dans la communauté !"
                  successDescription="Vous recevrez notre prochaine newsletter vendredi."
                />

                <p className={s.formDisclaimer}>
                  Gratuit, sans spam. Désabonnement en 1 clic.
                </p>
              </div>

              {/* Info sidebar */}
              <div className={s.infoSidebar}>
                {/* Checklist */}
                <div className={s.infoCard}>
                  <h3 className={s.infoCardTitle}>Ce que vous recevrez</h3>
                  <ul className={s.checklist}>
                    {checklist.map((item, i) => (
                      <li key={i} className={s.checkItem}>
                        <span className={s.checkIcon}>
                          <CheckIcon />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Frequency */}
                <div className={s.freqCard}>
                  <div className={s.freqIcon}>
                    <BellIcon />
                  </div>
                  <div>
                    <p className={s.freqTitle}>Une fois par semaine</p>
                    <p className={s.freqSub}>Le vendredi matin</p>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className={s.disclaimerCard}>
                  <p className={s.disclaimerText}>
                    <strong>Promis :</strong> Pas de spam, pas de revente de données. Désabonnement en 1 clic.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Benefits ── */}
        <section className={s.benefitsSection}>
          <div className={s.container}>
            <div className={s.sectionKicker}>
              <span className={s.sectionKickerDot} />
              AVANTAGES EXCLUSIFS
            </div>

            <div className={s.benefitsGrid}>
              {benefits.map((b) => {
                const Icon = b.icon;
                return (
                  <div key={b.title} className={s.benefitCard}>
                    <div
                      className={s.benefitIcon}
                      style={{ background: `${b.color}15` }}
                    >
                      <Icon />
                    </div>
                    <span
                      className={s.benefitLabel}
                      style={{ color: b.color }}
                    >
                      {b.label}
                    </span>
                    <h3 className={s.benefitTitle}>{b.title}</h3>
                    <p className={s.benefitDesc}>{b.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className={s.testimonialsSection}>
          <div className={s.container}>
            <div className={s.sectionKicker}>
              <span className={s.sectionKickerDot} />
              CE QU'ILS EN DISENT
            </div>

            <div className={s.testimonialsGrid}>
              {testimonials.map((t, i) => (
                <div key={i} className={s.testimonialCard}>
                  <div
                    className={s.testimonialAccent}
                    style={{ background: t.color }}
                  />

                  <p className={s.testimonialQuote}>{t.quote}</p>

                  <div className={s.testimonialAuthor}>
                    <div
                      className={s.authorAvatar}
                      style={{ background: t.color }}
                    >
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className={s.authorName}>{t.name}</p>
                      <p className={s.authorRole}>{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Bottom CTA (ink bg) ── */}
        <section className={s.ctaSection}>
          <div className={s.container}>
            <div className={s.ctaInner}>
              <h2 className={s.ctaTitle}>Ne manquez rien</h2>
              <p className={s.ctaDeck}>
                Rejoignez notre communauté et recevez le meilleur d'Origines chaque semaine.
              </p>

              <EmailCapture
                source="newsletter"
                variant="dark"
                placeholder="votre@email.com"
                buttonText="S'abonner"
                successMessage="Vous êtes inscrit !"
                successDescription="Rendez-vous vendredi dans votre boîte mail."
              />
            </div>
          </div>
        </section>
      </main>

      <Footer2 />
      <ScrollToTopV2 />
    </div>
  );
};

export default NewsletterPage;
