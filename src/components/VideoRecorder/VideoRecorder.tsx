import { useState, useEffect, useRef, useCallback } from "react";
import s from "./VideoRecorder.module.css";

/* ================================================================
   TYPES
   ================================================================ */

interface Question {
  label: string;
  hint?: string;
}

interface VideoRecorderProps {
  questions: Question[];
  onComplete: (recordings: Blob[]) => void;
  onCancel: () => void;
}

type Phase = "permission" | "ready" | "countdown" | "recording" | "review";

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

export default function VideoRecorder({ questions, onComplete, onCancel }: VideoRecorderProps) {
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
  const [recordings, setRecordings] = useState<(Blob | null)[]>(() => questions.map(() => null));
  const [reviewUrl, setReviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentQ = questions[questionIdx];
  const isLastQuestion = questionIdx >= questions.length - 1;
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
      setPhase("ready");
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
    if ((phase === "ready" || phase === "countdown" || phase === "recording") && videoRef.current && streamRef.current) {
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
        next[questionIdx] = blob;
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

  // ── Next question or finish ──
  const advance = useCallback(() => {
    if (reviewUrl) URL.revokeObjectURL(reviewUrl);
    setReviewUrl(null);

    if (questionIdx < questions.length - 1) {
      setQuestionIdx((i) => i + 1);
      setPhase("ready");
    } else {
      const blobs = recordings.filter((b): b is Blob => b !== null);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      onComplete(blobs);
    }
  }, [reviewUrl, questionIdx, questions.length, recordings, onComplete]);

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
          <div className={s.permissionIconWrap}>
            <svg className={s.permissionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M23 7l-7 5 7 5V7z" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
          </div>
          <h3 className={s.permissionTitle}>Caméra requise</h3>
          <p className={s.permissionText}>{error}</p>
          <div className={s.permissionActions}>
            <button className={`${s.controlBtn} ${s.recordBtn}`} onClick={requestCamera}>
              Réessayer
            </button>
            <button className={s.controlBtn} onClick={onCancel}>
              Revenir au texte
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "permission") {
    return (
      <div className={s.recorder}>
        <div className={s.permissionGate}>
          <div className={s.permissionIconWrap}>
            <svg className={s.permissionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M23 7l-7 5 7 5V7z" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
          </div>
          <h3 className={s.permissionTitle}>Accès à la caméra</h3>
          <p className={s.permissionText}>
            Autorisez l'accès à votre caméra et micro pour enregistrer votre témoignage vidéo.
          </p>
          <div className={s.permissionLoader}>
            <div className={s.permissionLoaderDot} />
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
            <button className={`${s.controlBtn} ${s.nextBtn}`} onClick={advance}>
              {isLastQuestion ? (
                <>
                  Terminer l'enregistrement
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
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

          {/* Next question preview */}
          {!isLastQuestion && (
            <div className={s.reviewNextPreview}>
              <span className={s.reviewNextLabel}>Prochaine question</span>
              <p className={s.reviewNextQuestion}>{questions[questionIdx + 1].label}</p>
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

        {/* Teleprompter */}
        <div className={s.prompter}>
          <span className={s.prompterKicker}>
            Question {questionIdx + 1} / {questions.length}
          </span>
          <p className={s.prompterQuestion}>{currentQ.label}</p>
          {currentQ.hint && (
            <span className={s.prompterHint}>{currentQ.hint}</span>
          )}
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

      {/* Instruction hint */}
      {phase === "ready" && (
        <div className={s.readyHint}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          Lisez la question à l'écran, puis appuyez sur le bouton rouge pour lancer l'enregistrement.
        </div>
      )}

      {phase === "recording" && (
        <div className={s.recordingHint}>
          Parlez naturellement. Appuyez sur « Arrêter » quand vous avez terminé votre réponse.
        </div>
      )}

      {/* Controls */}
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
      </div>
    </div>
  );
}
