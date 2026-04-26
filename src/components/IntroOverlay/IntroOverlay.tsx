import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./IntroOverlay.module.css";

type Phase = "loading" | "outro" | "hidden";

export default function IntroOverlay() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [skipUsed, setSkipUsed] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const introRef = useRef<HTMLDivElement>(null);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const doSkip = useCallback(() => {
    if (skipUsed) return;
    setSkipUsed(true);
    clearTimers();

    const el = introRef.current;
    if (el) {
      el.style.transition = "opacity 0.3s ease";
      el.style.opacity = "0";
    }

    const t = setTimeout(() => {
      setPhase("hidden");
      document.body.classList.remove("intro-playing");
    }, 300);
    timersRef.current.push(t);
  }, [skipUsed, clearTimers]);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const alreadySeen = sessionStorage.getItem("intro-seen") === "1";

    if (alreadySeen || reducedMotion) {
      setPhase("hidden");
      return;
    }

    document.body.classList.add("intro-playing");
    sessionStorage.setItem("intro-seen", "1");

    const outroTimer = setTimeout(() => setPhase("outro"), 3400);
    timersRef.current.push(outroTimer);

    const endTimer = setTimeout(() => {
      document.body.classList.remove("intro-playing");
      setPhase("hidden");
    }, 4100);
    timersRef.current.push(endTimer);

    return () => {
      clearTimers();
      document.body.classList.remove("intro-playing");
    };
  }, [clearTimers]);

  useEffect(() => {
    if (phase === "hidden") return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "Escape") doSkip();
    };
    window.addEventListener("keydown", handler, { once: true });
    return () => window.removeEventListener("keydown", handler);
  }, [phase, doSkip]);

  if (phase === "hidden") return null;

  const introClasses = [
    styles.intro,
    phase === "outro" ? styles.fading : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={introRef}
      className={introClasses}
      aria-hidden="true"
      onClick={doSkip}
      role="presentation"
    >
      <img
        src="/visages-origines.png"
        alt=""
        aria-hidden="true"
        className={styles.bgImage}
      />

      <div className={styles.introMono}>
        <span>Origines — Media Editorial</span>
        <span>Paris &middot; Avril 2026</span>
      </div>

      <div className={styles.introMonoBottom}>
        <span>Numero 01 / 2026</span>
        <span className={styles.progress}>
          <span>Chargement</span>
          <span className={styles.bar} />
        </span>
      </div>

      <button
        className={styles.introSkip}
        type="button"
        aria-label="Passer l'introduction"
        onClick={doSkip}
      >
        Passer &#x21B5;
      </button>
    </div>
  );
}
