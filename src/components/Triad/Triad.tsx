import { UNIVERS, UNIVERS_MAP, getArticlesByUnivers, type UniversId } from "@/data/univers";
import s from "./Triad.module.css";

export interface CMSTriadArticle {
  univers: UniversId;
  title: string;
  href: string;
  imgSrc: string;
  imgAlt: string;
}

export interface CMSTriadUnivers {
  id: UniversId;
  articles: CMSTriadArticle[];
}

interface TriadProps {
  cmsUnivers?: CMSTriadUnivers[];
}

/* ------------------------------------------------------------------ */
/*  Icons per univers (outline, 18×18)                                 */
/* ------------------------------------------------------------------ */

const ICONS: Record<UniversId, React.ReactNode> = {
  esprit: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className={s.cardSvg}>
      <path d="M12 2a7 7 0 017 7c0 3-1.5 4.5-3 6-.7.7-1 1.5-1 2.5V19a2 2 0 01-2 2h-2a2 2 0 01-2-2v-1.5c0-1-.3-1.8-1-2.5C6.5 13.5 5 12 5 9a7 7 0 017-7z" />
      <path d="M9 19h6M10 22h4" />
      <path d="M12 2v3M8.5 6l1.5 2M15.5 6l-1.5 2" />
    </svg>
  ),
  corps: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className={s.cardSvg}>
      <circle cx="12" cy="4" r="2.5" />
      <path d="M12 8v5M12 13l-4 7M12 13l4 7" />
      <path d="M8 10l-4 3M16 10l4 3" />
    </svg>
  ),
  liens: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className={s.cardSvg}>
      <path d="M17 8a5 5 0 00-10 0c0 4 5 8 5 12 0-4 5-8 5-12z" />
      <path d="M12 20c0 0-3-2.5-3-5a3 3 0 016 0c0 2.5-3 5-3 5z" />
    </svg>
  ),
  monde: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className={s.cardSvg}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3.5 9h17M3.5 15h17" />
      <path d="M12 3c2 2.5 3.2 5.5 3.2 9S14 18.5 12 21c-2-2.5-3.2-5.5-3.2-9S10 5.5 12 3z" />
    </svg>
  ),
  avenir: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className={s.cardSvg}>
      <path d="M12 2l3 7h7l-5.5 4.5 2 7L12 16l-6.5 4.5 2-7L2 9h7l3-7z" />
    </svg>
  ),
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Triad({ cmsUnivers }: TriadProps) {
  return (
    <div className={s.categories}>
      <div className={`${s.chapterMark} mono`}>
        <span className={s.cNum}>Ch.04</span>
        <span className={s.cSep}>/</span>
        <span className={s.cLabel}>Nos univers</span>
      </div>

      <header className={s.sectionHead}>
        <div className={s.sectionLabel}>
          <span className={s.sectionKicker}>
            <span className={s.sectionKickerDot} aria-hidden="true" />
            Univers &middot; Exploration
          </span>
          <h3 className={s.sectionTitle}>
            Cinq regards <em>sur le monde.</em>
          </h3>
          <p className={s.sectionDeck}>
            Esprit, Corps, Liens, Monde, Avenir &mdash; cinq univers pour explorer ce qui
            nous traverse. Chacun avec sa voix, ses auteurs, ses obsessions.
          </p>
        </div>
        <a className={s.sectionAll} href="/univers" aria-label="Tous les univers">
          Tous les univers
          <span className={s.sectionAllArrow} aria-hidden="true">&rarr;</span>
        </a>
      </header>

      <div className={s.grid}>
        {UNIVERS.map((u) => {
          const cmsMatch = cmsUnivers?.find((cu) => cu.id === u.id);
          const top3 = cmsMatch
            ? cmsMatch.articles.slice(0, 3).map((a) => ({
                href: a.href,
                imgSrc: a.imgSrc,
                imgAlt: a.imgAlt,
                headline: "",
                headlineEm: a.title,
                headlineSuffix: ".",
              }))
            : getArticlesByUnivers(u.id).slice(0, 3).map((a) => ({
                href: a.href,
                imgSrc: a.imgSrc,
                imgAlt: a.imgAlt,
                headline: a.headline,
                headlineEm: a.headlineEm,
                headlineSuffix: a.headlineSuffix,
              }));
          if (top3.length === 0) return null;

          return (
            <article
              key={u.id}
              className={s.card}
              style={{ "--u-color": u.color } as React.CSSProperties}
            >
              <a href={top3[0].href} className={s.cardImgLink} tabIndex={-1}>
                <img
                  src={top3[0].imgSrc}
                  alt={top3[0].imgAlt}
                  className={s.cardImg}
                  loading="lazy"
                  decoding="async"
                />
              </a>

              <div className={s.cardBody}>
                <div className={s.cardHeader}>
                  <span className={s.cardDot} />
                  {ICONS[u.id]}
                  <h3 className={s.cardName}>{u.name}</h3>
                </div>
                <p className={s.cardTagline}>{u.tagline}</p>

                <div className={s.cardArticles}>
                  {top3.map((article) => (
                    <a key={article.href} href={article.href} className={s.cardLink}>
                      <h4 className={s.cardTitle}>
                        {article.headline}
                        <em>{article.headlineEm}</em>
                        {article.headlineSuffix}
                      </h4>
                    </a>
                  ))}
                </div>

                <div className={s.cardFoot}>
                  <a href={`/${u.id}`} className={s.cardExplore}>
                    Explorer
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
