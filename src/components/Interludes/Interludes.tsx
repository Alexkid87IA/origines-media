import s from "./Interludes.module.css";
import DailyPoll from "./DailyPoll";

interface Author {
  initials: string;
  name: string;
  role: string;
  articles: number;
  color: string;
  href: string;
}

const REDACTION: Author[] = [
  { initials: "CD", name: "Camille Dufresne", role: "Reporter terrain", articles: 42, color: "#E67839", href: "/auteur/camille-dufresne" },
  { initials: "ER", name: "Émilie Roux", role: "Plume portrait", articles: 28, color: "#7B5CD6", href: "/auteur/emilie-roux" },
  { initials: "LM", name: "Léo Marchand", role: "Enquêtes société", articles: 31, color: "#3E7DD6", href: "/auteur/leo-marchand" },
  { initials: "MA", name: "Mathilde Aubry", role: "Essayiste", articles: 19, color: "#C99B1E", href: "/auteur/mathilde-aubry" },
  { initials: "JS", name: "Julien Serres", role: "Critique & recos", articles: 57, color: "#2E94B5", href: "/auteur/julien-serres" },
];

interface Day {
  label: string;
  num: number;
  format: string;
  title: string;
  status: string;
  color: string;
  href?: string;
  past?: boolean;
  today?: boolean;
  upcoming?: boolean;
}

const DAYS: Day[] = [
  { label: "Lun.", num: 21, format: "Immersion", title: "Six mois chez les Cissé.", status: "Publié", color: "#7B5CD6", past: true, href: "/immersion/six-mois-chez-les-cisse" },
  { label: "Mar.", num: 22, format: "Vidéo", title: "Le grand sommeil français.", status: "Publié", color: "#E67839", past: true, href: "/video/sommeil-enquete" },
  { label: "Mer.", num: 23, format: "Récit", title: "2 200 km à pied, seul.", status: "Publié", color: "#2E9B74", past: true, href: "/recit/2200-km-a-pied" },
  { label: "Jeu.", num: 24, format: "Collection", title: "Secrets professionnels.", status: "Aujourd'hui", color: "#3E7DD6", today: true, href: "/collection/secrets-professionnels" },
  { label: "Ven.", num: 25, format: "Essai", title: "Le silence est un luxe.", status: "Demain", color: "#5A66D6", upcoming: true },
  { label: "Sam.", num: 26, format: "Histoire", title: "La lettre jamais envoyée.", status: "À paraître", color: "#C99B1E", upcoming: true },
  { label: "Dim.", num: 27, format: "Newsletter", title: "L'édition du dimanche.", status: "7h", color: "#D64C90", upcoming: true },
];

export function Interlude1() {
  return (
    <div className={s.interlude}>
      <div className={s.half}>
        <div className={s.halfHead}>
          <span className={s.halfDot} aria-hidden="true" />
          <span className={s.halfLabel}>Les parutions de la semaine</span>
        </div>
        <h3 className={s.halfTitle}>
          Semaine du <em>21 au 27 avril</em>.
        </h3>
        <ol className={s.days}>
          {DAYS.map((d) => {
            const cls = `${s.day} ${d.today ? s.dayToday : ""} ${d.upcoming ? s.dayUpcoming : ""}`;
            const inner = (
              <>
                <span className={s.dayDate}>
                  <span className={s.dayLabel}>{d.label}</span>
                  <span className={s.dayNum}>{d.num}</span>
                </span>
                <span className={s.dayContent}>
                  <span className={s.dayFormat} style={{ color: d.upcoming ? undefined : d.color }}>{d.format}</span>
                  <span className={s.dayTitle}>{d.title}</span>
                </span>
                <span className={s.dayStatus}>{d.status}</span>
              </>
            );

            return (
              <li key={d.num} className={cls}>
                {d.href ? (
                  <a href={d.href} className={s.dayLink}>{inner}</a>
                ) : (
                  <div className={s.dayInner}>{inner}</div>
                )}
              </li>
            );
          })}
        </ol>
        <a href="/ensemble#calendrier" className={s.halfCta}>
          Calendrier complet
          <span aria-hidden="true">&rarr;</span>
        </a>
      </div>

      <div className={s.separator} aria-hidden="true" />

      <div className={s.half}>
        <div className={s.halfHead}>
          <span className={s.halfDot} aria-hidden="true" />
          <span className={s.halfLabel}>La question de la semaine</span>
        </div>
        <h3 className={s.halfTitle}>
          Peut-on vraiment <em>changer après 40 ans</em>&nbsp;?
        </h3>
        <p className={s.halfDesc}>
          3&nbsp;412 lecteurs ont répondu cette semaine. La réponse
          la plus partagée commence par &laquo;&nbsp;oui, mais&nbsp;&raquo;.
        </p>
        <div className={s.poll}>
          <div className={s.pollOption}>
            <span className={s.pollLabel}>Oui, profondément</span>
            <div className={s.pollBar}>
              <div className={s.pollFill} style={{ width: "38%", background: "#7B5CD6" }} />
            </div>
            <span className={s.pollPct} style={{ color: "#7B5CD6" }}>38%</span>
          </div>
          <div className={s.pollOption}>
            <span className={s.pollLabel}>Oui, mais autrement</span>
            <div className={s.pollBar}>
              <div className={s.pollFill} style={{ width: "44%", background: "#D64C90" }} />
            </div>
            <span className={s.pollPct} style={{ color: "#D64C90" }}>44%</span>
          </div>
          <div className={s.pollOption}>
            <span className={s.pollLabel}>Non, pas vraiment</span>
            <div className={s.pollBar}>
              <div className={s.pollFill} style={{ width: "18%", background: "#2E94B5" }} />
            </div>
            <span className={s.pollPct} style={{ color: "#2E94B5" }}>18%</span>
          </div>
        </div>
        <a href="/ensemble#question" className={s.halfCta}>
          Lire les réponses
          <span aria-hidden="true">&rarr;</span>
        </a>

        <DailyPoll />
      </div>
    </div>
  );
}

export function Interlude2() {
  return (
    <div className={s.interlude}>
      <div className={s.half}>
        <div className={s.halfHead}>
          <span className={s.halfDot} aria-hidden="true" />
          <span className={s.halfLabel}>Lettre du dimanche &middot; N&deg; 42</span>
        </div>
        <h3 className={s.halfTitle}>
          Ce qu&rsquo;on a failli <em>ne pas dire</em>.
        </h3>
        <blockquote className={s.quote}>
          <p className={s.quoteText}>
            Cette semaine, j&rsquo;ai failli ne pas écrire cette lettre.
            Et puis <em>on m&rsquo;a envoyé une histoire</em> &mdash; celle
            d&rsquo;une femme qui a passé dix ans à ranger ses propres
            mots dans une boîte, sans savoir qu&rsquo;on allait les lire.
          </p>
        </blockquote>
        <div className={s.signature}>
          <span className={s.signMono}>AQ</span>
          <span className={s.signInfo}>
            <strong>Alex Quilghini</strong>
            <span>Fondateur d&rsquo;Origines</span>
          </span>
        </div>
        <div className={s.halfCtaGroup}>
          <a href="/newsletter" className={s.halfCta}>
            Lire la lettre
            <span aria-hidden="true">&rarr;</span>
          </a>
          <span className={s.halfCtaSep} aria-hidden="true" />
          <a href="/newsletter" className={s.halfCta}>
            Toutes les lettres
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>

      <div className={s.separator} aria-hidden="true" />

      <div className={s.half}>
        <div className={s.halfHead}>
          <span className={s.halfDot} aria-hidden="true" />
          <span className={s.halfLabel}>Reco du jour</span>
        </div>
        <span className={s.recoCategory} style={{ color: "#7B5CD6" }}>Film</span>
        <h3 className={s.halfTitle}>
          L&rsquo;éloge de la <em>répétition</em>.
        </h3>
        <p className={s.halfDesc}>
          <strong>Perfect Days</strong> de Wim Wenders. Un nettoyeur de toilettes
          de Tokyo. Deux heures de presque rien. Un des films les plus doux
          qu&rsquo;on ait vus cette année.
        </p>
        <div className={s.recoMeta}>
          <span>Choisi par <strong>Émilie R.</strong></span>
          <span className={s.recoMetaSep}>&middot;</span>
          <span>2h 03</span>
          <span className={s.recoMetaSep}>&middot;</span>
          <span>2023</span>
        </div>
        <div className={s.halfCtaGroup}>
          <a href="/recommandations/film-perfect-days" className={s.halfCta}>
            Lire notre critique
            <span aria-hidden="true">&rarr;</span>
          </a>
          <span className={s.halfCtaSep} aria-hidden="true" />
          <a href="/recommandations" className={s.halfCta}>
            Toutes les recos
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export function Interlude3() {
  return (
    <div className={s.interlude}>
      <div className={s.half}>
        <div className={s.halfHead}>
          <span className={s.halfDot} aria-hidden="true" />
          <span className={s.halfLabel}>Édition du dimanche</span>
        </div>
        <h3 className={s.halfTitle}>
          Chaque dimanche, <em>une lettre.</em>
        </h3>
        <p className={s.halfDesc}>
          Le meilleur de la semaine, un édito personnel, et ce qu&rsquo;on
          a trouvé pour vous &mdash; en 5 minutes de lecture.
        </p>
        <form className={s.nlForm} action="/api/subscribe" method="POST">
          <input
            type="email"
            name="email"
            className={s.nlInput}
            placeholder="votre@email.com"
            aria-label="Adresse email"
            required
          />
          <button type="submit" className={s.nlBtn}>
            S&rsquo;inscrire
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </button>
        </form>
        <span className={s.nlTrust}>
          4&nbsp;827 lecteurs &middot; Gratuit &middot; Désinscription en 1 clic
        </span>
      </div>

      <div className={s.separator} aria-hidden="true" />

      <div className={s.half}>
        <div className={s.halfHead}>
          <span className={s.halfDot} aria-hidden="true" />
          <span className={s.halfLabel}>Origines en chiffres</span>
        </div>
        <div className={s.stats}>
          <div className={s.stat}>
            <span className={s.statNum}>412</span>
            <span className={s.statLabel}>histoires publiées</span>
          </div>
          <div className={s.stat}>
            <span className={s.statNum}>106</span>
            <span className={s.statLabel}>vidéos originales</span>
          </div>
          <div className={s.stat}>
            <span className={s.statNum}>186</span>
            <span className={s.statLabel}>recommandations</span>
          </div>
          <div className={s.stat}>
            <span className={s.statNum}>6</span>
            <span className={s.statLabel}>programmes vidéo</span>
          </div>
        </div>
        <a href="/a-propos" className={s.halfCta}>
          En savoir plus
          <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </div>
  );
}

export function Interlude4() {
  return (
    <div className={s.interlude}>
      <div className={s.half}>
        <div className={s.halfHead}>
          <span className={s.halfDot} aria-hidden="true" />
          <span className={s.halfLabel}>La rédaction &middot; 12 signatures</span>
        </div>
        <h3 className={s.halfTitle}>
          Ceux qui <em>écrivent</em> chaque jour.
        </h3>
        <div className={s.authors}>
          {REDACTION.map((a) => (
            <a
              key={a.initials}
              href={a.href}
              className={s.author}
              style={{ "--a-color": a.color } as React.CSSProperties}
            >
              <span className={s.authorMono}>{a.initials}</span>
              <span className={s.authorInfo}>
                <strong>{a.name}</strong>
                <span>{a.role} &middot; {a.articles} articles</span>
              </span>
            </a>
          ))}
        </div>
        <a href="/media" className={s.halfCta}>
          Toute la rédaction
          <span aria-hidden="true">&rarr;</span>
        </a>
      </div>

      <div className={s.separator} aria-hidden="true" />

      <div className={s.half}>
        <div className={s.halfHead}>
          <span className={s.halfDot} aria-hidden="true" />
          <span className={s.halfLabel}>Le mot de la semaine</span>
        </div>
        <span className={s.wordWeek}>S.17</span>
        <h3 className={s.wordTitle}>Résilience.</h3>
        <p className={s.wordPronounce}>/&thinsp;re.zi.ljɑ̃s&thinsp;/ &mdash; nom féminin</p>
        <blockquote className={s.wordDef}>
          <p>
            Capacité à absorber un choc, à se reconstruire après
            un événement traumatique. Par extension&nbsp;: l&rsquo;art de
            transformer la fracture en fondation.
          </p>
        </blockquote>
        <p className={s.halfDesc}>
          Cette semaine, <strong>7 articles</strong> explorent la résilience sous
          toutes ses formes&nbsp;: du corps qui guérit à la mémoire
          qui refuse d&rsquo;oublier.
        </p>
        <div className={s.wordTags}>
          <a href="/articles?tag=resilience" className={s.wordTag} style={{ "--t-color": "#7B5CD6" } as React.CSSProperties}>L&rsquo;Esprit</a>
          <a href="/articles?tag=resilience&u=corps" className={s.wordTag} style={{ "--t-color": "#2E9B74" } as React.CSSProperties}>Le Corps</a>
          <a href="/articles?tag=resilience&u=liens" className={s.wordTag} style={{ "--t-color": "#D64C90" } as React.CSSProperties}>Les Liens</a>
        </div>
        <a href="/articles" className={s.halfCta}>
          Explorer ce mot
          <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </div>
  );
}
