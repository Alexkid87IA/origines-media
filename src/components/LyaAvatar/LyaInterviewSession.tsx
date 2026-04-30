import { useState, useRef, useCallback, useEffect } from "react";
import { LyaAvatarWithRef, type LyaAvatarHandle } from "./LyaAvatar";
import type { LyaState } from "./useLyaSession";
import s from "./LyaInterviewSession.module.css";

interface InterviewContext {
  intention: string;
  sujet: string;
}

interface LyaInterviewSessionProps {
  context: InterviewContext;
  onComplete: (recordings: Blob[]) => void;
  onCancel: () => void;
}

const MAX_DURATION = 300;

export default function LyaInterviewSession({
  context,
  onComplete,
  onCancel,
}: LyaInterviewSessionProps) {
  const lyaRef = useRef<LyaAvatarHandle | null>(null);
  const [lyaState, setLyaState] = useState<LyaState>("idle");
  const [timer, setTimer] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);

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
        console.error("[LyaInterview] Camera access failed:", err);
      }
    })();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

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

  const stopRecording = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    setIsRecording(false);
  }, []);

  const finishInterview = useCallback(() => {
    stopRecording();
    lyaRef.current?.disconnect();

    const blob = new Blob(chunksRef.current, { type: chunksRef.current[0]?.type || "video/webm" });
    if (blob.size > 0) {
      onComplete([blob]);
    } else {
      onComplete([]);
    }
  }, [stopRecording, onComplete]);

  const handleCancel = useCallback(() => {
    stopRecording();
    lyaRef.current?.disconnect();
    onCancel();
  }, [stopRecording, onCancel]);

  const handleLyaStateChange = useCallback((state: LyaState) => {
    setLyaState(state);
    if ((state === "ready" || state === "speaking" || state === "listening") && !isRecording && streamRef.current) {
      startRecording();
    }
  }, [isRecording, startRecording]);

  const formatTime = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;

  const stateLabel = (() => {
    switch (lyaState) {
      case "connecting": return "Connexion en cours…";
      case "speaking": return "Lya vous parle…";
      case "listening": return "À vous — parlez naturellement";
      case "ready": return "Entretien en cours";
      case "idle": return "Préparation…";
      case "error": return "Erreur de connexion";
      default: return "";
    }
  })();

  return (
    <div className={s.session}>
      <div className={s.grid}>
        <div className={s.lyaSide}>
          <div className={s.lyaLabel}>
            <span className={s.lyaDot} />
            <span className="mono">Lya</span>
          </div>
          <LyaAvatarWithRef
            lyaRef={lyaRef}
            autoConnect
            intention={context.intention}
            sujet={context.sujet}
            onStateChange={handleLyaStateChange}
            className={s.avatar}
          />
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
