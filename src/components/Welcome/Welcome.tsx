import { useState, useRef, useCallback, useEffect } from "react";
import s from "./Welcome.module.css";

const SOCIAL_LINKS = [
  {
    href: "https://youtube.com/@originesmedia",
    label: "YouTube",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    href: "https://x.com/originesmedia",
    label: "X",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    href: "https://snapchat.com/add/originesmedia",
    label: "Snapchat",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z" />
      </svg>
    ),
  },
  {
    href: "https://facebook.com/originesmedia",
    label: "Facebook",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    href: "https://instagram.com/originesmedia",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    href: "https://tiktok.com/@originesmedia",
    label: "TikTok",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
];

const PILLARS = [
  {
    label: "Comprendre",
    title: "Ce qui se joue sous la surface",
    color: "#7B5CD6",
    text: "Décoder les mécanismes invisibles qui nous façonnent. Psychologie, neurosciences, philosophie — nous explorons ce qui se joue sous la surface pour vous aider à mieux vous connaître.",
  },
  {
    label: "Ressentir",
    title: "Le corps sait avant nous",
    color: "#E67839",
    text: "Donner une place aux émotions, au corps, à ce qui ne se dit pas toujours. Nous croyons que la sensibilité est une force, pas une faiblesse — et qu'elle mérite un espace éditorial à sa hauteur.",
  },
  {
    label: "Partager",
    title: "Se reconnaître dans l'autre",
    color: "#D64C90",
    text: "Recueillir les histoires de ceux qui ont traversé quelque chose. Témoignages, récits, portraits — parce que se reconnaître dans le parcours d'un autre, c'est déjà avancer.",
  },
  {
    label: "Découvrir",
    title: "Élargir le regard",
    color: "#2E94B5",
    text: "Ouvrir le regard sur ce qui existe ailleurs. Cultures, idées, pratiques, rencontres — nous cherchons ce qui élargit la perspective et nourrit la curiosité.",
  },
  {
    label: "Grandir",
    title: "Avancer sans forcer",
    color: "#34A853",
    text: "Accompagner le mouvement, pas le forcer. Guides, outils, réflexions — pour ceux qui veulent avancer à leur rythme, sans injonction, avec intention.",
  },
];

const AUTO_CLOSE_MS = 3000;

export default function Welcome() {
  const [active, setActive] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoveringCard = useRef(false);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    timerRef.current = setTimeout(() => {
      if (!hoveringCard.current) setActive(null);
    }, AUTO_CLOSE_MS);
  }, [clearTimer]);

  const toggle = (i: number) => {
    clearTimer();
    setActive((prev) => {
      const next = prev === i ? null : i;
      if (next !== null) startTimer();
      return next;
    });
  };

  const onCardEnter = () => {
    hoveringCard.current = true;
    clearTimer();
  };

  const onCardLeave = () => {
    hoveringCard.current = false;
    if (active !== null) startTimer();
  };

  useEffect(() => () => clearTimer(), [clearTimer]);

  return (
    <section className={s.welcome} aria-label="Bienvenue">
      <p className={s.kicker}>
        <span className={s.kickerDot} />
        Bienvenue sur&nbsp;:
      </p>

      <div className={s.masthead}>
        <h1 className={s.mastheadWord}>Origines</h1>
        <div className={s.social}>
          <span className={s.socialLabel}>Suivez Origines</span>
          <div className={s.socialIcons}>
            {SOCIAL_LINKS.map((link) => (
              <a key={link.href} href={link.href} aria-label={link.label} target="_blank" rel="noopener" className={s.socialLink}>
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className={s.rule} />

      <p className={s.tagline}>
        Savoir d'où l'on vient pour savoir où l'on va.
      </p>

      <div className={s.pillars}>
        <div className={s.spectrumLine} aria-hidden="true" />
        {PILLARS.map((u, i) => (
          <div key={u.label} className={s.pillarWrap}>
            <button
              type="button"
              className={`${s.pillar}${active === i ? ` ${s.pillarActive}` : ""}`}
              onClick={() => toggle(i)}
              aria-expanded={active === i}
              style={
                {
                  "--pillar-color": u.color,
                  "--pillar-i": i,
                } as React.CSSProperties
              }
            >
              <span className={s.pillarBar} aria-hidden="true" />
              <span className={s.pillarDot} aria-hidden="true">
                <span className={s.pillarRing} />
              </span>
              <span className={s.pillarLabel}>{u.label}</span>
              <svg
                className={s.pillarChevron}
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="M4 6l4 4 4-4" />
              </svg>
            </button>

            <div
              className={`${s.card}${active === i ? ` ${s.cardOpen}` : ""}`}
              aria-hidden={active !== i}
              style={{ "--pillar-color": u.color } as React.CSSProperties}
              onMouseEnter={onCardEnter}
              onMouseLeave={onCardLeave}
            >
              <div className={s.cardAccent} aria-hidden="true" />
              <span className={s.cardTitle}>{u.title}</span>
              <p className={s.cardText}>{u.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
