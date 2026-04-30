import { useRef, useEffect, useCallback } from "react";
import { useLyaSession, type LyaState } from "./useLyaSession";
import s from "./LyaAvatar.module.css";

interface LyaAvatarProps {
  autoConnect?: boolean;
  intention?: string;
  sujet?: string;
  onStateChange?: (state: LyaState) => void;
  className?: string;
}

export interface LyaAvatarHandle {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  state: LyaState;
  isSpeaking: boolean;
}

export default function LyaAvatar({
  autoConnect = false,
  intention,
  sujet,
  onStateChange,
  className,
}: LyaAvatarProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { state, error, connect, disconnect, isSpeaking } = useLyaSession();

  useEffect(() => {
    onStateChange?.(state);
  }, [state, onStateChange]);

  useEffect(() => {
    if (autoConnect && videoRef.current && state === "idle") {
      connect(videoRef.current, { intention, sujet });
    }
  }, [autoConnect, connect, state, intention, sujet]);

  const handleConnect = useCallback(async () => {
    if (videoRef.current) await connect(videoRef.current, { intention, sujet });
  }, [connect, intention, sujet]);

  return (
    <div className={`${s.wrap} ${className || ""}`} data-state={state}>
      <video
        ref={videoRef}
        className={s.video}
        autoPlay
        playsInline
        muted={false}
      />

      {state === "idle" && (
        <button type="button" className={s.startBtn} onClick={handleConnect}>
          <div className={s.startIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21v-1a6 6 0 0 1 12 0v1" />
            </svg>
          </div>
          <span className={s.startLabel}>Lancer l'entretien avec Lya</span>
        </button>
      )}

      {state === "connecting" && (
        <div className={s.overlay}>
          <div className={s.spinner} />
          <span className={s.overlayLabel}>Connexion à Lya…</span>
        </div>
      )}

      {state === "error" && (
        <div className={s.overlay}>
          <span className={s.errorText}>{error || "Erreur de connexion"}</span>
          <button type="button" className={s.retryBtn} onClick={handleConnect}>
            Réessayer
          </button>
        </div>
      )}

      {(state === "speaking" || state === "ready" || state === "listening") && (
        <div className={s.statusBar}>
          <span className={`${s.statusDot} ${state === "speaking" ? s.statusDotActive : ""}`} />
          <span className={s.statusLabel}>
            {state === "speaking" ? "Lya parle…" : "Lya écoute"}
          </span>
        </div>
      )}
    </div>
  );
}

export function LyaAvatarWithRef(
  props: LyaAvatarProps & { lyaRef: React.MutableRefObject<LyaAvatarHandle | null> }
) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { state, error, connect, disconnect, isSpeaking } = useLyaSession();
  const { lyaRef, autoConnect, intention, sujet, onStateChange, className } = props;

  useEffect(() => {
    lyaRef.current = {
      connect: async () => { if (videoRef.current) await connect(videoRef.current, { intention, sujet }); },
      disconnect,
      state,
      isSpeaking,
    };
  }, [lyaRef, connect, disconnect, state, isSpeaking, intention, sujet]);

  useEffect(() => {
    onStateChange?.(state);
  }, [state, onStateChange]);

  useEffect(() => {
    if (autoConnect && videoRef.current && state === "idle") {
      connect(videoRef.current, { intention, sujet });
    }
  }, [autoConnect, connect, state, intention, sujet]);

  const handleConnect = useCallback(async () => {
    if (videoRef.current) await connect(videoRef.current, { intention, sujet });
  }, [connect, intention, sujet]);

  return (
    <div className={`${s.wrap} ${className || ""}`} data-state={state}>
      <video
        ref={videoRef}
        className={s.video}
        autoPlay
        playsInline
        muted={false}
      />

      {state === "idle" && (
        <button type="button" className={s.startBtn} onClick={handleConnect}>
          <div className={s.startIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21v-1a6 6 0 0 1 12 0v1" />
            </svg>
          </div>
          <span className={s.startLabel}>Lancer l'entretien avec Lya</span>
        </button>
      )}

      {state === "connecting" && (
        <div className={s.overlay}>
          <div className={s.spinner} />
          <span className={s.overlayLabel}>Connexion à Lya…</span>
        </div>
      )}

      {state === "error" && (
        <div className={s.overlay}>
          <span className={s.errorText}>{error || "Erreur de connexion"}</span>
          <button type="button" className={s.retryBtn} onClick={handleConnect}>
            Réessayer
          </button>
        </div>
      )}

      {(state === "speaking" || state === "ready" || state === "listening") && (
        <div className={s.statusBar}>
          <span className={`${s.statusDot} ${state === "speaking" ? s.statusDotActive : ""}`} />
          <span className={s.statusLabel}>
            {state === "speaking" ? "Lya parle…" : "Lya écoute"}
          </span>
        </div>
      )}
    </div>
  );
}
