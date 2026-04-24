import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import SEO from "@/components/SEO";
import s from "./NotFoundPage.module.css";

export default function NotFoundPage() {
  return (
    <div className={s.page}>
      <SEO
        title="Page introuvable"
        description="La page que vous recherchez n'existe pas ou a été déplacée."
        noindex
      />
      <SiteHeader />

      <main className={s.main}>
        <div className={s.wrap}>
          <p className={s.kicker}>Erreur 404</p>

          <p className={s.giant} aria-hidden="true">
            404
          </p>

          <h1 className={s.title}>
            Page <em>introuvable</em>
          </h1>

          <p className={s.body}>
            La page que vous recherchez semble avoir disparu dans les
            méandres du web. Peut-être s'est-elle transformée en récit
            inspirant ?
          </p>

          <div className={s.actions}>
            <Link to="/" className={s.cta}>
              {/* Home icon */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
                aria-hidden="true"
              >
                <path d="M3 12L12 3l9 9" />
                <path d="M5 10v10h5v-6h4v6h5V10" />
              </svg>
              Retour à l'accueil
            </Link>

            <button
              type="button"
              className={s.ghost}
              onClick={() => window.history.back()}
            >
              {/* Arrow left icon */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
                aria-hidden="true"
              >
                <path d="M19 12H5" />
                <path d="M12 5l-7 7 7 7" />
              </svg>
              Page précédente
            </button>
          </div>
        </div>
      </main>

      <Footer2 />
      <ScrollToTopV2 />
    </div>
  );
}
