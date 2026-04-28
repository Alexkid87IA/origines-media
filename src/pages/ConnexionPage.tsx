import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import SEO from "@/components/SEO";
import { useAuth } from "@/contexts/AuthContext";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2";
import s from "./InscriptionPage.module.css";

const FIREBASE_ERRORS: Record<string, string> = {
  "auth/invalid-credential": "E-mail ou mot de passe incorrect.",
  "auth/user-not-found": "Aucun compte trouvé avec cette adresse.",
  "auth/wrong-password": "Mot de passe incorrect.",
  "auth/too-many-requests": "Trop de tentatives. Réessayez plus tard.",
};

function getAuthErrorCode(error: unknown) {
  return typeof error === "object" && error && "code" in error
    ? String((error as { code?: unknown }).code)
    : "";
}

export default function ConnexionPage() {
  const { user, loading, login, loginWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;
  if (user) return <Navigate to="/compte" replace />;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/compte");
    } catch (err: unknown) {
      setError(FIREBASE_ERRORS[getAuthErrorCode(err)] || "Une erreur est survenue. Réessayez.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReset() {
    if (!email) {
      setError("Entrez votre adresse e-mail pour réinitialiser.");
      return;
    }
    try {
      await resetPassword(email);
      setInfo("Un e-mail de réinitialisation a été envoyé.");
      setError("");
    } catch {
      setError("Impossible d'envoyer l'e-mail. Vérifiez l'adresse.");
    }
  }

  return (
    <>
      <SEO
        title="Connexion"
        description="Connectez-vous à votre espace Origines Media."
        url="/connexion"
        noindex
      />

      <SiteHeader />

      <main className={s.page}>
        <div className={s.wrap}>
          <div className={s.card}>
            <span className={s.kicker}>
              <span className={s.kickerDot} />
              Connexion
            </span>
            <h1 className={s.title}>
              Bon retour <em>parmi nous</em>
            </h1>
            <p className={s.subtitle}>
              Retrouvez votre espace personnel.
            </p>

            <div className={s.form}>
              <button
                type="button"
                className={s.google}
                onClick={async () => {
                  setError("");
                  try {
                    const mode = await loginWithGoogle();
                    if (mode !== "redirect") navigate("/compte");
                  } catch (err: unknown) {
                    if (getAuthErrorCode(err) !== "auth/popup-closed-by-user")
                      setError("Échec de la connexion Google. Réessayez.");
                  }
                }}
              >
                <svg viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continuer avec Google
              </button>

              <div className={s.divider}>
                <span className={s.dividerText}>ou</span>
              </div>
            </div>

            <form className={s.form} onSubmit={handleSubmit}>
              {error && <p className={s.error}>{error}</p>}
              {info && (
                <p className={s.error} style={{ color: "#34A853", borderColor: "rgba(52,168,83,0.15)", background: "rgba(52,168,83,0.06)" }}>
                  {info}
                </p>
              )}

              <div className={s.field}>
                <label className={s.label} htmlFor="login-email">Adresse e-mail</label>
                <input
                  id="login-email"
                  className={s.input}
                  type="email"
                  placeholder="votre@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className={s.field}>
                <label className={s.label} htmlFor="login-password">Mot de passe</label>
                <input
                  id="login-password"
                  className={s.input}
                  type="password"
                  placeholder="Votre mot de passe"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button type="submit" className={s.submit} disabled={submitting}>
                {submitting ? "Connexion…" : "Se connecter"}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </form>

            <p className={s.footer}>
              <button
                type="button"
                onClick={handleReset}
                style={{ background: "none", border: "none", padding: 0, font: "inherit", color: "var(--ink)", fontWeight: 600, cursor: "pointer", textDecoration: "none" }}
              >
                Mot de passe oublié ?
              </button>
            </p>

            <p className={s.footer}>
              Pas encore membre ? <a href="/inscription">Créer un compte</a>
            </p>
          </div>
        </div>
      </main>

      <Footer2 />
    </>
  );
}
