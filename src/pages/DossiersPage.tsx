import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import SEO from "@/components/SEO";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2";
import { useSanityQuery } from "@/hooks/useSanityQuery";
import { V2_DOSSIERS_QUERY } from "@/lib/queries";
import { UNIVERS, UNIVERS_MAP, type UniversId } from "@/data/univers";
import s from "./DossiersPage.module.css";

interface SanityDossier {
  question: string;
  semaine: number;
  annee: number;
  univpilar?: string;
  slug?: string;
  articleCount?: number;
  isActive?: boolean;
  chapeau?: string;
}

const MOCK_DOSSIERS: SanityDossier[] = [
  { question: "Pourquoi dort-on si mal ?", semaine: 17, annee: 2026, univpilar: "corps", slug: "pourquoi-dort-on-si-mal", articleCount: 6, isActive: true, chapeau: "Le sommeil se dégrade partout. On a voulu comprendre ce qui cloche — et ce qu’on peut y faire." },
  { question: "Peut-on vraiment changer après 40 ans ?", semaine: 16, annee: 2026, univpilar: "esprit", slug: "changer-apres-40-ans", articleCount: 7, chapeau: "Neurosciences, témoignages et psychologie du changement tardif." },
  { question: "Faut-il couper les ponts avec sa famille ?", semaine: 15, annee: 2026, univpilar: "liens", slug: "couper-les-ponts-famille", articleCount: 7, chapeau: "Quand la distance devient la seule façon de se protéger." },
  { question: "L’IA va-t-elle nous rendre plus seuls ?", semaine: 14, annee: 2026, univpilar: "avenir", slug: "ia-solitude", articleCount: 5, chapeau: "Assistants, chatbots, compagnons virtuels : enquête sur une promesse ambigüë." },
  { question: "Pourquoi a-t-on peur du silence ?", semaine: 13, annee: 2026, univpilar: "esprit", slug: "peur-du-silence", articleCount: 7, chapeau: "On le fuit, on le remplit, on l’évite. Sept jours pour réapprendre à l’écouter." },
  { question: "Voyager seul, est-ce égoïste ?", semaine: 12, annee: 2026, univpilar: "monde", slug: "voyager-seul-egoiste", articleCount: 7, chapeau: "Entre liberté et culpabilité, récits de ceux qui sont partis seuls." },
  { question: "Faut-il arrêter de vouloir être heureux ?", semaine: 11, annee: 2026, univpilar: "esprit", slug: "arreter-vouloir-etre-heureux", articleCount: 7, chapeau: "L’injonction au bonheur rend-elle malheureux ? La philosophie et les neurosciences répondent." },
  { question: "Nos enfants mangeront-ils encore de la viande ?", semaine: 10, annee: 2026, univpilar: "corps", slug: "enfants-viande", articleCount: 7, chapeau: "Éthique, santé, planète : la question alimentaire de demain." },
  { question: "Comment vivre avec quelqu’un qu’on ne comprend plus ?", semaine: 9, annee: 2026, univpilar: "liens", slug: "vivre-incomprehension", articleCount: 7, chapeau: "Couples, parents, amis : quand le dialogue semble impossible." },
  { question: "Le télétravail a-t-il tué le collectif ?", semaine: 8, annee: 2026, univpilar: "avenir", slug: "teletravail-collectif", articleCount: 7, chapeau: "Trois ans après la généralisation, bilan d’un modèle contesté." },
];

type SortMode = "recent" | "popular" | "alpha";
const SORT_LABELS: Record<SortMode, string> = {
  recent: "Récents",
  popular: "Populaires",
  alpha: "A – Z",
};

const PAGE_SIZE = 6;

function getUniversInfo(uid?: string) {
  if (uid && uid in UNIVERS_MAP) return UNIVERS_MAP[uid as UniversId];
  return UNIVERS_MAP.esprit;
}

function weekToDate(semaine: number, annee: number): string {
  const jan4 = new Date(annee, 0, 4);
  const dayOfWeek = jan4.getDay() || 7;
  const monday = new Date(jan4);
  monday.setDate(jan4.getDate() - dayOfWeek + 1 + (semaine - 1) * 7);
  return monday.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export default function DossiersPage() {
  const { data: cmsDossiers } = useSanityQuery<SanityDossier[]>(
    "v2-dossiers",
    V2_DOSSIERS_QUERY
  );

  const cmsSlugs = new Set((cmsDossiers || []).map((d) => d.slug));
  const fillerMocks = MOCK_DOSSIERS.filter((m) => !cmsSlugs.has(m.slug));
  const rawDossiers = [...(cmsDossiers || []), ...fillerMocks];

  const [filter, setFilter] = useState<"all" | UniversId>("all");
  const [sort, setSort] = useState<SortMode>("recent");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    let list = rawDossiers;
    if (filter !== "all") list = list.filter((d) => d.univpilar === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (d) => d.question.toLowerCase().includes(q) || (d.chapeau || "").toLowerCase().includes(q)
      );
    }
    if (sort === "recent") list = [...list].sort((a, b) => b.annee * 100 + b.semaine - (a.annee * 100 + a.semaine));
    else if (sort === "popular") list = [...list].sort((a, b) => (b.articleCount || 0) - (a.articleCount || 0));
    else list = [...list].sort((a, b) => a.question.localeCompare(b.question, "fr"));
    return list;
  }, [rawDossiers, filter, sort, search]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const activeDossier = rawDossiers.find((d) => d.isActive);

  const schemaLD = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Dossiers thématiques — Origines Media",
    description: "Chaque semaine, une question explorée en 7 articles publiés en 7 jours.",
    url: "https://www.origines.media/dossiers",
    publisher: { "@type": "Organization", name: "Origines Media", url: "https://www.origines.media" },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.origines.media/" },
        { "@type": "ListItem", position: 2, name: "Dossiers", item: "https://www.origines.media/dossiers" },
      ],
    },
  };

  return (
    <div className={s.page}>
      <SEO
        title="Dossiers — Une question, sept jours, sept articles"
        description={
          activeDossier
            ? `Dossier en cours : « ${activeDossier.question} ». Chaque semaine, une question explorée en 7 articles.`
            : "Chaque semaine, une question. 7 jours, 7 articles, un dossier complet. Les dossiers thématiques d’Origines Media."
        }
        url="/dossiers"
        breadcrumbs={[
          { name: 'Accueil', url: '/' },
          { name: 'Dossiers', url: '/dossiers' },
        ]}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schemaLD)}</script>
      </Helmet>
      <SiteHeader />

      <div className={s.container}>
        <header className={s.header}>
          <div className={`${s.chapterMark} mono`}>
            <span className={s.cNum}>Dossiers</span>
            <span className={s.cSep}>/</span>
            <span className={s.cLabel}>Questions de la semaine</span>
          </div>
          <div className={s.headerInner}>
            <span className={s.kicker}>
              <span className={s.kickerDot} aria-hidden="true" />
              Dossiers th&eacute;matiques
            </span>
            <h1 className={s.title}>
              Une question, <em>sept jours</em> pour y r&eacute;pondre.
            </h1>
            <p className={s.deck}>
              Chaque semaine, la r&eacute;daction choisit une grande question
              et publie un article par jour pendant sept jours &mdash; toujours
              &agrave; la m&ecirc;me heure. Psychologie, soci&eacute;t&eacute;,
              t&eacute;moignages, science&nbsp;: chaque angle &eacute;claire un
              peu plus la r&eacute;ponse.
            </p>
            <div className={s.howIt}>
              <div className={s.howItStep}>
                <span className={s.howItNum}>01</span>
                <span className={s.howItText}>Une question pos&eacute;e le lundi</span>
              </div>
              <span className={s.howItSep} aria-hidden="true" />
              <div className={s.howItStep}>
                <span className={s.howItNum}>02</span>
                <span className={s.howItText}>7 articles publi&eacute;s en 7 jours</span>
              </div>
              <span className={s.howItSep} aria-hidden="true" />
              <div className={s.howItStep}>
                <span className={s.howItNum}>03</span>
                <span className={s.howItText}>Un dossier complet &agrave; relire</span>
              </div>
            </div>
          </div>
        </header>

        {/* ── Toolbar: search + filters + sort ── */}
        <div className={s.toolbar}>
          <div className={s.searchWrap}>
            <svg className={s.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M16 16l5 5" />
            </svg>
            <input
              type="text"
              className={s.searchInput}
              placeholder="Rechercher une question…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setVisibleCount(PAGE_SIZE); }}
            />
          </div>

          <div className={s.filtersRow}>
            <div className={s.filters}>
              <button
                type="button"
                className={`${s.filterBtn} ${filter === "all" ? s.filterActive : ""}`}
                onClick={() => { setFilter("all"); setVisibleCount(PAGE_SIZE); }}
              >
                Tous
              </button>
              {UNIVERS.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  className={`${s.filterBtn} ${filter === u.id ? s.filterActive : ""}`}
                  style={{ "--f-color": u.color } as React.CSSProperties}
                  onClick={() => { setFilter(u.id); setVisibleCount(PAGE_SIZE); }}
                >
                  <span className={s.filterDot} aria-hidden="true" />
                  {u.name}
                </button>
              ))}
            </div>

            <div className={s.sortWrap}>
              {(Object.keys(SORT_LABELS) as SortMode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`${s.sortBtn} ${sort === m ? s.sortActive : ""}`}
                  onClick={() => setSort(m)}
                >
                  {SORT_LABELS[m]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Counter ── */}
        <div className={s.counter}>
          {filtered.length} dossier{filtered.length > 1 ? "s" : ""}
          {filter !== "all" && <> &middot; {getUniversInfo(filter).name}</>}
        </div>

        {/* ── Card list ── */}
        <div className={s.list} role="list">
          {visible.map((d) => {
            const u = getUniversInfo(d.univpilar);
            const dateLabel = weekToDate(d.semaine, d.annee);
            return (
              <article key={d.slug} className={s.cardWrap} role="listitem">
                <a
                  href={`/dossiers/${d.slug || ""}`}
                  className={s.card}
                  data-week={String(d.semaine)}
                  style={{ "--accent": u.color } as React.CSSProperties}
                >
                  <span className={s.cardAccent} aria-hidden="true" />
                  <div className={s.cardBody}>
                    <span className={s.cardMeta}>
                      <span className={s.cardUniv} style={{ background: u.color }}>
                        {u.name}
                      </span>
                      <span>Semaine {d.semaine} &middot; {d.annee}</span>
                      {d.isActive && (
                        <span className={s.cardActive}>
                          <span className={s.cardActiveDot} aria-hidden="true" />
                          En cours
                        </span>
                      )}
                    </span>
                    <h2 className={s.cardQuestion}>{d.question}</h2>
                    {d.chapeau && <p className={s.cardChapeau}>{d.chapeau}</p>}
                    <span className={s.cardFoot}>
                      <span className={s.cardInfo}>
                        <span className={s.cardDate}>{dateLabel}</span>
                        <span className={s.cardSep}>&middot;</span>
                        <span className={s.cardCount}>{d.articleCount || 0}/7 articles</span>
                        {d.isActive && (
                          <span className={s.cardProgress}>
                            {Array.from({ length: 7 }, (_, i) => (
                              <span
                                key={i}
                                className={`${s.cardDot} ${i < (d.articleCount || 0) ? s.cardDotFilled : ""}`}
                                style={i < (d.articleCount || 0) ? { background: u.color } : undefined}
                              />
                            ))}
                          </span>
                        )}
                      </span>
                      <span className={s.cardCta}>
                        {d.isActive ? "Suivre le dossier" : "Lire le dossier"}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                          <path d="M5 12h14M13 5l7 7-7 7" />
                        </svg>
                      </span>
                    </span>
                  </div>
                </a>
              </article>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className={s.empty}>
            Aucun dossier trouv&eacute;.
          </div>
        )}

        {hasMore && (
          <div className={s.loadMore}>
            <button
              type="button"
              className={s.loadMoreBtn}
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            >
              Voir plus ({filtered.length - visibleCount} restants)
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <Footer2 />
    </div>
  );
}
