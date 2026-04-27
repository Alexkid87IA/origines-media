import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import SEO from "@/components/SEO";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import { sanityFetch } from "@/lib/sanity";
import { sanityImg } from "@/lib/sanityImage";
import Breadcrumb from "@/components/ui/Breadcrumb";
import s from "./AffiliateProductsPage.module.css";

// ============ INTERFACES ============

interface AffiliateLink {
  platform: string;
  url: string;
  price?: string;
}

interface AffiliateProduct {
  _id: string;
  name: string;
  slug: string;
  productType: string;
  description?: string;
  brand?: string;
  mentionedBy?: string;
  imageUrl?: string;
  affiliateLinks?: AffiliateLink[];
  univpilar?: string;
  datePublication?: string;
}

// ============ CONSTANTS ============

const PRODUCT_TYPE_LABELS: Record<string, string> = {
  supplement: "Suppléments",
  book: "Livres",
  tool: "Outils",
  app: "Apps",
  device: "Appareils",
  course: "Formations",
};

const UNIVPILAR_LABELS: Record<string, string> = {
  esprit: "L’Esprit",
  corps: "Le Corps",
  liens: "Les Liens",
  monde: "Le Monde",
  avenir: "L’Avenir",
};

const UNIVPILAR_COLORS: Record<string, string> = {
  esprit: "#7B5CD6",
  corps: "#5AA352",
  liens: "#E67839",
  monde: "#2E9B74",
  avenir: "#2E94B5",
};

const ITEMS_PER_PAGE = 12;

const FAQ_DATA = [
  {
    question: "Comment sélectionnez-vous les produits recommandés ?",
    answer:
      "Chaque produit est sélectionné parce qu’il a été mentionné ou utilisé par un expert, un créateur ou un intervenant dans nos contenus. Nous ne recommandons que ce qui a fait ses preuves dans un contexte éditorial authentique.",
  },
  {
    question: "Origines Media perçoit-il une commission sur les achats ?",
    answer:
      "Certains liens sont des liens affiliés : si vous achetez via ces liens, nous pouvons percevoir une petite commission, sans surcoût pour vous. Cela nous aide à financer nos contenus indépendants. Nous l’indiquons toujours de manière transparente.",
  },
];

// ============ HELPERS ============

function truncate(text: string, maxLen: number): string {
  if (!text || text.length <= maxLen) return text || "";
  return text.slice(0, maxLen).replace(/\s+\S*$/, "") + "…";
}

// ============ GROQ QUERY ============

const AFFILIATE_PRODUCTS_QUERY = `
  *[_type == "affiliateProduct" && defined(slug.current)] | order(datePublication desc) {
    _id,
    name,
    "slug": slug.current,
    productType,
    description,
    brand,
    mentionedBy,
    "imageUrl": coalesce(image.asset->url, imageUrl),
    affiliateLinks,
    univpilar,
    "datePublication": coalesce(datePublication, _createdAt)
  }
`;

// ============ COMPONENT ============

export default function AffiliateProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<AffiliateProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const activeType = searchParams.get("type") || "";
  const activeUnivers = searchParams.get("univers") || "";
  const [sortBy, setSortBy] = useState(searchParams.get("tri") || "recent");

  // Body style
  useEffect(() => {
    document.body.style.background = "var(--paper)";
    document.body.style.color = "var(--ink)";
    return () => {
      document.body.style.background = "";
      document.body.style.color = "";
    };
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await sanityFetch<AffiliateProduct[]>(AFFILIATE_PRODUCTS_QUERY);
        setProducts(data || []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtered products
  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (activeType) {
      result = result.filter((p) => p.productType === activeType);
    }
    if (activeUnivers) {
      result = result.filter((p) => p.univpilar === activeUnivers);
    }
    return result;
  }, [products, activeType, activeUnivers]);

  // Sorted products
  const sortedProducts = useMemo(() => {
    const result = [...filteredProducts];
    if (sortBy === "recent") {
      result.sort(
        (a, b) =>
          new Date(b.datePublication || "").getTime() -
          new Date(a.datePublication || "").getTime()
      );
    } else if (sortBy === "alpha") {
      result.sort((a, b) =>
        (a.name || "").localeCompare(b.name || "", "fr")
      );
    } else if (sortBy === "source") {
      result.sort((a, b) =>
        (a.mentionedBy || "").localeCompare(b.mentionedBy || "", "fr")
      );
    }
    return result;
  }, [filteredProducts, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedProducts, currentPage]);

  // Handlers
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const p = new URLSearchParams(searchParams);
      for (const [key, val] of Object.entries(updates)) {
        if (val === null || val === "") p.delete(key);
        else p.set(key, val);
      }
      p.delete("page");
      setSearchParams(p);
    },
    [searchParams, setSearchParams]
  );

  const handleTypeFilter = useCallback(
    (type: string) => {
      updateParams({ type: type === activeType ? null : type });
    },
    [activeType, updateParams]
  );

  const handleUniversFilter = useCallback(
    (univers: string) => {
      updateParams({ univers: univers === activeUnivers ? null : univers });
    },
    [activeUnivers, updateParams]
  );

  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      setSortBy(val);
      updateParams({ tri: val === "recent" ? null : val });
    },
    [updateParams]
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

  return (
    <>
      <SEO
        title="Produits recommandés — Origines Media"
        description="Découvrez les produits, outils et ressources recommandés par les experts et créateurs d’Origines Media. Sélection indépendante et transparente."
        url="/recommandations/produits"
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: "Recommandations", url: "/recommandations" },
          { name: "Produits affiliés", url: "/recommandations/produits" },
        ]}
        faqData={FAQ_DATA}
      />
      <SiteHeader />

      <main id="main" role="main">
        <div className="v2-container">
          <Breadcrumb
            items={[
              { name: "Accueil", url: "/" },
              { name: "Recommandations", url: "/recommandations" },
              { name: "Produits affiliés", url: "/recommandations/produits" },
            ]}
          />

          {/* Hero */}
          <header className={s.hero}>
            <div className={s.heroContent}>
              <span className={s.heroKicker}>
                <span
                  className={s.heroKickerDot}
                  style={{ background: "#E11D48" }}
                  aria-hidden="true"
                />
                Recommandations
              </span>
              <h1 className={s.heroTitle}>Produits recommand&eacute;s</h1>
              {!loading && (
                <p className={s.heroDeck}>
                  {sortedProducts.length} produit
                  {sortedProducts.length !== 1 ? "s" : ""} s&eacute;lectionn&eacute;
                  {sortedProducts.length !== 1 ? "s" : ""} par nos experts.
                </p>
              )}
              <p className={s.heroDescription}>
                Les outils, livres, applis et ressources mentionn&eacute;s dans nos
                contenus. Chaque produit a &eacute;t&eacute; cit&eacute; par un expert
                ou un cr&eacute;ateur dans un contexte &eacute;ditorial authentique.
                Certains liens sont des liens affili&eacute;s.
              </p>
            </div>
            <div className={s.heroAccent} style={{ background: "#E11D48" }} />
          </header>

          {/* Product type filter */}
          <nav className={s.typeNav} aria-label="Types de produits">
            {Object.entries(PRODUCT_TYPE_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => handleTypeFilter(key)}
                className={`${s.typeChip} ${activeType === key ? s.typeChipActive : ""}`}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Univers filter */}
          <nav className={s.universNav} aria-label="Univers">
            {Object.entries(UNIVPILAR_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => handleUniversFilter(key)}
                className={`${s.universChip} ${activeUnivers === key ? s.universChipActive : ""}`}
                style={
                  activeUnivers === key
                    ? ({ "--univ-color": UNIVPILAR_COLORS[key] } as React.CSSProperties)
                    : undefined
                }
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Toolbar */}
          <div className={s.toolbar}>
            <span className={`${s.resultCount} mono`}>
              {sortedProducts.length} produit
              {sortedProducts.length !== 1 ? "s" : ""}
            </span>
            <div className={s.sortWrap}>
              <select
                className={s.sortSelect}
                value={sortBy}
                onChange={handleSortChange}
                aria-label="Trier par"
              >
                <option value="recent">Plus r&eacute;cents</option>
                <option value="alpha">A &rarr; Z</option>
                <option value="source">Par source</option>
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
          ) : paginatedProducts.length > 0 ? (
            <>
              <div className={s.grid}>
                {paginatedProducts.map((product) => (
                  <article key={product._id} className={s.card}>
                    <Link
                      to={`/recommandations/produits/${product.slug}`}
                      className={s.cardLink}
                    >
                      <div className={s.cardImgWrap}>
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl.includes("sanity.io") ? sanityImg(product.imageUrl, 400) : product.imageUrl}
                            alt={product.name}
                            className={s.cardImg}
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div className={s.cardImgPlaceholder}>
                            <span className={s.cardImgPlaceholderLabel}>
                              {PRODUCT_TYPE_LABELS[product.productType] || "Produit"}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className={s.cardBody}>
                        <div className={s.cardMeta}>
                          {product.productType && (
                            <span className={s.cardTypeBadge}>
                              {PRODUCT_TYPE_LABELS[product.productType] || product.productType}
                            </span>
                          )}
                          {product.univpilar && (
                            <>
                              <span className={s.cardSep}>&middot;</span>
                              <span
                                className={s.cardUnivers}
                                style={{ color: UNIVPILAR_COLORS[product.univpilar] }}
                              >
                                {UNIVPILAR_LABELS[product.univpilar] || product.univpilar}
                              </span>
                            </>
                          )}
                        </div>
                        <h3 className={s.cardTitle}>{product.name}</h3>
                        {product.brand && (
                          <span className={s.cardBrand}>{product.brand}</span>
                        )}
                        {product.description && (
                          <p className={s.cardExcerpt}>
                            {truncate(product.description, 120)}
                          </p>
                        )}
                        <div className={s.cardFoot}>
                          {product.mentionedBy && (
                            <span className={s.cardSource}>
                              Cit&eacute; par {product.mentionedBy}
                            </span>
                          )}
                          <span className={s.cardCta}>Voir &rarr;</span>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>

              {/* Pagination */}
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
                Aucun produit pour l&rsquo;instant
              </h3>
              <p className={s.emptyText}>
                Nous n&rsquo;avons pas encore de produits correspondant &agrave;
                ces crit&egrave;res. Essayez de modifier les filtres ou explorez
                toutes les recommandations.
              </p>
              <Link to="/recommandations" className={s.emptyCta}>
                Toutes les recommandations &rarr;
              </Link>
            </div>
          )}

          {/* FAQ */}
          <section className={s.faqSection}>
            <h2 className={s.faqTitle}>Questions fr&eacute;quentes</h2>
            <div className={s.faqList}>
              {FAQ_DATA.map((item, i) => (
                <details key={i} className={s.faqItem}>
                  <summary className={s.faqQuestion}>{item.question}</summary>
                  <p className={s.faqAnswer}>{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Related section */}
          <section className={s.relatedSection}>
            <h2 className={s.relatedTitle}>Explorer aussi</h2>
            <div className={s.relatedGrid}>
              <Link to="/recommandations" className={s.relatedCard}>
                <span className={s.relatedCardDot} style={{ background: "#E11D48" }} />
                <div>
                  <span className={s.relatedCardLabel}>Toutes les recommandations</span>
                  <span className={s.relatedCardUnivers}>Livres, podcasts, films&hellip;</span>
                </div>
                <span className={s.relatedCardArrow}>&rarr;</span>
              </Link>
              <Link to="/articles" className={s.relatedCard}>
                <span className={s.relatedCardDot} style={{ background: "#6D28D9" }} />
                <div>
                  <span className={s.relatedCardLabel}>Articles</span>
                  <span className={s.relatedCardUnivers}>M&eacute;dia</span>
                </div>
                <span className={s.relatedCardArrow}>&rarr;</span>
              </Link>
              <Link to="/guides" className={s.relatedCard}>
                <span className={s.relatedCardDot} style={{ background: "#059669" }} />
                <div>
                  <span className={s.relatedCardLabel}>Guides</span>
                  <span className={s.relatedCardUnivers}>Ateliers</span>
                </div>
                <span className={s.relatedCardArrow}>&rarr;</span>
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer2 />
      <ScrollToTopV2 />
    </>
  );
}
