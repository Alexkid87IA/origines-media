import { sanityImg } from "@/lib/sanityImage";
import s from "./AffiliateProductCard.module.css";

interface AffiliateLink {
  _key: string;
  platform: string;
  url: string;
  price?: string;
  label?: string;
}

interface AffiliateProduct {
  _id: string;
  name: string;
  slug: string;
  productType: string;
  description?: string;
  brand?: string;
  mentionedBy?: string;
  imageUrl?: string;
  affiliateLinks?: AffiliateLink[];
}

const PLATFORM_LABELS: Record<string, string> = {
  "amazon-fr": "Amazon",
  iherb: "iHerb",
  fnac: "Fnac",
  momentous: "Momentous",
  direct: "Site officiel",
  other: "Acheter",
};

const TYPE_LABELS: Record<string, string> = {
  supplement: "Supplément",
  book: "Livre",
  tool: "Outil",
  app: "Application",
  device: "Appareil",
  course: "Formation",
};

export default function AffiliateProductCard({ product }: { product: AffiliateProduct }) {
  const imgSrc = product.imageUrl
    ? product.imageUrl.includes("cdn.sanity.io")
      ? sanityImg(product.imageUrl, 300)
      : product.imageUrl
    : undefined;

  return (
    <div className={s.card}>
      {imgSrc && (
        <div className={s.imgWrap}>
          <img src={imgSrc} alt={product.name} className={s.img} loading="lazy" />
        </div>
      )}
      <div className={s.body}>
        <div className={s.meta}>
          <span className={s.typeBadge}>
            {TYPE_LABELS[product.productType] || product.productType}
          </span>
          {product.brand && <span className={s.brand}>{product.brand}</span>}
        </div>
        <h4 className={s.name}>{product.name}</h4>
        {product.description && <p className={s.desc}>{product.description}</p>}
        {product.mentionedBy && (
          <p className={s.mention}>
            Recommandé par <strong>{product.mentionedBy}</strong>
          </p>
        )}
        {product.affiliateLinks && product.affiliateLinks.length > 0 && (
          <div className={s.links}>
            {product.affiliateLinks.map((link) => (
              <a
                key={link._key}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className={s.linkBtn}
              >
                {link.label || PLATFORM_LABELS[link.platform] || "Acheter"}
                {link.price && <span className={s.price}>{link.price}</span>}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function AffiliateBlockRenderer({ value }: { value: { titre?: string; products?: AffiliateProduct[]; style?: string } }) {
  if (!value.products || value.products.length === 0) return null;

  return (
    <aside className={s.block}>
      <div className={s.blockHeader}>
        <span className={s.blockIcon}>&#x1f6d2;</span>
        <h3 className={s.blockTitle}>{value.titre || "Produits recommandés"}</h3>
      </div>
      <div className={`${s.blockGrid} ${value.products.length === 1 ? s.blockGridSingle : ""}`}>
        {value.products.map((p) => (
          <AffiliateProductCard key={p._id} product={p} />
        ))}
      </div>
      <p className={s.disclosure}>
        Lien affilié — Origines Media perçoit une commission, sans surcoût pour vous.
      </p>
    </aside>
  );
}
