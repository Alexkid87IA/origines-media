import { useState } from "react";
import s from "./VideoChannel.module.css";

export interface CMSVideo {
  href: string;
  title: string;
  duration: string;
  thumb: string;
}

export interface CMSProgramme {
  id: string;
  name: string;
  tagline: string;
  color: string;
  videoCount: number;
  videos: CMSVideo[];
}

interface VideoChannelProps {
  cmsProgrammes?: CMSProgramme[];
}

interface Programme {
  id: string;
  name: string;
  tagline: string;
  color: string;
  videoCount: number;
  videos: { href: string; title: string; duration: string; thumb: string }[];
}

const VISIBLE = 3;

const FALLBACK_PROGRAMMES: Programme[] = [
  {
    id: "il-etait-une-fois",
    name: "Il était une fois",
    tagline: "Grandes enquêtes et documentaires de fond.",
    color: "#8B7355",
    videoCount: 18,
    videos: [
      { href: "/video/sommeil-enquete", title: "Le grand sommeil français.", duration: "24:12", thumb: "/videos/vid-01.jpg" },
      { href: "/video/village-qui-a-dit-non", title: "Le village qui a dit non.", duration: "28:34", thumb: "/videos/vid-02.jpg" },
      { href: "/video/riviere-oubliee", title: "La rivière qu'on a oubliée.", duration: "19:05", thumb: "/videos/vid-03.jpg" },
      { href: "/video/murs-qui-parlent", title: "Les murs qui parlent.", duration: "22:41", thumb: "/videos/vid-04.jpg" },
    ],
  },
  {
    id: "etat-d-esprit",
    name: "État d'esprit",
    tagline: "Comprendre ce qui se joue en nous.",
    color: "#5B7BA5",
    videoCount: 24,
    videos: [
      { href: "/video/procrastination-short", title: "Ce que cache la procrastination.", duration: "14:30", thumb: "/videos/vid-05.jpg" },
      { href: "/video/honte-et-parole", title: "La honte, en nous, sans nous.", duration: "18:22", thumb: "/videos/vid-06.jpg" },
      { href: "/video/ennui-modernite", title: "Pourquoi on ne sait plus s'ennuyer.", duration: "11:48", thumb: "/videos/vid-07.jpg" },
      { href: "/video/colere-invisible", title: "La colère qu'on ne montre pas.", duration: "16:09", thumb: "/videos/vid-08.jpg" },
    ],
  },
  {
    id: "transmission",
    name: "Transmission",
    tagline: "Ce qu'on reçoit, ce qu'on transmet.",
    color: "#6B8E6B",
    videoCount: 15,
    videos: [
      { href: "/video/sens-du-silence", title: "Le sens du silence.", duration: "32:10", thumb: "/videos/vid-09.jpg" },
      { href: "/video/heritage-silence", title: "Un héritage en silence.", duration: "21:55", thumb: "/videos/vid-10.jpg" },
      { href: "/video/le-corps-invisible", title: "Le corps qu'on ne voit pas.", duration: "20:33", thumb: "/videos/vid-11.jpg" },
      { href: "/video/la-main-de-mon-pere", title: "La main de mon père.", duration: "17:44", thumb: "/videos/vid-12.jpg" },
    ],
  },
  {
    id: "secrets-pro",
    name: "Secrets pro.",
    tagline: "Ceux qui font autrement racontent comment.",
    color: "#A07850",
    videoCount: 21,
    videos: [
      { href: "/video/ia-lente", title: "Le retour du numérique lent.", duration: "8:12", thumb: "/videos/vid-13.jpg" },
      { href: "/video/demission-29-ans", title: "J'ai démissionné à 29 ans.", duration: "18:40", thumb: "/videos/vid-14.jpg" },
      { href: "/video/travailler-moins", title: "Travailler moins pour créer plus.", duration: "7:55", thumb: "/videos/vid-15.jpg" },
      { href: "/video/artisan-du-temps", title: "L'artisan qui refuse de grandir.", duration: "12:28", thumb: "/videos/vid-16.jpg" },
    ],
  },
  {
    id: "imagine",
    name: "Imagine",
    tagline: "L'art comme manière de voir le monde.",
    color: "#9B6B8D",
    videoCount: 12,
    videos: [
      { href: "/video/soulages-vitraux", title: "Soulages, la lumière du noir.", duration: "9:18", thumb: "/videos/vid-17.jpg" },
      { href: "/video/les-mains-qui-pensent", title: "Les mains qui pensent.", duration: "12:05", thumb: "/videos/vid-18.jpg" },
      { href: "/video/beaute-des-ruines", title: "La beauté des ruines.", duration: "15:32", thumb: "/videos/vid-19.jpg" },
      { href: "/video/photographe-oublie", title: "Le photographe qu'on a oublié.", duration: "11:20", thumb: "/videos/vid-20.jpg" },
    ],
  },
  {
    id: "la-lettre",
    name: "La lettre",
    tagline: "Écrire, lire, apprendre — autrement.",
    color: "#7A8B6B",
    videoCount: 16,
    videos: [
      { href: "/video/ecole-du-dehors", title: "L'école du dehors.", duration: "15:47", thumb: "/videos/vid-21.jpg" },
      { href: "/video/ecrire-pour-ne-pas-oublier", title: "Écrire pour ne pas oublier.", duration: "12:12", thumb: "/videos/vid-22.jpg" },
      { href: "/video/le-mot-juste", title: "Le mot juste.", duration: "6:30", thumb: "/videos/vid-23.jpg" },
      { href: "/video/lire-a-voix-haute", title: "Lire à voix haute.", duration: "9:55", thumb: "/videos/vid-24.jpg" },
    ],
  },
];

function ProgrammeRow({ p }: { p: Programme }) {
  return (
    <div
      className={s.row}
      style={{ "--p-color": p.color } as React.CSSProperties}
    >
      <div className={s.rowHead}>
        <div className={s.rowLeft}>
          <div className={s.rowTop}>
            <span className={s.rowAccent} aria-hidden="true" />
            <h3 className={s.rowName}>{p.name}</h3>
            <span className={s.rowCount}>{p.videoCount} vid&eacute;os</span>
          </div>
          <span className={s.rowTagline}>{p.tagline}</span>
        </div>
        <a href={`/programmes/${p.id}`} className={s.rowAll}>
          Voir tout
          <span aria-hidden="true">&rarr;</span>
        </a>
      </div>

      <div className={s.rowGrid}>
        {p.videos.map((v) => (
          <a key={v.href} href={v.href} className={s.vid}>
            <div className={s.vidThumb}>
              <img
                src={v.thumb}
                alt={v.title}
                className={s.vidImg}
                loading="lazy"
                decoding="async"
              />
              <span className={s.vidPlay} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5.14v13.72a1 1 0 001.5.86l11-6.86a1 1 0 000-1.72l-11-6.86a1 1 0 00-1.5.86z" />
                </svg>
              </span>
              <span className={s.vidDuration}>{v.duration}</span>
            </div>
            <div className={s.vidMeta}>
              <span className={s.vidProgramme}>{p.name}</span>
              <h4 className={s.vidTitle}>{v.title}</h4>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function VideoChannel({ cmsProgrammes }: VideoChannelProps) {
  const programmes = cmsProgrammes && cmsProgrammes.length > 0
    ? cmsProgrammes
    : FALLBACK_PROGRAMMES;

  const [expanded, setExpanded] = useState(false);
  const hidden = programmes.length - VISIBLE;
  const totalVideos = programmes.reduce((sum, p) => sum + p.videoCount, 0);

  return (
    <section className={s.vc} aria-labelledby="vc-heading">
      <div className={s.banner}>
        <img
          src="/visages-origines.png"
          alt="Les visages d'Origines"
          className={s.bannerImg}
          loading="lazy"
        />
      </div>

      <div className={s.intro}>
        <div className={`${s.chapterMark} mono`}>
          <span className={s.cNum}>Ch.05</span>
          <span className={s.cSep}>/</span>
          <span className={s.cLabel}>Nos programmes</span>
        </div>

        <div className={s.introGrid}>
          <div className={s.introLeft}>
            <h2 id="vc-heading" className={s.introTitle}>
              Ce qu&rsquo;on a<br /><em>film&eacute; pour vous.</em>
            </h2>
            <p className={s.introDeck}>
              Six programmes originaux, du documentaire d&rsquo;investigation au
              format court. Des histoires qu&rsquo;on ne raconte pas ailleurs.
            </p>
          </div>

          <div className={s.introRight}>
            <div className={s.stats}>
              <div className={s.stat}>
                <span className={s.statNum}>{programmes.length}</span>
                <span className={s.statLabel}>Programmes</span>
              </div>
              <span className={s.statSep} aria-hidden="true" />
              <div className={s.stat}>
                <span className={s.statNum}>{totalVideos}</span>
                <span className={s.statLabel}>Vid&eacute;os</span>
              </div>
            </div>
            <a href="/programmes" className={s.introAll}>
              Tous les programmes
              <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>

        <nav className={s.chips} aria-label="Programmes">
          {programmes.map((p) => (
            <a
              key={p.id}
              href={`/programmes/${p.id}`}
              className={s.chip}
              style={{ "--p-color": p.color } as React.CSSProperties}
            >
              <span className={s.chipDot} aria-hidden="true" />
              <span className={s.chipName}>{p.name}</span>
              <span className={s.chipCount}>{p.videoCount}</span>
            </a>
          ))}
        </nav>
      </div>

      <div className={s.content}>
        {programmes.slice(0, VISIBLE).map((p) => (
          <ProgrammeRow key={p.id} p={p} />
        ))}

        {hidden > 0 && (
          <>
            <div
              className={`${s.moreRows} ${expanded ? s.moreRowsOpen : ""}`}
              aria-hidden={!expanded}
            >
              <div>
                {programmes.slice(VISIBLE).map((p) => (
                  <ProgrammeRow key={p.id} p={p} />
                ))}
              </div>
            </div>

            <button
              type="button"
              className={s.expandBtn}
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
            >
              <span className={s.expandLabel}>
                {expanded
                  ? "Moins de programmes"
                  : `${hidden} autres programmes`}
              </span>
              <svg
                className={`${s.expandChevron} ${expanded ? s.expandChevronUp : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </>
        )}
      </div>
    </section>
  );
}
