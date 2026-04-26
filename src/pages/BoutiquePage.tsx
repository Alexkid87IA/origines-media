import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import SEO from "../components/SEO";
import { typo } from "../lib/typography";
import { useSubscribe } from "../hooks/useSubscribe";
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
   DATA
   ================================================================ */

const products: Product[] = [
  // ── Digital: E-books ──
  { id: "ebook-resilience", title: "L’Art de la Résilience", subtitle: "Rebondir face aux épreuves", description: "Un guide complet pour développer votre capacité à surmonter les difficultés.", price: "14,90 €", badge: "Nouveau", badgeColor: "#8B5CF6", color: "#8B5CF6", features: ["120 pages", "Exercices pratiques", "Témoignages"], format: "E-book PDF", category: "digital", subcategory: "ebooks", image: "/boutique/ebook-resilience.webp" },
  { id: "ebook-confiance", title: "Construire sa Confiance", subtitle: "Le guide de l’estime de soi", description: "Découvrez les clés pour bâtir une confiance solide et durable.", price: "14,90 €", badgeColor: "#8B5CF6", color: "#8B5CF6", features: ["100 pages", "30 exercices", "Plan d’action"], format: "E-book PDF", category: "digital", subcategory: "ebooks", image: "/boutique/ebook-confiance.webp" },
  { id: "ebook-relations", title: "Relations Authentiques", subtitle: "Créer des liens profonds", description: "Apprenez à cultiver des relations sincères et épanouissantes.", price: "14,90 €", badgeColor: "#8B5CF6", color: "#8B5CF6", features: ["90 pages", "Outils communication", "Cas pratiques"], format: "E-book PDF", category: "digital", subcategory: "ebooks", image: "/boutique/ebook-relations.webp" },
  // ── Digital: Workbooks ──
  { id: "workbook-introspection-digital", title: "Journal d’Introspection", subtitle: "90 jours de réflexion", description: "Un journal guidé pour explorer votre monde intérieur.", price: "19,90 €", badge: "Best-seller", badgeColor: "#111827", color: "#EC4899", features: ["90 prompts", "À imprimer", "Suivi progression"], format: "Workbook PDF", category: "digital", subcategory: "workbooks", popular: true, featured: true, image: "/boutique/workbook-introspection.webp" },
  { id: "workbook-gratitude-digital", title: "Carnet de Gratitude", subtitle: "30 jours pour changer", description: "Transformez votre quotidien grâce à la pratique de la gratitude.", price: "12,90 €", badgeColor: "#EC4899", color: "#EC4899", features: ["30 jours", "Prompts quotidiens", "Citations"], format: "Workbook PDF", category: "digital", subcategory: "workbooks", image: "/boutique/workbook-gratitude.webp" },
  { id: "workbook-objectifs-digital", title: "Planificateur d’Objectifs", subtitle: "De la vision à l’action", description: "Un système complet pour définir et atteindre vos objectifs.", price: "16,90 €", badgeColor: "#EC4899", color: "#EC4899", features: ["Vision board", "Plans mensuels", "Tracker habitudes"], format: "Workbook PDF", category: "digital", subcategory: "workbooks", image: "/boutique/workbook-objectifs.webp" },
  // ── Digital: Audio ──
  { id: "audio-meditation-pack", title: "Pack Méditations Guidées", subtitle: "10 séances pour se recentrer", description: "Une collection de méditations guidées pour cultiver le calme.", price: "24,90 €", badge: "Audio HD", badgeColor: "#0891B2", color: "#0891B2", features: ["10 méditations", "5h d’audio", "MP3 HD"], format: "Audio MP3", category: "digital", subcategory: "audio", featured: true, image: "/boutique/audio-meditation.webp" },
  { id: "audio-affirmations", title: "Affirmations Positives", subtitle: "Reprogrammez votre mental", description: "Des affirmations puissantes pour renforcer votre confiance.", price: "9,90 €", badgeColor: "#0891B2", color: "#0891B2", features: ["100 affirmations", "2h d’audio", "Musique relaxante"], format: "Audio MP3", category: "digital", subcategory: "audio", image: "/boutique/audio-affirmations.webp" },
  { id: "audio-sommeil", title: "Histoires pour Dormir", subtitle: "Retrouvez un sommeil paisible", description: "Des récits apaisants pour vous accompagner vers le sommeil.", price: "14,90 €", badgeColor: "#0891B2", color: "#0891B2", features: ["8 histoires", "4h d’audio", "Sons nature"], format: "Audio MP3", category: "digital", subcategory: "audio", image: "/boutique/audio-sommeil.webp" },
  // ── Digital: Formations ──
  { id: "masterclass-storytelling", title: "Masterclass Storytelling", subtitle: "Racontez votre histoire", description: "Apprenez l’art de raconter votre histoire de manière captivante.", price: "49 €", originalPrice: "79 €", badge: "−38 %", badgeColor: "#DC2626", color: "#F59E0B", features: ["12 vidéos HD", "Workbook 50p", "Accès à vie"], format: "Formation vidéo", category: "digital", subcategory: "formations", popular: true, featured: true, image: "/boutique/masterclass-storytelling.webp" },
  { id: "formation-mindset", title: "Formation Mindset", subtitle: "Transformez votre mental", description: "Développez un état d’esprit de croissance.", price: "69 €", originalPrice: "99 €", badge: "−30 %", badgeColor: "#DC2626", color: "#F59E0B", features: ["8 modules", "6h de vidéo", "Communauté privée"], format: "Formation vidéo", category: "digital", subcategory: "formations", image: "/boutique/formation-mindset.webp" },
  { id: "formation-emotions", title: "Maîtrise Émotionnelle", subtitle: "Comprendre et gérer ses émotions", description: "Développez votre intelligence émotionnelle.", price: "59 €", originalPrice: "89 €", badge: "−34 %", badgeColor: "#DC2626", color: "#F59E0B", features: ["10 modules", "8h de vidéo", "Certificat"], format: "Formation vidéo", category: "digital", subcategory: "formations", image: "/boutique/formation-emotions.webp" },
  // ── Physical: Carnets ──
  { id: "carnet-vie-en-clair", title: "Ma Vie en Clair", subtitle: "Planner annuel complet", description: "Organisez votre année avec intention.", price: "29 €", badge: "Exclusif", badgeColor: "#111827", color: "#10B981", features: ["Format A5", "240 pages", "Couverture rigide"], format: "Carnet relié", category: "physical", subcategory: "carnets", popular: true, featured: true, image: "/boutique/carnet-vie-en-clair.webp" },
  { id: "journal-intime-guide", title: "Journal Intime Guidé", subtitle: "365 prompts pour se découvrir", description: "Une question par jour pendant un an.", price: "24 €", badgeColor: "#10B981", color: "#10B981", features: ["365 prompts", "Papier premium", "Reliure cousue"], format: "Journal relié", category: "physical", subcategory: "carnets", image: "/boutique/journal-intime-guide.webp" },
  { id: "carnet-rituels-matin", title: "Rituels du Matin", subtitle: "90 jours de routine matinale", description: "Structurez vos matins pour des journées intentionnelles.", price: "19 €", badgeColor: "#10B981", color: "#10B981", features: ["90 jours", "Routine structurée", "Format compact"], format: "Carnet relié", category: "physical", subcategory: "carnets", image: "/boutique/carnet-rituels-matin.webp" },
  { id: "agenda-intentionnel", title: "Agenda Intentionnel", subtitle: "Semainier avec réflexion", description: "Planifiez vos semaines avec intentions.", price: "34 €", badge: "Premium", badgeColor: "#8B5CF6", color: "#10B981", features: ["52 semaines", "Check-in émotionnel", "Couverture cuir"], format: "Agenda relié", category: "physical", subcategory: "carnets", image: "/boutique/agenda-intentionnel.webp" },
  { id: "bilan-de-vie", title: "Mon Bilan de Vie", subtitle: "Faire le point sur tous les domaines", description: "Un workbook pour évaluer chaque aspect de votre vie.", price: "22 €", badgeColor: "#10B981", color: "#10B981", features: ["10 domaines", "Exercices guidés", "100 pages"], format: "Workbook relié", category: "physical", subcategory: "carnets", image: "/boutique/bilan-de-vie.webp" },
  // ── Physical: Cartes ──
  { id: "cartes-introspection", title: "52 Cartes Introspection", subtitle: "Une question par semaine", description: "Tirez une carte chaque semaine pour une réflexion profonde.", price: "19 €", badge: "Populaire", badgeColor: "#111827", color: "#EC4899", features: ["52 cartes", "Boîte premium", "Finition mate"], format: "Deck de cartes", category: "physical", subcategory: "cartes", popular: true, image: "/boutique/cartes-introspection.webp" },
  { id: "cartes-conversations", title: "Conversations Profondes", subtitle: "50 cartes pour se connecter", description: "Des questions pour des discussions authentiques.", price: "24 €", badgeColor: "#EC4899", color: "#EC4899", features: ["50 cartes", "Couple & amis", "Livret inclus"], format: "Deck de cartes", category: "physical", subcategory: "cartes", featured: true, image: "/boutique/cartes-conversations.webp" },
  { id: "cartes-affirmations", title: "Cartes Affirmations", subtitle: "30 affirmations illustrées", description: "Tirez une carte chaque matin.", price: "15 €", badgeColor: "#EC4899", color: "#EC4899", features: ["30 cartes", "Illustrations", "Format voyage"], format: "Deck de cartes", category: "physical", subcategory: "cartes", image: "/boutique/cartes-affirmations-deck.webp" },
  { id: "cartes-et-si", title: 'Cartes "Ét si…"', subtitle: "40 questions pour imaginer", description: "Des questions pour explorer vos rêves.", price: "17 €", badgeColor: "#EC4899", color: "#EC4899", features: ["40 cartes", "Imagination", "Coaching inclus"], format: "Deck de cartes", category: "physical", subcategory: "cartes", image: "/boutique/cartes-et-si.webp" },
  // ── Physical: Posters ──
  { id: "poster-vision-board", title: "Poster Vision Board", subtitle: "Grand format à compléter", description: "Visualisez vos rêves sur ce poster à personnaliser.", price: "15 €", badgeColor: "#F59E0B", color: "#F59E0B", features: ["Format A2", "Papier épais", "Zones à remplir"], format: "Poster", category: "physical", subcategory: "posters", image: "/boutique/poster-vision-board.webp" },
  { id: "set-affiches-citations", title: "Set 5 Affiches Citations", subtitle: "Typographie soignée", description: "Cinq citations inspirantes en affiches décoratives.", price: "25 €", badge: "Set complet", badgeColor: "#F59E0B", color: "#F59E0B", features: ["5 affiches A4", "Papier premium", "Design épuré"], format: "Set d’affiches", category: "physical", subcategory: "posters", image: "/boutique/set-affiches-citations.webp" },
  { id: "calendrier-inspirant", title: "Calendrier Mural Inspirant", subtitle: "12 mois, 12 thèmes", description: "Un calendrier avec un exercice chaque mois.", price: "22 €", badgeColor: "#F59E0B", color: "#F59E0B", features: ["Format A3", "12 exercices", "Illustrations"], format: "Calendrier mural", category: "physical", subcategory: "posters", image: "/boutique/calendrier-inspirant.webp" },
  // ── Physical: Coffrets ──
  { id: "coffret-nouveau-depart", title: 'Coffret "Nouveau Départ"', subtitle: "Tout pour commencer", description: "Le kit complet pour démarrer votre transformation.", price: "59 €", originalPrice: "85 €", badge: "−30 %", badgeColor: "#DC2626", color: "#8B5CF6", features: ["Carnet + Cartes + Poster", "Guide digital", "Boîte cadeau"], format: "Coffret", category: "physical", subcategory: "coffrets", popular: true, featured: true, image: "/boutique/coffret-nouveau-depart.webp" },
  { id: "kit-rituels-soir", title: "Kit Rituels du Soir", subtitle: "Pour des nuits apaisées", description: "Journal, cartes et méditations pour bien finir la journée.", price: "45 €", originalPrice: "62 €", badge: "−27 %", badgeColor: "#DC2626", color: "#8B5CF6", features: ["Journal + Cartes", "Méditations audio", "Pochette coton"], format: "Kit", category: "physical", subcategory: "coffrets", image: "/boutique/kit-rituels-soir.webp" },
  { id: "box-couple-connecte", title: "Box Couple Connecté", subtitle: "Renforcez votre relation", description: "Cartes conversation, journal partagé et guide.", price: "49 €", originalPrice: "68 €", badge: "−28 %", badgeColor: "#DC2626", color: "#8B5CF6", features: ["Cartes + Journal duo", "Guide relation", "Emballage cadeau"], format: "Box", category: "physical", subcategory: "coffrets", image: "/boutique/box-couple-connecte.webp" },
  // ── Packs ──
  { id: "pack-decouverte", title: "Pack Découverte Digital", subtitle: "Pour bien démarrer", description: "L’essentiel en digital : e-book + workbook + méditations.", price: "29,90 €", originalPrice: "49,70 €", badge: "−40 %", badgeColor: "#DC2626", color: "#6366F1", features: ["1 e-book", "1 workbook", "5 méditations"], format: "Pack digital", category: "packs", subcategory: "packs", image: "/boutique/pack-decouverte.webp" },
  { id: "pack-transformation", title: "Pack Transformation", subtitle: "Le programme complet", description: "Tout notre catalogue digital.", price: "149 €", originalPrice: "297 €", badge: "−50 %", badgeColor: "#DC2626", color: "#6366F1", features: ["Toutes les formations", "Tous les e-books", "Tous les audios"], format: "Pack complet", category: "packs", subcategory: "packs", popular: true, image: "/boutique/pack-transformation.webp" },
  { id: "abonnement-premium", title: "Abonnement Premium", subtitle: "Accès illimité mensuel", description: "Accédez à tout notre catalogue digital.", price: "9,90 €/mois", badge: "Illimité", badgeColor: "#8B5CF6", color: "#6366F1", features: ["Tout le catalogue", "Nouveautés incluses", "Sans engagement"], format: "Abonnement", category: "packs", subcategory: "packs", image: "/boutique/abonnement-premium.webp" },
];

const featuredProducts = products.filter((p) => p.featured);
const digitalProducts = products.filter((p) => p.category === "digital");
const physicalProducts = products.filter((p) => p.category === "physical");
const packProducts = products.filter((p) => p.category === "packs");

const digitalSubcategories = [
  { id: "all", label: "Tous", color: "#111827" },
  { id: "ebooks", label: "E-books", color: "#8B5CF6" },
  { id: "workbooks", label: "Workbooks", color: "#EC4899" },
  { id: "audio", label: "Audio", color: "#0891B2" },
  { id: "formations", label: "Formations", color: "#F59E0B" },
];

const physicalSubcategories = [
  { id: "all", label: "Tous", color: "#111827" },
  { id: "carnets", label: "Carnets", color: "#10B981" },
  { id: "cartes", label: "Cartes", color: "#EC4899" },
  { id: "posters", label: "Posters", color: "#F59E0B" },
  { id: "coffrets", label: "Coffrets", color: "#8B5CF6" },
];

const faqItems = [
  { question: "Quand la boutique sera-t-elle disponible ?", answer: "Nous préparons soigneusement chaque produit. Inscrivez-vous à la newsletter pour être informé du lancement." },
  { question: "Comment accéder à mes achats digitaux ?", answer: "Après votre achat, vous recevrez un email avec un lien de téléchargement immédiat." },
  { question: "Livrez-vous en Europe ?", answer: "Oui, nous livrons en France métropolitaine et dans toute l’Europe." },
  { question: "Quelle est votre politique de remboursement ?", answer: "Garantie satisfait ou remboursé de 14 jours sur tous nos produits, sans question." },
  { question: "Proposez-vous le paiement en plusieurs fois ?", answer: "Oui, pour les achats à partir de 50 €, paiement en 3 fois sans frais disponible." },
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
                      <p className={s.notifyHint}>Recevez un email d&egrave;s que ce produit sera disponible</p>
                      {status === "error" && <p className={s.notifyError}>Une erreur est survenue. R&eacute;essayez.</p>}
                    </form>
                  ) : (
                    <div className={s.notifyOk}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                      <div>
                        <p className={s.notifyOkTitle}>Vous &ecirc;tes inscrit&nbsp;!</p>
                        <p className={s.notifyOkText}>Nous vous pr&eacute;viendrons d&egrave;s que ce produit sera disponible.</p>
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
        <span className={s.cardSoon}>Bient&ocirc;t disponible</span>
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
    <nav className={s.filters} aria-label="Filtrer par type">
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
      <p className={s.gridCtaTitle}>D&rsquo;autres produits arrivent</p>
      <p className={s.gridCtaSub}>Soyez pr&eacute;venu d&egrave;s leur sortie</p>
      <span className={s.gridCtaBtn}>
        &Ecirc;tre notifi&eacute;
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
      </span>
    </Link>
  );
}

/* ================================================================
   PAGE
   ================================================================ */

export default function BoutiquePage() {
  const [activeDigi, setActiveDigi] = useState("all");
  const [activePhys, setActivePhys] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const open = (p: Product) => { setSelectedProduct(p); setModalOpen(true); };
  const close = () => { setModalOpen(false); setTimeout(() => setSelectedProduct(null), 300); };

  const filteredDigi = activeDigi === "all" ? digitalProducts : digitalProducts.filter((p) => p.subcategory === activeDigi);
  const filteredPhys = activePhys === "all" ? physicalProducts : physicalProducts.filter((p) => p.subcategory === activePhys);

  return (
    <div className={s.page}>
      <SEO
        title="Boutique — E-books, carnets et formations"
        description="Découvrez nos e-books, workbooks, carnets, cartes et formations pour votre développement personnel."
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
          {/* ═══ HERO ═══ */}
          <section className={s.hero}>
            <div className={`${s.chapterMark} mono`}>
              <span className={s.cNum}>Ch.05</span>
              <span className={s.cSep}>/</span>
              <span className={s.cLabel}>Boutique</span>
            </div>

            <div className={s.heroGrid}>
              <div className={s.heroText}>
                <span className={s.heroKicker}>
                  <span className={s.heroKickerDot} aria-hidden="true" />
                  Boutique &middot; {products.length} produits
                </span>
                <h1 className={s.heroTitle}>
                  Des ressources<br />pour <em>grandir.</em>
                </h1>
                <p className={s.heroDeck}>
                  E-books, workbooks, formations et objets soigneusement con&ccedil;us
                  pour accompagner votre d&eacute;veloppement personnel.
                </p>
                <div className={s.heroStats}>
                  <div className={s.heroStat}>
                    <span className={s.heroStatVal}>{products.length}</span>
                    <span className={s.heroStatLbl}>Produits</span>
                  </div>
                  <div className={s.heroStat}>
                    <span className={s.heroStatVal}>4.9</span>
                    <span className={s.heroStatLbl}>Satisfaction</span>
                  </div>
                  <div className={s.heroStat}>
                    <span className={s.heroStatVal}>2.5k+</span>
                    <span className={s.heroStatLbl}>Clients</span>
                  </div>
                </div>
                <Link to="/newsletter" className={s.heroCta}>
                  <span>&Ecirc;tre notifi&eacute; au lancement</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </Link>
              </div>

              <div className={s.heroMosaic}>
                {featuredProducts.slice(0, 4).map((p) => (
                  <div key={p.id} className={s.mosaicCard} onClick={() => open(p)}>
                    <img src={p.image} alt={p.title} loading="lazy" decoding="async" />
                    <span className={s.mosaicGrad} />
                    <span className={s.cardSoon}>Bient&ocirc;t disponible</span>
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
                  S&eacute;lection
                </span>
                <h2 className={s.sectionTitle}>Nos coups <em>de cœur.</em></h2>
                <p className={s.sectionDeck}>
                  Les produits les plus populaires, s&eacute;lectionn&eacute;s pour leur impact
                  transformateur sur votre quotidien.
                </p>
              </div>
              <Link className={s.sectionAll} to="/newsletter" aria-label="Être notifié">
                &Ecirc;tre notifi&eacute;
                <span className={s.sectionAllArrow} aria-hidden="true">&rarr;</span>
              </Link>
            </header>
            <div className={s.grid3}>
              {featuredProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} onClick={() => open(p)} />
              ))}
            </div>
          </section>

          {/* ═══ DIGITAL ═══ */}
          <section className={s.section}>
            <header className={s.sectionHead}>
              <div className={s.sectionLabel}>
                <span className={s.sectionKicker}>
                  <span className={s.sectionKickerDot} aria-hidden="true" />
                  T&eacute;l&eacute;charger
                </span>
                <h2 className={s.sectionTitle}>Produits <em>digitaux.</em></h2>
                <p className={s.sectionDeck}>
                  E-books, workbooks, m&eacute;ditations et formations vid&eacute;o.
                  T&eacute;l&eacute;chargez et commencez imm&eacute;diatement.
                </p>
              </div>
            </header>
            <FilterTabs categories={digitalSubcategories} active={activeDigi} setActive={setActiveDigi} items={digitalProducts} />
            <AnimatePresence mode="wait">
              <motion.div key={activeDigi} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className={s.grid4}>
                {filteredDigi.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} onClick={() => open(p)} />
                ))}
                <GridCta />
              </motion.div>
            </AnimatePresence>
          </section>

          {/* ═══ PHYSICAL ═══ */}
          <section className={s.section}>
            <header className={s.sectionHead}>
              <div className={s.sectionLabel}>
                <span className={s.sectionKicker}>
                  <span className={s.sectionKickerDot} aria-hidden="true" />
                  Commander
                </span>
                <h2 className={s.sectionTitle}>Produits <em>physiques.</em></h2>
                <p className={s.sectionDeck}>
                  Carnets, planners, cartes et coffrets. Des objets beaux et utiles
                  pour votre quotidien.
                </p>
              </div>
            </header>
            <FilterTabs categories={physicalSubcategories} active={activePhys} setActive={setActivePhys} items={physicalProducts} />
            <AnimatePresence mode="wait">
              <motion.div key={activePhys} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className={s.grid4}>
                {filteredPhys.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} onClick={() => open(p)} />
                ))}
                <GridCta />
              </motion.div>
            </AnimatePresence>
          </section>
        </div>

        {/* ═══ PACKS — dark section ═══ */}
        <section className={s.packs}>
          <div className="v2-container">
            <div className={`${s.chapterMark} ${s.chapterMarkLight} mono`}>
              <span className={s.cNum}>&Eacute;conomiser</span>
              <span className={s.cSep}>/</span>
              <span className={s.cLabel}>Packs &amp; Abonnements</span>
            </div>
            <header className={s.packsHead}>
              <h2 className={s.packsTitle}>
                Acc&eacute;dez &agrave; tout.<br /><em>Pour moins.</em>
              </h2>
              <p className={s.packsDeck}>
                &Eacute;conomisez jusqu&rsquo;&agrave; 50&nbsp;% avec nos offres group&eacute;es.
                Acc&eacute;dez &agrave; tout notre catalogue digital.
              </p>
            </header>
            <div className={s.packsGrid}>
              {packProducts.map((p, i) => (
                <div key={p.id} className={`${s.packCard} ${i === 1 ? s.packCardFeatured : ""}`} onClick={() => open(p)}>
                  <div className={s.packImgWrap}>
                    <img src={p.image} alt={p.title} loading="lazy" />
                    <span className={s.packImgGrad} />
                    <span className={s.cardSoon}>Bient&ocirc;t disponible</span>
                  </div>
                  <div className={s.packBody}>
                    {p.badge && <span className={s.packBadge} style={{ background: p.badgeColor }}>{p.badge}</span>}
                    <h3 className={s.packName}>{typo(p.title)}</h3>
                    <p className={s.packSub}>{p.subtitle}</p>
                    <div className={s.packPriceRow}>
                      <span className={s.packPrice}>{p.price}</span>
                      {p.originalPrice && <span className={s.packOld}>{p.originalPrice}</span>}
                    </div>
                    <ul className={s.packFeats}>
                      {p.features.map((f, j) => (
                        <li key={j}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <span className={s.packCta}>
                      &Ecirc;tre notifi&eacute;
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ NEWSLETTER CTA ═══ */}
        <section className={s.nlCta}>
          <div className="v2-container">
            <div className={s.nlInner}>
              <h2 className={s.nlTitle}>Soyez les premiers <em>inform&eacute;s.</em></h2>
              <p className={s.nlDeck}>
                Inscrivez-vous pour &ecirc;tre pr&eacute;venu d&egrave;s le lancement et
                b&eacute;n&eacute;ficier d&rsquo;offres exclusives r&eacute;serv&eacute;es aux early adopters.
              </p>
              <Link to="/newsletter" className={s.nlBtn}>
                S&rsquo;inscrire &agrave; la newsletter
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </Link>
              <p className={s.nlDisclaimer}>Rejoignez 2,500+ abonn&eacute;s &middot; Pas de spam</p>
            </div>
          </div>
        </section>

        {/* ═══ FAQ ═══ */}
        <div className="v2-container">
          <section className={s.faq}>
            <header className={s.faqHead}>
              <span className={s.sectionKicker}>
                <span className={s.sectionKickerDot} aria-hidden="true" />
                Questions fr&eacute;quentes
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
                D&rsquo;autres questions&nbsp;? Contactez-nous
                <span>&rarr;</span>
              </Link>
            </div>
          </section>
        </div>

        {/* ═══ CLOSING — transition to footer ═══ */}
        <section className={s.closing}>
          <div className="v2-container">
            <div className={s.closingInner}>
              <div className={s.closingRule} />
              <p className={s.closingLogo}>Origines Media</p>
              <p className={s.closingText}>
                Des ressources pens&eacute;es pour ceux qui veulent avancer,
                comprendre, et prendre soin d&rsquo;eux-m&ecirc;mes.
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
