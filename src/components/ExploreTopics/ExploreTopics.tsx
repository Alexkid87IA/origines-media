import { useState, useMemo, useCallback } from "react";
import { UNIVERS, UNIVERS_MAP, type UniversId } from "@/data/univers";
import { useSanityQuery } from "@/hooks/useSanityQuery";
import { V2_EXPLORE_QUERY } from "@/lib/queries";
import { smartExcerpt, estimateReadingTimeFromText } from "@/lib/typography";
import { sanityImg } from "@/lib/sanityImage";
import { verticaleToUnivers } from "@/data/univers";
import SaveBookmark from "@/components/SaveButton/SaveBookmark";
import s from "./ExploreTopics.module.css";

interface SanityExploreArticle {
  _id: string;
  titre: string;
  extrait?: string;
  description?: string;
  contenuTexte?: string;
  imageUrl?: string;
  slug?: string;
  datePublication?: string;
  tempsLecture?: number;
  univpilar?: string;
  soustopic?: string;
  typeArticle?: string;
  videoUrl?: string;
  verticaleNom?: string;
  authorName?: string;
}

interface ArticleItem {
  id: string;
  univers: UniversId;
  subtopic: string;
  date: string;
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
  isVideo?: boolean;
  category: string;
}

interface SubtopicDef {
  slug: string;
  label: string;
  univers: UniversId;
  color: string;
  count: number;
}

const SOUSTOPIC_LABELS: Record<string, string> = {
  emotions: "Émotions", conscience: "Conscience", meditation: "Méditation",
  "developpement-personnel": "Développement personnel", neurosciences: "Neurosciences",
  philosophie: "Philosophie", "quete-de-sens": "Quête de sens", therapies: "Thérapies",
  nutrition: "Nutrition", sommeil: "Sommeil", mouvement: "Mouvement",
  prevention: "Prévention", "bien-etre-physique": "Bien-être physique",
  sport: "Sport", respiration: "Respiration",
  parentalite: "Parentalité", couples: "Couples", amitie: "Amitié",
  education: "Éducation", generations: "Générations", communaute: "Communauté",
  ruptures: "Ruptures", "enquetes-sociales": "Enquêtes sociales",
  "recits-de-voyage": "Récits de voyage", destinations: "Destinations",
  art: "Art", musique: "Musique", litterature: "Littérature",
  cinema: "Cinéma", creativite: "Créativité", photographie: "Photographie",
  carriere: "Carrière", entrepreneuriat: "Entrepreneuriat", innovation: "Innovation",
  ia: "Intelligence artificielle", economie: "Économie",
  leadership: "Leadership", numerique: "Numérique", nomadisme: "Nomadisme",
};

const MAX_VISIBLE = 12;
const ALL_KEY = "all";

function formatTimeLabel(dateStr?: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const diffMs = Date.now() - d.getTime();
  if (diffMs < 0) return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  const diffH = Math.floor(diffMs / 3600000);
  if (diffH < 1) return "il y a quelques min";
  if (diffH < 24) return `il y a ${diffH} h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return "hier";
  if (diffD < 7) return `il y a ${diffD} j`;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function buildArticleItem(a: SanityExploreArticle): ArticleItem {
  const univers = (a.univpilar || "esprit") as UniversId;
  const u = UNIVERS_MAP[univers] || UNIVERS_MAP.esprit;
  const isVideo = a.typeArticle === "video" || !!a.videoUrl;
  const title = a.titre || "";
  const spaceIdx = title.indexOf(" ", Math.floor(title.length * 0.4));
  const splitAt = spaceIdx > 0 ? spaceIdx : Math.floor(title.length * 0.4);
  const stLabel = a.soustopic ? (SOUSTOPIC_LABELS[a.soustopic] || a.soustopic) : "";
  const excerpt = a.extrait || a.description || "";

  return {
    id: a._id,
    univers,
    subtopic: a.soustopic || "",
    date: a.datePublication || "",
    title,
    href: isVideo ? `/video/${a.slug}` : `/article/${a.slug}`,
    imgSrc: sanityImg(a.imageUrl, 400) || "/placeholder.svg",
    imgAlt: title,
    timeLabel: formatTimeLabel(a.datePublication),
    format: stLabel ? `${isVideo ? "Vidéo" : "Article"} · ${u.name}` : `${isVideo ? "Vidéo" : "Article"} · ${u.name}`,
    headline: title.slice(0, splitAt) + " ",
    headlineEm: title.slice(splitAt).split(/[.!?]/)[0],
    headlineSuffix: ".",
    excerpt: smartExcerpt(excerpt || a.contenuTexte || "", 160),
    author: a.authorName || "Rédaction Origines",
    readTime: `${estimateReadingTimeFromText(a.contenuTexte) || a.tempsLecture || 5} min`,
    isVideo,
    category: u.name,
  };
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ExploreTopics() {
  const { data: rawArticles } = useSanityQuery<SanityExploreArticle[]>("explore-topics", V2_EXPLORE_QUERY);

  const articles = useMemo(
    () => (rawArticles || []).map(buildArticleItem),
    [rawArticles]
  );

  const [active, setActive] = useState<string>(ALL_KEY);
  const [showAll, setShowAll] = useState(false);
  const [entering, setEntering] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0);

  const subtopics = useMemo(() => {
    const counts: Record<string, number> = {};
    articles.forEach((a) => { if (a.subtopic) counts[a.subtopic] = (counts[a.subtopic] || 0) + 1; });
    return Object.entries(counts)
      .map(([slug, count]) => {
        const u = UNIVERS.find((u) => u.subtopics.some((st) => st.slug === slug));
        return {
          slug,
          label: SOUSTOPIC_LABELS[slug] || slug,
          univers: (u?.id || "esprit") as UniversId,
          color: u?.color || "#7B5CD6",
          count,
        };
      })
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "fr"));
  }, [articles]);

  const visiblePills = useMemo(
    () => (showAll ? subtopics : subtopics.slice(0, MAX_VISIBLE)),
    [showAll, subtopics]
  );

  const hiddenCount = subtopics.length - MAX_VISIBLE;

  const filteredArticles = useMemo(() => {
    if (active === ALL_KEY) {
      void shuffleKey;
      return shuffle(articles).slice(0, 12);
    }
    return articles
      .filter((a) => a.subtopic === active)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 12);
  }, [active, shuffleKey, articles]);

  const activeLabel = useMemo(() => {
    if (active === ALL_KEY) return "Tous les thèmes";
    return subtopics.find((st) => st.slug === active)?.label ?? active;
  }, [active, subtopics]);

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

  if (!rawArticles) return null;

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

      <nav className={s.pills} aria-label="Filtrer par thème">
        <button
          type="button"
          className={`${s.pill}${active === ALL_KEY ? ` ${s.pillActive}` : ""}`}
          onClick={() => handlePillClick(ALL_KEY)}
        >
          <span className={`${s.pillDot} ${s.pillDotAll}`} />
          Tout
          <span className={s.pillCount}>{articles.length}</span>
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

      <a href="/articles" className={s.cta}>
        <span className={s.ctaLeft}>
          <span className={s.ctaNum}>{articles.length}</span>
          <span className={s.ctaItalic}>articles &agrave; explorer</span>
        </span>
        <span className={s.ctaRight}>
          <span className={s.ctaUniversLabel}>5 univers &middot; {subtopics.length} th&egrave;mes</span>
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
