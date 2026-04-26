// Sections: Colors & Typography

const CATS = [
  { key: 'psychologie',  label: 'Psychologie',     hex: '#7B5CD6', dark: '#4A2FA8', light: '#A78BE8' },
  { key: 'societe',      label: 'Société',         hex: '#E67839', dark: '#B04E15', light: '#F5A878' },
  { key: 'famille',      label: 'Famille',         hex: '#C99B1E', dark: '#8A6700', light: '#E8C872' },
  { key: 'voyage',       label: 'Voyage',          hex: '#2E9B74', dark: '#0A6848', light: '#6FC9A6' },
  { key: 'spiritualite', label: 'Spiritualité',    hex: '#5A66D6', dark: '#2A34A0', light: '#9098E8' },
  { key: 'carriere',     label: 'Carrière',        hex: '#3E7DD6', dark: '#1A4FA0', light: '#7AA8E8' },
  { key: 'art',          label: 'Art & Créativité',hex: '#D64C90', dark: '#A01A5F', light: '#E88AB8' },
  { key: 'sante',        label: 'Santé',           hex: '#5AA352', dark: '#2A6F22', light: '#8FD088' },
  { key: 'tech',         label: 'Tech',            hex: '#2E94B5', dark: '#0A6383', light: '#6FC5DE' },
  { key: 'business',     label: 'Business',        hex: '#1EA0A3', dark: '#006D70', light: '#5FCED0' },
];

function SectionColors() {
  return (
    <Section id="ch03" bg="paper" chapter={{ number: 3, title: 'Couleurs' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, marginBottom: 80 }}>
        <Display size="2xl">
          Le noir et le blanc sont la marque.<br/>La couleur sert à catégoriser.
        </Display>
        <Body size="md" style={{ opacity: 0.8, paddingTop: 12 }}>
          Une règle simple : aucune couleur ne raconte, elles servent à orienter le lecteur. L'encre d'Origines est noire sur papier cassé ; c'est à partir de ce socle que dix couleurs de catégorie — harmonisées en oklch pour cohabiter — signalent un territoire éditorial. Jamais d'usage décoratif gratuit.
        </Body>
      </div>

      {/* Core palette */}
      <Rule label="01 — Couleurs fondatrices" />
      <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, background: '#E8E5DE', border: '1px solid #E8E5DE' }}>
        <Swatch name="Encre" hex="#0A0A0A" usage="Texte, logo, fond sombre" fg="#F7F5F0" />
        <Swatch name="Papier" hex="#F7F5F0" usage="Fond principal" fg="#0A0A0A" />
        <Swatch name="Pur" hex="#FFFFFF" usage="Cartes, surfaces" fg="#0A0A0A" />
        <Swatch name="Ombre" hex="#1A1A1A" usage="Dark-mode" fg="#F7F5F0" />
      </div>

      {/* Grays */}
      <div style={{ marginTop: 56 }}>
        <Rule label="02 — Échelle neutres" />
        <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 2, background: '#E8E5DE', border: '1px solid #E8E5DE' }}>
          {[
            ['Stone 900', '#141414'],
            ['Stone 700', '#3A3A3A'],
            ['Stone 500', '#6B6B6B'],
            ['Stone 300', '#B8B6AF'],
            ['Stone 100', '#E8E5DE'],
            ['Stone 50',  '#F0EDE6'],
          ].map(([n, h], i) => (
            <Swatch key={n} name={n} hex={h} fg={i < 3 ? '#F7F5F0' : '#0A0A0A'} small />
          ))}
        </div>
      </div>

      {/* Category colors */}
      <div style={{ marginTop: 80 }}>
        <Rule label="03 — Couleurs catégorie (oklch harmonisé)" />
        <Body size="sm" style={{ opacity: 0.7, marginTop: 16, maxWidth: 620 }}>
          Chaque couleur existe en trois teintes : Light pour les fonds et pastilles, Mid pour les accents et boutons, Dark pour le texte et la lisibilité sur papier. Le Mid est la teinte signature affichée dans le menu et les vignettes.
        </Body>
        <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 2, background: '#E8E5DE', border: '1px solid #E8E5DE' }}>
          {CATS.map(c => (
            <CategorySwatch key={c.key} cat={c} />
          ))}
        </div>
      </div>

      {/* Usage examples */}
      <div style={{ marginTop: 80 }}>
        <Rule label="04 — Usages typiques" />
        <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          <UsageCard title="Pastille de catégorie" cat={CATS[0]}>
            <CategoryPill cat={CATS[0]} />
          </UsageCard>
          <UsageCard title="Bouton primaire" cat={CATS[1]}>
            <button style={{
              background: CATS[1].hex, color: '#FFF',
              border: 'none', borderRadius: 999, padding: '12px 20px',
              fontFamily: "'Inter Tight', sans-serif", fontSize: 15, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>▸ Lire l'histoire →</button>
          </UsageCard>
          <UsageCard title="Lien de cat. (sur blanc)" cat={CATS[3]}>
            <span style={{
              fontFamily: "'Inter Tight', sans-serif", fontSize: 14, fontWeight: 600,
              color: CATS[3].dark, letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>{CATS[3].label.toUpperCase()}</span>
          </UsageCard>
        </div>
      </div>
    </Section>
  );
}

function Swatch({ name, hex, usage, fg, small }) {
  return (
    <div style={{
      background: hex, color: fg,
      padding: small ? '32px 20px' : '48px 28px',
      aspectRatio: small ? '1' : '1.3',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    }}>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
        letterSpacing: '0.12em', textTransform: 'uppercase',
      }}>{hex}</div>
      <div>
        <div style={{
          fontFamily: "'Archivo', sans-serif", fontWeight: 900,
          fontSize: small ? 18 : 28, letterSpacing: '-0.02em',
        }}>{name}</div>
        {usage && <div style={{
          fontFamily: "'Inter Tight', sans-serif", fontSize: 12,
          marginTop: 6, opacity: 0.7,
        }}>{usage}</div>}
      </div>
    </div>
  );
}

function CategorySwatch({ cat }) {
  return (
    <div style={{ background: '#F7F5F0', padding: 24 }}>
      <div style={{ display: 'flex', gap: 0, marginBottom: 16 }}>
        <div style={{ flex: 1, aspectRatio: '1', background: cat.light }} />
        <div style={{ flex: 1, aspectRatio: '1', background: cat.hex }} />
        <div style={{ flex: 1, aspectRatio: '1', background: cat.dark }} />
      </div>
      <div style={{
        fontFamily: "'Archivo', sans-serif", fontWeight: 900,
        fontSize: 18, letterSpacing: '-0.01em', marginBottom: 8,
      }}>{cat.label}</div>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5,
        letterSpacing: '0.08em', lineHeight: 1.7, opacity: 0.65,
      }}>
        <div>L {cat.light}</div>
        <div>M {cat.hex}</div>
        <div>D {cat.dark}</div>
      </div>
    </div>
  );
}

function UsageCard({ title, cat, children }) {
  return (
    <div>
      <Eyebrow style={{ marginBottom: 16 }}>{title}</Eyebrow>
      <div style={{
        background: '#FFFFFF', border: '1px solid #E8E5DE',
        padding: '48px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: 160,
      }}>
        {children}
      </div>
    </div>
  );
}

function CategoryPill({ cat }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      background: cat.hex, color: '#FFF',
      padding: '8px 16px', borderRadius: 999,
      fontFamily: "'Inter Tight', sans-serif", fontSize: 12, fontWeight: 600,
      letterSpacing: '0.08em', textTransform: 'uppercase',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FFF', opacity: 0.9 }} />
      {cat.label}
    </div>
  );
}

function SectionTypo() {
  return (
    <Section id="ch04" bg="pure" chapter={{ number: 4, title: 'Typographie' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, marginBottom: 72 }}>
        <Display size="2xl">
          Trois polices.<br/>
          <span style={{ fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontWeight: 600, fontWeight: 600 }}>Pas une de plus.</span>
        </Display>
        <Body size="md" style={{ opacity: 0.8, paddingTop: 12 }}>
          Archivo pour les titres (géométrique bold, en écho direct au logo). Inter Tight pour le corps et l'interface (neutre, lisible, moderne). JetBrains Mono pour les métadonnées, ancrages et marqueurs techniques. Fraunces intervient en accent italique rare pour les citations et les mots qui chantent.
        </Body>
      </div>

      {/* Archivo showcase */}
      <TypeSample
        family="Archivo"
        role="Titres & affichage"
        fontFamily="'Archivo', sans-serif"
        weights={['Black 900', 'Bold 700', 'Medium 500', 'Regular 400']}
        sample="Origines — chercher l'origine des choses."
        specs={[['Usage', 'Titres, hero, section heads, vignettes'], ['Graisses', '400, 500, 700, 900'], ['Tracking', '-0.03em sur display / -0.02em sur h2-h4'], ['Line-height', '0.88 à 1.05 selon taille']]}
      />

      {/* Inter Tight */}
      <TypeSample
        family="Inter Tight"
        role="Corps de texte & interface"
        fontFamily="'Inter Tight', sans-serif"
        weights={['Semibold 600', 'Medium 500', 'Regular 400']}
        sample="On ne comprend rien à ce qu'on vit si on ne remonte pas à la source."
        sampleSize={32}
        specs={[['Usage', 'Paragraphes, nav, boutons, métadonnées UI'], ['Graisses', '400, 500, 600'], ['Tracking', '0 (défaut)'], ['Line-height', '1.55 pour corps / 1.3 pour UI']]}
      />

      {/* JetBrains Mono */}
      <TypeSample
        family="JetBrains Mono"
        role="Métadonnées & ancrages"
        fontFamily="'JetBrains Mono', monospace"
        weights={['Regular 400']}
        sample="CH.03 / PSYCHOLOGIE — LECTURE 12 MIN"
        sampleSize={22}
        specs={[['Usage', 'Eyebrows, fig., timestamps, tags système'], ['Graisses', '400'], ['Tracking', '+0.12em à +0.20em'], ['Case', 'Toujours majuscules pour ancrages']]}
      />

      {/* Fraunces */}
      <TypeSample
        family="Fraunces"
        role="Accent éditorial"
        fontFamily="'Fraunces', serif"
        weights={['Italic 400']}
        sample="L'origine d'une chose n'est jamais un point — c'est toujours une rivière."
        sampleSize={36}
        italic
        specs={[['Usage', 'Pull quotes, drop caps, mots-clés italiques dans titres'], ['Graisses', '400 italic uniquement'], ['Tracking', '0'], ['Règle', 'Maximum 1 usage par page']]}
      />

      {/* Scale */}
      <div style={{ marginTop: 96 }}>
        <Rule label="Échelle typographique" />
        <div style={{ marginTop: 32, display: 'grid', gap: 0, borderTop: '1px solid #E8E5DE' }}>
          {[
            ['Display XL', 128, 900, "Archivo", 'Hero'],
            ['Display L', 88, 900, "Archivo", 'Section opener'],
            ['H1', 64, 900, "Archivo", 'Titre article long'],
            ['H2', 48, 800, "Archivo", 'Section'],
            ['H3', 32, 700, "Archivo", 'Sub-section'],
            ['H4', 24, 700, "Inter Tight", 'Card title'],
            ['Body L', 21, 400, "Inter Tight", 'Chapo, intro'],
            ['Body M', 17, 400, "Inter Tight", 'Corps standard'],
            ['Body S', 14, 400, "Inter Tight", 'Métadonnées, captions'],
            ['Mono', 11, 400, "JetBrains Mono", 'Eyebrows, ancrages'],
          ].map(([label, size, weight, fam, usage]) => (
            <div key={label} style={{
              display: 'grid', gridTemplateColumns: '140px 80px 1fr 1fr',
              alignItems: 'baseline',
              padding: '20px 0', borderBottom: '1px solid #E8E5DE',
              gap: 24,
            }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.7,
              }}>{label}</div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                letterSpacing: '0.08em', opacity: 0.5,
              }}>{size}/{weight}</div>
              <div style={{
                fontFamily: `'${fam}', sans-serif`, fontWeight: weight,
                fontSize: Math.min(size, 64),
                letterSpacing: size > 40 ? '-0.03em' : 0,
                lineHeight: 1,
              }}>
                Aa Éé
              </div>
              <div style={{
                fontFamily: "'Inter Tight', sans-serif", fontSize: 13, opacity: 0.7,
              }}>{usage}</div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function TypeSample({ family, role, fontFamily, weights, sample, sampleSize = 72, italic, specs }) {
  return (
    <div style={{
      marginBottom: 72,
      display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 48,
      borderTop: '2px solid #0A0A0A', paddingTop: 32,
    }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 32 }}>
          <div style={{
            fontFamily, fontWeight: 900,
            fontSize: 56, letterSpacing: '-0.02em',
            fontStyle: italic ? 'italic' : 'normal',
          }}>{family}</div>
          <Eyebrow>{role}</Eyebrow>
        </div>
        <div style={{
          fontFamily, fontSize: sampleSize, lineHeight: 1.05,
          letterSpacing: sampleSize > 40 ? '-0.03em' : '-0.01em',
          fontWeight: sampleSize > 40 ? 900 : 400,
          fontStyle: italic ? 'italic' : 'normal',
          textWrap: 'balance',
        }}>
          {sample}
        </div>
      </div>
      <div style={{ paddingTop: 12 }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
          letterSpacing: '0.08em', lineHeight: 2, opacity: 0.7,
        }}>
          {weights.map(w => <div key={w}>▸ {w}</div>)}
        </div>
        <div style={{ marginTop: 24, borderTop: '1px solid #E8E5DE' }}>
          {specs.map(([k, v]) => (
            <div key={k} style={{ padding: '10px 0', borderBottom: '1px solid #E8E5DE' }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.5,
              }}>{k}</div>
              <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 13, marginTop: 2 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.CATS = CATS;
Object.assign(window, { SectionColors, SectionTypo, CategoryPill });
