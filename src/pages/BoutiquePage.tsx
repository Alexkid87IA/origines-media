import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import SEO from "../components/SEO";
import { typo } from "../lib/typography";
import { useSubscribe } from "../hooks/useSubscribe";
import Breadcrumb from '@/components/ui/Breadcrumb';
import s from "./BoutiquePage.module.css";

/* ================================================================
   TYPES
   ================================================================ */

interface Product {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  price: string;
  originalPrice?: string;
  badge?: string;
  badgeColor: string;
  color: string;
  features: string[];
  format: string;
  category: string;
  subcategory: string;
  popular?: boolean;
  featured?: boolean;
  image: string;
}

/* ================================================================
   DATA — 16 kits thématiques par univers
   ================================================================ */

const products: Product[] = [
  // ── Esprit ──
  { id: "kit-meditation", title: "Kit Méditation", subtitle: "Trouver le calme intérieur", description: "Carnet de pratique, cartes de respiration et workbook pour installer une routine méditative durable.", price: "39 €", badge: "Populaire", badgeColor: "#111827", color: "#7B5CD6", features: ["Carnet 90 jours", "30 cartes guidées", "Workbook introspection"], format: "Kit complet", category: "esprit", subcategory: "esprit", popular: true, featured: true, image: "/boutique/boutique-gpt2-meditation.png" },
  { id: "kit-therapie", title: "Kit Thérapie", subtitle: "Cheminer vers soi", description: "Un coffret pour accompagner un travail thérapeutique : journal émotionnel, exercices et outils de suivi.", price: "39 €", badgeColor: "#7B5CD6", color: "#7B5CD6", features: ["Journal émotionnel", "Cartes introspection", "Workbook exercices"], format: "Kit complet", category: "esprit", subcategory: "esprit", image: "/boutique/boutique-gpt2-therapie.png" },
  { id: "kit-art-therapie", title: "Kit Art-Thérapie", subtitle: "Créer pour se libérer", description: "Explorez vos émotions par le dessin, le collage et l’écriture créative.", price: "39 €", badgeColor: "#7B5CD6", color: "#7B5CD6", features: ["Carnet créatif", "Prompts artistiques", "Guide techniques"], format: "Kit complet", category: "esprit", subcategory: "esprit", image: "/boutique/boutique-gpt2-art-therapie.png" },
  // ── Corps ──
  { id: "kit-sport", title: "Kit Sport", subtitle: "Reprendre en douceur", description: "Programme progressif de 8 semaines avec carnet de suivi et cartes d’exercices illustrées.", price: "39 €", badge: "Best-seller", badgeColor: "#111827", color: "#5AA352", features: ["Programme 8 semaines", "Cartes exercices", "Carnet de suivi"], format: "Kit complet", category: "corps", subcategory: "corps", popular: true, featured: true, image: "/boutique/boutique-gpt2-sport.png" },
  { id: "kit-alimentation", title: "Kit Alimentation", subtitle: "Nourrir corps et esprit", description: "Un guide nutrition, des recettes et un planificateur de repas pour une alimentation consciente.", price: "39 €", badgeColor: "#5AA352", color: "#5AA352", features: ["Guide nutrition", "40 recettes", "Planificateur repas"], format: "Kit complet", category: "corps", subcategory: "corps", image: "/boutique/boutique-gpt2-alimentation.png" },
  { id: "kit-sommeil", title: "Kit Sommeil", subtitle: "Retrouver des nuits profondes", description: "Rituels du soir, journal de sommeil et exercices de relaxation pour des nuits réparatrices.", price: "39 €", badgeColor: "#5AA352", color: "#5AA352", features: ["Journal de sommeil", "Rituels du soir", "Exercices relaxation"], format: "Kit complet", category: "corps", subcategory: "corps", image: "/boutique/boutique-gpt2-sommeil.png" },
  { id: "kit-respiration", title: "Kit Respiration", subtitle: "Le souffle comme ancre", description: "Techniques respiratoires, cartes de pratique et programme anti-anxiété en 21 jours.", price: "39 €", badgeColor: "#5AA352", color: "#5AA352", features: ["21 jours programme", "Cartes techniques", "Audio guidé"], format: "Kit complet", category: "corps", subcategory: "corps", image: "/boutique/boutique-gpt2-respiration.png" },
  // ── Liens ──
  { id: "kit-couple", title: "Kit Couple", subtitle: "Se retrouver à deux", description: "Cartes conversation, journal partagé et exercices pour raviver la connexion dans votre relation.", price: "39 €", badge: "Idée cadeau", badgeColor: "#E67839", color: "#E67839", features: ["Cartes conversation", "Journal duo", "Exercices à deux"], format: "Kit complet", category: "liens", subcategory: "liens", popular: true, featured: true, image: "/boutique/boutique-gpt2-couple.png" },
  { id: "kit-education", title: "Kit Éducation", subtitle: "Grandir ensemble", description: "Outils de communication bienveillante, cartes émotions et activités parent-enfant.", price: "39 €", badgeColor: "#E67839", color: "#E67839", features: ["Cartes émotions", "Guide bienveillance", "Activités famille"], format: "Kit complet", category: "liens", subcategory: "liens", image: "/boutique/boutique-gpt2-education.png" },
  // ── Monde ──
  { id: "kit-photo-bien-etre", title: "Kit Photo & Bien-être", subtitle: "Voir le beau au quotidien", description: "Apprenez à utiliser la photographie comme outil de pleine conscience et de gratitude.", price: "39 €", badgeColor: "#2E9B74", color: "#2E9B74", features: ["Guide photo mindful", "30 défis créatifs", "Carnet visuel"], format: "Kit complet", category: "monde", subcategory: "monde", image: "/boutique/boutique-gpt2-photo-bien-etre.png" },
  { id: "kit-photo-therapeutique", title: "Kit Photo Thérapeutique", subtitle: "Se raconter en images", description: "Utilisez l’autoportrait et le reportage personnel comme vecteurs de transformation.", price: "39 €", badgeColor: "#2E9B74", color: "#2E9B74", features: ["Exercices autoportrait", "Journal photographique", "Guide narratif"], format: "Kit complet", category: "monde", subcategory: "monde", featured: true, image: "/boutique/boutique-gpt2-photo-therapeutique.png" },
  { id: "kit-instrument", title: "Kit Instrument", subtitle: "La musique comme thérapie", description: "Initiez-vous à un instrument avec un programme pensé pour le bien-être, pas la performance.", price: "39 €", badgeColor: "#2E9B74", color: "#2E9B74", features: ["Programme débutant", "Exercices quotidiens", "Playlist guidée"], format: "Kit complet", category: "monde", subcategory: "monde", image: "/boutique/boutique-gpt2-instrument.png" },
  { id: "kit-mobilite", title: "Kit Mobilité", subtitle: "Bouger pour s’ouvrir", description: "Un programme mêlant mouvement, découverte et connexion au monde extérieur.", price: "39 €", badgeColor: "#2E9B74", color: "#2E9B74", features: ["Programme mobilité", "Cartes exploration", "Journal de route"], format: "Kit complet", category: "monde", subcategory: "monde", image: "/boutique/boutique-gpt2-mobilite.png" },
  // ── Avenir ──
  { id: "kit-entrepreneuriat", title: "Kit Entrepreneuriat", subtitle: "Lancer son projet", description: "Workbook stratégique, cartes décision et planner pour passer de l’idée à l’action.", price: "39 €", badge: "Pro", badgeColor: "#2E94B5", color: "#2E94B5", features: ["Workbook stratégie", "Cartes décision", "Planner 12 semaines"], format: "Kit complet", category: "avenir", subcategory: "avenir", popular: true, image: "/boutique/boutique-gpt2-entrepreneuriat.png" },
  { id: "kit-finances", title: "Kit Finances", subtitle: "Reprendre le contrôle", description: "Budget conscient, journal financier et méthodes pour une relation saine à l’argent.", price: "39 €", badgeColor: "#2E94B5", color: "#2E94B5", features: ["Planner budget", "Journal financier", "Guide investissement"], format: "Kit complet", category: "avenir", subcategory: "avenir", image: "/boutique/boutique-gpt2-finances.png" },
  { id: "kit-innovation", title: "Kit Innovation", subtitle: "Penser autrement", description: "Outils de créativité, cartes de brainstorming et méthodes pour résoudre des problèmes complexes.", price: "39 €", badgeColor: "#2E94B5", color: "#2E94B5", features: ["Cartes brainstorming", "Méthodes créatives", "Workbook idéation"], format: "Kit complet", category: "avenir", subcategory: "avenir", image: "/boutique/boutique-gpt2-innovation.png" },
];

const featuredProducts = products.filter((p) => p.featured);

const universCategories = [
  { id: "all", label: "Tous les kits", color: "#111827" },
  { id: "esprit", label: "Esprit", color: "#7B5CD6" },
  { id: "corps", label: "Corps", color: "#5AA352" },
  { id: "liens", label: "Liens", color: "#E67839" },
  { id: "monde", label: "Monde", color: "#2E9B74" },
  { id: "avenir", label: "Avenir", color: "#2E94B5" },
];

const faqItems = [
  { question: "Quand la boutique sera-t-elle disponible ?", answer: "Nous préparons soigneusement chaque kit. Inscrivez-vous à la newsletter pour être informé du lancement." },
  { question: "Que contient chaque kit ?", answer: "Chaque kit comprend un carnet thématique, un jeu de cartes et un workbook d’exercices, le tout autour d’un même thème." },
  { question: "Livrez-vous en Europe ?", answer: "Oui, nous livrons en France métropolitaine et dans toute l’Europe." },
  { question: "Quelle est votre politique de remboursement ?", answer: "Garantie satisfait ou remboursé de 14 jours sur tous nos produits, sans question." },
  { question: "Proposez-vous le paiement en plusieurs fois ?", answer: "Oui, pour les achats à partir de 50 €, paiement en 3 fois sans frais disponible." },
];

const TRUST = [
  { icon: "shield", label: "Paiement sécurisé" },
  { icon: "refresh", label: "Satisfait ou remboursé" },
  { icon: "truck", label: "Livraison rapide" },
  { icon: "chat", label: "Support réactif" },
];

/* ================================================================
   INLINE SVG
   ================================================================ */

function TrustIcon({ name }: { name: string }) {
  switch (name) {
    case "shield": return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
    case "refresh": return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" /></svg>;
    case "truck": return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>;
    case "chat": return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>;
    default: return null;
  }
}

/* ================================================================
   MODAL
   ================================================================ */

function ProductModal({ product, isOpen, onClose }: { product: Product | null; isOpen: boolean; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const { status, subscribe, reset } = useSubscribe({ source: "boutique", productId: product?.id, productName: product?.title });

  React.useEffect(() => { if (!isOpen) { setEmail(""); reset(); } }, [isOpen, reset]);
  React.useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && status !== "loading") await subscribe(email);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={s.modalOverlay} onClick={onClose} />
          <div className={s.modalWrap}>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} transition={{ type: "spring", duration: 0.45 }} onClick={(e) => e.stopPropagation()}>
              <div className={s.modal}>
                <div className={s.modalImgWrap}>
                  <img src={product.image} alt={product.title} loading="lazy" />
                  <span className={s.modalGrad} />
                  <button onClick={onClose} className={s.modalClose} aria-label="Fermer">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                  <span className={s.modalFormat} style={{ background: product.color }}>{product.format}</span>
                  <div className={s.modalImgInfo}>
                    <h3 className={s.modalTitle}>{typo(product.title)}</h3>
                    <p className={s.modalSub}>{product.subtitle}</p>
                  </div>
                </div>

                <div className={s.modalBody}>
                  <div className={s.modalPriceRow}>
                    <span className={s.modalPrice}>{product.price}</span>
                    {product.originalPrice && <span className={s.modalOld}>{product.originalPrice}</span>}
                    <span className={s.modalSoon}>Bient&ocirc;t disponible</span>
                  </div>
                  <p className={s.modalDesc}>{typo(product.description)}</p>
                  <div className={s.modalFeats}>
                    {product.features.map((f, i) => (
                      <span key={i} className={s.modalFeat}>
                        <svg viewBox="0 0 24 24" fill="none" stroke={product.color} strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                        {f}
                      </span>
                    ))}
                  </div>

                  {status !== "success" ? (
                    <form onSubmit={handleSubmit}>
                      <div className={s.notifyRow}>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Votre email" required autoComplete="email" disabled={status === "loading"} className={s.notifyInput} />
                        <button type="submit" disabled={status === "loading" || !email} className={s.notifyBtn}>
                          {status === "loading" ? "Envoi…" : "Être notifié"}
                        </button>
                      </div>
                      <p className={s.notifyHint}>Recevez un email dès que ce kit sera disponible</p>
                      {status === "error" && <p className={s.notifyError}>Une erreur est survenue. Réessayez.</p>}
                    </form>
                  ) : (
                    <div className={s.notifyOk}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                      <div>
                        <p className={s.notifyOkTitle}>Vous êtes inscrit&nbsp;!</p>
                        <p className={s.notifyOkText}>Nous vous préviendrons dès que ce kit sera disponible.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ================================================================
   PRODUCT CARD
   ================================================================ */

function ProductCard({ product, index, onClick }: { product: Product; index: number; onClick: () => void }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.2) }}
      className={s.card}
      onClick={onClick}
    >
      <div className={s.cardImg}>
        <img src={product.image} alt={product.title} loading="lazy" decoding="async" />
        <span className={s.cardGrad} />
        {product.badge && <span className={s.cardBadge} style={{ background: product.badgeColor }}>{product.badge}</span>}
        <span className={s.cardSoon}>Bientôt disponible</span>
      </div>
      <div className={s.cardBody}>
        <span className={s.cardFormat} style={{ color: product.color }}>{product.format}</span>
        <h3 className={s.cardTitle}>{typo(product.title)}</h3>
        <p className={s.cardSub}>{product.subtitle}</p>
        <div className={s.cardFoot}>
          <div className={s.cardPrices}>
            <span className={s.cardPrice}>{product.price}</span>
            {product.originalPrice && <span className={s.cardOld}>{product.originalPrice}</span>}
          </div>
          <span className={s.cardArrow}>
            Voir
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </span>
        </div>
      </div>
    </motion.article>
  );
}

/* ================================================================
   FILTER TABS
   ================================================================ */

function FilterTabs({ categories, active, setActive, items }: { categories: { id: string; label: string; color: string }[]; active: string; setActive: (id: string) => void; items: Product[] }) {
  return (
    <nav className={s.filters} aria-label="Filtrer par univers">
      {categories.map((cat) => {
        const count = cat.id === "all" ? items.length : items.filter((p) => p.subcategory === cat.id).length;
        return (
          <button key={cat.id} onClick={() => setActive(cat.id)} className={`${s.filter} ${active === cat.id ? s.filterActive : ""}`} style={cat.id !== "all" ? { "--dot": cat.color } as React.CSSProperties : undefined}>
            {cat.id !== "all" && <span className={s.filterDot} />}
            {cat.label}
            <span className={s.filterCount}>{count}</span>
          </button>
        );
      })}
    </nav>
  );
}

/* ================================================================
   FAQ ACCORDION
   ================================================================ */

function FaqItem({ item, index }: { item: { question: string; answer: string }; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`${s.faqItem} ${open ? s.faqItemOpen : ""}`}>
      <button type="button" className={s.faqQ} onClick={() => setOpen((v) => !v)}>
        <span className={s.faqNum}>{String(index + 1).padStart(2, "0")}</span>
        <span className={s.faqQText}>{item.question}</span>
        <svg className={s.faqChevron} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: "hidden" }}>
            <p className={s.faqA}>{typo(item.answer)}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================
   GRID CTA FILLER
   ================================================================ */

function GridCta() {
  return (
    <Link to="/newsletter" className={s.gridCta}>
      <span className={s.gridCtaIcon}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
      </span>
      <p className={s.gridCtaTitle}>D’autres kits arrivent</p>
      <p className={s.gridCtaSub}>Soyez prévenu dès leur sortie</p>
      <span className={s.gridCtaBtn}>
        Être notifié
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
      </span>
    </Link>
  );
}

/* ================================================================
   PAGE
   ================================================================ */

export default function BoutiquePage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const open = (p: Product) => { setSelectedProduct(p); setModalOpen(true); };
  const close = () => { setModalOpen(false); setTimeout(() => setSelectedProduct(null), 300); };

  const filteredProducts = activeFilter === "all" ? products : products.filter((p) => p.category === activeFilter);

  return (
    <div className={s.page}>
      <SEO
        title="Boutique — Kits thématiques pour grandir"
        description="16 kits thématiques alliant carnet, cartes et workbook pour votre développement personnel. Méditation, sport, couple, entrepreneuriat et plus."
        url="/boutique"
        type="website"
        itemListData={products.map((p) => ({ name: p.title, description: p.description, image: p.image }))}
        faqData={faqItems}
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: "Boutique", url: "/boutique" },
        ]}
      />
      <SiteHeader />
      <ProductModal product={selectedProduct} isOpen={modalOpen} onClose={close} />

      <main>
        <div className="v2-container">
          <Breadcrumb items={[
            { name: "Accueil", url: "/" },
            { name: "Boutique", url: "/boutique" },
          ]} />
          {/* ═══ HERO ═══ */}
          <section className={s.hero}>
            <div className={`${s.chapterMark} mono`}>
              <span className={s.cNum}>Ch.05</span>
              <span className={s.cSep}>/</span>
              <span className={s.cLabel}>Boutique</span>
            </div>

            <div className={s.heroGrid}>
              <div>
                <span className={s.heroKicker}>
                  <span className={s.heroKickerDot} aria-hidden="true" />
                  Boutique &middot; {products.length} kits
                </span>
                <h1 className={s.heroTitle}>
                  Des kits pour<br />se <em>transformer.</em>
                </h1>
                <p className={s.heroDeck}>
                  Carnet + cartes + workbook : chaque kit réunit les outils
                  essentiels autour d’un thème pour accompagner votre évolution.
                </p>
                <div className={s.heroStats}>
                  <div className={s.heroStat}>
                    <span className={s.heroStatVal}>{products.length}</span>
                    <span className={s.heroStatLbl}>Kits</span>
                  </div>
                  <div className={s.heroStat}>
                    <span className={s.heroStatVal}>5</span>
                    <span className={s.heroStatLbl}>Univers</span>
                  </div>
                  <div className={s.heroStat}>
                    <span className={s.heroStatVal}>39 €</span>
                    <span className={s.heroStatLbl}>Par kit</span>
                  </div>
                </div>
                <Link to="/newsletter" className={s.heroCta}>
                  <span>Être notifié au lancement</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </Link>
              </div>

              <div className={s.heroMosaic}>
                {featuredProducts.slice(0, 4).map((p) => (
                  <div key={p.id} className={s.mosaicCard} onClick={() => open(p)}>
                    <img src={p.image} alt={p.title} loading="lazy" decoding="async" />
                    <span className={s.mosaicGrad} />
                    <span className={s.cardSoon}>Bientôt disponible</span>
                    <span className={s.mosaicBadge} style={{ background: p.color }}>{p.format.split(" ")[0]}</span>
                    <div className={s.mosaicInfo}>
                      <span className={s.mosaicName}>{p.title}</span>
                      <span className={s.mosaicPrice}>{p.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ═══ TRUST ═══ */}
          <div className={s.trust}>
            {TRUST.map((t) => (
              <span key={t.icon} className={s.trustItem}>
                <TrustIcon name={t.icon} />
                {t.label}
              </span>
            ))}
          </div>

          {/* ═══ FEATURED ═══ */}
          <section className={s.section}>
            <header className={s.sectionHead}>
              <div className={s.sectionLabel}>
                <span className={s.sectionKicker}>
                  <span className={s.sectionKickerDot} aria-hidden="true" />
                  Sélection
                </span>
                <h2 className={s.sectionTitle}>Nos coups <em>de cœur.</em></h2>
                <p className={s.sectionDeck}>
                  Les kits les plus attendus, sélectionnés pour leur impact
                  transformateur sur votre quotidien.
                </p>
              </div>
              <Link className={s.sectionAll} to="/newsletter" aria-label="Être notifié">
                Être notifié
                <span className={s.sectionAllArrow} aria-hidden="true">&rarr;</span>
              </Link>
            </header>
            <div className={s.grid3}>
              {featuredProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} onClick={() => open(p)} />
              ))}
            </div>
          </section>

          {/* ═══ ALL KITS ═══ */}
          <section className={s.section}>
            <header className={s.sectionHead}>
              <div className={s.sectionLabel}>
                <span className={s.sectionKicker}>
                  <span className={s.sectionKickerDot} aria-hidden="true" />
                  Catalogue
                </span>
                <h2 className={s.sectionTitle}>Tous les <em>kits.</em></h2>
                <p className={s.sectionDeck}>
                  16 kits thématiques organisés par univers. Chaque kit contient
                  un carnet, des cartes et un workbook d’exercices.
                </p>
              </div>
            </header>
            <FilterTabs categories={universCategories} active={activeFilter} setActive={setActiveFilter} items={products} />
            <AnimatePresence mode="wait">
              <motion.div key={activeFilter} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className={s.grid4}>
                {filteredProducts.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} onClick={() => open(p)} />
                ))}
                <GridCta />
              </motion.div>
            </AnimatePresence>
          </section>
        </div>

        {/* ═══ NEWSLETTER CTA ═══ */}
        <section className={s.nlCta}>
          <div className="v2-container">
            <div className={s.nlInner}>
              <h2 className={s.nlTitle}>Soyez les premiers <em>informés.</em></h2>
              <p className={s.nlDeck}>
                Inscrivez-vous pour être prévenu dès le lancement et
                bénéficier d’offres exclusives réservées aux early adopters.
              </p>
              <Link to="/newsletter" className={s.nlBtn}>
                S’inscrire à la newsletter
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </Link>
              <p className={s.nlDisclaimer}>Rejoignez 2,500+ abonnés &middot; Pas de spam</p>
            </div>
          </div>
        </section>

        {/* ═══ FAQ ═══ */}
        <div className="v2-container">
          <section className={s.faq}>
            <header className={s.faqHead}>
              <span className={s.sectionKicker}>
                <span className={s.sectionKickerDot} aria-hidden="true" />
                Questions fréquentes
              </span>
              <h2 className={s.sectionTitle}>Tout ce que vous <em>devez savoir.</em></h2>
            </header>
            <div className={s.faqList}>
              {faqItems.map((item, i) => (
                <FaqItem key={i} item={item} index={i} />
              ))}
            </div>
            <div className={s.faqContact}>
              <Link to="/contact" className={s.faqContactLink}>
                D’autres questions&nbsp;? Contactez-nous
                <span>&rarr;</span>
              </Link>
            </div>
          </section>
        </div>

        {/* ═══ CLOSING ═══ */}
        <section className={s.closing}>
          <div className="v2-container">
            <div className={s.closingInner}>
              <div className={s.closingRule} />
              <p className={s.closingLogo}>Origines Media</p>
              <p className={s.closingText}>
                Des ressources pensées pour ceux qui veulent avancer,
                comprendre, et prendre soin d’eux-mêmes.
              </p>
              <div className={s.closingLinks}>
                <Link to="/" className={s.closingLink}>Accueil</Link>
                <span className={s.closingDot} />
                <Link to="/articles" className={s.closingLink}>Articles</Link>
                <span className={s.closingDot} />
                <Link to="/newsletter" className={s.closingLink}>Newsletter</Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer2 />
      <ScrollToTopV2 />
    </div>
  );
}
