import { useState, useMemo, useCallback, useRef } from "react";
import { UNIVERS, UNIVERS_MAP, ARTICLES, TOTAL_ARTICLES, type UniversId } from "@/data/univers";
import { sanityImg } from "@/lib/sanityImage";
import SaveBookmark from "@/components/SaveButton/SaveBookmark";
import s from "./Feed.module.css";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CMSFeedItem {
  id: number;
  univers: UniversId;
  category?: string;
  soustopic?: string;
  date: string;
  popularity: number;
  title: string;
  href: string;
  imgSrc: string;
  imgAlt: string;
  timeLabel: string;
  format: string;
  headline: string;
  headlineEm: string;
  headlineSuffix: string;
  excerpt: string;
  author: string;
  readTime: string;
  isVideo: boolean;
  isPaywall?: boolean;
  schemaType?: string;
  catColor: string;
  catDark: string;
}

interface FeedProps {
  cmsItems?: CMSFeedItem[];
}

type SortMode = "recent" | "oldest" | "popular" | "alpha" | "shuffle";

interface FilterDef {
  key: string;
  label: string;
  count: number;
  chipColor?: string;
}

interface PillDef {
  label: string;
  color: string;
}

/* ------------------------------------------------------------------ */
/*  Derived from univers.ts                                            */
/* ------------------------------------------------------------------ */

const SOUSTOPIC_LABELS: Record<string, string> = {
  emotions: "Émotions",
  conscience: "Conscience",
  meditation: "Méditation",
  "developpement-personnel": "Développement personnel",
  neurosciences: "Neurosciences",
  philosophie: "Philosophie",
  "quete-de-sens": "Quête de sens",
  therapies: "Thérapies",
  nutrition: "Nutrition",
  sommeil: "Sommeil",
  mouvement: "Mouvement",
  prevention: "Prévention",
  "medecine-douce": "Médecine douce",
  "bien-etre-physique": "Bien-être physique",
  sport: "Sport",
  respiration: "Respiration",
  parentalite: "Parentalité",
  couples: "Couples",
  amitie: "Amitié",
  education: "Éducation",
  generations: "Générations",
  communaute: "Communauté",
  ruptures: "Ruptures",
  "enquetes-sociales": "Enquêtes sociales",
  "recits-de-voyage": "Récits de voyage",
  destinations: "Destinations",
  art: "Art",
  musique: "Musique",
  litterature: "Littérature",
  cinema: "Cinéma",
  creativite: "Créativité",
  photographie: "Photographie",
  carriere: "Carrière",
  entrepreneuriat: "Entrepreneuriat",
  innovation: "Innovation",
  "intelligence-artificielle": "Intelligence artificielle",
  economie: "Économie",
  leadership: "Leadership",
  numerique: "Numérique",
  nomadisme: "Nomadisme",
};

const SOUSTOPIC_UNIVERS: Record<string, UniversId> = {
  emotions: "esprit", conscience: "esprit", meditation: "esprit",
  "developpement-personnel": "esprit", neurosciences: "esprit",
  philosophie: "esprit", "quete-de-sens": "esprit", therapies: "esprit",
  nutrition: "corps", sommeil: "corps", mouvement: "corps",
  prevention: "corps", "medecine-douce": "corps",
  "bien-etre-physique": "corps", sport: "corps", respiration: "corps",
  parentalite: "liens", couples: "liens", amitie: "liens",
  education: "liens", generations: "liens", communaute: "liens",
  ruptures: "liens", "enquetes-sociales": "liens",
  "recits-de-voyage": "monde", destinations: "monde", art: "monde",
  musique: "monde", litterature: "monde", cinema: "monde",
  creativite: "monde", photographie: "monde",
  carriere: "avenir", entrepreneuriat: "avenir", innovation: "avenir",
  "intelligence-artificielle": "avenir", economie: "avenir",
  leadership: "avenir", numerique: "avenir", nomadisme: "avenir",
};

const MAX_VISIBLE_FILTERS = 10;

const PILLS: PillDef[] = UNIVERS.map((u) => ({
  label: u.name,
  color: u.color,
}));

const FEED_ITEMS = ARTICLES.map((a) => ({
  ...a,
  catColor: UNIVERS_MAP[a.univers].color,
  catDark: UNIVERS_MAP[a.univers].dark,
}));

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Fisher-Yates shuffle */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** NFD accent normalization for alphabetical sort */
function normalize(str: string): string {
  return (str || "")
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Feed({ cmsItems }: FeedProps) {
  const allItems = useMemo(() => cmsItems || FEED_ITEMS, [cmsItems]);

  const ITEMS_PER_LOAD = 8;

  const [activeFilter, setActiveFilter] = useState("all");
  const [sortMode, setSortMode] = useState<SortMode>("recent");
  const [showAllFilters, setShowAllFilters] = useState(false);
  const [enteringIds, setEnteringIds] = useState<Set<number>>(new Set());
  const [visibleLimit, setVisibleLimit] = useState(ITEMS_PER_LOAD);
  const prevFilterRef = useRef("all");

  /* ── Filters rebuilt from actual items by sous-topic ── */
  const allCategoryFilters = useMemo<FilterDef[]>(() => {
    const catMap: Record<string, number> = {};
    allItems.forEach((item) => {
      const cat = item.soustopic || "autres";
      catMap[cat] = (catMap[cat] || 0) + 1;
    });
    return Object.entries(catMap)
      .sort((a, b) => b[1] - a[1])
      .map(([key, count]) => {
        const uid = SOUSTOPIC_UNIVERS[key];
        return {
          key,
          label: SOUSTOPIC_LABELS[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, " "),
          count,
          chipColor: uid ? UNIVERS_MAP[uid].color : undefined,
        };
      });
  }, [allItems]);

  const dynamicFilters = useMemo<FilterDef[]>(() => {
    const total = allItems.length;
    const visible = showAllFilters
      ? allCategoryFilters
      : allCategoryFilters.slice(0, MAX_VISIBLE_FILTERS);
    return [{ key: "all", label: "Tous", count: total }, ...visible];
  }, [allItems, allCategoryFilters, showAllFilters]);

  /* ── Sort logic ── */
  const sortedItems = useMemo(() => {
    const items = [...allItems];
    switch (sortMode) {
      case "recent":
        return items.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      case "oldest":
        return items.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      case "popular":
        return items.sort((a, b) => b.popularity - a.popularity);
      case "alpha":
        return items.sort((a, b) =>
          normalize(a.title).localeCompare(normalize(b.title), "fr")
        );
      case "shuffle":
        return shuffle(items);
      default:
        return items;
    }
  }, [sortMode, allItems]);

  /* ── Filter logic ── */
  const filteredItems = useMemo(() => {
    return activeFilter === "all"
      ? sortedItems
      : sortedItems.filter((item) => (item.soustopic || "autres") === activeFilter);
  }, [sortedItems, activeFilter]);

  const visibleItems = useMemo(() => {
    return filteredItems.slice(0, visibleLimit);
  }, [filteredItems, visibleLimit]);

  const hasMore = visibleLimit < filteredItems.length;
  const visibleCount = filteredItems.length;

  /* ── Filter label ── */
  const filterLabelText = useMemo(() => {
    if (activeFilter === "all") return "Toutes catégories";
    const found = dynamicFilters.find((f) => f.key === activeFilter);
    return found?.label ?? "Toutes catégories";
  }, [activeFilter, dynamicFilters]);

  /* ── Handle filter click ── */
  const handleFilterClick = useCallback(
    (filterKey: string) => {
      if (filterKey === activeFilter) return;
      const prev = activeFilter;
      prevFilterRef.current = prev;
      setActiveFilter(filterKey);
      setVisibleLimit(ITEMS_PER_LOAD);

      // Mark items that are newly entering (were hidden, now shown)
      const prevVisible = new Set(
        (prev === "all"
          ? allItems
          : allItems.filter((item) => (item.soustopic || "autres") === prev)
        ).map((item) => item.id)
      );
      const nextVisible =
        filterKey === "all"
          ? allItems
          : allItems.filter((item) => (item.soustopic || "autres") === filterKey);

      const newlyVisible = new Set(
        nextVisible.filter((item) => !prevVisible.has(item.id)).map((item) => item.id)
      );

      if (newlyVisible.size > 0) {
        setEnteringIds(newlyVisible);
        // Clear entering state after animation completes
        setTimeout(() => {
          setEnteringIds(new Set());
        }, 500);
      }
    },
    [activeFilter, allItems]
  );

  /* ── Handle sort change ── */
  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSortMode(e.target.value as SortMode);
    },
    []
  );

  /* ── Visible item IDs set for quick lookup ── */
  const visibleIds = useMemo(
    () => new Set(visibleItems.map((item) => item.id)),
    [visibleItems]
  );

  return (
    <section
      className={s.feed}
      aria-labelledby="feed-heading"
    >
      {/* Chapter mark */}
      <div className={`${s.chapterMark} mono`}>
        <span className={s.cNum}>Ch.03</span>
        <span className={s.cSep}>/</span>
        <h2 id="feed-heading" className={s.cLabel}>Derni&egrave;res publications</h2>
      </div>

      <header className={s.sectionHead}>
        <div className={s.sectionLabel}>
          <span className={s.sectionKicker}>
            <span className={s.sectionKickerDot} aria-hidden="true" />
            Fil &middot; Publications
          </span>
          <h3 className={s.sectionTitle}>
            Ce qui vient <em>de para&icirc;tre.</em>
          </h3>
          <p className={s.sectionDeck}>
            Les derniers articles, enqu&ecirc;tes et portraits publi&eacute;s par la
            r&eacute;daction. Du plus r&eacute;cent au plus ancien &mdash; filtrez par
            univers, triez comme vous voulez.
          </p>
        </div>
        <a className={s.sectionAll} href="/articles" aria-label="Tous les articles">
          Tous les articles
          <span className={s.sectionAllArrow} aria-hidden="true">&rarr;</span>
        </a>
      </header>

      {/* Filtres + tri sur une ligne */}
      <nav className={s.feedFilters} aria-label="Filtrer par catégorie">
        {dynamicFilters.map((filter) => (
          <button
            key={filter.key}
            type="button"
            className={`${s.feedFilter}${
              activeFilter === filter.key ? ` ${s.feedFilterActive}` : ""
            }`}
            data-filter={filter.key}
            onClick={() => handleFilterClick(filter.key)}
            style={
              filter.chipColor
                ? ({ "--chip-color": filter.chipColor } as React.CSSProperties)
                : undefined
            }
          >
            <span
              className={`${s.feedFilterDot}${
                filter.key === "all" ? ` ${s.feedFilterDotAll}` : ""
              }`}
            />
            {filter.label}
            <span className={s.feedFilterCount}>{filter.count}</span>
          </button>
        ))}
        {allCategoryFilters.length > MAX_VISIBLE_FILTERS && (
          <button
            type="button"
            className={s.feedFilter}
            onClick={() => setShowAllFilters((v) => !v)}
          >
            {showAllFilters ? "Voir moins" : `+ ${allCategoryFilters.length - MAX_VISIBLE_FILTERS} catégories`}
          </button>
        )}
      </nav>

      {/* Toolbar : filtre actif + tri */}
      <div className={s.feedToolbar}>
        <span className={s.feedToolbarLabel}>
          {filterLabelText}
          <span className={s.feedToolbarSep} aria-hidden="true">&middot;</span>
          {visibleCount} articles
        </span>
        <div className={s.feedSort}>
          <div className={s.feedSortWrap}>
            <select
              id="feed-sort-select"
              className={s.feedSortSelect}
              aria-label="Trier les articles par"
              value={sortMode}
              onChange={handleSortChange}
            >
              <option value="recent">Plus r&eacute;cents</option>
              <option value="oldest">Plus anciens</option>
              <option value="popular">Plus populaires</option>
              <option value="alpha">A &rarr; Z</option>
              <option value="shuffle">Au hasard</option>
            </select>
            <svg
              className={s.feedSortChevron}
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
              width="12"
              height="12"
            >
              <path d="M4 6l4 4 4-4" />
            </svg>
          </div>
        </div>
      </div>

      <ol
        className={s.feedGrid}
        aria-label="Articles du site"
      >
        {sortedItems.map((item) => {
          const visible = visibleIds.has(item.id);
          const entering = enteringIds.has(item.id);
          const suffix = item.headlineSuffix ?? ".";

          const visibleIndex = visibleItems.indexOf(item);
          const isCinematic = visibleIndex >= 0;
          const isFlipped = visibleIndex % 2 === 1;

          return (
            <li
              key={item.id}
              className={`${s.feedItem}${
                isCinematic ? ` ${s.feedItemCinematic}` : ""
              }${
                isFlipped ? ` ${s.feedCineFlipped}` : ""
              }${
                item.isPaywall ? ` ${s.feedItemPaywall}` : ""
              }${!visible ? ` ${s.isFilteredOut}` : ""}${
                entering ? ` ${s.feedEntering}` : ""
              }`}
              style={
                {
                  "--cat-color": item.catColor,
                  "--cat-dark": item.catDark,
                  ...(entering
                    ? {
                        animationDelay: `${
                          visibleIndex * 40
                        }ms`,
                      }
                    : {}),
                } as React.CSSProperties
              }
              itemScope
              itemType={`https://schema.org/${item.schemaType || "Article"}`}
            >
              {isCinematic ? (
                <a href={item.href} className={s.feedCineLink} itemProp="url">
                  <div className={s.feedCineImgWrap}>
                    <img
                      src={sanityImg(item.imgSrc, 800)}
                      alt={item.imgAlt}
                      className={s.feedCineImg}
                      loading="lazy"
                      decoding="async"
                    />
                    <span className={s.feedCineGrad} aria-hidden="true" />
                  </div>
                  <span className={s.feedCineBody}>
                    <span className={s.feedMeta}>
                      <span className={s.feedDot} aria-hidden="true" />
                      <time
                        className={s.feedTime}
                        itemProp={
                          item.schemaType === "VideoObject"
                            ? "uploadDate"
                            : "datePublished"
                        }
                        dateTime={item.date}
                      >
                        {item.timeLabel}
                      </time>
                      <span className={s.feedSep} aria-hidden="true">·</span>
                      <span className={s.feedFormat}>{item.format}</span>
                    </span>
                    <h3 className={s.feedCineH} itemProp="headline">
                      {item.headline}
                      <em>{item.headlineEm}</em>
                      {suffix}
                    </h3>
                    <span className={s.feedCineExcerpt}>{item.excerpt}</span>
                    <span className={s.feedCineFoot}>
                      {item.author} · {item.readTime}
                      <SaveBookmark
                        inline
                        type={item.isVideo ? "video" : "article"}
                        slug={item.href.split("/").pop() || ""}
                        title={item.title}
                        image={item.imgSrc}
                        univers={item.category}
                      />
                    </span>
                  </span>
                  {item.isVideo && (
                    <span className={s.feedCinePlay} aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                        <path d="M8 5.5v13l11-6.5z" />
                      </svg>
                    </span>
                  )}
                </a>
              ) : (
              <a href={item.href} className={s.feedLink} itemProp="url">
                <figure className={s.feedThumb} itemProp="image">
                  <img
                    src={sanityImg(item.imgSrc, 400)}
                    alt={item.imgAlt}
                    loading="lazy"
                    decoding="async"
                  />
                  {item.isVideo && (
                    <span className={s.feedThumbBadge} aria-hidden="true">
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        width="8"
                        height="8"
                      >
                        <path d="M8 5.5v13l11-6.5z" />
                      </svg>
                    </span>
                  )}
                  {item.isPaywall && (
                    <span className={s.feedThumbLock} aria-hidden="true">
                      <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        width="9"
                        height="9"
                      >
                        <rect x="3" y="7" width="10" height="7" rx="1" />
                        <path d="M5 7V5a3 3 0 0 1 6 0v2" />
                      </svg>
                    </span>
                  )}
                </figure>
                <div className={s.feedBody}>
                  <div className={s.feedMeta}>
                    <span className={s.feedDot} aria-hidden="true" />
                    <time
                      className={s.feedTime}
                      itemProp={
                        item.schemaType === "VideoObject"
                          ? "uploadDate"
                          : "datePublished"
                      }
                      dateTime={item.date}
                    >
                      {item.timeLabel}
                    </time>
                    <span className={s.feedSep} aria-hidden="true">
                      ·
                    </span>
                    <span className={s.feedFormat}>{item.format}</span>
                  </div>
                  <h3
                    className={s.feedH}
                    itemProp={
                      item.schemaType === "VideoObject" ||
                      item.schemaType === "Review"
                        ? "name"
                        : "headline"
                    }
                  >
                    {item.headline}
                    <em>{item.headlineEm}</em>
                    {suffix}
                  </h3>
                  {item.excerpt && (
                    <p className={s.feedExcerpt}>{item.excerpt}</p>
                  )}
                  <footer className={s.feedFoot}>
                    <span
                      itemProp="author"
                      itemScope
                      itemType="https://schema.org/Person"
                    >
                      <span itemProp="name">{item.author}</span>
                    </span>
                    <span className={s.feedSep} aria-hidden="true">
                      ·
                    </span>
                    <span>{item.readTime}</span>
                    <SaveBookmark
                      inline
                      type={item.isVideo ? "video" : "article"}
                      slug={item.href.split("/").pop() || ""}
                      title={item.title}
                      image={item.imgSrc}
                      univers={item.category}
                    />
                    <span className={s.feedFootRead} aria-hidden="true">
                      Lire →
                    </span>
                  </footer>
                </div>
              </a>
              )}
            </li>
          );
        })}

        {/* Voir plus */}
        {hasMore && (
          <li className={s.feedLoadMore}>
            <button
              type="button"
              className={s.feedLoadMoreBtn}
              onClick={() => setVisibleLimit((v) => v + ITEMS_PER_LOAD)}
            >
              Voir plus ({filteredItems.length - visibleLimit} restants)
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14" aria-hidden="true">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </li>
        )}

        {/* CTA cassure — bande encre + pastilles univers */}
        <li className={s.feedGridCta}>
          <a href="/articles" className={s.feedGridCtaLink}>
            {/* Colonne gauche : nombre monumental */}
            <span className={s.feedGridCtaLeft}>
              <span className={s.feedGridCtaNum}>{TOTAL_ARTICLES}</span>
              <span className={s.feedGridCtaItalic}>histoires à explorer</span>
            </span>

            {/* Colonne droite : univers + action */}
            <span className={s.feedGridCtaRight}>
              <span className={s.feedGridCtaUniversLabel}>5 univers</span>
              <span className={s.feedGridCtaPills}>
                {PILLS.map((pill) => (
                  <span
                    key={pill.label}
                    className={s.feedGridCtaPill}
                    style={{ "--pill": pill.color } as React.CSSProperties}
                  >
                    {pill.label}
                  </span>
                ))}
              </span>
              <span className={s.feedGridCtaRule} aria-hidden="true" />
              <span className={s.feedGridCtaAction}>
                <span className={s.feedGridCtaLabel}>Tous les articles</span>
                <svg
                  className={s.feedGridCtaArrow}
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </span>
          </a>
        </li>
      </ol>

      {/* Message "aucun résultat" affiché si filtre vide */}
      {visibleCount === 0 && (
        <p className={s.feedEmpty}>
          Aucun article pour cet univers dans la sélection du mois.{" "}
          <a href="/articles">Voir tous les articles →</a>
        </p>
      )}
    </section>
  );
}
