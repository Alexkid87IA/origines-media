import { useState, useEffect, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { sanityFetch } from "@/lib/sanity";
import { sanityImg } from "@/lib/sanityImage";
import { RT } from "@/lib/queries";
import { UNIVERS_MAP, type UniversId } from "@/data/univers";
import s from "./LatestGuides.module.css";

interface GuideItem {
  _id: string;
  titre: string;
  slug: string;
  imageUrl?: string;
  univpilar?: string;
  tempsLecture?: number;
  authorName?: string;
  description?: string;
  extrait?: string;
  contenuTexte?: string;
  imageRatio?: number;
}

const QUERY = `
  *[_type == "production" && rubrique == "guides" && defined(image.asset)] | order(datePublication desc) [0...6] {
    _id, titre, description, extrait,
    "contenuTexte": array::join(contenu[_type == "block"][0...3].children[].text, " "),
    "slug": slug.current,
    "imageUrl": coalesce(image.asset->url, mainImage.asset->url, imageUrl),
    "imageRatio": coalesce(image.asset->metadata.dimensions.aspectRatio, mainImage.asset->metadata.dimensions.aspectRatio),
    univpilar, ${RT},
    "authorName": coalesce(author->name, author)
  }
`;

function uLabel(id?: string) {
  return id ? UNIVERS_MAP[id as UniversId]?.label ?? null : null;
}
function uColor(id?: string) {
  return id ? UNIVERS_MAP[id as UniversId]?.color ?? "var(--stone500)" : "var(--stone500)";
}

function excerptOf(guide: GuideItem, max = 220) {
  const raw = guide.extrait || guide.description || guide.contenuTexte || "";
  const clean = raw.replace(/\s+/g, " ").trim();

  if (!clean) {
    return "Un guide pratique pour transformer une intuition en gestes simples, semaine après semaine.";
  }

  if (clean.length <= max) return clean;

  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 120 ? lastSpace : max).trim()}...`;
}

function GuideMeta({ guide }: { guide: GuideItem }) {
  const univers = uLabel(guide.univpilar);
  const parts = [
    univers,
    guide.tempsLecture ? `${guide.tempsLecture} min` : "Guide pratique",
  ].filter(Boolean);

  return <div className={s.guideMeta}>{parts.join(" / ")}</div>;
}

function coverStyle(guide: GuideItem, index?: number) {
  const ratio = guide.imageRatio && Number.isFinite(guide.imageRatio) ? String(guide.imageRatio) : "1.5";
  return {
    "--accent": uColor(guide.univpilar),
    "--cover-ratio": ratio,
    ...(typeof index === "number" ? { "--i": index } : {}),
  } as CSSProperties;
}

export default function LatestGuides() {
  const [items, setItems] = useState<GuideItem[]>([]);

  useEffect(() => {
    sanityFetch<GuideItem[]>(QUERY).then((d) => setItems(d || []));
  }, []);

  if (!items.length) return null;

  const hero = items[0];
  const rest = items.slice(1, 6);

  return (
    <section className={s.section} aria-labelledby="latest-guides-title">
      <div className={s.chapterMark}>
        <span className={s.cNum}>Ch.04</span>
        <span className={s.cSep}>/</span>
        <span className={s.cLabel}>Nos guides</span>
        <Link to="/guides" className={s.seeAll}>
          Tous les guides <ArrowRight className={s.arrow} aria-hidden="true" />
        </Link>
      </div>

      <header className={s.editorialHeader}>
        <div>
          <span className={s.sectionKicker}>À mettre en pratique</span>
          <h2 id="latest-guides-title" className={s.sectionTitle}>
            Des guides qui transforment une idée en chemin.
          </h2>
        </div>
        <p className={s.sectionDeck}>
          Des programmes lisibles, concrets, pensés pour avancer sans se perdre dans les conseils.
        </p>
      </header>

      <div className={s.guideLayout}>
        <Card
          href={`/article/${hero.slug}`}
          variant="outlined"
          size="sm"
          className={s.featureGuide}
          style={coverStyle(hero)}
        >
          <div className={s.featureMedia}>
            <img
              src={sanityImg(hero.imageUrl, 1000) || "/placeholder.svg"}
              alt={hero.titre}
              className={s.featureImg}
              loading="lazy"
            />
          </div>

          <div className={s.featureBody}>
            <span className={s.featurePill}>Guide complet</span>
            <GuideMeta guide={hero} />
            <h3 className={s.featureTitle}>{hero.titre}</h3>
            <p className={s.featureDeck}>{excerptOf(hero, 260)}</p>

            <div className={s.steps} aria-label="Structure du guide">
              {["Comprendre", "Préparer", "Pratiquer", "Ancrer"].map((step) => (
                <span key={step} className={s.step}>
                  <CheckCircle2 className={s.stepIcon} aria-hidden="true" />
                  {step}
                </span>
              ))}
            </div>

            <span className={s.cardCta}>
              Lire le guide <ArrowRight className={s.ctaArrow} aria-hidden="true" />
            </span>
          </div>
        </Card>

        <div className={s.guideRail}>
          <div className={s.railHead}>
            <span>Autres parcours</span>
            <span>{rest.length} guides</span>
          </div>

          {rest.map((guide, index) => (
            <Card
              key={guide._id}
              href={`/article/${guide.slug}`}
              variant="outlined"
              size="sm"
              className={s.railCard}
              style={coverStyle(guide, index)}
            >
              <div className={s.railVisual}>
                <img
                  src={sanityImg(guide.imageUrl, 420) || "/placeholder.svg"}
                  alt={guide.titre}
                  className={s.railImg}
                  loading="lazy"
                />
              </div>
              <div className={s.railBody}>
                <GuideMeta guide={guide} />
                <h3 className={s.railTitle}>{guide.titre}</h3>
                <p className={s.railDeck}>{excerptOf(guide, 150)}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
