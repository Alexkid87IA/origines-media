import s from "./Welcome.module.css";

const PILLARS = [
  { label: "Comprendre", color: "#7B5CD6" },
  { label: "Ressentir", color: "#E67839" },
  { label: "Partager", color: "#D64C90" },
  { label: "Découvrir", color: "#2E94B5" },
  { label: "Grandir", color: "#34A853" },
];

export default function Welcome() {
  return (
    <section className={s.welcome} aria-label="Bienvenue">
      <p className={s.kicker}>
        <span className={s.kickerDot} />
        Bienvenue sur Origines
      </p>

      <div className={s.masthead}>
        <span className={s.mastheadWord}>Origines</span>
      </div>

      <div className={s.rule} />

      <p className={s.tagline}>
        Savoir d'où l'on vient pour savoir où l'on va.
      </p>

      <div className={s.univers}>
        {PILLARS.map((u) => (
          <span key={u.label} className={s.universItem}>
            <span className={s.universDot} style={{ background: u.color }} />
            {u.label}
          </span>
        ))}
      </div>
    </section>
  );
}
