import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./IntroOverlay.module.css";

const LETTERS = ["O", "R", "I", "G", "I", "N", "E", "S"] as const;

type Phase = "stagger" | "morph" | "outro" | "hidden";

export default function IntroOverlay() {
  const [phase, setPhase] = useState<Phase>("stagger");
  const [letterStates, setLetterStates] = useState<boolean[]>(
    new Array(8).fill(false)
  );
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

    LETTERS.forEach((_, i) => {
      const t = setTimeout(() => {
        setLetterStates((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, 120 + i * 90);
      timersRef.current.push(t);
    });

    const morphTimer = setTimeout(() => {
      setPhase("morph");
    }, 1900);
    timersRef.current.push(morphTimer);

    const outroTimer = setTimeout(() => {
      setPhase("outro");
    }, 3400);
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

  const wordClasses = [
    styles.introWord,
    phase === "morph" || phase === "outro" ? styles.morphing : "",
    phase === "outro" ? styles.outro : "",
  ]
    .filter(Boolean)
    .join(" ");

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
      <div className={styles.introMono}>
        <span>Origines — Media Editorial</span>
        <span>Paris &middot; Avril 2026</span>
      </div>

      <div className={wordClasses}>
        {LETTERS.map((letter, i) => (
          <span
            key={i}
            className={`${styles.introLetter}${letterStates[i] ? ` ${styles.letterIn}` : ""}`}
            data-i={i}
          >
            {letter}
          </span>
        ))}
        <span className={styles.introLogoFinal} aria-hidden="true">
          <img
            src="/logos/logo-black.png"
            alt=""
            width={200}
            height={200}
          />
        </span>
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
