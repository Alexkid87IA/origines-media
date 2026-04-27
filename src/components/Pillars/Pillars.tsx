import { useState, useCallback } from "react";
import s from "./Pillars.module.css";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface Pillar {
  id: string;
  name: string;
  subtitle: string;
  shortLabel: string;
  tagline: string;
  href: string;
  stats: { label: string; value: string }[];
  accent: string;
  mesh: { a: string; b: string; c: string; d: string };
  preview: string;
  previewLabel: string;
}

const PILLARS: Pillar[] = [
  {
    id: "media",
    name: "Origines",
    subtitle: "Média",
    shortLabel: "Média",
    tagline: "Articles, récits, immersions, témoignages — tout ce qu’on écrit pour vous.",
    href: "/media",
    stats: [
      { label: "Articles", value: "200+" },
      { label: "Dossiers", value: "17" },
    ],
    accent: "#6D28D9",
    mesh: { a: "#C4B5FD", b: "#2E1065", c: "#A78BFA", d: "#8B5CF6" },
    preview: "On a tous un corps. Très peu savent l’écouter.",
    previewLabel: "Dernier article",
  },
  {
    id: "prod",
    name: "Origines",
    subtitle: "Prod",
    shortLabel: "Prod",
    tagline: "Documentaires, reportages, interviews — tout ce qu’on filme pour vous.",
    href: "/programmes",
    stats: [
      { label: "Vidéos", value: "106" },
      { label: "Programmes", value: "6" },
    ],
    accent: "#C2410C",
    mesh: { a: "#FDBA74", b: "#431407", c: "#FB923C", d: "#F97316" },
    preview: "Le grand sommeil français.",
    previewLabel: "24:12",
  },
  {
    id: "guides",
    name: "Guides",
    subtitle: "& Ateliers",
    shortLabel: "Ateliers",
    tagline: "Masterclass, programmes, kits — pour passer à l’action.",
    href: "/guides",
    stats: [{ label: "Programmes", value: "12" }],
    accent: "#059669",
    mesh: { a: "#6EE7B7", b: "#022C22", c: "#A7F3D0", d: "#10B981" },
    preview: "3 programmes actifs",
    previewLabel: "En cours",
  },
  {
    id: "boutique",
    name: "La",
    subtitle: "Boutique",
    shortLabel: "Boutique",
    tagline: "Objets, éditions limitées, produits Origines.",
    href: "/boutique",
    stats: [{ label: "Produits", value: "24" }],
    accent: "#E11D48",
    mesh: { a: "#FDA4AF", b: "#4C0519", c: "#FB7185", d: "#F43F5E" },
    preview: "Coffret nouveau départ",
    previewLabel: "Nouveauté",
  },
  {
    id: "story",
    name: "Origines",
    subtitle: "Story",
    shortLabel: "Story",
    tagline: "Vos histoires, vos voix — les témoignages qui font Origines.",
    href: "/histoires",
    stats: [{ label: "Histoires", value: "50+" }],
    accent: "#0284C7",
    mesh: { a: "#7DD3FC", b: "#082F49", c: "#38BDF8", d: "#0EA5E9" },
    preview: "Chaque histoire mérite d'être entendue.",
    previewLabel: "Témoignage",
  },
];

/* ------------------------------------------------------------------ */
/*  Mesh background                                                    */
/* ------------------------------------------------------------------ */

function MeshBg({ mesh }: { mesh: Pillar["mesh"] }) {
  return (
    <div
      className={s.mesh}
      aria-hidden="true"
      style={{
        "--mesh-a": mesh.a,
        "--mesh-b": mesh.b,
        "--mesh-c": mesh.c,
        "--mesh-d": mesh.d,
      } as React.CSSProperties}
    >
      <div className={s.meshOrb1} />
      <div className={s.meshOrb2} />
      <div className={s.meshOrb3} />
      <div className={s.meshOrb4} />
      <div className={s.meshGrain} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Personality overlays                                               */
/* ------------------------------------------------------------------ */

function MediaOverlay() {
  return (
    <div className={s.personality} aria-hidden="true">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className={s.mediaLine} style={{ top: `${8 + i * 7.5}%` }} />
      ))}
    </div>
  );
}

function ProdOverlay() {
  return null;
}

function GuidesOverlay() {
  return (
    <div className={s.personality} aria-hidden="true">
      <div className={s.guidesGrid}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={`v${i}`} className={s.guidesLineV} style={{ left: `${16 + i * 14}%` }} />
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={`h${i}`} className={s.guidesLineH} style={{ top: `${20 + i * 16}%` }} />
        ))}
      </div>
    </div>
  );
}

function BoutiqueOverlay() {
  return (
    <div className={s.personality} aria-hidden="true">
      <div className={s.boutiqueRing} />
    </div>
  );
}

function StoryOverlay() {
  return (
    <div className={s.personality} aria-hidden="true">
      <div className={s.storyQuotes}>
        <span className={s.storyQuoteL}>&ldquo;</span>
        <span className={s.storyQuoteR}>&rdquo;</span>
      </div>
    </div>
  );
}

const OVERLAYS: Record<string, () => JSX.Element> = {
  media: MediaOverlay,
  prod: ProdOverlay,
  guides: GuidesOverlay,
  boutique: BoutiqueOverlay,
  story: StoryOverlay,
};

/* ------------------------------------------------------------------ */
/*  Column                                                             */
/* ------------------------------------------------------------------ */

function PillarColumn({
  p,
  idx,
  isActive,
  hasActive,
  onEnter,
}: {
  p: Pillar;
  idx: number;
  isActive: boolean;
  hasActive: boolean;
  onEnter: () => void;
}) {
  const Overlay = OVERLAYS[p.id];
  const num = `0${idx + 1}`;

  return (
    <a
      href={p.href}
      className={`${s.col} ${isActive ? s.colActive : ""} ${hasActive && !isActive ? s.colInactive : ""}`}
      onMouseEnter={onEnter}
      style={{ "--accent": p.accent } as React.CSSProperties}
    >
      <MeshBg mesh={p.mesh} />
      {Overlay && <Overlay />}

      {/* Accent line */}
      <div className={s.accentLine} />

      {/* Index top-left */}
      <span className={s.colIndex}>{num}</span>

      {/* Collapsed: vertical label */}
      <div className={s.collapsed}>
        <span className={s.colLabel}>
          {p.shortLabel.split("").map((char, ci) => (
            <span
              key={ci}
              className={s.colLetter}
              style={{ animationDelay: `${ci * 0.12}s` }}
            >
              {char === " " ? " " : char}
            </span>
          ))}
        </span>
      </div>

      {/* Expanded: full content */}
      <div className={s.expanded}>
        <div className={s.expTop}>
          <div className={s.expStats}>
            {p.stats.map((st, i) => (
              <span key={i} className={s.expStat}>
                <strong>{st.value}</strong> {st.label}
              </span>
            ))}
          </div>
        </div>

        <div className={s.expMain}>
          <h3 className={s.expTitle}>
            {p.name} <em>{p.subtitle}</em>
          </h3>
          <p className={s.expTagline}>{p.tagline}</p>

          <div className={s.expPreview}>
            <span className={s.expPreviewLabel}>{p.previewLabel}</span>
            <span className={s.expPreviewText}>{p.preview}</span>
          </div>

          <span className={s.expCta}>
            Explorer cet univers
            <span className={s.expCtaArrow} aria-hidden="true">&rarr;</span>
          </span>
        </div>
      </div>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Pillars() {
  const [active, setActive] = useState<number | null>(null);
  const clearActive = useCallback(() => setActive(null), []);

  return (
    <section className={s.pillars} aria-labelledby="pillars-title">
      <div className={s.chapterMark}>
        <span className={`${s.cNum} mono`}>Ch.02</span>
        <span className={`${s.cSep} mono`}>/</span>
        <span className={`${s.cLabel} mono`}>Nos univers</span>
      </div>

      <header className={s.sectionHead}>
        <div className={s.sectionLabel}>
          <span className={s.sectionKicker}>
            <span className={s.sectionKickerDot} aria-hidden="true" />
            Choisissez votre entr&eacute;e
          </span>
          <h2 id="pillars-title" className={s.sectionTitle}>
            Cinq mani&egrave;res <em>d&rsquo;explorer.</em>
          </h2>
          <p className={s.sectionDeck}>
            Lire, regarder, apprendre ou se faire plaisir.
            Chaque univers a son rythme &mdash; choisissez le v&ocirc;tre.
          </p>
        </div>
      </header>

      <div className={s.split} onMouseLeave={clearActive}>
        {PILLARS.map((p, i) => (
          <PillarColumn
            key={p.id}
            p={p}
            idx={i}
            isActive={active === i}
            hasActive={active !== null}
            onEnter={() => setActive(i)}
          />
        ))}
      </div>
    </section>
  );
}
