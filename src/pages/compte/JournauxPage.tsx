import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";
import { useJournals } from "@/hooks/useJournals";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2/Footer2";
import s from "./compte.module.css";

const PROMPTS = [
  "Qu'est-ce qui vous a marqué aujourd'hui ?",
  "De quoi êtes-vous reconnaissant·e en ce moment ?",
  "Quel défi avez-vous relevé cette semaine ?",
  "Qu'avez-vous appris récemment sur vous-même ?",
  "Si vous pouviez changer une chose dans votre journée, laquelle serait-ce ?",
  "Quel moment de la journée vous a apporté le plus de calme ?",
  "Qu'est-ce qui vous inspire en ce moment ?",
  "Comment décririez-vous votre état d'esprit aujourd'hui en trois mots ?",
  "Quel est le petit bonheur que vous avez remarqué aujourd'hui ?",
  "Quelle intention souhaitez-vous poser pour demain ?",
];

const MOODS = ["😌", "😊", "🤔", "😔", "🔥"];

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(d: string) {
  return new Date(d + "T12:00:00").toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function dailyPrompt() {
  const day = Math.floor(Date.now() / 86400000);
  return PROMPTS[day % PROMPTS.length];
}

export default function JournauxPage() {
  const { user, loading: authLoading } = useAuth();
  const { entries, loading, saveEntry } = useJournals();
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const current = entries.find((e) => e.date === selectedDate);
  const prompt = dailyPrompt();

  useEffect(() => {
    if (current) {
      setContent(current.content);
      setMood(current.mood || "");
    } else {
      setContent("");
      setMood("");
    }
  }, [current, selectedDate]);

  if (authLoading) return null;
  if (!user) return <Navigate to="/compte" replace />;

  async function handleSave() {
    setSaving(true);
    setJustSaved(false);
    await saveEntry(selectedDate, content, prompt, mood);
    setSaving(false);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 3000);
  }

  function handleNewEntry() {
    const today = todayStr();
    setSelectedDate(today);
    if (!entries.find((e) => e.date === today)) {
      setContent("");
      setMood("");
    }
  }

  return (
    <>
      <Helmet><title>Mes journaux — Origines Media</title></Helmet>
      <SiteHeader />
      <main className={s.page}>
        <div className={s.inner}>
          <div className={s.header}>
            <div className={s.headerLeft}>
              <a href="/compte" className={s.backLink}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
                Retour
              </a>
              <h1 className={s.pageTitle}>Mes <em>journaux</em></h1>
            </div>
          </div>

          <div className={s.chapterMark}>
            <span className={s.cNum}>Ch.01</span>
            <span className={s.cSep}>/</span>
            <span className={s.cLabel}>Écriture</span>
          </div>

          {loading ? null : (
            <div className={s.journalLayout}>
              <div className={s.journalSidebar}>
                <button type="button" className={s.journalNewBtn} onClick={handleNewEntry}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
                  Aujourd'hui
                </button>
                {entries.map((e) => (
                  <button
                    key={e.date}
                    type="button"
                    className={e.date === selectedDate ? s.journalDateBtnActive : s.journalDateBtn}
                    onClick={() => setSelectedDate(e.date)}
                  >
                    {e.mood && <span style={{ marginRight: 8 }}>{e.mood}</span>}
                    {formatDate(e.date)}
                  </button>
                ))}
              </div>

              <div className={s.journalMain}>
                <span className={s.journalDate}>{formatDate(selectedDate)}</span>
                <p className={s.journalPrompt}>{prompt}</p>
                <textarea
                  className={s.journalTextarea}
                  placeholder="Écrivez ici… Prenez le temps de poser vos pensées."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <div className={s.journalFooter}>
                  <div className={s.journalMoods}>
                    {MOODS.map((m) => (
                      <button
                        key={m}
                        type="button"
                        className={mood === m ? s.journalMoodActive : s.journalMood}
                        onClick={() => setMood(mood === m ? "" : m)}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {justSaved && <span className={s.journalSaved}>Sauvegardé</span>}
                    <button
                      type="button"
                      className={s.journalSave}
                      onClick={handleSave}
                      disabled={saving || !content.trim()}
                    >
                      {saving ? "Sauvegarde…" : "Sauvegarder"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer2 />
    </>
  );
}
