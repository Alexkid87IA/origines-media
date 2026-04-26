import { Navigate } from "react-router-dom";
import SEO from "@/components/SEO";
import { useAuth } from "@/contexts/AuthContext";
import { useSavedList } from "@/hooks/useSavedList";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2/Footer2";
import s from "./compte.module.css";

const TYPE_LABELS: Record<string, string> = {
  article: "Article",
  video: "Vidéo",
  recommandation: "Recommandation",
};

export default function ListePage() {
  const { user, loading: authLoading } = useAuth();
  const { items, loading, remove } = useSavedList();

  if (authLoading) return null;
  if (!user) return <Navigate to="/compte" replace />;

  return (
    <>
      <SEO title="Ma liste" url="/compte/liste" noindex />
      <SiteHeader />
      <main className={s.page}>
        <div className={s.inner}>
          <div className={s.header}>
            <div className={s.headerLeft}>
              <a href="/compte" className={s.backLink}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
                Retour
              </a>
              <h1 className={s.pageTitle}>Ma <em>liste</em></h1>
            </div>
          </div>

          <div className={s.chapterMark}>
            <span className={s.cNum}>Ch.01</span>
            <span className={s.cSep}>/</span>
            <span className={s.cLabel}>{items.length} élément{items.length !== 1 ? "s" : ""} sauvegardé{items.length !== 1 ? "s" : ""}</span>
          </div>

          {loading ? null : items.length === 0 ? (
            <div className={s.empty}>
              <svg className={s.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 5h14v16l-7-4-7 4V5z" />
              </svg>
              <h2 className={s.emptyTitle}>Votre liste est vide</h2>
              <p className={s.emptyDesc}>
                Sauvegardez des articles, vidéos et recommandations pour les retrouver ici.
              </p>
              <a href="/articles" className={s.emptyLink}>
                Explorer les articles
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </a>
            </div>
          ) : (
            <div className={s.listGrid}>
              {items.map((item) => (
                <div key={item.id} className={s.listCard}>
                  {item.image && <img src={item.image} alt={item.title} className={s.listCardImage} loading="lazy" />}
                  <span className={s.listCardType}>{TYPE_LABELS[item.type] || item.type}</span>
                  <h3 className={s.listCardTitle}>{item.title}</h3>
                  <div className={s.listCardActions}>
                    <a href={`/${item.type === "recommandation" ? "recommandation" : item.type === "video" ? "video" : "article"}/${item.slug}`} className={s.listCardRead}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                      Lire
                    </a>
                    <button type="button" className={s.listCardRemove} onClick={() => remove(item.id)} title="Retirer de la liste">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer2 />
    </>
  );
}
