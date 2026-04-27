import { useState, useEffect, useRef, useCallback } from "react";
import s from "./VideoRecorder.module.css";

/* ================================================================
   TYPES
   ================================================================ */

interface Question {
  label: string;
  hint?: string;
}

interface AiNextResult {
  done: boolean;
  question?: Question;
  encouragement?: string;
}

interface PreflightContext {
  firstTime: string;
  availableTime: string;
  mood: string;
}

interface VideoRecorderProps {
  questions: Question[];
  onComplete: (recordings: Blob[]) => void;
  onCancel: () => void;
  onAfterRecord?: (blob: Blob, questionLabel: string, preflightCtx?: PreflightContext) => Promise<AiNextResult>;
}

type Phase = "permission" | "preflight" | "ready" | "countdown" | "recording" | "review" | "processing";

/* ================================================================
   PREFLIGHT CHECKLIST
   ================================================================ */

interface PreflightItem {
  id: string;
  lyaIntro: string;
  question: string;
  options: { label: string; value: string; ok: boolean }[];
  tip: string;
}

const PREFLIGHT_CHECKS: PreflightItem[] = [
  {
    id: "welcome",
    lyaIntro: "Bonjour ! Je suis Lya, votre guide pour cet entretien. Avant de commencer, on va prendre quelques minutes pour bien se préparer ensemble.",
    question: "C'est la première fois que vous racontez votre histoire face caméra ?",
    options: [
      { label: "Oui, c'est la première fois", value: "first-time", ok: true },
      { label: "Non, j'ai déjà témoigné", value: "experienced", ok: true },
      { label: "J'ai un peu le trac…", value: "nervous", ok: true },
    ],
    tip: "Quelle que soit votre réponse, c'est parfait. Chaque témoignage est unique.",
  },
  {
    id: "time",
    lyaIntro: "",
    question: "De combien de temps disposez-vous pour cet entretien ?",
    options: [
      { label: "5 à 10 minutes", value: "short", ok: true },
      { label: "15 à 20 minutes", value: "medium", ok: true },
      { label: "30 minutes ou plus", value: "long", ok: true },
    ],
    tip: "Pas de pression — je m'adapterai à votre rythme. Même 5 minutes peuvent suffire pour un beau témoignage.",
  },
  {
    id: "mood",
    lyaIntro: "",
    question: "Comment vous sentez-vous en ce moment ?",
    options: [
      { label: "Serein·e, prêt·e à parler", value: "calm", ok: true },
      { label: "Un peu ému·e", value: "emotional", ok: true },
      { label: "Motivé·e, j'ai envie de raconter", value: "motivated", ok: true },
      { label: "Hésitant·e, mais j'y vais", value: "hesitant", ok: true },
    ],
    tip: "Il n'y a pas de mauvais état d'esprit. Si c'est difficile, on ira doucement.",
  },
  {
    id: "light",
    lyaIntro: "Très bien. Maintenant, vérifions quelques points techniques pour que votre vidéo soit belle.",
    question: "Est-ce que votre visage est bien éclairé ?",
    options: [
      { label: "Oui, c'est bon", value: "yes", ok: true },
      { label: "C'est un peu sombre", value: "no", ok: false },
    ],
    tip: "Placez-vous face à une fenêtre ou une lampe. Évitez les contre-jours (lumière derrière vous).",
  },
  {
    id: "sound",
    lyaIntro: "",
    question: "Êtes-vous dans un endroit calme ?",
    options: [
      { label: "Oui, c'est calme", value: "yes", ok: true },
      { label: "Il y a du bruit", value: "no", ok: false },
    ],
    tip: "Fermez les fenêtres, éloignez-vous des sources de bruit. Si possible, utilisez des écouteurs avec micro.",
  },
  {
    id: "go",
    lyaIntro: "Parfait, tout est prêt. La première question va s'afficher à l'écran — répondez comme si vous parliez à un ami. Pas de bonne ou mauvaise réponse.",
    question: "On y va ?",
    options: [
      { label: "C'est parti !", value: "go", ok: true },
      { label: "J'ai besoin d'un instant", value: "wait", ok: false },
    ],
    tip: "Prenez une grande respiration. Je suis là avec vous du début à la fin.",
  },
];

const LYA_PREFLIGHT_RESPONSES: Record<string, Record<string, string>> = {
  welcome: {
    "first-time": "Bienvenue ! Ne vous inquiétez pas, je serai là pour vous guider pas à pas. Il n'y a rien à préparer — juste être vous-même.",
    "experienced": "Super, vous connaissez déjà l'exercice. On va quand même prendre un moment pour bien se préparer.",
    "nervous": "C'est tout à fait normal ! Le trac disparaît dès les premières secondes. Et si besoin, vous pourrez refaire n'importe quelle réponse.",
  },
  time: {
    "short": "Compris. Je poserai des questions courtes et ciblées pour aller à l'essentiel.",
    "medium": "Très bien, c'est le format idéal. On aura le temps de bien développer votre histoire.",
    "long": "Parfait, on va pouvoir prendre le temps de creuser en profondeur. Votre histoire le mérite.",
  },
  mood: {
    "calm": "C'est l'idéal. Cette sérénité va se ressentir dans votre témoignage.",
    "emotional": "C'est normal et c'est précieux. L'émotion donne de la force à un témoignage. On ira à votre rythme.",
    "motivated": "J'adore cette énergie ! On va faire quelque chose de beau ensemble.",
    "hesitant": "Le courage, c'est justement d'y aller malgré l'hésitation. On avance ensemble, un pas à la fois.",
  },
  light: {
    "yes": "Parfait, la lumière a l'air bonne.",
    "no": "Essayez de vous rapprocher d'une source de lumière. Regardez le rendu à l'écran et réessayez.",
  },
  sound: {
    "yes": "Très bien. Le son est important pour la qualité de votre témoignage.",
    "no": "Si possible, trouvez un coin plus calme. Sinon, ce n'est pas grave — on fera avec.",
  },
  go: {
    "go": "Alors allons-y. Je suis là avec vous. 💜",
    "wait": "Prenez votre temps. Quand vous êtes prêt·e, appuyez sur « C'est parti ».",
  },
};

/* ================================================================
   HELPERS
   ================================================================ */

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const r = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

const MAX_DURATION = 120;

const ENCOURAGEMENTS = [
  "Bravo, c'est dans la boîte.",
  "Parfait, bien joué.",
  "Très bien, on continue.",
  "Super, encore un effort.",
];

/* ================================================================
   COMPONENT
   ================================================================ */

export default function VideoRecorder({ questions: initialQuestions, onComplete, onCancel, onAfterRecord }: VideoRecorderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reviewRef = useRef<HTMLVideoElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [phase, setPhase] = useState<Phase>("permission");
  const [questionIdx, setQuestionIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [recordings, setRecordings] = useState<(Blob | null)[]>(() => initialQuestions.map(() => null));
  const [reviewUrl, setReviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aiDone, setAiDone] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [preflightIdx, setPreflightIdx] = useState(0);
  const [preflightMsg, setPreflightMsg] = useState<string | null>(null);
  const [preflightAnswered, setPreflightAnswered] = useState(false);
  const preflightCtxRef = useRef<Record<string, string>>({});
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);

  const currentQ = questions[questionIdx];
  const isAiMode = !!onAfterRecord;
  const isLastQuestion = isAiMode ? aiDone : questionIdx >= questions.length - 1;
  const doneCount = recordings.filter(Boolean).length;

  // ── Request camera ──
  const requestCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setPhase("preflight");
      setError(null);
    } catch {
      setError("Impossible d'accéder à la caméra. Vérifiez les autorisations de votre navigateur.");
    }
  }, []);

  // ── Auto-request on mount ──
  useEffect(() => {
    requestCamera();
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Attach stream to video element when phase changes ──
  useEffect(() => {
    if ((phase === "preflight" || phase === "ready" || phase === "countdown" || phase === "recording") && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [phase]);

  // ── Countdown before recording ──
  const startCountdown = useCallback(() => {
    setCountdown(3);
    setPhase("countdown");
  }, []);

  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdown <= 0) {
      doStartRecording();
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, countdown]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Start recording ──
  const doStartRecording = useCallback(() => {
    if (!streamRef.current) return;

    chunksRef.current = [];
    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
      ? "video/webm;codecs=vp9,opus"
      : MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus")
        ? "video/webm;codecs=vp8,opus"
        : "video/webm";

    const recorder = new MediaRecorder(streamRef.current, { mimeType });
    recorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType });
      const url = URL.createObjectURL(blob);

      setRecordings((prev) => {
        const next = [...prev];
        if (questionIdx < next.length) {
          next[questionIdx] = blob;
        } else {
          next.push(blob);
        }
        return next;
      });
      setReviewUrl(url);
      setPhase("review");

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    recorder.start(1000);
    setElapsed(0);
    setPhase("recording");

    timerRef.current = setInterval(() => {
      setElapsed((prev) => {
        if (prev + 1 >= MAX_DURATION) {
          recorderRef.current?.stop();
          return prev + 1;
        }
        return prev + 1;
      });
    }, 1000);
  }, [questionIdx]);

  // ── Stop recording ──
  const stopRecording = useCallback(() => {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
  }, []);

  // ── Retake current question ──
  const retake = useCallback(() => {
    if (reviewUrl) URL.revokeObjectURL(reviewUrl);
    setReviewUrl(null);
    setRecordings((prev) => {
      const next = [...prev];
      next[questionIdx] = null;
      return next;
    });
    setPhase("ready");
  }, [reviewUrl, questionIdx]);

  // ── User chooses to stop early (AI mode) ──
  const requestFinish = useCallback(() => {
    setShowFinishConfirm(true);
  }, []);

  const cancelFinish = useCallback(() => {
    setShowFinishConfirm(false);
  }, []);

  const confirmFinish = useCallback(() => {
    setShowFinishConfirm(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
    if (reviewUrl) URL.revokeObjectURL(reviewUrl);
    setAiDone(true);
    const blobs = recordings.filter((b): b is Blob => b !== null);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    onComplete(blobs);
  }, [recordings, onComplete, reviewUrl]);

  // ── Next question or finish ──
  const advance = useCallback(async () => {
    if (reviewUrl) URL.revokeObjectURL(reviewUrl);
    setReviewUrl(null);

    if (isAiMode && !aiDone) {
      const currentBlob = recordings[questionIdx];
      if (!currentBlob) return;

      setPhase("processing");
      setAiMessage(null);

      try {
        const ctx: PreflightContext = {
          firstTime: preflightCtxRef.current.welcome || "",
          availableTime: preflightCtxRef.current.time || "",
          mood: preflightCtxRef.current.mood || "",
        };
        const result = await onAfterRecord!(currentBlob, currentQ.label, ctx);
        if (result.encouragement) setAiMessage(result.encouragement);

        if (result.done) {
          setAiDone(true);
          setTimeout(() => {
            const blobs = recordings.filter((b): b is Blob => b !== null);
            if (currentBlob && !blobs.includes(currentBlob)) blobs.push(currentBlob);
            streamRef.current?.getTracks().forEach((t) => t.stop());
            onComplete(blobs);
          }, 2000);
          return;
        }

        if (result.question) {
          setQuestions((prev) => [...prev, result.question!]);
          setRecordings((prev) => [...prev, null]);
          setTimeout(() => {
            setQuestionIdx((i) => i + 1);
            setPhase("ready");
          }, 1500);
        } else {
          setPhase("ready");
        }
      } catch (err) {
        console.error("[VideoRecorder] advance error:", err);
        setAiMessage("Un problème est survenu. Vous pouvez continuer ou terminer.");
        setTimeout(() => setPhase("ready"), 2000);
      }
      return;
    }

    if (questionIdx < questions.length - 1) {
      setQuestionIdx((i) => i + 1);
      setPhase("ready");
    } else {
      const blobs = recordings.filter((b): b is Blob => b !== null);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      onComplete(blobs);
    }
  }, [reviewUrl, questionIdx, questions.length, recordings, onComplete, isAiMode, aiDone, onAfterRecord, currentQ]);

  /* ── Lya avatar (shared) ── */
  const lyaIcon = (cls?: string) => (
    <div className={`${s.lyaAvatar} ${cls || ""}`}>L</div>
  );

  /* ── Question dots (shared) ── */
  const dots = (
    <div className={s.questionNav}>
      {questions.map((_, i) => (
        <div
          key={i}
          className={`${s.questionDot} ${i === questionIdx ? s.questionDotActive : ""} ${recordings[i] ? s.questionDotDone : ""}`}
        />
      ))}
      <span className={s.questionNavLabel}>
        {doneCount} / {questions.length}
      </span>
    </div>
  );

  // ── Permission gate ──
  if (phase === "permission" && error) {
    return (
      <div className={s.recorder}>
        <div className={s.permissionGate}>
          {lyaIcon()}
          <h3 className={s.permissionTitle}>Caméra requise</h3>
          <p className={s.permissionText}>{error}</p>
          <div className={s.permissionActions}>
            <button className={`${s.controlBtn} ${s.recordBtn}`} onClick={requestCamera}>Réessayer</button>
            <button className={s.controlBtn} onClick={onCancel}>Revenir au texte</button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "permission") {
    return (
      <div className={s.recorder}>
        <div className={s.permissionGate}>
          {lyaIcon(s.lyaAvatarPulse)}
          <h3 className={s.permissionTitle}>Accès à la caméra</h3>
          <p className={s.permissionText}>Autorisez l'accès à votre caméra et micro pour enregistrer votre témoignage.</p>
          <div className={s.permissionLoader}>
            <div className={s.permissionLoaderDot} />
          </div>
        </div>
      </div>
    );
  }

  // ── Preflight checklist (Lya) ──
  if (phase === "preflight") {
    const check = PREFLIGHT_CHECKS[preflightIdx];
    const isLastCheck = preflightIdx >= PREFLIGHT_CHECKS.length - 1;

    const handlePreflightAnswer = (value: string, ok: boolean) => {
      preflightCtxRef.current[check.id] = value;
      const responses = LYA_PREFLIGHT_RESPONSES[check.id];
      setPreflightMsg(responses?.[value] || "");
      setPreflightAnswered(true);

      if (ok && isLastCheck) {
        setTimeout(() => setPhase("ready"), 1500);
        return;
      }

      if (ok) {
        setTimeout(() => {
          setPreflightIdx((i) => i + 1);
          setPreflightMsg(null);
          setPreflightAnswered(false);
        }, 1500);
      }
    };

    return (
      <div className={s.recorder}>
        <div className={s.viewport}>
          <video ref={videoRef} className={s.video} autoPlay muted playsInline />
          <div className={s.preflightOverlay} />

          <div className={s.preflightConversation} key={preflightIdx}>
            <div className={s.preflightBubble}>
              {lyaIcon(s.lyaAvatarSmall)}
              <div className={s.preflightBubbleBody}>
                <p className={s.preflightBubbleName}>Lya</p>

                {check.lyaIntro && !preflightAnswered && (
                  <p className={s.preflightIntro}>{check.lyaIntro}</p>
                )}

                <p className={s.preflightQuestion}>{check.question}</p>

                {preflightMsg ? (
                  <p className={s.preflightResponse}>{preflightMsg}</p>
                ) : (
                  <div className={s.preflightOptions}>
                    {check.options.map((opt) => (
                      <button
                        key={opt.value}
                        className={`${s.preflightOption} ${opt.ok ? s.preflightOptionOk : s.preflightOptionWarn}`}
                        onClick={() => handlePreflightAnswer(opt.value, opt.ok)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}

                {!preflightAnswered && (
                  <p className={s.preflightTip}>{check.tip}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={s.preflightBottom}>
          <div className={s.preflightProgress}>
            {PREFLIGHT_CHECKS.map((_, i) => (
              <div
                key={i}
                className={`${s.preflightDot} ${i === preflightIdx ? s.preflightDotActive : ""} ${i < preflightIdx ? s.preflightDotDone : ""}`}
              />
            ))}
            <span className={s.questionNavLabel}>{preflightIdx + 1} / {PREFLIGHT_CHECKS.length}</span>
          </div>
          <button className={s.preflightSkip} onClick={() => setPhase("ready")}>
            Passer →
          </button>
        </div>
      </div>
    );
  }

  // ── AI Processing state ──
  if (phase === "processing") {
    return (
      <div className={s.recorder}>
        {dots}
        <div className={s.viewport}>
          <video ref={videoRef} className={s.video} autoPlay muted playsInline />
          <div className={s.processingOverlay}>
            <div className={s.processingBubble}>
              {lyaIcon(s.lyaAvatarPulse)}
              <div className={s.processingBody}>
                <p className={s.processingName}>Lya</p>
                {aiDone ? (
                  <p className={s.processingText}>
                    {aiMessage || "Merci, j'ai tout ce qu'il faut pour raconter votre histoire."}
                  </p>
                ) : (
                  <>
                    <p className={s.processingText}>
                      {aiMessage || "J'écoute votre réponse…"}
                    </p>
                    <div className={s.processingDots}>
                      <span className={s.processingDot} />
                      <span className={s.processingDot} />
                      <span className={s.processingDot} />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Review state ──
  if (phase === "review" && reviewUrl) {
    return (
      <div className={s.recorder}>
        {dots}

        <div className={s.reviewCard}>
          {/* Encouragement */}
          <div className={s.reviewHeader}>
            <div className={s.reviewCheckCircle}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <div className={s.reviewHeaderText}>
              <strong>{ENCOURAGEMENTS[questionIdx % ENCOURAGEMENTS.length]}</strong>
              <span>
                {isLastQuestion
                  ? "Toutes les questions sont enregistrées."
                  : `Question ${questionIdx + 1} sur ${questions.length} terminée.`}
              </span>
            </div>
          </div>

          {/* Question label */}
          <div className={s.reviewQuestionLabel}>
            <span className={s.reviewQuestionNum}>Q{questionIdx + 1}</span>
            {currentQ.label}
          </div>

          {/* Video */}
          <div className={s.reviewVideoWrap}>
            <video
              ref={reviewRef}
              className={s.reviewVideo}
              src={reviewUrl}
              controls
              playsInline
            />
          </div>

          {/* Actions */}
          <div className={s.reviewActions}>
            <button className={s.controlBtn} onClick={retake}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 105.64-11.36L1 10" />
              </svg>
              Refaire cette réponse
            </button>
            {isAiMode && doneCount >= 2 && !isLastQuestion && (
              <button className={`${s.controlBtn} ${s.finishBtn}`} onClick={requestFinish}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                J'ai terminé
              </button>
            )}
            <button className={`${s.controlBtn} ${s.nextBtn}`} onClick={advance}>
              {isLastQuestion ? (
                <>
                  Terminer l'enregistrement
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </>
              ) : isAiMode ? (
                <>
                  Envoyer à Lya
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              ) : (
                <>
                  Question suivante
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
          </div>

          {/* Next question preview (non-AI mode only) */}
          {!isAiMode && !isLastQuestion && (
            <div className={s.reviewNextPreview}>
              <span className={s.reviewNextLabel}>Prochaine question</span>
              <p className={s.reviewNextQuestion}>{questions[questionIdx + 1].label}</p>
            </div>
          )}

          {/* AI mode hint */}
          {isAiMode && !isLastQuestion && (
            <div className={s.reviewNextPreview}>
              <span className={s.reviewNextLabel}>Mode IA</span>
              <p className={s.reviewNextQuestion}>Lya analysera votre réponse et posera la question suivante.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Camera live + controls ──
  return (
    <div className={s.recorder}>
      {dots}

      {/* Viewport */}
      <div className={s.viewport}>
        <video
          ref={videoRef}
          className={s.video}
          autoPlay
          muted
          playsInline
        />

        {/* Countdown overlay */}
        {phase === "countdown" && (
          <div className={s.countdownOverlay}>
            <span className={s.countdownNum} key={countdown}>
              {countdown}
            </span>
          </div>
        )}

        {/* Teleprompter — Lya bubble */}
        <div className={s.prompter}>
          <div className={s.prompterBubble} key={questionIdx}>
            {isAiMode && lyaIcon(s.lyaAvatarSmall)}
            <div className={s.prompterBody}>
              <span className={s.prompterName}>
                {isAiMode ? (
                  <><span className={s.prompterNameAccent}>Lya</span> · question {questionIdx + 1}</>
                ) : (
                  <>Question {questionIdx + 1} / {questions.length}</>
                )}
              </span>
              <p className={s.prompterQuestion}>{currentQ.label}</p>
              {currentQ.hint && (
                <span className={s.prompterHint}>{currentQ.hint}</span>
              )}
            </div>
          </div>
        </div>

        {/* Recording indicator */}
        {phase === "recording" && (
          <>
            <div className={s.recDot}>
              <span className={s.recDotPulse} />
              REC
            </div>
            <div className={s.timer}>{formatTime(elapsed)}</div>
          </>
        )}
      </div>

      <div className={s.bottomBar}>
      {phase === "ready" && (
        <div className={s.readyHint}>
          {isAiMode
            ? "Lisez la question de Lya, puis appuyez sur le bouton rouge."
            : "Lisez la question à l'écran, puis lancez l'enregistrement."}
        </div>
      )}

      {phase === "recording" && (
        <div className={s.recordingHint}>
          Parlez naturellement · Appuyez sur « Stop » quand vous avez fini
        </div>
      )}

      <div className={s.controls}>
        <button className={s.controlBtn} onClick={onCancel}>
          Annuler
        </button>

        {phase === "ready" && (
          <button className={`${s.controlBtn} ${s.recordBtn}`} onClick={startCountdown}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="8" />
            </svg>
            Lancer l'enregistrement
          </button>
        )}

        {phase === "countdown" && (
          <span className={s.controlHint}>Préparez-vous…</span>
        )}

        {phase === "recording" && (
          <button className={`${s.controlBtn} ${s.stopBtn}`} onClick={stopRecording}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="6" width="12" height="12" rx="1" />
            </svg>
            Arrêter l'enregistrement
          </button>
        )}

        {isAiMode && doneCount >= 1 && (phase === "ready" || phase === "recording") && (
          <button className={`${s.controlBtn} ${s.finishBtn}`} onClick={requestFinish}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            J'ai terminé
          </button>
        )}
      </div>
      </div>

      {/* Confirmation modal */}
      {showFinishConfirm && (
        <div className={s.confirmOverlay}>
          <div className={s.confirmCard}>
            {lyaIcon()}
            <div className={s.confirmContent}>
              <p className={s.processingName}>Lya</p>
              <p className={s.confirmText}>
                Vous avez enregistré {doneCount} vidéo{doneCount > 1 ? "s" : ""}. Si vous terminez maintenant, {doneCount > 1 ? "elles seront envoyées" : "elle sera envoyée"} à notre équipe.
              </p>
              <p className={s.confirmSubtext}>Êtes-vous sûr·e de vouloir terminer ?</p>
              <div className={s.confirmActions}>
                <button className={s.controlBtn} onClick={cancelFinish}>
                  Non, je continue
                </button>
                <button className={`${s.controlBtn} ${s.confirmFinishBtn}`} onClick={confirmFinish}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  Oui, terminer et envoyer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
