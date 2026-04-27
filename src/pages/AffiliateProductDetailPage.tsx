import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import SEO from "@/components/SEO";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import { sanityFetch } from "@/lib/sanity";
import { sanityImg } from "@/lib/sanityImage";
import Breadcrumb from "@/components/ui/Breadcrumb";
import s from "./AffiliateProductDetailPage.module.css";

// ============ INTERFACES ============

interface AffiliateLink {
  _key?: string;
  platform: string;
  url: string;
  price?: string;
}

interface RelatedArticle {
  _id: string;
  title: string;
  slug: string;
  imageUrl?: string;
}

interface AffiliateProduct {
  _id: string;
  name: string;
  slug: string;
  productType: string;
  description?: string;
  brand?: string;
  mentionedBy?: string;
  episodeContext?: string;
  imageUrl?: string;
  affiliateLinks?: AffiliateLink[];
  univpilar?: string;
  relatedArticles?: RelatedArticle[];
}

// ============ CONSTANTS ============

const PRODUCT_TYPE_LABELS: Record<string, string> = {
  supplement: "Supplément",
  book: "Livre",
  tool: "Outil",
  app: "App",
  device: "Appareil",
  course: "Formation",
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

// ============ INLINE SVG ICONS ============

const ArrowLeftSvg = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const ExternalLinkSvg = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
  </svg>
);

// ============ GROQ QUERY ============

const AFFILIATE_PRODUCT_DETAIL_QUERY = `
  *[_type == "affiliateProduct" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    productType,
    description,
    brand,
    mentionedBy,
    episodeContext,
    "imageUrl": coalesce(image.asset->url, imageUrl),
    affiliateLinks,
    univpilar,
    "relatedArticles": *[_type == "production" && references(^._id)]{
      _id,
      "title": titre,
      "slug": slug.current,
      "imageUrl": coalesce(image.asset->url, imageUrl)
    }[0...4]
  }
`;

// ============ COMPONENT ============

export default function AffiliateProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<AffiliateProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Body style
  useEffect(() => {
    document.body.style.background = "var(--paper)";
    document.body.style.color = "var(--ink)";
    return () => {
      document.body.style.background = "";
      document.body.style.color = "";
    };
  }, []);

  // Fetch product
  useEffect(() => {
    if (!slug) return;
    const fetchProduct = async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await sanityFetch<AffiliateProduct>(
          AFFILIATE_PRODUCT_DETAIL_QUERY,
          { slug }
        );
        if (!data) {
          setError(true);
        } else {
          setProduct(data);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  // Loading state
  if (loading) {
    return (
      <div className={s.page}>
        <SiteHeader />
        <div className={s.loadingWrap}>
          <div className={s.spinner} />
        </div>
        <Footer2 />
      </div>
    );
  }

  // Error / 404 state
  if (error || !product) {
    return (
      <div className={s.page}>
        <SiteHeader />
        <div className={s.errorWrap}>
          <h1 className={s.errorTitle}>Produit introuvable</h1>
          <p className={s.errorMsg}>
            Ce produit n&rsquo;existe pas ou a &eacute;t&eacute; retir&eacute;.
          </p>
          <Link to="/recommandations/produits" className={s.errorBack}>
            <ArrowLeftSvg />
            Retour aux produits
          </Link>
        </div>
        <Footer2 />
      </div>
    );
  }

  const typeLabel =
    PRODUCT_TYPE_LABELS[product.productType] || product.productType;
  const universLabel = product.univpilar
    ? UNIVPILAR_LABELS[product.univpilar]
    : null;
  const universColor = product.univpilar
    ? UNIVPILAR_COLORS[product.univpilar]
    : null;

  return (
    <div className={s.page}>
      <SEO
        title={`${product.name} — Produits recommandés · Origines Media`}
        description={
          product.description ||
          `Découvrez ${product.name}, recommandé par Origines Media.`
        }
        image={product.imageUrl}
        url={`/recommandations/produits/${product.slug}`}
        jsonLd="article"
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: "Recommandations", url: "/recommandations" },
          { name: "Produits", url: "/recommandations/produits" },
          {
            name: product.name,
            url: `/recommandations/produits/${product.slug}`,
          },
        ]}
      />
      <SiteHeader />

      <main id="main" role="main">
        <div className="v2-container">
          <Breadcrumb
            items={[
              { name: "Accueil", url: "/" },
              { name: "Recommandations", url: "/recommandations" },
              { name: "Produits", url: "/recommandations/produits" },
              {
                name: product.name,
                url: `/recommandations/produits/${product.slug}`,
              },
            ]}
          />
        </div>

        {/* Back button */}
        <div className={s.backWrap}>
          <button onClick={() => navigate(-1)} className={s.backBtn}>
            <ArrowLeftSvg />
            Retour
          </button>
        </div>

        {/* Hero */}
        <header className={s.hero}>
          <div className={s.heroInner}>
            {/* Image */}
            <div className={s.heroImageWrap}>
              {product.imageUrl ? (
                <img
                  src={product.imageUrl.includes("sanity.io") ? sanityImg(product.imageUrl, 640) : product.imageUrl}
                  alt={product.name}
                  className={s.heroImage}
                  loading="eager"
                />
              ) : (
                <div className={s.heroImagePlaceholder}>
                  <span className={s.heroImagePlaceholderLabel}>
                    {typeLabel}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className={s.heroInfo}>
              <div className={s.heroBadges}>
                <span className={s.typeBadge}>{typeLabel}</span>
                {universLabel && (
                  <span
                    className={s.universBadge}
                    style={{ color: universColor || undefined }}
                  >
                    {universLabel}
                  </span>
                )}
              </div>

              <h1 className={s.title}>{product.name}</h1>

              {product.brand && (
                <span className={s.brand}>{product.brand}</span>
              )}

              {product.mentionedBy && (
                <span className={s.mentionBadge}>
                  Mentionn&eacute; par {product.mentionedBy}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Content sections */}
        <div className={s.content}>
          <div className="v2-container">
            {/* Description */}
            {product.description && (
              <section className={s.section}>
                <h2 className={s.sectionTitle}>Description</h2>
                <p className={s.description}>{product.description}</p>
              </section>
            )}

            {/* Episode context */}
            {product.episodeContext && (
              <section className={s.section}>
                <h2 className={s.sectionTitle}>Contexte</h2>
                <blockquote className={s.context}>
                  {product.episodeContext}
                </blockquote>
              </section>
            )}

            {/* Affiliate links */}
            {product.affiliateLinks && product.affiliateLinks.length > 0 && (
              <section className={s.section}>
                <h2 className={s.sectionTitle}>O&ugrave; se le procurer</h2>
                <div className={s.linksGrid}>
                  {product.affiliateLinks.map((link, i) => (
                    <a
                      key={link._key || i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className={s.linkCard}
                    >
                      <span className={s.linkPlatform}>{link.platform}</span>
                      {link.price && (
                        <span className={s.linkPrice}>{link.price}</span>
                      )}
                      <span className={s.linkCta}>
                        Voir
                        <ExternalLinkSvg />
                      </span>
                    </a>
                  ))}
                </div>
                <p className={s.disclosure}>
                  * Certains liens sont des liens affili&eacute;s. Si vous
                  achetez via ces liens, Origines Media peut percevoir une
                  commission, sans surco&ucirc;t pour vous. Cela nous aide
                  &agrave; financer nos contenus ind&eacute;pendants.
                </p>
              </section>
            )}

            {/* Related articles */}
            {product.relatedArticles &&
              product.relatedArticles.length > 0 && (
                <section className={s.section}>
                  <h2 className={s.sectionTitle}>Articles associ&eacute;s</h2>
                  <div className={s.relatedGrid}>
                    {product.relatedArticles.map((article) => (
                      <Link
                        key={article._id}
                        to={`/article/${article.slug}`}
                        className={s.relatedCard}
                      >
                        <div className={s.relatedCardImgWrap}>
                          {article.imageUrl ? (
                            <img
                              src={article.imageUrl.includes("sanity.io") ? sanityImg(article.imageUrl, 400) : article.imageUrl}
                              alt={article.title}
                              className={s.relatedCardImg}
                              loading="lazy"
                              decoding="async"
                            />
                          ) : (
                            <div className={s.relatedCardImgPlaceholder} />
                          )}
                        </div>
                        <h3 className={s.relatedCardTitle}>{article.title}</h3>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

            {/* Back link */}
            <div className={s.backToAll}>
              <Link to="/recommandations/produits" className={s.backToAllLink}>
                <ArrowLeftSvg />
                Tous les produits recommand&eacute;s
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer2 />
      <ScrollToTopV2 />
    </div>
  );
}
