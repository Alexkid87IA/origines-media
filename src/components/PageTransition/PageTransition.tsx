import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import s from "./PageTransition.module.css";

type Phase = "idle" | "in" | "hold" | "out";

export default function PageTransition() {
  const location = useLocation();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("idle");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => () => clear(), [clear]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[href]");
      if (!a) return;

      const href = a.getAttribute("href")!;
      if (
        !href.startsWith("/") ||
        a.target === "_blank" ||
        e.metaKey || e.ctrlKey || e.shiftKey || e.altKey
      ) return;

      if (phase !== "idle") return;

      const current = location.pathname + location.search;
      if (href === current) return;

      e.preventDefault();
      clear();

      setPhase("in");
      timers.current.push(setTimeout(() => setPhase("hold"), 500));
      timers.current.push(setTimeout(() => {
        navigate(href);
        setPhase("out");
      }, 780));
      timers.current.push(setTimeout(() => setPhase("idle"), 1280));
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [phase, location.pathname, location.search, navigate, clear]);

  if (phase === "idle") return null;

  return (
    <div className={`${s.wrap} ${s[phase]}`} aria-hidden="true">
      <div className={`${s.layer} ${s.primary}`} />
      <div className={`${s.layer} ${s.accent}`} />
      <div className={s.center}>
        <img src="/logos/logo-white.png" alt="" className={s.logo} />
        <span className={s.bar}>
          <span className={s.barFill} />
        </span>
      </div>
    </div>
  );
}
