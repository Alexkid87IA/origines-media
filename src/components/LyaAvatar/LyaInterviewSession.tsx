import { useState, useRef, useCallback, useEffect } from "react";
import { LyaAvatarWithRef, type LyaAvatarHandle } from "./LyaAvatar";
import type { LyaState } from "./useLyaSession";
import { getAuthHeaders } from "@/lib/authFetch";
import s from "./LyaInterviewSession.module.css";

interface Question {
  label: string;
  hint?: string;
}

interface InterviewContext {
  intention: string;
  sujet: string;
}

interface LyaInterviewSessionProps {
  context: InterviewContext;
  openingQuestion: Question;
  onComplete: (recordings: Blob[], transcripts: { question: string; answer: string }[]) => void;
  onCancel: () => void;
}

type Phase = "init" | "lya-speaking" | "user-recording" | "processing" | "done";

const MAX_DURATION = 120;

export default function LyaInterviewSession({
  context,
  openingQuestion,
  onComplete,
  onCancel,
}: LyaInterviewSessionProps) {
  const lyaRef = useRef<LyaAvatarHandle | null>(null);
  const [phase, setPhase] = useState<Phase>("init");
  const [lyaState, setLyaState] = useState<LyaState>("idle");
  const [currentQuestion, setCurrentQuestion] = useState<Question>(openingQuestion);
  const [exchangeCount, setExchangeCount] = useState(0);
  const [recordings, setRecordings] = useState<Blob[]>([]);
  const [transcripts, setTranscripts] = useState<{ question: string; answer: string }[]>([]);
  const [timer, setTimer] = useState(0);
  const [encouragement, setEncouragement] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const historyRef = useRef<{ question: string; answer: string }[]>([]);

  // Camera setup
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

  // When Lya finishes speaking, start user recording
  const handleLyaSpeakEnd = useCallback(() => {
    if (phase === "lya-speaking") {
      setPhase("user-recording");
      startRecording();
    }
  }, [phase]);

  // When avatar connects, speak the opening question
  const handleLyaStateChange = useCallback((state: LyaState) => {
    setLyaState(state);
    if (state === "ready" && phase === "init") {
      setPhase("lya-speaking");
      setTimeout(() => {
        lyaRef.current?.speak(currentQuestion.label);
      }, 500);
    }
  }, [phase, currentQuestion.label]);

  function startRecording() {
    if (!streamRef.current) return;
    chunksRef.current = [];
    audioChunksRef.current = [];
    setTimer(0);

    const videoMime = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
      ? "video/webm;codecs=vp9,opus"
      : MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus")
        ? "video/webm;codecs=vp8,opus"
        : "video/webm";

    const recorder = new MediaRecorder(streamRef.current, { mimeType: videoMime });
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    recorderRef.current = recorder;
    recorder.start(1000);

    const audioStream = new MediaStream(streamRef.current.getAudioTracks());
    const audioMime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? "audio/webm;codecs=opus"
      : "audio/webm";
    const audioRec = new MediaRecorder(audioStream, { mimeType: audioMime });
    audioRec.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
    audioRec.onstop = () => handleRecordingDone();
    audioRecorderRef.current = audioRec;
    audioRec.start(1000);

    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t + 1 >= MAX_DURATION) stopRecording();
        return t + 1;
      });
    }, 1000);
  }

  function stopRecording() {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    if (audioRecorderRef.current?.state === "recording") audioRecorderRef.current.stop();
  }

  async function handleRecordingDone() {
    setPhase("processing");
    const videoBlob = new Blob(chunksRef.current, { type: chunksRef.current[0]?.type || "video/webm" });
    const audioBlob = new Blob(audioChunksRef.current, { type: audioChunksRef.current[0]?.type || "audio/webm" });
    setRecordings((prev) => [...prev, videoBlob]);

    try {
      const base64 = await blobToBase64(audioBlob);
      const tHeaders = await getAuthHeaders();
      const transcribeRes = await fetch("/api/interview/transcribe", {
        method: "POST",
        headers: tHeaders,
        body: JSON.stringify({ audio: base64, mimeType: audioBlob.type }),
      });

      let text = "";
      if (transcribeRes.ok) {
        const data = await transcribeRes.json();
        text = data.text || "";
      }

      if (text.trim().length < 10) {
        setEncouragement("Pouvez-vous développer un peu plus ?");
        setPhase("user-recording");
        startRecording();
        return;
      }

      const entry = { question: currentQuestion.label, answer: text };
      historyRef.current.push(entry);
      setTranscripts((prev) => [...prev, entry]);
      const nextExchange = exchangeCount + 1;
      setExchangeCount(nextExchange);

      const gHeaders = await getAuthHeaders();
      const generateRes = await fetch("/api/interview/generate", {
        method: "POST",
        headers: gHeaders,
        body: JSON.stringify({
          intention: context.intention || "temoigner",
          sujet: context.sujet || "autre",
          history: historyRef.current,
          currentAnswer: text,
          currentQuestion: currentQuestion.label,
          questionIndex: nextExchange - 1,
          totalBaseQuestions: 1,
          aiQuestionsAsked: nextExchange,
          fullGuide: true,
          videoMode: true,
        }),
      });

      if (!generateRes.ok) {
        setCurrentQuestion({ label: "Continuez — qu'est-ce qui s'est passé ensuite ?", hint: "Prenez votre temps." });
        setPhase("lya-speaking");
        lyaRef.current?.speak("Continuez — qu'est-ce qui s'est passé ensuite ?");
        return;
      }

      const aiData = await generateRes.json();

      if (aiData.done) {
        const farewell = aiData.encouragement || "Merci infiniment pour ce témoignage. C'était très touchant.";
        lyaRef.current?.speak(farewell);
        setPhase("done");
        setTimeout(() => {
          onComplete(
            [...recordings, videoBlob],
            [...historyRef.current],
          );
        }, 4000);
        return;
      }

      const nextQ: Question = aiData.redirect
        ? { label: aiData.message, hint: "Essayez de répondre autrement." }
        : { label: aiData.question || "Continuez votre récit.", hint: aiData.hint || "" };

      if (aiData.encouragement) setEncouragement(aiData.encouragement);
      setCurrentQuestion(nextQ);
      setPhase("lya-speaking");
      lyaRef.current?.speak(nextQ.label);
    } catch (err) {
      console.error("[LyaInterview] Processing error:", err);
      const fallback = "Continuez — racontez-moi la suite.";
      setCurrentQuestion({ label: fallback });
      setPhase("lya-speaking");
      lyaRef.current?.speak(fallback);
    }
  }

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className={s.session}>
      {/* Split screen: Lya left, User right */}
      <div className={s.grid}>
        <div className={s.lyaSide}>
          <div className={s.lyaLabel}>
            <span className={s.lyaDot} />
            <span className="mono">Lya</span>
          </div>
          <LyaAvatarWithRef
            lyaRef={lyaRef}
            autoConnect
            onStateChange={handleLyaStateChange}
            onSpeakEnd={handleLyaSpeakEnd}
            className={s.avatar}
          />
        </div>

        <div className={s.userSide}>
          <div className={s.userLabel}>
            <span className={`${s.recDot} ${phase === "user-recording" ? s.recDotActive : ""}`} />
            <span className="mono">Vous</span>
            {phase === "user-recording" && (
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
            {phase === "processing" && (
              <div className={s.processingOverlay}>
                <div className={s.processingSpinner} />
                <span className={s.processingLabel}>Lya réfléchit…</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar: question + controls */}
      <div className={s.bottomBar}>
        <div className={s.questionArea}>
          {encouragement && phase !== "lya-speaking" && (
            <p className={s.encouragement}>{encouragement}</p>
          )}
          <p className={s.questionText}>{currentQuestion.label}</p>
          {currentQuestion.hint && (
            <p className={s.questionHint}>{currentQuestion.hint}</p>
          )}
        </div>

        <div className={s.controls}>
          {phase === "user-recording" && (
            <button type="button" className={s.stopBtn} onClick={stopRecording}>
              <span className={s.stopIcon} />
              J'ai terminé
            </button>
          )}

          {phase === "done" && (
            <p className={s.doneText}>Merci pour votre témoignage.</p>
          )}

          <button type="button" className={s.cancelBtn} onClick={() => {
            stopRecording();
            lyaRef.current?.disconnect();
            onCancel();
          }}>
            Quitter l'entretien
          </button>
        </div>

        <div className={s.exchangeMeta}>
          <span className="mono">{exchangeCount} échange{exchangeCount > 1 ? "s" : ""}</span>
        </div>
      </div>
    </div>
  );
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
