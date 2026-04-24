import styles from "./Footer2.module.css";

/* ---- Social SVG icons ---- */

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1C4.5 20.5 12 20.5 12 20.5s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.9 2h3.3l-7.2 8.2L23.7 22h-6.6l-5.2-6.8L5.9 22H2.6l7.7-8.8L2 2h6.8l4.7 6.2L18.9 2Zm-1.2 18h1.8L6.4 4H4.5l13.2 16Z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20 8.3a7.3 7.3 0 0 1-4.3-1.4V16a6 6 0 1 1-6-6h1v3.3A2.7 2.7 0 1 0 12.7 16V2h3a4.3 4.3 0 0 0 4.3 4.3v2Z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.3-1.5 1.6-1.5h1.7V4.6a22 22 0 0 0-2.5-.1c-2.5 0-4.2 1.5-4.2 4.3v2.2H7.4V14h2.7v8h3.4Z" />
  </svg>
);

/* ---- Data ---- */

const NAV_SECTIONS = [
  {
    title: "Lire",
    links: [
      { href: "/articles", label: "Articles" },
      { href: "/collections", label: "Collections" },
      { href: "/journal", label: "Journal" },
    ],
  },
  {
    title: "Découvrir",
    links: [
      { href: "/videos", label: "Vidéos" },
      { href: "/guides", label: "Guides" },
      { href: "/boutique", label: "Boutique" },
    ],
  },
  {
    title: "Origines",
    links: [
      { href: "/a-propos", label: "Notre mission" },
      { href: "/equipe", label: "L'équipe" },
      { href: "/carriere", label: "Carrières" },
      { href: "/contact", label: "Contact" },
      { href: "/partenariats", label: "Partenariats" },
    ],
  },
  {
    title: "Suivre",
    links: [
      { href: "/newsletter", label: "Newsletter" },
      { href: "/podcast", label: "Podcast" },
      { href: "https://youtube.com/@originesmedia", label: "YouTube" },
      { href: "https://instagram.com/origines.media", label: "Instagram" },
    ],
  },
];

const LEGAL_LINKS = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/cgu", label: "CGU" },
  { href: "/confidentialite", label: "Confidentialité" },
  { href: "/cookies", label: "Cookies" },
  { href: "/sitemap.xml", label: "Plan du site" },
];

const SOCIAL_LINKS = [
  { href: "https://youtube.com/@originesmedia", label: "YouTube", icon: <YouTubeIcon /> },
  { href: "https://x.com/originesmedia", label: "X", icon: <XIcon /> },
  { href: "https://instagram.com/originesmedia", label: "Instagram", icon: <InstagramIcon /> },
  { href: "https://tiktok.com/@originesmedia", label: "TikTok", icon: <TikTokIcon /> },
  { href: "https://facebook.com/originesmedia", label: "Facebook", icon: <FacebookIcon /> },
];

export default function Footer2() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className="v2-container">
        {/* ---- Manifesto ---- */}
        <div className={styles.footerHead}>
          <h2 className={styles.big}>
            Des récits qui <em>restent</em>.
          </h2>
          <p className={styles.lead}>
            Un média indépendant. Des histoires longues.
            Pas de publicité, pas d&rsquo;algorithme &mdash; juste
            ce qui mérite votre temps.
          </p>
        </div>

        {/* ---- Nav compact 4 colonnes ---- */}
        <nav className={styles.footerNav} aria-label="Plan du site">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className={styles.footerCol}>
              <h4>{section.title}</h4>
              <ul>
                {section.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      {...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* ---- Bottom strip ---- */}
        <div className={styles.footerStrip}>
          <div className={styles.left}>
            <img
              src="/logos/logo-black.png"
              alt="Origines"
              style={{ height: 28, width: "auto" }}
            />
            <div className={styles.copy}>
              &copy; 2026 Origines Media<br />
              ISSN 2974-0912 &middot; Paris
            </div>
          </div>
          <div className={styles.legal}>
            {LEGAL_LINKS.map((link) => (
              <a key={link.href} href={link.href}>{link.label}</a>
            ))}
          </div>
          <div className={styles.footerSocial} aria-label="Réseaux sociaux">
            {SOCIAL_LINKS.map((social) => (
              <a key={social.href} href={social.href} aria-label={social.label} rel="noopener">
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* ---- Signature wordmark ---- */}
        <div className={styles.footerSignature}>
          <div className={styles.wordmarkHuge}>Orig<em>ines</em></div>
        </div>
      </div>
    </footer>
  );
}
