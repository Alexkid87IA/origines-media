import { useState, useCallback, useRef, useEffect } from "react";
import { useScrolled } from "@/hooks/useScrollDirection";
import { UNIVERS } from "@/data/univers";
import styles from "./SiteHeader.module.css";

const COMING_SOON_SECTIONS = new Set(["03", "04", "05"]);

interface DropdownItem {
  href: string;
  label: string;
  color: string;
}

interface SecondaryNav {
  href: string;
  label: string;
  num: string;
  hoverColor: string;
  dropdownLabel: string;
  allLabel: string;
  items: DropdownItem[];
}

const SECONDARY: SecondaryNav[] = [
  {
    href: "/articles",
    label: "Articles",
    num: "01",
    hoverColor: "#7B5CD6",
    dropdownLabel: "Par univers",
    allLabel: "Tous les articles",
    items: [
      { href: "/articles?univers=esprit", label: "L'Esprit", color: "#7B5CD6" },
      { href: "/articles?univers=corps", label: "Le Corps", color: "#5AA352" },
      { href: "/articles?univers=liens", label: "Les Liens", color: "#E67839" },
      { href: "/articles?univers=monde", label: "Le Monde", color: "#2E9B74" },
      { href: "/articles?univers=avenir", label: "L'Avenir", color: "#2E94B5" },
    ],
  },
  {
    href: "/videos",
    label: "Vidéos",
    num: "02",
    hoverColor: "#2E94B5",
    dropdownLabel: "Par format",
    allLabel: "Toutes les vidéos",
    items: [
      { href: "/videos?format=reportages", label: "Reportages", color: "#2E94B5" },
      { href: "/videos?format=documentaires", label: "Documentaires", color: "#7B5CD6" },
      { href: "/videos?format=interviews", label: "Interviews", color: "#E67839" },
      { href: "/videos?format=shorts", label: "Shorts", color: "#D64C90" },
      { href: "/videos?format=live", label: "Live", color: "#5AA352" },
      { href: "/videos/formats", label: "Nos formats", color: "#C99B1E" },
    ],
  },
  {
    href: "/guides",
    label: "Guides",
    num: "03",
    hoverColor: "#E67839",
    dropdownLabel: "Nos programmes",
    allLabel: "Tous les guides",
    items: [
      { href: "/guides/masterclass", label: "Masterclass", color: "#D64C90" },
      { href: "/guides/ateliers", label: "Ateliers", color: "#5A66D6" },
      { href: "/guides/programmes", label: "Programmes", color: "#2E9B74" },
      { href: "/guides/kits-gratuits", label: "Kits gratuits", color: "#5AA352" },
    ],
  },
  {
    href: "/ensemble",
    label: "Ensemble",
    num: "04",
    hoverColor: "#D64C90",
    dropdownLabel: "Vie du média",
    allLabel: "Voir tout",
    items: [
      { href: "/histoires", label: "Histoires", color: "#D64C90" },
      { href: "/recommandations", label: "Recommandations", color: "#7B5CD6" },
      { href: "/newsletter", label: "La Lettre du dimanche", color: "#C99B1E" },
      { href: "/ensemble", label: "Question de la semaine", color: "#2E94B5" },
      { href: "/ensemble", label: "Sondages", color: "#E67839" },
      { href: "/ensemble", label: "Calendrier des parutions", color: "#5AA352" },
    ],
  },
  {
    href: "/boutique",
    label: "Boutique",
    num: "05",
    hoverColor: "#5AA352",
    dropdownLabel: "Nos produits",
    allLabel: "Voir la boutique",
    items: [
      { href: "/boutique/kit-introspection", label: "Kit d'Introspection — Gratuit", color: "#5AA352" },
      { href: "/boutique/guide-mindset", label: "Guide Mindset", color: "#7B5CD6" },
      { href: "/boutique/carnet-origines", label: "Carnet Origines", color: "#A07850" },
      { href: "/boutique/pack-affiches", label: "Pack Affiches", color: "#9B6B8D" },
    ],
  },
];

const POPULAR_SEARCHES = [
  "Développement personnel",
  "Storytelling",
  "Sommeil",
  "Parentalité",
  "Méditation",
];

export default function SiteHeader() {
  const scrolled = useScrolled();
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [comingSoon, setComingSoon] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!comingSoon) return;
    const t = setTimeout(() => setComingSoon(false), 2400);
    return () => clearTimeout(t);
  }, [comingSoon]);

  const openMega = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(true);
  }, []);

  const closeMega = useCallback(() => {
    closeTimer.current = setTimeout(() => setMegaOpen(false), 150);
  }, []);

  const toggleSearch = useCallback(() => {
    setSearchOpen((o) => {
      if (!o) {
        setMegaOpen(false);
        requestAnimationFrame(() => searchRef.current?.focus());
      }
      return !o;
    });
  }, []);

  return (
    <header
      className={`${styles.header}${scrolled ? ` ${styles.scrolled}` : ""}`}
    >
      <div className="v2-container">
        <div className={styles.row}>
          <a href="/" className={styles.logo} aria-label="Origines — Accueil">
            <span className={styles.logoLockup} aria-hidden="true">
              <span className={`${styles.state} ${styles.stateSquare}`}>
                <img
                  src="/logos/logo-black.png"
                  alt=""
                  width={64}
                  height={64}
                />
              </span>
              <span className={`${styles.state} ${styles.stateTarget}`}>
                <span className={styles.oMark}>
                  <svg viewBox="0 0 100 100" aria-hidden="true">
                    <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="10" />
                    <circle cx="50" cy="50" r="8" fill="currentColor" />
                  </svg>
                </span>
                <span className={styles.wordmark}>Origines</span>
              </span>
            </span>
          </a>

          <nav className={styles.nav} aria-label="Navigation principale">
            <div
              className={styles.megaTrigger}
              onMouseEnter={openMega}
              onMouseLeave={closeMega}
            >
              <button
                type="button"
                className={`${styles.megaBtn}${megaOpen ? ` ${styles.megaBtnActive}` : ""}`}
                onClick={() => setMegaOpen((o) => !o)}
                aria-expanded={megaOpen}
                aria-controls="mega-univers"
              >
                <svg
                  className={styles.megaIcon}
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <rect x="1" y="1" width="6" height="6" rx="1" />
                  <rect x="9" y="1" width="6" height="6" rx="1" />
                  <rect x="1" y="9" width="6" height="6" rx="1" />
                  <rect x="9" y="9" width="6" height="6" rx="1" />
                </svg>
                Univers
                <svg
                  className={`${styles.megaChevron}${megaOpen ? ` ${styles.megaChevronOpen}` : ""}`}
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M4 6l4 4 4-4" />
                </svg>
              </button>
            </div>

            {SECONDARY.map((section) => {
              const isSoon = COMING_SOON_SECTIONS.has(section.num);
              const handleSoon = isSoon
                ? (e: React.MouseEvent) => { e.preventDefault(); setComingSoon(true); }
                : undefined;
              return (
                <div key={section.num} className={styles.navItem}>
                  <a
                    href={section.href}
                    className={styles.navLink}
                    style={{ "--hover": section.hoverColor } as React.CSSProperties}
                    onClick={handleSoon}
                  >
                    <span className={styles.num}>{section.num}</span>
                    {section.label}
                  </a>
                  {!isSoon && (
                    <div
                      className={styles.navDropdown}
                      role="menu"
                      aria-label={`${section.label} — ${section.dropdownLabel.toLowerCase()}`}
                    >
                      <span className={styles.navDropdownLabel}>
                        {section.dropdownLabel}
                      </span>
                      {section.items.map((item) => (
                        <a
                          key={item.href}
                          href={item.href}
                          style={{ "--item-color": item.color } as React.CSSProperties}
                        >
                          {item.label}
                        </a>
                      ))}
                      <a href={section.href} className={styles.navDropdownAll}>
                        {section.allLabel}
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className={styles.headerActions}>
            <button className={styles.cta} type="button">
              <span>Racontez votre histoire</span>
              <svg
                className={styles.arrow}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </button>

            <button
              className={styles.ctaIcon}
              type="button"
              aria-label="Racontez votre histoire"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M16.5 3.5 20 7l-9.5 9.5L5 17l0.5-5.5 11-8Z" />
                <path d="M14 6l3 3" />
              </svg>
            </button>

            <div className={styles.accountWrap}>
              <a href="/compte" className={styles.accountBtn}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21v-1a6 6 0 0 1 12 0v1" />
                </svg>
                <span className={styles.accountLabel}>Mon compte</span>
                <svg className={styles.accountChevron} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M4 6l4 4 4-4" />
                </svg>
              </a>
              <div className={styles.accountDropdown}>
                <a href="/compte">Mon profil</a>
                <a href="/compte/journales">Mes journales</a>
                <a href="/compte/liste">Ma liste</a>
                <a href="/compte/parametres">Param&egrave;tres</a>
                <span className={styles.accountSep} />
                <a href="/deconnexion" className={styles.accountLogout}>Se d&eacute;connecter</a>
              </div>
            </div>

            <button
              className={styles.menuBtn}
              type="button"
              aria-label="Ouvrir le menu"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>
        <button
          type="button"
          className={styles.searchBar}
          onClick={toggleSearch}
          aria-label="Rechercher"
        >
          <svg className={styles.searchBarIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M16 16l5 5" />
          </svg>
          <span className={styles.searchBarText}>Rechercher un article, un sujet&hellip;</span>
          <kbd className={styles.searchBarKbd}>/</kbd>
        </button>
      </div>

      <div
        id="mega-univers"
        className={`${styles.mega}${megaOpen ? ` ${styles.megaOpen}` : ""}`}
        onMouseEnter={openMega}
        onMouseLeave={closeMega}
        aria-hidden={!megaOpen}
      >
        <div className="v2-container">
          <div className={styles.megaGrid}>
            {UNIVERS.map((u) => (
              <div
                key={u.id}
                className={styles.megaCol}
                style={{ "--col-color": u.color } as React.CSSProperties}
              >
                <div className={styles.megaColAccent} aria-hidden="true" />
                <a href={`/${u.id}`} className={styles.megaTitle}>
                  <span
                    className={styles.megaDot}
                    style={{ background: u.color }}
                    aria-hidden="true"
                  />
                  {u.name}
                </a>
                <p className={styles.megaTagline}>{u.tagline}</p>
                <div className={styles.megaLinks}>
                  {u.subtopics.map((st) => (
                    <a
                      key={st.slug}
                      href={`/${u.id}/${st.slug}`}
                      className={styles.megaLink}
                    >
                      {st.label}
                    </a>
                  ))}
                </div>
                <a href={`/${u.id}`} className={styles.megaAll}>
                  Explorer {u.name.toLowerCase()}
                  <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`${styles.search}${searchOpen ? ` ${styles.searchOpen}` : ""}`}
        aria-hidden={!searchOpen}
      >
        <div className="v2-container">
          <div className={styles.searchInner}>
            <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M16 16l5 5" />
            </svg>
            <input
              ref={searchRef}
              type="search"
              className={styles.searchInput}
              placeholder="Rechercher un article, un sujet, un auteur…"
              aria-label="Rechercher"
              onKeyDown={(e) => e.key === "Escape" && setSearchOpen(false)}
            />
            <button
              type="button"
              className={styles.searchClose}
              onClick={() => setSearchOpen(false)}
              aria-label="Fermer la recherche"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <div className={styles.searchSuggestions}>
            <span className={styles.searchSugLabel}>Recherches populaires</span>
            <div className={styles.searchChips}>
              {POPULAR_SEARCHES.map((s) => (
                <a key={s} href={`/recherche?q=${encodeURIComponent(s)}`} className={styles.searchChip}>
                  {s}
                </a>
              ))}
            </div>
            <div className={styles.searchQuick}>
              <a href="/articles" className={styles.searchQuickLink}>
                Derniers articles <span aria-hidden="true">&rarr;</span>
              </a>
              <a href="/videos" className={styles.searchQuickLink}>
                Derni&egrave;res vid&eacute;os <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {comingSoon && (
        <div className={styles.comingSoon} role="status">
          <span className={styles.comingSoonDot} aria-hidden="true" />
          <div>
            <span className={styles.comingSoonLabel}>Bient&ocirc;t disponible</span>
            <p className={styles.comingSoonSub}>Cette section arrive prochainement.</p>
          </div>
        </div>
      )}
    </header>
  );
}
