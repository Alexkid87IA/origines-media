import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import SEO from "@/components/SEO";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import { sanityFetch } from "@/lib/sanity";
import SaveBookmark from "@/components/SaveButton/SaveBookmark";
import Breadcrumb from '@/components/ui/Breadcrumb';
import s from "./RecommandationTypePage.module.css";

interface Recommendation {
  _id: string;
  titre: string;
  type: string;
  auteur?: string;
  note?: number;
  coupDeCoeur?: boolean;
  accroche?: string;
  imageUrl?: string;
  slug: string;
  datePublication?: string;
}

interface RecoTypeConfig {
  label: string;
  color: string;
  plural: string;
  description: string;
  faq: Array<{ question: string; answer: string }>;
  related: string[];
}

const RECO_TYPES: Record<string, RecoTypeConfig> = {
  livres: { label: "Livres", color: "#E11D48", plural: "livres", description: "Romans, essais, récits : les livres qui ont marqué notre rédaction. Des lectures choisies pour leur capacité à transformer le regard, nourrir la réflexion ou simplement offrir un moment d'évasion.", faq: [{ question: "Comment choisissez-vous les livres recommandés ?", answer: "Chaque livre est lu par au moins un membre de la rédaction. Nous privilégions les ouvrages qui ouvrent une perspective nouvelle, qu'ils soient récents ou classiques." }, { question: "Recommandez-vous uniquement des livres récents ?", answer: "Non. Un bon livre n'a pas de date de péremption. Nos sélections mêlent nouveautés et classiques intemporels." }], related: ["podcasts", "culture", "films-series"] },
  "films-series": { label: "Films & Séries", color: "#7C3AED", plural: "films & séries", description: "Les films et séries qui méritent votre temps. Drames, documentaires, thrillers psychologiques : des œuvres qui font réfléchir autant qu'elles divertissent.", faq: [{ question: "Recommandez-vous uniquement des films d'auteur ?", answer: "Non. Nous recommandons tout ce qui est bien fait et qui fait penser, du blockbuster intelligent au film indépendant. Le critère est l'impact, pas le genre." }, { question: "Où peut-on regarder les films recommandés ?", answer: "Nous indiquons la plateforme de disponibilité quand c'est possible (Netflix, Arte, Prime Video, cinéma). Certaines œuvres sont disponibles gratuitement en replay." }], related: ["livres", "culture", "musique"] },
  musique: { label: "Musique", color: "#2563EB", plural: "musiques", description: "Albums, artistes, playlists : nos découvertes musicales à travers tous les genres. De la musique qui accompagne les moments de vie, de la concentration à la contemplation.", faq: [{ question: "Quels genres musicaux recommandez-vous ?", answer: "Tous, sans hiérarchie. Jazz, électro, classique, hip-hop, world music : le seul critère est l'authenticité et la qualité de la proposition artistique." }, { question: "Proposez-vous des playlists ?", answer: "Oui. Chaque recommandation musicale est accompagnée de suggestions d'écoute et parfois de playlists thématiques sur les plateformes de streaming." }], related: ["culture", "films-series", "podcasts"] },
  podcasts: { label: "Podcasts", color: "#0D9488", plural: "podcasts", description: "Les podcasts qui valent le détour. Interviews de fond, récits immersifs, analyses : du contenu audio pour apprendre en marchant, en cuisinant ou en méditant.", faq: [{ question: "Recommandez-vous des podcasts francophones et anglophones ?", answer: "Les deux. La majorité de nos sélections sont francophones, mais certains podcasts anglophones incontournables sont inclus avec une note sur le niveau de langue requis." }, { question: "Combien de temps durent les podcasts recommandés ?", answer: "De 15 minutes à 2 heures selon les formats. Nous précisons toujours la durée et le format (interview, narratif, solo) pour vous aider à choisir." }], related: ["youtube", "livres", "musique"] },
  youtube: { label: "YouTube", color: "#DC2626", plural: "chaînes YouTube", description: "Les chaînes YouTube qui élèvent le débat. Vulgarisation, documentaires indépendants, créateurs de contenu : le meilleur de la plateforme, trié pour vous.", faq: [{ question: "Comment sélectionnez-vous les chaînes YouTube ?", answer: "Nous évaluons la rigueur du contenu, la qualité de la production et la régularité. Une bonne chaîne YouTube allie divertissement et substance." }, { question: "Recommandez-vous des chaînes pour enfants ?", answer: "Pas pour l'instant, mais c'est une demande fréquente. Nos recommandations ciblent un public adulte curieux." }], related: ["podcasts", "films-series", "culture"] },
  "reseaux-sociaux": { label: "Réseaux sociaux", color: "#0891B2", plural: "comptes sociaux", description: "Les comptes qui valent le follow. Instagram, TikTok, LinkedIn : des créateurs qui informent, inspirent et questionnent — loin du bruit ambiant.", faq: [{ question: "Sur quels réseaux sociaux recommandez-vous des comptes ?", answer: "Principalement Instagram, TikTok et LinkedIn. Nous sélectionnons des créateurs qui apportent de la valeur, pas du bruit." }, { question: "Comment éviter le contenu toxique sur les réseaux sociaux ?", answer: "Curez votre feed intentionnellement : désabonnez-vous des comptes qui vous font du mal, et suivez ceux qui vous apprennent quelque chose. La qualité de votre expérience dépend de vos choix de suivi." }], related: ["youtube", "podcasts", "culture"] },
  activite: { label: "Activités", color: "#16A34A", plural: "activités", description: "Les expériences à vivre. Ateliers, retraites, événements, pratiques : des activités testées et recommandées pour enrichir votre quotidien.", faq: [{ question: "Les activités recommandées sont-elles accessibles à tous ?", answer: "Nous essayons de proposer des activités à différents niveaux de prix et d'accessibilité. Chaque fiche précise le coût, le lieu et le niveau requis." }, { question: "Recommandez-vous des activités partout en France ?", answer: "Principalement en Île-de-France et dans les grandes villes, mais de plus en plus d'activités en ligne ou en régions sont incluses dans nos sélections." }], related: ["destination", "culture", "produit"] },
  destination: { label: "Destinations", color: "#EA580C", plural: "destinations", description: "Les lieux qui méritent le voyage. Villes, régions, pays : des destinations choisies pour leur authenticité, leur beauté ou leur capacité à transformer ceux qui les visitent.", faq: [{ question: "Vos destinations sont-elles toutes lointaines ?", answer: "Non. Certaines de nos meilleures recommandations sont à moins de 2 heures de Paris. Le dépaysement n'est pas une question de distance mais de regard." }, { question: "Prenez-vous en compte l'impact écologique des voyages ?", answer: "Oui. Nous favorisons le slow travel, les destinations accessibles en train, et mentionnons systématiquement les alternatives bas-carbone quand elles existent." }], related: ["activite", "culture", "produit"] },
  culture: { label: "Culture", color: "#9333EA", plural: "recommandations culture", description: "Expositions, spectacles, festivals, lieux : la culture sous toutes ses formes. Des sorties et des découvertes pour nourrir la curiosité et élargir les horizons.", faq: [{ question: "Vos recommandations culturelles sont-elles uniquement parisiennes ?", answer: "Non. Nous couvrons des événements et lieux dans toute la France, et incluons des ressources culturelles en ligne accessibles de partout." }, { question: "Recommandez-vous des activités culturelles gratuites ?", answer: "Oui. De nombreux musées sont gratuits le premier dimanche du mois, et les événements en plein air, bibliothèques et galeries offrent un accès libre à la culture." }], related: ["films-series", "livres", "musique"] },
  produit: { label: "Produits", color: "#CA8A04", plural: "produits", description: "Les objets qui améliorent le quotidien. Livres, accessoires, outils : des produits testés et sélectionnés par la rédaction, sans placement ni partenariat.", faq: [{ question: "Êtes-vous rémunérés pour vos recommandations produits ?", answer: "Non. Toutes nos recommandations sont indépendantes. Nous ne faisons pas de placement de produit et n'acceptons pas de rémunération des marques." }, { question: "Comment testez-vous les produits ?", answer: "Chaque produit recommandé a été utilisé par un membre de la rédaction pendant au moins deux semaines. Nous ne recommandons que ce que nous utiliserions nous-mêmes." }], related: ["activite", "livres", "destination"] },
};

const TYPE_ALIASES: Record<string, string[]> = {
  livres: ["livres", "livre"],
  "films-series": ["films-series", "film"],
  podcasts: ["podcasts", "podcast"],
};

const ITEMS_PER_PAGE = 12;

function formatDate(dateString: string): string {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function buildQuery(typeId: string): string {
  const aliases = TYPE_ALIASES[typeId];
  const filter = aliases
    ? `type in [${aliases.map((a) => `"${a}"`).join(", ")}]`
    : `type == "${typeId}"`;
  return `
    *[_type == "recommendation" && ${filter} && defined(slug.current)] | order(datePublication desc, _createdAt desc) {
      _id, titre, type, auteur, note, coupDeCoeur, accroche,
      "imageUrl": coalesce(image.asset->url, imageUrl),
      "slug": slug.current,
      "datePublication": coalesce(datePublication, _createdAt)
    }
  `;
}

function renderStars(note: number) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        className={i <= note ? s.starFilled : s.starEmpty}
        aria-hidden="true"
      >
        ★
      </span>
    );
  }
  return <span className={s.stars}>{stars}</span>;
}

export default function RecommandationTypePage() {
  const { slug: typeId } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [recos, setRecos] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [sortBy, setSortBy] = useState(searchParams.get("tri") || "recent");

  const typeConfig = typeId && typeId in RECO_TYPES ? RECO_TYPES[typeId] : null;

  useEffect(() => {
    document.body.style.background = "var(--paper)";
    document.body.style.color = "var(--ink)";
    return () => {
      document.body.style.background = "";
      document.body.style.color = "";
    };
  }, []);

  useEffect(() => {
    if (!typeId) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await sanityFetch<Recommendation[]>(buildQuery(typeId));
        setRecos(data || []);
      } catch {
        setRecos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [typeId]);

  const sortedRecos = useMemo(() => {
    const result = [...recos];
    if (sortBy === "recent") {
      result.sort(
        (a, b) =>
          new Date(b.datePublication || "").getTime() -
          new Date(a.datePublication || "").getTime()
      );
    } else if (sortBy === "alpha") {
      result.sort((a, b) =>
        (a.titre || "").localeCompare(b.titre || "", "fr")
      );
    } else if (sortBy === "note") {
      result.sort((a, b) => (b.note || 0) - (a.note || 0));
    } else if (sortBy === "coups") {
      result.sort((a, b) =>
        a.coupDeCoeur === b.coupDeCoeur ? 0 : a.coupDeCoeur ? -1 : 1
      );
    }
    return result;
  }, [recos, sortBy]);

  const totalPages = Math.ceil(sortedRecos.length / ITEMS_PER_PAGE);
  const paginatedRecos = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedRecos.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedRecos, currentPage]);

  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      setSortBy(val);
      const p = new URLSearchParams(searchParams);
      if (val === "recent") p.delete("tri");
      else p.set("tri", val);
      p.delete("page");
      setSearchParams(p);
    },
    [searchParams, setSearchParams]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      const p = new URLSearchParams(searchParams);
      p.set("page", page.toString());
      setSearchParams(p);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [searchParams, setSearchParams]
  );

  if (!typeConfig) {
    return (
      <>
        <SiteHeader />
        <main className={s.page}>
          <div className="v2-container">
            <div className={s.empty}>
              <h2 className={s.emptyTitle}>Catégorie introuvable</h2>
              <p className={s.emptyText}>
                Cette catégorie de recommandation n&rsquo;existe pas.
              </p>
              <Link to="/recommandations" className={s.emptyCta}>
                Toutes les recommandations &rarr;
              </Link>
            </div>
          </div>
        </main>
        <Footer2 />
      </>
    );
  }

  const color = typeConfig.color;

  return (
    <>
      <SEO
        title={`${typeConfig.label} — Recommandations · Origines Media`}
        description={typeConfig.description}
        url={`/recommandations/${typeId}`}
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: "Recommandations", url: "/recommandations" },
          {
            name: typeConfig.label,
            url: `/recommandations/${typeId}`,
          },
        ]}
        faqData={typeConfig.faq}
        itemListData={recos
          .filter((r) => r.imageUrl)
          .slice(0, 10)
          .map((r) => ({
            name: r.titre,
            description: r.accroche || "",
            image: r.imageUrl!,
            url: `/recommandations/${r.slug}`,
          }))}
      />
      <SiteHeader />

      <main id="main" role="main">
        <div className="v2-container">
          <Breadcrumb items={[
            { name: "Accueil", url: "/" },
            { name: "Recommandations", url: "/recommandations" },
            { name: typeConfig.label, url: `/recommandations/${typeId}` },
          ]} />
          {/* Hero */}
          <header
            className={s.hero}
            style={{ "--type-color": color } as React.CSSProperties}
          >

            <div className={s.heroContent}>
              <span className={s.heroKicker}>
                <span
                  className={s.heroKickerDot}
                  style={{ background: color }}
                  aria-hidden="true"
                />
                Recommandations
              </span>
              <h1 className={s.heroTitle}>{typeConfig.label}</h1>
              {!loading && (
                <p className={s.heroDeck}>
                  {recos.length} {typeConfig.plural} recommand&eacute;
                  {recos.length !== 1 ? "s" : ""} par la r&eacute;daction.
                </p>
              )}
              <p className={s.heroDescription}>{typeConfig.description}</p>
            </div>

            <div className={s.heroAccent} style={{ background: color }} />
          </header>

          {/* Category navigation */}
          <nav className={s.typeNav} aria-label="Catégories">
            <Link
              to="/recommandations"
              className={s.typeChip}
            >
              Toutes
            </Link>
            {Object.entries(RECO_TYPES).map(([key, cfg]) => (
              <Link
                key={key}
                to={`/recommandations/${key}`}
                className={`${s.typeChip} ${key === typeId ? s.typeChipActive : ""}`}
                style={
                  key === typeId
                    ? ({ "--type-color": cfg.color } as React.CSSProperties)
                    : undefined
                }
              >
                {cfg.label}
              </Link>
            ))}
          </nav>

          {/* Toolbar */}
          <div className={s.toolbar}>
            <span className={`${s.resultCount} mono`}>
              {sortedRecos.length} recommandation
              {sortedRecos.length !== 1 ? "s" : ""}
            </span>
            <div className={s.sortWrap}>
              <select
                className={s.sortSelect}
                value={sortBy}
                onChange={handleSortChange}
                aria-label="Trier par"
              >
                <option value="recent">Plus r&eacute;cents</option>
                <option value="note">Meilleures notes</option>
                <option value="coups">Coups de c&oelig;ur</option>
                <option value="alpha">A &rarr; Z</option>
              </select>
              <svg
                className={s.sortChevron}
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                width="12"
                height="12"
              >
                <path d="M4 6l4 4 4-4" />
              </svg>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className={s.skeleton}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={s.skelCard}>
                  <div className={s.skelImg} />
                  <div className={s.skelBody}>
                    <div className={s.skelLineTiny} />
                    <div className={s.skelLine} />
                    <div className={s.skelLineShort} />
                  </div>
                </div>
              ))}
            </div>
          ) : paginatedRecos.length > 0 ? (
            <>
              <div className={s.grid}>
                {paginatedRecos.map((reco) => (
                  <article
                    key={reco._id}
                    className={s.card}
                    style={{ "--cat-color": color } as React.CSSProperties}
                  >
                    <a
                      href={`/recommandations/${reco.slug}`}
                      className={s.cardLink}
                    >
                      <div className={s.cardImgWrap}>
                        {reco.imageUrl ? (
                          <img
                            src={reco.imageUrl}
                            alt={reco.titre}
                            className={s.cardImg}
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div
                            className={s.cardImgPlaceholder}
                            style={{ background: color }}
                          >
                            <span className={s.cardImgPlaceholderLabel}>
                              {typeConfig.label}
                            </span>
                          </div>
                        )}
                        {reco.coupDeCoeur && (
                          <span className={s.coupDeCoeur} aria-label="Coup de cœur">
                            ♥
                          </span>
                        )}
                      </div>
                      <div className={s.cardBody}>
                        <div className={s.cardMeta}>
                          <span
                            className={s.cardDot}
                            style={{ background: color }}
                            aria-hidden="true"
                          />
                          <span className={s.cardCategory} style={{ color }}>
                            {typeConfig.label}
                          </span>
                          {reco.note && (
                            <>
                              <span className={s.cardSep}>&middot;</span>
                              {renderStars(reco.note)}
                            </>
                          )}
                        </div>
                        <h3 className={s.cardTitle}>{reco.titre}</h3>
                        {reco.accroche && (
                          <p className={s.cardExcerpt}>{reco.accroche}</p>
                        )}
                        <div className={s.cardFoot}>
                          <span className={s.cardAuthor}>
                            {reco.auteur || "Rédaction Origines"}
                          </span>
                          {reco.datePublication && (
                            <>
                              <span className={s.cardSep}>&middot;</span>
                              <time
                                className={s.cardDate}
                                dateTime={reco.datePublication}
                              >
                                {formatDate(reco.datePublication)}
                              </time>
                            </>
                          )}
                          <SaveBookmark
                            inline
                            type="recommandation"
                            slug={reco.slug}
                            title={reco.titre}
                            image={reco.imageUrl}
                            univers="Recommandations"
                          />
                          <span className={s.cardCta}>Voir &rarr;</span>
                        </div>
                      </div>
                    </a>
                  </article>
                ))}
              </div>

              {totalPages > 1 && (
                <nav className={s.pagination} aria-label="Pagination">
                  <button
                    className={s.pageBtn}
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    &larr; Pr&eacute;c.
                  </button>
                  <div className={s.pageNums}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => {
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              className={`${s.pageNum} ${page === currentPage ? s.pageNumActive : ""}`}
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </button>
                          );
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return (
                            <span key={page} className={s.pageEllipsis}>
                              &hellip;
                            </span>
                          );
                        }
                        return null;
                      }
                    )}
                  </div>
                  <button
                    className={s.pageBtn}
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Suiv. &rarr;
                  </button>
                </nav>
              )}
            </>
          ) : (
            <div className={s.empty}>
              <svg
                className={s.emptyIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                width="48"
                height="48"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <h3 className={s.emptyTitle}>
                Aucune recommandation pour l&rsquo;instant
              </h3>
              <p className={s.emptyText}>
                Nous n&rsquo;avons pas encore de{" "}
                {typeConfig.plural} &agrave; recommander. Explorez les autres
                cat&eacute;gories.
              </p>
              <Link to="/recommandations" className={s.emptyCta}>
                Toutes les recommandations &rarr;
              </Link>
            </div>
          )}

          {/* FAQ */}
          {typeConfig.faq && typeConfig.faq.length > 0 && (
            <section className={s.faqSection}>
              <h2 className={s.faqTitle}>Questions fr&eacute;quentes</h2>
              <div className={s.faqList}>
                {typeConfig.faq.map((item, i) => (
                  <details key={i} className={s.faqItem}>
                    <summary className={s.faqQuestion}>{item.question}</summary>
                    <p className={s.faqAnswer}>{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Related types */}
          {typeConfig.related && typeConfig.related.length > 0 && (
            <section className={s.relatedSection}>
              <h2 className={s.relatedTitle}>Cat&eacute;gories proches</h2>
              <div className={s.relatedGrid}>
                {typeConfig.related.map((key) => {
                  const rel = RECO_TYPES[key];
                  if (!rel) return null;
                  return (
                    <Link
                      key={key}
                      to={`/recommandations/${key}`}
                      className={s.relatedCard}
                      style={{ "--rel-color": rel.color } as React.CSSProperties}
                    >
                      <span className={s.relatedCardDot} style={{ background: rel.color }} />
                      <div>
                        <span className={s.relatedCardLabel}>{rel.label}</span>
                        <span className={s.relatedCardUnivers}>Recommandations</span>
                      </div>
                      <span className={s.relatedCardArrow}>&rarr;</span>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer2 />
      <ScrollToTopV2 />
    </>
  );
}
