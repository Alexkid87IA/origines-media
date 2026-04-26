import { useState, useMemo, useCallback } from "react";
import { UNIVERS, UNIVERS_MAP, ARTICLES, TOTAL_ARTICLES, type UniversId } from "@/data/univers";
import SaveBookmark from "@/components/SaveButton/SaveBookmark";
import s from "./ExploreTopics.module.css";

interface SubtopicDef {
  slug: string;
  label: string;
  univers: UniversId;
  color: string;
  count: number;
}

const MAX_VISIBLE = 12;

const ALL_SUBTOPICS: SubtopicDef[] = UNIVERS.flatMap((u) =>
  u.subtopics.map((st) => {
    const count = ARTICLES.filter((a) => a.subtopic === st.slug).length;
    return {
      slug: st.slug,
      label: st.label,
      univers: u.id,
      color: u.color,
      count,
    };
  })
).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "fr"));

const ALL_KEY = "all";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ExploreTopics() {
  const [active, setActive] = useState<string>(ALL_KEY);
  const [showAll, setShowAll] = useState(false);
  const [entering, setEntering] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0);

  const visiblePills = useMemo(
    () => (showAll ? ALL_SUBTOPICS : ALL_SUBTOPICS.slice(0, MAX_VISIBLE)),
    [showAll]
  );

  const hiddenCount = ALL_SUBTOPICS.length - MAX_VISIBLE;

  const filteredArticles = useMemo(() => {
    if (active === ALL_KEY) {
      void shuffleKey;
      return shuffle(ARTICLES).slice(0, 12);
    }
    return ARTICLES
      .filter((a) => a.subtopic === active)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 12);
  }, [active, shuffleKey]);

  const activeLabel = useMemo(() => {
    if (active === ALL_KEY) return "Tous les thèmes";
    return ALL_SUBTOPICS.find((st) => st.slug === active)?.label ?? active;
  }, [active]);

  const handlePillClick = useCallback(
    (slug: string) => {
      if (slug === active) {
        if (slug === ALL_KEY) {
          setShuffleKey((k) => k + 1);
          setEntering(true);
          setTimeout(() => setEntering(false), 500);
        }
        return;
      }
      setActive(slug);
      if (slug === ALL_KEY) setShuffleKey((k) => k + 1);
      setEntering(true);
      setTimeout(() => setEntering(false), 500);
    },
    [active]
  );

  return (
    <section className={s.explore} aria-labelledby="explore-heading">
      <div className={`${s.chapterMark} mono`}>
        <span className={s.cNum}>Ch.04</span>
        <span className={s.cSep}>/</span>
        <h2 id="explore-heading" className={s.cLabel}>Explorer par th&egrave;me</h2>
      </div>

      <header className={s.sectionHead}>
        <div className={s.sectionLabel}>
          <span className={s.sectionKicker}>
            <span className={s.sectionKickerDot} aria-hidden="true" />
            Th&egrave;mes &middot; Sous-cat&eacute;gories
          </span>
          <h3 className={s.sectionTitle}>
            Trouvez ce qui <em>vous parle.</em>
          </h3>
          <p className={s.sectionDeck}>
            &Eacute;motions, neurosciences, parentalit&eacute;, cin&eacute;ma, leadership&hellip;
            S&eacute;lectionnez un th&egrave;me pour d&eacute;couvrir les derniers articles publi&eacute;s.
          </p>
        </div>
        <a className={s.sectionAll} href="/articles" aria-label="Tous les articles">
          Tous les articles
          <span className={s.sectionAllArrow} aria-hidden="true">&rarr;</span>
        </a>
      </header>

      {/* Subtopic pills */}
      <nav className={s.pills} aria-label="Filtrer par thème">
        <button
          type="button"
          className={`${s.pill}${active === ALL_KEY ? ` ${s.pillActive}` : ""}`}
          onClick={() => handlePillClick(ALL_KEY)}
        >
          <span className={`${s.pillDot} ${s.pillDotAll}`} />
          Tout
          <span className={s.pillCount}>{ARTICLES.length}</span>
        </button>
        {visiblePills.map((st) => (
          <button
            key={st.slug}
            type="button"
            className={`${s.pill}${active === st.slug ? ` ${s.pillActive}` : ""}`}
            onClick={() => handlePillClick(st.slug)}
            style={{ "--pill-color": st.color } as React.CSSProperties}
          >
            <span className={s.pillDot} />
            {st.label}
            {st.count > 0 && (
              <span className={s.pillCount}>{st.count}</span>
            )}
          </button>
        ))}
        {hiddenCount > 0 && (
          <button
            type="button"
            className={s.pill}
            onClick={() => setShowAll((v) => !v)}
          >
            {showAll ? "Voir moins" : `+ ${hiddenCount} thèmes`}
          </button>
        )}
      </nav>

      {/* Articles */}
      {filteredArticles.length > 0 && (
        <>
          <div className={s.toolbar}>
            <span className={s.toolbarLabel}>
              {activeLabel}
              <span className={s.toolbarSep} aria-hidden="true">&middot;</span>
              {filteredArticles.length} article{filteredArticles.length > 1 ? "s" : ""}
            </span>
          </div>

          <ol className={s.cardGrid}>
            {filteredArticles.map((item, i) => {
              const u = UNIVERS_MAP[item.univers];
              return (
                <li
                  key={item.id}
                  className={`${s.card}${entering ? ` ${s.cardEntering}` : ""}`}
                  style={{
                    "--cat-color": u.color,
                    "--cat-dark": u.dark,
                    ...(entering ? { animationDelay: `${i * 40}ms` } : {}),
                  } as React.CSSProperties}
                >
                  <a href={item.href} className={s.cardLink}>
                    <figure className={s.cardImg}>
                      <img
                        src={item.imgSrc}
                        alt={item.imgAlt}
                        loading="lazy"
                        decoding="async"
                      />
                      {item.isVideo && (
                        <span className={s.cardPlay} aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="currentColor" width="10" height="10">
                            <path d="M8 5.5v13l11-6.5z" />
                          </svg>
                        </span>
                      )}
                      {item.isPaywall && (
                        <span className={s.cardLock} aria-hidden="true">
                          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" width="9" height="9">
                            <rect x="3" y="7" width="10" height="7" rx="1" />
                            <path d="M5 7V5a3 3 0 0 1 6 0v2" />
                          </svg>
                        </span>
                      )}
                    </figure>
                    <div className={s.cardBody}>
                      <div className={s.cardMeta}>
                        <span className={s.cardDot} aria-hidden="true" />
                        <time className={s.cardTime} dateTime={item.date}>
                          {item.timeLabel}
                        </time>
                        <span className={s.cardSep} aria-hidden="true">&middot;</span>
                        <span className={s.cardFormat}>{item.format}</span>
                      </div>
                      <h4 className={s.cardH}>
                        {item.headline}
                        <em>{item.headlineEm}</em>
                        {item.headlineSuffix}
                      </h4>
                      {item.excerpt && (
                        <p className={s.cardExcerpt}>{item.excerpt}</p>
                      )}
                      <footer className={s.cardFoot}>
                        <span>{item.author}</span>
                        <span className={s.cardSep} aria-hidden="true">&middot;</span>
                        <span>{item.readTime}</span>
                        <SaveBookmark
                          inline
                          type={item.isVideo ? "video" : "article"}
                          slug={item.href.split("/").pop() || ""}
                          title={item.title}
                          image={item.imgSrc}
                          univers={item.category}
                        />
                      </footer>
                    </div>
                  </a>
                </li>
              );
            })}
          </ol>
        </>
      )}

      {filteredArticles.length === 0 && (
        <p className={s.empty}>
          Aucun article pour ce th&egrave;me dans la s&eacute;lection du mois.{" "}
          <a href="/articles">Voir tous les articles &rarr;</a>
        </p>
      )}

      {/* CTA — Explorer toute la librairie */}
      <a href="/articles" className={s.cta}>
        <span className={s.ctaLeft}>
          <span className={s.ctaNum}>{TOTAL_ARTICLES}</span>
          <span className={s.ctaItalic}>articles &agrave; explorer</span>
        </span>
        <span className={s.ctaRight}>
          <span className={s.ctaUniversLabel}>5 univers &middot; 40 th&egrave;mes</span>
          <span className={s.ctaPills}>
            {UNIVERS.map((u) => (
              <span
                key={u.id}
                className={s.ctaPill}
                style={{ "--pill": u.color } as React.CSSProperties}
              >
                {u.name}
              </span>
            ))}
          </span>
          <span className={s.ctaRule} aria-hidden="true" />
          <span className={s.ctaAction}>
            <span className={s.ctaLabel}>Toute la librairie</span>
            <svg
              className={s.ctaArrow}
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
    </section>
  );
}
