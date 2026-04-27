// src/pages/ContactPage.tsx
// V2 — angular design system, CSS modules, no lucide-react

import { useState } from "react";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import SEO from "../components/SEO";
import Breadcrumb from '@/components/ui/Breadcrumb';
import s from "./ContactPage.module.css";

/* ------------------------------------------------------------------ */
/*  Inline SVG icons                                                   */
/* ------------------------------------------------------------------ */

const IconMessage = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
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

const IconMapPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

const IconInstagram = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <rect x="2" y="2" width="20" height="20" rx="0" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

const IconYoutube = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const IconTwitter = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const IconTikTok = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const IconChevron = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const subjects = [
  "Question generale",
  "Proposer mon histoire",
  "Partenariat / Collaboration",
  "Probleme technique",
  "Suggestion",
  "Autre",
];

const socialLinks = [
  { Icon: IconInstagram, label: "Instagram", href: "https://instagram.com/originesmedia" },
  { Icon: IconYoutube, label: "YouTube", href: "https://youtube.com/originesmedia" },
  { Icon: IconTwitter, label: "X (Twitter)", href: "https://twitter.com/originesmedia" },
  { Icon: IconTikTok, label: "TikTok", href: "https://tiktok.com/@originesmedia" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className={s.page}>
      <SEO
        title="Contactez-nous — Questions et suggestions"
        description="Contactez l'equipe Origines Media. Une question, une suggestion ou envie de partager votre histoire ? Nous sommes la pour vous ecouter."
        url="/contact"
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: "Contact", url: "/contact" },
        ]}
      />
      <SiteHeader />

      <div className="v2-container">
        <Breadcrumb items={[
          { name: "Accueil", url: "/" },
          { name: "Contact", url: "/contact" },
        ]} />
      </div>

      {/* ── Page header ── */}
      <header className={s.header}>
        <div className={s.headerInner}>
          <div className={s.headerLabel}>
            <span className={s.kicker}>
              <span className={s.kickerDot} />
              Contact
            </span>
            <h1 className={s.title}>
              Parlons <em>ensemble</em>
            </h1>
            <p className={s.subtitle}>
              Une question, une suggestion ou envie de partager votre histoire ?
              Nous sommes la pour vous ecouter.
            </p>
          </div>

          <div className={s.badge}>
            <IconClock />
            Reponse sous 48h
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className={s.main}>
        <div className={s.grid}>
          {/* ── Form column ── */}
          <div>
            {!isSubmitted ? (
              <div className={s.formCard}>
                <div className={s.formHeader}>
                  <div className={s.formIcon}>
                    <IconMessage />
                  </div>
                  <h2 className={s.formTitle}>Envoyez-nous un message</h2>
                </div>

                <form onSubmit={handleSubmit} className={s.form}>
                  {/* Name + Email row */}
                  <div className={s.fieldRow}>
                    <div className={s.fieldGroup}>
                      <label htmlFor="name" className={s.label}>
                        Votre nom <span className={s.required}>*</span>
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
                        Votre email <span className={s.required}>*</span>
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

                  {/* Subject */}
                  <div className={s.fieldGroup}>
                    <label htmlFor="subject" className={s.label}>
                      Sujet
                    </label>
                    <div className={s.selectWrap}>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={s.select}
                      >
                        <option value="">Selectionnez un sujet</option>
                        {subjects.map((subj) => (
                          <option key={subj} value={subj}>
                            {subj}
                          </option>
                        ))}
                      </select>
                      <span className={s.selectChevron}>
                        <IconChevron />
                      </span>
                    </div>
                  </div>

                  {/* Message */}
                  <div className={s.fieldGroup}>
                    <label htmlFor="message" className={s.label}>
                      Votre message <span className={s.required}>*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className={s.textarea}
                      placeholder="Decrivez votre demande..."
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
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <IconSend />
                        Envoyer le message
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
                <h3 className={s.successTitle}>Message envoye !</h3>
                <p className={s.successText}>
                  Merci pour votre message. Nous vous repondrons sous 48 heures.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({ name: "", email: "", subject: "", message: "" });
                  }}
                  className={s.resetBtn}
                >
                  Nouveau message
                </button>
              </div>
            )}
          </div>

          {/* ── Info sidebar ── */}
          <aside className={s.sidebar}>
            {/* Email direct */}
            <div className={s.infoCard}>
              <div className={s.infoRow}>
                <div className={s.infoIcon}>
                  <IconMail />
                </div>
                <div>
                  <p className={s.infoLabel}>Email direct</p>
                  <a href="mailto:contact@originesmedia.com" className={s.infoLink}>
                    contact@originesmedia.com
                  </a>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className={s.infoCard}>
              <div className={s.infoRow}>
                <div className={s.infoIcon}>
                  <IconMapPin />
                </div>
                <div>
                  <p className={s.infoLabel}>Bases en France</p>
                  <p className={s.infoValue}>Paris, France</p>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div className={s.socialCard}>
              <h3 className={s.socialTitle}>Suivez-nous</h3>
              <div className={s.socialGrid}>
                {socialLinks.map(({ Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={s.socialBtn}
                    aria-label={label}
                    title={label}
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer2 />
      <ScrollToTopV2 />
    </div>
  );
};

export default ContactPage;
