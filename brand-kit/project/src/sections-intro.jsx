// Sections 1-3: Hero, Manifesto, Mission

const ACCENT_FONTS = [
  { key: 'fraunces',  label: 'Fraunces Italic 600',          family: "'Fraunces', serif",           weight: 600, size: 1.0  },
  { key: 'dmserif',   label: 'DM Serif Display Italic',      family: "'DM Serif Display', serif",   weight: 400, size: 1.05 },
  { key: 'playfair',  label: 'Playfair Display Italic 900',  family: "'Playfair Display', serif",   weight: 900, size: 1.0  },
  { key: 'bodoni',    label: 'Bodoni Moda Italic 900',       family: "'Bodoni Moda', serif",        weight: 900, size: 1.0  },
  { key: 'cormorant', label: 'Cormorant Italic (fine)',      family: "'Cormorant Garamond', serif", weight: 500, size: 1.15 },
  { key: 'archivo',   label: 'Archivo Italic (même famille)',family: "'Archivo', sans-serif",       weight: 800, size: 1.0, italic: true },
];

function SectionHero() {
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const [fontIdx, setFontIdx] = useState(() => {
    const saved = localStorage.getItem('origines-hero-font');
    return saved ? ACCENT_FONTS.findIndex(f => f.key === saved) : 0;
  });
  const accent = ACCENT_FONTS[fontIdx < 0 ? 0 : fontIdx];
  const cycleFont = () => {
    const n = (fontIdx + 1) % ACCENT_FONTS.length;
    setFontIdx(n);
    localStorage.setItem('origines-hero-font', ACCENT_FONTS[n].key);
  };
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    const m = requestAnimationFrame(() => setMounted(true));
    return () => { clearInterval(t); cancelAnimationFrame(m); };
  }, []);
  const timeStr = time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Europe/Paris' });

  // Animation primitives
  const rise = (delay = 0) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(14px)',
    filter: mounted ? 'blur(0)' : 'blur(6px)',
    transition: `opacity 1.1s cubic-bezier(.2,.7,.2,1) ${delay}ms, transform 1.1s cubic-bezier(.2,.7,.2,1) ${delay}ms, filter 1.1s cubic-bezier(.2,.7,.2,1) ${delay}ms`,
  });
  const fade = (delay = 0) => ({
    opacity: mounted ? 1 : 0,
    transition: `opacity 1.4s ease ${delay}ms`,
  });

  return (
    <section data-screen-label="01 Hero" style={{
      background: '#0A0A0A', color: '#F7F5F0',
      minHeight: '100vh', padding: '32px 48px 48px',
      display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Ambient glow */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(circle at 20% 30%, rgba(247,245,240,0.04) 0%, transparent 55%)',
        ...fade(200),
      }} />

      {/* Top bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
        letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.75,
        ...fade(100), opacity: mounted ? 0.75 : 0,
      }}>
        <span>Origines — Brand & Design System</span>
        <span>V 1.0 / Avril 2026</span>
        <span>Paris {timeStr}</span>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: 48, maxWidth: 1200, position: 'relative' }}>
        <div style={{ marginBottom: 56, ...rise(200) }}>
          <img src="assets/logo-white.png" alt="Origines" style={{ width: 120, height: 120, display: 'block' }} />
        </div>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
          marginBottom: 28,
          ...rise(400), opacity: mounted ? 0.6 : 0,
        }}>
          Brand Bible · Design System · Éditorial Guidelines
        </div>
        <h1 style={{
          fontFamily: "'Archivo', sans-serif",
          fontWeight: 900,
          fontSize: 'clamp(84px, 11vw, 200px)',
          lineHeight: 0.86,
          letterSpacing: '-0.045em',
          margin: 0,
        }}>
          <span style={{ display: 'inline-block', ...rise(550) }}>Chercher</span>{' '}
          <span style={{
            fontStyle: accent.italic === false ? 'normal' : 'italic',
            fontFamily: accent.family,
            fontWeight: accent.weight,
            letterSpacing: '-0.02em',
            fontSize: `${accent.size}em`,
            display: 'inline-block', ...rise(800),
          }}>
            l'origine
          </span><br/>
          <span style={{ display: 'inline-block', ...rise(1000) }}>des choses.</span>
        </h1>
        <button
          onClick={cycleFont}
          title="Changer la police d'accent"
          style={{
            position: 'absolute', top: 0, right: 0,
            background: 'transparent', border: '1px solid rgba(247,245,240,0.2)',
            color: '#F7F5F0', padding: '10px 14px', cursor: 'pointer',
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            opacity: mounted ? 0.7 : 0,
            transition: 'opacity 1s ease 1600ms, background 0.15s',
            maxWidth: 280,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(247,245,240,0.08)'; e.currentTarget.style.opacity = 1; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.opacity = 0.7; }}
        >
          ↻ Accent : {accent.label}
        </button>
        {/* Underline that draws in */}
        <div style={{
          marginTop: 18, height: 1, background: '#F7F5F0',
          width: mounted ? '120px' : '0px', opacity: 0.45,
          transition: 'width 1.6s cubic-bezier(.2,.7,.2,1) 1200ms',
        }} />
        <div style={{ marginTop: 48, maxWidth: 560, ...rise(1300) }}>
          <p style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 19, lineHeight: 1.5, margin: 0, opacity: 0.8,
          }}>
            Ce document est le socle opérationnel d'Origines. Il définit qui nous sommes, comment nous parlons, et comment nous fabriquons nos récits — articles, vidéos, séries, réseaux sociaux. À destination de l'équipe éditoriale et des contributeurs externes.
          </p>
        </div>
      </div>

      {/* Bottom nav */}
      <nav style={{
        display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 16,
        borderTop: '1px solid rgba(247,245,240,0.15)', paddingTop: 20, marginTop: 64,
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
        letterSpacing: '0.12em', textTransform: 'uppercase',
      }}>
        {[
          ['01', 'Manifeste'],
          ['02', 'Logo'],
          ['03', 'Couleurs'],
          ['04', 'Typo'],
          ['05', 'Composants'],
          ['06', 'Éditorial'],
          ['07', 'Social'],
        ].map(([n, t]) => (
          <a key={n} href={`#ch${n}`} style={{
            color: '#F7F5F0', textDecoration: 'none', opacity: 0.7,
            display: 'flex', justifyContent: 'space-between',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = 1}
          onMouseLeave={e => e.currentTarget.style.opacity = 0.7}>
            <span>{n}</span>
            <span>{t}</span>
            <span>↓</span>
          </a>
        ))}
      </nav>
    </section>
  );
}

function SectionManifesto() {
  return (
    <Section id="ch01" bg="paper" chapter={{ number: 1, title: 'Manifeste' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 64 }}>
        <div>
          <Eyebrow>Pourquoi Origines existe</Eyebrow>
          <div style={{ marginTop: 24 }}>
            <Placeholder ratio="3/4" label="portrait fondateur" caption="Fig. 02 — Équipe Origines, Paris 2026" />
          </div>
        </div>
        <div>
          <Display size="3xl" style={{ marginBottom: 48 }}>
            On ne comprend rien à ce qu'on vit si on ne remonte pas à la source.
          </Display>

          <div style={{ columns: 2, columnGap: 48, fontFamily: "'Inter Tight', sans-serif", fontSize: 17, lineHeight: 1.6 }}>
            <p style={{ marginTop: 0 }}>
              Origines est un média français de récits long-format. On enquête sur ce qui fonde nos vies : notre psyché, nos familles, nos carrières, nos spiritualités, nos corps, nos sociétés.
            </p>
            <p>
              On ne fait pas de l'information chaude. On remonte les rivières. On prend le temps de comprendre pourquoi un phénomène existe, comment il s'est installé, et ce qu'il dit de nous.
            </p>
            <p>
              Chaque récit est traité avec la rigueur d'un journaliste et l'écoute d'un ami. Nos formats — article, vidéo, série, podcast — ne sont que des chemins différents vers la même exigence : éclairer sans simplifier, émouvoir sans manipuler.
            </p>
            <p style={{ marginBottom: 0 }}>
              Ce document est la boussole qui garde cette promesse alignée à travers toute l'équipe, tous les formats, toutes les plateformes.
            </p>
          </div>

          <div style={{ marginTop: 64, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              ['Remonter', 'Chercher la racine, pas l\'anecdote. Le contexte, pas la réaction.'],
              ['Raconter', 'Une histoire, toujours. Un humain au centre, toujours.'],
              ['Relier', 'Donner au lecteur les outils pour comprendre sa propre vie.'],
            ].map(([t, d]) => (
              <div key={t} style={{ borderTop: '2px solid #0A0A0A', paddingTop: 16 }}>
                <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 28, letterSpacing: '-0.02em' }}>{t}</div>
                <Body size="base" style={{ marginTop: 8, opacity: 0.75 }}>{d}</Body>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

function SectionValues() {
  const pairs = [
    ['Curieux', 'Pas arrogant'],
    ['Rigoureux', 'Pas froid'],
    ['Accessible', 'Pas simpliste'],
    ['Intime', 'Pas impudique'],
    ['Engagé', 'Pas militant'],
    ['Beau', 'Pas décoratif'],
  ];
  return (
    <Section id="ch01b" bg="ink">
      <Eyebrow style={{ color: '#F7F5F0' }}>Nous sommes / nous ne sommes pas</Eyebrow>
      <Display size="2xl" style={{ marginTop: 24, color: '#F7F5F0', maxWidth: 900 }}>
        Un ton se définit autant par ce qu'il refuse que par ce qu'il affirme.
      </Display>
      <div style={{
        marginTop: 72,
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px',
        background: 'rgba(247,245,240,0.15)', border: '1px solid rgba(247,245,240,0.15)',
      }}>
        {pairs.map(([pos, neg], i) => (
          <div key={i} style={{ background: '#0A0A0A', padding: '40px 32px', color: '#F7F5F0' }}>
            <div style={{
              fontFamily: "'Archivo', sans-serif", fontWeight: 900,
              fontSize: 44, letterSpacing: '-0.03em', lineHeight: 1,
            }}>
              {pos}
            </div>
            <div style={{
              fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontWeight: 600,
              fontSize: 22, marginTop: 12, opacity: 0.55,
              textDecoration: 'line-through', textDecorationColor: '#E67839',
              textDecorationThickness: 2,
            }}>
              {neg}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

Object.assign(window, { SectionHero, SectionManifesto, SectionValues });
