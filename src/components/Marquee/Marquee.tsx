import styles from "./Marquee.module.css";

const ITEMS = [
  { cls: styles.esprit, text: "L'Esprit · Pourquoi on remet toujours à demain" },
  { cls: styles.esprit, text: "L'Esprit · Le silence, dernier luxe collectif" },
  { cls: styles.corps, text: "Le Corps · Ce que l'alimentation change au sommeil" },
  { cls: styles.corps, text: "Le Corps · Respirer, d'abord" },
  { cls: styles.liens, text: "Les Liens · Le grand sommeil français" },
  { cls: styles.liens, text: "Les Liens · Six mois dans une famille qui ne se parlait plus" },
  { cls: styles.monde, text: "Le Monde · 2 200 km à pied sur la via Francigena" },
  { cls: styles.monde, text: "Le Monde · Les derniers vitraux de Pierre Soulages" },
  { cls: styles.avenir, text: "L'Avenir · Le retour du numérique lent" },
  { cls: styles.avenir, text: "L'Avenir · J'ai démissionné à 29 ans" },
];

export default function Marquee() {
  return (
    <div className={styles.marquee} aria-hidden="true">
      <div className={styles.marqueeInner}>
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span key={i} className={item.cls}>
            {item.text}
          </span>
        ))}
      </div>
    </div>
  );
}
