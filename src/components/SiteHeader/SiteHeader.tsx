import { useState, useCallback, useRef, useEffect } from "react";
import { useScrolled } from "@/hooks/useScrollDirection";
import { useAuth } from "@/contexts/AuthContext";
import { UNIVERS } from "@/data/univers";
import { sanityFetch } from "@/lib/sanity";
import styles from "./SiteHeader.module.css";

interface SearchResult {
  _id: string;
  title: string;
  slug: string;
  type: "article" | "video" | "histoire" | "guide";
  imageUrl?: string;
  excerpt?: string;
  verticale?: string;
}

const SEARCH_QUERY = `
  *[_type in ["production", "portrait"] && (
    titre match $q ||
    description match $q ||
    accroche match $q
  )] | order(datePublication desc) [0...8] {
    _id,
    "title": titre,
    "slug": slug.current,
    "type": select(
      _type == "portrait" => "histoire",
      coalesce(typeArticle, "article") == "video" => "video",
      rubrique == "guides" => "guide",
      "article"
    ),
    "imageUrl": coalesce(image.asset->url, imageUrl),
    "excerpt": coalesce(description, extrait, accroche),
    "verticale": verticale->nom
  }
`;

const TYPE_LABELS: Record<string, string> = {
  article: "Article",
  video: "Vidéo",
  histoire: "Témoignage",
  guide: "Guide",
};

const COMING_SOON_SECTIONS = new Set<string>();

type MegaTarget = "galaxie" | "univers" | null;

const GALAXIE = [
  {
    id: "media",
    name: "Média",
    tagline: "Articles, récits, immersions et témoignages.",
    color: "#6D28D9",
    href: "/media",
    items: [
      { label: "Articles", href: "/articles" },
      { label: "Réflexions", href: "/reflexions" },
      { label: "Témoignages", href: "/temoignages" },
      { label: "Portraits", href: "/portraits" },
      { label: "Dossiers", href: "/dossiers" },
      { label: "Newsletter", href: "/newsletter" },
      { label: "Recommandations", href: "/recommandations" },
    ],
  },
  {
    id: "prod",
    name: "Prod",
    tagline: "Reportages, documentaires et formats courts.",
    color: "#C2410C",
    href: "/programmes",
    items: [
      { label: "Reportages", href: "/videos?format=reportages" },
      { label: "Documentaires", href: "/videos?format=documentaires" },
      { label: "Interviews", href: "/videos?format=interviews" },
      { label: "Shorts", href: "/videos?format=shorts" },
      { label: "Programmes", href: "/programmes" },
    ],
  },
  {
    id: "ateliers",
    name: "Ateliers",
    tagline: "Masterclass, ateliers et programmes.",
    color: "#059669",
    href: "/guides",
    items: [
      { label: "Masterclass", href: "/guides/masterclass" },
      { label: "Ateliers", href: "/guides/ateliers" },
      { label: "Programmes", href: "/guides/programmes" },
      { label: "Kits gratuits", href: "/guides/kits-gratuits" },
    ],
  },
  {
    id: "boutique",
    name: "Boutique",
    tagline: "E-books, workbooks, audio et carnets.",
    color: "#E11D48",
    href: "/boutique",
    items: [
      { label: "E-books", href: "/boutique?cat=ebooks" },
      { label: "Workbooks", href: "/boutique?cat=workbooks" },
      { label: "Audio", href: "/boutique?cat=audio" },
      { label: "Carnets", href: "/boutique?cat=carnets" },
      { label: "Coffrets", href: "/boutique?cat=coffrets" },
    ],
  },
];

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
  allHref?: string;
  items: DropdownItem[];
  secondaryLabel?: string;
  secondaryItems?: DropdownItem[];
}

const SECONDARY: SecondaryNav[] = [
  {
    href: "/media",
    label: "La Rédac",
    num: "01",
    hoverColor: "#7B5CD6",
    dropdownLabel: "Par univers",
    allLabel: "Tous les articles",
    allHref: "/articles",
    items: [
      { href: "/articles?univers=esprit", label: "L'Esprit", color: "#7B5CD6" },
      { href: "/articles?univers=corps", label: "Le Corps", color: "#5AA352" },
      { href: "/articles?univers=liens", label: "Les Liens", color: "#E67839" },
      { href: "/articles?univers=monde", label: "Le Monde", color: "#2E9B74" },
      { href: "/articles?univers=avenir", label: "L'Avenir", color: "#2E94B5" },
    ],
    secondaryLabel: "Par type",
    secondaryItems: [
      { href: "/media", label: "Articles", color: "#7B5CD6" },
      { href: "/dossiers", label: "Dossiers", color: "#2E9B74" },
      { href: "/temoignages", label: "Témoignages", color: "#E67839" },
    ],
  },
  {
    href: "/programmes",
    label: "Programmes",
    num: "02",
    hoverColor: "#E67839",
    dropdownLabel: "Par format",
    allLabel: "Toutes les vidéos",
    allHref: "/videos",
    items: [
      { href: "/videos?format=reportages", label: "Reportages", color: "#2E94B5" },
      { href: "/videos?format=documentaires", label: "Documentaires", color: "#7B5CD6" },
      { href: "/videos?format=interviews", label: "Interviews", color: "#E67839" },
      { href: "/videos?format=shorts", label: "Shorts", color: "#D64C90" },
      { href: "/videos?format=live", label: "Live", color: "#5AA352" },
    ],
    secondaryLabel: "Par catégorie",
    secondaryItems: [
      { href: "/videos/formats", label: "Nos formats", color: "#C99B1E" },
    ],
  },
  {
    href: "/guides",
    label: "Guides",
    num: "03",
    hoverColor: "#2E94B5",
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
      { href: "/ensemble#question", label: "Question de la semaine", color: "#2E94B5" },
      { href: "/ensemble#sondages", label: "Sondages", color: "#E67839" },
      { href: "/ensemble#calendrier", label: "Calendrier des parutions", color: "#5AA352" },
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
  {
    href: "/a-propos",
    label: "À propos",
    num: "06",
    hoverColor: "#7B5CD6",
    dropdownLabel: "Origines Media",
    allLabel: "Découvrir Origines",
    items: [
      { href: "/a-propos", label: "Notre mission", color: "#8B5CF6" },
      { href: "/a-propos#equipe", label: "L'équipe", color: "#EC4899" },
      { href: "/contact", label: "Contact", color: "#10B981" },
      { href: "/partenariats", label: "Partenariats", color: "#F59E0B" },
      { href: "/rejoindre", label: "Rejoindre l'équipe", color: "#2E94B5" },
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
  const { user } = useAuth();
  const scrolled = useScrolled();
  const [megaTarget, setMegaTarget] = useState<MegaTarget>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [comingSoon, setComingSoon] = useState(false);
  const [tagsOpen, setTagsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!comingSoon) return;
    const t = setTimeout(() => setComingSoon(false), 2400);
    return () => clearTimeout(t);
  }, [comingSoon]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    if (!mobileOpen) setMobileSection(null);
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const openMega = useCallback((target: MegaTarget) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaTarget(target);
  }, []);

  const closeMega = useCallback(() => {
    closeTimer.current = setTimeout(() => setMegaTarget(null), 150);
  }, []);

  const toggleSearch = useCallback(() => {
    setSearchOpen((o) => {
      if (!o) {
        setMegaTarget(null);
        requestAnimationFrame(() => searchRef.current?.focus());
      } else {
        setSearchQuery("");
        setSearchResults([]);
      }
      return !o;
    });
  }, []);

  const onSearchInput = useCallback((value: string) => {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value.trim()) {
      setSearchResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await sanityFetch<SearchResult[]>(SEARCH_QUERY, {
          q: `${value}*`,
        });
        setSearchResults(results || []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
  }, []);

  return (
    <>
    <a href="#main" className="skip-to-content">
      Aller au contenu
    </a>
    <header
      className={`${styles.header}${scrolled ? ` ${styles.scrolled}` : ""}`}
    >
      <div className="v2-container">
        <div className={styles.row}>
          <a href="/" className={styles.logo} aria-label="Origines — Accueil">
            <img
              src="/logos/logo-black.png"
              alt="Origines Media"
              className={styles.logoImg}
            />
          </a>

          <nav className={styles.nav} aria-label="Navigation principale">
            <div
              className={styles.megaTrigger}
              onMouseEnter={() => openMega("galaxie")}
              onMouseLeave={closeMega}
            >
              <button
                type="button"
                className={`${styles.megaBtn}${megaTarget === "galaxie" ? ` ${styles.megaBtnActive}` : ""}`}
                onClick={() => setMegaTarget((t) => t === "galaxie" ? null : "galaxie")}
                aria-expanded={megaTarget === "galaxie"}
                aria-controls="mega-galaxie"
              >
                <svg
                  className={styles.megaIcon}
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  aria-hidden="true"
                >
                  <circle cx="8" cy="8" r="6" />
                  <ellipse cx="8" cy="8" rx="6" ry="2.5" />
                  <ellipse cx="8" cy="8" rx="6" ry="2.5" transform="rotate(60 8 8)" />
                  <ellipse cx="8" cy="8" rx="6" ry="2.5" transform="rotate(120 8 8)" />
                </svg>
                Galaxie
                <svg
                  className={`${styles.megaChevron}${megaTarget === "galaxie" ? ` ${styles.megaChevronOpen}` : ""}`}
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

            <div
              className={styles.megaTrigger}
              onMouseEnter={() => openMega("univers")}
              onMouseLeave={closeMega}
            >
              <button
                type="button"
                className={`${styles.megaBtn}${megaTarget === "univers" ? ` ${styles.megaBtnActive}` : ""}`}
                onClick={() => setMegaTarget((t) => t === "univers" ? null : "univers")}
                aria-expanded={megaTarget === "univers"}
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
                  className={`${styles.megaChevron}${megaTarget === "univers" ? ` ${styles.megaChevronOpen}` : ""}`}
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
                      {section.secondaryLabel && section.secondaryItems && (
                        <>
                          <span className={styles.navDropdownLabel}>
                            {section.secondaryLabel}
                          </span>
                          {section.secondaryItems.map((item) => (
                            <a
                              key={item.href}
                              href={item.href}
                              style={{ "--item-color": item.color } as React.CSSProperties}
                            >
                              {item.label}
                            </a>
                          ))}
                        </>
                      )}
                      <a href={section.allHref || section.href} className={styles.navDropdownAll}>
                        {section.allLabel}
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className={styles.headerActions}>
            <a className={styles.cta} href="/racontez-votre-histoire">
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
            </a>

            <a
              className={styles.ctaIcon}
              href="/racontez-votre-histoire"
              aria-label="Racontez votre histoire"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M16.5 3.5 20 7l-9.5 9.5L5 17l0.5-5.5 11-8Z" />
                <path d="M14 6l3 3" />
              </svg>
            </a>

            <div className={styles.accountWrap}>
              {user ? (
                <>
                  <a href="/compte" className={styles.accountBtn}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 21v-1a6 6 0 0 1 12 0v1" />
                    </svg>
                    <span className={styles.accountLabel}>{user.displayName || "Mon compte"}</span>
                    <svg className={styles.accountChevron} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M4 6l4 4 4-4" />
                    </svg>
                  </a>
                  <div className={styles.accountDropdown}>
                    <a href="/compte">Mon profil</a>
                    <a href="/compte/journaux">Mes journaux</a>
                    <a href="/compte/liste">Ma liste</a>
                    <a href="/compte/parametres">Param&egrave;tres</a>
                    <span className={styles.accountSep} />
                    <a href="/deconnexion" className={styles.accountLogout}>Se d&eacute;connecter</a>
                  </div>
                </>
              ) : (
                <a href="/compte" className={styles.accountBtn}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21v-1a6 6 0 0 1 12 0v1" />
                  </svg>
                  <span className={styles.accountLabel}>Se connecter</span>
                </a>
              )}
            </div>

            <button
              className={styles.menuBtn}
              type="button"
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
              onClick={() => setMobileOpen((o) => !o)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                {mobileOpen
                  ? <path d="M6 6l12 12M6 18L18 6" />
                  : <path d="M4 7h16M4 12h16M4 17h16" />
                }
              </svg>
            </button>
          </div>
        </div>
        <div className={`${styles.tagRow}${tagsOpen ? ` ${styles.tagRowOpen}` : ""}`}>
          {UNIVERS.flatMap((u, ui) => {
            const tags = u.subtopics.map((st) => (
              <a
                key={`${u.id}-${st.slug}`}
                href={`/${u.id}/${st.slug}`}
                className={styles.tag}
                style={{ "--tag-color": u.color } as React.CSSProperties}
              >
                {st.label}
              </a>
            ));
            if (ui < UNIVERS.length - 1) {
              tags.push(<span key={`sep-${u.id}`} className={styles.tagSep} aria-hidden="true">&middot;</span>);
            }
            return tags;
          })}
          <div className={styles.tagActions}>
            <button
              type="button"
              className={styles.tagToggle}
              onClick={() => setTagsOpen((o) => !o)}
            >
              {tagsOpen ? "Voir moins" : "Voir plus"}
            </button>
            <button
              type="button"
              className={styles.tagSearch}
              onClick={toggleSearch}
              aria-label="Rechercher"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M16 16l5 5" />
              </svg>
              <kbd className={styles.tagSearchKbd}>/</kbd>
            </button>
          </div>
        </div>
      </div>

      <div
        id="mega-galaxie"
        className={`${styles.mega}${megaTarget === "galaxie" ? ` ${styles.megaOpen}` : ""}`}
        onMouseEnter={() => openMega("galaxie")}
        onMouseLeave={closeMega}
        aria-hidden={megaTarget !== "galaxie"}
      >
        <div className="v2-container">
          <div className={styles.megaHeader}>
            <span className={styles.megaHeaderLabel}>La Galaxie Origines</span>
            <span className={styles.megaHeaderHint}>Nos 4 piliers</span>
          </div>
          <div className={styles.megaGrid4}>
            {GALAXIE.map((p, i) => (
              <div
                key={p.id}
                className={styles.megaCol}
                style={{ "--col-color": p.color } as React.CSSProperties}
              >
                <div className={styles.megaColAccent} aria-hidden="true" />
                <span className={styles.megaNum} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <a href={p.href} className={styles.megaTitle}>
                  <span
                    className={styles.megaDot}
                    style={{ background: p.color }}
                    aria-hidden="true"
                  />
                  {p.name}
                </a>
                <p className={styles.megaTagline}>{p.tagline}</p>
                <div className={styles.megaLinks}>
                  {p.items.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className={styles.megaLink}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
                <a href={p.href} className={styles.megaAll}>
                  Explorer {p.name.toLowerCase()}
                  <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        id="mega-univers"
        className={`${styles.mega}${megaTarget === "univers" ? ` ${styles.megaOpen}` : ""}`}
        onMouseEnter={() => openMega("univers")}
        onMouseLeave={closeMega}
        aria-hidden={megaTarget !== "univers"}
      >
        <div className="v2-container">
          <div className={styles.megaHeader}>
            <span className={styles.megaHeaderLabel}>Les 5 Univers</span>
            <span className={styles.megaHeaderHint}>Explorer par thème</span>
          </div>
          <div className={styles.megaGrid}>
            {UNIVERS.map((u, i) => (
              <div
                key={u.id}
                className={styles.megaCol}
                style={{ "--col-color": u.color } as React.CSSProperties}
              >
                <div className={styles.megaColAccent} aria-hidden="true" />
                <span className={styles.megaNum} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
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
              value={searchQuery}
              onChange={(e) => onSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") { setSearchOpen(false); setSearchQuery(""); setSearchResults([]); }
                if (e.key === "Enter" && searchQuery.trim()) { window.location.href = `/recherche?q=${encodeURIComponent(searchQuery)}`; }
              }}
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

          {searchQuery.trim() ? (
            <div className={styles.searchResults}>
              {searching && (
                <span className={styles.searchStatus}>Recherche en cours…</span>
              )}
              {!searching && searchResults.length === 0 && (
                <span className={styles.searchStatus}>
                  Aucun r&eacute;sultat pour &laquo;&nbsp;{searchQuery}&nbsp;&raquo;
                </span>
              )}
              {!searching && searchResults.length > 0 && (
                <>
                  {searchResults.map((r) => (
                    <a
                      key={r._id}
                      href={r.type === "histoire" ? `/portrait/${r.slug}` : `/article/${r.slug}`}
                      className={styles.searchResultItem}
                    >
                      {r.imageUrl && (
                        <img
                          src={r.imageUrl}
                          alt={r.title}
                          className={styles.searchResultImg}
                          loading="lazy"
                        />
                      )}
                      <div className={styles.searchResultBody}>
                        <div className={styles.searchResultMeta}>
                          <span className={styles.searchResultType}>
                            {TYPE_LABELS[r.type] || "Article"}
                          </span>
                          {r.verticale && (
                            <span className={styles.searchResultVert}>{r.verticale}</span>
                          )}
                        </div>
                        <span className={styles.searchResultTitle}>{r.title}</span>
                        {r.excerpt && (
                          <span className={styles.searchResultExcerpt}>{r.excerpt}</span>
                        )}
                      </div>
                    </a>
                  ))}
                  <a
                    href={`/recherche?q=${encodeURIComponent(searchQuery)}`}
                    className={styles.searchResultsAll}
                  >
                    Voir tous les r&eacute;sultats
                    <span aria-hidden="true">&rarr;</span>
                  </a>
                </>
              )}
            </div>
          ) : (
            <div className={styles.searchSuggestions}>
              <span className={styles.searchSugLabel}>Recherches populaires</span>
              <div className={styles.searchChips}>
                {POPULAR_SEARCHES.map((ps) => (
                  <button
                    key={ps}
                    type="button"
                    className={styles.searchChip}
                    onClick={() => onSearchInput(ps)}
                  >
                    {ps}
                  </button>
                ))}
              </div>
              <div className={styles.searchQuick}>
                <a href="/articles" className={styles.searchQuickLink}>
                  Derniers articles <span aria-hidden="true">&rarr;</span>
                </a>
                <a href="/programmes" className={styles.searchQuickLink}>
                  Derni&egrave;res vid&eacute;os <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile navigation drawer ── */}
      <nav
        className={`${styles.mobileNav}${mobileOpen ? ` ${styles.mobileNavOpen}` : ""}`}
        aria-label="Navigation mobile"
        aria-hidden={!mobileOpen}
      >
        <div className={styles.mobileNavInner}>
          {/* Close bar */}
          <div className={styles.mobileCloseBar}>
            <img
              src="/logos/logo-black.png"
              alt=""
              className={styles.mobileCloseLogo}
              aria-hidden="true"
            />
            <button
              type="button"
              className={styles.mobileCloseBtn}
              onClick={() => setMobileOpen(false)}
              aria-label="Fermer le menu"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          {/* CTA — immediately visible */}
          <a href="/racontez-votre-histoire" className={styles.mobileStoryCta} onClick={() => setMobileOpen(false)}>
            Racontez votre histoire
            <span aria-hidden="true">&rarr;</span>
          </a>

          {/* Search */}
          <div className={styles.mobileSearch}>
            <svg className={styles.mobileSearchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M16 16l5 5" />
            </svg>
            <input
              type="search"
              className={styles.mobileSearchInput}
              placeholder="Rechercher un article, un sujet…"
              aria-label="Rechercher"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.target as HTMLInputElement).value.trim()) {
                  setMobileOpen(false);
                  window.location.href = `/recherche?q=${encodeURIComponent((e.target as HTMLInputElement).value)}`;
                }
              }}
            />
          </div>

          {/* Nav sections — direct links */}
          <div className={styles.mobileSections}>
            {SECONDARY.map((sec) => (
              <div
                key={sec.num}
                className={styles.mobileSection}
                style={{ "--m-color": sec.hoverColor } as React.CSSProperties}
              >
                <a
                  href={sec.href}
                  className={styles.mobileSectionTitle}
                  onClick={() => setMobileOpen(false)}
                >
                  <span className={styles.mobileSectionNum}>{sec.num}</span>
                  <span className={styles.mobileSectionAccent} aria-hidden="true" />
                  {sec.label}
                  <svg
                    className={styles.mobileSectionChevron}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            ))}
          </div>

          {/* Bottom */}
          <div className={styles.mobileCta}>
            <a href="/compte" className={styles.mobileAccountLink} onClick={() => setMobileOpen(false)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21v-1a6 6 0 0 1 12 0v1" />
              </svg>
              {user ? (user.displayName || "Mon compte") : "Se connecter"}
            </a>
            <a href="/newsletter" className={styles.mobileCtaBtn} onClick={() => setMobileOpen(false)}>
              S&rsquo;abonner &agrave; la newsletter
            </a>

            {/* Réseaux sociaux */}
            <div className={styles.mobileSocials}>
              <span className={styles.mobileSocialsLabel}>Suivez-nous</span>
              <div className={styles.mobileSocialsRow}>
                <a href="https://instagram.com/origines.media" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={styles.mobileSocialLink}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" /></svg>
                </a>
                <a href="https://youtube.com/@originesmedia" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className={styles.mobileSocialLink}>
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.9 31.9 0 0 0 0 12a31.9 31.9 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8ZM9.5 15.6V8.4l6.3 3.6-6.3 3.6Z" /></svg>
                </a>
                <a href="https://tiktok.com/@origines.media" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className={styles.mobileSocialLink}>
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.3 7.1A4.5 4.5 0 0 1 16 5.6V2h-3.5v13.5a3 3 0 1 1-2-2.8V9a6.5 6.5 0 1 0 5.5 6.4V9.9a8 8 0 0 0 4.5 1.4V7.8a4.5 4.5 0 0 1-1.2-.7Z" /></svg>
                </a>
                <a href="https://linkedin.com/company/origines-media" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={styles.mobileSocialLink}>
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2ZM8 19H5v-9h3v9ZM6.5 8.5A1.75 1.75 0 1 1 8.3 6.8 1.75 1.75 0 0 1 6.5 8.5ZM20 19h-3v-4.7c0-1.1 0-2.6-1.6-2.6S13.5 13 13.5 14.2V19h-3v-9h2.9v1.2h0a3.2 3.2 0 0 1 2.8-1.5c3 0 3.6 2 3.6 4.5V19Z" /></svg>
                </a>
                <a href="https://x.com/originesmedia" target="_blank" rel="noopener noreferrer" aria-label="X" className={styles.mobileSocialLink}>
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.2 2.3h3.5l-7.7 8.8L23 21.7h-7.1l-5.5-7.2-6.3 7.2H.6l8.2-9.4L.3 2.3h7.3l5 6.6 5.6-6.6Zm-1.2 17.5h1.9L7.1 4.2H5l12 15.6Z" /></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

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
    </>
  );
}
