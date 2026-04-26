import styles from "./Marquee.module.css";

const ITEMS = [
  { cls: styles.esprit, univers: "L'Esprit", title: "Pourquoi on remet toujours à demain", href: "/article/pourquoi-on-remet-toujours-a-demain" },
  { cls: styles.corps, univers: "Le Corps", title: "Ce que l'alimentation change au sommeil", href: "/article/alimentation-et-sommeil" },
  { cls: styles.liens, univers: "Les Liens", title: "Six mois dans une famille qui ne se parlait plus", href: "/article/famille-qui-ne-se-parlait-plus" },
  { cls: styles.monde, univers: "Le Monde", title: "2 200 km à pied sur la via Francigena", href: "/article/via-francigena" },
  { cls: styles.avenir, univers: "L'Avenir", title: "J'ai démissionné à 29 ans, sans plan B", href: "/article/demission-29-ans" },
  { cls: styles.esprit, univers: "L'Esprit", title: "Le silence, dernier luxe collectif", href: "/article/silence-luxe-collectif" },
  { cls: styles.corps, univers: "Le Corps", title: "Le corps ne ment jamais", href: "/article/le-corps-ne-ment-jamais" },
  { cls: styles.liens, univers: "Les Liens", title: "Ce qu'on ne dit pas aux enfants", href: "/article/ce-quon-ne-dit-pas-aux-enfants" },
  { cls: styles.monde, univers: "Le Monde", title: "Les derniers vitraux de Soulages", href: "/article/vitraux-soulages" },
  { cls: styles.avenir, univers: "L'Avenir", title: "Le retour du numérique lent", href: "/article/numerique-lent" },
];

export default function Marquee() {
  return (
    <div className={styles.marquee}>
      <div className={styles.marqueeInner}>
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <a key={i} href={item.href} className={`${styles.marqueeItem} ${item.cls}`}>
            <span className={styles.marqueeUnivers}>{item.univers}</span>
            <span className={styles.marqueeSep}>·</span>
            <span className={styles.marqueeTitle}>{item.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
