import { useState, useRef, useCallback, useEffect } from "react";
import {
  LiveAvatarSession,
  SessionEvent,
  SessionState,
  AgentEventsEnum,
} from "@heygen/liveavatar-web-sdk";

export type LyaState = "idle" | "connecting" | "ready" | "speaking" | "listening" | "error";

interface UseLyaSessionReturn {
  state: LyaState;
  error: string | null;
  connect: (videoEl: HTMLVideoElement) => Promise<void>;
  speak: (text: string) => void;
  interrupt: () => void;
  disconnect: () => Promise<void>;
  isSpeaking: boolean;
}

async function fetchAccessToken(): Promise<string> {
  const { getAuthHeaders } = await import("@/lib/authFetch");
  const headers = await getAuthHeaders();
  const res = await fetch("/api/heygen/token", {
    method: "POST",
    headers,
    body: JSON.stringify({}),
  });
  if (!res.ok) throw new Error("Failed to get LiveAvatar token");
  const data = await res.json();
  return data.accessToken;
}

export function useLyaSession(): UseLyaSessionReturn {
  const [state, setState] = useState<LyaState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const sessionRef = useRef<LiveAvatarSession | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const cleanup = useCallback(async () => {
    if (sessionRef.current) {
      try {
        await sessionRef.current.stop();
      } catch {
        // ignore
      }
      sessionRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => { cleanup(); };
  }, [cleanup]);

  const connect = useCallback(async (videoEl: HTMLVideoElement) => {
    await cleanup();
    setState("connecting");
    setError(null);
    videoRef.current = videoEl;

    try {
      const token = await fetchAccessToken();
      const session = new LiveAvatarSession(token, {
        voiceChat: false,
      });

      session.on(SessionEvent.SESSION_STATE_CHANGED, (s: SessionState) => {
        if (s === SessionState.CONNECTED) setState("ready");
        if (s === SessionState.DISCONNECTED) setState("idle");
      });

      session.on(SessionEvent.SESSION_STREAM_READY, () => {
        session.attach(videoEl);
        setState("ready");
      });

      session.on(AgentEventsEnum.AVATAR_SPEAK_STARTED, () => {
        setIsSpeaking(true);
        setState("speaking");
      });

      session.on(AgentEventsEnum.AVATAR_SPEAK_ENDED, () => {
        setIsSpeaking(false);
        setState("ready");
      });

      session.on(AgentEventsEnum.SESSION_STOPPED, () => {
        setState("idle");
      });

      sessionRef.current = session;
      await session.start();
    } catch (err) {
      console.error("[LyaAvatar] Connection failed:", err);
      setError(err instanceof Error ? err.message : "Connexion échouée");
      setState("error");
    }
  }, [cleanup]);

  const speak = useCallback((text: string) => {
    if (!sessionRef.current || sessionRef.current.state !== SessionState.CONNECTED) return;
    sessionRef.current.message(text);
  }, []);

  const interrupt = useCallback(() => {
    if (!sessionRef.current) return;
    sessionRef.current.interrupt();
    setIsSpeaking(false);
  }, []);

  const disconnect = useCallback(async () => {
    await cleanup();
    setState("idle");
    setIsSpeaking(false);
  }, [cleanup]);

  return { state, error, connect, speak, interrupt, disconnect, isSpeaking };
}
