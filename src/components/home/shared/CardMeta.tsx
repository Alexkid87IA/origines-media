import type { CSSProperties } from "react";
import type { HomeItem } from "@/lib/homeUtils";
import { universOf, metaOf } from "@/lib/homeUtils";
import s from "./CardMeta.module.css";

export default function CardMeta({ item, fallback }: { item: HomeItem; fallback?: string }) {
  const univers = universOf(item);
  return (
    <div className={s.meta}>
      {univers && (
        <span className={s.univers} style={{ "--accent": univers.color } as CSSProperties}>
          <span className={s.dot} />
          {univers.name}
        </span>
      )}
      <span>{metaOf(item, fallback)}</span>
    </div>
  );
}
