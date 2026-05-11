import { useState, useRef, useCallback, useEffect } from "react";
import { useLyaRealtime, type LyaRealtimeState } from "./useLyaRealtime";
import s from "./LyaRealtimeSession.module.css";

interface LyaRealtimeSessionProps {
  context: { intention: string; sujet: string };
  onComplete: (recordings: Blob[]) => void;
  onCancel: () => void;
}

const MAX_DURATION = 600;

export default function LyaRealtimeSession({
  context,
  onComplete,
  onCancel,
}: LyaRealtimeSessionProps) {
  const { state: lyaState, error, transcript, connect, disconnect } = useLyaRealtime();
  const [timer, setTimer] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const connectedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true,
        });
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("[LyaRealtime] Camera access failed:", err);
      }
    })();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!connectedRef.current) {
      connectedRef.current = true;
      connect(context.intention, context.sujet);
    }
  }, [connect, context.intention, context.sujet]);

  const startRecording = useCallback(() => {
    if (!streamRef.current || isRecording) return;
    chunksRef.current = [];

    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
      ? "video/webm;codecs=vp9,opus"
      : MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus")
        ? "video/webm;codecs=vp8,opus"
        : "video/webm";

    const recorder = new MediaRecorder(streamRef.current, { mimeType });
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    recorderRef.current = recorder;
    recorder.start(1000);
    setIsRecording(true);

    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t + 1 >= MAX_DURATION) finishInterview();
        return t + 1;
      });
    }, 1000);
  }, [isRecording]);

  useEffect(() => {
    if ((lyaState === "ready" || lyaState === "speaking" || lyaState === "listening") && !isRecording && streamRef.current) {
      startRecording();
    }
  }, [lyaState, isRecording, startRecording]);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  const stopRecording = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    setIsRecording(false);
  }, []);

  const finishInterview = useCallback(() => {
    stopRecording();
    disconnect();

    setTimeout(() => {
      const blob = new Blob(chunksRef.current, { type: chunksRef.current[0]?.type || "video/webm" });
      onComplete(blob.size > 0 ? [blob] : []);
    }, 300);
  }, [stopRecording, disconnect, onComplete]);

  const handleCancel = useCallback(() => {
    stopRecording();
    disconnect();
    onCancel();
  }, [stopRecording, disconnect, onCancel]);

  const formatTime = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;

  const stateLabel = ((): string => {
    switch (lyaState) {
      case "connecting": return "Connexion en cours…";
      case "speaking": return "Lya vous parle…";
      case "listening": return "À vous — parlez naturellement";
      case "ready": return "Entretien en cours";
      case "idle": return "Préparation…";
      case "error": return error || "Erreur de connexion";
      default: return "";
    }
  })();

  const stateIcon = (s: LyaRealtimeState) => {
    if (s === "speaking") return "speaking";
    if (s === "listening") return "listening";
    if (s === "connecting" || s === "idle") return "connecting";
    if (s === "error") return "error";
    return "ready";
  };

  return (
    <div className={s.session}>
      <div className={s.grid}>
        <div className={s.lyaSide}>
          <div className={s.lyaLabel}>
            <span className={s.lyaDot} />
            <span className="mono">Lya</span>
          </div>

          <div className={s.lyaVisual}>
            <div className={`${s.orb} ${s[stateIcon(lyaState)]}`}>
              <div className={s.orbCore} />
              <div className={s.orbRing} />
              <div className={s.orbRing2} />
            </div>
            <p className={s.lyaStatus}>{stateLabel}</p>
          </div>

          {transcript.length > 0 && (
            <div className={s.transcriptArea}>
              {transcript.map((entry, i) => (
                <div
                  key={i}
                  className={`${s.transcriptLine} ${entry.role === "lya" ? s.transcriptLya : s.transcriptUser}`}
                >
                  <span className={s.transcriptRole}>
                    {entry.role === "lya" ? "Lya" : "Vous"}
                  </span>
                  <span className={s.transcriptText}>{entry.text}</span>
                </div>
              ))}
              <div ref={transcriptEndRef} />
            </div>
          )}
        </div>

        <div className={s.userSide}>
          <div className={s.userLabel}>
            <span className={`${s.recDot} ${isRecording ? s.recDotActive : ""}`} />
            <span className="mono">Vous</span>
            {isRecording && (
              <span className={`${s.timer} mono`}>{formatTime(timer)}</span>
            )}
          </div>
          <div className={s.userVideo}>
            <video
              ref={videoPreviewRef}
              className={s.preview}
              autoPlay
              playsInline
              muted
            />
          </div>
        </div>
      </div>

      <div className={s.bottomBar}>
        <div className={s.questionArea}>
          <p className={s.questionText}>{stateLabel}</p>
        </div>

        <div className={s.controls}>
          {isRecording && (
            <button type="button" className={s.stopBtn} onClick={finishInterview}>
              <span className={s.stopIcon} />
              Terminer
            </button>
          )}
          <button type="button" className={s.cancelBtn} onClick={handleCancel}>
            Quitter
          </button>
        </div>

        <div className={s.exchangeMeta}>
          <span className="mono">{formatTime(timer)}</span>
        </div>
      </div>
    </div>
  );
}
