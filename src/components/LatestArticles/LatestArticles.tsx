import { useState, useEffect, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { sanityFetch } from "@/lib/sanity";
import { sanityImg } from "@/lib/sanityImage";
import { RT } from "@/lib/queries";
import { UNIVERS_MAP, type UniversId } from "@/data/univers";
import s from "./LatestArticles.module.css";

interface ArticleItem {
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
  datePublication?: string;
}

const QUERY = `
  *[_type == "production" && defined(image.asset) && coalesce(typeArticle, "article") != "video" && rubrique != "guides"] | order(datePublication desc) [0...5] {
    _id, titre, description, extrait, datePublication,
    "contenuTexte": array::join(contenu[_type == "block"][0...3].children[].text, " "),
    "slug": slug.current,
    "imageUrl": coalesce(image.asset->url, mainImage.asset->url),
    univpilar, ${RT},
    "authorName": author->name
  }
`;

function uLabel(id?: string) {
  return id ? UNIVERS_MAP[id as UniversId]?.label ?? null : null;
}

function uColor(id?: string) {
  return id ? UNIVERS_MAP[id as UniversId]?.color ?? "var(--stone500)" : "var(--stone500)";
}

function excerptOf(article: ArticleItem, max = 220) {
  const raw = article.extrait || article.description || article.contenuTexte || "";
  const clean = raw.replace(/\s+/g, " ").trim();

  if (!clean) {
    return "Un article Origines pour prendre le temps de comprendre ce qui nous traverse, ce qui nous relie et ce qui continue de nous transformer.";
  }

  if (clean.length <= max) return clean;

  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 120 ? lastSpace : max).trim()}...`;
}

function formatDate(value?: string) {
  if (!value) return null;

  try {
    return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" }).format(new Date(value));
  } catch {
    return null;
  }
}

function ArticleMeta({ article, compact = false }: { article: ArticleItem; compact?: boolean }) {
  const univers = uLabel(article.univpilar);
  const date = formatDate(article.datePublication);
  const parts = [
    date,
    article.tempsLecture ? `${article.tempsLecture} min` : null,
    compact ? null : article.authorName,
  ].filter(Boolean);

  return (
    <div className={s.metaLine}>
      {univers && (
        <span className={s.univers} style={{ "--accent": uColor(article.univpilar) } as CSSProperties}>
          <span className={s.universDot} />
          {univers}
        </span>
      )}
      {parts.length > 0 && (
        <span className={s.metaText}>{parts.join(" / ")}</span>
      )}
    </div>
  );
}

export default function LatestArticles() {
  const [items, setItems] = useState<ArticleItem[]>([]);

  useEffect(() => {
    sanityFetch<ArticleItem[]>(QUERY).then((d) => setItems(d || []));
  }, []);

  if (!items.length) return null;

  const hero = items[0];
  const rest = items.slice(1, 5);

  return (
    <section className={s.section} aria-labelledby="latest-articles-title">
      <div className={s.chapterMark}>
        <span className={s.cNum}>Ch.02</span>
        <span className={s.cSep}>/</span>
        <span className={s.cLabel}>Derniers articles</span>
        <Link to="/articles" className={s.seeAll}>
          Tous les articles <ArrowRight className={s.arrow} aria-hidden="true" />
        </Link>
      </div>

      <header className={s.editorialHeader}>
        <div className={s.headerCopy}>
          <span className={s.sectionKicker}>À lire maintenant</span>
          <h2 id="latest-articles-title" className={s.sectionTitle}>
            Des idées qui restent après la lecture.
          </h2>
        </div>
        <p className={s.sectionDeck}>
          Une sélection de récits, d'analyses et de pistes concrètes pour comprendre ce qui nous construit.
        </p>
      </header>

      <div className={s.featureGrid}>
        <Card href={`/article/${hero.slug}`} variant="outlined" size="sm" className={s.heroCard}>
          <div className={s.heroVisual}>
            <img
              src={sanityImg(hero.imageUrl, 1000) || "/placeholder.svg"}
              alt={hero.titre}
              className={s.heroImg}
              loading="lazy"
            />
            <span className={s.heroNumber}>01</span>
          </div>

          <div className={s.heroBody}>
            <ArticleMeta article={hero} />
            <h3 className={s.heroTitle}>{hero.titre}</h3>
            <p className={s.heroExcerpt}>{excerptOf(hero, 260)}</p>
            <div className={s.heroFooter}>
              <span>{hero.authorName || "Origines Media"}</span>
              <span className={s.readMore}>
                Lire l'article <ArrowRight className={s.readMoreIcon} aria-hidden="true" />
              </span>
            </div>
          </div>
        </Card>

        <div className={s.storyStack}>
          <div className={s.stackHead}>
            <span>Le fil</span>
            <span>{rest.length} lectures</span>
          </div>

          {rest.map((article, index) => (
            <Card
              key={article._id}
              href={`/article/${article.slug}`}
              variant="outlined"
              size="sm"
              className={s.storyCard}
              style={{ "--i": index, "--accent": uColor(article.univpilar) } as CSSProperties}
            >
              <span className={s.storyNumber}>{String(index + 2).padStart(2, "0")}</span>
              <div className={s.storyCopy}>
                <ArticleMeta article={article} compact />
                <h3 className={s.storyTitle}>{article.titre}</h3>
                <p className={s.storyExcerpt}>{excerptOf(article, 150)}</p>
              </div>
              <div className={s.storyVisual}>
                <img
                  src={sanityImg(article.imageUrl, 360) || "/placeholder.svg"}
                  alt={article.titre}
                  className={s.storyImg}
                  loading="lazy"
                />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
