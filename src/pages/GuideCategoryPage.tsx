import { useState, useEffect } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import SEO from "../components/SEO";
import { sanityFetch } from "@/lib/sanity";
import { smartExcerpt } from "@/lib/typography";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useSubscribe } from "../hooks/useSubscribe";
import s from "./GuideCategoryPage.module.css";

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
  authorName?: string;
  datePublication: string;
}

const CATEGORY_QUERY = `
  *[_type == "production" && rubrique == "guides" && category == $cat] | order(datePublication desc) {
    _id,
    titre,
    "slug": slug.current,
    category,
    "deck": coalesce(description, extrait, accroche),
    description,
    "contenuTexte": array::join(contenu[_type == "block"][0...3].children[].text, " "),
    "imageUrl": coalesce(image.asset->url, mainImage.asset->url, imageUrl),
    univpilar,
    "authorName": coalesce(author->name, author),
    datePublication
  }
`;

const UNIVERS_COLORS: Record<string, string> = {
  esprit: "#7B5CD6",
  corps: "#5AA352",
  liens: "#E67839",
  monde: "#2E9B74",
  avenir: "#2E94B5",
};

const UNIVERS_LABELS: Record<string, string> = {
  esprit: "Esprit",
  corps: "Corps",
  liens: "Liens",
  monde: "Monde",
  avenir: "Avenir",
};

interface CategoryConfig {
  label: string;
  color: string;
  desc: string;
  emptyTitle: string;
  emptyDesc: string;
}

const CATEGORIES: Record<string, CategoryConfig> = {
  masterclass: {
    label: "Masterclass",
    color: "#D64C90",
    desc: "Des parcours vidéo complets, guidés par des experts. Chaque masterclass est un voyage : on apprend, on pratique, on avance.",
    emptyTitle: "Les masterclass arrivent bientôt",
    emptyDesc: "Nous préparons des parcours vidéo avec des experts reconnus. Inscrivez-vous pour être informé du lancement.",
  },
  ateliers: {
    label: "Ateliers",
    color: "#5A66D6",
    desc: "Des sessions courtes et ciblées pour apprendre une compétence précise en une ou deux heures.",
    emptyTitle: "Les ateliers arrivent bientôt",
    emptyDesc: "Nos premiers ateliers pratiques sont en cours de création. Revenez vite.",
  },
  programmes: {
    label: "Parcours",
    color: "#2E9B74",
    desc: "Des guides structurés sur plusieurs semaines. On avance pas à pas, avec un objectif clair et un accompagnement complet.",
    emptyTitle: "Aucun parcours pour le moment",
    emptyDesc: "De nouveaux parcours sont en préparation.",
  },
  "kits-gratuits": {
    label: "Kits gratuits",
    color: "#5AA352",
    desc: "Des ressources gratuites pour commencer à explorer la connaissance de soi. Aucun prérequis, aucun engagement.",
    emptyTitle: "Aucun kit gratuit pour le moment",
    emptyDesc: "De nouveaux kits sont en préparation.",
  },
};

/* ================================================================
   Page
   ================================================================ */

export default function GuideCategoryPage() {
  const { category } = useParams<{ category: string }>();
  const config = category ? CATEGORIES[category] : undefined;

  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);

  const [magnetEmail, setMagnetEmail] = useState("");
  const { status: subStatus, error: subError, subscribe } = useSubscribe({ source: "guides" });

  const isKits = category === "kits-gratuits";

  useEffect(() => {
    if (!category || !config) return;
    (async () => {
      try {
        const data = await sanityFetch<Guide[]>(CATEGORY_QUERY, { cat: category });
        setGuides(data || []);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    })();
  }, [category, config]);

  if (!config) return <Navigate to="/guides" replace />;

  const handleMagnetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!magnetEmail || subStatus === "loading") return;
    await subscribe(magnetEmail);
  };

  function getExcerpt(g: Guide): string {
    return smartExcerpt(g.deck || g.description || g.contenuTexte || "", 140);
  }

  const [lead, ...rest] = guides;

  return (
    <div className={s.page}>
      <SEO
        title={`${config.label} — Guides Origines Media`}
        description={config.desc}
        url={`/guides/${category}`}
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: "Guides", url: "/guides" },
          { name: config.label, url: `/guides/${category}` },
        ]}
      />
      <SiteHeader />

      <main>
        <div className="v2-container">
          <Breadcrumb
            items={[
              { name: "Accueil", url: "/" },
              { name: "Guides", url: "/guides" },
              { name: config.label, url: `/guides/${category}` },
            ]}
          />

          {/* ═══ HERO ═══ */}
          <section className={s.hero}>
            <div className={`${s.chapterMark} mono`}>
              <span className={s.cNum}>Ch.03</span>
              <span className={s.cSep}>/</span>
              <span className={s.cLabel}>Guides</span>
            </div>

            <div className={s.heroKicker}>
              <span className={s.heroKickerDot} style={{ background: config.color }} />
              <span className={`${s.heroKickerLabel} mono`}>{config.label}</span>
            </div>

            <h1 className={s.heroTitle}>{config.label}</h1>
            <p className={s.heroDeck}>{config.desc}</p>

            <Link to="/guides" className={s.backLink}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Tous les guides
            </Link>
          </section>
        </div>

        {/* ═══ EMAIL CAPTURE for kits ═══ */}
        {isKits && guides.length > 0 && (
          <section className={s.magnetBanner}>
            <div className="v2-container">
              <div className={s.magnetInner}>
                <div className={s.magnetText}>
                  <p className={s.magnetTitle}>
                    Recevez les {guides.length} kits par email
                  </p>
                  <p className={s.magnetDesc}>Gratuit, sans engagement.</p>
                </div>
                {subStatus === "success" ? (
                  <p className={s.magnetDone}>Envoyé ! Vérifiez votre boîte mail.</p>
                ) : (
                  <form onSubmit={handleMagnetSubmit} className={s.magnetForm}>
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
                    </button>
                    {subError && <p className={s.magnetError}>{subError}</p>}
                  </form>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ═══ CATALOG ═══ */}
        <div className="v2-container">
          <section className={s.catalog}>
            {loading ? (
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
            ) : guides.length === 0 ? (
              <div className={s.empty}>
                <span className={s.emptyDot} style={{ background: config.color }} />
                <p className={s.emptyTitle}>{config.emptyTitle}</p>
                <p className={s.emptyDesc}>{config.emptyDesc}</p>
                <Link to="/guides" className={s.emptyBtn}>
                  Voir tous les guides
                </Link>
              </div>
            ) : (
              <>
                {/* Lead card */}
                <Link to={`/article/${lead.slug}`} className={s.leadCard}>
                  <div className={s.leadImg}>
                    {lead.imageUrl && <img src={lead.imageUrl} alt={lead.titre} loading="eager" />}
                    {isKits && <span className={s.badgeFree}>Gratuit</span>}
                  </div>
                  <div className={s.leadBody}>
                    <div className={s.leadMeta}>
                      {lead.univpilar && (
                        <span className={s.leadUnivers} style={{ color: UNIVERS_COLORS[lead.univpilar] }}>
                          {UNIVERS_LABELS[lead.univpilar] || lead.univpilar}
                        </span>
                      )}
                    </div>
                    <h2 className={s.leadTitle}>{lead.titre}</h2>
                    <p className={s.leadDeck}>{getExcerpt(lead)}</p>
                    <div className={s.leadFoot}>
                      {lead.authorName && <span className={s.leadAuthor}>{lead.authorName}</span>}
                      <span className={s.leadCta}>
                        Lire
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Grid */}
                {rest.length > 0 && (
                  <div className={s.grid}>
                    {rest.map((g) => (
                      <Link key={g._id} to={`/article/${g.slug}`} className={s.card}>
                        <div className={s.cardImg}>
                          {g.imageUrl && <img src={g.imageUrl} alt={g.titre} loading="lazy" />}
                          {isKits && <span className={s.badgeFreeSmall}>Gratuit</span>}
                        </div>
                        <div className={s.cardBody}>
                          {g.univpilar && (
                            <span className={s.cardUnivers} style={{ color: UNIVERS_COLORS[g.univpilar] }}>
                              {UNIVERS_LABELS[g.univpilar] || g.univpilar}
                            </span>
                          )}
                          <h3 className={s.cardTitle}>{g.titre}</h3>
                          <p className={s.cardDeck}>{getExcerpt(g)}</p>
                          <div className={s.cardFoot}>
                            {g.authorName && <span className={s.cardAuthor}>{g.authorName}</span>}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>

      <Footer2 />
      <ScrollToTopV2 />
    </div>
  );
}
