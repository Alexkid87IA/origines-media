import { useState, useRef, useCallback, useEffect } from "react";

export type LyaRealtimeState =
  | "idle"
  | "connecting"
  | "ready"
  | "speaking"
  | "listening"
  | "error";

interface TranscriptEntry {
  role: "lya" | "user";
  text: string;
  timestamp: number;
}

interface UseLyaRealtimeReturn {
  state: LyaRealtimeState;
  error: string | null;
  transcript: TranscriptEntry[];
  connect: (intention: string, sujet: string) => Promise<void>;
  disconnect: () => void;
}

export function useLyaRealtime(): UseLyaRealtimeReturn {
  const [state, setState] = useState<LyaRealtimeState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);

  const cleanup = useCallback(() => {
    if (dcRef.current) {
      try { dcRef.current.close(); } catch {}
      dcRef.current = null;
    }
    if (pcRef.current) {
      try { pcRef.current.close(); } catch {}
      pcRef.current = null;
    }
    if (audioElRef.current) {
      audioElRef.current.pause();
      audioElRef.current.srcObject = null;
      audioElRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => { cleanup(); };
  }, [cleanup]);

  const connect = useCallback(async (intention: string, sujet: string) => {
    cleanup();
    setState("connecting");
    setError(null);
    setTranscript([]);

    try {
      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      const audioEl = document.createElement("audio");
      audioEl.autoplay = true;
      audioElRef.current = audioEl;

      pc.ontrack = (e) => {
        audioEl.srcObject = e.streams[0];
      };

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioTrack = stream.getAudioTracks()[0];
      pc.addTrack(audioTrack, stream);

      const dc = pc.createDataChannel("oai-events");
      dcRef.current = dc;

      dc.onopen = () => {
        setState("ready");
        dc.send(JSON.stringify({
          type: "session.update",
          session: {
            turn_detection: {
              type: "server_vad",
              threshold: 0.5,
              prefix_padding_ms: 300,
              silence_duration_ms: 600,
            },
            input_audio_transcription: {
              model: "gpt-4o-mini-transcribe",
              language: "fr",
            },
          },
        }));
        dc.send(JSON.stringify({ type: "response.create" }));
      };

      dc.onmessage = (e) => {
        try {
          const event = JSON.parse(e.data);
          handleServerEvent(event);
        } catch {}
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      await new Promise<void>((resolve) => {
        if (pc.iceGatheringState === "complete") {
          resolve();
        } else {
          const check = () => {
            if (pc.iceGatheringState === "complete") {
              pc.removeEventListener("icegatheringstatechange", check);
              resolve();
            }
          };
          pc.addEventListener("icegatheringstatechange", check);
        }
      });

      const { getAuthHeaders } = await import("@/lib/authFetch");
      const headers = await getAuthHeaders();
      headers["Content-Type"] = "application/json";

      const sdpRes = await fetch("/api/realtime/session", {
        method: "POST",
        headers,
        body: JSON.stringify({
          intention,
          sujet,
          sdp: pc.localDescription!.sdp,
        }),
      });

      if (!sdpRes.ok) {
        const errData = await sdpRes.text();
        throw new Error(errData || "SDP exchange failed");
      }

      const answerSdp = await sdpRes.text();
      await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });

    } catch (err) {
      console.error("[LyaRealtime] Connection failed:", err);
      setError(err instanceof Error ? err.message : "Connexion échouée");
      setState("error");
      cleanup();
    }
  }, [cleanup]);

  const handleServerEvent = useCallback((event: Record<string, unknown>) => {
    switch (event.type) {
      case "response.audio.started":
        setState("speaking");
        break;

      case "response.audio.done":
        setState("listening");
        break;

      case "response.audio_transcript.done":
        if (typeof event.transcript === "string" && event.transcript.trim()) {
          setTranscript((prev) => [
            ...prev,
            { role: "lya", text: event.transcript as string, timestamp: Date.now() },
          ]);
        }
        break;

      case "conversation.item.input_audio_transcription.completed":
        if (typeof event.transcript === "string" && event.transcript.trim()) {
          setTranscript((prev) => [
            ...prev,
            { role: "user", text: event.transcript as string, timestamp: Date.now() },
          ]);
        }
        break;

      case "input_audio_buffer.speech_started":
        setState("listening");
        break;

      case "error": {
        const errMsg = (event.error as Record<string, unknown>)?.message;
        console.error("[LyaRealtime] Server error:", errMsg);
        break;
      }
    }
  }, []);

  const disconnect = useCallback(() => {
    cleanup();
    setState("idle");
  }, [cleanup]);

  return { state, error, transcript, connect, disconnect };
}
