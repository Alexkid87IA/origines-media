import { UNIVERS_MAP, type UniversId } from "@/data/univers";
import DailyPoll from "../Interludes/DailyPoll";
import il from "../Interludes/Interludes.module.css";
import s from "./Spotlight.module.css";

export interface CMSSpotlight {
  univers: UniversId;
  category: string;
  title: string;
  deck: string;
  author: string;
  readTime: string;
  href: string;
  image: string;
}

interface SpotlightProps {
  cmsPick?: CMSSpotlight;
}

/* ------------------------------------------------------------------ */
/*  1. Choix de la rédaction — article unique pleine largeur            */
/* ------------------------------------------------------------------ */

const PICK = {
  univers: "corps" as UniversId,
  category: "Santé",
  tag: "Le choix de la rédaction",
  title: "On a tous un corps. Très peu savent l'écouter.",
  deck: "Pendant des mois, notre rédaction a suivi cinq personnes qui ont décidé de tout changer. Pas de régime, pas de coach. Juste une attention nouvelle portée aux signaux que le corps envoie — et qu'on a appris à ignorer.",
  author: "Léo Marchand",
  readTime: "32 min",
  href: "/article/ecouter-son-corps",
  image: "/covers/cover-03.jpg",
  imageAlt: "Un homme assis en silence, les yeux fermés, la lumière du matin sur le visage.",
};

/* ------------------------------------------------------------------ */
/*  2. Suivre Origines — canaux                                        */
/* ------------------------------------------------------------------ */

const CHANNELS = [
  {
    name: "Newsletter",
    desc: "Chaque dimanche, le meilleur de la semaine.",
    href: "/newsletter",
    icon: "mail",
  },
  {
    name: "YouTube",
    desc: "Documentaires et conversations longues.",
    href: "https://youtube.com/@origines",
    icon: "play",
  },
  {
    name: "Instagram",
    desc: "Citations, extraits, coulisses.",
    href: "https://instagram.com/origines.media",
    icon: "camera",
  },
  {
    name: "Podcast",
    desc: "Des voix, des silences, des histoires.",
    href: "/podcast",
    icon: "mic",
  },
  {
    name: "LinkedIn",
    desc: "Réflexions sur le travail et le sens.",
    href: "https://linkedin.com/company/origines-media",
    icon: "briefcase",
  },
];

/* ------------------------------------------------------------------ */
/*  3. Parutions de la semaine (calendrier compact)                     */
/* ------------------------------------------------------------------ */

interface Day {
  label: string;
  num: number;
  format: string;
  title: string;
  status: string;
  color: string;
  href?: string;
  past?: boolean;
  today?: boolean;
  upcoming?: boolean;
}

const DAYS: Day[] = [
  { label: "Lun.", num: 21, format: "Immersion", title: "Six mois chez les Cissé.", status: "Publié", color: "#7B5CD6", past: true, href: "/immersion/six-mois-chez-les-cisse" },
  { label: "Mar.", num: 22, format: "Vidéo", title: "Le grand sommeil français.", status: "Publié", color: "#E67839", past: true, href: "/video/sommeil-enquete" },
  { label: "Mer.", num: 23, format: "Récit", title: "2 200 km à pied, seul.", status: "Publié", color: "#2E9B74", past: true, href: "/recit/2200-km-a-pied" },
  { label: "Jeu.", num: 24, format: "Collection", title: "Secrets professionnels.", status: "Aujourd'hui", color: "#3E7DD6", today: true, href: "/collection/secrets-professionnels" },
  { label: "Ven.", num: 25, format: "Essai", title: "Le silence est un luxe.", status: "Demain", color: "#5A66D6", upcoming: true },
  { label: "Sam.", num: 26, format: "Histoire", title: "La lettre jamais envoyée.", status: "À paraître", color: "#C99B1E", upcoming: true },
  { label: "Dim.", num: 27, format: "Newsletter", title: "L'édition du dimanche.", status: "7h", color: "#D64C90", upcoming: true },
];

/* ------------------------------------------------------------------ */
/*  Icons (inline SVG)                                                  */
/* ------------------------------------------------------------------ */

function ChannelIcon({ icon }: { icon: string }) {
  const props = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", "aria-hidden": true as const, className: s.channelSvg };
  switch (icon) {
    case "mail":
      return <svg {...props}><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
    case "play":
      return <svg {...props}><path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    case "camera":
      return <svg {...props}><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="18" cy="6" r="1.5" fill="currentColor" stroke="none" /></svg>;
    case "mic":
      return <svg {...props}><path d="M12 1a4 4 0 00-4 4v6a4 4 0 008 0V5a4 4 0 00-4-4z" /><path d="M19 10v1a7 7 0 01-14 0v-1M12 18v4M8 22h8" /></svg>;
    case "briefcase":
      return <svg {...props}><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" /></svg>;
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Spotlight({ cmsPick }: SpotlightProps) {
  const pick = cmsPick
    ? { ...PICK, univers: cmsPick.univers, category: cmsPick.category, title: cmsPick.title, deck: cmsPick.deck, author: cmsPick.author, readTime: cmsPick.readTime, href: cmsPick.href, image: cmsPick.image }
    : PICK;
  const pickU = UNIVERS_MAP[pick.univers];

  return (
    <section className={s.spotlight} aria-labelledby="spotlight-title">
      {/* ═══ Choix de la rédaction — pleine largeur ═══ */}
      <div className={s.chapterMark}>
        <span className={`${s.cNum} mono`}>Ch.02</span>
        <span className={`${s.cSep} mono`}>/</span>
        <span className={`${s.cLabel} mono`}>Le choix de la r&eacute;daction</span>
      </div>

      <header className={s.sectionHead}>
        <div className={s.sectionLabel}>
          <span className={s.sectionKicker}>
            <span className={s.sectionKickerDot} aria-hidden="true" />
            S&eacute;lection &middot; &Eacute;ditorial
          </span>
          <h3 className={s.sectionTitle}>
            Ce qu&rsquo;on a <em>choisi pour vous.</em>
          </h3>
          <p className={s.sectionDeck}>
            Chaque jour, la r&eacute;daction s&eacute;lectionne les articles qui comptent.
            Une curation exigeante &mdash; ni algorithme, ni tendances. Juste ce qui
            m&eacute;rite votre temps.
          </p>
        </div>
        <a className={s.sectionAll} href="/selection" aria-label="Toute la sélection">
          Toute la s&eacute;lection
          <span className={s.sectionAllArrow} aria-hidden="true">&rarr;</span>
        </a>
      </header>

      <a href={pick.href} className={s.pickCard}>
        <div className={s.pickText}>
          <span className={s.pickTag} style={{ color: pickU.color }}>
            {pick.category || pickU.name}
          </span>
          <h2 id="spotlight-title" className={s.pickTitle}>{pick.title}</h2>
          <p className={s.pickDeck}>{pick.deck}</p>
          <div className={s.pickByline}>
            Par <strong>{pick.author}</strong>
            <span className={s.dot} />
            {pick.readTime}
          </div>
        </div>
        <div className={s.pickImage}>
          <img src={pick.image} alt={pick.imageAlt} className={s.pickImg} />
        </div>
      </a>

      {/* ═══ Suivre Origines + 3 articles ═══ */}
      <div className={s.followGrid}>
        {/* Sidebar — canaux */}
        <aside className={s.followSidebar}>
          <h3 className={s.followTitle}>Suivre Origines</h3>
          <div className={s.channelList}>
            {CHANNELS.map((ch) => (
              <a
                key={ch.name}
                href={ch.href}
                className={s.channelItem}
                target={ch.href.startsWith("http") ? "_blank" : undefined}
                rel={ch.href.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                <ChannelIcon icon={ch.icon} />
                <div className={s.channelInfo}>
                  <span className={s.channelName}>{ch.name}</span>
                  <span className={s.channelDesc}>{ch.desc}</span>
                </div>
              </a>
            ))}
          </div>
        </aside>

        {/* Parutions de la semaine */}
        <div className={s.gridHalf}>
          <div className={il.halfHead}>
            <span className={il.halfDot} aria-hidden="true" />
            <span className={il.halfLabel}>Les parutions de la semaine</span>
          </div>
          <h3 className={il.halfTitle}>
            Semaine du <em>21 au 27 avril</em>.
          </h3>
          <ol className={il.days}>
            {DAYS.map((d) => {
              const cls = `${il.day} ${d.today ? il.dayToday : ""} ${d.upcoming ? il.dayUpcoming : ""}`;
              const inner = (
                <>
                  <span className={il.dayDate}>
                    <span className={il.dayLabel}>{d.label}</span>
                    <span className={il.dayNum}>{d.num}</span>
                  </span>
                  <span className={il.dayContent}>
                    <span className={il.dayFormat} style={{ color: d.upcoming ? undefined : d.color }}>{d.format}</span>
                    <span className={il.dayTitle}>{d.title}</span>
                  </span>
                  <span className={il.dayStatus}>{d.status}</span>
                </>
              );
              return (
                <li key={d.num} className={cls}>
                  {d.href ? (
                    <a href={d.href} className={il.dayLink}>{inner}</a>
                  ) : (
                    <div className={il.dayInner}>{inner}</div>
                  )}
                </li>
              );
            })}
          </ol>
          <a href="/calendrier" className={il.halfCta}>
            Calendrier complet
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>

        {/* Question de la semaine + Question du jour */}
        <div className={s.gridHalf}>
          <div className={il.halfHead}>
            <span className={il.halfDot} aria-hidden="true" />
            <span className={il.halfLabel}>La question de la semaine</span>
          </div>
          <h3 className={il.halfTitle}>
            Peut-on vraiment <em>changer apr&egrave;s 40 ans</em>&nbsp;?
          </h3>
          <p className={il.halfDesc}>
            3&nbsp;412 lecteurs ont r&eacute;pondu cette semaine. La r&eacute;ponse
            la plus partag&eacute;e commence par &laquo;&nbsp;oui, mais&nbsp;&raquo;.
          </p>
          <div className={il.poll}>
            <div className={il.pollOption}>
              <span className={il.pollLabel}>Oui, profond&eacute;ment</span>
              <div className={il.pollBar}>
                <div className={il.pollFill} style={{ width: "38%", background: "#7B5CD6" }} />
              </div>
              <span className={il.pollPct} style={{ color: "#7B5CD6" }}>38%</span>
            </div>
            <div className={il.pollOption}>
              <span className={il.pollLabel}>Oui, mais autrement</span>
              <div className={il.pollBar}>
                <div className={il.pollFill} style={{ width: "44%", background: "#D64C90" }} />
              </div>
              <span className={il.pollPct} style={{ color: "#D64C90" }}>44%</span>
            </div>
            <div className={il.pollOption}>
              <span className={il.pollLabel}>Non, pas vraiment</span>
              <div className={il.pollBar}>
                <div className={il.pollFill} style={{ width: "18%", background: "#2E94B5" }} />
              </div>
              <span className={il.pollPct} style={{ color: "#2E94B5" }}>18%</span>
            </div>
          </div>
          <a href="/question/semaine-17" className={il.halfCta}>
            Lire les r&eacute;ponses
            <span aria-hidden="true">&rarr;</span>
          </a>
          <DailyPoll />
        </div>
      </div>

    </section>
  );
}
