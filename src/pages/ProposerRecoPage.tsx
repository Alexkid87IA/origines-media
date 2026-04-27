import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Ticker from "@/components/Ticker/Ticker";
import Footer2 from "@/components/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import SEO from "@/components/SEO";
import { useAuth } from "@/contexts/AuthContext";
import s from "./ProposerRecoPage.module.css";

/* ================================================================
   TYPES
   ================================================================ */

interface RecoItem {
  id: string;
  titre: string;
  description: string;
  imageUrl: string;
  lien: string;
  auteurItem: string;
  annee: string;
  note: number;
  loading: boolean;
}

interface RecoCategory {
  id: string;
  label: string;
  emoji: string;
  color: string;
  placeholder: string;
}

/* ================================================================
   DATA
   ================================================================ */

const CATEGORIES: RecoCategory[] = [
  { id: "livres", label: "Livre", emoji: "📖", color: "#E11D48", placeholder: "Lien Babelio, Goodreads, Amazon…" },
  { id: "films-series", label: "Film & Série", emoji: "🎬", color: "#7C3AED", placeholder: "Lien IMDB, Allociné, Netflix…" },
  { id: "musique", label: "Musique", emoji: "🎵", color: "#2563EB", placeholder: "Lien Spotify, Apple Music, Deezer…" },
  { id: "podcasts", label: "Podcast", emoji: "🎙️", color: "#0D9488", placeholder: "Lien Apple Podcasts, Spotify…" },
  { id: "youtube", label: "YouTube", emoji: "▶️", color: "#DC2626", placeholder: "Lien YouTube…" },
  { id: "reseaux-sociaux", label: "Social", emoji: "📱", color: "#0891B2", placeholder: "Lien Instagram, TikTok, X…" },
  { id: "activite", label: "Activité", emoji: "🧘", color: "#16A34A", placeholder: "Lien ou nom de l’activité…" },
  { id: "destination", label: "Destination", emoji: "✈️", color: "#EA580C", placeholder: "Lien ou nom du lieu…" },
  { id: "culture", label: "Culture", emoji: "🎭", color: "#9333EA", placeholder: "Lien ou référence…" },
  { id: "produit", label: "Produit", emoji: "🛍️", color: "#CA8A04", placeholder: "Lien Amazon, Fnac, site officiel…" },
];

function emptyItem(): RecoItem {
  return {
    id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    titre: "",
    description: "",
    imageUrl: "",
    lien: "",
    auteurItem: "",
    annee: "",
    note: 4,
    loading: false,
  };
}

/* ================================================================
   COMPONENT
   ================================================================ */

export default function ProposerRecoPage() {
  const { user } = useAuth();

  const [step, setStep] = useState(0);
  const [category, setCategory] = useState<string>("");
  const [items, setItems] = useState<RecoItem[]>([emptyItem()]);
  const [titre, setTitre] = useState("");
  const [accroche, setAccroche] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const selectedCat = CATEGORIES.find((c) => c.id === category);
  const accent = selectedCat?.color || "#8B5CF6";

  /* ── Item helpers ── */

  const updateItem = useCallback((id: string, patch: Partial<RecoItem>) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => (prev.length <= 1 ? prev : prev.filter((it) => it.id !== id)));
  }, []);

  const addItem = useCallback(() => {
    setItems((prev) => (prev.length >= 5 ? prev : [...prev, emptyItem()]));
  }, []);

  /* ── Enrich from URL ── */

  const enrichUrl = useCallback(async (id: string, url: string) => {
    if (!url.startsWith("http")) return;
    updateItem(id, { loading: true, lien: url });

    try {
      const res = await fetch("/api/reco/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (res.ok) {
        const data = await res.json();
        const patch: Partial<RecoItem> = { loading: false };
        if (data.title) patch.titre = data.title;
        if (data.description) patch.description = data.description.slice(0, 300);
        if (data.image) patch.imageUrl = data.image;
        if (data.author) patch.auteurItem = data.author;
        if (data.year) patch.annee = data.year;
        if (data.type && !category) setCategory(data.type);
        updateItem(id, patch);
      } else {
        updateItem(id, { loading: false });
      }
    } catch {
      updateItem(id, { loading: false });
    }
  }, [updateItem, category]);

  /* ── Navigation ── */

  const canNext = (): boolean => {
    switch (step) {
      case 0: return !!category;
      case 1: return items.some((it) => it.titre.trim().length >= 2);
      case 2: return titre.trim().length >= 5;
      default: return true;
    }
  };

  const goNext = () => {
    if (!canNext()) return;
    setStep((s) => Math.min(s + 1, 3));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goPrev = () => {
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ── Submit ── */

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/reco/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: category,
          titre: titre.trim(),
          accroche: accroche.trim(),
          items: items
            .filter((it) => it.titre.trim().length > 0)
            .map(({ titre: t, description: d, imageUrl, lien, auteurItem, annee, note }) => ({
              titre: t, description: d, imageUrl, lien, auteurItem, annee, note,
            })),
          userId: user.uid,
          userEmail: user.email || "",
          userName: user.displayName || "",
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.error || "Erreur lors de l’envoi.");
      }
    } catch {
      setError("Erreur réseau. Réessayez.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Render ── */

  if (submitted) {
    return (
      <>
        <SEO title="Merci — Origines Media" description="Votre recommandation a bien été envoyée." />
        <Ticker />
        <SiteHeader />
        <main className={s.page}>
          <section className={s.success}>
            <div className={s.successIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="48" height="48">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h1 className={s.successTitle}>Merci pour votre pépite&nbsp;!</h1>
            <p className={s.successText}>
              Votre recommandation sera relue par notre équipe avant publication.
              Vous recevrez une notification quand elle sera en ligne.
            </p>
            <div className={s.successActions}>
              <Link to="/recommandations" className={s.successBtn}>
                Voir les recommandations
              </Link>
              <button
                className={s.successBtnSecondary}
                onClick={() => {
                  setSubmitted(false);
                  setStep(0);
                  setCategory("");
                  setItems([emptyItem()]);
                  setTitre("");
                  setAccroche("");
                }}
              >
                Proposer une autre reco
              </button>
            </div>
          </section>
        </main>
        <Footer2 />
      </>
    );
  }

  return (
    <>
      <SEO
        title="Proposer une recommandation — Origines Media"
        description="Partagez vos pépites : livres, films, musique, podcasts. Vos recommandations enrichissent notre bibliothèque."
      />
      <Ticker />
      <SiteHeader />
      <main className={s.page}>
        <div className={s.container}>

          {/* Progress */}
          <div className={s.progress}>
            {["Catégorie", "Items", "Titre", "Envoi"].map((label, i) => (
              <button
                key={i}
                className={`${s.progressStep} ${i === step ? s.progressStepActive : ""} ${i < step ? s.progressStepDone : ""}`}
                onClick={() => i < step && setStep(i)}
                disabled={i > step}
                style={{ "--accent": accent } as React.CSSProperties}
              >
                <span className={s.progressNum}>{i + 1}</span>
                <span className={s.progressLabel}>{label}</span>
              </button>
            ))}
          </div>

          {/* ─── Step 0: Category ─── */}
          {step === 0 && (
            <section className={s.stepSection}>
              <span className={s.stepKicker}>Étape 1 sur 4</span>
              <h1 className={s.stepTitle}>
                Quel type de <em>pépite&nbsp;?</em>
              </h1>
              <p className={s.stepDesc}>
                Choisissez la catégorie qui correspond le mieux à ce que vous voulez partager.
              </p>

              <div className={s.catGrid}>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    className={`${s.catCard} ${category === cat.id ? s.catCardActive : ""}`}
                    onClick={() => setCategory(cat.id)}
                    style={{ "--cat-color": cat.color } as React.CSSProperties}
                  >
                    <span className={s.catEmoji}>{cat.emoji}</span>
                    <span className={s.catLabel}>{cat.label}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* ─── Step 1: Items ─── */}
          {step === 1 && (
            <section className={s.stepSection}>
              <span className={s.stepKicker}>Étape 2 sur 4</span>
              <h1 className={s.stepTitle}>
                Vos <em>sélections.</em>
              </h1>
              <p className={s.stepDesc}>
                Collez un lien pour remplir automatiquement, ou saisissez manuellement.
                De 1 à 5 items.
              </p>

              <div className={s.itemsList}>
                {items.map((item, idx) => (
                  <div key={item.id} className={s.itemCard} style={{ "--accent": accent } as React.CSSProperties}>
                    <div className={s.itemHeader}>
                      <span className={s.itemNum} style={{ background: accent, color: "#fff" }}>{idx + 1}</span>
                      {items.length > 1 && (
                        <button className={s.itemRemove} onClick={() => removeItem(item.id)} title="Supprimer">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      )}
                    </div>

                    {/* Link input with auto-enrich */}
                    <div className={s.itemField}>
                      <label className={s.fieldLabel}>Lien</label>
                      <div className={s.linkRow}>
                        <input
                          type="url"
                          className={s.fieldInput}
                          placeholder={selectedCat?.placeholder || "Collez un lien…"}
                          value={item.lien}
                          onChange={(e) => updateItem(item.id, { lien: e.target.value })}
                          onBlur={(e) => {
                            const v = e.target.value.trim();
                            if (v.startsWith("http") && !item.titre) enrichUrl(item.id, v);
                          }}
                          onPaste={(e) => {
                            setTimeout(() => {
                              const v = (e.target as HTMLInputElement).value.trim();
                              if (v.startsWith("http")) enrichUrl(item.id, v);
                            }, 0);
                          }}
                        />
                        {item.loading && <span className={s.linkSpinner} />}
                      </div>
                    </div>

                    {/* Auto-enriched preview */}
                    {item.imageUrl && (
                      <div className={s.enrichPreview}>
                        <img src={item.imageUrl} alt="" className={s.enrichImg} />
                      </div>
                    )}

                    {/* Title */}
                    <div className={s.itemField}>
                      <label className={s.fieldLabel}>Titre *</label>
                      <input
                        type="text"
                        className={s.fieldInput}
                        placeholder="Le titre de votre recommandation"
                        value={item.titre}
                        onChange={(e) => updateItem(item.id, { titre: e.target.value })}
                      />
                    </div>

                    {/* Author + Year row */}
                    <div className={s.itemRow}>
                      <div className={s.itemField}>
                        <label className={s.fieldLabel}>Auteur / Créateur</label>
                        <input
                          type="text"
                          className={s.fieldInput}
                          placeholder="Qui l’a créé ?"
                          value={item.auteurItem}
                          onChange={(e) => updateItem(item.id, { auteurItem: e.target.value })}
                        />
                      </div>
                      <div className={s.itemField}>
                        <label className={s.fieldLabel}>Année</label>
                        <input
                          type="text"
                          className={s.fieldInput}
                          placeholder="2024"
                          value={item.annee}
                          onChange={(e) => updateItem(item.id, { annee: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className={s.itemField}>
                      <label className={s.fieldLabel}>Pourquoi vous aimez</label>
                      <textarea
                        className={s.fieldTextarea}
                        placeholder="En quelques mots, pourquoi cette pépite ?"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, { description: e.target.value })}
                        rows={3}
                      />
                    </div>

                    {/* Note */}
                    <div className={s.itemField}>
                      <label className={s.fieldLabel}>Note</label>
                      <div className={s.noteRow}>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            className={`${s.noteStar} ${n <= item.note ? s.noteStarActive : ""}`}
                            onClick={() => updateItem(item.id, { note: n })}
                            style={{ "--accent": accent } as React.CSSProperties}
                          >
                            <svg viewBox="0 0 24 24" fill={n <= item.note ? accent : "none"} stroke={accent} strokeWidth="2" width="20" height="20">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          </button>
                        ))}
                        <span className={s.noteValue}>{item.note}/5</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {items.length < 5 && (
                <button className={s.addItemBtn} onClick={addItem}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Ajouter un item ({items.length}/5)
                </button>
              )}
            </section>
          )}

          {/* ─── Step 2: Title & description ─── */}
          {step === 2 && (
            <section className={s.stepSection}>
              <span className={s.stepKicker}>Étape 3 sur 4</span>
              <h1 className={s.stepTitle}>
                Donnez un titre à votre <em>sélection.</em>
              </h1>
              <p className={s.stepDesc}>
                Un bon titre donne envie de cliquer. Ex: &laquo;&nbsp;5 albums pour voyager depuis son canapé&nbsp;&raquo;
              </p>

              <div className={s.titleFields}>
                <div className={s.itemField}>
                  <label className={s.fieldLabel}>Titre de la recommandation *</label>
                  <input
                    type="text"
                    className={`${s.fieldInput} ${s.fieldInputLarge}`}
                    placeholder="5 pépites pour…"
                    value={titre}
                    onChange={(e) => setTitre(e.target.value)}
                    maxLength={200}
                  />
                  <span className={s.fieldCount}>{titre.length}/200</span>
                </div>

                <div className={s.itemField}>
                  <label className={s.fieldLabel}>Accroche (optionnel)</label>
                  <textarea
                    className={s.fieldTextarea}
                    placeholder="Une phrase d’intro pour donner le ton…"
                    value={accroche}
                    onChange={(e) => setAccroche(e.target.value)}
                    rows={3}
                    maxLength={500}
                  />
                  <span className={s.fieldCount}>{accroche.length}/500</span>
                </div>
              </div>
            </section>
          )}

          {/* ─── Step 3: Review & Submit ─── */}
          {step === 3 && (
            <section className={s.stepSection}>
              <span className={s.stepKicker}>Étape 4 sur 4</span>
              <h1 className={s.stepTitle}>
                Vérifiez et <em>envoyez.</em>
              </h1>

              <div className={s.review}>
                <div className={s.reviewHeader}>
                  <span className={s.reviewBadge} style={{ background: accent }}>{selectedCat?.label}</span>
                  <h2 className={s.reviewTitle}>{titre}</h2>
                  {accroche && <p className={s.reviewAccroche}>{accroche}</p>}
                </div>

                <div className={s.reviewItems}>
                  {items.filter((it) => it.titre.trim()).map((item, idx) => (
                    <div key={item.id} className={s.reviewItem}>
                      <span className={s.reviewItemNum} style={{ color: accent }}>{String(idx + 1).padStart(2, "0")}</span>
                      <div className={s.reviewItemContent}>
                        {item.imageUrl && <img src={item.imageUrl} alt="" className={s.reviewItemImg} />}
                        <div>
                          <strong className={s.reviewItemTitle}>{item.titre}</strong>
                          {item.auteurItem && <span className={s.reviewItemAuthor}>{item.auteurItem}</span>}
                          {item.description && <p className={s.reviewItemDesc}>{item.description}</p>}
                          <span className={s.reviewItemNote}>
                            {"★".repeat(item.note)}{"☆".repeat(5 - item.note)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {!user && (
                  <div className={s.authGate}>
                    <p>Connectez-vous pour envoyer votre recommandation.</p>
                    <Link to="/connexion" className={s.authBtn}>Se connecter</Link>
                  </div>
                )}

                {error && <p className={s.error}>{error}</p>}
              </div>
            </section>
          )}

          {/* ─── Navigation ─── */}
          <div className={s.nav}>
            {step > 0 && (
              <button className={s.navBtn} onClick={goPrev}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                  <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                </svg>
                Précédent
              </button>
            )}
            <div className={s.navSpacer} />
            {step < 3 ? (
              <button
                className={`${s.navBtn} ${s.navBtnPrimary}`}
                onClick={goNext}
                disabled={!canNext()}
                style={{ "--accent": accent } as React.CSSProperties}
              >
                Suivant
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            ) : (
              <button
                className={`${s.navBtn} ${s.navBtnPrimary}`}
                onClick={handleSubmit}
                disabled={submitting || !user}
                style={{ "--accent": accent } as React.CSSProperties}
              >
                {submitting ? "Envoi en cours…" : "Envoyer ma reco"}
                {!submitting && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                    <path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" />
                  </svg>
                )}
              </button>
            )}
          </div>

        </div>
      </main>
      <ScrollToTopV2 />
      <Footer2 />
    </>
  );
}
