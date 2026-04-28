import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import SEO from "@/components/SEO";
import { useAuth } from "@/contexts/AuthContext";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2";
import s from "./InscriptionPage.module.css";

const FIREBASE_ERRORS: Record<string, string> = {
  "auth/email-already-in-use": "Cette adresse e-mail est déjà utilisée.",
  "auth/invalid-email": "Adresse e-mail invalide.",
  "auth/weak-password": "Le mot de passe doit contenir au moins 6 caractères.",
};

function getAuthErrorCode(error: unknown) {
  return typeof error === "object" && error && "code" in error
    ? String((error as { code?: unknown }).code)
    : "";
}

export default function InscriptionPage() {
  const { user, loading, signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;
  if (user) return <Navigate to="/compte" replace />;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signup(email, password, name);
      navigate("/compte");
    } catch (err: unknown) {
      setError(FIREBASE_ERRORS[getAuthErrorCode(err)] || "Une erreur est survenue. Réessayez.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <SEO
        title="Inscription"
        description="Rejoignez Origines Media. Créez votre espace personnel gratuit."
        url="/inscription"
        noindex
      />

      <SiteHeader />

      <main className={s.page}>
        <div className={s.wrap}>
          <div className={s.card}>
            <span className={s.kicker}>
              <span className={s.kickerDot} />
              Inscription
            </span>
            <h1 className={s.title}>
              Rejoignez <em>Origines</em>
            </h1>
            <p className={s.subtitle}>
              Créez votre espace personnel en quelques secondes.
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

              <div className={s.field}>
                <label className={s.label} htmlFor="signup-name">Prénom ou pseudo</label>
                <input
                  id="signup-name"
                  className={s.input}
                  type="text"
                  placeholder="Votre prénom"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className={s.field}>
                <label className={s.label} htmlFor="signup-email">Adresse e-mail</label>
                <input
                  id="signup-email"
                  className={s.input}
                  type="email"
                  placeholder="votre@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className={s.field}>
                <label className={s.label} htmlFor="signup-password">Mot de passe</label>
                <input
                  id="signup-password"
                  className={s.input}
                  type="password"
                  placeholder="6 caractères minimum"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button type="submit" className={s.submit} disabled={submitting}>
                {submitting ? "Création…" : "Créer mon compte"}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </form>

            <p className={s.footer}>
              Déjà membre ? <a href="/connexion">Se connecter</a>
            </p>

            <div className={s.guarantees}>
              <span className={s.guarantee}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L3 7v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V7l-9-5z" />
                </svg>
                Données protégées
              </span>
              <span className={s.guarantee}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                100% gratuit
              </span>
            </div>
          </div>
        </div>
      </main>

      <Footer2 />
    </>
  );
}
