import { Fragment } from "react";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import CardMeta from "./shared/CardMeta";
import SectionHead from "./shared/SectionHead";
import MiniPromoCard from "./shared/MiniPromoCard";
import type { HomeItem } from "@/lib/homeUtils";
import { itemHref, keepFrenchPunctuation, excerptOf } from "@/lib/homeUtils";
import s from "./SelectionSection.module.css";

export default function SelectionSection({ items }: { items: HomeItem[] }) {
  if (!items.length) return null;

  return (
    <section className={s.selectionSection} aria-labelledby="selection-title">
      <SectionHead eyebrow="Sélection de la rédaction" title="À garder sous le coude" />
      <div className={s.selectionGrid}>
        {items.map((item, index) => (
          <Fragment key={item._id}>
            <Card href={itemHref(item)} variant="outlined" size="sm" className={s.selectionCard}>
              <CardMeta item={item} />
              <h3>{keepFrenchPunctuation(item.titre)}</h3>
              <p>{excerptOf(item, 170)}</p>
            </Card>
            {index === 1 && (
              <MiniPromoCard
                eyebrow="Lettre"
                title="La lettre du dimanche."
                body="Un rendez-vous lent pour relier les sujets, les émotions et les idées."
                cta="Lire la lettre"
                to="/lettre-du-dimanche"
                tone="green"
              />
            )}
          </Fragment>
        ))}
        <a href="/a-propos" className={s.selectionHandnote}>
          <span className={s.selectionNoteKicker}>À propos d'Origines</span>
          <strong>Un média pour comprendre ce qui nous fabrique.</strong>
          <span className={s.selectionNoteText}>Notre ligne, nos choix éditoriaux, nos formats et la façon dont on raconte les histoires sans les réduire.</span>
          <small>Lire notre histoire <ArrowRight aria-hidden="true" /></small>
        </a>
      </div>
    </section>
  );
}
