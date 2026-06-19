import type { HomeItem } from "@/lib/homeUtils";
import { itemHref, metaOf, keepFrenchPunctuation } from "@/lib/homeUtils";
import s from "./LiveStrip.module.css";

export default function LiveStrip({ articles }: { articles: HomeItem[] }) {
  return (
    <section className={s.liveStrip} aria-label="Dernières publications">
      <span className={s.liveLabel}>En ce moment</span>
      <div className={s.liveItems}>
        {articles.slice(0, 5).map((item) => (
          <a key={item._id} href={itemHref(item)} className={s.liveItem}>
            <time>{metaOf(item, "Publié").split(" / ")[0]}</time>
            <span>{keepFrenchPunctuation(item.titre)}</span>
          </a>
        ))}
      </div>
      <a href="/articles" className={s.liveMore}>Voir plus</a>
    </section>
  );
}
