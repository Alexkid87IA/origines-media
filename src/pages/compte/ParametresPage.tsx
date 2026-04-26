import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2/Footer2";
import s from "./compte.module.css";

interface Settings {
  newsletter: boolean;
  notifications: boolean;
  darkMode: boolean;
}

const DEFAULTS: Settings = {
  newsletter: true,
  notifications: true,
  darkMode: false,
};

export default function ParametresPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const [settings, setSettings] = useState<Settings>(DEFAULTS);

  useEffect(() => {
    if (!user) return;
    const ref = doc(db, "users", user.uid, "settings", "preferences");
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) setSettings({ ...DEFAULTS, ...snap.data() } as Settings);
    });
    return unsub;
  }, [user]);

  if (authLoading) return null;
  if (!user) return <Navigate to="/compte" replace />;

  async function toggle(key: keyof Settings) {
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    const ref = doc(db, "users", user!.uid, "settings", "preferences");
    await setDoc(ref, next, { merge: true });
  }

  return (
    <>
      <Helmet><title>Paramètres — Origines Media</title></Helmet>
      <SiteHeader />
      <main className={s.page}>
        <div className={s.inner}>
          <div className={s.header}>
            <div className={s.headerLeft}>
              <a href="/compte" className={s.backLink}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
                Retour
              </a>
              <h1 className={s.pageTitle}><em>Paramètres</em></h1>
            </div>
          </div>

          <div className={s.chapterMark}>
            <span className={s.cNum}>Ch.01</span>
            <span className={s.cSep}>/</span>
            <span className={s.cLabel}>Préférences</span>
          </div>

          <div className={s.settingsGrid}>
            <div className={s.settingsRow}>
              <div>
                <div className={s.settingsLabel}>Newsletter hebdomadaire</div>
                <div className={s.settingsDesc}>Recevez la Lettre du dimanche chaque semaine.</div>
              </div>
              <button
                type="button"
                className={settings.newsletter ? s.settingsToggleOn : s.settingsToggle}
                onClick={() => toggle("newsletter")}
                aria-label="Activer la newsletter"
              />
            </div>
            <div className={s.settingsRow}>
              <div>
                <div className={s.settingsLabel}>Notifications</div>
                <div className={s.settingsDesc}>Alertes pour les nouveaux articles et dossiers.</div>
              </div>
              <button
                type="button"
                className={settings.notifications ? s.settingsToggleOn : s.settingsToggle}
                onClick={() => toggle("notifications")}
                aria-label="Activer les notifications"
              />
            </div>
          </div>

          <div className={s.chapterMark}>
            <span className={s.cNum}>Ch.02</span>
            <span className={s.cSep}>/</span>
            <span className={s.cLabel}>Compte</span>
          </div>

          <div className={s.settingsGrid}>
            <div className={s.settingsRow}>
              <div>
                <div className={s.settingsLabel}>Adresse e-mail</div>
                <div className={s.settingsDesc}>{user.email}</div>
              </div>
            </div>
            <div className={s.settingsRow}>
              <div>
                <div className={s.settingsLabel}>Membre depuis</div>
                <div className={s.settingsDesc}>
                  {user.metadata.creationTime
                    ? new Date(user.metadata.creationTime).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
                    : "—"}
                </div>
              </div>
            </div>
            <div className={s.settingsRow}>
              <div>
                <div className={s.settingsLabel}>Se déconnecter</div>
                <div className={s.settingsDesc}>Fermer votre session sur cet appareil.</div>
              </div>
              <button type="button" className={s.settingsDanger} onClick={logout}>
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer2 />
    </>
  );
}
