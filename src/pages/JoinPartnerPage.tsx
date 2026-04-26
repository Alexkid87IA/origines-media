// src/pages/JoinPartnerPage.tsx
// V2 — Angular editorial design, CSS modules, no lucide-react

import { useState, useEffect, useRef } from "react";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import SEO from "../components/SEO";
import s from "./JoinPartnerPage.module.css";

// Import des sections modulaires (these retain their own styling)
import PartnershipHeroSection from "../components/partnership/PartnershipHeroSection";
import PartnershipConceptSection from "../components/partnership/PartnershipConceptSection";
import PartnershipImpactMultifacettesSection from "../components/partnership/PartnershipImpactMultifacettesSection";
import PartnershipTechSection from "../components/partnership/PartnershipTechSection";
import PartnershipEcosystemSection from "../components/partnership/PartnershipEcosystemSection";
import PartnershipCafeSection from "../components/partnership/PartnershipCafeSection";
import PartnershipVisionSection from "../components/partnership/PartnershipVisionSection";
import PartnershipTeamSection from "../components/partnership/PartnershipTeamSection";
import PartnershipCarouselSection from "../components/partnership/PartnershipCarouselSection";
import PartnershipCTASection from "../components/partnership/PartnershipCTASection";

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function JoinPartnerPage() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check existing session
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const isAuth = sessionStorage.getItem("joinPageAuth");
      if (isAuth === "true") {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error accessing sessionStorage:", error);
    }
  }, []);

  // Existing states
  const [showSections, setShowSections] = useState(false);
  const conceptSectionRef = useRef<HTMLDivElement>(null);

  const handleGoLive = () => {
    setShowSections(true);
  };

  // Verify password via API
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setShowError(false);

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsAuthenticated(true);

        if (typeof window !== "undefined") {
          try {
            sessionStorage.setItem("joinPageAuth", "true");
          } catch (error) {
            console.error("Error setting sessionStorage:", error);
          }
        }
      } else {
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // Scroll to concept section after GO click
  useEffect(() => {
    if (showSections && conceptSectionRef.current) {
      setTimeout(() => {
        conceptSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [showSections]);

  // ── Auth gate ──
  if (!isAuthenticated) {
    return (
      <div className={s.authGate}>
        <div className={s.authCard}>
          <div className={s.authHeader}>
            <h1 className={s.authTitle}>Acces Partenaires</h1>
            <p className={s.authDeck}>
              Cette page est reservee aux partenaires potentiels
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className={s.authForm}>
            <div className={s.authFieldGroup}>
              <label htmlFor="password" className={s.authLabel}>
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={s.authInput}
                placeholder="Entrez le mot de passe"
                required
                disabled={isLoading}
                aria-describedby={showError ? "password-error" : undefined}
                aria-invalid={showError}
              />
            </div>

            {showError && (
              <div
                id="password-error"
                role="alert"
                className={s.authError}
              >
                Mot de passe incorrect. Veuillez reessayer.
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={s.authBtn}
            >
              {isLoading ? "Verification..." : "Acceder a la page"}
            </button>
          </form>

          <div className={s.authFooter}>
            <p className={s.authFooterText}>
              Vous n&rsquo;avez pas le mot de passe ?
            </p>
            <a
              href="mailto:contact@origines.media"
              className={s.authFooterLink}
            >
              Contactez-nous
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ── Authenticated page ──
  return (
    <div className={s.page}>
      <SEO
        title="Devenir partenaire"
        description="Rejoignez Origines Media en tant que partenaire. Decouvrez nos opportunites de collaboration et participez a une aventure mediatique unique."
        url="/rejoindre-partenaire"
        noindex={true}
      />
      <SiteHeader />

      <main>
        {/* Logout button */}
        <button
          onClick={() => {
            sessionStorage.removeItem("joinPageAuth");
            setIsAuthenticated(false);
          }}
          className={s.logoutBtn}
        >
          Deconnexion
        </button>

        {/* Section 1 : Hero */}
        <PartnershipHeroSection onGoLive={handleGoLive} />

        {/* Sections after GO click */}
        {showSections && (
          <>
            <div ref={conceptSectionRef} />

            <PartnershipConceptSection />
            <PartnershipVisionSection />
            <PartnershipEcosystemSection />
            <PartnershipCafeSection />
            <PartnershipImpactMultifacettesSection />
            <PartnershipTechSection />
            <PartnershipTeamSection />
            <PartnershipCarouselSection />
            <PartnershipCTASection />
          </>
        )}
      </main>

      <Footer2 />
      <ScrollToTopV2 />
    </div>
  );
}
