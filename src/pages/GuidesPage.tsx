import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import SEO from "../components/SEO";
import { sanityFetch } from "@/lib/sanity";
import { smartExcerpt } from "@/lib/typography";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useSubscribe } from "../hooks/useSubscribe";
import s from "./GuidesPage.module.css";

/* ================================================================
   Types & Query
   ================================================================ */

interface Guide {
  _id: string;
  titre: string;
  slug: string;
  category: string;
  deck?: string;
  description?: string;
  contenuTexte?: string;
  imageUrl: string;
  univpilar?: string;
  soustopic?: string;
  authorName?: string;
  datePublication: string;
  tempsLecture?: number;
}

const GUIDES_QUERY = `
  *[_type == "production" && rubrique == "guides"] | order(datePublication desc) {
    _id,
    titre,
    "slug": slug.current,
    category,
    "deck": coalesce(description, extrait, accroche),
    description,
    "contenuTexte": array::join(contenu[_type == "block"][0...3].children[].text, " "),
    "imageUrl": coalesce(image.asset->url, mainImage.asset->url, imageUrl),
    univpilar,
    soustopic,
    "authorName": coalesce(author->name, author),
    datePublication,
    tempsLecture
  }
`;

import { UNIVERS } from "@/data/univers";

const UNIVERS_COLORS: Record<string, string> = Object.fromEntries(
  UNIVERS.map((u) => [u.id, u.color])
);

const UNIVERS_LABELS: Record<string, string> = Object.fromEntries(
  UNIVERS.map((u) => [u.id, u.name.replace(/^(L'|Le |Les |La )/, "")])
);

const CATEGORY_LABELS: Record<string, string> = {
  "kits-gratuits": "Kit gratuit",
  programmes: "Parcours",
};

/* ================================================================
   Page
   ================================================================ */

export default function GuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"all" | "kits-gratuits" | "programmes">("all");
  const [activeUnivers, setActiveUnivers] = useState<string | null>(null);

  const [magnetEmail, setMagnetEmail] = useState("");
  const { status: subStatus, error: subError, subscribe } = useSubscribe({ source: "guides" });

  useEffect(() => {
    (async () => {
      try {
        const data = await sanityFetch<Guide[]>(GUIDES_QUERY);
        setGuides(data || []);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleMagnetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!magnetEmail || subStatus === "loading") return;
    await subscribe(magnetEmail);
  };

  const allKits = useMemo(() => guides.filter((g) => g.category === "kits-gratuits"), [guides]);
  const allParcours = useMemo(() => guides.filter((g) => g.category === "programmes"), [guides]);

  const filteredKits = useMemo(() => {
    if (activeUnivers) return allKits.filter((g) => g.univpilar === activeUnivers);
    return allKits;
  }, [allKits, activeUnivers]);

  const filteredParcours = useMemo(() => {
    if (activeUnivers) return allParcours.filter((g) => g.univpilar === activeUnivers);
    return allParcours;
  }, [allParcours, activeUnivers]);

  const universesInGuides = useMemo(() => {
    const set = new Set(guides.map((g) => g.univpilar).filter(Boolean));
    return Array.from(set) as string[];
  }, [guides]);

  const catCounts = useMemo(() => ({
    masterclass: guides.filter((g) => g.category === "masterclass").length,
    ateliers: guides.filter((g) => g.category === "ateliers").length,
    programmes: allParcours.length,
    "kits-gratuits": allKits.length,
  }), [guides, allParcours, allKits]);

  const showParcours = (activeFilter === "all" || activeFilter === "programmes") && filteredParcours.length > 0;
  const showKits = (activeFilter === "all" || activeFilter === "kits-gratuits") && filteredKits.length > 0;

  function getExcerpt(g: Guide): string {
    return smartExcerpt(g.deck || g.description || g.contenuTexte || "", 140);
  }

  return (
    <div className={s.page}>
      <SEO
        title="Guides — Parcours et kits gratuits"
        description="Explorez notre bibliothèque de guides : parcours structurés et kits gratuits sur la psychologie, le bien-être, les relations et la culture."
        url="/guides"
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: "Guides", url: "/guides" },
        ]}
      />
      <SiteHeader />

      <main>
        <div className="v2-container">
          <Breadcrumb
            items={[
              { name: "Accueil", url: "/" },
              { name: "Guides", url: "/guides" },
            ]}
          />

          {/* ═══ HERO ═══ */}
          <section className={s.hero}>
            <div className={`${s.chapterMark} mono`}>
              <span className={s.cNum}>Ch.03</span>
              <span className={s.cSep}>/</span>
              <span className={s.cLabel}>Guides</span>
            </div>

            <h1 className={s.heroTitle}>
              Apprenez à votre rythme.
              <br />
              Avancez pour de <em>vrai.</em>
            </h1>
            <p className={s.heroDeck}>
              Parcours structurés et kits gratuits — chaque guide est conçu pour
              vous aider à passer de la compréhension à l'action.
            </p>

            {/* ═══ FILTERS ═══ */}
            <div className={s.filters}>
              <button
                className={`${s.filterChip} ${activeFilter === "all" ? s.filterChipActive : ""}`}
                onClick={() => setActiveFilter("all")}
              >
                Tout ({guides.length})
              </button>
              <button
                className={`${s.filterChip} ${activeFilter === "programmes" ? s.filterChipActive : ""}`}
                onClick={() => setActiveFilter("programmes")}
              >
                Parcours ({allParcours.length})
              </button>
              <button
                className={`${s.filterChip} ${activeFilter === "kits-gratuits" ? s.filterChipActive : ""}`}
                onClick={() => setActiveFilter("kits-gratuits")}
              >
                Kits gratuits ({allKits.length})
              </button>

              {universesInGuides.length > 1 && (
                <>
                  <span className={s.filterSep} />
                  {universesInGuides.map((u) => (
                    <button
                      key={u}
                      className={`${s.filterChip} ${s.filterChipUnivers} ${activeUnivers === u ? s.filterChipActive : ""}`}
                      onClick={() => setActiveUnivers(activeUnivers === u ? null : u)}
                      style={{ "--chip-color": UNIVERS_COLORS[u] } as React.CSSProperties}
                    >
                      <span className={s.filterChipDot} />
                      {UNIVERS_LABELS[u] || u}
                    </button>
                  ))}
                </>
              )}
            </div>
          </section>
        </div>

        {/* ═══ CATEGORY PROMO ═══ */}
        <div className="v2-container">
          <section className={s.catSection}>
            <div className={s.catGrid}>
              {([
                { key: "masterclass", label: "Masterclass", desc: "Des parcours vidéo complets, guidés par des experts." },
                { key: "ateliers", label: "Ateliers", desc: "Sessions courtes et ciblées pour apprendre une compétence." },
                { key: "programmes", label: "Parcours", desc: "Des guides structurés sur plusieurs semaines." },
                { key: "kits-gratuits", label: "Kits gratuits", desc: "Ressources gratuites pour commencer à explorer." },
              ] as const).map((cat) => (
                <Link key={cat.key} to={`/guides/${cat.key}`} className={s.catCard}>
                  <span className={s.catCardAccent} />
                  <span className={`${s.catCardLabel} mono`}>
                    {cat.label}
                  </span>
                  <p className={s.catCardDesc}>{cat.desc}</p>
                  <span className={s.catCardFoot}>
                    {catCounts[cat.key] > 0
                      ? <span className={s.catCardCount}>{catCounts[cat.key]} guide{catCounts[cat.key] > 1 ? "s" : ""}</span>
                      : <span className={s.catCardSoon}>Bientôt</span>
                    }
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {loading ? (
          <div className="v2-container">
            <div className={s.skeleton}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={s.skeletonCard}>
                  <div className={s.skeletonImg} />
                  <div className={s.skeletonBody}>
                    <div className={s.skeletonLine} style={{ width: "40%" }} />
                    <div className={s.skeletonLine} style={{ width: "90%" }} />
                    <div className={s.skeletonLine} style={{ width: "70%" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* ═══ PARCOURS SECTION ═══ */}
            {showParcours && (
              <div className="v2-container">
                <section className={s.catalogSection}>
                  <header className={s.catalogHeader}>
                    <span className={`${s.kicker} mono`}>
                      <span className={s.kickerDot} style={{ background: "#7B5CD6" }} />
                      Parcours
                    </span>
                    <h2 className={s.catalogTitle}>
                      Nos <em>parcours.</em>
                    </h2>
                    <p className={s.catalogDeck}>
                      Des guides structurés sur plusieurs semaines. On avance pas
                      à pas, avec un objectif clair.
                    </p>
                  </header>

                  {/* Lead card — first parcours */}
                  <Link to={`/article/${filteredParcours[0].slug}`} className={s.leadCard}>
                    <div className={s.leadImg}>
                      {filteredParcours[0].imageUrl && (
                        <img src={filteredParcours[0].imageUrl} alt={filteredParcours[0].titre} loading="eager" />
                      )}
                    </div>
                    <div className={s.leadBody}>
                      <div className={s.leadMeta}>
                        {filteredParcours[0].univpilar && (
                          <span className={s.leadUnivers} style={{ color: UNIVERS_COLORS[filteredParcours[0].univpilar] }}>
                            {UNIVERS_LABELS[filteredParcours[0].univpilar] || filteredParcours[0].univpilar}
                          </span>
                        )}
                        <span className={s.leadType}>Parcours</span>
                      </div>
                      <h3 className={s.leadTitle}>{filteredParcours[0].titre}</h3>
                      <p className={s.leadDeck}>{getExcerpt(filteredParcours[0])}</p>
                      <div className={s.leadFoot}>
                        {filteredParcours[0].authorName && (
                          <span className={s.leadAuthor}>{filteredParcours[0].authorName}</span>
                        )}
                        <span className={s.leadCta}>
                          Lire le parcours
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Grid — remaining parcours */}
                  {filteredParcours.length > 1 && (
                    <div className={s.grid}>
                      {filteredParcours.slice(1).map((g) => (
                        <GuideCard key={g._id} guide={g} getExcerpt={getExcerpt} />
                      ))}
                    </div>
                  )}
                </section>
              </div>
            )}

            {/* ═══ LEAD MAGNET — email capture ═══ */}
            {allKits.length > 0 && (activeFilter === "all" || activeFilter === "kits-gratuits") && (
              <section id="kits-gratuits" className={s.leadMagnet}>
                <div className="v2-container">
                  <div className={s.magnetGrid}>
                    <div className={s.magnetContent}>
                      <span className={`${s.kicker} ${s.kickerLight} mono`}>
                        <span className={s.kickerDot} style={{ background: "#5AA352" }} />
                        Gratuit
                      </span>
                      <h2 className={s.magnetTitle}>
                        {allKits.length} kits gratuits
                        <br />
                        à télécharger <em>maintenant.</em>
                      </h2>
                      <p className={s.magnetDeck}>
                        Recevez tous nos kits par email — psychologie, bien-être,
                        finances, créativité. Zéro engagement.
                      </p>
                    </div>

                    <div className={s.magnetFormWrap}>
                      {subStatus === "success" ? (
                        <div className={s.magnetSuccess}>
                          <svg className={s.magnetSuccessIcon} viewBox="0 0 24 24" fill="none" stroke="#5AA352" strokeWidth="2">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                          <p className={s.magnetSuccessTitle}>C'est envoyé !</p>
                          <p className={s.magnetSuccessDesc}>
                            Vos kits arrivent dans votre boîte mail.
                          </p>
                        </div>
                      ) : (
                        <form onSubmit={handleMagnetSubmit} className={s.magnetForm}>
                          <span className={s.magnetLabel}>
                            Recevez tous les kits par email
                          </span>
                          <div className={s.magnetInputRow}>
                            <input
                              type="email"
                              value={magnetEmail}
                              onChange={(e) => setMagnetEmail(e.target.value)}
                              placeholder="nom@exemple.com"
                              required
                              autoComplete="email"
                              className={s.magnetInput}
                              disabled={subStatus === "loading"}
                            />
                            <button
                              type="submit"
                              className={s.magnetBtn}
                              disabled={subStatus === "loading" || !magnetEmail}
                            >
                              {subStatus === "loading" ? "Envoi…" : "Recevoir"}
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                              </svg>
                            </button>
                          </div>
                          {subError && <p className={s.magnetError}>{subError}</p>}
                          <p className={s.magnetNote}>
                            Gratuit, sans engagement. Vos données restent privées.
                          </p>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* ═══ KITS GRATUITS SECTION ═══ */}
            {showKits && (
              <div className="v2-container">
                <section className={s.catalogSection}>
                  <header className={s.catalogHeader}>
                    <span className={`${s.kicker} mono`}>
                      <span className={s.kickerDot} style={{ background: "#5AA352" }} />
                      Kits gratuits
                    </span>
                    <h2 className={s.catalogTitle}>
                      À télécharger <em>gratuitement.</em>
                    </h2>
                    <p className={s.catalogDeck}>
                      Pas besoin de payer pour avancer. Chaque kit est un premier
                      pas concret.
                    </p>
                  </header>

                  <div className={s.grid}>
                    {filteredKits.map((g) => (
                      <GuideCard key={g._id} guide={g} getExcerpt={getExcerpt} />
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* ═══ EMPTY STATE ═══ */}
            {!showParcours && !showKits && !loading && (
              <div className="v2-container">
                <div className={s.empty}>
                  <p className={s.emptyTitle}>Aucun guide trouvé</p>
                  <p className={s.emptyDesc}>
                    Essayez un autre filtre ou revenez bientôt.
                  </p>
                  <button
                    className={s.emptyBtn}
                    onClick={() => { setActiveFilter("all"); setActiveUnivers(null); }}
                  >
                    Voir tous les guides
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <Footer2 />
      <ScrollToTopV2 />
    </div>
  );
}

/* ================================================================
   Guide Card (shared between parcours grid & kits grid)
   ================================================================ */

function GuideCard({ guide: g, getExcerpt }: { guide: Guide; getExcerpt: (g: Guide) => string }) {
  return (
    <Link to={`/article/${g.slug}`} className={s.card}>
      <div className={s.cardImg}>
        {g.imageUrl && <img src={g.imageUrl} alt={g.titre} loading="lazy" />}
        {g.category === "kits-gratuits" && (
          <span className={s.cardBadgeFree}>Gratuit</span>
        )}
      </div>
      <div className={s.cardBody}>
        <div className={s.cardMeta}>
          {g.univpilar && (
            <span className={s.cardUnivers} style={{ color: UNIVERS_COLORS[g.univpilar] }}>
              {UNIVERS_LABELS[g.univpilar] || g.univpilar}
            </span>
          )}
          <span className={s.cardType}>
            {CATEGORY_LABELS[g.category] || "Guide"}
          </span>
        </div>
        <h3 className={s.cardTitle}>{g.titre}</h3>
        <p className={s.cardDeck}>{getExcerpt(g)}</p>
        <div className={s.cardFoot}>
          {g.authorName && <span className={s.cardAuthor}>{g.authorName}</span>}
        </div>
      </div>
    </Link>
  );
}
