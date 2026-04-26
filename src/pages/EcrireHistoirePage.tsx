import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import SEO from "@/components/SEO";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, serverTimestamp, collection, addDoc } from "firebase/firestore";
import { TAG_CATEGORIES, CATEGORY_ORDER } from "@/lib/tagCategories";
import { UNIVERS } from "@/data/univers";
import s from "./EcrireHistoirePage.module.css";

/* ================================================================
   TYPES
   ================================================================ */

interface StoryDraft {
  categoryId: string | null;
  universId: string | null;
  titre: string;
  recit: string;
  prompt1: string;
  prompt2: string;
  prompt3: string;
  identite: "anonyme" | "pseudo" | "prenom";
  pseudonyme: string;
  trancheAge: string;
  motDeFin: string;
}

const EMPTY_DRAFT: StoryDraft = {
  categoryId: null,
  universId: null,
  titre: "",
  recit: "",
  prompt1: "",
  prompt2: "",
  prompt3: "",
  identite: "anonyme",
  pseudonyme: "",
  trancheAge: "",
  motDeFin: "",
};

const TRANCHES_AGE = [
  "18-24 ans",
  "25-34 ans",
  "35-44 ans",
  "45-54 ans",
  "55-64 ans",
  "65+ ans",
];

const PROMPTS = [
  { key: "prompt1" as const, label: "Qu'est-ce qui a changé dans votre vie ?" },
  { key: "prompt2" as const, label: "Que diriez-vous à quelqu'un qui vit la même chose ?" },
  { key: "prompt3" as const, label: "Quel mot résume votre parcours ?" },
];

const STEPS = ["Bienvenue", "Thématique", "Récit", "Identité", "Relecture"];

/* ================================================================
   PAGE
   ================================================================ */

export default function EcrireHistoirePage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<StoryDraft>(EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [wordCount, setWordCount] = useState(0);

  // Load draft from Firestore
  useEffect(() => {
    if (!user || draftLoaded) return;
    const loadDraft = async () => {
      try {
        const ref = doc(db, "temoignages-brouillons", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data() as Partial<StoryDraft>;
          setDraft((prev) => ({ ...prev, ...data }));
        }
      } catch {
        // silently continue with empty draft
      } finally {
        setDraftLoaded(true);
      }
    };
    loadDraft();
  }, [user, draftLoaded]);

  // Auto-save draft
  const saveDraft = useCallback(
    async (data: StoryDraft) => {
      if (!user) return;
      try {
        const ref = doc(db, "temoignages-brouillons", user.uid);
        await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
      } catch {
        // silent
      }
    },
    [user]
  );

  const updateDraft = useCallback(
    (patch: Partial<StoryDraft>) => {
      setDraft((prev) => {
        const next = { ...prev, ...patch };
        if (saveTimeout.current) clearTimeout(saveTimeout.current);
        saveTimeout.current = setTimeout(() => saveDraft(next), 1500);
        return next;
      });
    },
    [saveDraft]
  );

  // Word count
  useEffect(() => {
    const words = draft.recit.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);
  }, [draft.recit]);

  // Submit
  const handleSubmit = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const resolvedPseudo = draft.pseudonyme || (draft.identite === "prenom" ? user.displayName?.split(" ")[0] || "" : "");
      await addDoc(collection(db, "temoignages-soumissions"), {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName,
        ...draft,
        pseudonyme: resolvedPseudo,
        status: "en-attente",
        createdAt: serverTimestamp(),
      });
      // Clean draft
      const ref = doc(db, "temoignages-brouillons", user.uid);
      await setDoc(ref, { submitted: true, updatedAt: serverTimestamp() });
      setSubmitted(true);
    } catch {
      // TODO: show error
    } finally {
      setSaving(false);
    }
  };

  const goNext = () => {
    saveDraft(draft);
    setStep((s) => Math.min(s + 1, 4));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goPrev = () => {
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const canProceed = (): boolean => {
    switch (step) {
      case 0: return true;
      case 1: return !!draft.categoryId;
      case 2: return draft.titre.trim().length >= 5 && draft.recit.trim().length >= 100;
      case 3: return draft.identite === "anonyme" || draft.pseudonyme.trim().length > 0 || (draft.identite === "prenom" && !!user?.displayName);
      case 4: return true;
      default: return false;
    }
  };

  // ── Auth gate ──
  if (authLoading) {
    return (
      <div className={s.page}>
        <SiteHeader />
        <main className={s.loadingWrap}>
          <div className={s.loadingDot} />
        </main>
        <Footer2 />
      </div>
    );
  }

  if (!user) {
    return (
      <div className={s.page}>
        <SEO
          title="Écrire mon histoire"
          description="Partagez votre témoignage en toute confidentialité. Espace réservé aux membres."
          url="/ecrire-mon-histoire"
        />
        <SiteHeader />
        <main>
          <section className={s.authGate}>
            <div className={s.authGateInner}>
              <div className={s.authGateIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <span className={s.authGateKicker}>Espace membres</span>
              <h1 className={s.authGateTitle}>
                Votre histoire mérite<br />un espace <em>protégé.</em>
              </h1>
              <p className={s.authGateDeck}>
                Pour garantir la confidentialité de chaque récit, l'accès
                à l'outil d'écriture est réservé aux membres inscrits.
                Créez un compte en 30 secondes — c'est gratuit.
              </p>
              <div className={s.authGateActions}>
                <Link to="/inscription" className={s.authGatePrimary}>
                  Créer un compte gratuit
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </Link>
                <Link to="/connexion" className={s.authGateSecondary}>
                  J'ai déjà un compte
                </Link>
              </div>
              <div className={s.authGateGuarantees}>
                <span className={s.authGateGuarantee}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
                  Anonymat garanti
                </span>
                <span className={s.authGateGuarantee}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
                  Sauvegarde automatique
                </span>
                <span className={s.authGateGuarantee}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
                  Relecture avant publication
                </span>
              </div>
            </div>
          </section>
        </main>
        <Footer2 />
        <ScrollToTopV2 />
      </div>
    );
  }

  // ── Submitted state ──
  if (submitted) {
    return (
      <div className={s.page}>
        <SEO title="Récit envoyé" description="Votre témoignage a bien été envoyé. Merci pour votre confiance." url="/ecrire-mon-histoire" />
        <SiteHeader />
        <main>
          <section className={s.successSection}>
            <div className={s.successInner}>
              <div className={s.successIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
              </div>
              <h1 className={s.successTitle}>Merci.</h1>
              <p className={s.successDeck}>
                Votre récit a bien été transmis à notre équipe éditoriale.
                Nous le lirons avec toute l'attention qu'il mérite.
                Vous recevrez un retour sous 7 jours à <strong>{user.email}</strong>.
              </p>
              <div className={s.successActions}>
                <Link to="/temoignages" className={s.successPrimary}>
                  Lire d'autres récits
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </Link>
                <Link to="/" className={s.successSecondary}>
                  Retour à l'accueil
                </Link>
              </div>
            </div>
          </section>
        </main>
        <Footer2 />
        <ScrollToTopV2 />
      </div>
    );
  }

  // ── Main writing experience ──
  return (
    <div className={s.page}>
      <SEO
        title="Écrire mon histoire"
        description="Partagez votre témoignage en toute confidentialité."
        url="/ecrire-mon-histoire"
      />
      <SiteHeader />

      <main>
        {/* ── Progress bar ── */}
        <div className={s.progressWrap}>
          <div className={s.progressBar}>
            <div className={s.progressFill} style={{ width: `${((step + 1) / 5) * 100}%` }} />
          </div>
          <div className={s.progressSteps}>
            {STEPS.map((label, i) => (
              <button
                key={i}
                className={`${s.progressStep} ${i === step ? s.progressStepActive : ""} ${i < step ? s.progressStepDone : ""}`}
                onClick={() => { if (i < step) setStep(i); }}
                disabled={i > step}
              >
                <span className={s.progressStepNum}>{i + 1}</span>
                <span className={s.progressStepLabel}>{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={s.stageWrap}>

          {/* ════════════════════════════════════════════════
             STEP 0 — Bienvenue
             ════════════════════════════════════════════════ */}
          {step === 0 && (
            <section className={s.welcome}>
              <div className={s.welcomeInner}>
                <span className={s.welcomeKicker}>Votre espace d'écriture</span>
                <h1 className={s.welcomeTitle}>
                  Prenez votre temps.<br />
                  Chaque mot <em>compte.</em>
                </h1>
                <p className={s.welcomeDeck}>
                  Cet espace est le vôtre. Personne ne verra votre récit tant que vous ne
                  l'aurez pas envoyé. Votre brouillon se sauvegarde automatiquement — vous
                  pouvez revenir quand vous voulez.
                </p>
                <div className={s.welcomePromises}>
                  <div className={s.welcomePromise}>
                    <div className={s.welcomePromiseIcon}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                    </div>
                    <div>
                      <strong>Anonymat garanti</strong>
                      <span>Vous choisissez si votre nom apparaît ou non. Pseudonyme ou anonymat total.</span>
                    </div>
                  </div>
                  <div className={s.welcomePromise}>
                    <div className={s.welcomePromiseIcon}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
                    </div>
                    <div>
                      <strong>Sauvegarde automatique</strong>
                      <span>Votre brouillon est sauvegardé à chaque modification. Revenez quand vous voulez.</span>
                    </div>
                  </div>
                  <div className={s.welcomePromise}>
                    <div className={s.welcomePromiseIcon}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" /><circle cx="12" cy="12" r="3" /></svg>
                    </div>
                    <div>
                      <strong>Relecture avant publication</strong>
                      <span>Rien n'est publié sans votre accord. L'équipe vous contactera avant mise en ligne.</span>
                    </div>
                  </div>
                </div>
                <button className={s.welcomeCta} onClick={goNext}>
                  Commencer l'écriture
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </button>
              </div>
            </section>
          )}

          {/* ════════════════════════════════════════════════
             STEP 1 — Thématique
             ════════════════════════════════════════════════ */}
          {step === 1 && (
            <section className={s.thematic}>
              <div className={s.stepHeader}>
                <span className={s.stepKicker}>Étape 2 sur 5</span>
                <h2 className={s.stepTitle}>De quoi parle votre <em>histoire ?</em></h2>
                <p className={s.stepDeck}>
                  Choisissez la thématique qui se rapproche le plus de votre récit.
                  Cela nous aidera à le présenter dans le bon contexte.
                </p>
              </div>

              <div className={s.catGrid}>
                {CATEGORY_ORDER.map((catId) => {
                  const cat = TAG_CATEGORIES[catId];
                  const isActive = draft.categoryId === catId;
                  return (
                    <button
                      key={catId}
                      className={`${s.catCard} ${isActive ? s.catCardActive : ""}`}
                      style={{ "--cat-color": cat.couleur } as React.CSSProperties}
                      onClick={() => updateDraft({ categoryId: catId })}
                    >
                      <span className={s.catCardDot} style={{ background: cat.couleur }} />
                      <span className={s.catCardName}>{cat.nom}</span>
                      {isActive && (
                        <span className={s.catCardCheck}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className={s.universSection}>
                <p className={s.universLabel}>Dans quel univers situez-vous votre parcours ?</p>
                <div className={s.universGrid}>
                  {UNIVERS.map((u) => {
                    const isActive = draft.universId === u.id;
                    return (
                      <button
                        key={u.id}
                        className={`${s.universBtn} ${isActive ? s.universBtnActive : ""}`}
                        onClick={() => updateDraft({ universId: u.id })}
                      >
                        <span className={s.universDot} style={{ background: u.color }} />
                        {u.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className={s.stepNav}>
                <button className={s.navBack} onClick={goPrev}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                  Retour
                </button>
                <button className={s.navNext} onClick={goNext} disabled={!canProceed()}>
                  Continuer
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </button>
              </div>
            </section>
          )}

          {/* ════════════════════════════════════════════════
             STEP 2 — Récit
             ════════════════════════════════════════════════ */}
          {step === 2 && (
            <section className={s.writing}>
              <div className={s.writingHeader}>
                <span className={s.stepKicker}>Étape 3 sur 5</span>
                <h2 className={s.stepTitle}>Écrivez votre <em>récit.</em></h2>
                <p className={s.stepDeck}>
                  Pas de règle, pas de format imposé. Écrivez comme ça vient.
                  Les questions ci-dessous sont là pour vous aider si vous êtes bloqué(e).
                </p>
              </div>

              <div className={s.editor}>
                <div className={s.editorTitleWrap}>
                  <input
                    type="text"
                    className={s.editorTitle}
                    value={draft.titre}
                    onChange={(e) => updateDraft({ titre: e.target.value })}
                    placeholder="Le titre de votre histoire…"
                    maxLength={200}
                  />
                  <span className={s.editorTitleCount}>{draft.titre.length}/200</span>
                </div>

                <div className={s.editorBodyWrap}>
                  <textarea
                    className={s.editorBody}
                    value={draft.recit}
                    onChange={(e) => updateDraft({ recit: e.target.value })}
                    placeholder="Commencez à écrire ici…

Prenez le temps qu'il vous faut. Votre brouillon est sauvegardé automatiquement."
                    rows={16}
                  />
                  <div className={s.editorMeta}>
                    <span className={s.editorWordCount}>{wordCount} mot{wordCount > 1 ? "s" : ""}</span>
                    <span className={s.editorAutoSave}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12"><path d="M20 6L9 17l-5-5" /></svg>
                      Brouillon sauvegardé
                    </span>
                  </div>
                </div>

                <div className={s.promptsSection}>
                  <p className={s.promptsLabel}>
                    Besoin d'aide pour démarrer ?
                    <span>Ces questions sont optionnelles.</span>
                  </p>
                  {PROMPTS.map((p) => (
                    <div key={p.key} className={s.promptField}>
                      <label className={s.promptQuestion}>{p.label}</label>
                      <textarea
                        className={s.promptInput}
                        value={draft[p.key]}
                        onChange={(e) => updateDraft({ [p.key]: e.target.value })}
                        rows={3}
                        placeholder="Votre réponse…"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className={s.stepNav}>
                <button className={s.navBack} onClick={goPrev}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                  Retour
                </button>
                <button className={s.navNext} onClick={goNext} disabled={!canProceed()}>
                  Continuer
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </button>
              </div>
              {!canProceed() && (
                <p className={s.validationHint}>
                  Le titre doit faire au moins 5 caractères et le récit au moins 100 caractères.
                </p>
              )}
            </section>
          )}

          {/* ════════════════════════════════════════════════
             STEP 3 — Identité
             ════════════════════════════════════════════════ */}
          {step === 3 && (
            <section className={s.identity}>
              <div className={s.stepHeader}>
                <span className={s.stepKicker}>Étape 4 sur 5</span>
                <h2 className={s.stepTitle}>Comment souhaitez-vous <em>apparaître ?</em></h2>
                <p className={s.stepDeck}>
                  Vous gardez le contrôle total. Rien ne sera publié sans votre accord.
                </p>
              </div>

              <div className={s.identityChoices}>
                {([
                  { value: "anonyme" as const, label: "Anonyme", desc: "Aucune information personnelle ne sera affichée.", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
                  { value: "pseudo" as const, label: "Pseudonyme", desc: "Choisissez un nom d'emprunt.", icon: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 110 8 4 4 0 010-8z" },
                  { value: "prenom" as const, label: "Mon prénom", desc: `Apparaîtra comme « ${user.displayName?.split(" ")[0] || "Prénom"} ».`, icon: "M20 6L9 17l-5-5" },
                ]).map((opt) => (
                  <button
                    key={opt.value}
                    className={`${s.identityCard} ${draft.identite === opt.value ? s.identityCardActive : ""}`}
                    onClick={() => {
                      const patch: Partial<StoryDraft> = { identite: opt.value };
                      if (opt.value === "prenom" && !draft.pseudonyme) {
                        patch.pseudonyme = user.displayName?.split(" ")[0] || "";
                      }
                      updateDraft(patch);
                    }}
                  >
                    <div className={s.identityCardIcon}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d={opt.icon} /></svg>
                    </div>
                    <strong>{opt.label}</strong>
                    <span>{opt.desc}</span>
                    {draft.identite === opt.value && (
                      <div className={s.identityCardCheck}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {draft.identite === "pseudo" && (
                <div className={s.pseudoField}>
                  <label className={s.fieldLabel}>Votre pseudonyme</label>
                  <input
                    type="text"
                    className={s.fieldInput}
                    value={draft.pseudonyme}
                    onChange={(e) => updateDraft({ pseudonyme: e.target.value })}
                    placeholder="Ex : Marie L."
                    maxLength={50}
                  />
                </div>
              )}

              {draft.identite === "prenom" && (
                <div className={s.pseudoField}>
                  <label className={s.fieldLabel}>Votre prénom (ou surnom)</label>
                  <input
                    type="text"
                    className={s.fieldInput}
                    value={draft.pseudonyme || user.displayName?.split(" ")[0] || ""}
                    onChange={(e) => updateDraft({ pseudonyme: e.target.value })}
                    placeholder="Ex : Marie"
                    maxLength={50}
                  />
                </div>
              )}

              <div className={s.optionalFields}>
                <div className={s.optionalField}>
                  <label className={s.fieldLabel}>
                    Tranche d'âge <span className={s.fieldOptional}>(optionnel)</span>
                  </label>
                  <div className={s.ageGrid}>
                    {TRANCHES_AGE.map((t) => (
                      <button
                        key={t}
                        className={`${s.ageBtn} ${draft.trancheAge === t ? s.ageBtnActive : ""}`}
                        onClick={() => updateDraft({ trancheAge: draft.trancheAge === t ? "" : t })}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={s.optionalField}>
                  <label className={s.fieldLabel}>
                    Un mot de la fin ? <span className={s.fieldOptional}>(optionnel)</span>
                  </label>
                  <textarea
                    className={s.fieldTextarea}
                    value={draft.motDeFin}
                    onChange={(e) => updateDraft({ motDeFin: e.target.value })}
                    rows={2}
                    placeholder="Un message pour ceux qui vous liront…"
                  />
                </div>
              </div>

              <div className={s.stepNav}>
                <button className={s.navBack} onClick={goPrev}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                  Retour
                </button>
                <button className={s.navNext} onClick={goNext} disabled={!canProceed()}>
                  Prévisualiser
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </button>
              </div>
            </section>
          )}

          {/* ════════════════════════════════════════════════
             STEP 4 — Relecture & Envoi
             ════════════════════════════════════════════════ */}
          {step === 4 && (
            <section className={s.review}>
              <div className={s.stepHeader}>
                <span className={s.stepKicker}>Étape 5 sur 5</span>
                <h2 className={s.stepTitle}>Relisez votre <em>récit.</em></h2>
                <p className={s.stepDeck}>
                  Voici comment votre témoignage apparaîtra. Vous pouvez revenir en arrière
                  pour modifier n'importe quelle partie.
                </p>
              </div>

              <article className={s.preview}>
                <div className={s.previewHeader}>
                  {draft.categoryId && TAG_CATEGORIES[draft.categoryId] && (
                    <span className={s.previewCat}>
                      <span className={s.previewCatDot} style={{ background: TAG_CATEGORIES[draft.categoryId].couleur }} />
                      {TAG_CATEGORIES[draft.categoryId].nom}
                    </span>
                  )}
                  {draft.universId && (
                    <span className={s.previewUnivers}>
                      {UNIVERS.find((u) => u.id === draft.universId)?.name}
                    </span>
                  )}
                </div>

                <h3 className={s.previewTitle}>{draft.titre || "Sans titre"}</h3>

                <div className={s.previewAuthor}>
                  <span className={s.previewAuthorName}>
                    {draft.identite === "anonyme" ? "Anonyme" : draft.pseudonyme || user.displayName?.split(" ")[0] || "Anonyme"}
                  </span>
                  {draft.trancheAge && (
                    <>
                      <span className={s.previewDot} />
                      <span>{draft.trancheAge}</span>
                    </>
                  )}
                  <span className={s.previewDot} />
                  <span>{wordCount} mots</span>
                </div>

                <div className={s.previewBody}>
                  {draft.recit.split("\n").map((p, i) =>
                    p.trim() ? <p key={i}>{p}</p> : <br key={i} />
                  )}
                </div>

                {(draft.prompt1 || draft.prompt2 || draft.prompt3) && (
                  <div className={s.previewPrompts}>
                    {PROMPTS.map((p) => {
                      const val = draft[p.key];
                      if (!val) return null;
                      return (
                        <div key={p.key} className={s.previewPrompt}>
                          <strong>{p.label}</strong>
                          <p>{val}</p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {draft.motDeFin && (
                  <div className={s.previewMotFin}>
                    <em>« {draft.motDeFin} »</em>
                  </div>
                )}
              </article>

              <div className={s.submitSection}>
                <p className={s.submitNote}>
                  En envoyant votre récit, vous acceptez qu'il soit relu par l'équipe éditoriale
                  d'Origines Media. Rien ne sera publié sans votre accord explicite.
                </p>
                <div className={s.submitActions}>
                  <button className={s.navBack} onClick={goPrev}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                    Modifier
                  </button>
                  <button className={s.submitBtn} onClick={handleSubmit} disabled={saving}>
                    {saving ? (
                      <>
                        <span className={s.spinner} />
                        Envoi en cours…
                      </>
                    ) : (
                      <>
                        Envoyer mon récit
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </section>
          )}

        </div>
      </main>

      <Footer2 />
      <ScrollToTopV2 />
    </div>
  );
}
