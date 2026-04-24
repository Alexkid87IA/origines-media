import s from "./Shop.module.css";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface Course {
  id: string;
  href: string;
  badge?: string;
  format: string;
  title: string;
  titleEm: string;
  description: string;
  price: string;
  priceStrike?: string;
  cta: string;
  color: string;
}

interface Product {
  id: string;
  href: string;
  badge?: string;
  format: string;
  title: string;
  titleEm: string;
  description: string;
  price: string;
  cta: string;
  color: string;
}

const COURSES: Course[] = [
  {
    id: "masterclass-storytelling",
    href: "/academy/masterclass-storytelling",
    badge: "Best-seller",
    format: "Masterclass · 3h · Vidéo + Workbook",
    title: "L'art du ",
    titleEm: "storytelling",
    description:
      "Structurer une histoire qui tient, donner envie d'écouter jusqu'au bout. 12 modules vidéo, exercices pratiques, feedback personnalisé.",
    price: "29 €",
    priceStrike: "49 €",
    cta: "Voir le cours",
    color: "#D64C90",
  },
  {
    id: "programme-complet",
    href: "/academy/programme-complet",
    badge: "Accès à vie",
    format: "Pass intégral · Tous les cours",
    title: "Programme ",
    titleEm: "complet",
    description:
      "Tous nos cours et masterclass en un seul pass. Mises à jour à vie, communauté privée, 2 live par mois avec la rédac.",
    price: "79 €",
    priceStrike: "147 €",
    cta: "Tout débloquer",
    color: "#3E7DD6",
  },
  {
    id: "atelier-ecriture",
    href: "/academy/atelier-ecriture",
    badge: "Nouveau",
    format: "Atelier · 6 semaines · En ligne",
    title: "Écrire pour ",
    titleEm: "se comprendre",
    description:
      "Un atelier d'écriture thérapeutique guidé par notre rédaction. 6 exercices par semaine, relecture collective, restitution finale.",
    price: "39 €",
    cta: "S'inscrire",
    color: "#5B7BA5",
  },
];

const PRODUCTS: Product[] = [
  {
    id: "kit-introspection",
    href: "/boutique/kit-introspection",
    badge: "Gratuit",
    format: "Kit · 24 pages · PDF",
    title: "Kit d'",
    titleEm: "introspection",
    description:
      "30 exercices guidés pour commencer un vrai travail sur soi. Le point d'entrée idéal.",
    price: "Gratuit",
    cta: "Télécharger",
    color: "#7B5CD6",
  },
  {
    id: "guide-mindset",
    href: "/boutique/guide-mindset",
    format: "Guide · 78 pages · PDF + Audio",
    title: "Guide ",
    titleEm: "mindset",
    description:
      "Douze exercices pour changer la façon dont on se parle à soi. PDF + méditations guidées.",
    price: "19 €",
    cta: "Lire un extrait",
    color: "#5AA352",
  },
  {
    id: "carnet-origines",
    href: "/boutique/carnet-origines",
    badge: "Nouveau",
    format: "Carnet · 192 pages · Pointillé",
    title: "Carnet ",
    titleEm: "Origines",
    description:
      "Notre carnet maison, papier 100g, couverture lin, pages pointillées. Conçu pour écrire, pas pour décorer.",
    price: "24 €",
    cta: "Commander",
    color: "#A07850",
  },
  {
    id: "pack-affiches",
    href: "/boutique/pack-affiches",
    format: "Pack · 5 affiches · A3",
    title: "Les ",
    titleEm: "affiches",
    description:
      "Cinq citations tirées de nos articles, illustrées par notre studio. Papier mat 250g.",
    price: "35 €",
    cta: "Voir le pack",
    color: "#9B6B8D",
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Shop() {
  return (
    <section className={s.shop} aria-labelledby="shop-heading">
      <div className={`${s.chapterMark} mono`}>
        <span className={s.cNum}>Ch.10</span>
        <span className={s.cSep}>/</span>
        <span className={s.cLabel}>Boutique &amp; Academy</span>
      </div>

      {/* ═══ Section intro ═══ */}
      <header className={s.sectionHead}>
        <div className={s.sectionLabel}>
          <span className={s.sectionKicker}>
            <span className={s.sectionKickerDot} aria-hidden="true" />
            Boutique &amp; Academy &middot; 7 produits
          </span>
          <h2 id="shop-heading" className={s.sectionTitle}>
            Prolonger la lecture, <em>en pratique.</em>
          </h2>
          <p className={s.sectionDeck}>
            Des kits, des masterclass, des guides produits par la r&eacute;dac &mdash;
            pour ceux qui veulent aller plus loin. Aucun interm&eacute;diaire, aucun
            abonnement cach&eacute;.
          </p>
        </div>
        <a className={s.sectionAll} href="/boutique" aria-label="Voir toute la boutique">
          Toute la boutique
          <span className={s.sectionAllArrow} aria-hidden="true">&rarr;</span>
        </a>
      </header>

      {/* ═══ Academy ═══ */}
      <div className={s.block}>
        <div className={s.blockHead}>
          <div className={s.blockLeft}>
            <span className={s.blockDot} aria-hidden="true" />
            <h3 className={s.blockTitle}>Academy</h3>
            <span className={s.blockCount}>{COURSES.length} cours</span>
          </div>
          <a href="/academy" className={s.blockAll}>
            Tous les cours
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
        <div className={s.courseGrid}>
          {COURSES.map((c) => (
            <article
              key={c.id}
              className={s.card}
              style={{ "--c-color": c.color } as React.CSSProperties}
            >
              <a href={c.href} className={s.cardLink}>
                <div className={s.cardTop}>
                  <span className={s.cardFormat}>{c.format}</span>
                  {c.badge && <span className={s.cardBadge}>{c.badge}</span>}
                </div>
                <h4 className={s.cardH}>
                  {c.title}<em>{c.titleEm}</em>.
                </h4>
                <p className={s.cardDesc}>{c.description}</p>
                <footer className={s.cardFoot}>
                  <div className={s.cardPrices}>
                    {c.priceStrike && (
                      <span className={s.cardPriceStrike}>{c.priceStrike}</span>
                    )}
                    <span className={s.cardPrice}>{c.price}</span>
                  </div>
                  <span className={s.cardCta}>
                    {c.cta}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </span>
                </footer>
              </a>
            </article>
          ))}
        </div>
      </div>

      {/* ═══ Boutique ═══ */}
      <div className={s.block}>
        <div className={s.blockHead}>
          <div className={s.blockLeft}>
            <span className={s.blockDot} aria-hidden="true" />
            <h3 className={s.blockTitle}>Boutique</h3>
            <span className={s.blockCount}>{PRODUCTS.length} produits</span>
          </div>
          <a href="/boutique" className={s.blockAll}>
            Tous les produits
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
        <div className={s.prodGrid}>
          {PRODUCTS.map((p) => (
            <article
              key={p.id}
              className={s.card}
              style={{ "--c-color": p.color } as React.CSSProperties}
            >
              <a href={p.href} className={s.cardLink}>
                <div className={s.cardTop}>
                  <span className={s.cardFormat}>{p.format}</span>
                  {p.badge && <span className={s.cardBadge}>{p.badge}</span>}
                </div>
                <h4 className={s.cardH}>
                  {p.title}<em>{p.titleEm}</em>.
                </h4>
                <p className={s.cardDesc}>{p.description}</p>
                <footer className={s.cardFoot}>
                  <span className={s.cardPrice}>{p.price}</span>
                  <span className={s.cardCta}>
                    {p.cta}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </span>
                </footer>
              </a>
            </article>
          ))}
        </div>
      </div>

      {/* ═══ Assurances ═══ */}
      <footer className={s.assurances}>
        <div className={s.assurance}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="M12 2l8 4v6c0 5-4 9-8 10-4-1-8-5-8-10V6z" /><path d="M9 12l2 2 4-4" />
          </svg>
          <span>Paiement s&eacute;curis&eacute;</span>
        </div>
        <div className={s.assuranceSep} aria-hidden="true" />
        <div className={s.assurance}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="M3 8l9-5 9 5v8l-9 5-9-5z" /><path d="M12 3v18" /><path d="M3 8l9 5 9-5" />
          </svg>
          <span>Acc&egrave;s &agrave; vie</span>
        </div>
        <div className={s.assuranceSep} aria-hidden="true" />
        <div className={s.assurance}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14.5a3.5 3.5 0 0 1 0 7H7" />
          </svg>
          <span>Satisfait ou rembours&eacute;</span>
        </div>
        <div className={s.assuranceSep} aria-hidden="true" />
        <div className={s.assurance}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
          </svg>
          <span>T&eacute;l&eacute;chargement instantan&eacute;</span>
        </div>
      </footer>
    </section>
  );
}
