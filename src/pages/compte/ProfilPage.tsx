import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import SEO from "@/components/SEO";
import { updateProfile } from "firebase/auth";
import { useAuth } from "@/contexts/AuthContext";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2/Footer2";
import s from "./compte.module.css";

export default function ProfilPage() {
  const { user, loading } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (loading) return null;
  if (!user) return <Navigate to="/compte" replace />;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await updateProfile(user!, { displayName });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <SEO title="Mon profil" url="/compte/profil" noindex />
      <SiteHeader />
      <main className={s.page}>
        <div className={s.inner}>
          <div className={s.header}>
            <div className={s.headerLeft}>
              <a href="/compte" className={s.backLink}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
                Retour
              </a>
              <h1 className={s.pageTitle}>Mon <em>profil</em></h1>
            </div>
          </div>

          <div className={s.chapterMark}>
            <span className={s.cNum}>Ch.01</span>
            <span className={s.cSep}>/</span>
            <span className={s.cLabel}>Informations</span>
          </div>

          <form className={s.profileForm} onSubmit={handleSubmit}>
            <div className={s.profileField}>
              <label className={s.profileLabel}>Adresse e-mail</label>
              <input
                className={s.profileInput}
                type="email"
                value={user.email || ""}
                disabled
              />
            </div>
            <div className={s.profileField}>
              <label className={s.profileLabel}>Nom affiché</label>
              <input
                className={s.profileInput}
                type="text"
                placeholder="Votre prénom ou pseudo"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <button type="submit" className={s.profileSave} disabled={saving}>
                {saving ? "Enregistrement…" : "Enregistrer"}
              </button>
              {saved && <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#34A853" }}>Sauvegardé</span>}
            </div>
          </form>
        </div>
      </main>
      <Footer2 />
    </>
  );
}
